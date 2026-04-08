'use client';
import Link from 'next/link';

declare global { interface Window { gtag?: (...args: any[]) => void } }

type Pick = { label: string; product: string; reason: string; link: string; amazon: string };

function trackClick(product: string, destination: string, city: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', { product, destination, city, page: 'city' });
  }
}

export default function TopPickBox({ pick, cityName }: { pick: Pick; cityName: string }) {
  return (
    <div style={{ marginBottom: 32, padding: '20px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
        TOP PICK FOR {cityName.toUpperCase()}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>⚠ {pick.label}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>{pick.product}</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>{pick.reason}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <a
            href={pick.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(pick.product, 'waterdrop', cityName)}
            style={{ display: 'block', padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            Get on Waterdrop →
          </a>
          <a
            href={pick.amazon}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(pick.product, 'amazon', cityName)}
            style={{ display: 'block', padding: '10px 20px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center', border: '1px solid #1a3a5c', whiteSpace: 'nowrap' }}
          >
            See on Amazon →
          </a>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #0f2336', fontSize: 12, color: '#1e3a5f' }}>
        Not sure which filter is right for you?{' '}
        <Link href="/quiz" style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 700 }}>
          Take the 3-question quiz →
        </Link>
      </div>
    </div>
  );
}
