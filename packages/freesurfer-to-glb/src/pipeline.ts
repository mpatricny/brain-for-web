import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { applyPolyfills } from './polyfills.js';

// Polyfills must run before three.js imports
applyPolyfills();

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { findObjFile, parseObj } from './obj-parser.js';
import { buildGLB } from './glb-builder.js';
import { dkFunctionalMap } from './region-maps/dk-functional.js';
import type { PipelineOptions, PipelineResult, RegionMapping } from './types.js';

const CORTICAL_URL =
  'https://s3.us-east-2.amazonaws.com/brainder/software/brain4blender/smallfiles/pial_DK_obj.tar.bz2';
const SUBCORTICAL_URL =
  'https://s3.us-east-2.amazonaws.com/brainder/software/brain4blender/smallfiles/subcortical_obj.tar.bz2';

function log(verbose: boolean, ...args: unknown[]) {
  if (verbose) console.log(...args);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function download(url: string, dest: string, verbose: boolean): string {
  const filename = path.basename(url);
  const filepath = path.join(dest, filename);
  if (fs.existsSync(filepath)) {
    log(verbose, `  cached: ${filename}`);
    return filepath;
  }
  log(verbose, `  downloading: ${filename}`);
  execSync(`curl -fSL -o "${filepath}" "${url}"`, { stdio: verbose ? 'inherit' : 'pipe' });
  return filepath;
}

function extract(archive: string, dest: string, verbose: boolean): string {
  const dirName = path.basename(archive, '.tar.bz2');
  const extractDir = path.join(dest, dirName);
  if (fs.existsSync(extractDir)) {
    log(verbose, `  cached: ${dirName}/`);
    return extractDir;
  }
  log(verbose, `  extracting: ${path.basename(archive)}`);
  fs.mkdirSync(extractDir, { recursive: true });
  execSync(`tar -xjf "${archive}" -C "${extractDir}"`, { stdio: verbose ? 'inherit' : 'pipe' });
  return extractDir;
}

/**
 * Run the full pipeline: download, extract, merge, normalize, and export GLB.
 *
 * @example
 * ```ts
 * import { runPipeline } from 'freesurfer-to-glb';
 *
 * const result = await runPipeline({
 *   cacheDir: '.tmp-brain-meshes',
 *   outputPath: 'public/models/brain-atlas.glb',
 * });
 * console.log(`Created ${result.regionCount} regions`);
 * ```
 */
export async function runPipeline(options: PipelineOptions): Promise<PipelineResult> {
  const {
    cacheDir,
    outputPath,
    regionMap = dkFunctionalMap,
    targetRadius = 3,
    verbose = true,
  } = options;

  log(verbose, 'Brain Atlas Asset Pipeline\n');

  // 1. Download
  ensureDir(cacheDir);
  log(verbose, 'Step 1: Downloading archives...');
  const corticalArchive = download(CORTICAL_URL, cacheDir, verbose);
  const subcorticalArchive = download(SUBCORTICAL_URL, cacheDir, verbose);

  // 2. Extract
  log(verbose, '\nStep 2: Extracting...');
  const corticalDir = extract(corticalArchive, cacheDir, verbose);
  const subcorticalDir = extract(subcorticalArchive, cacheDir, verbose);

  // 3. Parse and merge parcels into regions
  log(verbose, '\nStep 3: Merging parcels into regions...');
  const regionGeometries: Record<string, THREE.BufferGeometry> = {};
  const allPositions: number[] = [];

  for (const region of regionMap) {
    const dir = region.source === 'cortical' ? corticalDir : subcorticalDir;
    const parcelGeometries: THREE.BufferGeometry[] = [];

    for (const parcel of region.parcels) {
      const objFile = findObjFile(dir, parcel);
      if (!objFile) {
        log(verbose, `  warning: missing parcel ${parcel} for region ${region.name}`);
        continue;
      }
      const geo = parseObj(objFile);
      if (geo) {
        parcelGeometries.push(geo);
      } else {
        log(verbose, `  warning: empty geometry for ${parcel}`);
      }
    }

    if (parcelGeometries.length === 0) {
      log(verbose, `  skipped: no geometry for region ${region.name}`);
      continue;
    }

    const merged = parcelGeometries.length === 1
      ? parcelGeometries[0]
      : mergeGeometries(parcelGeometries, false);

    if (!merged) {
      log(verbose, `  skipped: merge failed for region ${region.name}`);
      continue;
    }

    // Collect positions for global bounding box
    const pos = merged.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      allPositions.push(x, y, z);
      if (region.merge === 'left') {
        allPositions.push(-x, y, z); // include mirrored points for symmetric bbox
      }
    }

    const idxAttr = merged.index;
    const triCount = idxAttr ? idxAttr.count / 3 : pos.count / 3;
    log(verbose, `  ${region.name}: ${triCount} triangles, ${pos.count} vertices${idxAttr ? ' (indexed)' : ''}`);

    regionGeometries[region.name] = merged;
  }

  const regionCount = Object.keys(regionGeometries).length;
  if (regionCount === 0) {
    throw new Error('No regions were processed. Check your region map and source data.');
  }

  // 4. Global normalization
  log(verbose, `\nStep 4: Normalizing ${regionCount} regions...`);

  const bbox = new THREE.Box3();
  const tempVec = new THREE.Vector3();
  for (let i = 0; i < allPositions.length; i += 3) {
    tempVec.set(allPositions[i], allPositions[i + 1], allPositions[i + 2]);
    bbox.expandByPoint(tempVec);
  }

  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = (targetRadius * 2) / maxDim;

  log(verbose, `  Center: (${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${center.z.toFixed(1)})`);
  log(verbose, `  Scale factor: ${scaleFactor.toFixed(4)}`);

  const regionStats: PipelineResult['regions'] = [];

  for (const [name, geometry] of Object.entries(regionGeometries)) {
    const pos = geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(
        i,
        (pos.getX(i) - center.x) * scaleFactor,
        (pos.getY(i) - center.y) * scaleFactor,
        (pos.getZ(i) - center.z) * scaleFactor,
      );
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // Compute centroid
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < pos.count; i++) {
      cx += pos.getX(i); cy += pos.getY(i); cz += pos.getZ(i);
    }
    cx /= pos.count; cy /= pos.count; cz /= pos.count;

    const idxAttr = geometry.index;
    regionStats.push({
      name,
      triangles: idxAttr ? idxAttr.count / 3 : pos.count / 3,
      vertices: pos.count,
      indexed: !!idxAttr,
      centroid: [cx, cy, cz],
    });

    log(verbose, `    ${name}: centroid [${cx.toFixed(3)}, ${cy.toFixed(3)}, ${cz.toFixed(3)}]`);
  }

  // 5. Build GLB
  log(verbose, '\nStep 5: Exporting GLB...');
  ensureDir(path.dirname(outputPath));
  const glbBuffer = buildGLB(regionGeometries);
  fs.writeFileSync(outputPath, glbBuffer);
  const sizeMB = (glbBuffer.length / (1024 * 1024)).toFixed(2);
  log(verbose, `  Written: ${outputPath} (${sizeMB} MB)`);
  log(verbose, `\nPipeline complete! (${regionCount} regions)`);

  return {
    regionCount,
    outputPath,
    fileSizeBytes: glbBuffer.length,
    regions: regionStats,
  };
}
