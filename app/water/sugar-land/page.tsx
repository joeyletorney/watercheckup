import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { metadataForPriorityCity } from '@/lib/priority-city-seo';
import { PRIORITY_CITY_INTROS } from '@/lib/priority-city-intros';
import { CityFilterGuideLinks } from '@/components/CityFilterGuideLinks';
import { CITIES } from '../[city]/cities-data';

const AMAZON_TAG = 'watercheck20-20';

export function generateMetadata(): Metadata {
  const cd = CITIES['sugar-land'];
  return metadataForPriorityCity('sugar-land', cd)!;
}

const CONTAMINANTS = [
  {
    name: '6:2 FTS (PFAS)',
    level: '672 ppt',
    status: 'Highest peak in Texas',
    color: '#ef4444',
    desc: 'EPA UCMR5 monitoring found 672 ppt of 6:2 FTS — the highest peak PFAS reading of any large Texas water system in the federal dataset. 6:2 FTS is not yet one of the six EPA-regulated PFAS compounds, but it is a persistent forever chemical. Only reverse osmosis (NSF 58) reliably removes it at the tap.',
  },
  {
    name: 'PFOA',
    level: '4.1 ppt',
    status: 'At EPA MCL',
    color: '#f59e0b',
    desc: "PFOA was detected at 4.1 ppt — at the EPA's 2024 legal limit of 4 ppt for this regulated compound. This counts as an MCL violation in federal monitoring data.",
  },
  {
    name: 'PFPeA',
    level: '358 ppt',
    status: 'Detected (unregulated)',
    color: '#f97316',
    desc: 'Short-chain PFAS detected at elevated levels. Not yet covered by the April 2024 EPA rule, but part of the total forever-chemical burden in Sugar Land water.',
  },
  {
    name: 'PFBA',
    level: '74.8 ppt',
    status: 'Detected (unregulated)',
    color: '#f59e0b',
    desc: 'Perfluorobutanoic acid — a short-chain PFAS common in industrial runoff. No federal MCL yet; RO is still the best residential removal option.',
  },
  {
    name: 'Water Hardness',
    level: '~200 mg/L',
    status: 'Hard',
    color: '#f97316',
    desc: 'Sugar Land water is moderately hard from Brazos River and groundwater blends. A softener helps appliances; RO addresses drinking-water contaminants including PFAS.',
  },
];

const FILTERS = [
  {
    name: 'Waterdrop G3P600 Reverse Osmosis',
    badge: 'BEST FOR SUGAR LAND',
    price: '~$439',
    why: 'Removes 6:2 FTS, PFOA, and other PFAS at 99%+ when certified to NSF 58. Essential for Sugar Land’s peak UCMR5 readings and regulated PFOA at the limit.',
    link: `https://www.amazon.com/dp/B07P1XFYJP?tag=${AMAZON_TAG}`,
    best: true,
  },
  {
    name: 'Clearly Filtered 3.5L Pitcher',
    badge: 'BEST NO-INSTALL',
    price: '~$90',
    why: 'NSF P473 certified for PFOA/PFOS. Practical for renters; pair with RO if you need broader PFAS coverage including short-chain compounds.',
    link: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`,
    best: false,
  },
];

const FAQS = [
  {
    q: 'Is Sugar Land tap water safe to drink?',
    a: 'Sugar Land meets many federal standards, but EPA UCMR5 data shows a 672 ppt peak of 6:2 FTS and PFOA at the 4 ppt legal limit. For households concerned about forever chemicals, NSF 58 reverse osmosis at the kitchen tap is the most reliable fix.',
  },
  {
    q: 'What does 672 ppt PFAS mean for Sugar Land?',
    a: '672 ppt is the peak reading for 6:2 FTS in EPA monitoring — not a comparison to the PFOA/PFOS 4 ppt MCL. It is still one of the highest peak PFAS detections of any large Texas system in UCMR5. See our full compound table on the dynamic city report for every analyte.',
  },
  {
    q: 'Does boiling water remove PFAS in Sugar Land?',
    a: 'No. Boiling concentrates PFAS. Only reverse osmosis, certified carbon block systems (NSF P473), or distillation remove them effectively.',
  },
  {
    q: 'What is the best water filter for Sugar Land?',
    a: 'Given 6:2 FTS at 672 ppt and PFOA at the EPA limit, an under-sink RO certified to NSF 58 is the gold standard. Standard Brita pitchers do not remove PFAS reliably.',
  },
];

export default function SugarLandWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/water" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Cities</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Sugar Land, TX</span>
        </nav>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>Sugar Land Water Quality 2026</h1>
        <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 8px' }}>City of Sugar Land Water Public water system · Brazos River / groundwater · UCMR5 2023–2025</p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 28px' }}>Source: EPA UCMR5 (PWSID TX0790005) · EPA SDWIS · Public water system CCR</p>

        <div
          style={{
            padding: '14px 18px',
            background: '#ef444412',
            border: '1px solid #ef444430',
            borderLeft: '4px solid #ef4444',
            borderRadius: 8,
            fontSize: 13,
            color: '#cbd5e1',
            lineHeight: 1.65,
            marginBottom: 24,
          }}
        >
          <strong style={{ color: '#fca5a5' }}>How to read the numbers:</strong> Rankings on{' '}
          <Link href="/worst-pfas" style={{ color: '#22d3ee' }}>/worst-pfas</Link> use regulated MCL violations only. Sugar Land&apos;s 672 ppt peak is{' '}
          <strong style={{ color: '#f1f5f9' }}>6:2 FTS</strong> (not yet in that regulated set). PFOA was found at{' '}
          <strong style={{ color: '#f1f5f9' }}>4.1 ppt</strong> — at the EPA limit for that compound. See also our{' '}
          <Link href="/blog/top-10-most-pfas-contaminated-cities" style={{ color: '#22d3ee' }}>
            Top 10 PFAS cities report
          </Link>
          .
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
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>77478, 77479, 77498 and all Sugar Land ZIP codes</div>
          </div>
          <Link href="/" style={{ padding: '10px 20px', background: '#fff', borderRadius: 8, color: '#0891b2', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Check My ZIP →
          </Link>
        </div>

        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 28px' }}>{PRIORITY_CITY_INTROS['sugar-land']}</p>
        <CityFilterGuideLinks />

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>PFAS & CONTAMINANTS — EPA UCMR5</div>
          {CONTAMINANTS.map((c, i) => (
            <div key={c.name} style={{ padding: '14px 0', borderBottom: i < CONTAMINANTS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{c.level}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${c.color}20`, color: c.color }}>{c.status}</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>BEST FILTERS FOR SUGAR LAND WATER</div>
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
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{f.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', borderRadius: 4, background: f.best ? '#0891b2' : '#1e3a5f', color: '#fff' }}>{f.badge}</span>
                </div>
                <div style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 6 }}>{f.price}</div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 10 }}>{f.why}</div>
                <a href={f.link} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'inline-block', padding: '8px 16px', background: f.best ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', border: f.best ? 'none' : '1px solid #1a3a5c', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
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
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Check Your ZIP Code →
          </Link>
        </div>
        <FounderCityAttribution />
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Data sourced from EPA UCMR5 (TX0790005), EPA SDWIS, and public water system CCRs. Not affiliated with the City of Sugar Land. Some filter links are affiliate links.
        </p>
      </div>
    </div>
  );
}
