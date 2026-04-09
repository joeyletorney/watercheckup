import { MetadataRoute } from 'next'
import { POSTS } from './blog/posts'
import { WATER_CITY_SLUGS } from './water/[city]/cities-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watercheckup.com'
  const now = new Date()

  const staticEntries = [
    { path: '',              priority: 1.0, changeFreq: 'daily'  as const },
    { path: '/faq',          priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/contaminants', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog',         priority: 0.85, changeFreq: 'weekly' as const },
    { path: '/quiz',         priority: 0.75, changeFreq: 'weekly' as const },
    { path: '/well',         priority: 0.85, changeFreq: 'monthly' as const },
  ].map(p => ({
    url: `${baseUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }))

  const blogPostEntries = Object.entries(POSTS).map(([slug, post]) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(post.date + 'T12:00:00.000Z'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const cityEntries = WATER_CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/water/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...blogPostEntries, ...cityEntries]
}
