'use client';

import { useState } from 'react';

type Props = {
  source: string;
  zip?: string;
  title?: string;
  description?: string;
  compact?: boolean;
  /** Use on light article panels (blog) */
  variant?: 'dark' | 'light';
};

export function NewsletterSignup({
  source,
  zip,
  title = 'Weekly water quality alerts',
  description = 'PFAS updates, violations, and score changes for your area — one email per week, no spam.',
  compact = false,
  variant = 'dark',
}: Props) {
  const light = variant === 'light';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (!email.includes('@') || sending) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          zip: zip?.trim() || undefined,
          weekly: true,
          source,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setErr(data.error || 'Could not subscribe. Try again.');
    } catch {
      setErr('Network error. Try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={light ? 'wc-newsletter-light' : undefined}
      style={{
        marginBottom: compact ? 28 : 40,
        padding: compact ? '16px 18px' : '22px 24px',
        background: light
          ? '#f0f9ff'
          : 'linear-gradient(135deg,rgba(8,145,178,0.12),rgba(7,24,40,0.9))',
        border: light ? '1px solid #7dd3fc' : '1px solid rgba(34,211,238,0.35)',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: light ? '#0369a1' : '#67e8f9',
          letterSpacing: 1.5,
          marginBottom: 8,
        }}
      >
        STAY INFORMED
      </div>
      <div
        className={light ? 'wc-newsletter-light__title' : undefined}
        style={{
          fontSize: compact ? 17 : 20,
          fontWeight: 800,
          color: light ? '#0f172a' : '#f1f5f9',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <p
        className={light ? 'wc-newsletter-light__desc' : undefined}
        style={{
          fontSize: 14,
          color: light ? '#475569' : '#cbd5e1',
          lineHeight: 1.6,
          margin: '0 0 22px',
        }}
      >
        {description}
      </p>
      {sent ? (
        <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>You&apos;re subscribed — watch for weekly updates.</div>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="your@email.com"
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              padding: '11px 14px',
              background: 'rgba(4,22,48,0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 9,
              color: '#f1f5f9',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={sending || !email.includes('@')}
            style={{
              padding: '11px 20px',
              background: email.includes('@') ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : 'rgba(14,34,51,0.8)',
              border: 'none',
              borderRadius: 9,
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              cursor: email.includes('@') ? 'pointer' : 'not-allowed',
            }}
          >
            {sending ? '…' : 'Subscribe free'}
          </button>
        </div>
      )}
      {err && <p style={{ fontSize: 13, color: '#fca5a5', marginTop: 10, marginBottom: 0 }}>{err}</p>}
      <p
        className={light ? 'wc-newsletter-light__fine' : undefined}
        style={{ fontSize: 12, color: light ? '#64748b' : '#64748b', marginTop: 12, marginBottom: 0 }}
      >
        Unsubscribe anytime.
      </p>
    </div>
  );
}
