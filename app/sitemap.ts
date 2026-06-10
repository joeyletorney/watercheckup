import { MetadataRoute } from 'next'
import { BLOG_POST_SLUGS, HIGH_PRIORITY_BLOG_SLUGS } from '@/lib/blog-post-slugs'
import { TOP_RESULT_ZIPS } from './results/top-result-zips'
import { WATER_CITY_SLUGS, CITIES } from './water/[city]/cities-data'
import { getSitemapUtilityParams } from '@/lib/utilities-data'
import { SITE_ORIGIN } from '@/lib/site-url'

/** Full public water system + ZIP lists exceed Vercel ISR body limits (~19 MB); sitemap stays a curated subset. */

export const dynamic = 'force-static'
export const revalidate = 86400

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

const HIGH_PRIORITY_CITIES = new Set([
  'sugar-land', 'miami', 'new-york', 'houston', 'san-antonio', 'phoenix',
  'los-angeles', 'philadelphia', 'chicago', 'columbus', 'pensacola',
  'parkersburg', 'fort-worth', 'dallas', 'sacramento', 'fresno', 'austin',
  'fairfax-county', 'gaithersburg',
]);

function buildSitemap(): MetadataRoute.Sitemap {
  const base = SITE_ORIGIN
  const lastModified = new Date()

  const staticEntries = [
    { path: '',              priority: 1.0, changeFreq: 'daily'   as const },
    { path: '/about',        priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/contact',      priority: 0.55, changeFreq: 'monthly' as const },
    { path: '/privacy',      priority: 0.35, changeFreq: 'yearly'  as const },
    { path: '/terms',        priority: 0.35, changeFreq: 'yearly'  as const },
    { path: '/water',        priority: 0.82, changeFreq: 'weekly'  as const },
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
    { path: '/pfoa-at-epa-limit', priority: 0.94, changeFreq: 'monthly' as const },
    { path: '/well',         priority: 0.85, changeFreq: 'monthly' as const },
    { path: '/pfas',         priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/lead',         priority: 0.9,  changeFreq: 'monthly' as const },
    { path: '/rankings',     priority: 0.9,  changeFreq: 'weekly'  as const },
    { path: '/utilities/claim', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/water-hardness', priority: 0.7, changeFreq: 'monthly' as const },
  ].map(p => ({
    url: `${base}${p.path}`,
    lastModified,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }))

  const blogPostEntries = BLOG_POST_SLUGS.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: HIGH_PRIORITY_BLOG_SLUGS.has(slug) ? 0.9 : 0.75,
  }))

  const cityEntries = WATER_CITY_SLUGS.map(slug => ({
    url: `${base}/water/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: HIGH_PRIORITY_CITIES.has(slug) ? 0.85 : 0.7,
  }))

  const stateAbbrMap: Record<string, boolean> = {}
  Object.values(CITIES).forEach(cd => { stateAbbrMap[cd.state] = true })
  const stateEntries = Object.keys(stateAbbrMap).map(abbr => {
    const name = STATE_NAMES[abbr] || abbr
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    return {
      url: `${base}/water/state/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    }
  })

  const zipResultEntries: MetadataRoute.Sitemap = TOP_RESULT_ZIPS.map((zip) => ({
    url: `${base}/results/${zip}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.55,
  }))

  const utilParams = getSitemapUtilityParams()
  const utilityEntries: MetadataRoute.Sitemap = utilParams.map(({ state, slug }) => ({
    url: `${base}/utilities/${state}/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.45,
  }))
  const utilStateSet = new Set(utilParams.map((u) => u.state))
  for (const st of Array.from(utilStateSet)) {
    utilityEntries.push({
      url: `${base}/utilities/${st}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.45,
    })
  }
  utilityEntries.push({
    url: `${base}/utilities`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })

  const merged: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...blogPostEntries,
    ...stateEntries,
    ...cityEntries,
    ...zipResultEntries,
    ...utilityEntries,
  ]

  const pinned: MetadataRoute.Sitemap = [
    { url: `${base}/water/san-antonio`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/water/gaithersburg`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/water/houston`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/water/phoenix`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/water/sugar-land`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/water/pensacola`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/water/fairfax-county`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/water/miami`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/results/78205`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/blog/top-10-most-pfas-contaminated-cities`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/blog/san-antonio-water-quality`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/pfas-in-san-antonio-water`, lastModified, changeFrequency: 'weekly', priority: 0.89 },
    { url: `${base}/blog/best-water-filter-hard-water`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/reverse-osmosis-vs-distilled-water`, lastModified, changeFrequency: 'monthly', priority: 0.86 },
    { url: `${base}/blog/top-10-cities-hardest-tap-water`, lastModified, changeFrequency: 'monthly', priority: 0.86 },
  ]

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const e of merged) byUrl.set(e.url, e)
  for (const e of pinned) byUrl.set(e.url, e)
  return Array.from(byUrl.values())
}

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    return buildSitemap()
  } catch {
    return [
      { url: SITE_ORIGIN, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_ORIGIN}/water`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_ORIGIN}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ]
  }
}
