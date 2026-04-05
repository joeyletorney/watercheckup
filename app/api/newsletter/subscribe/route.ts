import { NextRequest, NextResponse } from 'next/server';
import { syncContactToBrevoAsync } from '@/lib/brevo-sync';
import { getOrCreateWatercheckupAudienceId, resendRequest } from '../resend-audience';

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

    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <onboarding@resend.dev>';

    const html = `<!doctype html><html><body style="margin:0;background:#050e17;color:#e2e8f0;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px">

      <div style="font-size:22px;font-weight:800;color:#22d3ee;margin-bottom:4px">Welcome to WaterCheckup</div>
      <div style="font-size:14px;color:#94a3b8;margin-bottom:24px">Your free weekly drinking water intelligence</div>

      <div style="font-size:15px;color:#e2e8f0;line-height:1.7;margin-bottom:24px">
        You're in${zip ? ` — we'll keep an eye on water quality near ZIP <strong style="color:#f1f5f9">${zip}</strong>` : ''}. Each week we'll send you one concise update: contaminant alerts, utility violations, and practical steps to protect your household.
      </div>

      <div style="font-size:15px;font-weight:700;color:#f1f5f9;margin-bottom:12px">The 4 contaminants most people don't know about</div>

      <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#f87171;margin-bottom:4px">Lead</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.6">There is no safe level of lead exposure. It leaches from older pipes and fixtures — even if your utility water tests clean, it can contaminate at the tap. Children and pregnant women are most at risk.</div>
      </div>

      <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#fb923c;margin-bottom:4px">PFAS ("Forever Chemicals")</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.6">Linked to cancer, thyroid disease, and immune disruption. PFAS don't break down and accumulate in the body over time. They're found in water systems near military bases, airports, and industrial sites — and in many systems with no known source.</div>
      </div>

      <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#facc15;margin-bottom:4px">Nitrates</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.6">Common in agricultural areas from fertilizer runoff. High nitrate levels are dangerous for infants and can cause "blue baby syndrome." Boiling water does not remove nitrates — it concentrates them.</div>
      </div>

      <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:24px">
        <div style="font-size:14px;font-weight:700;color:#a78bfa;margin-bottom:4px">Disinfection Byproducts (DBPs)</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.6">Formed when chlorine or chloramine reacts with organic matter in water. Long-term exposure is associated with bladder cancer and adverse birth outcomes. Most utilities don't report these at the individual tap level.</div>
      </div>

      <div style="font-size:13px;color:#94a3b8;line-height:1.7;margin-bottom:20px">
        Run your free local report to see what's actually in your water supply, your utility's violation history, and which filter — if any — is worth it for your situation.
      </div>

      <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:700">Run my free water report →</a>

      <div style="margin-top:32px;font-size:11px;color:#475569;line-height:1.6">
        You're receiving this because you subscribed at watercheckup.com. We send one email per week, no spam. Reply to unsubscribe at any time.
      </div>

    </div>
    </body></html>`;

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Welcome to WaterCheckup — what's really in your water",
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

    syncContactToBrevoAsync({
      email,
      attributes: {
        ZIP: zip || undefined,
        WEEKLY_OPT_IN: weekly,
        SOURCE: source,
        SIGNUP_SOURCE: 'newsletter',
        SIGNUP_AT: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
