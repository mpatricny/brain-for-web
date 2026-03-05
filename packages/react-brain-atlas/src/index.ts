// Main component
export { BrainAtlas } from './BrainAtlas.js';

// Opt-in subcomponents
export { BrainToolbar } from './BrainToolbar.js';
export { BrainInfoPanel } from './BrainInfoPanel.js';
export { BrainLegend } from './BrainLegend.js';

// Store (for advanced customization)
export { useBrainStore } from './store.js';

// Defaults (for extending or customizing)
export { defaultRegions, themeColors, systemColors } from './defaults/regions.js';

// Types
export type {
  BrainAtlasProps,
  BrainRegionData,
  CameraTarget,
  Citation,
  ColorMode,
  Hemisphere,
  System,
  Theme,
} from './types.js';
export type { BrainStore } from './store.js';
export type { BrainToolbarProps } from './BrainToolbar.js';
export type { BrainInfoPanelProps } from './BrainInfoPanel.js';
export type { BrainLegendProps } from './BrainLegend.js';
