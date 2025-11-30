
import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Cloud, Cpu, Server, Car, Scale, Lightbulb, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Thesis } from '../types';
import { TEXT } from '../constants/text';
import { formatCurrency, formatRate, getRateColorClass } from '../utils/formatters';

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

  const getHoldingData = (ticker: string) => {
    const allHoldings = [...user.holdings.domestic, ...user.holdings.overseas];
    return allHoldings.find(h => h.ticker === ticker);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-[120px]">
      <header className="px-6 pt-12 pb-6 bg-app-bg sticky top-0 z-10 border-b border-white/5">
        <h1 className="text-3xl font-extrabold text-white mb-2">{TEXT.MY_THESIS.HEADER_TITLE}</h1>
        <p className="text-lg text-app-text-secondary">{TEXT.MY_THESIS.HEADER_DESC(user.name)}</p>
      </header>

      <div className="p-6 space-y-4">
        {myThesis.map((stock) => {
           const isInvested = stock.status === 'Invested';
           // Check for urgency using status and optional impact if present
           const isUrgent = stock.events.some(e => e.status === 'Upcoming' && e.impact === 'High');
           const urgentEvent = stock.events.find(e => e.status === 'Upcoming' && e.impact === 'High');
           
           const holding = isInvested ? getHoldingData(stock.ticker) : null;

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
              {isUrgent && (
                <div className="absolute top-0 right-0 px-3 py-1.5 bg-app-positive rounded-bl-2xl text-[10px] font-black text-black flex items-center gap-1 z-10">
                  <AlertCircle size={12} strokeWidth={3} />
                  {TEXT.MY_THESIS.BADGE_URGENT}
                </div>
              )}

              {(!isInvested && !isUrgent) && (
                <div className="absolute top-0 right-0 px-4 py-2 bg-zinc-800 rounded-bl-2xl text-xs font-bold text-zinc-400">
                  {TEXT.MY_THESIS.BADGE_WATCHING}
                </div>
              )}

              <div className="flex justify-between items-start mb-5 relative">
                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className={`text-2xl font-bold ${isInvested ? 'text-white' : 'text-zinc-300'}`}>{stock.name}</span>
                    {isUrgent && <div className="w-2 h-2 rounded-full bg-app-positive animate-ping" />}
                  </div>
                  <span className="text-sm text-zinc-500 font-bold tracking-wide">{stock.ticker}</span>
                </div>
                
                <div className="text-right mt-1">
                  {isInvested && holding ? (
                    <>
                      <div className="text-xl font-bold text-white mb-0.5">{formatCurrency(holding.valuation, 'KRW')}</div>
                      <div className={`text-sm font-bold flex items-center justify-end ${getRateColorClass(holding.profitRate)}`}>
                        {formatRate(holding.profitRate)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl font-bold text-zinc-400 mb-0.5">{formatCurrency(stock.currentPrice, 'USD')}</div>
                      <div className={`text-sm font-bold flex items-center justify-end ${getRateColorClass(stock.changeRate)}`}>
                        {formatRate(stock.changeRate)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {stock.logicBlocks.map((logic) => (
                  <div key={logic.id} className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${isInvested ? 'bg-white/5 border-white/5' : 'bg-transparent border-zinc-800'}`}>
                    <span className={isInvested ? 'text-app-accent' : 'text-zinc-600'}>{getLogicIcon(logic.icon)}</span>
                    <span className={`text-sm font-semibold ${isInvested ? 'text-zinc-200' : 'text-zinc-500'}`}>{logic.title}</span>
                  </div>
                ))}
              </div>

              <div className={`pt-4 flex items-center justify-between ${isInvested ? 'border-t border-white/5' : 'border-t border-zinc-800'}`}>
                {isUrgent && urgentEvent ? (
                  <div className="flex items-center space-x-2 w-full justify-between">
                     <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-app-positive" />
                        <span className="text-sm font-bold text-app-positive">
                          {TEXT.MY_THESIS.LABEL_D_DAY(urgentEvent.date)} {urgentEvent.type} 발표
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
                       {stock.events[0].date} {stock.events[0].type}
                     </span>
                  </div>
                ) : (
                   <span className="text-sm text-zinc-600">{TEXT.MY_THESIS.STATUS_NO_EVENTS}</span>
                )}
                
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
        
        <button 
          onClick={() => onNavigate('discovery')}
          className="w-full py-6 rounded-[28px] border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-all active:scale-[0.98]"
        >
           <span className="text-lg font-bold">{TEXT.MY_THESIS.BTN_ADD_NEW}</span>
        </button>
      </div>
    </div>
  );
};

export default MyThesisTab;
