import type { WaterProfile } from '@/app/water/[city]/cities-data';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import type { CityPfasSnapshot } from '@/lib/city-water-score';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { getPwsidCcrContaminants } from '@/lib/pwsid-ccr-contaminants';
import { enrichContaminantRows } from '@/lib/contaminant-benchmarks';
import { sortContaminants, type ContaminantRow } from '@/lib/water-contaminants';

const PFAS_MCL_PPT: Record<string, number> = {
  PFOA: 4,
  PFOS: 4,
  PFNA: 10,
  PFHxS: 10,
  'HFPO-DA': 10,
};

function pfasRows(pfas: CityPfasSnapshot): ContaminantRow[] {
  if (!pfas?.compounds?.length) return [];
  return pfas.compounds
    .filter(([, level]) => level > 0)
    .map(([analyte, level, overEpa, overHealth]) => {
      const mcl = PFAS_MCL_PPT[analyte] ?? null;
      const severity =
        overEpa > 0 ? 'high' as const : overHealth > 0 ? 'moderate' as const : 'low' as const;
      return {
        name: analyte,
        level,
        limit: mcl,
        unit: 'ppt',
        severity,
        note: 'EPA UCMR5 monitoring (2023–2025)',
        source: 'EPA UCMR5',
        isPFAS: true,
        healthEffects:
          'PFAS (“forever chemicals”) persist in the body. NSF 58 reverse osmosis or NSF P473-certified filters remove PFAS at the tap — standard pitchers do not.',
      };
    });
}

function hardnessRow(profile?: WaterProfile): ContaminantRow | null {
  const h = profile?.hardness;
  if (h == null || !Number.isFinite(h)) return null;
  const severity = h > 250 ? 'moderate' as const : h > 150 ? 'low' as const : 'low' as const;
  return {
    name: 'Water Hardness',
    level: h,
    limit: 150,
    unit: 'mg/L',
    severity,
    note: profile?.source ? `From ${profile.source}` : 'CCR / utility average',
    source: 'Consumer Confidence Report',
  };
}

function mergeByName(rows: ContaminantRow[]): ContaminantRow[] {
  const byName = new Map<string, ContaminantRow>();
  for (const row of rows) {
    const prev = byName.get(row.name);
    if (!prev || (row.level ?? 0) > (prev.level ?? 0)) byName.set(row.name, row);
  }
  return sortContaminants(Array.from(byName.values()));
}

/** City-page contaminant table: UCMR5 PFAS + packaged EWG/CCR + optional CCR hardness. */
export function buildCityContaminantDisplay(
  slug: string,
  fallbackPwsid: string,
  waterProfile?: WaterProfile,
  limit = 18,
  zip?: string,
  stateCode?: string,
): ContaminantRow[] {
  const pwsid = resolveCityPwsid(slug, fallbackPwsid, zip);
  const pfas = getCityPfasData(pwsid);
  const rows = mergeByName([
    ...pfasRows(pfas),
    ...getPwsidCcrContaminants(pwsid),
    ...(hardnessRow(waterProfile) ? [hardnessRow(waterProfile)!] : []),
  ]);
  return enrichContaminantRows(rows.slice(0, limit), stateCode ?? '');
}
