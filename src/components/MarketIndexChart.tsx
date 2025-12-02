
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getBezierPath } from '../utils/chartUtils';

const MarketIndexChart: React.FC = () => {
  const { data } = useStore();
  const { indices } = data.marketWeather;

  const [activeTab, setActiveTab] = useState<string>('KOSPI');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 21) setActiveTab('KOSPI');
    else setActiveTab('S&P 500');
  }, []);

  const selectedIndex = indices.find(i => i.name === activeTab) || indices[0];

  if (!selectedIndex) {
    return <div className="w-full h-[260px] flex items-center justify-center text-zinc-500 text-xs">Market data unavailable</div>;
  }

  const marketData = selectedIndex.chartData;

  const myAssetData = useMemo(() => {
    const startPrice = marketData[0];
    return marketData.map((val, i) => {
      const volatility = (Math.sin(i) * val * 0.005);
      const alpha = (i * val * 0.001);
      return val - volatility - alpha;
    });
  }, [marketData]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgHeight = 260;
  const padding = { top: 40, right: 50, bottom: 30, left: 50 };

  const startMarket = marketData[0];
  const startMyAsset = myAssetData[0];

  const marketPct = marketData.map(v => ((v - startMarket) / startMarket) * 100);
  const myAssetPct = myAssetData.map(v => ((v - startMyAsset) / startMyAsset) * 100);

  const allPct = [...marketPct, ...myAssetPct];
  const maxPct = Math.max(...allPct, 0.5);
  const minPct = Math.min(...allPct, -0.5);
  const rangePct = maxPct - minPct;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left - padding.left;
    const effectiveWidth = rect.width - padding.left - padding.right;

    const index = Math.round((x / effectiveWidth) * (marketData.length - 1));
    const clampedIndex = Math.max(0, Math.min(marketData.length - 1, index));
    setHoverIndex(clampedIndex);
  };

  const handleMouseLeave = () => setHoverIndex(null);

  const viewWidth = 600;
  const graphWidth = viewWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const getX = (i: number) => padding.left + (i / (marketData.length - 1)) * graphWidth;
  const getY = (pct: number) => padding.top + graphHeight - ((pct - minPct) / rangePct) * graphHeight;

  const marketPoints: [number, number][] = marketPct.map((pct, i) => [getX(i), getY(pct)]);
  const myAssetPoints: [number, number][] = myAssetPct.map((pct, i) => [getX(i), getY(pct)]);

  const marketPath = getBezierPath(marketPoints);
  const myAssetPath = getBezierPath(myAssetPoints);

  const yLabels = [minPct, minPct + rangePct / 2, maxPct];
  const xLabels = ['09:00', '12:00', '15:30'];

  const currentMarketPct = hoverIndex !== null ? marketPct[hoverIndex] : marketPct[marketPct.length - 1];
  const currentMyAssetPct = hoverIndex !== null ? myAssetPct[hoverIndex] : myAssetPct[myAssetPct.length - 1];
  const currentMarketVal = hoverIndex !== null ? marketData[hoverIndex] : marketData[marketData.length - 1];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-8">
        <div className="flex space-x-1 bg-[#1E1E1E] p-1 rounded-xl mb-4">
          {['S&P 500', 'NASDAQ', 'KOSPI'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#333] text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-4xl font-black text-white tracking-tight mb-2">
          {currentMarketVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center text-lg font-bold ${currentMarketPct >= 0 ? 'text-app-positive' : 'text-blue-400'}`}>
          {currentMarketPct >= 0 ? <TrendingUp size={20} className="mr-2" /> : <TrendingDown size={20} className="mr-2" />}
          {currentMarketPct > 0 ? '+' : ''}{currentMarketPct.toFixed(2)}%
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[260px] bg-[#1a1a1a] rounded-[32px] border border-white/5 overflow-hidden mb-10 select-none touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
        <div className="absolute top-4 left-6 text-xs font-bold text-zinc-500">High {marketData.reduce((a, b) => Math.max(a, b)).toLocaleString()}</div>
        <div className="absolute bottom-4 left-6 text-xs font-bold text-zinc-500">Low {marketData.reduce((a, b) => Math.min(a, b)).toLocaleString()}</div>

        <svg viewBox={`0 0 ${viewWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          {yLabels.map(tick => {
            const y = getY(tick);
            return (
              <line key={tick} x1={padding.left} y1={y} x2={viewWidth - padding.right} y2={y} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
            )
          })}
          <line x1={padding.left} y1={getY(0)} x2={viewWidth - padding.right} y2={getY(0)} stroke="#666" strokeWidth="1" strokeDasharray="2 2" />

          <path d={marketPath} fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          <path d={myAssetPath} fill="none" stroke="#F87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {hoverIndex !== null && (
            <>
              <line
                x1={getX(hoverIndex)} y1={padding.top}
                x2={getX(hoverIndex)} y2={svgHeight - padding.bottom}
                stroke="white" strokeWidth="1"
              />
              <circle cx={getX(hoverIndex)} cy={getY(currentMarketPct)} r="4" fill="#121212" stroke="#34D399" strokeWidth="2" />
              <circle cx={getX(hoverIndex)} cy={getY(currentMyAssetPct)} r="4" fill="#F87171" stroke="white" strokeWidth="2" />
            </>
          )}

          <g className="text-[10px] fill-zinc-500 font-medium">
            <text x={padding.left - 10} y={getY(maxPct)} textAnchor="end">{maxPct.toFixed(1)}%</text>
            <text x={padding.left - 10} y={getY(0)} textAnchor="end" alignmentBaseline="middle">0%</text>
            <text x={padding.left - 10} y={getY(minPct)} textAnchor="end">{minPct.toFixed(1)}%</text>
          </g>

          <g className="text-[10px] fill-zinc-500 font-medium">
            <text x={viewWidth - padding.right + 10} y={getY(maxPct)} textAnchor="start">
              {(startMarket * (1 + maxPct / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </text>
            <text x={viewWidth - padding.right + 10} y={getY(minPct)} textAnchor="start">
              {(startMarket * (1 + minPct / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </text>
          </g>

          <g className="text-[10px] fill-zinc-600 font-bold">
            <text x={padding.left} y={svgHeight - 10} textAnchor="start">{xLabels[0]}</text>
            <text x={viewWidth / 2} y={svgHeight - 10} textAnchor="middle">{xLabels[1]}</text>
            <text x={viewWidth - padding.right} y={svgHeight - 10} textAnchor="end">{xLabels[2]}</text>
          </g>
        </svg>

        {hoverIndex !== null && (
          <div
            className="absolute z-20 bg-[#121212]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl pointer-events-none min-w-[140px]"
            style={{
              top: '20px',
              left: `${(hoverIndex / (marketData.length - 1)) * 60 + 20}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
              <span className="text-xs font-bold text-zinc-400">11.23 14:00</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#34D399] font-bold">시장 평균</span>
                <span className="text-xs text-white font-mono">{currentMarketPct > 0 ? '+' : ''}{currentMarketPct.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#F87171] font-bold">내 자산</span>
                <span className="text-xs text-white font-mono">{currentMyAssetPct > 0 ? '+' : ''}{currentMyAssetPct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-6 flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-[#F87171] rounded-full" />
            <span className="text-[10px] font-bold text-zinc-400">내 자산</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-[#34D399] rounded-full" />
            <span className="text-[10px] font-bold text-zinc-400">미국 S&P 500</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MarketIndexChart;
