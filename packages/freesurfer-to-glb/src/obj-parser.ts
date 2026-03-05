import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Find an OBJ file by parcel name within an extracted directory.
 *
 * Handles naming conventions:
 * - Cortical: `lh.pial.DK.rostralmiddlefrontal.obj` for parcel `lh.rostralmiddlefrontal`
 * - Subcortical: `Left-Hippocampus.obj` for parcel `Left-Hippocampus`
 */
export function findObjFile(extractedDir: string, parcelName: string): string | null {
  const candidates: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.obj')) {
        candidates.push(path.join(dir, entry.name));
      }
    }
  }
  walk(extractedDir);

  // Exact match
  const exact = candidates.find((f) => path.basename(f, '.obj') === parcelName);
  if (exact) return exact;

  // Cortical pial variant: `lh.rostralmiddlefrontal` -> `lh.pial.DK.rostralmiddlefrontal`
  const pialVariant = parcelName.replace(/^(lh|rh)\./, '$1.pial.DK.');
  const pialMatch = candidates.find((f) => path.basename(f, '.obj') === pialVariant);
  if (pialMatch) return pialMatch;

  // Normalized case-insensitive match
  const normalized = parcelName.toLowerCase().replace(/[-_.]/g, '');
  const fuzzy = candidates.find((f) => {
    const base = path.basename(f, '.obj').toLowerCase().replace(/[-_.]/g, '');
    return base === normalized;
  });
  if (fuzzy) return fuzzy;

  // Ends-with match for the region part
  const regionPart = parcelName.replace(/^(lh|rh)\./, '').toLowerCase();
  const endsWith = candidates.find((f) => {
    const base = path.basename(f, '.obj').toLowerCase();
    return base.endsWith(regionPart);
  });

  return endsWith || null;
}

/** Parse an OBJ file and return a BufferGeometry with deduplicated vertices. */
export function parseObj(filepath: string): THREE.BufferGeometry | null {
  const content = fs.readFileSync(filepath, 'utf-8');
  const loader = new OBJLoader();
  const group = loader.parse(content);

  const geometries: THREE.BufferGeometry[] = [];
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
      geometries.push((child as THREE.Mesh).geometry.clone());
    }
  });

  if (geometries.length === 0) return null;
  let geo = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries, false);
  if (!geo) return null;

  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Deduplicate coincident vertices using spatial hashing.
 * Creates an indexed geometry, dramatically reducing vertex count and file size.
 */
export function mergeVertices(geometry: THREE.BufferGeometry, tolerance = 1e-4): THREE.BufferGeometry {
  const pos = geometry.getAttribute('position') as THREE.BufferAttribute;
  const vertexCount = pos.count;

  const hashToIndex = new Map<string, number>();
  const newIndices: number[] = [];
  const uniquePositions: number[] = [];
  let nextIdx = 0;
  const precision = Math.round(1 / tolerance);

  for (let i = 0; i < vertexCount; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const hash = `${Math.round(x * precision)}_${Math.round(y * precision)}_${Math.round(z * precision)}`;

    if (hashToIndex.has(hash)) {
      newIndices.push(hashToIndex.get(hash)!);
    } else {
      hashToIndex.set(hash, nextIdx);
      newIndices.push(nextIdx);
      uniquePositions.push(x, y, z);
      nextIdx++;
    }
  }

  const newGeo = new THREE.BufferGeometry();
  newGeo.setAttribute('position', new THREE.Float32BufferAttribute(uniquePositions, 3));

  const IndexArray = nextIdx <= 65535 ? Uint16Array : Uint32Array;
  newGeo.setIndex(new THREE.BufferAttribute(new IndexArray(newIndices), 1));

  return newGeo;
}
