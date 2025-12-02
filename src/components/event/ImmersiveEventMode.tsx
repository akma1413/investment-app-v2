import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Event, Watchpoint } from '../../types';
import ReactMarkdown from 'react-markdown';

interface ImmersiveEventModeProps {
  event: Event;
  relatedWatchpoint?: Watchpoint;
  onClose: () => void;
  onComplete: (decision: 'buy' | 'hold' | 'sell') => void;
}

export const ImmersiveEventMode: React.FC<ImmersiveEventModeProps> = ({
  event,
  relatedWatchpoint,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Step 1: Fact Check
  const renderStep1 = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <span className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Step 1. 팩트 체크</span>
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
        </motion.div>

        {relatedWatchpoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <div className="text-left space-y-2">
              <span className="text-xs text-indigo-400 font-bold">관련 관전 포인트</span>
              <p className="text-lg text-zinc-200 font-medium leading-relaxed">
                "{relatedWatchpoint.question}"
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="flex flex-col items-center gap-4"
        >
          {event.factCheck?.status === 'Pass' && (
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
          )}
          {event.factCheck?.status === 'Fail' && (
            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <XCircle size={48} />
            </div>
          )}
          {event.factCheck?.status === 'Pending' && (
            <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <AlertTriangle size={48} />
            </div>
          )}

          <div className="text-center">
            <div className={`text-3xl font-bold mb-2
              ${event.factCheck?.status === 'Pass' ? 'text-green-400' :
                event.factCheck?.status === 'Fail' ? 'text-red-400' : 'text-yellow-400'}`}>
              {event.factCheck?.status === 'Pass' ? '예측 적중' :
                event.factCheck?.status === 'Fail' ? '예측 실패' : '결과 대기 중'}
            </div>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              {event.factCheck?.actualValue}
            </p>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10"
      >
        다음: 시장 반응 확인 <ArrowRight size={18} />
      </button>
    </div>
  );

  // Step 2: Market Reaction & Analysis
  const renderStep2 = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <span className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Step 2. 시장 반응</span>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2">
              <Activity size={16} /> 주가
            </div>
            <div className={`text-4xl font-black tracking-tight
              ${event.marketReaction.priceChange.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
              {event.marketReaction.priceChange}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold mb-2">
              <TrendingUp size={16} /> 거래량
            </div>
            <div className="text-2xl font-bold text-white">
              {event.marketReaction.volumeChange}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-800/50 rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-bold text-indigo-400">분석 결과</span>
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-zinc-500 text-2xl font-bold block mb-3">원인</span>
              <p className="text-white text-base leading-relaxed">
                {event.analysis.cause}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 text-2xl font-bold block mb-3">시사점</span>
              <p className="text-white text-base leading-relaxed">
                {event.analysis.implication}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => setStep(3)}
        className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10"
      >
        다음: 영향 판단 <ArrowRight size={18} />
      </button>
    </div>
  );

  // Step 3: Impact Judgment (Pros vs Cons)
  const renderStep3 = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <span className="text-zinc-500 text-base font-bold tracking-widest uppercase">Step 3. 논리 점검</span>
          <h2 className="text-2xl font-bold text-white">기존 가설이 여전히 유효한가요?</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5"
          >
            <h3 className="text-green-400 text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> 긍정적 요인 (가설 강화)
            </h3>
            <ul className="space-y-3">
              {event.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-lg leading-relaxed">
                  <span className="text-green-500 mt-1.5">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5"
          >
            <h3 className="text-red-400 text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingDown size={20} /> 부정적 요인 (리스크)
            </h3>
            <ul className="space-y-3">
              {event.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-lg leading-relaxed">
                  <span className="text-red-500 mt-1.5">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <button
        onClick={() => setStep(4)}
        className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10"
      >
        다음: 의사결정 <ArrowRight size={18} />
      </button>
    </div>
  );

  // Step 4: Decision
  const renderStep4 = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2 text-center mb-4"
        >
          <span className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Step 4. 최종 결정</span>
          <h2 className="text-2xl font-bold text-white">어떻게 대응하시겠습니까?</h2>
        </motion.div>

        <div className="space-y-3">
          {event.scenarios.map((scenario, idx) => (
            <motion.button
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onComplete(scenario.action)}
              className={`w-full p-5 rounded-2xl border text-left transition-all group relative overflow-hidden
                ${scenario.action === 'buy' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' :
                  scenario.action === 'sell' ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' :
                    'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold px-2 py-1 rounded
                    ${scenario.action === 'buy' ? 'bg-red-500 text-white' :
                      scenario.action === 'sell' ? 'bg-blue-500 text-white' :
                        'bg-zinc-600 text-white'}`}>
                    {scenario.action.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{scenario.label}</h3>
                <p className="text-zinc-400 text-sm">{scenario.rationale}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-4 text-zinc-500 text-sm font-medium hover:text-white transition-colors"
      >
        취소
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md h-full md:h-[800px] bg-black md:rounded-3xl md:border md:border-zinc-800 overflow-hidden flex flex-col relative"
      >
        {/* Header Progress */}
        <div className="h-1 bg-zinc-900 w-full">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '25%' }}
            animate={{ width: `${step * 25}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="step1" className="h-full" exit={{ opacity: 0, x: -20 }}>{renderStep1()}</motion.div>}
            {step === 2 && <motion.div key="step2" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderStep2()}</motion.div>}
            {step === 3 && <motion.div key="step3" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderStep3()}</motion.div>}
            {step === 4 && <motion.div key="step4" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderStep4()}</motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
