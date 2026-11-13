import { CITIES } from '@/app/water/[city]/cities-data';
import { decodePfasMonitoring } from '@/lib/pfas-monitoring';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimitShared, getClientIp, RATE } from '@/lib/rate-limit';
import { getCachedWaterResponse, setCachedWaterResponse } from '@/lib/water-lookup-cache';
import ucmr5Raw from '@/lib/ucmr5.json';
import zipLookupRaw from '@/lib/zip-lookup.json';
import lcrDataRaw from '@/lib/lcr-data.json';
import { getDataFreshness } from '@/lib/water-data-meta';
import {
  computeZipWaterScore,
  nationalPercentileFromSafetyScore,
} from '@/lib/zip-water-score';
import { mergePwsidCcrContaminants } from '@/lib/pwsid-ccr-contaminants';
import {
  buildDynamicSampleContaminants,
  buildEpaCatalogContaminants,
  CONTAM_CODE_NAMES,
  countMeasuredContaminants,
  EXTRA_EWG_GUIDELINES,
  EXTRA_HEALTH_CONTEXT,
  sortContaminants,
  type ContaminantRow,
} from '@/lib/water-contaminants';

// ucmr5 format: pwsid -> [maxPfasPpt, overMCLcount, [[analyte, ppt, hasMCL, overMCL], ...], lithium?]
const ucmr5 = ucmr5Raw as Record<string, any[]>;

const ZIP_LOOKUP = zipLookupRaw as Record<string, { p: string; n: string; c: string; s: string; pop: number; src: string }>;

const LCR_DATA = lcrDataRaw as Record<string, { lead?: number; copper?: number }>;

const EPA = 'https://data.epa.gov/efservice';
const EPA_TIMEOUT_MS = 4_000;
const EPA_CIRCUIT_FAIL_THRESHOLD = 3;
const EPA_CIRCUIT_COOLDOWN_MS = 60_000;

type EpaCircuit = { fails: number; openUntil: number };
const gEpa = globalThis as unknown as { __wcEpaCircuit?: EpaCircuit };
function epaCircuit(): EpaCircuit {
  if (!gEpa.__wcEpaCircuit) gEpa.__wcEpaCircuit = { fails: 0, openUntil: 0 };
  return gEpa.__wcEpaCircuit;
}
function isEpaCircuitOpen(): boolean {
  return Date.now() < epaCircuit().openUntil;
}
function noteEpaSuccess() {
  const c = epaCircuit();
  c.fails = 0;
  c.openUntil = 0;
}
function noteEpaFailure() {
  const c = epaCircuit();
  c.fails += 1;
  if (c.fails >= EPA_CIRCUIT_FAIL_THRESHOLD) {
    c.openUntil = Date.now() + EPA_CIRCUIT_COOLDOWN_MS;
    c.fails = 0;
  }
}

async function epaGet(path: string, refresh = false) {
  if (isEpaCircuitOpen()) throw new Error('EPA circuit open');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), EPA_TIMEOUT_MS);
  try {
    const res = await fetch(`${EPA}/${path}`, {
      headers: { Accept: 'application/json' },
      ...(refresh ? { cache: 'no-store' as const } : { next: { revalidate: 3600 } }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      noteEpaFailure();
      throw new Error(`EPA ${res.status}`);
    }
    const text = await res.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('Unexpected EPA response');
    noteEpaSuccess();
    return data;
  } catch (err) {
    if (!(err instanceof Error && /^EPA \d/.test(err.message))) noteEpaFailure();
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** null = EPA error/outage (stop cascading); array = response (possibly empty) */
async function epaGetList(path: string): Promise<any[] | null> {
  try {
    const data = await epaGet(path);
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

function systemsFromZipLookup(zip: string): any[] {
  const local = ZIP_LOOKUP[zip];
  if (!local?.p) return [];
  const st = local.p.slice(0, 2);
  return [{
    pwsid: local.p,
    pws_name: local.n,
    city_name: Object.values(CITIES).find(city => city.zip === zip)?.name || '',
    state_code: st,
    population_served_count: local.pop,
    primary_source_code: local.src === 'SW' ? 'SW' : 'GW',
  }];
}

function f(o: any, k: string): any {
  return o[k] ?? o[k.toLowerCase()] ?? o[k.toUpperCase()] ?? null;
}

// ─── PFAS MCLs (EPA 2024 final rule) ─────────────────────────────────────────
const PFAS_MCL_PPT: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10,
  'HFPO-DA': 10,
};

// ─── PFAS human-readable names ────────────────────────────────────────────────
const PFAS_NAMES: Record<string, string> = {
  PFOA: 'PFOA (Perfluorooctanoic acid)',
  PFOS: 'PFOS (Perfluorooctane sulfonic acid)',
  PFNA: 'PFNA (Perfluorononanoic acid)',
  PFHxS: 'PFHxS (Perfluorohexane sulfonic acid)',
  'HFPO-DA': 'GenX / HFPO-DA',
  '9Cl-PF3ONS': '9Cl-PF3ONS',
  PFBA: 'PFBA (Perfluorobutanoic acid)',
  PFBS: 'PFBS (Perfluorobutane sulfonic acid)',
  PFDA: 'PFDA (Perfluorodecanoic acid)',
  PFDoA: 'PFDoA (Perfluorododecanoic acid)',
  PFHpA: 'PFHpA (Perfluoroheptanoic acid)',
  PFHpS: 'PFHpS (Perfluoroheptane sulfonic acid)',
  PFHxA: 'PFHxA (Perfluorohexanoic acid)',
  PFMBA: 'PFMBA',
  PFMPA: 'PFMPA',
  PFPeA: 'PFPeA (Perfluoropentanoic acid)',
  PFPeS: 'PFPeS',
  PFUnA: 'PFUnA (Perfluoroundecanoic acid)',
  NEtFOSAA: 'N-Et-FOSAA',
  NMeFOSAA: 'N-Me-FOSAA',
  NFDHA: 'NFDHA',
  ADONA: 'ADONA',
  '4:2 FTS': '4:2 Fluorotelomer sulfonic acid',
  '6:2 FTS': '6:2 Fluorotelomer sulfonic acid',
  '8:2 FTS': '8:2 Fluorotelomer sulfonic acid',
  lithium: 'Lithium',
};

// ─── EWG Health Guidelines (stricter than EPA legal limits) ──────────────────
// Sources: EWG Tap Water Database 2025 methodology, California PHGs, WHO guidelines
const EWG_GUIDELINES: Record<string, { limit: number; unit: string; label: string }> = {
  // Disinfection byproducts
  'Total Trihalomethanes': { limit: 0.15,  unit: 'ppb',    label: 'EWG health guideline: 0.15 ppb' },
  'Trihalomethanes':       { limit: 0.15,  unit: 'ppb',    label: 'EWG health guideline: 0.15 ppb' },
  'Chloroform':            { limit: 0.4,   unit: 'ppb',    label: 'EWG health guideline: 0.4 ppb' },
  'Bromodichloromethane':  { limit: 0.06,  unit: 'ppb',    label: 'EWG health guideline: 0.06 ppb' },
  'Dibromochloromethane':  { limit: 0.1,   unit: 'ppb',    label: 'EWG health guideline: 0.1 ppb' },
  'Bromoform':             { limit: 0.05,  unit: 'ppb',    label: 'EWG health guideline: 0.05 ppb' },
  'Haloacetic Acids':      { limit: 0.1,   unit: 'ppb',    label: 'EWG health guideline: 0.1 ppb' },
  'Haloacetic Acids (HAA5)': { limit: 0.1, unit: 'ppb',    label: 'EWG health guideline: 0.1 ppb' },
  'Haloacetic Acids (HAA9)': { limit: 0.06,unit: 'ppb',    label: 'EWG health guideline: 0.06 ppb' },
  'Dichloroacetic Acid':   { limit: 0.2,   unit: 'ppb',    label: 'EWG health guideline: 0.2 ppb' },
  'Trichloroacetic Acid':  { limit: 0.4,   unit: 'ppb',    label: 'EWG health guideline: 0.4 ppb' },
  // Metals & inorganics
  'Arsenic':               { limit: 0.004, unit: 'ppb',    label: 'EWG health guideline: 0.004 ppb' },
  'Lead':                  { limit: 0.0001,unit: 'ppb',    label: 'No safe level (EWG)' },
  'Chromium-6':            { limit: 0.02,  unit: 'ppb',    label: 'California PHG: 0.02 ppb' },
  'Hexavalent Chromium':   { limit: 0.02,  unit: 'ppb',    label: 'California PHG: 0.02 ppb' },
  'Nitrate':               { limit: 5,     unit: 'mg/L',   label: 'EWG health guideline: 5 mg/L' },
  'Nitrite':               { limit: 0.6,   unit: 'mg/L',   label: 'EWG health guideline: 0.6 mg/L' },
  'Radium':                { limit: 0.05,  unit: 'pCi/L',  label: 'EWG health guideline: 0.05 pCi/L' },
  'Uranium':               { limit: 0.43,  unit: 'ppb',    label: 'EWG health guideline: 0.43 ppb' },
  // Pesticides
  'Atrazine':              { limit: 0.1,   unit: 'ppb',    label: 'EWG health guideline: 0.1 ppb' },
  // PFAS
  'PFOA':                  { limit: 0.001, unit: 'ppt',    label: 'EWG health guideline: 0.001 ppt' },
  'PFOS':                  { limit: 0.001, unit: 'ppt',    label: 'EWG health guideline: 0.001 ppt' },
  ...EXTRA_EWG_GUIDELINES,
};

// ─── Health context per contaminant ──────────────────────────────────────────
const HEALTH_CONTEXT: Record<string, { effects: string; sources: string; epa_action: string }> = {
  Lead: {
    effects: 'No safe level. Causes irreversible brain damage and developmental delays in children. Affects kidneys and cardiovascular system in adults.',
    sources: 'Corroding lead service lines and indoor plumbing, especially in homes built before 1986.',
    epa_action: 'EPA Action Level: 15 ppb. EPA proposed lowering to 10 ppb in 2024.',
  },
  PFOA: {
    effects: 'Linked to kidney and testicular cancer, thyroid disease, immune suppression, high cholesterol, and preeclampsia. Does not break down in the body or environment.',
    sources: 'Firefighting foam (AFFF), Teflon/non-stick cookware manufacturing, food packaging, industrial discharges.',
    epa_action: 'EPA MCL: 4 ppt (2024). Zero is the health goal.',
  },
  PFOS: {
    effects: 'Classified as a possible human carcinogen. Associated with thyroid disruption, liver damage, reproductive harm, and immune system suppression.',
    sources: 'Military firefighting foam, stain-resistant coatings (Scotchgard), industrial manufacturing.',
    epa_action: 'EPA MCL: 4 ppt (2024). Zero is the health goal.',
  },
  PFNA: {
    effects: 'Associated with elevated cholesterol, thyroid hormone disruption, and developmental effects in fetuses and infants.',
    sources: 'Fluoropolymer manufacturing, stain-resistant products, food packaging.',
    epa_action: 'EPA MCL: 10 ppt as part of PFAS mixture rule (2024).',
  },
  PFHxS: {
    effects: 'Similar health profile to PFOS. Thyroid disruption, liver effects, immune impacts. Replaces PFOS in many applications.',
    sources: 'Firefighting foam, food packaging, waterproof textiles.',
    epa_action: 'EPA MCL: 10 ppt as part of PFAS mixture rule (2024).',
  },
  'HFPO-DA': {
    effects: 'GenX replacement for PFOA. Animal studies link it to liver toxicity, kidney damage, cancer, and immune effects. Human data still emerging.',
    sources: 'DuPont/Chemours Fayetteville Works plant. Used as a PFOA replacement in Teflon production.',
    epa_action: 'EPA MCL: 10 ppt (2024).',
  },
  'Chromium-6': {
    effects: 'Known human carcinogen when ingested. Linked to stomach and intestinal cancer. California determined 0.02 ppb causes 1-in-1-million cancer risk.',
    sources: 'Industrial discharge (chrome plating, leather tanning), naturally occurring in some aquifers, coal ash disposal.',
    epa_action: 'No federal MCL. CA: 0.01 ppb goal. EWG: 0.02 ppb health guideline.',
  },
  Copper: {
    effects: 'Short-term high exposure causes nausea, vomiting, liver and kidney damage. Long-term exposure linked to Wilson\'s disease in genetically susceptible individuals.',
    sources: 'Corroding copper pipes and fittings. Rare in source water.',
    epa_action: 'EPA Action Level: 1,300 ppb.',
  },
  Chloroform: {
    effects: 'Probable human carcinogen (bladder cancer risk). Formed when chlorine disinfectants react with natural organic matter. Part of Total Trihalomethanes (TTHMs).',
    sources: 'Disinfection byproduct — formed during water treatment. Higher in systems using surface water with high organic content.',
    epa_action: 'Regulated as part of TTHMs (MCL: 80 ppb total).',
  },
  'Haloacetic Acids': {
    effects: 'Group of disinfection byproducts. Linked to bladder cancer and possible reproductive effects. HAA5 includes chloroacetic, dichloroacetic, and trichloroacetic acids.',
    sources: 'Disinfection byproduct from chlorine treatment reacting with organic matter in source water.',
    epa_action: 'EPA MCL: 60 ppb for HAA5.',
  },
  Radium: {
    effects: 'Radioactive. Long-term exposure increases bone cancer risk. Deposited in bones where it irradiates bone marrow.',
    sources: 'Naturally occurring in certain rock formations. Common in Florida, Texas, and Midwest groundwater.',
    epa_action: 'EPA MCL: 5 pCi/L (combined Ra-226 and Ra-228).',
  },
  Fluoride: {
    effects: 'At levels above 4 ppm: dental and skeletal fluorosis (bone weakening). At recommended levels (0.7 ppm), prevents tooth decay.',
    sources: 'Added intentionally by public water systems for dental health. Also naturally occurring in some aquifers.',
    epa_action: 'EPA secondary standard: 2 ppm (aesthetic). MCLG: 4 ppm.',
  },
  Lithium: {
    effects: 'Emerging concern. Very high levels associated with thyroid and kidney effects. Some research links naturally occurring lithium in water to lower suicide rates. Health effects at drinking water concentrations still under study.',
    sources: 'Naturally occurring in some aquifers, especially in arid western US. Mining and battery manufacturing waste.',
    epa_action: 'No current EPA MCL. EPA UCMR5 median health goal: 10 μg/L.',
  },
  'PFAS (Total)': {
    effects: 'Forever chemicals that accumulate in the body and environment. Collectively linked to cancer, thyroid disease, immune suppression, reproductive harm, and elevated cholesterol.',
    sources: 'Firefighting foam, non-stick cookware, stain-resistant fabrics, food packaging, industrial sites.',
    epa_action: 'EPA set enforceable limits for PFOA and PFOS at 4 ppt in 2024 — the lowest measurable level.',
  },
  Chloramine: {
    effects: 'Alternative disinfectant to chlorine. Produces different byproducts (HANs, NDMA). Can affect people with kidney failure on dialysis. Taste and odor issues common.',
    sources: 'Added as disinfectant to reduce TTHMs. Used in many large urban systems.',
    epa_action: 'EPA MRDLG: 4 ppm.',
  },
  'Total Trihalomethanes (TTHMs)': {
    effects: 'Long-term exposure linked to bladder cancer and possible reproductive harm. Formed as a byproduct of chlorine disinfection reacting with natural organic matter.',
    sources: 'Disinfection byproduct — created during water treatment. Higher in systems using surface water with high organic content.',
    epa_action: 'EPA MCL: 80 ppb. EWG health guideline: 0.15 ppb — more than 500x stricter.',
  },
  'Haloacetic Acids (HAA5)': {
    effects: 'Group of five disinfection byproducts linked to bladder cancer and possible reproductive effects including miscarriage.',
    sources: 'Byproduct of chlorine treatment reacting with organic matter in source water. Higher in summer months.',
    epa_action: 'EPA MCL: 60 ppb for HAA5. EWG health guideline: 0.1 ppb.',
  },
  'Arsenic': {
    effects: 'Long-term exposure causes bladder, lung, and skin cancer. Affects heart, nerves, and skin even at lower levels. No truly safe level for cancer risk.',
    sources: 'Naturally occurring in rock and soil. Also from industrial waste, agricultural pesticides, and mining runoff.',
    epa_action: 'EPA MCL: 10 ppb. EWG health goal: 0.004 ppb — 2,500x stricter than federal law.',
  },
  'Nitrate': {
    effects: '"Blue baby syndrome" in infants under 6 months. Emerging links to colorectal cancer and thyroid disruption in adults.',
    sources: 'Agricultural fertilizer runoff, animal waste, septic systems. Major issue in farming states.',
    epa_action: 'EPA MCL: 10 ppm. Do not use tap water for infant formula if nitrate is elevated.',
  },
  'Nitrite': {
    effects: 'Same mechanism as nitrate — reduces oxygen delivery in blood. More potent than nitrate, especially dangerous for infants.',
    sources: 'Sewage discharge, fertilizer runoff, naturally occurring in some groundwater.',
    epa_action: 'EPA MCL: 1 ppm.',
  },
  'Chromium': {
    effects: 'Hexavalent chromium (Cr-6) is a known human carcinogen linked to stomach and intestinal cancer. Made infamous by the Erin Brockovich case.',
    sources: 'Industrial discharge from chrome plating, coal ash disposal, naturally occurring in some aquifers.',
    epa_action: 'EPA MCL: 100 ppb for total chromium. No federal limit for Cr-6. California health goal: 0.02 ppb.',
  },
  'Radium (combined)': {
    effects: 'Radioactive element that deposits in bones and irradiates bone marrow, increasing bone cancer risk with long-term exposure.',
    sources: 'Naturally occurring in certain rock formations. Common in Florida, Texas, and parts of the Midwest.',
    epa_action: 'EPA MCL: 5 pCi/L combined Ra-226 and Ra-228.',
  },
  'Selenium': {
    effects: 'At high levels causes hair loss, nail brittleness, fatigue, and nerve damage.',
    sources: 'Natural deposits, mining, coal combustion byproducts, agricultural drainage.',
    epa_action: 'EPA MCL: 50 ppb.',
  },
  'Barium': {
    effects: 'Increases blood pressure with long-term exposure. Cardiovascular and gastrointestinal effects at high doses.',
    sources: 'Natural deposits in sedimentary rock, mining and drilling operations.',
    epa_action: 'EPA MCL: 2 ppm.',
  },
  'Total Coliform': {
    effects: 'Indicator of potential fecal contamination and possible presence of pathogens like E. coli and Cryptosporidium.',
    sources: 'Surface water intrusion, aging infrastructure, cross-contamination from sewage lines.',
    epa_action: 'EPA standard: zero tolerance for E. coli. Coliform presence triggers mandatory investigation.',
  },
  'Atrazine': {
    effects: 'Endocrine disruptor linked to hormone disruption, low sperm count, birth defects, and potential cancer risk.',
    sources: 'Most widely used herbicide in the US — applied to corn crops. Highest in spring runoff.',
    epa_action: 'EPA MCL: 3 ppb. EWG health guideline: 0.1 ppb.',
  },
  ...EXTRA_HEALTH_CONTEXT,
};

/** Official Philadelphia supplier; postal anchor ZIP is absent from the packaged ZIP registry. */
const VERIFIED_POSTAL_FALLBACKS: Record<string, { pwsid: string; city: string; utility: string }> = {
  '19101': { pwsid: 'PA1510001', city: 'Philadelphia, PA', utility: 'Philadelphia Water Department' },
};

// ─── VIOL / contaminant label maps ───────────────────────────────────────────
const VIOL_LABELS: Record<string, string> = {
  MCL: 'Max Contaminant Level Exceeded', MRDL: 'Max Residual Disinfectant Level',
  TT: 'Treatment Technique', MR: 'Monitoring & Reporting',
  RPT: 'Reporting Requirement', PN: 'Public Notification',
};
const STATUS_META: Record<string, { label: string; color: string }> = {
  O: { label: 'Open', color: '#ef4444' },
  R: { label: 'Resolved', color: '#22d3ee' },
  A: { label: 'Addressed', color: '#f59e0b' },
};
const CONTAM_NAMES: Record<string, string> = {
  ...CONTAM_CODE_NAMES,
  '4100': 'Radium (combined)',
};

// ─── Build UCMR5 contaminants from compact format ────────────────────────────
function getPfasForPwsid(pwsid: string): any[] {
  const row = ucmr5[pwsid];
  if (!row || !Array.isArray(row[2])) return [];
  const analytes = decodePfasMonitoring(row)?.compounds ?? []; // [[analyte, ppt, hasMCL, overMCL], ...]

  return analytes
    .filter(a => a[1] > 0)
    .map(a => {
      const [analyte, ppt, hasMCL, overMCL] = a;
      const mclPpt = PFAS_MCL_PPT[analyte] ?? null;
      const severity = overMCL ? 'high' : hasMCL && ppt > (mclPpt ?? Infinity) * 0.5 ? 'moderate' : 'low';
      const ctx = HEALTH_CONTEXT[analyte] || HEALTH_CONTEXT['PFAS (Total)'];
      return {
        name: PFAS_NAMES[analyte] || analyte,
        analyteName: analyte,
        level: ppt,
        limit: mclPpt,
        unit: 'ppt',
        severity,
        note: overMCL
          ? `Historical peak above ${mclPpt} ppt benchmark — not a compliance determination`
          : hasMCL
            ? `Historical peak at or below ${mclPpt} ppt benchmark — EPA UCMR5`
            : 'No individual MCL — EPA UCMR5 2023-2025',
        source: 'EPA UCMR5',
        isPFAS: true,
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
      };
    })
    .sort((a, b) => {
      if (a.severity === 'high' && b.severity !== 'high') return -1;
      if (b.severity === 'high' && a.severity !== 'high') return 1;
      return b.level - a.level;
    });
}

// ─── Try USGS NWIS for source water context ───────────────────────────────────
async function getUsgsSourceWater(state: string, lat?: number, lng?: number): Promise<any> {
  try {
    // USGS NWIS current conditions — surface water quality sites
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=${state.toLowerCase()}&parameterCd=00010,00095,00300&siteType=ST&period=P1D&siteStatus=active`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), EPA_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, { next: { revalidate: 86400 }, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) return null;
    const data = await res.json();
    const sites = data?.value?.timeSeries?.slice(0, 3) || [];
    if (!sites.length) return null;
    return {
      source: 'USGS NWIS',
      sites: sites.map((s: any) => ({
        name: s.sourceInfo?.siteName || 'Unnamed site',
        param: s.variable?.variableDescription || '',
        value: s.values?.[0]?.value?.[0]?.value || null,
        unit: s.variable?.unit?.unitCode || '',
      })).filter((s: any) => s.value !== null && s.value !== '-999999' && s.value !== -999999).slice(0, 3),
    };
  } catch {
    return null;
  }
}

// ─── EPA ECHO Enforcement & Compliance ───────────────────────────────────────
async function getEchoEnforcement(pwsid: string): Promise<any> {
  try {
    if (isEpaCircuitOpen()) return null;
    // ECHO SDWA enforcement actions for this facility
    const url = `https://echodata.epa.gov/echo/sdw_rest_services.get_facility_info?output=JSON&p_pwsid=${encodeURIComponent(pwsid)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), EPA_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, { next: { revalidate: 3600 }, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) {
      noteEpaFailure();
      return null;
    }
    const data = await res.json();

    const fac = data?.Results?.Facilities?.[0];
    if (!fac) return null;

    // Pull key enforcement fields
    const formalActions  = parseInt(fac.FORMAL_ACTION_COUNT  || '0') || 0;
    const informalActions= parseInt(fac.INFORMAL_ACTION_COUNT|| '0') || 0;
    const penalties      = parseFloat(fac.TOTAL_PENALTY_AMT  || '0') || 0;
    const lastInspection = fac.LAST_INSPECTION_DATE || null;
    const inspections    = parseInt(fac.INSPECTION_COUNT     || '0') || 0;
    const compStatus     = fac.SDWA_COMPLIANCE_STATUS || null;

    if (!formalActions && !informalActions && !penalties && !inspections) return null;

    return {
      formalActions,
      informalActions,
      totalPenalties: penalties,
      penaltiesFormatted: penalties > 0 ? `$${penalties.toLocaleString()}` : null,
      lastInspection,
      inspections,
      complianceStatus: compStatus,
      echoUrl: `https://echo.epa.gov/sdwa/facility-info?p_pwsid=${encodeURIComponent(pwsid)}`,
    };
  } catch {
    return null;
  }
}

async function getUsgsHardnessTDS(stateCode: string): Promise<any[]> {
  try {
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=${stateCode.toLowerCase()}&parameterCd=00900,70300&siteType=ST&period=P7D&siteStatus=active`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), EPA_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, { next: { revalidate: 86400 }, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) return [];
    const data = await res.json();
    const series = data?.value?.timeSeries || [];
    const results: any[] = [];
    for (const s of series.slice(0, 6)) {
      const paramCode = s.variable?.variableCode?.[0]?.value;
      const val = parseFloat(s.values?.[0]?.value?.[0]?.value);
      if (!val || val < 0) continue;
      if (paramCode === '00900') {
        results.push({
          name: 'Hardness',
          level: +val.toFixed(1),
          limit: 300,
          unit: 'mg/L',
          severity: val > 300 ? 'moderate' : val > 150 ? 'low' : 'low',
          note: `USGS NWIS regional surface water sample — ${val > 300 ? 'Very Hard' : val > 150 ? 'Hard' : val > 75 ? 'Moderately Hard' : 'Soft'}`,
          source: 'USGS NWIS',
          healthEffects: 'Hard water is not a health hazard. However it causes scale buildup in pipes and appliances, reduces soap lathering, and can dry out skin and hair. Softening recommended above 150 mg/L.',
          healthSources: 'Dissolved calcium and magnesium from limestone and dolomite aquifers and rock formations in your region.',
          epaAction: 'No EPA MCL for hardness. USGS classifies: <75 mg/L soft, 75–150 moderately hard, 150–300 hard, >300 very hard.',
        });
      } else if (paramCode === '70300') {
        results.push({
          name: 'Total Dissolved Solids (TDS)',
          level: +val.toFixed(0),
          limit: 500,
          unit: 'mg/L',
          severity: val > 500 ? 'moderate' : 'low',
          note: `USGS NWIS regional surface water sample — EPA secondary standard 500 mg/L`,
          source: 'USGS NWIS',
          healthEffects: 'High TDS affects taste and can indicate elevated mineral or salt content. Not a primary health concern but may indicate presence of other dissolved contaminants.',
          healthSources: 'Dissolved minerals, salts, metals and organic matter from soil, pipes, and industrial runoff.',
          epaAction: 'EPA secondary standard (aesthetic): 500 mg/L. Not enforceable but affects taste.',
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

function logWaterLookup(payload: Record<string, unknown>) {
  try {
    console.log(
      JSON.stringify({
        wc_event: 'water_lookup',
        ts: new Date().toISOString(),
        ...payload,
      })
    );
  } catch {
    /* ignore logging failures */
  }
}

export async function GET(req: NextRequest) {
  const H = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };
  const zip = req.nextUrl.searchParams.get('zip');
  if (!zip || !/^\d{5}$/.test(zip)) {
    logWaterLookup({ zip: zip || '', outcome: 'invalid_zip' });
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400, headers: H });
  }

  const ip = getClientIp(req);
  const ipLim = await checkRateLimitShared(`water:ip:${ip}`, RATE.waterLookupPerIp.max, RATE.waterLookupPerIp.windowMs);
  if (!ipLim.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { ...H, 'Retry-After': String(ipLim.retryAfterSec) } },
    );
  }
  const zipLim = await checkRateLimitShared(`water:zip:${zip}`, RATE.waterLookupPerZip.max, RATE.waterLookupPerZip.windowMs);
  if (!zipLim.ok) {
    return NextResponse.json(
      { error: 'Too many lookups for this ZIP. Please try again shortly.' },
      { status: 429, headers: { ...H, 'Retry-After': String(zipLim.retryAfterSec) } },
    );
  }

  return lookupWaterReport(zip, req.nextUrl.searchParams.get('refresh') === '1');
}

/** Shared by the public API and server-rendered ZIP pages; avoids self-HTTP and caches only successful reports. */
export async function lookupWaterReport(zip: string, refresh = false) {
  const H = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (!/^\d{5}$/.test(zip)) return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400, headers: H });
  const t0 = Date.now();
  const okHeaders = { ...H, 'Cache-Control': refresh ? 'no-store' : 'public, s-maxage=3600, stale-while-revalidate=7200' };

  const cached = refresh ? null : await getCachedWaterResponse(zip);
  if (cached) {
    logWaterLookup({ zip, outcome: 'cache_hit', ms: Date.now() - t0 });
    return NextResponse.json(cached.body, { status: cached.status, headers: okHeaders });
  }

  try {
    let pwsid: string;
    let pwsName: string;
    let cityName: string;
    let stateCode: string = '';
    let popCount: string | null = null;
    let srcCode = '';

    const storedSupplier = ZIP_LOOKUP[zip];
    const override = storedSupplier ? undefined : VERIFIED_POSTAL_FALLBACKS[zip];
    if (override) {
      // Local-first: hardcoded major-city map, optional single EPA enrich
      pwsid     = override.pwsid;
      pwsName   = override.utility;
      cityName  = override.city.split(',')[0].trim();
      stateCode = override.city.includes(',') ? override.city.split(',')[1].trim().split(' ')[0] : '';
      if (!isEpaCircuitOpen()) {
        try {
          const rows: any[] = await epaGet(`WATER_SYSTEM/PWSID/${override.pwsid}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`);
          if (rows?.length) {
            pwsName  = f(rows[0], 'pws_name') || pwsName;
            srcCode  = f(rows[0], 'primary_source_code') || '';
            popCount = f(rows[0], 'population_served_count');
            stateCode = f(rows[0], 'state_code') || stateCode;
          }
        } catch { /* keep hardcoded */ }
      }
    } else {
      // Local-first: ~21k ZIP map before any live EPA ZIP search cascade
      let systems: any[] = systemsFromZipLookup(zip);
      let epaDown = isEpaCircuitOpen();

      if (systems.length && !epaDown) {
        // One enrich call for name/pop/source — not a multi-endpoint cascade
        const rows = await epaGetList(
          `WATER_SYSTEM/PWSID/${systems[0].pwsid}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`
        );
        if (rows === null) {
          epaDown = true;
        } else if (rows.length) {
          systems = rows;
        }
      }

      if (!systems.length && !epaDown) {
        const first = await epaGetList(
          `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/PWS_TYPE_CODE/CWS/rows/1:10/JSON`
        );
        if (first === null) {
          epaDown = true;
        } else {
          systems = first;
        }
      }
      if (!systems.length && !epaDown) {
        const next = await epaGetList(
          `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
        );
        if (next === null) {
          epaDown = true;
        } else {
          systems = next;
        }
      }
      if (!systems.length && !epaDown) {
        const next = await epaGetList(
          `WATER_SYSTEM/ZIP_CODE/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
        );
        if (next === null) {
          epaDown = true;
        } else {
          systems = next;
        }
      }
      // Geographic cascade only when EPA is healthy and local map missed
      if (!systems.length && !epaDown && !isEpaCircuitOpen()) {
        const geoRows = await epaGetList(
          `GEOGRAPHIC_AREA/ZIP_CODE_SERVED/${zip}/rows/1:10/JSON`
        );
        if (geoRows === null) {
          epaDown = true;
        } else if (geoRows.length) {
          const pwsids = Array.from(new Set(geoRows.map((r: any) => f(r, 'pwsid')).filter(Boolean))).slice(0, 3);
          for (const p of pwsids) {
            if (isEpaCircuitOpen()) break;
            const rows = await epaGetList(
              `WATER_SYSTEM/PWSID/${p}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`
            );
            if (rows === null) {
              epaDown = true;
              break;
            }
            if (rows.length) {
              systems = rows;
              break;
            }
          }
        }
      }
      if (!Array.isArray(systems) || !systems.length) {
        logWaterLookup({ zip, outcome: 'no_system', ms: Date.now() - t0 });
        return NextResponse.json(
          {
            error: `No public water system found for ZIP ${zip}. This may be a private well area or very small community.`,
            zip,
            hintWell: true,
            dataFreshness: getDataFreshness(),
          },
          { status: 404, headers: H }
        );
      }
      const sys = [...systems].sort((a, b) =>
        (parseInt(f(b, 'population_served_count')) || 0) -
        (parseInt(f(a, 'population_served_count')) || 0)
      )[0];
      pwsid     = f(sys, 'pwsid') || f(sys, 'PWSID');
      pwsName   = f(sys, 'pws_name') || f(sys, 'PWS_NAME') || 'Unknown Water System';
      cityName  = f(sys, 'city_name') || f(sys, 'CITY_NAME') || '';
      stateCode = f(sys, 'state_code') || f(sys, 'STATE_CODE') || f(sys, 'primacy_agency_code') || '';
      popCount  = f(sys, 'population_served_count') || f(sys, 'POPULATION_SERVED_COUNT');
      srcCode   = f(sys, 'primary_source_code') || f(sys, 'PRIMARY_SOURCE_CODE') || '';
    }

    // ─── Parallel data fetch ────────────────────────────────────────────────
    const skipLiveEpa = isEpaCircuitOpen();
    const [violations, lcr, sdwaSamples, usgsData, echoData, usgsHardness] = await Promise.all([
      skipLiveEpa ? Promise.resolve(null) : epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`, refresh).catch(() => null),
      skipLiveEpa ? Promise.resolve([]) : epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:250/JSON`, refresh).catch(() => []),
      skipLiveEpa ? Promise.resolve([]) : epaGet(`SDWA_SAMPLES/PWSID/${pwsid}/rows/1:250/JSON`, refresh).catch(() => []),
      stateCode && !skipLiveEpa ? getUsgsSourceWater(stateCode) : Promise.resolve(null),
      skipLiveEpa ? Promise.resolve(null) : getEchoEnforcement(pwsid),
      stateCode && !skipLiveEpa ? getUsgsHardnessTDS(stateCode) : Promise.resolve([]),
    ]);
    const violationCoverage = Array.isArray(violations) ? 'available' : 'unavailable';
    const viols: any[] = Array.isArray(violations) ? violations : [];
    const allSamples = [...(Array.isArray(lcr) ? lcr : []), ...(Array.isArray(sdwaSamples) ? sdwaSamples : [])];

    /** Winning sample by max raw measure; ppb display converts mg/L → ppb when UOM says mg/L */
    const maxSampleLevel = (hits: any[], displayUnit: string): number => {
      if (!hits.length) return 0;
      return Math.max(...hits.map(sample => {
        const value = Number(f(sample, 'sample_measure'));
        if (!Number.isFinite(value) || value < 0) return 0;
        const unit = String(f(sample, 'unit_of_measure') || '').toLowerCase();
        return displayUnit === 'ppb' && unit.includes('mg/l') ? value * 1000 : value;
      }));
    };

    const openV = viols.filter(v => (f(v, 'violation_status_code') || '') === 'O');
    const healthV = viols.filter(v => ['MCL', 'MRDL', 'TT'].includes(f(v, 'violation_category_code') || ''));
    const pfasContaminants = getPfasForPwsid(pwsid);
    const pfasAboveMcl = pfasContaminants.filter(p => p.severity === 'high');


    // ─── Contaminants ────────────────────────────────────────────────────────
    const contaminants: ContaminantRow[] = buildEpaCatalogContaminants(
      allSamples, f, maxSampleLevel, HEALTH_CONTEXT, EWG_GUIDELINES,
    );
    contaminants.push(
      ...buildDynamicSampleContaminants(
        allSamples, contaminants, f, maxSampleLevel, HEALTH_CONTEXT,
      ),
    );

    // Add lead/copper from static LCR dataset if not already found from live API
    const lcrStatic = LCR_DATA[pwsid];
    if (lcrStatic) {
      const leadMg = lcrStatic.lead;
      if (leadMg != null && Number.isFinite(leadMg) && leadMg >= 0 && !contaminants.find(c => c.name === 'Lead')) {
        const val = +(leadMg * 1000).toFixed(2); // mg/L to ppb
        const displayVal = val; // show minimum detectable level if zero
        const ctx = HEALTH_CONTEXT['Lead'];
        const ewgG = EWG_GUIDELINES['Lead'];
        contaminants.push({
          name: 'Lead',
          level: displayVal,
          limit: 15,
          unit: 'ppb',
          severity: displayVal > 15 ? 'high' : displayVal > 5 ? 'moderate' : 'low',
          note: `EPA LCR 90th percentile — SDWA national dataset`,
          source: 'EPA SDWA LCR',
          healthEffects: ctx?.effects,
          healthSources: ctx?.sources,
          epaAction: ctx?.epa_action,
          ewgGuideline: ewgG?.limit ?? null,
          ewgGuidelineLabel: ewgG?.label ?? null,
          ewgTimesOver: ewgG && val > 0 ? +(val / ewgG.limit).toFixed(1) : null,
        });
      }
      const copperMg = lcrStatic.copper;
      if (copperMg != null && Number.isFinite(copperMg) && copperMg > 0 && !contaminants.find(c => c.name === 'Copper')) {
        const val = +(copperMg * 1000).toFixed(2); // mg/L to ppb
        const ctx = HEALTH_CONTEXT['Copper'];
        contaminants.push({
          name: 'Copper',
          level: val,
          limit: 1300,
          unit: 'ppb',
          severity: val > 1300 ? 'high' : val > 650 ? 'moderate' : 'low',
          note: `EPA LCR 90th percentile — SDWA national dataset`,
          source: 'EPA SDWA LCR',
          healthEffects: ctx?.effects,
          healthSources: ctx?.sources,
          epaAction: ctx?.epa_action,
        });
      }
    }

    for (const v of healthV.slice(0, 4)) {
      const cc = f(v, 'contaminant_code') || '';
      const sc = f(v, 'violation_status_code') || '';
      const name = CONTAM_NAMES[cc] || f(v, 'contaminant_name') || `Contaminant ${cc}`;
      if (!contaminants.find(c => c.name === name)) {
        const ctx = HEALTH_CONTEXT[name];
        contaminants.push({
          name, level: null, limit: null, unit: '',
          severity: sc === 'O' ? 'high' : 'moderate',
          note: `${sc === 'O' ? 'OPEN' : 'Resolved'} — ${VIOL_LABELS[f(v, 'violation_category_code') || ''] || ''}`,
          violationBased: true, source: 'EPA SDWIS',
          healthEffects: ctx?.effects,
          healthSources: ctx?.sources,
          epaAction: ctx?.epa_action,
        });
      }
    }

    // Add PFAS from UCMR5 — always show specific compounds (they're different from EWG's "PFAS Total")
    for (const p of pfasContaminants) {
      // Deduplicate: skip if a contaminant with exact same name already exists
      if (!contaminants.find(c => c.name === p.name)) {
        contaminants.push(p);
      }
    }

    // ─── UCMR5 lithium ───────────────────────────────────────────────────────
    const ucmr5Row = ucmr5[pwsid];
    const lithiumVal = ucmr5Row && ucmr5Row.length >= 4 ? ucmr5Row[3] : null;
    if (lithiumVal !== null && typeof lithiumVal === 'number') {
      const ctx = HEALTH_CONTEXT['Lithium'];
      contaminants.push({
        name: 'Lithium',
        level: lithiumVal,
        limit: 10,
        unit: 'μg/L',
        severity: lithiumVal > 10 ? 'moderate' : 'low',
        note: `EPA UCMR5 2023-2025 — MCLG under review`,
        source: 'EPA UCMR5',
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
      });
    }

    const measuredBeforeCcr = countMeasuredContaminants(contaminants);
    mergePwsidCcrContaminants(contaminants, pwsid, { minMeasuredBeforeFill: 8 });
    if (countMeasuredContaminants(contaminants) > measuredBeforeCcr) {
      for (const c of contaminants) {
        if (c.healthEffects) continue;
        const ctx = HEALTH_CONTEXT[c.name];
        if (ctx) {
          c.healthEffects = ctx.effects;
          c.healthSources = ctx.sources;
          c.epaAction = ctx.epa_action;
        }
        const ewgG = EWG_GUIDELINES[c.name];
        if (ewgG && c.level != null && c.level > 0 && !c.ewgGuideline) {
          c.ewgGuideline = ewgG.limit;
          c.ewgGuidelineLabel = ewgG.label;
          c.ewgTimesOver = +(c.level / ewgG.limit).toFixed(1);
        }
      }
    }

    const sortedContaminants = sortContaminants(contaminants);

    const safety = computeZipWaterScore({
      pwsid,
      zip,
      contaminants: sortedContaminants,
      openViolations: openV.length,
    });
    const score = violationCoverage === 'available' ? safety.score : null;
    const grade = violationCoverage === 'available' ? safety.grade : '—';
    const scoreLabel = violationCoverage === 'available' ? safety.label : 'Current compliance unavailable';
    const scoreColor = safety.scoreColor;
    const nationalPercentile = nationalPercentileFromSafetyScore(score ?? 0);

    // ─── Format violations ───────────────────────────────────────────────────
    const fmtViols = [...viols]
      .sort((a, b) =>
        new Date(f(b, 'compliance_period_begin_date') || 0).getTime() -
        new Date(f(a, 'compliance_period_begin_date') || 0).getTime()
      )
      .slice(0, 10)
      .map(v => {
        const cat = f(v, 'violation_category_code') || '';
        const sc  = f(v, 'violation_status_code')   || '';
        const cc  = f(v, 'contaminant_code')         || '';
        return {
          rule:        VIOL_LABELS[cat] || cat || 'Violation',
          contaminant: CONTAM_NAMES[cc] || f(v, 'contaminant_name') || '',
          year:        (f(v, 'compliance_period_begin_date') || '').slice(0, 4) || '—',
          status:      STATUS_META[sc]?.label || sc || '—',
          statusColor: STATUS_META[sc]?.color || '#94a3b8',
        };
      });

    const pfasCount = pfasContaminants.length;
    const pfasAbove = pfasAboveMcl.length;
    const openCount = openV.length;

    const ucmr5Summary = ucmr5Row ? {
      maxPfasPpt: ucmr5Row[0],
      overMCL: ucmr5Row[1],
      totalAnalytes: ucmr5Row[2]?.length || 0,
    } : null;

    // ─── Data sources used ───────────────────────────────────────────────────
    const dataSources = violationCoverage === 'available' ? ['EPA SDWIS'] : [];
    if (LCR_DATA[pwsid]) dataSources.push('EPA LCR National Dataset');
    if (pfasCount > 0) dataSources.push('EPA UCMR5 PFAS');
    if (countMeasuredContaminants(contaminants) > measuredBeforeCcr) {
      dataSources.push('Public water system CCR');
    }
    if (usgsData)      dataSources.push('USGS NWIS');
    if (lithiumVal)    dataSources.push('UCMR5 Lithium');
    if (echoData)      dataSources.push('EPA ECHO Enforcement');

    const summary = violationCoverage === 'unavailable'
      ? 'Current EPA violation records could not be loaded. Available measurements below are historical and do not establish current compliance.'
      : openCount > 0
      ? `${pwsName} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${pwsName} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${pwsName} returned no violation records in this lookup. This is not a certification of current compliance.`;

    const pfasSummary = pfasCount > 0
      ? pfasAbove > 0
        ? `⚠️ ${pfasAbove} historical PFAS compound peak(s) above April 2024 benchmarks; not official violations.`
        : `${pfasCount} PFAS compound(s) detected. Regulated peaks are at or below April 2024 benchmarks; some compounds have no individual benchmark.`
      : null;

    logWaterLookup({
      zip,
      outcome: 'ok',
      pwsid,
      ms: Date.now() - t0,
      hasEwg: false,
      pfasCount,
      openViolations: openCount,
    });

    const payload = {
      zip,
      city:             [cityName, stateCode].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName:       pwsName,
      pwsid,
      stateCode,
      score,
      grade,
      scoreLabel,
      scoreColor,
      nationalPercentile,
      population:       popCount ? parseInt(popCount).toLocaleString() : null,
      sourceType:       srcCode === 'SW' ? 'Surface Water'
                      : srcCode === 'GW' ? 'Groundwater'
                      : srcCode === 'GU' ? 'Groundwater (surface influenced)'
                      : 'Municipal',
      dataSource:       dataSources.join(' + '),
      dataSources,
      dataFreshness:    getDataFreshness(),
      openViolations:   violationCoverage === 'available' ? openCount : null,
      totalViolations:  violationCoverage === 'available' ? viols.length : null,
      hasLCR:           allSamples.length > 0 || !!(LCR_DATA[pwsid]?.lead || LCR_DATA[pwsid]?.copper),
      hasEWG:           false,
      hasPFAS:          pfasCount > 0,
      pfasCoverage:     ucmr5Row ? 'available' : 'unavailable',
      violationCoverage,
      pfasCount,
      pfasAboveMcl:     pfasAbove,
      ucmr5:            ucmr5Summary,
      usgs:             usgsData,
      contaminants: sortedContaminants,
      violations:       fmtViols,
      echo:             echoData,
      summary,
      pfasSummary,
    };
    if (violationCoverage === 'unavailable') {
      return NextResponse.json(payload, { headers: { ...H, 'Cache-Control': 'no-store' } });
    }
    await setCachedWaterResponse(zip, { status: 200, body: payload });
    return NextResponse.json(payload, { headers: okHeaders });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err || 'Unknown error');
    logWaterLookup({ zip, outcome: 'error', ms: Date.now() - t0, message });
    return NextResponse.json(
      {
        error: 'Water data is temporarily unavailable. Please try again shortly.',
        dataFreshness: getDataFreshness(),
      },
      {
        status: 503,
        headers: {
          ...H,
          // Brief CDN cache so EPA outages don't stampede serverless invocations
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}
