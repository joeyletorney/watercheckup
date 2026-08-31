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
};

/** Sponsored outbound link with GA4 affiliate_click tracking. */
export function AffiliateLink({
  product,
  destination,
  page,
  brand,
  city,
  zip,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackAffiliateClick({ product, destination, page, brand, city, zip });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
