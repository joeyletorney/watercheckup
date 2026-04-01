import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

let cachedAudienceId: string | null = null;

async function getAudienceId(apiKey: string): Promise<string | null> {
  if (process.env.RESEND_AUDIENCE_ID) return process.env.RESEND_AUDIENCE_ID;
  if (cachedAudienceId) return cachedAudienceId;
  try {
    const res = await fetch('https://api.resend.com/audiences', { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return null;
    const data = await res.json();
    const existing = (data.data || []).find((a: any) => a.name === 'WaterCheckup');
    if (!existing) return null;
    cachedAudienceId = existing.id;
    return existing.id;
  } catch {
    return null;
  }
}

function buildWeeklyHtml() {
  return `<!doctype html><html><body style="margin:0;background:#050e17;color:#e2e8f0;font-family:Arial,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:24px">
    <div style="font-size:20px;font-weight:800;color:#22d3ee;margin-bottom:10px">WaterCheckup Weekly</div>
    <div style="font-size:13px;color:#94a3b8;line-height:1.8;margin-bottom:14px">
      This week: check if your city has posted new PFAS results, review any open violations, and verify your filter cartridge replacement schedule.
    </div>
    <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:12px 14px;margin-bottom:14px">
      <div style="font-size:13px;color:#f1f5f9;font-weight:700;margin-bottom:6px">3-minute action plan</div>
      <ul style="color:#cbd5e1;font-size:13px;line-height:1.7;padding-left:18px;margin:0">
        <li>Run your ZIP report and check open violations.</li>
        <li>Look for PFAS / lead in your contaminant list.</li>
        <li>Confirm your current filter is certified for those contaminants.</li>
      </ul>
    </div>
    <a href="https://watercheckup.com" style="display:inline-block;padding:10px 16px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;font-weight:700">Check my water now →</a>
    <div style="font-size:11px;color:#64748b;margin-top:16px">You are receiving this because you subscribed to WaterCheckup updates.</div>
  </div>
  </body></html>`;
}

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const auth = req.headers.get('authorization') || '';
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ success: true, skipped: true }, { headers: CORS });

    const supabase = getSupabaseAdmin();
    const byEmail = new Map<string, { email: string }>();

    if (supabase) {
      const { data: rows, error: dbErr } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('weekly_opt_in', true)
        .eq('unsubscribed', false);
      if (dbErr) return NextResponse.json({ success: false, error: dbErr.message }, { status: 500, headers: CORS });
      for (const r of rows || []) {
        const e = (r as { email?: string }).email?.trim().toLowerCase();
        if (e?.includes('@')) byEmail.set(e, { email: (r as { email: string }).email.trim() });
      }
    }

    const audienceId = await getAudienceId(apiKey);
    if (audienceId) {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const payload = await res.json();
        const contacts = (payload.data || []).filter((c: any) => c?.email && c?.unsubscribed !== true);
        const fromResend = contacts
          .filter((c: any) => String(c?.data?.weekly_opt_in ?? 'true') !== 'false')
          .map((c: any) => ({ email: String(c.email).trim() }));
        for (const c of fromResend) {
          const k = c.email.toLowerCase();
          if (k.includes('@')) byEmail.set(k, c);
        }
      }
    }

    if (!supabase && !audienceId) {
      return NextResponse.json({ success: false, error: 'Audience not found' }, { status: 404, headers: CORS });
    }

    const weekly = Array.from(byEmail.values());

    if (!weekly.length) return NextResponse.json({ success: true, sent: 0 }, { headers: CORS });

    const html = buildWeeklyHtml();
    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <reports@watercheckup.com>';
    let sent = 0;
    for (const c of weekly) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [c.email],
          subject: 'Your weekly WaterCheckup update',
          html,
        }),
      });
      if (r.ok) sent += 1;
    }

    return NextResponse.json({ success: true, sent, total: weekly.length }, { headers: CORS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}
