import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { CITIES } from '../app/water/[city]/cities-data';
import sitemap from '../app/sitemap';
import {
  CITY_FILTER_HUB_PATH,
  cityFilterPagePath,
  cityHasMeasuredFilterData,
  filterPageSafeSummary,
  getCityFilterPage,
  hasCityFilterPage,
  listCityFilterPageSlugs,
  MAX_CITY_FILTER_PAGES,
} from '../lib/city-filter-pages';
import { isMeasuredContaminant } from '../lib/city-filter-picks';
import { AMAZON_ASSOCIATE_TAG } from '../lib/amazon-affiliate';
import { WATERDROP_REF } from '../lib/waterdrop-buy';
import { CITY_FILTER_PAGE_LASTMOD, STATIC_PATH_LASTMOD } from '../lib/sitemap-dates';
import { SERP_DESCRIPTION_MAX, SERP_TITLE_MAX } from '../lib/serp-copy';
import { FOOTER_COLUMNS } from '../lib/footer-links';
import { PRIORITY_GUIDE_LINKS } from '../lib/internal-hub-links';
import { breadcrumbListJsonLd } from '../lib/breadcrumb-schema';

const root = join(process.cwd());

test('filter pages are only generated for cities with measured contaminant data', () => {
  const slugs = listCityFilterPageSlugs();
  assert.ok(slugs.length >= 80, `expected a substantial city set, got ${slugs.length}`);
  assert.ok(slugs.length <= MAX_CITY_FILTER_PAGES);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const slug of slugs) {
    assert.ok(CITIES[slug], slug);
    assert.equal(cityHasMeasuredFilterData(slug), true, slug);
    const page = getCityFilterPage(slug);
    assert.ok(page, slug);
    assert.ok(page.rows.some(isMeasuredContaminant), slug);
    assert.ok(page.picks.length >= 2, `${slug} should have at least two catalog picks`);
    assert.ok(page.h1.includes(page.displayName));
    assert.ok(page.title.length <= SERP_TITLE_MAX, `${slug} title ${page.title.length}: ${page.title}`);
    assert.ok(page.description.length <= SERP_DESCRIPTION_MAX, slug);
  }

  for (const slug of Object.keys(CITIES)) {
    if (!slugs.includes(slug)) {
      assert.equal(cityHasMeasuredFilterData(slug), false, slug);
      assert.equal(getCityFilterPage(slug), null);
    }
  }
});

test('filter picks use existing catalog destinations with Amazon tag or Waterdrop ref', () => {
  const slugs = listCityFilterPageSlugs();
  for (const slug of slugs) {
    const page = getCityFilterPage(slug)!;
    for (const pick of page.picks) {
      const url = new URL(pick.href);
      assert.equal(url.protocol, 'https:');
      if (pick.brand === 'Waterdrop') {
        assert.equal(url.searchParams.get('ref'), WATERDROP_REF);
      }
      if (pick.destination === 'amazon') {
        assert.equal(url.searchParams.get('tag'), AMAZON_ASSOCIATE_TAG);
      }
    }
  }
});

test('Chicago lead and Houston PFAS drive NSF 53 / 58 recommendations from real data', () => {
  const chicago = getCityFilterPage('chicago');
  assert.ok(chicago);
  assert.equal(hasCityFilterPage('chicago'), true);
  assert.equal(chicago.hasLeadSection, true);
  assert.ok(chicago.certs.some((c) => c.code === 'NSF/ANSI 53'));
  assert.ok(chicago.leadFacts.some((fact) => /400,000 lead service lines/i.test(fact)));
  assert.match(chicago.h1, /Chicago/);
  const chicagoSummary = filterPageSafeSummary(chicago);
  assert.doesNotMatch(chicagoSummary, /\(0\/88\)/);
  if (chicago.grade === '—') {
    assert.match(chicagoSummary, /incomplete|does not assign a 0–88 grade/i);
  }

  const houston = getCityFilterPage('houston');
  assert.ok(houston);
  assert.equal(houston.hasPfasSection, true);
  assert.ok(houston.certs.some((c) => c.code === 'NSF/ANSI 58'));
  if (houston.pfas && houston.pfas.compounds.length) {
    const [name, level] = houston.pfas.compounds[0]!;
    assert.ok(level > 0);
    assert.ok(houston.faqs.some((faq) => faq.answer.includes(String(houston.pfas!.compounds.length))));
    assert.ok(name.length > 1);
  }

  const la = getCityFilterPage('los-angeles');
  assert.ok(la);
  assert.ok(
    la.rows.some((row) => /chromium/i.test(row.name) && isMeasuredContaminant(row)) ||
      la.issues.some((issue) => /chromium/i.test(issue)),
  );
  assert.ok(la.certs.some((c) => c.code === 'NSF/ANSI 58'));
});

test('sitemap lists the hub and every indexable filter URL with a real lastmod', () => {
  const map = sitemap();
  const hub = map.find((row) => row.url === 'https://watercheckup.com/best-water-filter');
  assert.equal(String(hub?.lastModified ?? ''), STATIC_PATH_LASTMOD['/best-water-filter']);
  assert.equal(STATIC_PATH_LASTMOD['/best-water-filter'], CITY_FILTER_PAGE_LASTMOD);

  const slugs = listCityFilterPageSlugs();
  const filterUrls = map.filter((row) => row.url.includes('/best-water-filter/'));
  assert.equal(filterUrls.length, slugs.length);
  for (const slug of ['chicago', 'houston', 'gaithersburg', 'phoenix']) {
    if (!hasCityFilterPage(slug)) continue;
    const row = map.find((entry) => entry.url === `https://watercheckup.com${cityFilterPagePath(slug)}`);
    assert.ok(row, slug);
    assert.equal(String(row?.lastModified ?? ''), CITY_FILTER_PAGE_LASTMOD);
  }
  assert.equal(map.some((row) => /\/water\/[^/]+\/is-it-safe/.test(row.url)), false);
});

test('filter-page breadcrumbs keep named items; city and state hubs link in', () => {
  const ld = breadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Best water filters', path: CITY_FILTER_HUB_PATH },
    { name: 'Best Water Filter for Chicago, IL', path: '/best-water-filter/chicago' },
  ]);
  assert.equal(ld.itemListElement.length, 3);
  for (const item of ld.itemListElement) {
    assert.ok(item.name.trim().length > 0);
    assert.equal(item.item['@type'], 'WebPage');
    assert.ok(item.item.name.trim().length > 0);
  }

  const cityPage = readFileSync(join(root, 'app/water/[city]/page.tsx'), 'utf8');
  assert.match(cityPage, /CityFilterGuideLinks slug=\{slug\} name=\{cd\.name\}/);

  const statePage = readFileSync(join(root, 'app/water/state/[city]/page.tsx'), 'utf8');
  assert.match(statePage, /cityFilterPagePath/);
  assert.match(statePage, /Best water filter for \{city\.name\}/);

  const footerHrefs = FOOTER_COLUMNS.flatMap((col) => col.links.map((l) => l.href));
  assert.ok(footerHrefs.includes('/best-water-filter'));
  assert.ok(PRIORITY_GUIDE_LINKS.some((link) => link.href === '/best-water-filter'));

  const waterHub = readFileSync(join(root, 'app/water/page.jsx'), 'utf8');
  assert.match(waterHub, /href="\/best-water-filter"/);
});

test('unknown or data-less slugs do not mint a filter page', () => {
  assert.equal(getCityFilterPage('not-a-city'), null);
  assert.equal(hasCityFilterPage('not-a-city'), false);
  assert.equal(cityFilterPagePath('chicago'), '/best-water-filter/chicago');
});
