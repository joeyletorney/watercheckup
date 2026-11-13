import test from 'node:test';
import assert from 'node:assert/strict';
import { quizHrefFromReport, quizHrefFromCityPage } from '../lib/results-quiz-link';
import { quizEntryContext } from '../lib/quiz-entry';
import { guideQuizHref, GUIDE_STARTING_POINTS } from '../lib/guide-journey';
import { resolveReportCityLink } from '../lib/report-city-link.server';
import { trackWebVital } from '../lib/web-vitals-tracking';

test('report and city handoffs preserve context without diagnosing the tap or assuming installation needs', () => {
  for (const href of [quizHrefFromReport({ zip: '02108', pfasAboveMcl: 2, pfasCount: 3, situation: 'owner_full' }), quizHrefFromCityPage({ zip: '02108', hasPfas: true, urgency: 'high' })]) {
    const url = new URL(href, 'https://watercheckup.com');
    assert.equal(url.pathname, '/quiz');
    assert.equal(url.searchParams.get('zip'), '02108');
    assert.ok(url.searchParams.get('from'));
    for (const name of ['source', 'concern', 'situation']) assert.equal(url.searchParams.has(name), false);
  }
});

test('guide quiz handoffs retain allowlisted origin context and reject arbitrary query content', () => {
  for (const slug of Object.keys(GUIDE_STARTING_POINTS)) {
    const params = new URL(guideQuizHref(slug), 'https://watercheckup.com').searchParams;
    assert.deepEqual(quizEntryContext(params), { entry_point: 'buying-guide', origin_guide: slug });
    assert.equal(params.has('source'), false);
    assert.equal(GUIDE_STARTING_POINTS[slug].length, 3);
  }
  assert.deepEqual(quizEntryContext(new URLSearchParams('from=private@example.com&guide=private@example.com')), { entry_point: 'direct', origin_guide: '' });
  assert.deepEqual(quizEntryContext(new URLSearchParams('from=buying-guide&guide=private@example.com')), { entry_point: 'buying-guide', origin_guide: '' });
});

test('city report links resolve only to curated supplier matches, never a slug guessed from a postal label', () => {
  const ny = resolveReportCityLink({ pwsid: 'NY7003493', zip: '10001', city: 'NEW YORK' });
  assert.equal(ny?.href, '/water/new-york');
  assert.equal(ny?.supplierId, 'NY7003493');
  assert.equal(resolveReportCityLink({ pwsid: 'UNKNOWN', zip: '00000', city: 'PO BOX 1562' }), undefined);
  const la = resolveReportCityLink({ pwsid: 'CA1910067', zip: '90012', city: 'LOS ANGELES' });
  assert.notEqual(la?.href, '/water/los-angeles', 'do not cross into the legacy Los Angeles page anchored to a different supplier');
});

test('performance telemetry keeps metric units and the document entry path without query data', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const calls: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin: 'https://watercheckup.com' }, gtag: (...args: unknown[]) => calls.push(args) } });
    trackWebVital({ name: 'CLS', value: 0.01234, rating: 'good', id: 'metric-test', navigationType: 'navigate' }, '/quiz?email=private-test#answer');
    trackWebVital({ name: 'LCP', value: 1600.4, rating: 'good', id: 'metric-test-2', navigationType: 'navigate' }, '/');
    assert.equal(calls.length, 2);
    const first = calls[0][2] as Record<string, unknown>;
    assert.equal(calls[0][1], 'web_vital');
    assert.equal(first.metric_value, 0.0123);
    assert.equal(first.metric_unit, 'score');
    assert.equal(first.page_location, 'https://watercheckup.com/quiz');
    assert.equal(first.metric_scope, 'document');
    assert.equal((calls[1][2] as Record<string, unknown>).metric_value, 1600);
    assert.equal(JSON.stringify(calls).includes('private-test'), false);
    trackWebVital({ name: 'INP', value: NaN, rating: 'poor', id: 'bad', navigationType: 'navigate' }, '/');
    assert.equal(calls.length, 2);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
