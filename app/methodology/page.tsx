import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Data sources & methodology | WaterCheckup',
  description:
    'How WaterCheckup combines EPA SDWIS, UCMR PFAS monitoring, and related federal datasets into a ZIP-level summary and score.',
};

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
          TRUST & TRANSPARENCY
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, margin: '0 0 16px' }}>
          Data sources & how we summarize risk
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 24px' }}>
          WaterCheckup is built from the same public federal datasets utilities report to EPA. We merge them for your ZIP code,
          then translate the results into plain language and filter ideas. We are not a laboratory and we do not sample your tap.
        </p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>What we pull</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
            <li>
              <strong style={{ color: '#cbd5e1' }}>SDWIS / ECHO</strong> — violations, compliance status, and system identifiers for public water systems.
            </li>
            <li>
              <strong style={{ color: '#cbd5e1' }}>UCMR (e.g. UCMR 5)</strong> — PFAS and other unregulated contaminant monitoring reported under EPA rules.
            </li>
            <li>
              <strong style={{ color: '#cbd5e1' }}>Lead & Copper Rule sampling</strong> — where available in federal reporting for your system.
            </li>
            <li>
              <strong style={{ color: '#cbd5e1' }}>Optional EWG merge</strong> — health-guideline context when a metro match exists.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>Score & “risk” labels</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            The water safety score and labels (e.g. moderate vs. high) are <strong style={{ color: '#e2e8f0' }}>summaries of regulatory and monitoring signals</strong> in the
            datasets above — not a medical diagnosis and not a guarantee about your specific faucet. Older plumbing, private wells, and
            very recent changes may not be fully reflected in what EPA has on file yet.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>Dates & freshness</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            Each ZIP report includes a “data freshness” note where we can show it — for example the UCMR snapshot packaged in the app and
            SDWIS live-query notes. Always use the official EPA links on your report for the primary source.
          </p>
        </section>

        <p style={{ fontSize: 14, margin: 0 }}>
          <Link href="/" style={{ color: '#22d3ee', fontWeight: 700, textDecoration: 'none' }}>
            ← Back to ZIP search
          </Link>
        </p>
      </main>
    </div>
  );
}
