import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import { Matrix } from './components/Matrix';
import { Controls } from './components/Controls';
import { SearchStatus } from './components/SearchStatus';
import { Histogram } from './components/Histogram';
import { VMeter } from './components/VMeter';
import { solvePuzzleGenerator } from './utils/solver';
import { createEmptyMatrix } from './utils/matrix';

function App() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [startRow, setStartRow] = useState(0);
  const [startCol, setStartCol] = useState(0);
  const [matrix, setMatrix] = useState(() => createEmptyMatrix(5, 5));
  const [currentMatrix, setCurrentMatrix] = useState(() => createEmptyMatrix(5, 5));
  const [solutions, setSolutions] = useState<number[][][]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [solutionCount, setSolutionCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [solutionMoves, setSolutionMoves] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const generatorRef = useRef<Generator<number[][]> | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const previousMatrixRef = useRef<number[][]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const newMatrix = createEmptyMatrix(rows, cols);
    setMatrix(newMatrix);
    setCurrentMatrix(newMatrix);
    previousMatrixRef.current = newMatrix;
  }, [rows, cols]);

  const updateTimer = useCallback(() => {
    if (isSearching) {
      setElapsedTime(Date.now() - startTimeRef.current);
      timerRef.current = window.setTimeout(updateTimer, 100);
    }
  }, [isSearching]);

  useEffect(() => {
    if (isSearching) {
      startTimeRef.current = Date.now() - elapsedTime;
      updateTimer();
    } else if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isSearching, updateTimer]);

  const countMoves = useCallback((oldMatrix: number[][], newMatrix: number[][]) => {
    let moves = 0;
    for (let i = 0; i < oldMatrix.length; i++) {
      for (let j = 0; j < oldMatrix[i].length; j++) {
        if (oldMatrix[i][j] !== newMatrix[i][j]) {
          moves++;
        }
      }
    }
    return moves;
  }, []);

  const initializeSearch = useCallback(() => {
    const newMatrix = createEmptyMatrix(rows, cols);
    newMatrix[startRow][startCol] = 1;
    
    setSolutions([]);
    setCurrentMatrix(newMatrix);
    setMatrix(newMatrix);
    setCurrentSolutionIndex(0);
    setSolutionCount(0);
    setMoveCount(0);
    setSolutionMoves([]);
    setElapsedTime(0);
    previousMatrixRef.current = newMatrix.map(row => [...row]);
    startTimeRef.current = Date.now();
    
    generatorRef.current = solvePuzzleGenerator(
      newMatrix,
      rows,
      cols,
      2,
      { row: startRow, col: startCol }
    );
    
    setIsSearching(true);
    setIsComplete(false);
    findNextSolution();
  }, [rows, cols, startRow, startCol]);

  const stopSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    generatorRef.current = null;
    setIsSearching(false);
  }, []);

  const findNextSolution = useCallback(() => {
    if (!generatorRef.current || !isSearching) return;

    try {
      const result = generatorRef.current.next();
      if (!result.done) {
        const moves = countMoves(previousMatrixRef.current, result.value);
        setMoveCount(prev => prev + moves);
        previousMatrixRef.current = result.value.map(row => [...row]);
        setCurrentMatrix(result.value);
        
        const isSolution = result.value.every(row => 
          row.every(cell => cell !== 0)
        );
        
        if (isSolution) {
          const newSolution = result.value.map(row => [...row]);
          setSolutions(prev => {
            const newSolutions = [...prev, newSolution];
            if (prev.length === 0) {
              setMatrix(newSolution);
            }
            return newSolutions;
          });
          setSolutionCount(prev => prev + 1);
          setSolutionMoves(prev => [...prev, moveCount]);
        }

        searchTimeoutRef.current = window.setTimeout(findNextSolution, 0);
      } else {
        setIsComplete(true);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error in solution finding:', error);
      setIsComplete(true);
      setIsSearching(false);
    }
  }, [isSearching, countMoves, moveCount]);

  useEffect(() => {
    if (isSearching) {
      searchTimeoutRef.current = window.setTimeout(findNextSolution, 0);
    }
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [isSearching, findNextSolution]);

  const showPreviousSolution = useCallback(() => {
    if (currentSolutionIndex > 0) {
      const newIndex = currentSolutionIndex - 1;
      setCurrentSolutionIndex(newIndex);
      setMatrix(solutions[newIndex]);
    }
  }, [currentSolutionIndex, solutions]);

  const showNextSolution = useCallback(() => {
    if (currentSolutionIndex < solutions.length - 1) {
      const newIndex = currentSolutionIndex + 1;
      setCurrentSolutionIndex(newIndex);
      setMatrix(solutions[newIndex]);
    }
  }, [currentSolutionIndex, solutions]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto" style={{ maxWidth: '1440px', aspectRatio: '3/2' }}>
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 gap-4 mb-4">
            {/* Left column - Controls and Status */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Il Piastrellista</h1>
                <Controls
                  rows={rows}
                  cols={cols}
                  onRowsChange={setRows}
                  onColsChange={setCols}
                  startRow={startRow}
                  startCol={startCol}
                  onStartRowChange={setStartRow}
                  onStartColChange={setStartCol}
                  onInitialize={initializeSearch}
                  onStop={stopSearch}
                  isSearching={isSearching}
                  isComplete={isComplete}
                  solutionCount={solutionCount}
                  currentSolutionIndex={currentSolutionIndex}
                  onPrevious={showPreviousSolution}
                  onNext={showNextSolution}
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <SearchStatus 
                  isSearching={isSearching}
                  solutionCount={solutionCount}
                  isComplete={isComplete}
                  currentSolution={currentSolutionIndex + 1}
                  moveCount={moveCount}
                  elapsedTime={elapsedTime}
                />
              </div>
            </div>

            {/* Center column - Main Matrix */}
            <div className="col-span-6 bg-white rounded-lg shadow p-4 flex items-center justify-center">
              <div style={{ width: '80%', margin: '0 auto' }}>
                <Matrix matrix={matrix} cols={cols} />
              </div>
            </div>

            {/* Right column - Mini Matrix and VMeter */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Stato ricerca</h3>
                <div className="flex items-start gap-4">
                  <Matrix matrix={currentMatrix} cols={cols} mini={true} />
                  <VMeter 
                    currentMatrix={currentMatrix}
                    rows={rows}
                    cols={cols}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Histogram */}
          <div className="h-1/3 bg-white p-4 rounded-lg shadow">
            <Histogram
              moveCount={moveCount}
              solutionCounts={solutionMoves}
              width={1360}
              height={240}
              elapsedTime={elapsedTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;