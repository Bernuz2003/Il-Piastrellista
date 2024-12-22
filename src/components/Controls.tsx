import React from 'react';

interface ControlsProps {
  rows: number;
  cols: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  startRow: number;
  startCol: number;
  onStartRowChange: (row: number) => void;
  onStartColChange: (col: number) => void;
  onInitialize: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isSearching: boolean;
  isComplete: boolean;
  solutionCount: number;
  currentSolutionIndex: number;
}

export function Controls({
  rows,
  cols,
  onRowsChange,
  onColsChange,
  startRow,
  startCol,
  onStartRowChange,
  onStartColChange,
  onInitialize,
  onStop,
  onPrevious,
  onNext,
  isSearching,
  isComplete,
  solutionCount,
  currentSolutionIndex
}: ControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Righe (N)</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRowsChange(Math.max(1, rows - 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSearching}
            >
              -
            </button>
            <span className="w-8 text-center">{rows}</span>
            <button
              onClick={() => onRowsChange(rows + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSearching}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Colonne (M)</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onColsChange(Math.max(1, cols - 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSearching}
            >
              -
            </button>
            <span className="w-8 text-center">{cols}</span>
            <button
              onClick={() => onColsChange(cols + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSearching}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Riga iniziale</label>
          <input
            type="number"
            min="0"
            max={rows - 1}
            value={startRow}
            onChange={(e) => onStartRowChange(Math.min(rows - 1, Math.max(0, parseInt(e.target.value) || 0)))}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Colonna iniziale</label>
          <input
            type="number"
            min="0"
            max={cols - 1}
            value={startCol}
            onChange={(e) => onStartColChange(Math.min(cols - 1, Math.max(0, parseInt(e.target.value) || 0)))}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            disabled={isSearching}
          />
        </div>
      </div>

      <div className="space-y-2">
        {!isSearching ? (
          <button
            onClick={onInitialize}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Inizia Ricerca
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Interrompi Ricerca
          </button>
        )}

        {solutionCount > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              disabled={currentSolutionIndex === 0}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Precedente
            </button>
            <button
              onClick={onNext}
              disabled={currentSolutionIndex >= solutionCount - 1}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Successiva →
            </button>
          </div>
        )}

        {isComplete && (
          <div className="text-center text-green-600 font-medium">
            Ricerca completata!
          </div>
        )}
      </div>
    </div>
  );
}