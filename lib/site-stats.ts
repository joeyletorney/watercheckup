/** Public coverage figures — used sitewide for consistent copy. */

/** EPA community water systems (CWS) — ~150K nationally; aligns with SDWIS public reporting. */
export const SITE_PUBLIC_WATER_SYSTEM_COUNT = '150K+';

export const SITE_PUBLIC_WATER_SYSTEM_LABEL = 'Community Water Systems';

export const SITE_DATA_FRESHNESS_LABEL = 'June 2026';

export const SITE_CONTAMINANT_COVERAGE_LABEL = '170+';

export const SITE_HERO_EXAMPLE_ZIPS = [
  { zip: '78205', label: 'San Antonio' },
  { zip: '10001', label: 'New York' },
  { zip: '20878', label: 'Gaithersburg' },
] as const;

export const SITE_COVERAGE_STATS = [
  { stat: SITE_PUBLIC_WATER_SYSTEM_COUNT, label: SITE_PUBLIC_WATER_SYSTEM_LABEL },
  { stat: 'All 50', label: 'States Covered' },
  { stat: SITE_CONTAMINANT_COVERAGE_LABEL, label: 'Contaminants Tracked' },
  { stat: '30+', label: 'Years of Expertise' },
] as const;

export const SITE_WATER_SYSTEMS_LABEL = 'All 50 states, all for free';

export const VIEW_ALL_WATER_SYSTEMS_LINK = 'Browse all 50 states — all free →';

export const SITE_HERO_POSITIONING =
  'Free tap water reports for all 50 states — Water Safety Score, PFAS, lead, and expert filter picks. Built by a 30-year water treatment specialist.';

export const SITE_HERO_TAGLINE =
  'Free Tap Water report in seconds — PFAS, Lead, Hardness, and NSF filter picks matched to your ZIP CODE.';

export const SITE_HOME_META_DESCRIPTION =
  'Free tap water report by ZIP — Water Safety Score (0–88), PFAS, lead, hardness & EPA violations. NSF filter picks from a 30-year water expert. No signup.';

export const SITE_FOOTER_TAGLINE =
  'WaterCheckup — Free tap water reports by ZIP. Built by a real water expert, not a tech company.';

/** Short sitewide disclaimers — full detail lives on /methodology and near filter picks. */
export const SITE_FOOTER_DISCLAIMER =
  'Reports use EPA public data and may lag 1–3 years. For decisions that matter, confirm with your utility or a certified lab test.';

export const SITE_FOOTER_AFFILIATE =
  'Amazon Associates participant — some filter links are affiliate (no extra cost). Recommendations follow NSF certifications, not paid placements.';

export const SITE_HERO_TRUST_BANNER = [
  `Updated ${SITE_DATA_FRESHNESS_LABEL}`,
  `${SITE_PUBLIC_WATER_SYSTEM_COUNT} community water systems`,
  'Free · No signup',
] as const;

export const WHY_WATERCHECKUP_CARDS = [
  {
    icon: '📍',
    title: 'Free tap water reports by ZIP',
    body: `All 50 states. Look up your ZIP for a Water Safety Score (0–88), PFAS and violation signals, and NSF-certified filter options matched to your report — no signup. ${SITE_PUBLIC_WATER_SYSTEM_COUNT} community water systems in our directory.`,
  },
  {
    icon: '👨‍🔬',
    title: 'Real expert behind every recommendation',
    body: 'WaterCheckup was built by a 30-year water treatment veteran and published industry author. Not a tech company. Not an algorithm. A real water expert.',
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
  { feature: 'Search by ZIP code', watercheckup: { type: 'yes', text: '' }, others: { type: 'yes', text: 'Some' } },
  { feature: 'Search by public water system', watercheckup: { type: 'yes', text: 'Nationwide' }, others: { type: 'warn', text: 'Limited' } },
  { feature: 'All 50 states', watercheckup: { type: 'yes', text: '' }, others: { type: 'warn', text: 'Most' } },
  { feature: 'Expert filter recommendations', watercheckup: { type: 'yes', text: 'Contaminant-matched' }, others: { type: 'no', text: 'Generic' } },
  { feature: 'Published water expert', watercheckup: { type: 'yes', text: 'Joe Letorney' }, others: { type: 'no', text: '' } },
  { feature: 'WQA credentials', watercheckup: { type: 'yes', text: 'Level VI (former)' }, others: { type: 'no', text: '' } },
  { feature: '100% Free', watercheckup: { type: 'yes', text: '' }, others: { type: 'yes', text: 'Most' } },
  { feature: 'EPA verified data', watercheckup: { type: 'yes', text: 'UCMR5 + SDWIS' }, others: { type: 'warn', text: 'Some' } },
];

export const CITY_EXPERT_TRUST_BADGE =
  'Recommendations by Joe Letorney, 30-year water treatment specialist';

export const BLOG_AUTHOR_BYLINE = {
  name: 'Joe Letorney',
  credentials: '30-Year Water Treatment Expert | WQA Certified Specialist (Former)',
} as const;
