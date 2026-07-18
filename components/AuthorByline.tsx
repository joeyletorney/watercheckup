import Link from 'next/link';
import { AUTHOR_FORMER_WQA_CREDENTIAL } from '@/lib/site-stats';

/**
 * Drop this near the top of every city page, right under the H1.
 * Usage: <AuthorByline />
 */
export function AuthorByline() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 1.6,
        margin: '0 0 18px',
        paddingLeft: 12,
        borderLeft: '2px solid #0891b2',
      }}
    >
      <span>
        Reviewed by <strong style={{ color: '#e2e8f0' }}>Joe Letorney</strong>, 30-year water treatment
        expert · {AUTHOR_FORMER_WQA_CREDENTIAL}.
      </span>
      <Link
        prefetch
        href="/about"
        style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}
      >
        Full bio →
      </Link>
    </div>
  );
}

export default AuthorByline;
