import { gscIndexingUrl } from './site-url';

/**
 * Request indexing once per URL in Search Console → URL Inspection.
 * Re-request only after meaningful content or metadata changes.
 * Ordered by current impression momentum (Gaithersburg first, Jun 2026).
 */
export const GSC_INDEXING_PATHS = [
  '/water/gaithersburg',
  '/blog/best-water-filter-gaithersburg-md',
  '/blog/best-water-filter-for-lead-removal',
  '/blog/san-antonio-water-quality',
  '/blog/pfas-in-san-antonio-water',
  '/water/san-antonio',
  '/water/new-york',
  '/blog/is-new-york-city-tap-water-safe-2026',
  '/blog/what-water-filter-removes-pfas',
  '/water/phoenix',
  '/water/chicago',
  '/utilities/nc/greensboro-townsend',
  '/blog/reverse-osmosis-pros-and-cons',
  '/water/houston',
  '/rankings',
  '/worst-cities',
  '/best-cities',
  '/worst-pfas-cities',
] as const;

/** Full https:// URLs for Search Console → URL Inspection → Request indexing */
export const GSC_INDEXING_URLS = GSC_INDEXING_PATHS.map(gscIndexingUrl);

export const GSC_SITEMAP_URL = gscIndexingUrl('/sitemap.xml');
