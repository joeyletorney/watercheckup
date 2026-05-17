'use client';

import type { CSSProperties, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { USPS_STATE_OPTIONS } from '@/lib/us-state-names';

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#071828',
  border: '1px solid #1a3a5c',
  borderRadius: 8,
  color: '#f1f5f9',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#94a3b8',
  marginBottom: 6,
  letterSpacing: 0.5,
};

export default function ClaimUtilitiesForm() {
  const router = useRouter();
  const [utilityName, setUtilityName] = useState('');
  const [pwsid, setPwsid] = useState('');
  const [state, setState] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [utilityWebsite, setUtilityWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [ccrPdf, setCcrPdf] = useState<File | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');

    if (!authorized) {
      setErr('You must confirm you are an authorized representative of this water utility.');
      return;
    }

    setStatus('loading');
    try {
      const form = new FormData();
      form.set('utilityName', utilityName.trim());
      form.set('pwsid', pwsid.trim());
      form.set('state', state);
      form.set('contactName', contactName.trim());
      form.set('contactTitle', contactTitle.trim());
      form.set('email', email.trim());
      form.set('phone', phone.trim());
      if (utilityWebsite.trim()) form.set('utilityWebsite', utilityWebsite.trim());
      if (message.trim()) form.set('message', message.trim());
      form.set('authorized', 'on');
      if (ccrPdf) form.set('ccrPdf', ccrPdf);

      const res = await fetch('/api/claim-utility', {
        method: 'POST',
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        utilityName?: string;
        state?: string;
        email?: string;
      };

      if (!res.ok) {
        setStatus('error');
        setErr(typeof data.error === 'string' ? data.error : 'Something went wrong.');
        return;
      }

      const params = new URLSearchParams({
        utility: data.utilityName || utilityName.trim(),
        state: data.state || state,
        email: data.email || email.trim(),
      });
      router.push(`/utilities/claim/thank-you?${params.toString()}`);
    } catch {
      setStatus('error');
      setErr('Network error. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label style={labelStyle}>Utility name *</label>
        <input
          required
          name="utilityName"
          value={utilityName}
          onChange={(e) => setUtilityName(e.target.value)}
          style={inputStyle}
          autoComplete="organization"
        />
      </div>

      <div>
        <label style={labelStyle}>PWSID — EPA Public Water System ID *</label>
        <input
          required
          name="pwsid"
          value={pwsid}
          onChange={(e) => setPwsid(e.target.value)}
          style={inputStyle}
          placeholder="e.g. CA1910223"
          autoComplete="off"
        />
      </div>

      <div>
        <label style={labelStyle}>State *</label>
        <select
          required
          name="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="" disabled>
            Select state…
          </option>
          {USPS_STATE_OPTIONS.map(({ code, name }) => (
            <option key={code} value={code}>
              {name} ({code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Contact name *</label>
        <input
          required
          name="contactName"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          style={inputStyle}
          autoComplete="name"
        />
      </div>

      <div>
        <label style={labelStyle}>Title / role *</label>
        <input
          required
          name="contactTitle"
          value={contactTitle}
          onChange={(e) => setContactTitle(e.target.value)}
          style={inputStyle}
          placeholder="e.g. Water Superintendent"
        />
      </div>

      <div>
        <label style={labelStyle}>Official email address *</label>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div>
        <label style={labelStyle}>Phone number *</label>
        <input
          required
          type="tel"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          autoComplete="tel"
        />
      </div>

      <div>
        <label style={labelStyle}>Utility website (optional)</label>
        <input
          type="url"
          name="utilityWebsite"
          value={utilityWebsite}
          onChange={(e) => setUtilityWebsite(e.target.value)}
          style={inputStyle}
          placeholder="https://"
          autoComplete="url"
        />
      </div>

      <div>
        <label style={labelStyle}>Would you like to upload your 2026 CCR PDF? (optional)</label>
        <input
          type="file"
          name="ccrPdf"
          accept="application/pdf,.pdf"
          onChange={(e) => setCcrPdf(e.target.files?.[0] ?? null)}
          style={{
            ...inputStyle,
            padding: '10px 14px',
            fontSize: 13,
            color: '#94a3b8',
          }}
        />
        <p style={{ fontSize: 11, color: '#64748b', margin: '6px 0 0', lineHeight: 1.5 }}>
          PDF only, max 4 MB. You can also send your report after we verify your listing.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Message / notes (optional)</label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
        />
      </div>

      <label
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          fontSize: 13,
          color: '#cbd5e1',
          lineHeight: 1.55,
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          name="authorized"
          checked={authorized}
          onChange={(e) => setAuthorized(e.target.checked)}
          required
          style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16, accentColor: '#0891b2' }}
        />
        <span>I confirm I am an authorized representative of this water utility</span>
      </label>

      {status === 'error' && err && (
        <p style={{ fontSize: 13, color: '#f87171', margin: 0 }} role="alert">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '14px 24px',
          border: 'none',
          borderRadius: 10,
          background: status === 'loading' ? '#0e6080' : 'linear-gradient(135deg,#0891b2,#06b6d4)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 800,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          marginTop: 4,
        }}
      >
        {status === 'loading' ? 'Submitting…' : 'Submit claim →'}
      </button>
    </form>
  );
}
