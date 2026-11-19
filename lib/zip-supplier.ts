import zipLookupRaw from './zip-lookup.json';

type ZipRecord = { p: string; n: string; c?: string; s?: string; pop: number; src: string };

const ZIP_LOOKUP = zipLookupRaw as Record<string, ZipRecord>;

/**
 * Local community systems that the packaged ZIP map assigned to a nearby
 * megacity (largest-population wins). Prefer the city that actually matches
 * the ZIP.
 */
export const ZIP_SUPPLIER_OVERRIDES: Record<string, ZipRecord> = {
  '90210': {
    p: 'CA1910156',
    n: 'BEVERLY HILLS-CITY, WATER DEPT.',
    c: 'BEVERLY HILLS',
    s: 'CA',
    pop: 40121,
    src: 'SW',
  },
  '02101': {
    p: 'MA3035000',
    n: 'BOSTON WATER AND SEWER COMMISSION (MWRA)',
    c: 'BOSTON',
    s: 'MA',
    pop: 675647,
    src: 'SWP',
  },
  '01601': {
    p: 'MA2348000',
    n: 'WORCESTER DPWP, WATER SUPPLY DIVISION',
    c: 'WORCESTER',
    s: 'MA',
    pop: 206518,
    src: 'SW',
  },
  '01608': {
    p: 'MA2348000',
    n: 'WORCESTER DPWP, WATER SUPPLY DIVISION',
    c: 'WORCESTER',
    s: 'MA',
    pop: 206518,
    src: 'SW',
  },
  '14601': {
    p: 'NY2704518',
    n: 'ROCHESTER CITY',
    c: 'ROCHESTER',
    s: 'NY',
    pop: 210000,
    src: 'SW',
  },
  '14604': {
    p: 'NY2704518',
    n: 'ROCHESTER CITY',
    c: 'ROCHESTER',
    s: 'NY',
    pop: 210000,
    src: 'SW',
  },
};

const INVALID_ZIPS = new Set(['00000', '99999']);

export function isLookupableZip(zip: string): boolean {
  if (!/^\d{5}$/.test(zip)) return false;
  if (INVALID_ZIPS.has(zip)) return false;
  return true;
}

export function getZipSupplier(zip: string): ZipRecord | undefined {
  if (!isLookupableZip(zip)) return undefined;
  return ZIP_SUPPLIER_OVERRIDES[zip] ?? ZIP_LOOKUP[zip];
}

const NON_COMMUNITY_NAME =
  /\b(school|church|gas station|gasoline|trailer|mobile home|\bmhp\b|campground|golf|cafe|restaurant|mart\b|store\b|hotel|motel|daycare|day care|elementary|ko[a]\b)\b/i;

export function looksLikeNonCommunitySystem(name: string, population = 0, typeCode = ''): boolean {
  const type = typeCode.toUpperCase();
  if (type === 'TNCWS' || type === 'NTNCWS') return true;
  if (population > 0 && population < 500 && NON_COMMUNITY_NAME.test(name)) return true;
  return NON_COMMUNITY_NAME.test(name) && population < 3300;
}

type EpaSystem = Record<string, unknown>;

function field(row: EpaSystem, key: string): unknown {
  return row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()] ?? null;
}

/**
 * When EPA returns several systems for a ZIP, keep the local community system
 * rather than the nearest city with the largest population.
 */
export function pickLocalCommunitySystem(systems: EpaSystem[], zip: string): EpaSystem | null {
  const scored = systems
    .map((sys) => {
      const pwsid = String(field(sys, 'pwsid') || field(sys, 'PWSID') || '');
      const name = String(field(sys, 'pws_name') || field(sys, 'PWS_NAME') || '');
      const type = String(field(sys, 'pws_type_code') || field(sys, 'PWS_TYPE_CODE') || 'CWS');
      const pop = parseInt(String(field(sys, 'population_served_count') || field(sys, 'POPULATION_SERVED_COUNT') || '0'), 10) || 0;
      const city = String(field(sys, 'city_name') || field(sys, 'CITY_NAME') || '');
      return { sys, pwsid, name, type, pop, city };
    })
    .filter((row) => row.pwsid && row.type.toUpperCase() !== 'TNCWS' && row.type.toUpperCase() !== 'NTNCWS')
    .filter((row) => !looksLikeNonCommunitySystem(row.name, row.pop, row.type));

  if (!scored.length) return null;

  const override = ZIP_SUPPLIER_OVERRIDES[zip];
  if (override) {
    const hit = scored.find((row) => row.pwsid.toUpperCase() === override.p.toUpperCase());
    if (hit) return hit.sys;
  }

  scored.sort((a, b) => {
    const aCws = a.type.toUpperCase() === 'CWS' ? 1 : 0;
    const bCws = b.type.toUpperCase() === 'CWS' ? 1 : 0;
    if (aCws !== bCws) return bCws - aCws;
    const aLocal = a.pop > 0 && a.pop < 2_000_000 ? 1 : 0;
    const bLocal = b.pop > 0 && b.pop < 2_000_000 ? 1 : 0;
    if (aLocal !== bLocal) return bLocal - aLocal;
    return b.pop - a.pop;
  });

  return scored[0]?.sys ?? null;
}
