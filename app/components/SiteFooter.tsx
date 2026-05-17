'use client';

import { SiteNav } from './SiteNav';
import { SITE_FOOTER_TAGLINE } from '@/lib/site-stats';

/** Same primary nav links as the header (`SiteNav`). */
export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid #0f2336',
        padding: '28px 24px 36px',
        background: 'transparent',
        boxShadow: '0 -1px 0 rgba(34, 211, 238, 0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <SiteNav
          ariaLabel="Footer"
          style={{
            justifyContent: 'center',
            gap: 6,
          }}
        />
        <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', textAlign: 'center', lineHeight: 1.65, maxWidth: 640, fontWeight: 500 }}>
          {SITE_FOOTER_TAGLINE}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 1.7 }}>
          <a href="/utilities/claim" style={{ color: '#67e8f9', fontWeight: 600, textDecoration: 'none' }}>
            For Water Utilities
          </a>
          {' · '}
          © {new Date().getFullYear()} WaterCheckup · Not affiliated with the EPA ·{' '}
          <a href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Joe Letorney</a>
          {' · '}
          <a href="/methodology" style={{ color: '#94a3b8', textDecoration: 'none' }}>Methodology</a>
          {' · '}
          <a href="/sitemap.xml" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sitemap</a>
          {' · '}
          <a href="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</a>
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 1.7, maxWidth: 680 }}>
          Water data is sourced from public EPA databases and may reflect reporting periods from the past 1–3 years due to federal reporting cycles. Always confirm critical results with a certified lab or your local utility.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 1.7, maxWidth: 680 }}>
          WaterCheckup is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Some links on this site are affiliate links — if you purchase a filter through one of our links, we may earn a small commission at no extra cost to you. This does not influence our recommendations.
        </p>
      </div>
    </footer>
  );
}
