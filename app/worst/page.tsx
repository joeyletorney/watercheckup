import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

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

export const revalidate = 86400;

const RANKINGS: { href: string; title: string; tag: string; desc: string }[] = [
  {
    href: '/worst-pfas',
    title: 'Top 10 cities with the highest PFAS levels',
    tag: 'EPA UCMR5 · regulated violations',
    desc: 'Water systems with the highest regulated PFAS above federal limits — compound-by-compound ppt and how many times over the MCL.',
  },
  {
    href: '/worst-thm',
    title: 'Top 10 cities with the highest chlorine byproduct risk',
    tag: 'Chlorine · chloramine · DBPs',
    desc: 'Cities where our profiles explicitly flag trihalomethanes, haloacetic acids, or disinfection byproducts — sorted by risk tier.',
  },
  {
    href: '/worst-water',
    title: 'Top 50 cities with the most PFAS contamination',
    tag: 'EPA UCMR5 · all detections',
    desc: 'Largest aggregate PFAS readings across utilities, including compounds without an EPA MCL yet.',
  },
  {
    href: '/worst-lead',
    title: 'Top 25 cities with the highest lead in tap water',
    tag: 'Lead service lines · EPA data',
    desc: 'Cities with the highest documented lead-in-water risk from EPA context and our city-level flags.',
  },
  {
    href: '/worst-violations',
    title: 'Top 25 cities with the most EPA water violations',
    tag: 'SDWIS compliance records',
    desc: 'The 25 US cities with the worst EPA Safe Drinking Water Act violation records.',
  },
  {
    href: '/worst-states',
    title: 'Top 25 worst states for tap water quality',
    tag: 'State comparison',
    desc: 'State-level rollup of contamination pressure, violations, and infrastructure stress.',
  },
  {
    href: '/blog/top-10-cities-hardest-tap-water',
    title: 'Top 10 US cities with the hardest tap water',
    tag: 'Editorial · geology & USGS regions',
    desc: 'Major metros on limestone, desert, and Plains aquifers where hardness is the norm — with links to free city EPA reports and treatment context.',
  },
];

export default function WorstHubPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
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
            Every page below pulls from EPA monitoring (UCMR5), Safe Drinking Water Information System violations, or structured profiles across 400,000+ water systems. Use this hub to navigate stories that are designed to rank in search and hold up to scrutiny.
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
    </div>
  );
}
