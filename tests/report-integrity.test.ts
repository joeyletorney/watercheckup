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
    if (url.includes('/VIOLATION/')) throw new Error('Simulated upstream outage');
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
    assert.equal(typeof data.score, 'number');
    assert.ok(data.grade);
    assert.match(data.summary, /historical/);
    assert.ok(requests.some(url => url.includes('VIOLATION/PWSID/NY7003493')));
    assert.equal(data.rawViolations, undefined);
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
    assert.match(String(data.city), /New York City/i);
    assert.doesNotMatch(String(data.city), /WEST LAKE|DRIVE/i);
    assert.equal(data.pfasCoverage, 'unavailable');
    assert.equal(data.grade, '—');
    assert.equal(data.nationalPercentile, null);
    assert.equal(data.contaminants.find((row: { name: string }) => row.name === 'Lead')?.level, 5);
    assert.equal(data.contaminants.some((row: { name: string }) => row.name === 'PFAS (Total)'), false);
  } finally { globalThis.fetch = original; }
});

test('an unnamed MCL keeps a contaminant-table row even when EPA also sends a rule_code', async () => {
  const original = globalThis.fetch;
  (globalThis as typeof globalThis & { __wcEpaCircuit?: unknown }).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input) => {
    const url = String(input);
    const rows = url.includes('/VIOLATION/') ? [{
      pwsid: 'MA2348000',
      compliance_status_code: 'O',
      violation_category_code: 'MCL',
      contaminant_code: '2065',
      rule_code: '320',
      compl_per_begin_date: '2024-06-01',
    }] : [];
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('01608', true);
    const data = await response.json();
    assert.equal(response.status, 200);
    const row = data.contaminants.find((c: { name: string; note?: string }) => /EPA code 2065/i.test(c.name));
    assert.ok(row, 'unmapped MCL codes must still appear as contaminants');
    assert.match(String(row?.note || ''), /OPEN/);
    assert.equal(data.violations[0].contaminant, 'EPA code 2065');
  } finally { globalThis.fetch = original; }
});

test('unaddressed EPA compliance_status_code U is counted and labeled as open', async () => {
  const original = globalThis.fetch;
  (globalThis as typeof globalThis & { __wcEpaCircuit?: unknown }).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input) => {
    const url = String(input);
    const rows = url.includes('/VIOLATION/') ? [{
      pwsid: 'MA3035000',
      compliance_status_code: 'U',
      violation_category_code: 'MCL',
      contaminant_code: 'TESTU',
      contaminant_name: 'Unaddressed Test Contaminant',
      compl_per_begin_date: '2024-01-15',
    }] : [];
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('01601');
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.violationCoverage, 'available');
    assert.equal(data.openViolations, 1);
    assert.equal(data.violations[0].status, 'Unaddressed');
    const row = data.contaminants.find((c: { name: string; note?: string }) => c.name === 'Unaddressed Test Contaminant');
    assert.match(String(row?.note || ''), /OPEN/);
    assert.doesNotMatch(String(row?.note || ''), /Resolved/);
  } finally { globalThis.fetch = original; }
});

test('state aliases do not shadow NYC, and excluded ZIP pages are absent from the sitemap', async () => {
  const rewrites = await config.rewrites!();
  assert.ok(Array.isArray(rewrites));
  assert.equal(rewrites.some(rule => rule.source === '/water/new-york'), false);
  const map = sitemap();
  assert.equal(map.some(row => row.url.includes('/results/')), false);
  assert.equal(map.some(row => row.url.includes('/utilities')), false);
  assert.ok(map.some(row => row.url.endsWith('/water/boston')));
  assert.ok(map.some(row => row.url.includes('/water/state/')));
  assert.ok(map.some(row => row.url.includes('/blog/')));
  const redirects = await config.redirects!();
  assert.ok(redirects.some(rule =>
    Array.isArray(rule.has) &&
    rule.has.some(h => h.value === 'www.watercheckup.com') &&
    rule.permanent === true
  ));
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
    const datasets = calls.filter(call => /\/VIOLATION\/|LCR_SAMPLE_RESULT/.test(call.url));
    assert.equal(datasets.length, 2);
    for (const call of datasets) {
      assert.equal(call.options?.cache, 'no-store');
      assert.equal('next' in (call.options || {}), false);
    }
  } finally { globalThis.fetch = original; }
});
