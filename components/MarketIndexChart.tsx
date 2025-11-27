
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
    // Assuming user is in KST or similar timezone for the prototype logic
    if (hour >= 9 && hour < 21) {
      setActiveTab('KOSPI');
    } else {
      setActiveTab('S&P 500');
    }
  }, []);

  const selectedIndex = indices.find(i => i.name === activeTab) || indices[0];
  const isPositive = selectedIndex.rate >= 0;
  const color = isPositive ? '#F87171' : '#60A5FA';

  // Generate SVG Path
  const generatePath = (dataPoints: number[], width: number, height: number) => {
    if (!dataPoints || dataPoints.length === 0) return '';
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = max - min || 1;
    
    // Add padding to avoid cutting off peaks
    const paddedRange = range * 1.2;
    const padding = (paddedRange - range) / 2;
    const effectiveMin = min - padding;

    const points = dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * width;
      const y = height - ((val - effectiveMin) / paddedRange) * height;
      return `${x},${y}`;
    });

    // Simple line join
    return points.join(' ');
  };

  const generateAreaPath = (linePath: string, width: number, height: number) => {
    return `${linePath} ${width},${height} 0,${height}`;
  };

  const points = selectedIndex.chartData;
  const width = 350; // Viewport width for SVG
  const height = 160;
  const linePath = `M ${generatePath(points, width, height)}`;
  const areaPath = generateAreaPath(linePath, width, height);

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
      <div className="relative w-full h-[200px] bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 overflow-hidden p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area Fill */}
          <path d={`M ${generatePath(points, width, height)} L ${width},${height} L 0,${height} Z`} fill="url(#gradientArea)" stroke="none" />
          
          {/* Line */}
          <path 
            d={`M ${generatePath(points, width, height)}`} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Current Point Dot */}
          <circle 
            cx={width} 
            cy={height - ((points[points.length - 1] - (Math.min(...points) - (Math.max(...points) - Math.min(...points)) * 0.1)) / ((Math.max(...points) - Math.min(...points)) * 1.2)) * height}
            r="6"
            fill="#121212"
            stroke={color}
            strokeWidth="3"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
};

export default MarketIndexChart;
