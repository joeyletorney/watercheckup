import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CTR_SERP_OVERRIDES } from '../lib/ctr-serp-seo';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { COMMERCIAL_GUIDES } from '../app/blog/commercial-guide-data';

const root = process.cwd();

function source(rel: string) {
  return readFileSync(join(root, rel), 'utf8');
}

test('Gaithersburg, San Antonio, and lead SERP copy stay within limits and match GSC wording', () => {
  const gaithersburg = CTR_SERP_OVERRIDES['/water/gaithersburg'];
  assert.equal(gaithersburg.title, 'Gaithersburg Water Testing: City vs Well Water (2026)');
  assert.ok(gaithersburg.title.length <= SERP_TITLE_MAX);
  assert.ok(gaithersburg.description.length <= SERP_DESCRIPTION_MAX);
  assert.match(gaithersburg.description, /Gaithersburg well water testing/);
  assert.match(gaithersburg.description, /water testing Gaithersburg MD/i);
  assert.match(gaithersburg.description, /Gaithersburg water quality/);
  assert.match(gaithersburg.description, /ZIP report/);
  assert.match(gaithersburg.description, /Maryland-certified labs/);

  const sanAntonio = CTR_SERP_OVERRIDES['/water/san-antonio'];
  assert.ok(sanAntonio.title.length <= SERP_TITLE_MAX);
  assert.ok(sanAntonio.description.length <= SERP_DESCRIPTION_MAX);
  assert.match(sanAntonio.description, /San Antonio water quality/);
  assert.match(sanAntonio.description, /contamination/);
  assert.match(sanAntonio.description, /3 PFAS compounds/);
  assert.match(sanAntonio.description, /272 mg\/L/);

  const lead = CTR_SERP_OVERRIDES['/blog/best-water-filter-for-lead-removal'];
  assert.equal(lead.title, COMMERCIAL_GUIDES['best-water-filter-for-lead-removal'].title);
  assert.ok(lead.title.length <= SERP_TITLE_MAX, lead.title);
  assert.ok(lead.description.length <= SERP_DESCRIPTION_MAX);
  assert.match(lead.title, /Top-Rated/);
  assert.match(lead.title, /NSF 53/);
  assert.match(lead.title, /Affordable/);
});

test('Gaithersburg and San Antonio city pages put a ZIP box and next step near the top', () => {
  const city = source('app/water/[city]/page.tsx');
  assert.match(city, /idPrefix="wc-gaithersburg"/);
  assert.match(city, /Get your Gaithersburg ZIP report or matching filter/);
  assert.ok(city.indexOf('idPrefix="wc-gaithersburg"') < city.indexOf('headingId="wc-city-next-mid"'));

  const sa = source('app/water/san-antonio/page.tsx');
  assert.match(sa, /idPrefix="wc-san-antonio"/);
  assert.match(sa, /href="\/blog\/pfas-in-san-antonio-water"/);
  assert.match(sa, /href="\/blog\/best-water-filter-hard-water"/);
  assert.match(sa, /hardness\/PFAS filter/);
  assert.match(sa, /272 mg\/L/);
  assert.match(sa, /3 PFAS compounds/);
  assert.ok(sa.indexOf('idPrefix="wc-san-antonio"') < sa.indexOf('headingId="wc-san-antonio-next-mid"'));
});

test('worst-states and worst-cities retitle around worst drinking water and include a ZIP box', () => {
  const states = source('app/worst-states/page.tsx');
  assert.match(states, /Worst Drinking Water by State \(2026\)/);
  assert.match(states, /If your state is on this list, check your ZIP code and see the filter that matches/);
  assert.match(states, /idPrefix="wc-worst-states"/);

  const cities = source('app/worst-cities/page.tsx');
  assert.match(cities, /Worst Drinking Water by City \(2026\)/);
  assert.match(cities, /If your city is on this list, check your ZIP code and see the filter that matches/);
  assert.match(cities, /idPrefix="wc-worst-cities"/);
});

test('homepage popular guides and ZIP-report matching pick stay wired', () => {
  const home = source('app/HomeLanding.tsx');
  assert.match(home, /id="wc-home-popular-heading">Popular guides</);
  for (const href of [
    '/water/gaithersburg',
    '/water/san-antonio',
    '/blog/best-water-filter-for-lead-removal',
    '/worst-states',
    '/worst-cities',
  ]) {
    assert.match(home, new RegExp(`href="${href}"`));
  }

  const results = source('app/results/[zip]/ResultsClient.tsx');
  assert.match(results, /YOUR MATCHING FILTER PICK/);
  assert.match(results, /ZipMatchingPick/);
  assert.ok(results.indexOf('ZipMatchingPick') < results.indexOf("tab === 'report'"));
  assert.match(results, /tag=watercheckup-20/);
  assert.match(results, /ref=anbyjkqb/);
});

test('water hub and Maryland state page link Gaithersburg testing', () => {
  const water = source('app/water/page.jsx');
  assert.match(water, /href="\/water\/gaithersburg"/);
  assert.match(water, /Gaithersburg well vs city water testing/);

  const md = source('lib/related-cities.ts');
  assert.match(md, /slug: 'gaithersburg'/);
  const state = source('app/water/state/[city]/page.tsx');
  assert.match(state, /Featured \{stateName\} reports/);
  assert.match(state, /featuredCitiesForState/);
});
