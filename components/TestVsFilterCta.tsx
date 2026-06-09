'use client';

import { Suspense, type CSSProperties } from 'react';
import Link from 'next/link';
import { SIMPLELAB_CITY_TESTS_URL } from '@/lib/simplelab-links';

type Props = {
  /** e.g. "San Antonio" or "ZIP 78205" */
  contextLabel: string;
  filterHref: string;
  /** Highlight the lab-test path when plumbing/PFAS uncertainty is high */
  emphasizeTest?: boolean;
  /** Results page: jump to Filters tab instead of quiz */
  onOpenFilters?: () => void;
  filterCtaLabel?: string;
};

const cardBase: CSSProperties = {
  flex: '1 1 260px',
  padding: '20px 22px',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

export function TestVsFilterCta({
  contextLabel,
  filterHref,
  emphasizeTest = false,
  onOpenFilters,
  filterCtaLabel = 'Match my filter →',
}: Props) {
  const filterButton = onOpenFilters ? (
    <button
      type="button"
      onClick={onOpenFilters}
      style={{
        display: 'inline-block',
        padding: '11px 18px',
        background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 13,
        fontWeight: 800,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      {filterCtaLabel}
    </button>
  ) : (
    <Link
      prefetch href={filterHref}
      style={{
        display: 'inline-block',
        padding: '11px 18px',
        background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 13,
        fontWeight: 800,
        textDecoration: 'none',
        textAlign: 'center',
      }}
    >
      {filterCtaLabel}
    </Link>
  );

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
        TEST YOUR TAP OR FILTER NOW?
      </div>
      <Suspense fallback={null}>
      <p suppressHydrationWarning style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, margin: '0 0 16px' }}>
        {contextLabel} utility data is a strong baseline — but lead often comes from your home&apos;s pipes, and
        PFAS can vary by neighborhood. Choose certified lab testing for certainty, or skip straight to NSF-certified
        filters matched to this profile.
      </p>
      </Suspense>
      

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div
          style={{
            ...cardBase,
            background: emphasizeTest ? 'rgba(251,191,36,0.08)' : '#071828',
            border: emphasizeTest ? '2px solid rgba(251,191,36,0.45)' : '1px solid #1a3a5c',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: 1.5 }}>
            STEP 1 · VERIFY AT YOUR FAUCET
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>
            Test before you buy a $300+ filter
          </div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0, flex: 1 }}>
            SimpleLab Tap Score mail-in panels test PFAS, lead, nitrates, bacteria, and 100+ contaminants at your
            kitchen tap. Results in about a week — then pick filtration with real numbers, not guesses.
          </p>
          <a
            href={SIMPLELAB_CITY_TESTS_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'inline-block',
              padding: '11px 18px',
              background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
              borderRadius: 8,
              color: '#0f172a',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Tap Score City Test — from $89 →
          </a>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
            Accredited labs · Best if you have old plumbing, pregnancy, or want proof before installing RO
          </p>
        </div>

        <div
          style={{
            ...cardBase,
            background: emphasizeTest ? '#071828' : 'rgba(8,145,178,0.08)',
            border: emphasizeTest ? '1px solid #1a3a5c' : '2px solid rgba(8,145,178,0.4)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: '#67e8f9', letterSpacing: 1.5 }}>
            STEP 2 · FIX IT NOW
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>
            Ready to filter based on this report?
          </div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0, flex: 1 }}>
            Get NSF 58 / NSF 53 picks matched to {contextLabel}&apos;s PFAS, lead, and disinfection byproduct
            profile — reviewed by a 30-year water treatment expert.
          </p>
          {filterButton}
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
            Best when contaminants are already flagged above and you want the right RO or pitcher today
          </p>
        </div>
      </div>
    </div>
  );
}
