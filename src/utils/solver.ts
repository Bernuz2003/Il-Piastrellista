type Position = {
  row: number;
  col: number;
};

const MOVES = [
  { row: 0, col: 3 },
  { row: 0, col: -3 },
  { row: 3, col: 0 },
  { row: -3, col: 0 },
  { row: 2, col: 2 },
  { row: 2, col: -2 },
  { row: -2, col: 2 },
  { row: -2, col: -2 },
];

export function isValidPosition(
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

export function findNextMoves(
  current: Position,
  matrix: number[][],
  rows: number,
  cols: number
): Position[] {
  const moves: Position[] = [];
  for (let i = 0; i < MOVES.length; i++) {
    const newRow = current.row + MOVES[i].row;
    const newCol = current.col + MOVES[i].col;
    if (
      isValidPosition(newRow, newCol, rows, cols) &&
      matrix[newRow][newCol] === 0
    ) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  return moves;
}

// Controllo preliminare: Verifica se tutte le celle sono raggiungibili
// in teoria dalla posizione iniziale, considerando la griglia tutta "vuota".
function globalReachabilityCheck(
  rows: number,
  cols: number,
  startPos: Position
): boolean {
  // In questa fase consideriamo la griglia vuota: tutte le celle = 0
  // Basta un array fittizio per il check
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[startPos.row][startPos.col] = true;

  const queue: Position[] = [startPos];
  let reachableCount = 1;

  while (queue.length > 0) {
    const pos = queue.shift() as Position;
    for (const m of MOVES) {
      const nr = pos.row + m.row;
      const nc = pos.col + m.col;
      if (
        isValidPosition(nr, nc, rows, cols) &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        queue.push({ row: nr, col: nc });
        reachableCount++;
      }
    }
  }

  return reachableCount === rows * cols;
}

// Funzione per controllare la connettività delle celle vuote già introdotta
function allEmptyCellsReachable(
  startPos: Position,
  matrix: number[][],
  rows: number,
  cols: number
): boolean {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let emptyCellsCount = 0;
  let reachableEmptyCells = 0;

  // Conta quante celle vuote totali ci sono
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        emptyCellsCount++;
      }
    }
  }

  if (emptyCellsCount === 0) return true; // Nessuna cella vuota => tutto ok

  const queue: Position[] = [startPos];
  visited[startPos.row][startPos.col] = true;

  while (queue.length > 0) {
    const pos = queue.shift() as Position;
    if (matrix[pos.row][pos.col] === 0) {
      reachableEmptyCells++;
    }
    for (const m of MOVES) {
      const nr = pos.row + m.row;
      const nc = pos.col + m.col;
      if (
        isValidPosition(nr, nc, rows, cols) &&
        !visited[nr][nc] &&
        matrix[nr][nc] === 0
      ) {
        visited[nr][nc] = true;
        queue.push({ row: nr, col: nc });
      }
    }
  }

  return reachableEmptyCells === emptyCellsCount;
}

export function* solvePuzzleGenerator(
  matrix: number[][],
  rows: number,
  cols: number,
  currentNum: number,
  currentPos: Position,
  yieldEvery: number = 1000
): Generator<number[][]> {
  let iterationCount = 0;

  // **Controllo preliminare di coerenza**
  // Prima di iniziare il backtracking, verifichiamo che tutte le celle siano
  // raggiungibili teoricamente. Se non lo sono, usciamo subito.
  if (!globalReachabilityCheck(rows, cols, currentPos)) {
    // Nessuna soluzione possibile, interrompiamo.
    return;
  }

  function* solve(
    matrix: number[][],
    currentNum: number,
    pos: Position
  ): Generator<number[][]> {
    iterationCount++;

    if (iterationCount % yieldEvery === 0) {
      yield matrix.map((row) => [...row]);
    }

    if (currentNum > rows * cols) {
      return;
    }

    let nextMoves = findNextMoves(pos, matrix, rows, cols);

    // Euristica di riordino delle mosse
    const scoredMoves = [];
    for (const move of nextMoves) {
      matrix[move.row][move.col] = currentNum;
      const subMovesCount = findNextMoves(move, matrix, rows, cols).length;
      matrix[move.row][move.col] = 0;
      scoredMoves.push({ move, subMovesCount });
    }
    scoredMoves.sort((a, b) => a.subMovesCount - b.subMovesCount);
    nextMoves = scoredMoves.map((item) => item.move);

    for (const move of nextMoves) {
      matrix[move.row][move.col] = currentNum;

      // PRUNING basato sulla connettività
      if (!allEmptyCellsReachable(move, matrix, rows, cols)) {
        matrix[move.row][move.col] = 0;
        continue;
      }

      if (currentNum === rows * cols) {
        yield matrix.map((row) => [...row]);
      } else {
        yield* solve(matrix, currentNum + 1, move);
      }

      // Backtrack
      matrix[move.row][move.col] = 0;
    }
  }

  yield* solve(matrix, currentNum, currentPos);
}
