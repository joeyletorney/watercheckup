"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CITIES } from "@/app/water/[city]/cities-data";
import {
  analyzeHardnessMgL,
  type HardnessAnalysis,
  type HardnessTier,
  toPpm,
} from "@/lib/water-hardness-shared";
import { findCitySlugByZip } from "@/lib/find-city-by-zip";

const AMAZON = (query: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=watercheck20-20`;

const cardStyle: CSSProperties = {
  padding: "14px 16px",
  background: "#0d2240",
  border: "1px solid #1a3a5c",
  borderRadius: 10,
  marginBottom: 14,
};

const inputStyle: CSSProperties = {
  width: "100%",
  maxWidth: 280,
  padding: "11px 14px",
  background: "#071828",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
};

type WaterApiContaminant = { name?: string; level?: number; unit?: string };

function tierForSolutions(t: HardnessTier | null): HardnessTier | "none" {
  return t ?? "none";
}

function SolutionPicks({ tier }: { tier: HardnessTier | null }) {
  const t = tierForSolutions(tier);
  if (t === "none") {
    return (
      <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
        Run the ZIP lookup or manual calculator above to see a tailored recommendation. General options are described in the{" "}
        <a href="#hard-water-solutions" style={{ color: "#67e8f9" }}>
          Hard water solutions
        </a>{" "}
        section below.
      </p>
    );
  }

  const rows =
    t === "very_hard"
      ? {
          title: "Recommended: whole-home water softener",
          body: "Ion-exchange softeners remove the calcium and magnesium that cause scale. For very hard water this is usually the most reliable fix for plumbing and appliances.",
          href: AMAZON("salt based water softener whole house"),
          linkLabel: "Browse water softeners on Amazon →",
        }
      : t === "hard"
        ? {
            title: "Recommended: scale prevention / conditioning",
            body: "Before full softening, some households use salt-free conditioners or cartridge systems that reduce scale on fixtures. Pair with RO at the tap if you also want pristine drinking water.",
            href: AMAZON("salt free water conditioner scale prevention"),
            linkLabel: "Browse descaling / conditioner options →",
          }
        : {
            title: "Recommended: maintenance or simple filtration",
            body: "Soft to moderately hard water often needs no softener. A certified carbon or multistage under-sink filter can still improve taste and reduce chlorine without removing all minerals.",
            href: AMAZON("nsf certified under sink water filter"),
            linkLabel: "Browse certified filters on Amazon →",
          };

  return (
    <div
      style={{
        padding: "18px 20px",
        background: "linear-gradient(135deg,#071828,#0a1e30)",
        border: "1px solid #0891b244",
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 8 }}>
        FOR YOUR RESULT
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>{rows.title}</div>
      <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.65, margin: "0 0 14px" }}>{rows.body}</p>
      <a
        href={rows.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 14, fontWeight: 700, color: "#67e8f9", textDecoration: "none" }}
      >
        {rows.linkLabel}
      </a>
    </div>
  );
}

function ResultBlock({
  analysis,
  extra,
}: {
  analysis: HardnessAnalysis;
  extra?: ReactNode;
}) {
  return (
    <div style={{ ...cardStyle, border: `1px solid ${analysis.border}55` }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            padding: "6px 12px",
            borderRadius: 8,
            background: `${analysis.color}18`,
            color: analysis.color,
            border: `1px solid ${analysis.border}44`,
          }}
        >
          {analysis.label.toUpperCase()}
        </span>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9" }}>{analysis.ppm} ppm</span>
        <span style={{ fontSize: 15, color: "#94a3b8" }}>{analysis.gpg} gpg</span>
      </div>
      <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 12px" }}>{analysis.explanation}</p>
      {extra}
    </div>
  );
}

export function WaterHardnessClient() {
  const searchParams = useSearchParams();
  const [zip, setZip] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipAnalysis, setZipAnalysis] = useState<HardnessAnalysis | null>(null);
  const [zipExtra, setZipExtra] = useState<ReactNode>(null);

  const [manualVal, setManualVal] = useState("");
  const [manualUnit, setManualUnit] = useState<"ppm" | "gpg" | "mgL">("ppm");
  const [manualAnalysis, setManualAnalysis] = useState<HardnessAnalysis | null>(null);

  const [activeTier, setActiveTier] = useState<HardnessTier | null>(null);

  const applyTier = useCallback((a: HardnessAnalysis | null) => {
    setActiveTier(a?.tier ?? null);
  }, []);

  const runZipLookup = useCallback(
    async (zRaw: string) => {
      setZipError(null);
      setZipAnalysis(null);
      setZipExtra(null);
      const z = zRaw.trim();
      if (!/^\d{5}$/.test(z)) {
        setZipError("Enter a valid 5-digit ZIP code.");
        applyTier(null);
        return;
      }
      setZipLoading(true);
      try {
        const slug = findCitySlugByZip(z);
        let ppm: number | undefined;

        const res = await fetch(`/api/water?zip=${encodeURIComponent(z)}`);
        const data = await res.json().catch(() => ({}));

        if (res.ok && Array.isArray(data.contaminants)) {
          const h = (data.contaminants as WaterApiContaminant[]).find(
            (c) => c.name === "Hardness" && (c.unit === "mg/L" || c.unit === "ppm" || !c.unit),
          );
          if (h != null && typeof h.level === "number" && Number.isFinite(h.level)) {
            ppm = h.level;
          }
        }

        if (ppm === undefined) {
          setZipError(
            res.ok
              ? "We found your utility but no hardness value is attached to this ZIP in our EPA/EWG snapshot yet. Use the manual calculator with a reading from your utility’s Consumer Confidence Report or a home test."
              : typeof data.error === "string"
                ? data.error
                : "Could not look up that ZIP. Try another code or the manual calculator.",
          );
          if (slug) {
            setZipExtra(
              <p style={{ margin: "12px 0 0", fontSize: 14 }}>
                <Link href={`/water/${slug}`} style={{ color: "#67e8f9", fontWeight: 700 }}>
                  Open full water report for {CITIES[slug]?.name ?? slug} →
                </Link>
              </p>,
            );
          }
          applyTier(null);
          return;
        }

        const a = analyzeHardnessMgL(ppm);
        setZipAnalysis(a);
        applyTier(a);

        const cityLink =
          slug != null ? (
            <p style={{ margin: "12px 0 0", fontSize: 14 }}>
              <Link href={`/water/${slug}`} style={{ color: "#67e8f9", fontWeight: 700 }}>
                See full tap water report for {CITIES[slug]!.name} →
              </Link>
            </p>
          ) : res.ok && data.city ? (
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "#64748b" }}>
              Area: {data.city}.{" "}
              <Link href={`/results/${z}`} style={{ color: "#67e8f9", fontWeight: 700 }}>
                Open ZIP report →
              </Link>
            </p>
          ) : null;

        setZipExtra(cityLink);
      } catch {
        setZipError("Network error. Try again.");
        applyTier(null);
      } finally {
        setZipLoading(false);
      }
    },
    [applyTier],
  );

  const urlRanRef = useRef(false);
  useEffect(() => {
    const z = searchParams.get("zip");
    if (z && /^\d{5}$/.test(z)) setZip(z);
  }, [searchParams]);

  useEffect(() => {
    const z = searchParams.get("zip");
    if (!z || !/^\d{5}$/.test(z) || urlRanRef.current) return;
    urlRanRef.current = true;
    void runZipLookup(z);
  }, [searchParams, runZipLookup]);

  async function submitZip(e: FormEvent) {
    e.preventDefault();
    await runZipLookup(zip);
  }

  function submitManual(e: FormEvent) {
    e.preventDefault();
    setManualAnalysis(null);
    const n = parseFloat(manualVal.replace(/,/g, ""));
    const ppm = toPpm(n, manualUnit);
    if (!Number.isFinite(ppm) || ppm < 0) {
      setManualAnalysis(null);
      applyTier(null);
      return;
    }
    const a = analyzeHardnessMgL(ppm);
    setManualAnalysis(a);
    applyTier(a);
  }

  return (
    <div id="tools">
      <div style={{ marginBottom: 36 }} id="zip-lookup">
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#0891b2",
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          LOOKUP BY ZIP
        </div>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.6 }}>
          Uses WaterCheckup&apos;s water API (EPA SDWIS, EWG Atlas hardness where published for your ZIP, and USGS state
          snapshots). If no hardness row is bundled for your utility yet, use the manual calculator.
        </p>
        <form onSubmit={submitZip} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
          <label style={{ display: "block", width: "100%", fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>
            Enter your ZIP code
          </label>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="e.g. 60601"
            style={inputStyle}
            inputMode="numeric"
            autoComplete="postal-code"
          />
          <button
            type="submit"
            disabled={zipLoading}
            style={{
              padding: "11px 22px",
              border: "none",
              borderRadius: 8,
              background: zipLoading ? "#0e6080" : "linear-gradient(135deg,#0891b2,#06b6d4)",
              color: "#fff",
              fontWeight: 800,
              cursor: zipLoading ? "not-allowed" : "pointer",
            }}
          >
            {zipLoading ? "Looking up…" : "Look up"}
          </button>
        </form>
        {zipError && (
          <p style={{ color: "#f87171", fontSize: 14, lineHeight: 1.55, margin: "0 0 12px" }}>{zipError}</p>
        )}
        {zipExtra}
      </div>

      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#0891b2",
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          MANUAL CALCULATOR
        </div>
        <form onSubmit={submitManual} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>
            Enter your hardness reading (from a test strip or utility report)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <input
              value={manualVal}
              onChange={(e) => setManualVal(e.target.value)}
              style={{ ...inputStyle, flex: "1 1 140px" }}
              inputMode="decimal"
            />
            <select
              value={manualUnit}
              onChange={(e) => setManualUnit(e.target.value as "ppm" | "gpg" | "mgL")}
              style={{
                ...inputStyle,
                flex: "0 0 auto",
                maxWidth: 160,
                cursor: "pointer",
              }}
            >
              <option value="ppm">ppm (as CaCO₃)</option>
              <option value="mgL">mg/L</option>
              <option value="gpg">grains per gallon (gpg)</option>
            </select>
            <button
              type="submit"
              style={{
                padding: "11px 22px",
                border: "none",
                borderRadius: 8,
                background: "linear-gradient(135deg,#0891b2,#06b6d4)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Calculate
            </button>
          </div>
        </form>
      </div>

      {(zipAnalysis || manualAnalysis) && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 12 }}>
            RESULT
          </div>
          {zipAnalysis ? <ResultBlock analysis={zipAnalysis} extra={zipExtra} /> : null}
          {manualAnalysis && zipAnalysis ? (
            <div style={{ fontSize: 12, color: "#64748b", margin: "8px 0" }}>Manual calculation (below):</div>
          ) : null}
          {manualAnalysis ? <ResultBlock analysis={manualAnalysis} /> : null}
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <SolutionPicks tier={activeTier} />
      </div>
    </div>
  );
}
