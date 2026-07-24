import { getCache } from '@vercel/functions';

export type CachedWaterResponse = {
  status: number;
  body: Record<string, unknown>;
};

const NS = 'wc-water';
const TTL_SEC = 3600;

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
