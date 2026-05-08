import { MetadataRoute } from 'next'
import { POSTS } from './blog/posts'
import { WATER_CITY_SLUGS, CITIES } from './water/[city]/cities-data'

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
  // Use a stable "last major update" date for static pages so Google
  // doesn't see all 229 URLs with the same timestamp (which it ignores).
  const dataRefresh   = new Date('2026-05-01T00:00:00.000Z'); // rolling — bump when data/templates ship
  const siteRefresh   = new Date('2026-05-01T00:00:00.000Z');

  const staticEntries = [
    { path: '',              priority: 1.0, changeFreq: 'daily'   as const },
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
    lastModified: dataRefresh,
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
    lastModified: dataRefresh,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // State hub pages at /water/state/[slug] — dedupe via object keys
  const stateAbbrMap: Record<string, boolean> = {}
  Object.values(CITIES).forEach(cd => { stateAbbrMap[cd.state] = true })
  const stateEntries = Object.keys(stateAbbrMap).map(abbr => {
    const name = STATE_NAMES[abbr] || abbr
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${baseUrl}/water/state/${slug}`,
      lastModified: siteRefresh,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })

  return [...staticEntries, ...blogPostEntries, ...stateEntries, ...cityEntries]
}
