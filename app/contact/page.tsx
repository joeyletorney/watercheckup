import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { AUTHOR_REVIEW_BYLINE } from '@/lib/site-stats';

export const metadata: Metadata = {
  title: {
    absolute: 'Contact WaterCheckup — Questions, Press & Data Corrections',
  },
  description:
    'Email Joe Letorney at WaterCheckup for tap water data questions, press inquiries, EPA report corrections, or public water system listing updates. We respond within a few business days.',
  alternates: { canonical: 'https://watercheckup.com/contact' },
  openGraph: {
    title: 'Contact WaterCheckup',
    description:
      'Reach our editorial team for water quality data questions, journalist requests, and corrections.',
  },
};

const CONTACT_EMAIL = 'joe@letorney.com';

const h2: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: '#f1f5f9',
  margin: '32px 0 12px',
};

const p: React.CSSProperties = {
  fontSize: 16,
  color: '#cbd5e1',
  lineHeight: 1.85,
  margin: '0 0 16px',
};

const card: React.CSSProperties = {
  padding: '18px 20px',
  background: '#0d2240',
  border: '1px solid #1a3a5c',
  borderRadius: 12,
  marginBottom: 12,
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Contact</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          GET IN TOUCH
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Contact WaterCheckup
        </h1>
        <p style={{ ...p, fontSize: 17, marginBottom: 28 }}>
          Questions about your ZIP report, press requests, or a correction to EPA-linked data? Send an email — no
          contact form, no account required. Just open your mail app and write to us directly.
        </p>

        <div
          style={{
            padding: '28px 26px',
            background: 'linear-gradient(135deg, #071828, #040d14)',
            border: '1px solid rgba(34,211,238,0.35)',
            borderRadius: 16,
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#67e8f9', letterSpacing: 1.5, marginBottom: 10 }}>
            EMAIL US
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('WaterCheckup inquiry')}`}
            style={{
              display: 'inline-block',
              fontSize: 22,
              fontWeight: 800,
              color: '#f1f5f9',
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.6 }}>
            Click the address to open your email app (Gmail, Outlook, Apple Mail, etc.) with a new message addressed
            to us.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('WaterCheckup inquiry')}`}
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Send an email →
          </a>
        </div>

        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
          {AUTHOR_REVIEW_BYLINE} Typical response time: a few business days. We do not sell email lists or share your
          address with filter brands.
        </p>

        <h2 style={{ ...h2, marginTop: 0 }}>What to email about</h2>
        {[
          {
            title: 'Your ZIP or city report',
            body: 'Something looks wrong in your results, or you want help reading PFAS / lead numbers vs EPA limits.',
          },
          {
            title: 'Press & data citations',
            body: 'Journalists and bloggers: we can confirm EPA UCMR5 figures, provide context, or link readers to a free ZIP lookup.',
          },
          {
            title: 'Corrections',
            body: 'If a PWSID, utility name, or CCR figure on our site does not match the official EPA record, tell us — we fix sourced data promptly.',
          },
          {
            title: 'Public water system operators',
            body: 'Claim or update your utility listing via our operator form, or email if you need help with the claim process.',
          },
        ].map(({ title, body }) => (
          <div key={title} style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{title}</div>
            <p style={{ fontSize: 14, color: '#a8b4c4', margin: 0, lineHeight: 1.65 }}>{body}</p>
          </div>
        ))}

        <h2 style={h2}>Not what you need?</h2>
        <p style={p}>
          For instant answers, try the{' '}
          <Link href="/faq" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            FAQ
          </Link>
          , read how we{' '}
          <Link href="/methodology" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            source EPA data
          </Link>
          , or{' '}
          <Link href="/" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            check your ZIP for free
          </Link>
          . Utility operators can use the{' '}
          <Link href="/utilities/claim" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            claim listing form
          </Link>
          .
        </p>
        <p style={p}>
          Learn more about{' '}
          <Link href="/about" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            Joe Letorney and WaterCheckup
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
