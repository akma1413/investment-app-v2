import React from 'react';
import { ArrowRight, TrendingUp, X, CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react';
import { TrendingLogic } from '../types';

interface RelatedStock {
  ticker: string;
  name: string;
  rate?: number | string;
}

interface LogicDetailModalProps {
  logic: TrendingLogic;
  onClose: () => void;
  onStockClick: (ticker: string) => void;
}

const getThemeClasses = (theme?: string) => {
  switch (theme) {
    case 'blue':
      return 'border-blue-400/30 bg-blue-500/10 text-blue-100';
    case 'gold':
      return 'border-amber-400/30 bg-amber-500/10 text-amber-100';
    case 'orange':
      return 'border-orange-400/30 bg-orange-500/10 text-orange-100';
    default:
      return 'border-white/10 bg-white/5 text-white';
  }
};

const formatRate = (rate?: number | string) => {
  if (rate === undefined) return '';
  if (typeof rate === 'string') return rate;
  const prefix = rate > 0 ? '+' : '';
  return `${prefix}${rate}%`;
};

const LogicDetailModal: React.FC<LogicDetailModalProps> = ({ logic, onClose, onStockClick }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="w-full max-w-[430px] bg-[#121212] rounded-t-[32px] sm:rounded-[32px] pointer-events-auto overflow-hidden shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-start p-6 border-b border-white/5 bg-[#121212] sticky top-0 z-20">
          <div className="space-y-2">
            {logic.badge && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getThemeClasses(logic.theme)}`}>
                {logic.badge}
              </span>
            )}
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">{logic.title || '논리 상세'}</h2>
              {logic.subtitle && <p className="text-sm text-zinc-300 mt-1 font-medium">{logic.subtitle}</p>}
            </div>
            {logic.keyword && (
              <div className="flex items-center text-sm text-zinc-200">
                <TrendingUp size={16} className="text-app-accent mr-2" />
                <span className="font-bold">{logic.keyword}</span>
              </div>
            )}
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <X size={24} className="text-zinc-400" />
          </button>
        </header>

        <div className="p-6 space-y-8 bg-[#121212] relative z-0">
          {/* (1) Theme Overview */}
          <section>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">테마 개요</h3>
            {logic.desc && <p className="text-base text-zinc-100 leading-relaxed font-medium">{logic.desc}</p>}
          </section>

          {/* (2) Related Stocks */}
          {logic.relatedStocksDetails && logic.relatedStocksDetails.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">관련 종목</h3>
              <div className="space-y-2">
                {logic.relatedStocksDetails.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => onStockClick(stock.ticker)}
                    className="w-full p-4 rounded-2xl border border-white/10 bg-[#1E1E1E] text-left hover:border-white/20 active:scale-[0.99] transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-white">{stock.name}</div>
                      <div className="text-sm text-zinc-400">{stock.ticker}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-bold ${typeof stock.rate === 'number' && stock.rate > 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                        {formatRate(stock.rate)}
                      </span>
                      <ArrowRight size={18} className="text-zinc-500" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* (3) Price Outlook (Analyst Consensus) */}
          {logic.analystConsensus && (
            <section>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">주가 전망 (Analyst Consensus)</h3>
                <span className="text-[10px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full font-bold">Target: {logic.analystConsensus.target}</span>
              </div>

              <div className="bg-[#1E1E1E] rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {logic.analystConsensus.outlook === 'Positive' && <CheckCircle2 size={24} className="text-app-positive" />}
                    {logic.analystConsensus.outlook === 'Neutral' && <MinusCircle size={24} className="text-zinc-400" />}
                    {logic.analystConsensus.outlook === 'Negative' && <AlertCircle size={24} className="text-app-negative" />}
                    <div>
                      <div className={`text-lg font-bold ${logic.analystConsensus.outlook === 'Positive' ? 'text-app-positive' :
                        logic.analystConsensus.outlook === 'Negative' ? 'text-app-negative' : 'text-zinc-200'
                        }`}>
                        {logic.analystConsensus.outlook === 'Positive' ? '매수 우위 (Buy)' :
                          logic.analystConsensus.outlook === 'Negative' ? '매도 우위 (Sell)' : '중립 (Neutral)'}
                      </div>
                      {logic.analystConsensus.priceTarget && (
                        <div className="text-xs text-zinc-400 mt-0.5 font-medium">목표 주가: <span className="text-white font-bold">{logic.analystConsensus.priceTarget}</span></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Distribution Bar */}
                <div className="space-y-2">
                  <div className="flex h-3 w-full rounded-full overflow-hidden bg-zinc-800">
                    <div style={{ width: `${logic.analystConsensus.distribution.buy}%` }} className="bg-app-positive h-full" />
                    <div style={{ width: `${logic.analystConsensus.distribution.hold}%` }} className="bg-zinc-500 h-full" />
                    <div style={{ width: `${logic.analystConsensus.distribution.sell}%` }} className="bg-app-negative h-full" />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 px-1 font-medium">
                    <span className="text-app-positive">Buy {logic.analystConsensus.distribution.buy}%</span>
                    <span className="text-zinc-400">Hold {logic.analystConsensus.distribution.hold}%</span>
                    <span className="text-app-negative">Sell {logic.analystConsensus.distribution.sell}%</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* (4) Reasons to Watch */}
          {logic.reasonsToWatch && logic.reasonsToWatch.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">주목받는 이유</h3>
              <div className="space-y-3">
                {logic.reasonsToWatch.map((reason, idx) => (
                  <div key={idx} className="bg-zinc-800/40 p-4 rounded-2xl border border-white/10">
                    <div className="text-sm font-bold text-indigo-400 mb-1.5">{reason.title}</div>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                      {reason.content.split('**').map((part, i) =>
                        i % 2 === 1 ? <span key={i} className="text-white font-bold">{part}</span> : part
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogicDetailModal;
