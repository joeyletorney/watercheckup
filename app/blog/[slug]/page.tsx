import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS } from '../posts';
import { SiteHeader } from '../../components/SiteHeader';

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found | WaterCheckup' };
  return {
    /* Root layout title.template already adds " | WaterCheckup" — avoid doubling */
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://watercheckup.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['WaterCheckup'],
      images: [
        {
          url: `https://watercheckup.com/api/og/blog?title=${encodeURIComponent(post.title)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(post.excerpt ?? '')}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`https://watercheckup.com/api/og/blog?title=${encodeURIComponent(post.title)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(post.excerpt ?? '')}`],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'WaterCheckup', url: 'https://watercheckup.com' },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      logo: { '@type': 'ImageObject', url: 'https://watercheckup.com/logo.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://watercheckup.com/blog/${params.slug}`,
    },
  };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <SiteHeader variant="inner" showCta />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          {' · '}
          <Link href="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</Link>
          {' · '}
          <span style={{ color: '#94a3b8' }}>{post.badge}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>
              {post.badge}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{post.dateDisplay}</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{post.readTime}</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ fontSize: 17, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.7 }}>{post.excerpt}</p>
          <div style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>WC</div>
            <span>By <strong style={{ color: '#94a3b8' }}>WaterCheckup</strong> · Editorial · NSF/WQA-aligned guidance</span>
          </div>
        </div>

        {/* Check ZIP CTA — top */}
        <div style={{ marginBottom: 40, padding: '18px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>Is your water affected?</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Check the EPA report for your exact ZIP code — free, instant.</div>
          </div>
          <Link href="/" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Check My ZIP →
          </Link>
        </div>

        {/* Post content */}
        <div style={{ fontSize: 16, lineHeight: 1.85, color: '#94a3b8' }}>
          {post.content}
        </div>

        {/* Top product picks */}
        <div style={{ marginTop: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
            TOP PICKS
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {post.topPicks.map((pick: any, i: number) => {
              const showDirect = pick.brand === 'Waterdrop';
              const amazonPrimary = !showDirect;
              return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>#{i + 1}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{pick.product}</div>
                      {pick.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{pick.badge}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{pick.brand} &nbsp;·&nbsp; {pick.price}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>{pick.reason}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  {showDirect ? (
                    <a href={pick.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '8px 16px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>
                      Buy Direct →
                    </a>
                  ) : null}
                  <a
                    href={pick.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      background: amazonPrimary ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                      color: amazonPrimary ? '#fff' : '#94a3b8',
                      textDecoration: 'none',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: amazonPrimary ? 700 : 600,
                      textAlign: 'center',
                      border: amazonPrimary ? 'none' : '1px solid #1a3a5c',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Amazon →
                  </a>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Related posts */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>MORE GUIDES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(POSTS).filter(([slug]) => slug !== params.slug).map(([slug, p]) => (
              <Link key={slug} href={`/blog/${slug}`} style={{ textDecoration: 'none', padding: '16px 20px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{p.title}</span>
                <span style={{ fontSize: 13, color: '#0891b2', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter quiz CTA */}
        <div style={{ marginTop: 40, padding: '22px 24px', background: 'linear-gradient(135deg,rgba(8,145,178,0.12),rgba(7,24,40,0.95))', border: '1px solid rgba(8,145,178,0.35)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 1.5, marginBottom: 6 }}>NOT SURE WHICH FILTER IS RIGHT FOR YOU?</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Take the 3-question filter quiz</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>Answer 3 questions about your water source, biggest concern, and home situation — we match you to the right certified filter.</div>
          </div>
          <Link href="/quiz" style={{ display: 'inline-block', padding: '12px 22px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Find My Filter →
          </Link>
        </div>

        {/* Check your city */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 16 }}>CHECK YOUR CITY'S WATER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              { slug: 'san-antonio', name: 'San Antonio, TX' },
              { slug: 'chicago', name: 'Chicago, IL' },
              { slug: 'houston', name: 'Houston, TX' },
              { slug: 'los-angeles', name: 'Los Angeles, CA' },
              { slug: 'phoenix', name: 'Phoenix, AZ' },
              { slug: 'philadelphia', name: 'Philadelphia, PA' },
              { slug: 'dallas', name: 'Dallas, TX' },
              { slug: 'miami', name: 'Miami, FL' },
              { slug: 'boston', name: 'Boston, MA' },
              { slug: 'seattle', name: 'Seattle, WA' },
              { slug: 'denver', name: 'Denver, CO' },
              { slug: 'new-york', name: 'New York, NY' },
            ].map(({ slug, name }) => (
              <Link key={slug} href={`/water/${slug}`} style={{ display: 'block', padding: '10px 14px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
                {name} →
              </Link>
            ))}
          </div>
          <Link href="/water" style={{ fontSize: 13, color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>View all 135+ city reports →</Link>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water report</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>Enter your ZIP code to see live EPA data, PFAS results, and violation history for your specific water system.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '13px 30px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
