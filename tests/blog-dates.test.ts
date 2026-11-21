import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POSTS } from '../app/blog/posts';
import { BLOG_POST_SLUGS } from '../lib/blog-post-slugs';
import {
  BLOG_POST_DATE_MODIFIED,
  BLOG_UPDATED_DATES,
  blogPostDateFields,
} from '../lib/blog-post-dates';
import sitemap from '../app/sitemap';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MIX = new Set<string>(BLOG_UPDATED_DATES);
const SHOWER = 'best-shower-filter-2026';
const HARD_WATER = 'best-water-filter-hard-water';
const TODAY_UPDATED = new Set([
  SHOWER,
  'best-water-filter-pitcher-2025',
  'waterdrop-g3p600-vs-aquasana-smartflow',
  'best-under-sink-water-filter',
  'best-ro-system-for-pfas-removal',
  'why-does-tap-water-taste-bad',
  'fluoride-in-tap-water-safe-or-not',
  'lead-in-tap-water-signs-and-symptoms',
  'is-new-york-city-tap-water-safe-2026',
]);
const ALERTS = 'drinking-water-alerts-november-2026';

test('every indexed blog slug has a dateModified and a matching sitemap lastmod', () => {
  const map = sitemap();
  for (const slug of BLOG_POST_SLUGS) {
    const iso = BLOG_POST_DATE_MODIFIED[slug];
    assert.ok(iso, `missing dateModified for ${slug}`);
    if (TODAY_UPDATED.has(slug)) {
      assert.equal(iso, '2026-11-19');
    } else if (slug === ALERTS) {
      assert.equal(iso, '2026-11-21');
    } else {
      assert.ok(MIX.has(iso), `${slug} dateModified ${iso} is not in the Oct/Nov mix`);
    }
    const row = map.find((entry) => entry.url.endsWith(`/blog/${slug}`));
    assert.ok(row, `sitemap missing ${slug}`);
    assert.equal(String(row.lastModified ?? ''), iso, `${slug} sitemap lastmod`);
  }
});

test('POSTS keep original datePublished and show an Updated label from dateModified', () => {
  const counts: Record<string, number> = {};
  for (const [slug, post] of Object.entries(POSTS)) {
    const iso = BLOG_POST_DATE_MODIFIED[slug];
    assert.ok(iso, slug);
    assert.equal(post.dateModified, iso, slug);
    assert.match(post.dateDisplay, /^Updated /);
    assert.ok(post.date <= iso || TODAY_UPDATED.has(slug), `${slug} published ${post.date} after modified ${iso}`);
    counts[iso] = (counts[iso] ?? 0) + 1;
  }
  assert.ok(POSTS[SHOWER]);
  assert.equal(POSTS[SHOWER].date, '2026-11-19');
  assert.equal(POSTS[SHOWER].dateModified, '2026-11-19');
  assert.ok(POSTS[ALERTS]);
  assert.equal(POSTS[ALERTS].date, '2026-11-21');
  assert.equal(POSTS[ALERTS].dateModified, '2026-11-21');
  assert.equal(POSTS[ALERTS].dateDisplay, 'Updated November 21, 2026');

  for (const day of BLOG_UPDATED_DATES) {
    // Oct 1/3 mix shrinks as factual product updates move to Nov 19.
    const min = 7;
    assert.ok((counts[day] ?? 0) >= min, `${day} only used ${counts[day] ?? 0} times`);
  }
});

test('blogPostDateFields is the single source for ISO + visible Updated copy', () => {
  const fields = blogPostDateFields('is-pfas-in-my-tap-water', '2026-03-28');
  assert.equal(fields.date, '2026-03-28');
  assert.equal(fields.dateModified, '2026-10-03');
  assert.equal(fields.dateDisplay, 'Updated October 3, 2026');
});

test('hard-water standalone page visible date matches Oct 3 mix and JSON-LD', () => {
  assert.equal(BLOG_POST_DATE_MODIFIED[HARD_WATER], '2026-10-03');
  const source = readFileSync(join(process.cwd(), 'app/blog/best-water-filter-hard-water/page.tsx'), 'utf8');
  assert.match(source, /Updated October 3, 2026/);
  assert.match(source, /dateModified: DATE_MODIFIED/);
  assert.match(source, /AquaTru Classic about \$380/);
});
