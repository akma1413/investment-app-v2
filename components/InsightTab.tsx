

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import MarketIndexChart from './MarketIndexChart';
import { Holding } from '../types';

interface InsightTabProps {
    onNavigate: (tab: 'insight' | 'my-thesis' | 'discovery') => void;
}

const InsightTab: React.FC<InsightTabProps> = ({ onNavigate }) => {
  const { data } = useStore();
  const { marketWeather, summaryHighlights, user } = data;
  const [headerTitle, setHeaderTitle] = useState("투데이");
  
  // Scroll Handler for Sticky Header Dynamic Title
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = 300; // Approx height of the first section content
    if (scrollTop > threshold) {
      setHeaderTitle("내 자산 현황");
    } else {
      setHeaderTitle("투데이");
    }
  };

  const formatKRW = (value: number) => {
    return value.toLocaleString('ko-KR') + '원';
  };

  // Helper to render a single stock list item
  const renderStockItem = (holding: Holding) => {
    const isPlus = holding.profitValue >= 0;
    return (
        <div key={holding.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 cursor-pointer active:bg-white/5 transition-colors -mx-4 px-4 hover:bg-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold shrink-0 text-sm">
                    {holding.name.length > 5 ? holding.ticker[0] : holding.name[0]}
                </div>
                <div>
                    <div className="text-white font-bold text-base leading-tight">{holding.name}</div>
                    <div className="text-zinc-500 text-xs font-medium mt-0.5">{holding.quantity}주</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-white font-bold text-base">{holding.valuation.toLocaleString()}원</div>
                <div className={`text-sm font-bold ${isPlus ? 'text-app-positive' : 'text-app-negative'}`}>
                    {isPlus ? '+' : ''}{holding.profitValue.toLocaleString()}원 ({holding.profitRate}%)
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative bg-app-bg">
      {/* 1. Dynamic Fixed Header */}
      <div className="absolute top-0 left-0 w-full z-20 px-6 pt-12 pb-4 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-white transition-all key={headerTitle} animate-in fade-in slide-in-from-top-2 duration-300">
          {headerTitle}
        </h1>
        <p className="text-base text-app-text-secondary mt-1">
          {headerTitle === "투데이" ? "오늘의 시장 날씨" : "나의 투자 성과 요약"}
        </p>
      </div>

      {/* 2. Scroll Container (Snap) */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-[100px]"
      >
        
        {/* Section 1: Market Weather & Chart */}
        <section className="snap-start min-h-full flex flex-col pt-36 px-6 pb-12">
          
          {/* Structured Text Summary */}
          <div className="mb-10 pl-5 border-l-4 border-app-accent">
            <h2 className="text-3xl font-bold text-white mb-3">{marketWeather.summaryTitle}</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {summaryHighlights.map((part: any, idx: number) => (
                <span key={idx} className={part.isBold ? "text-white font-bold" : ""}>
                  {part.text}
                </span>
              ))}
            </p>
          </div>

          {/* Modularized Chart Component */}
          <MarketIndexChart />
          
          <div className="mt-8 flex justify-center animate-bounce opacity-30">
             <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* Section 2: My Asset Summary & List */}
        <section className="snap-start min-h-full flex flex-col px-6 pt-32 pb-24 relative">
            
            {/* Total Asset Card */}
            <div className="bg-[#1E1E1E] rounded-[32px] p-8 border border-white/5 shadow-2xl relative mb-8">
                {/* Header Row */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-zinc-500 font-bold text-base">내 투자 현황</span>
                    <button 
                        onClick={() => onNavigate('my-thesis')}
                        className="text-zinc-400 text-sm font-bold flex items-center hover:text-white transition-colors"
                    >
                        내 종목 보기 <ChevronRight size={16} className="ml-1" />
                    </button>
                </div>

                {/* Total Asset Value */}
                <div className="mb-2">
                    <div className="text-4xl font-black text-white tracking-tight">
                        {formatKRW(user.totalAssetValue)}
                    </div>
                </div>

                {/* Profit Info */}
                <div className={`text-xl font-bold flex items-center ${user.totalProfitValue >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                    <span>{user.totalProfitValue > 0 ? '+' : ''}{formatKRW(user.totalProfitValue)}</span>
                    <span className="ml-2 opacity-90">({user.totalProfitRate}%)</span>
                </div>
            </div>

            {/* Portfolio List */}
            <div className="pb-12">
                {/* Domestic Stocks */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-zinc-500 mb-2 pl-1">국내주식</h3>
                    <div className="bg-[#1E1E1E] rounded-[24px] px-6 py-2 border border-white/5">
                        {user.holdings.domestic.map(item => renderStockItem(item))}
                    </div>
                </div>

                {/* Overseas Stocks */}
                <div>
                    <h3 className="text-sm font-bold text-zinc-500 mb-2 pl-1">해외주식</h3>
                    <div className="bg-[#1E1E1E] rounded-[24px] px-6 py-2 border border-white/5">
                         {user.holdings.overseas.map(item => renderStockItem(item))}
                    </div>
                </div>
            </div>

        </section>
      </div>
    </div>
  );
};

export default InsightTab;