import { MetadataRoute } from 'next'

const CITY_SLUGS = [
  'chicago','los-angeles','houston','new-york','phoenix','philadelphia',
  'san-antonio','dallas','miami','seattle','denver','boston','atlanta',
  'san-francisco','detroit','minneapolis','portland','las-vegas','nashville',
  'baltimore','memphis','louisville','cleveland','pittsburgh','indianapolis',
  'columbus','charlotte','raleigh','omaha','kansas-city','new-orleans','tampa',
  'st-louis','sacramento','salt-lake-city','albuquerque','tucson','jacksonville',
  'austin','san-diego','san-jose','washington-dc','cincinnati','milwaukee',
  'buffalo','anchorage','honolulu','baton-rouge','richmond',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watercheckup.com'
  const now = new Date()

  const cityPages = CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/water/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contaminants`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...cityPages,
  ]
}
