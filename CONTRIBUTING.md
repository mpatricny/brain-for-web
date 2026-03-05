# Contributing

Contributions are welcome! This project extends the Brainder.org "Brain for Blender" mesh data with a web-focused pipeline and viewer.

## Development setup

```bash
git clone https://github.com/mpatricny/brain-for-web.git
cd brain-for-web
npm install
npm run build
```

## Project structure

- `packages/freesurfer-to-glb/` -- CLI pipeline tool
- `packages/react-brain-atlas/` -- React viewer component library
- `examples/demo/` -- Demo application

## Adding new region maps

The pipeline supports custom region maps. Create a JSON file following the schema in `packages/freesurfer-to-glb/src/region-maps/dk-functional.ts` and pass it via `--region-map your-map.json`.

## Adding new viewer features

The React viewer is built with opt-in subcomponents. New features should follow this pattern:
1. Create a new component in `packages/react-brain-atlas/src/`
2. Export it from `index.ts`
3. Keep it independent -- users should be able to use `<BrainAtlas />` without your component

## Upstream attribution

Code contributions fall under Apache License 2.0. The upstream mesh data remains CC BY-SA 3.0 (Brainder.org). Please ensure you have the right to contribute your code under these terms.

## Reporting issues

Please open an issue on GitHub. Include:
- Which package is affected (`freesurfer-to-glb` or `react-brain-atlas`)
- Steps to reproduce
- Expected vs. actual behavior
