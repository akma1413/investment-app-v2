

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType, SearchResultSample, Thesis } from '../types';
import { ALL_STOCKS, getInitialData } from '../data/stockData';
import { generateChartData } from '../utils/chartUtils';
import { updateThesisHealth } from '../utils/logicUtils';

export { ALL_STOCKS };

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- SYNC LOGIC ---
const syncHoldingsToThesis = (currentData: AppData): Thesis[] => {
  const { user, myThesis } = currentData;
  const allHoldings = [...user.holdings.domestic, ...user.holdings.overseas];
  
  const updatedThesisList = [...myThesis];

  allHoldings.forEach(holding => {
    const existingIndex = updatedThesisList.findIndex(t => t.ticker === holding.ticker);

    if (existingIndex >= 0) {
      if (updatedThesisList[existingIndex].status !== 'Invested') {
        updatedThesisList[existingIndex] = {
          ...updatedThesisList[existingIndex],
          status: 'Invested'
        };
      }
    } else {
      const richData = ALL_STOCKS.find(s => s.ticker === holding.ticker);
      
      const calculatedPrice = holding.quantity > 0 ? holding.valuation / holding.quantity : 0;
      const finalPrice = richData ? richData.currentPrice : calculatedPrice;
      const changeRate = richData ? richData.changeRate : 0;
      const trend = changeRate > 0 ? 'up' : 'down';

      const chartHistory = {
        '1D': generateChartData(finalPrice, 24, trend),
        '1W': generateChartData(finalPrice, 20, 'volatile'),
        '1M': generateChartData(finalPrice * 0.95, 30, trend),
        '3M': generateChartData(finalPrice * 0.9, 45, trend),
        '1Y': generateChartData(finalPrice * 0.8, 60, trend),
        '5Y': generateChartData(finalPrice * 0.5, 60, 'up'),
      };

      const newThesis: Thesis = {
        id: Date.now() + Math.floor(Math.random() * 10000), 
        ticker: holding.ticker,
        name: holding.name,
        currentPrice: finalPrice,
        changeRate: changeRate,
        status: 'Invested',
        
        narrative: richData?.narrative || {
            summary: "포트폴리오에서 연동된 자산입니다.",
            whyNow: "정보 없음",
            floor: "정보 없음",
            upside: "정보 없음",
            debate: [],
            theBet: "가설 수립 필요"
        },
        watchpoints: richData?.watchpoints || [],
        logicHealth: {
            score: 50,
            status: 'Warning', 
            history: []
        },
        logicBlocks: richData?.availableLogicBlocks || [],
        
        companyProfile: richData?.companyProfile || { summary: "정보 없음", description: "" },
        events: [],
        newsTags: [],
        dailyBriefing: "포트폴리오 자산이 연동되었습니다. 가설을 점검해주세요.",
        
        chartHistory: chartHistory,
        chartNarratives: {
            '1D': '', '1W': '', '1M': '', '3M': '', '1Y': '', '5Y': ''
        }
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
    return {
        ...initialData,
        myThesis: syncedThesis
    };
  });

  const updateUserName = (name: string) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, name }
    }));
  };

  const markNotificationAsRead = (id: number) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  const searchStocks = (query: string) => {
    if (!query.trim()) {
        setData(prev => ({
            ...prev,
            discovery: { ...prev.discovery, searchResults: [] }
        }));
        return;
    }

    const lowerQuery = query.toLowerCase();
    const results = ALL_STOCKS.filter(stock => 
        stock.ticker.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
    );

    setData(prev => ({
        ...prev,
        discovery: { ...prev.discovery, searchResults: results }
    }));
  };

  const selectDiscoveryStock = (ticker: string) => {
      const stock = ALL_STOCKS.find(s => s.ticker === ticker);
      if (stock) {
          setData(prev => ({
              ...prev,
              discovery: { ...prev.discovery, searchResultSample: stock }
          }));
      }
  };

  const addToMyThesis = (stock: SearchResultSample, selectedLogicIds: number[], investmentType: string, amount?: string): Thesis => {
    // 0. Safety Check: Deduplication
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    if (existingThesis) {
        if (existingThesis.status !== 'Invested' && investmentType === 'Invested') {
           const updated = { ...existingThesis, status: 'Invested' as const };
           setData(prev => ({
             ...prev,
             myThesis: prev.myThesis.map(t => t.id === existingThesis.id ? updated : t)
           }));
           return updated;
        }
        return existingThesis;
    }

    // 1. Create Logic Blocks (Legacy support)
    const selectedLogicBlocks = stock.availableLogicBlocks.filter(l => 
        selectedLogicIds.includes(Number(l.id))
    ).map(l => ({ ...l, isActive: true }));

    // 2. Generate Dummy Charts
    const trend = stock.changeRate > 0 ? 'up' : 'down';
    const chartHistory = {
        '1D': generateChartData(stock.currentPrice, 24, trend),
        '1W': generateChartData(stock.currentPrice, 20, 'volatile'),
        '1M': generateChartData(stock.currentPrice * 0.95, 30, trend),
        '3M': generateChartData(stock.currentPrice * 0.9, 45, trend),
        '1Y': generateChartData(stock.currentPrice * 0.8, 60, trend),
        '5Y': generateChartData(stock.currentPrice * 0.5, 60, 'up'),
    };

    // 3. Construct New Thesis
    const newThesis: Thesis = {
        id: Date.now(), 
        ticker: stock.ticker,
        name: stock.name,
        currentPrice: stock.currentPrice,
        changeRate: stock.changeRate,
        status: investmentType as 'Invested' | 'Watching',
        narrative: stock.narrative || {
            summary: selectedLogicBlocks[0]?.title || "나만의 투자 가설",
            whyNow: "",
            floor: "",
            upside: "",
            debate: [],
            theBet: ""
        },
        companyProfile: stock.companyProfile,
        logicBlocks: selectedLogicBlocks,
        watchpoints: stock.watchpoints || [],
        logicHealth: {
            score: 50, // Start neutral
            status: 'Warning',
            history: []
        },
        events: [], // Initially empty, in a real app these would come from backend
        newsTags: [],
        dailyBriefing: "새로운 투자 가설이 등록되었습니다. 시장의 변화를 면밀히 관찰하세요.",
        chartHistory: chartHistory,
        chartNarratives: {
            '1D': '가설 수립 후 모니터링 중입니다.',
            '1W': '변동성이 있지만 추세는 유효합니다.',
            '1M': '장기적인 관점에서 접근 중입니다.',
            '3M': '', '1Y': '', '5Y': ''
        }
    };

    // 4. Update State
    setData(prev => ({
        ...prev,
        myThesis: [newThesis, ...prev.myThesis],
        notifications: [
            {
                id: Date.now(),
                type: 'info',
                title: `${stock.name} 가설 등록 완료`,
                desc: '성공적으로 저장되었습니다. 아이디어 탭에서 확인하세요.',
                timestamp: '방금 전',
                isRead: false,
                stockId: newThesis.id
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
                  status: 'Completed', // Mark as handled
                  myActionHistory: {
                      decision,
                      date: 'Today' // Simplified date
                  }
              };
              updatedThesis.events = updatedEvents;
          }

          // Recalculate Logic Health Score based on new action history
          const healthResult = updateThesisHealth(updatedThesis);
          updatedThesis.logicHealth = healthResult.logicHealth;

          const newMyThesis = [...prev.myThesis];
          newMyThesis[thesisIndex] = updatedThesis;

          return {
              ...prev,
              myThesis: newMyThesis
          };
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
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};