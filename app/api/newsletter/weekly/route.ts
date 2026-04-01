import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllAudienceContacts,
  getOrCreateWatercheckupAudienceId,
} from '../resend-audience';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

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

/**
 * Vercel Cron: Mondays 14:00 UTC (vercel.json). Requires RESEND_API_KEY (+ verified RESEND_FROM_EMAIL).
 * If CRON_SECRET is set, Vercel sends Authorization: Bearer <CRON_SECRET> automatically.
 */
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
    if (!apiKey) {
      console.error(
        '[newsletter/weekly] RESEND_API_KEY is not set — weekly emails are not sent. Add it in Vercel → Project → Settings → Environment Variables.',
      );
      return NextResponse.json(
        {
          success: false,
          skipped: true,
          reason: 'RESEND_API_KEY is not configured',
          hint: 'Add RESEND_API_KEY (and verify RESEND_FROM_EMAIL on your domain) in Vercel environment variables.',
        },
        { status: 503, headers: CORS },
      );
    }

    const audienceId = await getOrCreateWatercheckupAudienceId(apiKey);
    if (!audienceId) {
      console.error('[newsletter/weekly] Could not resolve or create Resend audience "WaterCheckup".');
      return NextResponse.json(
        { success: false, error: 'Audience unavailable — check RESEND_API_KEY and Resend dashboard.' },
        { status: 500, headers: CORS },
      );
    }

    let contacts;
    try {
      contacts = await fetchAllAudienceContacts(apiKey, audienceId);
    } catch (e) {
      console.error('[newsletter/weekly] Failed to list contacts:', e);
      return NextResponse.json({ success: false, error: 'Unable to fetch contacts' }, { status: 500, headers: CORS });
    }

    const active = contacts.filter(c => c?.email && c?.unsubscribed !== true);
    const weekly = active.filter(c => String(c?.data?.weekly_opt_in ?? 'true') !== 'false');

    if (!weekly.length) {
      return NextResponse.json(
        { success: true, sent: 0, total: 0, message: 'No weekly opt-in contacts in audience yet.' },
        { headers: CORS },
      );
    }

    const html = buildWeeklyHtml();
    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <reports@watercheckup.com>';
    let sent = 0;
    const failed: string[] = [];
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
      else failed.push(c.email || '(unknown)');
    }

    if (failed.length) {
      console.warn(`[newsletter/weekly] Sent ${sent}/${weekly.length}; failed for: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? '…' : ''}`);
    } else {
      console.log(`[newsletter/weekly] Sent ${sent} weekly email(s).`);
    }

    return NextResponse.json({ success: true, sent, total: weekly.length, failed: failed.length }, { headers: CORS });
  } catch (err: any) {
    console.error('[newsletter/weekly]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}
