import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { POSTS } from '../app/blog/posts';
import { COMMERCIAL_GUIDES } from '../app/blog/commercial-guide-data';
import { BLOG_POST_DATE_MODIFIED } from '../lib/blog-post-dates';
import { CTR_SERP_OVERRIDES } from '../lib/ctr-serp-seo';
import { HOME_FAQS, SITE_FAQ_SCHEMA } from '../lib/site-faq-schema';
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE, SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { gaithersburgFAQs } from '../lib/faq-gaithersburg';
import {
  MDE_CERTIFIED_LABS_PAGE_URL,
  WSSC_WATER_QUALITY_REPORT_URL,
} from '../lib/city-water-testing';

const PITCHER = 'best-water-filter-pitcher-2025';
const COMPARE = 'waterdrop-g3p600-vs-aquasana-smartflow';

test('pitcher guide targets the Anker review query without inventing Anker NSF claims', () => {
  const post = POSTS[PITCHER];
  assert.match(post.title, /2026/);
  assert.match(post.title, /anker review/i);
  assert.equal(post.dateModified, '2026-11-19');
  const ankerFaq = post.faq?.find((item) => /anker/i.test(item.q));
  assert.ok(ankerFaq);
  assert.match(ankerFaq!.a, /could not verify|NSF/i);
  assert.doesNotMatch(ankerFaq!.a, /Anker is NSF/);

  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /Anker water filter pitcher review/);
  assert.match(html, /Aarke Purifier/);
  assert.match(html, /EN 17093/);
  assert.doesNotMatch(html, /tag=watercheckup-20.*anker/i);
  assert.doesNotMatch(html, /amazon\.com\/dp\/B0[A-Z0-9]+.*Anker/i);
});

test('Waterdrop vs Aquasana opens with a 2026 verdict and a comparison table', () => {
  const post = POSTS[COMPARE];
  assert.equal(post.title, 'Waterdrop vs Aquasana (2026): Which Filter Is Better?');
  assert.equal(post.dateModified, '2026-11-19');
  assert.ok(post.faq?.some((item) => /waterdrop or aquasana better/i.test(item.q)));
  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /Verdict:/);
  assert.match(html, /<table/);
  assert.match(html, /Waterdrop G3P600/);
  assert.match(html, /Aquasana SmartFlow/);
  assert.ok(post.topPicks.some((pick) => /tag=watercheckup-20/.test(pick.amazon)));
});

test('Gaithersburg testing copy links WSSC CCR and the MDE certified lab list', () => {
  const cityPage = readFileSync(join(process.cwd(), 'app/water/[city]/page.tsx'), 'utf8');
  assert.match(cityPage, /How to test your water in Gaithersburg, MD/);
  assert.match(cityPage, /dateModified="2026-11-19"/);
  assert.match(cityPage, /GAITHERSBURG_TESTING_SOURCES/);

  assert.equal(WSSC_WATER_QUALITY_REPORT_URL, 'https://www.wsscwater.com/waterquality');
  assert.equal(
    MDE_CERTIFIED_LABS_PAGE_URL,
    'https://mde.maryland.gov/programs/Water/water_supply/Pages/wsp-labcert.aspx',
  );

  const localProviders = gaithersburgFAQs.find((item) => /local providers who specialize in comprehensive water testing/i.test(item.question));
  assert.ok(localProviders);
  assert.match(localProviders!.answer, /Maryland Department of the Environment/);
  assert.match(localProviders!.answer, /not a testing company/i);
  const waterTest = gaithersburgFAQs.find((item) => /how do I test my water in Gaithersburg/i.test(item.question));
  assert.ok(waterTest);
  assert.match(waterTest!.answer, /WSSC/);
});

test('homepage ZIP-code SERP copy and FAQ schema match GSC queries', () => {
  assert.match(HOME_SEO_TITLE, /tap water safe by ZIP code/i);
  assert.ok(HOME_SEO_TITLE.length <= SERP_TITLE_MAX);
  assert.match(HOME_SEO_DESCRIPTION, /check water quality by ZIP code/i);
  assert.match(HOME_SEO_DESCRIPTION, /water quality report by ZIP code/i);
  assert.ok(HOME_SEO_DESCRIPTION.length <= SERP_DESCRIPTION_MAX);

  assert.ok(HOME_FAQS.some((faq) => faq.question === 'Is my tap water safe?'));
  assert.ok(HOME_FAQS.some((faq) => faq.question === 'How do I check water quality by ZIP code?'));
  assert.equal(SITE_FAQ_SCHEMA['@type'], 'FAQPage');
  assert.equal(SITE_FAQ_SCHEMA.mainEntity.length, HOME_FAQS.length);
});

test('GSC opportunity titles stay within SERP limits', () => {
  for (const path of [
    `/blog/${PITCHER}`,
    `/blog/${COMPARE}`,
    '/water/gaithersburg',
  ]) {
    const copy = CTR_SERP_OVERRIDES[path];
    assert.ok(copy, path);
    assert.ok(copy.title.length <= SERP_TITLE_MAX, `${path} ${copy.title.length}`);
    assert.ok(copy.description.length <= SERP_DESCRIPTION_MAX, `${path} ${copy.description.length}`);
  }
  assert.equal(COMMERCIAL_GUIDES[PITCHER].title, CTR_SERP_OVERRIDES[`/blog/${PITCHER}`].title);
  assert.equal(BLOG_POST_DATE_MODIFIED[PITCHER], '2026-11-19');
  assert.equal(BLOG_POST_DATE_MODIFIED[COMPARE], '2026-11-19');
});
