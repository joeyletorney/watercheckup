import fs from "fs";
import path from "path";

export type UtilityCcrContent = {
  reportYear: number;
  keyFindings: string;
  pdfUrl?: string | null;
  lastUpdated: string;
};

export type UtilityJsonRecord = {
  pwsid: string;
  name: string;
  state: string;
  populationServed: number | null;
  citiesServed: string | null;
  violationCount: number | null;
  primarySource: string | null;
  slug: string;
  isClaimed?: boolean;
  ccr?: UtilityCcrContent | null;
};

type UtilitiesPayload = {
  generatedAt: string;
  source: string;
  recordCount: number;
  utilities: UtilityJsonRecord[];
};

type IndexMeta = {
  generatedAt: string;
  recordCount: number;
  states: { code: string; count: number }[];
};

type StateCache = {
  list: UtilityJsonRecord[];
  bySlug: Map<string, UtilityJsonRecord>;
};

const INDEX_DIR = path.join(process.cwd(), "data", "utilities-index");
const LEGACY_SRC = path.join(process.cwd(), "data", "utilities.json");

let legacyPayload: UtilitiesPayload | null = null;
let indexMeta: IndexMeta | null = null;
const stateCache = new Map<string, StateCache>();
let sitemapTopCache: { state: string; slug: string }[] | null = null;
let prerenderTopCache: { state: string; slug: string }[] | null = null;

function hasIndexShards(): boolean {
  return fs.existsSync(path.join(INDEX_DIR, "meta.json"));
}

function loadIndexMeta(): IndexMeta {
  if (indexMeta) return indexMeta;
  const p = path.join(INDEX_DIR, "meta.json");
  indexMeta = JSON.parse(fs.readFileSync(p, "utf8")) as IndexMeta;
  return indexMeta;
}

function loadStateCache(stateLower: string): StateCache | null {
  const key = stateLower.toLowerCase();
  if (stateCache.has(key)) return stateCache.get(key)!;

  const file = path.join(INDEX_DIR, "state", `${key}.json`);
  if (!fs.existsSync(file)) return null;

  const list = JSON.parse(fs.readFileSync(file, "utf8")) as UtilityJsonRecord[];
  const bySlug = new Map<string, UtilityJsonRecord>();
  for (const u of list) {
    bySlug.set(u.slug.toLowerCase(), u);
  }
  const cache: StateCache = { list, bySlug };
  stateCache.set(key, cache);
  return cache;
}

/** @deprecated Build-time / scripts only. Runtime should use index shards. */
export function loadUtilitiesPayload(): UtilitiesPayload {
  if (legacyPayload) return legacyPayload;
  if (!fs.existsSync(LEGACY_SRC)) {
    throw new Error("Missing data/utilities.json — run npm run fetch-utilities");
  }
  legacyPayload = JSON.parse(fs.readFileSync(LEGACY_SRC, "utf8")) as UtilitiesPayload;
  return legacyPayload;
}

export function getUtilityByStateSlug(state: string, slug: string): UtilityJsonRecord | undefined {
  if (hasIndexShards()) {
    const cache = loadStateCache(state);
    return cache?.bySlug.get(slug.toLowerCase());
  }

  if (!legacyByStateSlug) {
    const { utilities } = loadUtilitiesPayload();
    legacyByStateSlug = new Map();
    for (const u of utilities) {
      legacyByStateSlug.set(pairKey(u.state, u.slug), u);
    }
  }
  const raw = legacyByStateSlug.get(pairKey(state, slug));
  return raw ? mergeUtilityCcrData(raw) : undefined;
}

let legacyByStateSlug: Map<string, UtilityJsonRecord> | null = null;

function pairKey(state: string, slug: string): string {
  return `${state.toLowerCase()}/${slug.toLowerCase()}`;
}

type CcrOverlayEntry = {
  isClaimed?: boolean;
  ccr?: UtilityCcrContent | null;
};

let ccrOverlayByPwsid: Map<string, CcrOverlayEntry> | null = null;

function loadCcrOverlayMap(): Map<string, CcrOverlayEntry> {
  if (ccrOverlayByPwsid) return ccrOverlayByPwsid;
  ccrOverlayByPwsid = new Map();
  const p = path.join(process.cwd(), "data", "utility-ccr-overlays.json");
  if (!fs.existsSync(p)) return ccrOverlayByPwsid;
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8")) as { byPwsid?: Record<string, CcrOverlayEntry> };
    for (const [k, v] of Object.entries(raw.byPwsid ?? {})) {
      if (k && v && typeof v === "object") ccrOverlayByPwsid.set(k.trim().toUpperCase(), v);
    }
  } catch {
    /* ignore corrupt overlay */
  }
  return ccrOverlayByPwsid;
}

/** Merge optional `data/utility-ccr-overlays.json` onto a raw utility row. */
export function mergeUtilityCcrData(u: UtilityJsonRecord): UtilityJsonRecord {
  const merged: UtilityJsonRecord = { ...u };
  const o = loadCcrOverlayMap().get(u.pwsid.trim().toUpperCase());
  if (o) {
    if (o.isClaimed !== undefined) merged.isClaimed = o.isClaimed;
    if (o.ccr !== undefined) merged.ccr = o.ccr;
  }
  merged.isClaimed = merged.isClaimed === true;
  return merged;
}

export function getAllUtilityStaticParams(): { state: string; slug: string }[] {
  if (hasIndexShards()) {
    return loadPrerenderTopParams();
  }
  return loadUtilitiesPayload().utilities.map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));
}

function loadSitemapTopParams(): { state: string; slug: string }[] {
  if (sitemapTopCache) return sitemapTopCache;
  const p = path.join(INDEX_DIR, "sitemap-top.json");
  sitemapTopCache = JSON.parse(fs.readFileSync(p, "utf8")) as { state: string; slug: string }[];
  return sitemapTopCache;
}

function loadPrerenderTopParams(): { state: string; slug: string }[] {
  if (prerenderTopCache) return prerenderTopCache;
  const p = path.join(INDEX_DIR, "prerender-top.json");
  if (fs.existsSync(p)) {
    prerenderTopCache = JSON.parse(fs.readFileSync(p, "utf8")) as { state: string; slug: string }[];
    return prerenderTopCache;
  }
  return loadSitemapTopParams();
}

/** Precomputed top utilities for sitemap (no sort of full catalog at runtime). */
export function getTopUtilityStaticParamsByPopulation(limit: number): { state: string; slug: string }[] {
  if (hasIndexShards()) {
    return loadSitemapTopParams().slice(0, limit);
  }
  const { utilities } = loadUtilitiesPayload();
  const sorted = [...utilities].sort((a, b) => (b.populationServed ?? 0) - (a.populationServed ?? 0));
  return sorted.slice(0, limit).map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));
}

export function getUniqueUtilityStatesLowercase(): string[] {
  if (hasIndexShards()) {
    return loadIndexMeta().states.map((s) => s.code.toLowerCase());
  }
  const s = new Set<string>();
  for (const u of loadUtilitiesPayload().utilities) {
    s.add(u.state.toLowerCase());
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b, "en"));
}

export function getStateUtilityCount(stateLower: string): number {
  if (hasIndexShards()) {
    const st = stateLower.toUpperCase();
    const row = loadIndexMeta().states.find((s) => s.code === st);
    return row?.count ?? 0;
  }
  return getUtilitiesInState(stateLower).length;
}

export function getUtilitiesInState(stateLower: string): UtilityJsonRecord[] {
  if (hasIndexShards()) {
    return loadStateCache(stateLower)?.list ?? [];
  }
  const st = stateLower.toLowerCase();
  return loadUtilitiesPayload()
    .utilities.filter((u) => u.state.toLowerCase() === st)
    .map((u) => mergeUtilityCcrData(u));
}

export const UTILITIES_PAGE_SIZE = 50;

export type UtilitiesPageResult = {
  items: UtilityJsonRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: string;
};

export function getUtilitiesInStatePage(
  stateLower: string,
  page: number,
  pageSize: number = UTILITIES_PAGE_SIZE,
  query = "",
): UtilitiesPageResult {
  const list = getUtilitiesInState(stateLower);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.pwsid.toLowerCase().includes(q) ||
          (u.citiesServed?.toLowerCase().includes(q) ?? false),
      )
    : list;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
    query: q,
  };
}
