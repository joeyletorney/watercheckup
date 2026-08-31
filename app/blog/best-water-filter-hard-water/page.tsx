import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogTopPicks } from '@/components/BlogTopPicks';
import { getTopPicksSubtitle, resolveBlogTopPicks } from '@/lib/blog-top-picks';
import { getCtrSerpOverride } from '@/lib/ctr-serp-seo';

const SLUG = 'best-water-filter-hard-water';
const topPicks = resolveBlogTopPicks(SLUG);
const topPicksSubtitle = getTopPicksSubtitle(SLUG, topPicks);
const ctr = getCtrSerpOverride(`/blog/${SLUG}`);

export const metadata: Metadata = {
  title: ctr?.title ?? 'Best Water Filter for Hard Water 2026 — Tested & Ranked | WaterCheckup',
  description:
    ctr?.description ??
    'The best water filters for hard water in 2026. Softeners, RO systems, and pitchers that actually remove calcium, magnesium, and scale. NSF-certified picks for every budget.',
  alternates: { canonical: 'https://watercheckup.com/blog/best-water-filter-hard-water' },
  openGraph: {
    title: ctr?.title ?? 'Best Water Filter for Hard Water 2026 — Tested & Ranked',
    description:
      ctr?.description ??
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
    a: 'Salt-based softeners run $800–$2,500 for the unit plus $200–$500 for installation. Salt costs $10–$25/month. A flagship tankless RO (e.g. Waterdrop G3P600) is typically around $439 plus filter replacements ($50–$150/year); basic RO systems are often $300–$600. The ROI is significant — softeners extend appliance and water heater life by years.',
  },
  {
    q: 'What cities have the hardest water?',
    a: 'San Antonio (272 mg/L), Phoenix (288 mg/L), Las Vegas (290 mg/L), and Indianapolis are consistently ranked among the hardest. See our San Antonio water quality report for SA-specific data.',
  },
] as const;

export default function BestFilterHardWaterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 16 }}>
          <Link prefetch href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link prefetch href="/blog" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Blog
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Best Filter for Hard Water</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER GUIDE · 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Best Water Filter for Hard Water 2026
        </h1>
        <p style={{ fontSize: 16, color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.6 }}>
          Hard water affects 85% of US homes. Scale buildup destroys appliances, spots dishes, dries out skin, and wastes money on soap. Here are the only solutions that actually work — ranked by effectiveness and budget.
        </p>
        <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.75 }}>
          Phoenix has some of the hardest water in the US at 288 mg/L — see our{' '}
          <Link prefetch href="/water/phoenix" style={{ color: '#22d3ee', fontWeight: 600, textDecoration: 'none' }}>
            Phoenix water quality report
          </Link>{' '}
          for the full scored breakdown and filter picks.
        </p>
        <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.75 }}>
          Los Angeles water is very hard at 268 mg/L with chromium-6 and PFAS concerns — see our{' '}
          <Link prefetch href="/water/los-angeles" style={{ color: '#22d3ee', fontWeight: 600, textDecoration: 'none' }}>
            Los Angeles water quality report
          </Link>{' '}
          for the full scored breakdown.
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px' }}>
          Updated May 2025 · NSF certifications verified · Some links are affiliate links
        </p>

        <BlogTopPicks picks={topPicks} subtitle={topPicksSubtitle} />

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>What is hard water?</h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
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
              <span style={{ fontSize: 13, color: '#cbd5e1', minWidth: 80 }}>{row.gpg}</span>
              <span style={{ fontSize: 13, color: '#cbd5e1', minWidth: 100 }}>{row.mgL}</span>
              <span style={{ fontSize: 13, color: '#a8b4c4' }}>{row.cities}</span>
            </div>
          ))}
          <p style={{ fontSize: 13, color: '#a8b4c4', margin: '12px 0 0' }}>
            Don&apos;t know your hardness level?{' '}
            <Link prefetch href="/" style={{ color: '#0891b2' }}>
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
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>{sign}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>Salt-free softeners — do they work?</h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
            Salt-free &quot;softeners&quot; (also called water conditioners) use template-assisted crystallization (TAC) to change the structure of hardness minerals so they don&apos;t stick to surfaces. They don&apos;t actually remove calcium and magnesium — they just change how the minerals behave.
          </p>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#e2e8f0' }}>Bottom line:</strong> Salt-free conditioners reduce scale buildup and are maintenance-free (no salt, no backwash). But they don&apos;t improve the feel of water for skin/hair and won&apos;t register as &quot;soft&quot; on a hardness test. For very hard water above 15 gpg, salt-based softeners are significantly more effective.
          </p>
        </div>

        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 20px' }}>
          Very hard water cities: see our{' '}
          <Link prefetch href="/water/san-antonio" style={{ color: '#22d3ee', fontWeight: 600, textDecoration: 'none' }}>
            San Antonio water quality &amp; contamination report
          </Link>{' '}
          (272 mg/L hardness, PFAS data).
        </p>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 22px' }}>FAQ</h2>
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
            Check Your Water Hardness →
          </Link>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 12 }}>Free · Any US ZIP code · Instant results</p>
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Some links on this page are affiliate links — we may earn a commission at no cost to you. Our recommendations are based on NSF certifications and water quality data, not paid placements.
        </p>
      </div>
    </div>
  );
}
