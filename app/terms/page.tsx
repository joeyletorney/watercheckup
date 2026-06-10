import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms for using WaterCheckup free tap water reports, scores, filter recommendations, and EPA-sourced data.',
  alternates: { canonical: 'https://watercheckup.com/terms' },
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

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 20 }}>
          <Link href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Terms</span>
        </nav>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>
          LEGAL
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
          Terms of Use
        </h1>
        <p style={{ ...p, fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Last updated: June 2026</p>

        <p style={p}>
          By using watercheckup.com (&quot;WaterCheckup,&quot; &quot;the site&quot;), you agree to these terms. If you
          do not agree, please do not use the site.
        </p>

        <h2 style={{ ...h2, marginTop: 0 }}>What WaterCheckup provides</h2>
        <p style={p}>
          WaterCheckup aggregates and summarizes <strong style={{ color: '#e2e8f0' }}>public</strong> drinking-water
          data (EPA SDWIS, UCMR5 PFAS monitoring, and related sources) and presents it in plain language with filter
          education. Reports are free and do not require an account.
        </p>
        <p style={p}>
          Our Water Safety Score and letter grades are <strong style={{ color: '#e2e8f0' }}>independent indexes</strong>{' '}
          — not official EPA grades, utility ratings, or lab results from your tap. See{' '}
          <Link href="/methodology" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            methodology
          </Link>{' '}
          for details.
        </p>

        <h2 style={h2}>Not medical or legal advice</h2>
        <p style={p}>
          Content on WaterCheckup is for informational purposes only. It is not medical advice, legal advice, or a
          substitute for certified laboratory testing of water at your home. If you have health concerns, consult a
          healthcare provider and a state-certified lab.
        </p>

        <h2 style={h2}>Filter and product recommendations</h2>
        <p style={p}>
          Filter picks are based on NSF/WQA certifications and contaminant profiles in public data. Some links are
          affiliate links — we may earn a commission if you purchase through them, at no extra cost to you. Product
          availability, pricing, and certification labels can change; verify the current listing before you buy.
        </p>

        <h2 style={h2}>Accuracy of data</h2>
        <p style={p}>
          We work to keep EPA-linked figures current, but public databases update on their own schedules and may
          contain errors. If you spot a mismatch with an official EPA record or your utility&apos;s CCR, please{' '}
          <Link href="/contact" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            contact us
          </Link>{' '}
          with the PWSID or source document and we will investigate.
        </p>

        <h2 style={h2}>Acceptable use</h2>
        <p style={p}>
          You may use the site for personal, non-commercial research. You may not scrape the site in ways that impair
          service for others, misrepresent WaterCheckup as an official EPA or utility source, or republish bulk data
          without attribution.
        </p>

        <h2 style={h2}>Disclaimer of warranties</h2>
        <p style={p}>
          The site is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted
          access, error-free data, or that any filter will remove every contaminant in your specific water.
        </p>

        <h2 style={h2}>Limitation of liability</h2>
        <p style={p}>
          To the fullest extent permitted by law, WaterCheckup and its operators are not liable for any indirect,
          incidental, or consequential damages arising from your use of the site or reliance on its content.
        </p>

        <h2 style={h2}>Changes</h2>
        <p style={p}>
          We may update these terms. Continued use after changes constitutes acceptance of the revised terms.
        </p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>
          Questions: see our{' '}
          <Link href="/contact" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            contact page
          </Link>
          . See our{' '}
          <Link href="/privacy" style={{ color: '#67e8f9', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
