import type { RegionMapping } from '../types.js';

/**
 * Default region map: merges Desikan-Killiany atlas parcels into 15 functionally
 * meaningful brain regions, plus 9 fill regions for anatomical context.
 *
 * Functional regions cover areas relevant to learning, play, creativity, and
 * the major resting-state networks (DMN, ECN, SN).
 *
 * Fill regions provide the remaining cortical and subcortical structures so
 * the brain looks complete when rendered.
 */
export const dkFunctionalMap: RegionMapping[] = [
  // -- Functional regions --------------------------------------------------
  {
    name: 'dlpfc',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.rostralmiddlefrontal', 'lh.caudalmiddlefrontal'],
  },
  {
    name: 'vmpfc',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.medialorbitofrontal', 'lh.lateralorbitofrontal', 'lh.frontalpole'],
  },
  {
    name: 'mpfc',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.superiorfrontal'],
  },
  {
    name: 'pcc',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.posteriorcingulate', 'lh.isthmuscingulate', 'lh.precuneus'],
  },
  {
    name: 'anterior-insula',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.insula'],
  },
  {
    name: 'dacc',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.caudalanteriorcingulate', 'lh.rostralanteriorcingulate'],
  },
  {
    name: 'tpj',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.supramarginal', 'lh.bankssts'],
  },
  {
    name: 'angular-gyrus',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.inferiorparietal'],
  },
  {
    name: 'hippocampus',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Hippocampus'],
  },
  {
    name: 'amygdala',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Amygdala'],
  },
  {
    name: 'ventral-striatum',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Accumbens-area'],
  },
  {
    name: 'dorsal-striatum',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Caudate', 'Left-Putamen'],
  },
  {
    name: 'thalamus',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Thalamus-Proper'],
  },
  {
    name: 'cerebellum',
    source: 'subcortical',
    merge: 'left',
    parcels: ['Left-Cerebellum-Cortex'],
  },

  // -- Fill regions (anatomical context) -----------------------------------
  {
    name: 'cortex-motor',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.precentral', 'lh.paracentral'],
  },
  {
    name: 'cortex-somatosensory',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.postcentral'],
  },
  {
    name: 'cortex-parietal',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.superiorparietal'],
  },
  {
    name: 'cortex-temporal',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.superiortemporal', 'lh.middletemporal', 'lh.inferiortemporal', 'lh.transversetemporal', 'lh.temporalpole'],
  },
  {
    name: 'cortex-occipital',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.lateraloccipital', 'lh.cuneus', 'lh.pericalcarine', 'lh.lingual'],
  },
  {
    name: 'cortex-ventral',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.fusiform', 'lh.entorhinal', 'lh.parahippocampal'],
  },
  {
    name: 'cortex-frontal',
    source: 'cortical',
    merge: 'left',
    parcels: ['lh.parsopercularis', 'lh.parsorbitalis', 'lh.parstriangularis'],
  },
  {
    name: 'corpus-callosum',
    source: 'subcortical',
    merge: 'both',
    parcels: ['CC_Anterior', 'CC_Central', 'CC_Mid_Anterior', 'CC_Mid_Posterior', 'CC_Posterior'],
  },
  {
    name: 'brainstem',
    source: 'subcortical',
    merge: 'both',
    parcels: ['Brain-Stem'],
  },
];
