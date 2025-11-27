
import React, { useState } from 'react';
import { Search, ChevronRight, TrendingUp, History } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import LogicDetailModal from './LogicDetailModal';

interface DiscoveryTabProps {
  onStartBuilder: () => void;
}

const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ onStartBuilder }) => {
  const { data } = useStore();
  const { trendingLogics, recentSearches } = data.discovery;
  const [selectedLogic, setSelectedLogic] = useState<any | null>(null);

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'blue': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'gold': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'orange': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      default: return 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-[120px] bg-app-bg">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 border-b border-white/5">
        <h1 className="text-3xl font-extrabold text-white mb-1">발견</h1>
        <p className="text-app-text-secondary text-base">새로운 투자 기회와 시나리오</p>
      </header>

      <div className="p-6 space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={22} className="text-zinc-500" />
          </div>
          <input 
            type="text" 
            placeholder="기업, 키워드 검색"
            className="w-full bg-[#1E1E1E] text-white pl-12 pr-4 py-5 rounded-2xl border border-white/5 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent text-lg placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* Recent Search (Restored) */}
        {recentSearches.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-4">
               <History size={20} className="text-zinc-400" />
               <h2 className="text-lg font-bold text-zinc-300">최근 검색</h2>
            </div>
            
            <div className="flex space-x-3 overflow-x-auto no-scrollbar">
              {recentSearches.map((item) => (
                <div 
                  key={item.id} 
                  onClick={onStartBuilder}
                  className="flex-shrink-0 bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 flex items-center space-x-3 min-w-[200px] active:bg-white/5 transition-colors cursor-pointer"
                >
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-black">G</span>
                   </div>
                   <div className="flex-1">
                      <div className="text-base font-bold text-white leading-tight">{item.ticker}</div>
                      <div className="text-xs text-zinc-500">{item.name}</div>
                   </div>
                   <ChevronRight size={18} className="text-zinc-600" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Scenarios List */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp size={24} className="text-app-accent" />
            <h2 className="text-2xl font-bold text-white">주목할 시나리오</h2>
          </div>

          <div className="space-y-5">
            {trendingLogics.map((logic: any) => (
              <div 
                key={logic.rank} 
                onClick={() => setSelectedLogic(logic)}
                className="bg-[#1E1E1E] p-6 rounded-[28px] border border-white/5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden group hover:border-white/10"
              >
                {/* Top Badge Row */}
                <div className="flex justify-between items-start mb-3 relative z-10">
                   <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getThemeColor(logic.theme)}`}>
                      {logic.badge}
                   </div>
                   <div className="text-4xl font-black text-white/5 absolute right-0 top-0 -mt-2 -mr-2 group-hover:text-white/10 transition-colors">
                      {logic.rank}
                   </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{logic.title}</h3>
                  <p className="text-base text-zinc-400 font-medium mb-4">{logic.subtitle}</p>
                  
                  <div className="h-[1px] w-full bg-white/5 mb-4" />
                  
                  <div className="flex justify-between items-center">
                     <div className="flex -space-x-2">
                        {logic.relatedStocksDetails?.map((stock: any, i: number) => (
                          <div key={i} className="px-3 py-1 bg-black rounded-lg border border-zinc-700 text-xs text-zinc-300 font-bold z-0">
                            {stock.ticker}
                          </div>
                        ))}
                     </div>
                     <div className="flex items-center text-sm font-bold text-app-accent group-hover:translate-x-1 transition-transform">
                        상세 분석 <ChevronRight size={16} />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Logic Detail Modal */}
      {selectedLogic && (
        <LogicDetailModal 
          logic={selectedLogic} 
          onClose={() => setSelectedLogic(null)} 
          onStockClick={onStartBuilder}
        />
      )}
    </div>
  );
};

export default DiscoveryTab;
