
import React, { useState } from 'react';
import { CalendarClock, Lightbulb, Compass, Bell } from 'lucide-react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { Thesis } from './types';
import InsightTab from './components/InsightTab';
import MyThesisTab from './components/MyThesisTab';
import DiscoveryTab from './components/DiscoveryTab';
import StockDetailModal from './components/StockDetailModal';
import HypothesisBuilder from './components/HypothesisBuilder';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import NotificationModal from './components/NotificationModal';

type Tab = 'insight' | 'my-thesis' | 'discovery';

const AppContent: React.FC = () => {
  const { data } = useStore();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('insight');
  
  // UI State for Overlays/Modals
  const [selectedStock, setSelectedStock] = useState<Thesis | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'insight':
        return <InsightTab />;
      case 'my-thesis':
        return <MyThesisTab onStockClick={setSelectedStock} />;
      case 'discovery':
        return <DiscoveryTab onStartBuilder={() => setIsBuilderOpen(true)} />;
      default:
        return <MyThesisTab onStockClick={setSelectedStock} />;
    }
  };

  const handleNotificationClick = (stockId?: number) => {
    setIsNotificationOpen(false);
    if (stockId) {
      const stock = data.myThesis.find(s => s.id === stockId);
      if (stock) {
        setSelectedStock(stock);
        // If we are opening a specific stock, switching to my-thesis tab makes context clearer
        setActiveTab('my-thesis'); 
      }
    }
  };

  return (
    <div className="h-screen w-full bg-[#000] flex justify-center items-center overflow-hidden font-sans selection:bg-app-accent selection:text-white">
      {/* Mobile Constraint Container - Fixed Height */}
      <main className="w-full max-w-[430px] h-full bg-app-bg relative shadow-2xl shadow-black border-x border-white/5 flex flex-col overflow-hidden">
        
        {/* Global Header Actions (Bell) */}
        {isOnboardingComplete && !selectedStock && !isBuilderOpen && !isNotificationOpen && (
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
          <OnboardingFlow onComplete={() => setIsOnboardingComplete(true)} />
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
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'insight' ? 'text-white' : 'text-zinc-500'}`}>투데이</span>
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
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'my-thesis' ? 'text-white' : 'text-zinc-500'}`}>아이디어</span>
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
              <span className={`text-[11px] font-bold tracking-tight ${activeTab === 'discovery' ? 'text-white' : 'text-zinc-500'}`}>발견</span>
            </button>
          </div>
        </nav>

        {/* Global Overlays */}
        {selectedStock && (
          <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
        )}
        
        {isBuilderOpen && (
          <HypothesisBuilder onClose={() => setIsBuilderOpen(false)} />
        )}

        {isNotificationOpen && (
          <NotificationModal 
            onClose={() => setIsNotificationOpen(false)} 
            onNotificationClick={handleNotificationClick}
          />
        )}

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
