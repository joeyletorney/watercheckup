/** Historical monitoring benchmarks from the April 2024 rule, in ng/L (ppt).
 * These comparisons do not establish regulatory compliance or noncompliance.
 */
export const PFAS_BENCHMARK_PPT: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10,
};

export type PfasCompound = [name: string, ppt: number, hasBenchmark: number, aboveBenchmark: number];
export type MonitoringSnapshot = {
  maxPpt: number;
  /** Legacy internal property: number of compounds above a benchmark, NOT legal violations. */
  violations: number;
  compounds: PfasCompound[];
  lithiumUgL?: number;
  /** Hardness is never supplied by UCMR5; use a separately sourced utility profile. */
  hardness?: never;
};

/** Missing monitoring and a record with no reportable detections are different states. */
export function getPfasCoverageNotice(coverage: unknown) {
  return coverage === 'available'
    ? { title: 'No reportable PFAS detections listed', detail: 'This packaged record lists no reportable detections. It does not establish that every compound is absent or that your household tap was tested.' }
    : { title: 'PFAS monitoring coverage unavailable', detail: 'This packaged snapshot has no matching monitoring record. Missing coverage does not establish detection or nondetection. Check your supplier’s current report.' };
}

export function decodePfasMonitoring(entry: unknown): MonitoringSnapshot | null {
  if (!Array.isArray(entry) || !Array.isArray(entry[2])) return null;
  const compounds: PfasCompound[] = entry[2]
    .filter((row: unknown): row is [string, number, number, number] =>
      Array.isArray(row) && typeof row[0] === 'string' &&
      typeof row[1] === 'number' && Number.isFinite(row[1]) && row[1] > 0)
    .map(([name, ppt]: [string, number, number, number]) => {
      const benchmark = PFAS_BENCHMARK_PPT[name];
      return [name, ppt, benchmark === undefined ? 0 : 1,
        benchmark !== undefined && ppt > benchmark ? 1 : 0];
    });
  const lithium = entry[3];
  return {
    maxPpt: Math.max(0, ...compounds.map(([, ppt]) => ppt)),
    violations: compounds.filter(([, , , above]) => above === 1).length,
    compounds,
    ...(typeof lithium === 'number' && Number.isFinite(lithium) && lithium >= 0
      ? { lithiumUgL: lithium } : {}),
  };
}
