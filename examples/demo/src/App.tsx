import { BrainAtlas, BrainToolbar, BrainInfoPanel, BrainLegend } from 'react-brain-atlas';

export function App() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ textAlign: 'center', padding: '24px 0' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Brain Atlas</h1>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>
          Interactive 3D exploration of brain regions involved in learning, play, and creativity
        </p>
      </header>

      <BrainToolbar />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: 600 }}>
        <div style={{ position: 'relative', borderRadius: 24, border: '1px solid rgba(30,41,59,0.8)', background: 'rgba(2,6,23,0.8)', overflow: 'hidden' }}>
          <BrainAtlas glbPath="/models/brain-atlas.glb" />
          <BrainLegend />
        </div>
        <BrainInfoPanel />
      </div>

      <footer style={{ textAlign: 'center', padding: '24px 0', fontSize: '0.75rem', color: '#64748b' }}>
        Built with{' '}
        <a href="https://github.com/mpatricny/brain-for-web" style={{ color: '#a78bfa' }}>
          brain-atlas-web
        </a>
        {' '}| Mesh data from{' '}
        <a href="https://brainder.org/research/brain-for-blender/" style={{ color: '#a78bfa' }}>
          Brainder.org
        </a>
        {' '}(CC BY-SA 3.0)
      </footer>
    </div>
  );
}
