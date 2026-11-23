import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import { isProductionAnalyticsHost } from '../lib/analytics-host';
import { apexRedirectUrl } from '../lib/apex-redirect';
import { conversionPicksFor } from '../lib/conversion-picks';
import { ConversionNextStep } from '../components/ConversionNextStep';
import { AUTHOR_TIKTOK_URL, TIKTOK_BIO_UTM_URL } from '../lib/site-stats';
import { isShoppingGuide } from '../lib/blog-next-steps';

const root = join(process.cwd());

test('GA4 only treats the apex production hostname as a live analytics host', () => {
  assert.equal(isProductionAnalyticsHost('watercheckup.com'), true);
  assert.equal(isProductionAnalyticsHost('WATERCHECKUP.COM:443'), true);
  assert.equal(isProductionAnalyticsHost('www.watercheckup.com'), false);
  assert.equal(isProductionAnalyticsHost('localhost'), false);
  assert.equal(isProductionAnalyticsHost('127.0.0.1'), false);
  assert.equal(isProductionAnalyticsHost('watercheckup-git-main.vercel.app'), false);
  assert.equal(isProductionAnalyticsHost('watercheckup.vercel.app'), false);

  const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf8');
  assert.match(layout, /host !== 'watercheckup\.com'/);
  assert.match(layout, /googletagmanager\.com\/gtag\/js/);
  assert.doesNotMatch(layout, /strategy="afterInteractive"/);
});

test('www to apex redirect keeps UTM query parameters', () => {
  assert.equal(
    apexRedirectUrl('https://www.watercheckup.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio'),
    'https://watercheckup.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio',
  );
  assert.equal(
    apexRedirectUrl('https://www.watercheckup.com/worst-states?utm_source=tiktok&utm_medium=social'),
    'https://watercheckup.com/worst-states?utm_source=tiktok&utm_medium=social',
  );

  const vercel = readFileSync(join(root, 'vercel.json'), 'utf8');
  assert.match(vercel, /www\.watercheckup\.com/);
  assert.match(vercel, /"destination": "https:\/\/watercheckup\.com\/"/);
  assert.match(vercel, /https:\/\/watercheckup\.com\/:path\*/);

  const nextConfig = readFileSync(join(root, 'next.config.ts'), 'utf8');
  assert.match(nextConfig, /destination: 'https:\/\/watercheckup\.com\/'/);
  assert.match(nextConfig, /destination: 'https:\/\/watercheckup\.com\/:path\*'/);
});

test('homepage ZIP search is numeric, fires form_start, and autofocuses only on desktop', () => {
  const search = readFileSync(join(root, 'components/WaterSearch.tsx'), 'utf8');
  assert.match(search, /inputMode="numeric"/);
  assert.match(search, /form_start/);
  assert.match(search, /water_search_submitted/);
  assert.match(search, /water_search_invalid/);
  assert.match(search, /min-width: 768px/);
  assert.doesNotMatch(search, /autoFocus[=:]/);
  assert.match(search, /placeholder="5-digit ZIP"/);

  const home = readFileSync(join(root, 'app/HomeLanding.tsx'), 'utf8');
  assert.match(home, /<WaterSearch autoFocusDesktop \/>/);
  assert.match(home, /id="wc-zip-repeat"/);
  assert.match(home, /<WaterSearch variant="compact" idPrefix="wc-repeat" \/>/);
  assert.ok(home.indexOf('<WaterSearch autoFocusDesktop') < home.indexOf('wc-founder-intro'));

  const sticky = readFileSync(join(root, 'components/HomeStickyCta.tsx'), 'utf8');
  assert.match(sticky, /wc-hero-anchor/);
  assert.match(sticky, /wc-zip-repeat/);
});

test('next-step CTA offers ZIP, quiz, and tracked affiliate product links', () => {
  const html = renderToStaticMarkup(
    createElement(ConversionNextStep, { page: '/worst-states', headingId: 'test-next' }),
  );
  assert.match(html, /Check your ZIP/);
  assert.match(html, /Take the 60-second filter quiz/);
  assert.match(html, /Recommended filter picks/);
  assert.match(html, /data-wc-affiliate-tracked="true"/);
  assert.match(html, /watercheckup-20/);
  assert.match(html, /ref=anbyjkqb/);

  const picks = conversionPicksFor();
  assert.equal(picks.length, 3);
  assert.ok(picks.some((p) => p.destination === 'amazon' && p.href.includes('tag=watercheckup-20')));
  assert.ok(picks.some((p) => p.destination === 'direct' && p.href.includes('ref=anbyjkqb')));

  const wholeHouse = conversionPicksFor('wholeHouse');
  assert.ok(wholeHouse.every((p) => /whole|WH-|WGB32B|WHF3T/i.test(`${p.product} ${p.reason}`)));
});

test('high-engagement routes and shopping guides include the conversion next-step block', () => {
  assert.equal(isShoppingGuide('best-whole-house-water-filter'), true);
  assert.equal(isShoppingGuide('private-well-water-testing-101'), false);

  for (const file of [
    'app/worst-states/page.tsx',
    'app/worst-cities/page.tsx',
    'app/worst-lead/page.tsx',
    'app/rankings/page.tsx',
    'app/water/[city]/page.tsx',
    'app/blog/[slug]/page.tsx',
  ]) {
    const source = readFileSync(join(root, file), 'utf8');
    assert.match(source, /ConversionNextStep/, file);
    assert.match(source, /headingId=/, file);
  }
});

test('TikTok follow link and bio UTM URL are available for attribution', () => {
  assert.equal(AUTHOR_TIKTOK_URL, 'https://www.tiktok.com/@joethewaterpro');
  assert.equal(TIKTOK_BIO_UTM_URL, 'https://watercheckup.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio');

  const footer = readFileSync(join(root, 'lib/footer-links.ts'), 'utf8');
  assert.match(footer, /Follow on TikTok/);
  assert.match(footer, /tiktok\.com\/@joethewaterpro/);

  const author = readFileSync(join(root, 'app/about/joe-letorney/page.tsx'), 'utf8');
  assert.match(author, /Follow on TikTok/);

  const about = readFileSync(join(root, 'app/about/page.tsx'), 'utf8');
  assert.match(about, /Follow on TikTok/);
});

test('mobile product CTAs are full-width 44px high-contrast buttons', () => {
  const css = readFileSync(join(root, 'app/globals.css'), 'utf8');
  assert.match(css, /\.wc-buy-cta/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /background: #fbbf24/);
  assert.match(css, /color: #162332/);
  assert.match(css, /\.wc-rankings-cards/);
  assert.match(css, /\.wc-city-score-card/);
  assert.match(css, /\.wc-table-scroll/);

  const city = readFileSync(join(root, 'app/water/[city]/page.tsx'), 'utf8');
  assert.match(city, /wc-city-score-card/);
});
