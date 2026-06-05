import type { CSSProperties } from 'react';
import Link from 'next/link';
import { AUTHOR_FORMER_WQA_CREDENTIAL, AUTHOR_REVIEW_BYLINE } from '@/lib/site-stats';

type Variant = 'dark' | 'light';

const styles: Record<Variant, { color: string; link: string }> = {
  dark: { color: '#94a3b8', link: '#67e8f9' },
  light: { color: '#64748b', link: '#0369a1' },
};

/** Visible E-E-A-T byline for city and blog pages */
export function AuthorReviewBadge({
  variant = 'dark',
  style,
}: {
  variant?: Variant;
  style?: CSSProperties;
}) {
  const palette = styles[variant];
  return (
    <p
      style={{
        fontSize: 13,
        color: palette.color,
        lineHeight: 1.6,
        margin: '0 0 18px',
        ...style,
      }}
    >
      Reviewed by{' '}
      <Link href="/about" style={{ color: palette.link, fontWeight: 700, textDecoration: 'none' }}>
        Joe Letorney
      </Link>
      , 30-year water treatment expert
      <span style={{ opacity: 0.85 }}> · {AUTHOR_FORMER_WQA_CREDENTIAL}</span>
    </p>
  );
}

export { AUTHOR_REVIEW_BYLINE };
