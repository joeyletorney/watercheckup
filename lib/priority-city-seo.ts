import type { Metadata } from 'next';

/** High-traffic city pages — custom titles & descriptions for SEO */
export const PRIORITY_CITY_SEO: Record<string, { title: string; description: string }> = {
  'new-york': {
    title: 'New York City Tap Water 2026 — PFAS & Lead Contamination Report',
    description:
      'NYC tap water contains PFAS and other contaminants above health guidelines. See the full EPA report for your neighborhood and the best filter for New York City tap water.',
  },
  'san-antonio': {
    title: 'San Antonio Tap Water 2026 — Contamination Warning Issued',
    description:
      'San Antonio water has contaminants above EPA health guidelines including PFAS. See current levels, health risks, and certified filter recommendations. Free report.',
  },
  'los-angeles': {
    title: 'Los Angeles Tap Water 2026 — Chromium-6 & PFAS Detected',
    description:
      'LA tap water contains chromium-6 and PFAS above health guidelines. See the full EPA data for your neighborhood and what filter removes it.',
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
};

export function metadataForPriorityCity(slug: string): Metadata | null {
  const seo = PRIORITY_CITY_SEO[slug];
  if (!seo) return null;

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
