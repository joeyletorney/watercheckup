import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BADGE_COLORS: Record<string, string> = {
  PFAS: '#ef4444',
  Lead: '#f87171',
  'Filter Guide': '#0891b2',
  Health: '#f59e0b',
  Moving: '#22d3ee',
  Comparison: '#94a3b8',
  Well: '#a78bfa',
  Safety: '#22d3ee',
  'Hard Water': '#06b6d4',
  Nitrate: '#f59e0b',
  Radon: '#a78bfa',
  Fluoride: '#34d399',
  Arsenic: '#ef4444',
  Chloramine: '#22d3ee',
  Microplastics: '#06b6d4',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title   = searchParams.get('title')   || 'WaterCheckup Guide';
  const badge   = searchParams.get('badge')   || '';
  const excerpt = searchParams.get('excerpt') || '';

  const badgeColor = BADGE_COLORS[badge] || '#0891b2';

  // Truncate for display
  const displayTitle   = title.length   > 72 ? title.slice(0, 69)   + '…' : title;
  const displayExcerpt = excerpt.length > 110 ? excerpt.slice(0, 107) + '…' : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #040d14 0%, #071525 55%, #040d14 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 80px 48px',
          fontFamily: 'sans-serif',
          color: '#e2e8f0',
          position: 'relative',
        }}
      >
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -80, left: -60, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -60, width: 440, height: 440, borderRadius: '50%', background: `radial-gradient(circle, ${badgeColor}18 0%, transparent 68%)`, display: 'flex' }} />

        {/* Top: logo + FROM THE BLOG label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💧</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', display: 'flex' }}>
              <span style={{ color: '#f1f5f9' }}>Water</span>
              <span style={{ color: '#22d3ee' }}>Checkup</span>
            </div>
          </div>
          <div style={{ fontSize: 13, padding: '5px 14px', background: 'rgba(8,145,178,0.18)', border: '1px solid rgba(8,145,178,0.4)', borderRadius: 20, color: '#38bdf8', fontWeight: 700, display: 'flex' }}>
            EPA-SOURCED DATA
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <div style={{
              fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
              padding: '5px 14px', borderRadius: 6,
              background: `${badgeColor}22`,
              border: `1px solid ${badgeColor}55`,
              color: badgeColor,
              display: 'flex',
            }}>
              {badge.toUpperCase()}
            </div>
          </div>
        )}

        {/* Title */}
        <div style={{ fontSize: displayTitle.length > 50 ? 38 : 44, fontWeight: 900, color: '#ffffff', lineHeight: 1.15, marginBottom: 20, flex: 1, display: 'flex', alignItems: 'flex-start' }}>
          {displayTitle}
        </div>

        {/* Excerpt */}
        {displayExcerpt && (
          <div style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.55, marginBottom: 40, display: 'flex' }}>
            {displayExcerpt}
          </div>
        )}

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 14, color: '#64748b', display: 'flex', gap: 20 }}>
            <span style={{ display: 'flex' }}>📊 5 EPA databases</span>
            <span style={{ display: 'flex' }}>🔬 PFAS monitoring data</span>
            <span style={{ display: 'flex' }}>✅ Free, no account required</span>
          </div>
          <div style={{ fontSize: 14, color: '#0891b2', fontWeight: 700, display: 'flex' }}>watercheckup.com →</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
