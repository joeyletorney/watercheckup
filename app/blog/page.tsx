import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Expert guides on tap water safety, PFAS, lead, EPA violations, filters, and well water — aligned with live EPA data.',
  alternates: {
    canonical: 'https://watercheckup.com/blog',
  },
};

/** Full post cards for the index — keyed by slug for ordering below. */
const POST_BY_SLUG: Record<
  string,
  { title: string; excerpt: string; date: string; readTime: string; badge: string; badgeColor: string }
> = {
  'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity': {
    title: 'Why Distilled Water and Reverse Osmosis Are the Two Best Systems for High Purity',
    excerpt:
      'For drinking water, “high purity” means removing dissolved salts, metals, and many organics — not just chlorine taste. Here is why distillation and RO sit at the top of the stack.',
    date: 'April 14, 2026',
    readTime: '10 min read',
    badge: 'Purity',
    badgeColor: '#06b6d4',
  },
  'arsenic-in-well-water-epa-limit-and-treatment': {
    title: 'Arsenic in Well Water: The EPA Limit and Treatment That Actually Works',
    excerpt:
      'Arsenic is a natural groundwater contaminant in many regions. Here is how to test, when 10 ppb matters, and what treatment options are common.',
    date: 'April 13, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  'microplastics-in-drinking-water-what-we-know': {
    title: 'Microplastics in Drinking Water: What We Know (and What We Don’t)',
    excerpt:
      'Microplastics show up in environmental samples worldwide. Here is how they get into water, what research is still settling, and what filters may help.',
    date: 'April 12, 2026',
    readTime: '8 min read',
    badge: 'Science',
    badgeColor: '#8b5cf6',
  },
  'boil-water-advisory-what-to-do-and-how-long': {
    title: 'Boil Water Advisory: What to Do, What to Avoid, and How Long It Lasts',
    excerpt:
      'Microbiological outbreaks trigger boil notices. Here is the safe playbook — including why you should not rely on home RO during a boil advisory.',
    date: 'April 11, 2026',
    readTime: '6 min read',
    badge: 'Safety',
    badgeColor: '#ef4444',
  },
  'whole-house-water-filter-vs-under-sink-which-to-choose': {
    title: 'Whole-House Water Filter vs. Under-Sink: Which Should You Choose?',
    excerpt:
      'Point-of-entry systems treat everything entering the home; point-of-use treats drinking water. Here is how to decide without overspending.',
    date: 'April 10, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
  },
  'refrigerator-water-filters-what-they-actually-remove': {
    title: 'Refrigerator Water Filters: What They Actually Remove',
    excerpt:
      'Fridge filters are convenient — but certification varies wildly. Here is how to read NSF claims and when you still need RO.',
    date: 'April 9, 2026',
    readTime: '7 min read',
    badge: 'Filters',
    badgeColor: '#06b6d4',
  },
  'how-to-test-your-tap-water-mail-in-labs-explained': {
    title: 'How to Test Your Tap Water: Mail-In Labs, Strips, and What to Order',
    excerpt:
      'Test strips are not enough for lead or PFAS. Here is how to pick a certified lab panel, avoid contamination, and read the results.',
    date: 'April 8, 2026',
    readTime: '9 min read',
    badge: 'Testing',
    badgeColor: '#2dd4bf',
  },
  'nitrate-in-well-water-infants-and-pregnancy': {
    title: 'Nitrate in Well Water: Why Infants and Pregnancy Need Extra Care',
    excerpt:
      'Nitrate is a common well-water issue. Here is how it causes methemoglobinemia, what the EPA limit means, and why RO is often the fix.',
    date: 'April 7, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  'chromium-6-in-drinking-water-should-you-worry': {
    title: 'Chromium-6 in Drinking Water: Should You Worry?',
    excerpt:
      'Chromium-6 gets headlines. Here is how it differs from chromium-3, what EPA regulates, and how to interpret results.',
    date: 'April 6, 2026',
    readTime: '7 min read',
    badge: 'Contaminants',
    badgeColor: '#eab308',
  },
  'bottled-water-vs-tap-water-cost-safety-and-pfas': {
    title: 'Bottled Water vs. Tap Water: Cost, Safety, and PFAS Reality',
    excerpt:
      'Bottled water is not automatically “purer.” Here is how regulation compares, what PFAS studies found, and when filtering tap water wins.',
    date: 'April 5, 2026',
    readTime: '8 min read',
    badge: 'Lifestyle',
    badgeColor: '#38bdf8',
  },
  'hard-water-explained-scale-softeners-and-your-taps': {
    title: 'Hard Water Explained: Scale, Softeners, and What It Means for Your Taps',
    excerpt:
      'Calcium and magnesium make water “hard.” Here is how hardness affects appliances, whether it is a health risk, and when a softener or RO makes sense.',
    date: 'April 4, 2026',
    readTime: '8 min read',
    badge: 'Home',
    badgeColor: '#94a3b8',
  },
  'disinfection-byproducts-tthm-haa5-explained': {
    title: 'Disinfection Byproducts (TTHM & HAA5): What They Are and How to Reduce Them',
    excerpt:
      'Disinfecting water creates byproducts like TTHM and HAA5. Here is what the acronyms mean, how EPA regulates them, and practical ways to lower exposure at home.',
    date: 'April 3, 2026',
    readTime: '7 min read',
    badge: 'Health',
    badgeColor: '#f59e0b',
  },
  'private-well-water-testing-101': {
    title: 'Private Well Water Testing 101: What to Order and How Often',
    excerpt:
      'Wells are not covered by EPA drinking water rules the same way city water is. Here is a sensible testing schedule, which labs to use, and what results mean for treatment.',
    date: 'April 2, 2026',
    readTime: '10 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  'chloramine-vs-chlorine-in-tap-water': {
    title: 'Chloramine vs. Chlorine in Tap Water: What It Means for Filters',
    excerpt:
      'Many cities switched to chloramine for longer-lasting disinfection. That changes taste, byproduct chemistry, and which filters work best — here is the practical breakdown.',
    date: 'April 1, 2026',
    readTime: '8 min read',
    badge: 'Treatment',
    badgeColor: '#0ea5e9',
  },
  'how-to-read-your-consumer-confidence-report': {
    title: 'How to Read Your Consumer Confidence Report (CCR)',
    excerpt:
      'Every public water system sends an annual water quality report. Here is how to find yours, what the tables mean, and which lines actually matter for your health.',
    date: 'March 31, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
  },
  'what-does-epa-water-violation-mean': {
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    excerpt: "Your water utility sent a notice. Or you found a violation on EPA's database. Here's exactly what it means, what the risk is, and what to do.",
    date: 'March 30, 2026',
    readTime: '7 min read',
    badge: 'EPA',
    badgeColor: '#7c3aed',
  },
  'best-water-filter-for-lead-removal': {
    title: 'Best Water Filters for Lead Removal in 2026 (NSF Certified)',
    excerpt:
      'There is no safe level of lead in drinking water. These are the only filters that are actually certified to remove it — ranked by performance and price.',
    date: 'March 29, 2026',
    readTime: '10 min read',
    badge: 'Lead',
    badgeColor: '#d97706',
  },
  'is-pfas-in-my-tap-water': {
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    excerpt:
      'PFAS "forever chemicals" have been found in 45% of US tap water. Here\'s how to find out if your water is affected — and what to do about it.',
    date: 'March 28, 2026',
    readTime: '8 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
  },
  'what-water-filter-removes-pfas': {
    title: 'What Water Filters Actually Remove PFAS? (NSF Certified Options Ranked)',
    excerpt: 'Not all filters that claim to remove PFAS are certified to do it. Here are the only options with real NSF 58 or NSF 473 data behind them.',
    date: 'April 22, 2026',
    readTime: '9 min read',
    badge: 'PFAS',
    badgeColor: '#0891b2',
  },
  'radon-in-drinking-water': {
    title: 'Radon in Drinking Water: Risk, Testing, and Treatment for Well Water Users',
    excerpt: 'Radon dissolves into groundwater and can off-gas in your home. Here is who is at risk, how to test, and which treatment actually works.',
    date: 'April 21, 2026',
    readTime: '8 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
  },
  'best-water-filter-pitcher-2025': {
    title: 'Best Water Filter Pitchers of 2025: Ranked by What They Actually Remove',
    excerpt: 'Filter pitchers vary wildly in what they remove. Here are the top options ranked by NSF certifications, not just taste.',
    date: 'April 20, 2026',
    readTime: '9 min read',
    badge: 'Filters',
    badgeColor: '#06b6d4',
  },
  'lead-in-tap-water-signs-and-symptoms': {
    title: 'Lead in Tap Water: Signs, Symptoms, and How to Know If Your Home Is at Risk',
    excerpt: 'Lead has no safe exposure level. Here is how it gets into tap water, what symptoms look like, and how to find out if your home is affected.',
    date: 'April 19, 2026',
    readTime: '9 min read',
    badge: 'Lead',
    badgeColor: '#d97706',
  },
  'reverse-osmosis-pros-and-cons': {
    title: 'Reverse Osmosis Water Filters: Pros, Cons, and Who Actually Needs One',
    excerpt: 'RO removes more contaminants than any other home filter — but it also wastes water and removes minerals. Here is the honest tradeoff.',
    date: 'April 18, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
  },
  'fluoride-in-tap-water-safe-or-not': {
    title: 'Fluoride in Tap Water: Is It Safe? What the Latest Research Shows',
    excerpt: 'Fluoride is added to most US public water. Here is what the science actually says about safety, optimal levels, and when filtering makes sense.',
    date: 'April 17, 2026',
    readTime: '8 min read',
    badge: 'Health',
    badgeColor: '#f59e0b',
  },
  'why-does-tap-water-taste-bad': {
    title: 'Why Does My Tap Water Taste Bad? The 7 Most Common Causes',
    excerpt: 'Bad-tasting tap water is usually caused by chlorine, chloramine, sulfur, or old pipes. Here is how to diagnose your specific issue.',
    date: 'April 16, 2026',
    readTime: '7 min read',
    badge: 'Home',
    badgeColor: '#94a3b8',
  },
  'is-tap-water-safe-to-drink': {
    title: 'Is Tap Water Safe to Drink? The Honest Answer by City and Water Source',
    excerpt: 'US tap water is generally safe — but "generally" hides a lot. Here is what the data shows and how to check your specific supply.',
    date: 'April 15, 2026',
    readTime: '8 min read',
    badge: 'Safety',
    badgeColor: '#ef4444',
  },
  'tap-water-safety-during-pregnancy': {
    title: 'Is Tap Water Safe During Pregnancy? What OBs and the EPA Say',
    excerpt: 'Pregnant women face higher risk from lead, nitrates, PFAS, and disinfection byproducts in tap water. Here is what to filter and what to skip.',
    date: 'April 18, 2026',
    readTime: '8 min read',
    badge: 'Pregnancy',
    badgeColor: '#8b5cf6',
  },
  'best-ro-system-for-pfas-removal': {
    title: 'Best Reverse Osmosis Systems for PFAS Removal in 2025',
    excerpt: 'Not all RO systems are equal for PFAS. Here are the certified options that actually work, at every budget.',
    date: 'April 19, 2026',
    readTime: '9 min read',
    badge: 'Filters',
    badgeColor: '#0891b2',
  },
  'moving-to-new-city-water-quality-check': {
    title: 'Moving to a New City? Check the Water Quality First',
    excerpt: 'Water quality varies dramatically by city and ZIP code. Here is how to check before you sign a lease or close on a home.',
    date: 'April 20, 2026',
    readTime: '6 min read',
    badge: 'Moving',
    badgeColor: '#f59e0b',
  },
};

/**
 * Index order: highest-intent / headline topics first (PFAS, lead, safety, EPA),
 * then filters & testing, contaminants & health, wells, then broader home / purity guides.
 */
const BLOG_INDEX_ORDER = [
  'is-pfas-in-my-tap-water',
  'what-water-filter-removes-pfas',
  'best-ro-system-for-pfas-removal',
  'best-water-filter-for-lead-removal',
  'lead-in-tap-water-signs-and-symptoms',
  'tap-water-safety-during-pregnancy',
  'is-tap-water-safe-to-drink',
  'moving-to-new-city-water-quality-check',
  'what-does-epa-water-violation-mean',
  'boil-water-advisory-what-to-do-and-how-long',
  'how-to-read-your-consumer-confidence-report',
  'how-to-test-your-tap-water-mail-in-labs-explained',
  'bottled-water-vs-tap-water-cost-safety-and-pfas',
  'best-water-filter-pitcher-2025',
  'reverse-osmosis-pros-and-cons',
  'refrigerator-water-filters-what-they-actually-remove',
  'whole-house-water-filter-vs-under-sink-which-to-choose',
  'chromium-6-in-drinking-water-should-you-worry',
  'microplastics-in-drinking-water-what-we-know',
  'fluoride-in-tap-water-safe-or-not',
  'disinfection-byproducts-tthm-haa5-explained',
  'chloramine-vs-chlorine-in-tap-water',
  'why-does-tap-water-taste-bad',
  'private-well-water-testing-101',
  'arsenic-in-well-water-epa-limit-and-treatment',
  'nitrate-in-well-water-infants-and-pregnancy',
  'radon-in-drinking-water',
  'hard-water-explained-scale-softeners-and-your-taps',
  'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity',
] as const;

const POSTS = BLOG_INDEX_ORDER.map(slug => {
  const meta = POST_BY_SLUG[slug];
  if (!meta) throw new Error(`Blog index: missing slug "${slug}" in POST_BY_SLUG`);
  return { slug, ...meta };
});

// Category groupings for the blog index
const CATEGORIES: { label: string; icon: string; slugs: string[] }[] = [
  {
    label: 'PFAS & Forever Chemicals',
    icon: '☣️',
    slugs: ['is-pfas-in-my-tap-water', 'what-water-filter-removes-pfas', 'best-ro-system-for-pfas-removal'],
  },
  {
    label: 'Lead & Heavy Metals',
    icon: '⚠️',
    slugs: ['best-water-filter-for-lead-removal', 'lead-in-tap-water-signs-and-symptoms'],
  },
  {
    label: 'Safety & Health',
    icon: '🏥',
    slugs: ['tap-water-safety-during-pregnancy', 'is-tap-water-safe-to-drink', 'boil-water-advisory-what-to-do-and-how-long', 'fluoride-in-tap-water-safe-or-not', 'microplastics-in-drinking-water-what-we-know'],
  },
  {
    label: 'Filter Guides',
    icon: '🔬',
    slugs: ['best-water-filter-pitcher-2025', 'reverse-osmosis-pros-and-cons', 'refrigerator-water-filters-what-they-actually-remove', 'whole-house-water-filter-vs-under-sink-which-to-choose'],
  },
  {
    label: 'Testing & EPA Data',
    icon: '📋',
    slugs: ['how-to-test-your-tap-water-mail-in-labs-explained', 'how-to-read-your-consumer-confidence-report', 'what-does-epa-water-violation-mean', 'moving-to-new-city-water-quality-check'],
  },
  {
    label: 'Contaminants Explained',
    icon: '🧪',
    slugs: ['chromium-6-in-drinking-water-should-you-worry', 'disinfection-byproducts-tthm-haa5-explained', 'chloramine-vs-chlorine-in-tap-water', 'bottled-water-vs-tap-water-cost-safety-and-pfas', 'why-does-tap-water-taste-bad', 'hard-water-explained-scale-softeners-and-your-taps', 'why-distilled-water-and-reverse-osmosis-are-best-for-high-purity'],
  },
  {
    label: 'Well Water',
    icon: '🌿',
    slugs: ['private-well-water-testing-101', 'arsenic-in-well-water-epa-limit-and-treatment', 'nitrate-in-well-water-infants-and-pregnancy', 'radon-in-drinking-water'],
  },
];

const FEATURED_SLUGS = ['is-pfas-in-my-tap-water', 'best-water-filter-for-lead-removal', 'tap-water-safety-during-pregnancy'];

export default function BlogIndex() {
  const featuredPosts = FEATURED_SLUGS.map(s => POSTS.find(p => p.slug === s)!).filter(Boolean);
  const postBySlug = Object.fromEntries(POSTS.map(p => [p.slug, p]));

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>WATER QUALITY GUIDES</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', margin: '0 0 12px' }}>The WaterCheckup Blog</h1>
          <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.7, maxWidth: 600 }}>
            Expert guides on tap water safety, PFAS, lead, and EPA violations — backed by the only free tool that combines 5 EPA databases.
          </p>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <a key={cat.label} href={`#cat-${cat.label.replace(/\s+/g,'_')}`}
                style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.25)', color: '#38bdf8', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {cat.icon} {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Featured posts */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>FEATURED</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {featuredPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ height: '100%', padding: '22px 22px 20px', background: 'linear-gradient(165deg,rgba(8,145,178,0.12),rgba(7,24,40,0.95))', border: '1px solid rgba(8,145,178,0.3)', borderTop: `3px solid ${post.badgeColor}`, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, padding: '2px 8px', borderRadius: 4, background: post.badgeColor + '22', color: post.badgeColor, border: `1px solid ${post.badgeColor}44` }}>{post.badge}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{post.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3, flex: 1 }}>{post.title}</h2>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{post.excerpt}</p>
                  <span style={{ fontSize: 12, fontWeight: 700, color: post.badgeColor }}>Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category sections */}
        {CATEGORIES.map(cat => {
          const catPosts = cat.slugs.map(s => postBySlug[s]).filter(Boolean);
          if (!catPosts.length) return null;
          return (
            <div key={cat.label} id={`cat-${cat.label.replace(/\s+/g,'_')}`} style={{ marginBottom: 44 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #0f2336' }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', letterSpacing: 0.3 }}>{cat.label}</span>
                <span style={{ fontSize: 11, color: '#334155', marginLeft: 4 }}>{catPosts.length} articles</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {catPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'rgba(7,24,40,0.7)', border: '1px solid #0f2336', borderRadius: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', borderRadius: 3, background: post.badgeColor + '18', color: post.badgeColor, border: `1px solid ${post.badgeColor}33` }}>{post.badge}</span>
                          <span style={{ fontSize: 11, color: '#475569' }}>{post.readTime}</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>{post.title}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0891b2', flexShrink: 0 }}>Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0f2d40', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Check your specific water</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>Enter your ZIP code to get the full EPA report for your exact water system.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
