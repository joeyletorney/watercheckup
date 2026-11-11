import type { CityPfasSnapshot } from './city-water-score';

export type ReportStat = { label: string; value: string; color: string };

/** Historical monitoring never establishes a current violation count. */
export function cityEvidenceStats(pfas: CityPfasSnapshot, stats: ReportStat[] = []): ReportStat[] {
  return [
    { label: 'Current compliance', value: 'Not verified', color: '#cbd5e1' },
    { label: 'PFAS compounds (UCMR5)', value: pfas ? String(pfas.compounds.length) : 'Unavailable', color: '#67e8f9' },
    ...stats.filter(stat => !/^(Open Violations|Current compliance|PFAS Detected|PFAS compounds(?: \(UCMR5\))?)$/i.test(stat.label)),
  ];
}

export function historicalPfasAnswer(pfas: CityPfasSnapshot, snapshotLabel: string): string {
  if (!pfas) return `The ${snapshotLabel} UCMR5 snapshot has no matching monitoring record for this supplier. Missing coverage does not establish that PFAS is absent. Check the supplier’s current report.`;
  return `The ${snapshotLabel} UCMR5 snapshot lists ${pfas.compounds.length} PFAS compound(s) detected for this supplier, with ${pfas.violations} historical compound peak(s) above April 2024 comparison benchmarks. A historical peak is not an official compliance finding or a current reading at your tap. Check the supplier’s current report.`;
}
