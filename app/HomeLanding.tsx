import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from './components/SiteHeader';
import { HomeFilterShop } from '@/components/HomeFilterShop';
import { buildHomeShoppingCategories } from '@/lib/home-shopping';
import { HomeNewsletterSignup } from '@/components/HomeNewsletterSignup';
import { WaterSearch } from '@/components/WaterSearch';
import { HomeStickyCta } from '@/components/HomeStickyCta';
import { HOME_FAQS } from '@/lib/site-faq-schema';

/** Keep the homepage content on the server; only search, category selection and signup need browser code. */
export default function HomeLanding() {
  return <div className="wc-home-simple" style={{ minHeight: '100vh', position: 'relative', color: '#e2e8f0' }}>
    <SiteHeader variant="bar" navStyle={{ marginLeft: 'auto' }} />
    <HomeStickyCta />
    <section id="wc-hero-anchor" aria-labelledby="wc-home-heading" style={{ margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
      <div className="wc-home-simple-intro">
        <h1 id="wc-home-heading">What’s in your local water?</h1>
        <p>Free water report by ZIP or city. No signup.</p>
        <Link href="/about" className="wc-founder-intro">
          <Image src="/joe-letorney.jpeg" alt="" width={44} height={44} />
          <span><strong>Recommendations from Joe Letorney — Water Expert</strong><span>30 years in water treatment · Meet Joe →</span></span>
        </Link>
      </div>
      <WaterSearch />
    </section>
    <HomeFilterShop categories={buildHomeShoppingCategories()} />
      <div className="wc-home-shortcuts">
        <section className="wc-home-expert" aria-labelledby="wc-home-expert-heading">
          <Image src="/joe-letorney.jpeg" alt="Joe Letorney, founder of WaterCheckup" width={96} height={96} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <div><h2 id="wc-home-expert-heading">Recommendations from Joe Letorney — Water Expert</h2><p>30 years in water treatment · Former WQA Certified Water Treatment Specialist, Level VI. Compare published model evidence and practical installation needs.</p><Link href="/about">Meet Joe →</Link> · <Link href="/methodology">How we use water records →</Link></div>
        </section>
        <section aria-labelledby="wc-home-guides-heading"><h2 id="wc-home-guides-heading">Need help deciding?</h2><div className="wc-home-guide-links">
          <Link href="/blog/best-water-filter-for-lead-removal">Filters for lead concerns →</Link>
          <Link href="/blog/best-countertop-water-filter">Countertop and pitcher comparison →</Link>
          <Link href="/blog/best-water-filter-hard-water">Hard water: softener or filter? →</Link>
        </div></section>
        <details className="wc-home-resources"><summary>Explore water reports and learning resources</summary><div className="wc-home-guide-links">
          <Link href="/water">Browse city reports →</Link><Link href="/utilities">Find a water utility →</Link><Link href="/water-hardness">Hardness by ZIP →</Link><Link href="/contaminants">Understand contaminants →</Link><Link href="/rankings">Water rankings →</Link><Link href="/faq">Frequently asked questions →</Link><Link href="/blog">All guides →</Link>
        </div></details>
        <section aria-labelledby="wc-home-faq-heading" className="wc-home-faq">
          <h2 id="wc-home-faq-heading">Before you check your water</h2>
          {HOME_FAQS.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </section>
        <HomeNewsletterSignup />
      </div>

  </div>;
}
