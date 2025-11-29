
import React from 'react';
import { MessageSquareQuote } from 'lucide-react';

export const NewsCard: React.FC<{ news: any }> = ({ news }) => {
    return (
        <div className="p-5 bg-app-surface rounded-2xl border border-white/5 mb-3 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-wide 
                    ${news.type === 'Positive' ? 'bg-app-positive/20 text-app-positive' : 
                      news.type === 'Negative' ? 'bg-app-negative/20 text-app-negative' : 'bg-zinc-700 text-zinc-300'}`}>
                    {news.type === 'Positive' ? '호재' : news.type === 'Negative' ? '악재' : '중립'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">{news.date}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white leading-snug mb-3">
                {news.text}
            </h3>

            {news.analystComment && (
                <div className="relative mt-4 bg-white/5 rounded-xl p-4 pl-10 border border-white/5">
                    <MessageSquareQuote size={18} className="absolute top-4 left-3 text-app-accent/80" />
                    <div className="text-xs font-bold text-zinc-500 mb-1">해설</div>
                    <p className="text-sm text-zinc-300 font-medium italic leading-relaxed">
                        "{news.analystComment}"
                    </p>
                </div>
            )}
        </div>
    );
};
