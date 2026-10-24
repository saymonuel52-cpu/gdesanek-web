import { describe, it, expect } from 'vitest';
import { snapPoint } from '../snap';
import type { Wall } from '../types';

const walls: Wall[] = [
  { id: 'w1', ax: 0, ay: 0, bx: 2000, by: 0, thickness: 100, material: 'gkl' },
  { id: 'w2', ax: 2000, ay: 0, bx: 2000, by: 1000, thickness: 100, material: 'gkl' },
];

describe('snapPoint', () => {
  it('ловит конец стены в радиусе 150 мм', () => {
    const r = snapPoint({ x: 2100, y: 60 }, walls);
    expect(r.kind).toBe('endpoint');
    expect(r.point).toEqual({ x: 2000, y: 0 });
  });
  it('дальше 150 мм от конца — не endpoint', () => {
    const r = snapPoint({ x: 2300, y: 0 }, walls, { orthoFrom: null });
    expect(r.kind).not.toBe('endpoint');
  });
  it('ortho: от точки цепи 84° → 90°, округление 10 мм', () => {
    const r = snapPoint({ x: 200, y: 2000 }, walls, { orthoFrom: { x: 0, y: 0 } });
    expect(r.kind).toBe('ortho');
    expect(r.point.x).toBe(0);
    expect(r.point.y).toBe(2010);
  });
  it('сетка: 1234,5678 → 1200,5700', () => {
    const r = snapPoint({ x: 1234, y: 5678 }, [], { orthoFrom: null });
    expect(r.kind).toBe('grid');
    expect(r.point).toEqual({ x: 1200, y: 5700 });
  });
  it('disable: сырая точка, kind none', () => {
    const r = snapPoint({ x: 1234, y: 5678 }, walls, { disable: true });
    expect(r.kind).toBe('none');
    expect(r.point).toEqual({ x: 1234, y: 5678 });
  });
  it('приоритет: endpoint выше ortho и сетки', () => {
    const r = snapPoint({ x: 2050, y: 1050 }, walls, { orthoFrom: { x: 2000, y: 0 } });
    expect(r.kind).toBe('endpoint');
    expect(r.point).toEqual({ x: 2000, y: 1000 });
  });
});