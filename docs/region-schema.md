# Region Page Scientific Integrity Schema (brain-for-web)

Purpose: keep SEO-scaled region pages scientifically accurate, reproducible, and non-overclaiming.

## 1) Required fields per region page

Every region page MUST include all fields below.

```yaml
region_id: string                    # stable slug, e.g. superior-temporal-gyrus
atlas_system: "Desikan-Killiany"
atlas_label: string                  # exact DK label, e.g. superiortemporal
common_names: [string, ...]          # e.g. ["Superior Temporal Gyrus", "STG"]
hemisphere: "left" | "right" | "bilateral"
confidence_mapping_flag: "high" | "medium" | "low"
confidence_mapping_note: string      # why mapping is certain/uncertain
plain_language_definition: string    # 1 paragraph, no deterministic claim
associated_with:
  - claim: string                    # use "associated with" / "implicated in"
    evidence_strength: "established" | "emerging" | "preliminary"
    citation_keys: [string, ...]
citation_block:
  - key: string
    source: string
    year: number
    doi_or_url: string
disclaimer: string                   # educational, not diagnostic advice
```

### Claim-writing rule
Use:
- “associated with …”
- “implicated in …”
- “often engaged during …”

Never use deterministic language (see §3).

---

## 2) DK atlas mapping table (68 cortical parcels)

> DK has 34 cortical parcels per hemisphere.
> For SEO pages, use bilateral conceptual pages + hemisphere-specific anchors where needed.

| DK label | Common name(s) | Notes |
|---|---|---|
| bankssts | Banks of superior temporal sulcus | STS bank region |
| caudalanteriorcingulate | Caudal anterior cingulate cortex | ACC subregion |
| caudalmiddlefrontal | Caudal middle frontal gyrus | DLPFC-related territory |
| cuneus | Cuneus | Occipital visual cortex |
| entorhinal | Entorhinal cortex | Medial temporal input gateway |
| fusiform | Fusiform gyrus | Ventral temporal visual region |
| inferiorparietal | Inferior parietal lobule | IPL |
| inferiortemporal | Inferior temporal gyrus | High-level visual processing |
| isthmuscingulate | Isthmus cingulate | Posterior cingulate transition |
| lateraloccipital | Lateral occipital cortex | Visual association cortex |
| lateralorbitofrontal | Lateral orbitofrontal cortex | OFC subregion |
| lingual | Lingual gyrus | Ventral occipital region |
| medialorbitofrontal | Medial orbitofrontal cortex | OFC/valuation-related |
| middletemporal | Middle temporal gyrus | MTG |
| parahippocampal | Parahippocampal gyrus | Medial temporal memory-related |
| paracentral | Paracentral lobule | Sensorimotor medial wall |
| parsopercularis | Pars opercularis (IFG) | Broca-related subregion |
| parsorbitalis | Pars orbitalis (IFG) | Ventral IFG/OFC boundary |
| parstriangularis | Pars triangularis (IFG) | Broca-related subregion |
| pericalcarine | Pericalcarine cortex | Primary visual cortex vicinity |
| postcentral | Postcentral gyrus | Primary somatosensory cortex |
| posteriorcingulate | Posterior cingulate cortex | DMN core-related |
| precentral | Precentral gyrus | Primary motor cortex |
| precuneus | Precuneus | DMN/visuospatial hub |
| rostralanteriorcingulate | Rostral anterior cingulate cortex | ACC subregion |
| rostralmiddlefrontal | Rostral middle frontal gyrus | DLPFC-related territory |
| superiorfrontal | Superior frontal gyrus | Frontal association region |
| superiorparietal | Superior parietal lobule | Visuospatial attention-related |
| superiortemporal | Superior temporal gyrus | Auditory/language-related |
| supramarginal | Supramarginal gyrus | Inferior parietal subregion |
| frontalpole | Frontal pole | Anterior prefrontal cortex |
| temporalpole | Temporal pole | Anterior temporal cortex |
| transversetemporal | Transverse temporal gyrus (Heschl) | Primary auditory cortex vicinity |
| insula | Insular cortex | Salience/interoception-related |

### Non-DK (subcortical) structures — companion pages only

These are NOT DK cortical parcels and must be separate pages with explicit “not part of DK 68 cortical parcel set” disclaimer:
- hippocampus
- amygdala
- thalamus
- caudate
- putamen
- pallidum
- nucleus accumbens
- brainstem
- cerebellum

---

## 3) Language constraints

### Forbidden phrases
- “controls X”
- “responsible for X”
- “the X center”
- “this region causes X”
- “proves that …”

### Required alternatives
- “is associated with …”
- “is implicated in …”
- “is often engaged during …”
- “evidence suggests …”
- “in this task context …”

### Always include context
- population/task context (healthy adults, patient cohort, animal model)
- evidence strength label (established/emerging/preliminary)
- uncertainty note when mapping is indirect

---

## 4) Markdown template (copy/paste)

```md
# {{Common Name}} ({{Atlas Label}}) — Interactive 3D Region

## Region metadata
- Atlas system: Desikan-Killiany
- Atlas label: `{{atlas_label}}`
- Common names: {{common_names}}
- Hemisphere: {{hemisphere}}
- Mapping confidence: **{{high|medium|low}}**
- Mapping note: {{confidence_mapping_note}}

## Plain-language definition
{{one_paragraph_non_deterministic_definition}}

## Associated with (not deterministic)
- {{claim_1}} — **Evidence:** {{established|emerging|preliminary}} [{{cite_key_1}}]
- {{claim_2}} — **Evidence:** {{established|emerging|preliminary}} [{{cite_key_2}}]
- {{claim_3}} — **Evidence:** {{established|emerging|preliminary}} [{{cite_key_3}}]

## In the interactive atlas
- Viewer route: `/brain`
- Suggested highlight ID: `{{region_id}}`
- Related regions: {{related_regions}}

## Citations
- [{{cite_key_1}}] {{citation_1_full}}
- [{{cite_key_2}}] {{citation_2_full}}
- [{{cite_key_3}}] {{citation_3_full}}

## Disclaimer
This page is for educational use. Brain functions are distributed across networks; regional descriptions are probabilistic and task-dependent, not diagnostic conclusions.
```

---

## Core references for atlas integrity
- Desikan RS et al. (2006). An automated labeling system for subdividing the human cerebral cortex on MRI scans. *NeuroImage*. DOI: https://doi.org/10.1016/j.neuroimage.2006.01.021
- Fischl B et al. (2004). Automatically parcellating the human cerebral cortex. *Cerebral Cortex*. DOI: https://doi.org/10.1093/cercor/bhh053
- FreeSurfer wiki/documentation: https://surfer.nmr.mgh.harvard.edu/
