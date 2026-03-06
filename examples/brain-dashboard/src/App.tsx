import React, { useState, useMemo } from 'react';
import { BrainAtlas, defaultRegions, useBrainStore } from 'react-brain-atlas';
import 'react-brain-atlas/styles.css';

/* ── Sidebar: selected region stats ───────────────────────────── */
function Sidebar() {
  const selectedId = useBrainStore((s) => s.selectedRegion);
  const region = defaultRegions.find((r) => r.id === selectedId);
  const [activation, setActivation] = useState(50);

  if (!region) {
    return (
      <aside style={sidebarStyle}>
        <h2 style={{ margin: 0, fontSize: 16, color: '#94a3b8' }}>Region Info</h2>
        <p style={{ color: '#64748b', marginTop: 12 }}>Select a region to view details.</p>
      </aside>
    );
  }

  return (
    <aside style={sidebarStyle}>
      <h2 style={{ margin: 0, fontSize: 18, color: '#e2e8f0' }}>{region.fullName}</h2>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>{region.id.toUpperCase()} · {region.hemisphere}</p>

      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Volume (placeholder)</label>
        <div style={valueStyle}>{(Math.random() * 8000 + 2000).toFixed(0)} mm³</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={labelStyle}>Activation Level</label>
        <input
          type="range"
          min={0}
          max={100}
          value={activation}
          onChange={(e) => setActivation(Number(e.target.value))}
          style={{ width: '100%', accentColor: region.color }}
        />
        <div style={valueStyle}>{activation}%</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={labelStyle}>Systems</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {region.systems.map((s) => (
            <span key={s} style={{ ...tagStyle, background: s === 'DMN' ? '#7c3aed' : s === 'ECN' ? '#2563eb' : '#dc2626' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={labelStyle}>Functions</label>
        <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#cbd5e1', fontSize: 13 }}>
          {region.functions.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </aside>
  );
}

/* ── Region table ─────────────────────────────────────────────── */
function RegionTable() {
  const interactiveRegions = useMemo(
    () => defaultRegions.filter((r) => !r.fill),
    [],
  );
  const selectRegion = useBrainStore((s) => s.selectRegion);

  return (
    <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#e2e8f0' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            {['Region', 'Hemisphere', 'Systems', 'Themes'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#94a3b8', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {interactiveRegions.map((r) => (
            <tr
              key={r.id}
              onClick={() => selectRegion(r.id)}
              style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={cellStyle}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: r.color, marginRight: 8 }} />
                {r.fullName}
              </td>
              <td style={cellStyle}>{r.hemisphere}</td>
              <td style={cellStyle}>{r.systems.join(', ')}</td>
              <td style={cellStyle}>{r.themes.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Reset */}
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; } body { margin: 0; }`}</style>

      <header style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🧠</span>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Brain Research Dashboard</h1>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <BrainAtlas glbPath="/brain.glb" minHeight="500px" />
        </div>
        <Sidebar />
      </div>

      <h2 style={{ padding: '16px 24px 0', fontSize: 16, fontWeight: 600 }}>All Regions</h2>
      <RegionTable />
    </div>
  );
}

/* ── Styles ────────────────────────────────────────────────────── */
const sidebarStyle: React.CSSProperties = {
  width: 300,
  padding: 20,
  borderLeft: '1px solid #1e293b',
  background: '#0f172a',
  overflowY: 'auto',
};

const labelStyle: React.CSSProperties = { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 };
const valueStyle: React.CSSProperties = { fontSize: 14, color: '#e2e8f0', marginTop: 2 };
const tagStyle: React.CSSProperties = { fontSize: 11, padding: '2px 8px', borderRadius: 9999, color: '#fff', fontWeight: 600 };
const cellStyle: React.CSSProperties = { padding: '8px 12px' };
