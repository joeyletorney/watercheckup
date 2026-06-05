import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import type { Metadata } from 'next';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
import { metadataForPriorityCity } from '@/lib/priority-city-seo';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { PriorityCityEditorial } from '@/components/PriorityCityEditorial';
import { CityFilterGuideLinks } from '@/components/CityFilterGuideLinks';
import { CITIES } from '../[city]/cities-data';
import { CityDedicatedScoreHero } from '@/components/CityDedicatedScoreHero';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '@/lib/city-pwsid';

const AMAZON_TAG = 'watercheck20-20';

export function generateMetadata(): Metadata {
  const cd = CITIES['san-antonio'];
  return metadataForPriorityCity('san-antonio', cd)!;
}

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
    name: 'Waterdrop G3P600 Reverse Osmosis',
    badge: 'BEST FOR SA WATER',
    price: '~$439',
    why: 'Removes 99%+ PFAS, radium, arsenic, sodium, and hardness minerals. NSF 58 certified. Tankless design fits under most SA kitchen sinks. Handles the full SA contaminant profile.',
    dp: 'B07P1XFYJP',
    directLink: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb',
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
    a: 'Yes — SAWS water meets all federal EPA drinking water standards. There are no open violations as of 2026. However, PFAS has been detected above stricter EWG health guidelines, and the water is very hard. Many residents choose to filter for taste, hardness, and PFAS.',
  },
  {
    q: 'Why is San Antonio water so hard?',
    a: 'SA water comes from the Edwards Aquifer, which runs through porous limestone rock. As water moves through the limestone, it dissolves calcium and magnesium — the minerals that cause hardness. At 272 mg/L, SA water is classified as very hard.',
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
    a: "Given SA's hard water, PFAS, radium, and elevated sodium, a reverse osmosis system is the most comprehensive solution. The Waterdrop G3P600 RO handles all of SA's main water concerns. For whole-home hard water, pair it with a salt-based water softener.",
  },
  {
    q: 'Does SAWS add fluoride to the water?',
    a: 'Yes — SAWS adds fluoride at 0.7 ppm, the level recommended by the Department of Health and Human Services for dental health.',
  },
] as const;

const sanAntonioFaqSchema = buildFaqPageSchema(
  FAQS.map(({ q, a }) => ({ name: q, text: a })),
  'https://watercheckup.com/water/san-antonio'
);

const saBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
    { '@type': 'ListItem', position: 2, name: 'Water Quality by City', item: 'https://watercheckup.com/water' },
    { '@type': 'ListItem', position: 3, name: 'San Antonio Water Quality', item: 'https://watercheckup.com/water/san-antonio' },
  ],
};

export default function SanAntonioWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sanAntonioFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(saBreadcrumbLd) }}
      />
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/water" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Cities
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>San Antonio, TX</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>
          San Antonio Water Quality 2026
        </h1>
        <AuthorReviewBadge style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 8px' }}>
          San Antonio Water System (SAWS) · Edwards Aquifer · 2024–2025 data
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px' }}>
          Source: SAWS 2025 Water Quality Report (2024 data) · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 28px' }}>
          Updated May 2026 · 2024 SAWS data
        </p>

        <CityDedicatedScoreHero
          urgency={CITIES['san-antonio'].urgency}
          issues={CITIES['san-antonio'].issues}
          waterProfile={CITIES['san-antonio'].waterProfile}
          pfas={getCityPfasData(resolveCityPwsid('san-antonio', CITIES['san-antonio'].pwsid, CITIES['san-antonio'].zip))}
          summary="San Antonio's water comes from the Edwards Aquifer — naturally hard and high in minerals. PFAS has been detected above EWG health guidelines, radium is present from limestone geology, and sodium levels are elevated. No open EPA violations as of 2026."
          stats={[
            { label: 'Open Violations', value: '0', color: '#22d3ee' },
            { label: 'PFAS Detected', value: '4', color: '#f59e0b' },
            { label: 'Hardness', value: 'Very Hard', color: '#f97316' },
          ]}
        />

        <div
          style={{
            padding: '16px 20px',
            background: '#0891b2',
            borderRadius: 12,
            marginBottom: 56,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Get your specific ZIP code report</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>78201, 78202, 78203 and all SA ZIP codes</div>
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

        <PriorityCityEditorial slug="san-antonio" />

        <CityFilterGuideLinks />

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            CONTAMINANTS IN SAN ANTONIO WATER — 2024 DATA
          </div>

          {CONTAMINANTS.map((c, i) => (
            <div key={c.name} style={{ padding: '14px 0', borderBottom: i < CONTAMINANTS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{c.level}</span>
                  <span
                    style={{
                      fontSize: 13,
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
              <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>
            WHERE DOES SAN ANTONIO WATER COME FROM?
          </div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
            San Antonio draws primarily from the <strong style={{ color: '#e2e8f0' }}>Edwards Aquifer</strong> — one of the most productive aquifers in the US, fed by rainfall in the Texas Hill Country that percolates through limestone rock. This limestone geology is what makes SA water naturally hard and high in calcium, magnesium, and radium.
          </p>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
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
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316', letterSpacing: 2, marginBottom: 12 }}>
            ⚠️ SAN ANTONIO&apos;S HARD WATER PROBLEM
          </div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
            At 272 mg/L, San Antonio has some of the <strong style={{ color: '#e2e8f0' }}>hardest tap water of any major US city</strong>. Hard water isn&apos;t a health hazard, but it causes real problems:
          </p>
          <ul style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 12px', paddingLeft: 20 }}>
            <li>Scale buildup clogs pipes and reduces water heater efficiency by up to 30%</li>
            <li>Dishwashers leave white spots and film on glasses</li>
            <li>Soap and shampoo don&apos;t lather well — you use more product</li>
            <li>Skin and hair feel dry after showering</li>
            <li>Appliances (washing machines, coffee makers) have shorter lifespans</li>
          </ul>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#e2e8f0' }}>Solution:</strong> A salt-based water softener is the most effective treatment for SA&apos;s hard water. For drinking water specifically, a reverse osmosis system removes hardness minerals along with PFAS, radium, arsenic, and sodium.
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            BEST FILTERS FOR SAN ANTONIO WATER
          </div>
          <p style={{ fontSize: 13, color: '#a8b4c4', margin: '0 0 22px' }}>
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
                <div style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 6 }}>{f.price}</div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 10 }}>{f.why}</div>
                <a
                  href={(f as any).directLink || `https://www.amazon.com/dp/${f.dp}?tag=${AMAZON_TAG}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: f.best ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                    border: f.best ? 'none' : '1px solid #1a3a5c',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {(f as any).directLink ? 'Buy Direct →' : 'View on Amazon →'}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* AdSense slot — mid-page (between filters and FAQ) */}
        <div
          id="wc-ad-mid"
          style={{ margin: '0 0 20px', minHeight: 90, background: 'transparent', textAlign: 'center' }}
          aria-label="Advertisement"
        />

        {/* Reddit community block */}
        <div style={{ padding: '20px 22px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316', letterSpacing: 2, marginBottom: 4 }}>
            WHAT SAN ANTONIO RESIDENTS SAY
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            Compiled from r/sanantonio and r/watertreatment discussions — summarized themes, not endorsements
          </div>

          {[
            {
              theme: '"The scale is real — water heater died in 4 years"',
              detail: 'Hard water scale is the #1 complaint from SA residents. Multiple threads report water heaters, dishwashers, and coffee makers failing earlier than expected. The recurring fix: a whole-home salt-based softener paired with an RO for drinking.',
              tag: 'Hard Water',
              tagColor: '#f97316',
            },
            {
              theme: '"RO under the sink was a game changer for taste"',
              detail: 'The most-recommended fix for SA drinking water across Reddit threads is an under-sink reverse osmosis system. Users specifically cite the improvement in taste and the removal of the "mineral" aftertaste common with Edwards Aquifer water.',
              tag: 'Filters',
              tagColor: '#0891b2',
            },
            {
              theme: '"I tested for PFAS after the EPA announcement"',
              detail: 'After the EPA\'s 2024 PFAS rule, several SA residents posted about getting home tests or switching to RO pitchers. The Clearly Filtered pitcher is frequently mentioned as the most accessible no-install option for renters.',
              tag: 'PFAS',
              tagColor: '#ef4444',
            },
            {
              theme: '"SAWS meets legal limits — but that\'s not the same as clean"',
              detail: 'A recurring theme in r/sanantonio water threads: residents understanding the difference between EPA compliance and independent health guidelines. Many reference EWG data showing contaminants above health-advisory levels even when legal limits are met.',
              tag: 'EPA Compliance',
              tagColor: '#cbd5e1',
            },
          ].map(({ theme, detail, tag, tagColor }) => (
            <div
              key={tag}
              style={{
                padding: '14px 16px',
                background: '#0d2240',
                border: '1px solid #0f2336',
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', borderRadius: 4, background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}44` }}>
                  {tag}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>
                  {theme}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0, lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}

          <div style={{ marginTop: 14, fontSize: 13, color: '#94a3b8' }}>
            Sources:{' '}
            <a href="https://www.reddit.com/r/sanantonio/search/?q=water+quality" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
              r/sanantonio water discussions
            </a>
            {' · '}
            <a href="https://www.reddit.com/r/watertreatment/search/?q=san+antonio" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
              r/watertreatment
            </a>
          </div>
        </div>

        <section
          id="faq"
          aria-labelledby="sa-faq-heading"
          style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}
        >
          <h2
            id="sa-faq-heading"
            style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, margin: '0 0 22px', textTransform: 'uppercase' }}
          >
            Frequently asked questions
          </h2>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ padding: '14px 0', borderBottom: i < FAQS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px', lineHeight: 1.4 }}>{faq.q}</h3>
              <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </section>

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
            <div style={{ fontSize: 13, color: '#a8b4c4' }}>Complete 2024 test results direct from San Antonio Water System</div>
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

        {/* AdSense slot — below FAQ, above related guides */}
        <div
          id="wc-ad-bottom"
          style={{ margin: '0 0 20px', minHeight: 90, background: 'transparent', textAlign: 'center' }}
          aria-label="Advertisement"
        />

        <NewsletterSignup
          source="water-san-antonio"
          zip="78205"
          title="San Antonio water alerts"
          description="Weekly updates when SAWS EPA data, PFAS UCMR5, or violations change for your ZIP."
          compact
        />

        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>RELATED GUIDES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/blog/san-antonio-water-quality', label: 'San Antonio water quality 2026 — full SAWS report' },
              { href: '/blog/pfas-in-san-antonio-water', label: 'PFAS in San Antonio water — levels & filters' },
              { href: '/blog/what-water-filter-removes-pfas', label: 'PFAS removal water filter — NSF certified options' },
              { href: '/blog/best-water-filter-for-lead-removal', label: 'Water filters that remove lead (NSF 53)' },
              { href: '/blog/best-water-filter-hard-water', label: 'Best filters for hard water — San Antonio & more' },
              { href: '/pfas', label: 'PFAS in tap water — EPA limits & filters' },
              { href: '/worst-pfas', label: 'US water systems with the highest PFAS — ranked' },
              { href: '/worst-pfas-cities', label: 'Worst cities for PFAS (MCL + peaks)' },
              { href: '/best-cities', label: 'Best tap water cities (safety score)' },
              { href: '/worst-hardness', label: 'Hardest tap water in America' },
              { href: '/rankings', label: 'State water quality rankings' },
              { href: '/water', label: 'All city water quality reports' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#071828',
                  border: '1px solid #1a3a5c',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {label} <span style={{ color: '#22d3ee' }}>→</span>
              </Link>
            ))}
          </div>
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
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 12 }}>Free · No account · Any US ZIP code</p>
        </div>

        <FounderCityAttribution />

        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Data sourced from SAWS 2025 Water Quality Report (2024 data), EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. WaterCheckup is not affiliated with SAWS or the EPA. Some filter links are affiliate links — we may earn a commission at no cost to you.
        </p>
      </div>
    </div>
  );
}
