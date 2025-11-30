
import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Shield, Rocket, Clock, MessageSquareQuote, Check, Search } from 'lucide-react';
import { SearchResultSample, Thesis } from '../../types';

interface NarrativeIntroProps {
  stock: SearchResultSample | Thesis;
  onComplete: (decision: 'Buy' | 'Watch') => void;
  onClose: () => void;
}

const NarrativeIntro: React.FC<NarrativeIntroProps> = ({ stock, onComplete, onClose }) => {
  const { narrative } = stock;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!narrative) return null;

  return (
    <div className="flex flex-col h-full bg-[#121212] relative">
      {/* Header / Nav */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full bg-black/20 backdrop-blur-md text-white/80 hover:text-white border border-white/5">
          <X size={24} />
        </button>
        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-zinc-300">
          Phase 1. 스토리 읽기
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 1. Hero / Summary */}
        <section className={`min-h-[80vh] flex flex-col justify-center px-8 relative border-b border-white/5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
           <div className="mb-6">
             <span className="text-zinc-500 font-bold text-lg tracking-wider">{stock.ticker}</span>
             <h1 className="text-5xl font-black text-white mt-1 leading-tight">{stock.name}</h1>
           </div>
           
           <div className="relative">
             <MessageSquareQuote size={48} className="text-app-accent/20 absolute -top-6 -left-4" />
             <p className="text-2xl font-bold text-zinc-200 leading-relaxed relative z-10 whitespace-pre-line">
               "{narrative.summary}"
             </p>
           </div>
           
           <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-50">
             <div className="flex flex-col items-center gap-2">
               <span className="text-xs text-zinc-500">아래로 스크롤하여 분석 보기</span>
               <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
             </div>
           </div>
        </section>

        {/* 2. Why Now */}
        <section className="py-20 px-6 border-b border-white/5 bg-zinc-900/30">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
               <Clock size={24} />
             </div>
             <h2 className="text-2xl font-black text-white">Why Now?</h2>
           </div>
           <p className="text-lg text-zinc-300 leading-relaxed font-medium">
             {narrative.whyNow}
           </p>
        </section>

        {/* 3. The Floor & Upside (Grid) */}
        <section className="py-20 px-6 border-b border-white/5">
           <div className="space-y-12">
             {/* Floor */}
             <div className="animate-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                   <Shield size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white">The Floor (지지선)</h3>
               </div>
               <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5">
                 <p className="text-zinc-300 leading-relaxed">
                   {narrative.floor}
                 </p>
               </div>
             </div>

             {/* Upside */}
             <div className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-app-positive/10 flex items-center justify-center text-app-positive">
                   <Rocket size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white">The Upside (성장성)</h3>
               </div>
               <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5">
                 <p className="text-zinc-300 leading-relaxed">
                   {narrative.upside}
                 </p>
               </div>
             </div>
           </div>
        </section>

        {/* 4. The Debate */}
        <section className="py-20 px-6 bg-zinc-900/30 border-b border-white/5">
           <h2 className="text-2xl font-black text-white mb-8">핵심 논쟁 (Debate)</h2>
           <div className="grid gap-4">
              {narrative.debate.map((point, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-black border border-white/10 flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${idx % 2 === 0 ? 'bg-app-positive' : 'bg-blue-400'}`} />
                  <p className="text-zinc-300 font-medium leading-relaxed">{point}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 5. The Bet (Decision) */}
        <section className="py-24 px-6 flex flex-col items-center text-center">
           <span className="text-app-accent font-bold tracking-widest text-sm mb-4">FINAL QUESTION</span>
           <h2 className="text-3xl font-black text-white leading-tight mb-12">
             {narrative.theBet}
           </h2>

           <div className="w-full space-y-4">
             <button 
               onClick={() => onComplete('Buy')}
               className="w-full py-5 bg-white text-black rounded-2xl text-xl font-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               <Check size={24} strokeWidth={3} />
               <span>그렇다 (가설 수립)</span>
             </button>
             
             <button 
               onClick={() => onComplete('Watch')}
               className="w-full py-5 bg-[#1E1E1E] border border-white/10 text-zinc-400 rounded-2xl text-xl font-bold hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               <Search size={24} />
               <span>아직 모르겠다 (관망)</span>
             </button>
           </div>
           
           <p className="mt-6 text-xs text-zinc-600">
             선택하신 판단을 바탕으로 감시할 지표를 설정합니다.
           </p>
        </section>

      </div>
    </div>
  );
};

export default NarrativeIntro;
