import { COMMERCIAL_GUIDES } from '@/app/blog/commercial-guide-data';
import { AffiliateLink } from '@/components/AffiliateLink';
import { JourneyLink } from '@/components/JourneyLink';
import { GUIDE_STARTING_POINTS, guideQuizHref } from '@/lib/guide-journey';

export function BlogCommercialComparison({ slug }: { slug: string }) {
  const guide = COMMERCIAL_GUIDES[slug];
  if (!guide) return null;
  const buttonStyle = { display: 'inline-block', padding: '10px 14px', borderRadius: 8, background: '#0369a1', color: '#fff', fontWeight: 700, textDecoration: 'none', maxWidth: '100%' } as const;
  return <section aria-labelledby="commercial-comparison-heading" style={{ margin: '28px 0 40px', color: 'inherit' }}>
    <h2 id="commercial-comparison-heading" style={{ fontSize: 23, marginBottom: 12 }}>Quick comparison: choose by need</h2>
    <p style={{ lineHeight: 1.7 }}>{guide.verdict}</p>
    <p style={{ fontSize: 13, lineHeight: 1.6 }}>Official sources checked November 11, 2026. Document review, not hands-on testing. Prices and availability can change. Amazon links may earn us a commission.</p>
    <nav className="wc-guide-start" aria-label="Choose a comparison starting point">
      <h3>Find your starting point</h3>
      <div>{(GUIDE_STARTING_POINTS[slug] || []).map((point, index) => <JourneyLink key={point.label} href={`#comparison-option-${index + 1}`} eventName="guide_option_selected" step={`option_${index + 1}`} page={`/blog/${slug}`}><strong>{point.label}{'\u00a0→'}</strong><span>{point.detail}</span></JourneyLink>)}</div>
    </nav>
    <div style={{ display: 'grid', gap: 16 }}>
      {guide.choices.map((choice, index) => <article id={`comparison-option-${index + 1}`} tabIndex={-1} className="wc-guide-choice" key={choice.option} style={{ padding: 18, border: '1px solid #64748b', borderRadius: 10, minWidth: 0, overflowWrap: 'anywhere', fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>{choice.option}</h3>
        <p style={{ margin: '0 0 10px' }}>{choice.fit}</p>
        {choice.merchant && <p style={{ margin: '0 0 12px' }}>
          {choice.merchant.sponsored
            ? <AffiliateLink href={choice.merchant.href} product={choice.option} brand={choice.merchant.brand} page={`/blog/${slug}`} destination="amazon" rel="sponsored noopener noreferrer" target="_blank" style={buttonStyle}>{choice.merchant.label}</AffiliateLink>
            : <JourneyLink href={choice.merchant.href} eventName="guide_next_step" step="manufacturer_reference" page={`/blog/${slug}`} rel="noopener noreferrer" target="_blank" style={buttonStyle}>{choice.merchant.label}</JourneyLink>}
          {!choice.merchant.sponsored && <small style={{ display: 'block' }}>Manufacturer link; cartridge only. A compatible pitcher is separate.</small>}
        </p>}
        <p style={{ margin: '0 0 10px' }}><strong>Setup limits: </strong>{choice.constraint}</p>
        {choice.costSummary && <p style={{ margin: '0 0 10px' }}><strong>Ownership cost: </strong>{choice.costSummary}</p>}
        <details><summary style={{ cursor: 'pointer', fontWeight: 700 }}>Official evidence and ownership costs</summary>
          <p>{choice.evidence} <a href={choice.source} style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 700 }}>Read official evidence →</a></p>
          <p><strong>Cost assumptions: </strong>{choice.cost}</p>
          <a href={choice.costSource ?? choice.source} style={{ color: 'inherit', textDecoration: 'underline' }}>Check official cost / specification source →</a>
        </details>
      </article>)}
    </div>
    <aside className="wc-guide-next" aria-labelledby="wc-guide-next-heading">
      <h3 id="wc-guide-next-heading">Still deciding?</h3>
      <p>Check the exact model and claim, setup requirements, replacement schedule and total upkeep before buying.</p>
      <div>
        <JourneyLink href={guideQuizHref(slug)} eventName="guide_next_step" step="filter_quiz" page={`/blog/${slug}`}>Help me choose: 3-question quiz →</JourneyLink>
        <JourneyLink href="/#wc-hero-anchor" eventName="guide_next_step" step="supplier_report" page={`/blog/${slug}`}>Check my supplier’s records →</JourneyLink>
        <JourneyLink href="/blog/how-to-test-your-tap-water-mail-in-labs-explained" eventName="guide_next_step" step="testing_guide" page={`/blog/${slug}`}>Understand tap-water testing →</JourneyLink>
      </div>
    </aside>
  </section>;
}
