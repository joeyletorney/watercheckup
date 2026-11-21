import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { POSTS } from '../app/blog/posts';
import { BLOG_POST_SLUGS } from '../lib/blog-post-slugs';
import { articleNextSteps } from '../lib/blog-next-steps';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { WATERDROP_G3P600_URL } from '../lib/waterdrop-buy';
import sitemap from '../app/sitemap';

const SLUG = 'drinking-water-alerts-november-2026';
const PATH = `/blog/${SLUG}`;

test('November 2026 alerts article is wired into posts, index, sitemap, and FAQ schema fields', () => {
  const post = POSTS[SLUG];
  assert.ok(post, 'POSTS is missing the November 2026 alerts article');
  assert.equal(post.seo?.canonical, `https://watercheckup.com${PATH}`);
  assert.ok((post.seo?.title?.length ?? 99) <= SERP_TITLE_MAX, post.seo?.title);
  assert.ok((post.seo?.description?.length ?? 999) <= SERP_DESCRIPTION_MAX, post.seo?.description);
  assert.ok((post.faq?.length ?? 0) >= 4);
  assert.ok((BLOG_POST_SLUGS as readonly string[]).includes(SLUG));
  assert.ok(articleNextSteps(SLUG));

  const map = sitemap();
  const row = map.find((entry) => entry.url.endsWith(PATH));
  assert.ok(row, 'sitemap missing alerts URL');
  assert.equal(String(row!.lastModified ?? ''), '2026-11-21');

  const blogIndex = readFileSync(join(process.cwd(), 'app/blog/page.tsx'), 'utf8');
  assert.match(blogIndex, new RegExp(`'${SLUG}'`));
  assert.match(blogIndex, /Safety & Health/);
});

test('alerts article cites sources, current status, and does not invent Brita PFAS claims', () => {
  const post = POSTS[SLUG];
  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /Last updated November 21, 2026/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /spartanburgwater\.org/);
  assert.match(html, /still in effect/i);
  assert.match(html, /fox47\.com/);
  assert.match(html, /marshfieldnewsherald\.com/);
  assert.match(html, /11,199,760/);
  assert.match(html, /29\.7/);
  assert.match(html, /oklahoma\.gov\/deq/);
  assert.match(html, /boil order has been lifted/i);
  assert.match(html, /even if it has been boiled/i);
  assert.match(html, /valleywater\.org/);
  assert.match(html, /amwater\.com\/caaw\/alerts/);
  assert.match(html, /beavercountyradio\.com/);
  assert.match(html, /wpxi\.com/);
  assert.match(html, /pfas_ucmr5_national_statistics_20261018\.pdf/);
  assert.match(html, /3,595/);
  assert.match(html, /1,763/);
  assert.match(html, /cdc\.gov\/water-emergency/);
  assert.match(html, new RegExp(WATERDROP_G3P600_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(html, /\/blog\/best-water-filter-for-lead-removal/);
  assert.match(html, /\/blog\/what-water-filter-removes-pfas/);
  assert.match(html, /\/blog\/best-water-filter-pitcher-2025/);
  assert.doesNotMatch(html, /\/water\/spartanburg/);
  assert.doesNotMatch(html, /\/water\/watertown/);
  assert.doesNotMatch(html, /\/water\/marshfield/);

  const brita = post.faq?.find((item) => /brita/i.test(item.q));
  assert.ok(brita);
  assert.match(brita!.a, /Elite OB06/);
  assert.match(brita!.a, /does not establish a PFAS-reduction claim/i);
  assert.doesNotMatch(brita!.a, /Brita removes PFAS/i);

  const boilLead = post.faq?.find((item) => /boiling remove lead/i.test(item.q));
  assert.ok(boilLead);
  assert.match(boilLead!.a, /does not remove lead/i);
  assert.match(boilLead!.a, /not by itself a lead claim/i);
  assert.match(html, /does not by itself verify lead reduction/i);

  const shower = post.faq?.find((item) => /shower/i.test(item.q));
  assert.ok(shower);
  assert.match(shower!.a, /CDC/i);
});
