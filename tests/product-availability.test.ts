import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { unavailablePurchase, isAmazonSearch } from '../lib/product-availability';
import { TOP_WHOLE_HOUSE } from '../lib/blog-top-picks';

test('legacy unavailable destinations never masquerade as current purchase options', () => {
  assert.ok(unavailablePurchase('Historical recommendation', 'https://www.amazon.com/dp/B0CHZ8VQBB'));
  assert.ok(unavailablePurchase('Waterdrop K19-S'));
  assert.equal(unavailablePurchase('Frizzlife SK99-NEW'), false);
  assert.ok(isAmazonSearch('https://www.amazon.com/s?k=softener'));
  assert.equal(isAmazonSearch('https://example.com/s?k=softener'), false);
});

test('whole-house recommendation and FAQ do not transfer PFAS claims to WH-1000-B', () => {
  const pick = TOP_WHOLE_HOUSE.find(p => p.product.includes('WH-1000-B'))!;
  assert.doesNotMatch(pick.reason, /certified.*PFAS|reduces.*PFAS/i);
  const content = readFileSync(new URL('../app/blog/extra-posts-5.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(content, /WH-1000-B is certified to reduce PFAS|Rhino wins on lifespan and PFAS|EQ-1000 reduces PFAS/);
});
