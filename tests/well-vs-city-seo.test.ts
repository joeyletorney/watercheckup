import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { relatedCitySlugsFor, featuredCitiesForState } from '../lib/related-cities';
import { buildWellVsCityTestingGuide } from '../lib/well-vs-city-testing';
import { PLACE_TESTING_GUIDES } from '../lib/place-water-testing';
import { gaithersburgFAQs } from '../lib/faq-gaithersburg';
import { FAQ_SECTIONS } from '../lib/faq-content';
import {
  MONTGOMERY_DPS_WELL_SEPTIC_URL,
  MDE_CERTIFIED_LABS_PAGE_URL,
} from '../lib/city-water-testing';

const root = process.cwd();

test('related city slugs put Parkersburg next to Ohio River metros', () => {
  assert.deepEqual([...relatedCitySlugsFor('parkersburg')], ['pittsburgh', 'columbus', 'cincinnati']);
  assert.ok(relatedCitySlugsFor('pittsburgh').includes('parkersburg'));
  assert.ok(relatedCitySlugsFor('columbus').includes('parkersburg'));
  assert.ok(relatedCitySlugsFor('cincinnati').includes('parkersburg'));
  assert.ok(featuredCitiesForState('WV').some((c) => c.slug === 'parkersburg'));
  assert.ok(featuredCitiesForState('MD').some((c) => c.slug === 'gaithersburg'));
});

test('generic well vs city testing guide uses EPA facts and on-site links', () => {
  const guide = buildWellVsCityTestingGuide('Parkersburg', 'WV');
  assert.match(guide.title, /Well water vs city water testing in Parkersburg/);
  assert.match(guide.intro, /Safe Drinking Water Act/);
  assert.match(guide.sections[0]!.body, /private well/i);
  assert.match(guide.sections[1]!.body, /coliform|nitrate/i);
  assert.match(guide.sections[2]!.body, /certified/i);
  assert.ok(guide.links.some((l) => l.href === '/well'));
  assert.ok(guide.links.some((l) => l.href === '/lead'));
  assert.ok(guide.links.some((l) => l.href === '/pfas'));
  assert.doesNotMatch(JSON.stringify(guide), /\d{2,}% of (homes|wells)/);
});

test('Gaithersburg testing guide covers well vs city, MDE, and Montgomery County DPS', () => {
  const guide = PLACE_TESTING_GUIDES.gaithersburg;
  assert.match(guide.title, /Well water vs city water testing in Gaithersburg/);
  const headings = guide.sections.map((s) => s.heading).join('\n');
  assert.match(headings, /Who needs to test/);
  assert.match(headings, /City water testing in Gaithersburg/);
  assert.match(headings, /Gaithersburg well water testing/);
  assert.match(headings, /Maryland Department of the Environment/);
  const blob = JSON.stringify(guide);
  assert.match(blob, /240-777-0311/);
  assert.match(blob, /Certificate of Potability/);
  assert.ok(guide.links.some((l) => l.href === MDE_CERTIFIED_LABS_PAGE_URL));
  assert.ok(guide.links.some((l) => l.href === MONTGOMERY_DPS_WELL_SEPTIC_URL));
  assert.ok(guide.links.some((l) => l.href === '/well'));
  assert.ok(guide.links.some((l) => l.href === '/lead'));
  assert.ok(guide.links.some((l) => l.href === '/water/state/maryland'));
  const municipal = gaithersburgFAQs.find((f) => /municipal water testing in Gaithersburg/i.test(f.question));
  assert.ok(municipal);
  assert.match(municipal!.answer, /WSSC/);
});

test('state hubs, guides, and Parkersburg page add the GSC internal links', () => {
  const stateHub = readFileSync(join(root, 'app/water/state/[city]/page.tsx'), 'utf8');
  assert.match(stateHub, /href="\/rankings"/);
  assert.match(stateHub, /href="\/worst-cities"/);
  assert.match(stateHub, /featuredCitiesForState/);

  const cityPage = readFileSync(join(root, 'app/water/[city]/page.tsx'), 'utf8');
  assert.match(cityPage, /WellVsCityTesting/);
  assert.match(cityPage, /\/water\/state\/west-virginia/);
  assert.match(cityPage, /\/water\/pittsburgh/);

  const lead = readFileSync(join(root, 'app/lead/page.tsx'), 'utf8');
  assert.match(lead, /href: '\/water\/gaithersburg'/);
  assert.match(lead, /href: '\/rankings'/);
  assert.match(lead, /href: '\/worst-cities'/);

  const pfas = readFileSync(join(root, 'app/pfas/page.tsx'), 'utf8');
  assert.match(pfas, /href: '\/water\/parkersburg'/);
  assert.match(pfas, /href: '\/rankings'/);
  assert.match(pfas, /href: '\/worst-cities'/);

  const faq = FAQ_SECTIONS.flatMap((s) => s.items);
  assert.ok(faq.some((item) => item.links?.some((l) => l.href === '/rankings')));
  assert.ok(faq.some((item) => item.links?.some((l) => l.href === '/worst-cities')));
  assert.ok(faq.some((item) => item.links?.some((l) => l.href === '/water/gaithersburg')));
  assert.ok(faq.some((item) => item.links?.some((l) => l.href === '/water/parkersburg')));
});
