import countiesJson from "@/data/counties.json";

export type CountyCityRow = {
  slug: string;
  name: string;
  populationLabel: string;
  popN: number;
  urgency: "high" | "medium" | "low";
  score: number;
  grade: string;
  gradeColor: string;
  band: "at_risk" | "safe" | "monitor";
  contaminantsAboveLimit: number;
};

export type CountyTopContaminant = { name: string; cityCount: number };

export type CountyRecord = {
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
  topContaminants: CountyTopContaminant[];
  countyScore: number;
  countyGrade: string;
  countyGradeColor: string;
  cities: CountyCityRow[];
};

export type CountiesPayload = {
  generatedAt: string;
  csvSource: string;
  recordCount: number;
  counties: CountyRecord[];
  cityToCounty: Record<
    string,
    { stateSlug: string; countySlug: string; countyDisplay: string; stateAbbr: string }
  >;
};

const payload = countiesJson as CountiesPayload;

const countyKeyIndex = new Map<string, CountyRecord>();
for (const c of payload.counties) {
  countyKeyIndex.set(`${c.stateSlug}|${c.countySlug}`, c);
}

export function getCountiesPayload(): CountiesPayload {
  return payload;
}

export function getCountyByStateSlugAndCountySlug(stateSlug: string, countySlug: string): CountyRecord | undefined {
  return countyKeyIndex.get(`${stateSlug}|${countySlug}`);
}

export function getAllCountyStaticParams(): { state: string; countySlug: string }[] {
  return payload.counties.map((c) => ({ state: c.stateSlug, countySlug: c.countySlug }));
}

/** Top N counties by aggregated population for build prerender; others generated on demand (ISR). */
export function getTopCountyStaticParamsByPopulation(limit: number): { state: string; countySlug: string }[] {
  const sorted = [...payload.counties].sort((a, b) => b.populationServed - a.populationServed);
  return sorted.slice(0, limit).map((c) => ({ state: c.stateSlug, countySlug: c.countySlug }));
}

export function getCountiesForStateAbbr(stateAbbr: string): CountyRecord[] {
  return payload.counties
    .filter((c) => c.stateAbbr === stateAbbr)
    .sort((a, b) => a.countyDisplay.localeCompare(b.countyDisplay));
}

export function getCountyLinkForCitySlug(citySlug: string): CountiesPayload["cityToCounty"][string] | undefined {
  return payload.cityToCounty[citySlug];
}
