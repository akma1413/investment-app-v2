
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
    const [expandedWatchpointId, setExpandedWatchpointId] = useState<number | null>(null);

    // Get latest stock data from store to ensure updates (like Event completion) are reflected
    const latestStock = data.myThesis.find(t => t.id === stock.id) || stock;

    // Interactive State
    const [showEventMode, setShowEventMode] = useState(false);
    const [showWatchpointBuilder, setShowWatchpointBuilder] = useState(false);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);

    const isInvested = data.myThesis.some(t => t.ticker === latestStock.ticker);

    // Calculate Average Price
    const holding = data.user.holdings.domestic.find(h => h.ticker === latestStock.ticker) ||
        data.user.holdings.overseas.find(h => h.ticker === latestStock.ticker);
    const averagePrice = holding ? (holding.valuation - holding.profitValue) / holding.quantity : null;

    // Hover State
    const [hoverData, setHoverData] = useState<{ x: number, y: number, price: number, date: string } | null>(null);

    // --- CHART LOGIC ---
    // Use injected dummy data if available, otherwise fallback to empty array
    const chartPoints = latestStock.chartHistory?.[activeTimeFrame] || [];
    const chartNarrative = latestStock.chartNarratives?.[activeTimeFrame] || TEXT.STOCK_DETAIL.CHART_LOADING;

    // Calculate trend based on chart data or changeRate
    const isPositive = chartPoints.length > 0
        ? (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0
        : latestStock.changeRate >= 0;
    const trendColor = isPositive ? '#F87171' : '#60A5FA'; // Red for up (KR market style), Blue for down

    // Determine Chart Color based on the displayed data trend
    const startPrice = chartPoints.length > 0 ? chartPoints[0] : 0;
    const endPrice = chartPoints.length > 0 ? chartPoints[chartPoints.length - 1] : 0;
    const isUpward = endPrice >= startPrice;
    const chartColor = isUpward ? '#ef4444' : '#3b82f6'; // Red-500 : Blue-500

    // --- CHART DIMENSIONS ---
    const svgWidth = 500; // Fixed width for SVG coordinate calc
    const svgHeight = 160; // Increased height for better visibility
    const padding = { top: 20, right: 0, bottom: 20, left: 0 };

    const { points: coords, min: minVal, max: maxVal, avgY, effectiveMin, effectiveRange, graphWidth, graphHeight } = getChartCoordinates(chartPoints, svgWidth, svgHeight, padding);
    const linePath = `M ${getBezierPath(coords)}`;

    // Calculate Average Price Y-Coordinate
    const avgPriceY = averagePrice
        ? svgHeight - padding.bottom - ((averagePrice - effectiveMin) / effectiveRange) * graphHeight
        : null;

    // Hover Handler
    const handleMouseMove = (e: React.MouseEvent) => {
        if (chartPoints.length === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        // Find closest point index
        const index = Math.round(((mouseX - padding.left) / graphWidth) * (chartPoints.length - 1));
        const safeIndex = Math.max(0, Math.min(index, chartPoints.length - 1));

        const price = chartPoints[safeIndex];
        const pointX = coords[safeIndex][0];
        const pointY = coords[safeIndex][1];

        // Generate Dummy Date
        const now = new Date();
        let timeSpanMs = 0;
        switch (activeTimeFrame) {
            case '1D': timeSpanMs = 24 * 60 * 60 * 1000; break;
            case '1W': timeSpanMs = 7 * 24 * 60 * 60 * 1000; break;
            case '1M': timeSpanMs = 30 * 24 * 60 * 60 * 1000; break;
            case '3M': timeSpanMs = 90 * 24 * 60 * 60 * 1000; break;
            case '1Y': timeSpanMs = 365 * 24 * 60 * 60 * 1000; break;
            case '5Y': timeSpanMs = 5 * 365 * 24 * 60 * 60 * 1000; break;
        }

        const startTime = now.getTime() - timeSpanMs;
        const pointTime = startTime + (safeIndex / (chartPoints.length - 1)) * timeSpanMs;
        const dateObj = new Date(pointTime);

        let dateStr = '';
        if (activeTimeFrame === '1D') {
            dateStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        } else {
            dateStr = dateObj.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }

        setHoverData({ x: pointX, y: pointY, price, date: dateStr });
    };

    const handleMouseLeave = () => setHoverData(null);

    // --- LOGIC HEALTH CALC ---
    const healthScore = stock.logicHealth?.score || 50;
    const getHealthColor = (score: number) => {
        if (score >= 70) return 'text-emerald-400 bg-emerald-500';
        if (score >= 30) return 'text-amber-400 bg-amber-500';
        return 'text-red-400 bg-red-500';
    };
    const healthColorClass = getHealthColor(healthScore);

    // --- WATCHPOINT TRAFFIC LIGHT LOGIC ---
    const getWatchpointStatus = (wpId: number) => {
        // Find events related to this watchpoint
        const relatedEvents = latestStock.events?.filter(e => e.relatedWatchpointId === wpId) || [];
        if (relatedEvents.length === 0) return 'neutral';

        // Check the most recent event's status
        // Assuming events are sorted or we just take the first one found for now
        const latestEvent = relatedEvents[0];

        if (latestEvent.factCheck?.status === 'Pass') return 'success';
        if (latestEvent.factCheck?.status === 'Fail') return 'danger';
        return 'neutral';
    };

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

            <div className="w-full max-w-[430px] h-[95vh] bg-[#121212] rounded-t-[32px] pointer-events-auto overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative border-t border-white/10 mx-auto">

                {/* --- HEADER --- */}
                <header className="flex justify-between items-center px-6 py-6 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <div className="text-sm font-bold text-zinc-500 mb-0.5">{stock.ticker}</div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{stock.name}</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(stock.currentPrice, 'USD')}</div>
                        <div className={`text-base font-bold ${getRateColorClass(stock.changeRate)}`}>
                            {formatRate(stock.changeRate)}
                        </div>
                    </div>
                    {!isLearningMode && (
                        <button onClick={onClose} className="ml-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 absolute right-4 top-4">
                            <X size={24} />
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32 space-y-8">

                    {/* ZONE 1: ACTION TICKET (Integrated) */}
                    {isInvested && stock.events?.filter(e => e.status !== 'Completed').length > 0 && (
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
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-zinc-400 flex items-center">
                                <Activity size={18} className="mr-2 text-zinc-500" />
                                Market Context
                            </h3>
                            <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                                {(['1D', '1W', '1M', '3M', '1Y'] as TimeFrame[]).map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setActiveTimeFrame(tf)}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTimeFrame === tf ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="w-full h-48 mb-4 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl border border-white/5 relative overflow-hidden">
                            {chartPoints.length > 0 ? (
                                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={chartColor} stopOpacity="0.2" />
                                            <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                                        </linearGradient>
                                        {/* 3D Glow Filter */}
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={chartColor} floodOpacity="0.3" />
                                        </filter>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line x1={padding.left} y1={svgHeight / 4} x2={svgWidth} y2={svgHeight / 4} stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" opacity="0.3" />
                                    <line x1={padding.left} y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" opacity="0.3" />
                                    <line x1={padding.left} y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" opacity="0.3" />

                                    {/* Average Price Line */}
                                    {avgPriceY && avgPriceY >= padding.top && avgPriceY <= svgHeight - padding.bottom && (
                                        <g>
                                            <line
                                                x1={padding.left}
                                                y1={avgPriceY}
                                                x2={svgWidth}
                                                y2={avgPriceY}
                                                stroke="#A1A1AA"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                                opacity="0.5"
                                            />
                                            <text x={padding.left + 5} y={avgPriceY - 5} className="text-[10px] fill-zinc-400 font-medium">
                                                내 평단가
                                            </text>
                                        </g>
                                    )}

                                    <path d={`${linePath} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`} fill="url(#chartGrad)" />
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke={chartColor}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#shadow)"
                                    />

                                    {/* Hover Overlay */}
                                    {hoverData && (
                                        <g>
                                            <line
                                                x1={hoverData.x}
                                                y1={padding.top}
                                                x2={hoverData.x}
                                                y2={svgHeight - padding.bottom}
                                                stroke="#FFFFFF"
                                                strokeWidth="1"
                                                strokeDasharray="2 2"
                                                opacity="0.5"
                                            />
                                            <circle cx={hoverData.x} cy={hoverData.y} r="5" fill="white" stroke={chartColor} strokeWidth="3" filter="url(#shadow)" />

                                            {/* Tooltip */}
                                            <g transform={`translate(${Math.min(Math.max(hoverData.x - 40, 0), svgWidth - 80)}, ${Math.min(hoverData.y - 40, svgHeight - 50)})`}>
                                                <rect width="80" height="35" rx="6" fill="#18181B" stroke="#3F3F46" strokeWidth="1" filter="url(#shadow)" />
                                                <text x="40" y="14" textAnchor="middle" className="text-[10px] fill-zinc-400 font-medium">{hoverData.date}</text>
                                                <text x="40" y="28" textAnchor="middle" className="text-xs fill-white font-bold">{formatCurrency(hoverData.price, 'USD')}</text>
                                            </g>
                                        </g>
                                    )}

                                    {/* Min/Max Labels */}
                                    <text x={svgWidth - 10} y={padding.top} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                                        {maxVal.toLocaleString()}
                                    </text>
                                    <text x={svgWidth - 10} y={svgHeight - 10} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                                        {minVal.toLocaleString()}
                                    </text>

                                    {/* Invisible Hover Area */}
                                    <rect
                                        x={padding.left}
                                        y={padding.top}
                                        width={svgWidth}
                                        height={svgHeight}
                                        fill="transparent"
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        className="cursor-crosshair"
                                    />
                                </svg>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
                                    {TEXT.STOCK_DETAIL.CHART_LOADING}
                                </div>
                            )}
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-zinc-400 px-1 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <TrendingUp size={16} className="shrink-0 mt-0.5 text-zinc-500" />
                            <span>{chartNarrative}</span>
                        </div>
                    </section>

                    {/* ZONE 3: LOGIC HEADQUARTERS (The Core) */}
                    {isInvested ? (
                        <section className="animate-in slide-in-from-bottom duration-500 delay-100">

                            {/* Logic HQ Card */}
                            <div className="bg-[#1E1E1E] rounded-[32px] border border-zinc-700 shadow-2xl overflow-hidden relative">
                                {/* Decorative Header Line */}
                                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80" />

                                <div className="p-7">
                                    {/* A. Narrative Summary */}
                                    <div className="mb-10 relative">
                                        <Quote size={48} className="absolute -top-6 -left-4 text-zinc-800" />
                                        <h3 className="relative z-10 text-2xl font-bold text-white leading-snug tracking-tight">
                                            {stock.narrative?.question || '투자 가설을 수립해주세요.'}
                                        </h3>
                                    </div>

                                    {/* B. Logic Health Meter */}
                                    <div className="mb-10 bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <div className="flex items-end justify-between mb-3">
                                            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Logic Health</span>
                                            <div className="text-right">
                                                <span className={`text-3xl font-black ${healthColorClass.split(' ')[0]}`}>{healthScore}</span>
                                                <span className="text-sm text-zinc-600 font-bold ml-1">/ 100</span>
                                            </div>
                                        </div>
                                        {/* Tug of War Bar */}
                                        <div className="h-5 bg-black rounded-full relative overflow-hidden border border-white/5">
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20" />
                                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20" />
                                            <div
                                                className={`absolute top-0 bottom-0 w-2 ${healthColorClass.split(' ')[1]} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out rounded-full`}
                                                style={{ left: `${healthScore}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-600 px-1">
                                            <span>Weak (Bear)</span>
                                            <span>Strong (Bull)</span>
                                        </div>
                                    </div>

                                    {/* C. Watchpoints List (Accordion) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Eye size={18} className="text-zinc-400" />
                                                <span className="text-lg font-bold text-zinc-300">핵심 관전 포인트</span>
                                            </div>
                                            {stock.watchpoints.length > 0 && !isLearningMode && (
                                                <button
                                                    onClick={() => setShowWatchpointBuilder(true)}
                                                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 bg-indigo-500/10 rounded-full"
                                                >
                                                    수정
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {stock.watchpoints.length > 0 ? (
                                                stock.watchpoints.map((wp) => {
                                                    const status = getWatchpointStatus(wp.id);
                                                    const isExpanded = expandedWatchpointId === wp.id;
                                                    const relatedEvents = latestStock.events?.filter(e => e.relatedWatchpointId === wp.id) || [];

                                                    return (
                                                        <div key={wp.id} className="rounded-2xl bg-black/30 border border-white/5 overflow-hidden transition-all duration-300">
                                                            <button
                                                                onClick={() => setExpandedWatchpointId(isExpanded ? null : wp.id)}
                                                                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                                                            >
                                                                {/* Traffic Light */}
                                                                <div className={`w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]
                                                                    ${status === 'success' ? 'bg-emerald-500 text-emerald-500' :
                                                                        status === 'danger' ? 'bg-red-500 text-red-500' :
                                                                            'bg-zinc-700 text-zinc-700'}`}
                                                                />

                                                                <div className="flex-1">
                                                                    <p className="text-base font-medium text-zinc-200 leading-snug">
                                                                        {wp.question}
                                                                    </p>
                                                                </div>
                                                                {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                                                            </button>

                                                            {/* Expanded Content: Event Journal */}
                                                            {isExpanded && (
                                                                <div className="px-4 pb-4 pt-0">
                                                                    <div className="mt-2 pt-3 border-t border-white/5">
                                                                        <div className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Event Journal</div>

                                                                        {relatedEvents.length > 0 ? (
                                                                            <div className="space-y-2">
                                                                                {relatedEvents.map(event => (
                                                                                    <div key={event.id} className="bg-zinc-800/50 rounded-lg p-3 border border-white/5">
                                                                                        <div className="flex justify-between items-start mb-1">
                                                                                            <span className="text-[10px] text-zinc-500">{event.date}</span>
                                                                                            {event.myActionHistory && (
                                                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase
                                                                                                    ${event.myActionHistory.decision === 'buy' ? 'bg-red-500/20 text-red-400' :
                                                                                                        event.myActionHistory.decision === 'sell' ? 'bg-blue-500/20 text-blue-400' :
                                                                                                            'bg-zinc-600/20 text-zinc-400'}`}>
                                                                                                    {event.myActionHistory.decision}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        <p className="text-sm font-bold text-zinc-300 mb-1">{event.title}</p>
                                                                                        <p className="text-xs text-zinc-400 leading-relaxed">
                                                                                            {event.analysis?.implication || event.factCheck?.description}
                                                                                        </p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-xs text-zinc-600 italic py-2">아직 관련된 이벤트가 없습니다.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 bg-black/20 rounded-2xl border border-dashed border-zinc-700 flex flex-col items-center justify-center">
                                                    <AlertTriangle size={28} className="text-zinc-600 mb-3" />
                                                    <p className="text-sm text-zinc-500 mb-4">관전 포인트 등록하고 해설된 알림 받기</p>
                                                    <button
                                                        onClick={() => setShowWatchpointBuilder(true)}
                                                        className="px-6 py-3 bg-zinc-800 rounded-full text-sm font-bold text-white hover:bg-zinc-700 transition-colors"
                                                    >
                                                        핵심 포인트 잡아두기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        // Uninvested State
                        <section className="mb-10 py-12 text-center bg-[#1E1E1E] rounded-[32px] border border-dashed border-zinc-700/50">
                            <p className="text-zinc-400 mb-6 font-medium text-lg">아직 수립된 가설이 없습니다.</p>
                            <button
                                onClick={onAddLogic}
                                className="px-8 py-3 bg-app-accent hover:bg-indigo-400 text-white font-bold rounded-full shadow-lg transition-all"
                            >
                                가설 수립하기
                            </button>
                        </section>
                    )}

                    {/* ZONE 4: REFERENCE ZONE (Secondary Info) */}
                    <section className="space-y-10 opacity-90 pb-10">
                        {/* News */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-400 mb-5 flex items-center px-1">
                                <Calendar size={18} className="mr-2 text-zinc-500" />
                                {TEXT.STOCK_DETAIL.NEWS_TITLE}
                            </h3>
                            <div className="space-y-3">
                                {stock.newsTags.length > 0 ? (
                                    stock.newsTags.map((news, idx) => (
                                        <NewsCard key={idx} news={news} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-zinc-600 text-sm bg-white/5 rounded-2xl border border-white/5">
                                        {TEXT.STOCK_DETAIL.NEWS_EMPTY}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold text-zinc-400 mb-4 px-1">{TEXT.STOCK_DETAIL.COMPANY_INFO_TITLE}</h3>
                            <div className="bg-zinc-900/30 rounded-2xl p-5 border border-white/5">
                                <p className="text-zinc-300 leading-relaxed mb-4 text-base font-medium">
                                    {stock.companyProfile.summary}
                                </p>

                                <div className={`overflow-hidden transition-all duration-300 ${isProfileExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-zinc-400 text-sm leading-relaxed pb-2 border-t border-white/5 pt-4">
                                        {stock.companyProfile.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                                    className="flex items-center text-xs font-bold text-zinc-500 hover:text-white transition-colors mt-2"
                                >
                                    {isProfileExpanded ? TEXT.STOCK_DETAIL.BTN_COLLAPSE : TEXT.STOCK_DETAIL.BTN_EXPAND}
                                    {isProfileExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                                </button>
                            </div>
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
