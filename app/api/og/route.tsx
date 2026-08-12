import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { checkRateLimitShared, getClientIp, RATE } from '@/lib/rate-limit';

// export const runtime = 'edge';

const imageHeaders = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
};

function getTextParam(searchParams: URLSearchParams, key: string, fallback: string, maxLength: number) {
  const value = searchParams.get(key)?.trim() || fallback;
  return value.slice(0, maxLength);
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const lim = await checkRateLimitShared(`og:ip:${ip}`, RATE.ogPerIp.max, RATE.ogPerIp.windowMs);
    if (!lim.ok) {
      return new Response('Too many OG requests', {
        status: 429,
        headers: {
          'Retry-After': String(lim.retryAfterSec),
          'Cache-Control': 'no-store',
        },
      });
    }

    const { searchParams } = new URL(req.url);
    const city       = getTextParam(searchParams, 'city', 'Your City', 80);
    const score      = getTextParam(searchParams, 'score', '--', 4);
    const grade      = getTextParam(searchParams, 'grade', '--', 3);
    const violations = getTextParam(searchParams, 'violations', '0', 4);
    const pwsid      = getTextParam(searchParams, 'pwsid', '', 16);

    const scoreNum   = parseInt(score, 10) || 0;
    const scoreColor = scoreNum >= 80 ? '#22d3ee' : scoreNum >= 65 ? '#f59e0b' : '#ef4444';
    const violNum    = parseInt(violations, 10) || 0;
    const scoreGlow =
      scoreNum >= 80
        ? 'rgba(34,211,238,0.12)'
        : scoreNum >= 65
          ? 'rgba(245,158,11,0.12)'
          : 'rgba(239,68,68,0.12)';
    const violBorder = violNum > 0 ? 'rgba(245,158,11,0.27)' : 'rgba(34,211,238,0.27)';

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: 'linear-gradient(135deg, #040d14 0%, #071525 60%, #040d14 100%)',
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 80px',
            fontFamily: 'sans-serif',
            color: '#e2e8f0',
            position: 'relative',
          }}
        >
          {/* Background glows */}
          <div style={{
            position: 'absolute', top: -100, left: -100,
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)',
            display: 'flex',
          }} />
          <div style={{
            position: 'absolute', bottom: -120, right: -80,
            width: 480, height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 68%)',
            display: 'flex',
          }} />

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 96 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: 'white',
            }}>W</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#f1f5f9' }}>Water</span><span style={{ color: '#22d3ee' }}>Checkup</span>
            </div>
            <div style={{
              marginLeft: 16, fontSize: 14, padding: '4px 12px',
              background: 'rgba(8,145,178,0.2)', border: '1px solid rgba(8,145,178,0.4)',
              borderRadius: 20, color: '#38bdf8', fontWeight: 700,
              display: 'flex',
            }}>EPA-SOURCED DATA</div>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', gap: 64, flex: 1, alignItems: 'center' }}>

            {/* Score circle */}
            <div style={{
              width: 220, height: 220, borderRadius: '50%',
              border: `8px solid ${scoreColor}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: `radial-gradient(circle, ${scoreGlow} 0%, transparent 70%)`,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 88, fontWeight: 900, color: scoreColor, lineHeight: 1, display: 'flex' }}>{score}</div>
              <div style={{ fontSize: 24, color: '#cbd5e1', marginTop: 4, display: 'flex' }}>Grade: {grade}</div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 54, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.05, display: 'flex' }}>{city}</div>
              <div style={{ fontSize: 24, color: '#a8b4c4', marginBottom: 8, display: 'flex' }}>Water Quality Report — EPA SDWIS · UCMR5 · EWG</div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  background: '#0d2240', border: `1px solid ${violBorder}`,
                  borderRadius: 12, padding: '14px 22px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: violNum > 0 ? '#f59e0b' : '#22d3ee', display: 'flex' }}>{violations}</div>
                  <div style={{ fontSize: 16, color: '#94a3b8', display: 'flex' }}>Violations</div>
                </div>
                {pwsid ? (
                  <div style={{
                    background: '#0d2240', border: '1px solid rgba(34,211,238,0.13)',
                    borderRadius: 12, padding: '14px 22px', display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#22d3ee', display: 'flex' }}>{pwsid}</div>
                    <div style={{ fontSize: 16, color: '#94a3b8', display: 'flex' }}>EPA PWSID</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Bottom wave accent */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 36,
              background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.08) 45%, rgba(8,145,178,0.14) 100%)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 28,
              height: 3,
              background: 'linear-gradient(90deg, transparent 5%, rgba(34,211,238,0.35) 50%, transparent 95%)',
              display: 'flex',
            }}
          />

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 36, paddingTop: 20,
            borderTop: '1px solid rgba(30,58,92,0.8)',
            position: 'relative',
          }}>
            <div style={{ fontSize: 18, color: '#94a3b8', display: 'flex' }}>Free water quality reports at</div>
            <div style={{ fontSize: 22, color: '#22d3ee', fontWeight: 700, display: 'flex' }}>watercheckup.com</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, headers: imageHeaders }
    );
  } catch (err) {
    console.error('[api/og]', err instanceof Error ? err.message : err);
    return new Response('OG image unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
