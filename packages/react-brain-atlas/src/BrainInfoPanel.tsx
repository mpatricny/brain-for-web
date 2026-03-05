import { useMemo } from 'react';
import { useBrainStore } from './store.js';
import { defaultRegions, themeColors, systemColors } from './defaults/regions.js';
import type { BrainRegionData } from './types.js';

export interface BrainInfoPanelProps {
  /** Region data to display (defaults to built-in regions) */
  regions?: BrainRegionData[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Info panel showing region details when selected, or a searchable list when not.
 * Opt-in: use alongside `<BrainAtlas />`.
 */
export function BrainInfoPanel({ regions = defaultRegions, className, style }: BrainInfoPanelProps) {
  const selectedRegionId = useBrainStore((s) => s.selectedRegionId);
  const selectRegion = useBrainStore((s) => s.selectRegion);
  const focusRegion = useBrainStore((s) => s.focusRegion);
  const searchQuery = useBrainStore((s) => s.searchQuery);

  const region = regions.find((r) => r.id === selectedRegionId && !r.fill);
  const interactiveRegions = useMemo(() => regions.filter((r) => !r.fill), [regions]);

  const filteredRegions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return interactiveRegions;
    return interactiveRegions.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.abbreviations.some((a) => a.toLowerCase().includes(q)) ||
        r.id.toLowerCase().includes(q),
    );
  }, [searchQuery, interactiveRegions]);

  const panelStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto',
    borderRadius: 24, border: '1px solid rgba(30,41,59,0.8)',
    background: 'rgba(15,23,42,0.8)', padding: 24,
    backdropFilter: 'blur(16px)',
    maxHeight: 'calc(100vh - 14rem)',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.25em',
    fontWeight: 600, color: '#64748b', marginBottom: 6,
  };

  // Detail view
  if (region) {
    return (
      <div className={className} style={panelStyle}>
        <button
          onClick={() => selectRegion(null)}
          style={{
            alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
            borderRadius: 12, padding: '8px 12px', background: 'transparent',
            border: 'none', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
          }}
        >
          &larr; Back
        </button>

        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', margin: 0 }}>{region.label}</h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0' }}>{region.fullName}</p>
        </div>

        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#cbd5e1' }}>{region.description}</p>

        <div>
          <p style={labelStyle}>Functions</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {region.functions.map((fn) => (
              <li key={fn} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span style={{ marginTop: 4, width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                {fn}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={labelStyle}>Themes</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {region.themes.map((th) => (
              <span
                key={th}
                style={{
                  borderRadius: 999, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 500,
                  border: `1px solid ${themeColors[th]}60`,
                  background: `${themeColors[th]}20`,
                  color: themeColors[th],
                }}
              >
                {th}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p style={labelStyle}>Systems</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {region.systems.map((sys) => (
              <span
                key={sys}
                style={{
                  borderRadius: 999, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 500,
                  border: `1px solid ${systemColors[sys]}60`,
                  background: `${systemColors[sys]}20`,
                  color: systemColors[sys],
                }}
              >
                {sys}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p style={labelStyle}>Evidence</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {region.evidence.map((ev, i) => (
              <li key={i} style={{ fontSize: '0.75rem', lineHeight: 1.5, color: '#94a3b8' }}>{ev}</li>
            ))}
          </ul>
        </div>

        {region.citations.length > 0 && (
          <div>
            <p style={labelStyle}>Citations</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {region.citations.map((c, i) => (
                <li key={i} style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  {c.title} ({c.year})
                  {c.doi && (
                    <a
                      href={`https://doi.org/${c.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 4, color: '#a78bfa', textDecoration: 'none' }}
                    >
                      DOI
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className={className} style={panelStyle}>
      <div>
        <p style={labelStyle}>Brain Regions</p>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Select a region to explore
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredRegions.length === 0 ? (
          <p style={{ padding: '16px 0', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
            No matching regions
          </p>
        ) : (
          filteredRegions.map((r) => (
            <button
              key={r.id}
              onClick={() => { selectRegion(r.id); focusRegion(r.position); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                borderRadius: 12, padding: '8px 12px', textAlign: 'left',
                background: 'transparent', border: 'none', color: '#e2e8f0',
                fontSize: '0.75rem', cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(139,92,246,0.1)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              <span>{r.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#64748b' }}>{r.abbreviations[0]}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
