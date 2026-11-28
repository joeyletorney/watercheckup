import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import sitemap from '../app/sitemap';
import { FOOTER_COLUMNS } from '../lib/footer-links';
import { latestBlogLinks } from '../lib/blog-hub-links';
import { breadcrumbListJsonLd } from '../lib/breadcrumb-schema';
import {
  legacyWaterRedirectPath,
  resolveLegacyCountyPath,
  resolveLegacyStateAbbrPath,
  waterStateAbbrRedirects,
} from '../lib/legacy-water-redirects';
import { CITIES } from '../app/water/[city]/cities-data';
import { STATIC_PATH_LASTMOD } from '../lib/sitemap-dates';
import { shouldIndexUtility, shouldIndexUtilityDirectoryPage } from '../lib/utility-indexability';
import nextConfig from '../next.config';
import { loadUtilitiesPayload } from '../lib/utilities-data';

const root = join(process.cwd());

test('utility noindex rule keeps municipal community systems and drops thin TNCWS-like pages', () => {
  assert.equal(shouldIndexUtilityDirectoryPage(1), true);
  assert.equal(shouldIndexUtilityDirectoryPage(2), false);
  assert.equal(shouldIndexUtilityDirectoryPage(1, 'shell'), false);
  assert.equal(shouldIndexUtility({ name: 'AUSTIN WATER', populationServed: 1000000, pwsType: 'CWS' }), true);
  assert.equal(shouldIndexUtility({ name: 'AUSTIN WATER', populationServed: 1000000, pwsType: 'NTNCWS' }), false);
});

test('catalog counts: most SDWIS rows are noindex; real community systems stay indexable', () => {
  const { utilities } = loadUtilitiesPayload();
  let indexable = 0;
  for (const u of utilities) {
    if (shouldIndexUtility(u)) indexable += 1;
  }
  const noindex = utilities.length - indexable;
  assert.equal(utilities.length, 432803);
  assert.equal(indexable, 40412);
  assert.equal(noindex, 392391);
});

test('legacy /water/ca and /water/county/... resolve to live city or state pages', () => {
  assert.equal(resolveLegacyStateAbbrPath('ca'), '/water/state/california');
  assert.equal(resolveLegacyStateAbbrPath('MD'), '/water/state/maryland');
  assert.equal(resolveLegacyStateAbbrPath('dc'), '/water/state/washington-dc');
  assert.equal(resolveLegacyStateAbbrPath('honolulu'), null);
  assert.equal(legacyWaterRedirectPath('/water/ca'), '/water/state/california');
  assert.equal(legacyWaterRedirectPath('/water/CA/'), '/water/state/california');
  assert.equal(resolveLegacyCountyPath('maryland', 'baltimore-city'), '/water/baltimore');
  assert.equal(resolveLegacyCountyPath('MD', 'baltimore-city'), '/water/baltimore');
  assert.equal(resolveLegacyCountyPath('virginia', 'fairfax-county'), '/water/fairfax-county');
  assert.equal(resolveLegacyCountyPath('maryland', 'no-such-county'), '/water/state/maryland');
  assert.equal(legacyWaterRedirectPath('/water/county/maryland/baltimore-city'), '/water/baltimore');

  const abbrs = waterStateAbbrRedirects();
  assert.equal(abbrs.length, 51);
  assert.ok(abbrs.every((row) => !CITIES[row.source.slice('/water/'.length)]));
});

test('www apex and state-abbr redirects in next.config are permanent', async () => {
  const redirects = await nextConfig.redirects!();
  assert.ok(redirects.some((rule) =>
    Array.isArray(rule.has) &&
    rule.has.some((h) => h.value === 'www.watercheckup.com') &&
    rule.permanent === true
  ));
  const ca = redirects.find((rule) => rule.source === '/water/ca');
  assert.equal(ca?.destination, '/water/state/california');
  assert.equal(ca?.permanent, true);
});

test('BreadcrumbList items always have a non-empty name on the ListItem and nested item', () => {
  const ld = breadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: '  ', path: '/blank' },
    { name: 'Honolulu Water Quality', path: '/water/honolulu' },
  ]);
  assert.equal(ld['@type'], 'BreadcrumbList');
  assert.equal(ld.itemListElement.length, 2);
  for (const item of ld.itemListElement) {
    assert.ok(item.name && item.name.trim().length > 0);
    assert.equal(item.item['@type'], 'WebPage');
    assert.ok(item.item.name && item.item.name.trim().length > 0);
    assert.match(item.item['@id'], /^https:\/\/watercheckup\.com/);
  }

  const cityPage = readFileSync(join(root, 'app/water/[city]/page.tsx'), 'utf8');
  const blogPage = readFileSync(join(root, 'app/blog/[slug]/page.tsx'), 'utf8');
  assert.match(cityPage, /breadcrumbListJsonLd/);
  assert.match(blogPage, /breadcrumbListJsonLd/);
  assert.doesNotMatch(cityPage, /item: 'https:\/\/watercheckup\.com'/);
});

test('sitemap lastmod is a real content date, not Date.now, and omits bulk utility URLs', () => {
  const map = sitemap();
  const home = map.find((row) => row.url === 'https://watercheckup.com');
  const honolulu = map.find((row) => row.url.endsWith('/water/honolulu'));
  const lead = map.find((row) => row.url.endsWith('/lead'));
  const joe = map.find((row) => row.url.endsWith('/about/joe-letorney'));
  const alerts = map.find((row) => row.url.endsWith('/blog/drinking-water-alerts-november-2026'));
  assert.equal(String(home?.lastModified ?? ''), STATIC_PATH_LASTMOD['']);
  assert.equal(String(honolulu?.lastModified ?? ''), '2026-11-28');
  assert.equal(String(lead?.lastModified ?? ''), STATIC_PATH_LASTMOD['/lead']);
  assert.equal(String(joe?.lastModified ?? ''), STATIC_PATH_LASTMOD['/about/joe-letorney']);
  assert.equal(String(alerts?.lastModified ?? ''), '2026-11-21');
  assert.ok(map.every((row) => row.lastModified), 'every sitemap URL needs lastmod');

  const sitemapSource = readFileSync(join(root, 'app/sitemap.ts'), 'utf8');
  assert.doesNotMatch(sitemapSource, /new Date\(\)/);

  const utilityUrls = map.filter((row) => row.url.includes('/utilities')).map((row) => row.url);
  assert.deepEqual(
    utilityUrls.sort(),
    [
      'https://watercheckup.com/utilities/md/annapolis',
      'https://watercheckup.com/utilities/md/maryland-city-anne-arundel-co',
      'https://watercheckup.com/utilities/md/town-of-chestertown',
    ].sort(),
  );
  assert.equal(map.some((row) => row.url.includes('/results/')), false);
});

test('crawl hubs link to unindexed money pages, Joe, latest posts, Honolulu, and Maryland', () => {
  const latest = latestBlogLinks(4);
  assert.ok(latest.some((p) => p.slug === 'drinking-water-alerts-november-2026'));
  assert.ok(latest.some((p) => p.slug === 'best-shower-filter-2026'));

  const home = readFileSync(join(root, 'app/HomeLanding.tsx'), 'utf8');
  assert.match(home, /href="\/lead"/);
  assert.match(home, /href="\/pfas"/);
  assert.match(home, /href="\/faq"/);
  assert.match(home, /href="\/about\/joe-letorney"/);
  assert.match(home, /href="\/water\/honolulu"/);
  assert.match(home, /latestBlogLinks/);
  assert.match(home, /<h1 id="wc-home-heading">Is Your Tap Water Safe\?<\/h1>/);

  const footerHrefs = FOOTER_COLUMNS.flatMap((col) => col.links.map((l) => l.href));
  assert.ok(footerHrefs.includes('/lead'));
  assert.ok(footerHrefs.includes('/pfas'));
  assert.ok(footerHrefs.includes('/faq'));
  assert.ok(footerHrefs.includes('/about/joe-letorney'));
  assert.ok(footerHrefs.includes('/water/honolulu'));
  assert.ok(footerHrefs.includes('/water/state/maryland'));
  assert.ok(footerHrefs.includes('/blog/drinking-water-alerts-november-2026'));

  const waterHub = readFileSync(join(root, 'app/water/page.jsx'), 'utf8');
  const rankings = readFileSync(join(root, 'app/rankings/page.tsx'), 'utf8');
  assert.match(waterHub, /PriorityDiscoveryLinks/);
  assert.match(rankings, /PriorityDiscoveryLinks/);

  const resultsPage = readFileSync(join(root, 'app/results/[zip]/page.tsx'), 'utf8');
  assert.match(resultsPage, /robots: \{ index: false, follow: true \}/);

  const proxy = readFileSync(join(root, 'proxy.ts'), 'utf8');
  assert.match(proxy, /NextResponse\.redirect\(apexRedirectUrl\(request\.url\), 308\)/);
  assert.match(proxy, /legacyWaterRedirectPath/);
});
