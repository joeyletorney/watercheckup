import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";

import ClaimUtilitiesForm from "./ClaimUtilitiesForm";

export const metadata: Metadata = {
  title: "Publish Your 2027 Consumer Confidence Report Free | WaterCheckup",
  description:
    "Free CCR publishing for community water systems. Residents already find your utility on WaterCheckup — claim your listing and meet EPA Consumer Confidence Report requirements.",
  alternates: { canonical: "https://watercheckup.com/utilities/claim" },
};

const VALUE_PROPS = [
  "Your customers already search for your utility here",
  "One click CCR publishing - meets EPA requirements",
  "Free forever for community water systems",
  "Your official report inherits this page's search authority",
];

export default function UtilityClaimPage() {
  return (
    <div style={{ minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>
        <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <Link href="/utilities" style={{ color: "#64748b", textDecoration: "none" }}>
            Utilities
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#94a3b8" }}>Claim listing</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 10 }}>
          FOR WATER OPERATORS
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.2, margin: "0 0 16px" }}>
          Publish Your 2027 Consumer Confidence Report Free
        </h1>

        <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 28px" }}>
          WaterCheckup already ranks for EPA water quality searches in your service area. Claim your system to host your
          official Consumer Confidence Report alongside the same traffic residents use today — no paywall, built for community
          water systems.
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
          {VALUE_PROPS.map((text) => (
            <li
              key={text}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 14,
                fontSize: 15,
                color: "#e2e8f0",
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: "#22d3ee", fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            padding: "24px 22px",
            background: "#0d2240",
            border: "1px solid #1a3a5c",
            borderRadius: 14,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", letterSpacing: 2, marginBottom: 16 }}>
            REQUEST ACCESS
          </div>
          <ClaimUtilitiesForm />
        </div>

        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
          Claims are reviewed manually. We&apos;ll match your PWSID to our EPA directory before enabling uploads. Questions?{" "}
          <Link href="/faq" style={{ color: "#22d3ee" }}>
            FAQ
          </Link>{" "}
          ·{" "}
          <Link href="/utilities" style={{ color: "#22d3ee" }}>
            Utility directory
          </Link>
        </p>
      </div>
    </div>
  );
}
