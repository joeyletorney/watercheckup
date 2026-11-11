'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '../components/SiteHeader';
import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';
import { trackAffiliateClick } from '@/lib/affiliate-tracking';

import { getQuizRecommendation as getRec, type QuizPick as AltPick } from '@/lib/quiz-recommendations';

function trackEvent(name: string, params: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params);
}
function showBuyDirectForBrand(brand: string) {
  return brand === 'Waterdrop' || brand === 'Clearly Filtered';
}

function directBuyLabelForBrand(brand: string) {
  if (brand === 'Waterdrop') return 'Waterdrop.com →';
  if (brand === 'Clearly Filtered') return 'ClearlyFiltered.com →';
  return 'Buy Direct →';
}

const QUESTIONS = [
  {
    id: 'source', question: 'What is your water source?', subtitle: 'Determines which contaminants we prioritize.',
    options: [
      { value: 'city', label: 'City / Municipal Water', icon: '🏙️', desc: 'Tap water from a public water system — chlorine, PFAS, lead are common concerns.' },
      { value: 'well', label: 'Private Well Water', icon: '🌿', desc: 'Your own well — bacteria, nitrates, iron, and arsenic are typical priorities.' },
    ],
  },
  {
    id: 'concern', question: "What's your biggest concern?", subtitle: 'Choose what worries you most — we will match the right filter technology.',
    options: [
      { value: 'pfas', label: 'PFAS / Forever Chemicals', icon: '⚗️', desc: 'Compare the exact model’s listed PFAS reduction claims.' },
      { value: 'lead', label: 'Lead & Heavy Metals', icon: '🔩', desc: 'Leaches from old pipes. No safe level for children.' },
      { value: 'taste', label: 'Taste, Odor & Chlorine', icon: '💧', desc: 'Chlorine, sulfur, and minerals that make water unpleasant to drink.' },
      { value: 'general', label: 'Everything — All major concerns', icon: '🛡️', desc: 'Help me compare options; I have not identified one specific issue.' },
    ],
  },
  {
    id: 'situation', question: 'What describes your home?', subtitle: 'Affects what can be installed without plumbing modifications.',
    options: [
      { value: 'renter', label: 'Renter — No Modifications', icon: '🏢', desc: 'No drilling or plumbing changes. Pitcher or countertop only.' },
      { value: 'owner_simple', label: 'Homeowner — Kitchen / Under-Sink', icon: '🏠', desc: 'Under-sink filter for drinking and cooking. Best value for most families.' },
      { value: 'owner_full', label: 'Homeowner — Whole Home + Kitchen', icon: '🏡', desc: 'Compare drinking-water needs separately from whole-home treatment.' },
    ],
  },
];

const CERT_COLOR: Record<string, string> = {
  'WQA Gold Seal': '#d97706',
  'NSF 58': '#0891b2',
  'NSF 401': '#7c3aed',
  'NSF 42': '#059669',
  'NSF 53': '#0891b2',
  'NSF 61': '#a8b4c4',
  'NSF P473': '#ef4444',
  'NSF 244': '#f59e0b',
  'WQA tested': '#d97706',
};

function CertBadge({ cert }: { cert: string }) {
  const color = CERT_COLOR[cert] || '#a8b4c4';
  return (
    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: '2px 7px', borderRadius: 4, background: `${color}18`, border: `1px solid ${color}44`, color, display: 'inline-block' }}>
      {cert}
    </span>
  );
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [fromReport, setFromReport] = useState(false);
  const currentQ = QUESTIONS[step];
  const rec = done ? getRec(answers) : null;

  useEffect(() => {
    const source = searchParams.get('source');
    const concern = searchParams.get('concern');
    const situation = searchParams.get('situation');
    if (!source || !concern) return;
    if (source !== 'city' && source !== 'well') return;
    if (!['pfas', 'lead', 'taste', 'general'].includes(concern)) return;
    if (situation && !['renter', 'owner_simple', 'owner_full'].includes(situation)) return;
    setAnswers({ source, concern });
    setDone(false);
    setStep(2);
    setFromReport(searchParams.get('from') === 'results');
  }, [searchParams]);

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    trackEvent('quiz_answer', { question: currentQ.id, answer: value });
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
      trackEvent('quiz_complete', { source: newAnswers.source, concern: newAnswers.concern, situation: newAnswers.situation });
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setFromReport(false);
  };

  const renderAltRows = (alts: AltPick[], keyPrefix: string) =>
    alts.map((alt, i) => {
      const showDirect = showBuyDirectForBrand(alt.brand);
      return (
        <div key={`${keyPrefix}-${i}`} style={{ padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
          {alt.categoryLabel && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: '#22d3ee', marginBottom: 6 }}>{alt.categoryLabel}</div>}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#a8b4c4' }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{alt.product}</span>
                {alt.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{alt.badge}</span>}
              </div>
              <div style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 4 }}>{alt.brand} · {alt.price}</div>
              {/* Certification badges */}
              {alt.certs && alt.certs.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                  {alt.certs.map(c => <CertBadge key={c} cert={c} />)}
                </div>
              )}
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>{alt.reason}</div>
              {alt.evidence && <a href={alt.evidence} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, color: '#67e8f9', fontSize: 13 }}>Check this model’s published evidence →</a>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
              {showDirect ? (
                <a href={alt.link} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackAffiliateClick({ destination: 'direct', product: alt.product, page: 'quiz', brand: alt.brand })}
                  style={{ display: 'block', padding: '7px 14px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#cbd5e1', textDecoration: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>
                  {directBuyLabelForBrand(alt.brand)}
                </a>
              ) : (
              <a href={normalizeAmazonUrl(alt.amazon) ?? alt.amazon} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackAffiliateClick({ destination: 'amazon', product: alt.product, page: 'quiz', brand: alt.brand })}
                style={{ display: 'block', padding: '7px 14px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#cbd5e1', textDecoration: 'none', borderRadius: 7, fontSize: 13, fontWeight: i === 0 ? 700 : 600, textAlign: 'center', border: i === 0 ? 'none' : '1px solid #1a3a5c', whiteSpace: 'nowrap' }}>
                Amazon →
              </a>
              )}
            </div>
          </div>
        </div>
      );
    });

  const p: React.CSSProperties = { fontSize: 14, color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 14px' };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER FINDER</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', margin: '0 0 18px', lineHeight: 1.2 }}>Find a Filter That Fits</h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 20px', lineHeight: 1.6 }}>Answer three questions to compare options for your concern, water source and installation limits.</p>
          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { label: 'Model-specific evidence', color: '#0891b2', icon: '✓' },
              { label: 'Installation fit', color: '#d97706', icon: '✓' },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: `${b.color}12`, border: `1px solid ${b.color}33`, color: b.color }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── QUIZ / RESULTS ── */}
        {!done ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px', marginBottom: 64 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#cbd5e1', marginBottom: 8 }}>
                <span>QUESTION {step + 1} OF {QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div style={{ height: 3, background: '#0f2336', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${((step + 1) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{currentQ.question}</h2>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 24 }}>{currentQ.subtitle}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQ.options.map(opt => (
                <button key={opt.value} onClick={() => handleSelect(opt.value)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, cursor: 'pointer', textAlign: 'left', color: '#e2e8f0', fontSize: 15, fontWeight: 600, width: '100%' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2a40'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a3a5c'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2240'; }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{opt.label}</div>
                    {'desc' in opt && <div style={{ fontSize: 13, color: '#a8b4c4', marginTop: 2, fontWeight: 400, lineHeight: 1.5 }}>{(opt as any).desc}</div>}
                  </div>
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#cbd5e1', marginTop: 20, padding: 0 }}>← Back</button>}
          </div>
        ) : rec ? (
          <div style={{ marginBottom: 64 }}>
            {fromReport ? (
              <div
                style={{
                  marginBottom: 14,
                  padding: '12px 14px',
                  background: 'rgba(8,145,178,0.12)',
                  border: '1px solid rgba(34,211,238,0.35)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#cbd5e1',
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: '#67e8f9' }}>Continue from your ZIP report.</strong> Your report suggested a starting concern; your answers determine installation fit. Supplier records do not establish what is at your tap. You can{' '}
                <button
                  type="button"
                  onClick={restart}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#38bdf8', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  retake the quiz
                </button>
                .
              </div>
            ) : null}
            {/* Affiliate disclosure — right at the top of results */}
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: 13, color: '#78716c', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#a16207' }}>Affiliate disclosure:</strong> Some links below are affiliate links — if you purchase through them, WaterCheckup may earn a small commission at no extra cost to you. Compare the exact model’s published evidence and installation requirements before buying. As an Amazon Associate I earn from qualifying purchases.
              </p>
            </div>

            <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '28px' }}>
              <div style={{ display: 'inline-block', background: rec.badgeColor, color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 2, padding: '4px 12px', borderRadius: 4, marginBottom: 14 }}>{rec.badge}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 6 }}>OUR RECOMMENDATION</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>{rec.title}</h2>
              <p style={{ fontSize: 14, color: '#0891b2', fontStyle: 'italic', marginBottom: 18, lineHeight: 1.55 }}>{rec.tagline}</p>
              <div style={{ background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{rec.why}</p>
              </div>

              {answers.source === 'well' && <p style={{ lineHeight: 1.7, marginBottom: 20 }}><Link href="/well" style={{ color: '#67e8f9' }}>Read the well-water testing and treatment guide →</Link></p>}
              <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}><a href="https://www.nsf.org/consumer-resources/articles/standards-water-treatment-systems" target="_blank" rel="noopener noreferrer" style={{ color: '#67e8f9' }}>How to check the exact certified claim</a> · <a href="https://support.aquatru.com/hc/en-us/articles/360045853654-Where-can-I-see-AquaTru-s-certified-test-results" target="_blank" rel="noopener noreferrer" style={{ color: '#67e8f9' }}>AquaTru model performance sheets</a></p>
              {/* Product results */}
              {rec.alts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 2 }}>
                    {rec.altsWholeHouse?.length ? 'TOP PICKS — DRINKING & COOKING (UNDER-SINK / RO)' : 'YOUR MATCH + ONE ALTERNATIVE'}
                  </div>
                  {renderAltRows(rec.alts, 'pou')}
                  {rec.altsWholeHouse?.length ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 2 }}>TOP PICKS — WHOLE HOUSE (POINT OF ENTRY)</div>
                      <p style={{ fontSize: 13, color: '#a8b4c4', margin: '0 0 4px', lineHeight: 1.5 }}>Treats water where it enters your home — showers, laundry, pipes. Pair with the under-sink picks above for the cleanest drinking water.</p>
                      {renderAltRows(rec.altsWholeHouse, 'poe')}
                    </div>
                  ) : null}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {Object.entries(answers).map(([k, v]) => (
                  <span key={k} style={{ background: '#0d2240', border: '1px solid #1a3a5c', color: '#cbd5e1', fontSize: 13, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{v.replace('_', ' ')}</span>
                ))}
              </div>
              <button onClick={restart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#cbd5e1', padding: 0, textDecoration: 'underline' }}>Start over</button>
            </div>
          </div>
        ) : null}

        <details style={{ padding: 24, border: '1px solid #1a3a5c', borderRadius: 12, marginBottom: 40 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 800 }}>How to verify a filter before buying</summary>
          <p style={p}>NSF/ANSI 42 covers aesthetic claims. NSF/ANSI 53 and 58 can include specific health-related reduction claims, but certification to a standard does not mean every substance is covered. NSF/ANSI 401 alone does not establish a PFAS reduction claim.</p>
          <p style={p}>Check the exact model, cartridge and contaminant claim in the certifier’s listing and manufacturer’s performance sheet. Confirm replacement costs, rated capacity, feed-water limits and installation requirements. These comparisons use published evidence, not WaterCheckup laboratory tests.</p>
          <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noopener noreferrer" style={{ color: '#67e8f9' }}>EPA’s filter certification guidance for PFAS →</a>
        </details>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#1e3a5f' }}>
          Compare published evidence, installation and upkeep · <Link href="/" style={{ color: '#1e3a5f' }}>WaterCheckup.com</Link>
        </div>
      </div>
    </div>
  );
}
