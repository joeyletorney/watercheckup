import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';
import {
  clearlyFilteredDirectUrl,
  isClearlyFilteredBrand,
  isWaterdropBrand,
  WATERDROP_REF,
} from '@/lib/waterdrop-buy';

const WATERDROP_G3 = `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=${WATERDROP_REF}`;
const WATERDROP_K19 = `https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=${WATERDROP_REF}`;

export type ProductBuyLink = { href: string; label: string; destination: 'direct' | 'amazon' };

/** Pick the best affiliate URL for a product card (Waterdrop/Clearly → brand site when possible). */
export function resolveProductBuyLink(input: {
  name: string;
  brand?: string;
  amazon?: string;
  directLink?: string;
}): ProductBuyLink {
  const { name, brand, amazon, directLink } = input;

  if (directLink) {
    return { href: directLink, label: 'Waterdrop.com →', destination: 'direct' };
  }

  if (isClearlyFilteredBrand(brand ?? '') || /clearly\s*filtered/i.test(name)) {
    return { href: clearlyFilteredDirectUrl(), label: 'ClearlyFiltered.com →', destination: 'direct' };
  }

  if (isWaterdropBrand(brand ?? '') || /waterdrop/i.test(name)) {
    if (/k19|countertop/i.test(name)) {
      return { href: WATERDROP_K19, label: 'Waterdrop.com →', destination: 'direct' };
    }
    if (/g3p600|g3 p600|g3p/i.test(name)) {
      return { href: WATERDROP_G3, label: 'Waterdrop.com →', destination: 'direct' };
    }
  }

  const href = normalizeAmazonUrl(amazon) ?? amazon ?? '#';
  return { href, label: 'View on Amazon →', destination: 'amazon' };
}
