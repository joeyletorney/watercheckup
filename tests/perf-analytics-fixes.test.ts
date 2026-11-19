import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CITIES } from '../app/water/[city]/cities-data';
import { buildAffiliateClickEvent, trackAffiliateClick } from '../lib/affiliate-tracking';
import { alignEditorialPfasCopy, pfasSnapshotSentence } from '../lib/pfas-editorial';
import { getPriorityCityIntroParagraphs } from '../lib/priority-city-intros';
import { lookupWaterReport } from '../lib/server-water-report';
import { getCityPfasData } from '../lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '../lib/city-pwsid';
import { buildStateRankingRows } from '../lib/water-rankings';

test('rankings count tracked cities even when UCMR5 coverage is missing', () => {
  const { rows } = buildStateRankingRows();
  const ny = rows.find((row) => row.stateAbbr === 'NY');
  const il = rows.find((row) => row.stateAbbr === 'IL');
  assert.ok(ny);
  assert.ok(il);
  assert.ok(ny.totalCities >= 3, `NY tracked ${ny.totalCities}`);
  assert.ok(il.totalCities >= 1, `IL tracked ${il.totalCities}`);
  const nySlugs = Object.entries(CITIES).filter(([, city]) => city.state === 'NY').map(([slug]) => slug);
  assert.ok(nySlugs.includes('new-york'));
  assert.ok(nySlugs.includes('buffalo'));
  assert.ok(nySlugs.includes('rochester'));
  assert.equal(getCityPfasData(resolveCityPwsid('new-york', CITIES['new-york'].pwsid)), null);
  assert.equal(getCityPfasData(resolveCityPwsid('chicago', CITIES.chicago.pwsid)), null);
});

test('Boston editorial PFAS copy matches the missing UCMR5 snapshot', () => {
  const pfas = getCityPfasData(resolveCityPwsid('boston', CITIES.boston.pwsid, CITIES.boston.zip));
  assert.equal(pfas, null);
  const paragraphs = getPriorityCityIntroParagraphs('boston') ?? [];
  const joined = paragraphs.join(' ');
  assert.doesNotMatch(joined, /PFAS monitoring has detected/i);
  assert.match(joined, /no matching PFAS record/i);
  assert.match(joined, /does not establish detection or nondetection/i);

  const rewritten = alignEditorialPfasCopy(
    'PFAS monitoring has detected low-level compounds. Lead remains the concern.',
    null,
  );
  assert.doesNotMatch(rewritten, /has detected low-level/i);
  assert.match(rewritten, /no matching PFAS record/i);
  assert.match(pfasSnapshotSentence(null), /does not establish detection or nondetection/i);

  const withHits = alignEditorialPfasCopy(
    'No PFAS were detected in this city.',
    { maxPpt: 6, violations: 0, compounds: [['PFPeA', 6, 0, 0]] },
  );
  assert.doesNotMatch(withHits, /No PFAS were detected/i);
  assert.match(withHits, /PFAS compound/);

  const chicago = (getPriorityCityIntroParagraphs('chicago') ?? []).join(' ');
  assert.doesNotMatch(chicago, /has detected compounds in the Lake Michigan/i);
  assert.match(chicago, /no matching PFAS record/i);
});

test('affiliate_click includes destination URL, product id, and source page', () => {
  const payload = buildAffiliateClickEvent({
    product: 'Waterdrop G3P600 RO',
    brand: 'Waterdrop',
    destination: 'direct',
    page: 'quiz',
    href: 'https://www.waterdropfilter.com/products/g3p600?ref=anbyjkqb',
  });
  assert.equal(payload.destination, 'direct');
  assert.equal(payload.product, 'Waterdrop G3P600 RO');
  assert.equal(payload.item_name, 'Waterdrop G3P600 RO');
  assert.equal(payload.page, 'quiz');
  assert.equal(payload.source_page, 'quiz');
  assert.equal(payload.link_url, 'https://www.waterdropfilter.com/products/g3p600?ref=anbyjkqb');
  assert.equal(payload.link_domain, 'waterdropfilter.com');
  assert.equal(payload.product_id, 'waterdrop-g3p600-ro');
  assert.equal(payload.item_id, 'waterdrop-g3p600-ro');
  assert.equal(payload.item_category, 'affiliate');

  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const events: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { gtag: (...args: unknown[]) => events.push(args), location: { origin: 'https://watercheckup.com', pathname: '/quiz' } },
    });
    trackAffiliateClick({
      product: 'Clearly Filtered 10-Cup Pitcher',
      destination: 'amazon',
      page: 'results',
      href: 'https://www.amazon.com/dp/B0DFC22BHT?tag=watercheckup-20',
    });
    assert.equal(events[0][1], 'affiliate_click');
    const sent = events[0][2] as Record<string, unknown>;
    assert.equal(sent.link_domain, 'amazon.com');
    assert.match(String(sent.link_url), /amazon\.com/);
    assert.equal(sent.source_page, 'results');
    assert.equal(sent.page_path, '/quiz');
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('EPA outage without a local ZIP map returns a retryable 503 instead of a missing-system 404', async () => {
  const g = globalThis as typeof globalThis & { __wcEpaCircuit?: { fails: number; openUntil: number } };
  const previous = g.__wcEpaCircuit;
  g.__wcEpaCircuit = { fails: 0, openUntil: Date.now() + 60_000 };
  try {
    const response = await lookupWaterReport('00001');
    const data = await response.json();
    assert.equal(response.status, 503);
    assert.match(String(data.error), /temporarily unavailable/i);
  } finally {
    g.__wcEpaCircuit = previous;
  }
});

test('ZIP results render a retry state instead of a blank score when EPA data is down', async () => {
  const { default: ResultsClient } = await import('../app/results/[zip]/ResultsClient');
  const html = renderToStaticMarkup(createElement(ResultsClient, {
    zip: '02108',
    initialData: {
      lookupError: 'Water data is temporarily unavailable. Please try again shortly.',
      lookupStatus: 503,
    },
  }));
  assert.match(html, /Data temporarily unavailable/);
  assert.match(html, /Please retry/);
  assert.doesNotMatch(html, />NaN</);

  const blankScore = renderToStaticMarkup(createElement(ResultsClient, {
    zip: '10001',
    initialData: {
      city: 'New York City',
      systemName: 'NEW YORK CITY SYSTEM',
      pwsid: 'NY7003493',
      grade: '—',
      score: 0,
      violationCoverage: 'unavailable',
      pfasCoverage: 'unavailable',
      summary: 'Current EPA violation records could not be loaded.',
      contaminants: [],
    },
  }));
  assert.match(blankScore, /DATA TEMPORARILY UNAVAILABLE/);
  assert.match(blankScore, /Water score cannot be shown right now/);
  assert.doesNotMatch(blankScore, />NaN</);
});

test('AdSense script is not loaded site-wide and only mounts on pages with ad slots', () => {
  const root = join(process.cwd());
  const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf8');
  assert.doesNotMatch(layout, /pagead2\.googlesyndication\.com/);
  const sanAntonio = readFileSync(join(root, 'app/water/san-antonio/page.tsx'), 'utf8');
  assert.match(sanAntonio, /AdSenseSlot/);
  const loader = readFileSync(join(root, 'components/AdSenseLoader.tsx'), 'utf8');
  assert.match(loader, /requestIdleCallback|pointerdown/);
  assert.match(loader, /pagead2\.googlesyndication\.com/);
});
