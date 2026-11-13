import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodePfasMonitoring, getPfasCoverageNotice } from '../lib/pfas-monitoring';
import { getCityPfasData } from '../lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '../lib/city-pwsid';
import { computeWaterScore } from '../lib/city-water-score';
import { getUcmrHardnessMgL } from '../lib/water-hardness';
import { nationalPercentileFromSafetyScore } from '../lib/zip-water-score';
import { lookupWaterReport } from '../lib/server-water-report';
import { CITIES } from '../app/water/[city]/cities-data';
import { buildCitiesWithPfasMclViolations } from '../lib/city-rankings';
import robots from '../app/robots';
import config from '../next.config';
import sitemap from '../app/sitemap';
import { computeZipWaterScore, findCityByResolvedPwsid } from '../lib/zip-water-score';
import { buildWorstStatesRankings } from '../lib/worst-states-rankings';

test('a regulated detection below its own benchmark is not an exceedance', () => {
  const value = decodePfasMonitoring([5.1, 0, [['PFHxS', 5.1, 1, 0]]])!;
  assert.deepEqual(value.compounds, [['PFHxS', 5.1, 1, 0]]);
  assert.equal(value.violations, 0);
  assert.equal(buildCitiesWithPfasMclViolations(1000).some(row => row.slug === 'tacoma'), false);
});

test('decode uses compound-specific concentrations, not stale flags or a total-PFAS threshold', () => {
  const value = decodePfasMonitoring([672, 3, [['6:2 FTS', 672, 1, 1], ['PFOA', 4.1, 0, 0], ['PFHxS', 4.2, 1, 1]]])!;
  assert.equal(value.maxPpt, 672);
  assert.equal(value.violations, 1);
  assert.deepEqual(value.compounds.map(row => row[3]), [0, 1, 0]);
});

test('exactly at a benchmark is labeled at, rather than above, the benchmark', () => {
  assert.equal(decodePfasMonitoring([4, 1, [['PFOA', 4, 1, 1]]])!.violations, 0);
});

test('lithium never becomes hardness and decoding does not mutate source records', () => {
  const raw = [672, 1, [['PFOA', 4.1, 1, 1]], 32.2];
  const before = JSON.stringify(raw);
  const value = decodePfasMonitoring(raw)!;
  assert.equal(value.lithiumUgL, 32.2);
  assert.equal(value.hardness, undefined);
  value.compounds[0][1] = 99;
  assert.equal(JSON.stringify(raw), before);
  assert.notEqual(getUcmrHardnessMgL('TX0790005'), 32.2);
});

test('missing or malformed monitoring is a coverage gap, not an all-clear', () => {
  assert.equal(decodePfasMonitoring(undefined), null);
  assert.equal(decodePfasMonitoring([0, 0, null]), null);
  assert.equal(getCityPfasData('NY7003493'), null);
  assert.equal(computeWaterScore('low', [], null).grade, '—');
});

test('supplier identity cannot change merely because another system has monitoring data', () => {
  const expected = {
    'new-york': 'NY7003493', philadelphia: 'PA1510001', parkersburg: 'WV3305407',
    chicago: 'IL0316000', detroit: 'MI0001800', memphis: 'TN0000450',
    'virginia-beach': 'VA3810900',
  };
  for (const [slug, id] of Object.entries(expected)) {
    const city = CITIES[slug];
    assert.equal(resolveCityPwsid(slug, city.pwsid, city.zip), id, slug);
  }
});

test('editorial wording and hardness cannot change the health-related index', () => {
  const data = decodePfasMonitoring([5.1, 0, [['PFHxS', 5.1, 1, 0]]]);
  const a = computeWaterScore('low', [], data, { waterProfile: { hardness: 10 } });
  const b = computeWaterScore('high', ['lead', 'PFAS', 'chromium', 'very hard water'], data, { waterProfile: { hardness: 525 } });
  assert.equal(a.score, b.score);
  assert.equal(nationalPercentileFromSafetyScore(88), null);
});

test('Google can crawl framework resources', () => {
  const rules = robots().rules;
  const general = (Array.isArray(rules) ? rules : [rules]).find(rule => rule.userAgent === '*');
  assert.ok(general);
  assert.equal(JSON.stringify(general.disallow).includes('/_next/'), false);
});

test('a failed EPA violation request preserves historical records without claiming current compliance', async () => {
  const original = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.includes('SDWA_VIOLATIONS')) throw new Error('Simulated upstream outage');
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('10001');
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(data.violationCoverage, 'unavailable');
    assert.equal(data.openViolations, null);
    assert.equal(data.totalViolations, null);
    assert.ok(Array.isArray(data.contaminants));
    assert.equal(data.pwsid, 'NY7003493');
    assert.equal(data.score, null);
    assert.match(data.summary, /historical/);
    assert.ok(requests.some(url => url.includes('SDWA_VIOLATIONS/PWSID/NY7003493')));
    globalThis.fetch = async () => new Response('[]', { headers: { 'Content-Type': 'application/json' } });
    (globalThis as any).__wcEpaCircuit = { fails: 0, openUntil: 0 };
    const recovered = await lookupWaterReport('10001');
    const recoveredData = await recovered.json();
    assert.equal(recoveredData.violationCoverage, 'available', 'an outage response must not hide recovery in the success cache');
    assert.equal(recoveredData.openViolations, 0);

  } finally { globalThis.fetch = original; }
});

test('the shared lookup rejects invalid ZIPs without network access', async () => {
  const response = await lookupWaterReport('not-a-zip');
  assert.equal(response.status, 400);
});

test('a successful lookup normalizes sample units and does not invent PFAS coverage or lead values', async () => {
  const original = globalThis.fetch;
  (globalThis as typeof globalThis & { __wcEpaCircuit?: unknown }).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input) => {
    const url = String(input);
    const rows = url.includes('LCR_SAMPLE_RESULT') ? [
      { contaminant_code: '1040', sample_measure: '0.005', unit_of_measure: 'mg/L' },
      { contaminant_code: '1040', sample_measure: '2', unit_of_measure: 'ppb' },
    ] : [];
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('10002');
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.pwsid, 'NY7003493');
    assert.equal(data.pfasCoverage, 'unavailable');
    assert.equal(data.grade, '—');
    assert.equal(data.nationalPercentile, null);
    assert.equal(data.contaminants.find((row: { name: string }) => row.name === 'Lead')?.level, 5);
    assert.equal(data.contaminants.some((row: { name: string }) => row.name === 'PFAS (Total)'), false);
  } finally { globalThis.fetch = original; }
});

test('state aliases do not shadow NYC, and excluded ZIP pages are absent from the sitemap', async () => {
  const rewrites = await config.rewrites!();
  assert.ok(Array.isArray(rewrites));
  assert.equal(rewrites.some(rule => rule.source === '/water/new-york'), false);
  assert.equal(sitemap().some(row => row.url.includes('/results/')), false);
});

test('metals affect an uncurated supplier index even without a hardness measurement', () => {
  assert.equal(findCityByResolvedPwsid('MA1223000'), null);
  const base = { pwsid: 'MA1223000', zip: '00000', openViolations: 0 };
  const withoutMetals = computeZipWaterScore({ ...base, contaminants: [] });
  const withMetals = computeZipWaterScore({ ...base, contaminants: [
    { name: 'Arsenic', level: 5, limit: 10, unit: 'ppb', severity: 'moderate', note: 'Regression fixture', source: 'Test' },
    { name: 'Radium (combined)', level: 4, limit: 5, unit: 'pCi/L', severity: 'moderate', note: 'Regression fixture', source: 'Test' },
  ] });
  assert.equal(withoutMetals.score - withMetals.score, 10);
});

test('worst-state summaries never choose an ungraded city', () => {
  for (const row of buildWorstStatesRankings()) {
    const city = CITIES[row.worstSlug];
    assert.ok(city, row.stateAbbr);
    const snapshot = getCityPfasData(resolveCityPwsid(row.worstSlug, city.pwsid, city.zip));
    assert.notEqual(computeWaterScore(city.urgency, city.issues, snapshot).grade, '—', row.worstCityName);
  }
});

test('the ZIP PFAS notice distinguishes missing coverage from no reportable detections', () => {
  assert.match(getPfasCoverageNotice('unavailable').title, /unavailable/i);
  assert.match(getPfasCoverageNotice(undefined).detail, /does not establish detection or nondetection/i);
  assert.match(getPfasCoverageNotice('available').title, /no reportable.*listed/i);
});


test('manual refresh bypasses both report and EPA dataset caches without caching the refresh response', async () => {
  const original = globalThis.fetch;
  const calls: { url: string; options?: RequestInit }[] = [];
  (globalThis as any).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input, options) => {
    calls.push({ url: String(input), options });
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('10001', true);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    const datasets = calls.filter(call => /SDWA_VIOLATIONS|LCR_SAMPLE_RESULT|SDWA_SAMPLES/.test(call.url));
    assert.equal(datasets.length, 3);
    for (const call of datasets) {
      assert.equal(call.options?.cache, 'no-store');
      assert.equal('next' in (call.options || {}), false);
    }
  } finally { globalThis.fetch = original; }
});
