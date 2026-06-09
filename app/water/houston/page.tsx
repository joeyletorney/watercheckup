import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { metadataForPriorityCity } from '@/lib/priority-city-seo';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { PriorityCityEditorial } from '@/components/PriorityCityEditorial';
import { CityFilterGuideLinks } from '@/components/CityFilterGuideLinks';
import { CITIES } from '../[city]/cities-data';
import { CityDedicatedScoreHero } from '@/components/CityDedicatedScoreHero';
import { PriorityCityLiveDataBlock } from '@/components/PriorityCityLiveDataBlock';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '@/lib/city-pwsid';

const AMAZON_TAG = 'watercheck20-20';

export function generateMetadata(): Metadata {
  const cd = CITIES.houston;
  return metadataForPriorityCity('houston', cd)!;
}

const FILTER_PICKS = [
  {
    name: 'Waterdrop G3P600 Reverse Osmosis',
    badge: 'BEST FOR HOUSTON WATER',
    price: '~$439',
    why: "Removes 99%+ PFAS, arsenic, radium, TTHMs, sodium, and hardness. NSF 42/53/58 certified. The right choice for Houston's high PFAS and arsenic levels.",
    dp: 'B07P1XFYJP',
    directLink: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb',
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
    a: "Given Houston's high PFAS, arsenic, TTHMs, and elevated sodium, a reverse osmosis system is the best choice. The Waterdrop G3P600 or Aquasana SmartFlow RO handle Houston's full contaminant profile. For renters, the Clearly Filtered pitcher removes PFAS without installation.",
  },
] as const;

const houstonBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
    { '@type': 'ListItem', position: 2, name: 'Water Quality by City', item: 'https://watercheckup.com/water' },
    { '@type': 'ListItem', position: 3, name: 'Houston Water Quality', item: 'https://watercheckup.com/water/houston' },
  ],
};

export default function HoustonWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(houstonBreadcrumbLd) }} />
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 16 }}>
          <Link prefetch href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link prefetch href="/water" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Cities
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Houston, TX</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>
          Houston Water Quality 2026
        </h1>
        <AuthorReviewBadge style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 8px' }}>
          Houston Water · Trinity River / Lake Houston source · 2024–2025 data
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 28px' }}>
          Source: Houston Water CCR 2024 · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database
        </p>

        <CityDedicatedScoreHero
          urgency={CITIES.houston.urgency}
          issues={CITIES.houston.issues}
          waterProfile={CITIES.houston.waterProfile}
          pfas={getCityPfasData(resolveCityPwsid('houston', CITIES.houston.pwsid, CITIES.houston.zip))}
          summary="Houston has some of the most contaminated tap water of any major US city. Significant PFAS contamination from industrial sources, elevated arsenic, high disinfection byproducts, radium, and very high sodium. A reverse osmosis filter is strongly recommended."
          stats={[
            { label: 'Open Violations', value: '0', color: '#22d3ee' },
            { label: 'PFAS Detected', value: '6', color: '#ef4444' },
            { label: 'Arsenic', value: 'Elevated', color: '#f59e0b' },
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
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>77001, 77002, 77003 and all Houston ZIP codes</div>
          </div>
          <Link
            prefetch
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

        <PriorityCityEditorial slug="houston" />

        <CityFilterGuideLinks />

        <PriorityCityLiveDataBlock slug="houston" />

        <div
          style={{
            padding: '20px 22px',
            background: '#071828',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 2, marginBottom: 12 }}>
            ⚠️ HOUSTON&apos;S PFAS PROBLEM
          </div>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
            Houston&apos;s PFAS contamination is driven by its massive petrochemical and industrial complex. The Houston Ship Channel area has dozens of facilities that historically used PFAS-containing products including firefighting foam. This industrial PFAS has contaminated the Trinity River watershed that feeds Houston&apos;s water supply.
          </p>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            At 22.4 ppt total PFAS, Houston exceeds the EPA&apos;s 2024 limits significantly.{' '}
            <strong style={{ color: '#e2e8f0' }}>Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.</strong> Standard pitcher filters, Brita, and PUR do not remove PFAS.
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
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

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ padding: '14px 0', borderBottom: i < FAQS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{faq.q}</div>
              <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
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
            <div style={{ fontSize: 13, color: '#a8b4c4' }}>Complete 2024 test results from Houston Water</div>
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
            prefetch
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
          Data sourced from Houston Water CCR 2024, EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. WaterCheckup is not affiliated with Houston Water or the EPA. Some filter links are affiliate links.
        </p>
      </div>
    </div>
  );
}
