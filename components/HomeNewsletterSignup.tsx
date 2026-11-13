'use client';

import { useState, type FormEvent } from 'react';

export function HomeNewsletterSignup() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const email = String(new FormData(event.currentTarget).get('email') || '').trim();
    setSending(true);
    setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('/api/newsletter/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'weekly-newsletter' }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(response.status === 429 ? 'Too many signup attempts. Please wait a minute and try again.' : 'Could not subscribe. Please try again shortly.');
        return;
      }
      setSent(true);
      window.gtag?.('event', 'newsletter_signup', { source: 'weekly-newsletter', method: 'newsletter_form' });
    } catch {
      setError(controller.signal.aborted ? 'This request took too long. Please try again shortly.' : 'Could not subscribe. Please check your connection and try again.');
    } finally {
      clearTimeout(timeout);
      setSending(false);
    }
  }

  return <section aria-labelledby="wc-home-newsletter-heading" className="wc-home-newsletter">
    <p className="wc-home-section-eyebrow">STAY INFORMED</p>
    <h2 id="wc-home-newsletter-heading">Weekly water treatment newsletter</h2>
    <p>Practical guidance on water testing, filtration, and maintenance. One general email per week; this does not monitor local emergencies. Unsubscribe anytime.</p>
    <noscript><style>{'.wc-home-newsletter form { display:none; }'}</style><p>Enable JavaScript to subscribe to the newsletter. Water report searches work without it.</p></noscript>
    {sent ? <p role="status" style={{ color: '#86efac', fontWeight: 700 }}>✓ You’re on the list — we’ll send weekly water updates.</p> : <form action="/api/newsletter/subscribe" method="post" onSubmit={submit} aria-busy={sending}>
      <label htmlFor="wc-newsletter-email" className="sr-only">Email address for the weekly newsletter</label>
      <input id="wc-newsletter-email" name="email" type="email" required autoComplete="email" placeholder="your@email.com" disabled={sending} />
      <button type="submit" disabled={sending}>{sending ? 'Subscribing…' : 'Subscribe Free'}</button>
    </form>}
    {error && <p role="alert" style={{ color: '#fca5a5' }}>{error}</p>}
    <p className="wc-home-newsletter-note">No spam. Unsubscribe anytime.</p>
  </section>;
}
