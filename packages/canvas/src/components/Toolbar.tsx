import { usePlanStore, Tool } from '../hooks/usePlanStore';

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'EDIT', label: 'Выбор', icon: '🖱️' },
  { id: 'DRAW_WALL', label: 'Стена', icon: '🧱' },
  { id: 'PLACE', label: 'Объект', icon: '📍' },
  { id: 'PAN', label: 'Панорама', icon: '✋' },
];

export function Toolbar() {
  const { tool, setTool, ortho, toggleOrtho, undo, redo, past, future, placeType, setPlaceType } = usePlanStore();

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {TOOLS.map((t) => (
        <button key={t.id} onClick={() => setTool(t.id)}
          style={{
            padding: '6px 14px',
            background: tool === t.id ? '#2196F3' : '#fff',
            color: tool === t.id ? '#fff' : '#000',
            border: '1px solid #bbb', borderRadius: 4, cursor: 'pointer',
          }}>
          {t.icon} {t.label}
        </button>
      ))}

      <label style={{ marginLeft: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={ortho} onChange={toggleOrtho} /> Ortho
      </label>

      <button onClick={undo} disabled={!past.length}
        style={{ padding: '6px 12px', opacity: past.length ? 1 : 0.4 }}>↩ Undo</button>
      <button onClick={redo} disabled={!future.length}
        style={{ padding: '6px 12px', opacity: future.length ? 1 : 0.4 }}>↪ Redo</button>

      {tool === 'PLACE' && placeType && (
        <button onClick={() => setPlaceType(null)}
          style={{ padding: '6px 12px', background: '#FFEBEE', border: '1px solid #EF9A9A' }}>
          ✕ отменить размещение
        </button>
      )}

      <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
        колесо — zoom · ✋ — панорама · Del — удалить · Ctrl+Z/Y — undo/redo
      </span>
    </div>
  );
}