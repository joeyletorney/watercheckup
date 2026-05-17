import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Suspense } from "react";

import { SiteHeader } from "@/app/components/SiteHeader";
import { buildStateHardnessTable } from "@/lib/water-hardness";

import { WaterHardnessClient } from "./WaterHardnessClient";

const AMAZON = (q: string) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=watercheck20-20`;

export const metadata: Metadata = {
  title: "Water Hardness Calculator — Check by ZIP Code Free (2026)",
  description:
    "Find your water hardness by ZIP code instantly. See if you need a water softener and get certified filter recommendations based on your actual water data.",
  alternates: { canonical: "https://watercheckup.com/water-hardness" },
  openGraph: {
    title: "Water Hardness Calculator — Check by ZIP Code Free (2026)",
    description:
      "Find your water hardness by ZIP code instantly. See if you need a water softener and get certified filter recommendations based on your actual water data.",
  },
};

export const revalidate = 86400;

const sectionTitle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#0891b2",
  letterSpacing: 2,
  marginBottom: 14,
  paddingBottom: 10,
  borderBottom: "1px solid #0f2336",
};

const pStyle: CSSProperties = { fontSize: 15, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 14px" };

export default function WaterHardnessPage() {
  const stateRows = buildStateHardnessTable();

  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#94a3b8" }}>Water hardness</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 10 }}>
          TOOLS · HOME &amp; APPLIANCES
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.15, margin: "0 0 16px" }}>
          Water hardness calculator
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.65, margin: "0 0 32px" }}>
          Convert readings, interpret results in plain English, and see whether a softener or filter makes sense — using the
          same ZIP and EPA-backed data as the rest of WaterCheckup.
        </p>

        <Suspense
          fallback={
            <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading calculator…</div>
          }
        >
          <WaterHardnessClient />
        </Suspense>

        <h2 style={{ ...sectionTitle, marginTop: 44 }}>What does water hardness mean?</h2>
        <p style={pStyle}>
          “Hard” water contains higher levels of dissolved calcium and magnesium, picked up as rainwater percolates through
          rock and soil. Those minerals are not typically a drinking-water health concern—in fact, they contribute to daily
          nutrient intake—but they change how water behaves in your home. Hard water leaves mineral scale when it is heated or
          evaporates, which coats electric elements, lowers heat transfer in tank water heaters, and narrows pipes over many
          years. Soft water has fewer of those ions, so it rinses cleaner and feels slicker on skin, but it can taste flat or
          slightly salty after traditional ion-exchange softening because sodium replaces the hardness minerals. Most utilities
          report hardness as milligrams per liter (mg/L) of calcium carbonate equivalent—the same numeric value as parts per
          million (ppm) for practical purposes. You will also see grains per gallon (gpg) on some softener packaging; we convert
          both on this page so you can compare your test strip, lab report, or Consumer Confidence Report to common treatment
          thresholds.
        </p>

        <h2 style={{ ...sectionTitle, marginTop: 36 }}>Hard water problems</h2>
        <ul style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 16px", paddingLeft: 22 }}>
          <li style={{ marginBottom: 8 }}>Scale buildup on pipes, faucets, and heating elements in appliances</li>
          <li style={{ marginBottom: 8 }}>Soap and detergent that refuses to lather—film on tubs and sinks</li>
          <li style={{ marginBottom: 8 }}>Dry skin and dull hair after showering</li>
          <li style={{ marginBottom: 8 }}>Spots on dishes and glassware after drying</li>
          <li style={{ marginBottom: 8 }}>
            Reduced water heater efficiency — scale insulation on elements can waste substantial energy (often quoted up to
            ~30% in severe cases)
          </li>
        </ul>

        <h2 style={{ ...sectionTitle, marginTop: 36 }}>Soft water problems</h2>
        <ul style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 16px", paddingLeft: 22 }}>
          <li style={{ marginBottom: 8 }}>Salty or flat taste if you drink straight from a salt-based softener</li>
          <li style={{ marginBottom: 8 }}>A slippery, “not fully rinsed” feeling in the shower for some people</li>
          <li style={{ marginBottom: 8 }}>
            Aggressiveness toward legacy lead or copper plumbing if water is very low in minerals and pH is not controlled —
            often managed by utilities; worth monitoring after installing aggressive treatment
          </li>
        </ul>

        <h2 style={{ ...sectionTitle, marginTop: 36 }}>What&apos;s the ideal water hardness?</h2>
        <p style={pStyle}>
          There is no single “perfect” number for every person, but many homeowners consider{" "}
          <strong style={{ color: "#e2e8f0" }}>about 60–120 ppm (3.5–7 gpg)</strong> a comfortable middle ground: enough
          mineral to taste familiar, not so much that scale and soap waste dominate. The U.S. Geological Survey and World Health
          Organization use slightly different cut points for labeling bands; the calculator on this page uses the practical
          buckets (soft through very hard) shown in your results. If your utility lands in the moderate band, focus on hot-water
          appliances first; if you are very hard, whole-home softening plus a drinking-water path (often reverse osmosis) is a
          common professional recommendation.
        </p>

        <h2 style={{ ...sectionTitle, marginTop: 36 }}>How to test your water hardness</h2>
        <p style={pStyle}>
          <strong style={{ color: "#e2e8f0" }}>Dip-and-read test strips</strong> are inexpensive, take seconds, and work well
          for bracketing your hardness (soft / medium / hard). Accuracy is typically ±one band, so use them to decide whether
          more investigation is warranted — not to fine-tune industrial softeners.{" "}
          <strong style={{ color: "#e2e8f0" }}>Handheld TDS meters</strong> measure total dissolved solids, not hardness
          alone; high TDS often correlates with hard groundwater but can also reflect sodium, sulfate, or other ions — pair TDS
          with a hardness-specific test if you are choosing softener size.{" "}
          <strong style={{ color: "#e2e8f0" }}>Certified lab testing</strong> (mail-in kits) gives the most defensible numbers
          for mortgages, disputes, or sizing expensive equipment; request calcium, magnesium (or total hardness as CaCO₃), and
          alkalinity if you are modeling scale risk.
        </p>

        <h2 style={{ ...sectionTitle, marginTop: 36 }} id="hard-water-solutions">
          Hard water solutions (general guide)
        </h2>
        <p style={pStyle}>
          Match treatment to severity. The calculator above highlights one affiliate starting point based on your reading; the
          three categories below cover the same ground with static Amazon search links (tag <code>watercheck20-20</code>).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          <div style={{ padding: "16px 18px", background: "#0d2240", border: "1px solid #ef444440", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, color: "#f87171", marginBottom: 6 }}>Very hard water</div>
            <p style={{ ...pStyle, marginBottom: 10 }}>
              Prioritize a whole-home <strong style={{ color: "#e2e8f0" }}>ion-exchange water softener</strong> sized to
              your grains-per-day load.
            </p>
            <a href={AMAZON("whole house water softener system")} target="_blank" rel="noopener noreferrer" style={{ color: "#67e8f9", fontWeight: 700 }}>
              Search water softeners on Amazon →
            </a>
          </div>
          <div style={{ padding: "16px 18px", background: "#0d2240", border: "1px solid #f59e0b44", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>Hard water</div>
            <p style={{ ...pStyle, marginBottom: 10 }}>
              Consider <strong style={{ color: "#e2e8f0" }}>scale-prevention cartridges, template-assisted crystallization,
              or hybrid conditioners</strong> before jumping to salt if your hardness is borderline.
            </p>
            <a href={AMAZON("water descaler filter scale prevention whole house")} target="_blank" rel="noopener noreferrer" style={{ color: "#67e8f9", fontWeight: 700 }}>
              Search descaling / anti-scale options on Amazon →
            </a>
          </div>
          <div style={{ padding: "16px 18px", background: "#0d2240", border: "1px solid #22d3ee33", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, color: "#67e8f9", marginBottom: 6 }}>Soft to moderately hard</div>
            <p style={{ ...pStyle, marginBottom: 10 }}>
              You may need <strong style={{ color: "#e2e8f0" }}>no softener at all</strong>; a simple NSF-certified carbon or
              multistage filter can polish taste and chlorine.
            </p>
            <a href={AMAZON("nsf certified under sink water filter")} target="_blank" rel="noopener noreferrer" style={{ color: "#67e8f9", fontWeight: 700 }}>
              Search certified drinking-water filters on Amazon →
            </a>
          </div>
        </div>

        <h2 style={{ ...sectionTitle, marginTop: 44 }}>Hardness by U.S. state (our city sample)</h2>
        <p style={{ ...pStyle, marginBottom: 16 }}>
          Averages use WaterCheckup cities that have a hardness value in EPA UCMR5 monitoring (mg/L as CaCO₃). States with no
          matching cities show “—”. Sorted hardest → softest.
        </p>
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1a3a5c" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#071828", textAlign: "left" }}>
                {["State", "Avg hardness (ppm)", "Classification", "Cities tested"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      color: "#94a3b8",
                      fontWeight: 800,
                      fontSize: 10,
                      letterSpacing: 1,
                      borderBottom: "1px solid #1a3a5c",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stateRows.map((r) => (
                <tr key={r.abbr} style={{ borderBottom: "1px solid #0f2336" }}>
                  <td style={{ padding: "11px 14px" }}>
                    <Link href={`/water/state/${r.stateSlug}`} style={{ color: "#f1f5f9", fontWeight: 700, textDecoration: "none" }}>
                      {r.stateName}
                    </Link>
                  </td>
                  <td style={{ padding: "11px 14px", color: "#cbd5e1" }}>
                    {r.avgPpm != null ? r.avgPpm : "—"}
                  </td>
                  <td style={{ padding: "11px 14px", color: "#94a3b8" }}>{r.classification}</td>
                  <td style={{ padding: "11px 14px", color: "#64748b" }}>{r.citiesTested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ ...pStyle, marginTop: 28, fontSize: 14 }}>
          Back to{" "}
          <Link href="/water" style={{ color: "#67e8f9" }}>
            city water reports
          </Link>{" "}
          or{" "}
          <Link href="/" style={{ color: "#67e8f9" }}>
            check your ZIP
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
