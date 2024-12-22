import React from 'react';
import { SearchMetrics } from './SearchMetrics';

interface SearchStatusProps {
  isSearching: boolean;
  solutionCount: number;
  isComplete: boolean;
  currentSolution: number;
  moveCount: number;
  elapsedTime: number;
}

export function SearchStatus({ 
  isSearching, 
  solutionCount, 
  isComplete, 
  currentSolution, 
  moveCount,
  elapsedTime 
}: SearchStatusProps) {
  return (
    <div className="search-status">
      <div className="flex-1">
        <span className="font-bold text-lg">
          {isComplete 
            ? `Ricerca completata! Trovate ${solutionCount} soluzioni totali`
            : `Soluzioni trovate: ${solutionCount}`}
        </span>
        {solutionCount > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            Visualizzando soluzione {currentSolution} di {solutionCount}
          </div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Mosse effettuate: {moveCount}
        </div>
        <div className="mt-3">
          <SearchMetrics
            elapsedTime={elapsedTime}
            solutionCount={solutionCount}
            moveCount={moveCount}
          />
        </div>
      </div>
    </div>
  );
}