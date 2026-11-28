/**
 * Extra same-topic city links for internal crawl paths.
 * NearbyCities prepends these (when the slug exists) before same-state fill.
 */
export const RELATED_CITY_SLUGS: Record<string, readonly string[]> = {
  parkersburg: ['pittsburgh', 'columbus', 'cincinnati'],
  pittsburgh: ['parkersburg', 'columbus', 'cincinnati'],
  columbus: ['parkersburg', 'cincinnati', 'pittsburgh'],
  cincinnati: ['parkersburg', 'columbus', 'pittsburgh'],
  gaithersburg: ['rockville', 'silver-spring', 'bethesda', 'baltimore'],
  rockville: ['gaithersburg', 'bethesda', 'silver-spring'],
  'silver-spring': ['gaithersburg', 'bethesda', 'rockville'],
  bethesda: ['gaithersburg', 'silver-spring', 'rockville'],
};

/** State-hub featured city reports (high-impression pages that need inbound links). */
export const STATE_FEATURED_CITIES: Record<string, readonly { slug: string; label: string }[]> = {
  WV: [{ slug: 'parkersburg', label: 'Parkersburg tap water — PFOA / Ohio River history' }],
  MD: [
    { slug: 'gaithersburg', label: 'Gaithersburg water testing — well vs city (WSSC)' },
    { slug: 'baltimore', label: 'Baltimore water testing' },
    { slug: 'rockville', label: 'Rockville tap water' },
  ],
};

export function relatedCitySlugsFor(slug: string): readonly string[] {
  return RELATED_CITY_SLUGS[slug] ?? [];
}

export function featuredCitiesForState(stateAbbr: string): readonly { slug: string; label: string }[] {
  return STATE_FEATURED_CITIES[stateAbbr] ?? [];
}
