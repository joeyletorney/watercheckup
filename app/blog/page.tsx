'use client';
import Link from 'next/link';

const POSTS = [
  {
    slug: 'arsenic-in-well-water-epa-limit-and-treatment',
    title: 'Arsenic in Well Water: The EPA Limit and Treatment That Actually Works',
    excerpt:
      'Arsenic is a natural groundwater contaminant in many regions. Here is how to test, when 10 ppb matters, and what treatment options are common.',
    date: 'April 13, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  {
    slug: 'microplastics-in-drinking-water-what-we-know',
    title: 'Microplastics in Drinking Water: What We Know (and What We Don’t)',
    excerpt:
      'Microplastics show up in environmental samples worldwide. Here is how they get into water, what research is still settling, and what filters may help.',
    date: 'April 12, 2026',
    readTime: '8 min read',
    badge: 'Science',
    badgeColor: '#8b5cf6',
  },
  {
    slug: 'boil-water-advisory-what-to-do-and-how-long',
    title: 'Boil Water Advisory: What to Do, What to Avoid, and How Long It Lasts',
    excerpt:
      'Microbiological outbreaks trigger boil notices. Here is the safe playbook — including why you should not rely on home RO during a boil advisory.',
    date: 'April 11, 2026',
    readTime: '6 min read',
    badge: 'Safety',
    badgeColor: '#ef4444',
  },
  {
    slug: 'whole-house-water-filter-vs-under-sink-which-to-choose',
    title: 'Whole-House Water Filter vs. Under-Sink: Which Should You Choose?',
    excerpt:
      'Point-of-entry systems treat everything entering the home; point-of-use treats drinking water. Here is how to decide without overspending.',
    date: 'April 10, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
  },
  {
    slug: 'refrigerator-water-filters-what-they-actually-remove',
    title: 'Refrigerator Water Filters: What They Actually Remove',
    excerpt:
      'Fridge filters are convenient — but certification varies wildly. Here is how to read NSF claims and when you still need RO.',
    date: 'April 9, 2026',
    readTime: '7 min read',
    badge: 'Filters',
    badgeColor: '#06b6d4',
  },
  {
    slug: 'how-to-test-your-tap-water-mail-in-labs-explained',
    title: 'How to Test Your Tap Water: Mail-In Labs, Strips, and What to Order',
    excerpt:
      'Test strips are not enough for lead or PFAS. Here is how to pick a certified lab panel, avoid contamination, and read the results.',
    date: 'April 8, 2026',
    readTime: '9 min read',
    badge: 'Testing',
    badgeColor: '#2dd4bf',
  },
  {
    slug: 'nitrate-in-well-water-infants-and-pregnancy',
    title: 'Nitrate in Well Water: Why Infants and Pregnancy Need Extra Care',
    excerpt:
      'Nitrate is a common well-water issue. Here is how it causes methemoglobinemia, what the EPA limit means, and why RO is often the fix.',
    date: 'April 7, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  {
    slug: 'chromium-6-in-drinking-water-should-you-worry',
    title: 'Chromium-6 in Drinking Water: Should You Worry?',
    excerpt:
      'Chromium-6 gets headlines. Here is how it differs from chromium-3, what EPA regulates, and how to interpret results.',
    date: 'April 6, 2026',
    readTime: '7 min read',
    badge: 'Contaminants',
    badgeColor: '#eab308',
  },
  {
    slug: 'bottled-water-vs-tap-water-cost-safety-and-pfas',
    title: 'Bottled Water vs. Tap Water: Cost, Safety, and PFAS Reality',
    excerpt:
      'Bottled water is not automatically “purer.” Here is how regulation compares, what PFAS studies found, and when filtering tap water wins.',
    date: 'April 5, 2026',
    readTime: '8 min read',
    badge: 'Lifestyle',
    badgeColor: '#38bdf8',
  },
  {
    slug: 'hard-water-explained-scale-softeners-and-your-taps',
    title: 'Hard Water Explained: Scale, Softeners, and What It Means for Your Taps',
    excerpt:
      'Calcium and magnesium make water “hard.” Here is how hardness affects appliances, whether it is a health risk, and when a softener or RO makes sense.',
    date: 'April 4, 2026',
    readTime: '8 min read',
    badge: 'Home',
    badgeColor: '#94a3b8',
  },
  {
    slug: 'disinfection-byproducts-tthm-haa5-explained',
    title: 'Disinfection Byproducts (TTHM & HAA5): What They Are and How to Reduce Them',
    excerpt:
      'Disinfecting water creates byproducts like TTHM and HAA5. Here is what the acronyms mean, how EPA regulates them, and practical ways to lower exposure at home.',
    date: 'April 3, 2026',
    readTime: '7 min read',
    badge: 'Health',
    badgeColor: '#f59e0b',
  },
  {
    slug: 'private-well-water-testing-101',
    title: 'Private Well Water Testing 101: What to Order and How Often',
    excerpt:
      'Wells are not covered by EPA drinking water rules the same way city water is. Here is a sensible testing schedule, which labs to use, and what results mean for treatment.',
    date: 'April 2, 2026',
    readTime: '10 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  {
    slug: 'chloramine-vs-chlorine-in-tap-water',
    title: 'Chloramine vs. Chlorine in Tap Water: What It Means for Filters',
    excerpt:
      'Many cities switched to chloramine for longer-lasting disinfection. That changes taste, byproduct chemistry, and which filters work best — here is the practical breakdown.',
    date: 'April 1, 2026',
    readTime: '8 min read',
    badge: 'Treatment',
    badgeColor: '#0ea5e9',
  },
  {
    slug: 'how-to-read-your-consumer-confidence-report',
    title: 'How to Read Your Consumer Confidence Report (CCR)',
    excerpt:
      'Every public water system sends an annual water quality report. Here is how to find yours, what the tables mean, and which lines actually matter for your health.',
    date: 'March 31, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
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
    slug: 'is-pfas-in-my-tap-water',
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    excerpt: "PFAS \"forever chemicals\" have been found in 45% of US tap water. Here's how to find out if your water is affected — and what to do about it.",
    date: 'March 28, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
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
