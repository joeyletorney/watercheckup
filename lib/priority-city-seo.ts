import type { Metadata } from 'next';
import { buildCityPageMetadata } from './city-seo-metadata';
import { getCityPfasData } from './ucmr5-city-pfas';
import { resolveCityPwsid } from './city-pwsid';
import type { CityPfasSnapshot } from './city-water-score';

/** High-traffic city pages — custom titles & descriptions for SEO */
export const PRIORITY_CITY_SEO: Record<string, { title: string; description: string }> = {
  'new-york': {
    title: 'NYC Tap Water Quality 2026 — Safe to Drink? PFAS & Lead',
    description:
      'New York City tap water quality: PFOS in EPA monitoring, lead in pre-1986 buildings. Free 2026 NYC water report with grade and NSF filter picks.',
  },
  'san-antonio': {
    title: 'Is San Antonio Tap Water Safe? Free SAWS Report (2026)',
    description:
      'PFAS detected · 272 mg/L hardness · radium from Edwards Aquifer. Free graded SAWS report with filter picks — no signup.',
  },
  gaithersburg: {
    title: 'Is Gaithersburg Tap Water Safe? Free WSSC Report (2026)',
    description:
      'PFAS in UCMR5, Potomac DBPs & lead risk in pre-1986 homes. Free Gaithersburg MD report with letter grade and NSF filter picks.',
  },
  'los-angeles': {
    title: 'Los Angeles Tap Water 2026 — Chromium-6, PFAS & Safety Grade',
    description:
      'C- grade: LA tap water has chromium-6 above CA health goals, 11.4 ppt PFAS, and 268 mg/L hardness. Free 2026 Los Angeles water quality report from EPA data.',
  },
  houston: {
    title: 'Houston Tap Water 2026 — PFAS, TTHMs & Safety Grade',
    description:
      'D+ grade: Houston tap water has 22.4 ppt PFAS (above EPA MCL), elevated arsenic, and TTHMs at 73% of the limit. Free 2026 Houston water quality report from EPA data.',
  },
  philadelphia: {
    title: 'Philadelphia Tap Water 2026 — Is It Safe? Lead, PFAS & Full Report',
    description:
      'D+ grade: Philly water has 16.1 ppt PFAS, lead service lines in 25% of homes, and Delaware River DBPs. See what\'s in your tap water and the one filter that removes all three.',
  },
  chicago: {
    title: 'Chicago Tap Water: B Grade — Lead Lines, PFAS & DBPs',
    description:
      '150,000+ lead service lines, PFAS in monitoring, chloramine byproducts. Free 2026 Chicago water report with letter grade and NSF filter picks.',
  },
  phoenix: {
    title: 'Phoenix Tap Water: C- Grade — PFAS, Chromium-6 & Hardness',
    description:
      '7.4 ppt PFAS, chromium-6 above CA health goals, very hard water. Free 2026 Phoenix EPA report with letter grade and NSF filter picks.',
  },
  boston: {
    title: 'Boston Tap Water 2026 — Lead Pipes in Older Homes',
    description:
      'MWRA source water is strong but lead service lines in pre-1980 homes are the main tap risk. UCMR5 PFAS snapshot. Free 2026 Boston report.',
  },
  milwaukee: {
    title: 'Milwaukee Tap Water 2026 — Lead Contamination Risk Report',
    description:
      'Milwaukee has thousands of lead service lines still in use. See current lead levels, which neighborhoods are most at risk, and what filter removes lead.',
  },
  cleveland: {
    title: "Cleveland Tap Water 2026 — What's Really in Your Water?",
    description:
      'Cleveland water has multiple contaminants above EPA health guidelines. See the full report, contamination levels, and certified filter recommendations.',
  },
  detroit: {
    title: 'Detroit Tap Water 2026 — Lead & PFAS Contamination Report',
    description:
      'Detroit has a serious lead pipe problem and PFAS contamination. See current levels, health risks, and the exact filter that removes both lead and PFAS.',
  },
  parkersburg: {
    title: 'Parkersburg WV Water 2026 — PFOA 179 ppt, 45× Over EPA Limit',
    description:
      "DuPont's Washington Works plant contaminated Parkersburg water with PFOA at 179.5 ppt — 45× the EPA limit of 4 ppt. See the full contamination report and the only filter that removes it.",
  },
  scottsdale: {
    title: 'Scottsdale Tap Water 2026 — Is It Safe to Drink?',
    description:
      'Scottsdale water comes from Colorado River and local groundwater. See current PFAS and contaminant levels, and get filter recommendations for your home.',
  },
  nashville: {
    title: 'Nashville Tap Water 2026 — PFAS & Chloramine',
    description:
      'Metro Nashville tap water: Cumberland River source, UCMR5 PFAS, chloramine DBPs. Free 2026 Nashville water report with NSF filter picks.',
  },
  charlotte: {
    title: 'Charlotte Tap Water 2026 — PFAS & Hardness',
    description:
      'Charlotte Water: Catawba River source, UCMR5 PFAS monitoring, regional hardness. Free 2026 Charlotte NC tap water report.',
  },
  'sugar-land': {
    title: 'Sugar Land TX Water 2026 — 672 ppt 6:2 FTS, PFOA at EPA Limit',
    description:
      'EPA UCMR5 found 672 ppt 6:2 FTS in Sugar Land water — the highest peak reading of any large Texas system. PFOA was detected at 4.1 ppt (at the EPA limit). See the full 2026 report and NSF 58 filter picks.',
  },
  miami: {
    title: 'Miami Tap Water 2026 — PFAS, Lead & Full Contamination Report',
    description:
      'Miami-Dade water has PFOS at 33 ppt (8× EPA limit), PFOA, PFHxS, and PFNA all above MCLs. See the full 2026 MDWASA water quality report and filter recommendations.',
  },
  'fort-worth': {
    title: 'Fort Worth TX Water 2026 — PFAS Violations & Safety Report',
    description:
      'Fort Worth tap water has PFAS at 102 ppt with PFHxS and PFOS above EPA limits. See the full 2026 contamination report, Trinity River source data, and filter picks for Fort Worth residents.',
  },
  columbus: {
    title: 'Columbus OH Water 2026 — PFAS Violations & Safety Report',
    description:
      'Columbus Public Water System has regulated PFAS above EPA limits in UCMR5 monitoring (18 ppt peak). Scioto River source water. See the full 2026 Columbus water quality report and filter recommendations.',
  },
  dallas: {
    title: 'Dallas Tap Water 2026 — PFAS Violations & Quality Report',
    description:
      'Dallas water has PFOA, PFOS, and PFHxS above EPA limits and elevated TTHMs from chloramine treatment. See the full 2026 Dallas Water Public water systems report and filter picks.',
  },
  sacramento: {
    title: 'Sacramento Water 2026 — Lead 70 ppb + PFAS 41 ppt Violations',
    description:
      'Sacramento tap water has lead at 70 ppb — nearly 5× the EPA action level — and PFAS at 41 ppt with 3 MCL violations. See the full 2026 report and the filters that remove both.',
  },
  pensacola: {
    title: 'Pensacola FL Water 2026 — PFAS at 220 ppt (Eglin AFB Legacy)',
    description:
      'Pensacola/ECUA water has 220 ppt PFAS across 4 compounds above EPA MCLs — linked to Eglin Air Force Base AFFF contamination. See the 2026 report and filter recommendations.',
  },
  fresno: {
    title: 'Fresno Tap Water 2026 — PFAS at 47 ppt & Safety Grade',
    description:
      'F grade: Fresno tap water has PFAS at 47 ppt with PFOS, PFOA, and PFHxS above EPA limits. Free 2026 Fresno water quality report from EPA UCMR5 data.',
  },
  austin: {
    title: 'Austin Tap Water 2026 — PFAS at 8.4 ppt & Safety Grade',
    description:
      'PFOS above EPA limit: Austin tap water has 8.4 ppt PFAS in UCMR5 monitoring. Free 2026 Austin water quality report with filter picks from EPA data.',
  },
  'fairfax-county': {
    title: 'Fairfax County Tap Water 2026 — PFAS at 21.9 ppt',
    description:
      'PFOA and PFOS above EPA MCLs: Fairfax County area water tested at 21.9 ppt PFAS. Free 2026 Northern Virginia water quality report from EPA data.',
  },
  seattle: {
    title: 'Seattle Tap Water 2026 — Safe to Drink? PFAS & Chloramine',
    description:
      'Seattle Public Utilities: UCMR5 PFAS snapshot, chloramine disinfection, and Pacific Northwest source water. Free 2026 report with grade and NSF filter picks.',
  },
  denver: {
    title: 'Denver Tap Water 2026 — PFAS, Hardness & Safety Grade',
    description:
      'Denver Water: mountain source water with hardness and UCMR5 PFAS monitoring. Free 2026 Denver tap water report from EPA data.',
  },
  atlanta: {
    title: 'Atlanta Tap Water 2026 — PFAS & Chloramine Report',
    description:
      'Atlanta Watershed tap water: PFAS UCMR5, chloramine DBPs, and Chattahoochee source. Free 2026 Atlanta water quality report.',
  },
  minneapolis: {
    title: 'Minneapolis Tap Water 2026 — Lead Risk & PFAS',
    description:
      'Minneapolis tap water: Mississippi River source, lead service line risk in older homes, UCMR5 PFAS. Free 2026 report and filter picks.',
  },
  portland: {
    title: 'Portland OR Tap Water 2026 — PFAS & Bull Run Source',
    description:
      'Portland Bull Run tap water: low chlorine taste, UCMR5 PFAS monitoring, regional hardness. Free 2026 Portland water report.',
  },
  'las-vegas': {
    title: 'Las Vegas Tap Water 2026 — Hardness & PFAS',
    description:
      'Las Vegas Valley Water: Colorado River source, very hard water, UCMR5 PFAS snapshot. Free 2026 Las Vegas tap water report.',
  },
  baltimore: {
    title: 'Baltimore Tap Water 2026 — Lead & PFAS Report',
    description:
      'Baltimore City tap water: aging infrastructure, lead risk in older homes, UCMR5 PFAS. Free 2026 EPA-backed report.',
  },
  tampa: {
    title: 'Tampa Tap Water 2026 — PFAS & Chloramine',
    description:
      'Tampa Bay Water: Florida chloramine treatment, UCMR5 PFAS, hardness. Free 2026 Tampa tap water quality report.',
  },
  'st-louis': {
    title: 'St. Louis Tap Water 2026 — Lead Pipes & PFAS',
    description:
      'St. Louis tap water: Mississippi River source, lead service line concern, UCMR5 PFAS monitoring. Free 2026 report.',
  },
  'san-diego': {
    title: 'San Diego Tap Water 2026 — PFAS & Hardness',
    description:
      'San Diego imported Colorado River water: hardness, chloramine, UCMR5 PFAS. Free 2026 San Diego water quality report.',
  },
  orlando: {
    title: 'Orlando Tap Water 2026 — Is It Safe to Drink?',
    description:
      'Orlando Utilities Commission: Florida groundwater blend, chloramine, UCMR5 PFAS. Free 2026 Orlando tap water report.',
  },
  'new-orleans': {
    title: 'New Orleans Tap Water 2026 — Lead & DBP Report',
    description:
      'New Orleans Sewerage & Water Board: Mississippi River source, lead and disinfection byproduct concerns. Free 2026 report.',
  },
  pittsburgh: {
    title: 'Pittsburgh Tap Water 2026 — Lead & PFAS',
    description:
      'Pittsburgh Water: Allegheny River source, lead service lines, UCMR5 PFAS. Free 2026 Pittsburgh tap water report.',
  },
  'san-jose': {
    title: 'San Jose Tap Water 2026 — PFAS & Chromium-6',
    description:
      'San Jose tap water: South Bay blend, California health guideline concerns, UCMR5 PFAS. Free 2026 report.',
  },
};

/** H1 copy for priority city pages — matches 2026 title-tag pattern */
export const PRIORITY_CITY_H1: Record<string, string> = {
  gaithersburg: 'Is Gaithersburg Tap Water Safe? (2026)',
  'san-antonio': 'Is San Antonio Tap Water Safe? (2026)',
  chicago: 'Chicago Tap Water Quality 2026',
  phoenix: 'Phoenix Tap Water Quality 2026',
  'new-york': 'New York City Water Quality 2026',
  'los-angeles': 'Los Angeles Water Quality 2026',
  philadelphia: 'Philadelphia Water Quality 2026',
  'sugar-land': 'Sugar Land Water Quality 2026',
  miami: 'Miami Water Quality 2026',
  'fort-worth': 'Fort Worth Water Quality 2026',
  columbus: 'Columbus Water Quality 2026',
  dallas: 'Dallas Water Quality 2026',
  sacramento: 'Sacramento Water Quality 2026',
  pensacola: 'Pensacola Water Quality 2026',
  fresno: 'Fresno Water Quality 2026',
  austin: 'Austin Water Quality 2026',
  'fairfax-county': 'Fairfax County Water Quality 2026',
};

type PriorityCityRecord = {
  name: string;
  state: string;
  zip?: string;
  issues: string[];
  urgency: 'high' | 'medium' | 'low';
  pwsid: string;
};

/** Grade + key-finding SERP titles for dedicated city routes */
export function metadataForPriorityCity(
  slug: string,
  city?: PriorityCityRecord,
  pfas?: CityPfasSnapshot
): Metadata | null {
  const seo = PRIORITY_CITY_SEO[slug];
  if (!seo) return null;

  if (city) {
    return buildCityPageMetadata(
      slug,
      city,
      pfas ?? getCityPfasData(resolveCityPwsid(slug, city.pwsid, city.zip)),
      seo,
    );
  }

  const canonical = `https://watercheckup.com/water/${slug}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}
