import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, Layers, ArrowRight, X, ChevronRight, HelpCircle, Quote, Info, SkipForward } from 'lucide-react';
import { useStore, ALL_STOCKS } from '../../contexts/StoreContext';
import { QuizCategory, SearchResultSample } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = 
  | 'splash' 
  | 'intro' // Carousel
  | 'name' 
  | 'ocr' 
  | 'stock-select'
  | 'quiz' // New: Multi-step quiz
  | 'permission';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState("");
  const { data, updateUserName, addToMyThesis } = useStore();
  
  // Carousel State
  const [slideIndex, setSlideIndex] = useState(0);

  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Stock Selection State (Real Data)
  const [scannedStocks, setScannedStocks] = useState<SearchResultSample[]>([]);
  const [selectedStock, setSelectedStock] = useState<SearchResultSample | null>(null);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedLogics, setSelectedLogics] = useState<number[]>([]);

  // Splash Timer
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('intro'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Carousel Auto-play logic
  useEffect(() => {
    if (step === 'intro') {
      const timer = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [step]);

  // OCR Logic: Match user holdings with available database
  useEffect(() => {
    if (step === 'ocr' && scanComplete) {
       // Combine domestic and overseas holdings
       const allHoldings = [...data.user.holdings.domestic, ...data.user.holdings.overseas];
       
       // Filter ALL_STOCKS to find matches
       const matches = ALL_STOCKS.filter(stock => 
          allHoldings.some(h => h.ticker === stock.ticker)
       );
       
       // If matches found, use them. Else use top 3 defaults.
       if (matches.length > 0) {
           setScannedStocks(matches);
       } else {
           setScannedStocks(ALL_STOCKS.slice(0, 3));
       }
    }
  }, [step, scanComplete, data.user.holdings]);

  const handleNameSubmit = () => {
    if (name.trim().length > 0) {
      updateUserName(name);
      setStep('ocr');
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setStep('stock-select'), 1200);
    }, 2000);
  };

  const handleStockSelect = (stock: SearchResultSample) => {
    setSelectedStock(stock);
    setCurrentQuizIndex(0);
    setSelectedLogics([]);
    setStep('quiz');
  };

  // --- QUIZ HELPERS ---
  const quizData = selectedStock?.quizData || [];
  const currentQuestion = quizData[currentQuizIndex];
  const progress = ((currentQuizIndex) / quizData.length) * 100;
  const currentCategory: QuizCategory = currentQuestion?.category || 'LongTerm';

  const handleQuizAnswer = (option: any) => {
      // 1. Collect Logic
      if (option.relatedLogicId) {
          setSelectedLogics(prev => {
              const id = Number(option.relatedLogicId);
              return prev.includes(id) ? prev : [...prev, id];
          });
      }

      // 2. Next Question or Finish
      if (currentQuizIndex < quizData.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
      } else {
          setStep('permission');
      }
  };

  const handleSkip = () => {
      if (currentCategory === 'LongTerm') {
          // Skip to ShortTerm
          const shortTermIndex = quizData.findIndex(q => q.category === 'ShortTerm');
          if (shortTermIndex !== -1) {
              setCurrentQuizIndex(shortTermIndex);
          } else {
              setStep('permission');
          }
      } else {
          // Skip to Finish
          setStep('permission');
      }
  };

  const handleFinalComplete = () => {
      if (selectedStock) {
          // Save to store
          addToMyThesis(
              selectedStock,
              selectedLogics,
              'Invested', // Defaulting to invested since it came from holdings
              '100만원 미만' // Default amount or collected in a new step if needed
          );
          onComplete();
      }
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      
      {/* --- STEP 1: SPLASH --- */}
      {step === 'splash' && (
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-1000 text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-[2rem] mb-8 animate-pulse shadow-[0_0_50px_rgba(99,102,241,0.4)] flex items-center justify-center">
            <Layers size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black leading-tight mb-2 tracking-tight">Hypo</h1>
          <p className="text-zinc-400 font-medium">논리적 투자 에이전트</p>
        </div>
      )}

      {/* --- STEP 2: CAROUSEL --- */}
      {step === 'intro' && (
        <div className="w-full h-full relative flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            {/* Slides */}
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {/* Slide 1 */}
              <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                <h1 className="text-4xl font-black leading-tight mb-6">
                  불안감에 팔았다가<br/>
                  <span className="text-app-positive">손해 본 적</span><br/>
                  있지 않으신가요?
                </h1>
                <div className="w-full h-64 bg-gradient-to-br from-red-900/20 to-transparent rounded-3xl border border-red-500/20 flex items-center justify-center">
                  <span className="text-8xl">📉</span>
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                 <h1 className="text-4xl font-black leading-tight mb-6">
                  친구 말 듣고 샀다가<br/>
                  <span className="text-blue-400">고점에 물린 적</span><br/>
                  있으신가요?
                </h1>
                 <div className="w-full h-64 bg-gradient-to-br from-blue-900/20 to-transparent rounded-3xl border border-blue-500/20 flex items-center justify-center">
                  <span className="text-8xl">👂</span>
                </div>
              </div>
              
              {/* Slide 3 */}
               <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                 <h1 className="text-4xl font-black leading-tight mb-6">
                  오르는 이유를<br/>
                  <span className="text-app-accent">논리적</span>으로<br/>
                  알려드립니다.
                </h1>
                 <div className="w-full h-64 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-3xl border border-app-accent/20 flex items-center justify-center">
                  <Layers size={100} className="text-app-accent opacity-80" />
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center space-x-2">
              {[0, 1, 2].map(idx => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${slideIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 pb-12 bg-[#121212] z-10">
            <button 
              onClick={() => setStep('name')}
              className="w-full h-14 bg-[#FEE500] text-[#191919] font-bold text-lg rounded-2xl mb-3 flex items-center justify-center"
            >
              카카오로 3초만에 시작하기
            </button>
            <button 
              onClick={() => setStep('name')}
              className="w-full h-14 bg-white text-black font-bold text-lg rounded-2xl flex items-center justify-center"
            >
              Google로 계속하기
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: NAME INPUT --- */}
      {step === 'name' && (
        <div className="w-full h-full px-8 pt-24 pb-8 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              반갑습니다.<br/>
              투자의 기준을 함께 세워갈<br/>
              <span className="text-app-accent">Hypo</span>입니다.
            </h2>
            <p className="text-zinc-400 text-lg mb-12">회원님을 뭐라고 부를까요?</p>
            
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임 입력"
              className="w-full bg-transparent border-b-2 border-white/20 text-3xl font-bold py-2 focus:outline-none focus:border-app-accent transition-colors placeholder:text-zinc-700"
              autoFocus
            />
          </div>
          <button 
            onClick={handleNameSubmit}
            disabled={name.length === 0}
            className="w-full h-14 bg-app-accent disabled:opacity-30 text-white font-bold text-lg rounded-2xl flex items-center justify-center transition-all"
          >
            다음
          </button>
        </div>
      )}

      {/* --- STEP 4: ASSET IMPORT (OCR) --- */}
      {step === 'ocr' && (
        <div className="w-full h-full flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex-1 px-8 pt-24">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              <span className="text-app-accent">토스증권의 [투자] 탭</span>을<br/>
              캡처해서 올려주세요.
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              보유 종목과 수익률을 분석해<br/>
              <span className="text-white font-bold">맞춤형 대응 전략</span>을 준비합니다.
            </p>

            {/* Mockup Visual */}
            <div className="relative w-full aspect-[4/5] bg-zinc-800 rounded-3xl overflow-hidden border border-white/10 mb-8 group">
              {!isScanning && !scanComplete && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                   <div className="w-32 h-48 bg-zinc-700 rounded-lg mb-4 flex flex-col p-2 gap-2 opacity-50">
                      <div className="w-full h-4 bg-zinc-600 rounded" />
                      <div className="w-2/3 h-4 bg-zinc-600 rounded" />
                      <div className="mt-4 w-full h-20 bg-zinc-600 rounded" />
                   </div>
                   <p className="text-sm">스크린샷 예시</p>
                 </div>
              )}
              
              {/* Scanning Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-app-accent absolute top-0 animate-[scan_2s_infinite_ease-in-out]" style={{ boxShadow: '0 0 20px #6366f1' }} />
                  <p className="text-app-accent font-bold animate-pulse">자산 분석 중...</p>
                </div>
              )}

              {/* Success State */}
              {scanComplete && (
                <div className="absolute inset-0 bg-app-accent/20 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-app-accent rounded-full flex items-center justify-center mb-4">
                    <Check size={32} className="text-white" strokeWidth={4} />
                  </div>
                  <p className="text-white font-bold text-xl">분석 완료!</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-[#121212]">
            <button 
              onClick={handleScan}
              className="w-full h-14 bg-white text-black font-bold text-lg rounded-2xl flex items-center justify-center space-x-2"
            >
              <Camera size={20} />
              <span>이미지 업로드</span>
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 5: STOCK SELECT --- */}
      {step === 'stock-select' && (
        <div className="w-full h-full flex flex-col px-6 pt-24 animate-in slide-in-from-right duration-300">
          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight mb-8">
              분석이 완료되었습니다.<br/>
              가장 <span className="text-app-accent">고민되는 종목</span><br/>
              하나를 골라보세요.
            </h2>
            
            <div className="space-y-4">
              {scannedStocks.map(stock => (
                  <button 
                    key={stock.ticker}
                    onClick={() => handleStockSelect(stock)}
                    className={`w-full bg-[#1E1E1E] p-6 rounded-3xl border border-white/5 text-left active:scale-[0.98] transition-all group hover:border-app-accent`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-bold text-white">{stock.name}</span>
                      <span className={`text-xl font-bold ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                          {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
                      </span>
                    </div>
                    <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {stock.changeRate < 0 ? '손절 해야 할까? 물 타야 할까?' : '수익 실현 할까? 더 들고 갈까?'}
                    </div>
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 6: QUIZ LOOP (NEW LOGIC) --- */}
      {step === 'quiz' && (
        <div className="w-full h-full flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 pt-24">
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
            
            {/* Content */}
            <div className="flex-1 flex flex-col p-6">
                <div className="flex-1 flex flex-col justify-center pb-8">
                     <h2 className="text-3xl font-bold text-white leading-tight whitespace-pre-line mb-8">
                       {currentQuestion?.question}
                     </h2>

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
                             {option.type !== 'idk' && <ArrowRight size={20} className="text-zinc-600 group-hover:text-white" />}
                           </button>
                        ))}
                     </div>
                </div>
                <p className="text-center text-xs text-zinc-600">
                    답변을 바탕으로 투자 논리를 구성합니다.
                </p>
            </div>
        </div>
      )}

      {/* --- STEP 7: PERMISSION & FINISH --- */}
      {step === 'permission' && (
        <div className="w-full h-full flex flex-col px-8 pt-24 pb-12 animate-in slide-in-from-right duration-300 text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-8">
              <Bell size={40} className="text-app-accent" />
            </div>
            
            <h2 className="text-3xl font-bold leading-tight mb-4">
              이 기준이 흔들릴 때만<br/>
              알림을 드릴게요.
            </h2>
            <p className="text-zinc-400 text-lg">
              불필요한 시세 알림으로<br/>
              방해하지 않습니다.
            </p>
          </div>

          <button 
            onClick={handleFinalComplete}
            className="w-full h-14 bg-app-accent text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all active:scale-[0.98]"
          >
            알림 받고 시작하기
          </button>
        </div>
      )}

    </div>
  );
};

export default OnboardingFlow;