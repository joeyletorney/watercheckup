import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveWaterSearch } from '../lib/water-search';

test('ZIP lookup preserves leading zeroes and supports ZIP+4 without accepting malformed input', () => {
  assert.deepEqual(resolveWaterSearch(' 02108 '), { zip: '02108', inputType: 'zip' });
  assert.deepEqual(resolveWaterSearch('02108-1234'), { zip: '02108', inputType: 'zip' });
  for (const input of ['0210', '021081', '02108-123', '02108abc', '', '__proto__', 'constructor', '<script>']) assert.equal(resolveWaterSearch(input), null, input);
});

test('city aliases accept punctuation and matching state abbreviations while rejecting a conflicting state', () => {
  assert.deepEqual(resolveWaterSearch('  Boston, MA  '), resolveWaterSearch('boston'));
  assert.deepEqual(resolveWaterSearch('St. Louis, MO'), resolveWaterSearch('saint louis'));
  assert.deepEqual(resolveWaterSearch('NYC'), { zip: '10001', inputType: 'city' });
  assert.deepEqual(resolveWaterSearch('Portland, ME'), { zip: '04101', inputType: 'city' });
  assert.deepEqual(resolveWaterSearch('Portland, OR'), { zip: '97201', inputType: 'city' });
  for (const input of ['Boston, TX', 'Portland, MA', 'Not a real city']) assert.equal(resolveWaterSearch(input), null, input);
});


test('major-city shortcuts use locally mapped named suppliers rather than missing or neighboring-system ZIPs', async () => {
  const { default: registry } = await import('../lib/zip-lookup.json');
  const records = registry as Record<string, { p: string }>;
  for (const [city, pwsid] of [['Boston', 'MA3035000'], ['Houston', 'TX1010013'], ['Los Angeles', 'CA1910067'], ['LA', 'CA1910067']]) {
    const match = resolveWaterSearch(city);
    assert.ok(match);
    assert.equal(records[match.zip]?.p, pwsid);
  }
});
