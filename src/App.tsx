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
import HypothesisBuilder from './components/HypothesisBuilder';
import WatchpointBuilder from './components/narrative/WatchpointBuilder';
import NotificationPopup from './components/NotificationPopup';
import { TEXT } from './constants/text';
import { ALL_STOCKS } from './data/stockData';

type Tab = 'insight' | 'my-thesis' | 'discovery';

const AppContent: React.FC = () => {
  const { data, addToMyThesis, markNotificationAsRead } = useStore();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('insight');

  const [selectedStock, setSelectedStock] = useState<Thesis | null>(null);
  const [narrativeTarget, setNarrativeTarget] = useState<SearchResultSample | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderTarget, setBuilderTarget] = useState<Thesis | SearchResultSample | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [popupNotification, setPopupNotification] = useState<Notification | null>(null);
  const [initialEventId, setInitialEventId] = useState<string | undefined>(undefined);

  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  // Trigger Popup on ANY Tab
  React.useEffect(() => {
    if (isOnboardingComplete) {
      const unread = data.notifications.find(n => !n.isRead);
      if (unread) {
        // Delay slightly to simulate "live" feel
        const timer = setTimeout(() => setPopupNotification(unread), 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setPopupNotification(null);
    }
  }, [activeTab, isOnboardingComplete, data.notifications]);

  const handleOnboardingComplete = (newThesis?: Thesis) => {
    setIsOnboardingComplete(true);
    setActiveTab('my-thesis');
    if (newThesis) {
      setSelectedStock(newThesis);
    }
  };

  const handleStockClickFromDiscovery = (stock: SearchResultSample) => {
    const existingThesis = data.myThesis.find(t => t.ticker === stock.ticker);
    if (existingThesis) setSelectedStock(existingThesis);
    else setNarrativeTarget(stock);
  };

  const handleGlobalNarrativeComplete = (newThesis?: Thesis) => {
    if (!narrativeTarget) return;
    setNarrativeTarget(null);
    setActiveTab('my-thesis');
    if (newThesis) setSelectedStock(newThesis);
  };

  const handleOpenBuilder = (stock?: Thesis | SearchResultSample) => {
    if (stock) { setBuilderTarget(stock); setIsBuilderOpen(true); }
  };

  const handleNotificationClick = (notification: Notification) => {
    setIsNotificationOpen(false);
    let targetThesis = data.myThesis.find(s => s.id === notification.stockId || s.ticker === notification.ticker) ||
      ALL_STOCKS.find(s => s.ticker === notification.ticker);

    if (targetThesis) {
      // If it's not in myThesis, we might want to stay on current tab or go to discovery? 
      // But for now, let's just open the modal. 
      // If we want to show it as "Watching", we might need to handle that in StockDetailModal or ensure it's treated as such.
      // StockDetailModal handles uninvested stocks fine.

      setSelectedStock(targetThesis as any);
      setNarrativeTarget(null);
      setIsBuilderOpen(false);
      if (notification.eventId) setInitialEventId(notification.eventId);
    }
  };

  const handlePopupClick = (notification: Notification) => {
    setPopupNotification(null);
    markNotificationAsRead(notification.id);

    // Navigate to Stock Detail
    let targetThesis = data.myThesis.find(s => s.id === notification.stockId || s.ticker === notification.ticker) ||
      ALL_STOCKS.find(s => s.ticker === notification.ticker);

    if (targetThesis) {
      setSelectedStock(targetThesis as any);
      setNarrativeTarget(null);
      setIsBuilderOpen(false);
      if (notification.eventId) setInitialEventId(notification.eventId);
    }
  };

  return (
    <div className="h-screen w-full bg-[#000] flex justify-center items-center overflow-hidden font-sans text-white">
      <main className="w-full max-w-[430px] h-full bg-app-bg relative shadow-2xl flex flex-col overflow-hidden">

        {isOnboardingComplete && !selectedStock && !narrativeTarget && !isBuilderOpen && !isNotificationOpen && (
          <button onClick={() => setIsNotificationOpen(true)} className="absolute top-6 right-6 z-50 p-3 bg-black/40 rounded-full border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] backdrop-blur-md active:scale-95 transition-all animate-pulse">
            <div className="relative"><Bell size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />{unreadCount > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />}</div>
          </button>
        )}

        {!isOnboardingComplete && <OnboardingFlow onComplete={handleOnboardingComplete} />}

        {isOnboardingComplete && (
          <>
            <div className="flex-1 w-full relative overflow-hidden">
              {activeTab === 'insight' && (
                <InsightTab
                  user={data.user}
                  marketWeather={data.marketWeather}
                  onStockClick={(stockOrHolding: any) => {
                    console.log('Stock Clicked:', stockOrHolding);
                    // Find the full thesis object from ALL_STOCKS or myThesis
                    const target = data.myThesis.find(t => t.ticker === stockOrHolding.ticker) ||
                      ALL_STOCKS.find(s => s.ticker === stockOrHolding.ticker);
                    console.log('Target Found:', target);
                    if (target) {
                      setSelectedStock(target as any);
                      setNarrativeTarget(null); // Reset narrative intro
                      setIsBuilderOpen(false); // Reset watchpoint builder
                    }
                  }}
                  onNavigate={setActiveTab}
                />
              )}      {activeTab === 'my-thesis' && <MyThesisTab onStockClick={setSelectedStock} onNavigate={setActiveTab} />}
              {activeTab === 'discovery' && <DiscoveryTab onStockClick={handleStockClickFromDiscovery} />}
            </div>

            {/* Popup Notification */}
            {popupNotification && (
              <NotificationPopup
                notification={popupNotification}
                onClose={() => setPopupNotification(null)}
                onClick={handlePopupClick}
              />
            )}

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

        {selectedStock && (
          <StockDetailModal
            stock={selectedStock}
            onClose={() => { setSelectedStock(null); setInitialEventId(undefined); }}
            onAddLogic={() => handleOpenBuilder(selectedStock)}
            initialEventId={initialEventId}
          />
        )}

        {narrativeTarget && <div className="absolute inset-0 z-[200]"><HypothesisBuilder stock={narrativeTarget} onClose={() => setNarrativeTarget(null)} onComplete={() => handleGlobalNarrativeComplete()} /></div>}

        {isBuilderOpen && builderTarget && (
          <div className="fixed inset-0 z-[200] flex justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-[430px] h-full bg-[#121212] relative shadow-2xl overflow-hidden">
              <WatchpointBuilder stock={builderTarget} onClose={() => setIsBuilderOpen(false)} onComplete={() => setIsBuilderOpen(false)} />
            </div>
          </div>
        )}

        {isNotificationOpen && <NotificationModal onClose={() => setIsNotificationOpen(false)} onNotificationClick={handleNotificationClick} />}

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return <StoreProvider><AppContent /></StoreProvider>;
};

export default App;
