/** Waterdrop affiliate — direct site only (no Amazon links sitewide). */

export const WATERDROP_REF = 'anbyjkqb';

export const WATERDROP_DIRECT_BY_ID: Partial<Record<number, string>> = {
  47: `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=${WATERDROP_REF}`,
  26: `https://www.waterdropfilter.com/products/ro-water-filter-system-d6?ref=${WATERDROP_REF}`,
  6: `https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=${WATERDROP_REF}`,
  34: `https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=${WATERDROP_REF}`,
};

export function isWaterdropBrand(brand: string): boolean {
  return brand === 'Waterdrop';
}

/** Returns undefined for Waterdrop so UI never shows Amazon buy buttons. */
export function resolveAffiliateAmazonUrl(brand: string, amazon?: string): string | undefined {
  if (isWaterdropBrand(brand)) return undefined;
  return amazon;
}

export function waterdropDirectUrl(productId: number): string | undefined {
  return WATERDROP_DIRECT_BY_ID[productId];
}
