'use client';

import Link from 'next/link';

/**
 * Embeds an EPA tool in-page so the address bar stays on WaterCheckup.
 * EPA may send headers that block framing — if the iframe is blank, users use "Open EPA directly".
 */
export function EpaIframeShell({
  src,
  title,
  subtitle,
  backHref,
  backLabel,
}: {
  src: string;
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #0f2336', flexShrink: 0, maxWidth: 960, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Link href={backHref} style={{ fontSize: 13, color: '#22d3ee', fontWeight: 600, textDecoration: 'none' }}>
          {backLabel}
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '12px 0 6px', lineHeight: 1.25 }}>{title}</h1>
        {subtitle ? (
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.55 }}>{subtitle}</p>
        ) : null}
        <p style={{ fontSize: 12, color: '#64748b', margin: '12px 0 0', lineHeight: 1.5 }}>
          You are still on WaterCheckup; EPA&apos;s site loads in the frame below. If it stays blank, federal policy may block embedding —{' '}
          <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', fontWeight: 600 }}>
            open this tool on EPA.gov ↗
          </a>
        </p>
      </div>
      <iframe
        src={src}
        title={title}
        style={{
          flex: 1,
          width: '100%',
          minHeight: 560,
          border: 'none',
          background: '#f8fafc',
        }}
      />
    </div>
  );
}
