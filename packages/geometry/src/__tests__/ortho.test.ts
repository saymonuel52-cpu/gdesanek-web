import { describe, it, expect } from 'vitest';
import { orthoAdjust } from '../ortho';

describe('orthoAdjust', () => {
  it('84° доводится до 90°', () => {
    const r = orthoAdjust({ x: 0, y: 0 }, { x: 200, y: 2000 });
    expect(r.x).toBeCloseTo(0, 6);
    expect(r.y).toBeCloseTo(Math.hypot(200, 2000), 6);
  });
  it('55° не доводится (вне ±7° от 45°)', () => {
    const b = { x: Math.cos((55 * Math.PI) / 180) * 1000, y: Math.sin((55 * Math.PI) / 180) * 1000 };
    const r = orthoAdjust({ x: 0, y: 0 }, b);
    expect(r.x).toBeCloseTo(b.x, 6);
    expect(r.y).toBeCloseTo(b.y, 6);
  });
  it('178° доводится до 180°', () => {
    const r = orthoAdjust({ x: 0, y: 0 }, { x: -999, y: 35 });
    expect(r.y).toBeCloseTo(0, 6);
    expect(r.x).toBeCloseTo(-Math.hypot(999, 35), 6);
  });
  it('43° доводится до 45° (x = y)', () => {
    const r = orthoAdjust({ x: 0, y: 0 }, { x: 1000, y: 930 });
    expect(r.x).toBeCloseTo(r.y, 6);
  });
  it('нулевая длина — точка как есть', () => {
    expect(orthoAdjust({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual({ x: 5, y: 5 });
  });
});