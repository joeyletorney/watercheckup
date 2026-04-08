'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS: [string, string][] = [
  ['/', 'Home'],
  ['/contaminants', 'Contaminants'],
  ['/faq', 'FAQ'],
  ['/blog', 'Blog'],
];

export function SiteNav({ style }: { style?: CSSProperties }) {
  const pathname = usePathname();
  return (
    <nav
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
          (href === '/contaminants' && pathname.startsWith('/contaminants'));
        return (
          <Link
            key={href}
            href={href}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? '#22d3ee' : '#94a3b8',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
