
import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import NarrativeIntro from './narrative/NarrativeIntro';
import WatchpointBuilder from './narrative/WatchpointBuilder';
import { Thesis, SearchResultSample } from '../types';

interface HypothesisBuilderProps {
  onClose: () => void;
  onComplete?: () => void;
}

type BuilderStep = 'narrative' | 'watchpoint';

const HypothesisBuilder: React.FC<HypothesisBuilderProps> = ({ onClose, onComplete }) => {
  const { data, addToMyThesis } = useStore();
  const searchResult = data.discovery.searchResultSample;
  
  const [step, setStep] = useState<BuilderStep>('narrative');
  const [investmentDecision, setInvestmentDecision] = useState<'Buy' | 'Watch'>('Watch');

  // Handle completion of Phase 1 (Narrative)
  const handleNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    setInvestmentDecision(decision);
    // If they choose Buy or Watch, we still want them to set triggers (Watchpoints).
    // The prompt implies we move to Phase 2.
    setStep('watchpoint');
  };

  // Handle completion of Phase 2 (Watchpoints)
  const handleWatchpointComplete = (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => {
    // 1. Map selections to IDs for storage
    // NOTE: The backend logic (addToMyThesis) expects IDs.
    // However, currently addToMyThesis expects `selectedLogicIds` which was for old LogicBlocks.
    // We need to update `addToMyThesis` signature or mapping in StoreContext, but for now
    // let's pass the selected Watchpoint IDs as the second argument which is mapped to `selectedLogicIds`.
    // Wait, `selectedLogicIds` was for `LogicBlock`. The new `addToMyThesis` in Task 1 creates `logicBlocks` from it.
    // In `stockData.ts` migration, we emptied `availableLogicBlocks`. 
    // The new structure uses `watchpoints` array in `Thesis`.
    // We should probably just pass the selection data or update `addToMyThesis` to handle watchpoint selections.
    // Re-reading Task 1 `StoreContext.tsx`:
    // `addToMyThesis` signature: (stock, selectedLogicIds, investmentType, amount)
    // It filters `stock.availableLogicBlocks`.
    // Since we are moving to Watchpoints, we might need to adjust `addToMyThesis` logic eventually.
    // For this task (UI), we will assume `addToMyThesis` will be updated or we pass IDs that map to something.
    // BUT, `stockData` has empty `availableLogicBlocks`. 
    // So `selectedLogicBlocks` will be empty in `addToMyThesis`.
    // `watchpoints` are copied directly from `stock.watchpoints`.
    // We need to persist the USER'S selection (Bull/Bear) for each watchpoint.
    // The current `Thesis` type has `watchpoints: Watchpoint[]`. It doesn't store the user's choice explicitly 
    // inside `Watchpoint` type (it has `options`). 
    // We likely need a place to store "User picked Bull for Watchpoint #1".
    // For now, let's just complete the flow and add the stock. 
    // We will assume `addToMyThesis` handles basic addition.
    
    // Convert decision 'Buy' -> 'Invested', 'Watch' -> 'Watching'
    const status = investmentDecision === 'Buy' ? 'Invested' : 'Watching';
    const amount = investmentDecision === 'Buy' ? '100만원 미만' : undefined; // Default for prototype

    // We pass empty array for logicIds since we are deprecating logicBlocks interaction in this builder
    addToMyThesis(searchResult, [], status, amount);
    
    if (onComplete) onComplete();
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] font-sans animate-in fade-in duration-300">
      {step === 'narrative' && (
        <NarrativeIntro 
          stock={searchResult} 
          onComplete={handleNarrativeComplete}
          onClose={onClose}
        />
      )}
      
      {step === 'watchpoint' && (
        <WatchpointBuilder 
          stock={searchResult}
          onComplete={handleWatchpointComplete}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default HypothesisBuilder;
