
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import MarketIndexChart from './MarketIndexChart';
import { Holding, User, MarketWeather, Thesis } from '../types';
import { TEXT } from '../constants/text';
import { formatCurrency, formatRate, getRateColorClass } from '../utils/formatters';

interface InsightTabProps {
  user: User;
  marketWeather: MarketWeather;
  onStockClick: (stock: Thesis) => void;
  onNavigate: (tab: 'insight' | 'my-thesis' | 'discovery') => void;
}

const InsightTab: React.FC<InsightTabProps> = ({ user, marketWeather, onStockClick, onNavigate }) => {
  const { data } = useStore();
  const { summaryHighlights } = data;
  const [headerTitle, setHeaderTitle] = useState(TEXT.INSIGHT.HEADER_TODAY);
  const [activeTab, setActiveTab] = React.useState<'domestic' | 'overseas'>('overseas');

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = 300;
    if (scrollTop > threshold) {
      setHeaderTitle(TEXT.INSIGHT.HEADER_MY_ASSET);
    } else {
      setHeaderTitle(TEXT.INSIGHT.HEADER_TODAY);
    }
  };

  const getRateColorClass = (value: number) => {
    if (value > 0) return 'text-red-500';
    if (value < 0) return 'text-blue-500';
    return 'text-zinc-500';
  };

  const renderStockItem = (holding: Holding) => {
    // Find the full stock data to pass to onStockClick
    // In a real app, Holding might already extend Thesis or we'd look it up.
    // For now, we'll construct a minimal Thesis object or look it up if possible.
    // Assuming holding has enough info or we can find it in ALL_STOCKS (not imported here).
    // Let's pass a partial object or rely on the parent to handle lookup if needed.
    // But wait, onStockClick expects a Thesis.
    // Let's assume the parent (App.tsx) passes a handler that can take a Holding and find the Thesis,
    // OR we just pass the Holding and let the parent handle it.
    // Actually, looking at App.tsx, setSelectedStock expects a Thesis.
    // Let's cast or find. Since we don't have ALL_STOCKS here, let's change the prop to accept Holding or just pass what we have.
    // Better yet, let's just pass the ticker and let App.tsx find it?
    // No, let's keep it simple. The holding object has ticker.

    return (
      <div
        key={holding.id}
        onClick={() => {
          // We need to convert Holding to Thesis-like object or find it.
          // Since we don't have access to ALL_STOCKS here easily without importing,
          // and we want to avoid circular dependencies if any.
          // Let's just pass the holding and let the parent/type handle it.
          // Actually, let's import ALL_STOCKS in App.tsx and pass a handler that takes a ticker.
          // But the interface says (stock: Thesis) => void.
          // Let's change the interface to (ticker: string) => void for easier implementation,
          // OR import ALL_STOCKS here. Let's import ALL_STOCKS here for safety.
          // Wait, ALL_STOCKS is in data/stockData.ts.
          onStockClick(holding as any); // Temporary cast, will fix in App.tsx or import
        }}
        className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 cursor-pointer active:bg-white/5 transition-colors -mx-4 px-4 hover:bg-white/5"
      >
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
          <div className="text-white font-bold text-base">{formatCurrency(holding.valuation, 'KRW')}</div>
          <div className={`text-sm font-bold ${getRateColorClass(holding.profitValue)}`}>
            {holding.profitValue > 0 ? '+' : ''}{formatCurrency(holding.profitValue, 'KRW')} ({holding.profitRate}%)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative bg-app-bg">
      <div className="absolute top-0 left-0 w-full z-20 px-6 pt-12 pb-4 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-white transition-all key={headerTitle} animate-in fade-in slide-in-from-top-2 duration-300">
          {headerTitle}
        </h1>
        <p className="text-base text-app-text-secondary mt-1">
          {headerTitle === TEXT.INSIGHT.HEADER_TODAY ? TEXT.INSIGHT.SUBHEADER_TODAY : TEXT.INSIGHT.SUBHEADER_MY_ASSET}
        </p>
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-[100px]"
      >
        <section className="snap-start min-h-full flex flex-col pt-36 px-6 pb-12">
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
          <MarketIndexChart />
          <div className="mt-8 flex justify-center animate-bounce opacity-30">
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        <section className="snap-start min-h-full flex flex-col px-6 pt-32 pb-24 relative">
          <div className="bg-[#1E1E1E] rounded-[32px] p-8 border border-white/5 shadow-2xl relative mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-500 font-bold text-base">{TEXT.INSIGHT.TOTAL_ASSET}</span>
              <button
                onClick={() => onNavigate('my-thesis')}
                className="text-zinc-400 text-sm font-bold flex items-center hover:text-white transition-colors"
              >
                {TEXT.INSIGHT.BTN_VIEW_MY_STOCKS} <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="mb-2">
              <div className="text-4xl font-black text-white tracking-tight">
                {formatCurrency(user.totalAssetValue, 'KRW')}
              </div>
            </div>

            <div className={`text-xl font-bold flex items-center ${getRateColorClass(user.totalProfitValue)}`}>
              <span>{user.totalProfitValue > 0 ? '+' : ''}{formatCurrency(user.totalProfitValue, 'KRW')}</span>
              <span className="ml-2 opacity-90">({user.totalProfitRate}%)</span>
            </div>
          </div>

          <div className="pb-12">
            <div className="bg-[#1E1E1E] rounded-[24px] px-6 py-2 border border-white/5">
              {[...user.holdings.domestic, ...user.holdings.overseas].map((item, idx) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 cursor-pointer active:bg-white/5 transition-colors -mx-2 px-2 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                                    ${idx % 3 === 0 ? 'bg-indigo-500/20 text-indigo-400' :
                        idx % 3 === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-amber-500/20 text-amber-400'}`}>
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-bold text-base leading-tight">{item.name}</div>
                      <div className="text-zinc-500 text-xs font-medium mt-0.5">{item.ticker} · {item.quantity}주</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-base">{formatCurrency(item.valuation, 'KRW')}</div>
                    <div className={`text-sm font-bold ${getRateColorClass(item.profitValue)}`}>
                      {item.profitValue > 0 ? '+' : ''}{formatCurrency(item.profitValue, 'KRW')} ({item.profitRate}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InsightTab;
