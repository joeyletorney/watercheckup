/**
 * Upsert contacts to Brevo for marketing lists & segmentation.
 * Optional: set BREVO_API_KEY. If missing, calls no-op.
 *
 * In Brevo → Contacts → Settings → Contact attributes, create TEXT (or number for WATER_SCORE):
 * ZIP, WEEKLY_OPT_IN, SOURCE, SIGNUP_AT, CITY, PWSID, ALERT_OPT_IN, WATER_SCORE, WATER_GRADE, SYSTEM_NAME, SIGNUP_SOURCE
 * (Omit any you don’t use; unknown attributes may cause 400 — we retry with email + lists only.)
 */

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

function parseListIds(raw: string | undefined): number[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;\s]+/)
    .map(s => parseInt(s.trim(), 10))
    .filter(n => Number.isFinite(n) && n > 0);
}

function buildAttributes(entries: Record<string, string | number | boolean | undefined | null>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(entries)) {
    if (v === undefined || v === null || v === '') continue;
    const key = k.toUpperCase();
    out[key] = typeof v === 'boolean' ? (v ? 'true' : 'false') : typeof v === 'number' ? v : String(v);
  }
  return out;
}

export type BrevoSyncInput = {
  email: string;
  /** Brevo contact attributes (stored UPPERCASE in API body). */
  attributes?: Record<string, string | number | boolean | undefined | null>;
};

export async function syncContactToBrevo(input: BrevoSyncInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey || !input.email?.includes('@')) return;

  const listIds = parseListIds(process.env.BREVO_LIST_IDS);
  const attributes = input.attributes ? buildAttributes(input.attributes) : {};

  const baseBody: Record<string, unknown> = {
    email: input.email.trim(),
    updateEnabled: true,
  };
  if (listIds.length) baseBody.listIds = listIds;
  if (Object.keys(attributes).length) baseBody.attributes = attributes;

  const post = async (body: Record<string, unknown>) =>
    fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  let res = await post(baseBody);

  if (!res.ok && res.status === 400 && baseBody.attributes) {
    const errText = await res.text().catch(() => '');
    console.warn('[brevo] Contact sync with attributes failed, retrying email+lists only:', errText.slice(0, 200));
    const minimal: Record<string, unknown> = {
      email: input.email.trim(),
      updateEnabled: true,
    };
    if (listIds.length) minimal.listIds = listIds;
    res = await post(minimal);
  }

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    console.warn('[brevo] Contact sync failed:', res.status, t.slice(0, 300));
  }
}

/** Fire-and-forget; never throws to callers. */
export function syncContactToBrevoAsync(input: BrevoSyncInput): void {
  syncContactToBrevo(input).catch(err => console.warn('[brevo] syncContactToBrevo:', err));
}
