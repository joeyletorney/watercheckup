import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CITIES } from '../water/[city]/cities-data';

export const metadata: Metadata = {
  title: 'Cities with the Highest THM & Disinfection Byproduct Risk | WaterCheckup',
  description:
    'US cities where trihalomethanes (THMs), haloacetic acids, or disinfection byproducts show up in our water-quality profiles — editorial ranking by urgency tier, with filter guidance.',
  alternates: { canonical: 'https://watercheckup.com/worst-thm' },
  openGraph: {
    title: 'Cities with the Highest Disinfection Byproduct (THM) Risk',
    description:
      'THMs and HAAs form when chlorine reacts with organic matter in source water. Here are cities we flag for DBP risk in our structured profiles — plus what removes these compounds.',
  },
};

/** Matches issues strings that reference THMs, HAAs, or disinfection byproducts. */
const THM_DBP_ISSUE_RE =
  /disinfection\s+byproduct|trihalometh|thms?\b|tthm|haloacetic|haa\d*|chlorination\s+byproduct/i;

function urgencyRank(u: string): number {
  if (u === 'high') return 0;
  if (u === 'medium') return 1;
  if (u === 'low') return 2;
  return 3;
}

function firstMatchingIssue(issues: string[]): string | undefined {
  return issues.find((i) => THM_DBP_ISSUE_RE.test(i));
}

const THM_CITIES = Object.entries(CITIES)
  .filter(([, c]) => c.issues.some((i) => THM_DBP_ISSUE_RE.test(i)))
  .map(([slug, c]) => ({ slug, ...c }))
  .sort((a, b) => {
    const du = urgencyRank(a.urgency) - urgencyRank(b.urgency);
    if (du !== 0) return du;
    return `${a.name}, ${a.state}`.localeCompare(`${b.name}, ${b.state}`);
  });

const URGENCY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22d3ee',
};

const URGENCY_LABEL: Record<string, string> = {
  high: 'Higher concern',
  medium: 'Elevated',
  low: 'Monitor',
};

export default function WorstThmPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>
            DISINFECTION BYPRODUCTS · THM / HAA
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
            Cities with the highest disinfection byproduct risk
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
            Trihalomethanes (THMs) and haloacetic acids (HAAs) are regulated disinfection byproducts (DBPs): they form when chlorine or chloramine reacts with natural organic matter in rivers, lakes, and reservoirs. Long-term exposure above EPA limits is associated with elevated cancer risk. This page lists cities where our structured profiles explicitly call out THMs, HAAs, or disinfection byproducts in the issues field — not a fresh nationwide utility lab sort.
          </p>

          <div style={{ padding: '14px 18px', background: '#f59e0b12', border: '1px solid #f59e0b35', borderLeft: '4px solid #f59e0b', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginBottom: 28 }}>
            <strong style={{ color: '#fcd34d' }}>What we do and do not claim:</strong> Order reflects our editorial{' '}
            <strong style={{ color: '#e2e8f0' }}>urgency</strong> tiers (high → medium → low) plus alphabetical tie-breaking — mirroring how we prioritize cities internally. We do not recompute THM/TTHM concentrations from raw EPA stores on this page; for ZIP-level monitoring and MCL context, run a report from the homepage.
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            {[
              { stat: `${THM_CITIES.length}`, label: 'Cities mentioning THMs / DBPs in profiles' },
              { stat: 'THM4 / TTHM', label: 'Common regulated THM groups in tap water' },
              { stat: 'NSF 53 / RO', label: 'Certified filters that reduce DBPs at the tap' },
            ].map(({ stat, label }) => (
              <div
                key={label}
                style={{
                  padding: '12px 18px',
                  background: '#071828',
                  border: '1px solid #1a3a5c',
                  borderRadius: 10,
                  textAlign: 'center',
                  flex: '1 1 160px',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>{stat}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>WHY THMs RUN HIGH</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 10px' }}>
            Utilities must disinfect — but oxidizing organic-rich surface water produces THMs and HAAs. Hot weather, algae, soil runoff, and long distribution-system residence times all raise DBP formation. Boiling concentrates DBPs; it does not remove them.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: '#e2e8f0' }}>What helps at home:</strong> NSF/ANSI 53-certified carbon filters (pitcher or under-sink) reduce THMs and volatile DBPs when maintained on schedule. Reverse osmosis (NSF/ANSI 58) strips DBPs along with a wide range of other contaminants. Whole-house carbon can reduce shower inhalation exposure but requires proper sizing and replacement intervals.
          </p>
        </div>

        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>
            RANKED CITIES — {THM_CITIES.length} TOTAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {THM_CITIES.map(({ slug, name, state, issues, urgency, population }, i) => {
              const color = URGENCY_COLOR[urgency] ?? '#64748b';
              const highlight = firstMatchingIssue(issues) ?? issues[0];
              return (
                <Link key={slug} href={`/water/${slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 18px',
                      background: '#071828',
                      border: `1px solid ${color}30`,
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#1a3a5c', minWidth: 36, textAlign: 'center' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>
                          {name}, {state}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 5,
                            background: `${color}20`,
                            color,
                            letterSpacing: 0.5,
                          }}
                        >
                          {URGENCY_LABEL[urgency] ?? urgency}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.45 }}>
                        {highlight} · {population} residents
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#0891b2', fontWeight: 700, flexShrink: 0 }}>City report →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 12 }}>NEXT STEP</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 16px' }}>
            DBP risk varies by sampling location and season. Enter your ZIP for utility-specific contaminant language, violations, and filter ideas tied to what we parse for your system.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '11px 22px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 9,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Check my ZIP — free →
          </Link>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 14 }}>RELATED RANKINGS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { href: '/worst', label: 'All rankings hub', desc: 'PFAS, lead, violations, states' },
              { href: '/worst-pfas', label: 'Worst PFAS systems', desc: 'UCMR5 vs EPA MCL' },
              { href: '/worst-water', label: 'Broad PFAS ranking', desc: 'Top systems by aggregate PFAS' },
              { href: '/worst-lead', label: 'Worst lead cities', desc: 'Lead service line risk' },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  background: '#071828',
                  border: '1px solid #1a3a5c',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
