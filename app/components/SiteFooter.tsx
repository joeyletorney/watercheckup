'use client';

import { SiteNav } from './SiteNav';

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
        <p style={{ margin: 0, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
          © {new Date().getFullYear()} WaterCheckup · EPA public data · Not affiliated with the EPA
        </p>
      </div>
    </footer>
  );
}
