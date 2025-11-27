

import React, { useRef, useState } from 'react';
import { X, Bot, TrendingUp, Clock, CheckCircle2, PartyPopper, AlertTriangle, RefreshCcw, Zap, Globe, Activity } from 'lucide-react';
import { Thesis } from '../types';

interface StockDetailModalProps {
  stock: Thesis;
  onClose: () => void;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  // Logic Section Ref for scroll interaction
  const logicSectionRef = useRef<HTMLDivElement>(null);
  const [highlightLogic, setHighlightLogic] = useState(false);

  // 1. Check for Verification Status (JustFinished Event)
  const verificationEvent = stock.events.find(
    e => e.status === 'JustFinished' && (e.result === 'Hit' || e.result === 'Miss')
  );

  // 2. Fallback Nudge Logic Checks (Only if no verification event)
  const hasEarningsImminent = !verificationEvent && stock.events.some(e => e.dDay === 'D-1');
  const isOverheated = !verificationEvent && stock.changeRate > 5.0;

  const scrollToLogic = () => {
    if (logicSectionRef.current) {
      logicSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightLogic(true);
      setTimeout(() => setHighlightLogic(false), 2000); // Remove highlight after animation
    }
  };

  const handleAction = (action: string) => {
    alert(`${action} 처리되었습니다. (프로토타입)`);
  };

  // Helper for Volatility Icon
  const getVolatilityIcon = (type: string) => {
    switch (type) {
      case 'News': return <Zap size={20} className="fill-current" />;
      case 'Macro': return <Globe size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="w-full max-w-[430px] h-[92vh] bg-[#121212] rounded-t-[32px] pointer-events-auto overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative border-t border-white/10 mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white">{stock.ticker}</h2>
              <span className="text-base text-zinc-400">{stock.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xl font-bold text-white">${stock.currentPrice}</div>
              <div className={`text-sm font-bold ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'} flex justify-end items-center`}>
                {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <X size={24} className="text-zinc-400" />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* --- NEW: LIVE VOLATILITY BRIEFING (Top Priority) --- */}
          {stock.volatilityAnalysis && (
            <div className={`p-6 rounded-[24px] border relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 delay-100 ${stock.changeRate >= 0 ? 'bg-app-positive/5 border-app-positive/30' : 'bg-app-negative/5 border-app-negative/30'}`}>
               
               {/* Pulsing Dot Animation */}
               <div className="absolute top-6 right-6 flex items-center space-x-2">
                 <span className={`relative flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stock.changeRate >= 0 ? 'bg-app-positive' : 'bg-app-negative'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${stock.changeRate >= 0 ? 'bg-app-positive' : 'bg-app-negative'}`}></span>
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>Live Analysis</span>
               </div>

               <div className="flex items-center space-x-2 mb-3">
                 <div className={`p-2 rounded-full ${stock.changeRate >= 0 ? 'bg-app-positive/10 text-app-positive' : 'bg-app-negative/10 text-app-negative'}`}>
                   {getVolatilityIcon(stock.volatilityAnalysis.type)}
                 </div>
                 <span className={`text-sm font-bold ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                   급변동 원인 분석
                 </span>
               </div>

               <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
                 {stock.volatilityAnalysis.title}
               </h3>
               
               <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                 "{stock.volatilityAnalysis.desc}"
               </p>

               <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center"><Bot size={14} className="mr-1"/> AI Analyst</span>
                  <span>{stock.volatilityAnalysis.timestamp}</span>
               </div>
            </div>
          )}

          {/* --- HYPOTHESIS VERIFICATION CARD (Dynamic) --- */}
          {verificationEvent && (
            <div className={`p-6 rounded-3xl border animate-in fade-in zoom-in duration-500 ${
              verificationEvent.result === 'Hit' 
                ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]' 
                : 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2.5 rounded-full ${verificationEvent.result === 'Hit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  {verificationEvent.result === 'Hit' ? <PartyPopper size={28} /> : <AlertTriangle size={28} />}
                </div>
                <h3 className={`text-xl font-extrabold ${verificationEvent.result === 'Hit' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {verificationEvent.result === 'Hit' ? '가설 적중!' : '가설 이탈 신호'}
                </h3>
              </div>

              <div className="mb-6">
                <p className={`text-lg font-bold mb-2 ${verificationEvent.result === 'Hit' ? 'text-white' : 'text-white'}`}>
                  {verificationEvent.result === 'Hit' ? '예상대로 흘러가고 있어요.' : '가설 재점검이 필요합니다.'}
                </p>
                <div className="bg-[#121212]/50 p-4 rounded-xl border border-white/5">
                  <div className="flex items-start space-x-3">
                    <Bot size={20} className="text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-base text-zinc-300 leading-relaxed">
                      "{verificationEvent.analystFeedback}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {verificationEvent.result === 'Hit' ? (
                  <>
                    <button 
                      onClick={() => handleAction('가설 유지')}
                      className="py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 transition-colors"
                    >
                      가설 유지 (Hold)
                    </button>
                    <button 
                      onClick={() => handleAction('비중 확대')}
                      className="py-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold text-base hover:bg-emerald-500/20 transition-colors"
                    >
                      비중 확대
                    </button>
                  </>
                ) : (
                  <>
                     <button 
                      onClick={() => handleAction('수익 실현')}
                      className="py-3.5 rounded-xl bg-orange-600 text-white font-bold text-base hover:bg-orange-500 transition-colors"
                    >
                      수익 실현 (Sell)
                    </button>
                    <button 
                      onClick={() => handleAction('가설 수정')}
                      className="py-3.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/30 font-bold text-base hover:bg-orange-500/20 transition-colors"
                    >
                      <span className="flex items-center justify-center">
                        <RefreshCcw size={18} className="mr-2" /> 가설 수정
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Section A: Analyst's Briefing (Only show if not redundant with verification card) */}
          {!verificationEvent && !stock.volatilityAnalysis && (
            <section className="bg-gradient-to-br from-app-surface to-zinc-900 p-6 rounded-3xl border border-app-accent/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-app-accent/10 rounded-full blur-2xl -mr-5 -mt-5" />
              <div className="flex items-start space-x-4 relative z-10">
                <div className="p-2.5 bg-app-accent/10 rounded-xl shrink-0">
                  <Bot size={24} className="text-app-accent" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-app-accent mb-2">애널리스트 브리핑</h3>
                  <p className="text-base text-zinc-200 leading-relaxed">
                    "{stock.dailyBriefing}"
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section B: Logic Health Check */}
          <section ref={logicSectionRef} className={`transition-all duration-500 ${highlightLogic ? 'scale-[1.02]' : ''}`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              나의 투자 논리
              <span className={`ml-3 text-xs font-bold px-2 py-0.5 rounded-full transition-colors duration-500 ${highlightLogic ? 'bg-app-accent text-white' : 'text-zinc-500 bg-white/5'}`}>
                Logic Health
              </span>
            </h3>
            <div className="space-y-4">
              {stock.logicBlocks.map(logic => (
                <div 
                  key={logic.id}
                  className={`flex items-start justify-between p-5 bg-app-surface rounded-2xl border transition-all duration-300 ${highlightLogic ? 'border-app-accent shadow-[0_0_20px_-5px_rgba(129,140,248,0.3)]' : 'border-white/5'}`}
                >
                  <div className="flex items-start space-x-4">
                    <CheckCircle2 size={24} className="text-app-accent mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-lg mb-1">{logic.title}</div>
                      <div className="text-sm text-zinc-400 leading-relaxed">{logic.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Impact News Filter */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4">가설 체크 뉴스</h3>
            {stock.newsTags.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-base text-zinc-500">
                특이 사항이 없는 조용한 하루네요.
              </div>
            ) : (
              <div className="space-y-4">
                {stock.newsTags.map((news, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-2xl border ${news.type === 'Positive' ? 'bg-app-positive/5 border-app-positive/20' : 'bg-app-negative/5 border-app-negative/20'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${news.type === 'Positive' ? 'bg-app-positive/20 text-app-positive' : 'bg-app-negative/20 text-app-negative'}`}>
                        {news.type === 'Positive' ? '호재' : '악재'}
                      </span>
                      <span className="text-xs text-zinc-500">{news.date}</span>
                    </div>
                    <p className="text-base font-medium text-zinc-200 leading-relaxed">{news.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Spacer for bottom safety */}
          <div className="h-32" />
        </div>

        {/* Section D: The Nudge (Floating Bottom Action) - Only show if NO verification card */}
        {(hasEarningsImminent || isOverheated) && !verificationEvent && (
          <div className="absolute bottom-8 left-4 right-4 animate-in slide-in-from-bottom duration-500 delay-100 z-20">
            {hasEarningsImminent && (
              <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-app-positive/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-app-positive/10 rounded-full">
                    <Clock size={24} className="text-app-positive" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">내일 실적 발표</p>
                    <p className="text-zinc-400 text-sm">가설 점검이 필요합니다.</p>
                  </div>
                </div>
                <button 
                  onClick={scrollToLogic}
                  className="w-full h-14 bg-app-positive text-white text-lg font-bold rounded-2xl hover:bg-app-positive/90 transition-colors active:scale-95"
                >
                  가설 재점검하기
                </button>
              </div>
            )}

            {isOverheated && !hasEarningsImminent && (
              <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-app-negative/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
                 <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-app-negative/10 rounded-full">
                    <TrendingUp size={24} className="text-app-negative" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">단기 과열 진입</p>
                    <p className="text-zinc-400 text-sm">수익 실현을 고민해볼까요?</p>
                  </div>
                </div>
                <button className="w-full h-14 bg-app-negative text-white text-lg font-bold rounded-2xl hover:bg-app-negative/90 transition-colors active:scale-95">
                  수익 실현하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetailModal;