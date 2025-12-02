import React, { useState } from 'react';
import { CalendarClock, Lightbulb, Compass, Bell } from 'lucide-react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { Thesis, SearchResultSample, Notification } from './types';
import InsightTab from './components/InsightTab';
import MyThesisTab from './components/MyThesisTab';
import DiscoveryTab from './components/DiscoveryTab';
import StockDetailModal from './components/StockDetailModal';
import OnboardingFlow from './components/stock-detail/OnboardingFlow';
import NotificationModal from './components/NotificationModal';
import NarrativeIntro from './components/narrative/NarrativeIntro';
import WatchpointBuilder from './components/narrative/WatchpointBuilder';
import { TEXT } from './constants/text';

type Tab = 'insight' | 'my-thesis' | 'discovery';

const AppContent: React.FC = () => {
  const { data, addToMyThesis } = useStore();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('insight');

  const [selectedStock, setSelectedStock] = useState<Thesis | null>(null);
  const [narrativeTarget, setNarrativeTarget] = useState<SearchResultSample | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderTarget, setBuilderTarget] = useState<Thesis | SearchResultSample | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  const handleOnboardingComplete = (newThesis?: Thesis) => {
    setIsOnboardingComplete(true);
    setActiveTab('my-thesis');
    if (newThesis) {
      setTimeout(() => setSelectedStock(newThesis), 100);
    }
  };

  const handleStockClickFromDiscovery = (stock: SearchResultSample) => {
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    if (existingThesis) setSelectedStock(existingThesis);
    else setNarrativeTarget(stock);
  };

  const handleGlobalNarrativeComplete = (decision: 'Buy' | 'Watch') => {
    if (!narrativeTarget) return;
    const status = decision === 'Buy' ? 'Invested' : 'Watching';
    const newThesis = addToMyThesis(narrativeTarget, [], status);
    setNarrativeTarget(null);
    setActiveTab('my-thesis');
    setSelectedStock(newThesis);
  };

  const handleOpenBuilder = (stock?: Thesis | SearchResultSample) => {
    if (stock) { setBuilderTarget(stock); setIsBuilderOpen(true); }
  };

  const handleNotificationClick = (notification: Notification) => {
    setIsNotificationOpen(false);
    let targetThesis = data.myThesis.find(s => s.id === notification.stockId || s.ticker === notification.ticker);
    if (targetThesis) { setActiveTab('my-thesis'); setSelectedStock(targetThesis); }
  };

  return (
    <div className="h-screen w-full bg-[#000] flex justify-center items-center overflow-hidden font-sans text-white">
      <main className="w-full max-w-[430px] h-full bg-app-bg relative shadow-2xl flex flex-col overflow-hidden">

        {isOnboardingComplete && !selectedStock && !narrativeTarget && !isBuilderOpen && !isNotificationOpen && (
          <button onClick={() => setIsNotificationOpen(true)} className="absolute top-6 right-6 z-50 p-2 bg-black/20 rounded-full border border-white/5">
            <div className="relative"><Bell size={24} className="text-white" />{unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />}</div>
          </button>
        )}

        {!isOnboardingComplete && <OnboardingFlow onComplete={handleOnboardingComplete} />}

        {isOnboardingComplete && (
          <>
            <div className="flex-1 w-full relative overflow-hidden">
              {activeTab === 'insight' && <InsightTab onNavigate={setActiveTab} />}
              {activeTab === 'my-thesis' && <MyThesisTab onStockClick={setSelectedStock} onNavigate={setActiveTab} />}
              {activeTab === 'discovery' && <DiscoveryTab onStockClick={handleStockClickFromDiscovery} />}
            </div>

            <nav className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom">
              <div className="flex justify-around items-center h-[88px] pb-4 px-2">
                {(['insight', 'my-thesis', 'discovery'] as Tab[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all">
                    <div className={`p-1.5 rounded-2xl ${activeTab === tab ? 'bg-white/10' : ''}`}>
                      {tab === 'insight' && <CalendarClock size={28} className={activeTab === tab ? 'text-indigo-500' : 'text-zinc-500'} />}
                      {tab === 'my-thesis' && <Lightbulb size={28} className={activeTab === tab ? 'text-indigo-500' : 'text-zinc-500'} />}
                      {tab === 'discovery' && <Compass size={28} className={activeTab === tab ? 'text-indigo-500' : 'text-zinc-500'} />}
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}

        {selectedStock && <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} onAddLogic={() => handleOpenBuilder(selectedStock)} />}

        {narrativeTarget && <div className="fixed inset-0 z-[200]"><NarrativeIntro stock={narrativeTarget} onClose={() => setNarrativeTarget(null)} onComplete={handleGlobalNarrativeComplete} /></div>}

        {isBuilderOpen && builderTarget && <div className="fixed inset-0 z-[200]"><WatchpointBuilder stock={builderTarget} onClose={() => setIsBuilderOpen(false)} onComplete={() => setIsBuilderOpen(false)} /></div>}

        {isNotificationOpen && <NotificationModal onClose={() => setIsNotificationOpen(false)} onNotificationClick={handleNotificationClick} />}

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return <StoreProvider><AppContent /></StoreProvider>;
};

export default App;
