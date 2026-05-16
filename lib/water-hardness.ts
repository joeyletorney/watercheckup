import { CITIES, WATER_CITY_SLUGS } from "@/app/water/[city]/cities-data";
import ucmr5Raw from "@/lib/ucmr5.json";
import { USPS_STATE_NAMES } from "@/lib/us-state-names";
import { analyzeHardnessMgL } from "@/lib/water-hardness-shared";
import { findCitySlugByZip } from "@/lib/find-city-by-zip";

export type { HardnessAnalysis, HardnessTier } from "@/lib/water-hardness-shared";
export { analyzeHardnessMgL, mgLToGpg, gpgToMgL, toPpm } from "@/lib/water-hardness-shared";

const ucmr5 = ucmr5Raw as Record<string, unknown[]>;

/** US states (50) for published averages table — DC handled separately in slug helper. */
export const US_STATE_ABBRS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
  "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
  "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export function getUcmrHardnessMgL(pwsid: string): number | null {
  const row = ucmr5[pwsid.trim()];
  if (!Array.isArray(row) || row.length < 4) return null;
  const h = row[3];
  if (typeof h !== "number" || !Number.isFinite(h) || h < 0) return null;
  return h;
}

export function stateSlugFromAbbr(abbr: string): string {
  const u = abbr.toUpperCase();
  if (u === "DC") return "washington-dc";
  const name = USPS_STATE_NAMES[u];
  if (!name) return u.toLowerCase();
  return name.toLowerCase().replace(/\s+/g, "-");
}

export type StateHardnessRow = {
  abbr: string;
  stateName: string;
  stateSlug: string;
  avgPpm: number | null;
  classification: string;
  citiesTested: number;
};

export function buildStateHardnessTable(): StateHardnessRow[] {
  const byState: Record<string, number[]> = {};
  for (const abbr of US_STATE_ABBRS) byState[abbr] = [];

  for (const slug of WATER_CITY_SLUGS) {
    const cd = CITIES[slug];
    if (!cd) continue;
    const h = getUcmrHardnessMgL(cd.pwsid);
    if (h == null) continue;
    const st = cd.state.toUpperCase();
    if (!byState[st]) byState[st] = [];
    byState[st].push(h);
  }

  const rows: StateHardnessRow[] = US_STATE_ABBRS.map((abbr) => {
    const samples = byState[abbr] ?? [];
    const stateName = USPS_STATE_NAMES[abbr] ?? abbr;
    const stateSlug = stateSlugFromAbbr(abbr);
    if (samples.length === 0) {
      return {
        abbr,
        stateName,
        stateSlug,
        avgPpm: null,
        classification: "—",
        citiesTested: 0,
      };
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const { label } = analyzeHardnessMgL(avg);
    return {
      abbr,
      stateName,
      stateSlug,
      avgPpm: Math.round(avg * 10) / 10,
      classification: label,
      citiesTested: samples.length,
    };
  });

  rows.sort((a, b) => {
    if (a.avgPpm == null && b.avgPpm == null) return a.stateName.localeCompare(b.stateName);
    if (a.avgPpm == null) return 1;
    if (b.avgPpm == null) return -1;
    return b.avgPpm - a.avgPpm;
  });

  return rows;
}

export function getAverageHardnessForState(stateAbbr: string): { avgPpm: number | null; citiesTested: number } {
  const u = stateAbbr.toUpperCase();
  const ppms: number[] = [];
  for (const slug of WATER_CITY_SLUGS) {
    const cd = CITIES[slug];
    if (!cd || cd.state.toUpperCase() !== u) continue;
    const h = getUcmrHardnessMgL(cd.pwsid);
    if (h != null) ppms.push(h);
  }
  if (ppms.length === 0) return { avgPpm: null, citiesTested: 0 };
  const avg = ppms.reduce((a, b) => a + b, 0) / ppms.length;
  return { avgPpm: Math.round(avg * 10) / 10, citiesTested: ppms.length };
}

export { findCitySlugByZip };
