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
    title: "San Antonio Water Quality Report – What's Actually in Your Tap Water",
    description:
      "See detected contaminants in San Antonio's tap water, sourced from 5 EPA databases. Free, no signup required. Updated regularly.",
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
    title: 'Houston Tap Water 2026 — 5 Contaminants Above EPA Guidelines',
    description:
      'Houston water has 5 contaminants exceeding EPA health limits including PFAS and disinfection byproducts. Free report and filter recommendations.',
  },
  philadelphia: {
    title: 'Philadelphia Tap Water 2026 — PFOA Levels Above Health Limits',
    description:
      'Philadelphia water has some of the highest PFOA levels of any major US city. See the full EPA contamination report and filter recommendations.',
  },
  chicago: {
    title: 'Chicago Tap Water 2026 — Lead Pipes Still a Serious Risk',
    description:
      'Chicago has more lead service lines than almost any US city. See if your neighborhood is affected and what filter removes lead from tap water.',
  },
  phoenix: {
    title: 'Phoenix Tap Water 2026 — Is It Safe to Drink?',
    description:
      'Phoenix water comes from the Colorado River and local groundwater. See current PFAS levels, contaminant data, and filter recommendations for your ZIP code.',
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
