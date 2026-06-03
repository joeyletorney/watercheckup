import { CITIES } from '@/app/water/[city]/cities-data';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import {
  computeCityWaterScore,
  computeWaterScore,
  type CityPfasSnapshot,
  type WaterScoreResult,
} from '@/lib/city-water-score';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import type { ContaminantRow } from '@/lib/water-contaminants';

export function findCityByResolvedPwsid(pwsid: string): { slug: string; cd: (typeof CITIES)[string] } | null {
  const key = pwsid.trim().toUpperCase();
  for (const [slug, cd] of Object.entries(CITIES)) {
    if (resolveCityPwsid(slug, cd.pwsid, cd.zip) === key) return { slug, cd };
  }
  return null;
}

function ucmrSnapshot(pwsid: string): CityPfasSnapshot {
  return getCityPfasData(pwsid);
}

/** Build issue tags from measured contaminants when no city profile exists */
export function issuesFromZipSignals(
  contaminants: ContaminantRow[],
  opts: { hardnessMgL?: number; openViolations: number; pfas: CityPfasSnapshot },
): string[] {
  const issues: string[] = [];
  const names = contaminants.map((c) => c.name.toLowerCase()).join(' ');

  const hardness =
    opts.hardnessMgL ??
    contaminants.find((c) => /hardness|tds/i.test(c.name))?.level ??
    undefined;
  if (typeof hardness === 'number' && hardness > 120) {
    issues.push('Hard water / high mineral content');
  }

  if (opts.pfas?.compounds?.length) issues.push('PFAS detected');
  if (/thm|trihalomethane|haloacetic|byproduct|dbp/i.test(names)) {
    issues.push('Disinfection byproducts');
  }
  if (/arsenic/i.test(names)) issues.push('Arsenic above health guidelines');
  if (/radium/i.test(names)) issues.push('Radium from aquifer geology');
  if (/lead|service line/i.test(names)) issues.push('Lead pipe risk');
  if (/chromium/i.test(names)) issues.push('Chromium-6 flagged');
  if (/nitrate/i.test(names)) issues.push('Nitrates flagged');
  if (opts.openViolations > 0) issues.push('Open EPA violations');

  return issues.length ? issues : ['EPA report available'];
}

/** Single Water Safety Score (0–88) for ZIP and city pages */
export function computeZipWaterScore(params: {
  pwsid: string;
  zip: string;
  contaminants: ContaminantRow[];
  openViolations: number;
  hardnessMgL?: number;
}): WaterScoreResult {
  const { pwsid, zip, contaminants, openViolations, hardnessMgL } = params;
  const pfas = ucmrSnapshot(pwsid);
  const matched = findCityByResolvedPwsid(pwsid);

  if (matched) {
    return computeCityWaterScore(matched.cd, pfas, { sdwaViolationCount: openViolations });
  }

  const issues = issuesFromZipSignals(contaminants, { hardnessMgL, openViolations, pfas });
  const arsenic = contaminants.find((c) => c.name === 'Arsenic')?.level;
  const radium = contaminants.find((c) => /radium/i.test(c.name))?.level;
  const profile =
    hardnessMgL != null
      ? {
          hardness: hardnessMgL,
          ...(typeof arsenic === 'number' ? { arsenicPpb: arsenic } : {}),
          ...(typeof radium === 'number' ? { radiumPciL: radium } : {}),
        }
      : undefined;

  return computeWaterScore('medium', issues, pfas, {
    sdwaViolationCount: openViolations,
    waterProfile: profile,
  });
}

/** Rough national percentile for 0–88 safety score */
export function nationalPercentileFromSafetyScore(score: number): number {
  if (score >= 80) return 95;
  if (score >= 70) return 78;
  if (score >= 62) return 58;
  if (score >= 55) return 45;
  if (score >= 45) return 28;
  if (score >= 35) return 15;
  return 8;
}
