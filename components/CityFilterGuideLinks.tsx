import type { CSSProperties } from 'react';
import Link from 'next/link';
import { cityFilterPagePath, hasCityFilterPage } from '@/lib/city-filter-pages';

const linkStyle: CSSProperties = {
  color: '#67e8f9',
  fontWeight: 600,
  textDecoration: 'none',
};

/** Internal links to the city filter guide plus lead + PFAS articles. */
export function CityFilterGuideLinks({ slug, name }: { slug?: string; name?: string } = {}) {
  const filterHref = slug && hasCityFilterPage(slug) ? cityFilterPagePath(slug) : null;
  return (
    <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 28px' }}>
      See{' '}
      {filterHref && name ? (
        <>
          the{' '}
          <Link prefetch href={filterHref} style={linkStyle}>
            best water filter for {name}
          </Link>
          ,{' '}
        </>
      ) : null}
      <Link prefetch href="/blog/best-water-filter-for-lead-removal" style={linkStyle}>
        best water filters for lead removal
      </Link>
      {', and '}
      <Link prefetch href="/blog/what-water-filter-removes-pfas" style={linkStyle}>
        what filters remove PFAS
      </Link>
      .
    </p>
  );
}
