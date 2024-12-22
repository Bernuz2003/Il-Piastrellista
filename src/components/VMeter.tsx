import React from 'react';
import { getColorForProgress } from '../utils/colors';

interface VMeterProps {
  currentMatrix: number[][];
  rows: number;
  cols: number;
}

export function VMeter({ currentMatrix, rows, cols }: VMeterProps) {
  const total = rows * cols;
  const segments = new Array(total).fill(0);
  const maxValue = Math.max(...currentMatrix.flat());
  
  // Fill segments based on current matrix values
  for (let i = 1; i <= maxValue; i++) {
    segments[i-1] = i;
  }

  return (
    <div className="w-[30px] h-[120px] flex flex-col justify-end bg-gray-100 rounded-lg overflow-hidden p-1">
      {segments.map((value, index) => (
        <div
          key={index}
          className="w-full transition-all duration-200"
          style={{
            height: '4px',
            backgroundColor: value ? getColorForProgress(value, total) : 'transparent',
            marginBottom: '1px'
          }}
        />
      ))}
    </div>
  );
}