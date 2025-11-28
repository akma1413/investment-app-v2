
import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Clock, BookOpen, ChevronDown, ChevronUp, MessageSquareQuote, ChevronRight, Vote, Check, AlertTriangle, ArrowRight, Activity, Calendar, Play, FileText, ArrowRightLeft, Target, ChevronLeft, Info, BarChart3, Microscope, Archive } from 'lucide-react';
import { Thesis, TimeFrame, EventActionScenario, ActionOption, LogicBlock, Event } from '../types';
import { useStore } from '../contexts/StoreContext';

interface StockDetailModalProps {
  stock: Thesis;
  onClose: () => void;
  isLearningMode?: boolean;
  onReturnToQuiz?: () => void;
  onAddLogic?: () => void;
}

// --- SUB COMPONENT: UNIFIED 5-STEP EVENT CAROUSEL ---
interface EventCarouselProps {
    event: Event;
    onComplete: (action: string) => void;
}

const EventCarouselCard: React.FC<EventCarouselProps> = ({ event, onComplete }) => {
  const scenario = event.actionScenario;
  if (!scenario) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType);
  };

  const handleConfirm = () => {
      if (selectedAction) {
          onComplete(selectedAction);
      }
  };

  // Determine content based on Phase
  const isPreEvent = scenario.phase === 'Pre-Event' || event.status === 'Upcoming';

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // INFO
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
               <Info size={32} className="text-white" />
            </div>
            <div className="mb-2">
               <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-zinc-300">
                  Step 1. 정보
               </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 leading-tight">{scenario.title}</h3>
            <p className="text-zinc-400 font-medium">
              {event.dDay} • {event.type}
            </p>
          </div>
        );
      case 1: // REACTION
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
               <BarChart3 size={32} className="text-blue-400" />
            </div>
            <div className="mb-2">
               <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300">
                  Step 2. 시장 반응
               </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
               {isPreEvent ? "시장의 기대치 (Consensus)" : "시장 반응"}
            </h3>
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 w-full">
               <p className="text-zinc-300 text-sm leading-relaxed">
                  {isPreEvent 
                    ? (scenario.marketReaction || "시장은 이번 이벤트를 주시하고 있으며, 변동성이 확대될 수 있습니다.")
                    : (scenario.marketReaction || "특이사항 없음")
                  }
               </p>
            </div>
          </div>
        );
      case 2: // ANALYSIS
        return (
           <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
               <Microscope size={32} className="text-purple-400" />
            </div>
            <div className="mb-2">
               <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
                  Step 3. Hypo의 분석
               </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
               {isPreEvent ? "관전 포인트" : "가설 검증"}
            </h3>
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 w-full">
               <p className="text-zinc-300 text-sm leading-relaxed">
                  {isPreEvent 
                    ? (scenario.myHypothesisCheck || "이 이벤트 결과가 회원님의 투자 가설을 지지할지, 혹은 훼손할지 지켜봐야 합니다.")
                    : (scenario.myHypothesisCheck || "분석 내용 없음")
                  }
               </p>
            </div>
          </div>
        );
      case 3: // CONTEXT
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
               <BookOpen size={32} className="text-emerald-400" />
            </div>
            <div className="mb-2">
               <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
                  Step 4. 맥락 (Context)
               </span>
            </div>
            <p className="text-lg text-white font-medium leading-relaxed mb-2">
               "{scenario.description}"
            </p>
          </div>
        );
      case 4: // PROPOSITION
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-app-accent/10 rounded-full flex items-center justify-center mb-6">
               <Target size={32} className="text-app-accent" />
            </div>
            <div className="mb-4">
               <span className="px-3 py-1 rounded-full bg-app-accent/10 border border-app-accent/20 text-xs font-bold text-app-accent">
                  Step 5. 대응 제안
               </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6">
               어떻게 대응하시겠습니까?
            </h3>
            
            <div className="w-full space-y-2">
               {selectedAction ? (
                  <div className="animate-in zoom-in duration-300 space-y-3">
                      <div className="p-4 bg-app-accent/20 border border-app-accent rounded-2xl">
                        <div className="flex items-center justify-center space-x-2 text-app-accent font-bold">
                            <CheckCircle2 size={20} />
                            <span>
                                {selectedAction === 'buy' ? '비중 확대' : selectedAction === 'sell' ? '비중 축소' : selectedAction === 'hold' ? '관망 (Hold)' : '전략 수정'} 선택됨
                            </span>
                        </div>
                      </div>
                      <button 
                        onClick={handleConfirm}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-lg hover:bg-zinc-200 active:scale-[0.98] transition-all"
                      >
                          전략 저장 및 완료
                      </button>
                      <button 
                        onClick={() => setSelectedAction(null)}
                        className="text-sm text-zinc-500 underline decoration-zinc-700"
                      >
                          다시 선택하기
                      </button>
                  </div>
               ) : (
                 scenario.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionSelect(option.actionType)}
                      className="w-full p-4 rounded-xl bg-[#121212] border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-between group"
                    >
                       <span className="font-bold text-zinc-300 group-hover:text-white">{option.label}</span>
                       <ChevronRight size={16} className="text-zinc-600 group-hover:text-white" />
                    </button>
                 ))
               )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#1E1E1E] rounded-[32px] border border-white/10 overflow-hidden relative shadow-2xl h-[450px] flex flex-col">
            
            {/* Carousel Content */}
            <div className="flex-1 relative overflow-hidden">
               {renderStepContent()}
            </div>

            {/* Navigation & Indicators */}
            <div className="h-20 px-6 flex items-center justify-between border-t border-white/5 bg-[#1E1E1E]">
               
               {/* Prev Button */}
               <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-full transition-colors ${currentStep === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
               >
                  <ChevronLeft size={24} />
               </button>

               {/* Dots */}
               <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }).map((_, idx) => (
                     <div 
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${currentStep === idx ? 'w-8 bg-app-accent' : 'w-2 bg-zinc-700'}`}
                     />
                  ))}
               </div>

               {/* Next Button */}
               <button 
                  onClick={handleNext}
                  disabled={currentStep === totalSteps - 1}
                  className={`p-2 rounded-full transition-colors ${currentStep === totalSteps - 1 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
               >
                  <ChevronRight size={24} />
               </button>

            </div>
        </div>
    </div>
  );
};

// --- SUB COMPONENT: ACTION LOG ITEM (COLLAPSIBLE) ---
const ActionLogItem: React.FC<{ event: Event; decision: string }> = ({ event, decision }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getDecisionBadge = (action: string) => {
        switch(action) {
            case 'buy': return { text: '비중 확대', color: 'text-app-positive bg-app-positive/10 border-app-positive/20' };
            case 'sell': return { text: '비중 축소', color: 'text-app-negative bg-app-negative/10 border-app-negative/20' };
            case 'hold': return { text: '관망 (Hold)', color: 'text-zinc-400 bg-zinc-700/30 border-zinc-700' };
            case 'revise': return { text: '전략 수정', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
            default: return { text: '완료됨', color: 'text-zinc-400 bg-zinc-800' };
        }
    };

    const badge = getDecisionBadge(decision);

    return (
        <div className="border-b border-white/5 last:border-0">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between py-4 px-4 transition-colors ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}`}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span className="text-sm font-bold text-zinc-300">{event.title}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                        {badge.text}
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div className="p-4 bg-[#121212]/50 text-sm">
                    <div className="mb-3">
                        <span className="text-xs font-bold text-zinc-500 block mb-1">이벤트 내용</span>
                        <p className="text-zinc-300 leading-relaxed">{event.actionScenario?.description}</p>
                    </div>
                    <div>
                         <span className="text-xs font-bold text-zinc-500 block mb-1">나의 선택</span>
                         <p className="text-white font-bold flex items-center">
                            <Check size={14} className="mr-1 text-app-accent" />
                            {badge.text}
                         </p>
                    </div>
                </div>
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
        <div className="mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-6 rounded-[24px] border-l-4 transition-all duration-300 relative overflow-hidden group shadow-lg
                    ${isOpen ? 'bg-[#1E1E1E] border-app-accent shadow-app-accent/5' : 'bg-[#1E1E1E] border-app-accent hover:bg-zinc-800/50'}`}
            >
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className={`mt-0.5 transition-colors ${isOpen ? 'text-app-accent' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className={`text-xl font-bold mb-2 leading-snug ${isOpen ? 'text-white' : 'text-zinc-200'}`}>
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
                        
                        <h5 className="text-xs font-bold text-zinc-500 mb-4 pl-1 flex items-center">
                            <Clock size={12} className="mr-1" />
                            가설 히스토리
                        </h5>
                        
                        <div className="space-y-6">
                            {history.map((item, idx) => (
                                <div key={idx} className="relative flex items-start space-x-4">
                                    {/* Timeline Dot logic */}
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-[#121212] 
                                        ${item.type === 'Positive' || item.type === 'Success' ? 'bg-app-positive' : 
                                          item.type === 'Negative' || item.type === 'Failure' ? 'bg-app-negative' : 'bg-zinc-500'}`} 
                                    />
                                    
                                    <div className="flex-1">
                                        {/* Decision Badge */}
                                        {item.category === 'Decision' && (
                                            <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg mb-1.5 text-[11px] font-bold uppercase tracking-wide border
                                                ${item.type === 'Success' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : 'bg-zinc-700/30 text-zinc-400 border-zinc-700'}`}>
                                                {item.type === 'Success' ? <Target size={12} /> : <AlertTriangle size={12} />}
                                                <span>{item.badgeText || '의사결정'}</span>
                                            </div>
                                        )}

                                        <div className="text-sm font-bold text-white leading-tight mb-1">{item.text}</div>
                                        <div className="text-xs text-zinc-600">{item.date}</div>
                                    </div>
                                </div>
                            ))}
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
  const { data } = useStore();
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  
  // State for Archived Events (Action Log)
  const [archivedIndices, setArchivedIndices] = useState<number[]>([]);
  const [eventDecisions, setEventDecisions] = useState<Record<number, string>>({});

  // Check ownership: This determines if we show the "Management" view or "Discovery" view
  const isInvested = data.myThesis.some(t => t.ticker === stock.ticker);

  // Separate Active and Archived Events
  // Note: We use the index in the original stock.events array as the unique ID for simplicity in this mock
  const activeEvents = stock.events
    .map((e, idx) => ({ ...e, originalIndex: idx }))
    .filter(e => e.actionScenario !== undefined && !archivedIndices.includes(e.originalIndex));
    
  const archivedEvents = stock.events
    .map((e, idx) => ({ ...e, originalIndex: idx }))
    .filter(e => archivedIndices.includes(e.originalIndex));

  // Show Action Card only if Invested and not in learning mode
  const showActionCards = isInvested && !isLearningMode && activeEvents.length > 0;
  const showActionLog = isInvested && !isLearningMode && archivedEvents.length > 0;

  const handleEventComplete = (originalIndex: number, action: string) => {
      setEventDecisions(prev => ({ ...prev, [originalIndex]: action }));
      setArchivedIndices(prev => [...prev, originalIndex]);
  };

  // Chart Data Processing
  // If chartHistory is empty (e.g. dummy preview stock), handle gracefully
  const chartPoints = stock.chartHistory[activeTimeFrame] || [];
  const chartNarrative = stock.chartNarratives[activeTimeFrame] || "데이터 분석 중...";
  const isPositive = chartPoints.length > 0 ? (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0 : stock.changeRate >= 0;
  const trendColor = isPositive ? '#F87171' : '#60A5FA';

  // SVG Config
  const svgWidth = 380;
  const svgHeight = 160;
  const padding = { top: 20, right: 40, bottom: 20, left: 0 }; // Right padding for Y-axis labels
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate Scale
  const minVal = chartPoints.length ? Math.min(...chartPoints) : 0;
  const maxVal = chartPoints.length ? Math.max(...chartPoints) : 100;
  const range = maxVal - minVal || 1;
  const buffer = range * 0.1; // 10% buffer
  const effectiveMin = minVal - buffer;
  const effectiveRange = range + (buffer * 2);
  const avgVal = chartPoints.reduce((a, b) => a + b, 0) / (chartPoints.length || 1);
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

          {/* 1. HERO: EVENT CAROUSEL (Priority 1) - ONLY IF INVESTED */}
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
                  {chartPoints.length > 0 ? (
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
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          차트 데이터 로딩 중
                      </div>
                  )}
              </div>
              <div className="flex items-start space-x-2 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl">
                  <TrendingUp size={16} className="shrink-0 mt-0.5" />
                  <span>{chartNarrative}</span>
              </div>
          </section>

          {/* 3. LOGIC HEALTH (Only if Invested) */}
          {/* CRITICAL: ONLY SHOW IF INVESTED */}
          {isInvested && (
          <section className="mb-10 animate-in slide-in-from-bottom duration-500 delay-100">
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
          )}

          {/* 4. NEWS EVIDENCE (Priority 4) */}
          <section className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-zinc-500" />
                  관련 뉴스
              </h3>
              <div>
                  {stock.newsTags.length > 0 ? (
                      stock.newsTags.map((news, idx) => (
                          <NewsCard key={idx} news={news} />
                      ))
                  ) : (
                      <div className="text-center py-8 text-zinc-500 bg-white/5 rounded-2xl border border-white/5">
                          현재 분석된 주요 뉴스가 없습니다.
                      </div>
                  )}
              </div>
          </section>

          {/* NEW: 5. ACTION LOG (ARCHIVED EVENTS) */}
          {showActionLog && (
             <section className="mb-10 pt-6 border-t border-white/5 animate-in slide-in-from-bottom">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                     <Archive size={18} className="mr-2 text-zinc-500" />
                     지난 대응 내역 (Action Log)
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

          {/* 6. COMPANY INFO (Footer) */}
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

        {/* --- UNINVESTED VIEW CTA (Fixed Footer) --- */}
        {/* CRITICAL: ONLY SHOW IF NOT INVESTED (DISCOVERY MODE) */}
        {!isInvested && !isLearningMode && (
           <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent z-20 pt-12">
               <button 
                 onClick={onAddLogic}
                 className="w-full py-4 bg-app-accent hover:bg-indigo-400 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98] transition-all flex items-center justify-center animate-pulse-slow"
               >
                 <span>이 종목으로 투자 가설 세우기</span>
                 <ArrowRight size={20} className="ml-2" />
               </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default StockDetailModal;
