import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType, SearchResultSample, Thesis } from '../types';
import { ALL_STOCKS, getInitialData } from '../data/stockData';
import { generateChartData } from '../utils/chartUtils';
import { updateThesisHealth } from '../utils/logicUtils';

export { ALL_STOCKS };

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- SYNC LOGIC (Deduplication) ---
const syncHoldingsToThesis = (currentData: AppData): Thesis[] => {
  const { user, myThesis } = currentData;
  const allHoldings = [...user.holdings.domestic, ...user.holdings.overseas];

  // Start with existing thesis list to preserve user edits
  let updatedThesisList = [...myThesis];

  allHoldings.forEach(holding => {
    // Check if ticker already exists
    const existingIndex = updatedThesisList.findIndex(t => t.ticker === holding.ticker);

    if (existingIndex >= 0) {
      // If exists, ensure status is 'Invested'
      if (updatedThesisList[existingIndex].status !== 'Invested') {
        updatedThesisList[existingIndex] = {
          ...updatedThesisList[existingIndex],
          status: 'Invested'
        };
      }
    } else {
      // If NEW, create from ALL_STOCKS rich data
      const richData = ALL_STOCKS.find(s => s.ticker === holding.ticker);

      const calculatedPrice = holding.quantity > 0 ? holding.valuation / holding.quantity : 0;
      const finalPrice = richData ? richData.currentPrice : calculatedPrice;
      const changeRate = richData ? richData.changeRate : 0;
      const trend = changeRate > 0 ? 'up' : 'down';

      const newThesis: Thesis = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        ticker: holding.ticker,
        name: holding.name,
        currentPrice: finalPrice,
        changeRate: changeRate,
        status: 'Invested',

        // Critical: Use rich data if available
        narrative: richData?.narrative || {
          question: "포트폴리오 자산",
          steps: {
            history: { title: "정보 없음", content: "데이터가 없습니다." },
            floor: { title: "정보 없음", content: "데이터가 없습니다." },
            upside: { title: "정보 없음", content: "데이터가 없습니다." },
            debate: { title: "정보 없음", question: "", bulls: [], bears: [] },
            final: { title: "정보 없음", content: "", options: [] }
          }
        },
        watchpoints: richData?.watchpoints || [],
        events: richData?.events || [], // Copy events!

        logicHealth: { score: 50, status: 'Warning', history: [] },
        logicBlocks: [], // Legacy empty

        companyProfile: richData?.companyProfile || { summary: "-", description: "-" },
        newsTags: [],
        dailyBriefing: "포트폴리오 연동 완료. 가설을 점검하세요.",

        chartHistory: {
          '1D': generateChartData(finalPrice, 24, trend),
          '1W': generateChartData(finalPrice, 20, 'volatile'),
          '1M': generateChartData(finalPrice * 0.95, 30, trend),
          '3M': generateChartData(finalPrice * 0.9, 45, trend),
          '1Y': generateChartData(finalPrice * 0.8, 60, trend),
          '5Y': generateChartData(finalPrice * 0.5, 60, 'up'),
        },
        chartNarratives: { '1D': '', '1W': '', '1M': '', '3M': '', '1Y': '', '5Y': '' }
      };

      updatedThesisList.push(newThesis);
    }
  });

  return updatedThesisList;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const initialData = getInitialData();
    const syncedThesis = syncHoldingsToThesis(initialData);
    return { ...initialData, myThesis: syncedThesis };
  });

  const updateUserName = (name: string) => {
    setData(prev => ({ ...prev, user: { ...prev.user, name } }));
  };

  const markNotificationAsRead = (id: number) => {
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) }));
  };

  const searchStocks = (query: string) => {
    if (!query.trim()) {
      setData(prev => ({ ...prev, discovery: { ...prev.discovery, searchResults: [] } }));
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = ALL_STOCKS.filter(stock =>
      stock.ticker.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
    setData(prev => ({ ...prev, discovery: { ...prev.discovery, searchResults: results } }));
  };

  const selectDiscoveryStock = (ticker: string) => {
    const stock = ALL_STOCKS.find(s => s.ticker === ticker);
    if (stock) {
      setData(prev => ({ ...prev, discovery: { ...prev.discovery, searchResultSample: stock } }));
    }
  };

  const addToMyThesis = (stock: SearchResultSample, selectedWatchpointIndices: number[], investmentType: string, amount?: string): Thesis => {
    // 1. Deduplication Check
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    if (existingThesis) {
      // If simply watching -> invested upgrade
      if (existingThesis.status !== 'Invested' && investmentType === 'Invested') {
        const updated = { ...existingThesis, status: 'Invested' as const };
        setData(prev => ({ ...prev, myThesis: prev.myThesis.map(t => t.id === existingThesis.id ? updated : t) }));
        return updated;
      }
      return existingThesis;
    }

    // 2. Create New Thesis
    const trend = stock.changeRate > 0 ? 'up' : 'down';
    const newThesis: Thesis = {
      id: Date.now(),
      ticker: stock.ticker,
      name: stock.name,
      currentPrice: stock.currentPrice,
      changeRate: stock.changeRate,
      status: investmentType as 'Invested' | 'Watching',

      // Copy Core Data
      narrative: stock.narrative,
      watchpoints: stock.watchpoints || [],
      events: stock.events || [],
      companyProfile: stock.companyProfile,

      logicHealth: { score: 50, status: 'Warning', history: [] },
      logicBlocks: [],

      newsTags: [],
      dailyBriefing: "신규 가설 등록 완료.",
      chartHistory: {
        '1D': generateChartData(stock.currentPrice, 24, trend),
        '1W': generateChartData(stock.currentPrice, 20, 'volatile'),
        '1M': generateChartData(stock.currentPrice * 0.95, 30, trend),
        '3M': generateChartData(stock.currentPrice * 0.9, 45, trend),
        '1Y': generateChartData(stock.currentPrice * 0.8, 60, trend),
        '5Y': generateChartData(stock.currentPrice * 0.5, 60, 'up'),
      },
      chartNarratives: { '1D': '', '1W': '', '1M': '', '3M': '', '1Y': '', '5Y': '' }
    };

    setData(prev => ({
      ...prev,
      myThesis: [newThesis, ...prev.myThesis],
      notifications: [
        {
          id: Date.now(),
          type: 'info',
          title: `${stock.name} 가설 등록 완료`,
          desc: '성공적으로 저장되었습니다.',
          timestamp: '방금 전',
          isRead: false,
          stockId: newThesis.id,
          ticker: newThesis.ticker
        },
        ...prev.notifications
      ]
    }));
    return newThesis;
  };

  const recordEventDecision = (thesisId: number, eventId: string, decision: 'buy' | 'hold' | 'sell') => {
    setData(prev => {
      const thesisIndex = prev.myThesis.findIndex(t => t.id === thesisId);
      if (thesisIndex === -1) return prev;

      const updatedThesis = { ...prev.myThesis[thesisIndex] };
      const eventIndex = updatedThesis.events.findIndex(e => e.id === eventId);

      if (eventIndex !== -1) {
        const updatedEvents = [...updatedThesis.events];
        // Update Event Status & History
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          status: 'Completed',
          myActionHistory: { decision, date: 'Today' }
        };
        updatedThesis.events = updatedEvents;
      }

      // Recalculate Score
      const healthResult = updateThesisHealth(updatedThesis);
      updatedThesis.logicHealth = healthResult.logicHealth;

      const newMyThesis = [...prev.myThesis];
      newMyThesis[thesisIndex] = updatedThesis;

      return { ...prev, myThesis: newMyThesis };
    });
  };

  return (
    <StoreContext.Provider value={{ data, updateUserName, markNotificationAsRead, searchStocks, selectDiscoveryStock, addToMyThesis, recordEventDecision }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};