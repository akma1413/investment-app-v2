
import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import NarrativeIntro from './narrative/NarrativeIntro';
import WatchpointBuilder from './narrative/WatchpointBuilder';
import { Thesis, SearchResultSample } from '../types';

interface HypothesisBuilderProps {
  stock: SearchResultSample;
  onClose: () => void;
  onComplete?: (newThesis: Thesis) => void;
}

type BuilderStep = 'narrative' | 'watchpoint';

const HypothesisBuilder: React.FC<HypothesisBuilderProps> = ({ stock, onClose, onComplete }) => {
  const { addToMyThesis } = useStore();

  const [step, setStep] = useState<BuilderStep>('narrative');
  const [investmentDecision, setInvestmentDecision] = useState<'Buy' | 'Watch'>('Watch');

  // Handle completion of Phase 1 (Narrative)
  const handleNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    setInvestmentDecision(decision);
    setStep('watchpoint');
  };

  // Handle completion of Phase 2 (Watchpoints)
  const handleWatchpointComplete = (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => {
    const status = investmentDecision === 'Buy' ? 'Invested' : 'Watching';
    const amount = investmentDecision === 'Buy' ? '100만원 미만' : undefined;

    // If selections are empty (skipped), pass empty array.
    // If selections exist, pass the original watchpoints (assuming we watch all if we capture).
    // Ideally we should store the Bull/Bear selection too, but for now we just toggle the list presence.
    const watchpointsToSave = selections.length > 0 ? stock.watchpoints : [];

    const newThesis = addToMyThesis(stock, watchpointsToSave, status, amount);

    if (onComplete) onComplete(newThesis);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black font-sans animate-in fade-in duration-300">
      <div className="w-full max-w-[430px] h-full bg-[#121212] relative shadow-2xl overflow-hidden">
        {step === 'narrative' && (
          <NarrativeIntro
            stock={stock}
            onComplete={handleNarrativeComplete}
            onClose={onClose}
          />
        )}

        {step === 'watchpoint' && (
          <WatchpointBuilder
            stock={stock}
            onComplete={handleWatchpointComplete}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};



export default HypothesisBuilder;
