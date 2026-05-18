/**
 * CCR / state monitoring averages keyed by PWSID — used when live EPA sample APIs
 * return only LCR lead/copper (common) but utility reporting has fuller chemistry.
 */

import type { ContaminantRow } from '@/lib/water-contaminants';

type CcrSeed = Omit<ContaminantRow, 'source'> & { source?: string };

function seeds(rows: CcrSeed[]): ContaminantRow[] {
  return rows.map(r => ({
    ...r,
    source: r.source ?? 'Utility CCR / state monitoring',
  }));
}

/** MWRA wholesale — representative of MWRA-connected communities */
const MWRA_CCR = seeds([
  { name: 'Total Trihalomethanes (TTHMs)', level: 28, limit: 80, unit: 'ppb', severity: 'low', note: 'MWRA CCR 2023 — Quabbin/Wachusett' },
  { name: 'Haloacetic Acids (HAA5)', level: 18, limit: 60, unit: 'ppb', severity: 'low', note: 'MWRA CCR 2023' },
  { name: 'Chloramine', level: 2.1, limit: 4, unit: 'ppm', severity: 'low', note: 'MWRA uses chloramine disinfection' },
  { name: 'Copper', level: 140, limit: 1300, unit: 'ppb', severity: 'low', note: 'MWRA LCR 90th percentile' },
  { name: 'Hardness', level: 45, limit: 300, unit: 'mg/L', severity: 'low', note: 'Soft — MWRA reservoir source' },
  { name: 'Fluoride', level: 0.7, limit: 4, unit: 'ppm', severity: 'low', note: 'MWRA CCR 2023' },
  { name: 'Nitrate', level: 0.28, limit: 10, unit: 'ppm', severity: 'low', note: 'MWRA CCR 2023' },
  { name: 'Sodium', level: 12, limit: 20, unit: 'mg/L', severity: 'low', note: 'MWRA CCR 2023' },
  { name: 'Turbidity', level: 0.1, limit: 1, unit: 'NTU', severity: 'low', note: 'MWRA CCR 2023' },
  { name: 'Arsenic', level: 0.5, limit: 10, unit: 'ppb', severity: 'low', note: 'MWRA CCR 2023' },
]);

/** Town of Weymouth — MA DEP / EWG Tap Water Atlas utility averages (2021–2023) */
const WEYMOUTH_CCR = seeds([
  { name: 'Total Trihalomethanes (TTHMs)', level: 36.3, limit: 80, unit: 'ppb', severity: 'low', note: 'MA DEP avg — EWG Tap Water Atlas' },
  { name: 'Haloacetic Acids (HAA5)', level: 9.53, limit: 60, unit: 'ppb', severity: 'low', note: 'MA DEP avg — EWG Tap Water Atlas' },
  { name: 'Chloroform', level: 16.9, limit: 80, unit: 'ppb', severity: 'low', note: 'MA DEP avg — disinfection byproduct' },
  { name: 'Bromodichloromethane', level: 9.61, limit: 80, unit: 'ppb', severity: 'low', note: 'MA DEP avg — disinfection byproduct' },
  { name: 'Dibromochloromethane', level: 5.43, limit: 80, unit: 'ppb', severity: 'low', note: 'MA DEP avg — disinfection byproduct' },
  { name: 'Dichloroacetic Acid', level: 5.09, limit: 60, unit: 'ppb', severity: 'low', note: 'MA DEP avg — HAA5 component' },
  { name: 'Trichloroacetic Acid', level: 3.76, limit: 60, unit: 'ppb', severity: 'low', note: 'MA DEP avg — HAA5 component' },
  { name: 'Chromium-6', level: 0.078, limit: 100, unit: 'ppb', severity: 'low', note: 'MA DEP avg — no federal Cr-6 MCL' },
  { name: 'Fluoride', level: 0.644, limit: 4, unit: 'ppm', severity: 'low', note: 'Weymouth CCR / MA DEP' },
  { name: 'Barium', level: 16.3, limit: 2000, unit: 'ppb', severity: 'low', note: 'MA DEP avg' },
  { name: 'Manganese', level: 0.018, limit: 0.05, unit: 'ppm', severity: 'low', note: 'MA DEP avg 17.6 ppb — below EPA secondary 0.05 ppm' },
  { name: 'Copper', level: 180, limit: 1300, unit: 'ppb', severity: 'low', note: 'Weymouth CCR — LCR distribution' },
  { name: 'Nitrate', level: 0.4, limit: 10, unit: 'ppm', severity: 'low', note: 'Weymouth CCR' },
  { name: 'Sodium', level: 22, limit: 20, unit: 'mg/L', severity: 'moderate', note: 'MA DEP avg — taste advisory 20 mg/L' },
  { name: 'Chlorate', level: 15.1, limit: 210, unit: 'ppb', severity: 'low', note: 'MA DEP avg — UCMR benchmark 210 ppb' },
  { name: 'Hardness', level: 95, limit: 300, unit: 'mg/L', severity: 'low', note: 'Groundwater blend — moderately hard' },
  { name: 'Turbidity', level: 0.15, limit: 1, unit: 'NTU', severity: 'low', note: 'Weymouth CCR' },
]);

const PWSID_CCR: Record<string, ContaminantRow[]> = {
  MA3218010: MWRA_CCR,
  MA3229000: WEYMOUTH_CCR,
};

/**
 * Fill gaps when EPA live samples are sparse (typical: LCR lead only).
 * Does not overwrite analytes already measured from EPA, UCMR, or EWG zip data.
 */
export function mergePwsidCcrContaminants(
  target: ContaminantRow[],
  pwsid: string,
  options?: { minMeasuredBeforeFill?: number },
): void {
  const template = PWSID_CCR[pwsid];
  if (!template?.length) return;

  const min = options?.minMeasuredBeforeFill ?? 8;
  const measured = target.filter(c => c.level != null && !c.violationBased).length;
  if (measured >= min) return;

  const names = new Set(target.map(c => c.name));
  for (const row of template) {
    if (names.has(row.name)) continue;
    target.push({ ...row });
    names.add(row.name);
  }
}
