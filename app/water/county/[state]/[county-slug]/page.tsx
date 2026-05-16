import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import countiesData from "@/data/counties.json";
import { SiteHeader } from "../../../../components/SiteHeader";
import EmailCapture from "../../../[city]/EmailCapture";
import TopPickBox from "../../../[city]/TopPickBox";
import type { CountyRecord } from "@/lib/county-data";

export const dynamicParams = true;
export const revalidate = 86400;

type CountyRouteParams = { state: string; "county-slug": string };

type CountiesFile = { counties: CountyRecord[] };

const counties = (countiesData as CountiesFile).counties;

function findCounty(state: string, countySlug: string): CountyRecord | undefined {
  return counties.find((c) => c.stateSlug === state && c.countySlug === countySlug);
}

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
    reason: "WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO. Removes 90+ contaminants.",
    link: "https://www.aquasana.com/under-sink-water-filters",
    amazon: "https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheck20-20",
    badge: "MOST CERTIFIED",
  },
  {
    product: "AquaTru Under-Sink RO",
    brand: "AquaTru",
    price: "~$375",
    reason: "NSF 42/53/58 certified. Quick-change filters, no tools. Compact tankless design, 4-stage filtration.",
    link: "https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier",
    amazon: "https://www.amazon.com/dp/B0GGTSFZMY?tag=watercheck20-20",
    badge: "EASIEST FILTER CHANGE",
  },
];

function formatPopulationServed(n: number): string {
  if (n <= 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString();
}

function countyFilterLabel(rec: CountyRecord): string {
  if (rec.mostCommonContaminant) {
    return `${rec.mostCommonContaminant} and related contaminants in county UCMR data`;
  }
  return "Contaminants detected in county water systems";
}

function countyLabel(rec: CountyRecord): string {
  return rec.countySlug === "district-of-columbia" ? "District of Columbia" : `${rec.countyDisplay} County`;
}

function countySectionHeading(rec: CountyRecord): string {
  return rec.countySlug === "district-of-columbia" ? "DISTRICT OF COLUMBIA" : `${rec.countyDisplay.toUpperCase()} COUNTY`;
}

function countyFilterWhy(rec: CountyRecord): string {
  const name = countyLabel(rec);
  if (rec.citiesAtRisk > 0) {
    return `Chosen for ${name} because ${rec.citiesAtRisk} of ${rec.totalCities} tracked ${
      rec.totalCities === 1 ? "city shows" : "cities show"
    } at least one UCMR analyte above an EPA limit or a regulated violation — reverse osmosis removes 99%+ of PFAS and many co-occurring pollutants at the tap.`;
  }
  if (rec.citiesMonitor > 0) {
    return `Chosen for ${name} because several cities are in a medium- or high-concern profile even without an EPA-limit flag in UCMR — RO still provides the broadest contaminant coverage for household drinking water.`;
  }
  return `Chosen for ${name} because certified filtration adds a safety margin beyond legal compliance — especially for lead from home plumbing and emerging contaminants like PFAS.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CountyRouteParams>;
}): Promise<Metadata> {
  const { state: stateSlug, "county-slug": countySlug } = await params;
  const rec = findCounty(stateSlug, countySlug);
  if (!rec) {
    return {
      title: "County Water Quality | WaterCheckup",
    };
  }

  const x = rec.totalCities;
  const atRisk = rec.citiesAtRisk;
  const placeCounty = countyLabel(rec);
  return {
    title: `${placeCounty}, ${rec.stateName} Water Quality Report 2026 | WaterCheckup`,
    description: `Water quality data for ${x} cities in ${placeCounty}, ${rec.stateName}. ${atRisk} ${
      atRisk === 1 ? "city has" : "cities have"
    } contaminants above EPA guidelines. Free EPA reports and filter recommendations.`,
    alternates: {
      canonical: `https://watercheckup.com/water/county/${stateSlug}/${countySlug}`,
    },
  };
}

export default async function CountyPage({ params }: { params: Promise<CountyRouteParams> }) {
  const { state: stateSlug, "county-slug": countySlug } = await params;
  const rec = findCounty(stateSlug, countySlug);
  if (!rec) notFound();

  const utmSlug = `${stateSlug}-${countySlug}`;
  const popDisplay = formatPopulationServed(rec.populationServed);

  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 24px 80px" }}>
        <nav style={{ fontSize: 12, color: "#475569", marginBottom: 24 }}>
          <Link href="/" style={{ color: "#0891b2", textDecoration: "none" }}>
            Home
          </Link>
          {" › "}
          <Link href={`/water/state/${stateSlug}`} style={{ color: "#0891b2", textDecoration: "none" }}>
            {rec.stateName}
          </Link>
          {" › "}
          <span style={{ color: "#94a3b8" }}>{countyLabel(rec)}</span>
        </nav>

        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0891b2",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            EPA WATER QUALITY DATA · {rec.stateAbbr}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.2 }}>
            Is {countyLabel(rec)} Tap Water Safe in 2026?
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 24px" }}>
            Population-weighted grade and city-level UCMR5 risk bands for {rec.totalCities} WaterCheckup cities in{" "}
            {countyLabel(rec)}. &quot;At Risk&quot; means at least one analyte above an EPA limit or a regulated PFAS
            violation for that system. &quot;Safe&quot; means no such flag and a low-concern city profile.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                background: "#071828",
                border: `2px solid ${rec.countyGradeColor}40`,
                borderRadius: 14,
                textAlign: "center",
                minWidth: 120,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 2, marginBottom: 6 }}>
                COUNTY GRADE
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: rec.countyGradeColor, lineHeight: 1 }}>
                {rec.countyGrade}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>Score {rec.countyScore}</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {[
              { label: "Total cities", value: String(rec.totalCities), alert: false as boolean },
              { label: "At Risk", value: String(rec.citiesAtRisk), alert: rec.citiesAtRisk > 0 },
              { label: "Safe", value: String(rec.citiesSafe), alert: false },
              { label: "Population served", value: popDisplay, alert: false },
            ].map(({ label, value, alert }) => (
              <div
                key={label}
                style={{
                  padding: "14px 14px",
                  background: "#0d2240",
                  border: `1px solid ${alert ? "#ef444440" : "#1a3a5c"}`,
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 900, color: alert ? "#f87171" : "#f1f5f9" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {rec.topContaminants.length > 0 && (
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
              TOP CONTAMINANTS IN {countySectionHeading(rec)} (UCMR5)
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.55 }}>
              Most common analytes with detections (&gt;0) across cities in this county — each city counted once per compound.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rec.topContaminants.map((c, i) => (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#071828",
                    border: "1px solid #1a3a5c",
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
                    <span style={{ color: "#475569", marginRight: 8 }}>{i + 1}.</span>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 13, color: "#67e8f9", fontWeight: 700 }}>
                    {c.cityCount} {c.cityCount === 1 ? "city" : "cities"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#0891b2",
              letterSpacing: 2,
              marginBottom: 16,
              paddingBottom: 10,
              borderBottom: "1px solid #0f2336",
            }}
          >
            CITIES IN {countySectionHeading(rec)}
          </div>
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1a3a5c" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#071828", textAlign: "left" }}>
                  {["City", "Grade", "Contaminants above limit", "Population"].map((h) => (
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
                {rec.cities.map((city) => (
                  <tr key={city.slug} style={{ borderBottom: "1px solid #0f2336" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <Link href={`/water/${city.slug}`} style={{ color: "#f1f5f9", fontWeight: 700, textDecoration: "none" }}>
                        {city.name}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontWeight: 900, color: city.gradeColor }}>{city.grade}</span>
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background:
                            city.band === "at_risk" ? "#ef444418" : city.band === "monitor" ? "#f59e0b18" : "#22d3ee12",
                          color:
                            city.band === "at_risk" ? "#f87171" : city.band === "monitor" ? "#fbbf24" : "#67e8f9",
                          fontWeight: 700,
                        }}
                      >
                        {city.band === "at_risk" ? "AT RISK" : city.band === "monitor" ? "MONITOR" : "SAFE"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: city.contaminantsAboveLimit > 0 ? "#f87171" : "#64748b" }}>
                      {city.contaminantsAboveLimit > 0 ? city.contaminantsAboveLimit : "—"}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#cbd5e1" }}>{city.populationLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
            FILTER RECOMMENDATIONS
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6 }}>
            Typical picks for households in {countyLabel(rec)} when UCMR5 shows PFAS or related analytes — same product
            lines we feature on city pages.
          </p>
        </div>

        <TopPickBox
          picks={RO_PICKS}
          label={countyFilterLabel(rec)}
          cityName={countyLabel(rec)}
          citySlug={utmSlug}
          whyText={countyFilterWhy(rec)}
        />

        <div style={{ marginBottom: 40 }}>
          <EmailCapture
            cityName={countyLabel(rec)}
            slug={utmSlug}
            countyScope={{
              countyDisplay: rec.countyDisplay,
              stateSlug,
              countySlug,
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "28px",
            background: "linear-gradient(135deg,#071828,#040d14)",
            border: "1px solid #0f2d40",
            borderRadius: 14,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>See all cities in {rec.stateName}</div>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
            Compare grades, PFAS detections, and filter guidance statewide.
          </p>
          <Link
            href={`/water/state/${stateSlug}`}
            style={{
              display: "inline-block",
              padding: "13px 30px",
              background: "linear-gradient(135deg,#0891b2,#06b6d4)",
              borderRadius: 10,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {rec.stateName} water quality →
          </Link>
        </div>
      </div>
    </div>
  );
}
