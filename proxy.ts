import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Aggressive SEO / scraper bots that burn function invocations without ranking value. */
const BLOCKED_USER_AGENTS = [
  /SERankingBacklinksBot/i,
  /SEMrushBot/i,
  /AhrefsBot/i,
  /Majestic/i,
  /DotBot/i,
  /MJ12bot/i,
  /BLEXBot/i,
  /DataForSeoBot/i,
  /PetalBot/i,
  /Bytespider/i,
]

export function proxy(request: NextRequest) {
  const url = new URL(request.url)
  if (url.hostname === 'www.watercheckup.com') {
    url.hostname = 'watercheckup.com'
    return NextResponse.redirect(url, 308)
  }

  const userAgent = request.headers.get('user-agent') ?? ''

  if (BLOCKED_USER_AGENTS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  // Skip static assets so proxy only runs where it can save expensive work
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)',
  ],
}
