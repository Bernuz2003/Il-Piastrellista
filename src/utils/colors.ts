export function getColorForProgress(current: number, total: number): string {
  const progress = current / total;
  const hue = ((1 - progress) * 120).toFixed(0); // 120 is green, 0 is red
  return `hsl(${hue}, 80%, 50%)`;
}