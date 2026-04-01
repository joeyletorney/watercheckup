import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Water Quality Blog | WaterCheckup',
  description: 'Expert guides on tap water safety, PFAS contamination, lead in water, EPA violations, and the best water filters for your home.',
  alternates: { canonical: 'https://watercheckup.com/blog' },
};

const POSTS = [
  {
    slug: 'is-pfas-in-my-tap-water',
    title: 'Is PFAS in My Tap Water? How to Find Out and What to Do',
    excerpt: 'PFAS "forever chemicals" have been detected in 45% of US tap water. Here\'s how to check your water, what the health risks are, and which filters actually remove them.',
    date: 'March 28, 2026',
    readTime: '8 min read',
    tag: 'PFAS',
    tagColor: '#0891b2',
  },
  {
    slug: 'best-water-filter-for-lead',
    title: 'Best Water Filters for Lead Removal (2026) — NSF 53 Certified',
    excerpt: 'There is no safe level of lead in drinking water. This guide covers which filters are NSF 53 certified for lead removal, and which ones don\'t work as advertised.',
    date: 'March 29, 2026',
    readTime: '7 min read',
    tag: 'Lead',
    tagColor: '#d97706',
  },
  {
    slug: 'what-does-epa-water-violation-mean',
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    excerpt: 'Your water utility sent a violation notice — or EWG flagged your ZIP code. Here\'s what EPA violations mean, whether you should be worried, and what to do next.',
    date: 'March 30, 2026',
    readTime: '6 min read',
    tag: 'EPA',
    tagColor: '#7c3aed',
  },
];

export default function BlogIndex() {
  return (
    <div style={{ minHeight: '100vh', background: '#040d14', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My ZIP →
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>WATER QUALITY GUIDES</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', margin: '0 0 12px' }}>The WaterCheckup Blog</h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Expert guides on PFAS, lead, EPA violations, and how to choose the right water filter for your home.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '28px 28px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a3a5c')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, background: `${post.tagColor}20`, color: post.tagColor, border: `1px solid ${post.tagColor}40` }}>
                    {post.tag}
                  </span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>·</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px', lineHeight: 1.7 }}>{post.excerpt}</p>
                <span style={{ fontSize: 13, color: '#0891b2', fontWeight: 700 }}>Read article →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2336', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your tap water now</div>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Enter your ZIP for a free EPA water quality report and personalized filter recommendations.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
