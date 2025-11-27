
import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketIndexChart: React.FC = () => {
  const { data } = useStore();
  const { indices } = data.marketWeather;
  
  const [activeTab, setActiveTab] = useState<string>('KOSPI');

  // Auto-select based on time (09:00 - 21:00 KST -> KOSPI, else S&P 500)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 21) {
      setActiveTab('KOSPI');
    } else {
      setActiveTab('S&P 500');
    }
  }, []);

  const selectedIndex = indices.find(i => i.name === activeTab) || indices[0];
  const isPositive = selectedIndex.rate >= 0;
  const color = isPositive ? '#F87171' : '#60A5FA';

  // --- CHART CONFIGURATION ---
  const points = selectedIndex.chartData;
  const svgWidth = 350;
  const svgHeight = 160;
  const padding = { top: 20, right: 0, bottom: 30, left: 0 }; // Adjusted for labels
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate Min/Max for Scaling
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  // Add some buffer to the range so line doesn't hit the absolute edge
  const buffer = range * 0.1;
  const effectiveMin = minVal - buffer;
  const effectiveRange = range + (buffer * 2);

  const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Generate SVG Path
  const generatePath = (dataPoints: number[]) => {
    if (!dataPoints || dataPoints.length === 0) return '';
    return dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * graphWidth + padding.left;
      const y = svgHeight - padding.bottom - ((val - effectiveMin) / effectiveRange) * graphHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  const linePath = `M ${generatePath(points)}`;
  const areaPath = `${linePath} L ${svgWidth},${svgHeight - padding.bottom} L ${padding.left},${svgHeight - padding.bottom} Z`;

  // Calculate last point for the pulsing dot
  const lastVal = points[points.length - 1];
  const lastX = svgWidth; // Since we use full width
  const lastY = svgHeight - padding.bottom - ((lastVal - effectiveMin) / effectiveRange) * graphHeight;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-white/5 p-1 rounded-2xl w-max mx-auto">
        {['S&P 500', 'NASDAQ', 'KOSPI'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[#1E1E1E] text-white shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Info Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-black text-white mb-2 tracking-tight">
          {selectedIndex.value}
        </div>
        <div className={`flex items-center justify-center text-lg font-bold ${isPositive ? 'text-app-positive' : 'text-app-negative'}`}>
          {isPositive ? <TrendingUp size={20} className="mr-2" /> : <TrendingDown size={20} className="mr-2" />}
          {selectedIndex.rate > 0 ? '+' : ''}{selectedIndex.rate}%
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-[200px] bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 overflow-hidden p-0">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area Fill */}
          <path d={areaPath} fill="url(#gradientArea)" stroke="none" />
          
          {/* Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke={color} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Y-Axis Min/Max Labels (Inside the chart area) */}
          <text x={10} y={25} className="text-[10px] fill-zinc-500 font-medium" textAnchor="start">
            High {formatNumber(maxVal)}
          </text>
          <text x={10} y={svgHeight - padding.bottom - 10} className="text-[10px] fill-zinc-500 font-medium" textAnchor="start">
            Low {formatNumber(minVal)}
          </text>

          {/* X-Axis Time Labels */}
          <g className="text-[10px] fill-zinc-500 font-medium">
            <text x={padding.left} y={svgHeight - 10} textAnchor="start">09:00</text>
            <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle">12:00</text>
            <text x={svgWidth} y={svgHeight - 10} textAnchor="end">15:30</text>
          </g>

          {/* Current Point Dot */}
          <circle 
            cx={lastX} 
            cy={lastY}
            r="4"
            fill="#121212"
            stroke={color}
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
};

export default MarketIndexChart;
