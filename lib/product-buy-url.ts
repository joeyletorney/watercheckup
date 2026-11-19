import { unavailablePurchase, isAmazonSearch } from '@/lib/product-availability';
import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';
import { preferredAmazonPurchaseUrl } from '@/lib/home-shopping';
import {
  clearlyFilteredAmazonUrl,
  isClearlyFilteredBrand,
  isWaterdropBrand,
  WATERDROP_REF,
} from '@/lib/waterdrop-buy';

const WATERDROP_G3 = `https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=${WATERDROP_REF}`;

export type ProductBuyLink = { href: string; label: string; destination: 'direct' | 'amazon' };

/** Pick the best affiliate URL for a product card (Clearly Filtered → Amazon while direct approval is pending). */
export function resolveProductBuyLink(input: {
  name: string;
  brand?: string;
  amazon?: string;
  directLink?: string;
}): ProductBuyLink {
  const { name, brand, amazon, directLink } = input;
  if (unavailablePurchase(name, amazon)) return { href: '/#find-a-filter', label: 'Compare available filters →', destination: 'direct' };

  if (isClearlyFilteredBrand(brand ?? '') || /clearly\s*filtered/i.test(name)) {
    return { href: clearlyFilteredAmazonUrl(), label: 'Check price on Amazon →', destination: 'amazon' };
  }

  const preferredAmazon = preferredAmazonPurchaseUrl(amazon);
  if (preferredAmazon) return { href: preferredAmazon, label: 'Check price on Amazon →', destination: 'amazon' };

  if (directLink && !isAmazonSearch(directLink)) {
    return { href: directLink, label: 'Check manufacturer price →', destination: 'direct' };
  }

  if (isWaterdropBrand(brand ?? '') || /waterdrop/i.test(name)) {
    if (/g3p600|g3 p600|g3p/i.test(name)) {
      return { href: WATERDROP_G3, label: 'Waterdrop.com →', destination: 'direct' };
    }
  }

  const href = normalizeAmazonUrl(amazon) ?? amazon ?? '#';
  return { href, label: isAmazonSearch(href) ? 'Browse Amazon results →' : 'Check price on Amazon →', destination: 'amazon' };
}
