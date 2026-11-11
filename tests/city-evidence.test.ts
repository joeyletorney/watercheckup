import test from 'node:test';
import assert from 'node:assert/strict';
import { cityEvidenceStats, historicalPfasAnswer } from '../lib/city-report-evidence';
import { getCityPfasData } from '../lib/ucmr5-city-pfas';
import { POST } from '../app/api/newsletter/subscribe/route';
import { NextRequest } from 'next/server';

test('city hero counts come from monitoring rather than stale editorial stats', () => {
  const snapshot = getCityPfasData('TX0150018');
  assert.ok(snapshot);
  const stats = cityEvidenceStats(snapshot, [
    { label: 'PFAS Detected', value: '4', color: 'red' },
    { label: 'Open Violations', value: '0', color: 'green' },
    { label: 'Hardness', value: 'Very Hard', color: 'blue' },
  ]);
  assert.equal(stats.find(s => s.label === 'PFAS compounds (UCMR5)')?.value, String(snapshot.compounds.length));
  assert.equal(stats.some(s => s.label === 'Open Violations'), false);
  assert.equal(stats.find(s => s.label === 'Current compliance')?.value, 'Not verified');
  assert.equal(stats.find(s => s.label === 'Hardness')?.value, 'Very Hard');
  assert.match(historicalPfasAnswer(snapshot, 'April 2025'), new RegExp(`${snapshot.compounds.length} PFAS compound`));
});

test('missing monitoring is unavailable while a recorded empty snapshot stays zero', () => {
  assert.equal(cityEvidenceStats(null)[1].value, 'Unavailable');
  assert.equal(cityEvidenceStats({ compounds: [], maxPpt: 0, violations: 0 })[1].value, '0');
  assert.match(historicalPfasAnswer(null, 'April 2025'), /does not establish/);
});

test('newsletter welcome describes general guidance and unsupported local-alert requests create no contact', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.BREVO_API_KEY;
  const requests: { url: string; body: any }[] = [];
  process.env.BREVO_API_KEY = 'test-placeholder';
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), body: JSON.parse(String(init?.body)) });
    return new Response('{}', { status: 200 });
  };
  try {
    const welcome = await POST(new NextRequest('http://localhost/api/newsletter/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newsletter-check@example.com', zip: '78205', source: 'weekly-newsletter' }),
    }));
    assert.equal(welcome.status, 200);
    const mail = requests.find(r => r.url.endsWith('/smtp/email'))?.body;
    assert.ok(mail);
    assert.match(mail.htmlContent, /general weekly water treatment newsletter/);
    assert.doesNotMatch(mail.htmlContent, /keep an eye on|What triggers an alert|new EPA-reported violations/);
    const count = requests.length;
    const unsupported = await POST(new NextRequest('http://localhost/api/newsletter/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newsletter-check@example.com', source: 'violation-alert' }),
    }));
    assert.equal(unsupported.status, 422);
    assert.equal(requests.length, count);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = originalKey;
  }
});
