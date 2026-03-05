import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import type { BufferGeometry, Mesh } from 'three';
import { BrainRegion } from './BrainRegion.js';
import { CameraController } from './CameraController.js';
import { useBrainStore } from './store.js';
import { defaultRegions } from './defaults/regions.js';
import type { BrainAtlasProps, BrainRegionData } from './types.js';

function computeCentroid(geometry: BufferGeometry): [number, number, number] {
  const pos = geometry.getAttribute('position');
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < pos.count; i++) {
    cx += pos.getX(i); cy += pos.getY(i); cz += pos.getZ(i);
  }
  const n = pos.count;
  return [cx / n, cy / n, cz / n];
}

class BrainRegionsErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function BrainRegionsWithGLB({ glbPath, regions }: { glbPath: string; regions: BrainRegionData[] }) {
  const { nodes } = useGLTF(glbPath);

  const { geometryMap, centroidMap } = useMemo(() => {
    const gMap: Record<string, BufferGeometry> = {};
    const cMap: Record<string, [number, number, number]> = {};
    for (const region of regions) {
      if (region.meshName && nodes[region.meshName]) {
        const node = nodes[region.meshName] as unknown as Mesh;
        if (node.geometry) {
          gMap[region.meshName] = node.geometry;
          cMap[region.meshName] = computeCentroid(node.geometry);
        }
      }
    }
    return { geometryMap: gMap, centroidMap: cMap };
  }, [nodes, regions]);

  return <BrainRegionInstances regions={regions} geometryMap={geometryMap} centroidMap={centroidMap} />;
}

function BrainRegionsFallback({ regions }: { regions: BrainRegionData[] }) {
  return <BrainRegionInstances regions={regions} geometryMap={{}} centroidMap={{}} />;
}

function BrainRegionInstances({ regions, geometryMap, centroidMap }: {
  regions: BrainRegionData[];
  geometryMap: Record<string, BufferGeometry>;
  centroidMap: Record<string, [number, number, number]>;
}) {
  const instances = useMemo(() => {
    const list: Array<{
      region: BrainRegionData;
      instanceId: string;
      position: [number, number, number];
      mirrored: boolean;
    }> = [];

    for (const region of regions) {
      const hasGeo = !!(region.meshName && geometryMap[region.meshName]);
      const pos: [number, number, number] = hasGeo
        ? (centroidMap[region.meshName!] ?? [0, 0, 0])
        : region.position;

      list.push({ region, instanceId: region.id, position: pos, mirrored: false });

      if (region.hemisphere === 'left') {
        const mirrorPos: [number, number, number] = [-pos[0], pos[1], pos[2]];
        list.push({
          region,
          instanceId: `${region.id}-right`,
          position: mirrorPos,
          mirrored: true,
        });
      }
    }
    return list;
  }, [regions, geometryMap, centroidMap]);

  return (
    <>
      {instances.map(({ region, instanceId, position, mirrored }) => (
        <BrainRegion
          key={instanceId}
          region={region}
          instanceId={instanceId}
          position={position}
          geometry={region.meshName ? geometryMap[region.meshName] : undefined}
          mirrored={mirrored}
        />
      ))}
    </>
  );
}

function BrainRegions({ glbPath, regions }: { glbPath: string; regions: BrainRegionData[] }) {
  return (
    <BrainRegionsErrorBoundary fallback={<BrainRegionsFallback regions={regions} />}>
      <BrainRegionsWithGLB glbPath={glbPath} regions={regions} />
    </BrainRegionsErrorBoundary>
  );
}

function ExplodeSlider() {
  const explodeFactor = useBrainStore((s) => s.explodeFactor);
  const setExplodeFactor = useBrainStore((s) => s.setExplodeFactor);

  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 10, display: 'flex', alignItems: 'center', gap: 12,
      borderRadius: 16, border: '1px solid rgba(51,65,85,0.6)',
      background: 'rgba(15,23,42,0.8)', padding: '8px 16px',
      backdropFilter: 'blur(12px)',
    }}>
      <span style={{ fontSize: '0.6rem', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: '#94a3b8' }}>
        Explode
      </span>
      <input
        type="range" min={0} max={1} step={0.01}
        value={explodeFactor}
        onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
        style={{ width: 128 }}
      />
    </div>
  );
}

/**
 * Main brain atlas component. Renders a 3D brain with interactive region selection.
 *
 * @example
 * ```tsx
 * <BrainAtlas glbPath="/models/brain-atlas.glb" />
 * ```
 */
export function BrainAtlas({
  glbPath,
  regions = defaultRegions,
  className,
  minHeight = '500px',
}: BrainAtlasProps) {
  const selectRegion = useBrainStore((s) => s.selectRegion);
  const selectedRegionId = useBrainStore((s) => s.selectedRegionId);

  // Preload GLB
  React.useEffect(() => {
    try { useGLTF.preload(glbPath); } catch { /* ignore if file missing */ }
  }, [glbPath]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight }}>
      <Canvas
        camera={{ position: [-8, 2, 0], fov: 45 }}
        onPointerMissed={() => selectRegion(null)}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <directionalLight position={[-3, 4, -5]} intensity={0.3} />
        <pointLight position={[0, -2, 0]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 6, 2]} intensity={0.15} color="#7dd3fc" />

        <Environment preset="city" />

        <group rotation={[-Math.PI / 2, 0, 0]}>
          <BrainRegions glbPath={glbPath} regions={regions} />
        </group>

        <CameraController />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.12}
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
          autoRotate={!selectedRegionId}
          autoRotateSpeed={0.3}
        />

        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.1} darkness={0.4} />
        </EffectComposer>
      </Canvas>

      <ExplodeSlider />
    </div>
  );
}
