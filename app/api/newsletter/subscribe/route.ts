import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE } from '@/lib/rate-limit';
import { getSiteNotifyEmail } from '@/lib/site-notify-email';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const BREVO = 'https://api.brevo.com/v3';

export async function POST(req: NextRequest) {
  try {
    const { email, zip, weekly = true, source = 'unknown' } = await req.json();
    const normalizedSource = String(source || 'unknown').trim().toLowerCase();
    const isViolationAlert =
      normalizedSource === 'violation-alert' ||
      normalizedSource === 'violation_alert' ||
      normalizedSource === 'alert' ||
      normalizedSource.includes('violation');

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: CORS });
    }

    const ip = getClientIp(req);
    const ipLim = checkRateLimit(`sub:ip:${ip}`, RATE.newsletterSubscribePerIp.max, RATE.newsletterSubscribePerIp.windowMs);
    if (!ipLim.ok) {
      return NextResponse.json(
        { error: 'Too many sign-up attempts. Please try again shortly.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(ipLim.retryAfterSec) } }
      );
    }
    const emLim = checkRateLimit(
      `sub:email:${email.toLowerCase().trim()}`,
      RATE.newsletterSubscribePerEmail.max,
      RATE.newsletterSubscribePerEmail.windowMs
    );
    if (!emLim.ok) {
      return NextResponse.json(
        { error: 'Too many attempts for this email. Please try again later.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(emLim.retryAfterSec) } }
      );
    }

    const apiKey = process.env.BREVO_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Email service not configured.' }, { status: 503, headers: CORS });
    }

    const listIds = (process.env.BREVO_LIST_IDS || '5')
      .split(/[,;\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => Number.isFinite(n) && n > 0);

    // Add/update contact in Brevo
    const contactRes = await fetch(`${BREVO}/contacts`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        updateEnabled: true,
        listIds,
        attributes: {
          ZIP: zip || undefined,
          WEEKLY_OPT_IN: weekly ? 'true' : 'false',
          VIOLATION_ALERT_OPT_IN: isViolationAlert ? 'true' : 'false',
          SOURCE: source,
          SIGNUP_SOURCE: isViolationAlert ? 'violation-alert' : 'newsletter',
          SIGNUP_AT: new Date().toISOString(),
        },
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const err = await contactRes.json().catch(() => ({}));
      // Brevo returns 400 if attributes are unknown — retry with email + list only
      if (contactRes.status === 400) {
        const retry = await fetch(`${BREVO}/contacts`, {
          method: 'POST',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), updateEnabled: true, listIds }),
        });
        if (!retry.ok && retry.status !== 204) {
          const retryErr = await retry.json().catch(() => ({}));
          return NextResponse.json({ error: (retryErr as { message?: string }).message || 'Could not save subscription' }, { status: 502, headers: CORS });
        }
      } else {
        return NextResponse.json({ error: (err as { message?: string }).message || 'Could not save subscription' }, { status: 502, headers: CORS });
      }
    }

    // Send welcome email via Brevo transactional API
    const senderEmail = process.env.BREVO_FROM_EMAIL?.trim() || 'hello@watercheckup.com';
    const senderName = 'WaterCheckup';

    const html = isViolationAlert
      ? `<!doctype html><html><head><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#f8fafc;color:#1e293b;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff">

      <div style="border-bottom:2px solid #0891b2;padding-bottom:16px;margin-bottom:24px">
        <div style="font-size:22px;font-weight:800;color:#0891b2;margin-bottom:4px">WaterCheckup Alerts</div>
        <div style="font-size:14px;color:#64748b">Violation alerts for your local water system</div>
      </div>

      <div style="font-size:15px;color:#334155;line-height:1.7;margin-bottom:20px">
        You're subscribed${zip ? ` for ZIP <strong style="color:#0f172a">${zip}</strong>` : ''}. We'll email you when new EPA-reported violations appear so you can act quickly.
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:20px">
        <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:8px">What triggers an alert:</div>
        <ul style="margin:0;padding-left:18px;color:#475569;font-size:13px;line-height:1.7">
          <li>New health-based violation reported in EPA SDWIS</li>
          <li>Status changes on open violations in your local utility</li>
          <li>Major contaminant risk updates tied to your ZIP</li>
        </ul>
      </div>

      <div style="font-size:13px;color:#64748b;line-height:1.7;margin-bottom:20px">
        You can still run your full report anytime for contaminant details and filter recommendations.
      </div>

      <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700">View my water report →</a>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.6">
        You're receiving this because you signed up for water alerts at watercheckup.com. <a href="https://watercheckup.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email.trim())}" style="color:#94a3b8">Unsubscribe</a>
      </div>

    </div>
    </body></html>`
      : `<!doctype html><html><head><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#f8fafc;color:#1e293b;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff">

      <div style="border-bottom:2px solid #0891b2;padding-bottom:16px;margin-bottom:24px">
        <div style="font-size:22px;font-weight:800;color:#0891b2;margin-bottom:4px">WaterCheckup</div>
        <div style="font-size:14px;color:#64748b">Your free weekly drinking water intelligence</div>
      </div>

      <div style="font-size:15px;color:#334155;line-height:1.7;margin-bottom:24px">
        You're in${zip ? ` — we'll keep an eye on water quality near ZIP <strong style="color:#0f172a">${zip}</strong>` : ''}. Each week we'll send you one concise update: contaminant alerts, utility violations, and practical steps to protect your household.
      </div>

      <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px">The 4 contaminants most people don't know about</div>

      <div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;padding:14px 16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#dc2626;margin-bottom:4px">Lead</div>
        <div style="font-size:13px;color:#475569;line-height:1.6">There is no safe level of lead exposure. It leaches from older pipes and fixtures — even if your utility water tests clean, it can contaminate at the tap. Children and pregnant women are most at risk.</div>
      </div>

      <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:6px;padding:14px 16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#ea580c;margin-bottom:4px">PFAS ("Forever Chemicals")</div>
        <div style="font-size:13px;color:#475569;line-height:1.6">Linked to cancer, thyroid disease, and immune disruption. PFAS don't break down and accumulate in the body over time. They're found in water systems near military bases, airports, and industrial sites — and in many systems with no known source.</div>
      </div>

      <div style="background:#fefce8;border-left:4px solid #eab308;border-radius:6px;padding:14px 16px;margin-bottom:10px">
        <div style="font-size:14px;font-weight:700;color:#ca8a04;margin-bottom:4px">Nitrates</div>
        <div style="font-size:13px;color:#475569;line-height:1.6">Common in agricultural areas from fertilizer runoff. High nitrate levels are dangerous for infants and can cause "blue baby syndrome." Boiling water does not remove nitrates — it concentrates them.</div>
      </div>

      <div style="background:#f5f3ff;border-left:4px solid #8b5cf6;border-radius:6px;padding:14px 16px;margin-bottom:24px">
        <div style="font-size:14px;font-weight:700;color:#7c3aed;margin-bottom:4px">Disinfection Byproducts (DBPs)</div>
        <div style="font-size:13px;color:#475569;line-height:1.6">Formed when chlorine or chloramine reacts with organic matter in water. Long-term exposure is associated with bladder cancer and adverse birth outcomes. Most utilities don't report these at the individual tap level.</div>
      </div>

      <div style="font-size:13px;color:#64748b;line-height:1.7;margin-bottom:20px">
        Run your free local report to see what's actually in your water supply, your utility's violation history, and which filter — if any — is worth it for your situation.
      </div>

      <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700">Run my free water report →</a>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.6">
        You're receiving this because you subscribed at watercheckup.com. We send one email per week, no spam. <a href="https://watercheckup.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email.trim())}" style="color:#94a3b8">Unsubscribe</a>
      </div>

    </div>
    </body></html>`;

    const sendRes = await fetch(`${BREVO}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: email.trim() }],
        bcc: [{ email: getSiteNotifyEmail() }],
        subject: isViolationAlert
          ? 'You are subscribed: local water violation alerts'
          : "Welcome to WaterCheckup — what's really in your water",
        htmlContent: html,
      }),
    });

    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { message?: string }).message || 'Email could not be sent' }, { status: 502, headers: CORS });
    }

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
    
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
