import type { TopPickRow } from '@/app/blog/post-types';
import { AMAZON_ASIN_REMAP, normalizeAmazonUrl } from '@/lib/amazon-affiliate';

/** Amazon ASIN → product image (same URLs as homepage catalog). */
const IMG_BY_ASIN: Record<string, string> = {
  B07P1XFYJP: 'https://www.waterdropfilter.com/cdn/shop/files/ui-wd-g3p600-vis.png?v=1762268602',
  B0CHZ8VQBB:
    'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dw8d7d3aab/images/large/AQ-SFRO2-CHR.png?sw=400&sh=400',
  B0GGTSFZMY:
    'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT-PDP-2000x2000-Undersink-1-2.webp?v=1758041969',
  B08746G2XX: 'https://www.waterdropfilter.com/cdn/shop/files/wd-product-contrast-wd-d6-b-img1.png?v=1762268602',
  B083DFW1QS:
    'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/PD1000_81efd50c-480c-4ee6-b809-c2312525621a.png?v=1757987339',
  B0BK8ZRY2K:
    'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/PD1000_81efd50c-480c-4ee6-b809-c2312525621a.png?v=1757987339',
  B0BHQRNGZ8: 'https://www.waterdropfilter.com/cdn/shop/files/ui-wd-k19-s-vis.png?v=1774504000',
  B0CQS3HQ8F:
    'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT-PDP-2000x2000-Classic-1-1_bd723f43-efb1-4f23-b772-9352d7d7179b.webp?v=1758659574',
  B08NDYVZV5:
    'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/SK99_85cce087-8e10-4b22-8462-605ed3b2ae72.png?v=1757989183',
  B084HW5BMT:
    'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/SK99_85cce087-8e10-4b22-8462-605ed3b2ae72.png?v=1757989183',
  B07MFYQBTX: 'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/MK99-B.png?v=1757994240',
  B07ZY9RVN2: 'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/MK99-B.png?v=1757994240',
  B076S1W5QY: 'https://www.epicwaterfilters.com/cdn/shop/files/Smartshieldmexicowhitebox.png?v=1767726801',
  B076B6FXT5:
    'https://cdn.shopify.com/s/files/1/1011/0318/files/NewPitcher_PDP_1_33692813-0a8f-4ee9-9f9c-4de3c5a6e397.png?v=1724107995',
  B0DWTTYTQN: 'https://shop.culligan.com/cdn/shop/files/UMC_10C_White_Zoom_IAPMO.jpg?v=1769531157',
  B09LKTLVNR: 'https://www.pur.com/wp-content/uploads/product_ppt111w_pour_digital.png',
  B07C3P2RZP: 'https://m.media-amazon.com/images/I/71J2Klen7iL._AC_SL1500_.jpg',
  B01JSJFBNE: 'https://m.media-amazon.com/images/I/71J2Klen7iL._AC_SL1500_.jpg',
  B009V9K6BY: 'https://www.pur.com/wp-content/uploads/pfm200ba_product_on.png',
  B00006IV0P:
    'https://images.ctfassets.net/bugnyha6so6z/7J48JJcS8QKR5EDvlOXyvF/911c777794cec4fd4e823ab8c66f048a/PCP_-_Elite_Faucet_-_Silver_-_1_filter_1x.webp',
  B008GNRMYK: 'https://www.ispringwatersystems.com/wp-content/uploads/2023/06/WGB32B_main_jpg-103980-2400x2400-2.jpg',
  B00XAJJVHQ:
    'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dwe94bfae0/images/large/WH-1000.png?sw=800&sh=800',
  B01LFMTYBM: 'https://www.expresswater.com/cdn/shop/files/WH300SCKS-01_1292x.jpg?v=1771889437',
  B0FYCRPXLZ: 'https://www.waterdropfilter.com/cdn/shop/files/ui-WHF3T-PG.png?v=1762269824',
  B01MUBU0YC: 'https://cdn.shopify.com/s/files/1/1325/7307/products/SF100.jpg?v=1765436914',
  B0FLHFTGYD:
    'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT_-_Shower_-_PDP_01_-_Nickel.jpg?v=1773655036',
  B01N2YMU3O: 'https://www.hquatech.com/wp-content/uploads/2025/08/OWS-12%E6%96%B0.jpg',
  B08TMZYYQY: 'https://123filter-com.b-cdn.net/ac/image/thumbnails/1b/d9/WCFM500K_png-114071-750x750.png',
  B078GHJ921:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=400&q=80',
  B0FN9Y9JSP:
    'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dw8d7d3aab/images/large/AQ-6300M-BN.png?sw=400&sh=400',
  B00CX8R5Q8:
    'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dw8d7d3aab/images/large/AQ-6300M-BN.png?sw=400&sh=400',
};

/** Name aliases when ASIN is missing (search URLs, etc.). */
const IMG_BY_PRODUCT_KEY: Record<string, string> = {
  'waterdrop g3p600': IMG_BY_ASIN.B07P1XFYJP,
  'waterdrop g3p600 ro': IMG_BY_ASIN.B07P1XFYJP,
  'aquasana smartflow ro': IMG_BY_ASIN.B0CHZ8VQBB,
  'aquatru under-sink ro': IMG_BY_ASIN.B0GGTSFZMY,
  'waterdrop d6': IMG_BY_ASIN.B08746G2XX,
  'frizzlife pd1000-tam4': IMG_BY_ASIN.B083DFW1QS,
  'waterdrop k19-s countertop ro': IMG_BY_ASIN.B0BHQRNGZ8,
  'aquatru classic': IMG_BY_ASIN.B0CQS3HQ8F,
  'frizzlife sk99': IMG_BY_ASIN.B08NDYVZV5,
  'frizzlife mk99': IMG_BY_ASIN.B07MFYQBTX,
  'epic smart shield': IMG_BY_ASIN.B076S1W5QY,
  'aquasana claryum 3-stage': IMG_BY_ASIN.B0FN9Y9JSP,
  'clearly filtered 3.5l pitcher': IMG_BY_ASIN.B076B6FXT5,
  'clearly filtered water pitcher': IMG_BY_ASIN.B076B6FXT5,
  'zerowater 10-cup pitcher': IMG_BY_ASIN.B0DWTTYTQN,
  'pur plus 11-cup pitcher': IMG_BY_ASIN.B09LKTLVNR,
  'waterdrop pitcher filter': IMG_BY_ASIN.B07C3P2RZP,
  'pur plus faucet mount fm2000b': IMG_BY_ASIN.B009V9K6BY,
  'brita complete faucet filtration': IMG_BY_ASIN.B00006IV0P,
  'aquasana rhino eq-1000': IMG_BY_ASIN.B00XAJJVHQ,
  'ispring wgb32b 3-stage': IMG_BY_ASIN.B008GNRMYK,
  'ispring wgb32b whole house 3-stage': IMG_BY_ASIN.B008GNRMYK,
  'express water wh300scks': IMG_BY_ASIN.B01LFMTYBM,
  'waterdrop whf3t-pg': IMG_BY_ASIN.B0FYCRPXLZ,
  'aquabliss high output sf100': IMG_BY_ASIN.B01MUBU0YC,
  'aquatru shower filter': IMG_BY_ASIN.B0FLHFTGYD,
  'hqua-ows-12 uv sterilizer': IMG_BY_ASIN.B01N2YMU3O,
  'ispring wcfm500k iron & sulfur (well)': IMG_BY_ASIN.B08TMZYYQY,
  'co-z 4l stainless distiller': IMG_BY_ASIN.B078GHJ921,
  'fleck 5600sxt 48,000 grain': 'https://flecksystems.com/cdn/shop/files/fleck-5600-sxt.jpg?v=1686769528',
  'harmony series 48,000 grain (as-hs48d)':
    'https://cdn.shopify.com/s/files/1/0298/3097/1451/files/AS-HS48D_01_189f6fc3-896b-490b-bc59-9dd56b5c6486.jpg?v=1710969251',
};

function extractAsin(url: string): string | null {
  const dp = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dp) return dp[1].toUpperCase();
  const gp = url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gp) return gp[1].toUpperCase();
  return null;
}

export function lookupFilterProductImage(pick: TopPickRow): string | undefined {
  if (pick.img) return pick.img;
  const rawAsin = extractAsin(pick.amazon);
  const asin = rawAsin ? (AMAZON_ASIN_REMAP[rawAsin] ?? rawAsin) : null;
  if (asin && IMG_BY_ASIN[asin]) return IMG_BY_ASIN[asin];
  const key = pick.product.trim().toLowerCase();
  if (IMG_BY_PRODUCT_KEY[key]) return IMG_BY_PRODUCT_KEY[key];
  const brandProduct = `${pick.brand} ${pick.product}`.trim().toLowerCase();
  if (IMG_BY_PRODUCT_KEY[brandProduct]) return IMG_BY_PRODUCT_KEY[brandProduct];
  return undefined;
}

export function attachProductImages(picks: TopPickRow[]): TopPickRow[] {
  return picks.map((pick) => {
    const amazon = pick.amazon ? normalizeAmazonUrl(pick.amazon) : pick.amazon;
    const normalized = amazon && amazon !== pick.amazon ? { ...pick, amazon } : pick;
    const img = lookupFilterProductImage(normalized);
    return img ? { ...normalized, img } : normalized;
  });
}

/** Hostnames allowed for Next.js Image in blog/product thumbnails. */
export const FILTER_PRODUCT_IMAGE_HOSTS = [
  'images.unsplash.com',
  'www.waterdropfilter.com',
  'www.aquasana.com',
  'cdn.shopify.com',
  'www.epicwaterfilters.com',
  'www.pur.com',
  'shop.culligan.com',
  'images.ctfassets.net',
  'www.ispringwatersystems.com',
  'www.expresswater.com',
  'www.hquatech.com',
  '123filter-com.b-cdn.net',
  'flecksystems.com',
  'cdn11.bigcommerce.com',
  'm.media-amazon.com',
] as const;
