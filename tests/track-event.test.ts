import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildAffiliateClickEvent, trackAffiliateClick } from '../lib/affiliate-tracking';
import { trackEvent, trackNewsletterSignup } from '../lib/track-event';

const root = join(process.cwd());

function withWindow<T>(value: Record<string, unknown>, run: () => T): T {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value });
    return run();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
}

test('trackEvent uses gtag when present and queues on dataLayer when it is missing', () => {
  const events: unknown[][] = [];
  withWindow(
    {
      gtag: (...args: unknown[]) => events.push(args),
      location: { pathname: '/quiz', origin: 'https://watercheckup.com' },
    },
    () => {
      trackEvent('quiz_complete', { source: 'city' });
      assert.equal(events.length, 1);
      assert.equal(events[0][0], 'event');
      assert.equal(events[0][1], 'quiz_complete');
      const payload = events[0][2] as Record<string, unknown>;
      assert.equal(payload.source, 'city');
      assert.equal(payload.page_path, '/quiz');
    },
  );

  const queued = withWindow(
    { location: { pathname: '/', origin: 'https://watercheckup.com' } },
    () => {
      trackEvent('water_search_submitted', { input_type: 'zip' });
      assert.equal(typeof window.gtag, 'function');
      assert.ok(Array.isArray(window.dataLayer));
      assert.ok((window.dataLayer?.length ?? 0) >= 1);
      return window.dataLayer ?? [];
    },
  );
  assert.ok(queued.length >= 1);
});

test('newsletter signup sends newsletter_signup plus sign_up and generate_lead with source and page_path', () => {
  const events: unknown[][] = [];
  withWindow(
    {
      gtag: (...args: unknown[]) => events.push(args),
      location: { pathname: '/', origin: 'https://watercheckup.com' },
    },
    () => {
      trackNewsletterSignup('weekly-newsletter');
      assert.deepEqual(events.map((event) => event[1]), ['newsletter_signup', 'sign_up', 'generate_lead']);
      for (const event of events) {
        const payload = event[2] as Record<string, unknown>;
        assert.equal(payload.source, 'weekly-newsletter');
        assert.equal(payload.page_path, '/');
        assert.equal(payload.method, 'newsletter_form');
        assert.equal(payload.transport_type, 'beacon');
      }
    },
  );

  const home = readFileSync(join(root, 'components/HomeNewsletterSignup.tsx'), 'utf8');
  const signup = readFileSync(join(root, 'components/NewsletterSignup.tsx'), 'utf8');
  const email = readFileSync(join(root, 'app/water/[city]/EmailCapture.tsx'), 'utf8');
  const results = readFileSync(join(root, 'app/results/[zip]/ResultsClient.tsx'), 'utf8');
  const subscribe = readFileSync(join(root, 'app/api/newsletter/subscribe/route.ts'), 'utf8');
  for (const source of [home, signup, email, results]) {
    assert.match(source, /trackNewsletterSignup\(/);
    assert.doesNotMatch(source, /window\.gtag\?\.?\(/);
  }
  assert.match(subscribe, /best-effort/);
  assert.doesNotMatch(subscribe, /Email could not be sent/);
});

test('affiliate_click always includes a product name and destination URL when href is known', () => {
  const payload = buildAffiliateClickEvent({
    product: '  ',
    destination: 'amazon',
    page: 'lead',
    href: 'https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20',
  });
  assert.equal(payload.product, 'amazon.com');
  assert.equal(payload.product_id, 'amazon-com');
  assert.equal(payload.link_url, 'https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20');
  assert.equal(payload.link_domain, 'amazon.com');
  assert.equal(payload.item_name, 'amazon.com');

  const named = buildAffiliateClickEvent({
    product: 'Waterdrop G3P600',
    destination: 'direct',
    page: '/blog/best-water-filter-for-lead-removal',
    href: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb',
  });
  assert.equal(named.product, 'Waterdrop G3P600');
  assert.equal(named.product_id, 'waterdrop-g3p600');
  assert.match(String(named.link_url), /waterdropfilter\.com/);

  const events: unknown[][] = [];
  withWindow(
    {
      gtag: (...args: unknown[]) => events.push(args),
      location: { pathname: '/lead', origin: 'https://watercheckup.com' },
    },
    () => {
      trackAffiliateClick({
        product: 'Waterdrop G3P600',
        destination: 'direct',
        page: 'lead',
        href: 'https://www.waterdropfilter.com/products/g3p600?ref=anbyjkqb',
      });
    },
  );
  const sent = events[0][2] as Record<string, unknown>;
  assert.equal(sent.product, 'Waterdrop G3P600');
  assert.equal(sent.link_url, 'https://www.waterdropfilter.com/products/g3p600?ref=anbyjkqb');

  withWindow({ location: { pathname: '/pfas', origin: 'https://watercheckup.com' } }, () => {
    assert.doesNotThrow(() => trackAffiliateClick({ product: 'Pitcher', destination: 'amazon', page: 'quiz' }));
    const queued = window.dataLayer ?? [];
    assert.ok(queued.length >= 1);
  });

  const affiliateLink = readFileSync(join(root, 'components/AffiliateLink.tsx'), 'utf8');
  assert.match(affiliateLink, /data-product=\{product\}/);
  assert.match(affiliateLink, /data-affiliate-href/);

  const fallback = readFileSync(join(root, 'app/components/AffiliateClickFallback.tsx'), 'utf8');
  assert.match(fallback, /data-product/);
  assert.match(fallback, /data-affiliate-href/);

  const lead = readFileSync(join(root, 'app/lead/page.tsx'), 'utf8');
  const pfas = readFileSync(join(root, 'app/pfas/page.tsx'), 'utf8');
  const well = readFileSync(join(root, 'app/well/page.tsx'), 'utf8');
  assert.match(lead, /<AffiliateLink /);
  assert.match(pfas, /<AffiliateLink /);
  assert.match(well, /<AffiliateLink /);
});

test('zip search and quiz fire through the shared trackEvent helper', () => {
  const search = readFileSync(join(root, 'components/WaterSearch.tsx'), 'utf8');
  assert.match(search, /trackEvent\('form_start'/);
  assert.match(search, /trackEvent\('water_search_submitted'/);
  assert.match(search, /trackEvent\('water_search_invalid'/);
  assert.doesNotMatch(search, /window\.gtag/);

  const quiz = readFileSync(join(root, 'app/quiz/page.tsx'), 'utf8');
  assert.match(quiz, /import \{ trackEvent \} from '@\/lib\/track-event'/);
  assert.match(quiz, /trackEvent\('quiz_complete'/);
  assert.doesNotMatch(quiz, /window\.gtag/);
});
