import { useBrainStore } from './store.js';
import type { Theme, System } from './types.js';

const themes: Theme[] = ['learning', 'play', 'creativity'];
const systems: System[] = ['DMN', 'ECN', 'SN'];

const themeChipStyle = {
  learning: { border: '1px solid rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  play: { border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fcd34d' },
  creativity: { border: '1px solid rgba(168,85,247,0.6)', background: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
};
const themeChipActive = {
  learning: { border: '1px solid #60a5fa', background: 'rgba(59,130,246,0.3)', color: '#dbeafe' },
  play: { border: '1px solid #fbbf24', background: 'rgba(245,158,11,0.3)', color: '#fef3c7' },
  creativity: { border: '1px solid #a78bfa', background: 'rgba(168,85,247,0.3)', color: '#f3e8ff' },
};

const systemChipStyle = {
  DMN: { border: '1px solid rgba(139,92,246,0.6)', background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' },
  ECN: { border: '1px solid rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  SN: { border: '1px solid rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
};
const systemChipActive = {
  DMN: { border: '1px solid #a78bfa', background: 'rgba(139,92,246,0.3)', color: '#ede9fe' },
  ECN: { border: '1px solid #60a5fa', background: 'rgba(59,130,246,0.3)', color: '#dbeafe' },
  SN: { border: '1px solid #f87171', background: 'rgba(239,68,68,0.3)', color: '#fee2e2' },
};

const chipBase: React.CSSProperties = {
  borderRadius: 999, padding: '5px 12px', fontSize: '0.75rem', fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center',
};

const viewPresets: Array<{ label: string; position: [number, number, number] }> = [
  { label: 'L', position: [-8, 2, 0] },
  { label: 'R', position: [8, 2, 0] },
  { label: 'Top', position: [0, 8, 0.1] },
  { label: 'Bot', position: [0, -8, 0.1] },
  { label: 'F', position: [0, 2, -8] },
];

export interface BrainToolbarProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Toolbar with search, color mode toggle, theme/system chips, and camera view presets.
 * Opt-in: use alongside `<BrainAtlas />`.
 */
export function BrainToolbar({ className, style }: BrainToolbarProps) {
  const searchQuery = useBrainStore((s) => s.searchQuery);
  const colorMode = useBrainStore((s) => s.colorMode);
  const activeTheme = useBrainStore((s) => s.activeTheme);
  const activeSystem = useBrainStore((s) => s.activeSystem);
  const setSearchQuery = useBrainStore((s) => s.setSearchQuery);
  const setColorMode = useBrainStore((s) => s.setColorMode);
  const setActiveTheme = useBrainStore((s) => s.setActiveTheme);
  const setActiveSystem = useBrainStore((s) => s.setActiveSystem);
  const reset = useBrainStore((s) => s.reset);
  const setCameraView = useBrainStore((s) => s.setCameraView);

  const containerStyle: React.CSSProperties = {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
    borderRadius: 24, border: '1px solid rgba(30,41,59,0.8)',
    background: 'rgba(15,23,42,0.8)', padding: '12px 16px',
    backdropFilter: 'blur(16px)',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search... e.g. hippocampus, dlPFC"
        style={{
          width: 192, padding: '8px 12px', borderRadius: 12,
          border: '1px solid rgba(51,65,85,0.6)', background: 'rgba(2,6,23,0.7)',
          color: '#f1f5f9', fontSize: '0.875rem', outline: 'none',
        }}
      />

      {/* Color mode */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(['theme', 'system'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setColorMode(mode)}
            style={{
              ...chipBase,
              border: colorMode === mode ? '1px solid rgba(139,92,246,0.6)' : '1px solid #334155',
              background: colorMode === mode ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: colorMode === mode ? '#ede9fe' : '#94a3b8',
            }}
          >
            By {mode === 'theme' ? 'Theme' : 'System'}
          </button>
        ))}
      </div>

      {/* Theme / System chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {colorMode === 'theme'
          ? themes.map((th) => (
              <button
                key={th}
                onClick={() => setActiveTheme(th)}
                style={{ ...chipBase, ...(activeTheme === th ? themeChipActive[th] : themeChipStyle[th]) }}
              >
                {th.charAt(0).toUpperCase() + th.slice(1)}
              </button>
            ))
          : systems.map((sys) => (
              <button
                key={sys}
                onClick={() => setActiveSystem(sys)}
                style={{ ...chipBase, ...(activeSystem === sys ? systemChipActive[sys] : systemChipStyle[sys]) }}
              >
                {sys}
              </button>
            ))}
      </div>

      {/* View presets */}
      <div style={{ display: 'flex', gap: 6 }}>
        {viewPresets.map((v) => (
          <button
            key={v.label}
            onClick={() => setCameraView(v.position)}
            title={v.label}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, border: '1px solid rgba(51,65,85,0.6)',
              background: 'transparent', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        style={{
          marginLeft: 'auto', borderRadius: 12,
          border: '1px solid rgba(51,65,85,0.6)', background: 'transparent',
          padding: '8px 12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Reset
      </button>
    </div>
  );
}
