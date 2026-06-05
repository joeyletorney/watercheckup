'use client';

import { TrustedFilterCategories } from '@/components/TrustedFilterCategories';
import { TRUSTED_PRODUCTS_BY_ID } from '@/lib/trusted-products-by-id';

type Props = {
  marginTop?: number;
};

/** Homepage-style “Most trusted filters” accordions — reusable site footer block. */
export function SiteTrustedFilterPicks({ marginTop = 72 }: Props) {
  return (
    <div style={{ marginTop }}>
      <TrustedFilterCategories productsById={TRUSTED_PRODUCTS_BY_ID} />
    </div>
  );
}
