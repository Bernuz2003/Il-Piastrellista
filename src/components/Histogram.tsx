import React, { useMemo } from 'react';
import { bin, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';

interface HistogramProps {
  moveCount: number;
  solutionCounts: number[];
  width: number;
  height: number;
  elapsedTime: number;
}

export function Histogram({ moveCount, solutionCounts, width = 800, height = 600, elapsedTime }: HistogramProps) {
  const margin = { top: 20, right: 60, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const binCount = Math.min(200, Math.max(10, Math.floor(moveCount / 100)));
  
  const histogram = useMemo(() => {
    if (moveCount === 0 || solutionCounts.length === 0) return [];
    
    const binner = bin()
      .domain([0, moveCount])
      .thresholds(binCount);
    
    return binner(solutionCounts);
  }, [moveCount, solutionCounts, binCount]);

  const maxBinValue = useMemo(() => {
    return max(histogram, d => d.length) || 0;
  }, [histogram]);

  // Calculate TMS data points for all moves
  const tmsData = useMemo(() => {
    if (moveCount === 0) return [];
    
    const points: [number, number][] = [];
    const timePerMove = elapsedTime / moveCount;
    
    // Generate points for every move interval
    for (let moves = 0; moves <= moveCount; moves += Math.max(1, Math.floor(moveCount / 200))) {
      const timeAtPoint = moves * timePerMove;
      const solutionsAtPoint = solutionCounts.filter(count => count <= moves).length;
      const tmsAtPoint = solutionsAtPoint > 0 ? timeAtPoint / solutionsAtPoint : 0;
      points.push([moves, tmsAtPoint]);
    }
    
    return points;
  }, [moveCount, elapsedTime, solutionCounts]);

  const maxTmsValue = useMemo(() => {
    return max(tmsData, d => d[1]) || 0;
  }, [tmsData]);

  const xScale = scaleLinear()
    .domain([0, moveCount])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([0, maxBinValue])
    .range([innerHeight, 0]);

  const yScaleTms = scaleLinear()
    .domain([0, maxTmsValue])
    .range([innerHeight, 0]);

  const barWidth = Math.max(1, (innerWidth / binCount) - 1);

  const linePath = useMemo(() => {
    if (tmsData.length < 2) return '';
    
    return tmsData.reduce((path, point, i) => {
      const x = xScale(point[0]);
      const y = yScaleTms(point[1]);
      return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  }, [tmsData, xScale, yScaleTms]);

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-2">Distribuzione soluzioni e TMS</h3>
      <div className="relative w-full h-[calc(100%-2rem)]">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Y axis - left (histogram) */}
            <g>
              {yScale.ticks(5).map(tick => (
                <g key={`left-${tick}`} transform={`translate(0,${yScale(tick)})`}>
                  <line x2={innerWidth} stroke="#e5e7eb" />
                  <text x="-10" y="4" textAnchor="end" fontSize="12">
                    {tick}
                  </text>
                </g>
              ))}
              <text
                transform={`rotate(-90) translate(${-innerHeight/2}, -35)`}
                textAnchor="middle"
                className="text-sm fill-gray-600"
              >
                Numero di soluzioni
              </text>
            </g>

            {/* Y axis - right (TMS) */}
            <g transform={`translate(${innerWidth}, 0)`}>
              {yScaleTms.ticks(5).map(tick => (
                <g key={`right-${tick}`} transform={`translate(0,${yScaleTms(tick)})`}>
                  <text x="10" y="4" textAnchor="start" fontSize="12" fill="#e11d48">
                    {tick.toFixed(0)}ms
                  </text>
                </g>
              ))}
              <text
                transform={`rotate(-90) translate(${-innerHeight/2}, 45)`}
                textAnchor="middle"
                className="text-sm fill-rose-600"
              >
                TMS (ms)
              </text>
            </g>

            {/* X axis */}
            <g transform={`translate(0,${innerHeight})`}>
              {xScale.ticks(10).map(tick => (
                <g key={tick} transform={`translate(${xScale(tick)},0)`}>
                  <line y2="6" stroke="currentColor" />
                  <text y="20" textAnchor="middle" fontSize="12">
                    {tick}
                  </text>
                </g>
              ))}
              <text
                transform={`translate(${innerWidth/2}, 35)`}
                textAnchor="middle"
                className="text-sm fill-gray-600"
              >
                Numero di mosse
              </text>
            </g>

            {/* Histogram bars */}
            {histogram.map((bin, i) => (
              <rect
                key={i}
                x={xScale(bin.x0 || 0)}
                y={yScale(bin.length)}
                width={Math.max(0, barWidth)}
                height={innerHeight - yScale(bin.length)}
                fill="#8b4513"
                opacity={0.8}
                className="transition-all duration-300"
              />
            ))}

            {/* TMS line */}
            <path
              d={linePath}
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}