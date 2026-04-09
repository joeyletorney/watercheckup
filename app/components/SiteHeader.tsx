'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { SiteNav } from './SiteNav';

const CTA_STYLE: CSSProperties = {
  padding: '8px 18px',
  background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 13,
  fontWeight: 700,
  textDecoration: 'none',
};

function LogoWordmark({ height = 44 }: { height?: number }) {
  const w = Math.round((220 / 44) * height);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 44" width={w} height={height} aria-hidden>
      <defs>
        <linearGradient id="wc-sh-dg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="wc-sh-dh" cx="38%" cy="28%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path
        d="M20 2 C20 2 6 15 6 24 C6 31.7 12.3 38 20 38 C27.7 38 34 31.7 34 24 C34 15 20 2 20 2Z"
        fill="url(#wc-sh-dg)"
      />
      <path
        d="M20 2 C20 2 6 15 6 24 C6 31.7 12.3 38 20 38 C27.7 38 34 31.7 34 24 C34 15 20 2 20 2Z"
        fill="url(#wc-sh-dh)"
      />
      <polyline
        points="12,24 18,31 28,18"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="42" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#f1f5f9">
        Water
      </text>
      <text x="106" y="30" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="800" fill="#22d3ee">
        Checkup
      </text>
    </svg>
  );
}

export type SiteHeaderProps = {
  /** `bar`: full wordmark + optional trailing slot (home badges). `inner`: compact logo + optional CTA. */
  variant: 'bar' | 'inner';
  /** Right-side content (e.g. home certification buttons). Only used with `bar`. */
  trailing?: ReactNode;
  /** `marginLeft` etc. for `SiteNav` */
  navStyle?: CSSProperties;
  /** Show primary CTA on the right (blog / quiz / city pages). */
  showCta?: boolean;
  /** CTA label; default “Check My Water →”. */
  ctaLabel?: string;
  /** Extra styles on the inner variant row (e.g. solid background on 404). */
  innerBarStyle?: CSSProperties;
};

export function SiteHeader({ variant, trailing, navStyle, showCta, ctaLabel, innerBarStyle }: SiteHeaderProps) {
  if (variant === 'inner') {
    return (
      <div
        className="wc-site-header"
        style={{
          borderBottom: '1px solid #0f2336',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          ...innerBarStyle,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          >
            <LogoWordmark height={44} />
          </Link>
          <SiteNav />
        </div>
        {showCta ? (
          <Link href="/" style={CTA_STYLE}>
            {ctaLabel ?? 'Check My Water →'}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="wc-site-header"
      style={{
        borderBottom: '1px solid #0f2336',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <LogoWordmark />
      </Link>
      <SiteNav style={navStyle} />
      {trailing ? (
        <div className="wc-nav-badges" style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
