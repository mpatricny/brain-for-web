# freesurfer-to-glb

CLI tool and library that converts FreeSurfer [Desikan-Killiany atlas](https://surfer.nmr.mgh.harvard.edu/fswiki/CorticalParcellation) meshes into an optimized GLB file for web-based brain viewers.

Downloads cortical and subcortical OBJ meshes from [Brainder.org](https://brainder.org/research/brain-for-blender/), merges parcels into functionally meaningful brain regions, normalizes coordinates, deduplicates vertices, and exports a single binary glTF 2.0 file.

## CLI usage

```bash
npx freesurfer-to-glb --output public/models/brain-atlas.glb
```

### Options

| Flag | Description | Default |
|---|---|---|
| `-o, --output` | Output GLB file path | `brain-atlas.glb` |
| `-c, --cache` | Cache directory for downloads | `.tmp-brain-meshes` |
| `-r, --region-map` | Custom region map JSON file | Built-in DK functional map |
| `--radius` | Target normalization radius | `3` |
| `-q, --quiet` | Suppress progress output | `false` |

## Library usage

```ts
import { runPipeline, dkFunctionalMap } from 'freesurfer-to-glb';

const result = await runPipeline({
  cacheDir: '.cache',
  outputPath: 'brain.glb',
  regionMap: dkFunctionalMap, // or your custom map
  targetRadius: 3,
});
```

## Custom region maps

Create a JSON file defining how DK parcels map to your regions:

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

- `source`: `"cortical"` (pial DK archive) or `"subcortical"`
- `merge`: `"left"` (left-hemisphere only, mirrored at render time) or `"both"` (merge both hemispheres into one mesh)

## How it works

1. Downloads and caches Brainder.org DK atlas archives (~5 MB each)
2. Extracts OBJ files and matches parcels by name
3. Parses OBJ geometry, merges parcels per region, deduplicates vertices
4. Computes global bounding box (including mirrored points) and normalizes all regions
5. Builds binary glTF 2.0 (GLB) manually -- no browser APIs required

## Attribution

Source mesh data: [Brainder.org "Brain for Blender"](https://brainder.org/research/brain-for-blender/) by Anderson M. Winkler, CC BY-SA 3.0.

## License

Apache 2.0 (code) / CC BY-SA 3.0 (mesh data)
