'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, #071828 0%, #04111e 100%)',
        color: '#e2e8f0',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: 'center',
          padding: '32px 28px',
          borderRadius: 14,
          border: '1px solid rgba(34, 211, 238, 0.25)',
          background: 'rgba(4, 18, 38, 0.85)',
          boxShadow: '0 24px 48px rgba(0,4,18,0.5)',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px', color: '#f1f5f9' }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 22px' }}>
          A client error stopped this page from loading. You can try again or return home.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
