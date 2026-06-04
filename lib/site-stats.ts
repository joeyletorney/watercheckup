/** Public coverage figures — used sitewide for consistent copy. */

/** ZIP codes in lib/zip-lookup.json — mapped to EPA SDWIS for live lookups. */
export const SITE_ZIP_LOOKUP_COUNT = '21,000+';

/** Curated city water guides (app/water/[city]/cities-data.ts). */
export const SITE_CITY_GUIDE_COUNT = '140+';

/** EPA community water systems (CWS) — ~150K nationally; aligns with SDWIS public reporting. */
export const SITE_PUBLIC_WATER_SYSTEM_COUNT = '150K+';

export const SITE_PUBLIC_WATER_SYSTEM_LABEL = 'Community Water Systems';

/** UCMR5 PFAS monitoring systems in lib/ucmr5.json (federal 2023–2025 round). */
export const SITE_UCMR5_PFAS_SYSTEM_COUNT = '6,151';

export const SITE_DATA_FRESHNESS_LABEL = 'June 2026';

export const SITE_CONTAMINANT_COVERAGE_LABEL = '170+';

export const SITE_HERO_EXAMPLE_ZIPS = [
  { zip: '78205', label: 'San Antonio' },
  { zip: '10001', label: 'New York' },
  { zip: '20878', label: 'Gaithersburg' },
] as const;

export const SITE_COVERAGE_STATS = [
  { stat: SITE_ZIP_LOOKUP_COUNT, label: 'ZIP Codes Mapped' },
  { stat: SITE_PUBLIC_WATER_SYSTEM_COUNT, label: SITE_PUBLIC_WATER_SYSTEM_LABEL },
  { stat: SITE_UCMR5_PFAS_SYSTEM_COUNT, label: 'PFAS Systems (UCMR5)' },
  { stat: SITE_CONTAMINANT_COVERAGE_LABEL, label: 'Contaminants Tracked' },
] as const;

export const SITE_WATER_SYSTEMS_LABEL = 'All 50 states, all for free';

export const VIEW_ALL_WATER_SYSTEMS_LINK = 'Browse all 50 states — all free →';

export const SITE_HERO_POSITIONING = [
  `${SITE_ZIP_LOOKUP_COUNT} ZIP codes`,
  `${SITE_PUBLIC_WATER_SYSTEM_COUNT} community water systems (EPA SDWIS)`,
  `${SITE_UCMR5_PFAS_SYSTEM_COUNT} PFAS systems (UCMR5)`,
  `Updated ${SITE_DATA_FRESHNESS_LABEL}`,
  'Built by a 30-year water treatment expert',
].join(' · ');

export const SITE_HERO_TAGLINE =
  'Free tap water report in seconds — Water Safety Score (0–88), PFAS, lead, hardness, and NSF filter picks for your ZIP.';

export const SITE_HOME_META_DESCRIPTION =
  'Free tap water report by ZIP — Water Safety Score (0–88), PFAS, lead, hardness & EPA violations. NSF filter picks from a 30-year water expert. No signup.';

export const SITE_FOOTER_TAGLINE =
  'WaterCheckup — Free tap water reports by ZIP. Built by a real water expert, not a tech company.';

/** Short sitewide disclaimers — full detail on /methodology; score context on report pages. */
export const SITE_FOOTER_DISCLAIMER =
  'For informational purposes only — not legal, medical, or utility compliance advice. Violation and monitoring figures come from EPA public databases (SDWIS, UCMR5, etc.) and may lag real events by months.';

export const SITE_FOOTER_SCORE_DISCLAIMER =
  'Letter grades and the 0–88 WaterCheckup Safety Score are our independent index (hardness, PFAS, health guidelines, and compliance signals) — not your water system’s official rating or an EPA grade for your town.';

export const SITE_FOOTER_AFFILIATE =
  'Amazon Associates participant — some filter links are affiliate (no extra cost). Recommendations follow NSF certifications, not paid placements.';

export const SITE_HERO_TRUST_BANNER = [
  `${SITE_ZIP_LOOKUP_COUNT} ZIP codes`,
  `${SITE_PUBLIC_WATER_SYSTEM_COUNT} EPA community water systems`,
  `${SITE_UCMR5_PFAS_SYSTEM_COUNT} PFAS systems (UCMR5)`,
  'Free · No signup',
] as const;

export const WHY_WATERCHECKUP_CARDS = [
  {
    icon: '📍',
    title: 'Free tap water reports by ZIP',
    body: `All 50 states. Look up your ZIP for a Water Safety Score (0–88), PFAS and violation signals, and NSF-certified filter options matched to your report — no signup. We map ${SITE_ZIP_LOOKUP_COUNT} ZIP codes to EPA records (${SITE_PUBLIC_WATER_SYSTEM_COUNT} community water systems nationally; ${SITE_UCMR5_PFAS_SYSTEM_COUNT} in UCMR5 PFAS monitoring).`,
  },
  {
    icon: '👨‍🔬',
    title: 'Real expert behind every recommendation',
    body: 'WaterCheckup was built by a 30-year water treatment veteran and published industry author.',
  },
] as const;

export type ComparisonCell = { type: 'yes'; text: string } | { type: 'no'; text: string } | { type: 'warn'; text: string };

export const SITE_COMPARISON_ROWS: {
  feature: string;
  watercheckup: ComparisonCell;
  others: ComparisonCell;
}[] = [
  { feature: 'Built by a real water expert', watercheckup: { type: 'yes', text: '30+ years' }, others: { type: 'no', text: 'Tech companies' } },
  { feature: 'Coverage', watercheckup: { type: 'yes', text: 'All 50 states, free' }, others: { type: 'no', text: 'Limited' } },
  { feature: 'Search by ZIP code', watercheckup: { type: 'yes', text: '' }, others: { type: 'warn', text: 'Some' } },
  { feature: 'Search by public water system', watercheckup: { type: 'yes', text: 'Nationwide' }, others: { type: 'warn', text: 'Limited' } },
  { feature: 'All 50 states', watercheckup: { type: 'yes', text: '' }, others: { type: 'warn', text: 'Most' } },
  { feature: 'Expert filter recommendations', watercheckup: { type: 'yes', text: 'Contaminant-matched' }, others: { type: 'no', text: 'Generic' } },
  { feature: 'WQA credentials', watercheckup: { type: 'yes', text: 'Level VI (former)' }, others: { type: 'no', text: '' } },
  { feature: '100% Free', watercheckup: { type: 'yes', text: '' }, others: { type: 'yes', text: 'Most' } },
  { feature: 'EPA verified data', watercheckup: { type: 'yes', text: 'UCMR5 + SDWIS' }, others: { type: 'warn', text: 'Partial / mixed sources' } },
];

export const CITY_EXPERT_TRUST_BADGE =
  'Recommendations by Joe Letorney, 30-year water treatment specialist';

export const BLOG_AUTHOR_BYLINE = {
  name: 'Joe Letorney',
  credentials: '30-Year Water Treatment Expert | WQA Certified Specialist (Former)',
} as const;
