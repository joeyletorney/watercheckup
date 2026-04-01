'use client';
import { useState } from 'react';
import Link from 'next/link';

declare global { interface Window { gtag?: (...args: any[]) => void } }

const WATERDROP_TAG = 'anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const LINKS = {
  waterdrop: `https://www.waterdrop.com/?ref=${WATERDROP_TAG}`,
  amazon_pitcher: `https://www.amazon.com/s?k=water+filter+pitcher+pfas+certified&tag=${AMAZON_TAG}`,
  amazon_undersink: `https://www.amazon.com/s?k=under+sink+reverse+osmosis+system&tag=${AMAZON_TAG}`,
  amazon_whole_house: `https://www.amazon.com/s?k=whole+house+water+filter+system&tag=${AMAZON_TAG}`,
  amazon_well: `https://www.amazon.com/s?k=well+water+filter+system&tag=${AMAZON_TAG}`,
};

function trackEvent(name: string, params: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

const QUESTIONS = [
  {
    id: 'source',
    question: 'What is your water source?',
    subtitle: 'Determines which contaminants we prioritize.',
    options: [
      { value: 'city', label: 'City / Municipal Water', icon: '🏙️' },
      { value: 'well', label: 'Private Well Water', icon: '🌿' },
    ],
  },
  {
    id: 'concern',
    question: "What's your biggest concern?",
    subtitle: 'Choose what worries you most.',
    options: [
      { value: 'pfas', label: 'PFAS / Forever Chemicals', icon: '⚗️' },
      { value: 'lead', label: 'Lead & Heavy Metals', icon: '🔩' },
      { value: 'taste', label: 'Taste, Odor & Chlorine', icon: '💧' },
      { value: 'general', label: 'Everything — Full Protection', icon: '🛡️' },
    ],
  },
  {
    id: 'situation',
    question: 'What describes your home?',
    subtitle: 'Helps us recommend the right filter type.',
    options: [
      { value: 'renter', label: 'Renter — No Modifications', icon: '🏢' },
      { value: 'owner_simple', label: 'Homeowner — Simple Setup', icon: '🏠' },
      { value: 'owner_full', label: 'Homeowner — Full Protection', icon: '🏡' },
    ],
  },
];

type Rec = {
  title: string; tagline: string; why: string;
  cta: string; cta2: string; link: string; link2: string;
  badge: string; badgeColor: string;
};

const RECS: Record<string, Rec> = {
  'city-pfas-renter':         { title: 'Waterdrop Pitcher Filter', tagline: 'NSF 53 & 58 certified. Removes 99% of PFAS. Zero installation.', why: 'PFAS accumulate silently. This certified pitcher is the fastest fix for renters — no tools, no landlord permission.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_pitcher, badge: 'PFAS CERTIFIED', badgeColor: '#0891b2' },
  'city-pfas-owner_simple':   { title: 'Waterdrop Under-Sink Filter', tagline: 'Tankless RO. 0.0001 micron filtration. Installs in 30 min.', why: 'Under-sink RO is the gold standard for PFAS. Fits any kitchen sink, no tank needed, crystal clear water at the tap.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST FOR PFAS', badgeColor: '#0891b2' },
  'city-pfas-owner_full':     { title: 'Waterdrop RO + Whole-House Pre-Filter', tagline: 'Full-home pre-filter + point-of-use RO. Maximum coverage.', why: 'Pair a whole-house sediment filter at entry with a dedicated RO at the kitchen tap. Covers drinking, cooking, and ice.', cta: 'Get on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'MAXIMUM PROTECTION', badgeColor: '#0066cc' },
  'city-lead-renter':         { title: 'Waterdrop Pitcher — Lead Certified', tagline: 'NSF 53 certified for lead reduction. Works anywhere.', why: 'Lead enters through old building pipes. A certified pitcher gives you immediate protection — no installation required.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_pitcher, badge: 'LEAD CERTIFIED', badgeColor: '#d97706' },
  'city-lead-owner_simple':   { title: 'Waterdrop Under-Sink Filter', tagline: 'Removes 99.9% of lead. Quick install. No tank.', why: 'Homes built before 1986 likely have lead solder or pipes. An under-sink filter gives you certified point-of-use protection.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'LEAD CERTIFIED', badgeColor: '#d97706' },
  'city-lead-owner_full':     { title: 'Whole-House + Under-Sink RO', tagline: 'Protect every tap. Full lead removal from entry to glass.', why: 'If your home has aging pipes throughout, a whole-house pre-filter plus a dedicated kitchen RO is the complete solution.', cta: 'Under-Sink on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#7c3aed' },
  'city-taste-renter':        { title: 'Waterdrop Pitcher Filter', tagline: 'Removes chlorine, chloramines, VOCs. Better taste instantly.', why: 'Chlorine is what makes city water taste like a pool. Carbon filtration removes it completely — zero installation needed.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_pitcher, badge: 'CHLORINE REMOVAL', badgeColor: '#059669' },
  'city-taste-owner_simple':  { title: 'Waterdrop Under-Sink Filter', tagline: 'Crystal clear, great-tasting water from your tap.', why: 'Under-sink carbon block filtration eliminates chlorine taste and odor at the source. You will notice the difference on day one.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST TASTE', badgeColor: '#059669' },
  'city-taste-owner_full':    { title: 'Whole-House Carbon Filter', tagline: 'Every tap filtered. Better showers, laundry, and drinking water.', why: 'A whole-house carbon filter removes chlorine from all water entering your home — better for your skin, hair, and every glass.', cta: 'See on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#059669' },
  'city-general-renter':      { title: 'Waterdrop Pitcher — Multi-Stage', tagline: '7-stage filtration. Removes 200+ contaminants. No tools.', why: 'For renters who want comprehensive protection without installation, a multi-stage pitcher is your best starting point.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_pitcher, badge: 'ALL-IN-ONE', badgeColor: '#475569' },
  'city-general-owner_simple':{ title: 'Waterdrop Under-Sink RO', tagline: 'Removes 1000+ contaminants. Most complete filter available.', why: 'Reverse osmosis handles everything — PFAS, lead, nitrates, arsenic, chlorine, and more. Gold standard for home filtration.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'MOST COMPLETE', badgeColor: '#475569' },
  'city-general-owner_full':  { title: 'Whole-House + Under-Sink RO', tagline: 'Total home protection. Every drop filtered twice.', why: 'Whole-house sediment/carbon at entry plus a dedicated RO at the kitchen sink. The most comprehensive setup available.', cta: 'Under-Sink on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'TOTAL PROTECTION', badgeColor: '#0f172a' },
  'well-pfas-renter':         { title: 'Waterdrop Well Water Filter', tagline: 'Certified for well PFAS and iron removal. No installation.', why: 'Well PFAS contamination is common near agriculture and industry. A certified filter removes it wherever you are.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL CERTIFIED', badgeColor: '#166534' },
  'well-pfas-owner_simple':   { title: 'Waterdrop Well Water RO', tagline: 'Handles iron, hardness, PFAS, and bacteria. Built for wells.', why: 'Well water needs filters rated for higher sediment and biological contamination in addition to PFAS. This handles all of it.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + PFAS', badgeColor: '#166534' },
  'well-pfas-owner_full':     { title: 'Whole-House Well System + RO', tagline: 'Iron filter + softener + RO. Complete well protection.', why: 'Full protection for well homeowners means treating at entry (iron, sediment, bacteria) and again at the tap (PFAS, nitrates).', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'MAXIMUM WELL', badgeColor: '#14532d' },
  'well-lead-renter':         { title: 'Waterdrop Well Water Pitcher', tagline: 'NSF 53 certified. Removes lead from well water. Portable.', why: 'Lead can leach into well water from aging pipes or natural deposits. A certified pitcher protects you with no plumbing work.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + LEAD', badgeColor: '#92400e' },
  'well-lead-owner_simple':   { title: 'Waterdrop Well Water RO', tagline: 'Removes lead, iron, manganese, and heavy metals.', why: 'Well water lead often comes from natural deposits or old pump hardware. An RO system handles it at the tap.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + LEAD', badgeColor: '#92400e' },
  'well-lead-owner_full':     { title: 'Whole-House Well + RO System', tagline: 'Iron filtration + lead removal at every tap.', why: 'For full protection on well water, pair entry-level iron and sediment filtration with a dedicated kitchen RO.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL HOME', badgeColor: '#78350f' },
  'well-taste-renter':        { title: 'Waterdrop Well Water Pitcher', tagline: 'Removes sulfur, iron taste, and sediment. No installation.', why: 'Well water taste issues usually come from iron, sulfur, or sediment. A well-certified pitcher fixes it instantly.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46' },
  'well-taste-owner_simple':  { title: 'Waterdrop Well Water RO', tagline: 'Eliminates iron, sulfur, hardness, and taste issues.', why: 'An RO system for well water removes the root causes of taste and odor problems — not just masking them.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46' },
  'well-taste-owner_full':    { title: 'Whole-House Well Filter', tagline: 'Softener + carbon + sediment. Every tap improved.', why: 'A whole-house well filter system addresses hardness, iron, and taste at the source before water reaches any fixture.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL', badgeColor: '#064e3b' },
  'well-general-renter':      { title: 'Waterdrop Well Water Pitcher', tagline: 'Multi-stage well filtration. No installation required.', why: 'Well water has unique contaminant profiles. A well-certified multi-stage pitcher covers bacteria, metals, and sediment.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f' },
  'well-general-owner_simple':{ title: 'Waterdrop Well Water RO', tagline: 'Built for well water. Removes iron, bacteria, PFAS, and more.', why: 'Private wells need specialized filtration. This system is rated for the full range of well water contaminants.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f' },
  'well-general-owner_full':  { title: 'Whole-House Well System + RO', tagline: 'Complete protection from wellhead to tap.', why: 'The gold standard for well homeowners. Entry-level whole-house filtration plus a dedicated kitchen RO handles everything.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'TOTAL WELL', badgeColor: '#0f172a' },
};

function getRec(answers: Record<string, string>): Rec {
  const key = `${answers.source}-${answers.concern}-${answers.situation}`;
  return RECS[key] || RECS['city-general-owner_simple'];
}

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const currentQ = QUESTIONS[step];
  const rec = done ? getRec(answers) : null;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    trackEvent('quiz_answer', { question: currentQ.id, answer: value });
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 250);
    } else {
      setTimeout(() => {
        setDone(true);
        trackEvent('quiz_complete', { source: newAnswers.source, concern: newAnswers.concern, situation: newAnswers.situation });
      }, 250);
    }
  };

  const restart = () => { setAnswers({}); setStep(0); setDone(false); };

  const handleAffiliateClick = (destination: string, productTitle: string) => {
    trackEvent('affiliate_click', { destination, product: productTitle, page: 'quiz' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040d14', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My ZIP →
        </Link>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER FINDER</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: '0 0 8px' }}>Find Your Perfect Water Filter</h1>
          <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>3 quick questions. Personalized recommendation based on your water source and concerns.</p>
        </div>

        {!done ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginBottom: 8 }}>
                <span>QUESTION {step + 1} OF {QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div style={{ height: 3, background: '#0f2336', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${((step + 1) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{currentQ.question}</h2>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>{currentQ.subtitle}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQ.options.map(opt => (
                <button key={opt.value} onClick={() => handleSelect(opt.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, cursor: 'pointer', textAlign: 'left', color: '#e2e8f0', transition: 'all 0.15s', fontSize: 15, fontWeight: 600 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2a40'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a3a5c'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2240'; }}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#475569', marginTop: 20, padding: 0 }}>← Back</button>
            )}
          </div>
        ) : rec ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'inline-block', background: rec.badgeColor, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '4px 12px', borderRadius: 4, marginBottom: 16 }}>{rec.badge}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 8 }}>OUR RECOMMENDATION</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>{rec.title}</h2>
            <p style={{ fontSize: 15, color: '#0891b2', fontStyle: 'italic', marginBottom: 20 }}>{rec.tagline}</p>
            <div style={{ background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, padding: '16px 18px', marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{rec.why}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <a href={rec.link} target="_blank" rel="noopener noreferrer" onClick={() => handleAffiliateClick('waterdrop', rec.title)} style={{ display: 'block', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', textAlign: 'center', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700 }}>{rec.cta} →</a>
              <a href={rec.link2} target="_blank" rel="noopener noreferrer" onClick={() => handleAffiliateClick('amazon', rec.title)} style={{ display: 'block', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', textAlign: 'center', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1px solid #1a3a5c' }}>{rec.cta2} →</a>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
              {Object.entries(answers).map(([k, v]) => (
                <span key={k} style={{ background: '#0d2240', border: '1px solid #1a3a5c', color: '#475569', fontSize: 11, letterSpacing: 1, padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' as const }}>{v.replace('_', ' ')}</span>
              ))}
            </div>
            <button onClick={restart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#475569', padding: 0, textDecoration: 'underline' }}>Start over</button>
          </div>
        ) : null}

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#1e3a5f' }}>
          Data sourced from EPA SDWIS, UCMR5 PFAS monitoring, and EWG · <Link href="/" style={{ color: '#1e3a5f' }}>WaterCheckup.com</Link>
        </div>
      </div>
    </div>
  );
}
