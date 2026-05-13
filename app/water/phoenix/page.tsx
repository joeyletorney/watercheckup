import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const AMAZON_TAG = 'watercheck20-20';

export const metadata: Metadata = {
  title: 'Phoenix Water Quality 2025 — Chromium-6, PFAS & Hard Water Report | WaterCheckup',
  description:
    'Phoenix tap water quality report 2025. Phoenix Water contains chromium-6, PFAS, arsenic, and very hard water from the Colorado River. See contaminant levels and best filters.',
  alternates: { canonical: 'https://watercheckup.com/water/phoenix' },
  openGraph: {
    title: 'Phoenix Water Quality 2025 — Chromium-6, PFAS & Hard Water Report',
    description:
      'Is Phoenix tap water safe? See chromium-6, PFAS, arsenic, hardness, and the right filters for Colorado River / SRP water.',
  },
};

const CONTAMINANTS = [
  {
    name: 'Chromium-6 (Hexavalent Chromium)',
    level: '0.21 ppb',
    status: 'Above CA health goal',
    color: '#ef4444',
    desc: "Phoenix has chromium-6 above California's health goal of 0.02 ppb. Colorado River water carries chromium-6 from natural deposits and industrial sources. Linked to stomach cancer with long-term exposure. Removed by reverse osmosis.",
  },
  {
    name: 'PFAS (Total)',
    level: '7.4 ppt',
    status: 'Above EPA MCL',
    color: '#ef4444',
    desc: "PFAS contamination primarily from Luke Air Force Base firefighting foam. At 7.4 ppt total — nearly double the EPA's 2024 limit. Only reverse osmosis or NSF 58-certified filters reliably remove PFAS.",
  },
  {
    name: 'Arsenic',
    level: '6.8 ppb',
    status: 'Elevated',
    color: '#f59e0b',
    desc: "Naturally occurring arsenic from Arizona groundwater geology. At 6.8 ppb — 68% of the EPA limit of 10 ppb. EWG's health guideline is 0.004 ppb. Long-term exposure linked to bladder and lung cancer.",
  },
  {
    name: 'Hardness',
    level: '288 mg/L',
    status: 'Very Hard',
    color: '#f97316',
    desc: 'Phoenix has some of the hardest water in the US from Colorado River mineral content. Causes severe scale buildup in pipes, appliances, and water heaters. A water softener is strongly recommended.',
  },
  {
    name: 'Sodium',
    level: '98 mg/L',
    status: 'Elevated',
    color: '#f97316',
    desc: 'Colorado River water is naturally high in sodium. Phoenix water has among the highest sodium levels of major US cities. People on low-sodium diets should filter their drinking water.',
  },
  {
    name: 'Total Trihalomethanes (TTHMs)',
    level: '34 ppb',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: "Disinfection byproducts from chlorine treatment. At 34 ppb, well below the EPA limit of 80 ppb.",
  },
  {
    name: 'Lead',
    level: '2.2 ppb',
    status: 'Below action level',
    color: '#22d3ee',
    desc: 'Well below the EPA action level of 15 ppb. Lead risk in Phoenix is primarily from older home plumbing.',
  },
  {
    name: 'Fluoride',
    level: '0.7 ppm',
    status: 'At recommended level',
    color: '#22d3ee',
    desc: 'Added at the HHS recommended level of 0.7 ppm for dental health.',
  },
  {
    name: 'Nitrate',
    level: '2.1 ppm',
    status: 'Below EPA limit',
    color: '#22d3ee',
    desc: 'Well below the EPA limit of 10 ppm. Not a concern for Phoenix residents.',
  },
];

const FILTERS = [
  {
    name: 'Waterdrop G3P800 Reverse Osmosis',
    badge: 'BEST FOR PHOENIX',
    price: '~$369',
    why: "Removes chromium-6, PFAS, arsenic, hardness, and sodium. The only filter type that handles Phoenix's full contaminant profile. NSF 42/53/58 certified.",
    link: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`,
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
    a: "Given Phoenix's chromium-6, PFAS, arsenic, and extreme hardness, a reverse osmosis system is essential. The Waterdrop G3P800 handles Phoenix's full contaminant profile. Pair with a water softener for whole-home hard water protection.",
  },
];

export default function PhoenixWaterPage() {
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
          <span>Phoenix, AZ</span>
        </nav>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>CITY WATER REPORT · 2025</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 8px' }}>Phoenix, AZ Water Quality Report</h1>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 8px' }}>Phoenix Water Services · Colorado River / Salt River Project · 2024–2025 data</p>
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 28px' }}>Source: Phoenix Water CCR 2024 · EPA SDWIS · EPA UCMR5 · EWG Tap Water Database</p>
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
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>62</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>/ 88</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>C</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444', marginBottom: 6 }}>Concerning</div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Phoenix water has chromium-6 above California health goals, significant PFAS from Luke Air Force Base contamination, high arsenic, and extremely hard water from the Colorado River. A reverse osmosis filter is strongly recommended.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {[
              { label: 'Open Violations', value: '0', color: '#22d3ee' },
              { label: 'PFAS Detected', value: '5', color: '#f59e0b' },
              { label: 'Chromium-6', value: 'Elevated', color: '#ef4444' },
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
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>85001, 85002, 85003 and all Phoenix ZIP codes</div>
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
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>CONTAMINANTS IN PHOENIX WATER — 2024 DATA</div>
          {CONTAMINANTS.map((c, i) => (
            <div key={c.name} style={{ padding: '14px 0', borderBottom: i < CONTAMINANTS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{c.level}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${c.color}20`, color: c.color }}>{c.status}</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>BEST FILTERS FOR PHOENIX WATER</div>
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
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{f.price}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>{f.why}</div>
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
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>FREQUENTLY ASKED QUESTIONS</div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ padding: '14px 0', borderBottom: i < FAQS.length - 1 ? '1px solid #0f2336' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{faq.q}</div>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
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
        <p style={{ fontSize: 11, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Data sourced from Phoenix Water CCR 2024, EPA SDWIS, EPA UCMR5, and EWG Tap Water Database. Some filter links are affiliate links.
        </p>
      </div>
    </div>
  );
}
