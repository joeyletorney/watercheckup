export type AffiliateDestination = 'amazon' | 'direct' | 'simplelab' | 'brand';

export type AffiliateClickParams = {
  product: string;
  destination: AffiliateDestination;
  page: string;
  brand?: string;
  city?: string;
  zip?: string;
  linkDomain?: string;
};

/** Fire GA4 `affiliate_click` — use on every sponsored outbound product link. */
export function trackAffiliateClick(params: AffiliateClickParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'affiliate_click', {
    transport_type: 'beacon',
    link_domain: params.linkDomain,
    product: params.product,
    destination: params.destination,
    page: params.page,
    city: params.city ?? '',
    zip: params.zip ?? '',
    item_name: params.product,
    item_brand: params.brand ?? params.destination,
    item_category: 'affiliate',
  });
}
