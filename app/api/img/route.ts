import { NextRequest, NextResponse } from 'next/server';

// Proxy images from CDNs that block browser hotlinking (e.g. Amazon)
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  // Only proxy from known safe domains
  const allowed = [
    'm.media-amazon.com',
    'images-na.ssl-images-amazon.com',
    'images-eu.ssl-images-amazon.com',
  ];
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }
  if (!allowed.includes(hostname)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WaterCheckup/1.0)',
        'Referer': 'https://www.amazon.com/',
      },
    });
    if (!res.ok) return new NextResponse('Fetch failed', { status: 502 });
    const buf = await res.arrayBuffer();
    const ct = res.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(buf, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 502 });
  }
}
