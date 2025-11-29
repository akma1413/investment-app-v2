
import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, BookOpen, ChevronDown, ChevronUp, ArrowRight, Activity, Calendar, Archive } from 'lucide-react';
import { Thesis, TimeFrame } from '../types';
import { useStore } from '../contexts/StoreContext';
import { EventCarouselCard, ActionLogItem } from './stock-detail/EventSection';
import { LogicHealthItem } from './stock-detail/LogicSection';
import { NewsCard } from './stock-detail/NewsSection';
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

// Helper to get X-axis labels (Moved from internal to component file level, but could be util)
const getXAxisLabels = (frame: TimeFrame) => {
    switch (frame) {
        case '1D': return ['09:00', '12:00', '15:30'];
        case '1W': return ['Mon', 'Wed', 'Fri'];
        case '1M': return ['4주 전', '2주 전', '오늘'];
        case '3M': return ['3달 전', '1달 전', '오늘'];
        case '1Y': return ['Jan', 'Jun', 'Dec'];
        case '5Y': return ['2020', '2022', '2024'];
        default: return [];
    }
};

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose, isLearningMode = false, onReturnToQuiz, onAddLogic }) => {
  const { data } = useStore();
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  
  // State for Archived Events (Action Log)
  const [archivedIndices, setArchivedIndices] = useState<number[]>([]);
  const [eventDecisions, setEventDecisions] = useState<Record<number, string>>({});

  const isInvested = data.myThesis.some(t => t.ticker === stock.ticker);

  const activeEvents = stock.events
    .map((e, idx) => ({ ...e, originalIndex: idx }))
    .filter(e => e.actionScenario !== undefined && !archivedIndices.includes(e.originalIndex));
    
  const archivedEvents = stock.events
    .map((e, idx) => ({ ...e, originalIndex: idx }))
    .filter(e => archivedIndices.includes(e.originalIndex));

  const showActionCards = isInvested && !isLearningMode && activeEvents.length > 0;
  const showActionLog = isInvested && !isLearningMode && archivedEvents.length > 0;

  const handleEventComplete = (originalIndex: number, action: string) => {
      setEventDecisions(prev => ({ ...prev, [originalIndex]: action }));
      setArchivedIndices(prev => [...prev, originalIndex]);
  };

  // Chart Logic (Using Utils)
  const chartPoints = stock.chartHistory[activeTimeFrame] || [];
  const chartNarrative = stock.chartNarratives[activeTimeFrame] || TEXT.STOCK_DETAIL.CHART_LOADING;
  const isPositive = chartPoints.length > 0 ? (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0 : stock.changeRate >= 0;
  const trendColor = isPositive ? '#F87171' : '#60A5FA';

  const svgWidth = 380;
  const svgHeight = 160;
  const padding = { top: 20, right: 40, bottom: 20, left: 0 };
  
  const { points: coords, min: minVal, max: maxVal, avgY } = getChartCoordinates(chartPoints, svgWidth, svgHeight, padding);
  const linePath = `M ${getBezierPath(coords)}`;

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

        {/* --- BODY SCROLL --- */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
          
          {/* Learning Mode Banner */}
          {isLearningMode && (
             <div className="bg-app-accent/10 border border-app-accent/30 rounded-2xl p-4 flex items-start space-x-3 animate-pulse-slow mb-6">
                <BookOpen size={20} className="text-app-accent mt-0.5 shrink-0" />
                <div>
                   <h3 className="text-sm font-bold text-app-accent mb-1">힌트 찾는 중...</h3>
                   <p className="text-xs text-zinc-300 leading-relaxed">
                     차트와 뉴스를 보고 퀴즈 정답을 유추해보세요.
                   </p>
                </div>
             </div>
          )}

          {/* 1. EVENT CAROUSEL */}
          {showActionCards && (
             <section className="mb-4">
               {activeEvents.map((evt) => (
                  <EventCarouselCard 
                    key={evt.originalIndex} 
                    event={evt} 
                    onComplete={(action) => handleEventComplete(evt.originalIndex, action)} 
                  />
               ))}
             </section>
          )}

          {/* 2. CHART */}
          <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Activity size={18} className="mr-2 text-zinc-500" />
                    {TEXT.STOCK_DETAIL.CHART_TITLE}
                  </h3>
                  <div className="flex bg-white/5 rounded-lg p-0.5">
                     {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as TimeFrame[]).map(tf => (
                         <button 
                            key={tf}
                            onClick={() => setActiveTimeFrame(tf)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${activeTimeFrame === tf ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                         >
                            {tf}
                         </button>
                     ))}
                  </div>
              </div>

              <div className="w-full h-[160px] mb-4 bg-white/[0.02] rounded-2xl border border-white/5 relative">
                  {chartPoints.length > 0 ? (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <line x1={padding.left} y1={avgY} x2={svgWidth - padding.right} y2={avgY} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
                        <path d={`${linePath} L ${svgWidth - padding.right},${svgHeight - padding.bottom} L ${padding.left},${svgHeight - padding.bottom} Z`} fill="url(#chartGrad)" />
                        <path d={linePath} fill="none" stroke={trendColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                        <text x={svgWidth} y={padding.top} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {maxVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </text>
                        <text x={svgWidth} y={avgY + 3} className="text-[10px] fill-zinc-600 font-medium" textAnchor="end">Avg</text>
                        <text x={svgWidth} y={svgHeight - padding.bottom} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {minVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </text>

                        <g className="text-[10px] fill-zinc-500 font-medium">
                            <text x={padding.left} y={svgHeight} textAnchor="start">{getXAxisLabels(activeTimeFrame)[0]}</text>
                            <text x={(svgWidth - padding.right) / 2} y={svgHeight} textAnchor="middle">{getXAxisLabels(activeTimeFrame)[1]}</text>
                            <text x={svgWidth - padding.right} y={svgHeight} textAnchor="end">{getXAxisLabels(activeTimeFrame)[2]}</text>
                        </g>
                  </svg>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          {TEXT.STOCK_DETAIL.CHART_LOADING}
                      </div>
                  )}
              </div>
              <div className="flex items-start space-x-2 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl">
                  <TrendingUp size={16} className="shrink-0 mt-0.5" />
                  <span>{chartNarrative}</span>
              </div>
          </section>

          {/* 3. LOGIC HEALTH */}
          {isInvested && (
          <section className="mb-10 animate-in slide-in-from-bottom duration-500 delay-100">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center">
                    <CheckCircle2 size={18} className="mr-2 text-app-accent" />
                    {TEXT.STOCK_DETAIL.LOGIC_TITLE}
                 </h3>
                 <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md">Logic Health</span>
             </div>
             <div>
                 {stock.logicBlocks.map(logic => (
                     <LogicHealthItem key={logic.id} logic={logic} />
                 ))}
             </div>
             {!isLearningMode && (
                 <button 
                    onClick={onAddLogic}
                    className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-bold text-sm hover:text-white hover:border-zinc-600 transition-colors mt-2"
                 >
                     {TEXT.STOCK_DETAIL.BTN_ADD_LOGIC}
                 </button>
             )}
          </section>
          )}

          {/* 4. NEWS */}
          <section className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-zinc-500" />
                  {TEXT.STOCK_DETAIL.NEWS_TITLE}
              </h3>
              <div>
                  {stock.newsTags.length > 0 ? (
                      stock.newsTags.map((news, idx) => (
                          <NewsCard key={idx} news={news} />
                      ))
                  ) : (
                      <div className="text-center py-8 text-zinc-500 bg-white/5 rounded-2xl border border-white/5">
                          {TEXT.STOCK_DETAIL.NEWS_EMPTY}
                      </div>
                  )}
              </div>
          </section>

          {/* 5. ACTION LOG */}
          {showActionLog && (
             <section className="mb-10 pt-6 border-t border-white/5 animate-in slide-in-from-bottom">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                     <Archive size={18} className="mr-2 text-zinc-500" />
                     {TEXT.STOCK_DETAIL.ACTION_LOG_TITLE}
                 </h3>
                 <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 overflow-hidden">
                     {archivedEvents.map((evt) => (
                         <ActionLogItem 
                             key={evt.originalIndex} 
                             event={evt} 
                             decision={eventDecisions[evt.originalIndex]} 
                         />
                     ))}
                 </div>
             </section>
          )}

          {/* 6. COMPANY INFO */}
          <section className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">{TEXT.STOCK_DETAIL.COMPANY_INFO_TITLE}</h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                  {stock.companyProfile.summary}
              </p>
              
              <div className={`overflow-hidden transition-all duration-300 ${isProfileExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                  <p className="text-zinc-500 text-sm leading-relaxed pb-4">
                      {stock.companyProfile.description}
                  </p>
              </div>

              <button 
                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                className="flex items-center text-sm font-bold text-zinc-500 hover:text-white transition-colors"
              >
                  {isProfileExpanded ? TEXT.STOCK_DETAIL.BTN_COLLAPSE : TEXT.STOCK_DETAIL.BTN_EXPAND} 
                  {isProfileExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
              </button>
          </section>

        </div>

        {/* --- LEARNING MODE FAB --- */}
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

        {/* --- UNINVESTED VIEW CTA --- */}
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
    </div>
  );
};

export default StockDetailModal;
