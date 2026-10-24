import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Group, Text, Circle } from 'react-konva';
import { usePlanStore, Wall } from '../hooks/usePlanStore';
import { SymbolShape } from './symbols';
import { getItemByType } from '@gdesanek/core';
import Konva from 'konva';

const GRID = 50;       // см
const SNAP_WALL = 40;  // см радиус привязки к концам стен

interface Props { width?: number; height?: number }

export function PlanCanvas({ width = 1000, height = 700 }: Props) {
  const store = usePlanStore();
  const { walls, objects, tool, ortho, scale, offsetX, offsetY, placeType,
          selectedObjectId, selectedWallId } = store;
  const [draft, setDraft] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') store.deleteSelected();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') store.undo();
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') store.redo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Конверсия пикселей Stage → мировые координаты (см)
  // Layer.x = offsetX, Layer.scaleX = scale, Stage.x = 0 (фикс!)
  const toWorld = (stageX: number, stageY: number) => ({
    x: (stageX - offsetX) / scale,
    y: (stageY - offsetY) / scale,
  });

  const snapPoint = (x: number, y: number) => {
    let best: { x: number; y: number } | null = null;
    let bestD = SNAP_WALL;
    for (const w of walls) {
      for (const [px, py] of [[w.x1, w.y1], [w.x2, w.y2]]) {
        const d = Math.hypot(px - x, py - y);
        if (d < bestD) { bestD = d; best = { x: px, y: py }; }
      }
    }
    if (best) return best;
    return { x: Math.round(x / GRID) * GRID, y: Math.round(y / GRID) * GRID };
  };

  const orthoFix = (x1: number, y1: number, x2: number, y2: number) => {
    if (!ortho) return { x2, y2 };
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) return { x2, y2: y1 };
    return { x2: x1, y2 };
  };

  // Клик по пустому месту Stage (не по объектам)
  const handleStageClick = (e: any) => {
    if (e.target !== e.target.getStage() && e.target.parent !== layerRef.current) return;

    const stage = stageRef.current;
    if (!stage) return;
    const p = stage.getPointerPosition();
    if (!p) return;
    const w = toWorld(p.x, p.y);

    if (tool === 'DRAW_WALL') {
      const s = snapPoint(w.x, w.y);
      if (!draft) {
        setDraft({ x1: s.x, y1: s.y, x2: s.x, y2: s.y });
      } else {
        const f = orthoFix(draft.x1, draft.y1, s.x, s.y);
        if (Math.hypot(f.x2 - draft.x1, f.y2 - draft.y1) > 5) {
          store.addWall({
            id: `wall-${Date.now()}`,
            x1: draft.x1, y1: draft.y1, x2: f.x2, y2: f.y2,
            thickness: 10, material: 'beton',
          });
        }
        setDraft(null);
      }
      return;
    }

    if (tool === 'PLACE' && placeType) {
      const item = getItemByType(placeType);
      store.addObject({
        id: `obj-${Date.now()}`,
        type: placeType,
        x: w.x, y: w.y,
        rotation: 0,
        name: item?.label ?? placeType,
      });
      return;
    }

    if (tool === 'EDIT') {
      store.selectObject(null);
      store.selectWall(null);
    }
  };

  const handleMove = (e: any) => {
    if (!draft) return;
    const stage = stageRef.current;
    if (!stage) return;
    const p = stage.getPointerPosition();
    if (!p) return;
    const w = toWorld(p.x, p.y);
    const s = snapPoint(w.x, w.y);
    const f = orthoFix(draft.x1, draft.y1, s.x, s.y);
    setDraft({ ...draft, x2: f.x2, y2: f.y2 });
  };

  // Zoom к курсору: только Layer.scaleX/Y меняется, Stage.x/y остаются 0
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = scale;
    const next = Math.min(4, Math.max(0.15, e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1));

    // worldX/Y под курсором ДО zoom
    const worldX = (pointer.x - offsetX) / oldScale;
    const worldY = (pointer.y - offsetY) / oldScale;

    // новый offsetX/offsetY чтобы worldX/Y остались под курсором
    const newOffsetX = pointer.x - worldX * next;
    const newOffsetY = pointer.y - worldY * next;

    store.setViewport(next, newOffsetX, newOffsetY);
  };

  // PAN: drag самого Layer (не Stage!)
  const handleLayerDragEnd = (e: any) => {
    store.setViewport(scale, e.target.x(), e.target.y());
  };

  // Drag объекта: e.target.x() — позиция в Layer-системе (мировые координаты в см)
  const handleObjectDragEnd = (id: string, e: any) => {
    store.updateObject(id, { x: e.target.x(), y: e.target.y() });
  };

  const wallLen = (w: { x1: number; y1: number; x2: number; y2: number }) =>
    Math.hypot(w.x2 - w.x1, w.y2 - w.y1) / 100; // м

  const cursorStyle = tool === 'DRAW_WALL' ? 'crosshair'
    : tool === 'PAN' ? 'grab'
    : 'default';

  return (
    <div style={{ border: '1px solid #ccc', background: '#fafafa' }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleStageClick}
        onMouseMove={handleMove}
        onWheel={handleWheel}
        style={{ cursor: cursorStyle }}
      >
        <Layer
          ref={layerRef}
          x={offsetX}
          y={offsetY}
          scaleX={scale}
          scaleY={scale}
          draggable={tool === 'PAN'}
          onDragStart={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'grabbing'; }}
          onDragEnd={(e) => {
            if (stageRef.current) stageRef.current.container().style.cursor = 'grab';
            handleLayerDragEnd(e);
          }}
        >
          {/* Сетка 50 см */}
          {Array.from({ length: 60 }).map((_, i) => (
            <Line key={`v${i}`} points={[(i - 20) * GRID, -1000, (i - 20) * GRID, 4000]}
              stroke="#e8e8e8" strokeWidth={1 / scale} />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <Line key={`h${i}`} points={[-1000, (i - 10) * GRID, 5000, (i - 10) * GRID]}
              stroke="#e8e8e8" strokeWidth={1 / scale} />
          ))}

          {/* Стены */}
          {walls.map((w) => (
            <Group key={w.id}>
              <Line points={[w.x1, w.y1, w.x2, w.y2]} stroke="#333"
                strokeWidth={w.thickness} lineCap="round"
                onClick={(e) => { e.cancelBubble = true; store.selectWall(w.id); }} />
              {w.id === selectedWallId && (
                <Line points={[w.x1, w.y1, w.x2, w.y2]} stroke="#00BFFF"
                  strokeWidth={w.thickness + 6} lineCap="round" dash={[12, 8]} opacity={0.6} />
              )}
              <Text text={`${wallLen(w).toFixed(2)} м`}
                x={(w.x1 + w.x2) / 2 + 15} y={(w.y1 + w.y2) / 2 - 25}
                fontSize={22 / scale} fill="#777" />
            </Group>
          ))}

          {/* Превью стены при DRAW_WALL */}
          {draft && (
            <Group>
              <Line points={[draft.x1, draft.y1, draft.x2, draft.y2]}
                stroke="#F44336" strokeWidth={10} lineCap="round" dash={[10, 8]} />
              <Text text={`${wallLen(draft).toFixed(2)} м`}
                x={(draft.x1 + draft.x2) / 2 + 15} y={(draft.y1 + draft.y2) / 2 - 25}
                fontSize={24 / scale} fill="#F44336" />
            </Group>
          )}

          {/* Объекты с ГОСТ-символами */}
          {objects.map((o) => {
            const item = getItemByType(o.type);
            const sel = o.id === selectedObjectId;
            return (
              <Group key={o.id} x={o.x} y={o.y} rotation={o.rotation}
                draggable={tool === 'EDIT'}
                onDragEnd={(e) => handleObjectDragEnd(o.id, e)}
                onClick={(e) => { e.cancelBubble = true; store.selectObject(o.id); }}>
                {sel && <Circle radius={28} stroke="#00BFFF" strokeWidth={2 / scale} dash={[8, 6]} />}
                <SymbolShape type={o.type} selected={sel} />
                {item?.h != null && (
                  <Text text={`h=${item.h}`} x={16} y={-10}
                    fontSize={16 / scale} fill="#999" />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}