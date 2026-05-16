/**
 * Groups WaterCheckup city reports by US county using a public city→county CSV,
 * then writes aggregated stats + UCMR5-derived risk bands to data/counties.json.
 *
 * CSV: https://raw.githubusercontent.com/grammakov/USA-cities-and-states/master/us_cities_states_counties.csv
 */

import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

import { CITIES } from "../app/water/[city]/cities-data";
import ucmr5Raw from "../lib/ucmr5.json";

const CSV_URL =
  "https://raw.githubusercontent.com/grammakov/USA-cities-and-states/master/us_cities_states_counties.csv";

const UCMR5 = ucmr5Raw as unknown as Record<
  string,
  [number, number, [string, number, number, number][], number?]
>;

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  AS: "American Samoa",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "Washington DC",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "U.S. Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function stateSlugFromAbbr(abbr: string): string {
  return (STATE_NAMES[abbr] || abbr).toLowerCase().replace(/\s+/g, "-");
}

function normKey(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function cityVariants(displayName: string): string[] {
  const raw = displayName.trim();
  const out = new Set<string>();
  const add = (x: string) => {
    const k = normKey(x);
    if (k) out.add(k);
  };
  add(raw);
  add(raw.replace(/\s+city$/i, ""));
  add(raw.replace(/^st\.?\s+/i, "saint "));
  /* NYC */
  if (/new\s+york\s+city/i.test(raw)) {
    add("new york");
  }
  return Array.from(out);
}

function slugifyCountyName(countyRaw: string): string {
  const base = countyRaw.replace(/\s+county\s*$/i, "").trim();
  return normKey(base).replace(/\s+/g, "-");
}

function titleCountyName(countyRaw: string): string {
  const cleaned = countyRaw.replace(/\s+county\s*$/i, "").trim();
  const lower = cleaned.toLowerCase();
  return lower.replace(/\b\w/g, (c) => c.toUpperCase());
}

function getPfasData(pwsid: string) {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}

function isAtRiskFromUcmr(pfas: ReturnType<typeof getPfasData>): boolean {
  if (!pfas) return false;
  if (pfas.violations > 0) return true;
  return pfas.compounds.some(([, , overEpa]) => overEpa > 0);
}

type Band = "at_risk" | "safe" | "monitor";

function cityRiskBand(
  urgency: "high" | "medium" | "low",
  pfas: ReturnType<typeof getPfasData>,
): Band {
  if (isAtRiskFromUcmr(pfas)) return "at_risk";
  if (urgency === "low") return "safe";
  return "monitor";
}

/** Numeric score 0–88 — mirrors `app/water/state/[city]/page.tsx` `computeWaterScore` logic. */
function computeWaterScoreNum(
  urgency: "high" | "medium" | "low",
  issues: string[],
  pfasData: { maxPpt: number; violations: number; compounds: [string, number, number, number][]; hardness?: number } | null,
): number {
  let score = 88;
  if (urgency === "high") score -= 40;
  if (urgency === "medium") score -= 20;
  score -= Math.min(issues.length * 5, 20);
  if (pfasData) {
    if (pfasData.violations > 0) score -= 25;
    else if (pfasData.compounds.length > 3) score -= 12;
    else if (pfasData.compounds.length > 0) score -= 6;
    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 10;
    if (pfasData.maxPpt > 50) score -= 8;
    else if (pfasData.maxPpt > 10) score -= 4;
  }
  return Math.max(0, Math.min(88, score));
}

function letterGradeFromScore(score: number): { grade: string; gradeColor: string } {
  if (score >= 80) return { grade: "A", gradeColor: "#22d3ee" };
  if (score >= 65) return { grade: "B", gradeColor: "#86efac" };
  if (score >= 50) return { grade: "C", gradeColor: "#f59e0b" };
  if (score >= 35) return { grade: "D", gradeColor: "#f97316" };
  return { grade: "F", gradeColor: "#ef4444" };
}

function parsePopulation(pop: string): number {
  const t = String(pop).trim().toLowerCase();
  if (!t) return 0;
  if (t.endsWith("m")) {
    const n = parseFloat(t.slice(0, -1).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n * 1e6 : 0;
  }
  if (t.endsWith("k")) {
    const n = parseFloat(t.slice(0, -1).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n * 1e3 : 0;
  }
  const n = parseFloat(t.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

async function fetchCsv(): Promise<string> {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`CSV fetch HTTP ${res.status}`);
  return res.text();
}

function buildCountyLookup(csvText: string): Map<string, string> {
  const rows = parse(csvText, {
    columns: true,
    delimiter: "|",
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Array<Record<string, string>>;

  const lookup = new Map<string, string>();

  for (const row of rows) {
    const st = row["State short"]?.trim();
    const county = row["County"]?.trim();
    if (!st || !county) continue;
    const city = row["City"]?.trim();
    const alias = row["City alias"]?.trim();
    for (const cell of [city, alias]) {
      if (!cell) continue;
      const v = normKey(cell);
      if (!v) continue;
      lookup.set(`${st}|${v}`, county);
    }
  }
  return lookup;
}

function resolveCounty(lookup: Map<string, string>, state: string, cityDisplay: string): string | null {
  if (state === "DC" && /washington/i.test(cityDisplay)) {
    return "DISTRICT OF COLUMBIA";
  }
  for (const v of cityVariants(cityDisplay)) {
    const c = lookup.get(`${state}|${v}`);
    if (c) return c;
  }
  return null;
}

async function main(): Promise<void> {
  const outDir = path.join(process.cwd(), "data");
  const outPath = path.join(outDir, "counties.json");

  const csvText = await fetchCsv();
  const lookup = buildCountyLookup(csvText);

  type Group = {
    stateAbbr: string;
    countyRaw: string;
    cities: {
      slug: string;
      name: string;
      populationLabel: string;
      popN: number;
      urgency: "high" | "medium" | "low";
      score: number;
      grade: string;
      gradeColor: string;
      band: Band;
      contaminantsAboveLimit: number;
    }[];
  };

  const groups = new Map<string, Group>();

  for (const slug of Object.keys(CITIES)) {
    const cd = CITIES[slug];
    const countyRaw = resolveCounty(lookup, cd.state, cd.name);
    if (!countyRaw) {
      console.warn(`No county match: ${cd.name}, ${cd.state} (${slug})`);
      continue;
    }

    const pfas = getPfasData(cd.pwsid);
    const score = computeWaterScoreNum(cd.urgency, cd.issues, pfas);
    const { grade, gradeColor } = (() => {
      let g: string;
      let gc: string;
      if (score >= 80) {
        g = "A-";
        gc = "#22d3ee";
      } else if (score >= 65) {
        g = "B";
        gc = "#86efac";
      } else if (score >= 50) {
        g = "C";
        gc = "#f59e0b";
      } else if (score >= 35) {
        g = "D";
        gc = "#f97316";
      } else {
        g = "F";
        gc = "#ef4444";
      }
      return { grade: g, gradeColor: gc };
    })();

    const band = cityRiskBand(cd.urgency, pfas);
    const contaminantsAboveLimit = pfas
      ? pfas.compounds.filter(([, , overEpa]) => overEpa > 0).length
      : 0;
    const popN = parsePopulation(cd.population);

    const cslug = slugifyCountyName(countyRaw);
    const stAbbr = cd.state;
    const gkey = `${stAbbr}|${cslug}`;

    if (!groups.has(gkey)) {
      groups.set(gkey, {
        stateAbbr: stAbbr,
        countyRaw,
        cities: [],
      });
    }
    groups.get(gkey)!.cities.push({
      slug,
      name: cd.name,
      populationLabel: cd.population,
      popN,
      urgency: cd.urgency,
      score,
      grade,
      gradeColor,
      band,
      contaminantsAboveLimit,
    });
  }

  type TopChem = { name: string; cityCount: number };

  type CountyOut = {
    countyDisplay: string;
    countySlug: string;
    stateAbbr: string;
    stateName: string;
    stateSlug: string;
    totalCities: number;
    populationServed: number;
    citiesAtRisk: number;
    citiesSafe: number;
    citiesMonitor: number;
    mostCommonContaminant: string | null;
    topContaminants: TopChem[];
    countyScore: number;
    countyGrade: string;
    countyGradeColor: string;
    cities: Group["cities"];
  };

  const countyRecords: CountyOut[] = [];
  const cityToCounty: Record<
    string,
    { stateSlug: string; countySlug: string; countyDisplay: string; stateAbbr: string }
  > = {};

  for (const [, g] of Array.from(groups.entries())) {
    const stateSlug = stateSlugFromAbbr(g.stateAbbr);
    const countySlug = slugifyCountyName(g.countyRaw);
    const countyDisplay = titleCountyName(g.countyRaw);

    const totalCities = g.cities.length;
    const popTotal = g.cities.reduce((s, c) => s + c.popN, 0);
    const citiesAtRisk = g.cities.filter((c) => c.band === "at_risk").length;
    const citiesSafe = g.cities.filter((c) => c.band === "safe").length;
    const citiesMonitor = g.cities.filter((c) => c.band === "monitor").length;

    let weighted = 0;
    if (popTotal > 0) {
      weighted = g.cities.reduce((s, c) => s + c.score * c.popN, 0) / popTotal;
    } else {
      weighted = g.cities.reduce((s, c) => s + c.score, 0) / totalCities;
    }
    const countyGradeInfo = letterGradeFromScore(weighted);

    const chemCounts = new Map<string, number>();
    for (const c of g.cities) {
      const cd = CITIES[c.slug];
      const pfas = getPfasData(cd.pwsid);
      if (!pfas) continue;
      const seen = new Set<string>();
      for (const [name, level] of pfas.compounds) {
        if (level <= 0) continue;
        if (seen.has(name)) continue;
        seen.add(name);
        chemCounts.set(name, (chemCounts.get(name) ?? 0) + 1);
      }
    }
    const topContaminants: TopChem[] = Array.from(chemCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([name, cityCount]) => ({ name, cityCount }));

    const mostCommonContaminant = topContaminants[0]?.name ?? null;

    const sortedCities = [...g.cities].sort((a, b) => b.popN - a.popN);

    for (const c of sortedCities) {
      cityToCounty[c.slug] = {
        stateSlug,
        countySlug,
        countyDisplay,
        stateAbbr: g.stateAbbr,
      };
    }

    countyRecords.push({
      countyDisplay,
      countySlug,
      stateAbbr: g.stateAbbr,
      stateName: STATE_NAMES[g.stateAbbr] || g.stateAbbr,
      stateSlug,
      totalCities,
      populationServed: Math.round(popTotal),
      citiesAtRisk,
      citiesSafe,
      citiesMonitor,
      mostCommonContaminant,
      topContaminants,
      countyScore: Math.round(weighted * 10) / 10,
      countyGrade: countyGradeInfo.grade,
      countyGradeColor: countyGradeInfo.gradeColor,
      cities: sortedCities,
    });
  }

  countyRecords.sort((a, b) => {
    const s = a.stateSlug.localeCompare(b.stateSlug);
    if (s !== 0) return s;
    return a.countySlug.localeCompare(b.countySlug);
  });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        csvSource: CSV_URL,
        recordCount: countyRecords.length,
        counties: countyRecords,
        cityToCounty,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote ${countyRecords.length} counties → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
