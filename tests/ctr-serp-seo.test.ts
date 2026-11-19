import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CTR_SERP_OVERRIDES } from '../lib/ctr-serp-seo';
import { PRIORITY_CITY_H1 } from '../lib/priority-city-seo';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { gaithersburgFAQs } from '../lib/faq-gaithersburg';
import { baltimoreFAQs } from '../lib/faq-baltimore';
import { sanAntonioFAQs } from '../lib/faq-san-antonio';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import config from '../next.config';
import { EXTRA_POSTS_SA } from '../app/blog/extra-posts-sa';

test('CTR SERP overrides stay within title and description limits', () => {
  for (const [path, copy] of Object.entries(CTR_SERP_OVERRIDES)) {
    assert.ok(copy.title.length <= SERP_TITLE_MAX, `${path} title ${copy.title.length}: ${copy.title}`);
    assert.ok(copy.description.length <= SERP_DESCRIPTION_MAX, `${path} desc ${copy.description.length}`);
    assert.doesNotMatch(copy.title, /WaterCheckup/);
  }
});

test('opportunity pages target the queries that actually earn clicks', () => {
  const lead = CTR_SERP_OVERRIDES['/blog/best-water-filter-for-lead-removal'];
  assert.match(lead.title, /best water filter for lead/i);
  assert.match(lead.description, /top-rated water filters for lead-contaminated areas/i);

  const hard = CTR_SERP_OVERRIDES['/blog/best-water-filter-hard-water'];
  assert.match(hard.title, /best filter for hard water/i);

  const countertop = CTR_SERP_OVERRIDES['/blog/best-countertop-water-filter'];
  assert.match(countertop.title, /best countertop water filter 2026 \(for taste\)/i);

  const pitcher = CTR_SERP_OVERRIDES['/blog/best-water-filter-pitcher-2025'];
  assert.match(pitcher.title, /2026/);
  assert.match(pitcher.title, /best water filter pitcher/i);

  const worst = CTR_SERP_OVERRIDES['/worst-lead'];
  assert.match(worst.title, /worst us cities for lead in tap water/i);
  assert.match(worst.title, /2026/);
});

test('keep the 2025 pitcher URL instead of inventing a 2026 slug', async () => {
  const redirects = await config.redirects!();
  assert.equal(
    redirects.some((rule) => rule.source.includes('best-water-filter-pitcher')),
    false,
  );
  assert.ok(CTR_SERP_OVERRIDES['/blog/best-water-filter-pitcher-2025']);
});

test('Jersey City, Stamford, Indianapolis, and Nashville H1s use the safety question', () => {
  for (const slug of ['jersey-city', 'stamford', 'indianapolis', 'nashville']) {
    assert.match(PRIORITY_CITY_H1[slug], /^Is .+ Tap Water Safe\?/);
  }
  assert.equal(PRIORITY_CITY_H1['san-antonio'], 'Is San Antonio Tap Water Safe? PFAS in 2026');
});

test('Gaithersburg FAQs distinguish wells from WSSC and are not a treatment company', () => {
  const well = gaithersburgFAQs.find((f) => /well water testing/i.test(f.question));
  assert.ok(well);
  assert.match(well!.answer, /WSSC|private well/i);
  const treatment = gaithersburgFAQs.find((f) => /treatment or filtration/i.test(f.question));
  assert.match(treatment!.answer, /not a treatment company/i);
});

test('Baltimore FAQs explain CCR vs lab testing and cite Ashburton Lab', () => {
  const ccr = baltimoreFAQs.find((f) => /water quality report/i.test(f.question));
  assert.match(ccr!.answer, /Consumer Confidence Report|CCR/i);
  assert.match(ccr!.answer, /faucet|tap/i);
  const testing = baltimoreFAQs.find((f) => /lead testing in Baltimore/i.test(f.question));
  assert.match(testing!.answer, /Ashburton Laboratory/);
  assert.match(testing!.answer, /410\)?[-.\s]?396[-.\s]?0150/);
});

test('San Antonio PFAS post uses SAWS PWSID TX0150018 and links the city report', () => {
  const post = EXTRA_POSTS_SA['pfas-in-san-antonio-water'];
  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /TX0150018/);
  assert.doesNotMatch(html, /TX2150001/);
  assert.match(html, /\/water\/san-antonio/);
  assert.match(html, /9\.2 ppt/);
  assert.doesNotMatch(html, /15 ppt/);
  const safety = sanAntonioFAQs.find((f) => /safe to drink/i.test(f.question));
  assert.ok(safety);
});
