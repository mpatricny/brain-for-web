/** Defines how DK atlas parcels map to a single brain region in the output GLB. */
export interface RegionMapping {
  /** Name used as the mesh name in the GLB file */
  name: string;
  /** Source archive: 'cortical' (pial DK) or 'subcortical' */
  source: 'cortical' | 'subcortical';
  /**
   * Merge strategy:
   * - 'left': only left-hemisphere parcels (viewer mirrors at render time)
   * - 'both': merge left + right into a single midline mesh
   */
  merge: 'left' | 'both';
  /** DK atlas parcel names to merge into this region */
  parcels: string[];
}

export interface PipelineOptions {
  /** Directory for downloading and caching source archives */
  cacheDir: string;
  /** Output GLB file path */
  outputPath: string;
  /** Region mappings (defaults to DK functional map) */
  regionMap?: RegionMapping[];
  /** Target radius for normalization (default: 3) */
  targetRadius?: number;
  /** Log progress to console (default: true) */
  verbose?: boolean;
}

export interface PipelineResult {
  /** Number of regions successfully processed */
  regionCount: number;
  /** Output file path */
  outputPath: string;
  /** Output file size in bytes */
  fileSizeBytes: number;
  /** Per-region stats */
  regions: Array<{
    name: string;
    triangles: number;
    vertices: number;
    indexed: boolean;
    centroid: [number, number, number];
  }>;
}
