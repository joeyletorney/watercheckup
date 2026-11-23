import type { Metric } from 'web-vitals';
import { isProductionAnalyticsHost } from '@/lib/analytics-host';

/** Document-level metrics: use the entry path even if a later SPA navigation changes the URL. */
export function trackWebVital(metric: Pick<Metric, 'name' | 'value' | 'rating' | 'id' | 'navigationType'>, entryPath: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !Number.isFinite(metric.value)) return;
  if (!isProductionAnalyticsHost(window.location.hostname)) return;
  const path = entryPath.split('?')[0].split('#')[0];
  window.gtag('event', 'web_vital', {
    metric_name: metric.name,
    metric_value: metric.name === 'CLS' ? Math.round(metric.value * 10000) / 10000 : Math.round(metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_unit: metric.name === 'CLS' ? 'score' : 'ms',
    navigation_type: metric.navigationType,
    metric_scope: 'document',
    page: path,
    page_location: `${window.location.origin}${path}`,
    transport_type: 'beacon',
  });
}
