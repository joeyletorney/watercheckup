import Link from 'next/link';
import { AffiliateLink } from '@/components/AffiliateLink';
import { conversionPicksFor, type ConversionPick } from '@/lib/conversion-picks';

type Props = {
  page: string;
  headingId: string;
  tone?: 'dark' | 'light';
  picks?: 'default' | 'wholeHouse' | ConversionPick[];
  heading?: string;
};

/** ZIP + quiz + tracked product picks — used mid-page and at the end of high-engagement routes. */
export function ConversionNextStep({
  page,
  headingId,
  tone = 'dark',
  picks = 'default',
  heading = 'What to do next',
}: Props) {
  const products = Array.isArray(picks) ? picks : conversionPicksFor(picks);
  return (
    <section
      className={`wc-next-step${tone === 'light' ? ' wc-next-step--light' : ''}`}
      aria-labelledby={headingId}
    >
      <p className="wc-next-step-eyebrow">YOUR NEXT STEP</p>
      <h2 id={headingId}>{heading}</h2>
      <p>
        Check your public-supplier records, then compare a filter only if a documented concern remains. A ZIP
        report is not a test of your own tap.
      </p>
      <div className="wc-next-step-actions">
        <Link href="/#wc-hero-anchor" className="wc-next-step-zip">
          Check your ZIP
        </Link>
        <Link href="/quiz" className="wc-next-step-quiz">
          Take the 60-second filter quiz
        </Link>
      </div>
      <p className="wc-next-step-picks-label">Recommended filter picks</p>
      <div className="wc-next-step-picks">
        {products.map((pick) => (
          <article key={`${pick.brand}-${pick.product}`} className="wc-next-step-pick">
            <div>
              <strong>{pick.product}</strong>
              <span>{pick.brand}</span>
              <p>{pick.reason}</p>
            </div>
            <AffiliateLink
              href={pick.href}
              product={pick.product}
              brand={pick.brand}
              destination={pick.destination}
              page={page}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="wc-buy-cta"
            >
              {pick.destination === 'direct' ? `Check price at ${pick.brand} →` : 'Check price on Amazon →'}
            </AffiliateLink>
          </article>
        ))}
      </div>
      <p className="wc-next-step-affiliate">
        As an Amazon Associate I earn from qualifying purchases. Waterdrop links use ref anbyjkqb. Confirm the
        live listing, model, and certification before buying.
      </p>
    </section>
  );
}
