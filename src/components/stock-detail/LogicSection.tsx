
import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, Clock, Target, AlertTriangle } from 'lucide-react';
import { LogicBlock } from '../../types';

export const LogicHealthItem: React.FC<{ logic: LogicBlock }> = ({ logic }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Mock history if not present
    const history = logic.history || [
        { date: '2일 전', type: 'Positive', text: '관련 실적 20% 상회 발표' },
        { date: '1주 전', type: 'Neutral', text: '경쟁사 신제품 출시 소식' },
        { date: '2주 전', type: 'Positive', text: 'CEO가 컨퍼런스에서 해당 내용 강조' },
    ];

    return (
        <div className="mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-6 rounded-[24px] border-l-4 transition-all duration-300 relative overflow-hidden group shadow-lg
                    ${isOpen ? 'bg-[#1E1E1E] border-app-accent shadow-app-accent/5' : 'bg-[#1E1E1E] border-app-accent hover:bg-zinc-800/50'}`}
            >
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className={`mt-0.5 transition-colors ${isOpen ? 'text-app-accent' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className={`text-xl font-bold mb-2 leading-snug ${isOpen ? 'text-white' : 'text-zinc-200'}`}>
                                {logic.title}
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed pr-6">
                                {logic.desc}
                            </p>
                        </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-zinc-600" />
                    </div>
                </div>
            </button>

            {/* Drill-down History */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-[#121212] rounded-2xl p-5 border border-white/10 ml-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-zinc-800" />
                        
                        <h5 className="text-xs font-bold text-zinc-500 mb-4 pl-1 flex items-center">
                            <Clock size={12} className="mr-1" />
                            가설 히스토리
                        </h5>
                        
                        <div className="space-y-6">
                            {history.map((item, idx) => (
                                <div key={idx} className="relative flex items-start space-x-4">
                                    {/* Timeline Dot logic */}
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-[#121212] 
                                        ${item.type === 'Positive' || item.type === 'Success' ? 'bg-app-positive' : 
                                          item.type === 'Negative' || item.type === 'Failure' ? 'bg-app-negative' : 'bg-zinc-500'}`} 
                                    />
                                    
                                    <div className="flex-1">
                                        {/* Decision Badge */}
                                        {item.category === 'Decision' && (
                                            <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg mb-1.5 text-[11px] font-bold uppercase tracking-wide border
                                                ${item.type === 'Success' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : 'bg-zinc-700/30 text-zinc-400 border-zinc-700'}`}>
                                                {item.type === 'Success' ? <Target size={12} /> : <AlertTriangle size={12} />}
                                                <span>{item.badgeText || '의사결정'}</span>
                                            </div>
                                        )}

                                        <div className="text-sm font-bold text-white leading-tight mb-1">{item.text}</div>
                                        <div className="text-xs text-zinc-600">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
