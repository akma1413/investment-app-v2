
import React from 'react';
import { X, ArrowRight, TrendingUp } from 'lucide-react';

interface LogicDetailModalProps {
  logic: any;
  onClose: () => void;
  onStockClick: () => void;
}

const LogicDetailModal: React.FC<LogicDetailModalProps> = ({ logic, onClose, onStockClick }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="w-full max-w-[430px] h-[92vh] sm:h-[85vh] bg-[#121212] rounded-t-[32px] sm:rounded-[32px] pointer-events-auto overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom duration-300 border-t border-white/10 flex flex-col mx-auto">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
            
            {/* Header / Cover */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-black p-6 flex flex-col justify-end">
               <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-black/30 rounded-full hover:bg-black/50 backdrop-blur-md text-white z-20"
               >
                 <X size={24} />
               </button>
               
               <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-white mb-3">
                    {logic.badge}
                  </div>
                  <h2 className="text-3xl font-extrabold text-white leading-tight mb-1">{logic.title}</h2>
               </div>
            </div>

            <div className="p-6 space-y-10">
               
               {/* 1. Description */}
               <section>
                 <h3 className="text-lg font-bold text-zinc-500 mb-3">시나리오 요약</h3>
                 <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                   {logic.desc}
                 </p>
               </section>

               {/* 2. Target Price Fan Chart (SVG) */}
               <section className="bg-[#1E1E1E] p-6 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">목표 주가 전망</h3>
                      <p className="text-sm text-zinc-500">FnGuide 컨센서스 기반</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-48 relative">
                     <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        <line x1="0" y1="40" x2="320" y2="40" stroke="#333" strokeDasharray="4 4" />
                        <line x1="0" y1="90" x2="320" y2="90" stroke="#333" strokeDasharray="4 4" />
                        <line x1="0" y1="140" x2="320" y2="140" stroke="#333" strokeDasharray="4 4" />

                        {/* Historical Line (Solid White) */}
                        <path d="M0,140 C60,135 120,95 160,90" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        
                        {/* Current Point */}
                        <circle cx="160" cy="90" r="5" fill="#121212" stroke="white" strokeWidth="3" className="z-10" />
                        <text x="160" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">현재</text>

                        {/* Future Scenarios (Dotted) */}
                        
                        {/* High Case */}
                        <path d="M160,90 Q240,40 300,20" fill="none" stroke="#F87171" strokeWidth="2" strokeDasharray="6 4" />
                        <circle cx="300" cy="20" r="4" fill="#F87171" />
                        <text x="300" y="10" textAnchor="end" fill="#F87171" fontSize="12" fontWeight="bold">최고</text>
                        
                        {/* Avg Case */}
                        <path d="M160,90 Q240,80 300,70" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="6 4" />
                        <circle cx="300" cy="70" r="4" fill="#A1A1AA" />
                        <text x="300" y="60" textAnchor="end" fill="#A1A1AA" fontSize="12" fontWeight="bold">평균</text>
                        
                        {/* Low Case */}
                        <path d="M160,90 Q240,110 300,130" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6 4" />
                        <circle cx="300" cy="130" r="4" fill="#60A5FA" />
                        <text x="300" y="150" textAnchor="end" fill="#60A5FA" fontSize="12" fontWeight="bold">최저</text>
                     </svg>
                  </div>
               </section>
               
               {/* 3. Related Stocks List (Updated Interaction) */}
               <section>
                  <h3 className="text-lg font-bold text-white mb-4">관련 종목</h3>
                  <div className="space-y-3">
                     {logic.relatedStocksDetails?.map((stock: any) => (
                        <div 
                          key={stock.ticker} 
                          onClick={() => {
                            onClose();
                            onStockClick();
                          }}
                          className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-white/5 rounded-2xl active:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group hover:border-app-accent/50"
                        >
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-xl font-bold text-zinc-400 group-hover:text-white transition-colors">
                                {stock.ticker[0]}
                              </div>
                              <div>
                                <div className="text-lg font-bold text-white">{stock.name}</div>
                                <div className="text-sm font-semibold text-zinc-500">{stock.ticker}</div>
                              </div>
                           </div>
                           <div className="flex items-center space-x-3">
                             <span className={`text-lg font-bold ${stock.rate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                               {stock.rate > 0 ? '+' : ''}{stock.rate}%
                             </span>
                             <div className="flex items-center text-xs font-bold text-app-accent opacity-0 group-hover:opacity-100 transition-opacity">
                               가설 만들기 <ArrowRight size={14} className="ml-1" />
                             </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LogicDetailModal;
