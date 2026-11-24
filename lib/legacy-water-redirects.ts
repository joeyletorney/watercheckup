import { CITIES, stateAbbrToSlug, stateSlugToAbbr } from '@/lib/cities';

const STATE_PAGE_ABBRS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
] as const;

export type StatePageAbbr = (typeof STATE_PAGE_ABBRS)[number];

function slugifyLabel(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CITY_SLUGS = new Set(Object.keys(CITIES));

/** States with at least one `/water/<city>` report — empty hubs 404 (`rows.length === 0`). */
const LIVE_STATE_ABBRS = new Set(Object.values(CITIES).map((cd) => cd.state));

function liveStateHubPath(abbr: string): string {
  const upper = abbr.toUpperCase();
  if (!LIVE_STATE_ABBRS.has(upper)) return '/water';
  return `/water/state/${stateAbbrToSlug(upper)}`;
}

/** Two-letter USPS codes that are not city slugs. Empty-state hubs 308 to `/water`. */
export function waterStateAbbrRedirects(): { source: string; destination: string }[] {
  return STATE_PAGE_ABBRS.filter((abbr) => !CITY_SLUGS.has(abbr.toLowerCase())).map((abbr) => ({
    source: `/water/${abbr.toLowerCase()}`,
    destination: liveStateHubPath(abbr),
  }));
}

/**
 * `/water/ca` → `/water/state/california`. Case-insensitive.
 * Returns null when the segment is not a state abbreviation or is a real city slug.
 * States with no city reports (currently DE, MT, VT, WY) go to `/water`.
 */
export function resolveLegacyStateAbbrPath(segment: string): string | null {
  const raw = segment.trim();
  if (!/^[A-Za-z]{2}$/.test(raw)) return null;
  const lower = raw.toLowerCase();
  if (CITY_SLUGS.has(lower)) return null;
  const abbr = lower.toUpperCase() as StatePageAbbr;
  if (!STATE_PAGE_ABBRS.includes(abbr)) return null;
  return liveStateHubPath(abbr);
}

function stateHubPathFromSegment(stateSeg: string): string | null {
  const lower = stateSeg.trim().toLowerCase();
  const fromSlug = stateSlugToAbbr(lower);
  if (fromSlug) return liveStateHubPath(fromSlug);
  if (/^[a-z]{2}$/.test(lower) && STATE_PAGE_ABBRS.includes(lower.toUpperCase() as StatePageAbbr)) {
    return liveStateHubPath(lower.toUpperCase());
  }
  return null;
}

/**
 * `/water/county/maryland/baltimore-city` → matching city page, else the state hub, else `/water`.
 */
export function resolveLegacyCountyPath(stateSeg: string, countySeg: string): string {
  const stateHub = stateHubPathFromSegment(stateSeg);
  const fallback = stateHub ?? '/water';
  const abbr = stateSlugToAbbr(stateSeg.trim().toLowerCase())
    ?? (/^[A-Za-z]{2}$/.test(stateSeg) ? stateSeg.toUpperCase() : null);
  if (!abbr) return fallback;

  const countySlug = slugifyLabel(countySeg);
  if (!countySlug) return fallback;

  const candidates = new Set<string>([
    countySlug,
    countySlug.replace(/-city$/, ''),
    countySlug.replace(/-county$/, ''),
    `${countySlug}-county`,
    `${countySlug.replace(/-county$/, '')}-county`,
  ]);

  for (const [slug, cd] of Object.entries(CITIES)) {
    if (cd.state !== abbr) continue;
    const nameSlug = slugifyLabel(cd.name);
    if (
      candidates.has(slug)
      || candidates.has(nameSlug)
      || countySlug === `${slug}-city`
      || countySlug === `${nameSlug}-city`
    ) {
      return `/water/${slug}`;
    }
  }

  return fallback;
}

export function legacyWaterRedirectPath(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  const abbrMatch = path.match(/^\/water\/([A-Za-z]{2})$/);
  if (abbrMatch) return resolveLegacyStateAbbrPath(abbrMatch[1]);

  const countyOnly = path.match(/^\/water\/county\/([^/]+)$/i);
  if (countyOnly) return stateHubPathFromSegment(countyOnly[1]) ?? '/water';

  const countyMatch = path.match(/^\/water\/county\/([^/]+)\/([^/]+)$/i);
  if (countyMatch) return resolveLegacyCountyPath(countyMatch[1], countyMatch[2]);

  return null;
}
