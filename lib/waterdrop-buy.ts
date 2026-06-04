/** Direct-to-brand buy links (Waterdrop, Clearly Filtered) — no Amazon on those picks. */

import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';

export const WATERDROP_REF = 'anbyjkqb';

export const CLEARLY_FILTERED_PITCHER_URL =
  'https://www.clearlyfiltered.com/products/filtered-water-pitcher';

export const WATERDROP_DIRECT_BY_ID: Partial<Record<number, string>> = {
  47: `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=${WATERDROP_REF}`,
  26: `https://www.waterdropfilter.com/products/ro-water-filter-system-d6?ref=${WATERDROP_REF}`,
  6: `https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=${WATERDROP_REF}`,
  34: `https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=${WATERDROP_REF}`,
};

export function isWaterdropBrand(brand: string): boolean {
  return brand === 'Waterdrop';
}

export function isClearlyFilteredBrand(brand: string): boolean {
  return brand === 'Clearly Filtered';
}

/** Match product title strings that refer to Clearly Filtered (e.g. results cards). */
export function isClearlyFilteredProduct(label: string): boolean {
  return /clearly\s*filtered/i.test(label);
}

/** Primary buy URL for Clearly Filtered picks (falls back to standard pitcher PDP). */
export function clearlyFilteredDirectUrl(link?: string): string {
  if (link && /clearlyfiltered\.com/i.test(link)) return link;
  return CLEARLY_FILTERED_PITCHER_URL;
}

/** Returns undefined for direct-buy brands so UI uses brand site instead of Amazon. */
export function resolveAffiliateAmazonUrl(brand: string, amazon?: string): string | undefined {
  if (isWaterdropBrand(brand) || isClearlyFilteredBrand(brand)) return undefined;
  return normalizeAmazonUrl(amazon);
}

export function waterdropDirectUrl(productId: number): string | undefined {
  return WATERDROP_DIRECT_BY_ID[productId];
}
