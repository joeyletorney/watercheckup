import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import type { CityRecord } from '@/lib/cities';
import { internalSdwisPath } from '@/lib/epa-data';

export type CityWaterReportProps = {
  stateSlug: string;
  citySlug: string;
  city: CityRecord;
  sdwisUrl: string;
};

const urgencyStyle: Record<CityRecord['urgency'], { label: string; color: string; bg: string; border: string }> = {
  high: { label: 'Higher concern', color: '#fca5a5', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' },
  medium: { label: 'Monitor', color: '#fcd34d', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  low: { label: 'Generally lower concern', color: '#67e8f9', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.35)' },
};

export function CityWaterReport({ stateSlug, citySlug, city, sdwisUrl }: CityWaterReportProps) {
  const u = urgencyStyle[city.urgency];
  const stateHub = `/water/state/${stateSlug}`;

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/water" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Cities
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={stateHub} style={{ color: '#0891b2', textDecoration: 'none' }}>
            {city.state}
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#94a3b8' }}>{city.name}</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          CITY WATER SUMMARY
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.15, margin: '0 0 12px' }}>
          {city.name}, {city.state} — tap water snapshot
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 20px' }}>
          Quick read on your utility, EPA public system ID, and documented issues. For full PFAS tables, scores, and
          filter logic, open the detailed city report.
        </p>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: u.bg,
            border: `1px solid ${u.border}`,
            marginBottom: 22,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: u.color, letterSpacing: 1.2 }}>{u.label}</span>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#e2e8f0', lineHeight: 1.55 }}>
            {city.issues[0] ?? 'Review EPA and local data for your address.'}
          </p>
        </div>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>Utility</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.65 }}>
            <strong style={{ color: '#e2e8f0' }}>{city.system}</strong>
            <br />
            <span style={{ color: '#64748b', fontSize: 13 }}>PWSID {city.pwsid}</span>
          </p>
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>Issues we flag</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            {city.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>Context</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.65 }}>
            {city.facts.slice(0, 4).map((fact) => (
              <li key={fact.slice(0, 48)}>{fact}</li>
            ))}
          </ul>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link
            href={`/water/${citySlug}`}
            style={{
              display: 'inline-block',
              textAlign: 'center',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              color: '#0f172a',
              background: 'linear-gradient(135deg,#22d3ee,#06b6d4)',
              textDecoration: 'none',
            }}
          >
            Full {city.name} report (filters &amp; charts) →
          </Link>
          <a
            href={sdwisUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              textAlign: 'center',
              padding: '12px 18px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              color: '#e2e8f0',
              border: '1px solid rgba(100,116,139,0.45)',
              background: 'rgba(15,23,42,0.6)',
              textDecoration: 'none',
            }}
          >
            EPA SDWIS federal record (new tab) →
          </a>
          <Link href={internalSdwisPath(city.pwsid)} style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
            Open framed SDWIS link on WaterCheckup
          </Link>
        </div>
      </div>
    </div>
  );
}
