'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS: [string, string][] = [
  ['/', 'Check my water'],
  ['/contaminants', 'Contaminant Guide'],
  ['/worst', 'Rankings'],
  ['/quiz', 'Filter guide'],
  ['/blog', 'Blog'],
  ['/well', 'Well water'],
  ['/methodology', 'Data sources'],
  ['/faq', 'FAQ'],
];

/** Inline on small screens; rest live under “More”. */
const MOBILE_PRIMARY: [string, string][] = [
  ['/', 'Check my water'],
  ['/contaminants', 'Contaminant Guide'],
  ['/worst', 'Rankings'],
  ['/quiz', 'Filter guide'],
];

const MQ = '(max-width: 767px)';

/** false until mount so SSR + first paint match (avoids hydration mismatch). */
function useNarrowNav() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return narrow;
}

function isActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href === '/blog' && pathname.startsWith('/blog')) ||
    (href === '/contaminants' && pathname.startsWith('/contaminants')) ||
    (href === '/well' && pathname.startsWith('/well')) ||
    (href === '/pfas' && pathname.startsWith('/pfas')) ||
    (href === '/lead' && pathname.startsWith('/lead')) ||
    (href === '/quiz' && pathname.startsWith('/quiz')) ||
    (href === '/methodology' && pathname.startsWith('/methodology')) ||
    (href === '/worst' && pathname.startsWith('/worst'))
  );
}

function navLinkStyle(active: boolean): CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: active ? 800 : 600,
    color: active ? '#ecfeff' : '#bae6fd',
    textDecoration: 'none',
    textShadow: active ? '0 0 18px rgba(103, 232, 249, 0.55), 0 0 32px rgba(34, 211, 238, 0.25)' : undefined,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  };
}

export function SiteNav({ style, ariaLabel }: { style?: CSSProperties; ariaLabel?: string }) {
  const pathname = usePathname();
  const narrow = useNarrowNav();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const moreItems = ITEMS.filter(([href]) => !MOBILE_PRIMARY.some(([h]) => h === href));

  if (!narrow) {
    return (
      <nav
        aria-label={ariaLabel}
        className="wc-site-nav wc-site-nav--wide"
        style={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          alignItems: 'center',
          ...style,
        }}
      >
        {ITEMS.map(([href, label]) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className="wc-site-nav-link"
              aria-current={active ? 'page' : undefined}
              style={navLinkStyle(active)}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="wc-site-nav wc-site-nav--narrow" style={{ width: '100%', minWidth: 0, ...style }}>
      <nav
        aria-label={ariaLabel}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          rowGap: 8,
        }}
      >
        {MOBILE_PRIMARY.map(([href, label]) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className="wc-site-nav-link"
              aria-current={active ? 'page' : undefined}
              style={navLinkStyle(active)}
            >
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          className="wc-site-nav-more"
          aria-expanded={moreOpen}
          aria-controls="wc-site-nav-more-panel"
          id="wc-site-nav-more-btn"
          onClick={() => setMoreOpen((o) => !o)}
        >
          {moreOpen ? 'Close' : 'More'}
        </button>
      </nav>
      {moreOpen ? (
        <div
          id="wc-site-nav-more-panel"
          role="region"
          aria-labelledby="wc-site-nav-more-btn"
          className="wc-site-nav-more-panel"
        >
          {moreItems.map(([href, label]) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className="wc-site-nav-link wc-site-nav-link--stacked"
                aria-current={active ? 'page' : undefined}
                style={navLinkStyle(active)}
                onClick={() => setMoreOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
