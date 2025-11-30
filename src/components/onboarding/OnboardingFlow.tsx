import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, Layers } from 'lucide-react';
import { useStore, ALL_STOCKS } from '../../contexts/StoreContext';
import { SearchResultSample, Thesis } from '../../types';
import { TEXT } from '../../constants/text';
import NarrativeIntro from '../narrative/NarrativeIntro';

interface OnboardingFlowProps {
  onComplete: (stock?: Thesis) => void;
}

type Step = 'splash' | 'intro' | 'name' | 'ocr' | 'stock-select' | 'narrative' | 'permission';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState("");
  const { data, updateUserName, addToMyThesis } = useStore();
  
  const [slideIndex, setSlideIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedStocks, setScannedStocks] = useState<SearchResultSample[]>([]);
  const [selectedStock, setSelectedStock] = useState<SearchResultSample | null>(null);
  const [finalThesis, setFinalThesis] = useState<Thesis | undefined>(undefined);

  useEffect(() => {
    if (step === 'splash') { const timer = setTimeout(() => setStep('intro'), 2500); return () => clearTimeout(timer); }
  }, [step]);
  useEffect(() => {
    if (step === 'intro') { const timer = setInterval(() => setSlideIndex(prev => (prev + 1) % 3), 4000); return () => clearTimeout(timer); }
  }, [step]);

  useEffect(() => {
    if (step === 'ocr' && scanComplete) {
       const allHoldings = [...data.user.holdings.domestic, ...data.user.holdings.overseas];
       const matches = ALL_STOCKS.filter(stock => 
          allHoldings.some(h => h.ticker === stock.ticker)
       );
       setScannedStocks(matches.length > 0 ? matches : ALL_STOCKS.slice(0, 3));
    }
  }, [step, scanComplete, data.user.holdings]);

  const handleNameSubmit = () => { if (name.trim().length > 0) { updateUserName(name); setStep('ocr'); } };
  
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => { setIsScanning(false); setScanComplete(true); setTimeout(() => setStep('stock-select'), 1200); }, 2000);
  };

  const handleStockSelect = (stock: SearchResultSample) => {
    setSelectedStock(stock);
    setStep('narrative'); 
  };

  const handleNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    if (!selectedStock) return;
    const status = decision === 'Buy' ? 'Invested' : 'Watching';
    const newThesis = addToMyThesis(selectedStock, [], status);
    setFinalThesis(newThesis);
    setStep('permission');
  };

  const handleFinalComplete = () => {
    onComplete(finalThesis); 
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {step === 'splash' && (
        <div className="text-center"><h1 className="text-7xl font-black text-indigo-500">{TEXT.COMMON.APP_NAME}</h1></div>
      )}

      {step === 'intro' && (
         <div className="w-full h-full flex flex-col justify-end p-6 bg-[#121212]">
            <div className="flex-1 flex flex-col justify-center px-6"><h1 className="text-4xl font-black">감이 아닌,<br/><span className="text-indigo-500">논리로.</span></h1></div>
            <button onClick={() => setStep('name')} className="w-full h-14 bg-white text-black font-bold rounded-2xl">시작하기</button>
         </div>
      )}

      {step === 'name' && (
        <div className="w-full h-full px-8 pt-24 pb-8 flex flex-col">
           <h2 className="text-3xl font-bold mb-8">닉네임을 입력해주세요.</h2>
           <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-b-2 text-3xl font-bold py-2 outline-none" autoFocus />
           <div className="flex-1"/>
           <button onClick={handleNameSubmit} disabled={name.length === 0} className="w-full h-14 bg-indigo-500 text-white font-bold rounded-2xl">다음</button>
        </div>
      )}

      {step === 'ocr' && (
         <div className="w-full h-full flex flex-col px-8 pt-24 pb-8">
            <h2 className="text-3xl font-bold mb-8">포트폴리오 스캔</h2>
            <div className="flex-1 bg-zinc-800 rounded-3xl flex items-center justify-center border border-white/10">
                {isScanning ? <span className="animate-pulse text-indigo-500">분석 중...</span> : scanComplete ? <Check size={40} className="text-white"/> : <Camera size={40} className="text-zinc-600"/>}
            </div>
            <div className="h-8"/>
            <button onClick={handleScan} className="w-full h-14 bg-white text-black font-bold rounded-2xl">이미지 업로드</button>
         </div>
      )}

      {step === 'stock-select' && (
        <div className="w-full h-full flex flex-col px-6 pt-24">
          <h2 className="text-3xl font-bold mb-8">첫 번째 분석 종목 선택</h2>
          <div className="space-y-4">
              {scannedStocks.map(stock => (
                  <button key={stock.ticker} onClick={() => handleStockSelect(stock)} className="w-full bg-[#1E1E1E] p-6 rounded-3xl border border-white/5 text-left hover:border-indigo-500">
                    <div className="flex justify-between"><span className="text-2xl font-bold">{stock.name}</span><span className={stock.changeRate>0?'text-red-400':'text-blue-400'}>{stock.changeRate}%</span></div>
                  </button>
              ))}
          </div>
        </div>
      )}

      {step === 'narrative' && selectedStock && (
         <div className="fixed inset-0 z-[210] bg-[#121212]">
             <NarrativeIntro stock={selectedStock} onComplete={handleNarrativeComplete} onClose={() => setStep('stock-select')} />
         </div>
      )}

      {step === 'permission' && (
        <div className="w-full h-full flex flex-col px-8 pt-24 pb-12 text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Bell size={48} className="text-indigo-500 mb-6" />
            <h2 className="text-3xl font-bold">{TEXT.ONBOARDING.PERMISSION_TITLE}</h2>
          </div>
          <button onClick={handleFinalComplete} className="w-full h-14 bg-indigo-500 text-white font-bold rounded-2xl">완료하고 시작하기</button>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;