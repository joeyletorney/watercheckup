'use client';

import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resolveWaterSearch } from '@/lib/water-search';
import { trackEvent } from '@/lib/track-event';

type Variant = 'hero' | 'compact';

export function WaterSearch({
  initialValue = '',
  initialError = '',
  variant = 'hero',
  autoFocusDesktop = false,
  idPrefix = 'wc-hero',
}: {
  initialValue?: string;
  initialError?: string;
  variant?: Variant;
  autoFocusDesktop?: boolean;
  idPrefix?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const ignoreAutofocusStart = useRef(false);
  const [error, setError] = useState(initialError);
  const [pending, startTransition] = useTransition();
  const inputId = `${idPrefix}-zip`;
  const hintId = `${idPrefix}-hint`;
  const errorId = `${idPrefix}-error`;
  const compact = variant === 'compact';

  useEffect(() => {
    if (!autoFocusDesktop) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    ignoreAutofocusStart.current = true;
    inputRef.current?.focus();
  }, [autoFocusDesktop]);

  function markFormStart() {
    if (ignoreAutofocusStart.current) {
      ignoreAutofocusStart.current = false;
      return;
    }
    if (started.current) return;
    started.current = true;
    trackEvent('form_start', {
      form_id: 'water_search',
      form_name: 'zip_search',
      form_destination: '/results',
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const match = resolveWaterSearch(String(new FormData(event.currentTarget).get('q') || ''));
    if (!match) {
      setError('Enter a 5-digit US ZIP code. City names work on a full keyboard if the ZIP is unknown.');
      trackEvent('water_search_invalid', { input_type: 'city_or_incomplete_zip' });
      inputRef.current?.focus();
      return;
    }
    setError('');
    try {
      sessionStorage.setItem('wc_water_search', JSON.stringify({ zip: match.zip, startedAt: Date.now() }));
    } catch {
      /* storage unavailable */
    }
    trackEvent('water_search_submitted', { input_type: match.inputType, transport_type: 'beacon' });
    startTransition(() => router.push(`/results/${match.zip}`));
  }

  return (
    <div className={compact ? 'wc-search-compact' : 'wc-search-hero-panel'}>
      <form action="/search" method="get" onSubmit={submit} aria-busy={pending}>
        <label className={compact ? 'wc-search-compact-label' : 'wc-search-hero-label'} htmlFor={inputId}>
          {compact ? 'Check your ZIP' : 'Enter your 5-digit ZIP'}
        </label>
        <div className={compact ? 'wc-search-compact-row' : 'wc-search-hero-row'}>
          <input
            ref={inputRef}
            id={inputId}
            name="q"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            enterKeyHint="search"
            className={compact ? 'wc-search-compact-input' : 'wc-search-input'}
            defaultValue={initialValue}
            required
            minLength={2}
            maxLength={80}
            onFocus={markFormStart}
            onInput={markFormStart}
            onChange={() => setError('')}
            aria-invalid={!!error}
            aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
            placeholder="5-digit ZIP"
          />
          <button
            type="submit"
            disabled={pending}
            className={compact ? 'wc-search-compact-submit' : 'wc-search-submit wc-hero-report-btn'}
          >
            {pending ? 'Looking up your water…' : compact ? 'Check ZIP' : 'See my water report'}
          </button>
        </div>
        {error ? (
          <p id={errorId} role="alert" className="wc-search-error">
            {error}
          </p>
        ) : null}
        <p id={hintId} className={compact ? 'wc-search-compact-hint' : 'wc-search-hint'}>
          {compact ? (
            'Free EPA supplier report. No signup.'
          ) : (
            <>
              Free public-supplier records for your ZIP — no signup. A city name works on a keyboard too.{' '}
              <Link href="/sample-report">See a sample report →</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
