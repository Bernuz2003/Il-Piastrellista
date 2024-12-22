import React from 'react';
import { getColorForProgress } from '../utils/colors';

interface MatrixProps {
  matrix: number[][];
  cols: number;
  mini?: boolean;
}

export function Matrix({ matrix, cols, mini = false }: MatrixProps) {
  const baseClass = mini ? 'mini-cell' : 'cell';
  const containerClass = mini ? 'grid gap-0.5' : 'grid gap-2 wood-panel';
  const total = matrix.length * cols;
  
  return (
    <div 
      className={containerClass}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: mini ? '120px' : 'auto'
      }}
    >
      {matrix.map((row, i) => 
        row.map((cell, j) => {
          const cellColor = cell ? getColorForProgress(cell, total) : undefined;
          return (
            <div
              key={`${i}-${j}`}
              className={`${baseClass} ${mini ? (cell === 0 ? 'empty' : 'filled') : ''}`}
              style={mini && cell ? { backgroundColor: cellColor } : {}}
            >
              {!mini && cell ? (
                <span style={{ color: cellColor }}>
                  {cell}
                </span>
              ) : ''}
            </div>
          );
        })
      )}
    </div>
  );
}