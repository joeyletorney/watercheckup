import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateWatercheckupAudienceId, resendRequest } from './resend-audience';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export async function POST(req: NextRequest) {
  try {
    const { email, zip, weekly = true, source = 'unknown' } = await req.json();

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: CORS });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, skipped: true, error: 'Email service is not configured (missing RESEND_API_KEY).' },
        { status: 503, headers: CORS },
      );
    }

    const audienceId = await getOrCreateWatercheckupAudienceId(apiKey);
    if (!audienceId) {
      return NextResponse.json({ error: 'Audience unavailable' }, { status: 500, headers: CORS });
    }

    const contactRes = await resendRequest(apiKey, `/audiences/${audienceId}/contacts`, {
      method: 'POST',
      body: {
        email,
        unsubscribed: false,
        data: {
          zip: zip || '',
          weekly_opt_in: String(!!weekly),
          source,
          signed_up_at: new Date().toISOString(),
        },
      },
    });
    if (!contactRes.ok) {
      const errBody = await contactRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errBody as { message?: string }).message || 'Could not save subscription' },
        { status: 502, headers: CORS },
      );
    }

    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <reports@watercheckup.com>';

    const html = `<!doctype html><html><body style="margin:0;background:#050e17;color:#e2e8f0;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:24px">
      <div style="font-size:20px;font-weight:800;color:#22d3ee;margin-bottom:10px">WaterCheckup Sample Report</div>
      <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:16px;font-weight:700;color:#f1f5f9">Boston, MA — Sample Utility</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px">Score 74 · Grade C · PFAS compounds detected</div>
        <ul style="color:#cbd5e1;font-size:13px;line-height:1.7;padding-left:18px">
          <li>PFOS above MCL threshold</li>
          <li>Lead risk in older buildings</li>
          <li>Recommended: NSF 58 under-sink RO</li>
        </ul>
      </div>
      <div style="font-size:13px;color:#94a3b8;line-height:1.7;margin-bottom:12px">
        You're subscribed to the free weekly WaterCheckup newsletter${zip ? ` for ZIP ${zip}` : ''}. We'll send one concise update each week with contaminant alerts and practical actions.
      </div>
      <a href="https://watercheckup.com" style="display:inline-block;padding:10px 16px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;font-weight:700">Run my full report →</a>
    </div>
    </body></html>`;

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your WaterCheckup sample report + weekly newsletter',
        html,
      }),
    });
    const sendJson = await sendRes.json().catch(() => ({}));
    if (!sendRes.ok) {
      return NextResponse.json(
        { error: (sendJson as { message?: string }).message || 'Email could not be sent' },
        { status: 502, headers: CORS },
      );
    }

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
