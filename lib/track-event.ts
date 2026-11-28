/** Shared GA4 event helper. Survives a missing `window.gtag` by queuing on `dataLayer`. */

export type TrackEventParams = Record<string, unknown>;

export function currentPagePath(): string {
  if (typeof window === 'undefined' || typeof window.location?.pathname !== 'string') return '';
  return window.location.pathname;
}

function compactParams(params: TrackEventParams): TrackEventParams {
  const out: TrackEventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

function ensureGtagStub(): NonNullable<Window['gtag']> {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  if (typeof window.gtag === 'function') return window.gtag;
  window.gtag = function gtag() {
    dataLayer.push(arguments);
  };
  return window.gtag!;
}

/**
 * Send a GA4 event. Prefers `window.gtag`; if it is missing, installs the official
 * `dataLayer.push(arguments)` stub so a late-loading gtag.js can still flush the hit.
 */
export function trackEvent(name: string, params: TrackEventParams = {}): void {
  if (typeof window === 'undefined') return;
  const payload = compactParams({
    page_path: currentPagePath() || undefined,
    ...params,
  });
  try {
    const gtag = ensureGtagStub();
    gtag('event', name, payload);
  } catch {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
  }
}

/** Newsletter conversion: custom event plus GA4 recommended sign_up / generate_lead. */
export function trackNewsletterSignup(source: string, extra: TrackEventParams = {}): void {
  const page_path = typeof extra.page_path === 'string' && extra.page_path
    ? extra.page_path
    : currentPagePath() || undefined;
  const params: TrackEventParams = {
    method: 'newsletter_form',
    transport_type: 'beacon',
    ...extra,
    source,
    page_path,
  };
  trackEvent('newsletter_signup', params);
  trackEvent('sign_up', params);
  trackEvent('generate_lead', params);
}
