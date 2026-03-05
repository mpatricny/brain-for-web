export type Theme = 'learning' | 'play' | 'creativity';
export type System = 'DMN' | 'ECN' | 'SN';
export type Hemisphere = 'left' | 'right' | 'midline';
export type ColorMode = 'theme' | 'system';

export interface Citation {
  title: string;
  year: number;
  doi?: string;
}

export interface BrainRegionData {
  id: string;
  label: string;
  fullName: string;
  abbreviations: string[];
  hemisphere: Hemisphere;
  themes: Theme[];
  systems: System[];
  description: string;
  functions: string[];
  evidence: string[];
  citations: Citation[];
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  meshName?: string;
  /** Fill regions provide anatomical context but have no interactive info panel */
  fill?: boolean;
}

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface BrainAtlasProps {
  /** Path to the GLB file produced by freesurfer-to-glb */
  glbPath: string;
  /** Region data (defaults to built-in DK functional regions) */
  regions?: BrainRegionData[];
  /** Initial color mode */
  colorMode?: ColorMode;
  /** CSS class for the outer container */
  className?: string;
  /** Minimum height for the 3D viewport (default: '500px') */
  minHeight?: string;
}
