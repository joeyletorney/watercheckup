'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS } from '@/lib/footer-links';
import {
  SITE_FOOTER_AFFILIATE,
  SITE_FOOTER_DISCLAIMER,
  SITE_FOOTER_SCORE_DISCLAIMER,
  SITE_FOOTER_TAGLINE,
} from '@/lib/site-stats';

const linkStyle: CSSProperties = {
  fontSize: 14,
  color: '#94a3b8',
  textDecoration: 'none',
  lineHeight: 1.5,
  display: 'inline-block',
};

const viewAllStyle: CSSProperties = {
  ...linkStyle,
  fontWeight: 700,
  color: '#67e8f9',
  marginTop: 4,
};

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      className="wc-site-footer"
      style={{
        borderTop: '1px solid #0f2336',
        padding: '36px 24px 40px',
        background: 'transparent',
        boxShadow: '0 -1px 0 rgba(34, 211, 238, 0.06)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="wc-footer-columns">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="wc-footer-col">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#e2e8f0',
                  letterSpacing: 0.3,
                  marginBottom: 14,
                }}
              >
                {col.title}
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.href}-${link.label}`}>
                    <Link href={link.href} style={linkStyle} className="wc-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {col.viewAll ? (
                  <li>
                    <Link href={col.viewAll.href} style={viewAllStyle} className="wc-footer-link">
                      {col.viewAll.label} →
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: '32px 0 0',
            fontSize: 14,
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.65,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontWeight: 500,
          }}
        >
          {SITE_FOOTER_TAGLINE}
        </p>

        <p
          style={{
            margin: '16px 0 0',
            fontSize: 14,
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.8,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '4px 0',
          }}
        >
          <span>© {new Date().getFullYear()} WaterCheckup · Not affiliated with the EPA · </span>
          {FOOTER_LEGAL_LINKS.map((link, i) => (
            <span key={link.href}>
              {i > 0 ? ' · ' : null}
              <Link href={link.href} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}>
                {link.label}
              </Link>
            </span>
          ))}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            maxWidth: 640,
            margin: '20px auto 0',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: 'var(--wc-text-faint)', textAlign: 'center', lineHeight: 1.55 }}>
            {SITE_FOOTER_DISCLAIMER}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--wc-text-faint)', textAlign: 'center', lineHeight: 1.55 }}>
            {SITE_FOOTER_SCORE_DISCLAIMER}{' '}
            <Link href="/methodology" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
              Methodology
            </Link>
            .
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--wc-text-faint)', textAlign: 'center', lineHeight: 1.55 }}>
            Confirm with your utility’s Consumer Confidence Report or a certified lab test before major decisions.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--wc-text-faint)', textAlign: 'center', lineHeight: 1.55 }}>
            {SITE_FOOTER_AFFILIATE}
          </p>
        </div>
      </div>
    </footer>
  );
}
