import { useState, useEffect } from 'react';
import { BrainAtlas, BrainToolbar, BrainInfoPanel, BrainLegend } from 'react-brain-atlas';

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setMobile(e.matches);
    handler(mq);
    mq.addEventListener('change', handler as any);
    return () => mq.removeEventListener('change', handler as any);
  }, [breakpoint]);
  return mobile;
}

export function App() {
  const mobile = useIsMobile();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '16px 8px' : '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ textAlign: 'center', padding: mobile ? '16px 0' : '24px 0' }}>
        <h1 style={{ fontSize: mobile ? '1.4rem' : '2rem', fontWeight: 600 }}>Brain Atlas</h1>
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: mobile ? '0.85rem' : undefined }}>
          Interactive 3D exploration of brain regions involved in learning, play, and creativity
        </p>
      </header>

      <BrainToolbar />

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 1fr', gap: 16, minHeight: mobile ? undefined : 600 }}>
        <div style={{ position: 'relative', borderRadius: 24, border: '1px solid rgba(30,41,59,0.8)', background: 'rgba(2,6,23,0.8)', overflow: 'hidden', minHeight: mobile ? 400 : undefined, touchAction: 'none' }}>
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
