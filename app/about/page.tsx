import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { ABOUT_WATER_BG, ABOUT_WATER_BG_ALT } from '@/lib/unsplash-images';
import { SITE_COMPARISON_ROWS } from '@/lib/site-stats';
import { ComparisonCellDisplay } from '@/components/ComparisonCellDisplay';

export const metadata: Metadata = {
  title: {
    absolute: 'About Joe Letorney — 30-Year Water Expert & Founder of WaterCheckup',
  },
  description:
    'Joe Letorney has 30+ years in water treatment, former WQA Level VI Certified Water Treatment Specialist, published author in water trade journals, and has lectured to thousands. He built WaterCheckup to give every American straight answers about their drinking water.',
  alternates: { canonical: 'https://watercheckup.com/about' },
  openGraph: {
    title: 'About Joe Letorney — 30-Year Water Expert & Founder of WaterCheckup',
    description:
      'Joe Letorney has 30+ years in water treatment, former WQA Level VI Certified Water Treatment Specialist, published author in water trade journals, and has lectured to thousands. He built WaterCheckup to give every American straight answers about their drinking water.',
  },
};

const h2: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#f1f5f9',
  margin: '48px 0 16px',
  lineHeight: 1.25,
};

const p: React.CSSProperties = {
  fontSize: 16,
  color: '#94a3b8',
  lineHeight: 1.85,
  margin: '0 0 18px',
};

const CREDENTIALS_PRIMARY = [
  'Former Certified Water Treatment Specialist — Level VI (Water Quality Association)',
  'Former Certified Installer (Water Quality Association)',
];

const CREDENTIALS_REST = [
  '30+ Years Water Industry Experience',
  'Vice President, Durastill Export, Inc. — Water purification systems sold to 100+ countries worldwide',
  'Founder, The WaterPro, Inc. — New England water treatment',
  'Published Author — Water Technology Magazine',
  'Published Author — Water Conditioning & Purification Magazine',
  'Industry Speaker — Lectured at Water Quality Association conventions throughout career',
  'Spoke to thousands of water industry professionals and consumers nationwide',
];

function CredentialCard({ line }: { line: string }) {
  return (
    <div
      style={{
        padding: '14px 18px',
        background: '#071828',
        border: '1px solid #1a3a5c',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        color: '#e2e8f0',
        lineHeight: 1.5,
      }}
    >
      {line}
    </div>
  );
}

const EXPERTISE_GROUPS = [
  {
    title: 'Point of Use Systems',
    items: [
      'Countertop water filters',
      'Under-counter systems',
      'Reverse osmosis systems',
      'Distillation systems',
    ],
  },
  {
    title: 'Whole House Systems',
    items: [
      'Carbon backwash systems',
      'Water softeners',
      'Acid neutralizers',
      'Iron and manganese removal',
    ],
  },
  {
    title: 'Specialty Systems',
    items: [
      'Volatile organic compound (VOC) removal',
      'Arsenic removal systems',
      'Shower filters',
      'Pool purifiers',
    ],
  },
];

const PILLARS = [
  {
    title: 'Real Expertise',
    body: 'Every recommendation comes from 30+ years of hands-on water treatment experience, not an algorithm.',
  },
  {
    title: 'Real Data',
    body: 'We use EPA UCMR5 and SDWIS data — the same sources government agencies use — presented in plain English.',
  },
  {
    title: 'Real Answers',
    body: "We tell you what's in your water, whether it matters, and exactly what to do about it. No fluff.",
  },
];

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Letorney',
  jobTitle: 'Founder & Water Treatment Specialist',
  worksFor: {
    '@type': 'Organization',
    name: 'WaterCheckup',
    url: 'https://watercheckup.com',
  },
  knowsAbout: [
    'Water Treatment',
    'PFAS Contamination',
    'Lead in Drinking Water',
    'Reverse Osmosis Systems',
    'Water Quality Testing',
    'Water Softeners',
    'Well Water Treatment',
    'Arsenic Removal',
    'VOC Removal',
    'Water Distillation',
    'Trihalomethanes',
    'TDS',
    'Water Hardness',
    'Low pH Treatment',
    'Iron and Manganese Removal',
  ],
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
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Former Certified Installer',
      credentialCategory: 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Water Quality Association (WQA)',
      },
    },
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'Durastill Export, Inc.',
  },
  founder: {
    '@type': 'Organization',
    name: 'The WaterPro, Inc.',
  },
  description:
    'Joe Letorney is a water treatment professional with over 30 years of experience. Former WQA Certified Water Treatment Specialist Level VI and Certified Installer. Published author in Water Technology Magazine and Water Conditioning and Purification Magazine. Founder of WaterCheckup.',
  image: 'https://watercheckup.com/joe-letorney.jpeg',
  sameAs: ['https://watercheckup.com/about'],
};

function PullQuote() {
  return (
    <blockquote
      className="about-pull-quote"
      style={{
        margin: '56px 0',
        padding: '36px 32px 36px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(6,182,212,0.05))',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        borderLeft: '5px solid #22d3ee',
        borderRadius: 12,
      }}
    >
      <p
        className="about-pull-quote__text"
        style={{
          margin: 0,
          fontSize: 'clamp(20px, 4vw, 26px)',
          fontWeight: 500,
          color: '#cbd5e1',
          lineHeight: 1.65,
          fontStyle: 'italic',
        }}
      >
        &ldquo;Most people have no idea what&apos;s in their water. That&apos;s not their fault — the information was
        never made easy to find. That&apos;s what I&apos;m fixing.&rdquo;
      </p>
      <footer
        style={{
          marginTop: 20,
          fontSize: 15,
          fontWeight: 700,
          color: '#67e8f9',
          fontStyle: 'normal',
        }}
      >
        — Joe Letorney, Founder
      </footer>
    </blockquote>
  );
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <SiteHeader variant="inner" showCta ctaLabel="Check your water →" ctaHref="/" />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 100px' }}>
        <div className="about-page-hero-bg">
          <Image
            src={ABOUT_WATER_BG}
            alt={ABOUT_WATER_BG_ALT}
            fill
            sizes="760px"
            priority
            className="about-page-hero-bg__img"
          />
          <div className="about-page-hero-bg__overlay" aria-hidden />
          <div className="about-page-hero-bg__content">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 20 }}>
              ABOUT THE FOUNDER
            </p>

            <section className="about-hero" aria-label="Joe Letorney, founder">
          <div className="about-hero__portrait">
            <div className="about-hero__portrait-inner">
              <Image
                src="/joe-letorney.jpeg"
                alt="Joe Letorney - Founder of WaterCheckup, 30-year water treatment specialist"
                width={200}
                height={200}
                sizes="(max-width: 767px) 180px, 200px"
                priority
                style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
              />
            </div>
          </div>
          <div className="about-hero__text">
            <h1
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: '#f8fafc',
                lineHeight: 1.15,
                margin: '0 0 20px',
                fontFamily: 'var(--font-wc-display), var(--font-inter), system-ui, sans-serif',
              }}
            >
              I&apos;ve Spent Most of My Life in Water. This Site is Why.
            </h1>
            <p style={{ ...p, fontSize: 17, color: '#cbd5e1', marginBottom: 0 }}>
              Honestly, water has just always been part of my life. I grew up around it, worked in it for over 30 years,
              and somewhere along the way realized I knew things that most people really needed to know but had no easy
              way to find out.
            </p>
          </div>
            </section>
          </div>
        </div>

        <h2 style={{ ...h2, marginTop: 0 }}>It Started When I Was 10 Years Old</h2>
        <p style={p}>
          My parents started an export water treatment business selling systems all over the world. So growing up, water
          quality wasn&apos;t something I learned about in school. It was just dinner table conversation. In grade school
          I was doing projects about water treatment and educating my classmates on various contaminants. Not because
          anyone made me. It was just what I knew.
        </p>
        <p style={p}>
          After college I started my own water treatment company serving homeowners throughout New England. For years I
          went into people&apos;s homes, tested their water, figured out what was in it, and installed systems to fix it.
          City water, well water, it didn&apos;t matter. I&apos;ve seen just about everything that can go wrong with
          drinking water and more importantly, how to fix it.
        </p>
        <p style={p}>
          That&apos;s really what WaterCheckup is. I want to give people the real truth about water. Not watered down
          information, not scare tactics, just straight honest answers about what&apos;s in your water, what it means for
          your health, and what to do about it. Testing, contaminants, filters, whole house systems — all of it broken
          down in plain language that anyone can understand without a chemistry degree.
        </p>
        <p style={p}>
          Everything I&apos;ve learned over 30 years, put into something anyone can use for free without having to call a
          water guy, read an EPA spreadsheet, or try to figure out if your water is actually safe.
        </p>
        <p style={p}>Because it shouldn&apos;t be that hard to know what&apos;s in your water.</p>

        <h2 style={h2}>Industry Recognition</h2>
        <p style={p}>
          Throughout my career I&apos;ve shared my water expertise beyond the treatment room. I&apos;ve published
          articles in leading water industry trade journals including Water Technology Magazine and Water Conditioning
          &amp; Purification Magazine — two of the most respected publications in the water treatment field.
        </p>
        <p style={p}>
          I&apos;ve also lectured at Water Quality Association conventions and spoken to thousands of water professionals
          and consumers throughout my career — always with the same goal: helping people understand their water and
          what to do about it.
        </p>
        <p style={p}>
          WaterCheckup is the next chapter of that same mission — now available to anyone, anywhere, for free.
        </p>

        <h2 style={h2}>Why I Built WaterCheckup</h2>
        <p style={p}>
          I built WaterCheckup because I felt the need to educate the average consumer on knowing exactly what&apos;s in
          their water and what to do about it. Taking my years of expertise in the field and recommending certified water
          filtration systems to remove various contaminants. You deserve straight answers — not confusing EPA
          spreadsheets, not generic advice, not a faceless algorithm. Real expertise, applied to your water.
        </p>

        <h2 style={h2}>Credentials &amp; Experience</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {CREDENTIALS_PRIMARY.map((line) => (
            <CredentialCard key={line} line={line} />
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', fontStyle: 'italic' }}>
          Credentials held during active practice with The WaterPro, Inc.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {CREDENTIALS_REST.map((line) => (
            <CredentialCard key={line} line={line} />
          ))}
        </div>

        <h2 style={h2}>Every Type of Water Treatment System — I&apos;ve Installed It</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 8,
          }}
        >
          {EXPERTISE_GROUPS.map((group) => (
            <div
              key={group.title}
              style={{
                padding: '18px 20px',
                background: '#0d2240',
                border: '1px solid #1a3a5c',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#0891b2',
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                {group.title.toUpperCase()}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                {group.items.map((item) => (
                  <li key={item} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 style={h2}>This Isn&apos;t Just a Data Website</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          {PILLARS.map((col) => (
            <div
              key={col.title}
              style={{
                padding: '20px 22px',
                background: '#071828',
                border: '1px solid #1a3a5c',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>{col.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{col.body}</p>
            </div>
          ))}
        </div>

        <PullQuote />

        <h2 style={h2}>How WaterCheckup Compares</h2>
        <p style={{ ...p, marginBottom: 20 }}>
          Most water quality sites are built by tech companies scraping partial EPA data. Here is how WaterCheckup stacks up.
        </p>
        <div className="wc-compare-table-wrap">
          <table className="wc-compare-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" className="wc-compare-table__wc-col">WaterCheckup</th>
                <th scope="col">Others</th>
              </tr>
            </thead>
            <tbody>
              {SITE_COMPARISON_ROWS.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td className="wc-compare-table__wc-col">
                    <ComparisonCellDisplay cell={row.watercheckup} />
                  </td>
                  <td>
                    <ComparisonCellDisplay cell={row.others} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: 48,
            padding: '32px 28px',
            background: 'linear-gradient(135deg, #071828, #040d14)',
            border: '1px solid #0f2d40',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <h2 style={{ ...h2, marginTop: 0, marginBottom: 12 }}>Have a Question About Your Water?</h2>
          <p style={{ ...p, marginBottom: 24 }}>
            After 30 years in the water industry I&apos;ve heard every question imaginable. If you want to understand
            what&apos;s in your water or what to do about it, I&apos;m here to help.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px #0891b244',
            }}
          >
            Check Your Water Now →
          </Link>
          <p style={{ margin: '20px 0 0', fontSize: 13, color: '#64748b' }}>
            <Link href="/methodology" style={{ color: '#67e8f9', textDecoration: 'none' }}>
              How we source EPA data →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
