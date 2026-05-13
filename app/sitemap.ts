import { MetadataRoute } from 'next'
import { POSTS } from './blog/posts'
import { WATER_CITY_SLUGS, CITIES } from './water/[city]/cities-data'

/** Pre-render + sitemap: high-value ZIP result pages for SEO */
const TOP_ZIPS = [
  '02101', '02188', '02190', '10001', '11201', '07101', '19101', '15201',
  '21201', '20001', '33101', '33602', '32801', '28201', '27601', '37201',
  '60601', '44101', '43201', '48201', '53201', '55101', '64101', '63101',
  '77001', '78201', '75201', '76101', '78701', '85001', '85701', '80201',
  '89101', '98101', '97201', '90001', '94101', '92101', '30301', '70112',
  '39201', '29201', '68101', '50301', '46201', '73101', '87101', '96801',
  '02146', '02169', '10019', '07302', '90210', '93301', '25301', '35201', '40201',
]

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
  KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
  MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',
  RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',
  TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',
  WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'Washington DC',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watercheckup.com'
  const now = new Date()

  const staticEntries = [
    { path: '',              priority: 1.0, changeFreq: 'daily'   as const },
    { path: '/methodology',  priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/faq',          priority: 0.8, changeFreq: 'weekly'  as const },
    { path: '/contaminants', priority: 0.8, changeFreq: 'weekly'  as const },
    { path: '/blog',         priority: 0.85, changeFreq: 'weekly' as const },
    { path: '/quiz',         priority: 0.75, changeFreq: 'weekly' as const },
    { path: '/worst',            priority: 0.96, changeFreq: 'weekly'  as const },
    { path: '/worst-pfas',       priority: 0.96, changeFreq: 'monthly' as const },
    { path: '/worst-thm',        priority: 0.94, changeFreq: 'monthly' as const },
    { path: '/worst-water',      priority: 0.95, changeFreq: 'monthly' as const },
    { path: '/worst-lead',       priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/worst-violations', priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/worst-states',     priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/well',         priority: 0.85, changeFreq: 'monthly' as const },
    { path: '/pfas',         priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/lead',         priority: 0.9,  changeFreq: 'monthly' as const },
  ].map(p => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }))

  const blogPostEntries = Object.entries(POSTS).map(([slug, post]) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority:1,
  }))

  const cityEntries = WATER_CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/water/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }))

  // State hub pages at /water/state/[slug] — dedupe via object keys
  const stateAbbrMap: Record<string, boolean> = {}
  Object.values(CITIES).forEach(cd => { stateAbbrMap[cd.state] = true })
  const stateEntries = Object.keys(stateAbbrMap).map(abbr => {
    const name = STATE_NAMES[abbr] || abbr
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/water/state/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority:1,
    }
  })

  const zipResultEntries = TOP_ZIPS.map(zip => ({
    url: `${baseUrl}/results/${zip}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const merged: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...blogPostEntries,
    ...stateEntries,
    ...cityEntries,
    ...zipResultEntries,
  ]

  /** Pinned URLs: override changeFrequency / priority (and dedupe same URL). */
  const pinned: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/water/san-antonio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/water/houston`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/water/phoenix`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog/best-water-filter-hard-water`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
  ]

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const e of merged) {
    byUrl.set(e.url, e)
  }
  for (const e of pinned) {
    byUrl.set(e.url, e)
  }
  return Array.from(byUrl.values())
}
