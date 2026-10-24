import { describe, it, expect } from 'vitest';
import { dist, wallLength, toMeters, formatMeters, distPointToSegment, angleDeg } from '../measure';
import type { Wall } from '../types';

const w: Wall = { id: 'w1', ax: 0, ay: 0, bx: 3000, by: 4000, thickness: 100, material: 'gkl' };

describe('measure', () => {
  it('dist: треугольник 3-4-5 в мм', () => expect(dist({ x: 0, y: 0 }, { x: 3000, y: 4000 })).toBe(5000));
  it('wallLength: 5000 мм', () => expect(wallLength(w)).toBe(5000));
  it('toMeters: 5000 мм = 5 м', () => expect(toMeters(5000)).toBe(5));
  it('formatMeters: 3456 мм → "3.46"', () => expect(formatMeters(3456)).toBe('3.46'));
  it('formatMeters: 5000 мм → "5.00"', () => expect(formatMeters(5000)).toBe('5.00'));
  it('distPointToSegment: точка на отрезке = 0', () =>
    expect(distPointToSegment({ x: 1500, y: 2000 }, { x: 0, y: 0 }, { x: 3000, y: 4000 })).toBe(0));
  it('distPointToSegment: перпендикуляр = расстояние', () =>
    expect(distPointToSegment({ x: 0, y: 1000 }, { x: 0, y: 0 }, { x: 2000, y: 0 })).toBe(1000));
  it('distPointToSegment: за концом = расстояние до конца', () =>
    expect(distPointToSegment({ x: 3000, y: 0 }, { x: 0, y: 0 }, { x: 2000, y: 0 })).toBe(1000));
  it('angleDeg: вправо = 0°', () => expect(angleDeg({ x: 0, y: 0 }, { x: 1000, y: 0 })).toBe(0));
  it('angleDeg: вниз (экранный Y) = 90°', () => expect(angleDeg({ x: 0, y: 0 }, { x: 0, y: 1000 })).toBe(90));
});