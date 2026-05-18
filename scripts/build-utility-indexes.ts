/**
 * Splits `data/utilities.json` into per-state shards for fast runtime loads.
 * Run automatically before `next build` via package.json.
 */
import * as fs from "fs";
import * as path from "path";

import type { UtilityJsonRecord } from "../lib/utilities-data";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "data", "utilities.json");
const OUT = path.join(ROOT, "data", "utilities-index");
const SITEMAP_TOP_N = 1_500;
const PRERENDER_TOP_N = 1_500;

type CcrOverlayEntry = { isClaimed?: boolean; ccr?: UtilityJsonRecord["ccr"] };

function loadOverlay(): Map<string, CcrOverlayEntry> {
  const map = new Map<string, CcrOverlayEntry>();
  const p = path.join(ROOT, "data", "utility-ccr-overlays.json");
  if (!fs.existsSync(p)) return map;
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8")) as { byPwsid?: Record<string, CcrOverlayEntry> };
    for (const [k, v] of Object.entries(raw.byPwsid ?? {})) {
      if (k && v) map.set(k.trim().toUpperCase(), v);
    }
  } catch {
    /* ignore */
  }
  return map;
}

function mergeOverlay(u: UtilityJsonRecord, overlay: Map<string, CcrOverlayEntry>): UtilityJsonRecord {
  const merged = { ...u };
  const o = overlay.get(u.pwsid.trim().toUpperCase());
  if (o) {
    if (o.isClaimed !== undefined) merged.isClaimed = o.isClaimed;
    if (o.ccr !== undefined) merged.ccr = o.ccr;
  }
  merged.isClaimed = merged.isClaimed === true;
  return merged;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.warn("build-utility-indexes: skip — data/utilities.json not found");
    return;
  }

  const overlay = loadOverlay();
  const payload = JSON.parse(fs.readFileSync(SRC, "utf8")) as {
    generatedAt?: string;
    utilities: UtilityJsonRecord[];
  };

  const byState = new Map<string, UtilityJsonRecord[]>();
  for (const raw of payload.utilities) {
    const u = mergeOverlay(raw, overlay);
    const st = u.state.toUpperCase();
    if (!byState.has(st)) byState.set(st, []);
    byState.get(st)!.push(u);
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  const stateDir = path.join(OUT, "state");
  fs.mkdirSync(stateDir, { recursive: true });

  const stateMeta: { code: string; count: number }[] = [];
  for (const [code, list] of Array.from(byState.entries())) {
    list.sort((a, b) => a.name.localeCompare(b.name, "en"));
    fs.writeFileSync(path.join(stateDir, `${code.toLowerCase()}.json`), JSON.stringify(list));
    stateMeta.push({ code, count: list.length });
  }
  stateMeta.sort((a, b) => a.code.localeCompare(b.code));

  const allMerged = Array.from(byState.values()).flat();
  const topByPop = [...allMerged].sort(
    (a, b) => (b.populationServed ?? 0) - (a.populationServed ?? 0),
  );
  const sitemapTop = topByPop.slice(0, SITEMAP_TOP_N).map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));
  const prerenderTop = topByPop.slice(0, PRERENDER_TOP_N).map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));

  fs.writeFileSync(
    path.join(OUT, "meta.json"),
    JSON.stringify({
      generatedAt: payload.generatedAt ?? new Date().toISOString(),
      recordCount: allMerged.length,
      states: stateMeta,
    }),
  );
  fs.writeFileSync(path.join(OUT, "sitemap-top.json"), JSON.stringify(sitemapTop));
  fs.writeFileSync(path.join(OUT, "prerender-top.json"), JSON.stringify(prerenderTop));

  console.log(
    `build-utility-indexes: ${allMerged.length} utilities → ${stateMeta.length} state files, sitemap top ${sitemapTop.length}`,
  );
}

main();
