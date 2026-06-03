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
    title: 'San Antonio Water Contamination & Quality 2026',
    description:
      'San Antonio water contamination & quality: PFAS in UCMR5, 272 mg/L hardness, arsenic, radium. Full SAWS 2026 report with letter grade and NSF filter picks.',
  },
  gaithersburg: {
    title: 'Gaithersburg Water Quality & Testing MD 2026',
    description:
      'Gaithersburg water quality & water testing (WSSC): PFAS UCMR5, Montgomery County tap water, lead in older homes, certified filters. Free MD report.',
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
    title: 'Chicago Tap Water 2026 — Lead Pipes, PFAS & Safety Grade',
    description:
      'D+ grade: Chicago has 150,000+ lead service lines, 14.2 ppt PFAS, and chloramine DBPs. Free 2026 Chicago water quality report from EPA data.',
  },
  phoenix: {
    title: 'Phoenix Tap Water 2026 — PFAS, Hardness & Safety Grade',
    description:
      'C grade: Phoenix tap water has 7.4 ppt PFAS, chromium-6 above CA goals, and 288 mg/L hardness. Free 2026 Phoenix water quality report from EPA data.',
  },
  boston: {
    title: 'Boston Tap Water 2026 — Lead Pipes in Older Homes a Key Risk',
    description:
      'Boston source water is clean but lead service lines in older neighborhoods are a real concern. Check your ZIP and get filter recommendations.',
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
    title: 'Nashville Tap Water 2026 — Contamination Report',
    description:
      'Nashville tap water quality report with current EPA data on contaminants, PFAS levels, and certified filter recommendations for Nashville residents.',
  },
  charlotte: {
    title: 'Charlotte Tap Water 2026 — Water Quality Report',
    description:
      'Charlotte water quality report with current EPA contamination data, PFAS levels, and filter recommendations for Charlotte, NC residents.',
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
};

/** H1 copy for priority city pages — matches 2026 title-tag pattern */
export const PRIORITY_CITY_H1: Record<string, string> = {
  'new-york': 'New York City Water Quality 2026',
  'los-angeles': 'Los Angeles Water Quality 2026',
  philadelphia: 'Philadelphia Water Quality 2026',
  chicago: 'Chicago Water Quality 2026',
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
    return buildCityPageMetadata(slug, city, pfas ?? getCityPfasData(resolveCityPwsid(slug, city.pwsid)), seo);
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
