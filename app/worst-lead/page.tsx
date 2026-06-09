import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import { buildLeadRiskCities } from '@/lib/city-rankings';
import { CITIES } from '../water/[city]/cities-data';

const LEAD_ISSUE_RE = /lead|service line|lsl/i;

export const metadata: Metadata = {
  title: 'Top 25 Cities with the Highest Lead Pipe Risk (2026) | WaterCheckup',
  description:
    'US cities where lead service lines and plumbing risk are flagged in WaterCheckup profiles — ranked by Water Safety Score (lowest first). Not measured ppb at every tap.',
  alternates: { canonical: 'https://watercheckup.com/worst-lead' },
  openGraph: {
    title: 'Top 25 Cities with Lead Pipe Risk in Tap Water — 2026',
    description:
      'Lead has no safe level for children. These tracked cities have the highest lead-risk profiles in our database.',
  },
};

// export const revalidate = 86400;

export default function WorstLeadPage() {
  const leadCities = buildLeadRiskCities();
  const top25 = leadCities.slice(0, 25);
  const rest = leadCities.slice(25);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check my water →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>
            LEAD AT THE TAP — 2026
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            Top 25 cities with the highest lead pipe risk
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 20px' }}>
            The EPA has no safe level for lead exposure in children. Lead in tap water usually comes from pipes, solder,
            and fixtures — not the treatment plant. This list includes only tracked cities where our profiles explicitly
            flag <strong style={{ color: '#e2e8f0' }}>lead service lines or plumbing risk</strong>, ordered by{' '}
            <strong style={{ color: '#e2e8f0' }}>Water Safety Score</strong> (lowest first). It is not a national ranking
            of measured lead parts per billion at every public water system.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { stat: `${leadCities.length}`, label: 'Cities with lead risk in profiles' },
              { stat: '150,000+', label: 'Known lead lines in Chicago alone' },
              { stat: '1986', label: 'Pre-1986 homes = highest risk' },
            ].map(({ stat, label }) => (
              <div
                key={label}
                style={{
                  padding: '12px 18px',
                  background: '#071828',
                  border: '1px solid #1a3a5c',
                  borderRadius: 10,
                  textAlign: 'center',
                  flex: '1 1 140px',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>{stat}</div>
                <div style={{ fontSize: 13, color: '#a8b4c4', marginTop: 3, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 64 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 10 }}>WHY THIS MATTERS</div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 18px' }}>
            Boiling does not remove lead. Standard pitcher filters (Brita, PUR) do not remove lead. Only reverse osmosis
            or NSF/ANSI 53-certified filters remove lead at the tap.
          </p>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
            Run your ZIP on the homepage for live SDWIS lead samples where EPA has them for your utility.
          </p>
        </div>

        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 16 }}>
            TOP 25 — LEAD PIPE RISK (BY SAFETY SCORE)
          </div>
          <CityRankingList
            items={top25.map((c) => {
              const issue =
                CITIES[c.slug]?.issues.find((iss) => LEAD_ISSUE_RE.test(iss)) ?? c.keyFinding;
              return {
                slug: c.slug,
                name: c.name,
                state: c.state,
                subtitle: `${issue} · ${c.population} residents`,
                badge: `Grade ${c.grade}`,
                badgeColor: c.gradeColor,
                rightLabel: `${c.score}/88`,
                rightColor: c.gradeColor,
              };
            })}
          />
        </div>

        {rest.length > 0 && (
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 12 }}>
              ALL {leadCities.length} CITIES WITH LEAD RISK FLAGS
            </div>
            <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, overflow: 'hidden' }}>
              {rest.map((c, i) => (
                <Link key={c.slug} prefetch href={`/water/${c.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '11px 16px',
                      borderBottom: '1px solid #0f2336',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 24 }}>#{i + 26}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                        {c.name}, {c.state}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.gradeColor }}>{c.score}/88</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: '24px 26px',
            background: 'linear-gradient(135deg, #071828, #040d14)',
            border: '1px solid rgba(8,145,178,0.3)',
            borderRadius: 14,
            marginBottom: 72,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>
            WHAT TO DO IF YOUR CITY IS ON THIS LIST
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                step: '1',
                text: "Check your ZIP — city-wide risk doesn't mean every home is affected. Newer plastic plumbing lowers risk.",
              },
              { step: '2', text: 'Test your tap with a certified mail-in kit for measured lead at your faucet.' },
              {
                step: '3',
                text: 'Use NSF/ANSI 53-certified filtration or RO. Flush lines 30 seconds if pipes may contain lead.',
              },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#0891b2',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {step}
                </div>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              prefetch href="/"
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
              Check My ZIP Code →
            </Link>
            <Link
              href="/blog/best-water-filter-for-lead-removal"
              prefetch
              style={{
                display: 'inline-block',
                padding: '11px 22px',
                background: 'transparent',
                border: '1px solid #1a3a5c',
                borderRadius: 9,
                color: '#cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Best filters for lead →
            </Link>
          </div>
        </div>

        <RankingRelatedLinks
          links={[
            { href: '/worst-cities', label: 'Worst cities overall', desc: 'Lowest Water Safety Scores' },
            { href: '/lead', label: 'Lead explainer', desc: 'How lead gets into tap water' },
            { href: '/worst-violations', label: 'EPA violations', desc: 'Worst compliance records' },
          ]}
        />
      </div>
    </div>
  );
}
