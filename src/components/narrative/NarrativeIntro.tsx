
import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Info, TrendingUp, Check, Edit3, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SearchResultSample, Thesis } from '../../types';

interface NarrativeIntroProps {
  stock: SearchResultSample | Thesis;
  onComplete: (decision: 'Buy' | 'Watch') => void;
  onClose: () => void;
}

const NarrativeIntro: React.FC<NarrativeIntroProps> = ({ stock, onComplete, onClose }) => {
  const { narrative } = stock;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isWhyImportantExpanded, setIsWhyImportantExpanded] = useState(false);
  const [isCurrentSituationExpanded, setIsCurrentSituationExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!narrative) return null;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowCustomInput(false);
    setCustomAnswer('');
  };

  const handleCustomAnswerClick = () => {
    setShowCustomInput(true);
    setSelectedAnswer(null);
  };

  const handleProceed = () => {
    if (selectedAnswer || (showCustomInput && customAnswer.trim())) {
      // User has made a choice (either fixed answer or custom)
      onComplete('Buy');
    }
  };

  const canProceed = selectedAnswer !== null || (showCustomInput && customAnswer.trim().length > 0);

  return (
    <div className="flex flex-col h-full bg-[#121212] relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full bg-black/20 backdrop-blur-md text-white/80 hover:text-white border border-white/5">
          <X size={24} />
        </button>
        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-zinc-300">
          Phase 1. 핵심 질문 이해하기
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">

        {/* 1. Question Hero + Tags */}
        <section className={`min-h-[80vh] flex flex-col justify-center px-8 relative border-b border-white/5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-6">
            <span className="text-zinc-500 font-bold text-lg tracking-wider">{stock.ticker}</span>
            <h1 className="text-5xl font-black text-white mt-1 leading-tight">{stock.name}</h1>
          </div>

          {/* Tags */}
          {narrative.tags && narrative.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {narrative.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-app-accent/10 border border-app-accent/30 text-app-accent text-sm font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Main Question */}
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-app-accent to-transparent rounded-full"></div>
            <h2 className="text-3xl font-black text-white leading-tight pl-6">
              {narrative.question}
            </h2>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-50">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-zinc-500">아래로 스크롤하여 분석 보기</span>
              <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* 2. Why Important */}
        <section className="py-20 px-6 border-b border-white/5 bg-zinc-900/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">왜 중요한가?</h2>
          </div>

          {/* Summary - Clickable Toggle */}
          <button
            onClick={() => setIsWhyImportantExpanded(!isWhyImportantExpanded)}
            className="w-full mb-6 p-4 rounded-2xl bg-blue-500/5 border-l-4 border-blue-400 hover:bg-blue-500/10 transition-all text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-bold text-blue-100 leading-relaxed flex-1">
                {narrative.description.why_important.summary}
              </p>
              <ChevronDown
                size={24}
                className={`text-blue-400 shrink-0 transition-transform duration-300 ${
                  isWhyImportantExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Detailed Content with Markdown - Expandable */}
          {isWhyImportantExpanded && (
            <div className="prose prose-invert prose-lg max-w-none animate-in slide-in-from-top-4 duration-300">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="text-zinc-300 leading-relaxed mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="text-blue-300" {...props} />,
                }}
              >
                {narrative.description.why_important.content}
              </ReactMarkdown>
            </div>
          )}
        </section>

        {/* 3. Current Situation */}
        <section className="py-20 px-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">현재 상황</h2>
          </div>

          {/* Summary - Clickable Toggle */}
          <button
            onClick={() => setIsCurrentSituationExpanded(!isCurrentSituationExpanded)}
            className="w-full mb-6 p-4 rounded-2xl bg-emerald-500/5 border-l-4 border-emerald-400 hover:bg-emerald-500/10 transition-all text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-bold text-emerald-100 leading-relaxed flex-1">
                {narrative.description.current_situation.summary}
              </p>
              <ChevronDown
                size={24}
                className={`text-emerald-400 shrink-0 transition-transform duration-300 ${
                  isCurrentSituationExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Detailed Content with Markdown - Expandable */}
          {isCurrentSituationExpanded && (
            <div className="prose prose-invert prose-lg max-w-none animate-in slide-in-from-top-4 duration-300">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="text-zinc-300 leading-relaxed mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="text-emerald-300" {...props} />,
                }}
              >
                {narrative.description.current_situation.content}
              </ReactMarkdown>
            </div>
          )}
        </section>

        {/* 4. Answer Selection */}
        <section className="py-24 px-6 flex flex-col">
          <div className="text-center mb-8">
            <span className="text-app-accent font-bold tracking-widest text-sm mb-4 block">YOUR ANSWER</span>
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              당신의 생각은?
            </h2>
            <p className="text-zinc-400 text-sm">
              아래 선택지 중 하나를 선택하거나, 직접 입력해주세요.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Fixed Answer Choices */}
            {narrative.answer_choices && narrative.answer_choices.map((choice, idx) => {
              const isSelected = selectedAnswer === choice;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(choice)}
                  className={`w-full p-6 rounded-2xl text-left transition-all border-2 ${
                    isSelected
                      ? 'bg-app-accent/10 border-app-accent text-white shadow-lg'
                      : 'bg-[#1E1E1E] border-white/10 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-app-accent bg-app-accent' : 'border-zinc-600'
                    }`}>
                      {isSelected && <Check size={16} strokeWidth={3} className="text-black" />}
                    </div>
                    <div className="flex-1">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-black text-white" {...props} />,
                        }}
                      >
                        {choice}
                      </ReactMarkdown>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Custom Input Option */}
            <button
              onClick={handleCustomAnswerClick}
              className={`w-full p-6 rounded-2xl text-left transition-all border-2 ${
                showCustomInput
                  ? 'bg-purple-500/10 border-purple-400 text-white'
                  : 'bg-[#1E1E1E] border-white/10 text-zinc-300 hover:border-white/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  showCustomInput ? 'border-purple-400 bg-purple-400' : 'border-zinc-600'
                }`}>
                  {showCustomInput && <Edit3 size={16} strokeWidth={3} className="text-black" />}
                </div>
                <div className="flex-1">
                  <span className="font-bold">직접 입력하기</span>
                  <p className="text-sm text-zinc-500 mt-1">나만의 생각을 작성해보세요.</p>
                </div>
              </div>
            </button>

            {/* Custom Input Field */}
            {showCustomInput && (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <textarea
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder="당신의 생각을 자유롭게 작성해주세요..."
                  className="w-full p-4 rounded-2xl bg-black border-2 border-purple-400/50 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 resize-none"
                  rows={4}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`w-full py-5 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-2 ${
              canProceed
                ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>다음 단계로</span>
            <ArrowRight size={24} strokeWidth={3} />
          </button>

          <p className="mt-6 text-xs text-zinc-600 text-center">
            선택하신 판단을 바탕으로 감시할 지표를 설정합니다.
          </p>
        </section>

      </div>
    </div>
  );
};

export default NarrativeIntro;
