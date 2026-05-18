/**
 * Build `data/pwsid-ccr-contaminants.json` from EWG Tap Water Atlas system pages.
 *
 * Usage:
 *   npx tsx scripts/build-pwsid-ccr-contaminants.ts --limit 500
 *   npx tsx scripts/build-pwsid-ccr-contaminants.ts --pwsid MA3229000 --force
 *   npx tsx scripts/build-pwsid-ccr-contaminants.ts --dry-run --limit 10
 *
 * Respects EWG: use a modest --delay (default 2000ms). Re-run weekly or after fetch-utilities.
 */

import * as fs from 'fs';
import * as path from 'path';

import {
  parseEwgSystemPageHtml,
  severityFromLevel,
} from '../lib/ewg-tapwater-parse';
import { pwsidCcrContaminantsDataPath } from '../lib/pwsid-ccr-contaminants';

const ROOT = process.cwd();
const INDEX_DIR = path.join(ROOT, 'data', 'utilities-index');
const OUT_PATH = pwsidCcrContaminantsDataPath();
const EWG_SYSTEM = 'https://www.ewg.org/tapwater/system.php';

const USER_AGENT = 'WaterCheckupBuild/1.0 (+https://watercheckup.com; data-ingest)';

/** Copy EWG rows onto EPA PWSIDs used in zip overrides / zip-lookup */
const PWSID_ALIASES: Record<string, string> = {
  MA3218010: 'MA6000000',
  MA3229000: 'MA4336000',
};

type UtilityRef = { pwsid: string; name: string; state: string; slug: string };
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
  generatedAt: string;
  source: string;
  recordCount: number;
  byPwsid: Record<string, StoredRow[]>;
};

function argNum(flag: string, fallback: number): number {
  const a = process.argv.find(x => x.startsWith(`${flag}=`));
  if (!a) return fallback;
  const n = parseInt(a.split('=')[1] ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function loadExisting(): Payload {
  if (!fs.existsSync(OUT_PATH)) {
    return {
      generatedAt: new Date().toISOString(),
      source: 'ewg-tap-water-atlas',
      recordCount: 0,
      byPwsid: {},
    };
  }
  const raw = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) as Payload;
  return {
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    source: raw.source ?? 'ewg-tap-water-atlas',
    recordCount: raw.recordCount ?? 0,
    byPwsid: raw.byPwsid ?? {},
  };
}

function loadTopUtilities(limit: number): UtilityRef[] {
  const prerenderPath = path.join(INDEX_DIR, 'prerender-top.json');
  const legacyPath = path.join(ROOT, 'data', 'utilities.json');

  if (fs.existsSync(prerenderPath)) {
    const top = JSON.parse(fs.readFileSync(prerenderPath, 'utf8')) as { state: string; slug: string }[];
    const out: UtilityRef[] = [];
    const stateCache = new Map<string, UtilityRef[]>();

    for (const { state, slug } of top) {
      if (out.length >= limit) break;
      const st = state.toLowerCase();
      if (!stateCache.has(st)) {
        const file = path.join(INDEX_DIR, 'state', `${st}.json`);
        if (!fs.existsSync(file)) continue;
        const list = JSON.parse(fs.readFileSync(file, 'utf8')) as {
          pwsid: string;
          name: string;
          state: string;
          slug: string;
        }[];
        stateCache.set(
          st,
          list.map(u => ({
            pwsid: u.pwsid,
            name: u.name,
            state: u.state,
            slug: u.slug,
          })),
        );
      }
      const hit = stateCache.get(st)?.find(u => u.slug === slug);
      if (hit) out.push(hit);
    }
    if (out.length) return out;
  }

  if (!fs.existsSync(legacyPath)) {
    throw new Error('Need data/utilities-index/prerender-top.json or data/utilities.json');
  }

  const payload = JSON.parse(fs.readFileSync(legacyPath, 'utf8')) as {
    utilities: { pwsid: string; name: string; state: string; slug: string; populationServed?: number | null }[];
  };

  return [...payload.utilities]
    .sort((a, b) => (b.populationServed ?? 0) - (a.populationServed ?? 0))
    .slice(0, limit)
    .map(u => ({
      pwsid: u.pwsid,
      name: u.name,
      state: u.state,
      slug: u.slug,
    }));
}

async function fetchEwgContaminants(pwsid: string): Promise<StoredRow[] | null> {
  const url = `${EWG_SYSTEM}?pws=${encodeURIComponent(pwsid)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const parsed = parseEwgSystemPageHtml(html);
  if (parsed.length < 3) return null;

  return parsed.map(p => {
    const limit = p.limit;
    const unit = p.limit != null ? p.limitUnit : p.unit;
    return {
      name: p.name,
      level: +p.level.toFixed(unit === 'ppb' || unit === 'ppt' ? 2 : 3),
      limit,
      unit,
      severity: severityFromLevel(p.level, limit, unit),
      note: 'EWG Tap Water Atlas utility average (2021–2023)',
      source: 'EWG Tap Water Atlas',
    };
  });
}

async function main() {
  const limit = argNum('--limit', 500);
  const delayMs = argNum('--delay', 2000);
  const minRows = argNum('--min-rows', 3);
  const dryRun = hasFlag('--dry-run');
  const force = hasFlag('--force');
  const onlyPwsid = process.argv.find(x => x.startsWith('--pwsid='))?.split('=')[1]?.toUpperCase();

  const payload = loadExisting();
  const targets = onlyPwsid
    ? [{ pwsid: onlyPwsid, name: onlyPwsid, state: '', slug: '' }]
    : loadTopUtilities(limit);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`build-pwsid-ccr-contaminants: ${targets.length} utilities, delay ${delayMs}ms`);

  for (let i = 0; i < targets.length; i++) {
    const u = targets[i];
    const key = u.pwsid.trim().toUpperCase();
    if (!key) continue;

    if (!force && payload.byPwsid[key]?.length) {
      skipped++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${targets.length}] ${key} ${u.name.slice(0, 40)}… `);

    try {
      const rows = await fetchEwgContaminants(key);
      if (!rows || rows.length < minRows) {
        console.log('skip (no EWG data)');
        failed++;
      } else if (dryRun) {
        console.log(`dry-run ${rows.length} rows`);
        added++;
      } else {
        payload.byPwsid[key] = rows;
        console.log(`ok (${rows.length})`);
        added++;
      }
    } catch (e) {
      console.log(`error: ${(e as Error).message}`);
      failed++;
    }

    if (i < targets.length - 1) await sleep(delayMs);
  }

  if (!dryRun) {
    for (const [epaId, ewgId] of Object.entries(PWSID_ALIASES)) {
      if (payload.byPwsid[ewgId]?.length && !payload.byPwsid[epaId]?.length) {
        payload.byPwsid[epaId] = payload.byPwsid[ewgId];
      }
    }

    payload.generatedAt = new Date().toISOString();
    payload.source = 'ewg-tap-water-atlas';
    payload.recordCount = Object.keys(payload.byPwsid).length;
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2));
    console.log(`Wrote ${OUT_PATH} — ${payload.recordCount} PWSIDs`);
  }

  console.log(`Done: added/updated ${added}, skipped ${skipped}, no-data/errors ${failed}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
