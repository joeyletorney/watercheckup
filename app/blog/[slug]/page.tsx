import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS } from '../posts';

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found | WaterCheckup' };
  return {
    title: `${post.title} | WaterCheckup`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['J. Letorney'],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  return (
    <div style={{ minHeight: '100vh', background: '#040d14', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My Water →
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#475569', marginBottom: 32 }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link>
          {' · '}
          <Link href="/blog" style={{ color: '#475569', textDecoration: 'none' }}>Blog</Link>
          {' · '}
          <span style={{ color: '#94a3b8' }}>{post.badge}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>
              {post.badge}
            </span>
            <span style={{ fontSize: 12, color: '#475569' }}>{post.dateDisplay}</span>
            <span style={{ fontSize: 12, color: '#475569' }}>·</span>
            <span style={{ fontSize: 12, color: '#475569' }}>{post.readTime}</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ fontSize: 17, color: '#64748b', margin: '0 0 20px', lineHeight: 1.7 }}>{post.excerpt}</p>
          <div style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>JL</div>
            <span>By <strong style={{ color: '#94a3b8' }}>J. Letorney</strong> · Water treatment specialist · 40+ years in the field</span>
          </div>
        </div>

        {/* Check ZIP CTA — top */}
        <div style={{ marginBottom: 40, padding: '18px 22px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>Is your water affected?</div>
            <div style={{ fontSize: 12, color: '#475569' }}>Check the EPA report for your exact ZIP code — free, instant.</div>
          </div>
          <Link href="/" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Check My ZIP →
          </Link>
        </div>

        {/* Post content */}
        <div style={{ fontSize: 16, lineHeight: 1.85, color: '#94a3b8' }}>
          {post.content}
        </div>

        {/* Top product pick */}
        <div style={{ marginTop: 48, padding: '24px 26px', background: 'linear-gradient(135deg,#071828,#04111e)', border: '1px solid #0891b2', borderRadius: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: 20, background: '#0891b2', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>
            TOP PICK
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>⚠ {post.topPick.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>{post.topPick.product}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{post.topPick.reason}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <a href={post.topPick.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>
                Get on Waterdrop →
              </a>
              <a href={post.topPick.amazon} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 20px', background: '#0d2240', color: '#64748b', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center', border: '1px solid #1a3a5c', whiteSpace: 'nowrap' }}>
                See on Amazon →
              </a>
            </div>
          </div>
        </div>

        {/* Related posts */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 16 }}>MORE GUIDES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(POSTS).filter(([slug]) => slug !== params.slug).map(([slug, p]) => (
              <Link key={slug} href={`/blog/${slug}`} style={{ textDecoration: 'none', padding: '16px 20px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{p.title}</span>
                <span style={{ fontSize: 13, color: '#0891b2', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your exact water report</div>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>Enter your ZIP code to see live EPA data, PFAS results, and violation history for your specific water system.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '13px 30px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
