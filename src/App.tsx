
import React, { useState } from 'react';
import { CalendarClock, Lightbulb, Compass, Bell } from 'lucide-react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { Thesis, SearchResultSample, Notification } from './types';
import InsightTab from './components/InsightTab';
import MyThesisTab from './components/MyThesisTab';
import DiscoveryTab from './components/DiscoveryTab';
import StockDetailModal from './components/StockDetailModal';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import NotificationModal from './components/NotificationModal';
import NarrativeIntro from './components/narrative/NarrativeIntro';
import WatchpointBuilder from './components/narrative/WatchpointBuilder';
import { TEXT } from './constants/text';

type Tab = 'insight' | 'my-thesis' | 'discovery';

const AppContent: React.FC = () => {
  const { data, selectDiscoveryStock, addToMyThesis } = useStore();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('insight');
  
  // UI State for Overlays/Modals
  const [selectedStock, setSelectedStock] = useState<Thesis | null>(null); // Logic HQ (Detail Modal)
  const [narrativeTarget, setNarrativeTarget] = useState<SearchResultSample | null>(null); // Global Narrative Modal
  const [isBuilderOpen, setIsBuilderOpen] = useState(false); // Watchpoint Builder
  const [builderTarget, setBuilderTarget] = useState<Thesis | SearchResultSample | null>(null); // Target for Builder
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  // --- 1. Onboarding Completion (Direct Landing) ---
  const handleOnboardingComplete = (newThesis?: Thesis) => {
    setIsOnboardingComplete(true);
    setActiveTab('my-thesis');
    
    // If a thesis was created during onboarding, land directly on its Logic HQ
    if (newThesis) {
      setTimeout(() => {
        setSelectedStock(newThesis);
      }, 100);
    }
  };

  // --- 2. Discovery Navigation Logic ---
  const handleStockClickFromDiscovery = (stock: SearchResultSample) => {
    // Check if user already has a thesis for this stock
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    
    if (existingThesis) {
      // Case A: Invested/Watching -> Go to Logic HQ
      setSelectedStock(existingThesis);
    } else {
      // Case B: Uninvested -> Start Narrative Flow
      setNarrativeTarget(stock);
    }
  };

  // --- 3. Global Narrative Completion ---
  const handleGlobalNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    if (!narrativeTarget) return;

    const status = decision === 'Buy' ? 'Invested' : 'Watching';
    const amount = decision === 'Buy' ? '100만원 미만' : undefined;

    // 1. Create & Save Thesis
    const newThesis = addToMyThesis(narrativeTarget, [], status, amount);

    // 2. Close Narrative Modal
    setNarrativeTarget(null);

    // 3. Land on Logic HQ
    setActiveTab('my-thesis');
    setTimeout(() => {
      setSelectedStock(newThesis);
    }, 100);
  };

  // Logic Builder (Add/Edit Watchpoints for existing thesis)
  const handleOpenBuilder = (stock?: Thesis | SearchResultSample) => {
    if (stock) {
        setBuilderTarget(stock);
        // Ensure discovery context is set if needed by internal components (optional)
        selectDiscoveryStock(stock.ticker);
    }
    setSelectedStock(null);
    setIsBuilderOpen(true);
  };

  const handleNotificationClick = (notification: Notification) => {
    setIsNotificationOpen(false);
    
    // Try to find by ID first
    let targetThesis = data.myThesis.find(s => s.id === notification.stockId);
    
    // Fallback: If not found by ID, try finding by Ticker (for robust deep linking)
    if (!targetThesis && notification.ticker) {
        targetThesis = data.myThesis.find(s => s.ticker === notification.ticker);
    }

    if (targetThesis) {
      setSelectedStock(targetThesis);
      setActiveTab('my-thesis'); 
    }
  };

  return (
    <div className="h-screen w-full bg-[#000] flex justify-center items-center overflow-hidden font-sans selection:bg-app-accent selection:text-white">
      <main className="w-full max-w-[430px] h-full bg-app-bg relative shadow-2xl shadow-black border-x border-white/5 flex flex-col overflow-hidden">
        
        {/* Global Header Actions (Bell) */}
        {isOnboardingComplete && !selectedStock && !narrativeTarget && !isBuilderOpen && !isNotificationOpen && (
           <button 
             onClick={() => setIsNotificationOpen(true)}
             className="absolute top-6 right-6 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5 hover:bg-white/10 transition-colors"
           >
             <div className="relative">
               <Bell size={24} className="text-white" />
               {unreadCount > 0 && (
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-app-positive rounded-full border-2 border-[#121212]" />
               )}
             </div>
           </button>
        )}

        {/* Onboarding Overlay */}
        {!isOnboardingComplete && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}

        {/* Dynamic Content Area */}
        <div className="flex-1 w-full relative overflow-hidden">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 z-40 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom">
          <div className="flex justify-around items-center h-[88px] pb-4 px-2">
            <button
              onClick={() => setActiveTab('insight')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-200 group active:scale-95`}
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${activeTab === 'insight' ? 'bg-white/10 scale-110' : 'bg-transparent'}`}>
                <CalendarClock 
                  size={28} 
                  className={activeTab === 'insight' ? 'text-app-accent' : 'text-zinc-500 group-hover:text-zinc-300'} 
                  strokeWidth={activeTab === 'insight' ? 2.5 : 2} 
                />
              </div>
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'insight' ? 'text-white' : 'text-zinc-500'}`}>{TEXT.TAB.INSIGHT}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-thesis')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-200 group active:scale-95`}
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${activeTab === 'my-thesis' ? 'bg-white/10 scale-110' : 'bg-transparent'}`}>
                <Lightbulb 
                  size={28} 
                  className={activeTab === 'my-thesis' ? 'text-app-accent' : 'text-zinc-500 group-hover:text-zinc-300'} 
                  strokeWidth={activeTab === 'my-thesis' ? 2.5 : 2} 
                />
              </div>
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'my-thesis' ? 'text-white' : 'text-zinc-500'}`}>{TEXT.TAB.MY_THESIS}</span>
            </button>

            <button
              onClick={() => setActiveTab('discovery')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-200 group active:scale-95`}
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${activeTab === 'discovery' ? 'bg-white/10 scale-110' : 'bg-transparent'}`}>
                <Compass 
                  size={28} 
                  className={activeTab === 'discovery' ? 'text-app-accent' : 'text-zinc-500 group-hover:text-zinc-300'} 
                  strokeWidth={activeTab === 'discovery' ? 2.5 : 2} 
                />
              </div>
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'discovery' ? 'text-white' : 'text-zinc-500'}`}>{TEXT.TAB.DISCOVERY}</span>
            </button>
          </div>
        </nav>

        {/* --- Global Modals --- */}
        
        {/* 1. Logic HQ (Detail Modal) */}
        {selectedStock && (
          <StockDetailModal 
            stock={selectedStock} 
            onClose={() => setSelectedStock(null)} 
            onAddLogic={() => handleOpenBuilder(selectedStock)}
          />
        )}
        
        {/* 2. Global Narrative Intro (For Uninvested Stocks) */}
        {narrativeTarget && (
          <div className="fixed inset-0 z-[200]">
             <NarrativeIntro 
               stock={narrativeTarget}
               onClose={() => setNarrativeTarget(null)}
               onComplete={handleGlobalNarrativeComplete}
             />
          </div>
        )}

        {/* 3. Watchpoint Builder (Replaces HypothesisBuilder) */}
        {isBuilderOpen && builderTarget && (
          <div className="fixed inset-0 z-[150] bg-[#121212] animate-in fade-in duration-300">
            <WatchpointBuilder 
                stock={builderTarget}
                onClose={() => setIsBuilderOpen(false)} 
                onComplete={(selections) => {
                    // In a real app, dispatch update to store with selections
                    console.log("Updated watchpoints:", selections);
                    setIsBuilderOpen(false);
                }}
            />
          </div>
        )}

        {/* 4. Notification Center */}
        {isNotificationOpen && (
          <NotificationModal 
            onClose={() => setIsNotificationOpen(false)} 
            onNotificationClick={handleNotificationClick}
          />
        )}

      </main>
    </div>
  );

  function renderContent() {
    switch (activeTab) {
      case 'insight':
        return <InsightTab onNavigate={handleTabChange} />;
      case 'my-thesis':
        return <MyThesisTab onStockClick={setSelectedStock} onNavigate={handleTabChange} />;
      case 'discovery':
        return <DiscoveryTab onStockClick={handleStockClickFromDiscovery} />;
      default:
        return <MyThesisTab onStockClick={setSelectedStock} onNavigate={handleTabChange} />;
    }
  }
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
