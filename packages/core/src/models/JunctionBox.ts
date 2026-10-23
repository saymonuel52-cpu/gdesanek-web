export interface JunctionBox {
  id: number; projectId: number; x: number; y: number;
  height: number; name: string; manual: boolean;
}
export const newBox = (projectId: number, x: number, y: number, name = ''): JunctionBox =>
  ({ id: 0, projectId, x, y, height: 250, name, manual: false });
