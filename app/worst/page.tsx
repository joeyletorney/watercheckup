import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Water Quality Rankings Hub — PFAS, Lead, Violations & More | WaterCheckup',
  description:
    'All WaterCheckup data-backed rankings: Water Safety Score, PFAS MCL cities, lead risk, hardness, EPA violations, and state comparisons.',
  alternates: { canonical: 'https://watercheckup.com/worst' },
  openGraph: {
    title: 'Water Quality Rankings — PFAS, Lead, Violations & More',
    description:
      'Explore EPA-backed rankings: safety scores, PFAS, lead risk, hardness, violations, and state comparisons.',
  },
};

export const revalidate = 86400;

type HubSection = { title: string; items: { href: string; title: string; tag: string; desc: string }[] };

const SECTIONS: HubSection[] = [
  {
    title: 'Overall city scores',
    items: [
      {
        href: '/worst-cities',
        title: '20 worst cities (Water Safety Score)',
        tag: '0–88 composite · UCMR5 + profiles',
        desc: 'Lowest exposure-profile scores among tracked metros — regulatory PFAS and contaminant flags.',
      },
      {
        href: '/best-cities',
        title: '10 best cities for tap water',
        tag: 'Highest safety scores',
        desc: 'Tracked cities with the fewest UCMR5 MCL flags and lighter contaminant profiles.',
      },
    ],
  },
  {
    title: 'PFAS',
    items: [
      {
        href: '/worst-pfas',
        title: 'Top 10 systems over PFAS MCL',
        tag: 'EPA UCMR5 · regulated violations',
        desc: 'Highest regulated PFAS above federal limits — compound-by-compound ppt.',
      },
      {
        href: '/worst-pfas-cities',
        title: 'Worst cities for PFAS',
        tag: 'MCL cities + unregulated peaks',
        desc: 'City guides with MCL violations and highest 6:2 FTS–style peaks.',
      },
      {
        href: '/pfoa-at-epa-limit',
        title: 'Cities where PFOA hit the 4 ppt EPA limit',
        tag: 'UCMR5 · PFOA MCL',
        desc: 'Sugar Land at the line, Philadelphia at 235 ppt — tracked metros with PFOA ≥ 4 ppt.',
      },
      {
        href: '/worst-water',
        title: 'Top 50 peak PFAS readings',
        tag: 'All detections',
        desc: 'Largest aggregate PFAS across public water systems in UCMR5.',
      },
      {
        href: '/blog/top-10-most-pfas-contaminated-cities',
        title: 'Top 10 PFAS cities (blog)',
        tag: 'Editorial · 2026',
        desc: 'Sugar Land 672 ppt 6:2 FTS and links to every city report.',
      },
    ],
  },
  {
    title: 'Lead, DBPs & violations',
    items: [
      {
        href: '/worst-lead',
        title: 'Top 25 lead pipe risk cities',
        tag: 'Lead service lines · profiles',
        desc: 'Cities flagging lead or LSL risk — sorted by Water Safety Score.',
      },
      {
        href: '/worst-thm',
        title: 'Top THM / disinfection byproduct risk',
        tag: 'Chlorine · chloramine · DBPs',
        desc: 'Cities with THM, HAA, or DBP called out in structured profiles.',
      },
      {
        href: '/worst-violations',
        title: 'Top 25 EPA violation records',
        tag: 'SDWIS compliance',
        desc: 'Cities with the worst Safe Drinking Water Act violation history.',
      },
    ],
  },
  {
    title: 'Hardness & chemistry',
    items: [
      {
        href: '/worst-hardness',
        title: 'Hardest tap water (states & cities)',
        tag: 'mg/L as CaCO₃',
        desc: 'Top 20 states and cities by hardness — scaling and RO context.',
      },
      {
        href: '/water-hardness',
        title: 'Hardness lookup by ZIP',
        tag: 'Tool',
        desc: 'Check hardness for your address.',
      },
      {
        href: '/blog/top-10-cities-hardest-tap-water',
        title: 'Hardest cities (blog)',
        tag: 'Editorial',
        desc: 'Geology and regional hardness deep dive.',
      },
    ],
  },
  {
    title: 'States & geography',
    items: [
      {
        href: '/rankings',
        title: 'State rankings table (all 50 + DC)',
        tag: '% cities over EPA limits',
        desc: 'Sortable table — same grade scale as worst states list.',
      },
      {
        href: '/worst-states',
        title: 'Top 25 worst states',
        tag: 'Narrative + % at risk',
        desc: 'State stories with UCMR5 at-risk percentages.',
      },
    ],
  },
];

export default function WorstHubPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            DATA-BACKED RANKINGS
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 14px' }}>
            Water quality rankings hub
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            Rankings use different lenses: <strong style={{ color: '#e2e8f0' }}>Water Safety Score</strong> (city
            exposure profile), <strong style={{ color: '#e2e8f0' }}>PFAS UCMR5</strong> (monitoring),{' '}
            <strong style={{ color: '#e2e8f0' }}>state % at risk</strong> (geography), and{' '}
            <strong style={{ color: '#e2e8f0' }}>ZIP compliance</strong> (live SDWIS on the homepage). Pick the list
            that matches your question.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, marginBottom: 12 }}>
              {section.title.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.items.map((r) => (
                <Link
                  key={r.href}
                  prefetch href={r.href}
                  style={{
                    display: 'block',
                    padding: '16px 18px',
                    background: '#071828',
                    border: '1px solid #1a3a5c',
                    borderRadius: 12,
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: '#a8b4c4', marginBottom: 6 }}>
                    {r.tag}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65 }}>{r.desc}</div>
                  <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, marginTop: 10 }}>Open ranking →</div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <NewsletterSignup
          source="rankings-hub"
          title="Weekly rankings & violation alerts"
          description="PFAS MCL changes, new violations, and safety-score updates — one email per week."
          compact
        />

        <div style={{ marginTop: 8, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 10 }}>METHODOLOGY</div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 12px' }}>
            PFAS-over-MCL lists cite exact UCMR5 values. Lead and THM lists reflect structured city profiles unless noted.
            Safety Score is a composite on each city page — not the same as your ZIP&apos;s live EPA grade.
          </p>
          <Link prefetch href="/methodology" style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee' }}>
            How we source and interpret data →
          </Link>
        </div>
      </div>
    </div>
  );
}
