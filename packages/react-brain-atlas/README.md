# react-brain-atlas

Interactive 3D brain atlas React component built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber). Renders Desikan-Killiany atlas meshes with region selection, explode view, color modes, and educational info panels.

## Install

```bash
npm install react-brain-atlas
```

Peer dependencies: `react`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `zustand`

## Quick start

```tsx
import { BrainAtlas } from 'react-brain-atlas';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <BrainAtlas glbPath="/models/brain-atlas.glb" />
    </div>
  );
}
```

Generate the GLB file with [`freesurfer-to-glb`](../freesurfer-to-glb).

## With opt-in subcomponents

```tsx
import { BrainAtlas, BrainToolbar, BrainInfoPanel, BrainLegend } from 'react-brain-atlas';

function BrainPage() {
  return (
    <div>
      <BrainToolbar />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ position: 'relative', minHeight: 600 }}>
          <BrainAtlas glbPath="/models/brain-atlas.glb" />
          <BrainLegend />
        </div>
        <BrainInfoPanel />
      </div>
    </div>
  );
}
```

## Components

### `<BrainAtlas />`

Main 3D viewer. Props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `glbPath` | `string` | required | Path to the GLB file |
| `regions` | `BrainRegionData[]` | Built-in DK regions | Region data |
| `colorMode` | `'theme' \| 'system'` | `'theme'` | Initial color mode |
| `className` | `string` | - | CSS class for container |
| `minHeight` | `string` | `'500px'` | Minimum viewport height |

### `<BrainToolbar />`

Search, color mode toggle, theme/system chips, camera presets, reset button.

### `<BrainInfoPanel />`

Region list with search filtering. Shows detailed info when a region is selected.

### `<BrainLegend />`

Color legend overlay that updates based on the active color mode.

## Zustand store

All components share state via `useBrainStore()`:

```tsx
import { useBrainStore } from 'react-brain-atlas';

function MyComponent() {
  const selectedId = useBrainStore((s) => s.selectedRegionId);
  const selectRegion = useBrainStore((s) => s.selectRegion);
  // ...
}
```

## Custom regions

Pass your own region data to the components:

```tsx
import { BrainAtlas, BrainInfoPanel } from 'react-brain-atlas';
import type { BrainRegionData } from 'react-brain-atlas';

const myRegions: BrainRegionData[] = [
  {
    id: 'hippocampus',
    label: 'Hippocampus',
    fullName: 'Hippocampus (CA1-CA3)',
    abbreviations: ['HPC'],
    hemisphere: 'left',
    themes: ['learning'],
    systems: ['DMN'],
    description: 'Memory formation hub.',
    functions: ['Episodic memory'],
    evidence: ['Patient H.M. studies'],
    citations: [{ title: 'Memory and the hippocampus', year: 2012 }],
    position: [1.5, -0.8, -0.5],
    scale: [0.45, 0.25, 0.55],
    color: '#22c55e',
    meshName: 'hippocampus',
  },
];

<BrainAtlas glbPath="/brain.glb" regions={myRegions} />
<BrainInfoPanel regions={myRegions} />
```

## Attribution

Built on mesh data from [Brainder.org](https://brainder.org/research/brain-for-blender/) (CC BY-SA 3.0).

## License

Apache 2.0 (code) / CC BY-SA 3.0 (mesh data)
