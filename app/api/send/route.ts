import { NextRequest, NextResponse } from 'next/server';
import { syncContactToBrevoAsync } from '@/lib/brevo-sync';
import { getOrCreateWatercheckupAudienceId, resendRequest } from '../newsletter/resend-audience';
import { checkRateLimit, getClientIp, RATE } from '@/lib/rate-limit';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const TAG = process.env.AMAZON_AFFILIATE_TAG || 'watercheck20-20';

async function addContact(apiKey: string, email: string, city: string, pwsid: string, alertOptIn: boolean) {
  try {
    const audienceId = await getOrCreateWatercheckupAudienceId(apiKey);
    if (!audienceId) return;
    await resendRequest(apiKey, `/audiences/${audienceId}/contacts`, {
      method: 'POST',
      body: {
        email,
        unsubscribed: false,
        data: {
          city,
          pwsid: pwsid || '',
          alert_opt_in: String(alertOptIn),
          signed_up_at: new Date().toISOString(),
        },
      },
    });
  } catch { /* non-fatal */ }
}

export async function POST(req: NextRequest) {
  try {
    const { email, city, systemName, score, grade, totalViolations, openViolations, pwsid, alertOptIn } = await req.json();

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: CORS });
    }

    const ip = getClientIp(req);
    const ipLim = checkRateLimit(`send:ip:${ip}`, RATE.sendEmailPerIp.max, RATE.sendEmailPerIp.windowMs);
    if (!ipLim.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(ipLim.retryAfterSec) } }
      );
    }
    const emLim = checkRateLimit(
      `send:email:${String(email).toLowerCase().trim()}`,
      RATE.sendEmailPerEmail.max,
      RATE.sendEmailPerEmail.windowMs
    );
    if (!emLim.ok) {
      return NextResponse.json(
        { error: 'Too many requests for this email. Please try again later.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(emLim.retryAfterSec) } }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set');
      return NextResponse.json({ success: true, skipped: true }, { headers: CORS });
    }

    const scoreColor = score >= 80 ? '#22d3ee' : score >= 65 ? '#f59e0b' : '#ef4444';
    const scoreBg = score >= 80 ? '#051a10' : score >= 65 ? '#1c1102' : '#1f0707';
    const gradeLabel = score >= 80 ? 'Good' : score >= 65 ? 'Moderate' : score >= 50 ? 'Poor' : 'Critical';

    const violationHtml = openViolations > 0
      ? `⚠️ <strong style="color:#ef4444">${openViolations} open violation(s)</strong> on record`
      : totalViolations > 0 ? `✅ ${totalViolations} resolved — no open issues` : `✅ No violations on record`;

    const products = [
      { name: 'iSpring RCC7AK', price: '$229', cert: 'NSF 42+53+58', removes: 'Lead >98.9%, PFAS >96%, Fluoride >97%', asin: 'B005LJ8EXU' },
      { name: 'APEC ROES-50',   price: '$189', cert: 'WQA Gold Seal', removes: 'Lead >99%, Arsenic >99%, Fluoride >96%', asin: 'B00I0ZGOZM' },
      { name: 'Waterdrop G3P600', price: '$299', cert: 'NSF 42+53+58+372', removes: 'PFAS >99%, Lead >99%, 600 GPD Tankless', asin: 'B07P1XFYJP' },
    ];

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your ${city} Water Quality Report</title></head>
<body style="margin:0;background:#050e17;font-family:'Courier New',monospace;color:#e2e8f0;">
<div style="max-width:600px;margin:0 auto;padding:32px 20px;">
  <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #0e2233;">
    <span style="font-size:18px;font-weight:800;letter-spacing:2px;color:#22d3ee;">💧 WATER<span style="color:#e2e8f0;">CHECKUP</span></span>
    <div style="font-size:9px;letter-spacing:2px;color:#334155;margin-top:3px;">EPA · NSF · CCR DATA</div>
  </div>
  <div style="background:${scoreBg};border:1px solid ${scoreColor}33;border-radius:12px;padding:28px;margin-bottom:20px;text-align:center;">
    <div style="font-size:9px;letter-spacing:3px;color:#0891b2;margin-bottom:10px;">YOUR WATER QUALITY REPORT</div>
    <div style="font-size:64px;font-weight:900;color:${scoreColor};line-height:1;margin-bottom:4px;">${score}</div>
    <div style="font-size:11px;color:${scoreColor};letter-spacing:2px;margin-bottom:16px;">${gradeLabel.toUpperCase()} · GRADE ${grade}</div>
    <div style="font-size:17px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">${systemName}</div>
    <div style="font-size:11px;color:#475569;margin-bottom:12px;">${city} · PWSID: ${pwsid}</div>
    <div style="font-size:11px;color:#94a3b8;">${violationHtml}</div>
  </div>
  <div style="background:#051a0a;border:1px solid #22d3ee22;border-radius:8px;padding:10px 16px;margin-bottom:20px;font-size:10px;color:#22d3ee;">
    🟢 <strong>LIVE EPA DATA</strong> &nbsp;·&nbsp; <span style="color:#475569;">EPA SDWIS Envirofacts API</span>
  </div>
  <div style="font-size:9px;letter-spacing:3px;color:#0891b2;margin-bottom:14px;">NSF-CERTIFIED FILTERS · MATCHED TO YOUR WATER</div>
  ${products.map(p => `
  <div style="background:#060e17;border:1px solid #0e2233;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:12px;">
        <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:2px;">${p.name}</div>
        <div style="font-size:9px;color:#64748b;margin-bottom:3px;">${p.cert}</div>
        <div style="font-size:9px;color:#22d3ee;">${p.removes}</div>
      </td>
      <td align="right" style="white-space:nowrap;vertical-align:middle;">
        <div style="font-size:20px;font-weight:900;color:#22d3ee;margin-bottom:6px;">${p.price}</div>
        <a href="https://www.amazon.com/dp/${p.asin}?tag=${TAG}" style="display:inline-block;padding:8px 14px;background:#f59e0b;border-radius:5px;color:#000;font-size:10px;font-weight:800;text-decoration:none;">Buy on Amazon →</a>
      </td>
    </tr></table>
  </div>`).join('')}
  ${alertOptIn ? `
  <div style="background:#07111a;border:1px solid #0891b244;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:11px;color:#64748b;line-height:1.7;">
    🔔 <strong style="color:#22d3ee;">Violation alerts ON</strong> for ${systemName}.<br>
    You'll be notified if new violations are reported for PWSID: ${pwsid}.
  </div>` : ''}
  <div style="text-align:center;margin:28px 0 20px;">
    <a href="https://watercheckup.com" style="display:inline-block;padding:13px 30px;background:#0891b2;border-radius:8px;color:#fff;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:1px;">View Full Report at watercheckup.com →</a>
  </div>
  <div style="border-top:1px solid #0e2233;padding-top:18px;font-size:9px;color:#334155;text-align:center;line-height:2;">
    Data sourced from EPA SDWIS Envirofacts API · Updated quarterly by EPA<br>
    <a href="https://watercheckup.com" style="color:#0891b2;text-decoration:none;">watercheckup.com</a>
  </div>
</div></body></html>`;

    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <joe@letorney.com>';

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Your ${city} Water Quality Report — Score ${score}/100 (${gradeLabel})`,
        html,
      }),
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json({ error: data.message || 'Send failed' }, { status: 500, headers: CORS });

    // Add to audience list (non-blocking — fire and forget)
    addContact(apiKey, email, city, pwsid || '', !!alertOptIn);

    syncContactToBrevoAsync({
      email,
      attributes: {
        CITY: city,
        PWSID: pwsid || undefined,
        ALERT_OPT_IN: !!alertOptIn,
        WATER_SCORE: typeof score === 'number' ? score : undefined,
        WATER_GRADE: grade != null ? String(grade) : undefined,
        SYSTEM_NAME: systemName,
        SOURCE: 'report-email',
        SIGNUP_SOURCE: 'water-report',
        SIGNUP_AT: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, id: data.id }, { headers: CORS });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
