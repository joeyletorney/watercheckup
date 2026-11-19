import { getCache } from '@vercel/functions';

export type CachedWaterResponse = {
  status: number;
  body: Record<string, unknown>;
};

const NS = 'wc-water-v3-epa-violation-table';
const TTL_SEC = 3600;
const LAST_GOOD_NS = 'wc-water-last-good-v1';
const LAST_GOOD_TTL_SEC = 7 * 24 * 3600;

/** Shared across serverless instances on Vercel (regional Runtime Cache). */
export async function getCachedWaterResponse(zip: string): Promise<CachedWaterResponse | null> {
  try {
    const cache = getCache({ namespace: NS });
    const hit = await cache.get(`zip:${zip}`);
    if (
      hit &&
      typeof hit === 'object' &&
      hit !== null &&
      'status' in hit &&
      'body' in hit &&
      typeof (hit as CachedWaterResponse).status === 'number'
    ) {
      return hit as CachedWaterResponse;
    }
  } catch {
    /* unsupported locally or cache unavailable */
  }
  return null;
}

/** Cache successful ZIP reports only — never 503/429. */
export async function setCachedWaterResponse(zip: string, value: CachedWaterResponse): Promise<void> {
  if (value.status !== 200) return;
  try {
    const cache = getCache({ namespace: NS });
    await cache.set(`zip:${zip}`, value, {
      ttl: TTL_SEC,
      tags: [`water-zip:${zip}`, 'water-zip'],
      name: 'water-zip-lookup',
    });
  } catch {
    /* ignore */
  }
}

export async function getLastGoodWaterResponse(zip: string): Promise<CachedWaterResponse | null> {
  try {
    const cache = getCache({ namespace: LAST_GOOD_NS });
    const hit = await cache.get(`zip:${zip}`);
    if (
      hit &&
      typeof hit === 'object' &&
      hit !== null &&
      'status' in hit &&
      'body' in hit &&
      typeof (hit as CachedWaterResponse).status === 'number'
    ) {
      return hit as CachedWaterResponse;
    }
  } catch {
    /* unsupported locally or cache unavailable */
  }
  return null;
}

/** Longer-lived copy of the last fully successful EPA-backed report for a ZIP. */
export async function setLastGoodWaterResponse(zip: string, value: CachedWaterResponse): Promise<void> {
  if (value.status !== 200) return;
  if (value.body.violationCoverage !== 'available') return;
  try {
    const cache = getCache({ namespace: LAST_GOOD_NS });
    await cache.set(`zip:${zip}`, value, {
      ttl: LAST_GOOD_TTL_SEC,
      tags: [`water-zip-last-good:${zip}`, 'water-zip-last-good'],
      name: 'water-zip-last-good',
    });
  } catch {
    /* ignore */
  }
}
