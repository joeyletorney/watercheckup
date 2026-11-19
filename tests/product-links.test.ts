import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeAmazonUrl, AMAZON_ASSOCIATE_TAG } from '../lib/amazon-affiliate';
import { PRODUCTS } from '../lib/home-products-catalog';
import { WATERDROP_DIRECT_BY_ID, resolveAffiliateAmazonUrl } from '../lib/waterdrop-buy';
import { preferredAmazonPurchaseUrl } from '../lib/home-shopping';

test('legacy PD1000 remaps keep the Amazon ASIN for old URLs, but the catalog button uses the brand PDP', () => {
  const original = 'https://www.amazon.com/dp/B083DFW1QS?tag=watercheckup-20';
  assert.equal(normalizeAmazonUrl(original), 'https://www.amazon.com/dp/B0BK8ZRY2K?tag=watercheckup-20');
  assert.equal(normalizeAmazonUrl('https://www.amazon.com/dp/B0BK8ZRY2K?tag=custom-20'), 'https://www.amazon.com/dp/B0BK8ZRY2K?tag=custom-20');
  const pd1000 = PRODUCTS.find(p => p.id === 27);
  assert.equal(pd1000?.amazon, '');
  assert.equal(pd1000?.brandLink, 'https://www.frizzlife.com/products/pd1000-tam4');
  assert.equal(preferredAmazonPurchaseUrl('https://www.amazon.com/dp/B0BK8ZRY2K?tag=watercheckup-20'), undefined);
});

test('trusted-pick brand buttons opt out of the global sponsored-link fallback', () => {
  const src = readFileSync(new URL('../components/TrustedFilterCategories.tsx', import.meta.url), 'utf8');
  assert.match(src, /<AffiliateLink[\s\S]*destination="brand"[\s\S]*page="trusted-picks"/);
  assert.doesNotMatch(src, /rel="noopener noreferrer sponsored"\s+onClick=\{\(\) => trackAffiliateClick/);
});

test('well API no longer ships Amazon 404 ASINs and points lab tests at MyTapScore', () => {
  const well = readFileSync(new URL('../app/api/well/route.ts', import.meta.url), 'utf8');
  for (const asin of ['B01NCDKLWC', 'B00JO7R694', 'B07FJLNLSD', 'B07Q9C9BMX', 'B09TY8MDF9']) {
    assert.doesNotMatch(well, new RegExp(asin));
  }
  assert.match(well, /SIMPLELAB_WELL_TESTS_URL/);
  assert.match(well, /Clearly Filtered 10-Cup Pitcher/);
  assert.doesNotMatch(well, /Well Water Edition/);
});

test('every catalog card has a real destination after brand routing', () => {
  for (const p of PRODUCTS) {
    const href = p.brand === 'Waterdrop'
      ? WATERDROP_DIRECT_BY_ID[p.id]
      : resolveAffiliateAmazonUrl(p.brand, p.amazon) || ('brandLink' in p ? p.brandLink : undefined);
    assert.ok(href, `${p.name} needs a purchase destination`);
    assert.equal(new URL(href!).protocol, 'https:');
    if (new URL(href!).hostname === 'www.amazon.com') {
      assert.equal(AMAZON_ASSOCIATE_TAG, 'watercheckup-20');
      assert.equal(new URL(href!).searchParams.get('tag'), AMAZON_ASSOCIATE_TAG);
    }
    if (p.brand === 'Waterdrop') assert.equal(new URL(href!).searchParams.get('ref'), 'anbyjkqb');
  }
});

test('catalog prices and names match the November 2026 product audit', () => {
  assert.equal(PRODUCTS.find(p => p.id === 47)?.price, 399);
  assert.equal(PRODUCTS.find(p => p.id === 10)?.price, 23);
  assert.equal(PRODUCTS.find(p => p.id === 31)?.price, 380);
  assert.equal(PRODUCTS.find(p => p.id === 13)?.price, 60);
  assert.equal(PRODUCTS.find(p => p.id === 20)?.name, 'AquaBliss SF100 Daily Revitalize');
  assert.deepEqual(PRODUCTS.find(p => p.id === 9)?.cert, ['NSF/ANSI 42', 'NSF/ANSI 372']);
  assert.deepEqual(PRODUCTS.find(p => p.id === 34)?.cert, ['NSF/ANSI 372']);
  assert.equal(PRODUCTS.find(p => p.id === 37)?.cert?.includes('NSF/ANSI 55 Class B'), false);
});

test('discontinued or mismatched Waterdrop Amazon alternatives are not offered', () => {
  for (const id of [6, 34]) {
    const product = PRODUCTS.find(p => p.id === id)!;
    assert.equal(product.amazon, '');
    assert.ok(WATERDROP_DIRECT_BY_ID[id]?.includes('/products/'));
  }
});
