import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";
import { UtilityOperatorCcrCta } from "@/components/UtilityOperatorCcrCta";
import { stateLabel } from "@/lib/us-state-names";
import { getUniqueUtilityStatesLowercase } from "@/lib/utilities-data";

export const metadata: Metadata = {
  title: "Public water utilities (EPA) | WaterCheckup",
  description: "Browse EPA SDWIS public water systems by state — violations snapshots, PFAS data, and filter guidance.",
  alternates: { canonical: "https://watercheckup.com/utilities" },
};

export const revalidate = 86400;

export default function UtilitiesIndexPage() {
  let states: string[] = [];
  try {
    states = getUniqueUtilityStatesLowercase();
  } catch {
    states = [];
  }

  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px" }}>Water utilities by state</h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
          Full PWS directory from EPA’s national SDWA release — same family of data as{" "}
          <Link href="https://echo.epa.gov/" style={{ color: "#22d3ee" }}>
            ECHO
          </Link>{" "}
          / SDWIS.
        </p>

        <div
          style={{
            marginBottom: 24,
            padding: "14px 18px",
            background: "rgba(8, 145, 178, 0.08)",
            border: "1px solid rgba(8, 145, 178, 0.28)",
            borderRadius: 10,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <UtilityOperatorCcrCta variant="state-directory" />
          <Link
            href="/utilities/claim"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              padding: "10px 16px",
              borderRadius: 8,
              background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Claim Your Listing →
          </Link>
        </div>

        {states.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>
            Run <code style={{ color: "#e2e8f0" }}>npm run fetch-utilities</code> to build{" "}
            <code style={{ color: "#e2e8f0" }}>data/utilities.json</code>.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {states.map((st) => (
              <Link
                key={st}
                href={`/utilities/${st}`}
                style={{
                  padding: "12px 14px",
                  background: "#0d2240",
                  border: "1px solid #1a3a5c",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#22d3ee",
                }}
              >
                {stateLabel(st)} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
