import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CITIES } from '../app/water/[city]/cities-data';
import { buildCityPageMetadata } from '../lib/city-seo-metadata';
import { getCityPfasData } from '../lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '../lib/city-pwsid';
import {
  buildCityPageH1,
  buildCitySeoTitle,
  buildStateSeoDescription,
  buildStateSeoTitle,
  citySeoDisplayName,
  clipMeta,
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  RANKINGS_SEO_DESCRIPTION,
  RANKINGS_SEO_TITLE,
  SERP_DESCRIPTION_MAX,
  SERP_TITLE_MAX,
  withoutBrandSuffix,
} from '../lib/serp-copy';

function cityMeta(slug: string) {
  const city = CITIES[slug];
  assert.ok(city, slug);
  const pfas = getCityPfasData(resolveCityPwsid(slug, city.pwsid, city.zip));
  return buildCityPageMetadata(slug, city, pfas);
}

test('city titles match “is tap water safe” intent and stay near 60 characters', () => {
  const fairfaxName = citySeoDisplayName('fairfax-county', CITIES['fairfax-county'].name);
  assert.equal(fairfaxName, 'Fairfax County');
  assert.equal(
    buildCitySeoTitle(fairfaxName),
    'Is Fairfax County Tap Water Safe? 2026 Report and Filter Picks',
  );
  assert.ok(buildCitySeoTitle(fairfaxName).length <= SERP_TITLE_MAX);

  const long = buildCitySeoTitle('Winston-Salem');
  assert.match(long, /^Is Winston-Salem Tap Water Safe\?/);
  assert.ok(long.length <= SERP_TITLE_MAX);

  assert.equal(buildCityPageH1(fairfaxName), 'Is Fairfax County Tap Water Safe?');
  assert.doesNotMatch(buildCitySeoTitle('Houston'), /WaterCheckup/);
});

test('Fairfax, rankings, homepage, and Virginia SERP copy match search intent', () => {
  const fairfax = cityMeta('fairfax-county');
  assert.equal(fairfax.title, 'Is Fairfax County Tap Water Safe? 2026 Report and Filter Picks');
  assert.match(String(fairfax.description), /Fairfax County Water Authority/i);
  assert.match(String(fairfax.description), /PFOA|PFOS|PFAS/i);
  assert.match(String(fairfax.description), /filter/i);
  assert.match(String(fairfax.description), /not a test of your tap/i);
  assert.ok(String(fairfax.description).length <= SERP_DESCRIPTION_MAX);
  assert.equal(fairfax.openGraph?.title, fairfax.title);
  assert.equal(fairfax.openGraph?.description, fairfax.description);

  assert.equal(RANKINGS_SEO_TITLE, 'Worst Tap Water in America: 2026 City Rankings');
  assert.ok(RANKINGS_SEO_TITLE.length <= SERP_TITLE_MAX);
  assert.match(RANKINGS_SEO_DESCRIPTION, /worst tap water in America/i);
  assert.ok(RANKINGS_SEO_DESCRIPTION.length <= SERP_DESCRIPTION_MAX);

  assert.equal(HOME_SEO_TITLE, 'Is My Tap Water Safe? Free Water Quality by ZIP');
  assert.ok(HOME_SEO_TITLE.length <= SERP_TITLE_MAX);
  assert.match(HOME_SEO_DESCRIPTION, /no signup/i);
  assert.match(HOME_SEO_DESCRIPTION, /PFAS/i);
  assert.match(HOME_SEO_DESCRIPTION, /lead/i);
  assert.match(HOME_SEO_DESCRIPTION, /filter/i);
  assert.ok(HOME_SEO_DESCRIPTION.length <= SERP_DESCRIPTION_MAX);

  const virginia = buildStateSeoTitle('Virginia');
  assert.equal(virginia, 'Virginia Tap Water Quality 2026: PFAS, Lead and City Reports');
  assert.ok(virginia.length <= SERP_TITLE_MAX);
  const vaDesc = buildStateSeoDescription({
    stateName: 'Virginia',
    cityCount: 8,
    atRiskCount: 3,
    topAnalyte: { name: 'PFOA', cityCount: 4 },
  });
  assert.match(vaDesc, /Virginia tap water/i);
  assert.match(vaDesc, /filter/i);
  assert.match(vaDesc, /not a household tap test/i);
  assert.ok(vaDesc.length <= SERP_DESCRIPTION_MAX);
});

test('city descriptions use real supplier data and handle missing PFAS coverage', () => {
  const nyc = cityMeta('new-york');
  assert.match(String(nyc.title), /Is New York City Tap Water Safe\?/);
  assert.match(String(nyc.description), /PFAS snapshot unavailable/i);
  assert.match(String(nyc.description), /not a test of your tap/i);
  assert.doesNotMatch(String(nyc.description), /\d+(\.\d+)?\s*ppt/i);

  const gaithersburg = cityMeta('gaithersburg');
  assert.match(String(gaithersburg.title), /Is Gaithersburg Tap Water Safe\?/);
  assert.match(String(gaithersburg.description), /WSSC/i);
  assert.match(String(gaithersburg.description), /filter/i);

  for (const slug of ['indianapolis', 'stamford', 'tacoma', 'louisville']) {
    const meta = cityMeta(slug);
    const title = String(meta.title);
    const description = String(meta.description);
    assert.match(title, /^Is .+ Tap Water Safe\?/);
    assert.ok(title.length <= SERP_TITLE_MAX, `${slug} title length ${title.length}: ${title}`);
    assert.ok(description.length <= SERP_DESCRIPTION_MAX, `${slug} desc length ${description.length}`);
    assert.match(description, /filter/i);
    assert.doesNotMatch(title, /WaterCheckup/);
  }
});

test('clipMeta and brand stripping keep SERP suffixes from doubling', () => {
  assert.equal(withoutBrandSuffix('Is Houston Tap Water Safe? 2026 Report | WaterCheckup'), 'Is Houston Tap Water Safe? 2026 Report');
  assert.equal(clipMeta('short', 155), 'short');
  const clipped = clipMeta('A'.repeat(200), 155);
  assert.ok(clipped.length <= 155);
  assert.match(clipped, /…$/);
});
