import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { BLOG_AUTHOR_BYLINE } from '@/lib/site-stats';

const AMAZON_TAG = 'watercheck20-20';

export const metadata: Metadata = {
  title: 'Reverse Osmosis vs Distilled Water — Which is Better? (2026) | WaterCheckup',
  description:
    'RO and distilled water are both highly purified but work completely differently. A 30-year water treatment expert explains which one is right for your home.',
  alternates: { canonical: 'https://watercheckup.com/blog/reverse-osmosis-vs-distilled-water' },
  openGraph: {
    title: 'Reverse Osmosis vs Distilled Water — Which is Better? (2026)',
    description:
      'RO and distilled water are both highly purified but work completely differently. A 30-year water treatment expert explains which one is right for your home.',
    type: 'article',
    publishedTime: '2026-05-18',
    authors: ['Joe Letorney'],
  },
};

const COMPARE_ROWS = [
  { label: 'How it works', ro: 'Pressure pushes water through a semi-permeable membrane', distilled: 'Boil → steam → condense; minerals stay in the chamber' },
  { label: 'Typical TDS', ro: '10–50 ppm (often lower with good feed water)', distilled: '0–5 ppm (very low dissolved solids)' },
  { label: 'Daily output', ro: '20–800+ GPD (under-sink systems)', distilled: '1–8 gallons/day (countertop units)' },
  { label: 'Energy use', ro: 'Low — uses water pressure + small pump', distilled: 'High — continuous electricity to boil water' },
  { label: 'Wastewater', ro: 'Yes — concentrate/brine line (normal)', distilled: 'Minimal — mostly evaporation residue' },
  { label: 'PFAS / lead / nitrate', ro: 'Strong reduction when NSF 58 certified', distilled: 'Strong for non-volatiles; check VOC handling' },
  { label: 'Taste', ro: 'Clean; often remineralized for flavor', distilled: 'Very “flat” until minerals added back' },
  { label: 'Best for', ro: 'Family drinking & cooking at the kitchen sink', distilled: 'Ultra-low-TDS needs, CPAP, appliances, batch use' },
  { label: 'Home install', ro: 'Under-sink or countertop RO — common', distilled: 'Countertop distiller — rare whole-home' },
  { label: 'Maintenance', ro: 'Prefilters + membrane on a schedule', distilled: 'Descale/clean boiling chamber regularly' },
] as const;

const RO_PICKS = [
  {
    rank: '🥇',
    name: 'Waterdrop G3P800 Tankless RO',
    badge: 'BEST FOR MOST HOMES',
    price: '~$849',
    cert: 'NSF 42, 53, 58',
    dp: 'B0987FCQQW',
    best: true,
    why: 'High flow, smart TDS faucet, strong PFAS/lead reduction. The practical choice when you want distilled-level purity for daily drinking without batch waiting.',
  },
  {
    rank: '🥈',
    name: 'Aquasana SmartFlow RO',
    badge: 'MOST CERTIFIED',
    price: '~$449',
    cert: 'WQA Gold Seal + NSF 42/53/58/401',
    dp: 'B0CHZ8VQBB',
    best: false,
    why: 'Broad NSF coverage including emerging contaminants (401). Excellent when you want documentation-heavy claims, not just marketing language.',
  },
  {
    rank: '🥉',
    name: 'AquaTru Under-Sink RO',
    badge: 'EASIEST MAINTENANCE',
    price: '~$375',
    cert: 'NSF 42, 53, 58',
    dp: 'B0GGTSFZMY',
    best: false,
    why: 'Quick-change filters, compact footprint. Good for renters willing to do a simple under-sink install or place on the counter.',
  },
] as const;

const FAQS = [
  {
    q: 'Is reverse osmosis water the same as distilled water?',
    a: 'No. Both can be very pure, but RO uses membrane filtration while distillation uses evaporation. RO water often retains slightly higher TDS; distilled water is typically closer to zero dissolved solids. Either can be excellent — they are not interchangeable processes.',
  },
  {
    q: 'Which is safer to drink — RO or distilled?',
    a: 'Both are safe when equipment is maintained and feed water is microbiologically sound. Neither replaces a boil-water advisory. For health-related contaminants like lead, PFAS, and nitrate, a certified NSF 58 RO system is the standard home solution. Distillers also perform well for dissolved salts and metals but are slower and use more energy.',
  },
  {
    q: 'Does distilled water leach minerals from your body?',
    a: 'The “leaching minerals” claim is overstated for normal consumption. You get the vast majority of minerals from food. Ultra-pure water can taste flat; that is why many people remineralize RO or distilled water for palatability — not because the water is inherently unsafe.',
  },
  {
    q: 'Can I use RO water in my coffee maker or humidifier?',
    a: 'Yes. RO water is widely used in coffee equipment and reduces scale compared to hard tap water. Distilled water is also fine for humidifiers and CPAP machines that specify low-mineral water. Follow appliance manuals — some espresso machines want a small mineral content for flavor extraction.',
  },
  {
    q: 'Is bottled “purified” water RO or distilled?',
    a: 'Often RO, distillation, or a blend — plus carbon polishing. Check the label. “Purified” is a marketing term; the technology varies by brand. Home RO typically matches or exceeds many bottled purified products for the contaminants that matter to your ZIP code.',
  },
  {
    q: 'Which removes PFAS better?',
    a: 'Certified reverse osmosis (NSF 58 with PFAS claims, or NSF 401 on multi-stage units) is the mainstream answer for tap water at home. Distillers generally remove non-volatile PFAS well, but throughput is low. For a family drinking water daily, RO is almost always the better fit.',
  },
] as const;

export default function ReverseOsmosisVsDistilledWaterPage() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Reverse Osmosis vs Distilled Water — Which is Better? (2026)',
    description: metadata.description,
    datePublished: '2026-05-18',
    author: {
      '@type': 'Person',
      name: BLOG_AUTHOR_BYLINE.name,
      url: 'https://watercheckup.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      url: 'https://watercheckup.com',
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
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
          <span>RO vs Distilled Water</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          PURITY GUIDE · 2026
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Reverse Osmosis vs Distilled Water — Which is Better? (2026)
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.6 }}>
          RO and distilled water are both highly purified but work completely differently. Here is how each technology
          actually performs — and which one makes sense for drinking, cooking, and everyday home use.
        </p>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 32px' }}>
          By {BLOG_AUTHOR_BYLINE.name} · {BLOG_AUTHOR_BYLINE.credentials} · 10 min read · May 18, 2026
        </p>

        <div
          style={{
            padding: '18px 22px',
            background: 'rgba(8,145,178,0.08)',
            border: '1px solid rgba(8,145,178,0.35)',
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: '#22d3ee', letterSpacing: 1, marginBottom: 8 }}>
            QUICK VERDICT
          </div>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: '#f1f5f9' }}>For most households, reverse osmosis wins.</strong> It delivers
            near-distilled purity at the kitchen sink with enough flow for drinking and cooking.{' '}
            <strong style={{ color: '#f1f5f9' }}>Choose distillation</strong> when you specifically need ultra-low-TDS
            water in smaller batches (CPAP, certain appliances, lab-style purity) and accept higher energy use and slower
            output.
          </p>
        </div>

        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 20px' }}>
          After 30 years in water treatment, I hear this question constantly: &quot;Isn&apos;t RO water basically
          distilled?&quot; The short answer is no — they can look similar on a TDS meter, but the physics are
          completely different. That difference drives cost, maintenance, what each system removes, and which one
          belongs under your sink.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '36px 0 14px' }}>
          RO vs distilled at a glance
        </h2>
        <div style={{ overflowX: 'auto', marginBottom: 28 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a3a5c' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#64748b', fontWeight: 700 }} />
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#22d3ee', fontWeight: 800 }}>Reverse osmosis</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#e2e8f0', fontWeight: 800 }}>Distilled</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(row => (
                <tr key={row.label} style={{ borderBottom: '1px solid #0f2336' }}>
                  <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: 600, verticalAlign: 'top', minWidth: 110 }}>
                    {row.label}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8', lineHeight: 1.55, verticalAlign: 'top' }}>{row.ro}</td>
                  <td style={{ padding: '12px', color: '#94a3b8', lineHeight: 1.55, verticalAlign: 'top' }}>{row.distilled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px' }}>How reverse osmosis works</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px' }}>
          RO forces tap water through a semi-permeable membrane under pressure. Dissolved contaminants — including many
          ions, PFAS, lead, nitrate, and arsenic species on certified systems — are rejected and flushed to drain as
          concentrate. Prefilters (sediment and carbon) protect the membrane and reduce chlorine that would damage it.
        </p>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px' }}>
          <strong style={{ color: '#e2e8f0' }}>What RO is great at:</strong> Daily drinking and cooking water with
          strong contaminant reduction, reasonable flow, and established NSF/ANSI 58 certification paths you can verify
          before you buy.
        </p>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 20px' }}>
          <strong style={{ color: '#e2e8f0' }}>What to know:</strong> RO produces wastewater — that is normal. Membranes
          and prefilters need scheduled replacement. Aggressive RO water is usually dispensed from a dedicated faucet,
          not run through every pipe in the house without proper design.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px' }}>How distillation works</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px' }}>
          A distiller boils water into steam, then condenses that steam back into liquid. Most minerals, metals, and
          non-volatile contaminants stay in the boiling chamber. You are not filtering — you are{' '}
          <strong style={{ color: '#e2e8f0' }}>changing phase</strong>, which is why distillers routinely hit extremely
          low TDS.
        </p>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px' }}>
          <strong style={{ color: '#e2e8f0' }}>What distillation is great at:</strong> Ultra-low dissolved solids in
          modest daily volumes; simple chemistry; no membrane fouling from hardness or iron.
        </p>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 20px' }}>
          <strong style={{ color: '#e2e8f0' }}>What to know:</strong> Electricity and time. Some volatile organic
          compounds (VOCs) can carry over with steam on basic units — quality distillers address this with vents or
          carbon post-treatment. Output is measured in gallons per day, not per minute.
        </p>

        <div
          style={{
            padding: '18px 22px',
            background: '#ef444410',
            border: '1px solid #ef444430',
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <strong style={{ color: '#f87171' }}>Important: </strong>
          <span style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            Neither RO nor distillation replaces a{' '}
            <Link href="/blog/boil-water-advisory-what-to-do-and-how-long" style={{ color: '#22d3ee' }}>
              boil-water advisory
            </Link>
            . If bacteria or viruses are the concern, follow public health guidance first.
          </span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px' }}>Which is better for your home?</h2>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#22d3ee', margin: '0 0 10px' }}>Choose reverse osmosis if…</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>
            <li>You want high-purity drinking and cooking water every day</li>
            <li>Your tap water has PFAS, lead, nitrate, arsenic, or high TDS you want reduced</li>
            <li>You need reasonable flow (tankless RO systems fill a glass in seconds)</li>
            <li>You want NSF-certified performance claims you can look up</li>
          </ul>
        </div>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0', margin: '0 0 10px' }}>Choose distillation if…</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>
            <li>You need the lowest practical TDS for CPAP, humidifiers, or specialty equipment</li>
            <li>You are OK with batch production (gallons per day, not on-demand flow)</li>
            <li>You prefer evaporation-based separation over membranes</li>
            <li>You have time for regular chamber cleaning and descaling</li>
          </ul>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px' }}>Minerals, taste, and “dead water”</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px' }}>
          Ultra-pure water tastes flat because it has little mineral content. That is a flavor issue, not proof that RO
          or distilled water is dangerous. Many RO systems include a remineralization stage; others add a pinch of
          mineral blend or mix with a small amount of tap water for taste.
        </p>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 20px' }}>
          Your diet supplies the minerals that matter for health. Water quality decisions should be driven by{' '}
          <strong style={{ color: '#e2e8f0' }}>contaminants in your actual supply</strong> — check your ZIP on{' '}
          <Link href="/" style={{ color: '#0891b2' }}>
            WaterCheckup
          </Link>{' '}
          and your utility&apos;s{' '}
          <Link href="/blog/how-to-read-your-consumer-confidence-report" style={{ color: '#0891b2' }}>
            Consumer Confidence Report
          </Link>{' '}
          before choosing equipment.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px' }}>Best RO systems for home purity (2026)</h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px' }}>
          If RO is the right fit, buy certified equipment — not generic “5-stage” kits with no test data. These are
          systems I recommend frequently for PFAS, lead, and general dissolved contaminant reduction:
        </p>

        {RO_PICKS.map((pick, i) => (
          <div
            key={pick.dp}
            style={{
              padding: '20px 22px',
              background: pick.best ? 'rgba(8,145,178,0.08)' : '#0d2240',
              border: pick.best ? '2px solid rgba(8,145,178,0.4)' : '1px solid #1a3a5c',
              borderRadius: 12,
              marginBottom: i < RO_PICKS.length - 1 ? 16 : 24,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10 }}>
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
                  <span style={{ fontSize: 12, color: '#0891b2' }}>{pick.cert}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 12px' }}>{pick.why}</p>
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

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px' }}>Related reading</h2>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 24px' }}>
          <Link href="/blog/reverse-osmosis-pros-and-cons" style={{ color: '#22d3ee' }}>
            Reverse osmosis pros and cons
          </Link>
          {' · '}
          <Link href="/blog/why-distilled-water-and-reverse-osmosis-are-best-for-high-purity" style={{ color: '#22d3ee' }}>
            Why RO and distillation top the purity stack
          </Link>
          {' · '}
          <Link href="/blog/best-ro-system-for-pfas-removal" style={{ color: '#22d3ee' }}>
            Best RO for PFAS removal
          </Link>
          {' · '}
          <Link href="/blog/what-is-ppm-ppb-ppt-water-quality" style={{ color: '#22d3ee' }}>
            PPM, PPB, and PPT explained
          </Link>
        </p>

        <div style={{ padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 24 }}>
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
            Check Your Tap Water Quality →
          </Link>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 12 }}>Free · Any US ZIP · See what your utility reports</p>
        </div>

        <p style={{ fontSize: 11, color: '#334155', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          Some links are affiliate links. Recommendations follow NSF certifications and field experience — not paid
          placement. This article is educational and not medical advice.
        </p>
      </div>
    </div>
  );
}
