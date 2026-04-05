import { NextRequest, NextResponse } from 'next/server';

const BREVO = 'https://api.brevo.com/v3';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase();

  if (!email?.includes('@')) {
    return new NextResponse(errorPage('Invalid unsubscribe link.'), { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    return new NextResponse(errorPage('Service unavailable. Please try again later.'), { status: 503, headers: { 'Content-Type': 'text/html' } });
  }

  const listId = parseInt((process.env.BREVO_LIST_IDS || '5').split(/[,;\s]+/)[0], 10);

  // Remove from Brevo list
  await fetch(`${BREVO}/contacts/lists/${listId}/contacts/remove`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails: [email] }),
  }).catch(() => null);

  return new NextResponse(successPage(email), { status: 200, headers: { 'Content-Type': 'text/html' } });
}

function successPage(email: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed — WaterCheckup</title></head>
<body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center">
    <div style="font-size:48px;margin-bottom:16px">💧</div>
    <div style="font-size:22px;font-weight:800;color:#0891b2;margin-bottom:8px">You've been unsubscribed</div>
    <div style="font-size:15px;color:#475569;line-height:1.7;margin-bottom:24px">
      <strong>${email}</strong> has been removed from the WaterCheckup newsletter. You won't receive any more emails from us.
    </div>
    <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:700">Back to WaterCheckup</a>
    <div style="margin-top:16px;font-size:12px;color:#94a3b8">Changed your mind? You can re-subscribe at any time on our site.</div>
  </div>
</body></html>`;
}

function errorPage(message: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Error — WaterCheckup</title></head>
<body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center">
    <div style="font-size:22px;font-weight:800;color:#dc2626;margin-bottom:8px">Something went wrong</div>
    <div style="font-size:15px;color:#475569;margin-bottom:24px">${message}</div>
    <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:700">Back to WaterCheckup</a>
  </div>
</body></html>`;
}
