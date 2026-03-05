import type { BufferGeometry, BufferAttribute } from 'three';

/**
 * Build a GLB (Binary glTF 2.0) file from a map of named BufferGeometries.
 *
 * Constructs the JSON + binary buffer manually so no browser APIs are needed.
 * Supports both indexed and non-indexed geometry, and chooses Uint16 vs Uint32
 * index arrays automatically based on vertex count.
 *
 * @returns A Node.js Buffer containing the complete GLB file
 */
export function buildGLB(regionGeometries: Record<string, BufferGeometry>): Buffer {
  const accessors: Record<string, unknown>[] = [];
  const bufferViews: Record<string, unknown>[] = [];
  const meshes: Record<string, unknown>[] = [];
  const nodes: Record<string, unknown>[] = [];
  const nodeIndices: number[] = [];
  const binaryChunks: Buffer[] = [];
  let byteOffset = 0;

  function appendBuffer(typedArray: ArrayBufferView, target?: number): number {
    const rawBuf = Buffer.from(
      typedArray.buffer as ArrayBuffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const bvIdx = bufferViews.length;
    const bv: Record<string, unknown> = { buffer: 0, byteOffset, byteLength: rawBuf.length };
    if (target) bv.target = target;
    bufferViews.push(bv);
    binaryChunks.push(rawBuf);
    byteOffset += rawBuf.length;
    // Pad to 4-byte alignment
    const pad = (4 - (rawBuf.length % 4)) % 4;
    if (pad > 0) {
      binaryChunks.push(Buffer.alloc(pad));
      byteOffset += pad;
    }
    return bvIdx;
  }

  for (const [name, geometry] of Object.entries(regionGeometries)) {
    const pos = geometry.getAttribute('position') as BufferAttribute;
    const norm = geometry.getAttribute('normal') as BufferAttribute | null;
    const index = geometry.index;

    // Position
    const posBvIdx = appendBuffer(new Float32Array(pos.array as Float32Array), 34962);
    const posMin = [Infinity, Infinity, Infinity];
    const posMax = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      posMin[0] = Math.min(posMin[0], x); posMin[1] = Math.min(posMin[1], y); posMin[2] = Math.min(posMin[2], z);
      posMax[0] = Math.max(posMax[0], x); posMax[1] = Math.max(posMax[1], y); posMax[2] = Math.max(posMax[2], z);
    }
    const posAccessorIdx = accessors.length;
    accessors.push({
      bufferView: posBvIdx, componentType: 5126, count: pos.count, type: 'VEC3',
      min: posMin, max: posMax,
    });

    // Normal
    let normAccessorIdx: number | undefined;
    if (norm) {
      const normBvIdx = appendBuffer(new Float32Array(norm.array as Float32Array), 34962);
      normAccessorIdx = accessors.length;
      accessors.push({
        bufferView: normBvIdx, componentType: 5126, count: norm.count, type: 'VEC3',
      });
    }

    // Index
    let indexAccessorIdx: number | undefined;
    if (index) {
      const use16 = pos.count <= 65535;
      const indexArray = use16
        ? new Uint16Array(index.array as Uint16Array)
        : new Uint32Array(index.array as Uint32Array);
      const idxBvIdx = appendBuffer(indexArray, 34963);
      indexAccessorIdx = accessors.length;
      accessors.push({
        bufferView: idxBvIdx,
        componentType: use16 ? 5123 : 5125,
        count: index.count,
        type: 'SCALAR',
      });
    }

    // Mesh primitive
    const attributes: Record<string, number> = { POSITION: posAccessorIdx };
    if (normAccessorIdx !== undefined) attributes.NORMAL = normAccessorIdx;
    const primitive: Record<string, unknown> = { attributes, mode: 4 };
    if (indexAccessorIdx !== undefined) primitive.indices = indexAccessorIdx;

    const meshIdx = meshes.length;
    meshes.push({ name, primitives: [primitive] });

    const nodeIdx = nodes.length;
    nodes.push({ name, mesh: meshIdx });
    nodeIndices.push(nodeIdx);
  }

  // Build glTF JSON
  const gltf = {
    asset: { version: '2.0', generator: 'freesurfer-to-glb' },
    scene: 0,
    scenes: [{ nodes: nodeIndices }],
    nodes,
    meshes,
    accessors,
    bufferViews,
    buffers: [{ byteLength: byteOffset }],
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonPadded = jsonStr + ' '.repeat((4 - (jsonStr.length % 4)) % 4);
  const jsonBuffer = Buffer.from(jsonPadded, 'utf-8');

  const binBuffer = Buffer.concat(binaryChunks);
  const binPadding = (4 - (binBuffer.length % 4)) % 4;
  const binPadded = Buffer.concat([binBuffer, Buffer.alloc(binPadding)]);

  // GLB: header (12) + JSON chunk (8 + len) + BIN chunk (8 + len)
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + binPadded.length;
  const glb = Buffer.alloc(totalLength);
  let offset = 0;

  // Header
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // "glTF"
  glb.writeUInt32LE(2, offset); offset += 4;
  glb.writeUInt32LE(totalLength, offset); offset += 4;

  // JSON chunk
  glb.writeUInt32LE(jsonBuffer.length, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4; // "JSON"
  jsonBuffer.copy(glb, offset); offset += jsonBuffer.length;

  // BIN chunk
  glb.writeUInt32LE(binPadded.length, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4; // "BIN\0"
  binPadded.copy(glb, offset);

  return glb;
}
