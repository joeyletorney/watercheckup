import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Water Quality Rankings Hub — PFAS, Lead, Violations & More | WaterCheckup',
  description:
    'All WaterCheckup data-backed rankings in one place: worst PFAS systems, THM/DBP risk cities, lead risk, EPA violations, states, and broader PFAS exposure.',
  alternates: { canonical: 'https://watercheckup.com/worst' },
  openGraph: {
    title: 'Water Quality Rankings — PFAS, Lead, Violations & More',
    description:
      'Explore EPA-backed rankings: highest PFAS above MCL, disinfection byproduct risk cities, lead, violations, and state comparisons.',
  },
};

const RANKINGS: { href: string; title: string; tag: string; desc: string }[] = [
  {
    href: '/worst-pfas',
    title: '10 worst PFAS systems (UCMR5)',
    tag: 'UCMR5 · ppt vs EPA MCL',
    desc: 'Water systems with the highest regulated PFAS above federal limits — compound-by-compound ppt and how many times over the MCL.',
  },
  {
    href: '/worst-thm',
    title: 'Highest THM / DBP risk cities',
    tag: 'City profiles · editorial',
    desc: 'Cities where our profiles explicitly flag trihalomethanes, haloacetic acids, or disinfection byproducts — sorted by risk tier.',
  },
  {
    href: '/worst-water',
    title: 'Broad PFAS exposure ranking',
    tag: 'Top 50 · all PFAS detections',
    desc: 'Largest aggregate PFAS readings across utilities, including compounds without an EPA MCL yet.',
  },
  {
    href: '/worst-lead',
    title: 'Worst lead risk cities',
    tag: 'Lead · service lines',
    desc: 'Cities with the highest documented lead-in-water risk from EPA context and our city-level flags.',
  },
  {
    href: '/worst-violations',
    title: 'Most EPA violations',
    tag: 'SDWIS compliance',
    desc: 'Utilities and regions with the heaviest Safe Drinking Water Act violation histories we surface in rankings.',
  },
  {
    href: '/worst-states',
    title: 'Worst states for water quality',
    tag: 'State comparison',
    desc: 'State-level rollup of contamination pressure, violations, and infrastructure stress.',
  },
];

export default function WorstHubPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            DATA-BACKED RANKINGS
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 14px' }}>
            Water quality rankings hub
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            Every page below pulls from EPA monitoring (UCMR5), Safe Drinking Water Information System violations, or structured city profiles we maintain for 135+ metros. Use this hub to navigate stories that are designed to rank in search and hold up to scrutiny.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RANKINGS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              style={{
                display: 'block',
                padding: '18px 20px',
                background: '#071828',
                border: '1px solid #1a3a5c',
                borderRadius: 12,
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: '#64748b', marginBottom: 6 }}>{r.tag}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{r.title}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{r.desc}</div>
              <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, marginTop: 12 }}>Open ranking →</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 10 }}>METHODOLOGY</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px' }}>
            Rankings combine federal datasets with editorial city profiles. Pages like PFAS-over-MCL lists cite exact monitoring values; THM/DBP lists explain when we are inferring risk from keywords in our city database rather than re-ranking every utility nationally.
          </p>
          <Link href="/methodology" style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee' }}>
            How we source and interpret data →
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
