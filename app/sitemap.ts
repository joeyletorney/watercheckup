import { MetadataRoute } from 'next'
import { POSTS } from './blog/posts'
import { TOP_RESULT_ZIPS } from './results/top-result-zips'
import { WATER_CITY_SLUGS, CITIES } from './water/[city]/cities-data'
import { getTopUtilityStaticParamsByPopulation, getUniqueUtilityStatesLowercase } from '@/lib/utilities-data'
import { getAllCountyStaticParams } from '@/lib/county-data'

/** Full public water system + ZIP lists exceed Vercel ISR body limits (~19 MB); sitemap stays a curated subset. */
/** Keep utility URLs in sitemap smaller so crawl budget favors city + ranking pages. */
const SITEMAP_TOP_UTILITIES_BY_POP = 400

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://watercheckup.com'
  const now = new Date()

  const staticEntries = [
    { path: '',              priority: 1.0, changeFreq: 'daily'   as const },
    { path: '/about',        priority: 0.5, changeFreq: 'monthly' as const },
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
    { path: '/worst-cities',     priority: 0.94, changeFreq: 'weekly'  as const },
    { path: '/best-cities',      priority: 0.88, changeFreq: 'monthly' as const },
    { path: '/worst-hardness',   priority: 0.88, changeFreq: 'monthly' as const },
    { path: '/worst-pfas-cities', priority: 0.93, changeFreq: 'monthly' as const },
    { path: '/well',         priority: 0.85, changeFreq: 'monthly' as const },
    { path: '/pfas',         priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/lead',         priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/rankings',     priority: 0.9,  changeFreq: 'weekly'  as const },
    { path: '/utilities/claim', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/water-hardness', priority: 0.7, changeFreq: 'monthly' as const },
  ].map(p => ({
    url: `${base}${p.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }))

  const HIGH_PRIORITY_BLOG = new Set([
    'top-10-most-pfas-contaminated-cities',
    'san-antonio-water-quality',
    'pfas-in-san-antonio-water',
  ]);
  const HIGH_PRIORITY_CITIES = new Set([
    'sugar-land', 'miami', 'new-york', 'houston', 'san-antonio', 'phoenix',
    'los-angeles', 'philadelphia', 'chicago', 'columbus', 'pensacola',
    'parkersburg', 'fort-worth', 'dallas', 'sacramento', 'fresno', 'austin',
    'fairfax-county', 'gaithersburg',
  ]);

  const blogPostEntries = Object.entries(POSTS).map(([slug]) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: HIGH_PRIORITY_BLOG.has(slug) ? 0.9 : 0.75,
  }))

  const cityEntries = WATER_CITY_SLUGS.map(slug => ({
    url: `${base}/water/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: HIGH_PRIORITY_CITIES.has(slug) ? 0.85 : 0.7,
  }))

  // State hub pages at /water/state/[slug] — dedupe via object keys
  const stateAbbrMap: Record<string, boolean> = {}
  Object.values(CITIES).forEach(cd => { stateAbbrMap[cd.state] = true })
  const stateEntries = Object.keys(stateAbbrMap).map(abbr => {
    const name = STATE_NAMES[abbr] || abbr
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${base}/water/state/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    }
  })

  const countyStatic = getAllCountyStaticParams()
  const countyEntries = countyStatic.map(({ state, countySlug }) => ({
    url: `${base}/water/county/${state}/${countySlug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Result pages are ISR for arbitrary ZIPs; only list high-value ZIPs here (not full national index).
  const zipResultEntries: MetadataRoute.Sitemap = TOP_RESULT_ZIPS.map((zip) => ({
    url: `${base}/results/${zip}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.55,
  }))

  let utilityEntries: MetadataRoute.Sitemap = []
  try {
    const utilParams = getTopUtilityStaticParamsByPopulation(SITEMAP_TOP_UTILITIES_BY_POP)
    utilityEntries = utilParams.map(({ state, slug }) => ({
      url: `${base}/utilities/${state}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.45,
    }))
    const utilStates = getUniqueUtilityStatesLowercase()
    utilityEntries = utilityEntries.concat(
      utilStates.map((st) => ({
        url: `${base}/utilities/${st}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.45,
      })),
    )
    utilityEntries.push({
      url: `${base}/utilities`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })
  } catch {
    // data/utilities.json not generated — skip public water system URLs
  }

  const merged: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...blogPostEntries,
    ...stateEntries,
    ...countyEntries,
    ...cityEntries,
    ...zipResultEntries,
    ...utilityEntries,
  ]

  /** Pinned URLs: override changeFrequency / priority (and dedupe same URL). */
  const pinned: MetadataRoute.Sitemap = [
    { url: `${base}/water/san-antonio`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/water/gaithersburg`, lastModified: now, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/water/houston`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/water/phoenix`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/water/sugar-land`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/water/pensacola`, lastModified: now, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/water/fairfax-county`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/water/miami`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/top-10-most-pfas-contaminated-cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/blog/san-antonio-water-quality`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/pfas-in-san-antonio-water`, lastModified: now, changeFrequency: 'weekly', priority: 0.89 },
    { url: `${base}/blog/best-water-filter-hard-water`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/reverse-osmosis-vs-distilled-water`, lastModified: now, changeFrequency: 'monthly', priority: 0.86 },
    { url: `${base}/blog/top-10-cities-hardest-tap-water`, lastModified: now, changeFrequency: 'monthly', priority: 0.86 },
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
