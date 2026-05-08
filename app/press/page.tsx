import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Press & Media — WaterCheckup',
  description:
    'Press kit, boilerplate, and ready-to-send pitch templates for WaterCheckup — free ZIP-level EPA water data summaries for US tap water.',
  alternates: { canonical: 'https://watercheckup.com/press' },
  openGraph: {
    title: 'Press & Media — WaterCheckup',
    description:
      'Fact sheets, quotes, and email templates for journalists covering drinking water, PFAS, lead, and EPA compliance.',
  },
};

const SECTION: CSSProperties = {
  marginBottom: 40,
};

const H2: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#0891b2',
  letterSpacing: 2,
  marginBottom: 14,
};

const CARD: CSSProperties = {
  padding: '18px 20px',
  background: '#071828',
  border: '1px solid #1a3a5c',
  borderRadius: 12,
};

const PITCH_BOX: CSSProperties = {
  ...CARD,
  fontSize: 13,
  color: '#cbd5e1',
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap' as const,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

export default function PressPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Try the tool →" ctaHref="/" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            FOR JOURNALISTS & NEWSLETTERS
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 14px' }}>
            Press kit
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            WaterCheckup turns public EPA drinking-water data into plain-language ZIP snapshots—violations, PFAS monitoring where available, lead context, and practical filter angles. Below: boilerplate, approved quotes, key links, and three email templates you can paste and personalize.
          </p>
        </div>

        <div style={SECTION}>
          <div style={H2}>CONTACT</div>
          <div style={CARD}>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px' }}>
              Press and partnership inquiries:{' '}
              <a href="mailto:hello@watercheckup.com" style={{ color: '#22d3ee', fontWeight: 700 }}>
                hello@watercheckup.com
              </a>
            </p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              We can provide interview slots, methodology walkthroughs, and pointers to primary EPA sources. We are not a laboratory and do not give individualized medical advice.
            </p>
          </div>
        </div>

        <div style={SECTION}>
          <div style={H2}>BOILERPLATE (SHORT)</div>
          <div style={CARD}>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
              <strong style={{ color: '#e2e8f0' }}>WaterCheckup</strong> is a free consumer tool that summarizes public U.S. EPA drinking water data for a given ZIP code—including violation history, PFAS monitoring where reported, and lead risk context—and explains results in plain language. It links to federal datasets and methodology so readers can verify claims. WaterCheckup is not affiliated with the EPA.
            </p>
          </div>
        </div>

        <div style={SECTION}>
          <div style={H2}>APPROVED QUOTES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Most people never read their Consumer Confidence Report. We built WaterCheckup so anyone can see what EPA-tracked data says about their utility in minutes—not to replace your water district, but to make the paperwork legible.',
              'PFAS and lead stories land harder when you can tie them to a specific ZIP and the same government datasets regulators use. Our rankings pages cite UCMR5 and MCL context so outlets do not have to invent numbers.',
              'We are careful to separate “what EPA published” from “what you should do medically.” For health decisions, readers should talk to a professional; our job is to surface the public record clearly.',
            ].map((q) => (
              <div key={q.slice(0, 40)} style={CARD}>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
                  “{q}”
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={SECTION}>
          <div style={H2}>KEY LINKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/', label: 'Homepage (ZIP lookup)', desc: 'Primary entry: enter ZIP for a free snapshot.' },
              { href: '/methodology', label: 'Methodology', desc: 'How we source and interpret EPA data.' },
              { href: '/worst', label: 'Rankings hub', desc: 'PFAS-over-MCL systems, THM/DBP city flags, lead, violations, states.' },
              { href: '/worst-pfas', label: 'Highest PFAS vs EPA limits (UCMR5)', desc: 'National table—compound-by-compound where regulated.' },
              { href: '/worst-thm', label: 'Disinfection byproduct risk (city profiles)', desc: 'Editorial tiering from structured city issue flags.' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ ...CARD, transition: 'border-color 0.15s' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={SECTION}>
          <div style={H2}>FACTS FOR COPY DESKS</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.85 }}>
            <li>
              <strong style={{ color: '#e2e8f0' }}>What we are:</strong> A reader-facing summary layer on top of public federal water data, plus educational ranking pages with cited methodologies.
            </li>
            <li>
              <strong style={{ color: '#e2e8f0' }}>What we are not:</strong> A replacement for certified lab testing, utility notifications, or medical advice.
            </li>
            <li>
              <strong style={{ color: '#e2e8f0' }}>Affiliate disclosure:</strong> The site may earn commissions on some filter links; methodology and data citations are independent of affiliate relationships (
              <Link href="/" style={{ color: '#22d3ee' }}>
                see homepage footer
              </Link>
              ).
            </li>
          </ul>
        </div>

        <div style={{ ...SECTION, marginBottom: 24 }}>
          <div style={H2}>PITCH 1 — LOCAL (TV, NEWSPAPER, REGIONAL NEWSLETTER)</div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
            Replace <code style={{ color: '#94a3b8' }}>[City]</code>, <code style={{ color: '#94a3b8' }}>[Outlet]</code>, and the hook line with your market. Attach or link your city page:{' '}
            <code style={{ color: '#64748b' }}>watercheckup.com/water/[city-slug]</code>.
          </p>
          <div style={PITCH_BOX}>
{`Subject: Idea: EPA-backed tap water context for [City] readers

Hi [Name] —

I'm reaching out with a timely, data-first story for [Outlet]'s audience in [City].

Most residents never open their annual Consumer Confidence Report. WaterCheckup (watercheckup.com) pulls the same class of EPA-tracked information—violations, PFAS monitoring where reported, lead context—into a free ZIP-level snapshot written in plain language, with sources linked.

Angle for [City]: [One sentence: e.g. aging infrastructure / regional PFAS stories / DBP seasonality / lead service lines — tie to something your readers already worry about.]

I'm happy to walk through the methodology on a call or provide B-roll-friendly talking points: what's federal record vs. what requires a certified lab. We don't give medical advice; we make the public record legible.

Would a short segment or Q&A work next week?

Best,
[Your name]
WaterCheckup — hello@watercheckup.com`}
          </div>
        </div>

        <div style={{ ...SECTION, marginBottom: 24 }}>
          <div style={H2}>PITCH 2 — NATIONAL PFAS / UCMR5 (POLICY, ENVIRONMENT, HEALTH DESKS)</div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
            Points to{' '}
            <Link href="/worst-pfas" style={{ color: '#22d3ee' }}>
              watercheckup.com/worst-pfas
            </Link>{' '}
            and{' '}
            <Link href="/methodology" style={{ color: '#22d3ee' }}>
              /methodology
            </Link>
            .
          </p>
          <div style={PITCH_BOX}>
{`Subject: Data peg: worst regulated PFAS vs EPA MCL (UCMR5) — national context for readers

Hi [Name] —

The EPA's enforceable PFAS limits mean monitoring data from UCMR5 is now a concrete compliance story—not just "PFAS detected."

WaterCheckup publishes a transparent national ranking of water systems where regulated PFAS exceeded Maximum Contaminant Levels in federal monitoring—compound-by-compound, with ppt readings and multiples of the limit. Primary data is cited; methodology is public (watercheckup.com/methodology).

If you're covering [PFAS settlement / military AFFF / GenX / MCL enforcement], this gives readers a single explainable table instead of scattered PDFs.

Happy to do background on how UCMR5 relates to what shows up on a consumer bill or how to phrase risk without overclaiming.

Best,
[Your name]
WaterCheckup — hello@watercheckup.com`}
          </div>
        </div>

        <div style={SECTION}>
          <div style={H2}>PITCH 3 — THMs / DISINFECTION BYPRODUCTS (PARENTING, HOME, WELLNESS NEWSLETTERS)</div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
            Points to{' '}
            <Link href="/worst-thm" style={{ color: '#22d3ee' }}>
              watercheckup.com/worst-thm
            </Link>
            . Emphasize transparency: this page ranks cities where WaterCheckup's editorial profiles flag THMs/HAAs/DBPs—not a re-analysis of every utility's latest quarterly THM numbers.
          </p>
          <div style={PITCH_BOX}>
{`Subject: Non-alarmist peg: disinfection byproducts + what actually helps at the tap

Hi [Name] —

Chlorine keeps drinking water safe from pathogens, but it can also form trihalomethanes (THMs) and haloacetic acids when it reacts with organic matter—regulated disinfection byproducts that communities sometimes hit in hot weather or high-runoff seasons.

WaterCheckup explains this tradeoff in plain language and lists cities where our structured water profiles explicitly flag THM/DBP risk—sorted by editorial urgency tiers, with honest limits on what the list does and doesn't claim (watercheckup.com/worst-thm).

For readers asking "do I need a filter?", we point to established certification frameworks (e.g. NSF/ANSI categories) and separate EPA data from product choices—no scare tactics.

Open to a short guest tip or tool mention if it fits your audience.

Best,
[Your name]
WaterCheckup — hello@watercheckup.com`}
          </div>
        </div>

        <div style={{ padding: '16px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 12, color: '#64748b', lineHeight: 1.65 }}>
          <strong style={{ color: '#94a3b8' }}>Disclaimer for your editors:</strong> WaterCheckup summarizes public regulatory data for educational purposes. It does not diagnose health conditions. Utility compliance can change; readers with concerns should consult certified testing and qualified professionals.
        </div>
      </div>
    </div>
  );
}
