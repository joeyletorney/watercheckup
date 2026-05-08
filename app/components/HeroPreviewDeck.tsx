'use client';

/**
 * Lightweight hero visuals — preview of score ring, contaminant focus, and US coverage hint.
 * Decorative only (not live user data).
 */
export function HeroPreviewDeck() {
  const pct = 72 / 88;
  const deg = pct * 360;

  return (
    <div aria-hidden className="wc-hero-preview-deck">
      <div className="wc-hero-preview-scorecard">
        <div
          className="wc-hero-preview-ring"
          style={{ background: `conic-gradient(#22d3ee ${deg}deg, rgba(26,58,92,0.9) 0)` }}
        >
          <div className="wc-hero-preview-ring-inner">
            <span>72</span>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#64748b', marginBottom: 4 }}>
            LIVE SCORE PREVIEW
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.35 }}>
            Animated safety score — max <span style={{ color: '#22d3ee' }}>88</span> on our scale
          </div>
        </div>
      </div>

      <div className="wc-hero-preview-chips">
        {(['PFAS', 'Lead', 'DBPs', 'Nitrate'] as const).map((label, i) => (
          <span
            key={label}
            className={`wc-hero-preview-chip ${i === 0 ? 'wc-hero-preview-chip--accent' : ''}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="wc-hero-preview-mapbox">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#475569', marginBottom: 8 }}>
          COVERAGE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden style={{ flexShrink: 0 }}>
            <path
              d="M8 38 L18 12 L35 8 L52 14 L68 10 L78 22 L72 38 L58 44 L38 42 Z"
              stroke="rgba(34,211,238,0.45)"
              strokeWidth="1.2"
              fill="rgba(8,145,178,0.12)"
            />
            <circle className="wc-hero-map-dot" cx="22" cy="28" r="2.5" fill="#22d3ee" />
            <circle className="wc-hero-map-dot" cx="44" cy="22" r="2.5" fill="#22d3ee" style={{ animationDelay: '0.4s' }} />
            <circle className="wc-hero-map-dot" cx="62" cy="30" r="2.5" fill="#22d3ee" style={{ animationDelay: '0.8s' }} />
          </svg>
          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
            ZIP-level EPA match · violations · PFAS monitoring · lead sampling context
          </p>
        </div>
      </div>
    </div>
  );
}
