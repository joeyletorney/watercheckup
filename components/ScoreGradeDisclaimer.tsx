import Link from 'next/link';
import type { CSSProperties } from 'react';

export const SCORE_GRADE_DISCLAIMER_TEXT =
  'WaterCheckup Safety Score — an independent index from EPA public data and our formula. Historical peaks do not determine compliance. Hardness and editorial wording do not affect this index. Missing coverage is not a clean test result.';

type Props = {
  className?: string;
  style?: CSSProperties;
  /** Show link to /methodology (default true). */
  showMethodologyLink?: boolean;
};

export function ScoreGradeDisclaimer({
  className,
  style,
  showMethodologyLink = true,
}: Props) {
  return (
    <p
      className={className}
      style={{
        margin: 0,
        fontSize: 12,
        color: '#94a3b8',
        lineHeight: 1.55,
        ...style,
      }}
    >
      {SCORE_GRADE_DISCLAIMER_TEXT}
      {showMethodologyLink ? (
        <>
          {' '}
          <Link prefetch href="/methodology" style={{ color: '#67e8f9', textDecoration: 'none', fontWeight: 600 }}>
            How we score →
          </Link>
        </>
      ) : null}
    </p>
  );
}
