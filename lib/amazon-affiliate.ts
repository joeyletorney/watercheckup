/** Amazon Associates tag used sitewide for product links. */
export const AMAZON_ASSOCIATE_TAG = 'watercheck20-20';

/**
 * Stale or wrong ASINs → verified US listings (checked 2026).
 * Keys are legacy ASINs still present in older blog/copy.
 */
export const AMAZON_ASIN_REMAP: Record<string, string> = {
  B084HW5BMT: 'B08NDYVZV5', // Frizzlife SK99 → SK99-NEW
  B07ZY9RVN2: 'B07MFYQBTX', // Frizzlife MK99
  B0BK8ZRY2K: 'B083DFW1QS', // Frizzlife PD1000 → parent listing (PD1000-TAM4 color option)
  B01JSJFBNE: 'B07C3P2RZP', // Waterdrop 10-cup pitcher (was PT-04C / wrong product)
  B00CX8R5Q8: 'B0FN9Y9JSP', // Aquasana Claryum 3-stage → AQ-6300M Max Flow
};

export function extractAmazonAsin(url: string): string | null {
  const dp = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dp) return dp[1].toUpperCase();
  const gp = url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gp) return gp[1].toUpperCase();
  return null;
}

export function amazonDpUrl(asin: string, tag = AMAZON_ASSOCIATE_TAG): string {
  return `https://www.amazon.com/dp/${asin.trim().toUpperCase()}?tag=${tag}`;
}

/** Rewrite /dp/ and /gp/product/ links to current ASINs; leaves search URLs unchanged. */
export function normalizeAmazonUrl(url: string | undefined): string | undefined {
  if (!url || !/amazon\./i.test(url)) return url;
  if (/\/s\?/i.test(url)) return url;

  const asin = extractAmazonAsin(url);
  if (!asin) return url;

  const fixed = AMAZON_ASIN_REMAP[asin] ?? asin;
  const tagMatch = url.match(/[?&]tag=([^&]+)/i);
  const tag = tagMatch?.[1] ?? AMAZON_ASSOCIATE_TAG;
  return amazonDpUrl(fixed, tag);
}
