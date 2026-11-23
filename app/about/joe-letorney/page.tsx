import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import {
  AUTHOR_FORMER_WQA_CREDENTIAL,
  AUTHOR_PAGE_URL,
  AUTHOR_TIKTOK_URL,
} from '@/lib/site-stats';

export const metadata: Metadata = {
  title: {
    absolute: 'Joe Letorney — 30-Year Water Treatment Expert',
  },
  description:
    'Joe Letorney is a 30-year water treatment expert and former WQA Certified Water Specialist (CWS) Level VI. Founder of WaterCheckup. Author page for WaterCheckup bylines.',
  alternates: { canonical: AUTHOR_PAGE_URL },
  openGraph: {
    title: 'Joe Letorney — 30-Year Water Treatment Expert',
    description:
      'Joe Letorney is a 30-year water treatment expert and former WQA Certified Water Specialist (CWS) Level VI. Founder of WaterCheckup.',
  },
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Letorney',
  jobTitle: '30-year water treatment expert',
  url: AUTHOR_PAGE_URL,
  image: 'https://watercheckup.com/joe-letorney.jpeg',
  description:
    'Joe Letorney is a 30-year water treatment expert, former WQA Certified Water Treatment Specialist (CWS) Level VI, and founder of WaterCheckup.',
  worksFor: {
    '@type': 'Organization',
    name: 'WaterCheckup',
    url: 'https://watercheckup.com',
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Former Certified Water Treatment Specialist Level VI',
      credentialCategory: 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Water Quality Association (WQA)',
      },
    },
  ],
  sameAs: [AUTHOR_TIKTOK_URL, 'https://watercheckup.com/about'],
};

export default function JoeLetorneyAuthorPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020918', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <SiteHeader variant="inner" showCta ctaLabel="Check your ZIP →" ctaHref="/" />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 100px' }}>
        <nav style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
          <Link prefetch href="/" style={{ color: '#0891b2', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link prefetch href="/about" style={{ color: '#0891b2', textDecoration: 'none' }}>
            About
          </Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#cbd5e1' }}>Joe Letorney</span>
        </nav>

        <p style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>
          AUTHOR · WATERCHECKUP
        </p>

        <figure
          style={{
            margin: '0 0 28px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <Image
            src="/joe-letorney.jpeg"
            alt="Headshot of Joe Letorney, 30-year water treatment expert and founder of WaterCheckup"
            width={160}
            height={160}
            priority
            style={{ borderRadius: 16, objectFit: 'cover', objectPosition: 'center 15%', border: '1px solid #1a3a5c' }}
          />
          <figcaption style={{ fontSize: 13, color: '#94a3b8', maxWidth: 360, lineHeight: 1.6 }}>
            Headshot: Joe Letorney, founder of WaterCheckup.
          </figcaption>
        </figure>

        <h1 style={{ fontSize: 34, fontWeight: 900, color: '#f8fafc', lineHeight: 1.15, margin: '0 0 16px' }}>
          Joe Letorney
        </h1>
        <p style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 22px' }}>
          30-year water treatment expert · {AUTHOR_FORMER_WQA_CREDENTIAL}. Founder of WaterCheckup.
        </p>

        <ul style={{ margin: '0 0 28px', paddingLeft: 20, color: '#cbd5e1', lineHeight: 1.8, fontSize: 16 }}>
          <li>30-year water treatment expert</li>
          <li>{AUTHOR_FORMER_WQA_CREDENTIAL}</li>
          <li>Founder of WaterCheckup — free EPA-sourced tap water reports by ZIP</li>
        </ul>

        <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 18px' }}>
          Bylines on WaterCheckup city reports and filter guides point here. Claims on this page are limited to the
          credentials already used in those bylines. The WQA Certified Water Specialist (CWS) Level VI credential is
          former, not current.
        </p>

        <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.85, margin: '0 0 28px' }}>
          <Link prefetch href="/about" style={{ color: '#67e8f9', fontWeight: 700 }}>
            Full founder story on the About page →
          </Link>
        </p>

        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          <a href={AUTHOR_TIKTOK_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#67e8f9', fontWeight: 700 }}>
            Follow on TikTok
          </a>
          {' · '}
          @joethewaterpro
        </p>
      </main>
    </div>
  );
}
