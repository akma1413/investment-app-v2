
import React, { useState } from 'react';
import { X, ArrowRight, Check, BookOpen } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

interface HypothesisBuilderProps {
  onClose: () => void;
}

const HypothesisBuilder: React.FC<HypothesisBuilderProps> = ({ onClose }) => {
  const { data } = useStore();
  const searchResult = data.discovery.searchResultSample;
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLogics, setSelectedLogics] = useState<number[]>([]);
  const [investmentType, setInvestmentType] = useState<'Watching' | 'Invested' | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string | null>(null);

  const toggleLogic = (id: number) => {
    if (selectedLogics.includes(id)) {
      setSelectedLogics(selectedLogics.filter(l => l !== id));
    } else {
      setSelectedLogics([...selectedLogics, id]);
    }
  };

  const handleFinish = () => {
    console.log("New Thesis Created:", {
      ticker: searchResult.ticker,
      logics: selectedLogics,
      status: investmentType,
      amount: investmentAmount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col animate-in fade-in duration-200">
      {/* Header */}
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* Step 1: Context Learning */}
        {step === 1 && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">이 기업,<br/>지금 어떤가요?</h1>
              <p className="text-lg text-app-text-secondary">애널리스트가 분석한 {searchResult.name}의 현황입니다.</p>
            </div>

            <div className="bg-app-surface p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{searchResult.ticker}</div>
                  <div className="text-base text-zinc-400">최근 3개월 추이</div>
                </div>
                <div className="text-2xl font-bold text-app-positive">+12.4%</div>
              </div>
              
              {/* Simple SVG Chart */}
              <div className="h-40 w-full mb-6 relative">
                 <svg viewBox="0 0 100 40" className="w-full h-full stroke-app-positive fill-none stroke-[2px] overflow-visible">
                   <path d="M0,35 Q20,38 40,25 T80,15 T100,5" strokeLinecap="round" strokeLinejoin="round" />
                   <circle cx="100" cy="5" r="3" className="fill-app-positive" />
                 </svg>
                 <div className="absolute top-0 right-0 bg-app-positive/10 text-app-positive text-xs font-bold px-3 py-1.5 rounded-full border border-app-positive/20">
                    반등 시작
                 </div>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl">
                <p className="text-base text-zinc-200 leading-relaxed">
                  "{searchResult.chartContext}"
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Summary</h3>
              <p className="text-lg text-zinc-300 leading-relaxed">
                {searchResult.summary}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Logic Block Stacking */}
        {step === 2 && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-300">
             <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">핵심 논리 선택</h1>
              <p className="text-lg text-app-text-secondary">이 기업에 투자해야 하는 이유를 골라주세요.</p>
            </div>

            <div className="space-y-4">
              {searchResult.availableLogicBlocks.map((logic) => {
                const isSelected = selectedLogics.includes(Number(logic.id));
                return (
                  <div 
                    key={logic.id}
                    onClick={() => toggleLogic(Number(logic.id))}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden ${isSelected ? 'border-app-accent bg-app-accent/10' : 'border-white/5 bg-app-surface hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`text-xl font-bold ${isSelected ? 'text-app-accent' : 'text-white'}`}>{logic.title}</h3>
                      {isSelected && <div className="bg-app-accent rounded-full p-1"><Check size={16} className="text-white" strokeWidth={3} /></div>}
                    </div>
                    <p className="text-base text-zinc-400 leading-snug">{logic.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Commitment */}
        {step === 3 && (
          <div className="p-6 space-y-10 animate-in slide-in-from-right duration-300">
            <div className="text-center mt-6">
              <BookOpen size={64} className="text-zinc-700 mx-auto mb-6" />
              <h1 className="text-3xl font-extrabold text-white mb-3">이 논리대로<br/>투자하셨나요?</h1>
              <p className="text-lg text-app-text-secondary">투자는 자신의 가설을 증명하는 과정입니다.</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button 
                onClick={() => setInvestmentType('Watching')}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-4 transition-all h-48 ${investmentType === 'Watching' ? 'border-zinc-400 bg-zinc-400/10' : 'border-white/5 bg-app-surface hover:bg-white/5'}`}
              >
                <span className="text-5xl">👀</span>
                <span className="font-bold text-white text-lg">지켜보는 중</span>
              </button>

              <button 
                onClick={() => setInvestmentType('Invested')}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-4 transition-all h-48 ${investmentType === 'Invested' ? 'border-app-accent bg-app-accent/10' : 'border-white/5 bg-app-surface hover:bg-white/5'}`}
              >
                <span className="text-5xl">💸</span>
                <span className="font-bold text-white text-lg">보유 중</span>
              </button>
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

      {/* Footer Actions */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-[#121212] border-t border-white/5 safe-area-bottom z-50">
        <button
          onClick={() => {
            if (step < 3) setStep((prev) => (prev + 1) as 1|2|3);
            else handleFinish();
          }}
          disabled={step === 2 && selectedLogics.length === 0}
          className="w-full h-14 bg-app-accent hover:bg-indigo-400 text-white text-lg font-bold rounded-2xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          <span>{step === 3 ? '가설 등록하기' : '다음'}</span>
          {step < 3 && <ArrowRight size={20} />}
        </button>
      </footer>
    </div>
  );
};

export default HypothesisBuilder;
