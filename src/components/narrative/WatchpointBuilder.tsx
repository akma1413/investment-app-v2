
import React, { useState, useEffect } from 'react';
import { X, Info, ArrowRight, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { SearchResultSample, Thesis, Watchpoint } from '../../types';

interface WatchpointBuilderProps {
  stock: SearchResultSample | Thesis;
  onComplete: (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => void;
  onClose: () => void;
}

const WatchpointBuilder: React.FC<WatchpointBuilderProps> = ({ stock, onComplete, onClose }) => {
  const watchpoints = stock.watchpoints || [];
  
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, 'Bull' | 'Bear'>>({});
  
  const currentItem = watchpoints[currentIndex];
  const progress = ((currentIndex + 1) / watchpoints.length) * 100;

  const handleSelect = (watchpointId: number, side: 'Bull' | 'Bear') => {
    setSelections(prev => ({
      ...prev,
      [watchpointId]: side
    }));
  };

  const handleNext = () => {
    if (currentIndex < watchpoints.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish
      const result = Object.entries(selections).map(([id, side]) => ({
        watchpointId: Number(id),
        side
      }));
      onComplete(result);
    }
  };

  const isCurrentSelected = !!selections[currentItem.id];

  // If no watchpoints, skip directly
  useEffect(() => {
      if (watchpoints.length === 0) {
          onComplete([]);
      }
  }, [watchpoints, onComplete]);

  if (watchpoints.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-[#121212] relative">
      
      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-300">
           <div className="w-20 h-20 bg-app-accent/10 rounded-full flex items-center justify-center mb-6">
             <Info size={40} className="text-app-accent" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-4">
             이 종목의 운명을 가를<br/>
             <span className="text-app-accent">핵심 변수</span>를 정해주세요.
           </h2>
           <p className="text-zinc-400 mb-10 leading-relaxed">
             설정하신 조건이 충족되거나 깨질 때만<br/>
             똑똑하게 알림을 보내드립니다.
           </p>
           <button 
             onClick={() => setShowIntro(false)}
             className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
           >
             시작하기
           </button>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 pt-6 border-b border-white/5 flex justify-between items-center bg-[#121212]">
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-500">관전 포인트 설정</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white">
                {currentIndex + 1}/{watchpoints.length}
            </span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-800">
         <div className="h-full bg-app-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Content (Slider Area) */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
         
         {/* Context Box (CRITICAL) */}
         <div className="mb-8 p-5 rounded-2xl bg-zinc-900 border-l-4 border-app-accent animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
               <AlertCircle size={16} className="text-app-accent" />
               <span className="text-xs font-bold text-app-accent uppercase">Why it matters</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
               {currentItem.context}
            </p>
         </div>

         {/* Question */}
         <h2 className="text-2xl font-black text-white leading-tight mb-8">
            {currentItem.question}
         </h2>

         {/* Options */}
         <div className="space-y-4 flex-1">
            {currentItem.options.map((option, idx) => {
               const isSelected = selections[currentItem.id] === option.side;
               const sideColor = option.side === 'Bull' ? 'border-app-positive text-app-positive' : 'border-blue-400 text-blue-400';
               const bgColor = option.side === 'Bull' ? 'bg-app-positive/10' : 'bg-blue-400/10';

               return (
                 <button
                   key={idx}
                   onClick={() => handleSelect(currentItem.id, option.side)}
                   className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] relative overflow-hidden
                     ${isSelected 
                        ? `${sideColor} ${bgColor} shadow-lg` 
                        : 'border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/5'
                     }
                   `}
                 >
                   <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className={`text-xs font-black uppercase tracking-wider mb-1 block ${isSelected ? '' : 'text-zinc-600'}`}>
                            {option.side}
                        </span>
                        <span className={`text-lg font-bold block ${isSelected ? 'text-white' : ''}`}>
                            {option.label}
                        </span>
                        {option.implications && isSelected && (
                            <span className="text-xs mt-2 block opacity-80">
                                👉 {option.implications}
                            </span>
                        )}
                      </div>
                      {isSelected && (
                          <div className={`p-1 rounded-full ${option.side === 'Bull' ? 'bg-app-positive' : 'bg-blue-400'} text-black`}>
                              <CheckCircle2 size={16} strokeWidth={3} />
                          </div>
                      )}
                   </div>
                 </button>
               );
            })}
         </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#121212] safe-area-bottom">
         <button 
           onClick={handleNext}
           disabled={!isCurrentSelected}
           className="w-full py-4 bg-app-accent disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
         >
           <span>{currentIndex === watchpoints.length - 1 ? "설정 완료" : "다음"}</span>
           <ArrowRight size={20} />
         </button>
      </div>

    </div>
  );
};

export default WatchpointBuilder;
