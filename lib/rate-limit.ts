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
} as const;
