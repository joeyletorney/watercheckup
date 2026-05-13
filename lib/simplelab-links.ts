/**
 * SimpleLab (Tap Score) — Awin affiliate URLs.
 *
 * **Option A (recommended):** Paste full URLs from Awin → Toolbox → Link Builder
 * (or Advertiser → SimpleLab → Promote), one per destination.
 *   NEXT_PUBLIC_SIMPLELAB_AWIN_URL
 *   NEXT_PUBLIC_SIMPLELAB_AWIN_WELL_URL
 *   NEXT_PUBLIC_SIMPLELAB_AWIN_CITY_URL
 *
 * **Option B:** Set your publisher ID + SimpleLab’s advertiser ID on Awin (`awinmid`).
 * We build: https://www.awin1.com/cread.php?awinmid=…&awinaffid=…&ued=…
 *   NEXT_PUBLIC_AWIN_PUBLISHER_ID   — number next to your name (e.g. 2847509)
 *   NEXT_PUBLIC_AWIN_SIMPLELAB_MERCHANT_ID — on SimpleLab’s programme page in Awin (Advertiser / programme ID)
 *
 * Find `awinmid`: Awin → Advertisers → open SimpleLab / Tap Score → programme details or URL often shows the merchant ID.
 *
 * If nothing is set, falls back to mytapscore.com + utm_source=watercheckup.
 */

const FALLBACK_HOME =
  'https://mytapscore.com/?utm_source=watercheckup';
const FALLBACK_WELL =
  'https://mytapscore.com/collections/well-water-tests?utm_source=watercheckup';
const FALLBACK_CITY_TESTS =
  'https://mytapscore.com/collections/city-water-tests?utm_source=watercheckup';

const DEST_HOME = 'https://mytapscore.com/';
const DEST_WELL = 'https://mytapscore.com/collections/well-water-tests';
const DEST_CITY_TESTS = 'https://mytapscore.com/collections/city-water-tests';

function buildAwinDeepLink(destination: string): string | null {
  const aff = process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID?.trim();
  const mid = process.env.NEXT_PUBLIC_AWIN_SIMPLELAB_MERCHANT_ID?.trim();
  if (!aff || !mid) return null;
  if (!/^\d+$/.test(aff) || !/^\d+$/.test(mid)) return null;
  const ued = encodeURIComponent(destination);
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${aff}&ued=${ued}`;
}

function resolveUrl(
  explicit: string | undefined,
  destination: string,
  fallback: string,
): string {
  const full = explicit?.trim();
  if (full) return full;
  return buildAwinDeepLink(destination) ?? fallback;
}

export const SIMPLELAB_HOME_URL = resolveUrl(
  process.env.NEXT_PUBLIC_SIMPLELAB_AWIN_URL,
  DEST_HOME,
  FALLBACK_HOME,
);

export const SIMPLELAB_WELL_TESTS_URL = resolveUrl(
  process.env.NEXT_PUBLIC_SIMPLELAB_AWIN_WELL_URL,
  DEST_WELL,
  FALLBACK_WELL,
);

/** Municipal / city water mail-in panels (Tap Score). Override with NEXT_PUBLIC_SIMPLELAB_AWIN_CITY_URL if needed. */
export const SIMPLELAB_CITY_TESTS_URL = resolveUrl(
  process.env.NEXT_PUBLIC_SIMPLELAB_AWIN_CITY_URL,
  DEST_CITY_TESTS,
  FALLBACK_CITY_TESTS,
);
