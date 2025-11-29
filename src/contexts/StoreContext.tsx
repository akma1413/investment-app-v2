
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType, SearchResultSample, Thesis } from '../types';
import { ALL_STOCKS, getInitialData } from '../data/stockData';
import { generateChartData } from '../utils/chartUtils';

export { ALL_STOCKS };

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData());

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
        return existingThesis;
    }

    // 1. Create Logic Blocks from selected IDs
    const selectedLogicBlocks = stock.availableLogicBlocks.filter(l => 
        selectedLogicIds.includes(Number(l.id))
    ).map(l => ({ ...l, isActive: true }));

    // 2. Generate Dummy Charts using Utility
    const trend = stock.changeRate > 0 ? 'up' : 'down';
    const chartHistory = {
        '1D': generateChartData(stock.currentPrice, 24, trend),
        '1W': generateChartData(stock.currentPrice, 20, 'volatile'),
        '1M': generateChartData(stock.currentPrice * 0.95, 30, trend),
        '3M': generateChartData(stock.currentPrice * 0.9, 45, trend),
        '1Y': generateChartData(stock.currentPrice * 0.8, 60, trend),
        '5Y': generateChartData(stock.currentPrice * 0.5, 60, 'up'),
    };

    // 3. Construct New Thesis Object
    const newThesis: Thesis = {
        id: Date.now(), 
        ticker: stock.ticker,
        name: stock.name,
        currentPrice: stock.currentPrice,
        changeRate: stock.changeRate,
        status: investmentType as 'Invested' | 'Watching',
        bigThesis: selectedLogicBlocks.length > 0 ? selectedLogicBlocks[0].title : "나만의 투자 가설",
        companyProfile: stock.companyProfile,
        logicBlocks: selectedLogicBlocks,
        quizData: stock.quizData,
        events: [],
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

  return (
    <StoreContext.Provider value={{ data, updateUserName, markNotificationAsRead, searchStocks, selectDiscoveryStock, addToMyThesis }}>
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
