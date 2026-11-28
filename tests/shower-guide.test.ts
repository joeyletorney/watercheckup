import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POSTS } from '../app/blog/posts';
import { FOOTER_COLUMNS } from '../lib/footer-links';
import { BLOG_POST_SLUGS } from '../lib/blog-post-slugs';
import { articleNextSteps } from '../lib/blog-next-steps';
import { CTR_SERP_OVERRIDES } from '../lib/ctr-serp-seo';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { getTopPicksSubtitle, TOP_SHOWER } from '../lib/blog-top-picks';
import { TRUSTED_FILTER_CATEGORIES } from '../lib/trusted-filter-categories';
import sitemap from '../app/sitemap';
import { buildAffiliateClickEvent, productIdFromName } from '../lib/affiliate-tracking';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SLUG = 'best-shower-filter-2026';
const PATH = `/blog/${SLUG}`;

test('shower filter guide is a live blog route with FAQ, sitemap, and index wiring', () => {
  const post = POSTS[SLUG];
  assert.ok(post, 'POSTS is missing the shower filter guide');
  assert.equal(post.seo?.canonical, `https://watercheckup.com${PATH}`);
  assert.ok((post.faq?.length ?? 0) >= 5);
  assert.ok((BLOG_POST_SLUGS as readonly string[]).includes(SLUG));
  assert.equal(articleNextSteps(SLUG), undefined);

  const map = sitemap();
  assert.ok(map.some((row) => row.url.endsWith(PATH)), 'sitemap missing shower filter URL');

  const blogIndex = readFileSync(join(process.cwd(), 'app/blog/page.tsx'), 'utf8');
  assert.match(blogIndex, new RegExp(`'${SLUG}'`));
  assert.match(blogIndex, /Filter Guides/);

  const footer = FOOTER_COLUMNS.find((col) => col.title === 'Filters & guides');
  assert.ok(footer?.links.some((link) => link.href === PATH));

  const showerCat = TRUSTED_FILTER_CATEGORIES.find((cat) => cat.id === 'shower');
  assert.equal(showerCat?.guideHref, PATH);
});

test('shower filter guide stays honest about chlorine, chloramine, hardness, lead, and PFAS', () => {
  const source = [
    readFileSync(join(process.cwd(), 'app/blog/extra-posts-shower.tsx'), 'utf8'),
    readFileSync(join(process.cwd(), 'components/ShowerGuideQuickPicks.tsx'), 'utf8'),
  ].join('\n');
  assert.match(source, /Quick answer/);
  assert.match(source, /Vitamin C/);
  assert.match(source, /NSF\/ANSI 177/);
  assert.match(source, /chloramine/);
  assert.match(source, /do not soften/);
  assert.match(source, /not certified to remove lead or PFAS/);
  assert.match(source, /We do not claim they prevent cancer/);
  assert.match(source, /href="\/"/);
  assert.match(source, /\/blog\/best-water-filter-hard-water/);
  assert.match(source, /\/blog\/chloramine-vs-chlorine-in-tap-water/);

  const hardWaterPage = readFileSync(join(process.cwd(), 'app/blog/best-water-filter-hard-water/page.tsx'), 'utf8');
  assert.match(hardWaterPage, /best-shower-filter-2026/);
  const quizPage = readFileSync(join(process.cwd(), 'app/quiz/page.tsx'), 'utf8');
  assert.match(quizPage, /best-shower-filter-2026/);
});

test('shower filter SERP copy and affiliate picks keep tracking fields', () => {
  const serp = CTR_SERP_OVERRIDES[PATH];
  assert.ok(serp);
  assert.ok(serp.title.length <= SERP_TITLE_MAX, serp.title);
  assert.ok(serp.description.length <= SERP_DESCRIPTION_MAX, serp.description);
  assert.match(serp.title, /best shower filter 2026/i);
  assert.match(serp.description, /chloramine/i);

  assert.ok(TOP_SHOWER.length >= 3);
  const aquaBliss = TOP_SHOWER.find((p) => /AquaBliss/i.test(p.product));
  const aquaTru = TOP_SHOWER.find((p) => /AquaTru/i.test(p.product));
  const sonaki = TOP_SHOWER.find((p) => /Sonaki/i.test(p.product));
  assert.ok(aquaBliss);
  assert.ok(aquaTru);
  assert.ok(sonaki);
  assert.match(aquaBliss.product, /SF100 Daily Revitalize/);
  assert.doesNotMatch(aquaBliss.product, /High Output/);
  assert.equal(aquaBliss.price, '~$28');
  assert.match(aquaBliss.reason, /calcium sulfite/i);
  assert.match(aquaBliss.reason, /vitamin C/i);
  assert.match(aquaBliss.reason, /Not a softener/);
  assert.doesNotMatch(aquaBliss.reason, /scale feel|hardness benefit/i);
  assert.doesNotMatch(aquaBliss.reason, /no vitamin C|without vitamin C/i);
  assert.equal(new URL(aquaBliss.amazon).pathname, '/dp/B01MUBU0YC');

  assert.equal(aquaTru.price, '~$104');
  assert.equal(aquaTru.badge, 'IAPMO NSF 177');
  assert.match(
    aquaTru.reason,
    /IAPMO R&T certified to NSF\/ANSI 177 for free chlorine \(confirm exact model; chloramine reduction is a maker claim\)/,
  );
  assert.match(aquaTru.reason, /comparable to KDF/);
  assert.doesNotMatch(aquaTru.reason, /\bKDF filter\b/i);
  assert.match(aquaTru.reason, /90 days/);
  assert.match(aquaTru.reason, /\$39\.95/);
  assert.match(aquaTru.reason, /Not a softener/);
  assert.equal(new URL(aquaTru.amazon).pathname, '/dp/B0FLHFTGYD');

  assert.equal(sonaki.price, '~$83');
  assert.equal(sonaki.link, 'https://www.sonaki.com/products/sonaki-inline-vitamin-c-shower-filter');
  assert.equal(new URL(sonaki.amazon).pathname, '/dp/B01BLO3FAU');
  assert.match(sonaki.reason, /4–6 weeks|4-6 weeks/);
  assert.match(sonaki.reason, /Not NSF\/ANSI 177 certified/);
  assert.match(sonaki.product, /SUF-100v/);

  assert.equal(
    getTopPicksSubtitle(SLUG, TOP_SHOWER),
    'Shower filters — chlorine and chloramine reduction for skin and hair',
  );
  assert.doesNotMatch(getTopPicksSubtitle(SLUG, TOP_SHOWER) ?? '', /hardness-related/);

  const guideAndPicks = [
    readFileSync(join(process.cwd(), 'lib/blog-top-picks.ts'), 'utf8'),
    readFileSync(join(process.cwd(), 'app/blog/extra-posts-shower.tsx'), 'utf8'),
    readFileSync(join(process.cwd(), 'components/ShowerGuideQuickPicks.tsx'), 'utf8'),
  ].join('\n');
  assert.doesNotMatch(guideAndPicks, /NSF 177 LISTINGS/);
  assert.doesNotMatch(guideAndPicks, /High Output SF100/);
  assert.doesNotMatch(guideAndPicks, /amazon\.com\/s\?k=Sonaki/);

  for (const pick of TOP_SHOWER) {
    assert.equal(new URL(pick.amazon).protocol, 'https:');
    assert.equal(new URL(pick.amazon).searchParams.get('tag'), 'watercheckup-20');
    assert.match(pick.amazon, /\/dp\/[A-Z0-9]{10}/);
  }

  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
  assert.match(
    css,
    /\.wc-reading-prose a\.wc-blog-top-picks__btn--primary\s*\{[^}]*color:\s*#fff\s*!important/,
    'prose link color must not override pick-button labels',
  );
  assert.match(
    css,
    /\.wc-reading-prose a\.wc-blog-top-picks__btn--secondary\s*\{[^}]*color:\s*#cbd5e1\s*!important/,
  );

  const picksSource = readFileSync(join(process.cwd(), 'components/BlogTopPicks.tsx'), 'utf8');
  assert.match(picksSource, /rel="noopener noreferrer sponsored"/);
  assert.match(picksSource, /page=\{page\}/);
  const affiliateLink = readFileSync(join(process.cwd(), 'components/AffiliateLink.tsx'), 'utf8');
  assert.match(affiliateLink, /data-wc-affiliate-tracked="true"/);
  assert.match(affiliateLink, /href: resolvedHref/);
  assert.match(affiliateLink, /data-product=\{product\}/);

  const payload = buildAffiliateClickEvent({
    product: TOP_SHOWER[0].product,
    brand: TOP_SHOWER[0].brand,
    destination: 'amazon',
    page: PATH,
    href: TOP_SHOWER[0].amazon,
  });
  assert.equal(payload.source_page, PATH);
  assert.equal(payload.link_domain, 'amazon.com');
  assert.equal(payload.product_id, productIdFromName(TOP_SHOWER[0].product));
  assert.equal(payload.link_url, TOP_SHOWER[0].amazon);
});
