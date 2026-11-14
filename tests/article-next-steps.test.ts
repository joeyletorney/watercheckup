import test from 'node:test';
import assert from 'node:assert/strict';
import { articleNextSteps } from '../lib/blog-next-steps';
import { POSTS } from '../app/blog/posts';
import { COMMERCIAL_GUIDES } from '../app/blog/commercial-guide-data';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BlogNextSteps } from '../components/BlogNextSteps';

test('testing, wells and active advisories offer relevant next steps without a generic equipment sale', () => {
  for (const slug of ['how-to-test-your-tap-water-mail-in-labs-explained', 'private-well-water-testing-101', 'nitrate-in-well-water-infants-and-pregnancy', 'radon-in-drinking-water', 'boil-water-advisory-what-to-do-and-how-long']) {
    const next = articleNextSteps(slug);
    assert.ok(next);
    assert.equal(next.links.some(l => l.href.startsWith('/quiz')), false);
    const html = renderToStaticMarkup(createElement(BlogNextSteps, {slug, guidance:next}));
    assert.doesNotMatch(html, /rel="sponsored|affiliate_click|TOP PICKS/);
    assert.ok(next.links.every(l => l.href !== `/blog/${slug}`), 'no self-referencing next steps');
  }
  assert.match(articleNextSteps('private-well-water-testing-101')!.description, /does not measure private-well/);
  assert.match(articleNextSteps('boil-water-advisory-what-to-do-and-how-long')!.description, /current|local health/);
  assert.ok(articleNextSteps('how-to-test-your-tap-water-mail-in-labs-explained')!.links.some(l => l.step === 'certified_laboratory'));
});

test('maintained commercial guides keep their comparisons and educational defaults never infer a filter category', () => {
  for (const slug of Object.keys(COMMERCIAL_GUIDES)) assert.equal(articleNextSteps(slug), undefined);
  for (const slug of ['best-under-sink-water-filter', 'best-water-filter-pitcher-2025']) assert.equal(articleNextSteps(slug), undefined);
  const unknown = articleNextSteps('unknown-educational-topic')!;
  assert.equal(unknown.links[0].step, 'supplier_report');
  assert.equal(unknown.links.find(l => l.step === 'filter_quiz')!.href, '/quiz');
  for (const [slug] of Object.entries(POSTS)) {
    const next = articleNextSteps(slug);
    if (!next) continue;
    assert.equal(new Set(next.links.map(l => l.step)).size, next.links.length);
    for (const link of next.links) if (link.href.startsWith('/blog/')) assert.ok(POSTS[link.href.slice(6)] || COMMERCIAL_GUIDES[link.href.slice(6)], `${slug}: missing guide ${link.href}`);
  }
});
