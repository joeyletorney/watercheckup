import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS } from '../posts';
import { SiteHeader } from '../../components/SiteHeader';
import { BlogFeaturedImage } from '@/components/BlogFeaturedImage';
import { getBlogFeaturedImageUrl } from '@/lib/unsplash-images';
import { BLOG_AUTHOR_BYLINE, VIEW_ALL_WATER_SYSTEMS_LINK } from '@/lib/site-stats';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found | WaterCheckup' };

  const docTitle = post.seo?.title ?? post.title;
  const docDescription = post.seo?.description ?? post.excerpt;
  const ogTitle = post.seo?.openGraph?.title ?? docTitle;
  const ogDescription = post.seo?.openGraph?.description ?? docDescription;
  const canonical = post.seo?.canonical ?? `https://watercheckup.com/blog/${params.slug}`;
  const ogImageTitle = post.title;
  const ogImageExcerpt = post.excerpt;

  return {
    /* Root layout title.template — use absolute when `seo.title` is set so it is not doubled */
    title: post.seo?.title ? { absolute: post.seo.title } : post.title,
    description: docDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: post.date,
      authors: ['Joe Letorney'],
      images: [
        {
          url: `https://watercheckup.com/api/og/blog?title=${encodeURIComponent(ogImageTitle)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(ogImageExcerpt ?? '')}`,
          width: 1200,
          height: 630,
          alt: ogImageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`https://watercheckup.com/api/og/blog?title=${encodeURIComponent(ogImageTitle)}&badge=${encodeURIComponent(post.badge ?? '')}&excerpt=${encodeURIComponent(ogImageExcerpt ?? '')}`],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://watercheckup.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://watercheckup.com/blog/${params.slug}` },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    author: {
      '@type': 'Person',
      name: 'Joe Letorney',
      url: 'https://watercheckup.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      url: 'https://watercheckup.com',
      logo: { '@type': 'ImageObject', url: 'https://watercheckup.com/icon.png' },
    },
    image: [getBlogFeaturedImageUrl(params.slug, post.badge)],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://watercheckup.com/blog/${params.slug}`,
    },
  };

  const pageUrl = `https://watercheckup.com/blog/${params.slug}`;
  const faqLd = post.faq?.length
    ? buildFaqPageSchema(
        post.faq.map(({ q, a }) => ({ name: q, text: a })),
        pageUrl
      )
    : null;

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      <SiteHeader variant="inner" showCta />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 32 }}>
          <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
          {' · '}
          <Link href="/blog" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Blog</Link>
          {' · '}
          <span style={{ color: '#cbd5e1' }}>{post.badge}</span>
        </div>

        <BlogFeaturedImage slug={params.slug} title={post.title} badge={post.badge} />

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>
              {post.badge}
            </span>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>{post.dateDisplay}</span>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>·</span>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>{post.readTime}</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ fontSize: 14, color: '#cbd5e1', margin: '0 0 16px', lineHeight: 1.6 }}>
            By{' '}
            <Link href="/about" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>
              {BLOG_AUTHOR_BYLINE.name}
            </Link>
            {' | '}
            {BLOG_AUTHOR_BYLINE.credentials}
          </p>
          <p style={{ fontSize: 17, color: '#cbd5e1', margin: '0 0 20px', lineHeight: 1.7 }}>{post.excerpt}</p>
        </div>

        {/* Check ZIP CTA — top (slug-specific copy for high-impression posts) */}
        {(() => {
          const ctaBySlug: Record<string, { headline: string; sub: string; href: string; btn: string }> = {
            'best-water-filter-for-lead-removal': {
              headline: 'Is there lead in your tap water?',
              sub: 'Free EPA report by ZIP — see lead risk and NSF 53 filter matches.',
              href: '/',
              btn: 'Check lead in my ZIP →',
            },
            'what-water-filter-removes-pfas': {
              headline: 'Is PFAS in your tap water?',
              sub: 'Free ZIP report — UCMR5 PFAS data and filter picks for your utility.',
              href: '/',
              btn: 'Check PFAS in my ZIP →',
            },
          };
          const cta = ctaBySlug[params.slug] ?? {
            headline: 'Is your water affected?',
            sub: 'Check the EPA report for your exact ZIP code — free, instant.',
            href: '/',
            btn: 'Check My ZIP →',
          };
          return (
            <div style={{ marginBottom: 40, padding: '18px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{cta.headline}</div>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>{cta.sub}</div>
              </div>
              <Link href={cta.href} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {cta.btn}
              </Link>
            </div>
          );
        })()}

        {/* Post content */}
        <div style={{ fontSize: 16, lineHeight: 1.85, color: '#cbd5e1' }}>
          {post.content}
        </div>

        {(params.slug === 'best-water-filter-for-lead-removal' ||
          params.slug === 'what-water-filter-removes-pfas') && (
          <NewsletterSignup
            source={`blog-${params.slug}`}
            title="Get alerts when EPA data changes for your ZIP"
            description="Weekly digest: new PFAS readings, violations, and boil-water notices — matched to your area."
            compact
          />
        )}

        {post.faq && post.faq.length > 0 && (
          <section id="faq" style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 20px', lineHeight: 1.3 }}>
              Frequently asked questions
            </h2>
            {post.faq.map(({ q, a }) => (
              <div key={q} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.4 }}>
                  {q}
                </h3>
                <p style={{ fontSize: 15, color: '#cbd5e1', margin: 0, lineHeight: 1.75 }}>{a}</p>
              </div>
            ))}
          </section>
        )}

        {/* Top product picks */}
        <div style={{ marginTop: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
            TOP PICKS
          </div>
          {(() => { const skipped = post.topPicks.filter((p: any) => p.outOfStock).length; return skipped > 0 ? (
            <div style={{ margin: '12px 0', padding: '7px 12px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 7, fontSize: 12, color: '#fde68a' }}>
              Our top pick is currently out of stock — showing the next best NSF-certified option.
            </div>
          ) : null; })()}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {post.topPicks.filter((p: any) => !p.outOfStock).map((pick: any, i: number) => {
              const showDirect = pick.brand === 'Waterdrop';
              const amazonPrimary = !showDirect;
              return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#cbd5e1', minWidth: 20 }}>#{i + 1}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{pick.product}</div>
                      {pick.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{pick.badge}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 2 }}>{pick.brand} &nbsp;·&nbsp; {pick.price}</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4, lineHeight: 1.5 }}>{pick.reason}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  {showDirect ? (
                    <a href={pick.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '8px 16px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#cbd5e1', textDecoration: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>
                      Buy Direct →
                    </a>
                  ) : (
                  <a
                    href={pick.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', padding: '8px 16px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700, textAlign: 'center', border: 'none', whiteSpace: 'nowrap' }}
                  >
                    Amazon →
                  </a>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Related posts */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 16 }}>MORE GUIDES</div>
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
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0891b2', letterSpacing: 1.5, marginBottom: 6 }}>NOT SURE WHICH FILTER IS RIGHT FOR YOU?</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Take the 3-question filter quiz</div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>Answer 3 questions about your water source, biggest concern, and home situation — we match you to the right certified filter.</div>
          </div>
          <Link href="/quiz" style={{ display: 'inline-block', padding: '12px 22px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Find My Filter →
          </Link>
        </div>

        {/* Check your city */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, marginBottom: 16 }}>CHECK YOUR CITY'S WATER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              { slug: 'san-antonio', name: 'San Antonio water quality' },
              { slug: 'gaithersburg', name: 'Gaithersburg water quality' },
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
              <Link key={slug} href={`/water/${slug}`} style={{ display: 'block', padding: '10px 14px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                {name} →
              </Link>
            ))}
          </div>
          <Link href="/utilities" style={{ fontSize: 13, color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>{VIEW_ALL_WATER_SYSTEMS_LINK}</Link>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water report</div>
          <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 20, lineHeight: 1.6 }}>Enter your ZIP code to see live EPA data, PFAS results, and violation history for your specific water system.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '13px 30px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
