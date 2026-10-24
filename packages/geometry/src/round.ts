/** Округление к шагу сетки: roundTo(3456, 10) = 3460 */
export function roundTo(v: number, step: number): number {
  return Math.round(v / step) * step;
}