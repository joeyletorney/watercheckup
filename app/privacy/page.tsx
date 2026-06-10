import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How WaterCheckup handles analytics, newsletter signups, and affiliate links when you use our free EPA tap water reports.',
  alternates: { canonical: 'https://watercheckup.com/privacy' },
  robots: { index: true, follow: true },
};

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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Privacy</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          LEGAL
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Privacy Policy
        </h1>
        <p style={{ ...p, fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Last updated: June 2026</p>

        <p style={p}>
          WaterCheckup (&quot;we,&quot; &quot;us&quot;) operates watercheckup.com. This policy explains what we collect,
          why, and your choices. We built the site to give free EPA-backed water reports — not to sell personal data.
        </p>

        <h2 style={{ ...h2, marginTop: 0 }}>Information we collect</h2>
        <p style={p}>
          <strong style={{ color: '#e2e8f0' }}>ZIP and city lookups.</strong> When you search a ZIP or browse a city
          page, we process that location to fetch public EPA and related datasets. We do not require an account for
          basic reports.
        </p>
        <p style={p}>
          <strong style={{ color: '#e2e8f0' }}>Newsletter.</strong> If you subscribe, we store your email address to
          send water-quality alerts you requested. You can unsubscribe anytime via the link in any email.
        </p>
        <p style={p}>
          <strong style={{ color: '#e2e8f0' }}>Utility claim forms.</strong> If you are a public water system operator
          and submit our claim form, we collect the contact details you provide to verify and update your listing.
        </p>
        <p style={p}>
          <strong style={{ color: '#e2e8f0' }}>Analytics.</strong> We use Google Analytics (and similar tools) to
          understand traffic patterns — pages viewed, approximate geography, device type. This helps us improve content.
          Google&apos;s policies also apply to how they process that data.
        </p>
        <p style={p}>
          <strong style={{ color: '#e2e8f0' }}>Advertising.</strong> We may display Google AdSense ads. Google and its
          partners may use cookies to serve ads based on your visits to this and other sites. You can manage ad
          personalization in your Google account settings.
        </p>

        <h2 style={h2}>Affiliate links</h2>
        <p style={p}>
          Some filter and product links are affiliate links (including Amazon Associates). If you click and buy, we may
          earn a commission at no extra cost to you. Affiliate partners may receive standard referral data (e.g., that a
          click came from our site). We do not receive your payment details.
        </p>

        <h2 style={h2}>How we use information</h2>
        <p style={p}>
          We use collected information to operate the site, send newsletters you opted into, respond to contact
          requests, improve reports, and measure performance. We do not sell email lists to filter brands or data
          brokers.
        </p>

        <h2 style={h2}>Cookies</h2>
        <p style={p}>
          We use cookies and similar technologies for analytics, advertising, and basic site functionality. You can
          control cookies through your browser settings; disabling them may limit some features.
        </p>

        <h2 style={h2}>Third-party services</h2>
        <p style={p}>
          We rely on hosting (Vercel), email delivery (Brevo), analytics (Google), and advertising (Google AdSense).
          Each provider has its own privacy policy governing how they handle data on our behalf.
        </p>

        <h2 style={h2}>Children</h2>
        <p style={p}>
          WaterCheckup is intended for a general audience. We do not knowingly collect personal information from
          children under 13. If you believe a child has provided us data, contact us and we will delete it.
        </p>

        <h2 style={h2}>Changes</h2>
        <p style={p}>
          We may update this policy as the site evolves. The &quot;Last updated&quot; date at the top will change when
          we do.
        </p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>
          Questions about privacy: use our{' '}
          <Link href="/contact" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            contact page
          </Link>
          . See also our{' '}
          <Link href="/terms" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            Terms of Use
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
