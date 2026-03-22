import { NextRequest, NextResponse } from 'next/server';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const TAG = process.env.AMAZON_AFFILIATE_TAG || 'watercheck-20';

export async function POST(req: NextRequest) {
  try {
    const { email, city, systemName, score, grade, totalViolations, openViolations, pwsid, alertOptIn } = await req.json();

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: CORS });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set — email skipped');
      return NextResponse.json({ success: true, skipped: true }, { headers: CORS });
    }

    const scoreColor = score >= 80 ? '#22d3ee' : score >= 65 ? '#f59e0b' : '#ef4444';
    const violationHtml = openViolations > 0
      ? `⚠️ <strong style="color:#ef4444">${openViolations} open violation(s)</strong> on record`
      : totalViolations > 0
      ? `✅ ${totalViolations} resolved violation(s) — no open issues`
      : `✅ No violations on record`;

    const products = [
      { name: 'iSpring RCC7AK', price: '$229', cert: 'NSF 42+53+58', removes: 'Lead >98.9%, PFAS >96%, Chromium >99%', asin: 'B005LJ8EXU' },
      { name: 'APEC ROES-50',   price: '$219', cert: 'WQA Gold Seal', removes: 'Lead >99%, Arsenic >99%, Fluoride >96%', asin: 'B00I0ZGOZM' },
      { name: 'Waterdrop G3P800', price: '$449', cert: 'NSF 42+53+58+372', removes: 'PFAS >99%, Lead >99%, 800 GPD tankless', asin: 'B07P1XFYJP' },
    ];

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#050e17;font-family:'Courier New',monospace;color:#e2e8f0;">
<div style="max-width:600px;margin:0 auto;padding:32px 20px;">

  <div style="margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid #0e2233;">
    <span style="font-size:18px;font-weight:800;letter-spacing:2px;color:#22d3ee;">💧 WATER<span style="color:#e2e8f0;">CHECKUP</span></span>
  </div>

  <div style="background:#0a1929;border:1px solid #0e2233;border-radius:12px;padding:28px;margin-bottom:20px;text-align:center;">
    <div style="font-size:10px;letter-spacing:3px;color:#0891b2;margin-bottom:8px;">YOUR WATER QUALITY REPORT</div>
    <div style="font-size:60px;font-weight:900;color:${scoreColor};line-height:1;">${score}</div>
    <div style="font-size:14px;color:#94a3b8;margin-bottom:14px;">Grade: ${grade}</div>
    <div style="font-size:17px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">${systemName}</div>
    <div style="font-size:12px;color:#475569;margin-bottom:14px;">${city} · PWSID: ${pwsid}</div>
    <div style="font-size:12px;color:#94a3b8;">${violationHtml}</div>
  </div>

  <div style="background:#051a0a;border:1px solid #22d3ee22;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:11px;color:#22d3ee;">
    🟢 <strong>LIVE EPA DATA</strong> &nbsp;·&nbsp; <span style="color:#475569;">Direct from EPA SDWIS Envirofacts API</span>
  </div>

  <div style="font-size:10px;letter-spacing:3px;color:#0891b2;margin-bottom:14px;">RECOMMENDED FILTERS FOR YOUR WATER</div>

  ${products.map(p => `
  <div style="background:#060e17;border:1px solid #0e2233;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:12px;">
        <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:2px;">${p.name}</div>
        <div style="font-size:10px;color:#64748b;margin-bottom:3px;">${p.cert}</div>
        <div style="font-size:10px;color:#22d3ee;">${p.removes}</div>
      </td>
      <td align="right" style="white-space:nowrap;vertical-align:middle;">
        <div style="font-size:18px;font-weight:800;color:#22d3ee;margin-bottom:6px;">${p.price}</div>
        <a href="https://www.amazon.com/dp/${p.asin}?tag=${TAG}" style="display:inline-block;padding:7px 14px;background:#f59e0b;border-radius:5px;color:#000;font-size:11px;font-weight:800;text-decoration:none;">Buy on Amazon →</a>
      </td>
    </tr></table>
  </div>`).join('')}

  ${alertOptIn ? `
  <div style="background:#07111a;border:1px solid #0891b244;border-radius:8px;padding:12px 16px;margin:16px 0;font-size:11px;color:#64748b;">
    ✅ You're subscribed to water quality alerts for ${systemName}.
  </div>` : ''}

  <div style="text-align:center;margin:28px 0 20px;">
    <a href="https://watercheckup.com" style="display:inline-block;padding:13px 30px;background:#0891b2;border-radius:8px;color:#fff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;">View Full Report at watercheckup.com →</a>
  </div>

  <div style="border-top:1px solid #0e2233;padding-top:18px;font-size:10px;color:#334155;text-align:center;line-height:1.8;">
    Data sourced from EPA SDWIS Envirofacts API · Updated quarterly by EPA<br>
    <a href="https://watercheckup.com" style="color:#0891b2;text-decoration:none;">watercheckup.com</a>
  </div>

</div>
</body></html>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'WaterCheckup <reports@watercheckup.com>',
        to: [email],
        subject: `Your ${city} Water Quality Report — Score ${score} (${grade})`,
        html,
      }),
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json({ error: data.message || 'Send failed' }, { status: 500, headers: CORS });
    return NextResponse.json({ success: true, id: data.id }, { headers: CORS });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
