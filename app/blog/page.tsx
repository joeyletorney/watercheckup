'use client';
import Link from 'next/link';

const POSTS = [
  {
    slug: 'is-pfas-in-my-tap-water',
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    excerpt: "PFAS \"forever chemicals\" have been found in 45% of US tap water. Here's how to find out if your water is affected — and what to do about it.",
    date: 'March 28, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
  },
  {
    slug: 'best-water-filter-for-lead-removal',
    title: 'Best Water Filters for Lead Removal in 2026 (NSF Certified)',
    excerpt: "There is no safe level of lead in drinking water. These are the only filters that are actually certified to remove it — ranked by performance and price.",
    date: 'March 29, 2026',
    readTime: '10 min read',
    badge: 'Lead',
    badgeColor: '#d97706',
  },
  {
    slug: 'what-does-epa-water-violation-mean',
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    excerpt: "Your water utility sent a notice. Or you found a violation on EPA's database. Here's exactly what it means, what the risk is, and what to do.",
    date: 'March 30, 2026',
    readTime: '7 min read',
    badge: 'EPA',
    badgeColor: '#7c3aed',
  },
];

export default function BlogIndex() {
  return (
    <div style={{ minHeight: '100vh', background: '#040d14', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My Water →
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>WATER QUALITY GUIDES</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', margin: '0 0 12px' }}>The WaterCheckup Blog</h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: 0, lineHeight: 1.7 }}>
            Expert guides on tap water safety, PFAS, lead, EPA violations, and the right filters — backed by real EPA data.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '28px 30px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '3px 10px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>
                    {post.badge}
                  </span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>·</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px', lineHeight: 1.7 }}>{post.excerpt}</p>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0891b2' }}>Read more →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your specific water</div>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>Enter your ZIP code to get the full EPA report for your exact water system.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
