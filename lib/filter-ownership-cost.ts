export type CartridgeSchedule = { name: string; packPriceCents: number; packSize: number; gallons: number; months: number };
export type CostInput = { gallonsPerDay: number; purchasePrice: number | null; starterIncluded: boolean | null };
export type CostEstimate = { annualAllowanceCents: number; firstYearFiltersCents: number | null; firstYearTotalCents: number | null; cartridges: { name: string; firstYearPacks: number | null }[] };

/** Calendar/volume limits, whichever comes first. End-of-year replacements belong to the next year. */
export function estimateOwnershipCost(schedules: readonly CartridgeSchedule[], input: CostInput): CostEstimate | null {
  if (!Number.isFinite(input.gallonsPerDay) || input.gallonsPerDay < 0.1 || input.gallonsPerDay > 10) return null;
  if (input.purchasePrice !== null && (!Number.isFinite(input.purchasePrice) || input.purchasePrice < 0 || input.purchasePrice > 20000)) return null;
  let allowance = 0;
  let firstYear = 0;
  const cartridges = [];
  for (const filter of schedules) {
    if (![filter.packPriceCents, filter.packSize, filter.gallons, filter.months].every(n => Number.isFinite(n) && n > 0)) return null;
    const cycles = Math.max(365 * input.gallonsPerDay / filter.gallons, 12 / filter.months);
    allowance += cycles * filter.packPriceCents / filter.packSize;
    const packs = input.starterIncluded === null ? null : Math.ceil(Math.max(0, Math.ceil(cycles - 1e-10) - (input.starterIncluded ? 1 : 0)) / filter.packSize);
    if (packs !== null) firstYear += packs * filter.packPriceCents;
    cartridges.push({ name: filter.name, firstYearPacks: packs });
  }
  const filters = input.starterIncluded === null ? null : firstYear;
  return { annualAllowanceCents: Math.round(allowance), firstYearFiltersCents: filters, firstYearTotalCents: filters === null || input.purchasePrice === null ? null : Math.round(input.purchasePrice * 100) + filters, cartridges };
}

export const COUNTERTOP_COST_SCHEDULES: Record<string, readonly CartridgeSchedule[]> = {
  brita: [{ name: 'Elite OB06 two-pack', packPriceCents: 3299, packSize: 2, gallons: 120, months: 6 }],
  aquatru: [
    { name: 'Classic pre/carbon AT2001', packPriceCents: 2995, packSize: 1, gallons: 600, months: 6 },
    { name: 'Classic VOC AT2003', packPriceCents: 3995, packSize: 1, gallons: 600, months: 12 },
    { name: 'Classic RO AT2002', packPriceCents: 5995, packSize: 1, gallons: 1200, months: 24 },
  ],
};
