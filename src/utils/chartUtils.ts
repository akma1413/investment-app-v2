
/**
 * Generates fake chart data with realistic random walk.
 */
export const generateChartData = (startPrice: number, count: number, trend: 'up' | 'down' | 'volatile') => {
  let current = startPrice;
  const data = [current];
  
  // volatility factor (0.5% of price)
  const vol = startPrice * 0.005; 

  for (let i = 0; i < count - 1; i++) {
    let change = (Math.random() - 0.5) * vol; // Random walk
    
    // Bias based on trend
    if (trend === 'up') change += (vol * 0.2);
    if (trend === 'down') change -= (vol * 0.2);
    if (trend === 'volatile') change *= 1.5;

    current += change;
    // Ensure no negative prices
    if (current < 0) current = 0.1;
    data.push(Number(current.toFixed(2)));
  }
  return data;
};

/**
 * Calculates SVG Path 'd' attribute for a smooth Bezier curve.
 */
export const getBezierPath = (points: [number, number][]) => {
  if (points.length === 0) return "";
  const d = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point[0]},${point[1]}`;
    const [cpsX, cpsY] = a[i - 1]; // Control point start
    const [cpeX, cpeY] = point;    // Control point end
    // Midpoint logic for smoother curves
    const midX = (cpsX + cpeX) / 2;
    return `${acc} C ${midX},${cpsY} ${midX},${cpeY} ${point[0]},${point[1]}`;
  }, "");
  return d;
};

/**
 * Converts raw data points into SVG coordinates.
 */
export const getChartCoordinates = (
    data: number[], 
    width: number, 
    height: number, 
    padding: { top: number, right: number, bottom: number, left: number }
) => {
    if (data.length === 0) return { points: [], min: 0, max: 0, avgY: 0 };

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const buffer = range * 0.1;
    const effectiveMin = minVal - buffer;
    const effectiveRange = range + (buffer * 2);
    
    const avgVal = data.reduce((a, b) => a + b, 0) / data.length;
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const avgY = height - padding.bottom - ((avgVal - effectiveMin) / effectiveRange) * graphHeight;

    const points: [number, number][] = data.map((val, i) => {
        const x = (i / (data.length - 1)) * graphWidth + padding.left;
        const y = height - padding.bottom - ((val - effectiveMin) / effectiveRange) * graphHeight;
        return [x, y];
    });

    return { points, min: minVal, max: maxVal, avgY, effectiveMin, effectiveRange, graphWidth, graphHeight };
};
