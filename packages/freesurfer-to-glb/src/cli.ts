#!/usr/bin/env node

import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { runPipeline } from './pipeline.js';
import type { RegionMapping } from './types.js';

function printUsage() {
  console.log(`
freesurfer-to-glb - Convert FreeSurfer DK atlas meshes to web-ready GLB

Usage:
  freesurfer-to-glb [options]
  npx freesurfer-to-glb [options]

Options:
  -o, --output <path>       Output GLB file path (default: brain-atlas.glb)
  -c, --cache <dir>         Cache directory for downloads (default: .tmp-brain-meshes)
  -r, --region-map <path>   Custom region map JSON file
  --radius <number>         Target normalization radius (default: 3)
  -q, --quiet               Suppress progress output
  -h, --help                Show this help message
  -v, --version             Show version

Examples:
  freesurfer-to-glb --output public/models/brain-atlas.glb
  freesurfer-to-glb --region-map my-regions.json --output custom-atlas.glb

Region map JSON format:
  [
    {
      "name": "hippocampus",
      "source": "subcortical",
      "merge": "left",
      "parcels": ["Left-Hippocampus"]
    }
  ]

Source data: Brainder.org "Brain for Blender" (CC BY-SA 3.0)
https://brainder.org/research/brain-for-blender/
`);
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const opts: {
    output: string;
    cache: string;
    regionMapPath?: string;
    radius: number;
    quiet: boolean;
  } = {
    output: 'brain-atlas.glb',
    cache: '.tmp-brain-meshes',
    radius: 3,
    quiet: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-o':
      case '--output':
        opts.output = args[++i];
        break;
      case '-c':
      case '--cache':
        opts.cache = args[++i];
        break;
      case '-r':
      case '--region-map':
        opts.regionMapPath = args[++i];
        break;
      case '--radius':
        opts.radius = parseFloat(args[++i]);
        break;
      case '-q':
      case '--quiet':
        opts.quiet = true;
        break;
      case '-h':
      case '--help':
        printUsage();
        process.exit(0);
      case '-v':
      case '--version':
        console.log('0.1.0');
        process.exit(0);
      default:
        console.error(`Unknown option: ${arg}\nRun with --help for usage.`);
        process.exit(1);
    }
  }

  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);

  let regionMap: RegionMapping[] | undefined;
  if (opts.regionMapPath) {
    const raw = readFileSync(resolve(opts.regionMapPath), 'utf-8');
    regionMap = JSON.parse(raw) as RegionMapping[];
    if (!opts.quiet) {
      console.log(`Using custom region map: ${opts.regionMapPath} (${regionMap.length} regions)`);
    }
  }

  const result = await runPipeline({
    cacheDir: resolve(opts.cache),
    outputPath: resolve(opts.output),
    regionMap,
    targetRadius: opts.radius,
    verbose: !opts.quiet,
  });

  if (!opts.quiet) {
    console.log(`\nSummary: ${result.regionCount} regions, ${(result.fileSizeBytes / 1024).toFixed(0)} KB`);
  }
}

main().catch((err) => {
  console.error('Pipeline error:', err.message || err);
  process.exit(1);
});
