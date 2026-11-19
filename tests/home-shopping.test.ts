import test from 'node:test';
import assert from 'node:assert/strict';
import { HOME_SHOPPING_CATEGORIES, homeShoppingProduct, preferredAmazonPurchaseUrl } from '../lib/home-shopping';
import { resolveProductBuyLink } from '../lib/product-buy-url';

test('short home categories contain three distinct available exact-model Amazon destinations each', () => {
  assert.equal(HOME_SHOPPING_CATEGORIES.length, 3);
  for (const category of HOME_SHOPPING_CATEGORIES) {
    assert.equal(category.picks.length, 3);
    assert.equal(new Set(category.picks.map(p => p.id)).size, 3);
    for (const pick of category.picks) {
      const product = homeShoppingProduct(pick.id);
      assert.ok(product);
      const url = new URL(product.amazon);
      assert.equal(url.hostname, 'www.amazon.com');
      assert.equal(url.searchParams.get('tag'), 'watercheckup-20');
      assert.match(url.pathname, /^\/dp\/[A-Z0-9]{10}$/);
      assert.doesNotMatch(product.name, /K19-S/);
      if (category.id === 'no-install') assert.doesNotMatch(product.name, /Under-Sink|Whole House/);
    }
  }
});

test('Amazon preference never promotes missing, mismatched, unverified or search-only destinations', () => {
  for (const href of [undefined, '', '#', 'not-a-url', 'https://www.amazon.com/s?k=water+filter', 'https://www.amazon.com/dp/B0BHQRNGZ8', 'https://www.amazon.com/dp/B0FYCRPXLZ', 'https://example.com/dp/B07P1XFYJP']) {
    assert.equal(preferredAmazonPurchaseUrl(href), undefined, String(href));
  }
  assert.equal(preferredAmazonPurchaseUrl('https://www.amazon.com/dp/B07P1XFYJP?tag=watercheck20-20'), 'https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20');
  assert.equal(homeShoppingProduct(6), undefined);
  assert.equal(homeShoppingProduct(999), undefined);
});

test('verified model chooses Amazon over brand routing while discontinued K19 routes to current comparisons', () => {
  const g3 = resolveProductBuyLink({ name: 'Waterdrop G3P600', brand: 'Waterdrop', amazon: 'https://www.amazon.com/dp/B07P1XFYJP', directLink: 'https://www.waterdropfilter.com/' });
  assert.equal(g3.destination, 'amazon');
  assert.equal(g3.label, 'Check price on Amazon →');
  const k19 = resolveProductBuyLink({ name: 'Waterdrop K19-S', brand: 'Waterdrop', amazon: '' });
  assert.equal(k19.destination, 'direct');
  assert.equal(k19.href, '/#find-a-filter');
});

test('current home picks exclude unavailable models and preserve RO versus carbon distinctions', () => {
  for (const id of [5, 6, 26, 28]) assert.equal(homeShoppingProduct(id), undefined);
  const under = HOME_SHOPPING_CATEGORIES.find(c => c.id === 'under-sink')!;
  assert.deepEqual(under.picks.map(p => p.id), [23, 47, 25]);
  for (const pick of under.picks.filter(p => p.id !== 47)) assert.match(pick.tradeoff, /not reverse osmosis/i);
});
