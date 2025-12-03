
import React, { useState } from 'react';
import { Search, ChevronRight, TrendingUp, History, X } from 'lucide-react';
import { useStore, ALL_STOCKS } from '../contexts/StoreContext';
import LogicDetailModal from './LogicDetailModal';
import { SearchResultSample } from '../types';
import { TEXT } from '../constants/text';

interface DiscoveryTabProps {
    onStockClick: (stock: SearchResultSample) => void;
}

const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ onStockClick }) => {
    const { data, searchStocks } = useStore();
    const { trendingLogics, recentSearches, searchResults } = data.discovery;
    const [selectedLogic, setSelectedLogic] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        searchStocks(val);
    };

    const handleSearchClear = () => {
        setSearchQuery("");
        searchStocks("");
    };

    const handleStockClickInternal = (ticker: string) => {
        // Find full stock data
        let stock = ALL_STOCKS.find(s => s.ticker === ticker);

        // Fallback to search results if not in ALL_STOCKS (edge case safety)
        if (!stock) {
            stock = searchResults.find(s => s.ticker === ticker);
        }

        if (stock) {
            onStockClick(stock);
        } else {
            console.warn("Full stock data not found for ticker:", ticker);
        }
    };

    const getThemeColor = (theme: string) => {
        switch (theme) {
            case 'blue': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case 'gold': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
            case 'orange': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
            default: return 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
        }
    };

    const formatPrice = (price: number | string | undefined) => {
        if (price === undefined) return '';
        if (typeof price === 'string') return price;
        if (price > 1000) return price.toLocaleString('ko-KR') + TEXT.COMMON.CURRENCY_KRW;
        return TEXT.COMMON.CURRENCY_USD + price.toLocaleString();
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar pb-[120px] bg-app-bg">
            <header className="px-6 pt-12 pb-6 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 border-b border-white/5">
                <h1 className="text-3xl font-extrabold text-white mb-1">{TEXT.DISCOVERY.HEADER_TITLE}</h1>
                <p className="text-app-text-secondary text-base">{TEXT.DISCOVERY.HEADER_DESC}</p>
            </header>

            <div className="p-6">
                {/* Search Bar */}
                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-indigo-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="관심 종목을 검색하고 내 아이디어에 추가"
                        className="w-full bg-[#1E1E1E] text-white pl-12 pr-12 py-4 rounded-2xl border border-indigo-500/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-white placeholder:font-bold font-medium shadow-lg shadow-indigo-500/5"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchStocks(e.target.value);
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={handleSearchClear}
                            className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {searchQuery ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <h2 className="text-sm font-bold text-zinc-500 mb-4 px-1">검색 결과</h2>
                        {searchResults.length > 0 ? (
                            <div className="space-y-3">
                                {searchResults.map((stock) => (
                                    <div
                                        key={stock.ticker}
                                        onClick={() => handleStockClickInternal(stock.ticker)}
                                        className="flex items-center justify-between p-4 bg-[#1E1E1E] rounded-2xl border border-white/5 active:scale-[0.98] transition-all cursor-pointer hover:border-white/20"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-lg font-bold text-zinc-400">
                                                {stock.ticker.length > 4 ? stock.name[0] : stock.ticker[0]}
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-white">{stock.name}</div>
                                                <div className="text-sm text-zinc-500">{stock.ticker}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-white">{formatPrice(stock.currentPrice)}</div>
                                            <div className={`text-sm font-bold ${stock.changeRate && stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                                                {stock.changeRate && stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-zinc-500">
                                {TEXT.DISCOVERY.EMPTY_SEARCH}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="mb-16">
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <h3 className="text-sm font-bold text-zinc-500">최근 검색</h3>
                                    <button className="text-xs text-zinc-600 hover:text-zinc-400">지우기</button>
                                </div>
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                                    {recentSearches.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleStockClickInternal(item.ticker)}
                                            className="flex items-center px-4 py-3 bg-[#1E1E1E] rounded-2xl border border-white/5 whitespace-nowrap hover:bg-white/5 transition-colors min-w-[140px]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold mr-3 text-sm">
                                                {item.ticker[0]}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm text-white font-bold">{item.ticker}</div>
                                                <div className="text-xs text-zinc-500">{item.name}</div>
                                            </div>
                                            <ChevronRight size={16} className="ml-auto text-zinc-600" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trending Logics */}
                        <div className="mb-24">
                            <div className="flex items-center gap-2 mb-6 px-1">
                                <TrendingUp className="text-app-accent" size={20} />
                                <h2 className="text-xl font-bold text-white">주목할 시나리오</h2>
                            </div>

                            <div className="space-y-6">
                                {trendingLogics.map((logic) => {
                                    const themeColorClass = getThemeColor(logic.theme);

                                    return (
                                        <div
                                            key={logic.rank}
                                            onClick={() => setSelectedLogic(logic)}
                                            className="group bg-[#1E1E1E] rounded-[24px] p-6 border border-white/5 hover:border-indigo-500/30 transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden"
                                        >
                                            {/* Background Gradient */}
                                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${logic.theme === 'blue' ? 'from-blue-500/10' : logic.theme === 'gold' ? 'from-amber-500/10' : 'from-orange-500/10'} to-transparent rounded-bl-[100px] pointer-events-none`} />

                                            <div className="relative z-10">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${themeColorClass}`}>
                                                        {logic.badge}
                                                    </div>
                                                    <div className="text-zinc-500 font-bold text-4xl opacity-20">#{logic.rank}</div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-xl font-bold text-white mb-1 leading-tight">{logic.title}</h3>
                                                <p className="text-zinc-400 text-sm font-medium mb-4">{logic.subtitle}</p>

                                                {/* ETF Info (New) */}
                                                {logic.etfInfo && (
                                                    <div className="mb-5 bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                                        <div>
                                                            <div className="text-[10px] text-zinc-500 font-bold mb-0.5">대장주/ETF</div>
                                                            <div className="text-sm font-bold text-white">{logic.etfInfo.name}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-zinc-500 font-bold mb-0.5">현재가</div>
                                                            <div className="text-sm font-bold text-white">{logic.etfInfo.price}</div>
                                                        </div>
                                                        {/* Simple Sparkline Placeholder */}
                                                        <div className="w-16 h-8 flex items-end gap-0.5 opacity-50">
                                                            {logic.etfInfo.chartData.map((val, idx) => (
                                                                <div key={idx} className={`w-full bg-${logic.theme === 'blue' ? 'blue' : logic.theme === 'gold' ? 'amber' : 'orange'}-500`} style={{ height: `${(val / Math.max(...logic.etfInfo!.chartData)) * 100}%` }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Upside Scenario (New) */}
                                                {logic.upsideScenario && (
                                                    <div className="mb-5">
                                                        <div className="text-xs font-bold text-zinc-500 mb-1">{logic.upsideScenario.title}</div>
                                                        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">
                                                            {logic.upsideScenario.content}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Beneficiaries */}
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <div className="flex -space-x-2">
                                                        {logic.relatedStocksDetails.map((stock, idx) => (
                                                            <div key={idx} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#1E1E1E] flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                                {stock.name[0]}
                                                            </div>
                                                        ))}
                                                        {logic.relatedStocksDetails.length > 0 && (
                                                            <div className="pl-3 flex flex-col justify-center">
                                                                <span className="text-[10px] text-zinc-500 font-bold">관련주</span>
                                                                <span className="text-xs text-zinc-300 font-bold">
                                                                    {logic.relatedStocksDetails.map(s => s.name).join(', ')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center text-xs font-bold text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                                        더 알아보기 <ChevronRight size={14} className="ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {selectedLogic && (
                <LogicDetailModal
                    logic={selectedLogic}
                    onClose={() => setSelectedLogic(null)}
                    onStockClick={(ticker) => {
                        handleStockClickInternal(ticker);
                        setSelectedLogic(null);
                    }}
                />
            )}
        </div>
    );
};

export default DiscoveryTab;
