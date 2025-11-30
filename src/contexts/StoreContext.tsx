


import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType, SearchResultSample, Thesis, LogicHealth } from '../types';
import { ALL_STOCKS, getInitialData } from '../data/stockData';
import { generateChartData } from '../utils/chartUtils';
import { updateThesisHealth } from '../utils/logicUtils';

export { ALL_STOCKS };

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- SYNC LOGIC ---
const syncHoldingsToThesis = (currentData: AppData): Thesis[] => {
  const { user, myThesis } = currentData;
  const allHoldings = [...user.holdings.domestic, ...user.holdings.overseas];
  
  // Start with existing thesis list to preserve any manually added ones
  const updatedThesisList = [...myThesis];

  allHoldings.forEach(holding => {
    // 1. Deduplication: Check if thesis already exists for this ticker
    const existingIndex = updatedThesisList.findIndex(t => t.ticker === holding.ticker);

    if (existingIndex >= 0) {
      // If exists, ensure it is marked as Invested (syncing asset status)
      if (updatedThesisList[existingIndex].status !== 'Invested') {
        updatedThesisList[existingIndex] = {
          ...updatedThesisList[existingIndex],
          status: 'Invested'
        };
      }
    } else {
      // 2. Creation: Create new Thesis if not found
      // Try to find rich data from ALL_STOCKS to populate narrative/watchpoints
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
        id: Date.now() + Math.floor(Math.random() * 100000), 
        ticker: holding.ticker,
        name: holding.name,
        currentPrice: finalPrice,
        changeRate: changeRate,
        status: 'Invested',
        
        // CRITICAL: Populate Narrative & Watchpoints from Rich Data
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
        // Legacy cleanup: Set to empty
        logicBlocks: [],
        
        companyProfile: richData?.companyProfile || { summary: "정보 없음", description: "" },
        events: richData?.events || [],
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
    // 1. Deduplication Check
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    
    if (existingThesis) {
        // If it exists but was 'Watching', and now user 'Invests', update status
        if (existingThesis.status !== 'Invested' && investmentType === 'Invested') {
           const updated: Thesis = { ...existingThesis, status: 'Invested' };
           setData(prev => ({
             ...prev,
             myThesis: prev.myThesis.map(t => t.id === existingThesis.id ? updated : t)
           }));
           return updated;
        }
        // Return existing if no status change needed
        return existingThesis;
    }

    // 2. Generate Dummy Charts (since sample data might lack full history)
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
        
        // Populate Narrative & Watchpoints from Stock Data
        narrative: stock.narrative || {
            summary: stock.companyProfile.summary,
            whyNow: "",
            floor: "",
            upside: "",
            debate: [],
            theBet: "가설 수립 필요"
        },
        watchpoints: stock.watchpoints || [],
        logicHealth: {
            score: 50, // Neutral start
            status: 'Warning',
            history: []
        },
        
        // Clear Legacy
        logicBlocks: [],
        
        companyProfile: stock.companyProfile,
        events: stock.events || [], 
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

    // 4. Update State with Notification
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
                stockId: newThesis.id,
                ticker: newThesis.ticker // For deep linking
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
                  myActionHistory: {
                      decision,
                      date: 'Today'
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
