# brain-for-web

Web-ready 3D brain atlas built on [Brain for Blender](https://brainder.org/research/brain-for-blender/). Converts FreeSurfer [Desikan-Killiany](https://surfer.nmr.mgh.harvard.edu/fswiki/CorticalParcellation) atlas meshes into an interactive, explorable brain viewer for the browser.

## What's in the box

| Package | What it does |
|---|---|
| [`freesurfer-to-glb`](./packages/freesurfer-to-glb) | CLI tool + Node.js library. Downloads DK atlas OBJ meshes from Brainder.org, merges parcels into functional brain regions, deduplicates vertices, normalizes coordinates, and exports an optimized GLB file. |
| [`react-brain-atlas`](./packages/react-brain-atlas) | React + Three.js viewer component. Interactive 3D brain with region selection, explode view, color modes, camera animation, and opt-in UI panels. |

## Quick start

### 1. Generate the brain mesh

```bash
npx freesurfer-to-glb --output public/models/brain-atlas.glb
```

This downloads ~10 MB of source meshes (cached for future runs), merges 70+ DK atlas parcels into 24 brain regions, and produces a single optimized GLB file.

### 2. Use the viewer

```bash
npm install react-brain-atlas
```

#### Minimal setup

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

#### Full setup with opt-in components

```tsx
import {
  BrainAtlas,
  BrainToolbar,
  BrainInfoPanel,
  BrainLegend,
} from 'react-brain-atlas';

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

See [examples/demo](./examples/demo) for a complete working app.

## Features

### Pipeline (`freesurfer-to-glb`)

- **One command** to go from raw FreeSurfer data to web-ready GLB
- Downloads and caches Brainder.org DK atlas archives automatically
- Merges DK parcels into 15 scientifically meaningful brain regions + 9 fill regions
- Vertex deduplication via spatial hashing (typically 40-60% size reduction)
- Global bounding-box normalization to a consistent coordinate system
- Hand-written binary glTF 2.0 builder -- no browser APIs, runs fully in Node.js
- Custom region maps via JSON for your own parcellation scheme
- Full CLI with `--output`, `--cache`, `--region-map`, `--radius`, `--quiet` flags

### Viewer (`react-brain-atlas`)

- **Real mesh rendering** with procedural-sphere fallback if GLB is missing
- **Bilateral mirroring**: only left-hemisphere meshes stored, mirrored at render time (halves file size)
- **Explode view** with centroid-based animation slider
- **Color modes**: by theme (learning / play / creativity) or neural system (DMN / ECN / SN)
- **Region selection** with animated camera fly-to
- **Opt-in subcomponents**: `<BrainToolbar />`, `<BrainInfoPanel />`, `<BrainLegend />`
- **Zustand store** (`useBrainStore()`) fully accessible for custom integrations
- **15 regions with full metadata**: descriptions, functions, evidence, citations with DOIs
- Built with React Three Fiber, drei, and postprocessing (bloom + vignette)

## How the pipeline works

```
Brainder.org OBJ archives
        |
        v
  Download & cache (~5 MB each)
        |
        v
  Extract cortical + subcortical OBJs
        |
        v
  Match parcels by name (with fuzzy fallbacks)
        |
        v
  Parse OBJ -> merge parcels per region -> deduplicate vertices
        |
        v
  Compute global bounding box (incl. mirrored points) -> normalize
        |
        v
  Build binary glTF 2.0 (GLB) manually
        |
        v
  brain-atlas.glb  (~1-2 MB, 24 named meshes)
```

## Custom region maps

Create a JSON file to define your own parcel-to-region mapping:

```json
[
  {
    "name": "hippocampus",
    "source": "subcortical",
    "merge": "left",
    "parcels": ["Left-Hippocampus"]
  },
  {
    "name": "prefrontal",
    "source": "cortical",
    "merge": "left",
    "parcels": ["lh.rostralmiddlefrontal", "lh.caudalmiddlefrontal", "lh.superiorfrontal"]
  }
]
```

```bash
freesurfer-to-glb --region-map my-regions.json --output custom-atlas.glb
```

- `source`: `"cortical"` (pial DK archive) or `"subcortical"`
- `merge`: `"left"` (left hemisphere only, mirrored at render time) or `"both"` (merge both hemispheres)

## Project structure

```
brain-for-web/
  packages/
    freesurfer-to-glb/     CLI tool + library
      src/
        cli.ts             CLI entry point
        pipeline.ts        Download, extract, merge, normalize, export
        glb-builder.ts     Hand-written binary glTF 2.0 builder
        obj-parser.ts      OBJ loading + vertex deduplication
        polyfills.ts       Node.js polyfills for three.js
        region-maps/       Preset region mappings
    react-brain-atlas/     React component library
      src/
        BrainAtlas.tsx     Main <BrainAtlas /> component
        BrainRegion.tsx    Individual region mesh renderer
        BrainToolbar.tsx   Search, color modes, view presets
        BrainInfoPanel.tsx Region details + searchable list
        BrainLegend.tsx    Color legend overlay
        CameraController.tsx  Animated camera transitions
        store.ts           Zustand state management
        defaults/          Built-in region data + color palettes
  examples/
    demo/                  Complete working demo app
```

## Development

```bash
git clone https://github.com/mpatricny/brain-for-web.git
cd brain-for-web
npm install
npm run build
```

## Attribution

This project uses mesh data from:

> Anderson M. Winkler, **"Brain for Blender"**
> https://brainder.org/research/brain-for-blender/
> Licensed under CC BY-SA 3.0

The Desikan-Killiany atlas parcellation is described in:

> Desikan RS, et al. (2006). "An automated labeling system for subdividing the
> human cerebral cortex on MRI scans into gyral based regions of interest."
> *NeuroImage*, 31(3), 968-980. DOI: [10.1016/j.neuroimage.2006.01.021](https://doi.org/10.1016/j.neuroimage.2006.01.021)

## License

- **Code**: Apache License 2.0 -- see [LICENSE](./LICENSE)
- **Mesh data and derived GLB files**: CC BY-SA 3.0 (Brainder.org) -- see [NOTICE](./NOTICE)
