import type { Point, Wall } from './types';
import { roundTo } from './round';
import { orthoAdjust } from './ortho';

export type SnapKind = 'endpoint' | 'ortho' | 'grid' | 'none';

export interface SnapResult { point: Point; kind: SnapKind }

export interface SnapOptions {
  /** Радиус ловли концов стен, мм (по умолчанию 150) */
  endpointRadius?: number;
  /** Шаг сетки, мм (по умолчанию 100) */
  grid?: number;
  /** Точка цепи для ortho-доводки (последний поставленный конец стены) */
  orthoFrom?: Point | null;
  orthoToleranceDeg?: number;
  /** Alt удержан — привязки выключены */
  disable?: boolean;
}

/**
 * Привязки по приоритету (спецификация шага 1):
 * 1) концы существующих стен (radius 150 мм)
 * 2) ortho-доводка угла от точки цепи (±7°, округление 10 мм)
 * 3) сетка 100 мм
 * 4) none при disable
 */
export function snapPoint(raw: Point, walls: Wall[], opts: SnapOptions = {}): SnapResult {
  if (opts.disable) return { point: { ...raw }, kind: 'none' };

  const endpointRadius = opts.endpointRadius ?? 150;
  const grid = opts.grid ?? 100;

  let best: Point | null = null;
  let bestD = endpointRadius;
  for (const w of walls) {
    for (const p of [{ x: w.ax, y: w.ay }, { x: w.bx, y: w.by }]) {
      const d = Math.hypot(p.x - raw.x, p.y - raw.y);
      if (d < bestD) { bestD = d; best = p; }
    }
  }
  if (best) return { point: { x: best.x, y: best.y }, kind: 'endpoint' };

  if (opts.orthoFrom) {
    const adj = orthoAdjust(opts.orthoFrom, raw, opts.orthoToleranceDeg ?? 7);
    if (adj.x !== raw.x || adj.y !== raw.y) {
      return { point: { x: roundTo(adj.x, 10), y: roundTo(adj.y, 10) }, kind: 'ortho' };
    }
  }

  return { point: { x: roundTo(raw.x, grid), y: roundTo(raw.y, grid) }, kind: 'grid' };
}