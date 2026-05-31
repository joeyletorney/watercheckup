import type { Metadata } from 'next';
import { buildCityPageMetadata } from './city-seo-metadata';
import { getCityPfasData } from './ucmr5-city-pfas';
import type { CityPfasSnapshot } from './city-water-score';

/** High-traffic city pages — custom titles & descriptions for SEO */
export const PRIORITY_CITY_SEO: Record<string, { title: string; description: string }> = {
  'new-york': {
    title: "New York City Water Quality – Contaminants Found in NYC Tap Water",
    description:
      "NYC tap water scores well — but contaminants are still detected. See the full breakdown from EPA data, free at WaterCheckup.com.",
  },
  'san-antonio': {
    title: 'San Antonio Tap Water 2026 — PFAS, Hardness & Safety Grade',
    description:
      'C- grade: SAWS tap water is very hard (272 mg/L), PFAS detected, and DBP violations on record. Free 2026 San Antonio water quality report from EPA data.',
  },
  gaithersburg: {
    title: 'Gaithersburg Water Quality 2026 — WSSC Tap Water Report (Free)',
    description:
      'Gaithersburg, MD water quality from WSSC Water: EPA violations, PFAS UCMR5 data, lead risk in older homes, and certified filter picks. Free Montgomery County report.',
  },
  'los-angeles': {
    title: "Los Angeles Water Quality Report – What's in LA Tap Water?",
    description:
      "LA's water has a complicated history. Check detected contaminants pulled from 5 EPA databases — free, no account needed.",
  },
  houston: {
    title: 'Houston Water Quality Report – Contaminants in Houston Tap Water',
    description:
      "Houston's water supply serves millions — but what's actually in it? Check detected contaminants from EPA data, free at WaterCheckup.com.",
  },
  philadelphia: {
    title: "Philadelphia Water Quality Report – What's in Philly Tap Water?",
    description:
      "Philadelphia's water has faced scrutiny for years. See exactly what contaminants are detected, pulled from 5 EPA databases. Free lookup.",
  },
  chicago: {
    title: 'Chicago Tap Water 2026 — Lead Pipes Still a Serious Risk',
    description:
      'Chicago has more lead service lines than almost any US city. See if your neighborhood is affected and what filter removes lead from tap water.',
  },
  phoenix: {
    title: "Phoenix Water Quality Report – What's in Arizona Tap Water?",
    description:
      'Phoenix draws from the Colorado River — and that comes with tradeoffs. See detected contaminants from EPA data, free and no signup needed.',
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
