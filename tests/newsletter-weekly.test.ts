import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import {
  buildWeeklyHtml,
  getCurrentIssue,
  HOLIDAY_DEC7,
  HOLIDAY_NOV30,
  ISSUE_OVERRIDES,
  ISSUES,
  weeksSinceEpoch,
} from '../lib/newsletter-weekly';
import { GET } from '../app/api/newsletter/weekly/route';

function monday(isoDate: string): Date {
  return new Date(`${isoDate}T14:00:00.000Z`);
}

test('ISSUES stays a 16-week rotation and holiday overrides are date-keyed, not appended', () => {
  assert.equal(ISSUES.length, 16);
  assert.equal(ISSUE_OVERRIDES['2026-11-30'], HOLIDAY_NOV30);
  assert.equal(ISSUE_OVERRIDES['2026-12-07'], HOLIDAY_DEC7);
  assert.equal(Object.keys(ISSUE_OVERRIDES).length, 2);
});

test('getCurrentIssue returns holiday editions on 2026-11-30 and 2026-12-07', () => {
  assert.equal(getCurrentIssue(monday('2026-11-30')), HOLIDAY_NOV30);
  assert.equal(getCurrentIssue(monday('2026-12-07')), HOLIDAY_DEC7);
  assert.equal(getCurrentIssue(monday('2026-11-30')).subject, 'Holiday prices on water systems — a note from Joe');
});

test('getCurrentIssue keeps the existing rotation on other Mondays', () => {
  assert.equal(weeksSinceEpoch(monday('2026-11-23')) % ISSUES.length, 7);
  assert.equal(weeksSinceEpoch(monday('2026-12-14')) % ISSUES.length, 10);
  const nov23 = getCurrentIssue(monday('2026-11-23'));
  const dec14 = getCurrentIssue(monday('2026-12-14'));
  assert.equal(nov23, ISSUES[7]);
  assert.match(nov23.subject, /Which water filter actually works/);
  assert.equal(dec14, ISSUES[10]);
  assert.match(dec14.subject, /Private well water/);
  assert.equal(getCurrentIssue(monday('2026-12-21')), ISSUES[11]);
});

test('holiday HTML uses direct product URLs, a hidden preheader, ZIP CTA, and disclosure', () => {
  const html = buildWeeklyHtml(HOLIDAY_NOV30, 'joe@example.com');
  assert.match(html, /mso-hide:all/);
  assert.match(html, /I checked this morning/);
  assert.match(html, /WDG3P600/);
  assert.match(html, /https:\/\/www\.waterdropfilter\.com\/products\/waterdrop-reverse-osmosis-water-filtration-system\?ref=anbyjkqb/);
  assert.match(html, /https:\/\/www\.amazon\.com\/dp\/B0HDPNZ65Y\?tag=watercheckup-20/);
  assert.match(html, /https:\/\/www\.amazon\.com\/dp\/B0F2GRXV71\?tag=watercheckup-20/);
  assert.match(html, /https:\/\/www\.amazon\.com\/dp\/B0BT4FYHFJ\?tag=watercheckup-20/);
  assert.match(html, /https:\/\/www\.aquasana\.com\/whole-house-water-filters\//);
  assert.match(html, /https:\/\/aquatru\.com\/products\/countertop-reverse-osmosis-water-purifier/);
  assert.match(html, /https:\/\/watercheckup\.com\/blog\/best-under-sink-water-filter/);
  assert.match(html, /Check your ZIP code/);
  assert.match(html, /WaterCheckup may earn a commission/);
  assert.match(html, /Prices were checked on Nov 28, 2026/);
  assert.doesNotMatch(html, /amazon\.com\/s\?k=/);
  assert.doesNotMatch(html, /This week's top picks/);

  const dec7 = buildWeeklyHtml(HOLIDAY_DEC7, 'joe@example.com');
  assert.match(dec7, /Last call on holiday water-system prices/);
  assert.match(dec7, /replacement cartridges/);
  assert.match(dec7, /Confirm the live price on the checkout page/);
  assert.match(dec7, /https:\/\/www\.waterdropfilter\.com\/products\/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1\?ref=anbyjkqb/);
  assert.match(dec7, /https:\/\/www\.waterdropfilter\.com\/products\/whole-house-water-filter-for-tap-water-wd-whf3t-pg\?ref=anbyjkqb/);
});

test('existing issues still use Amazon keyword search unless a product has a direct url', () => {
  const weekly = buildWeeklyHtml(ISSUES[7], 'reader@example.com');
  assert.match(weekly, /amazon\.com\/s\?k=/);
  assert.match(weekly, /tag=watercheckup-20/);
  assert.doesNotMatch(weekly, /mso-hide:all/);
  assert.match(weekly, /Run my free water report/);

  const withUrl = buildWeeklyHtml({
    ...ISSUES[7],
    products: [{
      ...ISSUES[7].products[0],
      url: 'https://www.amazon.com/dp/B0HDPNZ65Y?tag=watercheckup-20',
      cta: 'Amazon',
    }],
  }, 'reader@example.com');
  assert.match(withUrl, /https:\/\/www\.amazon\.com\/dp\/B0HDPNZ65Y\?tag=watercheckup-20/);
  assert.doesNotMatch(withUrl, /amazon\.com\/s\?k=/);
  assert.match(withUrl, />Amazon</);
});

test('GET preview=2026-11-30 returns HTML without sending mail', async () => {
  const originalSecret = process.env.CRON_SECRET;
  const originalKey = process.env.BREVO_API_KEY;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  process.env.CRON_SECRET = 'weekly-test-secret';
  delete process.env.BREVO_API_KEY;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  };
  try {
    const unauthorized = await GET(new NextRequest('http://localhost/api/newsletter/weekly?preview=2026-11-30'));
    assert.equal(unauthorized.status, 401);

    const badDate = await GET(new NextRequest('http://localhost/api/newsletter/weekly?preview=not-a-date', {
      headers: { authorization: 'Bearer weekly-test-secret' },
    }));
    assert.equal(badDate.status, 400);

    const res = await GET(new NextRequest('http://localhost/api/newsletter/weekly?preview=2026-11-30', {
      headers: { authorization: 'Bearer weekly-test-secret' },
    }));
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /text\/html/);
    const html = await res.text();
    assert.match(html, /Holiday prices on water systems/);
    assert.match(html, /WDG3P600/);
    assert.equal(fetchCalls, 0);

    const rotation = await GET(new NextRequest('http://localhost/api/newsletter/weekly?preview=2026-12-14', {
      headers: { authorization: 'Bearer weekly-test-secret' },
    }));
    assert.equal(rotation.status, 200);
    assert.match(await rotation.text(), /Well water safety/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalSecret;
    if (originalKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = originalKey;
  }
});
