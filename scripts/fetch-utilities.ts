/**
 * Builds `data/utilities.json` from EPA SDWIS-derived public water system data.
 *
 * Default (`--source zip`): ECHO national **SDWA_latest_downloads** bulk ZIP (quarterly),
 * which matches the SDWIS data documented on ECHO and avoids hundreds of API calls
 * that trigger ECHO's “robotic query” block.
 *
 * Alternate (`--source echo`): EPA **echodata.epa.gov** `sdw_rest_services` flow
 * (same source as `echoSDWGetSystems` in the echor R package). Use sparingly;
 * re-run with per-state cache if blocked.
 *
 * SDWIS ORDS URL (interactive app, not bulk JSON):
 *   https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis-public-search/
 */

import { execFileSync, spawn } from "child_process";
import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";

import { parse as parseSync } from "csv-parse/sync";

const ECHO = "https://echodata.epa.gov/echo";
const SDWA_ZIP_URL = "https://echo.epa.gov/files/echodownloads/SDWA_latest_downloads.zip";

/** ECHO qcolumns: PWSName, PWSId, CitiesServed, StateCode, PrimarySourceDesc, PopulationServedCount, RulesVio */
const ECHO_QCOLUMNS = "1,2,3,4,13,14,28";

const STATE_CODES = [
  "AL", "AK", "AZ", "AR", "AS", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "GU", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PA",
  "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY",
];

const SOURCE_DESC: Record<string, string> = {
  GW: "Ground water",
  GWP: "Ground water purchased",
  SW: "Surface water",
  SWP: "Surface water purchased",
  GU: "Groundwater under influence of surface water",
  GUP: "Purchased ground water under influence of surface water source",
};

type CsvRow = Record<string, string>;

export type UtilityRecord = {
  pwsid: string;
  name: string;
  state: string;
  populationServed: number | null;
  citiesServed: string | null;
  violationCount: number | null;
  primarySource: string | null;
  slug: string;
};

function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function argvFlag(name: string): boolean {
  return process.argv.includes(name);
}

function argvSource(): "zip" | "echo" {
  const a = process.argv.find((x) => x.startsWith("--source="));
  if (!a) return "zip";
  const v = a.split("=")[1]?.toLowerCase();
  if (v === "echo") return "echo";
  return "zip";
}

/** Locate member path ending with `basename` inside a ZIP (e.g. SDWA_PUB_WATER_SYSTEMS.csv). */
function zipEntryPath(zipPath: string, basename: string): string {
  const out = execFileSync("zipinfo", ["-1", zipPath], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const lines = out.split(/\r?\n/).filter(Boolean);
  const hit = lines.find((l) => l === basename || l.endsWith("/" + basename));
  if (!hit) throw new Error(`Could not find ${basename} inside ${zipPath}`);
  return hit;
}

async function downloadZipIfNeeded(zipPath: string, refresh: boolean): Promise<void> {
  if (fs.existsSync(zipPath) && !refresh) {
    process.stderr.write(`Using cached ZIP (${zipPath})\n`);
    return;
  }
  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  process.stderr.write(`Downloading ${SDWA_ZIP_URL}\n`);
  const res = await fetch(SDWA_ZIP_URL);
  if (!res.ok) throw new Error(`SDWA ZIP HTTP ${res.status}`);
  const len = res.headers.get("content-length");
  const total = len ? parseInt(len, 10) : 0;
  let got = 0;
  const body = res.body;
  if (!body) throw new Error("No response body");
  const nodeReadable = Readable.fromWeb(body as import("stream/web").ReadableStream<Uint8Array>);
  const out = fs.createWriteStream(zipPath);
  for await (const chunk of nodeReadable) {
    const buf = chunk as Buffer;
    got += buf.length;
    if (total && got % (50 * 1024 * 1024) < buf.length) {
      process.stderr.write(`  ${(got / (1024 * 1024)).toFixed(0)} / ${(total / (1024 * 1024)).toFixed(0)} MiB\n`);
    }
    if (!out.write(buf)) await new Promise<void>((r) => out.once("drain", r));
  }
  out.end();
  await new Promise<void>((r, j) => out.on("finish", r).on("error", j));
  process.stderr.write(`Saved ${zipPath} (${(got / (1024 * 1024)).toFixed(0)} MiB)\n`);
}

function unzipCsvSource(zipPath: string, entryPath: string): {
  stream: NodeJS.ReadableStream;
  done: Promise<void>;
} {
  const child = spawn("unzip", ["-p", zipPath, entryPath], { stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr?.on("data", (c) => {
    stderr += c.toString();
  });
  const done = new Promise<void>((resolve, reject) => {
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`unzip -p failed (exit ${code}): ${stderr.trim()}`));
    });
    child.on("error", reject);
  });
  if (!child.stdout) throw new Error("unzip stdout missing");
  return { stream: child.stdout, done };
}

async function forEachZipCsvRow(
  zipPath: string,
  entryBase: string,
  onRow: (row: CsvRow) => void,
): Promise<void> {
  const entry = zipEntryPath(zipPath, entryBase);
  const { stream, done } = unzipCsvSource(zipPath, entry);
  const parser = stream.pipe(
    parse({
      columns: true,
      relax_quotes: true,
      trim: true,
      cast: false,
    }),
  );
  for await (const row of parser as AsyncIterable<CsvRow>) {
    onRow(row);
  }
  await done;
}

type SystemAccum = {
  quarter: string;
  pwsid: string;
  name: string;
  state: string;
  populationServed: number | null;
  primarySource: string | null;
};

function normQuarter(q: string | undefined): string {
  return (q ?? "").trim();
}

function parseNum(x: string | undefined): number | null {
  const s = (x ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

async function buildFromSdwaZip(zipPath: string): Promise<Omit<UtilityRecord, "slug">[]> {
  const systems = new Map<string, SystemAccum>();

  process.stderr.write(`Reading ${path.basename(zipPath)} → SDWA_PUB_WATER_SYSTEMS.csv …\n`);
  await forEachZipCsvRow(zipPath, "SDWA_PUB_WATER_SYSTEMS.csv", (row) => {
    const pwsid = (row.PWSID ?? "").trim();
    if (!pwsid) return;
    const q = normQuarter(row.SUBMISSIONYEARQUARTER);
    const prev = systems.get(pwsid);
    if (prev && q <= prev.quarter) return;

    const pfx = pwsid.slice(0, 2).toUpperCase();
    const usps = (row.STATE_CODE ?? "").trim().toUpperCase();
    /** PWSID leading letters = issuing jurisdiction (standard SDWIS); else USPS state from address. */
    const state = /^[A-Z]{2}$/.test(pfx) ? pfx : usps || pfx;
    const gw = (row.GW_SW_CODE ?? "").trim().toUpperCase();
    const primarySource = SOURCE_DESC[gw] ?? (gw ? gw : null);

    systems.set(pwsid, {
      quarter: q,
      pwsid,
      name: (row.PWS_NAME ?? "").trim(),
      state,
      populationServed: parseNum(row.POPULATION_SERVED_COUNT),
      primarySource,
    });
  });

  const cities = new Map<string, Set<string>>();
  process.stderr.write(`Reading SDWA_GEOGRAPHIC_AREAS.csv …\n`);
  await forEachZipCsvRow(zipPath, "SDWA_GEOGRAPHIC_AREAS.csv", (row) => {
    const pwsid = (row.PWSID ?? "").trim();
    const sys = systems.get(pwsid);
    if (!sys || normQuarter(row.SUBMISSIONYEARQUARTER) !== sys.quarter) return;
    const city = (row.CITY_SERVED ?? "").trim();
    if (!city) return;
    if (!cities.has(pwsid)) cities.set(pwsid, new Set());
    cities.get(pwsid)!.add(city);
  });

  const violations = new Map<string, number>();
  process.stderr.write(`Reading SDWA_VIOLATIONS_ENFORCEMENT.csv …\n`);
  await forEachZipCsvRow(zipPath, "SDWA_VIOLATIONS_ENFORCEMENT.csv", (row) => {
    const pwsid = (row.PWSID ?? "").trim();
    const sys = systems.get(pwsid);
    if (!sys || normQuarter(row.SUBMISSIONYEARQUARTER) !== sys.quarter) return;
    violations.set(pwsid, (violations.get(pwsid) ?? 0) + 1);
  });

  const out: Omit<UtilityRecord, "slug">[] = [];
  for (const s of Array.from(systems.values())) {
    if (!s.name) continue;
    const citySet = cities.get(s.pwsid);
    out.push({
      pwsid: s.pwsid,
      name: s.name,
      state: s.state,
      populationServed: s.populationServed,
      citiesServed: citySet?.size ? Array.from(citySet).sort((a, b) => a.localeCompare(b, "en")).join(", ") : null,
      violationCount: violations.get(s.pwsid) ?? 0,
      primarySource: s.primarySource,
    });
  }
  return out;
}

/** Per-state slug assignment: first occurrence keeps base slug; conflicts get `-{pwsid}`. */
function assignSlugs(records: Omit<UtilityRecord, "slug">[]): UtilityRecord[] {
  const byState = new Map<string, Omit<UtilityRecord, "slug">[]>();
  for (const r of records) {
    const st = r.state || "UN";
    if (!byState.has(st)) byState.set(st, []);
    byState.get(st)!.push(r);
  }

  const result: UtilityRecord[] = [];
  for (const [_state, list] of Array.from(byState.entries())) {
    const used = new Set<string>();
    for (const r of list) {
      let base = slugify(r.name);
      if (!base) base = `pws-${slugify(r.pwsid)}` || "utility";

      let sl = base;
      if (used.has(sl)) sl = `${base}-${r.pwsid}`.toLowerCase();

      used.add(sl);
      result.push({ ...r, slug: sl });
    }
  }
  return result;
}

// ─── ECHO API path (optional) ───────────────────────────────────────────────

function parseEchoJson(buf: string): {
  qid?: string;
  err?: string;
  robot?: boolean;
} {
  const json = JSON.parse(buf) as {
    Results?: { Error?: { ErrorMessage?: string }; QueryID?: string | number };
    Error?: { ErrorMessage?: string };
  };
  const msg = json.Results?.Error?.ErrorMessage ?? json.Error?.ErrorMessage;
  if (msg) {
    return { err: msg, robot: /robotic|programmed query/i.test(msg) };
  }
  const qidRaw = json.Results?.QueryID;
  if (qidRaw != null) return { qid: String(qidRaw) };
  return { err: "missing QueryID" };
}

async function echoFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 WaterCheckup/1.0",
      Accept: "application/json, text/csv;q=0.9,*/*;q=0.1",
    },
  });
}

async function echoGetSystemsQueryId(state: string): Promise<string> {
  const u = new URL(`${ECHO}/sdw_rest_services.get_systems`);
  u.searchParams.set("output", "JSON");
  u.searchParams.set("p_st", state.toLowerCase());
  u.searchParams.set("qcolumns", ECHO_QCOLUMNS);
  u.searchParams.set("responseset", "1000");
  const res = await echoFetch(u.toString());
  const txt = await res.text();
  if (!res.ok) throw new Error(`get_systems HTTP ${res.status} for ${state}`);
  const parsed = parseEchoJson(txt);
  if (parsed.err) throw new Error(`get_systems: ${parsed.err}`);
  if (!parsed.qid) throw new Error(`get_systems: missing QueryID for ${state}`);
  return parsed.qid;
}

async function echoDownloadCsv(qid: string): Promise<string> {
  const u = new URL(`${ECHO}/sdw_rest_services.get_download`);
  u.searchParams.set("qid", qid);
  u.searchParams.set("qcolumns", ECHO_QCOLUMNS);
  const res = await echoFetch(u.toString());
  if (!res.ok) throw new Error(`get_download HTTP ${res.status}`);
  return res.text();
}

type EchoCsvRow = {
  PWSName?: string;
  PWSId?: string;
  CitiesServed?: string;
  StateCode?: string;
  PrimarySourceDesc?: string;
  PopulationServedCount?: string;
  RulesVio?: string;
};

function parseEchoUtilitiesCsv(csv: string): Omit<UtilityRecord, "slug">[] {
  const rows = parseSync(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  }) as EchoCsvRow[];

  const out: Omit<UtilityRecord, "slug">[] = [];
  for (const r of rows) {
    const pwsid = (r.PWSId ?? "").trim();
    const name = (r.PWSName ?? "").trim();
    if (!pwsid || !name) continue;

    const pop = r.PopulationServedCount?.trim();
    const vio = r.RulesVio?.trim();

    out.push({
      pwsid,
      name,
      state: (r.StateCode ?? "").trim().toUpperCase(),
      populationServed: pop === "" || pop == null ? null : Number(pop),
      citiesServed: (r.CitiesServed ?? "").trim() || null,
      primarySource: (r.PrimarySourceDesc ?? "").trim() || null,
      violationCount: vio === "" || vio == null ? null : Number(vio),
    });
  }
  return out;
}

async function buildFromEchoApi(refresh: boolean): Promise<Omit<UtilityRecord, "slug">[]> {
  const cacheDir = path.join(process.cwd(), "data", ".utilities-echo-cache");
  fs.mkdirSync(cacheDir, { recursive: true });

  const byPwsid = new Map<string, Omit<UtilityRecord, "slug">>();
  let i = 0;

  for (const st of STATE_CODES) {
    i += 1;
    const cacheFile = path.join(cacheDir, `${st}.json`);
    if (fs.existsSync(cacheFile) && !refresh) {
      const rows = JSON.parse(fs.readFileSync(cacheFile, "utf8")) as Omit<UtilityRecord, "slug">[];
      for (const r of rows) byPwsid.set(r.pwsid, r);
      process.stderr.write(`[${i}/${STATE_CODES.length}] ${st} … cache (${rows.length})\n`);
      continue;
    }

    process.stderr.write(`[${i}/${STATE_CODES.length}] ${st} … fetching\n`);
    let attempt = 0;
    let rows: Omit<UtilityRecord, "slug">[] | null = null;
    while (attempt < 6 && !rows) {
      attempt += 1;
      try {
        const qid = await echoGetSystemsQueryId(st);
        await sleep(2500);
        const csv = await echoDownloadCsv(qid);
        rows = parseEchoUtilitiesCsv(csv);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const blocked = /robotic|programmed query/i.test(msg);
        process.stderr.write(`  attempt ${attempt}: ${msg}${blocked ? " — backing off 120s" : ""}\n`);
        if (blocked) await sleep(120_000);
        else await sleep(5000);
      }
    }
    if (!rows) {
      process.stderr.write(`  failed after retries — use ZIP source or try later\n`);
      continue;
    }
    fs.writeFileSync(cacheFile, JSON.stringify(rows), "utf8");
    for (const r of rows) byPwsid.set(r.pwsid, r);
    await sleep(4000);
  }

  return Array.from(byPwsid.values());
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const outPath = path.join(process.cwd(), "data", "utilities.json");
  const refresh = argvFlag("--refresh");
  const source = argvSource();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let base: Omit<UtilityRecord, "slug">[];
  if (source === "echo") {
    base = await buildFromEchoApi(refresh);
  } else {
    const zipPath = path.join(process.cwd(), "data", ".sdwa-cache", "SDWA_latest_downloads.zip");
    await downloadZipIfNeeded(zipPath, refresh);
    base = await buildFromSdwaZip(zipPath);
  }

  const merged = assignSlugs(base);
  merged.sort((a, b) => (a.state + a.slug).localeCompare(b.state + b.slug, "en"));

  const payload = {
    generatedAt: new Date().toISOString(),
    source:
      source === "echo"
        ? "EPA ECHO sdw_rest_services (SDWIS/Fed snapshot)"
        : `ECHO SDWA national download CSVs inside ${SDWA_ZIP_URL}`,
    sdwisPublicSearchUrl: "https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis-public-search/",
    recordCount: merged.length,
    utilities: merged,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload), "utf8");
  process.stderr.write(`Wrote ${merged.length} records → ${outPath}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
