
import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, Layers } from 'lucide-react';
import { useStore, ALL_STOCKS } from '../../contexts/StoreContext';
import { SearchResultSample, Thesis } from '../../types';
import { TEXT } from '../../constants/text';
import NarrativeIntro from '../narrative/NarrativeIntro';

interface OnboardingFlowProps {
  onComplete: (stock?: Thesis) => void;
}

type Step = 
  | 'splash' 
  | 'intro'
  | 'name' 
  | 'ocr' 
  | 'stock-select'
  | 'narrative' // New Step
  | 'permission';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState("");
  const { data, updateUserName, addToMyThesis } = useStore();
  
  const [slideIndex, setSlideIndex] = useState(0);

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const [scannedStocks, setScannedStocks] = useState<SearchResultSample[]>([]);
  const [selectedStock, setSelectedStock] = useState<SearchResultSample | null>(null);
  
  // New state to hold the created thesis after Narrative step
  const [finalThesis, setFinalThesis] = useState<Thesis | null>(null);

  // --- TIMERS & EFFECTS ---
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('intro'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'intro') {
      const timer = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'ocr' && scanComplete) {
       const overseasHoldings = data.user.holdings.overseas;
       
       const matches = ALL_STOCKS.filter(stock => 
          overseasHoldings.some(h => h.ticker === stock.ticker)
       );
       
       if (matches.length > 0) {
           setScannedStocks(matches);
       } else {
           setScannedStocks(ALL_STOCKS.slice(0, 3));
       }
    }
  }, [step, scanComplete, data.user.holdings]);

  // --- HANDLERS ---
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
    setStep('narrative'); // Changed from 'quiz' to 'narrative'
  };

  // Handler for Narrative Completion
  const handleNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    if (!selectedStock) return;

    const status = decision === 'Buy' ? 'Invested' : 'Watching';
    const amount = decision === 'Buy' ? '100만원 미만' : undefined;

    // 1. Save to Store immediately
    // Note: We pass empty array for logicIds as we are in narrative phase
    const newThesis = addToMyThesis(selectedStock, [], status, amount);
    
    // 2. Store locally to pass to parent later
    setFinalThesis(newThesis);

    // 3. Move to Permission
    setStep('permission');
  };

  const handleFinalComplete = () => {
    // Pass the finalThesis we created in the previous step
    if (finalThesis) {
        onComplete(finalThesis);
    } else {
        onComplete();
    }
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      
      {/* STEP 1: SPLASH */}
      {step === 'splash' && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-1000 text-center px-6">
          <div className="relative py-2">
            <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent leading-none pb-2">
              {TEXT.COMMON.APP_NAME}
            </h1>
          </div>
          <p className="text-xl text-zinc-400 mt-4 font-medium tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            {TEXT.ONBOARDING.SPLASH_TAGLINE}
          </p>
        </div>
      )}

      {/* STEP 2: INTRO CAROUSEL */}
      {step === 'intro' && (
        <div className="w-full h-full relative flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                <h1 className="text-4xl font-black leading-tight mb-6">
                  떨어질 땐 불안해서 팔고,<br/>
                  <span className="text-app-positive">오르면 후회</span>하지 않나요?
                </h1>
                <div className="w-full h-64 bg-gradient-to-br from-red-900/20 to-transparent rounded-3xl border border-red-500/20 flex items-center justify-center">
                  <span className="text-8xl">📉</span>
                </div>
              </div>
              
              <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                 <h1 className="text-4xl font-black leading-tight mb-6">
                  남들이 살 때 따라 사고<br/>
                  왜 샀는지 <span className="text-blue-400">설명할 수 없다면.</span>
                </h1>
                 <div className="w-full h-64 bg-gradient-to-br from-blue-900/20 to-transparent rounded-3xl border border-blue-500/20 flex items-center justify-center">
                  <span className="text-8xl">👂</span>
                </div>
              </div>
              
               <div className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8">
                 <h1 className="text-4xl font-black leading-tight mb-6">
                  당신의 직감을<br/>
                  <span className="text-app-accent">구체적인 '투자 가설'</span>로<br/>
                  설계합니다.
                </h1>
                 <div className="w-full h-64 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-3xl border border-app-accent/20 flex items-center justify-center">
                  <Layers size={100} className="text-app-accent opacity-80" />
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-32 left-0 right-0 flex justify-center space-x-2">
              {[0, 1, 2].map(idx => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${slideIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </div>

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

      {/* STEP 3: NAME */}
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
            {TEXT.COMMON.BTN_NEXT}
          </button>
        </div>
      )}

      {/* STEP 4: OCR */}
      {step === 'ocr' && (
        <div className="w-full h-full flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex-1 px-8 pt-24">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              복잡한 연동 없이,<br/>
              <span className="text-app-accent">스크린샷 한 장</span>으로 끝.
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              현재 포트폴리오를 분석해<br/>
              <span className="text-white font-bold">맞춤형 가설</span>을 세워드릴게요.
            </p>

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
              
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-app-accent absolute top-0 animate-[scan_2s_infinite_ease-in-out]" style={{ boxShadow: '0 0 20px #6366f1' }} />
                  <p className="text-app-accent font-bold animate-pulse">자산 분석 중...</p>
                </div>
              )}

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

      {/* STEP 5: STOCK SELECT */}
      {step === 'stock-select' && (
        <div className="w-full h-full flex flex-col px-6 pt-24 animate-in slide-in-from-right duration-300">
          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight mb-8">
              가설 검증을 시작해볼<br/>
              <span className="text-app-accent">첫 번째 종목</span>을 골라보세요.
              <span className="block text-base font-medium text-zinc-400 mt-3">
                하나씩 분석하다 보면 투자의 기준이 명확해질 거예요.
              </span>
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
                      {stock.changeRate < 0 ? '판매를 고민하고 계신가요?' : '수익 실현을 고민하시나요?'}
                    </div>
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: NARRATIVE (New) */}
      {step === 'narrative' && selectedStock && (
         <div className="fixed inset-0 z-[210] bg-[#121212] animate-in slide-in-from-right duration-300">
             <NarrativeIntro 
               stock={selectedStock}
               onComplete={handleNarrativeComplete}
               onClose={() => setStep('stock-select')}
             />
         </div>
      )}

      {/* STEP 7: PERMISSION */}
      {step === 'permission' && (
        <div className="w-full h-full flex flex-col px-8 pt-24 pb-12 animate-in slide-in-from-right duration-300 text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-8">
              <Bell size={40} className="text-app-accent" />
            </div>
            
            <h2 className="text-3xl font-bold leading-tight mb-4 whitespace-pre-line">
              {TEXT.ONBOARDING.PERMISSION_TITLE}
            </h2>
            <p className="text-zinc-400 text-lg">
              {TEXT.ONBOARDING.PERMISSION_DESC(data.user.name)}
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
