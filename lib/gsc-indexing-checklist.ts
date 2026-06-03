import { gscIndexingUrl } from './site-url';

/** Paths for GSC URL Inspection — ordered by Performance → Pages impressions. */
export const GSC_INDEXING_PATHS = [
  '/blog/best-water-filter-for-lead-removal',
  '/water/san-antonio',
  '/water/new-york',
  '/blog/what-water-filter-removes-pfas',
  '/blog/reverse-osmosis-pros-and-cons',
  '/water/gaithersburg',
  '/water/phoenix',
  '/water/houston',
  '/rankings',
  '/worst-cities',
] as const;

/** Full https:// URLs for Search Console → URL Inspection → Request indexing */
export const GSC_INDEXING_URLS = GSC_INDEXING_PATHS.map(gscIndexingUrl);

export const GSC_SITEMAP_URL = gscIndexingUrl('/sitemap.xml');
