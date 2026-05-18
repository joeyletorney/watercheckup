/**
 * CCR / state monitoring averages keyed by PWSID — used when live EPA sample APIs
 * return only LCR lead/copper (common) but utility reporting has fuller chemistry.
 *
 * Data file: `data/pwsid-ccr-contaminants.json` (built via scripts/build-pwsid-ccr-contaminants.ts)
 */

import fs from 'fs';
import path from 'path';

import type { ContaminantRow } from '@/lib/water-contaminants';

const DATA_PATH = path.join(process.cwd(), 'data', 'pwsid-ccr-contaminants.json');

/** EPA PWSID on site → EWG Tap Water Atlas PWSID when they differ */
const PWSID_EWG_ALIASES: Record<string, string> = {
  MA3218010: 'MA6000000',
  MA3229000: 'MA4336000',
};

type StoredRow = {
  name: string;
  level: number;
  limit: number | null;
  unit: string;
  severity: 'high' | 'moderate' | 'low';
  note: string;
  source?: string;
};

type Payload = {
  generatedAt?: string;
  source?: string;
  recordCount?: number;
  byPwsid?: Record<string, StoredRow[]>;
};

let byPwsidCache: Map<string, ContaminantRow[]> | null = null;

function toContaminantRows(rows: StoredRow[]): ContaminantRow[] {
  return rows.map(r => ({
    name: r.name,
    level: r.level,
    limit: r.limit,
    unit: r.unit,
    severity: r.severity,
    note: r.note,
    source: r.source ?? 'Utility CCR / state monitoring',
  }));
}

function loadByPwsidMap(): Map<string, ContaminantRow[]> {
  if (byPwsidCache) return byPwsidCache;

  byPwsidCache = new Map();

  if (!fs.existsSync(DATA_PATH)) return byPwsidCache;

  try {
    const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as Payload;
    for (const [pwsid, rows] of Object.entries(raw.byPwsid ?? {})) {
      const key = pwsid.trim().toUpperCase();
      if (!key || !Array.isArray(rows) || !rows.length) continue;
      byPwsidCache.set(key, toContaminantRows(rows));
    }
  } catch {
    /* corrupt file — treat as empty */
  }

  return byPwsidCache;
}

/**
 * Fill gaps when EPA live samples are sparse (typical: LCR lead only).
 * Does not overwrite analytes already measured from EPA, UCMR, or EWG zip data.
 */
export function mergePwsidCcrContaminants(
  target: ContaminantRow[],
  pwsid: string,
  options?: { minMeasuredBeforeFill?: number },
): void {
  const key = pwsid.trim().toUpperCase();
  const map = loadByPwsidMap();
  const template =
    map.get(key) ?? map.get(PWSID_EWG_ALIASES[key] ?? '') ?? undefined;
  if (!template?.length) return;

  const min = options?.minMeasuredBeforeFill ?? 8;
  const measured = target.filter(c => c.level != null && !c.violationBased).length;
  if (measured >= min) return;

  const names = new Set(target.map(c => c.name));
  for (const row of template) {
    if (names.has(row.name)) continue;
    target.push({ ...row });
    names.add(row.name);
  }
}

/** For scripts / admin: path to the JSON bundle */
export function pwsidCcrContaminantsDataPath(): string {
  return DATA_PATH;
}
