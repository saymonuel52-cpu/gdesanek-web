export interface Point { x: number; y: number }

export type Material = 'gkl' | 'penoblok' | 'beton' | 'kirpich';

/** Толщина стены по материалу, мм */
export const MATERIAL_THICKNESS: Record<Material, number> = {
  gkl: 100,
  penoblok: 200,
  beton: 200,
  kirpich: 380,
};

/** Стена: ось A→B + толщина (мм), координаты в мм */
export interface Wall {
  id: string;
  ax: number; ay: number;
  bx: number; by: number;
  thickness: number;
  material: Material;
}

export function wallPoints(w: Wall): [Point, Point] {
  return [{ x: w.ax, y: w.ay }, { x: w.bx, y: w.by }];
}