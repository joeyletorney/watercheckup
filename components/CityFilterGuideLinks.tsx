import type { CSSProperties } from 'react';
import Link from 'next/link';

const linkStyle: CSSProperties = {
  color: '#67e8f9',
  fontWeight: 600,
  textDecoration: 'none',
};

/** Internal links to lead + PFAS filter guides — priority city pages */
export function CityFilterGuideLinks() {
  return (
    <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 28px' }}>
      See{' '}
      <Link href="/blog/best-water-filter-for-lead-removal" style={linkStyle}>
        best water filters for lead removal
      </Link>{' '}
      and{' '}
      <Link href="/blog/what-water-filter-removes-pfas" style={linkStyle}>
        what filters remove PFAS
      </Link>
      .
    </p>
  );
}
