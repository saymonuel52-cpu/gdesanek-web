import type { Point } from './types';

const ORTHO_ANGLES = [0, 45, 90, 135, 180, -135, -90, -45];

/**
 * Доводка угла до ближайшего ортогонального (0/45/90/135°),
 * если отклонение ≤ toleranceDeg (по умолчанию 7°).
 * Длина отрезка сохраняется.
 */
export function orthoAdjust(a: Point, b: Point, toleranceDeg = 7): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return { ...b };
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  for (const target of ORTHO_ANGLES) {
    let diff = ang - target;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    if (Math.abs(diff) <= toleranceDeg) {
      const rad = (target * Math.PI) / 180;
      return { x: a.x + Math.cos(rad) * len, y: a.y + Math.sin(rad) * len };
    }
  }
  return { ...b };
}