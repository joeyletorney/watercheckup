import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SIMPLELAB_WELL_TESTS_URL } from '@/lib/simplelab-links';

const HERO_IMAGE = '/lookingdownwell.jpg';
const HERO_ALT = 'Looking down into a water well — private well water quality';

export const metadata: Metadata = {
  title: 'Well Water Filter Guide 2025 — What\'s in Your Well & What Removes It | WaterCheckup',
  description: 'Private well water is unregulated. Find out the top contaminants in your state — arsenic, bacteria, nitrates, iron, radon — and the best certified filters to remove them. Free, no login.',
  alternates: { canonical: 'https://watercheckup.com/well' },
  openGraph: {
    title: 'Well Water Filter Guide 2025 | WaterCheckup',
    description: 'Private well water is unregulated by the EPA. Check the top risks for your state and find the right certified filter.',
    images: [{ url: 'https://watercheckup.com/api/og?city=Well+Water&score=&grade=&violations=', width: 1200, height: 630 }],
  },
};

const s = {
  h2: { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' } as React.CSSProperties,
  /** Body / secondary copy — brighter than slate-400 for readability on dark panels */
  p: { fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 16px' } as React.CSSProperties,
  label: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#38bdf8', marginBottom: 10, display: 'block' } as React.CSSProperties,
};

const CONTAMINANTS = [
  {
    name: 'Bacteria & Coliform',
    icon: '🦠',
    color: '#ef4444',
    risk: 'High nationwide',
    desc: 'The #1 well water risk. E. coli and coliform bacteria enter through cracked casings, flooding, and nearby septic systems. Causes severe illness — no taste or smell warning.',
    removes: 'UV sterilizer eliminates 99.99% without chemicals or taste change.',
    states: 'All states — highest risk in FL, Southeast, and agricultural Midwest.',
  },
  {
    name: 'Arsenic',
    icon: '⚗️',
    color: '#ef4444',
    risk: 'High in 24 states',
    desc: 'Naturally occurring in bedrock and volcanic geology. Linked to bladder, lung, and skin cancer with long-term exposure. Colorless, odorless, tasteless.',
    removes: 'Reverse osmosis removes >99%. No other affordable residential technology matches it.',
    states: 'Highest risk: AZ, NM, CA, NV, MT, WY, ME, NH, MN, ND, SD.',
  },
  {
    name: 'Nitrates',
    icon: '🌾',
    color: '#ef4444',
    risk: 'High in agricultural states',
    desc: 'From fertilizer runoff and septic leach. Dangerous for infants — causes "blue baby syndrome" by blocking oxygen in the blood. Boiling water concentrates nitrates, making it worse.',
    removes: 'Reverse osmosis removes >97%. Boiling does NOT remove nitrates.',
    states: 'Highest risk: IA, IL, IN, KS, NE, MN, OH, TX, CA Central Valley.',
  },
  {
    name: 'Iron & Manganese',
    icon: '🔩',
    color: '#f59e0b',
    risk: 'Moderate nationwide',
    desc: 'Causes orange/brown staining on fixtures, laundry, and appliances. Metallic taste. Manganese linked to neurological effects at high levels.',
    removes: 'Iron/oxidizing whole-house filter. RO removes at point-of-use.',
    states: 'Highest risk: FL, TX, MN, WI, MI, and New England.',
  },
  {
    name: 'Radon',
    icon: '☢️',
    color: '#ef4444',
    risk: 'High in granite states',
    desc: 'Dissolved from granite into groundwater, then released as gas during showering and water use. Second leading cause of lung cancer in the US.',
    removes: 'Whole-house aeration system or point-of-entry activated carbon.',
    states: 'Highest risk: ME, NH, VT, MA, CT, NY, PA, VA, WV, NC, MT.',
  },
  {
    name: 'Hard Water',
    icon: '🪨',
    color: '#22d3ee',
    risk: 'Moderate nationwide',
    desc: 'Calcium and magnesium cause scale buildup in pipes, water heaters, and appliances. Reduces soap effectiveness. Shortens appliance lifespan significantly.',
    removes: 'Salt-based water softener or salt-free conditioner.',
    states: 'Highest hardness: Midwest, Southwest, and Florida limestone regions.',
  },
  {
    name: 'Low pH / Acidic Water',
    icon: '🧪',
    color: '#f59e0b',
    risk: 'High in granite states',
    desc: 'Acidic water (pH below 7) corrodes copper pipes and fixtures — leaching copper and lead directly into your drinking water. Blue-green staining on sinks is the telltale sign.',
    removes: 'Whole-house calcite acid neutralizer raises pH naturally without chemicals.',
    states: 'Highest risk: New England, Appalachian states, Southeast.',
  },
  {
    name: 'PFAS Forever Chemicals',
    icon: '🏭',
    color: '#ef4444',
    risk: 'Growing risk nationwide',
    desc: 'Industrial and military contamination has reached groundwater in every state. Private wells near military bases, airports, and industrial sites are highest risk. EPA now regulates PFAS at 4 ppt.',
    removes: 'Reverse osmosis removes >99% of PFAS including PFOA, PFOS, and GenX.',
    states: 'Highest documented contamination: NY, MI, CA, CO, TX, NC, and near all military bases.',
  },
];

/** `directLink` only when we have a partner URL (Waterdrop). Other picks: Amazon only until affiliates are set up. */
const PRODUCTS = [
  {
    rank: 1,
    name: 'Waterdrop G3P800 RO System',
    brand: 'Waterdrop',
    price: '~$849',
    badge: 'BEST FOR ARSENIC, NITRATES & PFAS',
    badgeColor: '#0891b2',
    removes: ['Arsenic >99%', 'Nitrates >97%', 'PFAS >99%', 'Lead >99%', 'Heavy metals', 'TDS'],
    why: 'Reverse osmosis is the only affordable residential technology that handles arsenic, nitrates, and PFAS simultaneously. The G3P800 is the highest-rated under-sink RO on the market — 800 GPD, tankless, 10-stage filtration.',
    cert: 'NSF/ANSI 42, 53, 58, 372',
    directLink: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb',
    amazon: 'https://www.amazon.com/dp/B0987FCQQW?tag=watercheck20-20',
  },
  {
    rank: 2,
    name: 'HQUA-OWS-12 UV Sterilizer',
    brand: 'HQUA',
    price: '~$149',
    badge: 'BEST FOR BACTERIA & VIRUSES',
    badgeColor: '#7c3aed',
    removes: ['Bacteria 99.99%', 'E. coli', 'Giardia', 'Cryptosporidium', 'Viruses'],
    why: 'UV sterilization is the gold standard for private well bacteria — no chemicals, no taste change. Kills everything biological that filters miss. Whole-house 12 GPM flow rate.',
    cert: 'NSF/ANSI 55 Class B',
    amazon: 'https://www.amazon.com/dp/B01N2YMU3O?tag=watercheck20-20',
  },
  {
    rank: 3,
    name: 'iSpring WCFM500K Iron & Sulfur Filter',
    brand: 'iSpring',
    price: '~$2,299',
    badge: 'BEST FOR IRON, MANGANESE & SULFUR',
    badgeColor: '#d97706',
    removes: ['Iron up to 12 ppm', 'Manganese', 'Hydrogen sulfide', 'Rotten-egg odor'],
    why: 'If your well water stains fixtures orange or smells like rotten eggs, this is the system. Whole-house oxidizing media filter handles iron and manganese levels that would destroy standard RO membranes.',
    cert: 'WQA tested',
    amazon: 'https://www.amazon.com/dp/B08TMZYYQY?tag=watercheck20-20',
  },
  {
    rank: 4,
    name: 'AFWFilters Calcite Acid Neutralizer',
    brand: 'AFWFilters',
    price: '~$459',
    badge: 'BEST FOR LOW pH / ACIDIC WATER',
    badgeColor: '#059669',
    removes: ['Low pH', 'Corrosive water', 'Copper leaching', 'Lead leaching from pipes'],
    why: 'If your water is acidic (pH below 7) it is actively corroding your copper pipes and leaching lead and copper into your drinking water. Calcite media raises pH naturally — no chemicals, no electricity.',
    cert: 'NSF/ANSI 61',
    amazon: 'https://www.amazon.com/s?k=AFWFilters+calcite+acid+neutralizer+whole+house&tag=watercheck20-20',
  },
  {
    rank: 5,
    name: 'Fleck 5600SXT 48,000 Grain Water Softener',
    brand: 'Fleck',
    price: '~$649',
    badge: 'BEST FOR HARD WATER',
    badgeColor: '#d97706',
    removes: ['Hardness >99%', 'Scale', 'Calcium', 'Magnesium'],
    why: 'Salt-based ion exchange is the standard when you need full hardness removal for every tap, shower, and appliance. The Fleck 5600SXT is a widely trusted metered valve platform — size grain capacity to your household and lab hardness.',
    cert: 'NSF/ANSI 44 (typical for softener systems)',
    amazon: 'https://www.amazon.com/s?k=Fleck+5600SXT+48000+grain+water+softener&tag=watercheck20-20',
  },
] as const;

const TESTING_STEPS = [
  { num: 1, title: 'Start with a certified lab panel', desc: 'A basic dip-strip test won\'t catch arsenic, nitrates, or bacteria accurately. SimpleLab (Tap Score) offers mail-in panels built for well water, or use the EPA\'s directory to find a state-certified lab and order tests that match your state and geology.' },
  { num: 2, title: 'Test annually for bacteria — more after flooding', desc: 'Bacteria is the #1 well risk and can appear suddenly after heavy rain, flooding, or nearby construction. EPA recommends testing annually minimum. Test immediately after any flooding event.' },
  { num: 3, title: 'Match your filter to your test results', desc: 'Don\'t buy a filter before you know what\'s in your water. A UV sterilizer does nothing for arsenic. An RO system does nothing for iron. The test tells you exactly what you\'re dealing with.' },
  { num: 4, title: 'Retest after installing a filter', desc: 'Confirm your filter is actually working. Retest 30 days after installation to verify contaminant levels have dropped to safe levels.' },
];

export default function WellWaterPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .well-hero {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .well-hero {
            height: 350px;
          }
        }
        .well-intro-section {
          overflow: hidden;
        }
        .well-intro-accent {
          display: block;
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 12px;
          margin: 0 0 16px;
          object-fit: cover;
        }
        @media (min-width: 768px) {
          .well-intro-accent {
            float: right;
            width: 400px;
            max-width: 400px;
            margin: 0 0 16px 24px;
          }
        }
      `}</style>

      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <section className="well-hero" aria-label="Well water quality guide">
        <Image
          src={HERO_IMAGE}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
          }}
          aria-hidden
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            maxWidth: 800,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 900,
              color: '#f1f5f9',
              lineHeight: 1.15,
              margin: '0 0 12px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            Well Water Quality Guide
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: '#e2e8f0',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 560,
              textShadow: '0 1px 8px rgba(0,0,0,0.35)',
            }}
          >
            43 million Americans rely on private wells — is yours safe?
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 100px' }}>

        <div className="well-intro-section" style={{ marginBottom: 48 }}>
          <Image
            src={HERO_IMAGE}
            alt={HERO_ALT}
            width={400}
            height={267}
            className="well-intro-accent"
            style={{ objectFit: 'cover' }}
          />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: 2, marginBottom: 12 }}>PRIVATE WELL WATER GUIDE</div>
          <h2 style={{ ...s.h2, fontSize: 28, marginBottom: 16 }}>What is well water?</h2>
          <p style={s.p}>
            Private wells serve over <strong style={{ color: '#e2e8f0' }}>43 million Americans</strong> and are completely unregulated by the EPA.
            Nobody tests your well but you. The contaminants vary dramatically by state and geology —
            arsenic in the Southwest, bacteria in the Southeast, nitrates in the agricultural Midwest, radon in New England.
            This guide covers what to test for, what the risks actually are, and the best certified filters for each contaminant.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#fca5a5', fontWeight: 700 }}>
              ⚠ Not regulated by the EPA
            </div>
            <div style={{ padding: '10px 16px', background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 8, fontSize: 13, color: '#67e8f9', fontWeight: 700 }}>
              43M+ Americans on wells
            </div>
            <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, fontSize: 13, color: '#fcd34d', fontWeight: 700 }}>
              Test annually — EPA recommendation
            </div>
          </div>
        </div>

        {/* Why well water is different */}
        <div style={{ marginBottom: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#0a1e35,#071525)', border: '1px solid #1a3a5c', borderRadius: 14 }}>
          <span style={s.label}>WHY WELL WATER IS DIFFERENT</span>
          <h2 style={s.h2}>The EPA doesn&apos;t regulate your well. You do.</h2>
          <p style={s.p}>
            Municipal tap water is tested constantly and reported publicly. Your private well is tested only when you test it.
            The EPA has no authority over private wells serving fewer than 25 people.
            That means no mandatory testing, no violations, no enforcement — just you and whatever is in your groundwater.
          </p>
          <p style={{ ...s.p, margin: 0 }}>
            Groundwater contamination is invisible. Arsenic is colorless and odorless. Bacteria has no taste.
            Nitrates look and smell like clean water. The only way to know what&apos;s in your well is to test it.
          </p>
        </div>

        {/* Test first */}
        <div style={{ marginBottom: 48 }}>
          <span style={s.label}>STEP 1 — TEST BEFORE YOU BUY ANY FILTER</span>
          <h2 style={s.h2}>Get a certified lab test first</h2>
          <p style={s.p}>
            Buying a filter without knowing what&apos;s in your water is guesswork. A UV sterilizer does nothing for arsenic.
            An RO system won&apos;t fix iron staining. A water softener doesn&apos;t remove bacteria.
            A certified lab test costs $99–$200 and tells you exactly what you&apos;re dealing with.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {TESTING_STEPS.map(step => (
              <div key={step.num} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={SIMPLELAB_WELL_TESTS_URL} target="_blank" rel="noopener noreferrer sponsored"
              style={{ padding: '12px 20px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              SimpleLab Well Water Test — from $99 →
            </a>
            <a href="https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water" target="_blank" rel="noopener noreferrer"
              style={{ padding: '12px 20px', background: '#0d2240', border: '1px solid #2d4a6c', borderRadius: 8, color: '#e2e8f0', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              EPA certified lab finder →
            </a>
          </div>
        </div>

        {/* Contaminants */}
        <div style={{ marginBottom: 48 }}>
          <span style={s.label}>THE 8 MOST COMMON WELL WATER CONTAMINANTS</span>
          <h2 style={s.h2}>What&apos;s actually in well water — by contaminant</h2>
          <p style={s.p}>Each contaminant requires a specific treatment approach. Here&apos;s what to know about each one.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTAMINANTS.map(c => (
              <div key={c.name} style={{ padding: '18px 20px', background: '#0d2240', border: `1px solid ${c.color}33`, borderLeft: `3px solid ${c.color}`, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{c.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${c.color}28`, color: c.color, border: `1px solid ${c.color}55` }}>{c.risk}</span>
                </div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 8px' }}>{c.desc}</p>
                <div style={{ fontSize: 12, color: '#67e8f9', fontWeight: 600, marginBottom: 6 }}>✓ {c.removes}</div>
                <div style={{ fontSize: 11, color: '#b8cad9' }}>Highest risk: {c.states}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div style={{ marginBottom: 48 }}>
          <span style={s.label}>TOP 5 WELL WATER FILTERS — EXPERT PICKS</span>
          <h2 style={s.h2}>The best certified filters for well water</h2>
          <p style={s.p}>Matched to the most common well water contaminants. All NSF certified. Waterdrop includes buy direct plus Amazon; other picks link to Amazon until we add more partner links.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PRODUCTS.map(p => (
              <div key={p.rank} style={{ padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#b8c9d9' }}>#{p.rank}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{p.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: p.badgeColor, color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{p.badge}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#b8cad9', marginBottom: 8 }}>{p.brand} · {p.price} · {p.cert}</div>
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, margin: '0 0 10px' }}>{p.why}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.removes.map(r => (
                        <span key={r} style={{ fontSize: 11, padding: '2px 8px', background: '#071828', border: '1px solid #2a4a6e', borderRadius: 4, color: '#cbd5e1' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    {'directLink' in p && p.directLink ? (
                      <a href={p.directLink} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'block', padding: '9px 16px', background: '#0d2240', color: '#e2e8f0', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', border: '1px solid #2d4a6c', whiteSpace: 'nowrap' }}>
                        Buy direct →
                      </a>
                    ) : null}
                    <a href={p.amazon} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '9px 16px', background: '#0d2240', color: '#e2e8f0', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', border: '1px solid #2d4a6c', whiteSpace: 'nowrap' }}>
                      Amazon →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State risk CTA */}
        <div style={{ marginBottom: 48, padding: '28px 28px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: 2, marginBottom: 10 }}>PERSONALIZED WELL WATER REPORT</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>See the specific risks for your state</h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 20px' }}>
            Enter your ZIP code to see the well water risk profile for your state — based on USGS and EPA groundwater data —
            plus personalized filter recommendations matched to what&apos;s most likely in your well.
          </p>
          <Link href="/?well=1" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Well Water Free →
          </Link>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 48 }}>
          <span style={s.label}>FREQUENTLY ASKED QUESTIONS</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'How often should I test my well water?', a: 'EPA recommends testing annually at minimum for bacteria, nitrates, and pH. Test immediately after flooding, nearby construction, or if you notice changes in taste, smell, or appearance. Test for contaminants specific to your region (arsenic, radon, etc.) every 2-3 years.' },
              { q: 'What is the best filter for well water?', a: 'There is no single best filter — it depends on what is in your water. Bacteria requires a UV sterilizer. Arsenic, nitrates, and PFAS require reverse osmosis. Iron and manganese require an oxidizing whole-house filter. Acidic water requires a calcite acid neutralizer. Get a lab test first, then match the filter to the result.' },
              { q: 'Can I drink well water without filtering?', a: 'Possibly — but you cannot know without testing. Many wells are perfectly safe. Many others have elevated arsenic, bacteria, or nitrates that are invisible and tasteless. The EPA recommends all private well owners test annually. If you have not tested recently, do not assume your water is safe.' },
              { q: 'Does boiling well water make it safe?', a: 'Boiling kills bacteria and viruses effectively. However, it does not remove arsenic, nitrates, heavy metals, PFAS, or minerals. Boiling actually concentrates nitrates, making them more dangerous. For most well water contaminants, a certified filter is far more effective than boiling.' },
              { q: 'How much does well water treatment cost?', a: 'A UV sterilizer for bacteria runs $149-$400. A quality under-sink RO for arsenic, nitrates, and PFAS runs $300-$500. A whole-house iron filter runs $500-$2,500. A water softener runs $500-$1,500. Most well owners with serious contamination need a combination — typically a whole-house pre-filter plus a point-of-use RO at the kitchen sink.' },
              { q: 'Is my well water regulated by the EPA?', a: 'No. The EPA regulates public water systems serving 25 or more people. Private wells are entirely the responsibility of the homeowner. There are no mandatory testing requirements, no violations, and no enforcement for private wells at the federal level. Some states have additional requirements but most do not.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div>
          <span style={s.label}>RELATED GUIDES</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/pfas', label: 'PFAS in Drinking Water — EPA Limits & Filters' },
              { href: '/lead', label: 'Lead in Tap Water — LCR Data, Service Lines & Filters' },
              { href: '/blog/is-pfas-in-my-tap-water', label: 'Is PFAS in My Tap Water?' },
              { href: '/blog/best-water-filter-for-lead-removal', label: 'Best Water Filters for Lead Removal' },
              { href: '/contaminants', label: 'Water Contaminant Guide — Every Major Contaminant Explained' },
              { href: '/quiz', label: 'Take the Filter Quiz — Get Matched to the Right System' },
              { href: '/', label: 'Check Your ZIP Code — Full EPA Water Report' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0d2240', border: '1px solid #2d4a6c', borderRadius: 8, textDecoration: 'none', color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
                {label} <span style={{ color: '#38bdf8' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
