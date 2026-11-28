/**
 * City-level “best water filter” pages.
 *
 * Eligibility is measured-data only: UCMR5 PFAS, packaged CCR/EWG rows, or CCR
 * hardness from the city water profile. Cities without those numbers are omitted
 * (no thin pages, no noindex stubs). Capped at the 500 largest eligible cities.
 *
 * “Is tap water safe?” stays on `/water/[city]` — those pages already use that
 * H1. These URLs target “best water filter for [city]” and add lead/PFAS
 * sections only when the snapshot or city record actually has that data.
 */

import { CITIES } from '@/app/water/[city]/cities-data';
import { buildCityContaminantDisplay } from '@/lib/city-contaminant-display';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import { computeCityWaterScore } from '@/lib/city-water-score';
import { historicalPfasAnswer } from '@/lib/city-report-evidence';
import { stateAbbrToName, stateAbbrToSlug } from '@/lib/cities';
import {
  isMeasuredContaminant,
  picksForCityProfile,
  type CityFilterPick,
  type FilterConcerns,
  type NsfCertNeed,
} from '@/lib/city-filter-picks';
import { pfasSnapshotSentence } from '@/lib/pfas-editorial';
import {
  citySeoDisplayName,
  clipMeta,
  SERP_DESCRIPTION_MAX,
  SERP_TITLE_MAX,
} from '@/lib/serp-copy';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { getUcmrSnapshotLabel } from '@/lib/water-data-meta';
import type { ContaminantRow } from '@/lib/water-contaminants';
import type { CityPfasSnapshot } from '@/lib/city-water-score';

/** Hard cap so we never dump a page per utility (see PR #38 crawl-budget). */
export const MAX_CITY_FILTER_PAGES = 500;

export const CITY_FILTER_HUB_PATH = '/best-water-filter';

export function cityFilterPagePath(slug: string): string {
  return `${CITY_FILTER_HUB_PATH}/${slug}`;
}

export function parseCityPopulationLabel(pop: string): number {
  const t = String(pop || '').trim().toLowerCase().replace(/,/g, '');
  if (!t) return 0;
  if (t.endsWith('m')) return (parseFloat(t) || 0) * 1e6;
  if (t.endsWith('k')) return (parseFloat(t) || 0) * 1e3;
  return parseFloat(t.replace(/[^0-9.]/g, '')) || 0;
}

export type CityFilterFaq = { question: string; answer: string };

export type CityFilterPageModel = {
  slug: string;
  name: string;
  displayName: string;
  state: string;
  stateName: string;
  stateSlug: string;
  system: string;
  pwsid: string;
  population: string;
  zip: string;
  issues: string[];
  grade: string;
  score: number;
  rows: ContaminantRow[];
  pfas: CityPfasSnapshot;
  hasLeadSection: boolean;
  hasPfasSection: boolean;
  leadFacts: string[];
  concerns: FilterConcerns;
  certs: NsfCertNeed[];
  picks: CityFilterPick[];
  title: string;
  description: string;
  h1: string;
  faqs: CityFilterFaq[];
  nearby: { slug: string; name: string; state: string }[];
};

function measuredRowsForCity(slug: string): {
  city: (typeof CITIES)[string];
  pwsid: string;
  rows: ContaminantRow[];
  pfas: CityPfasSnapshot;
} | null {
  const city = CITIES[slug];
  if (!city) return null;
  const pwsid = resolveCityPwsid(slug, city.pwsid, city.zip);
  // Uncapped: the city-page table limit of 18 would drop later PFAS/metals
  // (San Diego) before NSF/product matching. Display can still slice.
  const rows = buildCityContaminantDisplay(
    slug,
    city.pwsid,
    city.waterProfile,
    Number.POSITIVE_INFINITY,
    city.zip,
    city.state,
  );
  const pfas = getCityPfasData(pwsid);
  return { city, pwsid, rows, pfas };
}

export function cityHasMeasuredFilterData(slug: string): boolean {
  const packed = measuredRowsForCity(slug);
  if (!packed) return false;
  return packed.rows.some(isMeasuredContaminant);
}

let slugCache: string[] | null = null;

/** Largest eligible cities first, never more than MAX_CITY_FILTER_PAGES. */
export function listCityFilterPageSlugs(): string[] {
  if (slugCache) return slugCache;
  const ranked = Object.keys(CITIES)
    .filter(cityHasMeasuredFilterData)
    .map((slug) => ({
      slug,
      pop: parseCityPopulationLabel(CITIES[slug]!.population),
    }))
    .sort((a, b) => b.pop - a.pop || a.slug.localeCompare(b.slug))
    .slice(0, MAX_CITY_FILTER_PAGES)
    .map((row) => row.slug);
  slugCache = ranked;
  return ranked;
}

export function hasCityFilterPage(slug: string): boolean {
  return listCityFilterPageSlugs().includes(slug);
}

export function listCityFilterPagesByState(): {
  state: string;
  stateName: string;
  stateSlug: string;
  cities: { slug: string; name: string; population: string }[];
}[] {
  const groups = new Map<string, { slug: string; name: string; population: string }[]>();
  for (const slug of listCityFilterPageSlugs()) {
    const city = CITIES[slug]!;
    const list = groups.get(city.state) ?? [];
    list.push({ slug, name: city.name, population: city.population });
    groups.set(city.state, list);
  }
  return Array.from(groups.entries())
    .map(([state, cities]) => ({
      state,
      stateName: stateAbbrToName(state),
      stateSlug: stateAbbrToSlug(state),
      cities,
    }))
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
}

function concernRank(name: string): number {
  if (/pfas|pfoa|pfos|pfna|pfhxs|hfpo|genx|perfluoro/i.test(name)) return 0;
  if (/^lead$/i.test(name)) return 1;
  if (/chromium/i.test(name)) return 2;
  if (/arsenic|nitrate|radium|uranium/i.test(name)) return 3;
  if (/trihalomethane|thm|haloacetic|haa/i.test(name)) return 4;
  return 5;
}

function pickFittingTitle(candidates: string[]): string {
  return candidates.find((t) => t.length <= SERP_TITLE_MAX) ?? clipMeta(candidates[candidates.length - 1]!, SERP_TITLE_MAX);
}

export function buildFilterPageTitle(displayName: string, state: string): string {
  return pickFittingTitle([
    `Best Water Filter for ${displayName} (${state}) 2026`,
    `Best Water Filter for ${displayName} 2026`,
    `Best ${displayName} Water Filter 2026`,
    `Best Water Filter for ${displayName}`,
  ]);
}

export function buildFilterPageH1(displayName: string, state: string): string {
  return `Best Water Filter for ${displayName}, ${state}`;
}

function buildFilterPageDescription(input: {
  displayName: string;
  system: string;
  labels: string[];
  certCodes: string[];
}): string {
  const top = input.labels.slice(0, 3).join(', ');
  const certs = input.certCodes.slice(0, 3).join(', ');
  const candidates = [
    `${input.displayName} (${input.system}): ${top || 'measured contaminant data'}. ${certs || 'NSF'} picks from this city's report — not a tap test.`,
    `${input.displayName} filter picks from measured ${top || 'city water data'}. NSF-certified options — not a household tap test.`,
  ];
  const fit = candidates.find((t) => t.length <= SERP_DESCRIPTION_MAX);
  return fit ?? clipMeta(candidates[0]!, SERP_DESCRIPTION_MAX);
}

function nearbyFilterCities(slug: string, state: string): { slug: string; name: string; state: string }[] {
  return listCityFilterPageSlugs()
    .filter((other) => other !== slug && CITIES[other]?.state === state)
    .slice(0, 6)
    .map((other) => ({
      slug: other,
      name: CITIES[other]!.name,
      state: CITIES[other]!.state,
    }));
}

function buildFaqs(model: Omit<CityFilterPageModel, 'faqs'>): CityFilterFaq[] {
  const faqs: CityFilterFaq[] = [
    {
      question: `What is the best water filter for ${model.displayName}?`,
      answer: model.picks[0]
        ? `${model.picks[0].product} is the primary pick on this page because this ${model.system} report includes ${model.rows.filter(isMeasuredContaminant).slice(0, 3).map((r) => r.name).join(', ') || 'measured contaminants'}. Verify the exact model and cartridge listing. A citywide report is not a test of your tap.`
        : `Match a filter to the measured contaminants on the ${model.system} report, then confirm the exact NSF listing. This page does not substitute for a household tap test.`,
    },
    {
      question: `Is ${model.displayName} tap water safe to drink?`,
      answer:
        model.grade === '—'
          ? `This ${model.displayName} page summarizes historical ${model.system} monitoring. The packaged UCMR5 snapshot has no matching PFAS record, so WaterCheckup does not assign a 0–88 grade. That gap is not a clean test result. Read the full ${model.displayName} water quality report and your supplier’s current Consumer Confidence Report.`
          : `This ${model.displayName} report is a WaterCheckup Safety Score ${model.score}/88 (grade ${model.grade}) from historical public-supplier data. It is not a determination that every tap is safe or legally compliant. Read the full ${model.displayName} water quality report and your supplier’s current Consumer Confidence Report.`,
    },
  ];
  if (model.hasPfasSection) {
    faqs.push({
      question: `Does ${model.displayName} water have PFAS?`,
      answer: historicalPfasAnswer(model.pfas, getUcmrSnapshotLabel()),
    });
  }
  if (model.hasLeadSection) {
    faqs.push({
      question: `Does ${model.displayName} tap water have lead?`,
      answer: model.leadFacts[0]
        ? `${model.leadFacts[0]} Lead at the tap often comes from service lines or household plumbing after the meter. NSF 53 or NSF 58 filters address lead in drinking water when the exact model lists that claim. Check the supplier’s service-line inventory and test a first-draw sample if the building is older.`
        : `This ${model.displayName} profile flags lead from service lines or household plumbing. A citywide average cannot verify the pipe material or first-draw level at your address. NSF 53 or NSF 58 is the drinking-water listing to check; test a first-draw kitchen sample in pre-1986 housing.`,
    });
  }
  if (model.certs[0]) {
    faqs.push({
      question: `Which NSF certification matters for ${model.displayName} water?`,
      answer: model.certs.map((cert) => `${cert.code}: ${cert.why}`).join(' '),
    });
  }
  return faqs;
}

export function getCityFilterPage(slug: string): CityFilterPageModel | null {
  if (!hasCityFilterPage(slug)) return null;
  const packed = measuredRowsForCity(slug);
  if (!packed) return null;
  const { city, pwsid, rows, pfas } = packed;
  const displayName = citySeoDisplayName(slug, city.name);
  const score = computeCityWaterScore(city, pfas);
  const { concerns, certs, picks } = picksForCityProfile(city.name, rows, city.issues);
  const hasLeadRow = rows.some((row) => /^lead$/i.test(row.name) && isMeasuredContaminant(row));
  const hasLeadSection = hasLeadRow || city.issues.some((issue) => /lead/i.test(issue));
  const hasPfasSection = pfas != null;
  const labels = rows
    .filter(isMeasuredContaminant)
    .sort((a, b) => concernRank(a.name) - concernRank(b.name) || (b.level ?? 0) - (a.level ?? 0))
    .map((row) => row.name);
  const modelBase: Omit<CityFilterPageModel, 'faqs'> = {
    slug,
    name: city.name,
    displayName,
    state: city.state,
    stateName: stateAbbrToName(city.state),
    stateSlug: stateAbbrToSlug(city.state),
    system: city.system,
    pwsid,
    population: city.population,
    zip: city.zip,
    issues: city.issues,
    grade: score.grade,
    score: score.score,
    rows,
    pfas,
    hasLeadSection,
    hasPfasSection,
    leadFacts: city.facts.filter((fact) => /lead/i.test(fact)),
    concerns,
    certs,
    picks,
    title: buildFilterPageTitle(displayName, city.state),
    description: buildFilterPageDescription({
      displayName,
      system: city.system,
      labels,
      certCodes: certs.map((c) => c.code),
    }),
    h1: buildFilterPageH1(displayName, city.state),
    nearby: nearbyFilterCities(slug, city.state),
  };
  return { ...modelBase, faqs: buildFaqs(modelBase) };
}

export function filterPageSafeSummary(model: CityFilterPageModel): string {
  const measured = model.rows.filter(isMeasuredContaminant);
  const names = measured.slice(0, 3).map((row) => row.name).join(', ');
  const measuredBit = names ? `This snapshot includes ${names}. ` : '';
  if (model.grade === '—') {
    return `Historical monitoring coverage for ${model.system} (PWSID ${model.pwsid}) is incomplete in this packaged UCMR5 snapshot, so WaterCheckup does not assign a 0–88 grade. Missing coverage does not establish detection or nondetection. ${measuredBit}A citywide report is not a tap test.`;
  }
  return `WaterCheckup grades ${model.displayName} ${model.grade} (${model.score}/88) from historical ${model.system} monitoring (PWSID ${model.pwsid}). ${measuredBit}A grade is not a tap test or a compliance finding.`;
}

export function filterPagePfasSummary(model: CityFilterPageModel): string {
  return pfasSnapshotSentence(model.pfas);
}
