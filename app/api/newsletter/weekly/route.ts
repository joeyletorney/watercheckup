import { NextRequest, NextResponse } from 'next/server';
import { buildWeeklyHtml, getCurrentIssue } from '@/lib/newsletter-weekly';

const BREVO = 'https://api.brevo.com/v3';

type BrevoContact = { email: string; signupAt?: string };

async function fetchBrevoListContacts(apiKey: string, listId: number): Promise<BrevoContact[]> {
  const contacts: BrevoContact[] = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const res = await fetch(`${BREVO}/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`, {
      headers: { 'api-key': apiKey },
    });
    if (!res.ok) break;
    const data = await res.json() as { contacts: { email: string; emailBlacklisted?: boolean; attributes?: Record<string, string> }[]; count: number };
    const active = (data.contacts || []).filter(c => c.email && !c.emailBlacklisted);
    contacts.push(...active.map(c => ({ email: c.email, signupAt: c.attributes?.SIGNUP_AT })));
    if (contacts.length >= data.count || active.length < limit) break;
    offset += limit;
  }
  return contacts;
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

function previewDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T14:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

// export const dynamic = 'force-dynamic';

/**
 * Vercel Cron: Mondays 14:00 UTC (vercel.json). Requires BREVO_API_KEY + BREVO_LIST_IDS.
 * If CRON_SECRET is set, Vercel sends Authorization: Bearer <CRON_SECRET> automatically.
 * GET ?preview=YYYY-MM-DD returns the rendered HTML for that Monday without sending.
 */
export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (!cronSecret) {
      return NextResponse.json(
        { success: false, error: 'CRON_SECRET is not configured.' },
        { status: 503, headers: CORS }
      );
    }

    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
    }

    // Any presence of ?preview (including ?preview or ?preview=) is preview-only.
    // An empty value must 400, not fall through to the live-send path.
    if (req.nextUrl.searchParams.has('preview')) {
      const date = previewDate(req.nextUrl.searchParams.get('preview') || '');
      if (!date) {
        return NextResponse.json({ error: 'preview must be a real YYYY-MM-DD date.' }, { status: 400, headers: CORS });
      }
      const issue = getCurrentIssue(date);
      const html = buildWeeklyHtml(issue, 'preview@watercheckup.com');
      return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const apiKey = process.env.BREVO_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'BREVO_API_KEY is not configured.' }, { status: 503, headers: CORS });
    }

    const listId = parseInt((process.env.BREVO_LIST_IDS || '5').split(/[,;\s]+/)[0], 10);
    let contacts: BrevoContact[];
    try {
      contacts = await fetchBrevoListContacts(apiKey, listId);
    } catch (e) {
      console.error('[newsletter/weekly] Failed to fetch Brevo contacts:', e);
      return NextResponse.json({ success: false, error: 'Unable to fetch contacts' }, { status: 500, headers: CORS });
    }

    if (!contacts.length) {
      return NextResponse.json({ success: true, sent: 0, total: 0, message: 'No contacts in list yet.' }, { headers: CORS });
    }

    const senderEmail = process.env.BREVO_FROM_EMAIL?.trim() || 'hello@watercheckup.com';
    // Compute once — everyone gets the same rotating issue this week
    const issue = getCurrentIssue();
    let sent = 0;
    const failed: string[] = [];
    for (const contact of contacts) {
      const html = buildWeeklyHtml(issue, contact.email);
      const r = await fetch(`${BREVO}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'WaterCheckup', email: senderEmail },
          to: [{ email: contact.email }],
          subject: issue.subject,
          htmlContent: html,
        }),
      });
      if (r.ok) sent += 1;
      else failed.push(contact.email);
    }

    if (failed.length) {
      console.warn(`[newsletter/weekly] Sent ${sent}/${contacts.length}; failed for: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? '…' : ''}`);
    } else {
      console.log(`[newsletter/weekly] Sent ${sent} weekly email(s).`);
    }

    return NextResponse.json({ success: true, sent, total: contacts.length, failed: failed.length }, { headers: CORS });
  } catch (err: any) {
    console.error('[newsletter/weekly]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}
