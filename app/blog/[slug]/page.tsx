import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const AMAZON_TAG = 'watercheck20-20';
const WATERDROP = 'https://www.waterdrop.com/?ref=anbyjkqb';

const POSTS: Record<string, {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  content: React.ReactNode;
}> = {
  'is-pfas-in-my-tap-water': {
    title: 'Is PFAS in My Tap Water? What the EPA Data Actually Shows',
    description: "PFAS \"forever chemicals\" have been found in 45% of US tap water. Here's how to find out if your water is affected — and what actually removes them.",
    date: 'March 31, 2026',
    readTime: '8 min read',
    tag: 'PFAS',
    tagColor: '#0891b2',
    content: (
      <>
        <p>In 2023, the USGS published a landmark study: PFAS &mdash; per- and polyfluoroalkyl substances &mdash; were detected in roughly 45% of US tap water samples. These are the &ldquo;forever chemicals&rdquo; that don&apos;t break down in the environment or in the human body. And for most people drinking tap water, they have no idea whether their water contains them.</p>

        <h2>What Is PFAS and Why Should You Care?</h2>
        <p>PFAS is a class of over 12,000 synthetic chemicals used since the 1940s in nonstick cookware, food packaging, firefighting foam (AFFF), waterproof clothing, and hundreds of industrial processes. They are called &ldquo;forever chemicals&rdquo; because the carbon-fluorine bond they contain is one of the strongest in chemistry &mdash; it essentially never breaks down.</p>
        <p>When PFAS enter the body, they accumulate. Over years and decades, research has linked chronic PFAS exposure to:</p>
        <ul>
          <li>Kidney and testicular cancer</li>
          <li>Thyroid disease and hormonal disruption</li>
          <li>Immune system suppression (including reduced vaccine effectiveness in children)</li>
          <li>High cholesterol</li>
          <li>Pregnancy complications and low birth weight</li>
          <li>Ulcerative colitis</li>
        </ul>
        <p>The EPA set enforceable limits for six PFAS compounds in April 2024 &mdash; the first-ever federal PFAS drinking water standards. The limits are extraordinarily low: 4 parts per trillion for PFOA and PFOS, and 10 parts per trillion for four others. To put that in perspective, 4 parts per trillion is equivalent to four drops of water in an Olympic-sized swimming pool.</p>

        <h2>Where Does PFAS Come From in Drinking Water?</h2>
        <p>PFAS enter water supplies from several sources:</p>
        <ul>
          <li><strong>Military bases and airports</strong> where AFFF firefighting foam was used heavily for decades</li>
          <li><strong>Industrial facilities</strong> that manufacture or use PFAS compounds</li>
          <li><strong>Landfills</strong> receiving PFAS-containing consumer products</li>
          <li><strong>Agricultural land</strong> where PFAS-contaminated sewage sludge was used as fertilizer</li>
          <li><strong>Wastewater treatment plants</strong> that cannot remove PFAS and release it into rivers</li>
        </ul>
        <p>Once in groundwater or surface water, PFAS don&apos;t go away. They move through watersheds, enter municipal treatment systems, and come out of your tap. Standard water treatment &mdash; chlorination, flocculation, sand filtration &mdash; does not remove PFAS.</p>

        <h2>How to Find Out If PFAS Is in Your Water</h2>
        <p>There are three ways to check:</p>
        <p><strong>1. Check your annual water quality report (CCR).</strong> Every water utility is required to mail customers a Consumer Confidence Report each year. Since the 2024 EPA rules, utilities serving over 10,000 people must test for PFAS. Look for PFOA, PFOS, PFNA, PFHxS, HFPO-DA (GenX), and PFBS.</p>
        <p><strong>2. Use WaterCheckup.</strong> Enter your ZIP code above and we pull live EPA SDWIS data for your water system, including any PFAS violations or detections reported under UCMR5 monitoring.</p>
        <p><strong>3. Get your water tested independently.</strong> For the most complete picture, mail a water sample to a certified lab. Expect to pay $150-$400 for a full PFAS panel. Look for labs certified under NELAP or your state&apos;s certification program.</p>

        <h2>What Actually Removes PFAS From Tap Water?</h2>
        <p>This is where most people get misled. Standard pitcher filters &mdash; including basic Brita and PUR models &mdash; do not remove PFAS. Boiling water does not remove PFAS. The only technologies with strong evidence for PFAS removal are:</p>
        <p><strong>Reverse osmosis (RO)</strong> is the gold standard. RO membranes have pores small enough (0.0001 microns) to block PFAS molecules. A quality under-sink RO system removes 90-99% of PFAS. This is what we recommend for anyone with confirmed or suspected PFAS in their water.</p>
        <p><strong>Activated carbon (specific grades)</strong> can reduce PFAS, but performance varies significantly by carbon type, contact time, and PFAS compound. High-quality activated carbon block filters certified to NSF/ANSI 58 or P473 can remove PFAS effectively. Not all carbon filters are certified &mdash; look for the NSF mark specifically for PFAS.</p>
        <p><strong>Ion exchange resins</strong> (used in some whole-house systems) are effective but expensive and complex to maintain.</p>

        <h2>Our Top Picks for PFAS Removal</h2>
        <div style={{ background: '#071828', border: '1px solid #0891b2', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>BEST OVERALL — UNDER-SINK RO</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Waterdrop G3P800 Reverse Osmosis System</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.7 }}>Tankless design, 800 GPD capacity, removes 99%+ of PFAS, lead, arsenic, nitrates, and chlorine. NSF 58 certified. Installs under any standard kitchen sink in about 30 minutes. No tank means no bacterial growth risk.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <a href={WATERDROP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Get on Waterdrop →</a>
            <a href={`https://www.amazon.com/s?k=waterdrop+g3p800+reverse+osmosis&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #1a3a5c' }}>See on Amazon →</a>
          </div>
        </div>

        <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#059669', letterSpacing: 2, marginBottom: 8 }}>BEST FOR RENTERS — NO INSTALLATION</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Waterdrop Pitcher Filter (NSF P473 Certified)</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.7 }}>Certified specifically for PFAS removal. Sits on your counter, requires zero installation. Best option for renters or anyone who can&apos;t modify plumbing. Replace filter every 3 months.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <a href={WATERDROP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Get on Waterdrop →</a>
            <a href={`https://www.amazon.com/s?k=pfas+certified+water+filter+pitcher+nsf+p473&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #1a3a5c' }}>See on Amazon →</a>
          </div>
        </div>

        <h2>The Bottom Line</h2>
        <p>PFAS contamination is real, widespread, and the EPA has now confirmed it&apos;s a serious health threat. If you live near a military base, an industrial facility, or in a state with known PFAS contamination (North Carolina, Michigan, New Jersey, Pennsylvania, and others), your risk is higher. But even in states with no known contamination, 45% of tap water contains detectable PFAS.</p>
        <p>The good news: a quality reverse osmosis system costs $200-$400 and removes 99%+ of PFAS for pennies per gallon. It&apos;s one of the most cost-effective health investments you can make.</p>
        <p>Enter your ZIP code below to see whether PFAS has been detected in your specific water system, and get personalized filter recommendations based on your actual water report.</p>
      </>
    ),
  },

  'best-water-filter-for-lead-removal': {
    title: 'Best Water Filter for Lead Removal in 2026 (NSF Certified Only)',
    description: "Lead has no safe level in drinking water. We break down the only filter types that actually remove it — and which products are NSF 53 certified.",
    date: 'March 31, 2026',
    readTime: '7 min read',
    tag: 'Lead',
    tagColor: '#d97706',
    content: (
      <>
        <p>The EPA, the CDC, and the World Health Organization all agree: there is no safe level of lead in drinking water. Even low-level chronic exposure causes permanent neurological damage in children, and the effects are irreversible. Yet millions of Americans unknowingly drink water that travels through lead service lines or lead solder before it reaches their glass.</p>

        <h2>Where Does Lead Come From in Tap Water?</h2>
        <p>Lead doesn&apos;t come from the water source itself &mdash; it comes from the pipes. There are two main sources:</p>
        <p><strong>Lead service lines</strong> are the pipes that connect the water main under the street to your home. An estimated 9 million lead service lines are still in use across the US. Chicago alone has over 400,000. Cities like Pittsburgh, Milwaukee, Detroit, Baltimore, Newark, and Philadelphia have particularly high concentrations.</p>
        <p><strong>Lead solder</strong> was used to join copper pipes in homes built before 1986, when it was banned. If your home was built before 1986, there is a very good chance lead solder is inside your walls, and slightly acidic or soft water can leach it into your tap water over time.</p>
        <p>The older your home and the closer you are to an older urban core, the higher your risk. But lead contamination isn&apos;t limited to old cities &mdash; any home built before 1986 anywhere in the country may be affected.</p>

        <h2>How to Know If Lead Is in Your Water</h2>
        <p>You cannot taste, smell, or see lead in water. The only way to know is to test. Here&apos;s how:</p>
        <p><strong>Check your water utility&apos;s lead testing results.</strong> Under the Lead and Copper Rule, utilities must test water at high-risk homes and report results. Enter your ZIP on WaterCheckup to pull this data for your system.</p>
        <p><strong>Get your water tested independently.</strong> A simple lead test costs $20-$50 at most hardware stores or online. For a more complete picture, send a sample to a certified lab ($30-$100). Always test first-draw water (water that has been sitting in pipes overnight) for the most accurate lead reading.</p>
        <p><strong>Check whether you have a lead service line.</strong> Many cities now have online lookup tools where you can enter your address and see if your service line is lead, galvanized steel (which can accumulate lead), or copper. Contact your water utility directly if you&apos;re unsure.</p>

        <h2>Which Filters Actually Remove Lead?</h2>
        <p>This is critical: not all water filters remove lead. Only filters certified to NSF/ANSI Standard 53 for lead reduction are proven to remove it. Here&apos;s what works and what doesn&apos;t:</p>

        <p><strong>Reverse osmosis — best performance.</strong> RO systems remove 95-99% of lead. The membrane physically blocks lead particles, making it the most reliable option. An under-sink RO system filters all your drinking and cooking water continuously.</p>
        <p><strong>Activated carbon block filters (NSF 53 certified) — very effective.</strong> High-quality carbon block filters certified to NSF 53 remove lead well. Look specifically for the NSF 53 certification on the product label. Not all carbon filters are certified &mdash; a filter that only carries NSF 42 certification removes chlorine taste but not lead.</p>
        <p><strong>Distillation — effective but impractical.</strong> Distilled water has no lead, but countertop distillers are slow, use a lot of electricity, and produce flat-tasting water. Not recommended for most households.</p>
        <p><strong>Basic pitcher filters (without NSF 53) — do not remove lead.</strong> The standard Brita Pitcher uses activated carbon that reduces chlorine taste and odor but is NOT certified to remove lead. Always check the NSF certification, not the brand name.</p>

        <h2>Our Top Picks for Lead Removal</h2>

        <div style={{ background: '#071828', border: '1px solid #d97706', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#d97706', letterSpacing: 2, marginBottom: 8 }}>BEST OVERALL — UNDER-SINK RO</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Waterdrop G3P800 Reverse Osmosis</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.7 }}>Removes 99.9% of lead. NSF 58 certified. Tankless design installs under the sink. Also removes PFAS, arsenic, nitrates, chlorine, and 1,000+ other contaminants. Best all-around choice for homes with lead service lines.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <a href={WATERDROP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Get on Waterdrop →</a>
            <a href={`https://www.amazon.com/s?k=under+sink+reverse+osmosis+lead+removal+nsf+58&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #1a3a5c' }}>See on Amazon →</a>
          </div>
        </div>

        <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#059669', letterSpacing: 2, marginBottom: 8 }}>BEST FOR RENTERS — NSF 53 CERTIFIED PITCHER</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Waterdrop Pitcher — Lead Certified</div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.7 }}>NSF 53 certified for lead reduction. No installation. Sits on your counter or in your fridge. Affordable entry point for renters or anyone in temporary housing. Replace filter every 2-3 months.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <a href={WATERDROP} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Get on Waterdrop →</a>
            <a href={`https://www.amazon.com/s?k=water+filter+pitcher+nsf+53+lead+certified&tag=${AMAZON_TAG}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #1a3a5c' }}>See on Amazon →</a>
          </div>
        </div>

        <h2>What About Flushing the Tap?</h2>
        <p>You may have heard that running your tap for 30-60 seconds before drinking flushes out lead-contaminated water that has been sitting in pipes. This is partially true and can reduce lead exposure, but it is not a reliable long-term solution. It doesn&apos;t work if your lead service line is long, and it wastes water. A certified filter is the only reliable protection.</p>

        <h2>If You Have Young Children</h2>
        <p>Children under 6 are most vulnerable to lead poisoning because their developing brains absorb lead more readily. If you have young children and live in a home built before 1986, or in a city with known lead service lines, a certified filter is not optional &mdash; it&apos;s essential. The cost of a filter ($50-$400 depending on type) is trivial compared to the lifetime impact of lead on a child&apos;s cognitive development.</p>

        <h2>The Bottom Line</h2>
        <p>If you&apos;re in a pre-1986 home, near a city with lead service lines, or you&apos;ve never had your water tested, assume lead is a risk and filter accordingly. Buy NSF 53 certified. An under-sink RO system is the most comprehensive solution; a certified pitcher is the minimum for renters.</p>
        <p>Enter your ZIP below to see your water system&apos;s lead testing history and get specific filter recommendations for your area.</p>
      </>
    ),
  },

  'what-does-epa-water-violation-mean': {
    title: 'What Does an EPA Water Violation Actually Mean for Your Health?',
    description: "Your utility sent a notice. The news mentioned a violation. Here's what EPA water violations actually mean, how serious they are, and what you should do.",
    date: 'March 31, 2026',
    readTime: '6 min read',
    tag: 'EPA',
    tagColor: '#7c3aed',
    content: (
      <>
        <p>You open your mail and find a notice from your water utility. Or you see a news headline: &ldquo;Local water system issues violation notice.&rdquo; Your first reaction is probably alarm. But what does an EPA water violation actually mean? Should you stop drinking the tap water? Is it an emergency? The answer depends entirely on what type of violation it is.</p>

        <h2>Not All Violations Are Equal</h2>
        <p>The EPA categorizes water violations into several types, and they range from genuinely serious health threats to administrative paperwork failures. Here&apos;s the breakdown:</p>

        <h2>1. Maximum Contaminant Level (MCL) Violations</h2>
        <p>These are the most serious violations. An MCL violation means a regulated contaminant was detected in the water supply above the legally enforceable limit set by the EPA. Examples include lead exceeding the Action Level of 15 parts per billion, nitrates above 10 mg/L, or arsenic above 10 parts per billion.</p>
        <p>When an MCL violation occurs, the utility is required to notify customers within 30 days (or immediately for acute violations). The notice must explain what happened, what health risks it poses, and what steps are being taken.</p>
        <p>If you receive an MCL violation notice, take it seriously. Use bottled water or a certified filter for drinking and cooking until the issue is resolved and the utility confirms the water is back within limits.</p>

        <h2>2. Treatment Technique (TT) Violations</h2>
        <p>Some contaminants are regulated not by a specific concentration limit but by a required treatment process. Lead and copper, for example, are addressed through corrosion control treatment rather than a direct MCL. If a utility fails to implement the required treatment, it receives a Treatment Technique violation.</p>
        <p>TT violations can be serious &mdash; the Flint, Michigan water crisis began as a TT violation when the city failed to add corrosion inhibitors &mdash; or they can be minor procedural failures.</p>

        <h2>3. Monitoring and Reporting (M&R) Violations</h2>
        <p>These are the most common violations and are often the least alarming. An M&R violation means the utility failed to test for a contaminant on schedule, or failed to report the results on time. The water may be perfectly fine &mdash; they just didn&apos;t do the paperwork right or missed a testing window.</p>
        <p>However, M&R violations should still be taken seriously because they mean you don&apos;t actually know what&apos;s in your water. Lack of testing is not the same as safe water.</p>

        <h2>4. Public Notification (PN) Violations</h2>
        <p>If a utility had a violation but failed to notify customers within the required timeframe, they receive a separate Public Notification violation. This is often layered on top of another violation &mdash; not only did something go wrong, but they also didn&apos;t tell you in time.</p>

        <h2>How to Find Your Water System&apos;s Violation History</h2>
        <p>Every water utility in the US has a publicly searchable violation history in the EPA&apos;s Safe Drinking Water Information System (SDWIS). You can look up your system by name, PWSID (Public Water System ID), or ZIP code. WaterCheckup pulls this data automatically &mdash; enter your ZIP above to see your system&apos;s full violation history, including how many violations have occurred, what type they were, and how recently.</p>

        <h2>What Should You Do When There&apos;s a Violation?</h2>
        <p>Follow the instructions in the violation notice first. If it&apos;s an acute MCL violation for something like E. coli or nitrate above safe levels, the utility will typically issue a &ldquo;Do Not Drink&rdquo; or &ldquo;Boil Water&rdquo; advisory. Follow those instructions immediately.</p>
        <p>For non-acute violations, the right response depends on the contaminant:</p>
        <ul>
          <li><strong>Lead violation:</strong> Use a certified NSF 53 filter or switch to bottled water. Don&apos;t rely on boiling &mdash; boiling concentrates lead.</li>
          <li><strong>Nitrate violation:</strong> Do not use tap water for infant formula or give to babies under 6 months. Adults are less vulnerable to nitrates but should still filter or use bottled water until resolved.</li>
          <li><strong>PFAS detection above limits:</strong> Use an RO system or certified PFAS filter. These chemicals don&apos;t go away quickly.</li>
          <li><strong>Disinfection byproduct (THM/HAA) violation:</strong> A quality carbon block filter reduces these. Long-term, push your utility to upgrade their treatment process.</li>
          <li><strong>Monitoring violation only:</strong> Consider getting an independent water test to know what&apos;s actually in your water while the utility gets back on track.</li>
        </ul>

        <h2>The Bigger Picture: EPA Limits Are Not Health Limits</h2>
        <p>Here&apos;s something most people don&apos;t know: EPA maximum contaminant levels are set based on what is technically and economically feasible &mdash; not necessarily what is safe. For many contaminants, independent health scientists consider the EPA limits too permissive.</p>
        <p>This means a utility can have zero violations and still deliver water with contaminants at levels that health researchers consider elevated risk. The EWG Health Guidelines, for example, are often 10-100x stricter than EPA MCLs. That&apos;s why WaterCheckup shows both the EPA legal limit and the EWG health guideline for detected contaminants &mdash; so you can see the full picture, not just whether your utility is technically compliant.</p>

        <h2>The Bottom Line</h2>
        <p>An EPA water violation is worth taking seriously, but the right response depends entirely on the type and severity. An MCL violation for lead or nitrate is an immediate health concern. A monitoring violation for a routine test means your utility dropped the administrative ball, which is concerning for different reasons. In either case, knowing what&apos;s in your water is the first step.</p>
        <p>Enter your ZIP below to see your water system&apos;s full violation history and current contaminant data, along with recommendations for filtration based on what&apos;s actually been detected in your area.</p>
      </>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found | WaterCheckup' };
  return {
    title: `${post.title} | WaterCheckup`,
    description: post.description,
    alternates: { canonical: `https://watercheckup.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://watercheckup.com/blog/${params.slug}`,
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
          Check My ZIP →
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: '#1e3a5f', marginBottom: 24 }}>
          <Link href="/blog" style={{ color: '#0891b2', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 8px' }}>→</span>
          <span>{post.tag}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, background: `${post.tagColor}20`, color: post.tagColor, border: `1px solid ${post.tagColor}40` }}>
            {post.tag}
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', margin: '16px 0 12px', lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: '0 0 16px', lineHeight: 1.7 }}>{post.description}</p>
          <div style={{ fontSize: 12, color: '#1e3a5f' }}>{post.date} · {post.readTime} · By J. Letorney</div>
        </div>

        {/* Content */}
        <div style={{
          fontSize: 16,
          lineHeight: 1.85,
          color: '#94a3b8',
        }}>
          <style>{`
            .blog-content h2 { font-size: 22px; font-weight: 800; color: #f1f5f9; margin: 40px 0 16px; }
            .blog-content p { margin: 0 0 20px; }
            .blog-content ul { margin: 0 0 20px; padding-left: 24px; }
            .blog-content li { margin-bottom: 10px; }
            .blog-content strong { color: #e2e8f0; font-weight: 700; }
            .blog-content a { color: #0891b2; }
          `}</style>
          <div className="blog-content">
            {post.content}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, padding: '32px', background: 'linear-gradient(135deg,#071828,#040d14)', border: '1px solid #0891b2', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>
            See what&apos;s actually in your water
          </div>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            Enter your ZIP for a free EPA water quality report with PFAS data, violation history, and personalized filter recommendations.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to all guides</Link>
        </div>
      </div>
    </div>
  );
}
