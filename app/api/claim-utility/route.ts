import { NextRequest, NextResponse } from 'next/server';

import { checkRateLimit, getClientIp, RATE } from '@/lib/rate-limit';
import { parseUtilityClaimMultipart, sendUtilityClaimNotification } from '@/lib/utility-claim';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Expected multipart form data.' },
        { status: 400, headers: CORS },
      );
    }

    const parsed = await parseUtilityClaimMultipart(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400, headers: CORS });
    }

    const data = parsed.data;
    const ip = getClientIp(req);

    const ipLim = checkRateLimit(
      `claim:ip:${ip}`,
      RATE.utilityClaimPerIp.max,
      RATE.utilityClaimPerIp.windowMs,
    );
    if (!ipLim.ok) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again shortly.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(ipLim.retryAfterSec) } },
      );
    }

    const emLim = checkRateLimit(
      `claim:email:${data.email.toLowerCase()}`,
      RATE.utilityClaimPerEmail.max,
      RATE.utilityClaimPerEmail.windowMs,
    );
    if (!emLim.ok) {
      return NextResponse.json(
        { error: 'Too many submissions for this email. Try again later.' },
        { status: 429, headers: { ...CORS, 'Retry-After': String(emLim.retryAfterSec) } },
      );
    }

    const sent = await sendUtilityClaimNotification(data, { clientIp: ip });
    if (!sent.ok) {
      return NextResponse.json({ error: sent.error }, { status: 502, headers: CORS });
    }

    return NextResponse.json(
      {
        success: true,
        utilityName: data.utilityName,
        state: data.state,
        email: data.email,
      },
      { headers: CORS },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
