import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
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
  const cd = CITIES.phoenix;
  return metadataForPriorityCity('phoenix', cd)!;
}

const FILTERS = [
  {
    name: 'Waterdrop G3P600 Reverse Osmosis',
    badge: 'BEST FOR PHOENIX',
    price: '~$439',
    why: "Removes chromium-6, PFAS, arsenic, hardness, and sodium. The only filter type that handles Phoenix's full contaminant profile. NSF 42/53/58 certified.",
    link: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON_TAG}`,
    best: true,
  },
  {
    name: 'SpringWell Salt-Based Softener',
    badge: 'BEST FOR HARD WATER',
    price: '~$799',
    why: "Essential for Phoenix's extreme hardness (288 mg/L). Protects pipes, appliances, and water heater from scale. Pair with RO for drinking water.",
    link: `https://www.amazon.com/dp/B08CXWMJGT?tag=${AMAZON_TAG}`,
    best: false,
  },
  {
    name: 'Clearly Filtered Pitcher',
    badge: 'BEST NO-INSTALL',
    price: '~$90',
    why: "NSF P473 certified for PFAS removal. Also removes arsenic and chromium. Good for renters who can't install under-sink systems.",
    link: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`,
    best: false,
  },
];

const FAQS = [
  {
    q: 'Is Phoenix tap water safe to drink?',
    a: "Phoenix water meets all federal EPA legal standards with no open violations. However PFAS exceeds the 2024 EPA limit at 7.4 ppt, chromium-6 exceeds California's health goal, and arsenic is elevated. A reverse osmosis filter is strongly recommended.",
  },
  {
    q: 'Why is Phoenix water so hard?',
    a: 'Phoenix draws primarily from the Colorado River, which picks up calcium, magnesium, and other minerals as it flows through limestone and desert rock. At 288 mg/L, Phoenix has some of the hardest water of any major US city.',
  },
  {
    q: 'Does Phoenix water have PFAS?',
    a: "Yes — PFAS has been detected at 7.4 ppt, primarily from Luke Air Force Base firefighting foam contamination. This exceeds the EPA's 2024 limit. Only reverse osmosis removes PFAS reliably.",
  },
  {
    q: 'Does Phoenix water have chromium-6?',
    a: "Yes — Phoenix water contains chromium-6 at 0.21 ppb, above California's health goal of 0.02 ppb. There is no federal MCL for chromium-6 specifically. Reverse osmosis removes chromium-6.",
  },
  {
    q: 'What is the best water filter for Phoenix?',
    a: "Given Phoenix's chromium-6, PFAS, arsenic, and extreme hardness, a reverse osmosis system is essential. The Waterdrop G3P600 handles Phoenix's full contaminant profile. Pair with a water softener for whole-home hard water protection.",
  },
];

const phoenixFaqSchema = buildFaqPageSchema(
  FAQS.map(({ q, a }) => ({ name: q, text: a })),
  'https://watercheckup.com/water/phoenix'
);

const phoenixBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
    { '@type': 'ListItem', position: 2, name: 'Water Quality by City', item: 'https://watercheckup.com/water' },
    { '@type': 'ListItem', position: 3, name: 'Phoenix Water Quality', item: 'https://watercheckup.com/water/phoenix' },
  ],
};

export default function PhoenixWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(phoenixFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(phoenixBreadcrumbLd) }} />
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
          <span>Phoenix, AZ</span>
        </nav>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>Phoenix Water Quality 2026</h1>
        <AuthorReviewBadge style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 8px' }}>Phoenix Water Services · Colorado River / Salt River Project · 2024–2026 data</p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 28px' }}>Source: Phoenix Water CCR 2024 · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database</p>
        <CityDedicatedScoreHero
          urgency={CITIES.phoenix.urgency}
          issues={CITIES.phoenix.issues}
          waterProfile={CITIES.phoenix.waterProfile}
          pfas={getCityPfasData(resolveCityPwsid('phoenix', CITIES.phoenix.pwsid, CITIES.phoenix.zip))}
          summary="Phoenix water has chromium-6 above California health goals, significant PFAS from Luke Air Force Base contamination, high arsenic, and extremely hard water from the Colorado River. A reverse osmosis filter is strongly recommended."
          stats={[
            { label: 'Open Violations', value: '0', color: '#22d3ee' },
            { label: 'PFAS Detected', value: '5', color: '#f59e0b' },
            { label: 'Chromium-6', value: 'Elevated', color: '#ef4444' },
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
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>85001, 85002, 85003 and all Phoenix ZIP codes</div>
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
        <PriorityCityEditorial slug="phoenix" />
        <CityFilterGuideLinks />
        <PriorityCityLiveDataBlock slug="phoenix" />
        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>BEST FILTERS FOR PHOENIX WATER</div>
          {FILTERS.map((f) => (
            <div
              key={f.name}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '16px 18px',
                background: f.best ? 'rgba(8,145,178,0.08)' : '#071828',
                border: f.best ? '2px solid rgba(8,145,178,0.4)' : '1px solid #1a3a5c',
                borderRadius: 12,
                marginBottom: 12,
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
                  href={f.link}
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
                  View on Amazon →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>FREQUENTLY ASKED QUESTIONS</div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ padding: '14px 0', borderBottom: i < FAQS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{faq.q}</div>
              <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
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
          Data sourced from Phoenix Water CCR 2024, EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. Some filter links are affiliate links.
        </p>
      </div>
    </div>
  );
}
