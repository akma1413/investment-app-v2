import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, ArrowRight, X, ChevronRight, HelpCircle, Quote } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

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

// Updated Quiz Data with "I don't know" context
const QUIZ_DATA = {
  TSLA: [
    {
      id: 1,
      question: "전기차 시장에서\n테슬라의 입지는?",
      options: [
        { text: "전기차 시장의 압도적 1위가 될 것이다.", type: 'bull' },
        { text: "중국 기업들에게 점유율을 뺏길 것이다.", type: 'bear' },
        { text: "잘 모르겠어요", type: 'idk' } // Triggers context
      ],
      context: {
        title: "테슬라의 현재 위치",
        chart: "M0,35 Q20,38 40,25 T80,15 T100,5",
        summary: "최근 BYD 등 중국 기업의 추격이 거세지만, 미국 내 점유율은 여전히 50% 이상입니다. 단순 판매량이 아닌 마진율 방어가 핵심 포인트입니다."
      }
    },
    {
      id: 2,
      question: "자율주행과 로보택시의\n미래는?",
      options: [
        { text: "로보택시로 모빌리티 시장을 독점할 것이다.", type: 'bull' },
        { text: "규제와 기술 장벽으로 시간이 오래 걸릴 것이다.", type: 'bear' },
        { text: "잘 모르겠어요", type: 'idk' }
      ],
      context: {
        title: "FSD와 로보택시",
        chart: "M0,40 L20,35 L40,30 L60,10 L80,20 L100,5",
        summary: "FSD(자율주행) 누적 주행 데이터는 10억 마일을 돌파했습니다. 8월 로보택시 공개가 주가의 분수령이 될 전망입니다."
      }
    },
    {
      id: 3,
      question: "AI와 휴머노이드\n기술력은?",
      options: [
        { text: "휴머노이드(Optimus)가 새로운 성장 동력이 될 것이다.", type: 'bull' },
        { text: "자동차 제조 외의 수익화는 어려울 것이다.", type: 'bear' },
        { text: "잘 모르겠어요", type: 'idk' }
      ],
      context: {
        title: "AI & Optimus",
        chart: "M0,30 Q50,30 100,5",
        summary: "테슬라는 단순 자동차 회사가 아닌 AI 로보틱스 회사로 전환 중입니다. 옵티머스 로봇이 공장에 실제 투입되기 시작했습니다."
      }
    }
  ]
};

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState("");
  const { updateUserName } = useStore();
  
  // Carousel State
  const [slideIndex, setSlideIndex] = useState(0);

  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Quiz State
  const [selectedStock, setSelectedStock] = useState<'TSLA'>('TSLA'); // Simplified to just TSLA for this flow
  const [quizStepIndex, setQuizStepIndex] = useState(0); // 0, 1, 2
  const [showQuizContext, setShowQuizContext] = useState(false);

  // Splash Timer
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('intro'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Carousel Auto-play logic (optional manual override)
  useEffect(() => {
    if (step === 'intro') {
      const timer = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [step]);

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

  const handleStockSelect = (stock: string) => {
    setSelectedStock(stock as 'TSLA');
    setQuizStepIndex(0);
    setStep('quiz');
  };

  const handleQuizOption = (type: string) => {
    if (type === 'idk') {
      setShowQuizContext(true);
    } else {
      // Advance quiz or finish
      if (quizStepIndex < 2) {
        setQuizStepIndex(prev => prev + 1);
      } else {
        setStep('permission');
      }
    }
  };

  const handleCloseContext = () => {
    setShowQuizContext(false);
    // User returns to the same question to make a choice
  };

  const currentQuizData = QUIZ_DATA[selectedStock];
  const currentQuestion = currentQuizData[quizStepIndex];

  return (
    <div className="absolute inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      
      {/* --- STEP 1: SPLASH --- */}
      {step === 'splash' && (
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-1000 text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] mb-8 animate-pulse shadow-[0_0_50px_rgba(99,102,241,0.4)] flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-xl" />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight mb-2">
            감정적인 투자를 멈추고,<br/>
            <span className="text-app-accent">논리적인 투자</span>를 시작하세요.
          </h1>
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
                  <span className="text-app-negative">손해 본 적</span><br/>
                  있지 않으신가요?
                </h1>
                <div className="w-full h-64 bg-gradient-to-br from-red-900/20 to-transparent rounded-3xl border border-red-500/20 flex items-center justify-center">
                  <span className="text-6xl">📉</span>
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
                  <span className="text-6xl">👂</span>
                </div>
              </div>
              
              {/* Slide 3 */}
               <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                 <h1 className="text-4xl font-black leading-tight mb-6">
                  매일 차트를 보지만<br/>
                  <span className="text-app-accent">오르는 이유</span>를<br/>
                  모르겠나요?
                </h1>
                 <div className="w-full h-64 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-3xl border border-app-accent/20 flex items-center justify-center">
                  <span className="text-6xl">🤔</span>
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
              <span className="text-app-accent">파트너</span>입니다.
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
                  <div className="w-full h-1 bg-app-accent absolute top-0 animate-[scan_2s_infinite_ease-in-out]" style={{ boxShadow: '0 0 20px #818CF8' }} />
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
              <button 
                onClick={() => handleStockSelect('TSLA')}
                className="w-full bg-[#1E1E1E] p-6 rounded-3xl border border-white/5 text-left active:scale-[0.98] transition-all hover:border-app-accent group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl font-bold text-white">Tesla</span>
                  <span className="text-xl font-bold text-app-positive">+12%</span>
                </div>
                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  수익 실현 할까? 더 들고 갈까?
                </div>
              </button>

              <button 
                onClick={() => handleStockSelect('GOOGL')}
                className="w-full bg-[#1E1E1E] p-6 rounded-3xl border border-white/5 text-left active:scale-[0.98] transition-all hover:border-app-negative group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl font-bold text-white">Alphabet A</span>
                  <span className="text-xl font-bold text-app-negative">-5%</span>
                </div>
                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  손절 해야 할까? 물 타야 할까?
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 6: QUIZ LOOP (EDUCATIONAL) --- */}
      {step === 'quiz' && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          {/* Main Quiz Content */}
          <div className={`w-full h-full flex flex-col px-6 pt-24 pb-8 transition-all duration-300 ${showQuizContext ? 'scale-95 opacity-50 blur-sm pointer-events-none' : 'scale-100 opacity-100'}`}>
             
             {/* Progress Bar */}
             <div className="flex space-x-2 mb-8">
               {[0, 1, 2].map(i => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= quizStepIndex ? 'w-8 bg-app-accent' : 'w-4 bg-zinc-800'}`} />
               ))}
             </div>

             <h2 className="text-3xl font-bold leading-tight mb-8 whitespace-pre-wrap animate-in slide-in-from-right duration-300 key={quizStepIndex}">
               {currentQuestion.question}
             </h2>

             <div className="flex-1 space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizOption(option.type)}
                    className={`w-full p-5 rounded-2xl text-left border transition-all active:scale-[0.98] 
                      ${option.type === 'idk' 
                        ? 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' 
                        : 'bg-[#1E1E1E] border-white/5 text-white hover:border-app-accent/50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">{option.text}</span>
                      {option.type === 'idk' && <HelpCircle size={20} />}
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Context Card Overlay (Slide Up) */}
          <div className={`absolute inset-x-0 bottom-0 bg-[#1A1A1A] rounded-t-[32px] border-t border-white/10 shadow-2xl transition-transform duration-500 ease-out z-50 flex flex-col ${showQuizContext ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '85%' }}>
            {showQuizContext && (
              <div className="flex-1 p-8 flex flex-col overflow-y-auto no-scrollbar">
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8 shrink-0" />
                
                <h3 className="text-app-accent font-bold mb-2">팩트 체크</h3>
                <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.context.title}</h2>
                
                {/* Visual Chart Placeholder */}
                <div className="w-full h-40 bg-black/30 rounded-2xl border border-white/5 mb-6 relative p-4">
                   <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                     <path d={currentQuestion.context.chart} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                   </svg>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-8">
                  <Quote size={24} className="text-zinc-600 mb-2" />
                  <p className="text-lg text-zinc-200 leading-relaxed font-medium">
                    {currentQuestion.context.summary}
                  </p>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={handleCloseContext}
                    className="w-full h-14 bg-white text-black font-bold text-lg rounded-2xl hover:bg-zinc-200 transition-colors"
                  >
                    이제 알겠어요
                  </button>
                </div>
              </div>
            )}
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
            onClick={onComplete}
            className="w-full h-14 bg-app-accent text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(129,140,248,0.4)] hover:shadow-[0_0_40px_rgba(129,140,248,0.6)] transition-all active:scale-[0.98]"
          >
            알림 받고 시작하기
          </button>
        </div>
      )}

    </div>
  );
};

export default OnboardingFlow;