import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, RATE } from "@/lib/rate-limit";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

const CLAIM_NOTIFY =
  process.env.UTILITY_CLAIM_NOTIFY_EMAIL?.trim() || "claims-inbox-placeholder@watercheckup.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function str(v: unknown, max = 500): string {
  const t = typeof v === "string" ? v.trim() : "";
  if (t.length > max) return t.slice(0, max);
  return t;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const utilityName = str(body.utilityName, 200);
    const pwsid = str(body.pwsid, 32).toUpperCase();
    const contactName = str(body.contactName, 120);
    const contactTitle = str(body.contactTitle, 120);
    const email = str(body.email, 320);
    const phone = str(body.phone, 40);
    const message = str(body.message, 4000);

    if (!utilityName || !pwsid || !contactName || !email.includes("@")) {
      return NextResponse.json(
        { error: "Utility name, PWSID, contact name, and a valid email are required." },
        { status: 400, headers: CORS },
      );
    }

    const ip = getClientIp(req);
    const ipLim = checkRateLimit(`claim:ip:${ip}`, RATE.utilityClaimPerIp.max, RATE.utilityClaimPerIp.windowMs);
    if (!ipLim.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again shortly." },
        { status: 429, headers: { ...CORS, "Retry-After": String(ipLim.retryAfterSec) } },
      );
    }
    const emLim = checkRateLimit(
      `claim:email:${email.toLowerCase()}`,
      RATE.utilityClaimPerEmail.max,
      RATE.utilityClaimPerEmail.windowMs,
    );
    if (!emLim.ok) {
      return NextResponse.json(
        { error: "Too many submissions for this email. Try again later." },
        { status: 429, headers: { ...CORS, "Retry-After": String(emLim.retryAfterSec) } },
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — utility claim logged only");
      return NextResponse.json({ success: true, queued: true }, { headers: CORS });
    }

    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || "WaterCheckup <onboarding@resend.dev>";

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0;padding:24px;">
  <h1 style="font-size:18px;color:#67e8f9;">Utility listing claim — WaterCheckup</h1>
  <table style="border-collapse:collapse;font-size:14px;max-width:560px;">
    <tr><td style="padding:8px 16px 8px 0;color:#94a3b8;">Utility name</td><td style="padding:8px 0;">${esc(utilityName)}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;color:#94a3b8;">PWSID</td><td style="padding:8px 0;">${esc(pwsid)}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;color:#94a3b8;">Contact</td><td style="padding:8px 0;">${esc(contactName)}${contactTitle ? `, ${esc(contactTitle)}` : ""}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#22d3ee;">${esc(email)}</a></td></tr>
    <tr><td style="padding:8px 16px 8px 0;color:#94a3b8;">Phone</td><td style="padding:8px 0;">${phone ? esc(phone) : "—"}</td></tr>
  </table>
  ${message ? `<p style="margin-top:20px;font-size:14px;"><strong>Message</strong><br/>${esc(message).replace(/\n/g, "<br/>")}</p>` : ""}
  <p style="margin-top:24px;font-size:12px;color:#64748b;">IP: ${esc(ip)} · ${new Date().toISOString()}</p>
</body></html>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [CLAIM_NOTIFY],
        reply_to: email,
        subject: `[Utility claim] ${utilityName} (${pwsid})`,
        html,
      }),
    });

    const data = (await r.json().catch(() => ({}))) as { message?: string };
    if (!r.ok) {
      return NextResponse.json(
        { error: data.message || "Could not send claim notification." },
        { status: 502, headers: CORS },
      );
    }

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
