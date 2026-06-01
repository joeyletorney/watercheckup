import type { Metadata } from 'next';
import { buildCityPageMetadata } from './city-seo-metadata';
import { getCityPfasData } from './ucmr5-city-pfas';
import type { CityPfasSnapshot } from './city-water-score';

/** High-traffic city pages — custom titles & descriptions for SEO */
export const PRIORITY_CITY_SEO: Record<string, { title: string; description: string }> = {
  'new-york': {
    title: 'NYC Tap Water 2026 — Lead, PFAS & Safety Grade',
    description:
      'B+ grade: NYC source water ranks among the best in the US, but lead in pre-1986 buildings and PFAS detections are real faucet risks. Free 2026 New York City water quality report from EPA data.',
  },
  'san-antonio': {
    title: 'San Antonio Water Contamination 2026 — PFAS, Lead & Quality Report',
    description:
      'San Antonio tap water has PFAS above EWG limits, 272 mg/L hardness, arsenic, and radium. See the full contamination report, safety grade, and which filter actually fixes it.',
  },
  gaithersburg: {
    title: 'Gaithersburg Water Quality 2026 — WSSC Tap Water Report (Free)',
    description:
      'Gaithersburg, MD water quality from WSSC Water: EPA violations, PFAS UCMR5 data, lead risk in older homes, and certified filter picks. Free Montgomery County report.',
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
      'D+ grade: Chicago has 400,000+ lead service lines, 14.2 ppt PFAS, and chloramine DBPs. Free 2026 Chicago water quality report from EPA data.',
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
    title: 'Parkersburg WV Water 2026 — Ground Zero for PFAS Contamination',
    description:
      "Parkersburg WV is where America's PFAS crisis started. See current contamination levels, health risks, and how to protect your family from forever chemicals.",
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
};

/** H1 copy for priority city pages — matches 2026 title-tag pattern */
export const PRIORITY_CITY_H1: Record<string, string> = {
  'new-york': 'New York City Water Quality 2026',
  'los-angeles': 'Los Angeles Water Quality 2026',
  philadelphia: 'Philadelphia Water Quality 2026',
  chicago: 'Chicago Water Quality 2026',
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
    return buildCityPageMetadata(slug, city, pfas ?? getCityPfasData(city.pwsid), seo);
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
