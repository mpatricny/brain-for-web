import { useBrainStore } from './store.js';
import { themeColors, systemColors } from './defaults/regions.js';

export interface BrainLegendProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Color legend overlay showing theme or system colors based on current mode.
 * Opt-in: use alongside `<BrainAtlas />`.
 */
export function BrainLegend({ className, style }: BrainLegendProps) {
  const colorMode = useBrainStore((s) => s.colorMode);

  const items =
    colorMode === 'theme'
      ? [
          { label: 'Learning', color: themeColors.learning },
          { label: 'Play', color: themeColors.play },
          { label: 'Creativity', color: themeColors.creativity },
        ]
      : [
          { label: 'Default Mode (DMN)', color: systemColors.DMN },
          { label: 'Executive Control (ECN)', color: systemColors.ECN },
          { label: 'Salience (SN)', color: systemColors.SN },
        ];

  return (
    <div
      className={className}
      style={{
        position: 'absolute', bottom: 16, left: 16,
        borderRadius: 12, border: '1px solid rgba(30,41,59,0.8)',
        background: 'rgba(2,6,23,0.8)', padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      <p style={{
        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.25em',
        fontWeight: 600, color: '#64748b', marginBottom: 6, margin: '0 0 6px',
      }}>
        {colorMode === 'theme' ? 'Themes' : 'Networks'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
