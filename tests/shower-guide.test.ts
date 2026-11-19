import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POSTS } from '../app/blog/posts';
import { FOOTER_COLUMNS } from '../lib/footer-links';
import { BLOG_POST_SLUGS } from '../lib/blog-post-slugs';
import { articleNextSteps } from '../lib/blog-next-steps';
import { CTR_SERP_OVERRIDES } from '../lib/ctr-serp-seo';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { TOP_SHOWER } from '../lib/blog-top-picks';
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
  assert.ok(TOP_SHOWER.some((p) => /AquaBliss/i.test(p.product)));
  assert.ok(TOP_SHOWER.some((p) => /AquaTru/i.test(p.product)));
  assert.ok(TOP_SHOWER.some((p) => /vitamin c/i.test(`${p.product} ${p.reason}`)));
  for (const pick of TOP_SHOWER) {
    assert.equal(new URL(pick.amazon).protocol, 'https:');
    assert.equal(new URL(pick.amazon).searchParams.get('tag'), 'watercheckup-20');
  }

  const picksSource = readFileSync(join(process.cwd(), 'components/BlogTopPicks.tsx'), 'utf8');
  assert.match(picksSource, /rel="noopener noreferrer sponsored"/);
  assert.match(picksSource, /page=\{page\}/);
  const affiliateLink = readFileSync(join(process.cwd(), 'components/AffiliateLink.tsx'), 'utf8');
  assert.match(affiliateLink, /data-wc-affiliate-tracked="true"/);
  assert.match(affiliateLink, /href: typeof href === 'string' \? href : undefined/);

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
