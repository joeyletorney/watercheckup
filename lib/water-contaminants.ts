/**
 * EPA SDWIS / LCR contaminant catalog and helpers for /api/water.
 */

export type ContaminantRow = {
  name: string;
  level: number | null;
  limit: number | null;
  unit: string;
  severity: 'high' | 'moderate' | 'low';
  note: string;
  source: string;
  healthEffects?: string;
  healthSources?: string;
  epaAction?: string;
  ewgGuideline?: number | null;
  ewgGuidelineLabel?: string | null;
  ewgTimesOver?: number | null;
  violationBased?: boolean;
  isPFAS?: boolean;
};

export type EpaContaminantSpec = {
  name: string;
  codes: string[];
  limit: number;
  unit: string;
  /** When true, severity uses EPA secondary (aesthetic) thresholds */
  secondary?: boolean;
};

/** Regulated and commonly reported analytes — matched against LCR + SDWA sample rows */
export const EPA_CONTAMINANT_SPECS: EpaContaminantSpec[] = [
  { name: 'Lead', codes: ['PB90', '1040'], limit: 15, unit: 'ppb' },
  { name: 'Copper', codes: ['CU90', '1020'], limit: 1300, unit: 'ppb' },
  { name: 'Arsenic', codes: ['1005', '1015'], limit: 10, unit: 'ppb' },
  { name: 'Nitrate', codes: ['2456'], limit: 10, unit: 'ppm' },
  { name: 'Nitrite', codes: ['1074'], limit: 1, unit: 'ppm' },
  { name: 'Total Trihalomethanes (TTHMs)', codes: ['2950'], limit: 80, unit: 'ppb' },
  { name: 'Haloacetic Acids (HAA5)', codes: ['4000'], limit: 60, unit: 'ppb' },
  { name: 'Chloroform', codes: ['2941'], limit: 80, unit: 'ppb' },
  { name: 'Bromodichloromethane', codes: ['2943'], limit: 80, unit: 'ppb' },
  { name: 'Dibromochloromethane', codes: ['2944'], limit: 80, unit: 'ppb' },
  { name: 'Bromoform', codes: ['2942'], limit: 80, unit: 'ppb' },
  { name: 'Dichloroacetic Acid', codes: ['2451'], limit: 60, unit: 'ppb' },
  { name: 'Trichloroacetic Acid', codes: ['2452'], limit: 60, unit: 'ppb' },
  { name: 'Fluoride', codes: ['2050', '2003', '2030', '1025'], limit: 4, unit: 'ppm' },
  { name: 'Chromium', codes: ['1030', '1045'], limit: 100, unit: 'ppb' },
  { name: 'Chromium-6', codes: ['1080'], limit: 100, unit: 'ppb' },
  { name: 'Selenium', codes: ['1095'], limit: 50, unit: 'ppb' },
  { name: 'Barium', codes: ['2010', '1010'], limit: 2000, unit: 'ppb' },
  { name: 'Radium (combined)', codes: ['4100', '4110'], limit: 5, unit: 'pCi/L' },
  { name: 'Total Coliform', codes: ['4010'], limit: 0, unit: 'presence' },
  { name: 'Atrazine', codes: ['2039'], limit: 3, unit: 'ppb' },
  { name: 'Cadmium', codes: ['1038'], limit: 5, unit: 'ppb' },
  { name: 'Mercury', codes: ['1085'], limit: 2, unit: 'ppb' },
  { name: 'Antimony', codes: ['1000'], limit: 6, unit: 'ppb' },
  { name: 'Uranium', codes: ['1088'], limit: 30, unit: 'ppb' },
  { name: 'Chlorine', codes: ['5000', '0999'], limit: 4, unit: 'ppm' },
  { name: 'Chloramine', codes: ['5060'], limit: 4, unit: 'ppm' },
  { name: 'Chlorite', codes: ['1006'], limit: 1, unit: 'ppm' },
  { name: 'Bromate', codes: ['1009'], limit: 10, unit: 'ppb' },
  { name: 'Sodium', codes: ['1042'], limit: 20, unit: 'mg/L', secondary: true },
  { name: 'Chloride', codes: ['1041'], limit: 250, unit: 'mg/L', secondary: true },
  { name: 'Sulfate', codes: ['1044'], limit: 250, unit: 'mg/L', secondary: true },
  { name: 'Iron', codes: ['1036'], limit: 0.3, unit: 'ppm', secondary: true },
  { name: 'Manganese', codes: ['1032'], limit: 0.05, unit: 'ppm', secondary: true },
  { name: 'Total Dissolved Solids (TDS)', codes: ['70300', '2952'], limit: 500, unit: 'mg/L', secondary: true },
  { name: 'Turbidity', codes: ['0100', '0101'], limit: 1, unit: 'NTU' },
  { name: 'Zinc', codes: ['1090'], limit: 5, unit: 'ppm', secondary: true },
];

export const CONTAM_CODE_NAMES: Record<string, string> = {
  '1040': 'Lead',
  '1020': 'Copper',
  '1005': 'Arsenic',
  '1015': 'Arsenic',
  '2456': 'Nitrate',
  '1074': 'Nitrite',
  '2050': 'Fluoride',
  '2030': 'Fluoride',
  '2003': 'Fluoride',
  '1025': 'Fluoride',
  '4010': 'Total Coliform',
  '5000': 'Chlorine',
  '5060': 'Chloramine',
  PB90: 'Lead',
  CU90: 'Copper',
  '1030': 'Chromium',
  '1045': 'Chromium',
  '1080': 'Chromium-6',
  '2950': 'Total Trihalomethanes (TTHMs)',
  '4000': 'Haloacetic Acids (HAA5)',
  '2941': 'Chloroform',
  '2943': 'Bromodichloromethane',
  '2944': 'Dibromochloromethane',
  '2942': 'Bromoform',
  '2451': 'Dichloroacetic Acid',
  '2452': 'Trichloroacetic Acid',
  '2010': 'Barium',
  '1010': 'Barium',
  '2039': 'Atrazine',
  '4100': 'Radium (combined)',
  '4110': 'Radium (combined)',
  '1095': 'Selenium',
  '1085': 'Mercury',
  '1038': 'Cadmium',
  '1000': 'Antimony',
  '1088': 'Uranium',
  '1006': 'Chlorite',
  '1009': 'Bromate',
  '1042': 'Sodium',
  '1041': 'Chloride',
  '1044': 'Sulfate',
  '1036': 'Iron',
  '1032': 'Manganese',
  '70300': 'Total Dissolved Solids (TDS)',
  '2952': 'Total Dissolved Solids (TDS)',
  '0100': 'Turbidity',
  '0101': 'Turbidity',
  '1090': 'Zinc',
  '1007': 'Chlorate',
};

/** Extra health blurbs merged into route HEALTH_CONTEXT */
export const EXTRA_HEALTH_CONTEXT: Record<string, { effects: string; sources: string; epa_action: string }> = {
  Sodium: {
    effects: 'High sodium can affect taste and is a concern for people on low-sodium diets, especially those with hypertension or kidney disease.',
    sources: 'Road salt runoff, water softeners, natural deposits, and coastal saltwater intrusion.',
    epa_action: 'EPA advisory level for taste: 20 mg/L (not an enforceable MCL).',
  },
  Chloride: {
    effects: 'Elevated chloride affects taste and can corrode pipes. Not a primary health concern at typical municipal levels.',
    sources: 'Road salt, seawater intrusion, industrial discharge, and natural deposits.',
    epa_action: 'EPA secondary standard (aesthetic): 250 mg/L.',
  },
  Sulfate: {
    effects: 'High sulfate causes a bitter taste and may have a laxative effect at very high levels.',
    sources: 'Naturally occurring in gypsum-bearing rock, mining, and industrial discharge.',
    epa_action: 'EPA secondary standard (aesthetic): 250 mg/L.',
  },
  Iron: {
    effects: 'Not a health hazard at secondary levels but causes rusty stains, metallic taste, and can support bacterial growth in pipes.',
    sources: 'Naturally occurring in groundwater, corroding iron pipes, and industrial runoff.',
    epa_action: 'EPA secondary standard: 0.3 ppm.',
  },
  Manganese: {
    effects: 'Long-term exposure at high levels may affect the nervous system. Staining and taste issues at lower levels.',
    sources: 'Naturally occurring in rock and soil, especially in groundwater systems.',
    epa_action: 'EPA health advisory: 0.3 mg/L (lifetime). Secondary aesthetic: 0.05 ppm.',
  },
  'Total Dissolved Solids (TDS)': {
    effects: 'High TDS affects taste and may indicate elevated minerals or salts. Not a primary health standard.',
    sources: 'Dissolved minerals, salts, and organic matter from soil, pipes, and runoff.',
    epa_action: 'EPA secondary standard (aesthetic): 500 mg/L.',
  },
  Turbidity: {
    effects: 'Cloudiness can shield pathogens from disinfection. Utilities must meet treatment technique limits.',
    sources: 'Soil runoff, algae, treatment upsets, and distribution disturbances.',
    epa_action: 'EPA MCL: 1 NTU (4 NTU for combined filter effluent in some systems).',
  },
  'Dichloroacetic Acid': {
    effects: 'Disinfection byproduct linked to bladder cancer and possible reproductive effects.',
    sources: 'Formed when chlorine reacts with organic matter during treatment.',
    epa_action: 'Regulated as part of HAA5 (MCL: 60 ppb combined).',
  },
  'Trichloroacetic Acid': {
    effects: 'Disinfection byproduct linked to bladder cancer and developmental effects at high exposure.',
    sources: 'Formed when chlorine reacts with organic matter during treatment.',
    epa_action: 'Regulated as part of HAA5 (MCL: 60 ppb combined).',
  },
  Bromodichloromethane: {
    effects: 'THM component linked to cancer and reproductive harm with long-term exposure.',
    sources: 'Disinfection byproduct from chlorine treatment of surface water.',
    epa_action: 'Regulated as part of TTHMs (MCL: 80 ppb combined).',
  },
  Dibromochloromethane: {
    effects: 'THM component linked to cancer and harm to fetal development.',
    sources: 'Disinfection byproduct — higher in systems with bromide in source water.',
    epa_action: 'Regulated as part of TTHMs (MCL: 80 ppb combined).',
  },
  Bromoform: {
    effects: 'THM component with cancer risk at elevated long-term exposure.',
    sources: 'Disinfection byproduct from chlorine/bromide in source water.',
    epa_action: 'Regulated as part of TTHMs (MCL: 80 ppb combined).',
  },
  Chlorate: {
    effects: 'Can impair thyroid function — most concerning during pregnancy and childhood.',
    sources: 'Disinfection byproduct; also from bleach and perchlorate-related chemistry.',
    epa_action: 'No federal MCL. EPA UCMR health benchmark: 210 ppb.',
  },
  Cadmium: {
    effects: 'Kidney damage with long-term exposure. Associated with bone effects at high doses.',
    sources: 'Corrosion of galvanized pipes, industrial discharge, and natural deposits.',
    epa_action: 'EPA MCL: 5 ppb.',
  },
  Mercury: {
    effects: 'Damages the nervous system and kidneys. Particularly harmful to developing fetuses.',
    sources: 'Erosion of natural deposits, industrial discharge, and landfill runoff.',
    epa_action: 'EPA MCL: 2 ppb.',
  },
  Uranium: {
    effects: 'Radioactive — long-term exposure increases kidney toxicity and cancer risk.',
    sources: 'Naturally occurring in granite and sandstone aquifers, especially in the West and Midwest.',
    epa_action: 'EPA MCL: 30 ppb.',
  },
  Chlorine: {
    effects: 'Necessary for disinfection but reacts with organics to form byproducts. Taste and odor at higher levels.',
    sources: 'Added as disinfectant at the treatment plant.',
    epa_action: 'EPA MRDL: 4 ppm.',
  },
  Chlorite: {
    effects: 'Can cause anemia and nervous system effects in infants and young children at high levels.',
    sources: 'Byproduct of chlorine dioxide disinfection.',
    epa_action: 'EPA MCL: 1 ppm.',
  },
  Bromate: {
    effects: 'Probable human carcinogen. Kidney toxicity at high exposure.',
    sources: 'Formed when ozone is used to disinfect water containing bromide.',
    epa_action: 'EPA MCL: 10 ppb.',
  },
  Zinc: {
    effects: 'High levels can cause nausea and stomach cramps. Metallic taste at lower levels.',
    sources: 'Corrosion of galvanized pipes and industrial discharge.',
    epa_action: 'EPA secondary standard: 5 ppm.',
  },
};

export const EXTRA_EWG_GUIDELINES: Record<string, { limit: number; unit: string; label: string }> = {
  'Total Trihalomethanes (TTHMs)': { limit: 0.15, unit: 'ppb', label: 'EWG health guideline: 0.15 ppb' },
  Sodium: { limit: 20, unit: 'mg/L', label: 'EWG / EPA taste advisory: 20 mg/L' },
  Manganese: { limit: 0.1, unit: 'ppm', label: 'EWG health guideline: 100 ppb' },
  Barium: { limit: 700, unit: 'ppb', label: 'EWG health guideline: 700 ppb' },
  Bromodichloromethane: { limit: 0.06, unit: 'ppb', label: 'EWG health guideline: 0.06 ppb' },
  Dibromochloromethane: { limit: 0.1, unit: 'ppb', label: 'EWG health guideline: 0.1 ppb' },
  'Dichloroacetic Acid': { limit: 0.2, unit: 'ppb', label: 'EWG health guideline: 0.2 ppb' },
  'Trichloroacetic Acid': { limit: 0.4, unit: 'ppb', label: 'EWG health guideline: 0.4 ppb' },
};

const CATALOG_CODE_SET = new Set(
  EPA_CONTAMINANT_SPECS.flatMap(s => s.codes),
);

export function severityForLevel(
  val: number,
  limit: number,
  unit: string,
  secondary?: boolean,
): 'high' | 'moderate' | 'low' {
  if (unit === 'presence') return val > 0 ? 'high' : 'low';
  if (limit <= 0) return val > 0 ? 'moderate' : 'low';
  if (val > limit) return 'high';
  if (secondary) return val > limit * 0.75 ? 'moderate' : 'low';
  return val > limit * 0.5 ? 'moderate' : 'low';
}

export function buildEpaCatalogContaminants(
  allSamples: any[],
  f: (o: any, k: string) => any,
  maxSampleLevel: (hits: any[], displayUnit: string) => number,
  healthContext: Record<string, { effects: string; sources: string; epa_action: string }>,
  ewgGuidelines: Record<string, { limit: number; unit: string; label: string }>,
): ContaminantRow[] {
  const out: ContaminantRow[] = [];

  for (const spec of EPA_CONTAMINANT_SPECS) {
    const hits = allSamples.filter(s => spec.codes.includes(String(f(s, 'contaminant_code') || '')));
    if (!hits.length) continue;

    let val = maxSampleLevel(hits, spec.unit);
    if (spec.unit === 'presence') {
      val = val > 0 ? 1 : 0;
    }
    if (val <= 0 && spec.unit !== 'presence') continue;

    const ctx = healthContext[spec.name];
    const ewgG = ewgGuidelines[spec.name];
    const ewgTimesOver =
      ewgG && ewgG.limit > 0 && val > 0 ? +(val / ewgG.limit).toFixed(1) : null;

    out.push({
      name: spec.name,
      level: spec.unit === 'presence' ? val : +val.toFixed(spec.unit === 'ppb' ? 2 : 3),
      limit: spec.limit,
      unit: spec.unit,
      severity: severityForLevel(val, spec.limit, spec.unit, spec.secondary),
      note: `${hits.length} EPA sample(s) — limit ${spec.limit} ${spec.unit}`,
      source: 'EPA SDWIS',
      healthEffects: ctx?.effects,
      healthSources: ctx?.sources,
      epaAction: ctx?.epa_action,
      ewgGuideline: ewgG?.limit ?? null,
      ewgGuidelineLabel: ewgG?.label ?? null,
      ewgTimesOver,
    });
  }

  return out;
}

/** Add any measured analyte codes not covered by the fixed catalog */
export function buildDynamicSampleContaminants(
  allSamples: any[],
  existing: ContaminantRow[],
  f: (o: any, k: string) => any,
  maxSampleLevel: (hits: any[], displayUnit: string) => number,
  healthContext: Record<string, { effects: string; sources: string; epa_action: string }>,
): ContaminantRow[] {
  const existingNames = new Set(existing.map(c => c.name));
  const byCode = new Map<string, any[]>();

  for (const s of allSamples) {
    const code = String(f(s, 'contaminant_code') || '').trim();
    if (!code || CATALOG_CODE_SET.has(code)) continue;
    const list = byCode.get(code) || [];
    list.push(s);
    byCode.set(code, list);
  }

  const added: ContaminantRow[] = [];

  for (const [code, hits] of Array.from(byCode.entries())) {
    const name =
      CONTAM_CODE_NAMES[code] ||
      String(f(hits[0], 'contaminant_name') || '').trim() ||
      `Analyte ${code}`;
    if (!name || existingNames.has(name)) continue;

    const uom = String(f(hits[0], 'unit_of_measure') || '').toLowerCase();
    let unit = 'ppb';
    if (uom.includes('mg/l') || uom.includes('ppm')) unit = 'ppm';
    else if (uom.includes('ppt')) unit = 'ppt';
    else if (uom.includes('pci')) unit = 'pCi/L';
    else if (uom.includes('ntu')) unit = 'NTU';

    const val = maxSampleLevel(hits, unit === 'ppb' ? 'ppb' : unit);
    if (!Number.isFinite(val) || val <= 0) continue;

    const ctx = healthContext[name];
    added.push({
      name,
      level: +val.toFixed(2),
      limit: null,
      unit,
      severity: 'low',
      note: `${hits.length} EPA sample(s) — analyte code ${code}`,
      source: 'EPA SDWIS',
      healthEffects: ctx?.effects,
      healthSources: ctx?.sources,
      epaAction: ctx?.epa_action,
    });
    existingNames.add(name);
  }

  return added;
}

const SEVERITY_RANK: Record<string, number> = { high: 0, moderate: 1, low: 2 };

export function sortContaminants(list: ContaminantRow[]): ContaminantRow[] {
  return [...list].sort((a, b) => {
    const sa = SEVERITY_RANK[a.severity] ?? 3;
    const sb = SEVERITY_RANK[b.severity] ?? 3;
    if (sa !== sb) return sa - sb;
    const la = a.level ?? 0;
    const lb = b.level ?? 0;
    if (la !== lb) return lb - la;
    return a.name.localeCompare(b.name);
  });
}

export function countMeasuredContaminants(list: ContaminantRow[]): number {
  return list.filter(c => c.level != null && !c.violationBased).length;
}
