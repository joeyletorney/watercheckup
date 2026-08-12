import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };

const g = globalThis as unknown as { __wcRateBuckets?: Map<string, Bucket> };
if (!g.__wcRateBuckets) g.__wcRateBuckets = new Map<string, Bucket>();

function prune() {
  const now = Date.now();
  const m = g.__wcRateBuckets!;
  m.forEach((v, k) => {
    if (v.resetAt < now) m.delete(k);
  });
}

/**
 * In-memory fixed window per warm serverless instance / Node process.
 * Mitigates casual abuse; not a substitute for edge + shared store at huge scale.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  prune();
  const now = Date.now();
  const m = g.__wcRateBuckets!;
  let b = m.get(key);
  if (!b || b.resetAt < now) {
    b = { count: 1, resetAt: now + windowMs };
    m.set(key, b);
    return { ok: true };
  }
  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  b.count += 1;
  return { ok: true };
}

/**
 * Shared rate limit via Vercel Runtime Cache when available; falls back to in-memory.
 * Soft-limit (non-atomic under concurrency) but works across instances in a region.
 */
export async function checkRateLimitShared(
  key: string,
  max: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  try {
    const { getCache } = await import('@vercel/functions');
    const cache = getCache({ namespace: 'wc-rate' });
    const windowId = Math.floor(Date.now() / windowMs);
    const bucketKey = `${key}:${windowId}`;
    const current = await cache.get(bucketKey);
    const count = typeof current === 'number' ? current : 0;
    if (count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil(((windowId + 1) * windowMs - Date.now()) / 1000));
      return { ok: false, retryAfterSec };
    }
    await cache.set(bucketKey, count + 1, {
      ttl: Math.ceil(windowMs / 1000) + 2,
      name: 'rate-limit',
    });
    return { ok: true };
  } catch {
    return checkRateLimit(key, max, windowMs);
  }
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  return 'unknown';
}

export const RATE = {
  sendEmailPerIp: { max: 8, windowMs: 15 * 60 * 1000 },
  sendEmailPerEmail: { max: 5, windowMs: 60 * 60 * 1000 },
  newsletterSubscribePerIp: { max: 25, windowMs: 15 * 60 * 1000 },
  newsletterSubscribePerEmail: { max: 8, windowMs: 60 * 60 * 1000 },
  unsubscribeGetPerIp: { max: 40, windowMs: 15 * 60 * 1000 },
  utilityClaimPerIp: { max: 10, windowMs: 15 * 60 * 1000 },
  utilityClaimPerEmail: { max: 5, windowMs: 60 * 60 * 1000 },
  // Tighter now that shared Runtime Cache enforces across instances
  waterLookupPerIp: { max: 30, windowMs: 60 * 1000 },
  waterLookupPerZip: { max: 12, windowMs: 60 * 1000 },
  // Social previews + crawlers; stops retry storms on OG generation
  ogPerIp: { max: 40, windowMs: 60 * 1000 },
} as const;
