import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh as MeshType } from 'three';
import { useBrainStore } from './store.js';
import { themeColors, systemColors } from './defaults/regions.js';
import type { BrainRegionData } from './types.js';

interface BrainRegionProps {
  region: BrainRegionData;
  instanceId: string;
  position: [number, number, number];
  geometry?: THREE.BufferGeometry;
  mirrored?: boolean;
}

function computeColor(
  region: BrainRegionData,
  colorMode: 'theme' | 'system',
  activeTheme: string | null,
  activeSystem: string | null,
): string {
  if (colorMode === 'theme' && activeTheme) {
    return region.themes.includes(activeTheme as any) ? themeColors[activeTheme] : '#334155';
  }
  if (colorMode === 'system' && activeSystem) {
    return region.systems.includes(activeSystem as any) ? systemColors[activeSystem] : '#334155';
  }
  if (colorMode === 'theme') {
    return region.themes.length > 0 ? themeColors[region.themes[0]] : region.color;
  }
  if (colorMode === 'system') {
    return region.systems.length > 0 ? systemColors[region.systems[0]] : region.color;
  }
  return region.color;
}

export function BrainRegion({ region, instanceId, position, geometry, mirrored }: BrainRegionProps) {
  const meshRef = useRef<MeshType>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const isFill = !!region.fill;

  const selectedRegionId = useBrainStore((s) => s.selectedRegionId);
  const hoveredRegionId = useBrainStore((s) => s.hoveredRegionId);
  const colorMode = useBrainStore((s) => s.colorMode);
  const activeTheme = useBrainStore((s) => s.activeTheme);
  const activeSystem = useBrainStore((s) => s.activeSystem);
  const explodeFactor = useBrainStore((s) => s.explodeFactor);
  const selectRegion = useBrainStore((s) => s.selectRegion);
  const hoverRegion = useBrainStore((s) => s.hoverRegion);

  const isSelected = !isFill && selectedRegionId === region.id;
  const isHovered = !isFill && hoveredRegionId === instanceId;

  const color = useMemo(
    () => isFill ? '#475569' : computeColor(region, colorMode, activeTheme, activeSystem),
    [region, colorMode, activeTheme, activeSystem, isFill],
  );

  const hasRealGeometry = !!geometry;
  const EXPLODE_MULT = 1.6;

  const explodedPosition = useMemo((): [number, number, number] => {
    if (hasRealGeometry) {
      return [
        position[0] * explodeFactor * EXPLODE_MULT,
        position[1] * explodeFactor * EXPLODE_MULT,
        position[2] * explodeFactor * EXPLODE_MULT,
      ];
    }
    return [
      position[0] * (1 + explodeFactor * EXPLODE_MULT),
      position[1] * (1 + explodeFactor * EXPLODE_MULT),
      position[2] * (1 + explodeFactor * EXPLODE_MULT),
    ];
  }, [position, explodeFactor, hasRealGeometry]);

  const fillOpacity = 0.18;
  const targetOpacity = isFill ? fillOpacity : 1;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as any;

    mat.opacity += (targetOpacity - mat.opacity) * Math.min(delta * 6, 1);
    mat.transparent = mat.opacity < 0.99;

    if (isFill) return;

    const base: [number, number, number] = hasRealGeometry ? [1, 1, 1] : region.scale;
    const xSign = mirrored && hasRealGeometry ? -1 : 1;
    if (isSelected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04;
      meshRef.current.scale.set(xSign * base[0] * pulse, base[1] * pulse, base[2] * pulse);
    } else {
      meshRef.current.scale.lerp({ x: xSign * base[0], y: base[1], z: base[2] } as any, Math.min(delta * 8, 1));
    }
  });

  const emissive = isSelected ? color : isHovered ? '#ffffff' : '#000000';
  const emissiveIntensity = isSelected ? 0.6 : isHovered ? 0.3 : 0;

  return (
    <mesh
      ref={meshRef}
      position={explodedPosition}
      scale={hasRealGeometry ? (mirrored ? [-1, 1, 1] : [1, 1, 1]) : region.scale}
      geometry={geometry}
      onClick={isFill ? undefined : (e) => {
        e.stopPropagation();
        selectRegion(isSelected ? null : region.id);
      }}
      onPointerOver={isFill ? undefined : (e) => {
        e.stopPropagation();
        hoverRegion(instanceId);
        setShowTooltip(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={isFill ? undefined : () => {
        hoverRegion(null);
        setShowTooltip(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {!geometry && <sphereGeometry args={[1, 32, 24]} />}
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={isFill ? 0 : emissiveIntensity}
        roughness={geometry ? 0.55 : 0.3}
        metalness={isFill ? 0.05 : 0.1}
        clearcoat={isFill ? 0.1 : 0.3}
        clearcoatRoughness={0.2}
        opacity={targetOpacity}
        transparent
        side={mirrored && geometry ? THREE.DoubleSide : THREE.FrontSide}
      />
      {showTooltip && !isSelected && !isFill && (
        <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div style={{
            whiteSpace: 'nowrap',
            borderRadius: '8px',
            border: '1px solid rgba(51,65,85,0.8)',
            background: 'rgba(15,23,42,0.9)',
            padding: '4px 10px',
            fontSize: '0.65rem',
            fontWeight: 500,
            color: '#e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
          }}>
            {region.label}
          </div>
        </Html>
      )}
    </mesh>
  );
}
