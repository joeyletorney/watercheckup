import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from './components/SiteNav';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: 'inherit' }}>
      <div
        style={{
          borderBottom: '1px solid #0f2336',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          background: '#091825',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              💧
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
          </Link>
          <SiteNav />
        </div>
        <Link
          href="/"
          style={{
            padding: '8px 18px',
            background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Check My Water →
        </Link>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', marginBottom: 16, lineHeight: 1.2 }}>
          This page drifted downstream
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
          The link may be outdated or the URL was mistyped. Use the navigation above or head home to check your water
          by ZIP code.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
            borderRadius: 10,
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 20px #0891b244',
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
