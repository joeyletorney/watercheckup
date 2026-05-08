'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRevealOnScroll } from './useRevealOnScroll';

type EpaStats = {
  ucmrSystemsWithSamples: number;
  ucmrSnapshotLabel: string;
  sdwisLiveNote: string;
  sdwisEndpointReachable: boolean;
  sdwisLatencyMs: number | null;
  generatedAt: string;
  links: { sdwis: string; ucmrData: string; ccr: string };
};

/** Illustrative PFAS / monitoring hotspots — animated for overview only (not your ZIP). */
function ContaminationMapVisual() {
  return (
    <div className="wc-showcase-map-inner">
      <svg className="wc-showcase-map-svg" viewBox="0 0 320 200" role="img" aria-label="Stylized U.S. map with illustrative monitoring hotspots">
        <defs>
          <linearGradient id="wcMapSea" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="wcHot1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wcHot2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wcHot3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <filter id="wcMapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Abstract lower-48 silhouette */}
        <path
          fill="url(#wcMapSea)"
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1"
          d="M28 165 L42 52 L78 38 L118 48 L152 32 L188 36 L218 28 L258 44 L292 58 L298 88 L286 118 L272 142 L248 168 L210 178 L168 172 L128 178 L88 172 Z"
        />

        {/* Drift overlay — contamination “weather” */}
        <path className="wc-map-drift-a" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="14" strokeLinecap="round" d="M48 120 Q120 90 200 100 T288 78" />
        <path className="wc-map-drift-b" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="10" strokeLinecap="round" d="M38 88 Q140 108 220 72 T300 96" />

        {/* Hotspots */}
        {[
          { x: 112, y: 72, g: 'url(#wcHot1)', delay: '0s' },
          { x: 188, y: 96, g: 'url(#wcHot2)', delay: '0.7s' },
          { x: 236, y: 118, g: 'url(#wcHot3)', delay: '1.4s' },
          { x: 152, y: 124, g: 'url(#wcHot1)', delay: '2.1s' },
        ].map((h, i) => (
          <g key={i} filter="url(#wcMapGlow)">
            <circle className="wc-map-pulse" cx={h.x} cy={h.y} r="26" fill={h.g} style={{ animationDelay: h.delay }} />
            <circle cx={h.x} cy={h.y} r="4" fill="#fef3c7" opacity="0.95" />
          </g>
        ))}
      </svg>
      <p className="wc-showcase-map-caption">
        Illustrative monitoring intensity · Federal UCMR / SDWIS coverage varies by system
      </p>
    </div>
  );
}

function BeforeAfterVisual() {
  const barsLeft = [
    { label: 'PFAS', w: 78, c: '#f59e0b' },
    { label: 'Lead risk', w: 52, c: '#eab308' },
    { label: 'DBPs', w: 64, c: '#94a3b8' },
    { label: 'Chloramine', w: 58, c: '#64748b' },
  ];

  return (
    <div className="wc-before-after">
      <div className="wc-before-after-col">
        <span className="wc-before-after-label">Tap (typical concerns)</span>
        <div className="wc-before-after-bars">
          {barsLeft.map((b) => (
            <div key={b.label} className="wc-before-after-row">
              <span>{b.label}</span>
              <div className="wc-before-after-track">
                <div className="wc-before-after-fill wc-before-after-fill--tap" style={{ width: `${b.w}%`, background: b.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wc-before-after-arrow" aria-hidden>
        →
      </div>
      <div className="wc-before-after-col wc-before-after-col--after">
        <span className="wc-before-after-label">After NSF / WQA-certified filtration</span>
        <div className="wc-before-after-bars">
          <div className="wc-before-after-row">
            <span>Target contaminants</span>
            <div className="wc-before-after-track">
              <div className="wc-before-after-fill wc-before-after-fill--filtered" style={{ width: '92%' }} />
            </div>
          </div>
          <p className="wc-before-after-foot">
            Relative reduction for certified systems — your report shows picks matched to what tests found.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeVisualShowcase() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  const [stats, setStats] = useState<EpaStats | null>(null);

  useEffect(() => {
    fetch('/api/epa-stats')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <section
      ref={ref}
      className={`wc-showcase-section ${visible ? 'wc-showcase-visible' : ''}`}
      aria-labelledby="wc-showcase-heading"
    >
      <div className="wc-showcase-intro">
        <h2 id="wc-showcase-heading" className="wc-showcase-h2">
          Live federal data — clear visuals
        </h2>
        <p className="wc-showcase-lede">
          Explore how we combine EPA Safe Drinking Water records with health context. Enter your ZIP above for{' '}
          <strong>your</strong> water score and contaminant list.
        </p>
      </div>

      <div className="wc-showcase-grid">
        <article className="wc-showcase-card wc-showcase-card--map">
          <div className="wc-showcase-card-head">
            <span className="wc-showcase-kicker">Coverage</span>
            <h3 className="wc-showcase-card-title">Animated contamination map</h3>
          </div>
          <ContaminationMapVisual />
        </article>

        <article className="wc-showcase-card">
          <div className="wc-showcase-card-head">
            <span className="wc-showcase-kicker">EPA SDWIS</span>
            <h3 className="wc-showcase-card-title">Live data endpoint</h3>
          </div>
          <div className="wc-epa-widget-body">
            <div className={`wc-epa-pill ${stats?.sdwisEndpointReachable ? 'wc-epa-pill--ok' : 'wc-epa-pill--pending'}`}>
              <span className="wc-epa-dot" />
              {stats?.sdwisEndpointReachable ? 'SDWIS reachable' : 'Checking…'}
            </div>
            {stats?.sdwisLatencyMs != null && (
              <p className="wc-epa-meta">{stats.sdwisLatencyMs} ms · violations &amp; samples load with your report</p>
            )}
            <p className="wc-epa-note">{stats?.sdwisLiveNote ?? 'Violations and lead samples load live from EPA Envirofacts when you run a ZIP.'}</p>
            <a className="wc-epa-link" href={stats?.links.sdwis ?? 'https://www.epa.gov/dwsdwa'} target="_blank" rel="noreferrer">
              EPA SDWIS program →
            </a>
          </div>
        </article>

        <article className="wc-showcase-card">
          <div className="wc-showcase-card-head">
            <span className="wc-showcase-kicker">{stats ? `UCMR · ${stats.ucmrSnapshotLabel}` : 'UCMR snapshot'}</span>
            <h3 className="wc-showcase-card-title">PFAS monitoring snapshot</h3>
          </div>
          <div className="wc-epa-widget-body">
            <div className="wc-epa-big-num">
              {stats ? stats.ucmrSystemsWithSamples.toLocaleString() : '—'}
            </div>
            <p className="wc-epa-meta">Public water systems represented in our federal PFAS test snapshot</p>
            <a className="wc-epa-link" href={stats?.links.ucmrData ?? 'https://www.epa.gov/dwucmr'} target="_blank" rel="noreferrer">
              EPA UCMR occurrence data →
            </a>
          </div>
        </article>

        <article className="wc-showcase-card">
          <div className="wc-showcase-card-head">
            <span className="wc-showcase-kicker">Your report</span>
            <h3 className="wc-showcase-card-title">Your water score</h3>
          </div>
          <div className="wc-epa-widget-body">
            <p className="wc-score-explainer">
              We translate violations, PFAS detections, metals, and disinfection byproducts into one <strong>0–88</strong> score (letter grade included).
              The hero preview animates a sample — your ZIP produces the real number.
            </p>
            <Link href="/methodology" className="wc-epa-link">
              How the score works →
            </Link>
          </div>
        </article>

        <article className="wc-showcase-card wc-showcase-card--wide">
          <div className="wc-showcase-card-head">
            <span className="wc-showcase-kicker">Protection</span>
            <h3 className="wc-showcase-card-title">Before / after filtration</h3>
          </div>
          <BeforeAfterVisual />
        </article>
      </div>

      {stats?.generatedAt && (
        <p className="wc-showcase-foot">
          Widgets refreshed from server · SDWIS ping cached ~1h · UCMR label: {stats.ucmrSnapshotLabel}
        </p>
      )}
    </section>
  );
}
