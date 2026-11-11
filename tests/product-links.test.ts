import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAmazonUrl } from '../lib/amazon-affiliate';
import { PRODUCTS } from '../lib/home-products-catalog';
import { WATERDROP_DIRECT_BY_ID, resolveAffiliateAmazonUrl, clearlyFilteredDirectUrl } from '../lib/waterdrop-buy';

test('legacy PD1000 cards select the verified PD1000 listing and preserve affiliate tags', () => {
  const original = 'https://www.amazon.com/dp/B083DFW1QS?tag=watercheck20-20';
  assert.equal(normalizeAmazonUrl(original), 'https://www.amazon.com/dp/B0BK8ZRY2K?tag=watercheck20-20');
  assert.equal(normalizeAmazonUrl('https://www.amazon.com/dp/B0BK8ZRY2K?tag=custom-20'), 'https://www.amazon.com/dp/B0BK8ZRY2K?tag=custom-20');
  assert.equal(PRODUCTS.find(p => p.id === 27)?.amazon.includes('B0BK8ZRY2K'), true);
});

test('every catalog card has a real destination after brand routing', () => {
  for (const p of PRODUCTS) {
    const href = p.brand === 'Waterdrop'
      ? WATERDROP_DIRECT_BY_ID[p.id]
      : p.brand === 'Clearly Filtered'
        ? clearlyFilteredDirectUrl('brandLink' in p ? p.brandLink : undefined)
        : resolveAffiliateAmazonUrl(p.brand, p.amazon) || ('brandLink' in p ? p.brandLink : undefined);
    assert.ok(href, `${p.name} needs a purchase destination`);
    assert.equal(new URL(href!).protocol, 'https:');
    if (p.brand === 'Waterdrop') assert.equal(new URL(href!).searchParams.get('ref'), 'anbyjkqb');
  }
});

test('discontinued or mismatched Waterdrop Amazon alternatives are not offered', () => {
  for (const id of [6, 34]) {
    const product = PRODUCTS.find(p => p.id === id)!;
    assert.equal(product.amazon, '');
    assert.ok(WATERDROP_DIRECT_BY_ID[id]?.includes('/products/'));
  }
});
