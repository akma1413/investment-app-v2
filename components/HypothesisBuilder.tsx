

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, BookOpen, HelpCircle, AlertCircle, Quote, ChevronRight, SkipForward } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import StockDetailModal from './StockDetailModal';
import { QuizCategory } from '../types';

interface HypothesisBuilderProps {
  onClose: () => void;
  onComplete?: () => void;
}

const HypothesisBuilder: React.FC<HypothesisBuilderProps> = ({ onClose, onComplete }) => {
  const { data, addToMyThesis } = useStore();
  const searchResult = data.discovery.searchResultSample;
  
  // --- STATE ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedLogics, setSelectedLogics] = useState<number[]>([]);
  
  // Learning Loop State
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [showLearningToast, setShowLearningToast] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Final Commitment State
  const [investmentType, setInvestmentType] = useState<'Watching' | 'Invested' | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string | null>(null);

  // --- HELPERS ---
  const quizData = searchResult.quizData || [];
  const currentQuestion = quizData[currentQuizIndex];
  // Calculate current progress based on index
  const progress = ((currentQuizIndex) / quizData.length) * 100;

  // Determine current category
  const currentCategory: QuizCategory = currentQuestion?.category || 'LongTerm';

  const handleQuizAnswer = (option: any) => {
    setValidationError(null); // Clear errors
    
    // 1. Handle "IDK" -> Enter Learning Loop
    if (option.type === 'idk') {
      setShowLearningModal(true);
      setShowLearningToast(true);
      setTimeout(() => setShowLearningToast(false), 3000);
      return;
    }

    // 2. Handle Logic Selection (Bull/Bear)
    if (option.relatedLogicId) {
      // Avoid duplicates
      setSelectedLogics(prev => {
         const id = Number(option.relatedLogicId);
         return prev.includes(id) ? prev : [...prev, id];
      });
    }

    // 3. Move to Next Question or Finish
    if (currentQuizIndex < quizData.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      goToStep3();
    }
  };

  const handleSkip = () => {
    setValidationError(null);
    if (currentCategory === 'LongTerm') {
       // Find index of first ShortTerm question
       const shortTermIndex = quizData.findIndex(q => q.category === 'ShortTerm');
       if (shortTermIndex !== -1) {
           setCurrentQuizIndex(shortTermIndex);
       } else {
           // If no short term questions, go to end
           goToStep3();
       }
    } else {
       // If currently ShortTerm, skip to end
       goToStep3();
    }
  };

  const goToStep3 = () => {
    // Check validation before moving to step 3 (must have at least one logic selected)
    // Note: selectedLogics only updates when a user picks Bull/Bear. 
    // IDK or Skips don't add to it.
    // However, we check selectedLogics.length > 0 inside step 3 logic usually, 
    // but the prompt asks to check before entering step 3? 
    // "If valid answer is 0... prevent entering Step 3"
    
    // Since state update might be async if triggered from handler, we rely on current state for checks here?
    // Actually handleQuizAnswer updates state. 
    // If we call goToStep3 from handleQuizAnswer, we need to consider the JUST selected option.
    // But since selectedLogics update is queued, we might need a robust check.
    
    // Simplification: We check validation right when trying to render Step 3 or inside handleFinish logic?
    // Prompt: "If valid answer is 0... prevent entering Step 3"
    // Let's check state. We assume React batching or use a ref if needed, but for now simple check:
    
    // If called from Skip, no new logic is added.
    // If called from Answer, logic is added.
    
    // We will do the check inside a useEffect or just let the render handle it?
    // Better: Perform check here. 
    // Hack: if we are in handleQuizAnswer, we know we just added one. 
    // But handleSkip doesn't add. 
    
    setStep(3);
  };
  
  // Effect to validate upon entering Step 3
  useEffect(() => {
    if (step === 3 && selectedLogics.length === 0) {
        setValidationError("최소 한 가지 이상의 투자의견을 선택해야 합니다.");
        setStep(2); // Go back
        // Show toast or error
        setTimeout(() => setValidationError(null), 3000);
    }
  }, [step, selectedLogics]);


  const closeLearningModal = () => {
    setShowLearningModal(false);
  };

  const toggleLogicInStep3 = (id: number) => {
    if (selectedLogics.includes(id)) {
      setSelectedLogics(selectedLogics.filter(l => l !== id));
    } else {
      setSelectedLogics([...selectedLogics, id]);
    }
  };

  const handleFinish = () => {
    if (investmentType) {
        addToMyThesis(
            searchResult, 
            selectedLogics, 
            investmentType, 
            investmentAmount || undefined
        );
        
        // Trigger generic complete (e.g., navigation)
        if (onComplete) {
            onComplete();
        } else {
            onClose();
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col animate-in fade-in duration-200 font-sans">
      
      {/* --- OVERLAYS --- */}
      {showLearningModal && (
        <>
          <StockDetailModal 
            stock={searchResult as any} // Using search result as dummy Thesis structure for modal
            onClose={closeLearningModal}
            isLearningMode={true}
            onReturnToQuiz={closeLearningModal}
          />
          {/* Toast Notification for Context */}
          {showLearningToast && (
             <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] bg-black/80 backdrop-blur-xl border border-app-accent/30 text-white px-6 py-3 rounded-full flex items-center shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
               <BookOpen size={18} className="text-app-accent mr-2" />
               <span className="text-sm font-bold">차트와 뉴스를 보고 힌트를 얻어보세요!</span>
             </div>
          )}
        </>
      )}

      {/* Validation Error Toast */}
      {validationError && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] bg-app-negative/90 backdrop-blur-xl text-white px-6 py-3 rounded-full flex items-center shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
           <AlertCircle size={18} className="mr-2 text-white" />
           <span className="text-sm font-bold">{validationError}</span>
         </div>
      )}

      {/* --- HEADER --- */}
      <header className="px-6 py-6 flex justify-between items-center border-b border-white/5 bg-[#121212] sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <X size={28} />
        </button>
        <div className="flex space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-app-accent' : 'bg-zinc-800'}`} />
          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-app-accent' : 'bg-zinc-800'}`} />
          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-app-accent' : 'bg-zinc-800'}`} />
        </div>
        <div className="w-8" />
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        
        {/* === STEP 1: CONTEXT === */}
        {step === 1 && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">이 기업,<br/>지금 어떤가요?</h1>
              <p className="text-lg text-app-text-secondary">애널리스트가 분석한 {searchResult.name}의 현황입니다.</p>
            </div>

            <div className="bg-app-surface p-6 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{searchResult.ticker}</div>
                  <div className="text-base text-zinc-400">최근 3개월 추이</div>
                </div>
                <div className="text-2xl font-bold text-app-positive">+12.4%</div>
              </div>
              
              <div className="h-40 w-full mb-6 relative z-10">
                 <svg viewBox="0 0 100 40" className="w-full h-full stroke-app-positive fill-none stroke-[2px] overflow-visible">
                   {/* Simplified Trend Line */}
                   <path d="M0,35 Q20,38 40,25 T80,15 T100,5" strokeLinecap="round" strokeLinejoin="round" />
                   
                   {/* Visual Cues */}
                   <circle cx="100" cy="5" r="3" className="fill-app-positive" />
                   <circle cx="0" cy="35" r="3" className="fill-zinc-600 stroke-none" />

                   {/* X-Axis Labels */}
                   <text x="0" y="48" fontSize="4" className="fill-zinc-500 font-bold" textAnchor="start">3개월 전</text>
                   <text x="100" y="48" fontSize="4" className="fill-zinc-500 font-bold" textAnchor="end">오늘</text>

                   {/* Y-Axis Label (Invisible Grid) */}
                   <line x1="0" y1="5" x2="100" y2="5" stroke="#F87171" strokeDasharray="2 2" strokeWidth="0.5" opacity="0.5" />
                   <text x="100" y="2" fontSize="4" className="fill-app-positive font-bold" textAnchor="end">High</text>
                 </svg>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl relative z-10">
                <p className="text-base text-zinc-200 leading-relaxed">
                  "{searchResult.chartContext}"
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Summary</h3>
              <p className="text-lg text-zinc-300 leading-relaxed">
                {searchResult.companyProfile.summary}
              </p>
            </div>
          </div>
        )}

        {/* === STEP 2: QUIZ LOOP (LEARNING) === */}
        {step === 2 && (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Section Header & Progress */}
            <div className="px-6 pt-2">
               {/* Skip Button */}
               <div className="flex justify-end mb-2">
                   <button 
                    onClick={handleSkip}
                    className="flex items-center text-xs font-bold text-zinc-500 hover:text-white transition-colors py-2"
                   >
                       {currentCategory === 'LongTerm' ? '건너뛰고 중단기 전망 보기' : '건너뛰고 결과 보기'} 
                       <SkipForward size={12} className="ml-1" />
                   </button>
               </div>

               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border 
                        ${currentCategory === 'LongTerm' 
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                        {currentCategory === 'LongTerm' ? '장기적 관점' : '중단기 전망'}
                    </span>
                    <span className="text-sm font-bold text-zinc-500">Q{currentQuizIndex + 1}</span>
                 </div>
               </div>
               {/* Progress Bar */}
               <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-300 ease-out ${currentCategory === 'LongTerm' ? 'bg-purple-500' : 'bg-emerald-500'}`}
                   style={{ width: `${progress}%` }}
                 />
               </div>
            </div>

            <div className="flex-1 flex flex-col p-6">
               <div className="flex-1 flex flex-col justify-center pb-12">
                 <div className="mb-8">
                   <Quote size={32} className="text-zinc-700 mb-4" />
                   <h2 className="text-3xl font-bold text-white leading-tight whitespace-pre-line">
                     {currentQuestion?.question}
                   </h2>
                 </div>
               </div>
               
               {/* Quiz Options */}
               <div className="space-y-3">
                 {currentQuestion?.options.map((option, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleQuizAnswer(option)}
                     className={`w-full p-5 rounded-2xl text-left border transition-all active:scale-[0.98] flex items-center justify-between group
                       ${option.type === 'idk' 
                         ? 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' 
                         : 'bg-[#1E1E1E] border-white/5 text-white hover:border-app-accent/50 hover:bg-white/5'
                       }`}
                   >
                     <span className="text-lg font-medium">{option.text}</span>
                     {option.type === 'idk' ? (
                       <div className="flex items-center text-xs font-bold text-app-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          힌트 보기 <BookOpen size={16} className="ml-1" />
                       </div>
                     ) : (
                        <ArrowRight size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
                     )}
                   </button>
                 ))}
               </div>
               <p className="text-center text-xs text-zinc-600 mt-6">
                 질문에 답하면 자동으로 투자 논리가 구성됩니다.
               </p>
            </div>
          </div>
        )}

        {/* === STEP 3: COMMITMENT & REVIEW === */}
        {step === 3 && (
          <div className="p-6 space-y-10 animate-in slide-in-from-right duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">나의 투자 가설<br/>점검하기</h1>
              <p className="text-lg text-app-text-secondary">선택한 답변을 바탕으로 핵심 논리를 정리했습니다.</p>
            </div>

            {/* Selected Logics Review */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">내가 선택한 핵심 논리</h3>
              {searchResult.availableLogicBlocks.map((logic) => {
                const isSelected = selectedLogics.includes(Number(logic.id));
                // Only show if selected or if user hasn't selected anything yet (preview all?) - No, follow design.
                if (!isSelected) return null;
                
                return (
                  <div 
                    key={logic.id}
                    onClick={() => toggleLogicInStep3(Number(logic.id))}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                      ${isSelected ? 'border-app-accent bg-app-accent/10' : 'border-white/5 bg-app-surface opacity-50 hover:opacity-100'}`}
                  >
                    <div>
                      <h4 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{logic.title}</h4>
                      {isSelected && <p className="text-sm text-zinc-400 mt-1">{logic.desc}</p>}
                    </div>
                    {isSelected ? (
                      <div className="bg-app-accent rounded-full p-1 shrink-0 ml-4"><Check size={14} className="text-white" strokeWidth={3} /></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-600 shrink-0 ml-4" />
                    )}
                  </div>
                )
              })}
              {selectedLogics.length === 0 && (
                  <div className="text-center py-4 text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
                      선택된 논리가 없습니다.
                  </div>
              )}
            </div>

            <div className="h-[1px] bg-white/10 w-full" />

            <div className="space-y-6">
               <div className="text-center">
                 <h3 className="text-xl font-bold text-white">이 논리대로 투자하시겠습니까?</h3>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setInvestmentType('Watching')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all h-32 ${investmentType === 'Watching' ? 'border-zinc-400 bg-zinc-400/10' : 'border-white/5 bg-app-surface hover:bg-white/5'}`}
                >
                    <span className="text-3xl">👀</span>
                    <span className="font-bold text-white">지켜보기</span>
                </button>

                <button 
                    onClick={() => setInvestmentType('Invested')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all h-32 ${investmentType === 'Invested' ? 'border-app-accent bg-app-accent/10' : 'border-white/5 bg-app-surface hover:bg-white/5'}`}
                >
                    <span className="text-3xl">💸</span>
                    <span className="font-bold text-white">투자하기</span>
                </button>
               </div>
            </div>

            {investmentType === 'Invested' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-app-surface p-6 rounded-3xl border border-white/5">
                <p className="text-center text-base text-zinc-400 mb-6 font-medium">투자 규모는 어느 정도인가요?</p>
                <div className="flex flex-col gap-3">
                  {['100만원 미만', '100~500만원', '500만원 이상'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setInvestmentAmount(amount)}
                      className={`w-full py-4 rounded-xl text-lg font-bold border transition-all ${investmentAmount === amount ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      {step !== 2 && ( // Step 2 (Quiz) has its own flow inside the options
        <footer className="absolute bottom-0 left-0 right-0 p-6 bg-[#121212] border-t border-white/5 safe-area-bottom z-50">
            <button
            onClick={() => {
                if (step === 1) setStep(2);
                else if (step === 3) handleFinish();
            }}
            disabled={step === 3 && (!investmentType || selectedLogics.length === 0)}
            className="w-full h-14 bg-app-accent hover:bg-indigo-400 text-white text-lg font-bold rounded-2xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
            <span>{step === 3 ? '가설 등록하기' : '다음'}</span>
            {step < 3 && <ArrowRight size={20} />}
            </button>
        </footer>
      )}
    </div>
  );
};

export default HypothesisBuilder;