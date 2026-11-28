/**
 * Sitemap lastmod dates from real content updates — never Date.now() on
 * unchanged URLs. Blog posts use BLOG_POST_DATE_MODIFIED.
 */

/** City report Article schema + last editorial pass on city pages. */
export const CITY_PAGE_LASTMOD = '2026-11-28';

/** State hub pages share city-report data; last city editorial pass. */
export const STATE_PAGE_LASTMOD = '2026-11-28';

/** Maryland utility testing pages that stay in the sitemap. */
export const MD_UTILITY_GUIDE_LASTMOD = '2026-11-21';

/** EPA SDWIS snapshot baked into data/utilities.json (not used for city lastmod). */
export const UTILITIES_DATA_LASTMOD = '2026-05-16';

/**
 * Static / money / hub pages keyed by pathname (`''` = homepage).
 * Dates follow the last meaningful content commit for that route.
 */
export const STATIC_PATH_LASTMOD: Record<string, string> = {
  '': '2026-11-28',
  '/about': '2026-11-23',
  '/about/joe-letorney': '2026-11-23',
  '/contact': '2026-11-15',
  '/privacy': '2026-06-01',
  '/terms': '2026-06-01',
  '/water': '2026-11-28',
  '/methodology': '2026-11-18',
  '/faq': '2026-11-28',
  '/contaminants': '2026-06-05',
  '/blog': '2026-11-21',
  '/quiz': '2026-11-23',
  '/worst': '2026-11-19',
  '/worst-pfas': '2026-11-19',
  '/worst-thm': '2026-11-19',
  '/worst-water': '2026-11-19',
  '/worst-lead': '2026-11-19',
  '/worst-violations': '2026-11-19',
  '/worst-states': '2026-11-19',
  '/worst-cities': '2026-11-28',
  '/best-cities': '2026-11-28',
  '/worst-hardness': '2026-11-19',
  '/worst-pfas-cities': '2026-11-19',
  '/pfoa-at-epa-limit': '2026-11-19',
  '/well': '2026-11-28',
  '/pfas': '2026-11-28',
  '/lead': '2026-11-28',
  '/rankings': '2026-11-28',
  '/water-hardness': '2026-11-19',
  '/best-water-filter': '2026-11-28',
};

/** City filter guides: first publish of /best-water-filter/[city]. */
export const CITY_FILTER_PAGE_LASTMOD = '2026-11-28';

export function staticPathLastmod(path: string): string {
  return STATIC_PATH_LASTMOD[path] ?? CITY_PAGE_LASTMOD;
}
