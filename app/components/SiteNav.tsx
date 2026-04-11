'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS: [string, string][] = [
  ['/', 'Home'],
  ['/contaminants', 'Contaminants'],
  ['/pfas', 'PFAS'],
  ['/lead', 'Lead'],
  ['/well', 'Well Water'],
  ['/faq', 'FAQ'],
  ['/blog', 'Blog'],
  ['/quiz', 'Filter Finder'],
];

export function SiteNav({ style, ariaLabel }: { style?: CSSProperties; ariaLabel?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        alignItems: 'center',
        ...style,
      }}
    >
      {ITEMS.map(([href, label]) => {
        const active =
          pathname === href ||
          (href === '/blog' && pathname.startsWith('/blog')) ||
          (href === '/contaminants' && pathname.startsWith('/contaminants')) ||
          (href === '/well' && pathname.startsWith('/well')) ||
          (href === '/pfas' && pathname.startsWith('/pfas')) ||
          (href === '/lead' && pathname.startsWith('/lead')) ||
          (href === '/quiz' && pathname.startsWith('/quiz'));
        return (
          <Link
            key={href}
            href={href}
            className="wc-site-nav-link"
            aria-current={active ? 'page' : undefined}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: active ? 800 : 600,
              color: active ? '#ecfeff' : '#bae6fd',
              textDecoration: 'none',
              textShadow: active ? '0 0 18px rgba(103, 232, 249, 0.55), 0 0 32px rgba(34, 211, 238, 0.25)' : undefined,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
