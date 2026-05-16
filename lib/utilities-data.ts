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
  /** Operator-claimed listing; may be set in source JSON or `data/utility-ccr-overlays.json`. */
  isClaimed?: boolean;
  ccr?: UtilityCcrContent | null;
};

type UtilitiesPayload = {
  generatedAt: string;
  source: string;
  recordCount: number;
  utilities: UtilityJsonRecord[];
};

type CcrOverlayEntry = {
  isClaimed?: boolean;
  ccr?: UtilityCcrContent | null;
};

let payload: UtilitiesPayload | null = null;
let byStateSlug: Map<string, UtilityJsonRecord> | null = null;
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

/** Merge optional `data/utility-ccr-overlays.json` onto a raw utility row from `utilities.json`. */
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

function pairKey(state: string, slug: string): string {
  return `${state.toLowerCase()}/${slug.toLowerCase()}`;
}

export function loadUtilitiesPayload(): UtilitiesPayload {
  if (payload) return payload;
  const p = path.join(process.cwd(), "data", "utilities.json");
  if (!fs.existsSync(p)) {
    throw new Error("Missing data/utilities.json — run npm run fetch-utilities");
  }
  payload = JSON.parse(fs.readFileSync(p, "utf8")) as UtilitiesPayload;
  return payload;
}

/** Fast lookup for static pages / metadata. */
export function getUtilityByStateSlug(state: string, slug: string): UtilityJsonRecord | undefined {
  if (!byStateSlug) {
    const { utilities } = loadUtilitiesPayload();
    byStateSlug = new Map();
    for (const u of utilities) {
      byStateSlug.set(pairKey(u.state, u.slug), u);
    }
  }
  const raw = byStateSlug.get(pairKey(state, slug));
  return raw ? mergeUtilityCcrData(raw) : undefined;
}

export function getAllUtilityStaticParams(): { state: string; slug: string }[] {
  return loadUtilitiesPayload().utilities.map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));
}

/** Top N utilities by population for build-time prerender; remaining paths use ISR (`dynamicParams`). */
export function getTopUtilityStaticParamsByPopulation(limit: number): { state: string; slug: string }[] {
  const { utilities } = loadUtilitiesPayload();
  const sorted = [...utilities].sort((a, b) => {
    const pa = a.populationServed ?? 0;
    const pb = b.populationServed ?? 0;
    return pb - pa;
  });
  return sorted.slice(0, limit).map((u) => ({
    state: u.state.toLowerCase(),
    slug: u.slug,
  }));
}

export function getUniqueUtilityStatesLowercase(): string[] {
  const s = new Set<string>();
  for (const u of loadUtilitiesPayload().utilities) {
    s.add(u.state.toLowerCase());
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b, "en"));
}

export function getUtilitiesInState(stateLower: string): UtilityJsonRecord[] {
  const st = stateLower.toLowerCase();
  return loadUtilitiesPayload()
    .utilities.filter((u) => u.state.toLowerCase() === st)
    .map((u) => mergeUtilityCcrData(u));
}
