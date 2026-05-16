import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const AMAZON_TAG = 'watercheck20-20';

export const metadata: Metadata = {
  title: 'Best Water Filter for Hard Water 2025 — Tested & Ranked | WaterCheckup',
  description:
    'The best water filters for hard water in 2025. Softeners, RO systems, and pitchers that actually remove calcium, magnesium, and scale. NSF-certified picks for every budget.',
  alternates: { canonical: 'https://watercheckup.com/blog/best-water-filter-hard-water' },
  openGraph: {
    title: 'Best Water Filter for Hard Water 2025 — Tested & Ranked',
    description:
      'Hard water causing scale, dry skin, and spotted dishes? These NSF-certified filters and softeners actually fix it.',
  },
};

const HARDNESS_ROWS = [
  { level: 'Soft', gpg: '0–1 gpg', mgL: '0–17 mg/L', cities: 'Seattle, Portland, Boston' },
  { level: 'Moderately Hard', gpg: '1–7 gpg', mgL: '17–120 mg/L', cities: 'Chicago, New York' },
  { level: 'Hard', gpg: '7–10 gpg', mgL: '120–180 mg/L', cities: 'Houston, Dallas' },
  { level: 'Very Hard', gpg: '10+ gpg', mgL: '180+ mg/L', cities: 'San Antonio, Phoenix, Las Vegas' },
] as const;

const SIGNS = [
  'White scale buildup on faucets, showerheads, and kettles',
  'Spots and film on glasses and dishes after dishwasher',
  "Soap and shampoo don't lather well — you use more",
  'Dry, itchy skin and flat hair after showering',
  'Water heater making popping/rumbling sounds (scale buildup)',
  'Washing machine leaving residue on clothes',
  'Frequent plumbing repairs from scale-clogged pipes',
] as const;

const PICKS = [
  {
    rank: '🥇',
    name: 'SpringWell Salt-Based Water Softener',
    badge: 'BEST OVERALL — WHOLE HOME',
    price: '~$799–$1,299',
    nsf: 'WQA Gold Seal certified',
    hardness: 'Up to 25 gpg',
    best: true,
    dp: 'B08CXWMJGT',
    pros: [
      'Removes virtually 100% of hardness minerals',
      'Whole-home protection — every faucet, shower, appliance',
      'Protects water heater and pipes from scale',
      'Salt-based ion exchange — proven technology',
    ],
    cons: ['Requires salt refills every 6–8 weeks', 'Adds small amount of sodium to water', 'Needs professional installation'],
    verdict:
      'For homes with very hard water (San Antonio, Phoenix, Las Vegas), a salt-based softener is the only solution that fully protects your entire plumbing system. Pair with an RO filter for drinking water.',
  },
  {
    rank: '🥈',
    name: 'Waterdrop G3P800 Reverse Osmosis',
    badge: 'BEST FOR DRINKING WATER',
    price: '~$849',
    nsf: 'NSF 42, 53, 58 certified',
    hardness: 'Up to 2,000 ppm TDS',
    best: false,
    dp: 'B0987FCQQW',
    pros: [
      'Removes hardness minerals from drinking water',
      'Also removes PFAS, arsenic, lead, radium',
      'Tankless — no bulky storage tank',
      'Smart TDS display shows water quality',
    ],
    cons: ['Under-sink only — not whole-home', 'Requires professional or DIY installation', 'Wastes some water (2:1 ratio)'],
    verdict:
      'If your main concern is drinking and cooking water, an RO system removes hardness along with PFAS, arsenic, and other contaminants. Best paired with a whole-home softener for complete protection.',
  },
  {
    rank: '🥉',
    name: 'AquaBliss High Output Shower Filter',
    badge: 'BEST FOR SKIN & HAIR',
    price: '~$35',
    nsf: 'KDF/GAC media',
    hardness: 'Moderate reduction',
    best: false,
    dp: 'B01MUBU0YC',
    pros: [
      'Reduces chlorine and some minerals in shower',
      'Easy install — no plumber needed',
      'Affordable entry point',
      '42,000+ Amazon reviews',
    ],
    cons: [
      'Does not fully remove hardness',
      'Not NSF certified for hardness removal',
      'Needs replacement every 6 months',
    ],
    verdict:
      "A shower filter won't solve hard water scale problems but does reduce chlorine and some mineral content — improving skin and hair feel at a low cost. Good for renters who can't install a softener.",
  },
  {
    rank: '4️⃣',
    name: 'Clearly Filtered Pitcher',
    badge: 'BEST NO-INSTALL PITCHER',
    price: '~$90',
    nsf: 'NSF 42, 53, 244, 401, P473',
    hardness: 'Moderate reduction',
    best: false,
    dp: 'B076B6FXT5',
    pros: [
      'No installation needed',
      'Removes 365+ contaminants including PFAS',
      'NSF certified — most certified pitcher available',
      'Good for renters',
    ],
    cons: ['Does not fully remove hardness minerals', 'Slow filtration', 'Pitcher only — not whole home'],
    verdict:
      "The best pitcher for overall contaminant removal, but not a true hard water solution. Use if you're primarily concerned about taste, PFAS, and lead — and hardness is a secondary concern.",
  },
] as const;

const FAQS = [
  {
    q: 'Does a Brita filter remove hard water?',
    a: 'No. Standard Brita pitchers use activated carbon which improves taste and reduces chlorine but does not remove calcium or magnesium (hardness minerals). You need a reverse osmosis system or water softener for hard water.',
  },
  {
    q: 'Is hard water harmful to health?',
    a: 'Hard water is not a health hazard. In fact, the calcium and magnesium in hard water are essential minerals. The problems are practical: scale damage to appliances, pipes, and skin/hair. Some studies suggest hard water may slightly reduce cardiovascular risk.',
  },
  {
    q: 'How do I test for hard water at home?',
    a: 'The simplest test: add a few drops of liquid soap to a bottle of tap water, shake, and look for lather. Soft water produces abundant suds; hard water produces very little. For precise measurements, use a cheap TDS meter or water hardness test strips from Amazon.',
  },
  {
    q: 'How much does a water softener cost?',
    a: 'Salt-based softeners run $800–$2,500 for the unit plus $200–$500 for installation. Salt costs $10–$25/month. A flagship tankless RO (e.g. Waterdrop G3P800) is typically around $849 plus filter replacements ($50–$150/year); basic RO systems are often $300–$600. The ROI is significant — softeners extend appliance and water heater life by years.',
  },
  {
    q: 'What cities have the hardest water?',
    a: 'San Antonio (272 mg/L), Phoenix (288 mg/L), Las Vegas (290 mg/L), and Indianapolis are consistently ranked among the hardest. Check your specific ZIP at WaterCheckup.',
  },
] as const;

export default function BestFilterHardWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/blog" style={{ color: '#64748b', textDecoration: 'none' }}>
            Blog
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Best Filter for Hard Water</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER GUIDE · 2025</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Best Water Filter for Hard Water 2025
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.6 }}>
          Hard water affects 85% of US homes. Scale buildup destroys appliances, spots dishes, dries out skin, and wastes money on soap. Here are the only solutions that actually work — ranked by effectiveness and budget.
        </p>
        <p style={{ fontSize: 12, color: '#475569', margin: '0 0 32px' }}>
          Updated May 2025 · NSF certifications verified · Some links are affiliate links
        </p>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>What is hard water?</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            Hard water contains high levels of dissolved calcium and magnesium — minerals picked up as water flows through limestone and chalk rock. It&apos;s measured in grains per gallon (gpg) or milligrams per liter (mg/L):
          </p>
          {HARDNESS_ROWS.map((row, i) => (
            <div
              key={row.level}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < HARDNESS_ROWS.length - 1 ? '1px solid #0f2336' : 'none',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', minWidth: 140 }}>{row.level}</span>
              <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 80 }}>{row.gpg}</span>
              <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 100 }}>{row.mgL}</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>{row.cities}</span>
            </div>
          ))}
          <p style={{ fontSize: 13, color: '#64748b', margin: '12px 0 0' }}>
            Don&apos;t know your hardness level?{' '}
            <Link href="/" style={{ color: '#0891b2' }}>
              Check your ZIP code →
            </Link>
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>Signs you have hard water</h2>
          {SIGNS.map((sign, i) => (
            <div
              key={sign}
              style={{
                display: 'flex',
                gap: 10,
                padding: '8px 0',
                borderBottom: i < SIGNS.length - 1 ? '1px solid #0f2336' : 'none',
              }}
            >
              <span style={{ color: '#f59e0b', flexShrink: 0 }} aria-hidden>
                ⚠️
              </span>
              <span style={{ fontSize: 14, color: '#94a3b8' }}>{sign}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px' }}>Best filters for hard water — 2025 picks</h2>

        {PICKS.map((pick, i) => (
          <div
            key={pick.dp}
            style={{
              padding: '20px 22px',
              background: pick.best ? 'rgba(8,145,178,0.08)' : '#0d2240',
              border: pick.best ? '2px solid rgba(8,145,178,0.4)' : '1px solid #1a3a5c',
              borderRadius: 12,
              marginBottom: i < PICKS.length - 1 ? 16 : 0,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ fontSize: 24 }} aria-hidden>
                {pick.rank}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{pick.name}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: pick.best ? '#0891b2' : '#1e3a5f',
                      color: '#fff',
                    }}
                  >
                    {pick.badge}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{pick.price}</span>
                  <span style={{ fontSize: 12, color: '#0891b2' }}>{pick.nsf}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Handles: {pick.hardness}</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee', marginBottom: 6 }}>PROS</div>
                {pick.pros.map(p => (
                  <div key={p} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                    ✓ {p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>CONS</div>
                {pick.cons.map(c => (
                  <div key={c} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                    ✗ {c}
                  </div>
                ))}
              </div>
            </div>
            <p
              style={{
                fontSize: 13,
                color: '#94a3b8',
                lineHeight: 1.6,
                margin: '0 0 12px',
                padding: '10px 12px',
                background: '#071828',
                borderRadius: 8,
              }}
            >
              <strong style={{ color: '#e2e8f0' }}>Our verdict: </strong>
              {pick.verdict}
            </p>
            <a
              href={`https://www.amazon.com/dp/${pick.dp}?tag=${AMAZON_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{
                display: 'inline-block',
                padding: '9px 18px',
                background: pick.best ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                border: pick.best ? 'none' : '1px solid #1a3a5c',
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
        ))}

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>Salt-free softeners — do they work?</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            Salt-free &quot;softeners&quot; (also called water conditioners) use template-assisted crystallization (TAC) to change the structure of hardness minerals so they don&apos;t stick to surfaces. They don&apos;t actually remove calcium and magnesium — they just change how the minerals behave.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#e2e8f0' }}>Bottom line:</strong> Salt-free conditioners reduce scale buildup and are maintenance-free (no salt, no backwash). But they don&apos;t improve the feel of water for skin/hair and won&apos;t register as &quot;soft&quot; on a hardness test. For very hard water above 15 gpg, salt-based softeners are significantly more effective.
          </p>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px' }}>FAQ</h2>
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
            Check Your Water Hardness →
          </Link>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 12 }}>Free · Any US ZIP code · Instant results</p>
        </div>

        <p style={{ fontSize: 11, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Some links on this page are affiliate links — we may earn a commission at no cost to you. Our recommendations are based on NSF certifications and water quality data, not paid placements.
        </p>
      </div>
    </div>
  );
}
