

import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Clock, BookOpen, ChevronDown, ChevronUp, MessageSquareQuote, ChevronRight, Vote, Check, AlertTriangle, ArrowRight, Activity, Calendar } from 'lucide-react';
import { Thesis, TimeFrame, EventActionScenario, ActionOption, LogicBlock } from '../types';

interface StockDetailModalProps {
  stock: Thesis;
  onClose: () => void;
  isLearningMode?: boolean;
  onReturnToQuiz?: () => void;
  onAddLogic?: () => void;
}

// --- SUB COMPONENT: STATEFUL EVENT ACTION CARD ---
const EventActionCard: React.FC<{ scenario: EventActionScenario }> = ({ scenario }) => {
  // Steps: 'predict' -> 'analysis' -> 'done'
  const [step, setStep] = useState<'predict' | 'analysis'>('predict');
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  const handlePredict = (label: string) => {
    setSelectedPrediction(label);
    // Simulate processing delay for effect
    setTimeout(() => {
        setStep('analysis');
    }, 600);
  };

  const handleFinalAction = (actionLabel: string) => {
      alert(`[${actionLabel}] 액션이 설정되었습니다. 이슈 발생 시 가장 먼저 알림을 드립니다.`);
  };

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-700 ease-out">
        <div className={`relative overflow-hidden rounded-[32px] transition-all duration-500 ${step === 'predict' ? 'bg-[#1E1E1E] border border-white/10' : 'bg-indigo-900/30 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]'}`}>
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Vote size={140} className="text-white transform rotate-12" />
            </div>

            {/* --- STEP 1: PREDICTION --- */}
            {step === 'predict' && (
                <div className="p-7 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-app-accent text-white uppercase tracking-wide">
                            D-Day Prediction
                        </span>
                        <span className="text-xs text-zinc-500 font-bold">참여 시 맞춤 전략 제공</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                        {scenario.title}
                    </h3>
                    <p className="text-zinc-400 font-medium mb-8">
                        {scenario.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handlePredict('Positive')}
                            className="h-16 rounded-2xl border-2 border-zinc-700 hover:border-app-positive/50 hover:bg-app-positive/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                            <span className="text-xs font-bold text-zinc-300 group-hover:text-white">잘 나올 것 같아요</span>
                        </button>
                        <button 
                            onClick={() => handlePredict('Negative')}
                            className="h-16 rounded-2xl border-2 border-zinc-700 hover:border-app-negative/50 hover:bg-app-negative/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">😰</span>
                            <span className="text-xs font-bold text-zinc-300 group-hover:text-white">실망스러울 듯해요</span>
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 2: CONTEXTUAL PROPOSAL --- */}
            {step === 'analysis' && (
                <div className="p-7 animate-in fade-in slide-in-from-bottom-8 duration-500">
                     <div className="flex items-center space-x-2 mb-5">
                        <div className="animate-pulse w-2 h-2 rounded-full bg-indigo-400"></div>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Hypo's Analysis</span>
                    </div>

                    <div className="bg-[#121212]/50 backdrop-blur-md rounded-2xl p-5 border-l-4 border-indigo-500 mb-6">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle size={24} className="text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">
                                    "잠시만요! {scenario.analysisContext?.message || "시장이 과열 상태입니다."}"
                                </h4>
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    당신의 예측({selectedPrediction === 'Positive' ? '상승' : '하락'})과 달리, 시장 데이터는 변동성 확대를 예고하고 있습니다. 
                                    <span className="text-indigo-300 font-bold ml-1">지금은 비중 조절이 유리합니다.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">Recommended Action</p>
                        <div className="flex gap-3">
                            {scenario.options.map((opt, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleFinalAction(opt.label)}
                                    className={`flex-1 py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all border 
                                        ${opt.actionType === 'buy' ? 'bg-app-positive text-black border-app-positive' : 
                                          opt.actionType === 'sell' ? 'bg-app-negative text-white border-app-negative' :
                                          'bg-zinc-700 text-white border-zinc-600'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

// --- SUB COMPONENT: INTERACTIVE LOGIC BLOCK ---
const LogicHealthItem: React.FC<{ logic: LogicBlock }> = ({ logic }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Mock history if not present (for prototype)
    const history = logic.history || [
        { date: '2일 전', type: 'Positive', text: '관련 실적 20% 상회 발표' },
        { date: '1주 전', type: 'Neutral', text: '경쟁사 신제품 출시 소식' },
        { date: '2주 전', type: 'Positive', text: 'CEO가 컨퍼런스에서 해당 내용 강조' },
    ];

    return (
        <div className="mb-3">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                    ${isOpen ? 'bg-[#1E1E1E] border-app-accent' : 'bg-app-surface border-white/5 hover:border-zinc-600'}`}
            >
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className={`mt-0.5 transition-colors ${isOpen ? 'text-app-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                            <CheckCircle2 size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className={`text-base font-bold mb-1 leading-snug ${isOpen ? 'text-white' : 'text-zinc-200'}`}>
                                {logic.title}
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed pr-6">
                                {logic.desc}
                            </p>
                        </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-zinc-600" />
                    </div>
                </div>
            </button>

            {/* Drill-down History */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-[#121212] rounded-2xl p-5 border border-white/10 ml-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-zinc-800" />
                        
                        <h5 className="text-xs font-bold text-zinc-500 mb-4 pl-1">이 가설의 히스토리</h5>
                        
                        <div className="space-y-6">
                            {history.map((item, idx) => (
                                <div key={idx} className="relative flex items-start space-x-4">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-[#121212] 
                                        ${item.type === 'Positive' ? 'bg-app-positive' : item.type === 'Negative' ? 'bg-app-negative' : 'bg-zinc-500'}`} 
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-white leading-tight mb-1">{item.text}</div>
                                        <div className="text-xs text-zinc-600">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/5">
                             <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">최근 3개월간 유효성</span>
                                <span className="text-sm font-bold text-app-accent">High (85점)</span>
                             </div>
                             <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-app-accent w-[85%]" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB COMPONENT: NEWS ITEM ---
const NewsCard: React.FC<{ news: any }> = ({ news }) => {
    return (
        <div className="p-5 bg-app-surface rounded-2xl border border-white/5 mb-3 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-wide 
                    ${news.type === 'Positive' ? 'bg-app-positive/20 text-app-positive' : 
                      news.type === 'Negative' ? 'bg-app-negative/20 text-app-negative' : 'bg-zinc-700 text-zinc-300'}`}>
                    {news.type === 'Positive' ? '호재' : news.type === 'Negative' ? '악재' : '중립'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">{news.date}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white leading-snug mb-3">
                {news.text}
            </h3>

            {news.analystComment && (
                <div className="relative mt-4 bg-white/5 rounded-xl p-4 pl-10 border border-white/5">
                    <MessageSquareQuote size={18} className="absolute top-4 left-3 text-app-accent/80" />
                    <div className="text-xs font-bold text-zinc-500 mb-1">해설</div>
                    <p className="text-sm text-zinc-300 font-medium italic leading-relaxed">
                        "{news.analystComment}"
                    </p>
                </div>
            )}
        </div>
    );
}

// Helper to get X-axis labels
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
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  // Active Event Scenario?
  const activeEvent = stock.events.find(e => e.actionScenario !== undefined);
  const showActionCard = !isLearningMode && activeEvent?.actionScenario;

  // Chart Data Processing
  const chartPoints = stock.chartHistory[activeTimeFrame] || [];
  const chartNarrative = stock.chartNarratives[activeTimeFrame] || "데이터 부족";
  const isPositive = (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0;
  const trendColor = isPositive ? '#F87171' : '#60A5FA';

  // SVG Config
  const svgWidth = 380;
  const svgHeight = 160;
  const padding = { top: 20, right: 40, bottom: 20, left: 0 }; // Right padding for Y-axis labels
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate Scale
  const minVal = Math.min(...chartPoints);
  const maxVal = Math.max(...chartPoints);
  const range = maxVal - minVal || 1;
  const buffer = range * 0.1; // 10% buffer
  const effectiveMin = minVal - buffer;
  const effectiveRange = range + (buffer * 2);
  const avgVal = chartPoints.reduce((a, b) => a + b, 0) / chartPoints.length;
  const avgY = svgHeight - padding.bottom - ((avgVal - effectiveMin) / effectiveRange) * graphHeight;

  // X Axis Labels
  const xLabels = getXAxisLabels(activeTimeFrame);

  const generatePath = (points: number[]) => {
    if (!points.length) return "";
    return points.map((val, i) => {
      const x = (i / (points.length - 1)) * graphWidth + padding.left;
      const y = svgHeight - padding.bottom - ((val - effectiveMin) / effectiveRange) * graphHeight;
      return `${x},${y}`;
    }).join(" ");
  };
  const linePath = `M ${generatePath(chartPoints)}`;

  const formatPrice = (p: number) => p.toLocaleString(undefined, { maximumFractionDigits: 0 });

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
             <div className="text-xl font-bold text-white">${stock.currentPrice}</div>
             <div className={`text-sm font-bold ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                 {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
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
          
          {/* 0. Learning Mode Banner */}
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

          {/* 1. HERO: EVENT ACTION CARD (Priority 1) */}
          {showActionCard && activeEvent.actionScenario && (
             <EventActionCard scenario={activeEvent.actionScenario} />
          )}

          {/* 2. CHART CONTEXT (Priority 2) */}
          <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Activity size={18} className="mr-2 text-zinc-500" />
                    주가 흐름
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
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Average Grid Line */}
                        <line x1={padding.left} y1={avgY} x2={svgWidth - padding.right} y2={avgY} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />

                        {/* Chart Area & Line */}
                        <path d={`${linePath} L ${svgWidth - padding.right},${svgHeight - padding.bottom} L ${padding.left},${svgHeight - padding.bottom} Z`} fill="url(#chartGrad)" />
                        <path d={linePath} fill="none" stroke={trendColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Y-Axis Labels (Price) */}
                        <text x={svgWidth} y={padding.top} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {formatPrice(maxVal)}
                        </text>
                        <text x={svgWidth} y={avgY + 3} className="text-[10px] fill-zinc-600 font-medium" textAnchor="end">
                           Avg
                        </text>
                        <text x={svgWidth} y={svgHeight - padding.bottom} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {formatPrice(minVal)}
                        </text>

                        {/* X-Axis Labels (Time) */}
                        <g className="text-[10px] fill-zinc-500 font-medium">
                            <text x={padding.left} y={svgHeight} textAnchor="start">{xLabels[0]}</text>
                            <text x={(svgWidth - padding.right) / 2} y={svgHeight} textAnchor="middle">{xLabels[1]}</text>
                            <text x={svgWidth - padding.right} y={svgHeight} textAnchor="end">{xLabels[2]}</text>
                        </g>
                  </svg>
              </div>
              <div className="flex items-start space-x-2 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl">
                  <TrendingUp size={16} className="shrink-0 mt-0.5" />
                  <span>{chartNarrative}</span>
              </div>
          </section>

          {/* 3. LOGIC HEALTH (Priority 3) */}
          <section className="mb-10">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center">
                    <CheckCircle2 size={18} className="mr-2 text-app-accent" />
                    내 가설 관리
                 </h3>
                 <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md">Logic Health</span>
             </div>
             
             {/* Logic List */}
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
                     + 새로운 가설 추가하기
                 </button>
             )}
          </section>

          {/* 4. NEWS EVIDENCE (Priority 4) */}
          <section className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-zinc-500" />
                  가설 체크 뉴스
              </h3>
              <div>
                  {stock.newsTags.length > 0 ? (
                      stock.newsTags.map((news, idx) => (
                          <NewsCard key={idx} news={news} />
                      ))
                  ) : (
                      <div className="text-center py-8 text-zinc-500 bg-white/5 rounded-2xl border border-white/5">
                          관련된 주요 뉴스가 없습니다.
                      </div>
                  )}
              </div>
          </section>

          {/* 5. COMPANY INFO (Footer) */}
          <section className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">무엇을 하는 회사인가요?</h3>
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
                  {isProfileExpanded ? '접기' : '더 자세히 보기'} 
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
                <span>분석 완료 (질문으로 돌아가기)</span>
              </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default StockDetailModal;