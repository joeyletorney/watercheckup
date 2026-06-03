import { CITIES } from '@/app/water/[city]/cities-data';
import { buildStateRankingRows } from './water-rankings';
import { resolveCityPwsid } from './city-pwsid';
import { getCityPfasData } from './ucmr5-city-pfas';
import { computeWaterScore } from './city-water-score';

export type WorstStateRow = {
  stateAbbr: string;
  stateName: string;
  stateSlug: string;
  grade: string;
  gradeColor: string;
  pctAtRisk: number;
  citiesAtRisk: number;
  citiesSafe: number;
  totalCities: number;
  worstContaminant: string;
  worstSlug: string;
  worstCityName: string;
  topIssues: string[];
};

/** States ranked worst-first — same % at-risk methodology as `/rankings`. */
export function buildWorstStatesRankings(): WorstStateRow[] {
  const { rows } = buildStateRankingRows();
  const withData = rows.filter((r) => r.totalCities > 0);

  return [...withData]
    .sort((a, b) => b.pctAtRisk - a.pctAtRisk || a.stateName.localeCompare(b.stateName))
    .map((row) => {
      const cityEntries = Object.entries(CITIES).filter(([, cd]) => cd.state === row.stateAbbr);

      let worstSlug = cityEntries[0]?.[0] ?? '';
      let worstCityName = cityEntries[0]?.[1]?.name ?? '—';
      let worstScore = 999;

      for (const [slug, cd] of cityEntries) {
        const pfas = getCityPfasData(resolveCityPwsid(slug, cd.pwsid));
        const ws = computeWaterScore(cd.urgency, cd.issues, pfas);
        if (ws.score < worstScore) {
          worstScore = ws.score;
          worstSlug = slug;
          worstCityName = cd.name;
        }
      }

      const topIssues = Array.from(new Set(cityEntries.flatMap(([, cd]) => cd.issues))).slice(0, 3);

      return {
        stateAbbr: row.stateAbbr,
        stateName: row.stateName,
        stateSlug: row.stateSlug,
        grade: row.grade,
        gradeColor: row.gradeColor,
        pctAtRisk: row.pctAtRisk,
        citiesAtRisk: row.citiesAtRisk,
        citiesSafe: row.citiesSafe,
        totalCities: row.totalCities,
        worstContaminant: row.worstContaminant,
        worstSlug,
        worstCityName,
        topIssues,
      };
    });
}
