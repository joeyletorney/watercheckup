import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  looksLikeFacilityOrMailingLabel,
  looksLikeStreetAddress,
  placeFromSystemName,
  resolveZipReportPlace,
} from '../lib/zip-report-place';
import { buildZipResultsTitle } from '../lib/zip-results-seo';
import { lookupWaterReport } from '../lib/server-water-report';
import {
  isSdwisRuleContaminantCode,
  labelSdwisViolationSubject,
} from '../lib/sdwis-violation-labels';

test('street-address and mailing labels are rejected as place names', () => {
  assert.equal(looksLikeStreetAddress('20 WEST LAKE DRIVE'), true);
  assert.equal(looksLikeStreetAddress('3900 Donaldson Pl.'), true);
  assert.equal(looksLikeStreetAddress('375 11TH ST MS 606'), true);
  assert.equal(looksLikeStreetAddress('PO BOX 1562'), true);
  assert.equal(looksLikeFacilityOrMailingLabel('City Hall'), true);
  assert.equal(looksLikeFacilityOrMailingLabel('Department of Public Works - City Hall'), true);
  assert.equal(looksLikeFacilityOrMailingLabel('Veolia ATTN: Mark Sumner'), true);
  assert.equal(looksLikeStreetAddress('New York City'), false);
  assert.equal(looksLikeFacilityOrMailingLabel('Village of Mamaroneck'), false);
  assert.equal(looksLikeFacilityOrMailingLabel('Town of Mount Pleasant'), false);
  assert.equal(looksLikeStreetAddress('Beverly Hills'), false);
});

test('NYC ZIP reports use the city-page name, never the EPA facility street', () => {
  for (const zip of ['10001', '10002', '11201']) {
    const place = resolveZipReportPlace({
      zip,
      pwsid: 'NY7003493',
      city: '20 WEST LAKE DRIVE, NY',
      state: '01/29/1981',
      systemName: 'NEW YORK CITY SYSTEM',
    });
    assert.match(place, /New York City/i, zip);
    assert.doesNotMatch(place, /WEST LAKE|DRIVE|Valhalla/i, zip);
    assert.match(place, /,\s*NY$/);
  }

  const fromAdminCity = resolveZipReportPlace({
    zip: '10001',
    pwsid: 'NY7003493',
    city: 'VALHALLA',
    state: 'NY',
    systemName: 'NEW YORK CITY SYSTEM',
  });
  assert.equal(fromAdminCity, 'New York City, NY');
});

test('address-like city fields fall back to a municipality or system name', () => {
  const beverly = resolveZipReportPlace({
    zip: '90210',
    pwsid: 'CA1910156',
    city: 'BEVERLY HILLS',
    state: 'CA',
    systemName: 'BEVERLY HILLS-CITY, WATER DEPT.',
  });
  assert.match(beverly, /Beverly Hills/i);
  assert.doesNotMatch(beverly, /DEPT|WATER/i);

  const fromSystem = resolveZipReportPlace({
    zip: '43215',
    pwsid: 'OH2500012',
    city: '910 Dublin Rd',
    state: 'OH',
    systemName: 'COLUMBUS DIVISION OF WATER',
  });
  assert.match(fromSystem, /Columbus/i);
  assert.doesNotMatch(fromSystem, /Dublin|Rd/i);

  assert.equal(placeFromSystemName('NEW YORK CITY SYSTEM'), 'NEW YORK CITY');
});

test('ZIP SEO copy never uses a street address as the place name', () => {
  const titled = buildZipResultsTitle({ zip: '10001', city: '20 WEST LAKE DRIVE, NY' });
  assert.doesNotMatch(titled, /WEST LAKE|DRIVE/i);
  assert.match(titled, /ZIP 10001/);
  const nyc = buildZipResultsTitle({ zip: '10001', city: 'New York City, NY' });
  assert.match(nyc, /^New York City /);
});

test('0800 is the LT2 treatment-technique rule, not a contaminant', () => {
  assert.equal(isSdwisRuleContaminantCode('0800'), true);
  assert.equal(isSdwisRuleContaminantCode('800'), true);
  assert.equal(isSdwisRuleContaminantCode('1040'), false);
  const labeled = labelSdwisViolationSubject({
    contaminantCode: '0800',
    category: 'TT',
    ruleCode: '123',
  });
  assert.equal(labeled?.kind, 'rule');
  assert.match(String(labeled?.name), /Long Term 2 Enhanced Surface Water Treatment Rule/);
  assert.doesNotMatch(String(labeled?.name), /Contaminant/i);
});

test('an MCL with an unmapped chemical code is not swallowed by rule_code', () => {
  const labeled = labelSdwisViolationSubject({
    contaminantCode: '2065',
    category: 'MCL',
    ruleCode: '320',
  });
  assert.equal(labeled?.kind, 'contaminant');
  assert.match(String(labeled?.name), /EPA code 2065/);
  assert.doesNotMatch(String(labeled?.name), /Synthetic Organic|Rule/i);
});

test('lookup of NYC ZIPs sanitizes the EPA mailing address and does not list 0800 as a contaminant', async () => {
  const original = globalThis.fetch;
  (globalThis as typeof globalThis & { __wcEpaCircuit?: unknown }).__wcEpaCircuit = { fails: 0, openUntil: 0 };
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('WATER_SYSTEM')) {
      return new Response(JSON.stringify([{
        pwsid: 'NY7003493',
        pws_name: 'NEW YORK CITY SYSTEM',
        city_name: 'VALHALLA',
        address_line1: '20 WEST LAKE DRIVE',
        state_code: 'NY',
        population_served_count: '8271000',
        primary_source_code: 'SW',
        pws_type_code: 'CWS',
      }]), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/VIOLATION/')) {
      return new Response(JSON.stringify([{
        pwsid: 'NY7003493',
        compliance_status_code: 'O',
        violation_category_code: 'TT',
        contaminant_code: '0800',
        violation_code: '47',
        rule_code: '123',
        compl_per_begin_date: '2017-02-01',
      }]), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    for (const zip of ['10001', '10002', '11201']) {
      const response = await lookupWaterReport(zip, true);
      const data = await response.json();
      assert.equal(response.status, 200, zip);
      assert.equal(data.pwsid, 'NY7003493', zip);
      assert.match(String(data.city), /New York City/i, zip);
      assert.doesNotMatch(String(data.city), /WEST LAKE|DRIVE|Valhalla/i, zip);
      const names = (data.contaminants || []).map((row: { name: string }) => String(row.name));
      assert.equal(names.some((name: string) => /contaminant\s*0800/i.test(name) || name === '0800'), false, zip);
      const viol = (data.violations || []).find((row: { contaminant?: string }) =>
        /Long Term 2|Surface Water Treatment/i.test(String(row.contaminant || '')),
      );
      assert.ok(viol, `ZIP ${zip} should label the 0800 TT violation as LT2 ESWTR`);
    }
  } finally {
    globalThis.fetch = original;
  }
});
