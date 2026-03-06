<div align="center">

# 🧠 react-brain-atlas

### Interactive 3D Brain Atlas for React

**Embed a rotatable, clickable Desikan–Killiany brain in minutes.**

*No Unity. No heavy toolchain. Web-native.*

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Desikan-Killiany](https://img.shields.io/badge/DK_Atlas-68_regions-8B5CF6)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/react-brain-atlas?color=cb3837&logo=npm)](https://www.npmjs.com/package/react-brain-atlas)

[**Live Demo**](#) · [**CodeSandbox**](#) · [**Region Docs**](./packages/react-brain-atlas/README.md)

</div>

---

## ⚡ Quickstart

### 1. Generate the brain mesh

```bash
npx freesurfer-to-glb --output public/models/brain-atlas.glb
```

Downloads ~10 MB of source meshes (cached), merges 70+ DK atlas parcels into 24 brain regions, outputs a single optimized GLB (~1–2 MB).

### 2. Install the viewer

```bash
npm install react-brain-atlas
```

### 3. Render

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

### Full setup with opt-in components

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

> See [examples/demo](./examples/demo) for a complete working app.

---

## 🎯 Use Cases

| | Use Case | How |
|---|---|---|
| 🏥 | **Medical education** | Students explore brain regions interactively instead of memorizing flat diagrams |
| 🗣️ | **Patient communication** | Clinicians show patients exactly which brain area is affected |
| 📊 | **Neurofeedback dashboards** | Map real-time EEG/fMRI data onto 3D regions with custom colors |
| 🔬 | **Research frontends** | Build web UIs for neuroimaging studies — no desktop app required |

---

## 💡 Why brain-for-web?

| | Static images | Unity WebGL | Desktop tools | **brain-for-web** |
|---|---|---|---|---|
| Interactive | ❌ | ✅ | ✅ | ✅ |
| Web-native | ✅ | ⚠️ 30+ MB runtime | ❌ | ✅ **~1–2 MB** |
| React integration | ❌ | ❌ | ❌ | ✅ Native |
| Clickable regions | ❌ | Custom work | Varies | ✅ 24 regions out of the box |
| Open source | Varies | Varies | Rarely | ✅ Apache 2.0 |
| Build time | N/A | Minutes | N/A | **One `npx` command** |

---

## 📦 Packages

| Package | Description |
|---|---|
| [`react-brain-atlas`](./packages/react-brain-atlas) | React + Three.js viewer. Interactive 3D brain with region selection, explode view, color modes, camera animation, and opt-in UI panels. |
| [`freesurfer-to-glb`](./packages/freesurfer-to-glb) | CLI + Node.js library. Downloads DK atlas OBJ meshes, merges parcels, deduplicates vertices, normalizes coordinates, exports optimized GLB. |

---

## ✨ Features

### Viewer (`react-brain-atlas`)

- **Real mesh rendering** with procedural-sphere fallback if GLB is missing
- **Bilateral mirroring** — only left-hemisphere meshes stored, mirrored at render time (halves file size)
- **Explode view** with centroid-based animation slider
- **Color modes** — by theme (learning / play / creativity) or neural system (DMN / ECN / SN)
- **Region selection** with animated camera fly-to
- **Opt-in subcomponents**: `<BrainToolbar />`, `<BrainInfoPanel />`, `<BrainLegend />`
- **Zustand store** (`useBrainStore()`) — fully accessible for custom integrations
- **15 regions with full metadata**: descriptions, functions, evidence, citations with DOIs
- Built with React Three Fiber, drei, and postprocessing (bloom + vignette)

### Pipeline (`freesurfer-to-glb`)

- **One command** — raw FreeSurfer data → web-ready GLB
- Downloads and caches Brainder.org DK atlas archives automatically
- Merges DK parcels into 15 scientifically meaningful brain regions + 9 fill regions
- Vertex deduplication via spatial hashing (40–60% size reduction)
- Global bounding-box normalization
- Hand-written binary glTF 2.0 builder — no browser APIs, runs fully in Node.js
- Custom region maps via JSON for your own parcellation scheme
- Full CLI: `--output`, `--cache`, `--region-map`, `--radius`, `--quiet`

---

## 🧪 Custom Region Maps

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

---

## 🚀 Get Started

<div align="center">

**[Live Demo](#)** · **[Open in CodeSandbox](#)** · **[npm install react-brain-atlas](https://www.npmjs.com/package/react-brain-atlas)**

</div>

---

## Development

```bash
git clone https://github.com/mpatricny/brain-for-web.git
cd brain-for-web
npm install
npm run build
```

## Attribution

Mesh data from [Brain for Blender](https://brainder.org/research/brain-for-blender/) by Anderson M. Winkler (CC BY-SA 3.0).

Desikan–Killiany atlas: Desikan RS, et al. (2006). *NeuroImage*, 31(3), 968–980. DOI: [10.1016/j.neuroimage.2006.01.021](https://doi.org/10.1016/j.neuroimage.2006.01.021)

## License

- **Code**: Apache License 2.0 — see [LICENSE](./LICENSE)
- **Mesh data and derived GLB files**: CC BY-SA 3.0 (Brainder.org) — see [NOTICE](./NOTICE)
