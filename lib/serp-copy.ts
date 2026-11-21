import type { CityPfasSnapshot } from './city-water-score';
import { SITE_HOME_META_DESCRIPTION } from './site-stats';

/** Unique title length before the `%s | WaterCheckup` template. */
export const SERP_TITLE_MAX = 62;
/** Meta description length Google typically shows in full. */
export const SERP_DESCRIPTION_MAX = 155;

export function withoutBrandSuffix(title: string): string {
  return title.replace(/\s*[|–—]\s*WaterCheckup\s*$/i, '').trim();
}

export function clipMeta(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  const sliced = cleaned.slice(0, max - 1);
  const cut = sliced.lastIndexOf(' ');
  const base = (cut > Math.floor(max * 0.6) ? sliced.slice(0, cut) : sliced).replace(/[ ,;:]+$/, '');
  return `${base}…`;
}

function pickFitting(candidates: string[], max = SERP_TITLE_MAX): string {
  return candidates.find((t) => t.length <= max) ?? candidates[candidates.length - 1]!;
}

/**
 * Prefer the slug when it is more specific than `city.name`
 * (Fairfax County vs Fairfax; St. Louis vs a shortened label).
 */
export function citySeoDisplayName(slug: string, cityName: string): string {
  const slugName = slug
    .split('-')
    .map((part) => {
      if (part === 'st') return 'St.';
      if (part === 'ft') return 'Fort';
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
  const slugCmp = slugName.replace(/\./g, '');
  const nameCmp = cityName.replace(/\./g, '');
  return slugCmp.length > nameCmp.length ? slugName : cityName;
}

export function buildCitySeoTitle(cityName: string): string {
  const question = `Is ${cityName} Tap Water Safe?`;
  return pickFitting([
    `${question} 2026 Report and Filter Picks`,
    `${question} 2026 Report & Filter Picks`,
    `${question} 2026 Report`,
    `${question} 2026`,
    question,
  ]);
}

export function buildCityPageH1(cityName: string): string {
  return `Is ${cityName} Tap Water Safe?`;
}

function shortUtilityName(system: string): string {
  let s = system.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\bWashington Suburban Sanitary Commission\b/gi, 'WSSC Water');
  s = s.replace(/\bLos Angeles Department of Water and Power\b/gi, 'LADWP');
  s = s.replace(/\bNYC Department of Environmental Protection\b/gi, 'NYCDEP');
  s = s.replace(/\bNew York City Department of Environmental Protection\b/gi, 'NYCDEP');
  s = s.replace(/\bSan Antonio Water System\b/gi, 'SAWS');
  s = s.replace(/\bPublic water systems?\b/gi, '').replace(/\s{2,}/g, ' ').trim();
  s = s.replace(/[,\s]+$/g, '');
  if (!s) return 'This public water system';
  if (s.length <= 44) return s;
  const cut = s.slice(0, 41).replace(/\s+\S*$/, '');
  return `${cut || s.slice(0, 41)}…`;
}

function joinAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function issueLabels(issues: string[]): string[] {
  const labels: string[] = [];
  const seen = new Set<string>();
  const add = (label: string) => {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    labels.push(label);
  };
  for (const issue of issues) {
    if (/lead/i.test(issue)) add('lead in older plumbing');
    else if (/chromium/i.test(issue)) add('chromium-6');
    else if (/nitrate/i.test(issue)) add('nitrates');
    else if (/arsenic/i.test(issue)) add('arsenic');
    else if (/radium/i.test(issue)) add('radium');
    else if (/THM|HAA|DBP|byproduct/i.test(issue)) add('disinfection byproducts');
    else if (/hard/i.test(issue)) add('hard water');
  }
  return labels;
}

function pfasPhrase(pfas: CityPfasSnapshot): string {
  if (!pfas) return 'PFAS snapshot unavailable';
  const above = pfas.compounds.filter(([, , , over]) => over > 0).map(([name]) => name);
  if (above.length) return `${joinAnd(above.slice(0, 3))} above EPA limits in UCMR5`;
  if (pfas.compounds.length) return 'PFAS detected in UCMR5 monitoring';
  return 'no PFAS compounds flagged in this snapshot';
}

export function buildCitySeoDescription(input: {
  cityName: string;
  system: string;
  issues: string[];
  pfas: CityPfasSnapshot;
  grade?: string;
}): string {
  const utility = shortUtilityName(input.system);
  const pfas = pfasPhrase(input.pfas);
  const extras = issueLabels(input.issues)
    .filter((label) => {
      if (/PFAS/i.test(pfas) && /lead|chromium|nitrate|arsenic|radium|byproduct|hard/i.test(label)) return true;
      return !/PFAS/i.test(label);
    })
    .slice(0, 2);
  const extraBit = extras.length ? `; ${joinAnd(extras)}` : '';
  const gradeBit = input.grade && input.grade !== '—' ? ` Grade ${input.grade}.` : '';
  const cta = 'NSF filter picks — not a test of your tap.';
  const withGrade = `${utility}: ${pfas}${extraBit}.${gradeBit} ${cta}`;
  if (withGrade.length <= SERP_DESCRIPTION_MAX) return withGrade;
  const noGrade = `${utility}: ${pfas}${extraBit}. ${cta}`;
  if (noGrade.length <= SERP_DESCRIPTION_MAX) return noGrade;
  const noExtra = `${utility}: ${pfas}. ${cta}`;
  if (noExtra.length <= SERP_DESCRIPTION_MAX) return noExtra;
  return clipMeta(noExtra, SERP_DESCRIPTION_MAX);
}

export function buildStateSeoTitle(stateName: string): string {
  return pickFitting([
    `${stateName} Tap Water Quality 2026: PFAS, Lead and City Reports`,
    `${stateName} Tap Water Quality 2026: PFAS, Lead & City Reports`,
    `${stateName} Tap Water Quality 2026: PFAS and Lead`,
    `${stateName} Tap Water Quality 2026`,
  ]);
}

export function buildStateSeoDescription(input: {
  stateName: string;
  cityCount: number;
  atRiskCount: number;
  topAnalyte?: { name: string; cityCount: number };
}): string {
  const risk =
    input.atRiskCount > 0
      ? `${input.atRiskCount} with PFAS or EPA-limit flags`
      : 'no cities flagged over EPA PFAS limits in this snapshot';
  const cta = 'Filter picks from public-supplier data — not a household tap test.';
  const base = `${input.stateName} tap water: ${input.cityCount} city reports, ${risk}.`;
  const withChem =
    input.topAnalyte != null
      ? `${base} Common analyte: ${input.topAnalyte.name} (${input.topAnalyte.cityCount} cities). ${cta}`
      : `${base} ${cta}`;
  if (withChem.length <= SERP_DESCRIPTION_MAX) return withChem;
  const noChem = `${base} ${cta}`;
  if (noChem.length <= SERP_DESCRIPTION_MAX) return noChem;
  return clipMeta(noChem, SERP_DESCRIPTION_MAX);
}

export const HOME_SEO_TITLE = 'Is My Tap Water Safe by ZIP Code? Free Report';
export const HOME_SEO_DESCRIPTION = SITE_HOME_META_DESCRIPTION;

export const RANKINGS_SEO_TITLE = 'Worst Tap Water Rankings 2026: Cities & States';
export const RANKINGS_SEO_DESCRIPTION =
  'Worst tap water in America, 2026: city water quality reports and state rankings from EPA PFAS data and safety grades. Free reports, no signup.';
