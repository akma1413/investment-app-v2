import React, { useState } from 'react';
import { X, Info, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SearchResultSample, Thesis } from '../../types';

interface WatchpointBuilderProps {
  stock: SearchResultSample | Thesis;
  onComplete: (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => void;
  onClose: () => void;
  skipIntro?: boolean;
}

const WatchpointBuilder: React.FC<WatchpointBuilderProps> = ({ stock, onComplete, onClose, skipIntro = false }) => {
  const watchpoints = stock.watchpoints || [];

  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, 'Bull' | 'Bear'>>({});

  const currentItem = watchpoints[currentIndex];
  const progress = watchpoints.length > 0 ? ((currentIndex + 1) / watchpoints.length) * 100 : 0;

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

  const isCurrentSelected = currentItem ? !!selections[currentItem.id] : false;

  // Empty state
  if (watchpoints.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900 to-black items-center justify-center px-8 text-center border-2 border-app-accent/30">
        <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <AlertCircle size={48} className="text-app-accent" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          왓치포인트가 아직 없습니다
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-10 text-base">
          이 종목에 대한 감시 기준이 아직 설정되지 않았습니다.<br />
          AI가 제안하는 기준을 추가하거나,<br />
          직접 만들어보세요.
        </p>
        <button
          onClick={() => {
            onComplete([]);
            onClose();
          }}
          className="px-10 py-4 bg-app-accent hover:bg-indigo-400 rounded-full text-white font-bold text-lg transition-all shadow-lg active:scale-95"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] relative font-sans">

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-300">
          <div className="w-24 h-24 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/10">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <CheckCircle2 size={48} className="text-[#6366F1] relative z-10" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-12 leading-snug">
            단순 등락 알림이 아닌,<br />
            <span className="text-[#818CF8]">사건 및 맥락 해설 알림</span>
          </h2>

          <div className="w-full space-y-3">
            <button
              onClick={() => setShowIntro(false)}
              className="w-full py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
            >
              핵심 포인트 잡아두기
            </button>

            <button
              onClick={() => {
                onComplete([]);
                onClose();
              }}
              className="w-full py-4 text-zinc-500 font-medium hover:text-zinc-300 transition-colors text-sm"
            >
              일단 넘어가기
            </button>
          </div>
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

        {/* Title Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
            {currentItem.title || `Point ${currentIndex + 1}`}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-black text-white leading-tight mb-8">
          {currentItem.question}
        </h2>

        {/* Context Box (Judgment Guide) */}
        <div className="mb-8 p-5 rounded-2xl bg-zinc-900/50 border border-white/10 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-zinc-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">판단 가이드</span>
          </div>
          <div className="text-zinc-300 text-sm leading-relaxed font-medium">
            <ReactMarkdown
              components={{
                strong: ({ node, ...props }) => <span className="text-white font-bold" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mt-2" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
              }}
            >
              {currentItem.context}
            </ReactMarkdown>
          </div>
        </div>

        {/* Related Articles & Reports Summary */}
        {currentItem.references && (
          <div className="mb-8 animate-in slide-in-from-bottom-3 delay-100">
            <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">
              관련 기사 및 리포트 요약
            </h3>

            <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/10 space-y-4">
              {/* Summaries */}
              <ul className="space-y-3">
                {currentItem.references.summaries.map((summary, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-indigo-400 mt-1.5">•</span>
                    <div className="flex-1">
                      <span className="leading-relaxed">
                        <ReactMarkdown
                          components={{
                            strong: ({ node, ...props }) => <span className="text-white font-bold" {...props} />
                          }}
                        >
                          {summary.text}
                        </ReactMarkdown>
                      </span>
                      <a
                        href={summary.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-zinc-400 hover:text-white transition-colors border border-white/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        원문 <ArrowRight size={8} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5 mt-2">
                {/* Pro */}
                <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-400">PROS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                    {currentItem.references.pros.text}
                  </p>
                  <a
                    href={currentItem.references.pros.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    원문 <ArrowRight size={8} />
                  </a>
                </div>

                {/* Con */}
                <div className="bg-rose-500/5 rounded-xl p-3 border border-rose-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-rose-400">CONS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                    {currentItem.references.cons.text}
                  </p>
                  <a
                    href={currentItem.references.cons.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-[10px] text-rose-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    원문 <ArrowRight size={8} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4 flex-1">
          {currentItem.options.map((option, idx) => {
            const isSelected = selections[currentItem.id] === option.side;
            const sideColor = option.side === 'Bull' ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400';
            const bgColor = option.side === 'Bull' ? 'bg-emerald-500/10' : 'bg-rose-500/10';
            const iconColor = option.side === 'Bull' ? 'bg-emerald-500' : 'bg-rose-500';

            return (
              <button
                key={idx}
                onClick={() => handleSelect(currentItem.id, option.side)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] relative overflow-hidden group
                     ${isSelected
                    ? `${sideColor} ${bgColor} shadow-lg`
                    : 'border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/5'
                  }
                   `}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <span className={`text-xs font-black uppercase tracking-wider mb-1 block ${isSelected ? 'opacity-100' : 'text-zinc-600'}`}>
                      {option.side === 'Bull' ? '긍정적 시나리오 (Bull)' : '부정적 시나리오 (Bear)'}
                    </span>
                    <span className={`text-lg font-bold block mb-1 ${isSelected ? 'text-white' : ''}`}>
                      {option.label}
                    </span>
                    {option.implications && (
                      <span className={`text-xs block transition-opacity ${isSelected ? 'opacity-80 text-white' : 'text-zinc-500'}`}>
                        👉 {option.implications}
                      </span>
                    )}
                  </div>
                  <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? `${iconColor} border-transparent` : 'border-zinc-700'
                    }`}>
                    {isSelected && <CheckCircle2 size={16} className="text-black" strokeWidth={3} />}
                  </div>
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
          className="w-full py-4 bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-2xl text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <span>{currentIndex === watchpoints.length - 1 ? "알림 설정 완료" : "다음"}</span>
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default WatchpointBuilder;
