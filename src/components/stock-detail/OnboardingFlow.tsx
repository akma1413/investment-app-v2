import React, { useState, useEffect } from 'react';
import { Camera, Bell, Check, Layers } from 'lucide-react';
import { useStore, ALL_STOCKS } from '../../contexts/StoreContext';
import { SearchResultSample, Thesis } from '../../types';
import { TEXT } from '../../constants/text';
import NarrativeIntro from '../narrative/NarrativeIntro';
import WatchpointBuilder from '../narrative/WatchpointBuilder';

interface OnboardingFlowProps {
  onComplete: (stock?: Thesis) => void;
}

type Step = 'splash' | 'intro' | 'name' | 'ocr' | 'stock-select' | 'narrative' | 'alert-setup' | 'watchpoint' | 'permission';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState("");
  const { data, updateUserName, addToMyThesis } = useStore();

  const [slideIndex, setSlideIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isDirectInput, setIsDirectInput] = useState(false);
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

    setStep('watchpoint');
  };

  const handleWatchpointComplete = (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => {
    if (!selectedStock || !finalThesis) return;

    // Update the thesis with the original watchpoints (assuming we enable all if the flow is completed)
    // We could also store the specific Bull/Bear selections if the data model supported it, 
    // but for now ensuring the watchpoints are present is the priority.
    const updatedThesis = addToMyThesis(
      selectedStock,
      selectedStock.watchpoints, // Save the actual watchpoints
      finalThesis.status // Keep existing status
    );

    setFinalThesis(updatedThesis);
    handleFinalComplete(updatedThesis);
  };

  const handleFinalComplete = (thesis?: Thesis) => {
    onComplete(thesis || finalThesis);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {step === 'splash' && (
        <div className="text-center">
          <h1 className="text-7xl font-black text-indigo-500 mb-4">{TEXT.COMMON.APP_NAME}</h1>
          <p className="text-zinc-400 text-lg font-medium animate-pulse">나만의 투자 논리를 쉽게 만들고, 알림 받기</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full h-full flex flex-col justify-end p-6 bg-[#121212]">
          <div className="flex-1 flex flex-col justify-center px-6">
            <h1 className="text-4xl font-black leading-tight">
              자극과 충동이 아닌,<br />
              <span className="text-indigo-500">정보와 근거 기반으로.</span>
            </h1>
          </div>
          <button onClick={() => setStep('name')} className="w-full h-14 bg-white text-black font-bold rounded-2xl">시작하기</button>
        </div>
      )}

      {step === 'name' && (
        <div className="w-full h-full px-8 pt-24 pb-8 flex flex-col">
          <h2 className="text-3xl font-bold mb-8">닉네임을 입력해주세요.</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-b-2 text-3xl font-bold py-2 outline-none" autoFocus />
          <div className="flex-1" />
          <button onClick={handleNameSubmit} disabled={name.length === 0} className="w-full h-14 bg-indigo-500 text-white font-bold rounded-2xl">다음</button>
        </div>
      )}

      {step === 'ocr' && (
        <div className="w-full h-full flex flex-col px-6 pt-24 pb-8">
          <h2 className="text-3xl font-bold mb-2">포트폴리오 스캔</h2>
          <p className="text-zinc-400 mb-8">사용하시는 MTS의 투자 현황 스크린샷을 올려주세요.</p>

          <div className="flex-1 bg-zinc-900 rounded-3xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="animate-pulse text-indigo-500 font-bold">자산 분석 중...</span>
              </div>
            ) : scanComplete ? (
              <div className="w-full h-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-zinc-400 text-sm font-bold mb-1">총 보유자산</h3>
                    <div className="text-3xl font-black text-white">26,403,757원</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'JYP Ent.', ticker: '035900', price: '58,200원', profit: '-1.3%', isPlus: false },
                    { name: '팔란티어', ticker: 'PLTR', price: '34,150원', profit: '+16.0%', isPlus: true },
                    { name: '엔비디아', ticker: 'NVDA', price: '1,280,000원', profit: '+85.0%', isPlus: true },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs">
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-xs text-zinc-500">{item.ticker}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{item.price}</div>
                        <div className={`text-xs font-bold ${item.isPlus ? 'text-red-400' : 'text-blue-400'}`}>{item.profit}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Check size={16} />
                    <span>인식 완료</span>
                  </div>
                </div>
              </div>
            ) : isDirectInput ? (
              <div className="w-full h-full p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6">직접 입력하기</h3>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs text-zinc-500 font-bold block mb-1.5">종목명 (필수)</label>
                    <input type="text" placeholder="예: 삼성전자, 테슬라" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-bold block mb-1.5">보유주식수 (선택)</label>
                    <input type="number" placeholder="0" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
                <button onClick={handleScan} className="w-full h-12 bg-indigo-500 text-white font-bold rounded-xl mt-4">
                  입력 완료
                </button>
                <button onClick={() => setIsDirectInput(false)} className="w-full h-12 text-zinc-500 font-bold rounded-xl mt-2">
                  취소
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-600">
                <Camera size={48} className="mb-4 opacity-50" />
                <span className="text-sm">스크린샷 또는 사진 업로드</span>
              </div>
            )}
          </div>
          <div className="h-4" />

          {!isDirectInput && !scanComplete && !isScanning && (
            <>
              <button onClick={handleScan} className="w-full h-14 bg-white text-black font-bold rounded-2xl mb-3">
                이미지 업로드
              </button>
              <button onClick={() => setIsDirectInput(true)} className="w-full h-14 bg-zinc-800 text-white font-bold rounded-2xl border border-white/10">
                직접 입력하기
              </button>
            </>
          )}

          {scanComplete && (
            <button onClick={handleScan} className="w-full h-14 bg-white text-black font-bold rounded-2xl mt-4">
              분석 결과 확인
            </button>
          )}
        </div>
      )}

      {step === 'stock-select' && (
        <div className="w-full h-full flex flex-col px-6 pt-24">
          <h2 className="text-3xl font-bold mb-8">첫 번째 분석 종목 선택</h2>
          <div className="space-y-4">
            {scannedStocks.map(stock => (
              <button key={stock.ticker} onClick={() => handleStockSelect(stock)} className="w-full bg-[#1E1E1E] p-6 rounded-3xl border border-white/5 text-left hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold block mb-1">{stock.name}</span>
                    <span className="text-sm text-zinc-500 font-medium">{stock.ticker}</span>
                  </div>
                  <span className={`text-lg font-bold ${stock.changeRate > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'narrative' && selectedStock && (
        <div className="absolute inset-0 z-[210] bg-[#121212]">
          <NarrativeIntro stock={selectedStock} onComplete={handleNarrativeComplete} onClose={() => setStep('stock-select')} />
        </div>
      )}

      {step === 'watchpoint' && selectedStock && (
        <div className="absolute inset-0 z-[220] bg-[#121212]">
          <WatchpointBuilder
            stock={selectedStock}
            onClose={() => handleFinalComplete()}
            onComplete={(selections) => handleWatchpointComplete(selections)}
          />
        </div>
      )}


    </div>
  );
};

export default OnboardingFlow;