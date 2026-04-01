const RESEND_BASE = 'https://api.resend.com';

let cachedAudienceId: string | null = null;

/** GET/POST JSON to Resend REST API. */
export async function resendRequest(
  apiKey: string,
  path: string,
  options: { method?: string; body?: object } = {},
): Promise<Response> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}` };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  return fetch(`${RESEND_BASE}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

/**
 * Resolves the WaterCheckup audience: env override, cache, list, or create.
 * Matches subscribe flow so cron does not 404 when no one has subscribed yet.
 */
export async function getOrCreateWatercheckupAudienceId(apiKey: string): Promise<string | null> {
  const envId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (envId) return envId;
  if (cachedAudienceId) return cachedAudienceId;
  try {
    const res = await fetch(`${RESEND_BASE}/audiences`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { id: string; name?: string }[] };
    const existing = (data.data || []).find(a => a.name === 'WaterCheckup');
    if (existing) {
      cachedAudienceId = existing.id;
      return existing.id;
    }
    const created = await resendRequest(apiKey, '/audiences', {
      method: 'POST',
      body: { name: 'WaterCheckup' },
    });
    if (!created.ok) return null;
    const newAud = (await created.json()) as { id: string };
    cachedAudienceId = newAud.id;
    return newAud.id;
  } catch {
    return null;
  }
}

export type ResendAudienceContact = {
  id?: string;
  email?: string;
  unsubscribed?: boolean;
  data?: Record<string, string | undefined>;
};

/** All contacts in the audience (paginated; Resend uses limit + after cursor). */
export async function fetchAllAudienceContacts(
  apiKey: string,
  audienceId: string,
): Promise<ResendAudienceContact[]> {
  const all: ResendAudienceContact[] = [];
  let after: string | undefined;
  for (let guard = 0; guard < 500; guard++) {
    const url = new URL(`${RESEND_BASE}/audiences/${audienceId}/contacts`);
    url.searchParams.set('limit', '100');
    if (after) url.searchParams.set('after', after);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`Resend list contacts failed (${res.status})`);
    const payload = (await res.json()) as { data?: ResendAudienceContact[]; has_more?: boolean };
    const batch = payload.data || [];
    all.push(...batch);
    if (!payload.has_more || batch.length === 0) break;
    const lastId = batch[batch.length - 1]?.id;
    if (!lastId) break;
    after = lastId;
  }
  return all;
}
