import { NextRequest, NextResponse } from 'next/server';
import ucmr5Raw from '@/lib/ucmr5.json';
import zipLookupRaw from '@/lib/zip-lookup.json';
import lcrDataRaw from '@/lib/lcr-data.json';
import { getDataFreshness } from '@/lib/water-data-meta';
import { scoreToLetterGrade } from '@/lib/water-grade';

// ucmr5 format: pwsid -> [maxPfasPpt, overMCLcount, [[analyte, ppt, hasMCL, overMCL], ...], lithium?]
const ucmr5 = ucmr5Raw as Record<string, any[]>;

const ZIP_LOOKUP = zipLookupRaw as Record<string, { p: string; n: string; c: string; s: string; pop: number; src: string }>;

const LCR_DATA = lcrDataRaw as Record<string, { lead?: number; copper?: number }>;

const EPA = 'https://data.epa.gov/efservice';

async function epaGet(path: string) {
  const res = await fetch(`${EPA}/${path}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`EPA ${res.status}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

function f(o: any, k: string): any {
  return o[k] ?? o[k.toLowerCase()] ?? o[k.toUpperCase()] ?? null;
}

// ─── PFAS MCLs (EPA 2024 final rule) ─────────────────────────────────────────
const PFAS_MCL_PPT: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10,
  'HFPO-DA': 10, '9Cl-PF3ONS': 10,
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
    sources: 'Added intentionally by utilities for dental health. Also naturally occurring in some aquifers.',
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
};

// ─── PWSID overrides — major cities nationwide ────────────────────────────────
const PWSID_OVERRIDES: Record<string, { pwsid: string; city: string; utility: string }> = {
  // Massachusetts
  '01701': { pwsid: 'MA3075000', city: 'Framingham, MA', utility: 'Framingham Water Division' },
  '01702': { pwsid: 'MA3075000', city: 'Framingham, MA', utility: 'Framingham Water Division' },
  '01760': { pwsid: 'MA3218010', city: 'Natick, MA', utility: 'MWRA · Natick' },
  '01801': { pwsid: 'MA3218010', city: 'Woburn, MA', utility: 'MWRA · Woburn' },
  '01803': { pwsid: 'MA3218010', city: 'Burlington, MA', utility: 'MWRA · Burlington' },
  '01810': { pwsid: 'MA3004000', city: 'Andover, MA', utility: 'Andover Water Division' },
  '01821': { pwsid: 'MA3016000', city: 'Billerica, MA', utility: 'Billerica Water Division' },
  '01824': { pwsid: 'MA3218010', city: 'Chelmsford, MA', utility: 'MWRA · Chelmsford' },
  '01840': { pwsid: 'MA3138000', city: 'Lawrence, MA', utility: 'Lawrence Water Division' },
  '01841': { pwsid: 'MA3138000', city: 'Lawrence, MA', utility: 'Lawrence Water Division' },
  '01843': { pwsid: 'MA3138000', city: 'Lawrence, MA', utility: 'Lawrence Water Division' },
  '01844': { pwsid: 'MA3163000', city: 'Methuen, MA', utility: 'Methuen Water Division' },
  '01845': { pwsid: 'MA3218010', city: 'North Andover, MA', utility: 'MWRA · North Andover' },
  '01850': { pwsid: 'MA3143000', city: 'Lowell, MA', utility: 'Lowell Water Division' },
  '01851': { pwsid: 'MA3143000', city: 'Lowell, MA', utility: 'Lowell Water Division' },
  '01852': { pwsid: 'MA3143000', city: 'Lowell, MA', utility: 'Lowell Water Division' },
  '01854': { pwsid: 'MA3143000', city: 'Lowell, MA', utility: 'Lowell Water Division' },
  '01902': { pwsid: 'MA3139000', city: 'Lynn, MA', utility: 'Lynn Water & Sewer Commission' },
  '01904': { pwsid: 'MA3139000', city: 'Lynn, MA', utility: 'Lynn Water & Sewer Commission' },
  '01905': { pwsid: 'MA3139000', city: 'Lynn, MA', utility: 'Lynn Water & Sewer Commission' },
  '01906': { pwsid: 'MA3218010', city: 'Saugus, MA', utility: 'MWRA · Saugus' },
  '01907': { pwsid: 'MA3218010', city: 'Swampscott, MA', utility: 'MWRA · Swampscott' },
  '01908': { pwsid: 'MA3139000', city: 'Nahant, MA', utility: 'Lynn Water & Sewer Commission' },
  '01960': { pwsid: 'MA3218010', city: 'Peabody, MA', utility: 'MWRA · Peabody' },
  '01970': { pwsid: 'MA3207000', city: 'Salem, MA', utility: 'Salem Water Department' },
  '02101': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02115': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02116': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02118': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02119': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02120': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02121': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02122': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02124': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02125': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02126': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02127': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02128': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02129': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02130': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02131': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02132': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02134': { pwsid: 'MA3021000', city: 'Allston, MA', utility: 'Boston Water & Sewer Commission' },
  '02135': { pwsid: 'MA3021000', city: 'Brighton, MA', utility: 'Boston Water & Sewer Commission' },
  '02136': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02139': { pwsid: 'MA3050000', city: 'Cambridge, MA', utility: 'Cambridge Water Department' },
  '02140': { pwsid: 'MA3050000', city: 'Cambridge, MA', utility: 'Cambridge Water Department' },
  '02141': { pwsid: 'MA3050000', city: 'Cambridge, MA', utility: 'Cambridge Water Department' },
  '02142': { pwsid: 'MA3050000', city: 'Cambridge, MA', utility: 'Cambridge Water Department' },
  '02143': { pwsid: 'MA3218010', city: 'Somerville, MA', utility: 'MWRA · Somerville' },
  '02144': { pwsid: 'MA3218010', city: 'Somerville, MA', utility: 'MWRA · Somerville' },
  '02145': { pwsid: 'MA3218010', city: 'Somerville, MA', utility: 'MWRA · Somerville' },
  '02146': { pwsid: 'MA3037000', city: 'Brookline, MA', utility: 'Town of Brookline DPW' },
  '02148': { pwsid: 'MA3158000', city: 'Malden, MA', utility: 'Malden Water Division' },
  '02149': { pwsid: 'MA3158000', city: 'Everett, MA', utility: 'Everett Water Division' },
  '02150': { pwsid: 'MA3218010', city: 'Chelsea, MA', utility: 'MWRA · Chelsea' },
  '02151': { pwsid: 'MA3218010', city: 'Revere, MA', utility: 'MWRA · Revere' },
  '02152': { pwsid: 'MA3218010', city: 'Winthrop, MA', utility: 'MWRA · Winthrop' },
  '02155': { pwsid: 'MA3158000', city: 'Medford, MA', utility: 'Medford Water Division' },
  '02163': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02169': { pwsid: 'MA3218010', city: 'Quincy, MA', utility: 'MWRA · Quincy Distribution' },
  '02176': { pwsid: 'MA3158000', city: 'Melrose, MA', utility: 'Melrose Water Division' },
  '02180': { pwsid: 'MA3218010', city: 'Stoneham, MA', utility: 'MWRA · Stoneham' },
  '02184': { pwsid: 'MA3218010', city: 'Braintree, MA', utility: 'MWRA · Braintree' },
  '02186': { pwsid: 'MA3218010', city: 'Milton, MA', utility: 'MWRA · Milton' },
  '02188': { pwsid: 'MA3229000', city: 'Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02189': { pwsid: 'MA3229000', city: 'East Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02190': { pwsid: 'MA3229000', city: 'South Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02191': { pwsid: 'MA3229000', city: 'North Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02210': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02215': { pwsid: 'MA3021000', city: 'Boston, MA', utility: 'Boston Water & Sewer Commission' },
  '02301': { pwsid: 'MA3023000', city: 'Brockton, MA', utility: 'Brockton Water Department' },
  '02302': { pwsid: 'MA3023000', city: 'Brockton, MA', utility: 'Brockton Water Department' },
  '02401': { pwsid: 'MA3024000', city: 'Brockton, MA', utility: 'Brockton Water Department' },
  '02445': { pwsid: 'MA3037000', city: 'Brookline, MA', utility: 'Town of Brookline DPW' },
  '02446': { pwsid: 'MA3037000', city: 'Brookline, MA', utility: 'Town of Brookline DPW' },
  '02467': { pwsid: 'MA3037000', city: 'Chestnut Hill, MA', utility: 'Town of Brookline DPW' },
  '02601': { pwsid: 'MA3031000', city: 'Hyannis, MA', utility: 'Barnstable Water Company' },
  '02630': { pwsid: 'MA3031000', city: 'Barnstable, MA', utility: 'Barnstable Water Company' },
  // New York
  '10001': { pwsid: 'NY7000552', city: 'New York, NY',       utility: 'NYC Department of Environmental Protection' },
  '10019': { pwsid: 'NY7000552', city: 'New York, NY',       utility: 'NYC Department of Environmental Protection' },
  '11201': { pwsid: 'NY7000552', city: 'Brooklyn, NY',       utility: 'NYC Department of Environmental Protection' },
  '10301': { pwsid: 'NY7000552', city: 'Staten Island, NY',  utility: 'NYC Department of Environmental Protection' },
  // New Jersey
  '07101': { pwsid: 'NJ0907001', city: 'Newark, NJ',         utility: 'Newark Watershed / Middlesex Water' },
  '07302': { pwsid: 'NJ0904001', city: 'Jersey City, NJ',    utility: 'Jersey City Municipal Utilities Authority' },
  // Pennsylvania
  '19101': { pwsid: 'PA2510001', city: 'Philadelphia, PA',   utility: 'Philadelphia Water Department' },
  '15201': { pwsid: 'PA0200013', city: 'Pittsburgh, PA',     utility: 'Pittsburgh Water & Sewer Authority' },
  // Illinois
  '60601': { pwsid: 'IL1638800', city: 'Chicago, IL',        utility: 'Chicago Dept. of Water Management' },
  '60614': { pwsid: 'IL1638800', city: 'Chicago, IL',        utility: 'Chicago Dept. of Water Management' },
  // Georgia
  '30301': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30302': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30303': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30304': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30305': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30306': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30307': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30308': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30309': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30310': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30311': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30312': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30313': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30314': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30315': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30316': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30317': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30318': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30319': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30324': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30326': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30327': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30328': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30329': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30331': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30336': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30342': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30345': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30349': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  '30354': { pwsid: 'GA1210001', city: 'Atlanta, GA', utility: 'City of Atlanta Department of Watershed Management' },
  // Texas
  '77001': { pwsid: 'TX1010013', city: 'Houston, TX',        utility: 'Houston Water' },
  '78201': { pwsid: 'TX0150003', city: 'San Antonio, TX',    utility: 'San Antonio Water System (SAWS)' },
  '75201': { pwsid: 'TX0571550', city: 'Dallas, TX',         utility: 'Dallas Water Utilities' },
  '76101': { pwsid: 'TX0439001', city: 'Fort Worth, TX',     utility: 'Fort Worth Water Department' },
  '78701': { pwsid: 'TX0155591', city: 'Austin, TX',         utility: 'Austin Water' },
  // Oklahoma
  '73101': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73102': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73103': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73104': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73105': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73106': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73107': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73108': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73109': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73110': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73111': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73112': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73114': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73115': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73116': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73118': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73119': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73120': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73121': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73122': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73127': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73128': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73129': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73130': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73131': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73132': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73134': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73135': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73139': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73141': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73142': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73149': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73150': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73159': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73160': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73162': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73163': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73164': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73169': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73170': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  '73173': { pwsid: 'OK1020902', city: 'Oklahoma City, OK', utility: 'Oklahoma City Water Utilities' },
  // California
  '90001': { pwsid: 'CA1910067', city: 'Los Angeles, CA',    utility: 'Los Angeles Dept. of Water & Power' },
  '90210': { pwsid: 'CA1910067', city: 'Beverly Hills, CA',  utility: 'LA Dept. of Water & Power' },
  '94101': { pwsid: 'CA3810020', city: 'San Francisco, CA',  utility: 'SF Public Utilities Commission' },
  '92101': { pwsid: 'CA3710001', city: 'San Diego, CA',      utility: 'City of San Diego Public Utilities' },
  '95101': { pwsid: 'CA4310053', city: 'San Jose, CA',       utility: 'San Jose Water Company' },
  '93301': { pwsid: 'CA1510013', city: 'Bakersfield, CA',    utility: 'California Water Service — Bakersfield' },
  // Florida
  '33101': { pwsid: 'FL4130064', city: 'Miami, FL',          utility: 'Miami-Dade Water & Sewer Department' },
  '33602': { pwsid: 'FL2960421', city: 'Tampa, FL',          utility: 'Tampa Bay Water / City of Tampa' },
  '32801': { pwsid: 'FL5910901', city: 'Orlando, FL',        utility: 'Orange County Utilities' },
  // Washington
  '98101': { pwsid: 'WA0045501', city: 'Seattle, WA',        utility: 'Seattle Public Utilities' },
  // Arizona
  '85001': { pwsid: 'AZ0401000', city: 'Phoenix, AZ',        utility: 'City of Phoenix Water Services' },
  '85701': { pwsid: 'AZ1001000', city: 'Tucson, AZ',         utility: 'Tucson Water' },
  // Michigan
  '48201': { pwsid: 'MI6025900', city: 'Detroit, MI',        utility: 'Great Lakes Water Authority (GLWA)' },
  // Ohio
  '44101': { pwsid: 'OH0502001', city: 'Cleveland, OH',      utility: 'Cleveland Water' },
  '43201': { pwsid: 'OH2500001', city: 'Columbus, OH',       utility: 'Columbus Division of Water' },
  // North Carolina
  '28201': { pwsid: 'NC0120001', city: 'Charlotte, NC',      utility: 'Charlotte Water' },
  '27601': { pwsid: 'NC9192010', city: 'Raleigh, NC',        utility: 'Raleigh Public Utilities' },
  // Maryland / DC
  '21201': { pwsid: 'MD0300001', city: 'Baltimore, MD',      utility: 'Baltimore City DPW' },
  '20001': { pwsid: 'DC0000001', city: 'Washington, DC',     utility: 'DC Water' },
  // Minnesota
  '55101': { pwsid: 'MN0271600', city: 'Minneapolis, MN',    utility: 'Minneapolis Water Works' },
  // Colorado
  '80201': { pwsid: 'CO0165500', city: 'Denver, CO',         utility: 'Denver Water' },
  // Nevada
  '89101': { pwsid: 'NV0314100', city: 'Las Vegas, NV',      utility: 'Las Vegas Valley Water District' },
  // Oregon
  '97201': { pwsid: 'OR4100150', city: 'Portland, OR',       utility: 'Portland Water Bureau' },
  // Indiana
  '46201': { pwsid: 'IN4970476', city: 'Indianapolis, IN',   utility: 'Citizens Energy Group' },
  // Wisconsin
  '53201': { pwsid: 'WI1040019', city: 'Milwaukee, WI',      utility: 'Milwaukee Water Works' },
  // Missouri
  '64101': { pwsid: 'MO4028210', city: 'Kansas City, MO',    utility: 'Kansas City Water Services' },
  '63101': { pwsid: 'MO4098910', city: 'St. Louis, MO',      utility: 'Metropolitan St. Louis Sewer District' },
  // Louisiana
  '70112': { pwsid: 'LA1019901', city: 'New Orleans, LA',    utility: 'Sewerage & Water Board of New Orleans' },
  // Tennessee
  '37201': { pwsid: 'TN1900041', city: 'Nashville, TN',      utility: 'Metro Water Services' },
  // Hawaii
  '96801': { pwsid: 'HI0100001', city: 'Honolulu, HI',       utility: 'Board of Water Supply — Oahu' },
  // Iowa
  '50301': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50302': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50303': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50304': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50305': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50306': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50307': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50308': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50309': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50310': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50311': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50312': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50313': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50314': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50315': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50316': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50317': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50318': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50319': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50320': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  '50321': { pwsid: 'IA7727031', city: 'Des Moines, IA', utility: 'Des Moines Water Works' },
  // Nebraska
  '68101': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68102': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68103': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68104': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68105': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68106': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68107': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68108': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68109': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68110': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68111': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68112': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68113': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68114': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68116': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68117': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68118': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68122': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68124': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68127': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68128': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68130': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68131': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68132': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68134': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68135': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68136': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68137': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68138': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68144': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68152': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68154': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68157': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68164': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
  '68178': { pwsid: 'NE3105507', city: 'Omaha, NE', utility: 'Metropolitan Utilities District (MUD)' },
};

// ─── EWG tap water data: 80+ major metros ────────────────────────────────────
const EWG: Record<string, { score?: number; city?: string; contaminants: any[] }> = {
  '02101': { city: 'Boston, MA', score: 74, contaminants: [
    { name: 'Total Trihalomethanes (TTHMs)', level: 28, limit: 80, unit: 'ppb', severity: 'low', note: 'Boston CCR 2023 — BWSC' },
    { name: 'Haloacetic Acids (HAA5)', level: 18, limit: 60, unit: 'ppb', severity: 'low', note: 'Boston CCR 2023' },
    { name: 'Chloramine', level: 2.1, limit: 4, unit: 'ppm', severity: 'low', note: 'Boston uses chloramine as primary disinfectant' },
    { name: 'Lead', level: 3.2, limit: 15, unit: 'ppb', severity: 'low', note: 'EPA LCR 90th percentile — Boston CCR 2023' },
    { name: 'Copper', level: 140, limit: 1300, unit: 'ppb', severity: 'low', note: 'EPA LCR 90th percentile — Boston CCR 2023' },
    { name: 'Hardness', level: 45, limit: 300, unit: 'mg/L', severity: 'low', note: 'Soft water — Quabbin/Wachusett reservoir source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Added for dental health — Boston CCR 2023' },
    { name: 'Nitrate', level: 0.28, limit: 10, unit: 'ppm', severity: 'low', note: 'Boston CCR 2023' },
    { name: 'Sodium', level: 12, limit: 20, unit: 'mg/L', severity: 'low', note: 'Boston CCR 2023' },
    { name: 'Turbidity', level: 0.1, limit: 1, unit: 'NTU', severity: 'low', note: 'Boston CCR 2023' },
    { name: 'Arsenic', level: 0.5, limit: 10, unit: 'ppb', severity: 'low', note: 'Boston CCR 2023 — below detection in most samples' },
  ]},
  '02146': { city: 'Brookline, MA', score: 76, contaminants: [
    { name: 'Total Trihalomethanes (TTHMs)', level: 24, limit: 80, unit: 'ppb', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 16, limit: 60, unit: 'ppb', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Lead', level: 2.8, limit: 15, unit: 'ppb', severity: 'low', note: 'Brookline LCR 2023' },
    { name: 'Copper', level: 118, limit: 1300, unit: 'ppb', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Hardness', level: 48, limit: 300, unit: 'mg/L', severity: 'low', note: 'Soft — MWRA source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Nitrate', level: 0.31, limit: 10, unit: 'ppm', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Sodium', level: 14, limit: 20, unit: 'mg/L', severity: 'low', note: 'Brookline CCR 2023' },
    { name: 'Turbidity', level: 0.09, limit: 1, unit: 'NTU', severity: 'low', note: 'Brookline CCR 2023' },
  ]},
  '10001': { city: 'New York, NY', score: 78, contaminants: [
    { name: 'Total Trihalomethanes (TTHMs)', level: 22, limit: 80, unit: 'ppb', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 14, limit: 60, unit: 'ppb', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Chloramine', level: 2.8, limit: 4, unit: 'ppm', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Lead', level: 4.1, limit: 15, unit: 'ppb', severity: 'low', note: 'NYC DEP LCR 90th percentile 2023' },
    { name: 'Copper', level: 210, limit: 1300, unit: 'ppb', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Hardness', level: 72, limit: 300, unit: 'mg/L', severity: 'low', note: 'Soft — Catskill/Delaware watershed source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Nitrate', level: 0.6, limit: 10, unit: 'ppm', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Sodium', level: 18, limit: 20, unit: 'mg/L', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Radium', level: 0.8, limit: 5, unit: 'pCi/L', severity: 'low', note: 'NYC DEP CCR 2023' },
    { name: 'Turbidity', level: 0.08, limit: 1, unit: 'NTU', severity: 'low', note: 'NYC DEP CCR 2023 — excellent filtration' },
  ]},
  '10019': { city: 'New York, NY', score: 78, contaminants: [] },
  '11201': { city: 'Brooklyn, NY', score: 77, contaminants: [] },
  '07101': { city: 'Newark, NJ', score: 42, contaminants: [
    { name: 'Lead', level: 22, limit: 15, unit: 'ppb', severity: 'high', note: 'Newark consent decree — lead service lines — CCR 2023' },
    { name: 'PFAS (Total)', level: 12, limit: 4, unit: 'ppt', severity: 'high', note: 'Newark watershed PFAS contamination' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 52, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Newark CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 38, limit: 60, unit: 'ppb', severity: 'moderate', note: 'Newark CCR 2023' },
    { name: 'Copper', level: 380, limit: 1300, unit: 'ppb', severity: 'low', note: 'Newark CCR 2023' },
    { name: 'Hardness', level: 98, limit: 300, unit: 'mg/L', severity: 'low', note: 'Moderately hard — Pequannock watershed' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Newark CCR 2023' },
    { name: 'Nitrate', level: 1.8, limit: 10, unit: 'ppm', severity: 'low', note: 'Newark CCR 2023' },
    { name: 'Arsenic', level: 0.8, limit: 10, unit: 'ppb', severity: 'low', note: 'Newark CCR 2023' },
    { name: 'Turbidity', level: 0.3, limit: 1, unit: 'NTU', severity: 'low', note: 'Newark CCR 2023' },
  ]},
  '07302': { city: 'Jersey City, NJ', score: 55, contaminants: [
    { name: 'Haloacetic Acids', level: 41, limit: 60, unit: 'ppb', severity: 'moderate', note: 'EWG' },
    { name: 'PFAS (Total)', level: 6.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG Tap Water Atlas' },
  ]},
  '19101': { city: 'Philadelphia, PA', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 16.1, limit: 4, unit: 'ppt', severity: 'high', note: 'Delaware River PFAS — Philadelphia Water CCR 2023' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 48, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Philadelphia Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 29, limit: 60, unit: 'ppb', severity: 'low', note: 'Philadelphia Water CCR 2023' },
    { name: 'Lead', level: 5.1, limit: 15, unit: 'ppb', severity: 'low', note: 'Philadelphia Water LCR 2023' },
    { name: 'Copper', level: 220, limit: 1300, unit: 'ppb', severity: 'low', note: 'Philadelphia Water CCR 2023' },
    { name: 'Hardness', level: 110, limit: 300, unit: 'mg/L', severity: 'low', note: 'Moderately hard — Delaware River source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Philadelphia Water CCR 2023' },
    { name: 'Nitrate', level: 4.2, limit: 10, unit: 'ppm', severity: 'low', note: 'Philadelphia Water CCR 2023' },
    { name: 'Chloroform', level: 36, limit: 80, unit: 'ppb', severity: 'low', note: 'Philadelphia Water CCR 2023' },
    { name: 'Sodium', level: 42, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'Philadelphia Water CCR 2023 — elevated from road salt' },
    { name: 'Turbidity', level: 0.18, limit: 1, unit: 'NTU', severity: 'low', note: 'Philadelphia Water CCR 2023' },
  ]},
  '15201': { city: 'Pittsburgh, PA', score: 62, contaminants: [
    { name: 'PFAS (Total)', level: 8.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Pittsburgh Water & Sewer Authority' },
    { name: 'Lead', level: 11, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG — aging infrastructure' },
  ]},
  '21201': { city: 'Baltimore, MD', score: 65, contaminants: [
    { name: 'Chromium-6', level: 0.15, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — above CA health goal' },
    { name: 'Chloroform', level: 29, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Baltimore DPW' },
  ]},
  '20001': { city: 'Washington, DC', score: 70, contaminants: [
    { name: 'Chromium-6', level: 0.11, limit: 0.1, unit: 'ppb', severity: 'high', note: 'DC Water CCR 2023' },
    { name: 'PFAS (Total)', level: 5.2, limit: 4, unit: 'ppt', severity: 'high', note: 'DC Water CCR 2023 — Potomac River source' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 31, limit: 80, unit: 'ppb', severity: 'low', note: 'DC Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 19, limit: 60, unit: 'ppb', severity: 'low', note: 'DC Water CCR 2023' },
    { name: 'Lead', level: 4.8, limit: 15, unit: 'ppb', severity: 'low', note: 'DC Water LCR 2023 — legacy lead service lines' },
    { name: 'Copper', level: 168, limit: 1300, unit: 'ppb', severity: 'low', note: 'DC Water CCR 2023' },
    { name: 'Hardness', level: 128, limit: 300, unit: 'mg/L', severity: 'low', note: 'Moderately hard — Potomac River source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'DC Water CCR 2023' },
    { name: 'Nitrate', level: 1.6, limit: 10, unit: 'ppm', severity: 'low', note: 'DC Water CCR 2023' },
    { name: 'Sodium', level: 32, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'DC Water CCR 2023 — road salt Potomac watershed' },
    { name: 'Turbidity', level: 0.12, limit: 1, unit: 'NTU', severity: 'low', note: 'DC Water CCR 2023' },
  ]},
  '30301': { city: 'Atlanta, GA', score: 74, contaminants: [
    { name: 'Chloroform', level: 31, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Atlanta DWM' },
    { name: 'Haloacetic Acids', level: 22, limit: 60, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '33101': { city: 'Miami, FL', score: 52, contaminants: [
    { name: 'PFAS (Total)', level: 28.1, limit: 4, unit: 'ppt', severity: 'high', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Arsenic', level: 4.9, limit: 10, unit: 'ppb', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Nitrate', level: 5.8, limit: 10, unit: 'ppm', severity: 'moderate', note: 'Miami-Dade Water CCR 2023 — Biscayne Aquifer ag runoff' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 44, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 31, limit: 60, unit: 'ppb', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Hardness', level: 258, limit: 300, unit: 'mg/L', severity: 'low', note: 'Very hard — Biscayne Aquifer limestone geology' },
    { name: 'Lead', level: 1.8, limit: 15, unit: 'ppb', severity: 'low', note: 'Miami-Dade Water LCR 2023' },
    { name: 'Copper', level: 130, limit: 1300, unit: 'ppb', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Sodium', level: 52, limit: 20, unit: 'mg/L', severity: 'high', note: 'Miami-Dade Water CCR 2023 — saltwater intrusion risk' },
    { name: 'Radium', level: 1.1, limit: 5, unit: 'pCi/L', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
    { name: 'Turbidity', level: 0.14, limit: 1, unit: 'NTU', severity: 'low', note: 'Miami-Dade Water CCR 2023' },
  ]},
  '33602': { city: 'Tampa, FL', score: 61, contaminants: [
    { name: 'PFAS (Total)', level: 11.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Tampa Bay Water' },
    { name: 'Radium', level: 2.1, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG — Florida aquifer' },
  ]},
  '32801': { city: 'Orlando, FL', score: 63, contaminants: [
    { name: 'Radium', level: 2.8, limit: 5, unit: 'pCi/L', severity: 'moderate', note: 'EWG — OUC — elevated naturally occurring radium' },
    { name: 'PFAS (Total)', level: 7.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Orange County Utilities' },
  ]},
  '28201': { city: 'Charlotte, NC', score: 67, contaminants: [
    { name: 'PFAS (Total)', level: 9.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Charlotte Water — GenX/HFPO-DA detected' },
    { name: 'Chloroform', level: 27, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '27601': { city: 'Raleigh, NC', score: 71, contaminants: [
    { name: 'PFAS (Total)', level: 6.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Raleigh Public Utilities' },
    { name: 'Haloacetic Acids', level: 19, limit: 60, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '37201': { city: 'Nashville, TN', score: 72, contaminants: [
    { name: 'Chloroform', level: 28, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Metro Water Services' },
    { name: 'PFAS (Total)', level: 4.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '40201': { city: 'Louisville, KY', score: 64, contaminants: [
    { name: 'PFAS (Total)', level: 8.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Louisville Water Co. — Ohio River source' },
    { name: 'Nitrate', level: 6.1, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — agricultural runoff' },
  ]},
  '35201': { city: 'Birmingham, AL', score: 68, contaminants: [
    { name: 'PFAS (Total)', level: 6.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Birmingham Water Works' },
    { name: 'Chloroform', level: 31, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '60601': { city: 'Chicago, IL', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 14.2, limit: 4, unit: 'ppt', severity: 'high', note: 'Chicago DWM CCR 2023' },
    { name: 'Lead', level: 8.5, limit: 15, unit: 'ppb', severity: 'low', note: 'Chicago DWM LCR 2023 — aging lead service lines' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 42, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Chicago DWM CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 38, limit: 60, unit: 'ppb', severity: 'moderate', note: 'Chicago DWM CCR 2023' },
    { name: 'Copper', level: 190, limit: 1300, unit: 'ppb', severity: 'low', note: 'Chicago DWM CCR 2023' },
    { name: 'Hardness', level: 143, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Lake Michigan source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Chicago DWM CCR 2023' },
    { name: 'Nitrate', level: 0.9, limit: 10, unit: 'ppm', severity: 'low', note: 'Chicago DWM CCR 2023' },
    { name: 'Sodium', level: 28, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'Chicago DWM CCR 2023 — road salt runoff Lake Michigan' },
    { name: 'Turbidity', level: 0.12, limit: 1, unit: 'NTU', severity: 'low', note: 'Chicago DWM CCR 2023' },
    { name: 'Arsenic', level: 0.3, limit: 10, unit: 'ppb', severity: 'low', note: 'Chicago DWM CCR 2023' },
  ]},
  '44101': { city: 'Cleveland, OH', score: 63, contaminants: [
    { name: 'PFAS (Total)', level: 7.6, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Cleveland Water — Lake Erie source' },
    { name: 'Lead', level: 8, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG — aging lead service lines' },
  ]},
  '43201': { city: 'Columbus, OH', score: 69, contaminants: [
    { name: 'PFAS (Total)', level: 5.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Columbus Division of Water' },
    { name: 'Nitrate', level: 4.8, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG — agricultural runoff Ohio' },
  ]},
  '48201': { city: 'Detroit, MI', score: 57, contaminants: [
    { name: 'PFAS (Total)', level: 9.3, limit: 4, unit: 'ppt', severity: 'high', note: 'GLWA CCR 2023 — Great Lakes Water Authority' },
    { name: 'Lead', level: 12, limit: 15, unit: 'ppb', severity: 'low', note: 'GLWA LCR 2023 — legacy service line replacement underway' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 36, limit: 80, unit: 'ppb', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 22, limit: 60, unit: 'ppb', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Copper', level: 210, limit: 1300, unit: 'ppb', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Hardness', level: 148, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Lake Huron source water' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Nitrate', level: 0.8, limit: 10, unit: 'ppm', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Sodium', level: 22, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'GLWA CCR 2023 — road salt Great Lakes watershed' },
    { name: 'Arsenic', level: 0.4, limit: 10, unit: 'ppb', severity: 'low', note: 'GLWA CCR 2023' },
    { name: 'Turbidity', level: 0.14, limit: 1, unit: 'NTU', severity: 'low', note: 'GLWA CCR 2023' },
  ]},
  '53201': { city: 'Milwaukee, WI', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 6.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Milwaukee Water Works — Lake Michigan' },
    { name: 'Lead', level: 7, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '55101': { city: 'Minneapolis, MN', score: 71, contaminants: [
    { name: 'PFAS (Total)', level: 5.4, limit: 4, unit: 'ppt', severity: 'high', note: 'Minneapolis Water CCR 2023 — 3M PFAS discharge' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 18, limit: 80, unit: 'ppb', severity: 'low', note: 'Minneapolis Water CCR 2023 — Mississippi River source' },
    { name: 'Haloacetic Acids (HAA5)', level: 11, limit: 60, unit: 'ppb', severity: 'low', note: 'Minneapolis Water CCR 2023' },
    { name: 'Lead', level: 2.4, limit: 15, unit: 'ppb', severity: 'low', note: 'Minneapolis Water LCR 2023' },
    { name: 'Copper', level: 128, limit: 1300, unit: 'ppb', severity: 'low', note: 'Minneapolis Water CCR 2023' },
    { name: 'Hardness', level: 162, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Mississippi River / local aquifer blend' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Minneapolis Water CCR 2023' },
    { name: 'Nitrate', level: 1.2, limit: 10, unit: 'ppm', severity: 'low', note: 'Minneapolis Water CCR 2023' },
    { name: 'Sodium', level: 34, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'Minneapolis Water CCR 2023 — road salt Mississippi watershed' },
    { name: 'Arsenic', level: 0.6, limit: 10, unit: 'ppb', severity: 'low', note: 'Minneapolis Water CCR 2023' },
    { name: 'Turbidity', level: 0.08, limit: 1, unit: 'NTU', severity: 'low', note: 'Minneapolis Water CCR 2023' },
  ]},
  '64101': { city: 'Kansas City, MO', score: 65, contaminants: [
    { name: 'PFAS (Total)', level: 7.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Kansas City Water Dept.' },
    { name: 'Nitrate', level: 5.9, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — Missouri River agricultural runoff' },
  ]},
  '63101': { city: 'St. Louis, MO', score: 61, contaminants: [
    { name: 'PFAS (Total)', level: 11.2, limit: 4, unit: 'ppt', severity: 'high', note: 'MSD St. Louis CCR 2023' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 58, limit: 80, unit: 'ppb', severity: 'moderate', note: 'MSD St. Louis CCR 2023 — Mississippi River source' },
    { name: 'Haloacetic Acids (HAA5)', level: 39, limit: 60, unit: 'ppb', severity: 'moderate', note: 'MSD St. Louis CCR 2023' },
    { name: 'Lead', level: 5.8, limit: 15, unit: 'ppb', severity: 'low', note: 'MSD St. Louis LCR 2023' },
    { name: 'Copper', level: 198, limit: 1300, unit: 'ppb', severity: 'low', note: 'MSD St. Louis CCR 2023' },
    { name: 'Nitrate', level: 7.2, limit: 10, unit: 'ppm', severity: 'moderate', note: 'MSD St. Louis CCR 2023 — agricultural runoff Mississippi' },
    { name: 'Hardness', level: 168, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Missouri / Mississippi River blend' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'MSD St. Louis CCR 2023' },
    { name: 'Arsenic', level: 3.1, limit: 10, unit: 'ppb', severity: 'low', note: 'MSD St. Louis CCR 2023' },
    { name: 'Sodium', level: 48, limit: 20, unit: 'mg/L', severity: 'high', note: 'MSD St. Louis CCR 2023 — road salt + agricultural runoff' },
    { name: 'Turbidity', level: 0.21, limit: 1, unit: 'NTU', severity: 'low', note: 'MSD St. Louis CCR 2023' },
  ]},
  '68101': { city: 'Omaha, NE', score: 67, contaminants: [
    { name: 'Nitrate', level: 8.3, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — Missouri River basin — heavy ag runoff' },
    { name: 'PFAS (Total)', level: 5.6, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '50301': { city: 'Des Moines, IA', score: 60, contaminants: [
    { name: 'Nitrate', level: 11.4, limit: 10, unit: 'ppm', severity: 'high', note: 'EWG — DMWW — Des Moines River — elevated nitrates from farmland' },
    { name: 'Atrazine', level: 1.1, limit: 3, unit: 'ppb', severity: 'low', note: 'EWG — herbicide runoff' },
    { name: 'PFAS (Total)', level: 4.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '46201': { city: 'Indianapolis, IN', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 8.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Citizens Energy Group' },
    { name: 'Nitrate', level: 5.4, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — White River agricultural' },
  ]},
  '77001': { city: 'Houston, TX', score: 48, contaminants: [
    { name: 'PFAS (Total)', level: 22.4, limit: 4, unit: 'ppt', severity: 'high', note: 'Houston Water CCR 2023 — industrial PFAS' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 58, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Houston Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 41, limit: 60, unit: 'ppb', severity: 'moderate', note: 'Houston Water CCR 2023' },
    { name: 'Arsenic', level: 5.1, limit: 10, unit: 'ppb', severity: 'moderate', note: 'Houston Water CCR 2023' },
    { name: 'Radium', level: 1.8, limit: 5, unit: 'pCi/L', severity: 'low', note: 'Houston Water CCR 2023' },
    { name: 'Lead', level: 2.1, limit: 15, unit: 'ppb', severity: 'low', note: 'Houston Water LCR 2023' },
    { name: 'Copper', level: 160, limit: 1300, unit: 'ppb', severity: 'low', note: 'Houston Water CCR 2023' },
    { name: 'Hardness', level: 184, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Trinity River / Lake Houston source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Houston Water CCR 2023' },
    { name: 'Nitrate', level: 1.4, limit: 10, unit: 'ppm', severity: 'low', note: 'Houston Water CCR 2023' },
    { name: 'Sodium', level: 68, limit: 20, unit: 'mg/L', severity: 'high', note: 'Houston Water CCR 2023 — elevated naturally' },
    { name: 'Turbidity', level: 0.22, limit: 1, unit: 'NTU', severity: 'low', note: 'Houston Water CCR 2023' },
  ]},
  '78201': { city: 'San Antonio, TX', score: 63, contaminants: [
    { name: 'Radium', level: 3.4, limit: 5, unit: 'pCi/L', severity: 'moderate', note: 'EWG — SAWS — Edwards Aquifer naturally radioactive' },
    { name: 'Arsenic', level: 3.8, limit: 10, unit: 'ppb', severity: 'low', note: 'EWG' },
    { name: 'PFAS (Total)', level: 4.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '75201': { city: 'Dallas, TX', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 13.7, limit: 4, unit: 'ppt', severity: 'high', note: 'Dallas Water Utilities CCR 2023' },
    { name: 'Chromium-6', level: 0.13, limit: 0.1, unit: 'ppb', severity: 'high', note: 'Dallas Water Utilities CCR 2023' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 51, limit: 80, unit: 'ppb', severity: 'moderate', note: 'Dallas Water Utilities CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 34, limit: 60, unit: 'ppb', severity: 'low', note: 'Dallas Water Utilities CCR 2023' },
    { name: 'Lead', level: 3.1, limit: 15, unit: 'ppb', severity: 'low', note: 'Dallas Water LCR 2023' },
    { name: 'Copper', level: 172, limit: 1300, unit: 'ppb', severity: 'low', note: 'Dallas Water CCR 2023' },
    { name: 'Hardness', level: 212, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Trinity River / Lewisville Lake source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Dallas Water CCR 2023' },
    { name: 'Nitrate', level: 1.9, limit: 10, unit: 'ppm', severity: 'low', note: 'Dallas Water CCR 2023' },
    { name: 'Arsenic', level: 2.1, limit: 10, unit: 'ppb', severity: 'low', note: 'Dallas Water CCR 2023' },
    { name: 'Sodium', level: 74, limit: 20, unit: 'mg/L', severity: 'high', note: 'Dallas Water CCR 2023 — Trinity River elevated sodium' },
    { name: 'Turbidity', level: 0.19, limit: 1, unit: 'NTU', severity: 'low', note: 'Dallas Water CCR 2023' },
  ]},
  '76101': { city: 'Fort Worth, TX', score: 60, contaminants: [
    { name: 'PFAS (Total)', level: 10.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Tarrant Regional Water District' },
    { name: 'Chloroform', level: 39, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '78701': { city: 'Austin, TX', score: 72, contaminants: [
    { name: 'PFAS (Total)', level: 5.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Austin Water — Colorado River source' },
    { name: 'Chloroform', level: 22, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '73101': { city: 'Oklahoma City, OK', score: 64, contaminants: [
    { name: 'PFAS (Total)', level: 7.3, limit: 4, unit: 'ppt', severity: 'high', note: 'OKC Water Utilities CCR 2023' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 38, limit: 80, unit: 'ppb', severity: 'low', note: 'OKC Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 24, limit: 60, unit: 'ppb', severity: 'low', note: 'OKC Water CCR 2023' },
    { name: 'Lead', level: 2.1, limit: 15, unit: 'ppb', severity: 'low', note: 'OKC Water LCR 2023' },
    { name: 'Copper', level: 142, limit: 1300, unit: 'ppb', severity: 'low', note: 'OKC Water CCR 2023' },
    { name: 'Nitrate', level: 5.1, limit: 10, unit: 'ppm', severity: 'moderate', note: 'OKC Water CCR 2023' },
    { name: 'Hardness', level: 148, limit: 300, unit: 'mg/L', severity: 'low', note: 'Hard — Lake Hefner source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'OKC Water CCR 2023' },
    { name: 'Arsenic', level: 1.8, limit: 10, unit: 'ppb', severity: 'low', note: 'OKC Water CCR 2023' },
    { name: 'Sodium', level: 44, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'OKC Water CCR 2023' },
    { name: 'Turbidity', level: 0.14, limit: 1, unit: 'NTU', severity: 'low', note: 'OKC Water CCR 2023' },
  ]},
  '70112': { city: 'New Orleans, LA', score: 51, contaminants: [
    { name: 'PFAS (Total)', level: 19.6, limit: 4, unit: 'ppt', severity: 'high', note: 'SWWB CCR 2023 — Mississippi River PFAS' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 68, limit: 80, unit: 'ppb', severity: 'moderate', note: 'SWWB CCR 2023 — high organic matter Mississippi River' },
    { name: 'Haloacetic Acids (HAA5)', level: 47, limit: 60, unit: 'ppb', severity: 'moderate', note: 'SWWB CCR 2023' },
    { name: 'Lead', level: 6.8, limit: 15, unit: 'ppb', severity: 'low', note: 'SWWB LCR 2023 — aging infrastructure' },
    { name: 'Copper', level: 248, limit: 1300, unit: 'ppb', severity: 'low', note: 'SWWB CCR 2023' },
    { name: 'Hardness', level: 148, limit: 300, unit: 'mg/L', severity: 'low', note: 'Moderately hard — Mississippi River source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'SWWB CCR 2023' },
    { name: 'Nitrate', level: 3.2, limit: 10, unit: 'ppm', severity: 'low', note: 'SWWB CCR 2023 — agricultural runoff Mississippi' },
    { name: 'Arsenic', level: 2.8, limit: 10, unit: 'ppb', severity: 'low', note: 'SWWB CCR 2023' },
    { name: 'Sodium', level: 56, limit: 20, unit: 'mg/L', severity: 'high', note: 'SWWB CCR 2023 — Mississippi River saltwater intrusion risk' },
    { name: 'Turbidity', level: 0.28, limit: 1, unit: 'NTU', severity: 'low', note: 'SWWB CCR 2023' },
  ]},
  '87101': { city: 'Albuquerque, NM', score: 69, contaminants: [
    { name: 'Arsenic', level: 4.2, limit: 10, unit: 'ppb', severity: 'low', note: 'EWG — Albuquerque Bernalillo County Water' },
    { name: 'Radium', level: 1.1, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG' },
  ]},
  '85001': { city: 'Phoenix, AZ', score: 62, contaminants: [
    { name: 'Chromium-6', level: 0.21, limit: 0.1, unit: 'ppb', severity: 'high', note: 'Phoenix Water CCR 2023 — Colorado River source' },
    { name: 'Arsenic', level: 6.8, limit: 10, unit: 'ppb', severity: 'moderate', note: 'Phoenix Water CCR 2023 — naturally occurring AZ groundwater' },
    { name: 'PFAS (Total)', level: 7.4, limit: 4, unit: 'ppt', severity: 'high', note: 'Phoenix Water CCR 2023 — Luke AFB area contamination' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 34, limit: 80, unit: 'ppb', severity: 'low', note: 'Phoenix Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 19, limit: 60, unit: 'ppb', severity: 'low', note: 'Phoenix Water CCR 2023' },
    { name: 'Lead', level: 2.2, limit: 15, unit: 'ppb', severity: 'low', note: 'Phoenix Water LCR 2023' },
    { name: 'Copper', level: 148, limit: 1300, unit: 'ppb', severity: 'low', note: 'Phoenix Water CCR 2023' },
    { name: 'Hardness', level: 288, limit: 300, unit: 'mg/L', severity: 'low', note: 'Very hard — Colorado River mineral content' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Phoenix Water CCR 2023' },
    { name: 'Nitrate', level: 2.1, limit: 10, unit: 'ppm', severity: 'low', note: 'Phoenix Water CCR 2023' },
    { name: 'Sodium', level: 98, limit: 20, unit: 'mg/L', severity: 'high', note: 'Phoenix Water CCR 2023 — Colorado River very high sodium' },
    { name: 'Turbidity', level: 0.16, limit: 1, unit: 'NTU', severity: 'low', note: 'Phoenix Water CCR 2023' },
  ]},
  '85701': { city: 'Tucson, AZ', score: 60, contaminants: [
    { name: 'Chromium-6', level: 0.18, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — Tucson Water — Colorado River blend' },
    { name: 'PFAS (Total)', level: 9.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Davis-Monthan AFB contamination' },
  ]},
  '80201': { city: 'Denver, CO', score: 75, contaminants: [
    { name: 'Chromium-6', level: 0.07, limit: 0.1, unit: 'ppb', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'PFAS (Total)', level: 3.8, limit: 4, unit: 'ppt', severity: 'low', note: 'Denver Water CCR 2023 — Buckley SFB — below MCL' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 22, limit: 80, unit: 'ppb', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 14, limit: 60, unit: 'ppb', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Lead', level: 1.9, limit: 15, unit: 'ppb', severity: 'low', note: 'Denver Water LCR 2023' },
    { name: 'Copper', level: 112, limit: 1300, unit: 'ppb', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Hardness', level: 78, limit: 300, unit: 'mg/L', severity: 'low', note: 'Moderately soft — South Platte River / mountain snowmelt' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Nitrate', level: 0.9, limit: 10, unit: 'ppm', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Sodium', level: 18, limit: 20, unit: 'mg/L', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Arsenic', level: 1.2, limit: 10, unit: 'ppb', severity: 'low', note: 'Denver Water CCR 2023' },
    { name: 'Turbidity', level: 0.09, limit: 1, unit: 'NTU', severity: 'low', note: 'Denver Water CCR 2023' },
  ]},
  '89101': { city: 'Las Vegas, NV', score: 59, contaminants: [
    { name: 'Chromium-6', level: 0.19, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — LVVWD — Colorado River industrial contamination' },
    { name: 'PFAS (Total)', level: 8.7, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Lake Mead watershed' },
    { name: 'Arsenic', level: 5.3, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — naturally occurring' },
  ]},
  '98101': { city: 'Seattle, WA', score: 88, contaminants: [
    { name: 'Total Trihalomethanes (TTHMs)', level: 9, limit: 80, unit: 'ppb', severity: 'low', note: 'Seattle Public Utilities CCR 2023 — Cedar River watershed' },
    { name: 'Haloacetic Acids (HAA5)', level: 5, limit: 60, unit: 'ppb', severity: 'low', note: 'SPU CCR 2023' },
    { name: 'PFAS (Total)', level: 1.2, limit: 4, unit: 'ppt', severity: 'low', note: 'SPU CCR 2023 — among cleanest major US utilities' },
    { name: 'Lead', level: 1.8, limit: 15, unit: 'ppb', severity: 'low', note: 'SPU LCR 2023' },
    { name: 'Copper', level: 98, limit: 1300, unit: 'ppb', severity: 'low', note: 'SPU CCR 2023' },
    { name: 'Hardness', level: 22, limit: 300, unit: 'mg/L', severity: 'low', note: 'Very soft — Cedar River / South Fork Tolt watershed' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'SPU CCR 2023' },
    { name: 'Nitrate', level: 0.18, limit: 10, unit: 'ppm', severity: 'low', note: 'SPU CCR 2023 — extremely low' },
    { name: 'Sodium', level: 4, limit: 20, unit: 'mg/L', severity: 'low', note: 'SPU CCR 2023 — very low sodium' },
    { name: 'Turbidity', level: 0.04, limit: 1, unit: 'NTU', severity: 'low', note: 'SPU CCR 2023 — one of cleanest in US' },
    { name: 'Arsenic', level: 0.1, limit: 10, unit: 'ppb', severity: 'low', note: 'SPU CCR 2023' },
  ]},
  '97201': { city: 'Portland, OR', score: 85, contaminants: [
    { name: 'Chloroform', level: 11, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Portland Water Bureau — Bull Run' },
    { name: 'PFAS (Total)', level: 1.8, limit: 4, unit: 'ppt', severity: 'low', note: 'EWG — relatively low' },
  ]},
  '90001': { city: 'Los Angeles, CA', score: 62, contaminants: [
    { name: 'Chromium-6', level: 0.31, limit: 0.1, unit: 'ppb', severity: 'high', note: 'LADWP CCR 2023 — highest of any major US city' },
    { name: 'PFAS (Total)', level: 11.4, limit: 4, unit: 'ppt', severity: 'high', note: 'LADWP CCR 2023 — San Fernando Valley groundwater' },
    { name: 'Arsenic', level: 7.2, limit: 10, unit: 'ppb', severity: 'moderate', note: 'LADWP CCR 2023 — groundwater blend' },
    { name: 'Total Trihalomethanes (TTHMs)', level: 38, limit: 80, unit: 'ppb', severity: 'low', note: 'LADWP CCR 2023' },
    { name: 'Haloacetic Acids (HAA5)', level: 22, limit: 60, unit: 'ppb', severity: 'low', note: 'LADWP CCR 2023' },
    { name: 'Lead', level: 3.4, limit: 15, unit: 'ppb', severity: 'low', note: 'LADWP LCR 2023' },
    { name: 'Copper', level: 180, limit: 1300, unit: 'ppb', severity: 'low', note: 'LADWP CCR 2023' },
    { name: 'Hardness', level: 268, limit: 300, unit: 'mg/L', severity: 'low', note: 'Very hard — Colorado River / local groundwater blend' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'LADWP CCR 2023' },
    { name: 'Nitrate', level: 3.8, limit: 10, unit: 'ppm', severity: 'low', note: 'LADWP CCR 2023' },
    { name: 'Sodium', level: 82, limit: 20, unit: 'mg/L', severity: 'high', note: 'LADWP CCR 2023 — Colorado River sodium' },
    { name: 'Turbidity', level: 0.11, limit: 1, unit: 'NTU', severity: 'low', note: 'LADWP CCR 2023' },
  ]},
  '90210': { city: 'Beverly Hills, CA', score: 82, contaminants: [
    { name: 'Chromium-6', level: 0.05, limit: 0.1, unit: 'ppb', severity: 'low', note: 'EWG — LA DWP' },
    { name: 'Nitrate', level: 2.1, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG' },
  ]},
  '94101': { city: 'San Francisco, CA', score: 84, contaminants: [
    { name: 'Total Trihalomethanes (TTHMs)', level: 13, limit: 80, unit: 'ppb', severity: 'low', note: 'SFPUC CCR 2023 — Hetch Hetchy' },
    { name: 'Haloacetic Acids (HAA5)', level: 8, limit: 60, unit: 'ppb', severity: 'low', note: 'SFPUC CCR 2023' },
    { name: 'PFAS (Total)', level: 2.1, limit: 4, unit: 'ppt', severity: 'low', note: 'SFPUC CCR 2023 — below MCL' },
    { name: 'Lead', level: 2.8, limit: 15, unit: 'ppb', severity: 'low', note: 'SFPUC LCR 2023' },
    { name: 'Copper', level: 142, limit: 1300, unit: 'ppb', severity: 'low', note: 'SFPUC CCR 2023' },
    { name: 'Hardness', level: 58, limit: 300, unit: 'mg/L', severity: 'low', note: 'Soft — Hetch Hetchy Sierra Nevada snowmelt source' },
    { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'SFPUC CCR 2023' },
    { name: 'Nitrate', level: 0.4, limit: 10, unit: 'ppm', severity: 'low', note: 'SFPUC CCR 2023 — very low' },
    { name: 'Sodium', level: 9, limit: 20, unit: 'mg/L', severity: 'low', note: 'SFPUC CCR 2023 — very low sodium' },
    { name: 'Turbidity', level: 0.06, limit: 1, unit: 'NTU', severity: 'low', note: 'SFPUC CCR 2023 — among cleanest major US utilities' },
    { name: 'Arsenic', level: 0.2, limit: 10, unit: 'ppb', severity: 'low', note: 'SFPUC CCR 2023' },
  ]},
  '92101': { city: 'San Diego, CA', score: 66, contaminants: [
    { name: 'Chromium-6', level: 0.22, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — San Diego — Colorado River blend' },
    { name: 'PFAS (Total)', level: 10.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Camp Pendleton PFAS plume' },
  ]},
  '93301': { city: 'Bakersfield, CA', score: 53, contaminants: [
    { name: 'Arsenic', level: 8.9, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — San Joaquin Valley groundwater' },
    { name: 'Nitrate', level: 12.1, limit: 10, unit: 'ppm', severity: 'high', note: 'EWG — agricultural runoff — San Joaquin Valley' },
    { name: 'Chromium-6', level: 0.28, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — Kern County' },
  ]},
  '96801': { city: 'Honolulu, HI', score: 79, contaminants: [
    { name: 'PFAS (Total)', level: 6.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Oahu — PFAS from Red Hill fuel facility' },
    { name: 'Nitrate', level: 2.9, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG' },
  ]},
  '29201': { city: 'Columbia, SC', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 14.7, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Columbia Water — PFAS from Congaree River' },
    { name: 'Chloroform', level: 41, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '39201': { city: 'Jackson, MS', score: 38, contaminants: [
    { name: 'Lead', level: 28, limit: 15, unit: 'ppb', severity: 'high', note: 'EWG — Jackson water crisis — aging infrastructure' },
    { name: 'PFAS (Total)', level: 9.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Pearl River watershed' },
    { name: 'Chloroform', level: 51, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG — treatment inconsistencies' },
  ]},
  '25301': { city: 'Charleston, WV', score: 57, contaminants: [
    { name: 'PFAS (Total)', level: 12.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — WV American Water — Elk River history' },
    { name: 'Chloroform', level: 43, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '02169': { city: 'Quincy, MA', score: 91, contaminants: [] },
  '02188': { city: 'Weymouth, MA', score: 94, contaminants: [] },
  '02189': { city: 'East Weymouth, MA', score: 94, contaminants: [] },
  '02190': { city: 'South Weymouth, MA', score: 94, contaminants: [] },
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
  '1040': 'Lead', '1020': 'Arsenic', '2456': 'Nitrate', '2050': 'Fluoride',
  '4010': 'Total Coliform', '5000': 'Chlorine', PB90: 'Lead', CU90: 'Copper',
  '1030': 'Chromium', '2030': 'Fluoride', '1000': 'Antimony', '2010': 'Barium',
  '2950': 'Total Trihalomethanes (TTHMs)', '4000': 'Haloacetic Acids (HAA5)',
  '1005': 'Arsenic', '1025': 'Barium', '2039': 'Atrazine', '4100': 'Radium-226',
  '1045': 'Chromium', '2003': 'Fluoride', '1095': 'Selenium',
  '1085': 'Mercury', '1074': 'Nitrite', '1038': 'Cadmium',
};

// ─── Build UCMR5 contaminants from compact format ────────────────────────────
function getPfasForPwsid(pwsid: string): any[] {
  const row = ucmr5[pwsid];
  if (!row || !Array.isArray(row[2])) return [];
  const analytes: any[] = row[2]; // [[analyte, ppt, hasMCL, overMCL], ...]

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
          ? `EXCEEDS EPA MCL of ${mclPpt} ppt — EPA UCMR5 2023-2025`
          : hasMCL
            ? `Below EPA MCL of ${mclPpt} ppt — EPA UCMR5 2023-2025`
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
    const res = await fetch(url, { next: { revalidate: 86400 } });
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
    // ECHO SDWA enforcement actions for this facility
    const url = `https://echodata.epa.gov/echo/sdw_rest_services.get_facility_info?output=JSON&p_pwsid=${encodeURIComponent(pwsid)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
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
    const res = await fetch(url, { next: { revalidate: 86400 } });
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

  const t0 = Date.now();

  try {
    let pwsid: string;
    let pwsName: string;
    let cityName: string;
    let stateCode: string = '';
    let popCount: string | null = null;
    let srcCode = '';

    const override = PWSID_OVERRIDES[zip];
    if (override) {
      pwsid     = override.pwsid;
      pwsName   = override.utility;
      cityName  = override.city.split(',')[0].trim();
      stateCode = override.city.includes(',') ? override.city.split(',')[1].trim().split(' ')[0] : '';
      try {
        const rows: any[] = await epaGet(`WATER_SYSTEM/PWSID/${override.pwsid}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`);
        if (rows?.length) {
          pwsName  = f(rows[0], 'pws_name') || pwsName;
          srcCode  = f(rows[0], 'primary_source_code') || '';
          popCount = f(rows[0], 'population_served_count');
          stateCode = f(rows[0], 'state_code') || stateCode;
        }
      } catch { /* keep hardcoded */ }
    } else {
      let systems: any[] = await epaGet(
        `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/PWS_TYPE_CODE/CWS/rows/1:10/JSON`
      ).catch(() => []);
      if (!Array.isArray(systems) || !systems.length) {
        systems = await epaGet(
          `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
        ).catch(() => []);
      }
      if (!Array.isArray(systems) || !systems.length) {
        systems = await epaGet(
          `WATER_SYSTEM/ZIP_CODE/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
        ).catch(() => []);
      }
      if (!Array.isArray(systems) || !systems.length) {
        const local = ZIP_LOOKUP[zip];
        if (local?.p) {
          const rows: any[] = await epaGet(
            `WATER_SYSTEM/PWSID/${local.p}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`
          ).catch(() => []);
          if (Array.isArray(rows) && rows.length) systems = rows;
        }
      }
      if (!Array.isArray(systems) || !systems.length) {
        const geoRows: any[] = await epaGet(
          `GEOGRAPHIC_AREA/ZIP_CODE_SERVED/${zip}/rows/1:10/JSON`
        ).catch(() => []);
        if (Array.isArray(geoRows) && geoRows.length) {
          const pwsids = Array.from(new Set(geoRows.map((r: any) => f(r, 'pwsid')).filter(Boolean)));
          for (const p of pwsids) {
            const rows: any[] = await epaGet(
              `WATER_SYSTEM/PWSID/${p}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`
            ).catch(() => []);
            if (Array.isArray(rows) && rows.length) {
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
    const [violations, lcr, sdwaSamples, usgsData, echoData, usgsHardness] = await Promise.all([
      epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`).catch(() => []),
      epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:30/JSON`).catch(() => []),
      epaGet(`SDWA_SAMPLES/PWSID/${pwsid}/rows/1:100/JSON`).catch(() => []),
      stateCode ? getUsgsSourceWater(stateCode) : Promise.resolve(null),
      getEchoEnforcement(pwsid),
      stateCode ? getUsgsHardnessTDS(stateCode) : Promise.resolve([]),
    ]);
    const viols: any[] = Array.isArray(violations) ? violations : [];
    const allSamples = [...(Array.isArray(lcr) ? lcr : []), ...(Array.isArray(sdwaSamples) ? sdwaSamples : [])];

    /** Winning sample by max raw measure; ppb display converts mg/L → ppb when UOM says mg/L */
    const maxSampleLevel = (hits: any[], displayUnit: string): number => {
      if (!hits.length) return 0;
      let bestRaw = -Infinity;
      let bestHit: any = null;
      for (const s of hits) {
        const v = parseFloat(f(s, 'sample_measure')) || 0;
        if (v > bestRaw) {
          bestRaw = v;
          bestHit = s;
        }
      }
      if (!Number.isFinite(bestRaw)) return 0;
      if (displayUnit === 'ppb' && bestHit) {
        const u = String(f(bestHit, 'unit_of_measure') || '').toLowerCase();
        if (u.includes('mg/l')) return bestRaw * 1000;
      }
      return bestRaw;
    };

    // ─── Scoring ────────────────────────────────────────────────────────────
    let score = 100;
    const openV   = viols.filter(v => (f(v, 'violation_status_code') || '') === 'O');
    const healthV = viols.filter(v => ['MCL', 'MRDL', 'TT'].includes(f(v, 'violation_category_code') || ''));
    score -= Math.min(openV.length * 8, 40);
    score -= Math.min(healthV.length * 6, 30);

    const leadS = allSamples.filter(s => ['PB90', '1040'].includes(f(s, 'contaminant_code') || ''));
    const leadPpbFromApi = maxSampleLevel(leadS, 'ppb');
    const leadMgCsv = LCR_DATA[pwsid]?.lead;
    const leadPpb = Math.max(
      leadPpbFromApi,
      leadMgCsv != null && Number.isFinite(leadMgCsv) ? leadMgCsv * 1000 : 0,
    );
    if (leadPpb > 0) {
      if (leadPpb > 15) score -= 20;
      else if (leadPpb > 10) score -= 12;
      else if (leadPpb > 5) score -= 5;
    }

    const pfasContaminants = getPfasForPwsid(pwsid);
    const pfasAboveMcl     = pfasContaminants.filter(p => p.severity === 'high');
    score -= Math.min(pfasAboveMcl.length * 10, 25);

    const ewg = EWG[zip];
    if (ewg?.score !== undefined) {
      score = Math.round(score * 0.6 + ewg.score * 0.4);
    }
    score = Math.max(Math.min(score, 100), 10);

    // Consumer-facing offset — chlorine/DBPs, taste/odor, and plumbing risks not fully
    // reflected in EPA violation summaries. Applied here so home, /results/[zip], and OG tags match.
    score = Math.max(0, score - 10);

    // ─── National percentile (based on score distribution) ──────────────────
    // Score distribution approximation from EPA SDWIS + UCMR5 population
    // ~45M Americans have PFAS > MCL → roughly bottom 35% of population
    const nationalPercentile =
      score >= 90 ? 95 :
      score >= 85 ? 88 :
      score >= 80 ? 78 :
      score >= 75 ? 68 :
      score >= 70 ? 58 :
      score >= 65 ? 45 :
      score >= 60 ? 33 :
      score >= 55 ? 22 :
      score >= 50 ? 15 : 8;

    // ─── Contaminants ────────────────────────────────────────────────────────
    const contaminants: any[] = [];
    const addC = (name: string, codes: string[], limit: number, unit: string) => {
      const hits = allSamples.filter(s => codes.includes(f(s, 'contaminant_code') || ''));
      if (!hits.length) return;
      const val = maxSampleLevel(hits, unit);
      const ctx = HEALTH_CONTEXT[name];
      const ewgG = EWG_GUIDELINES[name];
      const ewgTimesOver = ewgG && ewgG.limit > 0 && val > 0 ? +(val / ewgG.limit).toFixed(1) : null;
      contaminants.push({
        name, level: +val.toFixed(2), limit, unit,
        severity: val > limit ? 'high' : val > limit * 0.5 ? 'moderate' : 'low',
        note: `${hits.length} sample(s) — EPA Action Level: ${limit} ${unit}`,
        source: 'EPA LCR',
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
        ewgGuideline: ewgG?.limit ?? null,
        ewgGuidelineLabel: ewgG?.label ?? null,
        ewgTimesOver,
      });
    };
    addC('Lead',   ['PB90', '1040'], 15,   'ppb');
    addC('Copper', ['CU90', '1020'], 1300, 'ppb');
    addC('Arsenic', ['1005', '1020'], 10, 'ppb');
    addC('Nitrate', ['2456'], 10, 'ppm');
    addC('Nitrite', ['1074'], 1, 'ppm');
    addC('Total Trihalomethanes (TTHMs)', ['2950'], 80, 'ppb');
    addC('Haloacetic Acids (HAA5)', ['4000'], 60, 'ppb');
    addC('Fluoride', ['2050', '2003', '2030'], 4, 'ppm');
    addC('Chromium', ['1030', '1045'], 100, 'ppb');
    addC('Selenium', ['1095'], 50, 'ppb');
    addC('Barium', ['2010', '1025'], 2000, 'ppb');
    addC('Radium (combined)', ['4100'], 5, 'pCi/L');
    addC('Total Coliform', ['4010'], 0, 'presence');
    addC('Atrazine', ['2039'], 3, 'ppb');

    // Add lead/copper from static LCR dataset if not already found from live API
    const lcrStatic = LCR_DATA[pwsid];
    if (lcrStatic) {
      const leadMg = lcrStatic.lead;
      if (leadMg != null && Number.isFinite(leadMg) && leadMg >= 0 && !contaminants.find(c => c.name === 'Lead')) {
        const val = +(leadMg * 1000).toFixed(2); // mg/L to ppb
        const displayVal = val === 0 ? 0.5 : val; // show minimum detectable level if zero
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

    // Add EWG data
    if (ewg?.contaminants) {
      for (const ec of ewg.contaminants) {
        if (!contaminants.find(c => c.name === ec.name)) {
          const ctx = HEALTH_CONTEXT[ec.name];
          contaminants.push({
            ...ec, source: 'EWG Tap Water Atlas',
            healthEffects: ctx?.effects,
            healthSources: ctx?.sources,
            epaAction: ctx?.epa_action,
          });
        }
      }
    }
    if (usgsHardness?.length) {
      for (const h of usgsHardness) {
        if (!contaminants.find(c => c.name === h.name)) {
          contaminants.push(h);
        }
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
    const dataSources = ['EPA SDWIS'];
    if (LCR_DATA[pwsid]) dataSources.push('EPA LCR National Dataset');
    if (pfasCount > 0) dataSources.push('EPA UCMR5 PFAS');
    if (ewg)           dataSources.push('EWG Tap Water Atlas');
    if (usgsData)      dataSources.push('USGS NWIS');
    if (lithiumVal)    dataSources.push('UCMR5 Lithium');
    if (echoData)      dataSources.push('EPA ECHO Enforcement');

    const summary = openCount > 0
      ? `${pwsName} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${pwsName} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${pwsName} has no recorded violations in the EPA SDWIS database.`;

    const pfasSummary = pfasCount > 0
      ? pfasAbove > 0
        ? `⚠️ ${pfasAbove} PFAS compound(s) detected above EPA MCL limits (2024 rule).`
        : `${pfasCount} PFAS compound(s) detected — all below current EPA MCL limits.`
      : null;

    logWaterLookup({
      zip,
      outcome: 'ok',
      pwsid,
      ms: Date.now() - t0,
      hasEwg: !!ewg,
      pfasCount,
      openViolations: openCount,
    });

    return NextResponse.json({
      zip,
      city:             [cityName, stateCode].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName:       pwsName,
      pwsid,
      stateCode,
      score,
      grade:            scoreToLetterGrade(score),
      nationalPercentile,
      population:       popCount ? parseInt(popCount).toLocaleString() : null,
      sourceType:       srcCode === 'SW' ? 'Surface Water'
                      : srcCode === 'GW' ? 'Groundwater'
                      : srcCode === 'GU' ? 'Groundwater (surface influenced)'
                      : 'Municipal',
      dataSource:       dataSources.join(' + '),
      dataSources,
      dataFreshness:    getDataFreshness(),
      openViolations:   openCount,
      totalViolations:  viols.length,
      hasLCR:           allSamples.length > 0 || !!(LCR_DATA[pwsid]?.lead || LCR_DATA[pwsid]?.copper),
      hasEWG:           !!ewg,
      hasPFAS:          pfasCount > 0,
      pfasCount,
      pfasAboveMcl:     pfasAbove,
      ucmr5:            ucmr5Summary,
      usgs:             usgsData,
      contaminants,
      violations:       fmtViols,
      echo:             echoData,
      summary,
      pfasSummary,
    }, { headers: H });

  } catch (err: any) {
    logWaterLookup({ zip, outcome: 'error', ms: Date.now() - t0, message: String(err?.message || err) });
    return NextResponse.json({ error: err.message || 'EPA API error' }, { status: 500, headers: H });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}
