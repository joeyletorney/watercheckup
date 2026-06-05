import { CITIES } from '@/app/water/[city]/cities-data';
import { resolveCityPwsid } from './city-pwsid';
import { computeCityWaterScore, getCityKeyFinding } from './city-water-score';
import { getCityPfasData } from './ucmr5-city-pfas';
import { getUcmrHardnessMgL, buildStateHardnessTable } from './water-hardness';
import { analyzeHardnessMgL } from './water-hardness-shared';

export type CityScoreRow = {
  slug: string;
  name: string;
  state: string;
  population: string;
  score: number;
  grade: string;
  gradeColor: string;
  label: string;
  keyFinding: string;
};

function buildAllCityScoreRows(): CityScoreRow[] {
  return Object.entries(CITIES).map(([slug, cd]) => {
    const pfas = getCityPfasData(resolveCityPwsid(slug, cd.pwsid, cd.zip));
    const ws = computeCityWaterScore(cd, pfas);
    return {
      slug,
      name: cd.name,
      state: cd.state,
      population: cd.population,
      score: ws.score,
      grade: ws.grade,
      gradeColor: ws.gradeColor,
      label: ws.label,
      keyFinding: getCityKeyFinding(cd.urgency, cd.issues, pfas),
    };
  });
}

/** Lowest Water Safety Score first (worst exposure profile). */
export function buildWorstCitiesBySafetyScore(limit = 20): CityScoreRow[] {
  return [...buildAllCityScoreRows()]
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** Highest Water Safety Score first. */
export function buildBestCitiesBySafetyScore(limit = 10): CityScoreRow[] {
  return [...buildAllCityScoreRows()]
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}

const LEAD_ISSUE_RE = /lead|service line|lsl/i;

/** Cities with lead called out in profiles — sorted by safety score (lowest first). */
export function buildLeadRiskCities(): CityScoreRow[] {
  return buildAllCityScoreRows()
    .filter((row) => {
      const cd = CITIES[row.slug];
      return cd.issues.some((i) => LEAD_ISSUE_RE.test(i));
    })
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
}

export type CityHardnessRow = {
  slug: string;
  name: string;
  state: string;
  hardnessMgL: number;
  tierLabel: string;
  source: string;
};

function cityHardnessMgL(slug: string, cd: (typeof CITIES)[string]): number | null {
  const profile = cd.waterProfile?.hardness;
  if (profile != null && Number.isFinite(profile)) return profile;
  const ucmr = getUcmrHardnessMgL(resolveCityPwsid(slug, cd.pwsid, cd.zip));
  return ucmr;
}

export function buildHardestCities(limit = 20): CityHardnessRow[] {
  const rows: CityHardnessRow[] = [];
  for (const [slug, cd] of Object.entries(CITIES)) {
    const h = cityHardnessMgL(slug, cd);
    if (h == null) continue;
    const { label } = analyzeHardnessMgL(h);
    rows.push({
      slug,
      name: cd.name,
      state: cd.state,
      hardnessMgL: Math.round(h * 10) / 10,
      tierLabel: label,
      source: cd.waterProfile?.source ?? 'EPA UCMR5 monitoring',
    });
  }
  return rows.sort((a, b) => b.hardnessMgL - a.hardnessMgL).slice(0, limit);
}

export { buildStateHardnessTable };

export type CityPfasMclRow = {
  slug: string;
  name: string;
  state: string;
  violations: number;
  maxPpt: number;
  worstCompound: string;
  worstPpt: number;
};

export function buildCitiesWithPfasMclViolations(limit = 20): CityPfasMclRow[] {
  const rows: CityPfasMclRow[] = [];
  for (const [slug, cd] of Object.entries(CITIES)) {
    const pfas = getCityPfasData(resolveCityPwsid(slug, cd.pwsid, cd.zip));
    if (!pfas) continue;
    const overMcl = pfas.compounds.filter(([, , overEpa]) => overEpa > 0);
    if (pfas.violations === 0 && overMcl.length === 0) continue;
    const worst = [...pfas.compounds].sort((a, b) => b[1] - a[1])[0];
    rows.push({
      slug,
      name: cd.name,
      state: cd.state,
      violations: pfas.violations,
      maxPpt: pfas.maxPpt,
      worstCompound: worst?.[0] ?? '—',
      worstPpt: worst?.[1] ?? 0,
    });
  }
  return rows
    .sort((a, b) => b.violations - a.violations || b.worstPpt - a.worstPpt)
    .slice(0, limit);
}

export type CityUnregulatedPeakRow = {
  slug: string;
  name: string;
  state: string;
  maxPpt: number;
  peakCompound: string;
};

/** High total PFAS peaks where regulated MCL violations are zero (e.g. 6:2 FTS). */
export function buildCitiesWithUnregulatedPfasPeaks(limit = 20): CityUnregulatedPeakRow[] {
  const rows: CityUnregulatedPeakRow[] = [];
  for (const [slug, cd] of Object.entries(CITIES)) {
    const pfas = getCityPfasData(resolveCityPwsid(slug, cd.pwsid, cd.zip));
    if (!pfas || pfas.violations > 0 || pfas.maxPpt < 20) continue;
    const overMcl = pfas.compounds.some(([, , overEpa]) => overEpa > 0);
    if (overMcl) continue;
    const peak = [...pfas.compounds].sort((a, b) => b[1] - a[1])[0];
    if (!peak) continue;
    rows.push({
      slug,
      name: cd.name,
      state: cd.state,
      maxPpt: pfas.maxPpt,
      peakCompound: peak[0],
    });
  }
  return rows.sort((a, b) => b.maxPpt - a.maxPpt).slice(0, limit);
}

const PFOA_MCL_PPT = 4;

export type CityPfoaAtLimitRow = {
  slug: string;
  name: string;
  state: string;
  pfoaPpt: number;
  /** True when level ≥ 4 ppt or UCMR5 over-EPA flag */
  atOrOverMcl: boolean;
  timesOverMcl: number;
  pwsid: string;
};

/** Tracked metros with PFOA at or above the EPA 4 ppt MCL in UCMR5 (2023–2025). */
export function buildCitiesWithPfoaAtEpaLimit(minPpt = 3.8, limit = 30): CityPfoaAtLimitRow[] {
  const rows: CityPfoaAtLimitRow[] = [];
  for (const [slug, cd] of Object.entries(CITIES)) {
    const pwsid = resolveCityPwsid(slug, cd.pwsid, cd.zip);
    const pfas = getCityPfasData(pwsid);
    if (!pfas) continue;
    const pfoa = pfas.compounds.find(([name]) => name === 'PFOA');
    if (!pfoa || pfoa[1] < minPpt) continue;
    const [, level, overEpa] = pfoa;
    rows.push({
      slug,
      name: cd.name,
      state: cd.state,
      pfoaPpt: level,
      atOrOverMcl: level >= PFOA_MCL_PPT || overEpa > 0,
      timesOverMcl: Math.round((level / PFOA_MCL_PPT) * 10) / 10,
      pwsid,
    });
  }
  return rows
    .sort((a, b) => b.pfoaPpt - a.pfoaPpt || a.name.localeCompare(b.name))
    .slice(0, limit);
}
