import { CITIES } from '@/app/water/[city]/cities-data';
import ucmr5Raw from '@/lib/ucmr5.json';

/** UCMR5: [maxPFASppt, violations, [[name, level, overEPALimit, overHealthLimit], ...], hardness?] */
const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'Washington DC',
};

export function stateAbbrToUrlSlug(abbr: string): string {
  const name = STATE_NAMES[abbr];
  if (!name) return abbr.toLowerCase();
  return name.toLowerCase().replace(/\s+/g, '-');
}

function getPfas(pwsid: string) {
  const e = UCMR5[pwsid];
  if (!e) return null;
  const [, violations, compounds] = e;
  return { violations, compounds };
}

/** MCL violation or any UCMR analyte flagged over EPA limit (state table / at-risk %). */
export function isCityAtRisk(cd: (typeof CITIES)[string]): boolean {
  const p = getPfas(cd.pwsid);
  if (!p) return false;
  if (p.violations > 0) return true;
  return p.compounds.some(([, , overEpa]) => overEpa > 0);
}

export function isCitySafeBand(cd: (typeof CITIES)[string]): boolean {
  if (isCityAtRisk(cd)) return false;
  return cd.urgency === 'low';
}

/** Summary stat: state has ≥1 city over EPA MCL flag or health advisory flag in UCMR, or violation count. */
export function stateHasCityAboveGuidelines(stateAbbr: string): boolean {
  const cities = Object.values(CITIES).filter((cd) => cd.state === stateAbbr);
  for (const cd of cities) {
    const p = getPfas(cd.pwsid);
    if (!p) continue;
    if (p.violations > 0) return true;
    if (p.compounds.some(([, , overEpa, overHealth]) => overEpa > 0 || overHealth > 0)) return true;
  }
  return false;
}

export function letterGradeFromPctAtRisk(pct: number, totalCities: number): { grade: string; gradeColor: string } {
  if (totalCities <= 0) return { grade: '—', gradeColor: '#64748b' };
  if (pct <= 10) return { grade: 'A', gradeColor: '#22d3ee' };
  if (pct <= 25) return { grade: 'B', gradeColor: '#86efac' };
  if (pct <= 50) return { grade: 'C', gradeColor: '#fbbf24' };
  if (pct < 75) return { grade: 'D', gradeColor: '#f97316' };
  return { grade: 'F', gradeColor: '#ef4444' };
}

function worstContaminantForState(stateAbbr: string): string {
  const cities = Object.values(CITIES).filter((cd) => cd.state === stateAbbr);
  let bestName = '—';
  let bestMax = -1;
  for (const cd of cities) {
    const p = getPfas(cd.pwsid);
    if (!p) continue;
    for (const [name, level] of p.compounds) {
      if (level > bestMax) {
        bestMax = level;
        bestName = name;
      } else if (level === bestMax && level > 0 && name.localeCompare(bestName) < 0) {
        bestName = name;
      }
    }
  }
  return bestMax > 0 ? bestName : '—';
}

export type StateRankingRowSerializable = {
  stateAbbr: string;
  stateName: string;
  stateSlug: string;
  rank: number;
  grade: string;
  gradeColor: string;
  pctAtRisk: number;
  totalCities: number;
  citiesAtRisk: number;
  citiesSafe: number;
  worstContaminant: string;
};

export function buildStateRankingRows(): {
  rows: StateRankingRowSerializable[];
  statesWithGuidelinesConcern: number;
  worstCities: { slug: string; name: string; state: string; contaminantCount: number }[];
} {
  const abbreviations = Object.keys(STATE_NAMES).sort((a, b) => a.localeCompare(b));

  const partial = abbreviations.map((abbr) => {
    const citiesInState = Object.entries(CITIES).filter(([, cd]) => cd.state === abbr);
    const totalCities = citiesInState.length;
    let citiesAtRisk = 0;
    let citiesSafe = 0;
    for (const [, cd] of citiesInState) {
      if (isCityAtRisk(cd)) citiesAtRisk += 1;
      else if (isCitySafeBand(cd)) citiesSafe += 1;
    }
    const pctAtRisk = totalCities > 0 ? (100 * citiesAtRisk) / totalCities : 0;
    const { grade, gradeColor } = letterGradeFromPctAtRisk(pctAtRisk, totalCities);
    const worstContaminant = totalCities > 0 ? worstContaminantForState(abbr) : '—';
    return {
      stateAbbr: abbr,
      stateName: STATE_NAMES[abbr],
      stateSlug: stateAbbrToUrlSlug(abbr),
      rank: 0,
      grade,
      gradeColor,
      pctAtRisk: Math.round(pctAtRisk * 10) / 10,
      totalCities,
      citiesAtRisk,
      citiesSafe,
      worstContaminant,
    };
  });

  const withData = partial.filter((r) => r.totalCities > 0);
  const noData = partial.filter((r) => r.totalCities === 0);

  withData.sort((a, b) => {
    if (a.pctAtRisk !== b.pctAtRisk) return a.pctAtRisk - b.pctAtRisk;
    return a.stateName.localeCompare(b.stateName);
  });

  let rank = 1;
  const rankedWithData = withData.map((r) => ({ ...r, rank: rank++ }));

  noData.sort((a, b) => a.stateName.localeCompare(b.stateName));
  const rankedNoData = noData.map((r) => ({
    ...r,
    rank: rank++,
    grade: '—',
    gradeColor: '#64748b',
    pctAtRisk: 0,
    worstContaminant: '—',
  }));

  const rows = [...rankedWithData, ...rankedNoData];

  const statesWithGuidelinesConcern = withData.filter((r) => stateHasCityAboveGuidelines(r.stateAbbr)).length;

  const worstCities = Object.entries(CITIES)
    .map(([slug, cd]) => {
      const p = getPfas(cd.pwsid);
      let contaminantCount = 0;
      if (p) {
        const seen = new Set<string>();
        for (const [name, level] of p.compounds) {
          if (level <= 0) continue;
          if (seen.has(name)) continue;
          seen.add(name);
          contaminantCount += 1;
        }
      }
      return { slug, name: cd.name, state: cd.state, contaminantCount };
    })
    .filter((c) => c.contaminantCount > 0)
    .sort((a, b) => b.contaminantCount - a.contaminantCount)
    .slice(0, 20);

  return { rows, statesWithGuidelinesConcern, worstCities };
}
