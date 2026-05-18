import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { metadataForPriorityCity } from '@/lib/priority-city-seo';

const AMAZON_TAG = 'watercheck20-20';

export const metadata = metadataForPriorityCity('san-antonio')!;

const CONTAMINANTS = [
  {
    name: 'Water Hardness',
    level: '272 mg/L',
    status: 'Very Hard',
    color: '#f97316',
    desc: 'San Antonio has some of the hardest water in the US. Edwards Aquifer water dissolves calcium and magnesium from limestone rock, creating scale buildup in pipes, appliances, water heaters, and fixtures. A water softener is strongly recommended for most SA homes.',
  },
  {
    name: 'PFAS (Total)',
    level: '4.1 ppt',
    status: 'Above health guideline',
    color: '#ef4444',
    desc: 'PFAS “forever chemicals” detected in SAWS water at levels above EWG health guidelines (0.001 ppt). Below EPA’s 2024 legal limit of 4 ppt for PFOA/PFOS individually. Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.',
  },
  {
    name: 'Radium (combined)',
    level: '3.4 pCi/L',
    status: 'Below EPA limit',
    color: '#f59e0b',
    desc: 'Naturally occurring radium from Edwards Aquifer limestone geology. At 3.4 pCi/L, this is below the EPA limit of 5 pCi/L but elevated relative to national averages. Long-term exposure increases bone cancer risk.',
  },
  {
    name: 'Arsenic',
    level: '3.8 ppb',
    status: 'Below EPA limit',
    color: '#f59e0b',
    desc: 'Naturally occurring arsenic from aquifer geology. Below the EPA limit of 10 ppb but above EWG’s health guideline of 0.004 ppb. Long-term exposure is linked to bladder and lung cancer.',
  },
  {
    name: 'Sodium',
    level: '92 mg/L',
    status: 'Elevated',
    color: '#f97316',
    desc: 'San Antonio water is naturally high in sodium due to Edwards Aquifer mineral content. People on low-sodium diets or with heart conditions should be aware. Reverse osmosis systems reduce sodium significantly.',
  },
  {
    name: 'Total Trihalomethanes (TTHMs)',
    level: '32 ppb',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Disinfection byproducts formed when chlorine reacts with organic matter. At 32 ppb, well below the EPA limit of 80 ppb. Linked to bladder cancer risk with long-term exposure above health guidelines.',
  },
  {
    name: 'Haloacetic Acids (HAA5)',
    level: '18 ppb',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Disinfection byproducts from chlorine treatment. At 18 ppb, well below the EPA limit of 60 ppb.',
  },
  {
    name: 'Lead',
    level: '2.2 ppb',
    status: 'Below action level',
    color: '#22d3ee',
    desc: 'SAWS 90th percentile lead result is well below the EPA action level of 15 ppb. Lead risk in SA is primarily from older home plumbing, not the distribution system. SAWS offers free lead service line inspections.',
  },
  {
    name: 'Copper',
    level: '148 ppb',
    status: 'Below action level',
    color: '#22d3ee',
    desc: 'Below EPA action level of 1,300 ppb. No concern at current levels.',
  },
  {
    name: 'Fluoride',
    level: '0.7 ppm',
    status: 'At recommended level',
    color: '#22d3ee',
    desc: 'SAWS adds fluoride at the HHS recommended level of 0.7 ppm for dental health.',
  },
  {
    name: 'Nitrate',
    level: '1.8 ppm',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Well below the EPA limit of 10 ppm. Not a concern for most San Antonio residents.',
  },
  {
    name: 'Bacteria (E. coli)',
    level: 'None detected',
    status: 'Safe',
    color: '#22d3ee',
    desc: 'SAWS sampled 390 sites monthly in 2024. No E. coli positives were found. San Antonio water is microbiologically safe.',
  },
] as const;

const FILTER_PICKS = [
  {
    name: 'Waterdrop G3P800 Reverse Osmosis',
    badge: 'BEST FOR SA WATER',
    price: '~$849',
    why: 'Removes 99%+ PFAS, radium, arsenic, sodium, and hardness minerals. NSF 58 certified. Tankless design fits under most SA kitchen sinks. Handles the full SA contaminant profile.',
    dp: 'B0987FCQQW',
    best: true,
  },
  {
    name: 'SpringWell Salt-Based Water Softener',
    badge: 'BEST FOR HARD WATER',
    price: '~$799',
    why: "Whole-home solution for SA's extreme hardness. Removes calcium and magnesium throughout the house — protects pipes, appliances, and water heater. Pair with an RO for drinking.",
    dp: 'B08CXWMJGT',
    best: false,
  },
  {
    name: 'Clearly Filtered Pitcher',
    badge: 'BEST NO-INSTALL OPTION',
    price: '~$90',
    why: 'NSF P473 certified for PFAS removal. Removes radium, arsenic, and 365+ contaminants. Best budget option for renters in San Antonio.',
    dp: 'B076B6FXT5',
    best: false,
  },
] as const;

const FAQS = [
  {
    q: 'Is San Antonio tap water safe to drink?',
    a: 'Yes — SAWS water meets all federal EPA drinking water standards. There are no open violations as of 2025. However, PFAS has been detected above stricter EWG health guidelines, and the water is very hard. Many residents choose to filter for taste, hardness, and PFAS.',
  },
  {
    q: 'Why is San Antonio water so hard?',
    a: 'SA water comes from the Edwards Aquifer, which runs through porous limestone rock. As water moves through the limestone, it dissolves calcium and magnesium — the minerals that cause hardness. At 272 mg/L, SA water is classified as “very hard.”',
  },
  {
    q: 'Does San Antonio water have PFAS?',
    a: "Yes. PFAS has been detected in SAWS water at levels above EWG health guidelines but below the EPA's 2024 legal limits (4 ppt for PFOA/PFOS). Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.",
  },
  {
    q: 'Does San Antonio water have radium?',
    a: 'Yes — radium occurs naturally in Edwards Aquifer water at 3.4 pCi/L. This is below the EPA limit of 5 pCi/L. Radium is removed by reverse osmosis systems.',
  },
  {
    q: 'What is the best water filter for San Antonio?',
    a: "Given SA's hard water, PFAS, radium, and elevated sodium, a reverse osmosis system is the most comprehensive solution. The Waterdrop G3P800 RO handles all of SA's main water concerns. For whole-home hard water, pair it with a salt-based water softener.",
  },
  {
    q: 'Does SAWS add fluoride to the water?',
    a: 'Yes — SAWS adds fluoride at 0.7 ppm, the level recommended by the Department of Health and Human Services for dental health.',
  },
] as const;

export default function SanAntonioWaterPage() {
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
          <span>San Antonio, TX</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2025</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>
          San Antonio, TX Water Quality Report
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 8px' }}>
          San Antonio Water System (SAWS) · Edwards Aquifer · 2024–2025 data
        </p>
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 28px' }}>
          Source: SAWS 2025 Water Quality Report (2024 data) · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            padding: '20px 24px',
            background: '#071828',
            border: '2px solid rgba(245,158,11,0.3)',
            borderRadius: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>63</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>/ 88</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>C</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>Concerning</div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              San Antonio&apos;s water comes from the Edwards Aquifer — naturally hard and high in minerals. PFAS has been detected above EWG health guidelines, radium is present from limestone geology, and sodium levels are elevated. No open EPA violations as of 2025.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {[
              { label: 'Open Violations', value: '0', color: '#22d3ee' },
              { label: 'PFAS Detected', value: '4', color: '#f59e0b' },
              { label: 'Hardness', value: 'Very Hard', color: '#f97316' },
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
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>78201, 78202, 78203 and all SA ZIP codes</div>
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
            CONTAMINANTS IN SAN ANTONIO WATER — 2024 DATA
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

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>
            WHERE DOES SAN ANTONIO WATER COME FROM?
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            San Antonio draws primarily from the <strong style={{ color: '#e2e8f0' }}>Edwards Aquifer</strong> — one of the most productive aquifers in the US, fed by rainfall in the Texas Hill Country that percolates through limestone rock. This limestone geology is what makes SA water naturally hard and high in calcium, magnesium, and radium.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            SAWS also draws from the <strong style={{ color: '#e2e8f0' }}>Carrizo Aquifer</strong>, <strong style={{ color: '#e2e8f0' }}>Simsboro Aquifer</strong> (via the Vista Ridge Pipeline), and surface water sources during high demand periods. This blended supply means water quality can vary slightly by neighborhood and season.
          </p>
        </div>

        <div
          style={{
            padding: '20px 22px',
            background: '#071828',
            border: '2px solid rgba(249,115,22,0.3)',
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: 2, marginBottom: 12 }}>
            ⚠️ SAN ANTONIO&apos;S HARD WATER PROBLEM
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            At 272 mg/L, San Antonio has some of the <strong style={{ color: '#e2e8f0' }}>hardest tap water of any major US city</strong>. Hard water isn&apos;t a health hazard, but it causes real problems:
          </p>
          <ul style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 12px', paddingLeft: 20 }}>
            <li>Scale buildup clogs pipes and reduces water heater efficiency by up to 30%</li>
            <li>Dishwashers leave white spots and film on glasses</li>
            <li>Soap and shampoo don&apos;t lather well — you use more product</li>
            <li>Skin and hair feel dry after showering</li>
            <li>Appliances (washing machines, coffee makers) have shorter lifespans</li>
          </ul>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#e2e8f0' }}>Solution:</strong> A salt-based water softener is the most effective treatment for SA&apos;s hard water. For drinking water specifically, a reverse osmosis system removes hardness minerals along with PFAS, radium, arsenic, and sodium.
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            BEST FILTERS FOR SAN ANTONIO WATER
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
            Given SA&apos;s hard water, PFAS, radium, arsenic, and elevated sodium — here&apos;s what actually works:
          </p>
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
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>📋 Official SAWS 2025 Water Quality Report</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Complete 2024 test results direct from San Antonio Water System</div>
          </div>
          <a
            href="https://www.saws.org/your-water/water-quality/water-quality-report/"
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
            View SAWS Report →
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
          Data sourced from SAWS 2025 Water Quality Report (2024 data), EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. WaterCheckup is not affiliated with SAWS or the EPA. Some filter links are affiliate links — we may earn a commission at no cost to you.
        </p>
      </div>
    </div>
  );
}
