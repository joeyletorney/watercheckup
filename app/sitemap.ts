import { MetadataRoute } from 'next'

const CITY_SLUGS = [
  // Top 50 metros
  'chicago','los-angeles','houston','new-york','phoenix','philadelphia',
  'san-antonio','dallas','miami','seattle','denver','boston','atlanta',
  'san-francisco','detroit','minneapolis','portland','las-vegas','nashville',
  'baltimore','memphis','louisville','cleveland','pittsburgh','indianapolis',
  'columbus','charlotte','raleigh','omaha','kansas-city','new-orleans','tampa',
  'st-louis','sacramento','salt-lake-city','albuquerque','tucson','jacksonville',
  'austin','san-diego','san-jose','washington-dc','cincinnati','milwaukee',
  'buffalo','anchorage','honolulu','baton-rouge','richmond',
  // Additional high-value cities
  'orlando','fort-worth','el-paso','fresno','virginia-beach','mesa',
  'colorado-springs','long-beach','bakersfield','aurora','anaheim',
  'santa-ana','corpus-christi','riverside','st-paul','lexington',
  'stockton','henderson','greensboro','plano','newark','lincoln',
  'durham','chandler','fort-wayne','madison','lubbock','glendale-az',
  'norfolk','winston-salem','garland','scottsdale','hialeah','laredo',
  'reno','chesapeake','gilbert','boise','spokane','fremont',
]

// Static pages with known last-modified dates
const STATIC_PAGES = [
  { path: '',             priority: 1.0, changeFreq: 'daily'   as const, lastMod: '2025-03-29' },
  { path: '/faq',         priority: 0.8, changeFreq: 'weekly'  as const, lastMod: '2025-03-29' },
  { path: '/contaminants',priority: 0.8, changeFreq: 'weekly'  as const, lastMod: '2025-03-29' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watercheckup.com'

  const staticEntries = STATIC_PAGES.map(p => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date(p.lastMod),
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }))

  const cityEntries = CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/water/${slug}`,
    lastModified: new Date('2025-03-29'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...cityEntries]
}
