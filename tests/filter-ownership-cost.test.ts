import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateOwnershipCost, COUNTERTOP_COST_SCHEDULES } from '../lib/filter-ownership-cost';
const calc = (id: string, gallonsPerDay = 1, starterIncluded: boolean | null = true, purchasePrice: number | null = 0) => estimateOwnershipCost(COUNTERTOP_COST_SCHEDULES[id], { gallonsPerDay, starterIncluded, purchasePrice })!;

test('time limits, volume limits and whole-pack purchases are distinct from annualized allowance', () => {
  const brita = calc('brita', 1, true, 40);
  assert.equal(brita.firstYearFiltersCents, 6598, 'four cartridge lives, minus included cartridge, require two two-packs');
  assert.equal(brita.firstYearTotalCents, 10598);
  assert.equal(brita.annualAllowanceCents, 5017);
  assert.equal(calc('brita', 0.1).annualAllowanceCents, 3299, 'six-month expiry dominates low usage');
  const aqua = calc('aquatru', 1, true, 400);
  assert.equal(aqua.annualAllowanceCents, 12983);
  assert.equal(aqua.firstYearFiltersCents, 2995, 'only the pre/carbon expires before the end of year one');
  assert.equal(aqua.firstYearTotalCents, 42995);
  assert.deepEqual(aqua.cartridges.map(c => c.firstYearPacks), [1, 0, 0]);
  assert.equal(calc('aquatru', 2).firstYearFiltersCents, 6990, 'higher volume requires an extra VOC cartridge');
  assert.equal(calc('aquatru', 1, false).firstYearFiltersCents, 15980, 'no starter set requires purchasing each cartridge initially');
});

test('unknown bundle contents or purchase prices never become a free unit or a fabricated first-year total', () => {
  assert.equal(calc('aquatru', 1, null, null).firstYearTotalCents, null);
  assert.equal(calc('aquatru', 1, null, 400).firstYearFiltersCents, null);
  assert.equal(calc('aquatru', 1, true, null).firstYearTotalCents, null);
  assert.equal(calc('brita', 1, true, 0).firstYearTotalCents, 6598, 'an explicit zero is valid for an already-owned unit');
});

test('invalid and extreme inputs are rejected instead of producing misleading totals', () => {
  for (const value of [0, -1, NaN, Infinity, 10.1]) assert.equal(estimateOwnershipCost(COUNTERTOP_COST_SCHEDULES.brita, { gallonsPerDay:value, starterIncluded:true, purchasePrice:0 }), null);
  for (const price of [-1, NaN, Infinity, 20001]) assert.equal(estimateOwnershipCost(COUNTERTOP_COST_SCHEDULES.brita, { gallonsPerDay:1, starterIncluded:true, purchasePrice:price }), null);
  assert.ok(calc('aquatru', 10).firstYearFiltersCents! > calc('aquatru', 1).firstYearFiltersCents!);
});
