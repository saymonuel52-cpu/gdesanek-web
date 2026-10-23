import { create } from 'zustand';

export interface Wall {
  id: string;
  x1: number; y1: number; x2: number; y2: number;
  thickness: number;
  material: string;
}

export interface PlanObject {
  id: string;
  type: string;
  x: number; y: number;
  rotation: number;
  name: string;
}

export type Tool = 'DRAW_WALL' | 'PLACE' | 'EDIT' | 'PAN';

interface Snapshot { walls: Wall[]; objects: PlanObject[] }

interface PlanStore {
  walls: Wall[];
  objects: PlanObject[];
  tool: Tool;
  ortho: boolean;
  placeType: string | null;
  selectedObjectId: string | null;
  selectedWallId: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  past: Snapshot[];
  future: Snapshot[];

  setTool: (t: Tool) => void;
  toggleOrtho: () => void;
  setPlaceType: (t: string | null) => void;
  setViewport: (scale: number, ox: number, oy: number) => void;
  selectObject: (id: string | null) => void;
  selectWall: (id: string | null) => void;
  addWall: (w: Wall) => void;
  addObject: (o: PlanObject) => void;
  updateObject: (id: string, u: Partial<PlanObject>) => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
}

export const usePlanStore = create<PlanStore>((set, get) => {
  const commit = () => {
    const { walls, objects, past } = get();
    set({ past: [...past.slice(-49), { walls, objects }], future: [] });
  };

  return {
    walls: [],
    objects: [],
    tool: 'EDIT',
    ortho: true,
    placeType: null,
    selectedObjectId: null,
    selectedWallId: null,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    past: [],
    future: [],

    setTool: (tool) => set({ tool }),
    toggleOrtho: () => set((s) => ({ ortho: !s.ortho })),
    setPlaceType: (placeType) => set({ placeType }),
    setViewport: (scale, offsetX, offsetY) => set({ scale, offsetX, offsetY }),
    selectObject: (selectedObjectId) => set({ selectedObjectId, selectedWallId: null }),
    selectWall: (selectedWallId) => set({ selectedWallId, selectedObjectId: null }),

    addWall: (wall) => {
      commit();
      set((s) => ({ walls: [...s.walls, wall], selectedWallId: wall.id }));
    },

    addObject: (obj) => {
      commit();
      set((s) => ({ objects: [...s.objects, obj], selectedObjectId: obj.id }));
    },

    updateObject: (id, u) => {
      commit();
      set((s) => ({
        objects: s.objects.map((o) => (o.id === id ? { ...o, ...u } : o)),
      }));
    },

    deleteSelected: () => {
      const { selectedObjectId, selectedWallId } = get();
      if (!selectedObjectId && !selectedWallId) return;
      commit();
      set((s) => ({
        objects: s.objects.filter((o) => o.id !== selectedObjectId),
        walls: s.walls.filter((w) => w.id !== selectedWallId),
        selectedObjectId: null,
        selectedWallId: null,
      }));
    },

    undo: () => {
      const { past, future, walls, objects } = get();
      if (!past.length) return;
      const prev = past[past.length - 1];
      set({
        past: past.slice(0, -1),
        future: [...future, { walls, objects }],
        walls: prev.walls,
        objects: prev.objects,
        selectedObjectId: null,
        selectedWallId: null,
      });
    },

    redo: () => {
      const { past, future, walls, objects } = get();
      if (!future.length) return;
      const next = future[future.length - 1];
      set({
        future: future.slice(0, -1),
        past: [...past, { walls, objects }],
        walls: next.walls,
        objects: next.objects,
      });
    },
  };
});