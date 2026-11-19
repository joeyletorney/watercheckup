import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lookupWaterReport } from '../lib/server-water-report';
import {
  getZipSupplier,
  isLookupableZip,
  pickLocalCommunitySystem,
} from '../lib/zip-supplier';

test('90210 prefers Beverly Hills over Los Angeles city water', () => {
  const row = getZipSupplier('90210');
  assert.ok(row);
  assert.equal(row.p, 'CA1910156');
  assert.match(row.n, /BEVERLY HILLS/i);
});

test('placeholder and nonexistent ZIPs are not lookupable', () => {
  assert.equal(isLookupableZip('00000'), false);
  assert.equal(isLookupableZip('99999'), false);
  assert.equal(isLookupableZip('9021'), false);
  assert.equal(getZipSupplier('00000'), undefined);
});

test('pickLocalCommunitySystem keeps a local CWS instead of the nearest megacity', () => {
  const picked = pickLocalCommunitySystem([
    { pwsid: 'CA1910067', pws_name: 'LOS ANGELES-CITY, DEPT. OF WATER & POWER', pws_type_code: 'CWS', population_served_count: '4000000', city_name: 'LOS ANGELES' },
    { pwsid: 'CA1910156', pws_name: 'BEVERLY HILLS-CITY, WATER DEPT.', pws_type_code: 'CWS', population_served_count: '40121', city_name: 'BEVERLY HILLS' },
  ], '90210');
  assert.equal(String(picked?.pwsid || picked?.PWSID), 'CA1910156');
});

test('invalid ZIP 00000 returns 404 instead of a garbage report', async () => {
  const original = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('00000');
    const data = await response.json();
    assert.equal(response.status, 404);
    assert.match(String(data.error || ''), /not a valid|no public water system/i);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = original;
  }
});

test('90210 lookup uses the Beverly Hills PWSID even when EPA returns a larger neighbor', async () => {
  const original = globalThis.fetch;
  (globalThis as typeof globalThis & { __wcEpaCircuit?: unknown }).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('WATER_SYSTEM')) {
      return new Response(JSON.stringify([{
        pwsid: 'CA1910156',
        pws_name: 'BEVERLY HILLS-CITY, WATER DEPT.',
        city_name: 'BEVERLY HILLS',
        state_code: 'CA',
        population_served_count: '40121',
        primary_source_code: 'SW',
        pws_type_code: 'CWS',
      }]), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await lookupWaterReport('90210');
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.pwsid, 'CA1910156');
    assert.match(String(data.systemName), /BEVERLY HILLS/i);
    assert.match(String(data.city), /Beverly Hills/i);
    assert.doesNotMatch(String(data.city), /\d+\s+\S+.*(St|Ave|Rd|Dr)/i);
  } finally {
    globalThis.fetch = original;
  }
});
