

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, BarChart3, Bot, TrafficCone, Check, Sparkles, TrendingUp, AlertTriangle, Play } from 'lucide-react';
import { Event, Thesis, EventScenario } from '../../types';
import { useStore } from '../../contexts/StoreContext';

interface ImmersiveEventModeProps {
  event: Event;
  stock: Thesis;
  onClose: () => void;
  onNext?: () => void;
}

const TOTAL_STEPS = 5;

// Helper to generate scenario descriptions if missing from data
const getScenarioDescription = (action: 'buy' | 'hold' | 'sell', label: string) => {
  if (label.includes("매수") || action === 'buy') return "가설이 강화되었습니다. 비중을 늘려 이익을 극대화할 기회입니다.";
  if (label.includes("매도") || action === 'sell') return "리스크 관리가 필요합니다. 비중을 축소하여 손실을 방어하세요.";
  return "현재 상황을 좀 더 지켜볼 필요가 있습니다. 기존 포지션을 유지합니다.";
};

const ImmersiveEventMode: React.FC<ImmersiveEventModeProps> = ({ event, stock, onClose }) => {
  const { recordEventDecision } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Step 3 State
  const [displayedAnalysis, setDisplayedAnalysis] = useState('');
  
  // Step 5 State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Helper to get watchpoint details
  const getWatchpointDetail = (id: number) => {
    return stock.watchpoints.find(w => w.id === id);
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // --- Step 3 Typewriter Effect ---
  useEffect(() => {
    if (currentStep === 2) {
      setDisplayedAnalysis('');
      const fullText = event.analysis?.cause || "분석 데이터가 충분하지 않습니다.";
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedAnalysis(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) clearInterval(timer);
      }, 30); // Typing speed
      return () => clearInterval(timer);
    }
  }, [currentStep, event.analysis]);

  // --- Render Helpers ---

  const renderProgressIndicator = () => (
    <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2 z-20">
      {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
        <div 
          key={idx}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            idx <= currentStep ? 'bg-white' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  );

  // --- STEP 1: THE FACT ---
  const renderStep1_TheFact = () => {
    const isUpcoming = event.status === 'Upcoming';

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 mb-4">
              Step 1. 팩트 체크
            </span>
            <h2 className="text-3xl font-black text-white leading-tight mb-2">
              우리의 관전 포인트,<br/>
              결과는 어땠나요?
            </h2>
            <p className="text-zinc-400">
              {event.title} • {event.date}
            </p>
          </div>

          <div className="space-y-4">
            {event.checkpoints.map((cp, idx) => {
              const wp = getWatchpointDetail(cp.watchpointId);
              if (!wp) return null;

              let statusIcon;
              let statusColor;
              let statusText;

              if (isUpcoming || cp.status === 'Pending') {
                statusIcon = <HelpCircle size={24} />;
                statusColor = 'text-zinc-500 bg-zinc-800 border-zinc-700';
                statusText = '확인 전';
              } else if (cp.status === 'Pass') {
                statusIcon = <CheckCircle2 size={24} />;
                statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                statusText = '부합 (Pass)';
              } else {
                statusIcon = <AlertCircle size={24} />;
                statusColor = 'text-app-positive bg-app-positive/10 border-app-positive/20';
                statusText = '미달 (Fail)';
              }

              return (
                <div key={idx} className={`p-5 rounded-2xl border ${statusColor} flex items-start gap-4 transition-all`}>
                  <div className="shrink-0 mt-1">
                    {statusIcon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{wp.question}</h3>
                    <div className="text-sm font-medium opacity-80 flex items-center gap-2">
                      <span>{statusText}</span>
                      {cp.actualValue && (
                         <>
                           <span className="w-1 h-1 rounded-full bg-current" />
                           <span>실제: {cp.actualValue}</span>
                         </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 safe-area-bottom">
           <button 
             onClick={handleNextStep}
             className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl shadow-lg hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
             <span>결과 확인 완료</span>
             <ArrowRight size={20} />
           </button>
        </div>
      </div>
    );
  };

  // --- STEP 2: THE REACTION ---
  const renderStep2_TheReaction = () => {
    const priceChangeStr = event.marketReaction.priceChange; 
    const isPositive = priceChangeStr.includes('+');
    const isNeutral = !priceChangeStr.includes('+') && !priceChangeStr.includes('-');
    
    const colorClass = isPositive ? 'text-app-positive' : isNeutral ? 'text-zinc-400' : 'text-blue-400';
    const bgClass = isPositive ? 'bg-app-positive/10' : isNeutral ? 'bg-zinc-800' : 'bg-blue-400/10';

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
         <div className="flex-1 flex flex-col justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-8 animate-pulse">
               <BarChart3 size={32} className="text-zinc-400" />
            </div>
            
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Step 2. Market Reaction</h2>
            <h1 className="text-4xl font-black text-white leading-tight mb-2">
               시장은 이 결과를<br/>
               어떻게 받아들이고 있나요?
            </h1>

            <div className="mt-12 mb-8">
               <div className={`inline-flex flex-col items-center justify-center px-10 py-8 rounded-3xl border border-white/5 ${bgClass}`}>
                  <span className="text-zinc-400 text-sm font-bold mb-2">주가 변동</span>
                  <span className={`text-6xl font-black tracking-tighter ${colorClass}`}>
                     {priceChangeStr}
                  </span>
               </div>
            </div>

            <div className="flex justify-center">
               <div className="bg-[#1E1E1E] px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                  <span className="text-zinc-500 text-xs font-bold">거래량 강도</span>
                  <div className="w-px h-3 bg-zinc-700" />
                  <span className="text-white font-bold">{event.marketReaction.volumeChange}</span>
               </div>
            </div>
         </div>

         <div className="p-6 safe-area-bottom">
           <button 
             onClick={handleNextStep}
             className="w-full py-4 bg-[#1E1E1E] border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
             <span>다음: 분석 보기</span>
             <ArrowRight size={20} />
           </button>
        </div>
      </div>
    );
  };

  // --- STEP 3: THE ANALYSIS ---
  const renderStep3_TheAnalysis = () => {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
         <div className="flex-1 flex flex-col justify-center px-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-app-accent/20 flex items-center justify-center border border-app-accent/30">
                    <Bot size={24} className="text-app-accent" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-app-accent uppercase tracking-wider">Hypo AI Analysis</h2>
                    <p className="text-xs text-zinc-500">실시간 데이터 분석 중...</p>
                </div>
             </div>

             <h1 className="text-3xl font-black text-white leading-tight mb-8">
               시장이 이렇게 반응한<br/>
               이유는 무엇일까요?
             </h1>

             {/* Chat Bubble / Analysis Card */}
             <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-20 blur-lg" />
                <div className="relative bg-[#1E1E1E]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-h-[200px]">
                    <p className="text-xl text-zinc-200 leading-relaxed font-medium">
                        {displayedAnalysis}
                        <span className="animate-pulse text-app-accent">|</span>
                    </p>
                </div>
             </div>
         </div>

         <div className="p-6 safe-area-bottom">
           <button 
             onClick={handleNextStep}
             className="w-full py-4 bg-[#1E1E1E] border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
             <span>다음: 가설 점검</span>
             <ArrowRight size={20} />
           </button>
        </div>
      </div>
    );
  };

  // --- STEP 4: THE CONTEXT ---
  const renderStep4_TheContext = () => {
    // Logic: If Pass count > Fail count -> Green, else Red
    const passCount = event.checkpoints.filter(cp => cp.status === 'Pass').length;
    const failCount = event.checkpoints.filter(cp => cp.status === 'Fail').length;
    
    // Simple heuristic
    const isThesisIntact = passCount >= failCount;

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 flex flex-col justify-center px-6 text-center">
                <div className="mb-10 relative">
                    {/* Traffic Light Visual */}
                    <div className="w-24 h-48 mx-auto bg-black rounded-[40px] border-4 border-zinc-800 flex flex-col items-center justify-center gap-4 p-4 shadow-2xl">
                        <div className={`w-10 h-10 rounded-full transition-all duration-500 ${!isThesisIntact ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-red-900/20'}`} />
                        <div className="w-10 h-10 rounded-full bg-amber-900/20" />
                        <div className={`w-10 h-10 rounded-full transition-all duration-500 ${isThesisIntact ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-emerald-900/20'}`} />
                    </div>
                </div>

                <div className="mb-6">
                    {isThesisIntact ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-4">
                            <CheckCircle2 size={16} />
                            <span>Logic Intact (가설 유효)</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold mb-4">
                            <AlertTriangle size={16} />
                            <span>Logic Broken (가설 훼손)</span>
                        </div>
                    )}
                    
                    <h1 className="text-3xl font-black text-white leading-tight mb-4">
                        {isThesisIntact ? "기존 투자 가설은\n여전히 유효합니다." : "투자의 전제가\n흔들리고 있습니다."}
                    </h1>
                </div>

                <div className="bg-[#1E1E1E] p-6 rounded-3xl border border-white/5">
                    <p className="text-zinc-300 leading-relaxed font-medium">
                        "{event.analysis?.context}"
                    </p>
                </div>
            </div>

            <div className="p-6 safe-area-bottom">
                <button 
                    onClick={handleNextStep}
                    className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl shadow-lg hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span>최종 결정하기</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
  };

  // --- STEP 5: THE ACTION ---
  const renderStep5_TheAction = () => {
    const handleConfirm = () => {
        if (selectedScenarioIndex !== null) {
            // Save data to store
            const action = event.scenarios[selectedScenarioIndex].action;
            recordEventDecision(stock.id, event.id, action);
            
            // Show confirmation UI
            setIsConfirmed(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    if (isConfirmed) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 text-center px-6">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-app-accent blur-3xl opacity-20 rounded-full" />
                    <Sparkles size={80} className="text-app-accent relative z-10 animate-bounce" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">대응 완료!</h2>
                <p className="text-zinc-400 text-lg">
                    선택하신 전략이 포트폴리오에 반영되었습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="px-6 pt-10 pb-6">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                     <TrafficCone size={18} />
                     <span className="text-xs font-bold uppercase tracking-wider">Action Plan</span>
                </div>
                <h1 className="text-3xl font-black text-white leading-tight">
                    그래서,<br/>
                    어떻게 대응하시겠습니까?
                </h1>
            </div>

            <div className="flex-1 px-6 overflow-y-auto no-scrollbar pb-6 space-y-3">
                {event.scenarios.map((scenario, idx) => {
                    const isSelected = selectedScenarioIndex === idx;
                    const description = getScenarioDescription(scenario.action, scenario.label);

                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedScenarioIndex(idx)}
                            className={`w-full p-6 rounded-3xl border-2 text-left transition-all duration-200 active:scale-[0.98]
                                ${isSelected 
                                    ? 'bg-app-accent border-app-accent shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                                    : 'bg-[#1E1E1E] border-white/5 hover:border-white/20'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                                    {scenario.label}
                                </span>
                                {isSelected && <Check size={24} className="text-white" strokeWidth={3} />}
                            </div>
                            <p className={`text-sm leading-relaxed ${isSelected ? 'text-white/90' : 'text-zinc-500'}`}>
                                {description}
                            </p>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 safe-area-bottom bg-[#121212] border-t border-white/5">
                <button 
                    onClick={handleConfirm}
                    disabled={selectedScenarioIndex === null}
                    className="w-full py-4 bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                >
                    결정 확정하기
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none" />
      
      {/* Header UI */}
      {!isConfirmed && renderProgressIndicator()}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/20 text-zinc-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10">
        {currentStep === 0 && renderStep1_TheFact()}
        {currentStep === 1 && renderStep2_TheReaction()}
        {currentStep === 2 && renderStep3_TheAnalysis()}
        {currentStep === 3 && renderStep4_TheContext()}
        {currentStep === 4 && renderStep5_TheAction()}
      </div>
    </div>
  );
};

export default ImmersiveEventMode;