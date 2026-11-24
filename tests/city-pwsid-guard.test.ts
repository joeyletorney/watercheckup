import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CITIES } from '../app/water/[city]/cities-data';
import {
  ALLOWED_SHARED_PWSIDS,
  auditCityPwsidMappings,
  resolveCityPwsid,
} from '../lib/city-pwsid';
import { shouldIndexUtility } from '../lib/utility-indexability';

test('Boston, Worcester and Rochester map to their own community systems', () => {
  assert.equal(resolveCityPwsid('boston', CITIES.boston.pwsid), 'MA3035000');
  assert.equal(CITIES.boston.pwsid, 'MA3035000');
  assert.match(CITIES.boston.system, /Boston Water and Sewer|MWRA/i);

  assert.equal(resolveCityPwsid('worcester', CITIES.worcester.pwsid), 'MA2348000');
  assert.equal(CITIES.worcester.pwsid, 'MA2348000');
  assert.match(CITIES.worcester.system, /Worcester/i);

  assert.equal(resolveCityPwsid('rochester', CITIES.rochester.pwsid), 'NY2704518');
  assert.equal(CITIES.rochester.pwsid, 'NY2704518');
  assert.match(CITIES.rochester.system, /Rochester/i);

  assert.notEqual(CITIES.boston.pwsid, 'MA4245000');
  assert.notEqual(CITIES.worcester.pwsid, 'MA4245000');
  assert.notEqual(CITIES.rochester.pwsid, 'NY5907717');
});

test('city pages do not share a PWSID except documented regional systems, and none map to tiny non-community names', () => {
  const issues = auditCityPwsidMappings(CITIES);
  assert.deepEqual(issues, [], issues.map((row) => `${row.slug}: ${row.reason}`).join('\n'));

  assert.deepEqual(
    [...ALLOWED_SHARED_PWSIDS.MD0150005].sort(),
    ['bethesda', 'gaithersburg', 'silver-spring'],
  );
  assert.deepEqual([...ALLOWED_SHARED_PWSIDS.CO0116001].sort(), ['denver', 'lakewood']);
});

test('state-page system names keep Utilities instead of a global string replace', () => {
  assert.equal(CITIES.dallas.system, 'Dallas Water Utilities');
  assert.equal(CITIES['san-francisco'].system, 'San Francisco Public Utilities Commission');
  assert.equal(CITIES.pensacola.system, 'Emerald Coast Utilities Authority (ECUA)');
  assert.equal(CITIES.dallas.system.includes('Public water systems'), false);
});

test('tiny non-community utilities are noindex while large community systems stay indexable', () => {
  assert.equal(shouldIndexUtility({ name: 'PEQUENAKONCK ELEMENTARY SCHOOL', populationServed: 400 }), false);
  assert.equal(shouldIndexUtility({ name: 'RAYNHAM CENTER WATER DISTRICT', populationServed: 120 }), false);
  assert.equal(shouldIndexUtility({ name: 'CITY OF ROCHESTER', populationServed: 210000 }), true);
  assert.equal(shouldIndexUtility({ name: 'BOSTON WATER AND SEWER COMMISSION', populationServed: 675647 }), true);
  assert.equal(shouldIndexUtility({ name: 'CITY OF COLLEGE STATION', populationServed: 120000 }), true);
  assert.equal(shouldIndexUtility({ name: 'CITY OF TEMPLE', populationServed: 82000 }), true);
  assert.equal(shouldIndexUtility({ name: 'FIRST BAPTIST CHURCH', populationServed: 2500 }), false);
  assert.equal(shouldIndexUtility({ name: 'TEMPLE UNIVERSITY', populationServed: 18000 }), false);
  assert.equal(shouldIndexUtility({ name: 'SHELL GAS STATION', populationServed: 800, pwsType: 'TNCWS' }), false);
  assert.equal(shouldIndexUtility({ name: 'SUNNY DAYS DAYCARE', populationServed: 1200 }), false);
  assert.equal(shouldIndexUtility({ name: 'LAKESIDE RV PARK', populationServed: 900 }), false);
  assert.equal(shouldIndexUtility({ name: 'VILLAGE SQUARE SHOPPING CENTER', populationServed: 2500 }), false);
  assert.equal(shouldIndexUtility({ name: 'GREENWOOD VILLAGE', populationServed: 0 }), false);
  assert.equal(shouldIndexUtility({ name: 'CITY OF ANNAPOLIS', populationServed: 40000, slug: 'annapolis' }), true);
});
