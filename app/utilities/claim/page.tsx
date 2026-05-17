import type { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/app/components/SiteHeader';

import ClaimUtilitiesForm from './ClaimUtilitiesForm';

export const metadata: Metadata = {
  title: 'Publish Your 2026 Consumer Confidence Report Free | WaterCheckup',
  description:
    'Free CCR publishing for community water systems. Your customers already find your utility on WaterCheckup — claim your listing and meet EPA Consumer Confidence Report requirements.',
  alternates: { canonical: 'https://watercheckup.com/utilities/claim' },
};

const VALUE_CARDS = [
  {
    icon: '✅',
    title: 'Free Forever',
    body: 'No cost, no credit card, no catch. Free for all community water systems.',
  },
  {
    icon: '✅',
    title: 'Meets EPA Requirements',
    body: 'Your CCR published here counts toward EPA annual reporting requirements.',
  },
  {
    icon: '✅',
    title: 'Your Customers Are Already Here',
    body: '400,000+ utilities are listed on WaterCheckup. Your customers are searching for you right now.',
  },
  {
    icon: '✅',
    title: 'Government-Quality Presence',
    body: 'Your verified listing shows residents your official data — not third party estimates.',
  },
] as const;

export default function UtilityClaimPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/utilities" style={{ color: '#64748b', textDecoration: 'none' }}>
            Utilities
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#94a3b8' }}>Publish CCR</span>
        </nav>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
          FOR WATER OPERATORS
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 16px' }}>
          Publish Your 2026 Consumer Confidence Report Free
        </h1>

        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 32px' }}>
          Your customers are already finding your utility on WaterCheckup. Make sure they see your official water
          quality report.
        </p>

        <div className="wc-claim-value-cards">
          {VALUE_CARDS.map((card) => (
            <article key={card.title} className="wc-claim-value-card">
              <div className="wc-claim-value-card__icon" aria-hidden>
                {card.icon}
              </div>
              <h2 className="wc-claim-value-card__title">{card.title}</h2>
              <p className="wc-claim-value-card__body">{card.body}</p>
            </article>
          ))}
        </div>

        <div
          style={{
            padding: '24px 22px',
            background: '#0d2240',
            border: '1px solid #1a3a5c',
            borderRadius: 14,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
            CLAIM YOUR LISTING
          </div>
          <ClaimUtilitiesForm />
        </div>

        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
          Claims are reviewed manually. We match your PWSID to our EPA directory before publishing your CCR.{' '}
          <Link href="/faq" style={{ color: '#22d3ee' }}>
            FAQ
          </Link>{' '}
          ·{' '}
          <Link href="/utilities" style={{ color: '#22d3ee' }}>
            Utility directory
          </Link>
        </p>
      </div>
    </div>
  );
}
