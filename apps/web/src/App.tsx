import { CatalogPanel, PlanCanvas, Toolbar } from '@gdesanek/canvas';

export function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: '0 0 12px' }}>🏠 ГдеСанёк Web</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        <CatalogPanel />
        <div style={{ flex: 1 }}>
          <Toolbar />
          <PlanCanvas width={1000} height={700} />
        </div>
      </div>
    </div>
  );
}