
import React, { useState } from 'react';
import { X, TrendingUp, Activity, Calendar, Quote, ChevronDown, ChevronUp, AlertCircle, Eye, ArrowRight, CheckCircle2, AlertTriangle, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Thesis, TimeFrame, Event } from '../types';
import { useStore } from '../contexts/StoreContext';
import { NewsCard } from './stock-detail/NewsSection';
import { ImmersiveEventMode } from './event/ImmersiveEventMode';
import { EventTicket } from './event/EventTicket';
import WatchpointBuilder from './narrative/WatchpointBuilder';
import { TEXT } from '../constants/text';
import { formatCurrency, formatRate, getRateColorClass } from '../utils/formatters';
import { getChartCoordinates, getBezierPath } from '../utils/chartUtils';

interface StockDetailModalProps {
    stock: Thesis;
    onClose: () => void;
    isLearningMode?: boolean;
    onReturnToQuiz?: () => void;
    onAddLogic?: () => void;
}


const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose, isLearningMode = false, onReturnToQuiz, onAddLogic }) => {
    const { data, recordEventDecision } = useStore();
    const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);

    // Get latest stock data from store to ensure updates (like Event completion) are reflected
    const latestStock = data.myThesis.find(t => t.id === stock.id) || stock;
    // Interactive State
    const [showEventMode, setShowEventMode] = useState(false);
    const [showWatchpointBuilder, setShowWatchpointBuilder] = useState(false);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);

    // Debug logging
    console.log('StockDetailModal - showWatchpointBuilder:', showWatchpointBuilder);
    console.log('StockDetailModal - stock.watchpoints:', latestStock.watchpoints);

    const isInvested = data.myThesis.some(t => t.ticker === latestStock.ticker);

    // Find urgent/active event for Zone 1
    const urgentEvent = latestStock.events.find(e => e.status === 'Upcoming' || e.status === 'Active');

    // --- CHART LOGIC ---
    const chartPoints = latestStock.chartHistory[activeTimeFrame] || [];
    const chartNarrative = latestStock.chartNarratives[activeTimeFrame] || TEXT.STOCK_DETAIL.CHART_LOADING;
    const isPositive = chartPoints.length > 0 ? (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0 : latestStock.changeRate >= 0;
    const trendColor = isPositive ? '#F87171' : '#60A5FA';

    // Compact Chart Dimensions
    const svgWidth = 380;
    const svgHeight = 120; // Reduced height for Zone 2 context
    const padding = { top: 10, right: 40, bottom: 20, left: 0 };

    const { points: coords, min: minVal, max: maxVal, avgY } = getChartCoordinates(chartPoints, svgWidth, svgHeight, padding);
    const linePath = `M ${getBezierPath(coords)}`;

    // --- LOGIC HEALTH CALC ---
    const healthScore = stock.logicHealth?.score || 50;
    const getHealthColor = (score: number) => {
        if (score >= 70) return 'text-emerald-400 bg-emerald-500';
        if (score >= 30) return 'text-amber-400 bg-amber-500';
        return 'text-red-400 bg-red-500';
    };
    const healthColorClass = getHealthColor(healthScore);

    // Handlers
    const handleEventClick = (event: Event) => {
        setActiveEvent(event);
        setShowEventMode(true);
    };

    const handleWatchpointComplete = (selections: any[]) => {
        setShowWatchpointBuilder(false);
    };

    const handleEventComplete = (decision: 'buy' | 'hold' | 'sell') => {
        if (activeEvent) {
            recordEventDecision(stock.id, activeEvent.id, decision);
            setShowEventMode(false);
            setActiveEvent(null);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none ${isLearningMode ? 'z-[110]' : 'z-[100]'}`}>
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
                onClick={!isLearningMode ? onClose : undefined}
            />

            <div className="w-full max-w-[430px] h-[92vh] bg-[#121212] rounded-t-[32px] pointer-events-auto overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative border-t border-white/10 mx-auto">

                {/* --- HEADER --- */}
                <header className="flex justify-between items-center px-6 py-5 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <div className="text-xs font-bold text-zinc-500 mb-0.5">{stock.ticker}</div>
                        <h2 className="text-xl font-bold text-white">{stock.name}</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-white">{formatCurrency(stock.currentPrice, 'USD')}</div>
                        <div className={`text-sm font-bold ${getRateColorClass(stock.changeRate)}`}>
                            {formatRate(stock.changeRate)}
                        </div>
                    </div>
                    {!isLearningMode && (
                        <button onClick={onClose} className="ml-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400">
                            <X size={20} />
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">

                    {/* ZONE 1: ACTION TICKET (Integrated) */}
                    {isInvested && stock.events.filter(e => e.status !== 'Completed').length > 0 && (
                        <div className="mb-6 space-y-3">
                            {stock.events
                                .filter(e => e.status !== 'Completed')
                                .map(event => (
                                    <EventTicket
                                        key={event.id}
                                        event={event}
                                        onClick={() => handleEventClick(event)}
                                    />
                                ))
                            }
                        </div>
                    )}

                    {/* ZONE 2: CONTEXT ZONE (Chart) */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-zinc-500 flex items-center uppercase tracking-wider">
                                <Activity size={14} className="mr-1.5" />
                                Market Context
                            </h3>
                            <div className="flex bg-white/5 rounded-lg p-0.5">
                                {(['1D', '1W', '1M', '3M', '1Y'] as TimeFrame[]).map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setActiveTimeFrame(tf)}
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${activeTimeFrame === tf ? 'bg-zinc-700 text-white' : 'text-zinc-600'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compact Chart Container */}
                        <div className="w-full h-40 mb-3 bg-white/[0.02] rounded-xl border border-white/5 relative overflow-hidden">
                            {chartPoints.length > 0 ? (
                                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible opacity-80">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={trendColor} stopOpacity="0.2" />
                                            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <line x1={padding.left} y1={avgY} x2={svgWidth - padding.right} y2={avgY} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
                                    <path d={`${linePath} L ${svgWidth - padding.right},${svgHeight - padding.bottom} L ${padding.left},${svgHeight - padding.bottom} Z`} fill="url(#chartGrad)" />
                                    <path d={linePath} fill="none" stroke={trendColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                                    {/* Min/Max Labels */}
                                    <text x={svgWidth} y={padding.top + 6} className="text-[9px] fill-zinc-600 font-medium" textAnchor="end">
                                        {maxVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </text>
                                    <text x={svgWidth} y={svgHeight - padding.bottom} className="text-[9px] fill-zinc-600 font-medium" textAnchor="end">
                                        {minVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </text>
                                </svg>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                                    {TEXT.STOCK_DETAIL.CHART_LOADING}
                                </div>
                            )}
                        </div>
                        <div className="flex items-start space-x-2 text-xs text-zinc-500 px-1">
                            <TrendingUp size={12} className="shrink-0 mt-0.5" />
                            <span>{chartNarrative}</span>
                        </div>
                    </section>

                    {/* ZONE 3: LOGIC HEADQUARTERS (The Core) */}
                    {isInvested ? (
                        <section className="mb-10 animate-in slide-in-from-bottom duration-500 delay-100">

                            {/* Logic HQ Card */}
                            <div className="bg-[#1E1E1E] rounded-[28px] border border-zinc-700 shadow-xl overflow-hidden relative">
                                {/* Decorative Header Line */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80" />

                                <div className="p-6">
                                    {/* A. Narrative Summary */}
                                    <div className="mb-8 relative">
                                        <Quote size={40} className="absolute -top-4 -left-2 text-zinc-700/50" />
                                        <h3 className="relative z-10 text-xl font-black text-white leading-tight italic">
                                            "{stock.narrative?.question || '투자 가설을 수립해주세요.'}"
                                        </h3>
                                    </div>

                                    {/* B. Logic Health Meter */}
                                    <div className="mb-8">
                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logic Health</span>
                                            <div className="text-right">
                                                <span className={`text-2xl font-black ${healthColorClass.split(' ')[0]}`}>{healthScore}</span>
                                                <span className="text-xs text-zinc-600 font-bold ml-1">/ 100</span>
                                            </div>
                                        </div>
                                        {/* Tug of War Bar */}
                                        <div className="h-4 bg-black rounded-full relative overflow-hidden border border-white/5">
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20" />
                                            {/* Center Marker */}
                                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20" />
                                            {/* Score Indicator */}
                                            <div
                                                className={`absolute top-0 bottom-0 w-1.5 ${healthColorClass.split(' ')[1]} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
                                                style={{ left: `${healthScore}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] font-bold text-zinc-600 px-1">
                                            <span>Weak (Bear)</span>
                                            <span>Strong (Bull)</span>
                                        </div>
                                    </div>

                                    {/* C. Watchpoints List (Trigger) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Eye size={14} className="text-zinc-500" />
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Key Watchpoints</span>
                                            </div>
                                            {stock.watchpoints.length > 0 && !isLearningMode && (
                                                <button
                                                    onClick={() => setShowWatchpointBuilder(true)}
                                                    className="text-[10px] font-bold text-app-accent hover:text-white transition-colors"
                                                >
                                                    수정
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {stock.watchpoints.length > 0 ? (
                                                stock.watchpoints.map((wp) => (
                                                    <div key={wp.id} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-zinc-300 leading-snug">
                                                                {wp.question}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 bg-black/20 rounded-xl border border-dashed border-zinc-700 flex flex-col items-center justify-center">
                                                    <AlertTriangle size={24} className="text-zinc-600 mb-2" />
                                                    <p className="text-xs text-zinc-500 mb-3">관전 포인트 등록하고 해설된 알림 받기</p>
                                                    <button
                                                        onClick={() => setShowWatchpointBuilder(true)}
                                                        className="px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
                                                    >
                                                        핵심 포인트 잡아두기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* D. Event Journal (History) */}
                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Event Journal</span>
                                        </div>

                                        {stock.events.filter(e => e.status === 'Completed').length > 0 ? (
                                            <div className="space-y-3">
                                                {stock.events.filter(e => e.status === 'Completed').map(event => (
                                                    <div key={event.id} className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs text-zinc-500 font-medium">{event.date}</span>
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase
                                                                ${event.myActionHistory?.decision === 'buy' ? 'bg-red-500/20 text-red-400' :
                                                                    event.myActionHistory?.decision === 'sell' ? 'bg-blue-500/20 text-blue-400' :
                                                                        'bg-zinc-600/20 text-zinc-400'}`}>
                                                                {event.myActionHistory?.decision}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-white mb-1">{event.title}</h4>
                                                        <p className="text-xs text-zinc-400 line-clamp-2">
                                                            {event.scenarios.find(s => s.action === event.myActionHistory?.decision)?.rationale}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-zinc-600 italic">아직 기록된 이벤트 대응 내역이 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        // Uninvested State: Simple Prompt
                        <section className="mb-10 py-8 text-center bg-[#1E1E1E] rounded-[28px] border border-dashed border-zinc-700/50">
                            <p className="text-zinc-400 mb-4 font-medium">아직 수립된 가설이 없습니다.</p>
                        </section>
                    )}

                    {/* ZONE 4: REFERENCE ZONE (Secondary Info) */}
                    <section className="space-y-8 opacity-90">
                        {/* News */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-500 mb-4 flex items-center uppercase tracking-wider px-1">
                                <Calendar size={14} className="mr-1.5" />
                                {TEXT.STOCK_DETAIL.NEWS_TITLE}
                            </h3>
                            <div>
                                {stock.newsTags.length > 0 ? (
                                    stock.newsTags.map((news, idx) => (
                                        <NewsCard key={idx} news={news} />
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-zinc-600 text-sm bg-white/5 rounded-2xl border border-white/5">
                                        {TEXT.STOCK_DETAIL.NEWS_EMPTY}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider px-1">{TEXT.STOCK_DETAIL.COMPANY_INFO_TITLE}</h3>
                            <p className="text-zinc-400 leading-relaxed mb-4 text-sm">
                                {stock.companyProfile.summary}
                            </p>

                            <div className={`overflow-hidden transition-all duration-300 ${isProfileExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                                <p className="text-zinc-500 text-xs leading-relaxed pb-4">
                                    {stock.companyProfile.description}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                                className="flex items-center text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                            >
                                {isProfileExpanded ? TEXT.STOCK_DETAIL.BTN_COLLAPSE : TEXT.STOCK_DETAIL.BTN_EXPAND}
                                {isProfileExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                            </button>
                        </div>
                    </section>

                </div>

                {isLearningMode && onReturnToQuiz && (
                    <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                        <button
                            onClick={onReturnToQuiz}
                            className="w-full py-4 bg-app-accent hover:bg-indigo-400 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                        >
                            <CheckCircle2 size={20} />
                            <span>{TEXT.STOCK_DETAIL.BTN_LEARNING_RETURN}</span>
                        </button>
                    </div>
                )}

                {!isInvested && !isLearningMode && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent z-20 pt-12">
                        <button
                            onClick={onAddLogic}
                            className="w-full py-4 bg-app-accent hover:bg-indigo-400 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98] transition-all flex items-center justify-center animate-pulse-slow"
                        >
                            <span>{TEXT.STOCK_DETAIL.CTA_BUILD_THESIS}</span>
                            <ArrowRight size={20} className="ml-2" />
                        </button>
                    </div>
                )}

            </div>

            {/* --- OVERLAYS --- */}
            {showEventMode && activeEvent && (
                <ImmersiveEventMode
                    event={activeEvent}
                    relatedWatchpoint={stock.watchpoints.find(w => w.id === activeEvent.relatedWatchpointId)}
                    onClose={() => setShowEventMode(false)}
                    onComplete={handleEventComplete}
                />
            )}

            {showWatchpointBuilder && (
                <div className="fixed inset-0 z-[150] bg-[#121212] animate-in fade-in duration-300">
                    <WatchpointBuilder
                        stock={stock}
                        onClose={() => setShowWatchpointBuilder(false)}
                        onComplete={handleWatchpointComplete}
                    />
                </div>
            )}

        </div>
    );
};

export default StockDetailModal;
