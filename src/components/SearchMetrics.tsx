import React from 'react';

interface SearchMetricsProps {
  elapsedTime: number;
  solutionCount: number;
  moveCount: number;
}

export function SearchMetrics({ elapsedTime, solutionCount, moveCount }: SearchMetricsProps) {
  const metrics = {
    TT: `${(elapsedTime / 1000).toFixed(1)}s`,
    TMS: solutionCount > 0 ? `${(elapsedTime / solutionCount).toFixed(0)}ms` : '0ms',
    MPS: solutionCount > 0 ? (moveCount / solutionCount).toFixed(1) : '0.0',
    TMM: moveCount > 0 ? `${(elapsedTime / moveCount).toFixed(1)}ms` : '0.0ms'
  };

  return (
    <div className="space-y-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {Object.keys(metrics).map(key => (
              <th key={key} className="px-2 py-1 text-left font-medium text-gray-600">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(metrics).map((value, i) => (
              <td key={i} className="px-2 py-1 font-mono text-gray-800">
                {value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
        <div>TT: Tempo Totale</div>
        <div>TMS: Tempo Medio Soluzione</div>
        <div>MPS: Mosse Per Soluzione</div>
        <div>TMM: Tempo Medio Mossa</div>
      </div>
    </div>
  );
}