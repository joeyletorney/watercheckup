import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CITIES } from '../water/[city]/cities-data';

export const metadata: Metadata = {
  title: 'Cities with the Worst Lead in Tap Water (2025) | WaterCheckup',
  description: 'The US cities with the highest lead risk in tap water — ranked by EPA data, lead service line counts, and violation history. Free reports for each city.',
  alternates: { canonical: 'https://watercheckup.com/worst-lead' },
  openGraph: {
    title: 'Cities with the Worst Lead in Tap Water — 2025 EPA Data',
    description: 'Lead has no safe level for children. These US cities have the highest documented lead risk in their tap water systems.',
  },
};

const LEAD_CITIES = Object.entries(CITIES)
  .filter(([, c]) => c.issues.some(i => i.toLowerCase().includes('lead')))
  .map(([slug, c]) => ({ slug, ...c }))
  .sort((a, b) => (a.urgency === 'high' ? -1 : 1) - (b.urgency === 'high' ? -1 : 1));

const URGENCY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22d3ee',
};

const URGENCY_LABEL: Record<string, string> = {
  high: 'High Risk',
  medium: 'Elevated',
  low: 'Monitor',
};

export default function WorstLeadPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            LEAD IN TAP WATER — 2025 EPA DATA
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            US cities with the worst lead risk in tap water
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            The EPA has no safe level for lead exposure in children. Lead in tap water comes almost exclusively from pipes inside homes and buildings — not the treatment plant. Cities with aging infrastructure, pre-1986 homes, and unreplaced lead service lines carry the highest risk.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { stat: `${LEAD_CITIES.length}+`, label: 'Cities with documented lead risk' },
              { stat: '400K+', label: 'Lead service lines in Chicago alone' },
              { stat: '1986', label: 'Homes built before this year are at highest risk' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ padding: '12px 18px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textAlign: 'center', flex: '1 1 140px' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>{stat}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why lead matters */}
        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>WHY THIS MATTERS</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 10px' }}>
            Lead leaches into water from pipes, solder, and fixtures — especially when water sits overnight or when water chemistry causes corrosion. Boiling does not remove lead. Standard pitcher filters (Brita, PUR) do not remove lead. Only reverse osmosis or NSF/ANSI 53-certified filters remove lead at the tap.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            The risk is highest in homes built before 1986 (when lead solder and lead pipes were banned), apartment buildings with brass fixtures, and cities with unreplaced lead service lines connecting the water main to the home.
          </p>
        </div>

        {/* City rankings */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>
            RANKED BY LEAD RISK — {LEAD_CITIES.length} CITIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEAD_CITIES.map(({ slug, name, state, issues, urgency, population }, i) => {
              const color = URGENCY_COLOR[urgency];
              const leadIssue = issues.find(i => i.toLowerCase().includes('lead')) || issues[0];
              return (
                <Link key={slug} href={`/water/${slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', background: '#071828', border: `1px solid ${color}30`, borderRadius: 12, transition: 'border-color 0.2s' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#1a3a5c', minWidth: 32, textAlign: 'center' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{name}, {state}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${color}20`, color, letterSpacing: 0.5 }}>
                          {URGENCY_LABEL[urgency]}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{leadIssue} · {population} residents</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#0891b2', fontWeight: 700, flexShrink: 0 }}>View report →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* What to do */}
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 14, marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>WHAT TO DO IF YOUR CITY IS ON THIS LIST</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: '1', text: 'Check your specific ZIP code — city-wide risk doesn\'t mean every home is affected equally. Newer buildings and those with plastic pipes have lower risk.' },
              { step: '2', text: 'Test your tap — a certified mail-in test (SimpleLab Tap Score) gives you the actual measured lead level at your specific tap.' },
              { step: '3', text: 'Filter at the tap — NSF/ANSI 53-certified pitchers (Clearly Filtered) or reverse osmosis systems remove lead. Run the water for 30 seconds first if your pipes may contain lead.' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step}</div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/" style={{ display: 'inline-block', padding: '11px 22px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Check My ZIP Code →
            </Link>
            <Link href="/blog/best-water-filter-for-lead-removal" style={{ display: 'inline-block', padding: '11px 22px', background: 'transparent', border: '1px solid #1a3a5c', borderRadius: 9, color: '#94a3b8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Best filters for lead →
            </Link>
          </div>
        </div>

        {/* Related pages */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { href: '/worst-water', label: 'Worst cities for PFAS', desc: 'Top 50 by PFAS contamination' },
              { href: '/worst-violations', label: 'Most EPA violations', desc: 'Cities with worst compliance records' },
              { href: '/worst-states', label: 'Worst states overall', desc: 'State-by-state water quality ranking' },
              { href: '/blog/lead-in-tap-water-signs-and-symptoms', label: 'Lead in tap water guide', desc: 'Signs, risk factors, and fixes' },
            ].map(({ href, label, desc }) => (
              <Link key={href} href={href} style={{ display: 'block', padding: '14px 16px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, textDecoration: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Related blog posts */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED GUIDES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { slug: 'best-water-filter-for-lead-removal', title: 'Best Filters for Lead Removal' },
            { slug: 'lead-in-tap-water-signs-and-symptoms', title: 'Lead in Tap Water: Signs & Risk' },
            { slug: 'reverse-osmosis-pros-and-cons', title: 'Reverse Osmosis: Pros & Cons' },
            { slug: 'tap-water-safety-during-pregnancy', title: 'Tap Water Safety During Pregnancy' },
          ].map(({ slug, title }) => (
            <Link key={slug} href={`/blog/${slug}`} style={{ display: 'block', padding: '12px 14px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
              {title} →
            </Link>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
