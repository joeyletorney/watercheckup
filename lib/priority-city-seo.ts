import type { Metadata } from 'next';

/** High-traffic city pages — custom titles & descriptions for SEO */
export const PRIORITY_CITY_SEO: Record<string, { title: string; description: string }> = {
  'san-antonio': {
    title: 'San Antonio Tap Water 2026 — Contamination Warning',
    description:
      'San Antonio water has contaminants above EPA health guidelines including PFAS. See current levels, health risks, and certified filter recommendations. Free report.',
  },
  'new-york': {
    title: 'New York City Tap Water 2026 — PFAS & Contaminants Report',
    description:
      "NYC tap water contains PFAS and other contaminants above health guidelines. See the full EPA report, what's in your water, and the best filter for New York City tap water.",
  },
  houston: {
    title: 'Houston Tap Water Report 2026 — 5 Contaminants Above Guidelines',
    description:
      'Houston water has 5 contaminants exceeding EPA health limits including PFAS and disinfection byproducts. Free report and filter recommendations.',
  },
  'los-angeles': {
    title: 'Los Angeles Tap Water 2026 — Chromium-6 & PFAS Detected',
    description:
      'LA tap water contains chromium-6 and PFAS at levels above health guidelines. See the full EPA data for your neighborhood and what filter removes it.',
  },
  chicago: {
    title: 'Chicago Tap Water 2026 — Lead Pipes Still a Risk',
    description:
      'Chicago has more lead service lines than almost any US city. See if your neighborhood is affected and what filter removes lead from tap water.',
  },
  phoenix: {
    title: 'Phoenix Tap Water Report 2026 — Is It Safe to Drink?',
    description:
      'Phoenix water comes from the Colorado River and local groundwater. See current PFAS levels, contaminant data, and filter recommendations for your ZIP code.',
  },
  philadelphia: {
    title: 'Philadelphia Tap Water 2026 — PFOA Levels Above Health Limits',
    description:
      'Philadelphia water has some of the highest PFOA levels of any major US city. See the full EPA contamination report and certified filter recommendations.',
  },
  parkersburg: {
    title: 'Parkersburg WV Water 2026 — Ground Zero for PFAS Contamination',
    description:
      'Parkersburg, WV is the birthplace of PFAS contamination in America. See current contamination levels, health risks, and how to protect your family.',
  },
  boston: {
    title: 'Boston Tap Water 2026 — Lead Pipes in Older Homes a Key Risk',
    description:
      "Boston's source water is clean but lead service lines in older neighborhoods are a real concern. Check your ZIP and get filter recommendations.",
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
