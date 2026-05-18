import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { metadataForPriorityCity } from '@/lib/priority-city-seo';

const AMAZON_TAG = 'watercheck20-20';

export const metadata = metadataForPriorityCity('houston')!;

const CONTAMINANTS = [
  {
    name: 'PFAS (Total)',
    level: '22.4 ppt',
    status: 'Above EPA MCL',
    color: '#ef4444',
    desc: "Houston has among the highest PFAS levels of any major US city — 5.6× above the EPA's 2024 legal limit of 4 ppt. Industrial contamination from the Houston Ship Channel and petrochemical facilities is a primary source. Only reverse osmosis removes PFAS reliably.",
  },
  {
    name: 'Arsenic',
    level: '5.1 ppb',
    status: 'Elevated',
    color: '#f59e0b',
    desc: "Naturally occurring arsenic at more than half the EPA legal limit of 10 ppb. EWG's health guideline is 0.004 ppb — making Houston's arsenic level 1,275× over the stricter health goal. Long-term exposure linked to bladder and lung cancer.",
  },
  {
    name: 'Total Trihalomethanes (TTHMs)',
    level: '58 ppb',
    status: 'Approaching limit',
    color: '#f59e0b',
    desc: "At 58 ppb — 73% of the EPA's 80 ppb limit — Houston's TTHM levels are among the highest of major Texas cities. Formed when chlorine reacts with organic matter in Trinity River source water. Linked to bladder cancer with long-term exposure.",
  },
  {
    name: 'Haloacetic Acids (HAA5)',
    level: '41 ppb',
    status: 'Elevated',
    color: '#f59e0b',
    desc: 'At 68% of the EPA limit, HAA5 levels are elevated in Houston water. Disinfection byproducts that form during chlorine treatment of surface water.',
  },
  {
    name: 'Radium (combined)',
    level: '1.8 pCi/L',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Naturally occurring radium present in Houston water below the EPA limit of 5 pCi/L. Removed by reverse osmosis.',
  },
  {
    name: 'Sodium',
    level: '68 mg/L',
    status: 'Elevated',
    color: '#f97316',
    desc: 'Houston water has naturally elevated sodium. People on low-sodium diets or with heart conditions should be aware. Reverse osmosis reduces sodium significantly.',
  },
  {
    name: 'Hardness',
    level: '184 mg/L',
    status: 'Hard',
    color: '#f59e0b',
    desc: 'Houston water is hard, causing scale buildup in pipes and appliances. A water softener helps protect appliances and plumbing.',
  },
  {
    name: 'Lead',
    level: '2.1 ppb',
    status: 'Below action level',
    color: '#22d3ee',
    desc: 'Well below the EPA action level of 15 ppb. Lead risk in Houston is primarily from older home plumbing, not the distribution system.',
  },
  {
    name: 'Fluoride',
    level: '0.7 ppm',
    status: 'At recommended level',
    color: '#22d3ee',
    desc: 'Houston Water adds fluoride at the HHS recommended level of 0.7 ppm.',
  },
  {
    name: 'Nitrate',
    level: '1.4 ppm',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Well below the EPA limit of 10 ppm. Not a concern for Houston residents.',
  },
] as const;

const FILTER_PICKS = [
  {
    name: 'Waterdrop G3P800 Reverse Osmosis',
    badge: 'BEST FOR HOUSTON WATER',
    price: '~$849',
    why: "Removes 99%+ PFAS, arsenic, radium, TTHMs, sodium, and hardness. NSF 42/53/58 certified. The right choice for Houston's high PFAS and arsenic levels.",
    dp: 'B0987FCQQW',
    best: true,
  },
  {
    name: 'Aquasana SmartFlow RO',
    badge: 'MOST CERTIFIED',
    price: '~$449',
    why: 'NSF 42/53/58/401 certified — removes PFAS, arsenic, radium, and TTHMs. Most certifications of any under-sink RO system.',
    dp: 'B0CHZ8VQBB',
    best: false,
  },
  {
    name: 'Clearly Filtered Pitcher',
    badge: 'BEST NO-INSTALL',
    price: '~$90',
    why: 'NSF P473 certified for PFAS removal. Good for renters. Removes PFAS, arsenic, and 365+ contaminants without installation.',
    dp: 'B076B6FXT5',
    best: false,
  },
] as const;

const FAQS = [
  {
    q: 'Is Houston tap water safe to drink?',
    a: "Houston water meets all federal EPA legal standards — there are no open violations. However, PFAS has been detected at 22.4 ppt, which exceeds the EPA's 2024 limit of 4 ppt for PFOA/PFOS individually. A reverse osmosis filter is strongly recommended for Houston households.",
  },
  {
    q: 'Does Houston water have PFAS?',
    a: 'Yes — Houston has among the highest PFAS levels of any major US city at 22.4 ppt total. Industrial contamination from the Houston Ship Channel area is the primary source. Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.',
  },
  {
    q: 'Does Houston water have arsenic?',
    a: "Yes — Houston water contains arsenic at 5.1 ppb, naturally occurring from the Trinity River watershed. This is below the EPA limit of 10 ppb but well above the EWG health guideline of 0.004 ppb. Reverse osmosis removes arsenic.",
  },
  {
    q: 'Why does Houston water taste bad?',
    a: "Houston's surface water source (Trinity River / Lake Houston) has high organic content, which leads to elevated disinfection byproducts (TTHMs and HAAs) when treated with chlorine. These byproducts affect taste and odor. An activated carbon or RO filter significantly improves taste.",
  },
  {
    q: 'What is the best water filter for Houston?',
    a: "Given Houston's high PFAS, arsenic, TTHMs, and elevated sodium, a reverse osmosis system is the best choice. The Waterdrop G3P800 or Aquasana SmartFlow RO handle Houston's full contaminant profile. For renters, the Clearly Filtered pitcher removes PFAS without installation.",
  },
] as const;

export default function HoustonWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/water" style={{ color: '#64748b', textDecoration: 'none' }}>
            Cities
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Houston, TX</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2025</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>
          Houston, TX Water Quality Report
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 8px' }}>
          Houston Water · Trinity River / Lake Houston source · 2024–2025 data
        </p>
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 28px' }}>
          Source: Houston Water CCR 2024 · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            padding: '20px 24px',
            background: '#071828',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>48</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>/ 88</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>D+</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444', marginBottom: 6 }}>Poor</div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Houston has some of the most contaminated tap water of any major US city. Significant PFAS contamination from industrial sources, elevated arsenic, high disinfection byproducts, radium, and very high sodium. A reverse osmosis filter is strongly recommended.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {[
              { label: 'Open Violations', value: '0', color: '#22d3ee' },
              { label: 'PFAS Detected', value: '6', color: '#ef4444' },
              { label: 'Arsenic', value: 'Elevated', color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '8px 16px', background: '#0d2240', borderRadius: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color }}>{value}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            background: '#0891b2',
            borderRadius: 12,
            marginBottom: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Get your specific ZIP code report</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>77001, 77002, 77003 and all Houston ZIP codes</div>
          </div>
          <Link
            href="/"
            style={{
              padding: '10px 20px',
              background: '#fff',
              borderRadius: 8,
              color: '#0891b2',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Check My ZIP →
          </Link>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            CONTAMINANTS IN HOUSTON WATER — 2024 DATA
          </div>
          {CONTAMINANTS.map((c, i) => (
            <div key={c.name} style={{ padding: '14px 0', borderBottom: i < CONTAMINANTS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{c.level}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${c.color}20`,
                      color: c.color,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '20px 22px',
            background: '#071828',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 12 }}>
            ⚠️ HOUSTON&apos;S PFAS PROBLEM
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            Houston&apos;s PFAS contamination is driven by its massive petrochemical and industrial complex. The Houston Ship Channel area has dozens of facilities that historically used PFAS-containing products including firefighting foam. This industrial PFAS has contaminated the Trinity River watershed that feeds Houston&apos;s water supply.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            At 22.4 ppt total PFAS, Houston exceeds the EPA&apos;s 2024 limits significantly.{' '}
            <strong style={{ color: '#e2e8f0' }}>Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.</strong> Standard pitcher filters, Brita, and PUR do not remove PFAS.
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            BEST FILTERS FOR HOUSTON WATER
          </div>
          {FILTER_PICKS.map((f, i) => (
            <div
              key={f.dp}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '16px 18px',
                background: f.best ? 'rgba(8,145,178,0.08)' : '#071828',
                border: f.best ? '2px solid rgba(8,145,178,0.4)' : '1px solid #1a3a5c',
                borderRadius: 12,
                marginBottom: i < FILTER_PICKS.length - 1 ? 12 : 0,
              }}
            >
              <div style={{ fontSize: 28, flexShrink: 0 }} aria-hidden>
                💧
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{f.name}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: f.best ? '#0891b2' : '#1e3a5f',
                      color: '#fff',
                    }}
                  >
                    {f.badge}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{f.price}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>{f.why}</div>
                <a
                  href={`https://www.amazon.com/dp/${f.dp}?tag=${AMAZON_TAG}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: f.best ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                    border: f.best ? 'none' : '1px solid #1a3a5c',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  View on Amazon →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ padding: '14px 0', borderBottom: i < FAQS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{faq.q}</div>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '16px 20px',
            background: '#071828',
            border: '1px solid #1a3a5c',
            borderRadius: 10,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>📋 Official Houston Water Quality Report</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Complete 2024 test results from Houston Water</div>
          </div>
          <a
            href="https://www.houstonwater.org/water-quality/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            View CCR Report →
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Check Your ZIP Code →
          </Link>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 12 }}>Free · No account · Any US ZIP code</p>
        </div>

        <FounderCityAttribution />

        <p style={{ fontSize: 11, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Data sourced from Houston Water CCR 2024, EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. WaterCheckup is not affiliated with Houston Water or the EPA. Some filter links are affiliate links.
        </p>
      </div>
    </div>
  );
}
