

import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Cloud, Cpu, Server, Car, Scale, Lightbulb, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Thesis } from '../types';

interface MyThesisTabProps {
  onStockClick: (stock: Thesis) => void;
  onNavigate: (tab: 'insight' | 'my-thesis' | 'discovery') => void;
}

const MyThesisTab: React.FC<MyThesisTabProps> = ({ onStockClick, onNavigate }) => {
  const { data } = useStore();
  const { user, myThesis } = data;

  const getLogicIcon = (iconName?: string) => {
    const size = 18;
    switch (iconName) {
      case 'Cloud': return <Cloud size={size} />;
      case 'Cpu': return <Cpu size={size} />;
      case 'Server': return <Server size={size} />;
      case 'Car': return <Car size={size} />;
      case 'Scale': return <Scale size={size} />;
      default: return <Lightbulb size={size} />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-[120px]">
      <header className="px-6 pt-12 pb-6 bg-app-bg sticky top-0 z-10 border-b border-white/5">
        <h1 className="text-3xl font-extrabold text-white mb-2">아이디어</h1>
        <p className="text-lg text-app-text-secondary">{user.name}님의 투자 가설들입니다.</p>
      </header>

      <div className="p-6 space-y-4">
        {myThesis.map((stock) => {
           const isInvested = stock.status === 'Invested';
           const isUrgent = stock.events.some(e => e.impact === 'High' && (e.dDay === 'D-1' || e.dDay === 'Today'));
           const urgentEvent = stock.events.find(e => e.impact === 'High');

           return (
            <div 
              key={stock.id} 
              onClick={() => onStockClick(stock)}
              className={`rounded-[28px] p-6 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden group
                ${isUrgent 
                  ? 'bg-[#1E1E1E] border border-app-positive/50 shadow-[0_0_20px_-5px_rgba(248,113,113,0.3)]' 
                  : isInvested 
                    ? 'bg-[#1E1E1E] shadow-xl border border-transparent' 
                    : 'bg-transparent border-2 border-dashed border-zinc-800 hover:border-zinc-700'
                }
              `}
            >
              {/* Urgent Badge */}
              {isUrgent && (
                <div className="absolute top-0 right-0 px-3 py-1.5 bg-app-positive rounded-bl-2xl text-[10px] font-black text-black flex items-center gap-1 z-10">
                  <AlertCircle size={12} strokeWidth={3} />
                  대응 필요
                </div>
              )}

              {/* Watching Badge (only if not urgent and not invested) */}
              {(!isInvested && !isUrgent) && (
                <div className="absolute top-0 right-0 px-4 py-2 bg-zinc-800 rounded-bl-2xl text-xs font-bold text-zinc-400">
                  WATCHING
                </div>
              )}

              {/* Top Row */}
              <div className="flex justify-between items-start mb-5 relative">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-2xl font-bold ${isInvested ? 'text-white' : 'text-zinc-300'}`}>{stock.ticker}</span>
                    {isUrgent && <div className="w-2 h-2 rounded-full bg-app-positive animate-ping" />}
                  </div>
                  <span className="text-base text-zinc-500 font-medium">{stock.name}</span>
                </div>
                <div className="text-right mt-1">
                  <div className={`text-2xl font-bold mb-1 ${isInvested ? 'text-white' : 'text-zinc-400'}`}>{formatCurrency(stock.currentPrice)}</div>
                  <div className={`text-base font-bold flex items-center justify-end ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                    {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
                  </div>
                </div>
              </div>

              {/* Logic Chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {stock.logicBlocks.map((logic) => (
                  <div key={logic.id} className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${isInvested ? 'bg-white/5 border-white/5' : 'bg-transparent border-zinc-800'}`}>
                    <span className={isInvested ? 'text-app-accent' : 'text-zinc-600'}>{getLogicIcon(logic.icon)}</span>
                    <span className={`text-sm font-semibold ${isInvested ? 'text-zinc-200' : 'text-zinc-500'}`}>{logic.title}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Info or CTA */}
              <div className={`pt-4 flex items-center justify-between ${isInvested ? 'border-t border-white/5' : 'border-t border-zinc-800'}`}>
                {isUrgent && urgentEvent ? (
                  <div className="flex items-center space-x-2 w-full justify-between">
                     <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-app-positive" />
                        <span className="text-sm font-bold text-app-positive">
                          {urgentEvent.dDay === 'D-1' ? '내일' : urgentEvent.dDay} {urgentEvent.type} 발표
                        </span>
                     </div>
                     <span className="text-sm font-bold text-white flex items-center">
                        가설 점검하기 <ChevronRight size={16} className="ml-1" />
                     </span>
                  </div>
                ) : stock.events.length > 0 ? (
                  <div className="flex items-center space-x-2">
                     <Clock size={16} className={stock.events[0].impact === 'High' ? 'text-app-positive' : 'text-zinc-500'} />
                     <span className={`text-sm font-bold ${stock.events[0].impact === 'High' ? 'text-app-positive' : 'text-zinc-500'}`}>
                       {stock.events[0].dDay} {stock.events[0].type}
                     </span>
                  </div>
                ) : (
                   <span className="text-sm text-zinc-600">특이사항 없음</span>
                )}
                
                {/* News Count Badge (only if not urgent) */}
                {(!isUrgent && stock.newsTags.length > 0) && (
                   <div className="flex space-x-2">
                      {stock.newsTags.some(n => n.type === 'Positive') && <div className="w-2 h-2 rounded-full bg-app-positive" />}
                      {stock.newsTags.some(n => n.type === 'Negative') && <div className="w-2 h-2 rounded-full bg-app-negative" />}
                   </div>
                )}
                
                {!isInvested && !isUrgent && (
                  <ChevronRight size={20} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                )}
              </div>
            </div>
           );
        })}
        
        {/* Add New Button */}
        <button 
          onClick={() => onNavigate('discovery')}
          className="w-full py-6 rounded-[28px] border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.98]"
        >
           <span className="text-lg font-bold">+ 새 아이디어 추가</span>
        </button>
      </div>
    </div>
  );
};

export default MyThesisTab;