import type { Point, Wall } from './types';

export function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function wallLength(w: Wall): number {
  return dist({ x: w.ax, y: w.ay }, { x: w.bx, y: w.by });
}

export function toMeters(mm: number): number {
  return mm / 1000;
}

/** 3456 мм → "3.46" (для HUD и подписей на плане) */
export function formatMeters(mm: number): string {
  return (Math.round((mm / 1000) * 100) / 100).toFixed(2);
}

/** Расстояние от точки до отрезка (для hit-test стен и привязки к оси) */
export function distPointToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
}

/** Угол отрезка a→b в градусах. Координаты экранные (Y вниз): 0° вправо, 90° вниз. */
export function angleDeg(a: Point, b: Point): number {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}