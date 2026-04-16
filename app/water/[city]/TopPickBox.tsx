import React from 'react';
'use client';
import Link from 'next/link';

declare global { interface Window { gtag?: (...args: any[]) => void } }

type Pick = { product: string; brand: string; price: string; reason: string; link: string; amazon: string; badge?: string };

function showBuyDirectBrand(brand: string) {
  return brand === 'Waterdrop';
}

const UTM_SOURCE = 'watercheckup';
const UTM_MEDIUM = 'affiliate';
const UTM_CAMPAIGN = 'filter-recommendations';
const AMAZON_TAG = 'watercheck20-20';
const WATERDROP_REF = 'anbyjkqb';

function buildAmazonUrl(baseUrl: string, product: string, citySlug: string) {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('tag', AMAZON_TAG);
    url.searchParams.set('utm_source', UTM_SOURCE);
    url.searchParams.set('utm_medium', UTM_MEDIUM);
    url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
    url.searchParams.set('utm_content', product.toLowerCase().replace(/\s+/g, '-'));
    url.searchParams.set('utm_term', citySlug);
    return url.toString();
  } catch { return baseUrl; }
}

function buildWaterdropUrl(baseUrl: string, product: string, citySlug: string) {
  try {
    const url = new URL(baseUrl);
    if (!url.searchParams.has('ref')) url.searchParams.set('ref', WATERDROP_REF);
    url.searchParams.set('utm_source', UTM_SOURCE);
    url.searchParams.set('utm_medium', UTM_MEDIUM);
    url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
    url.searchParams.set('utm_content', product.toLowerCase().replace(/\s+/g, '-'));
    url.searchParams.set('utm_term', citySlug);
    return url.toString();
  } catch { return baseUrl; }
}

function trackClick(product: string, destination: string, city: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', { product, destination, city, page: 'city', item_name: product, item_brand: destination === 'amazon' ? 'amazon' : 'waterdrop', item_category: UTM_CAMPAIGN });
  }
}

export default function TopPickBox({ picks, label, cityName, citySlug }: { picks: Pick[]; label: string; cityName: string; citySlug?: string }) {
  const slug = citySlug ?? cityName.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ marginBottom: 32, padding: '20px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
        TOP PICKS FOR {cityName.toUpperCase()}
      </div>
      <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: 1, marginBottom: 14, marginTop: 16 }}>
        ⚠ {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {picks.map((pick, i) => {
          const showDirect = showBuyDirectBrand(pick.brand);
          const amazonPrimary = !showDirect;
          const directUrl = showDirect ? buildWaterdropUrl(pick.link, pick.product, slug) : pick.link;
          const amazonUrl = buildAmazonUrl(pick.amazon, pick.product, slug);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>#{i + 1}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{pick.product}</div>
                    {pick.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{pick.badge}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{pick.brand} &nbsp;·&nbsp; {pick.price}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8',
cat > /Users/joeyletorney/codebases/watercheckup/app/water/\[city\]/TopPickBox.tsx << 'ENDOFFILE'
'use client';
import Link from 'next/link';

declare global { interface Window { gtag?: (...args: any[]) => void } }

type Pick = { product: string; brand: string; price: string; reason: string; link: string; amazon: string; badge?: string };

function showBuyDirectBrand(brand: string) {
  return brand === 'Waterdrop';
}

const UTM_SOURCE = 'watercheckup';
const UTM_MEDIUM = 'affiliate';
const UTM_CAMPAIGN = 'filter-recommendations';
const AMAZON_TAG = 'watercheck20-20';
const WATERDROP_REF = 'anbyjkqb';

function buildAmazonUrl(baseUrl: string, product: string, citySlug: string) {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('tag', AMAZON_TAG);
    url.searchParams.set('utm_source', UTM_SOURCE);
    url.searchParams.set('utm_medium', UTM_MEDIUM);
    url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
    url.searchParams.set('utm_content', product.toLowerCase().replace(/\s+/g, '-'));
    url.searchParams.set('utm_term', citySlug);
    return url.toString();
  } catch { return baseUrl; }
}

function buildWaterdropUrl(baseUrl: string, product: string, citySlug: string) {
  try {
    const url = new URL(baseUrl);
    if (!url.searchParams.has('ref')) url.searchParams.set('ref', WATERDROP_REF);
    url.searchParams.set('utm_source', UTM_SOURCE);
    url.searchParams.set('utm_medium', UTM_MEDIUM);
    url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
    url.searchParams.set('utm_content', product.toLowerCase().replace(/\s+/g, '-'));
    url.searchParams.set('utm_term', citySlug);
    return url.toString();
  } catch { return baseUrl; }
}

function trackClick(product: string, destination: string, city: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', { product, destination, city, page: 'city', item_name: product, item_brand: destination === 'amazon' ? 'amazon' : 'waterdrop', item_category: UTM_CAMPAIGN });
  }
}

export default function TopPickBox({ picks, label, cityName, citySlug }: { picks: Pick[]; label: string; cityName: string; citySlug?: string }) {
  const slug = citySlug ?? cityName.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ marginBottom: 32, padding: '20px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
        TOP PICKS FOR {cityName.toUpperCase()}
      </div>
      <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: 1, marginBottom: 14, marginTop: 16 }}>
        ⚠ {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {picks.map((pick, i) => {
          const showDirect = showBuyDirectBrand(pick.brand);
          const amazonPrimary = !showDirect;
          const directUrl = showDirect ? buildWaterdropUrl(pick.link, pick.product, slug) : pick.link;
          const amazonUrl = buildAmazonUrl(pick.amazon, pick.product, slug);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>#{i + 1}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{pick.product}</div>
                    {pick.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{pick.badge}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{pick.brand} &nbsp;·&nbsp; {pick.price}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>{pick.reason}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                {showDirect ? (
                  <a href={directUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackClick(pick.product, 'direct', cityName)} style={{ display: 'block', padding: '8px 16px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>
                    Buy Direct →
                  </a>
                ) : null}
                <a href={amazonUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackClick(pick.product, 'amazon', cityName)} style={{ display: 'block', padding: '8px 16px', background: amazonPrimary ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: amazonPrimary ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: amazonPrimary ? 700 : 600, textAlign: 'center', border: amazonPrimary ? 'none' : '1px solid #1a3a5c', whiteSpace: 'nowrap' }}>
                  Amazon →
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #0f2336', fontSize: 12, color: '#94a3b8' }}>
        Not sure which filter is right for you?{' '}
        <Link href="/quiz" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 700 }}>
          Take the 3-question quiz →
        </Link>
      </div>
    </div>
  );
}
