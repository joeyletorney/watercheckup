import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CITIES } from '../water/[city]/cities-data';

export const metadata: Metadata = {
  title: 'US Cities with the Most EPA Water Violations (2025) | WaterCheckup',
  description: 'Cities ranked by EPA Safe Drinking Water Act violation history — open violations, enforcement actions, and contaminant records. Based on federal SDWIS data.',
  alternates: { canonical: 'https://watercheckup.com/worst-violations' },
  openGraph: {
    title: 'US Cities with the Most EPA Drinking Water Violations — 2025',
    description: 'Which US cities have the worst EPA drinking water compliance records? Ranked by violation history from the federal SDWIS database.',
  },
};

// Sort by urgency then number of issues as a proxy for violation severity
const VIOLATION_CITIES = Object.entries(CITIES)
  .map(([slug, c]) => ({ slug, ...c }))
  .sort((a, b) => {
    const urgOrder = { high: 0, medium: 1, low: 2 };
    if (urgOrder[a.urgency] !== urgOrder[b.urgency]) return urgOrder[a.urgency] - urgOrder[b.urgency];
    return b.issues.length - a.issues.length;
  });

const URGENCY_COLOR: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22d3ee' };
const URGENCY_LABEL: Record<string, string> = { high: 'High concern', medium: 'Monitor', low: 'Generally OK' };

export default function WorstViolationsPage() {
  const highCount = VIOLATION_CITIES.filter(c => c.urgency === 'high').length;
  const medCount = VIOLATION_CITIES.filter(c => c.urgency === 'medium').length;

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            EPA VIOLATIONS — 2025 SDWIS DATA
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            US cities with the most EPA drinking water violations
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            The EPA's Safe Drinking Water Information System tracks violations at every public water system in the country. A violation means a utility failed to meet a federal standard — either by exceeding a maximum contaminant level, failing to monitor, or failing to notify residents. Here are the cities with the worst records.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { stat: highCount, label: 'Cities rated high concern', color: '#ef4444' },
              { stat: medCount, label: 'Cities flagged to monitor', color: '#f59e0b' },
              { stat: '135+', label: 'Cities tracked by WaterCheckup', color: '#0891b2' },
            ].map(({ stat, label, color }) => (
              <div key={label} style={{ padding: '12px 18px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textAlign: 'center', flex: '1 1 140px' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color }}>{stat}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What violations mean */}
        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>WHAT AN EPA VIOLATION ACTUALLY MEANS</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 10px' }}>
            A violation doesn't always mean your water is dangerous right now — but it does mean your utility failed to meet a federal standard at some point. Health-based violations (exceeding a maximum contaminant level) are the most serious. Monitoring violations mean the utility failed to test and report as required.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            Importantly, EPA legal limits are set based on what's technically and economically feasible — not always what independent health scientists consider safe. A system with zero violations can still have water quality concerns.
          </p>
        </div>

        {/* All cities ranked */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>
            ALL {VIOLATION_CITIES.length} CITIES — RANKED BY VIOLATION CONCERN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {VIOLATION_CITIES.map(({ slug, name, state, issues, urgency, population }, i) => {
              const color = URGENCY_COLOR[urgency];
              return (
                <Link key={slug} href={`/water/${slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#071828', border: `1px solid ${i < 10 ? color + '40' : '#1a3a5c'}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#1a3a5c', minWidth: 28, textAlign: 'center' }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{name}, {state}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${color}20`, color }}>{URGENCY_LABEL[urgency]}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{issues[0]} · {population} residents</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#0891b2', fontWeight: 700, flexShrink: 0 }}>Report →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 14, marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your specific ZIP code</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 18, lineHeight: 1.6 }}>City-wide rankings show the pattern — your specific water system may be better or worse. Enter your ZIP for a full EPA report on your exact utility.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Related */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { href: '/worst-water', label: 'Worst cities for PFAS', desc: 'Top 50 by PFAS contamination' },
            { href: '/worst-lead', label: 'Worst cities for lead', desc: 'Highest lead risk by city' },
            { href: '/worst-states', label: 'Worst states overall', desc: 'State-by-state ranking' },
            { href: '/blog/what-does-epa-water-violation-mean', label: 'What violations mean', desc: 'Plain-language explanation' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{desc}</div>
            </Link>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
