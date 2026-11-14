import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuizRecommendation } from '../lib/quiz-recommendations';
import { trackAffiliateClick } from '../lib/affiliate-tracking';

test('all 24 quiz paths respect installation limits and give one coherent primary match', () => {
  for (const source of ['city', 'well']) for (const concern of ['lead', 'pfas', 'taste', 'general']) for (const situation of ['renter', 'owner_simple', 'owner_full']) {
    const rec = getQuizRecommendation({ source, concern, situation });
    if (source === 'well') {
      assert.equal(rec.alts.length, 0, 'Unknown-quality well water must not trigger a generic equipment sale');
      assert.match(rec.why, /certified laboratory/);
      if (situation === 'renter') assert.match(rec.why, /free of plumbing changes/);
      continue;
    }
    assert.equal(rec.title, rec.alts[0].product);
    assert.equal(rec.alts.length, 2);
    assert.equal(new Set(rec.alts.map(p => p.product)).size, 2);
    for (const pick of rec.alts) {
      assert.doesNotMatch(pick.product, /K19|Whole House/);
      assert.equal(new URL(pick.link).protocol, 'https:');
      assert.equal(new URL(pick.amazon).searchParams.get('tag'), 'watercheckup-20');
      if (situation === 'renter') assert.doesNotMatch(pick.product, /Under-Sink|G3P600/);
    }
    if (situation === 'owner_full') assert.match(rec.why, /downstream plumbing/);
  }
});

test('merchant click tracking sends stable product and destination fields without requiring analytics to exist', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const events: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { gtag: (...args: unknown[]) => events.push(args) } });
    trackAffiliateClick({ product: 'Waterdrop G3P600 RO', brand: 'Waterdrop', destination: 'direct', page: 'quiz' });
    assert.equal(events.length, 1);
    assert.equal(events[0][0], 'event');
    assert.equal(events[0][1], 'affiliate_click');
    assert.deepEqual((events[0][2] as Record<string, unknown>).item_name, 'Waterdrop G3P600 RO');
    assert.equal((events[0][2] as Record<string, unknown>).destination, 'direct');
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    assert.doesNotThrow(() => trackAffiliateClick({ product: 'Pitcher', destination: 'amazon', page: 'quiz' }));
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('historical report offers a neutral quiz handoff before measurements without assigning a concern', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: ResultsClient } = await import('../app/results/[zip]/ResultsClient');
  const html = renderToStaticMarkup(React.createElement(ResultsClient, { zip: '78205', initialData: {
    violationCoverage: 'unavailable', systemName: 'Example supplier', pwsid: 'TX0150018', summary: 'Current records unavailable.',
    contaminants: [], dataFreshness: { ucmr5SnapshotLabel: 'April 2025', links: { ccr: 'https://www.epa.gov/ccr', sdwis: 'https://www.epa.gov/sdwis' } },
  } }));
  assert.ok(html.indexOf('What to do next') < html.indexOf('Available measurements'));
  assert.match(html, /quiz\?from=historical-report&amp;zip=78205/);
  assert.doesNotMatch(html, /concern=|situation=|source=city/);
  assert.match(html, /current compliance unverified/);
  assert.match(html, /do not establish that treatment is necessary/);
});

test('commercial comparisons expose active merchant links, scoped evidence and no discontinued-model purchase', async () => {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { COMMERCIAL_GUIDES } = await import('../app/blog/commercial-guide-data');
  const { BlogCommercialComparison } = await import('../components/BlogCommercialComparison');
  for (const [slug, guide] of Object.entries(COMMERCIAL_GUIDES)) {
    const html = renderToStaticMarkup(React.createElement(BlogCommercialComparison, { slug }));
    assert.match(html, /Quick comparison/);
    assert.match(html, /Setup limits/);
    assert.match(html, /Cost assumptions/);
    assert.match(html, /not hands-on testing/);
    assert.doesNotMatch(guide.title, /Tested|10 Picks/);
    for (const choice of guide.choices) {
      assert.equal(new URL(choice.source).protocol, 'https:');
      if (choice.option.includes('K19-S')) assert.equal(choice.merchant, undefined);
      if (choice.merchant?.sponsored) {
        const destination = new URL(choice.merchant.href);
        if (destination.hostname === 'www.amazon.com') {
          assert.equal(destination.searchParams.get('tag'), 'watercheckup-20');
        } else {
          const { clearlyFilteredDirectUrl } = await import('../lib/waterdrop-buy');
          assert.equal(choice.merchant.brand, 'Clearly Filtered');
          assert.equal(choice.merchant.href, clearlyFilteredDirectUrl('https://www.clearlyfiltered.com/products/filtered-water-pitcher'));
        }
      }
    }
  }
});
