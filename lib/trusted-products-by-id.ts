import type { TrustedFilterProduct } from '@/components/TrustedFilterCategories';
import { PRODUCTS } from '@/lib/home-products-catalog';
import { isClearlyFilteredBrand, isWaterdropBrand } from '@/lib/waterdrop-buy';

export const TRUSTED_PRODUCTS_BY_ID: Record<number, TrustedFilterProduct | undefined> =
  Object.fromEntries(
    PRODUCTS.map((p) => [
      p.id,
      {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        cert: p.cert as string[] | undefined,
        catLabel: p.catLabel as string | undefined,
        amazon:
          p.outOfStock || isWaterdropBrand(p.brand) || isClearlyFilteredBrand(p.brand)
            ? undefined
            : (p.amazon as string | undefined),
        brandLink: p.brandLink as string | undefined,
        outOfStock: p.outOfStock as boolean | undefined,
      },
    ]),
  );
