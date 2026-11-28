'use client';

import type { ComponentProps } from 'react';
import { trackAffiliateClick, type AffiliateDestination } from '@/lib/affiliate-tracking';

type Props = ComponentProps<'a'> & {
  product: string;
  destination: AffiliateDestination;
  page: string;
  brand?: string;
  city?: string;
  zip?: string;
  productId?: string;
};

/** Sponsored outbound link with GA4 affiliate_click tracking. */
export function AffiliateLink({
  product,
  destination,
  page,
  brand,
  city,
  zip,
  productId,
  onClick,
  href,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      href={href}
      data-wc-affiliate-tracked="true"
      data-product={product}
      data-affiliate-href={typeof href === 'string' ? href : undefined}
      onClick={(e) => {
        const resolvedHref =
          (typeof href === 'string' && href) ||
          (e.currentTarget instanceof HTMLAnchorElement ? e.currentTarget.href : undefined);
        trackAffiliateClick({
          product,
          destination,
          page,
          brand,
          city,
          zip,
          productId,
          href: resolvedHref,
          linkUrl: resolvedHref,
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
