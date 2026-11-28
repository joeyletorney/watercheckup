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
  assert.equal(post.title, 'Aquasana vs Waterdrop (2026): Which Is Better?');
  assert.equal(post.dateModified, '2026-11-19');
  assert.ok(post.faq?.some((item) => /waterdrop or aquasana better/i.test(item.q)));
  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /Verdict:/);
  assert.match(html, /Aquasana vs Waterdrop comparison table/);
  assert.match(html, /<table/);
  assert.match(html, /Waterdrop G3P600/);
  assert.match(html, /Aquasana SmartFlow/);
  const table = html.match(/<table[\s\S]*?<\/table>/)?.[0] ?? '';
  assert.match(table, /color:\s*#334155/);
  assert.doesNotMatch(table, /color:\s*['"]?#cbd5e1/);
  assert.doesNotMatch(table, /color:\s*['"]?#e2e8f0/);
  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
  assert.match(css, /\.wc-reading-prose table\s*\{[^}]*color:\s*var\(--wc-reading-text\)\s*!important/);
  assert.match(css, /\.wc-reading-prose th\s*\{[^}]*color:\s*var\(--wc-reading-heading\)\s*!important/);
  assert.match(css, /\.wc-reading-prose td\s*\{[^}]*color:\s*var\(--wc-reading-text\)\s*!important/);
  assert.ok(post.topPicks.some((pick) => /tag=watercheckup-20/.test(pick.amazon)));
});

test('Gaithersburg testing copy links WSSC CCR and the MDE certified lab list', () => {
  const cityPage = readFileSync(join(process.cwd(), 'app/water/[city]/page.tsx'), 'utf8');
  const testing = readFileSync(join(process.cwd(), 'lib/place-water-testing.ts'), 'utf8');
  assert.match(testing, /Well water vs city water testing in Gaithersburg, MD/);
  assert.match(testing, /Gaithersburg well water testing/);
  assert.match(testing, /municipal water testing in Gaithersburg/i);
  assert.match(testing, /Maryland Department of the Environment/);
  assert.match(testing, /240-777-0311/);
  assert.match(cityPage, /dateModified="2026-11-28"/);
  assert.match(cityPage, /GAITHERSBURG_TREATMENT_SECTIONS/);

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
  assert.equal(HOME_SEO_TITLE, 'Is My Tap Water Safe by ZIP Code? Free Report');
  assert.match(HOME_SEO_TITLE, /tap water safe by ZIP code/i);
  assert.ok(HOME_SEO_TITLE.length <= SERP_TITLE_MAX);
  assert.match(HOME_SEO_DESCRIPTION, /check water quality by ZIP code/i);
  assert.match(HOME_SEO_DESCRIPTION, /water quality report by ZIP code/i);
  assert.ok(HOME_SEO_DESCRIPTION.length <= SERP_DESCRIPTION_MAX);

  const home = readFileSync(join(process.cwd(), 'app/HomeLanding.tsx'), 'utf8');
  assert.match(home, /<h1 id="wc-home-heading">Is Your Tap Water Safe\?<\/h1>/);
  assert.doesNotMatch(home, /Is my tap water safe by ZIP code/i);
  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
  assert.match(css, /\.wc-home-simple-intro h1[^}]*text-transform:\s*uppercase/);

  assert.ok(HOME_FAQS.some((faq) => faq.question === 'Is my tap water safe?'));
  assert.ok(HOME_FAQS.some((faq) => faq.question === 'Is my tap water safe by ZIP code?'));
  assert.ok(HOME_FAQS.some((faq) => faq.question === 'How do I check water quality by ZIP code?'));
  assert.ok(HOME_FAQS.some((faq) => faq.question === 'Can I get a water report by ZIP code?'));
  assert.equal(SITE_FAQ_SCHEMA['@type'], 'FAQPage');
  assert.equal(SITE_FAQ_SCHEMA.mainEntity.length, HOME_FAQS.length);
  assert.match(home, /Free water quality report by ZIP code/);
  assert.match(home, /href="\/rankings"/);
  assert.match(home, /href="\/worst-cities"/);
});

test('GSC opportunity titles stay within SERP limits', () => {
  for (const path of [
    `/blog/${PITCHER}`,
    `/blog/${COMPARE}`,
    '/water/gaithersburg',
    '/water/san-antonio',
    '/water/baltimore',
    '/blog/best-water-filter-for-lead-removal',
    '/blog/best-water-filter-hard-water',
    '/blog/best-countertop-water-filter',
    '/blog/pfas-in-san-antonio-water',
    '/rankings',
    '/utilities/md/annapolis',
    '/about/joe-letorney',
  ]) {
    const copy = CTR_SERP_OVERRIDES[path];
    if (!copy && path === '/about/joe-letorney') continue;
    assert.ok(copy, path);
    assert.ok(copy.title.length <= SERP_TITLE_MAX, `${path} ${copy.title.length}`);
    assert.ok(copy.description.length <= SERP_DESCRIPTION_MAX, `${path} ${copy.description.length}`);
  }
  assert.equal(COMMERCIAL_GUIDES[PITCHER].title, CTR_SERP_OVERRIDES[`/blog/${PITCHER}`].title);
  assert.equal(COMMERCIAL_GUIDES['best-water-filter-for-lead-removal'].title, CTR_SERP_OVERRIDES['/blog/best-water-filter-for-lead-removal'].title);
  assert.equal(COMMERCIAL_GUIDES['best-water-filter-hard-water'].title, CTR_SERP_OVERRIDES['/blog/best-water-filter-hard-water'].title);
  assert.equal(BLOG_POST_DATE_MODIFIED[PITCHER], '2026-11-19');
  assert.equal(BLOG_POST_DATE_MODIFIED[COMPARE], '2026-11-19');
});

test('lead guide opens with a top pick and NSF 53 comparison table', () => {
  const post = POSTS['best-water-filter-for-lead-removal'];
  assert.equal(post.title, 'Best Water Filter for Lead Removal (2026)');
  const html = renderToStaticMarkup(createElement('div', null, post.content));
  assert.match(html, /BEST LEAD REMOVAL WATER FILTER FOR HOME/);
  assert.match(html, /<table/);
  assert.match(html, /NSF\/ANSI 53/);
  assert.match(html, /Waterdrop G3P600/);
  assert.match(html, /anbyjkqb/);
  assert.match(html, /watercheckup-20/);
  assert.ok(post.faq?.some((item) => /lead and PFAS/i.test(item.q)));
});

test('hard-water guide uses filter phrases and distinguishes softeners', () => {
  const source = readFileSync(join(process.cwd(), 'app/blog/best-water-filter-hard-water/page.tsx'), 'utf8');
  assert.match(source, /hard water filter/i);
  assert.match(source, /water filter for hard water/i);
  assert.match(source, /hardness water filter/i);
  assert.match(source, /fridge filter/i);
  assert.match(source, /not the same product as a/);
});

test('rankings lists cities with descriptive tap-water-report anchors', () => {
  const source = readFileSync(join(process.cwd(), 'app/rankings/page.tsx'), 'utf8');
  assert.match(source, /tap water quality report/);
  assert.match(source, /Best Tap Water by City 2026: Rankings/);
  assert.match(source, /href="\/worst-cities"/);
  assert.match(source, /href="\/best-cities"/);
  const demand = readFileSync(join(process.cwd(), 'components/SearchDemandCities.tsx'), 'utf8');
  assert.match(demand, /tap water quality report/);
});

test('author page uses the published headshot and TikTok sameAs', () => {
  const source = readFileSync(join(process.cwd(), 'app/about/joe-letorney/page.tsx'), 'utf8');
  assert.match(source, /joe-letorney\.jpeg/);
  assert.match(source, /joethewaterpro/);
  assert.match(source, /30-year water treatment expert/);
  assert.match(source, /former WQA/i);
});
