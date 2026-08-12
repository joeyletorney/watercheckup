import { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'SERankingBacklinksBot',
        disallow: '/',
      },
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      // Allow AI crawlers full access to public content
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: 'watercheckup.com',
  }
}
