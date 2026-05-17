/** Public coverage figures from utilities.json and EPA scope — used sitewide for consistent copy. */

export const SITE_COVERAGE_STATS = [
  { stat: '400,000+', label: 'Local Water Utilities Tracked' },
  { stat: 'All 50', label: 'States Covered' },
  { stat: '300M+', label: 'Americans Served' },
  { stat: '30+', label: 'Years of Expertise' },
] as const;

export const SITE_WATER_SYSTEMS_LABEL = '400,000+ local water utilities tracked';

export const VIEW_ALL_WATER_SYSTEMS_LINK = 'Browse 400,000+ local water utilities →';

export const SITE_HERO_POSITIONING =
  'The most comprehensive free water quality database in America — 400,000+ utilities, all 50 states, built by a 30-year water treatment expert.';

export const SITE_HERO_TAGLINE =
  'Enter your ZIP, city, county, or utility for EPA-backed reports and contaminant-matched filter picks — free, no login.';

export const SITE_HOME_META_DESCRIPTION =
  'The most comprehensive free water quality database in America. 400,000+ water utilities, all 50 states, built by Joe Letorney — 30-year water treatment expert and former WQA Certified Specialist. Check your city, county, ZIP, or utility now.';

export const SITE_FOOTER_TAGLINE =
  'WaterCheckup — The most comprehensive free water quality database in America. Built by a real water expert, not a tech company.';

export const SITE_HERO_TRUST_BANNER = [
  '400,000+ Utilities Covered',
  'All 50 States',
  '30 Years of Expertise',
  '100% Free',
] as const;

export const WHY_WATERCHECKUP_CARDS = [
  {
    icon: '🏆',
    title: 'Most Comprehensive Coverage',
    body: '400,000+ local water utilities tracked across all 50 states. From major cities to small towns — if the EPA regulates it, WaterCheckup covers it. More coverage than any other free water quality site.',
  },
  {
    icon: '👨‍🔬',
    title: 'Real Expert Behind Every Recommendation',
    body: 'WaterCheckup was built by a 30-year water treatment veteran and published industry author. Not a tech company. Not an algorithm. A real water expert.',
  },
  {
    icon: '🔬',
    title: 'The Only Site That Does All Four',
    body: 'Check your water by city, county, ZIP code, or water utility — all in one place, all for free. No other site covers all four.',
  },
] as const;

export type ComparisonCell = { type: 'yes'; text: string } | { type: 'no'; text: string } | { type: 'warn'; text: string };

export const SITE_COMPARISON_ROWS: {
  feature: string;
  watercheckup: ComparisonCell;
  others: ComparisonCell;
}[] = [
  { feature: 'Built by a real water expert', watercheckup: { type: 'yes', text: '30+ years' }, others: { type: 'no', text: 'Tech companies' } },
  { feature: 'Utilities covered', watercheckup: { type: 'yes', text: '400,000+' }, others: { type: 'no', text: '18,000 max' } },
  { feature: 'Search by ZIP code', watercheckup: { type: 'yes', text: '' }, others: { type: 'yes', text: 'Some' } },
  { feature: 'Search by county', watercheckup: { type: 'yes', text: '' }, others: { type: 'no', text: '' } },
  { feature: 'Search by utility', watercheckup: { type: 'yes', text: '400,000+' }, others: { type: 'warn', text: 'Limited' } },
  { feature: 'All 50 states', watercheckup: { type: 'yes', text: '' }, others: { type: 'warn', text: 'Most' } },
  { feature: 'Expert filter recommendations', watercheckup: { type: 'yes', text: 'Contaminant-matched' }, others: { type: 'no', text: 'Generic' } },
  { feature: 'Published water expert', watercheckup: { type: 'yes', text: 'Joe Letorney' }, others: { type: 'no', text: '' } },
  { feature: 'WQA Credentials', watercheckup: { type: 'yes', text: 'Level VI' }, others: { type: 'no', text: '' } },
  { feature: '100% Free', watercheckup: { type: 'yes', text: '' }, others: { type: 'yes', text: 'Most' } },
  { feature: 'EPA verified data', watercheckup: { type: 'yes', text: 'UCMR5 + SDWIS' }, others: { type: 'warn', text: 'Some' } },
];

export const CITY_EXPERT_TRUST_BADGE =
  'Recommendations by Joe Letorney, 30-year water treatment specialist';

export const BLOG_AUTHOR_BYLINE = {
  name: 'Joe Letorney',
  credentials: '30-Year Water Treatment Expert | WQA Certified Specialist (Former)',
} as const;
