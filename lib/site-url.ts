/** Canonical origin for metadata, sitemap, and JSON-LD */
export const SITE_ORIGIN = 'https://watercheckup.com';

export function siteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

/** Full URLs for GSC URL Inspection (must match https://watercheckup.com or Domain property). */
export function gscIndexingUrl(path: string): string {
  return siteUrl(path);
}
