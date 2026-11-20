import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { POSTS } from '../app/blog/posts';
import {
  GUIDE_TOP3_OVERRIDES,
  hasExplicitTopPicks,
  resolveBlogTopPicks,
} from '../lib/blog-top-picks';
import { WATERDROP_PT07_URL, WATERDROP_REF } from '../lib/waterdrop-buy';
import { preferredAmazonPurchaseUrl } from '../lib/home-shopping';

const PITCHER = 'best-water-filter-pitcher-2025';
const RO = 'best-ro-system-for-pfas-removal';
const UNDERSINK = 'best-under-sink-water-filter';

test('pitcher, RO, and under-sink guides use explicit Top 3 that match the articles', () => {
  assert.equal(hasExplicitTopPicks(PITCHER), true);
  assert.equal(hasExplicitTopPicks(RO), true);
  assert.equal(hasExplicitTopPicks(UNDERSINK), true);

  const pitcher = resolveBlogTopPicks(PITCHER);
  assert.deepEqual(pitcher.map((p) => p.product), [
    'Brita Elite OB06 in a compatible pitcher',
    'Clearly Filtered 10-Cup Pitcher',
    'ZeroWater 10-Cup Pitcher',
  ]);
  // Brand collection lists PT-07B sold out; keep the PDP link elsewhere, not in this Top 3.
  assert.equal(pitcher.some((p) => /PT-07B/i.test(p.product)), false);

  const ro = resolveBlogTopPicks(RO);
  assert.deepEqual(ro.map((p) => p.product), [
    'Waterdrop G3P600',
    'APEC ROES-50',
    'AquaTru Classic Countertop RO',
  ]);
  assert.equal(ro.every((p) => /RO|osmosis/i.test(`${p.product} ${p.badge} ${p.reason}`)), true);
  assert.equal(ro.some((p) => /pitcher/i.test(p.product)), false);

  const sink = resolveBlogTopPicks(UNDERSINK);
  assert.deepEqual(sink.map((p) => p.product), [
    'Waterdrop G3P600',
    'Frizzlife SK99-NEW',
    'Epic Smart Shield',
  ]);
  assert.equal(sink.some((p) => /MK99/i.test(p.product)), false);
});

test('PT-07B buy buttons use the Waterdrop pitcher PDP with affiliate ref, not Amazon or the collection', () => {
  assert.equal(WATERDROP_REF, 'anbyjkqb');
  assert.equal(
    WATERDROP_PT07_URL,
    'https://www.waterdropfilter.com/products/water-pitcher-with-filter?ref=anbyjkqb',
  );
  assert.equal(preferredAmazonPurchaseUrl('https://www.amazon.com/dp/B07C3P2RZP?tag=watercheckup-20'), undefined);

  const picks = [...GUIDE_TOP3_OVERRIDES[PITCHER], ...resolveBlogTopPicks('is-new-york-city-tap-water-safe-2026')];
  for (const pick of picks.filter((p) => /PT-07B/i.test(p.product))) {
    assert.equal(pick.link, WATERDROP_PT07_URL);
    assert.match(pick.amazon, /tag=watercheckup-20/);
  }

  const src = [
    'lib/blog-top-picks.ts',
    'app/blog/posts.tsx',
    'app/water/[city]/page.tsx',
    'app/utilities/[state]/[slug]/page.tsx',
  ].map((file) => readFileSync(join(process.cwd(), file), 'utf8')).join('\n');
  assert.doesNotMatch(src, /collections\/pitcher-water-filter/);
  assert.match(src, /products\/water-pitcher-with-filter\?ref=anbyjkqb/);
});

test('under-sink FAQ uses the G3P600 2:1 pure-to-drain ratio', () => {
  const faq = POSTS[UNDERSINK].faq?.find((item) => /waste a lot of water/i.test(item.q));
  assert.ok(faq);
  assert.match(faq!.a, /2:1/);
  assert.doesNotMatch(faq!.a, /3:1/);
  assert.match(faq!.a, /2 gallons purified per 1 wasted/);
});
