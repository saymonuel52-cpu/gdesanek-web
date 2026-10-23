import { CATALOG, GROUPS } from '@gdesanek/core';
import { usePlanStore } from '../hooks/usePlanStore';

export function CatalogPanel() {
  const { placeType, setPlaceType, setTool, tool } = usePlanStore();

  return (
    <div style={{
      width: 230, maxHeight: 720, overflowY: 'auto',
      border: '1px solid #ccc', borderRadius: 4, padding: 8, background: '#fff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Каталог ({CATALOG.length})</div>
      {GROUPS.map((g) => (
        <div key={g}>
          <div style={{ fontWeight: 600, margin: '10px 0 4px', color: '#555' }}>{g}</div>
          {CATALOG.filter((i) => i.group === g).map((i) => (
            <button key={i.type}
              onClick={() => { setPlaceType(i.type); setTool('PLACE'); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '4px 8px', margin: '2px 0', fontSize: 13,
                background: placeType === i.type && tool === 'PLACE' ? '#BBDEFB' : '#fff',
                border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer',
              }}>
              {i.label}{i.power ? ` · ${i.power}Вт` : ''}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}