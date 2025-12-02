import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ChevronRight, TrendingUp, ShieldCheck, Zap, Scale, Gavel, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SearchResultSample, Thesis } from '../../types';

interface NarrativeIntroProps {
  stock: SearchResultSample | Thesis;
  onComplete: (decision: 'Buy' | 'Watch') => void;
  onClose: () => void;
}

const STEPS = [
  { id: 'history', title: 'Why Now?', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'floor', title: 'The Floor', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'upside', title: 'The Upside', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'debate', title: 'Debate', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'final', title: 'Final Bet', icon: Gavel, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const NarrativeIntro: React.FC<NarrativeIntroProps> = ({ stock, onComplete, onClose }) => {
  const { narrative } = stock;
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  if (!narrative || !narrative.steps) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalDecision = (decision: 'Buy' | 'Watch') => {
    console.log('NarrativeIntro: handleFinalDecision called with', decision);
    onComplete(decision);
  };

  const renderStepContent = () => {
    const stepId = STEPS[currentStep].id;

    // Common Markdown Components
    const mdComponents = {
      p: ({ node, ...props }: any) => <p className="text-zinc-300 leading-relaxed mb-4 text-lg" {...props} />,
      strong: ({ node, ...props }: any) => <strong className="text-white font-bold" {...props} />,
      ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-4 space-y-2 text-zinc-300" {...props} />,
      li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
    };

    switch (stepId) {
      case 'history':
        return (
          <div className="animate-in slide-in-from-right duration-500 fade-in">
            <h2 className="text-3xl font-black text-white mb-6 leading-tight">{narrative.steps.history.title}</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={mdComponents}>{narrative.steps.history.content}</ReactMarkdown>
            </div>
          </div>
        );
      case 'floor':
        return (
          <div className="animate-in slide-in-from-right duration-500 fade-in">
            <h2 className="text-3xl font-black text-white mb-6 leading-tight">{narrative.steps.floor.title}</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={mdComponents}>{narrative.steps.floor.content}</ReactMarkdown>
            </div>
          </div>
        );
      case 'upside':
        return (
          <div className="animate-in slide-in-from-right duration-500 fade-in">
            <h2 className="text-3xl font-black text-white mb-6 leading-tight">{narrative.steps.upside.title}</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={mdComponents}>{narrative.steps.upside.content}</ReactMarkdown>
            </div>
          </div>
        );
      case 'debate':
        return (
          <div className="animate-in slide-in-from-right duration-500 fade-in">
            <h2 className="text-2xl font-black text-white mb-2 leading-tight">{narrative.steps.debate.title}</h2>
            <h3 className="text-xl font-bold text-zinc-400 mb-8 italic">"{narrative.steps.debate.question}"</h3>

            <div className="space-y-6">
              {/* Bulls */}
              <div className="bg-[#1E1E1E] rounded-2xl p-5 border-l-4 border-emerald-500">
                <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <TrendingUp size={18} /> 긍정적 시그널 (Bullish)
                </h4>
                <div className="space-y-3">
                  {narrative.steps.debate.bulls.map((bull, idx) => (
                    <div key={idx}>
                      {bull.items.map((item, i) => (
                        <div key={i} className="text-zinc-300 text-sm mb-2 last:mb-0">
                          <ReactMarkdown components={{ strong: ({ node, ...props }: any) => <span className="text-emerald-200 font-bold" {...props} /> }}>
                            {item}
                          </ReactMarkdown>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bears */}
              <div className="bg-[#1E1E1E] rounded-2xl p-5 border-l-4 border-rose-500">
                <h4 className="text-rose-400 font-bold mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} /> 부정적 시그널 (Bearish)
                </h4>
                <div className="space-y-3">
                  {narrative.steps.debate.bears.map((bear, idx) => (
                    <div key={idx}>
                      {bear.items.map((item, i) => (
                        <div key={i} className="text-zinc-300 text-sm mb-2 last:mb-0">
                          <ReactMarkdown components={{ strong: ({ node, ...props }: any) => <span className="text-rose-200 font-bold" {...props} /> }}>
                            {item}
                          </ReactMarkdown>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'final':
        return (
          <div className="animate-in slide-in-from-right duration-500 fade-in pb-20">
            <h2 className="text-3xl font-black text-white mb-6 leading-tight">{narrative.steps.final.title}</h2>
            <div className="prose prose-invert max-w-none mb-8">
              <ReactMarkdown components={mdComponents}>{narrative.steps.final.content}</ReactMarkdown>
            </div>

            <div className="space-y-4">
              {narrative.steps.final.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFinalDecision(option.value)}
                  className={`w-full p-5 rounded-2xl text-left transition-all border-2 group relative overflow-hidden ${option.value === 'Buy'
                    ? 'bg-indigo-600/10 border-indigo-500 hover:bg-indigo-600/20'
                    : 'bg-zinc-800/50 border-zinc-600 hover:bg-zinc-800'
                    }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-lg font-black ${option.value === 'Buy' ? 'text-indigo-400' : 'text-zinc-400'}`}>
                        {option.label}
                      </span>
                      {option.value === 'Buy' && <CheckCircle2 className="text-indigo-400" size={24} />}
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      {option.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const CurrentIcon = STEPS[currentStep].icon;

  return (
    <div className="flex flex-col h-full bg-[#121212] relative font-sans">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-[#121212]/95 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
            <X size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Investment Thesis</span>
            <span className="text-sm font-bold text-white">{stock.name}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? `w-8 ${step.bg.replace('/10', '')}` :
                idx < currentStep ? 'w-4 bg-zinc-600' : 'w-4 bg-zinc-800'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto no-scrollbar p-6 relative"
      >
        {/* Step Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${STEPS[currentStep].bg} ${STEPS[currentStep].color} text-xs font-bold mb-6`}>
          <CurrentIcon size={14} />
          <span>Step {currentStep + 1}. {STEPS[currentStep].title}</span>
        </div>

        {renderStepContent()}
      </div>

      {/* Footer Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div className="p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent z-20">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-zinc-100"
          >
            <span>다음으로</span>
            <ArrowRight size={20} />
          </button>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="w-full mt-3 py-2 text-zinc-500 text-sm font-medium hover:text-zinc-300"
            >
              이전 단계로
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NarrativeIntro;
