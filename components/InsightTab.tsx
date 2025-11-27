
import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSun, Sparkles } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

const InsightTab: React.FC = () => {
  const { data } = useStore();
  const { marketWeather, hotIssues, summaryHighlights } = data;
  const [headerTitle, setHeaderTitle] = useState("투데이");
  const [activeTab, setActiveTab] = useState('KOSPI');
  
  // Logic to switch chart data based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 21) {
      setActiveTab('KOSPI');
    } else {
      setActiveTab('S&P 500');
    }
  }, []);

  // Scroll Handler for Sticky Header Dynamic Title
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = 300; // Approx height of the first section content
    if (scrollTop > threshold) {
      setHeaderTitle("오늘의 이슈 종목");
    } else {
      setHeaderTitle("투데이");
    }
  };

  const getWeatherIcon = (status: string) => {
    switch (status) {
      case 'Cloudy': return <Cloud size={64} className="text-zinc-400" strokeWidth={1.5} />;
      case 'Sunny': return <Sun size={64} className="text-amber-400" strokeWidth={1.5} />;
      case 'Rainy': return <CloudRain size={64} className="text-blue-400" strokeWidth={1.5} />;
      case 'PartlyCloudy': return <CloudSun size={64} className="text-zinc-300" strokeWidth={1.5} />;
      default: return <Cloud size={64} className="text-zinc-400" strokeWidth={1.5} />;
    }
  };

  // Custom Chart Logic
  const selectedIndex = marketWeather.indices.find((i: any) => i.name === activeTab) || marketWeather.indices[0];
  const chartData: number[] = selectedIndex.chartData || [];
  
  // Chart dimensions
  const width = 340;
  const height = 180;
  const paddingY = 20;
  
  // Y-Axis Scaling: Fixed range [-1.5%, 1.5%] for visual stability or dynamic
  const maxAbs = 1.5; 
  const scaleY = (val: number) => {
    // val is %, map -1.5 to height, 1.5 to 0
    return height/2 - (val / maxAbs) * (height/2 - paddingY);
  };
  
  const stepX = width / (chartData.length - 1);
  const points = chartData.map((val, i) => `${i * stepX},${scaleY(val)}`).join(' ');
  const zeroY = height / 2;
  const isPositive = selectedIndex.rate >= 0;
  const chartColor = isPositive ? '#F87171' : '#60A5FA'; // Red or Blue

  return (
    <div className="h-full flex flex-col relative bg-app-bg">
      {/* 1. Dynamic Fixed Header */}
      <div className="absolute top-0 left-0 w-full z-20 px-6 pt-12 pb-4 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-white transition-all key={headerTitle} animate-in fade-in slide-in-from-top-2 duration-300">
          {headerTitle}
        </h1>
        <p className="text-base text-app-text-secondary mt-1">
          {headerTitle === "투데이" ? "오늘의 시장 날씨" : "지금 주목해야 할 움직임"}
        </p>
      </div>

      {/* 2. Scroll Container (Snap) */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-[100px]"
      >
        
        {/* Section 1: Market Weather & Chart */}
        <section className="snap-start min-h-full flex flex-col pt-36 px-6 pb-12">
          
          {/* Structured Text Summary */}
          <div className="mb-10 pl-5 border-l-4 border-app-accent">
            <h2 className="text-3xl font-bold text-white mb-3">{marketWeather.summaryTitle}</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {summaryHighlights.map((part: any, idx: number) => (
                <span key={idx} className={part.isBold ? "text-white font-bold" : ""}>
                  {part.text}
                </span>
              ))}
            </p>
          </div>

          {/* Unified Chart Card */}
          <div className="bg-[#1E1E1E] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
             {/* Chart Header: Tabs & Value */}
             <div className="flex justify-between items-start mb-6 z-10 relative">
               <div>
                  <div className="flex space-x-2 mb-2">
                    {['S&P 500', 'NASDAQ', 'KOSPI'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-bold px-3 py-1 rounded-full transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">{selectedIndex.value}</span>
                    <span className={`text-lg font-bold ${isPositive ? 'text-app-positive' : 'text-app-negative'}`}>
                       {isPositive ? '+' : ''}{selectedIndex.rate}%
                    </span>
                  </div>
               </div>
             </div>

             {/* The High-Precision SVG Chart */}
             <div className="relative w-full h-[180px]">
                {/* Y-Axis Labels (Right Side) */}
                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-xs font-bold text-zinc-600 py-4 pointer-events-none z-0">
                   <span>+1.5%</span>
                   <span>0%</span>
                   <span>-1.5%</span>
                </div>

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 relative">
                  {/* Dashed Zero Line */}
                  <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* The Data Line */}
                  <polyline 
                    points={points} 
                    fill="none" 
                    stroke={chartColor} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  
                  {/* Gradient Area under line */}
                  <defs>
                    <linearGradient id={`grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={chartColor} stopOpacity="0.2" />
                       <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M0,${zeroY} L0,${scaleY(chartData[0])} ${points.replace(/ /g, ' L')} L${width},${zeroY} Z`} 
                    fill={`url(#grad-${activeTab})`} 
                    stroke="none"
                  />

                  {/* Pulsing Dot at End */}
                  <circle 
                    cx={width} 
                    cy={scaleY(chartData[chartData.length-1])} 
                    r="6" 
                    fill="#121212" 
                    stroke={chartColor} 
                    strokeWidth="3"
                    className="animate-pulse" 
                  />
                </svg>
                
                {/* X-Axis Labels (Time) */}
                <div className="flex justify-between text-xs font-bold text-zinc-600 mt-2 px-1">
                   <span>{activeTab === 'KOSPI' ? '09:00' : '22:30'}</span>
                   <span>{activeTab === 'KOSPI' ? '12:00' : '02:00'}</span>
                   <span>{activeTab === 'KOSPI' ? '15:30' : '05:00'}</span>
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex justify-center animate-bounce opacity-30">
             <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* Section 2: Hot Issues */}
        <section className="snap-start min-h-full flex flex-col justify-center px-6 pb-24 relative">
          {hotIssues.map((issue) => (
            <div key={issue.ticker} className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] p-8 rounded-[32px] border border-app-accent/30 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-app-accent/5 rounded-full blur-3xl -mr-10 -mt-10" />
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="inline-block px-3 py-1 bg-app-accent/10 text-app-accent text-sm font-bold rounded-lg mb-2">HOT ISSUE</span>
                     <div className="flex items-baseline space-x-3">
                        <span className="text-4xl font-extrabold text-white">{issue.name}</span>
                        <span className="text-xl text-zinc-500 font-bold">{issue.ticker}</span>
                     </div>
                   </div>
                   <div className={`text-3xl font-bold tracking-tight ${issue.rate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                     {issue.rate > 0 ? '+' : ''}{issue.rate}%
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div>
                     <p className="text-sm font-bold text-zinc-500 mb-2">상승 원인</p>
                     <p className="text-2xl font-bold text-white leading-snug">{issue.cause}</p>
                   </div>
                   
                   <div className="bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-1 h-full min-h-[40px] bg-app-accent rounded-full" />
                        <p className="text-lg text-zinc-300 leading-relaxed italic">
                          "{issue.analystComment}"
                        </p>
                      </div>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default InsightTab;
