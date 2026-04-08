'use client';
import { useState } from 'react';

export default function EmailCapture({ cityName, slug }: { cityName: string; slug: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit() {
    if (!email.includes('@')) { setMsg('Enter a valid email address.'); setStatus('error'); return; }
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: `city-page-${slug}` }),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setMsg(''); }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong. Try again.'); }
    } catch {
      setStatus('error'); setMsg('Something went wrong. Try again.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ marginBottom: 40, padding: '24px 24px', background: '#0a2a1a', border: '1px solid #0f6e40', borderRadius: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>You're in.</div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
          We'll email you when new PFAS or contamination data drops for {cityName}. Check your inbox for a welcome note.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 40, padding: '24px 24px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
        STAY INFORMED
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
        Get {cityName} water alerts
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.6 }}>
        We'll notify you when new PFAS data, EPA violations, or contamination alerts drop for {cityName}. One email, no spam, unsubscribe any time.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{
            flex: 1, minWidth: 200, padding: '11px 14px',
            background: '#071828', border: '1px solid #1a3a5c',
            borderRadius: 8, color: '#f1f5f9', fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={submit}
          disabled={status === 'loading'}
          style={{
            padding: '11px 22px', background: status === 'loading' ? '#0e6080' : '#0891b2',
            border: 'none', borderRadius: 8, color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? 'Sending...' : 'Notify me →'}
        </button>
      </div>
      {status === 'error' && msg && (
        <p style={{ fontSize: 12, color: '#f87171', margin: '8px 0 0' }}>{msg}</p>
      )}
    </div>
  );
}
