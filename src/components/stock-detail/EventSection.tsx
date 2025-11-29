
import React, { useState } from 'react';
import { Info, BarChart3, Microscope, BookOpen, Target, CheckCircle2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Event } from '../../types';
import { TEXT } from '../../constants/text';

interface EventCarouselProps {
    event: Event;
    onComplete: (action: string) => void;
}

export const EventCarouselCard: React.FC<EventCarouselProps> = ({ event, onComplete }) => {
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

  const handleConfirm = () => {
      if (selectedAction) {
          onComplete(selectedAction);
      }
  };

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
                  {TEXT.STOCK_DETAIL.EVENT_STEP_1}
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
                  {TEXT.STOCK_DETAIL.EVENT_STEP_2}
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
                  {TEXT.STOCK_DETAIL.EVENT_STEP_3}
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
                  {TEXT.STOCK_DETAIL.EVENT_STEP_4}
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
                  {TEXT.STOCK_DETAIL.EVENT_STEP_5}
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
                                {selectedAction === 'buy' ? TEXT.ACTIONS.BUY : selectedAction === 'sell' ? TEXT.ACTIONS.SELL : selectedAction === 'hold' ? TEXT.ACTIONS.HOLD : TEXT.ACTIONS.REVISE} 선택됨
                            </span>
                        </div>
                      </div>
                      <button 
                        onClick={handleConfirm}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-lg hover:bg-zinc-200 active:scale-[0.98] transition-all"
                      >
                          {TEXT.STOCK_DETAIL.BTN_SAVE_STRATEGY}
                      </button>
                      <button 
                        onClick={() => setSelectedAction(null)}
                        className="text-sm text-zinc-500 underline decoration-zinc-700"
                      >
                          {TEXT.STOCK_DETAIL.BTN_RESELECT}
                      </button>
                  </div>
               ) : (
                 scenario.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAction(option.actionType)}
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
            <div className="flex-1 relative overflow-hidden">
               {renderStepContent()}
            </div>
            <div className="h-20 px-6 flex items-center justify-between border-t border-white/5 bg-[#1E1E1E]">
               <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-full transition-colors ${currentStep === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
               >
                  <ChevronLeft size={24} />
               </button>
               <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }).map((_, idx) => (
                     <div 
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${currentStep === idx ? 'w-8 bg-app-accent' : 'w-2 bg-zinc-700'}`}
                     />
                  ))}
               </div>
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

export const ActionLogItem: React.FC<{ event: Event; decision: string }> = ({ event, decision }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getDecisionBadge = (action: string) => {
        switch(action) {
            case 'buy': return { text: TEXT.ACTIONS.BUY, color: 'text-app-positive bg-app-positive/10 border-app-positive/20' };
            case 'sell': return { text: TEXT.ACTIONS.SELL, color: 'text-app-negative bg-app-negative/10 border-app-negative/20' };
            case 'hold': return { text: TEXT.ACTIONS.HOLD, color: 'text-zinc-400 bg-zinc-700/30 border-zinc-700' };
            case 'revise': return { text: TEXT.ACTIONS.REVISE, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
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
