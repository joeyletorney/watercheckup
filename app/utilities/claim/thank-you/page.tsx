import type { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/app/components/SiteHeader';
import { stateLabel } from '@/lib/us-state-names';

export const metadata: Metadata = {
  title: 'Claim Received | WaterCheckup',
  description: 'Your utility CCR claim has been received. We will verify and set up your official listing within 2 business days.',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: { utility?: string; state?: string; email?: string };
};

export default function UtilityClaimThankYouPage({ searchParams }: Props) {
  const utilityName = searchParams.utility?.trim() || 'your utility';
  const stateCode = searchParams.state?.trim().toUpperCase() || '';
  const email = searchParams.email?.trim() || 'the email you provided';
  const stateListingHref = stateCode ? `/utilities/${stateCode.toLowerCase()}` : '/utilities';

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px', textAlign: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'rgba(34, 211, 238, 0.15)',
            border: '1px solid rgba(34, 211, 238, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
          aria-hidden
        >
          ✓
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.2 }}>
          You&apos;re All Set!
        </h1>

        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px' }}>
          We&apos;ve received your claim for <strong style={{ color: '#e2e8f0' }}>{utilityName}</strong>. Our team will
          verify your credentials and set up your official CCR page within 2 business days.
        </p>

        <p style={{ fontSize: 15, color: '#67e8f9', lineHeight: 1.65, margin: '0 0 36px' }}>
          Thank you! We&apos;ll email you at <strong>{email}</strong> when it&apos;s ready.
        </p>

        <div
          style={{
            textAlign: 'left',
            padding: '24px 22px',
            background: '#0d2240',
            border: '1px solid #1a3a5c',
            borderRadius: 12,
            marginBottom: 32,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, margin: '0 0 16px' }}>
            IN THE MEANTIME
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <li>
              <Link href={stateListingHref} style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                View your current utility listing →
              </Link>
              {stateCode ? (
                <span style={{ display: 'block', fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Browse {stateLabel(stateCode)} systems in our directory
                </span>
              ) : null}
            </li>
            <li>
              <Link href="/about" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                Learn about WaterCheckup →
              </Link>
            </li>
            <li>
              <Link href="/rankings" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
                Check your state&apos;s water quality rankings →
              </Link>
            </li>
          </ul>
        </div>

        <Link
          href="/utilities/claim"
          style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}
        >
          ← Submit another claim
        </Link>
      </div>
    </div>
  );
}
