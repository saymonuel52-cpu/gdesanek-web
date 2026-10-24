import { describe, it, expect } from 'vitest';
import { MATERIAL_THICKNESS, wallPoints } from '../types';

describe('types', () => {
  it('ГКЛ = 100 мм', () => expect(MATERIAL_THICKNESS.gkl).toBe(100));
  it('кирпич = 380 мм', () => expect(MATERIAL_THICKNESS.kirpich).toBe(380));
  it('wallPoints возвращает концы оси', () => {
    const [a, b] = wallPoints({ id: 'w', ax: 1, ay: 2, bx: 3, by: 4, thickness: 100, material: 'beton' });
    expect(a).toEqual({ x: 1, y: 2 });
    expect(b).toEqual({ x: 3, y: 4 });
  });
});