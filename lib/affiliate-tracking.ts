import { currentPagePath, trackEvent } from '@/lib/track-event';

export type AffiliateDestination = 'amazon' | 'direct' | 'simplelab' | 'brand';

export type AffiliateClickParams = {
  product: string;
  destination: AffiliateDestination;
  page: string;
  brand?: string;
  city?: string;
  zip?: string;
  linkDomain?: string;
  linkUrl?: string;
  href?: string;
  productId?: string;
};

function hostnameFromUrl(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

function absoluteUrl(url: string): string {
  try {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : undefined;
    return origin ? new URL(url, origin).toString() : new URL(url).toString();
  } catch {
    return url;
  }
}

export function productIdFromName(product: string): string {
  return (
    product
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'unknown'
  );
}

function nonEmpty(value: unknown, fallback: string): string {
  const text = String(value ?? '').trim();
  return text || fallback;
}

/** Stable GA4 params for `affiliate_click`. Keep legacy fields; always send product + destination URL. */
export function buildAffiliateClickEvent(params: AffiliateClickParams): Record<string, unknown> {
  const rawUrl = String(params.linkUrl || params.href || '').trim();
  const linkUrl = rawUrl ? absoluteUrl(rawUrl) : '';
  const linkDomain = params.linkDomain || (linkUrl ? hostnameFromUrl(linkUrl) : undefined);
  const product = nonEmpty(params.product, linkDomain || 'unknown');
  const productId = nonEmpty(params.productId, productIdFromName(product));
  const pagePath = currentPagePath() || params.page;
  return {
    transport_type: 'beacon',
    link_url: linkUrl || undefined,
    link_domain: linkDomain,
    product,
    product_id: productId,
    item_id: productId,
    destination: params.destination,
    page: params.page,
    source_page: params.page,
    page_path: pagePath,
    city: params.city ?? '',
    zip: params.zip ?? '',
    item_name: product,
    item_brand: params.brand ?? params.destination,
    item_category: 'affiliate',
  };
}

/** Fire GA4 `affiliate_click` — use on every sponsored outbound product link. */
export function trackAffiliateClick(params: AffiliateClickParams): void {
  trackEvent('affiliate_click', buildAffiliateClickEvent(params));
}
