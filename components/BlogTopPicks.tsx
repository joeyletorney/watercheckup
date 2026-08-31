import Image from 'next/image';
import type { TopPickRow } from '@/app/blog/post-types';
import { getBlogTopPicksHeading } from '@/lib/blog-top-picks';
import { lookupFilterProductImage } from '@/lib/filter-product-images';
import { normalizeAmazonUrl } from '@/lib/amazon-affiliate';
import { clearlyFilteredDirectUrl, isClearlyFilteredBrand } from '@/lib/waterdrop-buy';
import { AffiliateLink } from '@/components/AffiliateLink';

type Props = {
  picks: TopPickRow[];
  /** Short label under the tab — optional context line */
  subtitle?: string;
};

export function BlogTopPicks({ picks, subtitle }: Props) {
  const visible = picks.filter((p) => !p.outOfStock);
  const skipped = picks.length - visible.length;
  const tabLabel = getBlogTopPicksHeading(visible.length);

  if (visible.length === 0) {
    return (
      <div className="wc-blog-top-picks wc-blog-top-picks--empty" role="region" aria-label="Product recommendations">
        <div className="wc-blog-top-picks__tab">TOP PICKS</div>
        <p className="wc-blog-top-picks__empty-msg">
          Product links are being updated. Use the{' '}
          <a href="/quiz">filter quiz</a> or <a href="/">ZIP report</a> for current NSF-certified picks.
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
            ? 'One pick is temporarily unavailable — showing the next best NSF-certified options.'
            : `${skipped} picks are temporarily unavailable — showing in-stock NSF-certified options.`}
        </p>
      ) : null}
      <div className="wc-blog-top-picks__list">
        {visible.map((pick, i) => {
          const showDirect = pick.brand === 'Waterdrop' || isClearlyFilteredBrand(pick.brand);
          const directHref =
            pick.brand === 'Waterdrop'
              ? pick.link
              : clearlyFilteredDirectUrl(pick.link);
          const directLabel =
            pick.brand === 'Waterdrop' ? 'Buy Direct →' : 'ClearlyFiltered.com →';
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
                  <div className="wc-blog-top-picks__reason">{pick.reason}</div>
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
                    href={normalizeAmazonUrl(pick.amazon) ?? pick.amazon}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    product={pick.product}
                    destination="amazon"
                    page="blog"
                    brand={pick.brand}
                    className="wc-blog-top-picks__btn wc-blog-top-picks__btn--primary"
                  >
                    Amazon →
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
