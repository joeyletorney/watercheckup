'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MAIN_NAV_ITEMS = [
  { href: '/#wc-hero-anchor', label: 'Check My Water' },
  { href: '/#find-a-filter', label: 'Find a Filter' },
  { href: '/blog', label: 'Guides' },
  { href: '/about', label: 'About Joe' },
] as const;

export function SiteNav({ style, ariaLabel }: { style?: CSSProperties; ariaLabel?: string }) {
  const pathname = usePathname();
  return <nav aria-label={ariaLabel} className="wc-site-nav wc-simple-nav" style={style}>
    {MAIN_NAV_ITEMS.map(({ href, label }) => {
      const active = href === '/blog' ? pathname.startsWith('/blog') : href === '/about' ? pathname.startsWith('/about') : href === '/#find-a-filter' ? pathname === '/quiz' : pathname === '/';
      return <Link prefetch key={href} href={href} className="wc-site-nav-link" aria-current={active ? 'page' : undefined} style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', borderRadius: 8, color: active ? '#ecfeff' : '#bae6fd', fontWeight: active ? 800 : 600, fontSize: 14, textDecoration: 'none' }}>{label}</Link>;
    })}
  </nav>;
}
