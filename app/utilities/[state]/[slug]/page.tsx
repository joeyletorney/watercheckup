import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/app/components/SiteHeader";
import { UtilityCcrSection } from "@/components/UtilityCcrSection";
import { UtilityClaimTopBanner } from "@/components/UtilityClaimTopBanner";
import { UtilityOperatorCcrCta } from "@/components/UtilityOperatorCcrCta";
import EmailCapture from "@/app/water/[city]/EmailCapture";
import TopPickBox from "@/app/water/[city]/TopPickBox";
import { sdwisPublicReportUrl } from "@/lib/epa-data";
import { stateLabel } from "@/lib/us-state-names";
import ucmr5Raw from "@/lib/ucmr5.json";
import { getAllUtilityStaticParams, getUtilityByStateSlug, type UtilityJsonRecord } from "@/lib/utilities-data";

/** Prerender top utilities at build; all other `/utilities/[state]/[slug]` paths ISR on first request. */
export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllUtilityStaticParams();
}

const UCMR5 = ucmr5Raw as unknown as Record<
  string,
  [number, number, [string, number, number, number][], number?]
>;

const EPA_MCL: Record<string, number> = {
  PFOA: 4,
  PFOS: 4,
  PFNA: 10,
  PFHxS: 10,
  "HFPO-DA": 10,
};

const RO_PICKS = [
  {
    product: "Waterdrop G3P800 RO",
    brand: "Waterdrop",
    price: "~$849",
    reason:
      "Tankless 800 GPD, removes 99%+ PFAS & lead, 10-stage filtration. Smart faucet TDS display.",
    link: "https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb",
    amazon: "https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20",
    badge: "EDITORS PICK",
  },
  {
    product: "Aquasana SmartFlow RO",
    brand: "Aquasana",
    price: "~$449",
    reason:
      "WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO. Removes 90+ contaminants.",
    link: "https://www.aquasana.com/under-sink-water-filters",
    amazon: "https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheck20-20",
    badge: "MOST CERTIFIED",
  },
  {
    product: "AquaTru Under-Sink RO",
    brand: "AquaTru",
    price: "~$375",
    reason:
      "NSF 42/53/58 certified. Quick-change filters, no tools. Compact tankless design, 4-stage filtration.",
    link: "https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier",
    amazon: "https://www.amazon.com/dp/B0GGTSFZMY?tag=watercheck20-20",
    badge: "EASIEST FILTER CHANGE",
  },
];

const PITCHER_PICKS = [
  {
    product: "Clearly Filtered 3.5L Pitcher",
    brand: "Clearly Filtered",
    price: "~$90",
    reason:
      "Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473 — 365+ contaminants.",
    link: "https://www.clearlyfiltered.com/products/filtered-water-pitcher",
    amazon: "https://www.amazon.com/dp/B076B6FXT5?tag=watercheck20-20",
    badge: "BEST FOR PFAS & LEAD",
  },
  {
    product: "Waterdrop Pitcher Filter",
    brand: "Waterdrop",
    price: "~$40",
    reason:
      "7-stage filtration, 200-gallon life. Removes chlorine, PFOA/PFOS, heavy metals. No installation.",
    link: "https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb",
    amazon: "https://www.amazon.com/dp/B01JSJFBNE?tag=watercheck20-20",
    badge: "BEST VALUE",
  },
  {
    product: "ZeroWater 10-Cup Pitcher",
    brand: "ZeroWater",
    price: "~$40",
    reason:
      "Reduces TDS to zero. NSF 42/53 certified for lead, chromium, and arsenic. Includes TDS meter.",
    link: "https://www.zerowater.com/collections/pitchers",
    amazon: "https://www.amazon.com/dp/B0DWTTYTQN?tag=watercheck20-20",
    badge: "REMOVES TDS",
  },
];

function getPfasData(pwsid: string) {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}

function buildUtilityIssues(
  u: UtilityJsonRecord,
  pfas: ReturnType<typeof getPfasData>,
): string[] {
  const issues: string[] = [];
  const vc = u.violationCount ?? 0;
  if (vc > 0) {
    issues.push(`${vc} violation record(s) in the latest EPA SDWA quarterly snapshot`);
  }
  if (pfas?.violations) {
    issues.push("PFAS above EPA MCL (UCMR5 regulated compounds)");
  } else if (pfas && pfas.compounds.length > 0) {
    issues.push("PFAS compounds detected in UCMR5 monitoring");
  }
  if (issues.length === 0) {
    issues.push("No major violations flagged in the latest federal quarterly snapshot");
  }
  return issues;
}

function getUtilityWhy(
  u: UtilityJsonRecord,
  pfas: ReturnType<typeof getPfasData>,
): string {
  const vc = u.violationCount ?? 0;
  if (pfas?.violations && pfas.maxPpt > 4) {
    return `Chosen for ${u.name} because PFAS was detected at ${pfas.maxPpt} ppt in UCMR5 — above the 4 ppt limit for some regulated compounds — and this system shows ${vc} violation record(s) in the latest federal snapshot. RO removes 99%+ of PFAS at the tap.`;
  }
  if (vc >= 10) {
    return `Chosen for ${u.name} because the latest federal SDWA snapshot lists substantial violation activity. Certified reverse osmosis provides the broadest residential barrier for households that want margin beyond legal compliance.`;
  }
  if (pfas?.compounds?.length) {
    return `Chosen for ${u.name} because PFAS compounds appear in UCMR5 monitoring for this PWS. Reverse osmosis is the most effective certified residential technology for PFAS.`;
  }
  if (vc > 0) {
    return `Chosen for ${u.name} because EPA’s SDWA snapshot shows active violation records. RO addresses a wide range of regulated contaminants, not just chlorine taste.`;
  }
  if ((u.primarySource ?? "").toLowerCase().includes("ground")) {
    return `Chosen for ${u.name} because groundwater supplies can carry nitrates, arsenic, and localized contamination. RO is the strongest barrier for sensitive households.`;
  }
  return `Chosen for ${u.name} because utilities meet legal limits — not necessarily health-based thresholds for every contaminant. RO removes PFAS, lead from home plumbing, and disinfection byproducts in one system.`;
}

function computeUtilityGrade(
  violationCount: number,
  pfas: ReturnType<typeof getPfasData>,
): { score: number; grade: string; gradeColor: string; label: string } {
  let score = 85;
  const vc = violationCount;
  if (vc > 0) score -= Math.min(20 + vc * 2, 55);
  if (pfas) {
    if (pfas.violations > 0) score -= 25;
    else if (pfas.compounds.length > 3) score -= 12;
    else if (pfas.compounds.length > 0) score -= 6;
    const overHealth = pfas.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 10;
    if (pfas.maxPpt > 50) score -= 8;
    else if (pfas.maxPpt > 10) score -= 4;
  }
  score = Math.max(0, Math.min(88, score));

  let grade: string;
  let gradeColor: string;
  let label: string;
  if (score >= 80) {
    grade = "A";
    gradeColor = "#22d3ee";
    label = "Good";
  } else if (score >= 65) {
    grade = "B";
    gradeColor = "#86efac";
    label = "Fair";
  } else if (score >= 50) {
    grade = "C";
    gradeColor = "#f59e0b";
    label = "Concerning";
  } else if (score >= 35) {
    grade = "D";
    gradeColor = "#f97316";
    label = "Poor";
  } else {
    grade = "F";
    gradeColor = "#ef4444";
    label = "High risk";
  }
  return { score, grade, gradeColor, label };
}

export async function generateMetadata({
  params,
}: {
  params: { state: string; slug: string };
}): Promise<Metadata> {
  const u = getUtilityByStateSlug(params.state, params.slug);
  if (!u) {
    return { title: "Utility report | WaterCheckup" };
  }
  const path = `/utilities/${params.state.toLowerCase()}/${params.slug}`;
  return {
    title: `Is ${u.name} Water Safe? 2026 Report | WaterCheckup`,
    description: `${u.name} (${u.pwsid}) — population served, EPA violations snapshot, PFAS testing, and filter picks. ${stateLabel(u.state)} public water system report.`,
    alternates: {
      canonical: `https://watercheckup.com${path}`,
    },
    openGraph: {
      title: `Is ${u.name} Water Safe? 2026 | WaterCheckup`,
      description: `Free EPA-based report: violations, UCMR5 PFAS, and certified filter recommendations for ${u.name}.`,
    },
  };
}

export default function UtilityPage({ params }: { params: { state: string; slug: string } }) {
  const u = getUtilityByStateSlug(params.state, params.slug);
  if (!u) notFound();

  const pfas = getPfasData(u.pwsid);
  const issues = buildUtilityIssues(u, pfas);
  const grade = computeUtilityGrade(u.violationCount ?? 0, pfas);
  const stLabel = stateLabel(u.state);
  const pickSlug = `${params.state}-${params.slug}`;
  const vc = u.violationCount ?? 0;

  const pickLabel =
    vc > 0 || (pfas?.violations ?? 0) > 0
      ? "EPA violations / contaminants in monitoring data"
      : pfas && pfas.compounds.length > 0
        ? "PFAS detected (UCMR5)"
        : "Recommended protection for municipal tap water";

  const picks =
    pfas && pfas.compounds.length > 0 && vc < 5 ? PITCHER_PICKS : RO_PICKS;
  const whyText = getUtilityWhy(u, pfas);

  const hasPfasTable = pfas && pfas.compounds.length > 0;
  const echoFacilityUrl = `https://echo.epa.gov/sdwa/facility-info?p_pwsid=${encodeURIComponent(u.pwsid)}`;

  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        {!u.isClaimed ? <UtilityClaimTopBanner utilityName={u.name} /> : null}

        <div style={{ marginBottom: 32 }}>
          <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Home
            </Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href="/utilities" style={{ color: "#64748b", textDecoration: "none" }}>
              Utilities
            </Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link
              href={`/utilities/${params.state.toLowerCase()}`}
              style={{ color: "#64748b", textDecoration: "none" }}
            >
              {stLabel}
            </Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#94a3b8" }}>{u.name}</span>
          </nav>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 10 }}>
            PUBLIC WATER SYSTEM REPORT
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.2, margin: "0 0 16px" }}>
            Is {u.name} Water Safe to Drink in 2026?
          </h1>

          <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
            {stLabel} · PWSID {u.pwsid}
            {u.primarySource ? ` · ${u.primarySource}` : ""}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {[
              {
                k: "Population served",
                v:
                  u.populationServed != null
                    ? u.populationServed.toLocaleString("en-US")
                    : "—",
              },
              { k: "Cities served", v: u.citiesServed ?? "—" },
              { k: "State / jurisdiction", v: `${stLabel} (${u.state})` },
              { k: "PWSID", v: u.pwsid },
            ].map(({ k, v }) => (
              <div
                key={k}
                style={{
                  padding: "12px 14px",
                  background: "#0d2240",
                  border: "1px solid #1a3a5c",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.35 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Grade badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              background: `${grade.gradeColor}14`,
              border: `1px solid ${grade.gradeColor}44`,
              borderRadius: 12,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: grade.gradeColor,
                lineHeight: 1,
                minWidth: 52,
                textAlign: "center",
              }}
            >
              {grade.grade}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: grade.gradeColor, letterSpacing: 1 }}>
                TAP WATER GRADE
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginTop: 4 }}>{grade.label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                Model score {grade.score}/88 from violations, PFAS profile, and monitoring signals — not a laboratory test
                of your faucet.
              </div>
            </div>
          </div>

          {/* Issue tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {issues.map((issue, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  background: "#071828",
                  border: "1px solid #1a3a5c",
                  borderRadius: 6,
                  color: "#94a3b8",
                }}
              >
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Contaminants table — UCMR5 */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0891b2",
              letterSpacing: 2,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1px solid #0f2336",
            }}
          >
            CONTAMINANTS — EPA UCMR5 MONITORING
          </div>
          {!hasPfasTable ? (
            <div style={{ padding: "18px 20px", background: "#0d2240", border: "1px solid #1a3a5c", borderRadius: 12 }}>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                No UCMR5 PFAS detects on file for this PWS in our bundled national dataset — the system may be smaller than
                UCMR5 thresholds, had non-detects, or results are not yet linked to this ID. Your retailer Annual Water Quality
                Report lists other regulated contaminants (chlorine, DBPs, nitrates, etc.).
              </p>
            </div>
          ) : (
            <>
              <div style={{ background: "#071828", border: "1px solid #1a3a5c", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 120px 100px", gap: 0 }}>
                  {["Compound", "Level (ppt)", "EPA limit", "Health guideline", "Status"].map((h, i) => (
                    <div
                      key={h}
                      style={{
                        padding: "10px 14px",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#64748b",
                        letterSpacing: 1,
                        background: "#040d14",
                        borderBottom: "1px solid #1a3a5c",
                        textAlign: i > 0 ? "center" : "left",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                  {pfas!.compounds
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, level, overEPA, overHealth], idx, arr) => {
                      let status = "Within limits";
                      let statusColor = "#22d3ee";
                      if (overHealth) {
                        status = "Above health advisory";
                        statusColor = "#ef4444";
                      } else if (overEPA) {
                        status = "MCL exceedance";
                        statusColor = "#ef4444";
                      } else if (EPA_MCL[name] === undefined && level > 0) {
                        status = "Unregulated (monitored)";
                        statusColor = "#f59e0b";
                      }
                      return (
                        <div key={name} style={{ display: "contents" }}>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#e2e8f0",
                              borderBottom: idx < arr.length - 1 ? "1px solid #0f2336" : "none",
                            }}
                          >
                            {name}
                            {EPA_MCL[name] !== undefined && (
                              <span style={{ fontSize: 10, color: "#64748b", marginLeft: 6 }}>regulated</span>
                            )}
                          </div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: 13,
                              fontWeight: 700,
                              color: overHealth ? "#ef4444" : overEPA ? "#f59e0b" : "#94a3b8",
                              textAlign: "center",
                              borderBottom: idx < arr.length - 1 ? "1px solid #0f2336" : "none",
                            }}
                          >
                            {level.toFixed(1)}
                          </div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: 12,
                              textAlign: "center",
                              borderBottom: idx < arr.length - 1 ? "1px solid #0f2336" : "none",
                              color:
                                EPA_MCL[name] !== undefined ? (overEPA ? "#ef4444" : "#22d3ee") : "#64748b",
                            }}
                          >
                            {EPA_MCL[name] !== undefined
                              ? `${EPA_MCL[name]} ppt`
                              : "—"}
                          </div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: 12,
                              textAlign: "center",
                              borderBottom: idx < arr.length - 1 ? "1px solid #0f2336" : "none",
                              color: overHealth ? "#ef4444" : "#64748b",
                            }}
                          >
                            {overHealth ? "Exceeds" : "Within / n/a"}
                          </div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: 11,
                              fontWeight: 700,
                              textAlign: "center",
                              color: statusColor,
                              borderBottom: idx < arr.length - 1 ? "1px solid #0f2336" : "none",
                            }}
                          >
                            {status}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", margin: "12px 0 0", lineHeight: 1.6 }}>
                Source: EPA UCMR5 · ppt = parts per trillion · MCL = enforceable limit for regulated PFAS
              </p>
            </>
          )}
        </div>

        <UtilityCcrSection utilityName={u.name} isClaimed={u.isClaimed === true} ccr={u.ccr} />

        {/* Violations */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0891b2",
              letterSpacing: 2,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1px solid #0f2336",
            }}
          >
            VIOLATIONS HISTORY (FEDERAL SNAPSHOT)
          </div>
          <div style={{ padding: "18px 20px", background: "#0d2240", border: "1px solid #1a3a5c", borderRadius: 12 }}>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.75, margin: "0 0 14px" }}>
              EPA’s national SDWA quarterly files associate{" "}
              <strong style={{ color: "#f1f5f9" }}>{vc}</strong> violation-related record
              {vc === 1 ? "" : "s"} with this system in the same reporting quarter as the utility snapshot used on WaterCheckup.
              This is not a complete historical docket — see ECHO and SDWIS for full compliance context.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={echoFacilityUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 16px",
                  background: "#071828",
                  border: "1px solid #1a3a5c",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#22d3ee",
                }}
              >
                EPA ECHO facility report →
              </a>
              <a
                href={sdwisPublicReportUrl(u.pwsid)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 16px",
                  background: "#071828",
                  border: "1px solid #1a3a5c",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                }}
              >
                SDWIS federal reports (PWS search) →
              </a>
            </div>
          </div>
        </div>

        {/* Inline email */}
        <div
          style={{
            marginBottom: 24,
            padding: "14px 18px",
            background: "rgba(8,145,178,0.07)",
            border: "1px solid rgba(8,145,178,0.25)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: "#94a3b8", flexShrink: 0 }}>
            Get alerts if this system&apos;s EPA data changes:
          </span>
          <EmailCapture
            cityName={u.name}
            slug={pickSlug}
            inline
            utilityScope={{
              utilityName: u.name,
              stateParam: params.state.toLowerCase(),
              utilitySlug: params.slug,
              pwsid: u.pwsid,
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0891b2",
              letterSpacing: 2,
              marginBottom: 6,
              paddingBottom: 10,
              borderBottom: "1px solid #0f2336",
            }}
          >
            WHAT TO DO ABOUT IT
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6 }}>
            Based on {u.name}&apos;s monitoring and violation profile, here are vetted filtration options — same picks framework
            as our city reports.
          </p>
        </div>

        <TopPickBox picks={picks} label={pickLabel} cityName={u.name} citySlug={pickSlug} whyText={whyText} />

        {/* State link */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <Link
            href={`/utilities/${params.state.toLowerCase()}`}
            style={{ fontSize: 15, fontWeight: 700, color: "#0891b2", textDecoration: "none" }}
          >
            See all utilities in {stLabel} →
          </Link>
        </div>

        <EmailCapture
          cityName={u.name}
          slug={pickSlug}
          utilityScope={{
            utilityName: u.name,
            stateParam: params.state.toLowerCase(),
            utilitySlug: params.slug,
            pwsid: u.pwsid,
          }}
        />

        <UtilityOperatorCcrCta variant="utility-footer" utilityName={u.name} />

        <div
          style={{
            background: "linear-gradient(135deg, #071828, #040d14)",
            border: "1px solid #0f2d40",
            borderRadius: 16,
            padding: "28px 24px",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Check your ZIP code</div>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 18, lineHeight: 1.6 }}>
            PWS-wide data may differ from the system serving your home. Enter your ZIP on the homepage for a tailored EPA
            report.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "linear-gradient(135deg,#0891b2,#06b6d4)",
              borderRadius: 10,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Fix My Water — Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
