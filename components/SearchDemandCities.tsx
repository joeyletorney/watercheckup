import Link from 'next/link';
import { SEARCH_DEMAND_CITIES, SEARCH_DEMAND_EXTRA_LINKS } from '@/lib/search-demand-cities';
import { CITIES } from '@/app/water/[city]/cities-data';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { computeCityWaterScore } from '@/lib/city-water-score';

type Props = {
  title?: string;
  compact?: boolean;
};

/** Internal links for cities that already earn Search Console impressions */
export function SearchDemandCities({ title = 'Popular water quality reports', compact = false }: Props) {
  return (
    <div
      style={{
        marginBottom: compact ? 48 : 64,
        padding: compact ? '16px 18px' : '20px 22px',
        background: 'linear-gradient(165deg, rgba(8,145,178,0.12), rgba(7,24,40,0.85))',
        border: '1px solid rgba(34,211,238,0.35)',
        borderRadius: 14,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: '#67e8f9', letterSpacing: 1.5, marginBottom: 10 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {SEARCH_DEMAND_CITIES.map((c) => {
          const cd = CITIES[c.slug];
          const pfas = cd ? getCityPfasData(resolveCityPwsid(c.slug, cd.pwsid, cd.zip)) : null;
          const ws = cd ? computeCityWaterScore(cd, pfas) : null;
          return (
            <Link
              key={c.slug}
              prefetch href={c.href}
              style={{
                display: 'block',
                padding: '14px 16px',
                background: '#071828',
                border: '1px solid #1a3a5c',
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
                {c.name}, {c.state}
              </div>
              {ws && (
                <div style={{ fontSize: 13, fontWeight: 700, color: ws.gradeColor, marginBottom: 6 }}>
                  Grade {ws.grade} · {ws.score}/88
                </div>
              )}
              <div style={{ fontSize: 13, color: '#a8b4c4', lineHeight: 1.5, marginBottom: 8 }}>{c.stat}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.queryHooks.join(' · ')}</div>
              <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, marginTop: 10 }}>Free full report →</div>
            </Link>
          );
        })}
      </div>
      {!compact && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {SEARCH_DEMAND_EXTRA_LINKS.map((l) => (
            <Link
              key={l.href}
              prefetch href={l.href}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#cbd5e1',
                textDecoration: 'none',
                padding: '6px 10px',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 8,
              }}
            >
              {l.label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
