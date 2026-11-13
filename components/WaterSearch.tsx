'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resolveWaterSearch } from '@/lib/water-search';

export function WaterSearch({ initialValue = '', initialError = '' }: { initialValue?: string; initialError?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(initialError);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const match = resolveWaterSearch(String(new FormData(event.currentTarget).get('q') || ''));
    if (!match) {
      setError('City not found. Enter your 5-digit ZIP code to find your supplier’s records.');
      window.gtag?.('event', 'water_search_invalid', { input_type: 'city_or_incomplete_zip' });
      inputRef.current?.focus();
      return;
    }
    setError('');
    try { sessionStorage.setItem('wc_water_search', JSON.stringify({ zip: match.zip, startedAt: Date.now() })); } catch { /* storage unavailable */ }
    window.gtag?.('event', 'water_search_submitted', { input_type: match.inputType });
    startTransition(() => router.push(`/results/${match.zip}`));
  }

  return <div className="wc-search-hero-panel" style={{ marginTop: 28 }}>
    <form action="/search" method="get" onSubmit={submit} aria-busy={pending}>
      <label className="wc-search-hero-label" htmlFor="wc-hero-zip">ENTER YOUR ZIP OR CITY</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560, margin: '0 auto' }}>
        <input ref={inputRef} id="wc-hero-zip" name="q" type="search" className="wc-search-input" defaultValue={initialValue} required minLength={2} maxLength={80}
          onChange={() => setError('')} aria-invalid={!!error} aria-describedby={`wc-search-hint${error ? ' wc-search-error' : ''}`} enterKeyHint="search"
          placeholder="ZIP code or city name" autoComplete="postal-code" style={{ width: '100%', maxWidth: 'none' }} />
        {error && <p id="wc-search-error" role="alert" style={{ color: '#fde68a', margin: 0, lineHeight: 1.6 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="submit" disabled={pending} className="wc-search-submit wc-hero-report-btn" style={{ padding: '18px 32px', minHeight: 58, borderRadius: 14, fontSize: 16, fontWeight: 800, letterSpacing: 0.5, color: '#fbbf24', WebkitTextFillColor: '#fbbf24', flex: '1 1 200px' }}>
            {pending ? 'Looking up your water…' : 'See my water report'}
          </button>
          <Link href="/quiz" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', minHeight: 44, borderRadius: 14, fontSize: 15, fontWeight: 700, border: '1px solid rgba(103,232,249,0.45)', color: '#67e8f9', textDecoration: 'none' }}>Help me choose a filter →</Link>
        </div>
      </div>
      <p id="wc-search-hint" style={{ textAlign: 'center', fontSize: 13, color: '#a8b4c4', lineHeight: 1.6, margin: '12px 0 0' }}>City searches use a representative ZIP. Supplier records are not a test of your tap. <Link href="/sample-report" style={{ color: '#67e8f9' }}>See a sample report →</Link></p>
    </form>
  </div>;
}
