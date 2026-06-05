import fs from 'fs';
import path from 'path';

import { pwsidCcrContaminantsDataPath } from '@/lib/pwsid-ccr-contaminants';
import { EXTRA_EWG_GUIDELINES, EXTRA_HEALTH_CONTEXT, type ContaminantRow } from '@/lib/water-contaminants';
import { getContaminantFilterTech } from '@/lib/contaminant-filter-tech';

type BenchKey = string;

function benchKey(name: string, unit: string): BenchKey {
  return `${name}|${unit}`;
}

type Agg = { sum: number; count: number };

let nationalAvgCache: Map<BenchKey, number> | null = null;
let stateAvgCache: Map<string, Map<BenchKey, number>> | null = null;

function buildBenchmarkCaches(): void {
  if (nationalAvgCache) return;

  nationalAvgCache = new Map();
  stateAvgCache = new Map();

  const dataPath = pwsidCcrContaminantsDataPath();
  if (!fs.existsSync(dataPath)) return;

  try {
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as {
      byPwsid?: Record<string, { name: string; level: number; unit: string }[]>;
    };

    const nationalAgg = new Map<BenchKey, Agg>();
    const stateAgg = new Map<string, Map<BenchKey, Agg>>();

    for (const [pwsid, rows] of Object.entries(raw.byPwsid ?? {})) {
      const state = pwsid.slice(0, 2).toUpperCase();
      if (!stateAgg.has(state)) stateAgg.set(state, new Map());

      for (const row of rows) {
        if (row.level == null || !Number.isFinite(row.level)) continue;
        const key = benchKey(row.name, row.unit);

        const nat = nationalAgg.get(key) ?? { sum: 0, count: 0 };
        nat.sum += row.level;
        nat.count += 1;
        nationalAgg.set(key, nat);

        const stMap = stateAgg.get(state)!;
        const st = stMap.get(key) ?? { sum: 0, count: 0 };
        st.sum += row.level;
        st.count += 1;
        stMap.set(key, st);
      }
    }

    nationalAgg.forEach(({ sum, count }, key) => {
      if (count >= 3) nationalAvgCache!.set(key, sum / count);
    });
    stateAgg.forEach((map, state) => {
      const out = new Map<BenchKey, number>();
      map.forEach(({ sum, count }, key) => {
        if (count >= 2) out.set(key, sum / count);
      });
      if (out.size) stateAvgCache!.set(state, out);
    });
  } catch {
    nationalAvgCache = new Map();
    stateAvgCache = new Map();
  }
}

export function getNationalContaminantAverage(name: string, unit: string): number | null {
  buildBenchmarkCaches();
  return nationalAvgCache?.get(benchKey(name, unit)) ?? null;
}

export function getStateContaminantAverage(
  stateCode: string,
  name: string,
  unit: string,
): number | null {
  buildBenchmarkCaches();
  const st = stateCode.trim().toUpperCase().slice(0, 2);
  return stateAvgCache?.get(st)?.get(benchKey(name, unit)) ?? null;
}

function formatLevel(value: number, unit: string): string {
  const decimals = unit === 'ppt' || unit === 'ppb' || unit === 'pCi/L' ? 2 : unit === 'ppm' ? 2 : 1;
  return `${value.toFixed(decimals)} ${unit}`;
}

/** Attach EWG guideline, health blurbs, filter tech, and national/state averages. */
export function enrichContaminantRows(rows: ContaminantRow[], stateCode: string): ContaminantRow[] {
  return rows.map(row => {
    const ewgG = EXTRA_EWG_GUIDELINES[row.name];
    const health = EXTRA_HEALTH_CONTEXT[row.name];
    const tech = getContaminantFilterTech(row.name);

    const nationalAvg =
      row.level != null ? getNationalContaminantAverage(row.name, row.unit) : null;
    const stateAvg =
      row.level != null && stateCode
        ? getStateContaminantAverage(stateCode, row.name, row.unit)
        : null;

    let ewgGuideline = row.ewgGuideline ?? ewgG?.limit ?? null;
    let ewgGuidelineLabel = row.ewgGuidelineLabel ?? ewgG?.label ?? null;
    let ewgTimesOver = row.ewgTimesOver ?? null;

    if (
      row.level != null &&
      ewgGuideline != null &&
      ewgGuideline > 0 &&
      (ewgG?.unit === row.unit || !ewgG?.unit)
    ) {
      ewgTimesOver = +(row.level / ewgGuideline).toFixed(1);
    }

    const benchmarkNote =
      nationalAvg != null || stateAvg != null
        ? [
            nationalAvg != null ? `U.S. utility avg (EWG Atlas sample): ${formatLevel(nationalAvg, row.unit)}` : null,
            stateAvg != null ? `${stateCode} utility avg: ${formatLevel(stateAvg, row.unit)}` : null,
          ]
            .filter(Boolean)
            .join(' · ')
        : null;

    return {
      ...row,
      ewgGuideline,
      ewgGuidelineLabel,
      ewgTimesOver,
      nationalAvg,
      stateAvg,
      healthEffects: row.healthEffects ?? health?.effects,
      filterCarbon: tech.carbon,
      filterRo: tech.ro,
      filterIonExchange: tech.ionExchange,
      note: benchmarkNote ? `${row.note} · ${benchmarkNote}` : row.note,
    };
  });
}
