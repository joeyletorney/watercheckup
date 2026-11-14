import Image from 'next/image';
import type { TopPickRow } from '@/app/blog/post-types';
import { getBlogTopPicksHeading } from '@/lib/blog-top-picks';
import { lookupFilterProductImage } from '@/lib/filter-product-images';
import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';
import { preferredAmazonPurchaseUrl } from '@/lib/home-shopping';
import { clearlyFilteredDirectUrl, isClearlyFilteredBrand } from '@/lib/waterdrop-buy';
import { AffiliateLink } from '@/components/AffiliateLink';

type Props = {
  picks: TopPickRow[];
  /** Short label under the tab — optional context line */
  subtitle?: string;
};

export function BlogTopPicks({ picks, subtitle }: Props) {
  const available = picks.filter(p => !p.outOfStock);
  const budget = [...available].sort((a, b) =>
    (Number(a.price.replace(/[^0-9.]/g, '')) || Infinity) -
    (Number(b.price.replace(/[^0-9.]/g, '')) || Infinity))[0];
  const renter = available.find(p => /countertop|pitcher|no.install/i.test(`${p.product} ${p.badge}`));
  const homeowner = available.find(p => /under.sink|under.counter/i.test(`${p.product} ${p.badge}`));
  const visible = Array.from(new Set([budget, renter, homeowner, ...available].filter((p): p is TopPickRow => !!p))).slice(0, 3);
  const skipped = picks.filter(p => p.outOfStock).length;
  const tabLabel = getBlogTopPicksHeading(visible.length);

  if (visible.length === 0) {
    return (
      <div className="wc-blog-top-picks wc-blog-top-picks--empty" role="region" aria-label="Product recommendations">
        <div className="wc-blog-top-picks__tab">TOP PICKS</div>
        <p className="wc-blog-top-picks__empty-msg">
          Product links are being updated. Use the{' '}
          <a href="/quiz">filter quiz</a> or <a href="/">ZIP report</a> to compare options and evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="wc-blog-top-picks" role="region" aria-label="Product recommendations">
      <div className="wc-blog-top-picks__tab">{tabLabel}</div>
      {subtitle ? <p className="wc-blog-top-picks__subtitle">{subtitle}</p> : null}
      {skipped > 0 ? (
        <p className="wc-blog-top-picks__oos-note">
          {skipped === 1
            ? 'One listed option is unavailable — showing other options to compare.'
            : `${skipped} listed options are unavailable — showing other options to compare.`}
        </p>
      ) : null}
      <p className="wc-blog-top-picks__subtitle">A filter may not be necessary. First confirm your supplier and a documented concern. These are options to compare, not a guarantee of every household result.</p>
      <div className="wc-blog-top-picks__list">
        {visible.map((pick, i) => {
          const preferredAmazon = preferredAmazonPurchaseUrl(pick.amazon);
          const showDirect = !preferredAmazon && (pick.brand === 'Waterdrop' || isClearlyFilteredBrand(pick.brand));
          const directHref =
            pick.brand === 'Waterdrop'
              ? pick.link
              : clearlyFilteredDirectUrl(pick.link);
          const directLabel =
            pick.brand === 'Waterdrop' ? 'Check price at Waterdrop →' : 'Check price at Clearly Filtered →';
          const imgSrc = lookupFilterProductImage(pick);
          return (
            <div
              key={`${pick.brand}-${pick.product}`}
              className={`wc-blog-top-picks__card${i === 0 ? ' wc-blog-top-picks__card--featured' : ''}`}
            >
              <div className="wc-blog-top-picks__card-main">
                {imgSrc ? (
                  <div className="wc-blog-top-picks__thumb-wrap">
                    <Image
                      src={imgSrc}
                      alt=""
                      width={72}
                      height={72}
                      className="wc-blog-top-picks__thumb"
                      sizes="72px"
                    />
                  </div>
                ) : null}
                <div className="wc-blog-top-picks__rank">#{i + 1}</div>
                <div>
                  <div className="wc-blog-top-picks__product-row">
                    <div className="wc-blog-top-picks__product">{pick.product}</div>
                    {pick.badge ? (
                      <span className="wc-blog-top-picks__badge">{pick.badge}</span>
                    ) : null}
                  </div>
                  <div className="wc-blog-top-picks__meta">
                    {pick.brand} · {pick.price}
                  </div>
                  <div className="wc-blog-top-picks__reason">{pick === budget ? 'Lowest listed upfront cost among these options. ' : pick === renter ? 'No permanent plumbing changes; compare its tank or cartridge capacity. ' : pick === homeowner ? 'Under-sink option for a homeowner who can install a dedicated system. ' : ''}Compare the exact model and cartridge’s current contaminant-reduction listing, rated capacity, and annual replacement cost before buying.</div>
                </div>
              </div>
              <div className="wc-blog-top-picks__actions">
                {showDirect ? (
                  <AffiliateLink
                    href={directHref}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    product={pick.product}
                    destination="direct"
                    page="blog"
                    brand={pick.brand}
                    className={i === 0 ? 'wc-blog-top-picks__btn wc-blog-top-picks__btn--primary' : 'wc-blog-top-picks__btn wc-blog-top-picks__btn--secondary'}
                  >
                    {directLabel}
                  </AffiliateLink>
                ) : (
                  <AffiliateLink
                    href={preferredAmazon ?? normalizeAmazonUrl(pick.amazon) ?? pick.amazon}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    product={pick.product}
                    destination="amazon"
                    page="blog"
                    brand={pick.brand}
                    className="wc-blog-top-picks__btn wc-blog-top-picks__btn--primary"
                    aria-label={`Check price on Amazon for ${pick.product}`}
                  >
                    Check price on Amazon →
                  </AffiliateLink>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
