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
  return product
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/** Stable GA4 params for `affiliate_click`. Keep legacy fields; add destination URL context. */
export function buildAffiliateClickEvent(params: AffiliateClickParams): Record<string, unknown> {
  const rawUrl = params.linkUrl || params.href || '';
  const linkUrl = rawUrl ? absoluteUrl(rawUrl) : '';
  const linkDomain = params.linkDomain || (linkUrl ? hostnameFromUrl(linkUrl) : undefined);
  const productId = params.productId || productIdFromName(params.product);
  const pagePath =
    typeof window !== 'undefined' && typeof window.location?.pathname === 'string'
      ? window.location.pathname
      : params.page;
  return {
    transport_type: 'beacon',
    link_url: linkUrl || undefined,
    link_domain: linkDomain,
    product: params.product,
    product_id: productId,
    item_id: productId,
    destination: params.destination,
    page: params.page,
    source_page: params.page,
    page_path: pagePath,
    city: params.city ?? '',
    zip: params.zip ?? '',
    item_name: params.product,
    item_brand: params.brand ?? params.destination,
    item_category: 'affiliate',
  };
}

/** Fire GA4 `affiliate_click` — use on every sponsored outbound product link. */
export function trackAffiliateClick(params: AffiliateClickParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'affiliate_click', buildAffiliateClickEvent(params));
}
