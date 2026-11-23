/** Hosts allowed to load and send GA4. Preview, localhost, and other domains are excluded. */
export const PRODUCTION_ANALYTICS_HOST = 'watercheckup.com';

export function isProductionAnalyticsHost(hostname: string | undefined | null): boolean {
  if (!hostname) return false;
  const host = hostname.replace(/:\d+$/, '').toLowerCase();
  return host === PRODUCTION_ANALYTICS_HOST;
}
