import type { BrainRegionData } from '../types.js';

/** Color palette for themes */
export const themeColors: Record<string, string> = {
  learning: '#3b82f6',
  play: '#f59e0b',
  creativity: '#a855f7',
};

/** Color palette for neural systems */
export const systemColors: Record<string, string> = {
  DMN: '#8b5cf6',
  ECN: '#3b82f6',
  SN: '#ef4444',
};

/**
 * 15 key brain regions relevant to learning, play, flow, and creativity,
 * plus 9 fill regions for anatomical context.
 *
 * Positions are in a right-handed coordinate system:
 *   X = left(-) / right(+)
 *   Y = ventral(-) / dorsal(+)
 *   Z = posterior(-) / anterior(+)
 *
 * Bilateral regions (hemisphere: 'left') are auto-mirrored by negating X at render time.
 */
export const defaultRegions: BrainRegionData[] = [
  {
    id: 'dlpfc',
    label: 'dlPFC',
    fullName: 'Dorsolateral Prefrontal Cortex (BA 9/46)',
    abbreviations: ['dlPFC', 'BA9', 'BA46'],
    hemisphere: 'left',
    themes: ['learning', 'creativity'],
    systems: ['ECN'],
    description:
      'Hub for working memory, cognitive flexibility, and top-down attention. Central to the Executive Control Network, it orchestrates goal-directed behaviour and rule-based reasoning.',
    functions: [
      'Working memory maintenance',
      'Cognitive flexibility and task-switching',
      'Goal-directed planning',
      'Inhibitory control',
    ],
    evidence: [
      'fMRI studies show bilateral dlPFC activation during n-back working memory tasks.',
      'TMS disruption of dlPFC impairs set-shifting in Wisconsin Card Sort Test.',
      'Increased dlPFC engagement during creative constraint satisfaction tasks.',
    ],
    citations: [
      { title: 'The role of the dorsolateral prefrontal cortex in working memory', year: 2003, doi: '10.1016/S0028-3932(03)00100-6' },
      { title: 'Creativity and the default network: A functional connectivity analysis', year: 2014, doi: '10.1016/j.neuropsychologia.2014.06.024' },
    ],
    position: [1.6, 1.2, 1.8],
    scale: [0.55, 0.45, 0.5],
    color: '#3b82f6',
    meshName: 'dlpfc',
  },
  {
    id: 'vmpfc',
    label: 'vmPFC / OFC',
    fullName: 'Ventromedial Prefrontal Cortex / Orbitofrontal Cortex (BA 10/11/12)',
    abbreviations: ['vmPFC', 'OFC', 'BA10', 'BA11'],
    hemisphere: 'left',
    themes: ['play', 'creativity'],
    systems: ['DMN'],
    description:
      'Integrates emotional valuation with decision-making. Active during imaginative play and social cognition, bridging reward signals with self-referential thought.',
    functions: [
      'Emotional valuation and reward processing',
      'Social cognition and theory of mind',
      'Spontaneous thought and daydreaming',
      'Risk-reward integration',
    ],
    evidence: [
      'vmPFC damage leads to impaired social decision-making (Damasio somatic marker hypothesis).',
      'Co-activates with hippocampus during future-oriented imagination tasks.',
      'OFC responds to novel reward contingencies during exploratory play.',
    ],
    citations: [
      { title: 'The role of the ventromedial prefrontal cortex in social cognition', year: 2010, doi: '10.1146/annurev.psych.60.110707.163600' },
    ],
    position: [0, -0.2, 2.5],
    scale: [0.6, 0.4, 0.45],
    color: '#f59e0b',
    meshName: 'vmpfc',
  },
  {
    id: 'mpfc',
    label: 'mPFC',
    fullName: 'Medial Prefrontal Cortex (BA 10/32)',
    abbreviations: ['mPFC', 'BA10', 'BA32'],
    hemisphere: 'left',
    themes: ['creativity', 'play'],
    systems: ['DMN'],
    description:
      'Core default-mode hub for self-referential processing, mentalizing, and spontaneous idea generation. Key node in creative ideation and mind-wandering.',
    functions: [
      'Self-referential processing',
      'Mind-wandering and spontaneous thought',
      'Social mentalizing',
      'Creative ideation',
    ],
    evidence: [
      'Strongly active during rest and mind-wandering (Raichle default mode studies).',
      'Increased mPFC-PCC connectivity during divergent thinking tasks.',
      'Deactivates during externally demanding tasks, reactivates for insight moments.',
    ],
    citations: [
      { title: 'A default mode of brain function', year: 2001, doi: '10.1073/pnas.98.2.676' },
      { title: 'Default and executive network coupling supports creative ideation', year: 2018, doi: '10.1038/s41598-018-20781-8' },
    ],
    position: [0, 0.8, 2.3],
    scale: [0.5, 0.55, 0.5],
    color: '#8b5cf6',
    meshName: 'mpfc',
  },
  {
    id: 'pcc',
    label: 'PCC / Precuneus',
    fullName: 'Posterior Cingulate Cortex & Precuneus (BA 23/31/7)',
    abbreviations: ['PCC', 'BA23', 'BA31', 'Precuneus'],
    hemisphere: 'left',
    themes: ['creativity', 'learning'],
    systems: ['DMN'],
    description:
      'Posterior hub of the default mode network. Involved in episodic memory retrieval, spatial-temporal context, and integrating internal representations during creative thought.',
    functions: [
      'Episodic memory retrieval',
      'Self-referential reflection',
      'Spatial-temporal context integration',
      'Autobiographical memory access',
    ],
    evidence: [
      'PCC is among the most metabolically active regions at rest (Raichle 2001).',
      'Precuneus activation correlates with vivid episodic imagery.',
      'PCC-mPFC coupling strengthens during creative insight tasks.',
    ],
    citations: [
      { title: 'The posterior cingulate cortex: intrinsic and extrinsic connectivity', year: 2012, doi: '10.1002/hbm.21375' },
    ],
    position: [0, 1.0, -1.8],
    scale: [0.55, 0.6, 0.55],
    color: '#a78bfa',
    meshName: 'pcc',
  },
  {
    id: 'anterior-insula',
    label: 'Anterior Insula',
    fullName: 'Anterior Insular Cortex (BA 13/14)',
    abbreviations: ['AI', 'aIC', 'BA13'],
    hemisphere: 'left',
    themes: ['learning', 'creativity'],
    systems: ['SN'],
    description:
      'Core hub of the Salience Network. Detects behaviourally relevant stimuli, integrates interoception with cognition, and triggers switching between DMN and ECN.',
    functions: [
      'Salience detection',
      'Interoceptive awareness',
      'Network switching (DMN / ECN)',
      'Emotional awareness and empathy',
    ],
    evidence: [
      'Anterior insula is the causal "switch" that toggles between DMN and ECN (Menon & Uddin 2010).',
      'Heightened insula activity during flow-state tasks and musical improvisation.',
      'Damage impairs emotional decision-making and interoceptive accuracy.',
    ],
    citations: [
      { title: 'Saliency, switching, attention and control: a network model of insula function', year: 2010, doi: '10.1007/s00429-010-0262-0' },
    ],
    position: [1.8, 0.2, 0.8],
    scale: [0.3, 0.4, 0.45],
    color: '#ef4444',
    meshName: 'anterior-insula',
  },
  {
    id: 'dacc',
    label: 'dACC',
    fullName: 'Dorsal Anterior Cingulate Cortex (BA 24/32)',
    abbreviations: ['dACC', 'BA24', 'BA32'],
    hemisphere: 'left',
    themes: ['learning'],
    systems: ['SN'],
    description:
      'Monitors conflicts and errors, signalling the need for increased cognitive control. Partners with the anterior insula in the Salience Network to coordinate adaptive responses.',
    functions: [
      'Error and conflict monitoring',
      'Performance adjustment',
      'Reward-based learning signals',
      'Pain and uncertainty processing',
    ],
    evidence: [
      'ERN (error-related negativity) localises to dACC in EEG source analyses.',
      'dACC activity scales with decision conflict in Stroop and flanker tasks.',
      'Plays a key role in reinforcement learning prediction error signals.',
    ],
    citations: [
      { title: 'An integrative theory of anterior cingulate cortex function', year: 2004, doi: '10.1162/0898929042568643' },
    ],
    position: [0, 0.8, 1.4],
    scale: [0.35, 0.35, 0.5],
    color: '#f87171',
    meshName: 'dacc',
  },
  {
    id: 'hippocampus',
    label: 'Hippocampus',
    fullName: 'Hippocampus (CA1-CA3, DG, Subiculum)',
    abbreviations: ['HPC', 'HC', 'CA1', 'DG'],
    hemisphere: 'left',
    themes: ['learning', 'creativity'],
    systems: ['DMN'],
    description:
      'Critical for forming new episodic memories and spatial navigation. Also key for creative simulation -- recombining stored episodes into novel future scenarios.',
    functions: [
      'Episodic memory encoding and consolidation',
      'Spatial navigation and cognitive mapping',
      'Future simulation and scene construction',
      'Pattern separation and completion',
    ],
    evidence: [
      'Patient H.M. demonstrated hippocampal necessity for new declarative memories.',
      "Place cells and grid cells form cognitive maps (O'Keefe & Moser Nobel 2014).",
      'Hippocampal-vmPFC coupling during imaginative scene construction.',
    ],
    citations: [
      { title: 'The hippocampus in imagination and future thinking', year: 2012, doi: '10.1080/17470218.2012.693652' },
      { title: 'Hippocampal place cells, spatial maps and the population code for memory', year: 2015, doi: '10.1016/j.conb.2015.01.001' },
    ],
    position: [1.5, -0.8, -0.5],
    scale: [0.45, 0.25, 0.55],
    color: '#22c55e',
    meshName: 'hippocampus',
  },
  {
    id: 'amygdala',
    label: 'Amygdala',
    fullName: 'Amygdala (Basolateral & Central Nuclei)',
    abbreviations: ['AMY', 'BLA', 'CeA'],
    hemisphere: 'left',
    themes: ['play', 'learning'],
    systems: ['SN'],
    description:
      'Rapid emotional evaluator -- tags stimuli with significance and modulates memory consolidation. Essential for social play signals and threat-reward assessment.',
    functions: [
      'Emotional significance tagging',
      'Fear conditioning and extinction',
      'Memory modulation via arousal',
      'Social signal processing',
    ],
    evidence: [
      'Amygdala enhances hippocampal consolidation for emotionally arousing events.',
      'Active during rough-and-tumble play in animal models (Panksepp PLAY circuit).',
      'Bilateral amygdala lesions (Urbach-Wiethe) impair fear recognition but preserve other emotions.',
    ],
    citations: [
      { title: 'The amygdala and emotional memory', year: 2004, doi: '10.1016/j.tics.2004.03.002' },
    ],
    position: [1.4, -0.9, 0.3],
    scale: [0.3, 0.3, 0.3],
    color: '#f97316',
    meshName: 'amygdala',
  },
  {
    id: 'ventral-striatum',
    label: 'Ventral Striatum',
    fullName: 'Ventral Striatum / Nucleus Accumbens (NAc)',
    abbreviations: ['VS', 'NAc', 'NAcc'],
    hemisphere: 'left',
    themes: ['play', 'learning', 'creativity'],
    systems: ['SN'],
    description:
      'Key reward hub -- dopamine release here drives motivation, reinforcement learning, and the pleasure of discovery. Central to the "wanting" system and flow experiences.',
    functions: [
      'Reward prediction and motivation',
      'Reinforcement learning',
      'Novelty-seeking behaviour',
      'Flow and intrinsic motivation signals',
    ],
    evidence: [
      'NAc dopamine release increases with unexpected rewards and novel stimuli.',
      'Active during musical chills, game rewards, and aha moments.',
      'Ventral striatum signals mediate the transition from exploration to exploitation.',
    ],
    citations: [
      { title: 'Anatomically distinct dopamine release during anticipation and experience of peak emotion to music', year: 2011, doi: '10.1038/nn.2726' },
    ],
    position: [0, -0.3, 1.2],
    scale: [0.4, 0.3, 0.35],
    color: '#eab308',
    meshName: 'ventral-striatum',
  },
  {
    id: 'dorsal-striatum',
    label: 'Dorsal Striatum',
    fullName: 'Dorsal Striatum (Caudate & Putamen)',
    abbreviations: ['DS', 'Caudate', 'Putamen'],
    hemisphere: 'left',
    themes: ['learning', 'play'],
    systems: ['ECN'],
    description:
      'Drives habit formation and procedural learning. As skills become automatic, activity shifts from ventral to dorsal striatum -- the neural signature of mastery.',
    functions: [
      'Procedural / habit learning',
      'Skill automation',
      'Action selection and sequencing',
      'Stimulus-response associations',
    ],
    evidence: [
      'Caudate active early in learning; putamen dominates after skill automation.',
      'Dorsal striatum lesions impair habit-based navigation but spare declarative memory.',
      'Reinforcement learning models map reward prediction errors to striatal dopamine.',
    ],
    citations: [
      { title: 'Habits, rituals, and the evaluative brain', year: 2008, doi: '10.1146/annurev.neuro.29.051605.112851' },
    ],
    position: [0, 0.3, 0.8],
    scale: [0.5, 0.35, 0.4],
    color: '#ca8a04',
    meshName: 'dorsal-striatum',
  },
  {
    id: 'vta',
    label: 'VTA',
    fullName: 'Ventral Tegmental Area',
    abbreviations: ['VTA'],
    hemisphere: 'midline',
    themes: ['play', 'learning', 'creativity'],
    systems: ['SN'],
    description:
      'Source of mesolimbic and mesocortical dopamine. Fires when predictions are violated, fuelling curiosity, exploratory play, and the reward signals that consolidate learning.',
    functions: [
      'Dopamine production for reward circuits',
      'Prediction error signalling',
      'Curiosity and exploration drive',
      'Motivational salience',
    ],
    evidence: [
      'VTA dopamine neurons encode reward prediction errors (Schultz 1997).',
      'Curiosity-driven learning activates VTA-hippocampal loop.',
      'VTA stimulation enhances long-term memory consolidation in animal models.',
    ],
    citations: [
      { title: 'A neural substrate of prediction and reward', year: 1997, doi: '10.1126/science.275.5306.1593' },
      { title: 'States of curiosity modulate hippocampus-dependent learning via the dopaminergic circuit', year: 2014, doi: '10.1016/j.neuron.2014.08.060' },
    ],
    position: [0, -1.2, -0.8],
    scale: [0.25, 0.2, 0.25],
    color: '#fbbf24',
  },
  {
    id: 'cerebellum',
    label: 'Cerebellum',
    fullName: 'Cerebellum (Posterior Lobe, Crus I/II)',
    abbreviations: ['CB', 'Crus I', 'Crus II'],
    hemisphere: 'left',
    themes: ['learning', 'creativity'],
    systems: ['ECN'],
    description:
      'Far more than motor coordination -- posterior cerebellum (Crus I/II) connects to prefrontal cortex, contributing to language, working memory, and creative cognition.',
    functions: [
      'Motor coordination and timing',
      'Internal forward models',
      'Language processing (Crus I/II)',
      'Cognitive sequencing and prediction',
    ],
    evidence: [
      "Cerebellar Crus I/II show functional connectivity with dlPFC and Broca's area.",
      'Cerebellar damage can cause "cerebellar cognitive affective syndrome".',
      'Active during sequence learning and temporal prediction tasks.',
    ],
    citations: [
      { title: "The cerebellum's role in creative thinking", year: 2019, doi: '10.1016/j.neubiorev.2019.04.006' },
    ],
    position: [0, -1.6, -2.0],
    scale: [1.2, 0.6, 0.7],
    color: '#06b6d4',
    meshName: 'cerebellum',
  },
  {
    id: 'thalamus',
    label: 'Thalamus',
    fullName: 'Thalamus (Mediodorsal, Pulvinar, VA/VL nuclei)',
    abbreviations: ['Thal', 'MD', 'Pulvinar'],
    hemisphere: 'left',
    themes: ['learning'],
    systems: ['ECN', 'SN'],
    description:
      'Central relay station that gates sensory information to cortex and modulates cortico-cortical communication. The mediodorsal nucleus connects to PFC for working memory.',
    functions: [
      'Sensory relay and gating',
      'Cortical arousal regulation',
      'Working memory support (MD nucleus)',
      'Attention modulation (Pulvinar)',
    ],
    evidence: [
      'Thalamic lesions produce wide-ranging cognitive deficits across domains.',
      'Pulvinar modulates visual attention via feedback to parietal cortex.',
      'Mediodorsal thalamus sustains PFC activity during delay periods.',
    ],
    citations: [
      { title: 'The thalamus as a relay station and gating mechanism', year: 2015, doi: '10.1016/j.tics.2015.04.003' },
    ],
    position: [0, -0.3, -0.3],
    scale: [0.55, 0.35, 0.45],
    color: '#64748b',
    meshName: 'thalamus',
  },
  {
    id: 'tpj',
    label: 'TPJ',
    fullName: 'Temporoparietal Junction (BA 39/40)',
    abbreviations: ['TPJ', 'BA39', 'BA40'],
    hemisphere: 'left',
    themes: ['creativity', 'play'],
    systems: ['DMN'],
    description:
      'Integrates multi-sensory information and is central to theory of mind, perspective-taking, and spontaneous redirecting of attention -- a hub for social creativity.',
    functions: [
      'Theory of mind and mentalizing',
      'Attentional reorienting',
      'Self-other distinction',
      'Multi-sensory integration',
    ],
    evidence: [
      'TPJ activation in false-belief tasks (Saxe & Kanwisher 2003).',
      'Right TPJ disruption with TMS impairs spontaneous perspective-taking.',
      'Active during improvisational storytelling and collaborative play.',
    ],
    citations: [
      { title: 'People thinking about thinking people: The role of the temporo-parietal junction in theory of mind', year: 2003, doi: '10.1016/S1053-8119(03)00230-1' },
    ],
    position: [2.0, 0.4, -1.2],
    scale: [0.45, 0.4, 0.45],
    color: '#c084fc',
    meshName: 'tpj',
  },
  {
    id: 'angular-gyrus',
    label: 'Angular Gyrus',
    fullName: 'Angular Gyrus (BA 39)',
    abbreviations: ['AG', 'BA39'],
    hemisphere: 'left',
    themes: ['creativity', 'learning'],
    systems: ['DMN'],
    description:
      'Cross-modal association area binding language, spatial reasoning, and memory retrieval. Part of the DMN, it supports semantic integration and the "aha" moment in creative insight.',
    functions: [
      'Semantic integration',
      'Reading and number processing',
      'Episodic memory retrieval',
      'Cross-modal binding',
    ],
    evidence: [
      'Angular gyrus damage causes Gerstmann syndrome (agraphia, acalculia, finger agnosia).',
      'Active during metaphor comprehension and analogical reasoning.',
      'Part of the DMN and strongly connected to hippocampus and mPFC.',
    ],
    citations: [
      { title: 'The angular gyrus: multiple functions and multiple subdivisions', year: 2013, doi: '10.1177/1073858413502095' },
    ],
    position: [2.1, 0.6, -1.8],
    scale: [0.4, 0.35, 0.4],
    color: '#a855f7',
    meshName: 'angular-gyrus',
  },
  // -- Fill regions --
  { id: 'cortex-motor', label: 'Motor Cortex', fullName: 'Primary Motor Cortex (BA 4)', abbreviations: ['M1'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [1.0, 1.5, 0.5], scale: [0.5, 0.4, 0.5], color: '#64748b', meshName: 'cortex-motor', fill: true },
  { id: 'cortex-somatosensory', label: 'Somatosensory Cortex', fullName: 'Primary Somatosensory Cortex (BA 1/2/3)', abbreviations: ['S1'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [1.2, 1.5, -0.2], scale: [0.5, 0.4, 0.5], color: '#64748b', meshName: 'cortex-somatosensory', fill: true },
  { id: 'cortex-parietal', label: 'Superior Parietal Lobule', fullName: 'Superior Parietal Lobule (BA 5/7)', abbreviations: ['SPL'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [1.0, 1.8, -1.0], scale: [0.5, 0.4, 0.5], color: '#64748b', meshName: 'cortex-parietal', fill: true },
  { id: 'cortex-temporal', label: 'Temporal Cortex', fullName: 'Temporal Lobe (STG, MTG, ITG)', abbreviations: ['STG', 'MTG', 'ITG'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [2.2, -0.5, 0.0], scale: [0.5, 0.4, 0.7], color: '#64748b', meshName: 'cortex-temporal', fill: true },
  { id: 'cortex-occipital', label: 'Occipital Cortex', fullName: 'Occipital Lobe (Visual Cortex)', abbreviations: ['V1', 'V2'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [0.5, 0.5, -2.5], scale: [0.5, 0.5, 0.5], color: '#64748b', meshName: 'cortex-occipital', fill: true },
  { id: 'cortex-ventral', label: 'Ventral Temporal', fullName: 'Fusiform, Entorhinal, and Parahippocampal Gyri', abbreviations: ['FG', 'EC', 'PHG'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [1.5, -1.0, -0.5], scale: [0.4, 0.3, 0.6], color: '#64748b', meshName: 'cortex-ventral', fill: true },
  { id: 'cortex-frontal', label: 'Inferior Frontal Gyrus', fullName: 'Inferior Frontal Gyrus (IFG)', abbreviations: ['IFG'], hemisphere: 'left', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [2.0, 0.3, 1.5], scale: [0.4, 0.3, 0.5], color: '#64748b', meshName: 'cortex-frontal', fill: true },
  { id: 'corpus-callosum', label: 'Corpus Callosum', fullName: 'Corpus Callosum', abbreviations: ['CC'], hemisphere: 'midline', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [0, 0.5, 0], scale: [0.5, 0.3, 0.6], color: '#94a3b8', meshName: 'corpus-callosum', fill: true },
  { id: 'brainstem', label: 'Brainstem', fullName: 'Brainstem (Midbrain, Pons, Medulla)', abbreviations: ['BS'], hemisphere: 'midline', themes: [], systems: [], description: '', functions: [], evidence: [], citations: [], position: [0, -2.0, 0], scale: [0.4, 0.6, 0.4], color: '#64748b', meshName: 'brainstem', fill: true },
];
