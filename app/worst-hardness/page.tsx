import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { CityRankingList } from '@/components/CityRankingList';
import { RankingRelatedLinks } from '@/components/RankingRelatedLinks';
import { buildHardestCities, buildStateHardnessTable } from '@/lib/city-rankings';
export const metadata: Metadata = {
  title: 'Hardest Tap Water in America — Top States & Cities (2026) | WaterCheckup',
  description:
    'US states and cities with the hardest tap water (mg/L as CaCO₃) from CCR profiles and EPA UCMR5 monitoring. Scaling, RO, and water-softener context.',
  alternates: { canonical: 'https://watercheckup.com/worst-hardness' },
};

// export const revalidate = 86400;

export default function WorstHardnessPage() {
  const cities = buildHardestCities(20);
  const states = buildStateHardnessTable().filter((s) => s.avgPpm != null).slice(0, 20);

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check hardness →" ctaHref="/water-hardness" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>
            HARDNESS · MG/L AS CACO₃
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 22px' }}>
            Hardest tap water in America
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            Hard water is mostly a <strong style={{ color: '#e2e8f0' }}>nuisance and appliance issue</strong> (scale,
            soap, water heaters) — not the same as PFAS or lead safety. Rankings use Consumer Confidence Report values
            where we have them, otherwise averages from EPA UCMR5 hardness fields on tracked city PWSIDs.
          </p>
        </div>

        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>
            TOP 20 STATES (AVERAGE HARDNESS)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {states.map((s, i) => (
              <Link
                key={s.abbr}
                prefetch href={`/water/state/${s.stateSlug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#071828',
                    border: '1px solid #1a3a5c',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <span style={{ color: '#94a3b8', marginRight: 10, fontSize: 13 }}>{i + 1}.</span>
                    <span style={{ fontWeight: 800, color: '#f1f5f9' }}>{s.stateName}</span>
                    <span style={{ color: '#a8b4c4', marginLeft: 8, fontSize: 13 }}>
                      {s.citiesTested} cities sampled
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#f59e0b' }}>
                    {s.avgPpm} mg/L · {s.classification}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 14 }}>
            TOP 20 CITIES
          </div>
        </div>
        <CityRankingList
          items={cities.map((c) => ({
            slug: c.slug,
            name: c.name,
            state: c.state,
            subtitle: c.source,
            badge: c.tierLabel,
            badgeColor: '#f59e0b',
            rightLabel: `${c.hardnessMgL} mg/L`,
            rightColor: '#f59e0b',
          }))}
        />

        <RankingRelatedLinks
          links={[
            { href: '/water-hardness', label: 'Hardness by ZIP', desc: 'Look up your address' },
            { href: '/blog/top-10-cities-hardest-tap-water', label: 'Hardest cities blog', desc: 'Editorial deep dive' },
            { href: '/worst-cities', label: 'Worst water safety cities', desc: 'Exposure score — not hardness' },
          ]}
        />
      </div>
    </div>
  );
}
