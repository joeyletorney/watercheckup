import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from './components/SiteHeader';
import { HomeFilterShop } from '@/components/HomeFilterShop';
import { buildHomeShoppingCategories } from '@/lib/home-shopping';
import { HomeNewsletterSignup } from '@/components/HomeNewsletterSignup';
import { WaterSearch } from '@/components/WaterSearch';
import { HomeStickyCta } from '@/components/HomeStickyCta';
import { HOME_FAQS } from '@/lib/site-faq-schema';
import { latestBlogLinks } from '@/lib/blog-hub-links';

/** Keep the homepage content on the server; only search, category selection and signup need browser code. */
export default function HomeLanding() {
  const latestPosts = latestBlogLinks(4);
  return <div className="wc-home-simple" style={{ minHeight: '100vh', position: 'relative', color: '#e2e8f0' }}>
    <SiteHeader variant="bar" navStyle={{ marginLeft: 'auto' }} />
    <HomeStickyCta />
    <section id="wc-hero-anchor" aria-labelledby="wc-home-heading" style={{ margin: '12px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
      <div className="wc-home-simple-intro">
        <h1 id="wc-home-heading">Is Your Tap Water Safe?</h1>
        <p>Check water quality by ZIP code — free water quality report, no signup.</p>
      </div>
      <WaterSearch autoFocusDesktop />
      <Link href="/about/joe-letorney" className="wc-founder-intro wc-founder-intro--below-search">
        <Image src="/joe-letorney.jpeg" alt="" width={44} height={44} />
        <span><strong>Recommendations from a real Water Expert</strong><span>30 years in water treatment · Meet Joe →</span></span>
      </Link>
    </section>
    <HomeFilterShop categories={buildHomeShoppingCategories()} />
      <section id="wc-zip-repeat" className="wc-home-zip-repeat" aria-labelledby="wc-zip-repeat-heading">
        <h2 id="wc-zip-repeat-heading">Still deciding? Check your ZIP</h2>
        <p>Your city average is not your tap. Look up your public water supplier, then take the 60-second filter quiz.</p>
        <WaterSearch variant="compact" idPrefix="wc-repeat" />
        <Link href="/quiz" className="wc-home-zip-repeat-quiz">Take the 60-second filter quiz →</Link>
      </section>
      <div className="wc-home-shortcuts">
        <section className="wc-home-expert" aria-labelledby="wc-home-expert-heading">
          <Image src="/joe-letorney.jpeg" alt="Joe Letorney, founder of WaterCheckup" width={96} height={96} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <div><h2 id="wc-home-expert-heading">Recommendations from a real Water Expert</h2><p>30 years in water treatment · Former WQA Certified Water Treatment Specialist, Level VI. Compare published model evidence and practical installation needs.</p><Link href="/about/joe-letorney">Meet Joe →</Link> · <Link href="/methodology">How we use water records →</Link></div>
        </section>
        <section aria-labelledby="wc-home-guides-heading"><h2 id="wc-home-guides-heading">Need help deciding?</h2><div className="wc-home-guide-links">
          <Link href="/lead">Lead in tap water →</Link>
          <Link href="/pfas">PFAS in tap water →</Link>
          <Link href="/blog/best-water-filter-for-lead-removal">Filters for lead concerns →</Link>
          <Link href="/blog/best-countertop-water-filter">Countertop and pitcher comparison →</Link>
          <Link href="/blog/best-water-filter-hard-water">Hard water: softener or filter? →</Link>
          {latestPosts.map((post) => (
            <Link key={post.href} href={post.href}>{post.label} →</Link>
          ))}
        </div></section>
        <details className="wc-home-resources"><summary>Explore water reports and learning resources</summary><div className="wc-home-guide-links">
          <Link href="/water">Browse city reports →</Link><Link href="/utilities">Find a water utility →</Link><Link href="/water/honolulu">Honolulu water quality →</Link><Link href="/water/state/maryland">Maryland tap water →</Link><Link href="/water-hardness">Hardness by ZIP →</Link><Link href="/contaminants">Understand contaminants →</Link><Link href="/rankings">Water rankings →</Link><Link href="/faq">Frequently asked questions →</Link><Link href="/about/joe-letorney">Meet Joe Letorney →</Link><Link href="/blog">All guides →</Link>
        </div></details>
        <section aria-labelledby="wc-home-faq-heading" className="wc-home-faq">
          <h2 id="wc-home-faq-heading">Before you check your water</h2>
          {HOME_FAQS.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </section>
        <HomeNewsletterSignup />
      </div>

  </div>;
}
