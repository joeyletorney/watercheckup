import { gscIndexingUrl } from './site-url';

/**
 * Request indexing once per URL in Search Console → URL Inspection.
 * Re-request only after meaningful content or metadata changes.
 * Ordered by current impression momentum + latest meta refreshes (Jul 2026).
 */
export const GSC_INDEXING_PATHS = [
  '/water/gaithersburg',
  '/water/san-antonio',
  '/water/raleigh',
  '/water/houston',
  '/water/baltimore',
  '/blog/pfas-in-san-antonio-water',
  '/water/rockville',
  '/water/silver-spring',
  '/water/bethesda',
  '/water/sugar-land',
  '/water/chicago',
  '/water/phoenix',
  '/water/new-york',
  '/water/miami',
  '/water/dallas',
  '/water/los-angeles',
  '/blog/best-water-filter-gaithersburg-md',
  '/blog/best-water-filter-for-lead-removal',
  '/blog/san-antonio-water-quality',
  '/blog/is-new-york-city-tap-water-safe-2026',
  '/blog/what-water-filter-removes-pfas',
  '/utilities/nc/greensboro-townsend',
  '/blog/reverse-osmosis-pros-and-cons',
  '/contact',
  '/water',
  '/rankings',
  '/worst-cities',
  '/worst-pfas',
  '/pfoa-at-epa-limit',
  '/best-cities',
  '/worst-pfas-cities',
  '/results/77001',
  '/results/78205',
  '/results/10001',
] as const;

/** Full https:// URLs for Search Console → URL Inspection → Request indexing */
export const GSC_INDEXING_URLS = GSC_INDEXING_PATHS.map(gscIndexingUrl);

export const GSC_SITEMAP_URL = gscIndexingUrl('/sitemap.xml');

/**
 * Copy-paste list for GSC URL Inspection (one URL per line):
 *
 * https://watercheckup.com/water/gaithersburg
 * https://watercheckup.com/water/san-antonio
 * https://watercheckup.com/water/raleigh
 * https://watercheckup.com/water/houston
 * https://watercheckup.com/water/baltimore
 * https://watercheckup.com/blog/pfas-in-san-antonio-water
 * https://watercheckup.com/water/rockville
 * https://watercheckup.com/water/silver-spring
 * https://watercheckup.com/water/bethesda
 * https://watercheckup.com/water/sugar-land
 * https://watercheckup.com/water/chicago
 * https://watercheckup.com/water/phoenix
 * https://watercheckup.com/water/new-york
 * https://watercheckup.com/water/miami
 * https://watercheckup.com/water/dallas
 * https://watercheckup.com/water/los-angeles
 * https://watercheckup.com/blog/best-water-filter-gaithersburg-md
 * https://watercheckup.com/blog/best-water-filter-for-lead-removal
 * https://watercheckup.com/blog/san-antonio-water-quality
 * https://watercheckup.com/blog/is-new-york-city-tap-water-safe-2026
 * https://watercheckup.com/blog/what-water-filter-removes-pfas
 * https://watercheckup.com/utilities/nc/greensboro-townsend
 * https://watercheckup.com/blog/reverse-osmosis-pros-and-cons
 * https://watercheckup.com/contact
 * https://watercheckup.com/water
 * https://watercheckup.com/rankings
 * https://watercheckup.com/worst-cities
 * https://watercheckup.com/worst-pfas
 * https://watercheckup.com/pfoa-at-epa-limit
 * https://watercheckup.com/best-cities
 * https://watercheckup.com/worst-pfas-cities
 * https://watercheckup.com/results/77001
 * https://watercheckup.com/results/78205
 * https://watercheckup.com/results/10001
 * https://watercheckup.com/sitemap.xml
 */
