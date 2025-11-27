
import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, Layers, ArrowRight, X, ChevronRight, HelpCircle, Quote, Info } from 'lucide-react';
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

// Default Data for fallback
const DEFAULT_QUIZ = [
  {
    id: 1,
    question: "이 기업의 현재\n가장 큰 리스크는?",
    options: [
      { text: "경쟁 심화로 인한 점유율 하락", type: 'bear' },
      { text: "시장 지배력 확대로 성장 지속", type: 'bull' },
      { text: "잘 모르겠어요", type: 'idk' }
    ],
    context: {
      title: "리스크 팩트 체크",
      chart: "M0,35 Q20,38 40,25 T80,15 T100,5",
      points: [
        "최근 3개월간 주가는 15% 조정을 받았습니다.",
        "경쟁사들의 AI 기술 추격이 거센 상황입니다.",
        "하지만 밸류에이션 매력 구간에 진입했다는 평가입니다."
      ]
    }
  },
  {
    id: 2,
    question: "향후 1년 내\n가장 기대되는 모멘텀은?",
    options: [
      { text: "신규 서비스/제품 출시 효과", type: 'bull' },
      { text: "비용 절감을 통한 이익 개선", type: 'bear' },
      { text: "잘 모르겠어요", type: 'idk' }
    ],
    context: {
      title: "성장 모멘텀 점검",
      chart: "M0,40 L20,35 L40,30 L60,10 L80,20 L100,5",
      points: [
        "다음 분기 신제품 발표가 예정되어 있습니다.",
        "시장 컨센서스는 매출 10% 성장을 예상합니다.",
        "과거 유사 시기에 주가가 20% 상승한 이력이 있습니다."
      ]
    }
  }
];

const QUIZ_DATA: Record<string, any[]> = {
  TSLA: [
    {
      id: 1,
      question: "전기차 시장에서\n테슬라의 입지는?",
      options: [
        { text: "전기차 시장의 압도적 1위가 될 것이다.", type: 'bull' },
        { text: "중국 기업들에게 점유율을 뺏길 것이다.", type: 'bear' },
        { text: "잘 모르겠어요", type: 'idk' }
      ],
      context: {
        title: "테슬라의 현재 위치",
        chart: "M0,35 Q20,38 40,25 T80,15 T100,5",
        points: [
            "BYD 등 중국 기업의 추격이 거셉니다.",
            "하지만 미국 내 점유율은 50% 이상 유지 중입니다.",
            "단순 판매량보다 마진율 방어가 핵심입니다."
        ]
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
        points: [
            "FSD 누적 주행 데이터 10억 마일 돌파",
            "8월 로보택시 공개가 주가 분수령",
            "규제 당국의 승인 속도가 관건입니다."
        ]
      }
    }
  ],
  GOOGL: [
      {
        id: 1,
        question: "생성형 AI 검색이\n구글을 위협할까요?",
        options: [
            { text: "검색 광고 매출이 줄어들 것이다.", type: 'bear' },
            { text: "AI 결합으로 검색 시장을 더 키울 것이다.", type: 'bull' },
            { text: "잘 모르겠어요", type: 'idk' }
        ],
        context: {
            title: "검색 시장 패권 전쟁",
            chart: "M0,20 L30,25 L60,15 L100,5",
            points: [
                "Perplexity 등 AI 검색 스타트업 부상",
                "하지만 구글 검색 점유율은 여전히 90% 상회",
                "유튜브 등 플랫폼 락인 효과가 강력합니다."
            ]
        }
      },
       {
        id: 2,
        question: "클라우드 성장세는\n지속될까요?",
        options: [
            { text: "기업들의 AI 도입으로 고성장 할 것이다.", type: 'bull' },
            { text: "MS, 아마존에 밀려 성장이 둔화될 것이다.", type: 'bear' },
            { text: "잘 모르겠어요", type: 'idk' }
        ],
        context: {
            title: "클라우드 3강 구도",
            chart: "M0,35 L50,20 L100,10",
            points: [
                "구글 클라우드 영업이익률 흑자 전환 성공",
                "TPU(자체 칩)로 인한 비용 효율화 진행 중",
                "엔터프라이즈 AI 시장 침투율이 증가하고 있습니다."
            ]
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
  const [selectedStock, setSelectedStock] = useState<string>('TSLA'); 
  const [quizStepIndex, setQuizStepIndex] = useState(0); // 0, 1
  const [showQuizContext, setShowQuizContext] = useState(false);

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
    setSelectedStock(stock);
    setQuizStepIndex(0);
    setStep('quiz');
  };

  const handleQuizOption = (type: string) => {
    if (type === 'idk') {
      setShowQuizContext(true);
    } else {
      // Advance quiz or finish
      if (quizStepIndex < 1) { // 2 questions total
        setQuizStepIndex(prev => prev + 1);
      } else {
        setStep('permission');
      }
    }
  };

  const handleCloseContext = () => {
    setShowQuizContext(false);
  };

  const quizDataForStock = QUIZ_DATA[selectedStock] || DEFAULT_QUIZ;
  const currentQuestion = quizDataForStock[quizStepIndex];

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
          <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          {/* Main Quiz Content */}
          <div className={`w-full h-full flex flex-col px-6 pt-24 pb-8 transition-all duration-300 ${showQuizContext ? 'scale-95 opacity-50 blur-sm pointer-events-none' : 'scale-100 opacity-100'}`}>
             
             {/* Progress Bar */}
             <div className="flex space-x-2 mb-8">
               {[0, 1].map(i => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= quizStepIndex ? 'w-8 bg-app-accent' : 'w-4 bg-zinc-800'}`} />
               ))}
             </div>

             <h2 className="text-3xl font-bold leading-tight mb-8 whitespace-pre-wrap animate-in slide-in-from-right duration-300 key={quizStepIndex}">
               {currentQuestion.question}
             </h2>

             <div className="flex-1 space-y-4">
                {currentQuestion.options.map((option: any, idx: number) => (
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

          {/* Context Card Overlay (Glassmorphism) */}
          <div className={`absolute inset-x-0 bottom-0 bg-[#1A1A1A]/90 backdrop-blur-xl rounded-t-[32px] border-t border-white/10 shadow-2xl transition-transform duration-500 ease-out z-50 flex flex-col ${showQuizContext ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '80%' }}>
            {showQuizContext && (
              <div className="flex-1 p-8 flex flex-col overflow-y-auto no-scrollbar">
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8 shrink-0" />
                
                <h3 className="text-app-accent font-bold mb-2 flex items-center">
                    <Info size={16} className="mr-1" />
                    팩트 체크
                </h3>
                <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.context.title}</h2>
                
                {/* Points List */}
                <div className="space-y-4 mb-8">
                    {currentQuestion.context.points.map((point: string, i: number) => (
                        <div key={i} className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                                {i+1}
                            </div>
                            <p className="text-zinc-200 text-lg leading-snug">{point}</p>
                        </div>
                    ))}
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