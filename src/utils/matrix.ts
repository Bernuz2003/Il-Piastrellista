export function createEmptyMatrix(rows: number, cols: number): number[][] {
  return Array(rows).fill(0).map(() => Array(cols).fill(0));
}