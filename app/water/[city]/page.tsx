import { ReportEvidenceSummary } from '@/components/ReportEvidenceSummary';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { FilterRecommendationsAccent } from '@/components/FilterRecommendationsHero';
import TopPickBox from './TopPickBox';
import EmailCapture from './EmailCapture';
import { cacheLife } from 'next/cache'

import { CITIES } from './cities-data';
import ucmr5Raw from '../../../lib/ucmr5.json';
import cityBlurbs from '@/lib/cityBlurbs';
import { FounderCityAttribution } from '@/components/FounderCityAttribution';
import { UtilityOperatorCcrCta } from '@/components/UtilityOperatorCcrCta';
import { VIEW_ALL_WATER_SYSTEMS_LINK } from '@/lib/site-stats';
import { CityPageHeroImage } from '@/components/CityPageHeroImage';
import { PRIORITY_CITY_H1, PRIORITY_CITY_SEO } from '@/lib/priority-city-seo';
import { getPriorityCityIntroParagraphs } from '@/lib/priority-city-intros';
import { AuthorReviewBadge } from '@/components/AuthorReviewBadge';
import { AuthorByline } from '@/components/AuthorByline';
import { ArticleSchema } from '@/components/ArticleSchema';
import { PriorityCityEditorial } from '@/components/PriorityCityEditorial';
import { CityFilterGuideLinks } from '@/components/CityFilterGuideLinks';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { buildFaqPageSchema } from '@/lib/build-faq-schema';
import { isDedicatedWaterCitySlug } from '@/lib/dedicated-water-city-routes';
import { buildCityPageMetadata } from '@/lib/city-seo-metadata';
import { computeCityWaterScore, concernLevelFromScore, getCityKeyFinding } from '@/lib/city-water-score';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import { buildCityContaminantDisplay } from '@/lib/city-contaminant-display';
import { ScoreGradeDisclaimer } from '@/components/ScoreGradeDisclaimer';
import { CityContaminantTable } from '@/components/CityContaminantTable';
import { CityLegalVsSafeBanner } from '@/components/CityLegalVsSafeBanner';
import { CityFilterTechMatrix } from '@/components/CityFilterTechMatrix';
import { CityLocalWaterStats } from '@/components/CityLocalWaterStats';
import { TestVsFilterCta } from '@/components/TestVsFilterCta';
import { NearbyCities } from '@/components/NearbyCities';
import { CityFAQ } from '@/components/CityFAQ';
import { gaithersburgFAQs } from '@/lib/faq-gaithersburg';
import { raleighFAQs } from '@/lib/faq-raleigh';
import { baltimoreFAQs } from '@/lib/faq-baltimore';
import { chicagoFAQs } from '@/lib/faq-chicago';
import { losAngelesFAQs } from '@/lib/faq-los-angeles';
import { rockvilleFAQs } from '@/lib/faq-rockville';
import { silverSpringFAQs } from '@/lib/faq-silver-spring';
import { bethesdaFAQs } from '@/lib/faq-bethesda';
import { stamfordFAQs } from '@/lib/faq-stamford';
import { kansasCityFAQs } from '@/lib/faq-kansas-city';
import { richmondFAQs } from '@/lib/faq-richmond';
import { parkersburgFAQs } from '@/lib/faq-parkersburg';
import { quizHrefFromCityPage, shouldEmphasizeLabTest } from '@/lib/results-quiz-link';
import { Fragment } from 'react/jsx-runtime';
import { Suspense } from 'react';

const CITY_FAQS: Record<string, { question: string; answer: string }[]> = {
  gaithersburg: gaithersburgFAQs,
  raleigh: raleighFAQs,
  baltimore: baltimoreFAQs,
  chicago: chicagoFAQs,
  'los-angeles': losAngelesFAQs,
  rockville: rockvilleFAQs,
  'silver-spring': silverSpringFAQs,
  bethesda: bethesdaFAQs,
  stamford: stamfordFAQs,
  'kansas-city': kansasCityFAQs,
  richmond: richmondFAQs,
  parkersburg: parkersburgFAQs,
};

const ALL_CITIES_FOR_NEARBY = Object.entries(CITIES).map(([slug, c]) => ({
  name: c.name,
  slug,
  state: c.state,
}));

// UCMR5 data: { [pwsid]: [maxPFASppt, regulatedViolations, [[name, level, hasBenchmark, aboveBenchmark], ...], lithiumUgL?] }
const UCMR5 = ucmr5Raw as unknown as Record<string, [number, number, [string, number, number, number][], number?]>;

// EPA MCLs (ppt) for regulated PFAS as of April 2024
const EPA_MCL: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10, 'HFPO-DA': 10,
};
const EPA_HAZARD_INDEX = ['PFNA', 'PFHxS', 'HFPO-DA'];

function getPfasData(pwsid: string) {
  return getCityPfasData(pwsid);
}

const RO_PICKS = [

  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO. Removes 90+ contaminants.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: 'https://www.amazon.com/dp/B0CHZ8VQBB?tag=watercheckup-20', badge: 'MOST CERTIFIED' },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters, no tools. Compact tankless design, 4-stage filtration.', link: 'https://aquatru.com/products/under-sink-reverse-osmosis-water-purifier', amazon: 'https://www.amazon.com/dp/B0GGTSFZMY?tag=watercheckup-20', badge: 'EASIEST FILTER CHANGE' },
];

const PITCHER_PICKS = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473 — 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: 'https://www.amazon.com/dp/B076B6FXT5?tag=watercheckup-20', badge: 'BEST FOR PFAS & LEAD' },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon life. Removes chlorine, PFOA/PFOS, heavy metals. No installation.', link: 'https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=anbyjkqb', amazon: 'https://www.amazon.com/dp/B07C3P2RZP?tag=watercheckup-20', badge: 'BEST VALUE' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53 certified for lead, chromium, and arsenic. Includes TDS meter.', link: 'https://zerowater.com/collections/water-filter-pitchers-dispensers', amazon: 'https://www.amazon.com/dp/B0DWTTYTQN?tag=watercheckup-20', badge: 'REMOVES TDS' },
];

const TOP_PICKS: Record<string, { label: string; picks: typeof RO_PICKS; why?: string }> = {
  'chicago':       { label: 'Lead detected in tap water', picks: RO_PICKS, why: 'Chosen for Chicago because it removes lead at the tap — the primary concern for homes with older plumbing in Chicago.' },
  'los-angeles':   { label: 'Chromium-6 & PFAS detected', picks: RO_PICKS, why: 'Chosen for LA because it removes both chromium-6 and PFAS — the two primary concerns in the LA municipal supply.' },
  'houston':       { label: 'Elevated THMs in tap water', picks: RO_PICKS, why: 'Chosen for Houston because RO is the most effective method for removing trihalomethanes and disinfection byproducts.' },
  'new-york':      { label: 'Lead risk from building pipes', picks: PITCHER_PICKS, why: 'Chosen for NYC because building pipe lead risk is the main concern — a certified pitcher is practical for renters and apartment dwellers.' },
  'phoenix':       { label: 'PFAS + high TDS detected', picks: RO_PICKS, why: 'Chosen for Phoenix because it removes both PFAS and the high dissolved solids common in Arizona groundwater.' },
  'philadelphia':  { label: 'PFAS from Delaware River', picks: RO_PICKS, why: 'Chosen for Philadelphia because it removes PFAS from the Delaware River source — the primary concern for Philly residents.' },
  'san-antonio':   { label: 'Hard water + DBP violations', picks: RO_PICKS, why: 'Chosen for San Antonio because it specifically addresses disinfection byproducts and hard water — the two primary concerns for SAWS customers.' },
  'gaithersburg':  { label: 'DBPs + PFAS monitoring', picks: RO_PICKS, why: 'Chosen for Gaithersburg/WSSC customers because under-sink RO removes PFAS, lead at the tap, and disinfection byproducts in one certified system.' },
  'dallas':        { label: 'Elevated THMs + HAA5', picks: RO_PICKS, why: 'Chosen for Dallas because RO reliably removes trihalomethanes and haloacetic acids logged in Dallas water violations.' },
  'miami':         { label: 'PFAS + aging infrastructure', picks: RO_PICKS, why: 'Chosen for Miami because it removes PFAS and protects against contaminants from aging South Florida infrastructure.' },
  'seattle':       { label: 'Building pipe lead risk', picks: PITCHER_PICKS, why: 'Chosen for Seattle because building pipe lead risk is the main concern — a certified pitcher is practical for renters.' },
};
const DEFAULT_PICKS = { label: 'Contaminants detected in local water', picks: RO_PICKS, why: '' };

/** Build a city-specific recommendation reason from its data profile. */
function getCityWhy(_slug: string, cd: typeof CITIES[string] | undefined, pfas?: { compounds: [string, number, number, number][]; maxPpt: number } | null): string {
  if (!pfas) return 'Monitoring coverage is incomplete in this snapshot. Check your supplier’s current report or test your tap before choosing equipment.';
  return `For ${cd?.name ?? 'this supplier'}, compare the historical findings below with the current utility report. If you choose treatment, verify the exact model and cartridge’s certified reduction claim, capacity, and replacement schedule. A system-level report does not test your household tap.`;
}

const SERVICE_LINE_URLS: Record<string, { url: string; label: string; hasAddress: boolean }> = {
  'chicago': { url: 'https://sli.chicagowaterquality.org/', label: 'Chicago Address-Level Lookup', hasAddress: true },
  'new-york': { url: 'https://www.nyc.gov/site/dep/environment/lead-service-lines.page', label: 'NYC Lead Service Line Info', hasAddress: false },
  'philadelphia': { url: 'https://arcg.is/1vPmCC', label: 'Philadelphia Service Line Map', hasAddress: true },
  'detroit': { url: 'https://detroitmi.gov/departments/water-and-sewerage-department/water/lead/lead-service-line-replacement', label: 'Detroit Lead Line Replacement', hasAddress: false },
  'cleveland': { url: 'https://www.clevelandwater.com/your-water/lead', label: 'Cleveland Water Lead Info', hasAddress: false },
  'milwaukee': { url: 'https://city.milwaukee.gov/water/lead', label: 'Milwaukee Water Lead Info', hasAddress: false },
  'pittsburgh': { url: 'https://www.pwsa.us/lead', label: 'Pittsburgh Water Lead Info', hasAddress: false },
  'denver': { url: 'https://www.denverwater.org/tap/lead', label: 'Denver Water Lead Info', hasAddress: false },
  'boston': { url: 'https://www.mwra.com/04water/html/leadpipe.htm', label: 'MWRA Lead Service Line Info', hasAddress: false },
  'washington-dc': { url: 'https://dcwater.com/lead', label: 'DC Water Lead Info', hasAddress: false },
  'minneapolis': { url: 'https://www.minneapolismn.gov/resident-services/home-property/water/lead/', label: 'Minneapolis Lead Info', hasAddress: false },
  'st-louis': { url: 'https://www.stlwater.com/lead-service-line-inventory/', label: 'St. Louis Lead Service Line Inventory', hasAddress: false },
  'indianapolis': { url: 'https://www.citizensenergygroup.com/My-Home/Public water systems/Water/Lead-Service-Lines', label: 'Indianapolis Lead Service Lines', hasAddress: false },
  'baltimore': { url: 'https://www.bwsh2o.com/lead', label: 'Baltimore Water Lead Info', hasAddress: false },
};

const LOCAL_SEARCH_INTENT: Record<string, {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  links: { href: string; label: string }[];
}> = {
  gaithersburg: {
    eyebrow: 'GAITHERSBURG WATER TESTING & TREATMENT',
    title: 'Water testing in Gaithersburg, MD: WSSC tap water vs private wells',
    intro:
      'Searches like "Gaithersburg well water testing," "water testing Gaithersburg MD," and "Gaithersburg reverse osmosis" usually mean one of two things: you are either on WSSC municipal water and want to know what is at your tap, or you are on a nearby Montgomery County private well and need a lab test.',
    sections: [
      {
        heading: 'Gaithersburg water quality testing for WSSC customers',
        body:
          'For most Gaithersburg addresses, WSSC Water is the public water system. Start with the WSSC/EPA data on this page, then test your kitchen tap if you live in an older home, have infants, are pregnant, or want address-level lead/PFAS confirmation. City-wide water data cannot see what your building plumbing adds after treatment.',
      },
      {
        heading: 'Well water testing near Gaithersburg',
        body:
          'Private wells are different from WSSC water: EPA municipal monitoring does not cover them. If your home uses a well near Gaithersburg or rural Montgomery County, test for bacteria, nitrate, arsenic, radon, hardness, iron, manganese, and PFAS. Annual bacteria/nitrate testing plus a broader panel every few years is a practical baseline.',
      },
      {
        heading: 'Gaithersburg water treatment and reverse osmosis',
        body:
          'For WSSC tap water, reverse osmosis is the broadest kitchen treatment because it targets PFAS, lead at the tap, disinfection byproducts, and many dissolved contaminants together. A softener is only for hardness/scale; it does not remove PFAS or lead. Whole-house treatment makes more sense for wells with iron, sulfur, bacteria, or very hard water.',
      },
      {
        heading: 'How to get a water test in Gaithersburg, MD',
        body:
          'Start with this free WSSC/EPA report so you know what the public system already measured. Then test your own kitchen tap if the home was built before 1986, you have infants or a pregnancy in the house, or you are on a private well. Montgomery County does not cover wells in EPA city data. Use a first-draw sample after water sits overnight for lead. Mail-in city-water panels (Tap Score / certified labs) cover lead, PFAS, and metals; well panels should add bacteria, nitrate, arsenic, radon, iron, and manganese. WSSC’s treated water can still pick up lead from building plumbing — the lab result is the only address-level answer.',
      },
    ],
    links: [
      { href: '/well', label: 'Private well testing guide' },
      { href: '/blog/best-water-filter-gaithersburg-md', label: 'Best filters for Gaithersburg' },
      { href: '/water/rockville', label: 'Rockville (WSSC) water report' },
      { href: '/water/silver-spring', label: 'Silver Spring (WSSC) water report' },
      { href: '/water/bethesda', label: 'Bethesda (WSSC) water report' },
      { href: '/water-hardness?zip=20877', label: 'Check Gaithersburg hardness' },
      { href: '/quiz', label: 'Find a certified filter' },
    ],
  },
  'san-antonio': {
    eyebrow: 'SAN ANTONIO WATER CONTAMINATION',
    title: 'San Antonio water quality: PFAS, hard water, radium and SAWS data',
    intro:
      'Searches for "PFAS in San Antonio water," "San Antonio water contamination," and "San Antonio water quality" usually point to the same concern: SAWS water can meet federal legal limits while still showing hardness, PFAS monitoring signals, radium context, and treatment byproducts worth filtering at the tap.',
    sections: [
      {
        heading: 'PFAS in San Antonio water',
        body:
          'EPA UCMR5 monitoring is the federal dataset to watch for PFAS in SAWS water. If PFAS is detected, the most defensible home treatment is NSF 58 reverse osmosis or a filter specifically certified for PFAS reduction. Standard taste-and-odor carbon filters are not enough for this concern.',
      },
      {
        heading: 'San Antonio hard water treatment',
        body:
          'San Antonio is one of the harder large-city water supplies because the Edwards Aquifer is mineral-rich limestone. A softener can protect appliances and reduce scale, but it does not remove PFAS, radium, arsenic, nitrate, or lead. For drinking water, pair whole-home softening with RO at the kitchen tap when health contaminants matter.',
      },
      {
        heading: 'Is San Antonio water safe to drink?',
        body:
          'Legal compliance is only one layer. This page combines EPA, UCMR5, and local water profile data so you can see the difference between "meets standards" and "what should I filter for my household."',
      },
    ],
    links: [
      { href: '/blog/pfas-in-san-antonio-water', label: 'PFAS in San Antonio guide' },
      { href: '/blog/san-antonio-water-quality', label: 'Full SAWS water quality guide' },
      { href: '/water-hardness?zip=78205', label: 'San Antonio hardness lookup' },
      { href: '/quiz', label: 'Filter quiz for SAWS water' },
    ],
  },
  baltimore: {
    eyebrow: 'BALTIMORE CITY WATER TESTING',
    title: 'City water testing in Baltimore, MD: lead, PFAS and older plumbing',
    intro:
      'Searches for "city water testing Baltimore MD" usually come from residents who want to know whether the risk is the public water supply or their building plumbing. In Baltimore, both matter: the city treats public water, but older service lines, rowhouse plumbing, and main disturbances can change what reaches your tap.',
    sections: [
      {
        heading: 'Baltimore tap water testing for lead',
        body:
          'Lead is the first contaminant to test at the faucet in older Baltimore homes and rentals. Use a first-draw sample after water sits overnight, and use an NSF 53 lead-certified filter or RO system while you wait for results if children, pregnancy, or old plumbing are involved.',
      },
      {
        heading: 'Baltimore PFAS and city water quality',
        body:
          'UCMR5 and EPA monitoring help identify PFAS and regulated violation history for the public water system. Those datasets are useful, but they do not replace address-level tap testing when the concern is lead, copper, sediment, or building plumbing.',
      },
      {
        heading: 'Water treatment options in Baltimore',
        body:
          'For lead at the tap, choose NSF 53 or NSF 58. For PFAS plus lead together, under-sink reverse osmosis gives broader coverage. Whole-home filters are usually secondary unless you have sediment, taste/odor, or repeated main-break concerns.',
      },
    ],
    links: [
      { href: '/lead', label: 'Lead in water guide' },
      { href: '/blog/best-water-filter-for-lead-removal', label: 'Best lead filters' },
      { href: '/quiz', label: 'Find a Baltimore filter' },
      { href: '/water-hardness?zip=21201', label: 'Baltimore hardness lookup' },
    ],
  },
  raleigh: {
    eyebrow: 'RALEIGH WATER QUALITY & PFAS',
    title: 'Raleigh water quality: PFAS, GenX, THMs and Wake County data',
    intro:
      'Raleigh sits in North Carolina\'s Cape Fear River basin — a region with documented PFAS and GenX industrial history. This page summarizes historical monitoring; review Raleigh’s current annual report and notices to check current compliance.',
    sections: [
      {
        heading: 'PFAS and GenX in Raleigh water',
        body:
          'EPA UCMR5 data is the best public starting point for PFAS in Raleigh and Wake County systems. GenX and related compounds are why North Carolina water quality searches spiked nationally — reverse osmosis (NSF 58) or PFAS-certified pitchers are the residential technologies with credible removal data, not standard carbon filters alone.',
      },
      {
        heading: 'Trihalomethanes and disinfection byproducts',
        body:
          'Raleigh has logged THM violations linked to chlorination of surface water with organic load. Long-term DBP exposure is an epidemiology concern for some households. RO at the kitchen tap removes THMs and HAAs more completely than basic taste-and-odor filters.',
      },
      {
        heading: 'Should you test Raleigh tap water?',
        body:
          'Use this EPA-sourced report first, then test your kitchen tap if you are on an older plumbing system, have infants, or want address-level confirmation beyond city-wide averages. Two neighbors can be on different pressure zones with different monitoring histories.',
      },
    ],
    links: [
      { href: '/pfas', label: 'PFAS guide' },
      { href: '/blog/what-water-filter-removes-pfas', label: 'Filters that remove PFAS' },
      { href: '/water/charlotte', label: 'Charlotte water report' },
      { href: '/water/fairfax-county', label: 'Fairfax County water report' },
      { href: '/quiz', label: 'Find a Raleigh filter' },
    ],
  },
  philadelphia: {
    eyebrow: 'PHILADELPHIA WATER QUALITY',
    title: 'Philadelphia water quality: PFAS, lead service lines and Delaware River DBPs',
    intro:
      'Philadelphia Water Department draws from the Delaware and Schuylkill rivers. The combined profile — PFAS from upstream industrial discharge, lead service lines in roughly a quarter of homes, and chloramine disinfection byproducts — is why Philly residents search for water quality answers beyond the annual CCR.',
    sections: [
      {
        heading: 'PFAS in Philadelphia tap water',
        body:
          'Regional UCMR5 monitoring has detected PFAS compounds in the Delaware River supply chain. Federal limits now apply to several PFAS compounds; under-sink reverse osmosis (NSF 58) or NSF P473-certified pitchers are the practical home options when monitoring shows detections.',
      },
      {
        heading: 'Lead service lines in Philadelphia',
        body:
          'PWD corrosion control helps, but pre-1950 housing with lead service lines or lead solder can still elevate lead at the tap. Use PWD\'s service line map, test a first-draw kitchen sample, and run an NSF 53 or NSF 58 filter while waiting for results if children or pregnancy are involved.',
      },
      {
        heading: 'Delaware River disinfection byproducts',
        body:
          'Urban runoff and combined sewer overflow events increase organic precursors that form trihalomethanes and haloacetic acids during chlorination. RO removes DBPs at the drinking tap; whole-home carbon can help shower exposure if that is a priority.',
      },
    ],
    links: [
      { href: '/lead', label: 'Lead in water guide' },
      { href: '/blog/best-water-filter-for-lead-removal', label: 'Best lead filters' },
      { href: '/pfoa-at-epa-limit', label: 'Cities at EPA PFAS limits' },
      { href: '/quiz', label: 'Find a Philly filter' },
    ],
  },
  'san-diego': {
    eyebrow: 'SAN DIEGO WATER QUALITY',
    title: 'San Diego water quality: imported water, PFAS, hardness and chromium-6',
    intro:
      'San Diego imports more than 85% of its drinking water from the Colorado River and Northern California. That blend — treated with chloramine across most of the county — means hardness, seasonal taste shifts, PFAS monitoring signals, and chromium-6 context all matter for residents comparing tap water to filtration options.',
    sections: [
      {
        heading: 'PFAS in San Diego County water',
        body:
          'Defense corridor and airport AFFF history contribute to PFAS awareness in coastal Southern California. UCMR5 monitoring is the federal dataset to check for your public water system — NSF 58 reverse osmosis remains the broadest residential option when PFAS is detected.',
      },
      {
        heading: 'Hard water and imported supply',
        body:
          'Desert and imported water is mineral-rich — scale on fixtures and appliances is common. A softener addresses hardness; it does not remove PFAS, chromium-6, or lead. Pair softening with kitchen RO when health contaminants are flagged in your report.',
      },
      {
        heading: 'Chromium-6 and California health goals',
        body:
          'Chromium-6 has been detected in San Diego water above California\'s strict health goals even when federal compliance letters read "pass." RO removes chromium-6 at the tap; standard fridge filters typically do not.',
      },
    ],
    links: [
      { href: '/water/los-angeles', label: 'Los Angeles water report' },
      { href: '/water/phoenix', label: 'Phoenix water report' },
      { href: '/blog/what-water-filter-removes-pfas', label: 'PFAS filter guide' },
      { href: '/water-hardness?zip=92101', label: 'San Diego hardness lookup' },
      { href: '/quiz', label: 'Find a San Diego filter' },
    ],
  },
  'fairfax-county': {
    eyebrow: 'FAIRFAX COUNTY WATER QUALITY',
    title: 'Fairfax County water quality: PFAS, WSSC vs Fairfax Water',
    intro:
      'Fairfax County spans multiple public water systems — Fairfax Water, Falls Church, and WSSC zones in the eastern county. UCMR5 monitoring has flagged PFAS above federal limits in parts of Northern Virginia, which drives most "Fairfax County water quality" searches.',
    sections: [
      {
        heading: 'PFAS in Fairfax County tap water',
        body:
          'Defense corridor and airport AFFF history contribute to PFAS signals across Northern Virginia. Check which PWSID serves your address — Fairfax Water and WSSC publish separate CCRs. NSF 58 reverse osmosis is the broadest kitchen treatment when PFAS is detected.',
      },
      {
        heading: 'Fairfax vs WSSC water in Northern Virginia',
        body:
          'Eastern Fairfax addresses may be on WSSC (Potomac/Patuxent sources) while central and western Fairfax are often Fairfax Water. Contaminant profiles differ — search by ZIP on WaterCheckup rather than assuming one county-wide grade.',
      },
      {
        heading: 'Filter picks for Fairfax County households',
        body:
          'Townhouse HOAs sometimes restrict exterior softeners. Under-sink RO or NSF P473 pitchers address PFAS and lead at fixtures without exterior equipment. Pair with a lab test if you are in pre-1986 construction.',
      },
    ],
    links: [
      { href: '/water/gaithersburg', label: 'Gaithersburg (WSSC) report' },
      { href: '/water/washington-dc', label: 'Washington DC water report' },
      { href: '/pfas', label: 'PFAS guide' },
      { href: '/quiz', label: 'Find a Fairfax filter' },
    ],
  },
  nashville: {
    eyebrow: 'NASHVILLE WATER QUALITY',
    title: 'Nashville water quality: PFAS, DBPs and Cumberland River data',
    intro:
      'Metro Nashville draws from the Cumberland River — a growing Sun Belt supply with PFAS monitoring signals, chloramine disinfection byproducts, and moderate hardness. Construction booms also mean main breaks and lead-at-the-tap risk in older neighborhoods.',
    sections: [
      {
        heading: 'PFAS in Nashville tap water',
        body:
          'UCMR5 is the federal dataset for PFAS in Metro Nashville water. Post-2024 EPA limits mean even low detections matter for filter decisions. Reverse osmosis (NSF 58) or PFAS-certified pitchers outperform standard carbon for these compounds.',
      },
      {
        heading: 'Chloramine and disinfection byproducts',
        body:
          'Nashville uses chloramine residual disinfection. DBPs form when chlorine/chloramine reacts with organic matter in river water. RO at the drinking tap removes THMs and HAAs more completely than fridge filters.',
      },
      {
        heading: 'Lead risk after construction or main work',
        body:
          'Hydrant flushing and main replacement can disturb sediment and particulate lead in older plumbing. Flush taps after outages, test first-draw samples in pre-1986 homes, and use NSF 53/58 filtration if children are present.',
      },
    ],
    links: [
      { href: '/water/charlotte', label: 'Charlotte water report' },
      { href: '/blog/best-water-filter-for-lead-removal', label: 'Best lead filters' },
      { href: '/water-hardness?zip=37201', label: 'Nashville hardness lookup' },
      { href: '/quiz', label: 'Find a Nashville filter' },
    ],
  },
  stamford: {
    eyebrow: 'STAMFORD TAP WATER',
    title: 'Stamford, CT water quality: Aquarion, PFAS and older-building lead',
    intro:
      'Stamford sits on Long Island Sound with Aquarion Water Company of Connecticut as the main public supplier. Industrial shoreline history, Connecticut PFAS monitoring, and pre-1986 housing stock are why residents look up tap water beyond the annual CCR.',
    sections: [
      {
        heading: 'PFAS in Stamford and Fairfield County water',
        body:
          'Connecticut has documented PFAS from military and industrial sources. UCMR5 is the federal file to check for Aquarion and nearby systems. If PFAS is detected, NSF 58 reverse osmosis or a PFAS-certified pitcher is the residential technology with credible removal data — not a fridge filter.',
      },
      {
        heading: 'Lead in older Stamford neighborhoods',
        body:
          'Downtown, South End, and other pre-1986 buildings can still have lead solder or brass fixtures. Aquarion’s treated water can meet federal limits while your kitchen tap does not. Test a first-draw sample and use NSF 53 or NSF 58 filtration if children or pregnancy are involved.',
      },
      {
        heading: 'Should you test Stamford tap water?',
        body:
          'Use this EPA-sourced report first, then test the tap if the building is older, you rent and do not know the pipe material, or you want PFAS confirmation beyond city-wide averages. Two condos on the same street can differ after the meter.',
      },
    ],
    links: [
      { href: '/lead', label: 'Lead in water guide' },
      { href: '/pfas', label: 'PFAS guide' },
      { href: '/water/new-york', label: 'New York City water report' },
      { href: '/quiz', label: 'Find a Stamford filter' },
    ],
  },
  'kansas-city': {
    eyebrow: 'KANSAS CITY TAP WATER',
    title: 'Kansas City, MO water quality: Missouri River, DBPs and agricultural runoff',
    intro:
      'Kansas City Water Services draws from the Missouri River — one of the most heavily modified rivers in the US, with upstream agriculture and industrial discharge. Disinfection byproducts and independent health-guideline exceedances are why KC residents search for a clearer tap-water picture than the annual report.',
    sections: [
      {
        heading: 'Missouri River source water',
        body:
          'River water picks up agricultural nitrate, pesticide residues, and organic matter that becomes disinfection byproducts after chlorination. Legal compliance and “what I would filter for my family” are not the same question. This page combines EPA monitoring with that river context.',
      },
      {
        heading: 'Disinfection byproducts in Kansas City water',
        body:
          'Warm river water plus chlorine or chloramine forms trihalomethanes and haloacetic acids. Carbon blocks help taste; NSF 58 reverse osmosis removes DBPs more completely at the drinking tap. A softener does not address this class of contaminants.',
      },
      {
        heading: 'Should Kansas City residents test the tap?',
        body:
          'Start here for the public-system snapshot, then test the kitchen faucet in older KCMO housing or if you want metals and DBPs at the address. Missouri and Kansas addresses on the same metro name can be different utilities — search by ZIP, not “Kansas City” alone.',
      },
    ],
    links: [
      { href: '/water/st-louis', label: 'St. Louis water report' },
      { href: '/water/omaha', label: 'Omaha water report' },
      { href: '/quiz', label: 'Find a Kansas City filter' },
    ],
  },
  richmond: {
    eyebrow: 'RICHMOND TAP WATER',
    title: 'Richmond, VA water quality: James River, DBPs and industrial legacy',
    intro:
      'Richmond Department of Public Utilities draws from the James River, which carries upstream industrial history and urban runoff. Disinfection byproducts and older Fan/Church Hill plumbing are the usual reasons residents look up whether Richmond tap water needs a filter.',
    sections: [
      {
        heading: 'James River source and industrial legacy',
        body:
          'The James recovered from decades of industrial pollution, but it is still a surface-water supply with organic load and upstream discharge. That chemistry is why DBPs show up in monitoring even when the city meets most federal limits.',
      },
      {
        heading: 'Disinfection byproducts and older Richmond homes',
        body:
          'Chlorination of river water forms THMs and HAAs. Pre-1986 housing can add lead at the tap after overnight stagnation. NSF 53 covers lead; NSF 58 reverse osmosis covers lead plus DBPs and many dissolved contaminants together.',
      },
      {
        heading: 'Should you test Richmond tap water?',
        body:
          'Use this EPA-sourced report first. Test a first-draw kitchen sample if the home is older, you have children, or you want address-level metals beyond city averages. Henrico and Chesterfield neighbors may be on different systems than the City of Richmond.',
      },
    ],
    links: [
      { href: '/water/fairfax-county', label: 'Fairfax County water report' },
      { href: '/water/washington-dc', label: 'Washington DC water report' },
      { href: '/lead', label: 'Lead in water guide' },
      { href: '/quiz', label: 'Find a Richmond filter' },
    ],
  },
  parkersburg: {
    eyebrow: 'PARKERSBURG PFAS / PFOA',
    title: 'Parkersburg, WV water: DuPont PFOA, Ohio River discharge and tap filters',
    intro:
      'Parkersburg is the US PFOA story: DuPont’s Washington Works plant discharged C8 into the Ohio River for decades. EPA UCMR5 still shows PFOA far above the 4 ppt legal limit. Residents searching this page usually want today’s levels and what actually removes forever chemicals at the tap.',
    sections: [
      {
        heading: 'PFOA in Parkersburg drinking water',
        body:
          'The packaged Parkersburg Utility Board record shows a PFOA peak of 46.5 ppt. Nearby Lubeck PSD is a separate supplier. A historical peak is not a current tap measurement or an official compliance finding; check the current report before choosing treatment.',
      },
      {
        heading: 'Why pitcher filters are not enough here',
        body:
          'Standard carbon pitchers are not rated for Parkersburg’s PFAS profile. Short-chain compounds can break through exhausted carbon. If you lived here during the C8 years, medical monitoring and tap filtration are separate conversations — this page is about what is in the water now.',
      },
      {
        heading: 'Should Parkersburg residents retest?',
        body:
          'Yes if you use well water near the Ohio River, you have not tested in years, or you want confirmation after a filter change. Municipal customers should still read this EPA snapshot, then consider a PFAS-capable mail-in panel if they want address-level numbers beyond the public system average.',
      },
    ],
    links: [
      { href: '/pfoa-at-epa-limit', label: 'Cities at the EPA PFOA limit' },
      { href: '/pfas', label: 'PFAS guide' },
      { href: '/blog/what-water-filter-removes-pfas', label: 'Filters that remove PFAS' },
      { href: '/quiz', label: 'Find a Parkersburg filter' },
    ],
  },
};

// export async function generateStaticParams() {
//   return Object.keys(CITIES)
//     .filter((city) => !isDedicatedWaterCitySlug(city))
//     .map((city) => ({ city }));
// }

// export const revalidate = 86400 * 30; // every 30 days

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  "use cache";
  cacheLife('weeks');
  const params = await props.params;
  const cd = CITIES[params.city];
  if (!cd) return { title: 'Water Quality Report | WaterCheckup' };

  const pwsid = resolveCityPwsid(params.city, cd.pwsid, cd.zip);
  const pfas = getCityPfasData(pwsid);
  const prioritySeo = PRIORITY_CITY_SEO[params.city];
  return buildCityPageMetadata(params.city, cd, pfas, prioritySeo);
}

const urgencyConfig = {
  high:   { color: '#ef4444', bg: '#ef444415', border: '#ef444440', label: 'HIGH CONCERN', icon: '🚨' },
  medium: { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40', label: 'MONITOR',      icon: '⚠️' },
  low:    { color: '#22d3ee', bg: '#22d3ee15', border: '#22d3ee40', label: 'GENERALLY OK', icon: '✅' },
};

// Concern-level context copy shown in the problem banner (aligned to water safety score)
function getUrgencyContext(_concern: 'high' | 'medium' | 'low', _issues: string[], cityName: string): string {
  return `This ${cityName} report summarizes available historical monitoring. A low concentration or missing record does not certify every tap as safe, and a peak above a benchmark is not an official compliance finding. Confirm your supplier, review its current report, and test your own tap if you need an address-level answer.`;
}

export default async function CityPage(props: { params: Promise<{ city: string }> }) {

  "use cache";
  cacheLife('weeks'); 

  const params = await props.params;
  const slug = params.city;
  const cd = CITIES[slug];
  if (!cd) notFound();
  const cityName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const pwsidResolved = cd ? resolveCityPwsid(slug, cd.pwsid, cd.zip) : '';
  const pfasForScore = cd ? getCityPfasData(pwsidResolved) : null;
  const waterScorePreview = cd
    ? computeCityWaterScore(cd, pfasForScore)
    : null;
  const concernLevel = waterScorePreview?.grade === '—' ? 'medium' : waterScorePreview
    ? concernLevelFromScore(waterScorePreview.score)
    : (cd?.urgency ?? 'medium');
  const urg = urgencyConfig[concernLevel];
  const cityBlurbText = cityBlurbs[slug as keyof typeof cityBlurbs]?.blurb;
  const pwsid = pwsidResolved;
  const pfas = cd ? pfasForScore : null;
  const contaminantRows = cd
    ? buildCityContaminantDisplay(slug, cd.pwsid, cd.waterProfile, 18, cd.zip, cd.state)
    : [];
  const cityPicks = TOP_PICKS[slug] || DEFAULT_PICKS;
  const cityWhyText = getCityWhy(slug, cd, pfas);
  const webPageAuthorLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    author: {
      '@type': 'Person',
      name: 'Joe Letorney',
      url: 'https://watercheckup.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterCheckup',
      url: 'https://watercheckup.com',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watercheckup.com' },
      { '@type': 'ListItem', position: 2, name: 'Water Quality by City', item: 'https://watercheckup.com/water' },
      { '@type': 'ListItem', position: 3, name: `${cd?.name ?? cityName} Water Quality`, item: `https://watercheckup.com/water/${slug}` },
    ],
  };

  const waterScore = cd ? computeCityWaterScore(cd, pfas) : null;
  const keyFinding = cd ? getCityKeyFinding(cd.urgency, cd.issues, pfas) : '';

  const faqSchema = buildFaqPageSchema([
    { name: `What does this ${cd.name} water report show?`, text: 'This report summarizes available historical supplier monitoring. It is not a household tap test or a determination of legal compliance. Confirm the supplier and review its current annual report.' },
    { name: `Does ${cd.name} water have PFAS?`, text: !pfas ? `There is no matching record for PWSID ${pwsidResolved} in this packaged snapshot; that gap does not establish detection or nondetection.` : `${pfas.compounds.length} compounds are listed in this historical snapshot for PWSID ${pwsidResolved}. Individual peaks do not determine compliance or describe current water at every tap.` },
    { name: 'How should I decide whether to test or filter?', text: 'Identify a documented concern. A certified laboratory can test your household tap or private well. For treatment, verify the exact model and cartridge’s certified reduction claims, capacity, and replacement interval.' },
  ], `https://watercheckup.com/water/${slug}`);

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageAuthorLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {!CITY_FAQS[slug] && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      
      <SiteHeader variant="inner" showCta ctaLabel="Find the right filter →" ctaHref="/quiz" />
      
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 64 }}>
          <nav style={{ fontSize: 13, color: '#a8b4c4', marginBottom: 14 }}>
            <Link prefetch href="/" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link prefetch href="/water" style={{ color: '#a8b4c4', textDecoration: 'none' }}>Cities</Link>
            {cd?.state && (
              <>
                <span style={{ margin: '0 6px' }}>›</span>
                <span>{cd.state}</span>
              </>
            )}
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#cbd5e1' }}>{cd?.name ?? cityName}</span>
          </nav>

          <CityPageHeroImage cityLabel={cd ? `${cd.name}, ${cd.state}` : cityName} />

          <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            WATER QUALITY REPORT
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
            {PRIORITY_CITY_H1[slug]
              ?? (slug === 'gaithersburg'
                ? 'Gaithersburg, MD Water Quality Report'
                : cd
                  ? `${cd.name}, ${cd.state} tap water: what\u2019s in it in 2026`
                  : `${cityName} tap water: what\u2019s in it in 2026`)}
          </h1>

          {slug === 'gaithersburg' ? (
            <>
              <AuthorByline />
              <ArticleSchema
                headline={PRIORITY_CITY_H1.gaithersburg ?? 'Is Gaithersburg Tap Water Safe? (2026)'}
                slug="gaithersburg"
                datePublished="2026-01-01"
                dateModified="2026-07-17"
              />
            </>
          ) : (
            cd && <AuthorReviewBadge />
          )}

          {slug === 'gaithersburg' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0', margin: '0 0 18px', lineHeight: 1.3 }}>
                Gaithersburg water quality (WSSC Water)
              </h2>
              <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 18px', lineHeight: 1.8 }}>
                Gaithersburg is served by{' '}
                <strong style={{ color: '#e2e8f0' }}>WSSC Water</strong> (Washington Suburban Sanitary Commission).
                Below: EPA violation history, UCMR5 PFAS monitoring, lead risk in older homes, and NSF-certified filters
                for Montgomery County tap water.
              </p>
            </>
          )}

          {cd && getPriorityCityIntroParagraphs(slug) && <PriorityCityEditorial slug={slug} />}

          {cd && <CityFilterGuideLinks />}

          <ReportEvidenceSummary supplier={cd.system} pwsid={pwsidResolved} hardness={cd.waterProfile?.hardness} />

          {cd && !getPriorityCityIntroParagraphs(slug) && slug !== 'gaithersburg' && (
            <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 18px', lineHeight: 1.6 }}>
              Serving {cd.population} residents via {cd.system}
              {cityBlurbText ? ` · ${cityBlurbText}` : ''}
            </p>
          )}

          {cd && slug === 'gaithersburg' && (
            <>
              <p style={{ fontSize: 15, color: '#cbd5e1', margin: '0 0 12px', lineHeight: 1.6 }}>
                Serving {cd.population} residents via {cd.system}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                {[
                  { href: `/water-hardness?zip=${encodeURIComponent(cd.zip)}`, label: 'Water testing & hardness by ZIP' },
                  { href: '/worst-hardness', label: 'Hardest tap water rankings' },
                  { href: '/rankings', label: 'Maryland / state rankings' },
                  { href: '/best-cities', label: 'Best tap water cities' },
                ].map(({ href, label }) => (
                  <Link
                    prefetch
                    key={href}
                    href={href}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#67e8f9',
                      textDecoration: 'none',
                      padding: '6px 10px',
                      background: 'rgba(8,145,178,0.12)',
                      borderRadius: 8,
                    }}
                  >
                    {label} →
                  </Link>
                ))}
              </div>
            </>
          )}

          {cd && slug !== 'gaithersburg' && (
            <p style={{ fontSize: 14, margin: '0 0 18px' }}>
              <Link
                prefetch
                href={`/water-hardness?zip=${encodeURIComponent(cd.zip)}`}
                style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}
              >
                Check water hardness in {cd.name} →
              </Link>
            </p>
          )}

          {/* Water Profile — hardness, TDS, pH, treatment, fluoride, nitrate */}
          {cd?.waterProfile && (() => {
            const wp = cd.waterProfile!;
            const hardnessLabel = !wp.hardness ? null : wp.hardness > 300 ? 'Very Hard' : wp.hardness > 150 ? 'Hard' : wp.hardness > 75 ? 'Moderately Hard' : 'Soft';
            const hardnessColor = !wp.hardness ? '#22d3ee' : wp.hardness > 300 ? '#ef4444' : wp.hardness > 150 ? '#f97316' : wp.hardness > 75 ? '#f59e0b' : '#22d3ee';
            const tdsLabel = !wp.tds ? null : wp.tds > 500 ? 'High' : wp.tds > 250 ? 'Moderate' : 'Low';
            const nitrateSeverity = wp.nitrate && wp.nitrate > 8 ? '#ef4444' : wp.nitrate && wp.nitrate > 4 ? '#f59e0b' : '#22d3ee';
            const items = [
              wp.hardness && { label: 'Hardness', value: `${wp.hardness} mg/L`, tag: hardnessLabel!, color: hardnessColor },
              wp.tds && { label: 'TDS', value: `${wp.tds} mg/L`, tag: tdsLabel!, color: '#a78bfa' },
              wp.pH && { label: 'pH', value: `${wp.pH}`, tag: wp.pH > 8.0 ? 'Alkaline' : wp.pH < 7.0 ? 'Acidic' : 'Neutral', color: '#22d3ee' },
              wp.treatment && { label: 'Disinfectant', value: wp.treatment === 'chloramine' ? 'Chloramine' : wp.treatment === 'ozone+chlorine' ? 'Ozone + Chlorine' : 'Chlorine', tag: wp.treatment === 'chloramine' ? '⚠ Standard filters don\'t remove' : null, color: wp.treatment === 'chloramine' ? '#f59e0b' : '#22d3ee' },
              wp.fluoride && { label: 'Fluoride', value: `${wp.fluoride} mg/L`, tag: 'Added', color: '#22d3ee' },
              wp.nitrate && { label: 'Nitrate', value: `${wp.nitrate} mg/L`, tag: wp.nitrate > 8 ? 'Near limit' : 'Below limit', color: nitrateSeverity },
            ].filter(Boolean) as { label: string; value: string; tag: string | null; color: string }[];
            if (!items.length) return null;
            return (
              <div style={{ marginBottom: 20, padding: '14px 16px', background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.2)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: '#67e8f9', marginBottom: 10 }}>WATER PROFILE — {wp.source}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                  {items.map(item => (
                    <div key={item.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 7, padding: '8px 10px' }}>
                      <div style={{ fontSize: 11, color: '#a8b4c4', fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.value}</div>
                      {item.tag && <div style={{ fontSize: 10, fontWeight: 700, color: item.color, opacity: 0.8, marginTop: 1 }}>{item.tag}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Issue tags */}
          {cd && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {cd.issues.map((issue, i) => (
                <span key={i} style={{ fontSize: 13, fontWeight: 600, padding: '4px 10px', background: `${urg.color}18`, border: `1px solid ${urg.border}`, borderRadius: 6, color: urg.color }}>
                  {issue}
                </span>
              ))}
            </div>
          )}

          {/* Water Safety Score + Urgency badge */}
          {cd && (() => {
            const ws = computeCityWaterScore(cd, pfas);
            const circumference = 2 * Math.PI * 36;
            const dashOffset = circumference - (ws.score / 88) * circumference;
            return (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Score circle */}
                <div style={{ background: '#071828', border: `2px solid ${ws.scoreColor}30`, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto' }}>
                  <div style={{ position: 'relative', width: 88, height: 88 }}>
                    <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="44" cy="44" r="36" fill="none" stroke="#1a3a5c" strokeWidth="8" />
                      <circle
                        cx="44" cy="44" r="36" fill="none"
                        stroke={ws.scoreColor} strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: ws.scoreColor, lineHeight: 1 }}>{ws.grade === '—' ? '—' : ws.score}</span>
                      <span style={{ fontSize: 9, color: '#a8b4c4', letterSpacing: 1, marginTop: 2 }}>/ 88</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#a8b4c4', letterSpacing: 2, marginBottom: 4 }}>
                      WATERCHECKUP SAFETY SCORE
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: ws.gradeColor, lineHeight: 1 }}>Grade: {ws.grade}</div>
                    <div style={{ fontSize: 13, color: ws.scoreColor, fontWeight: 600, marginTop: 4 }}>{ws.label}</div>
                    <ScoreGradeDisclaimer style={{ marginTop: 10, maxWidth: 420 }} />
                    <div style={{ fontSize: 13, color: '#a8b4c4', marginTop: 8 }}>
                      Same score for your ZIP —{' '}
                      <Link prefetch href="/" style={{ color: '#67e8f9', textDecoration: 'none' }}>look up your ZIP</Link> for the full contaminant report
                    </div>
                  </div>
                </div>

                {/* Urgency badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 10, alignSelf: 'center' }}>
                  <span style={{ fontSize: 18 }}>{urg.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: urg.color, letterSpacing: 1 }}>{urg.label}</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1' }}>Based on water safety score</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {cd ? (
          <>
            {/* ── STEP 1: THE PROBLEM ── */}
            <div style={{ marginBottom: 72 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT YOU SHOULD KNOW ABOUT {cd.name.toUpperCase()} WATER
              </div>

              {/* Context banner */}
              <div style={{ padding: '16px 20px', background: `${urg.color}10`, border: `1px solid ${urg.border}`, borderRadius: 12, marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.8, margin: 0 }}>
                  {getUrgencyContext(concernLevel, cd.issues, cd.name)}
                </p>
              </div>

              {/* Known issues */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {cd.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                    <span style={{ color: urg.color, fontSize: 16, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 600 }}>{issue}</span>
                  </div>
                ))}
              </div>

              <CityLocalWaterStats
                cityName={cd.name}
                stateCode={cd.state}
                pwsid={pwsid}
                rows={contaminantRows}
                pfasCompoundCount={pfas?.compounds?.length ?? 0}
              />

              {contaminantRows.length > 0 ? (
                <>
                  <CityLegalVsSafeBanner cityName={cd.name} />
                  <CityContaminantTable
                    cityName={cd.name}
                    stateCode={cd.state}
                    rows={contaminantRows}
                    sourceNote="EPA UCMR5 PFAS plus utility/EWG averages from our contaminant bundle. Run a ZIP report for live SDWIS samples at your address."
                  />
                </>
              ) : null}

              {/* Facts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cd.facts.map((fact, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── STEP 2: PFAS DATA ── */}
            {(() => {
              if (!pfas) {
                return (
                  <div style={{ marginBottom: 72, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>PFAS TESTING — EPA UCMR5 DATA</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>EPA UCMR5 monitoring · Testing period 2023–2025 · Packaged historical snapshot; see methodology</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>📋</span>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>No UCMR5 data on file for this system</div>
                    </div>
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>
                      The EPA&apos;s 5th Unregulated Contaminant Monitoring Rule (UCMR5) required systems serving 3,300+ people to test for 29 PFAS compounds between 2023–2025. This packaged snapshot has no matching record. That does not tell us whether the system tested or whether PFAS was detected. Consult the current official report.
                    </p>
                    <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0 }}>
                      Source: EPA UCMR5 national dataset · Check the linked utility report for current data
                    </p>
                  </div>
                );
              }
              const { maxPpt, violations, compounds } = pfas;
              const hasDetections = compounds.length > 0;
              const statusColor = violations > 0 ? '#ef4444' : hasDetections ? '#f59e0b' : '#22d3ee';
              const statusLabel = violations > 0 ? 'HISTORICAL PEAKS ABOVE BENCHMARK' : hasDetections ? 'HISTORICAL PFAS DETECTIONS' : 'NO PFAS DETECTED';
              const statusIcon = violations > 0 ? '🚨' : hasDetections ? '⚠️' : '✅';

              return (
                <div style={{ marginBottom: 72 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2 }}>PFAS TESTING DATA — EPA UCMR5</div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>Testing period 2023–2025 · Packaged historical snapshot; see methodology</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: `${statusColor}12`, border: `1px solid ${statusColor}35`, borderRadius: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 22 }}>{statusIcon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: statusColor, letterSpacing: 1 }}>{statusLabel}</div>
                      <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
                        {hasDetections
                          ? `Max detected: ${maxPpt} ppt · ${compounds.length} compound${compounds.length !== 1 ? 's' : ''} found · ${violations} compound above benchmark${violations !== 1 ? 's' : ''}`
                          : 'All 29 PFAS compounds tested below detection limits'}
                      </div>
                    </div>
                  </div>

                  {hasDetections && (
                    <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px', gap: 0 }}>
                        {['Compound', 'Level (ppt)', 'EPA MCL', 'Interpretation'].map((h, i) => (
                          <div key={h} style={{ padding: '10px 14px', fontSize: 13, fontWeight: 800, color: '#a8b4c4', letterSpacing: 1, background: '#040d14', borderBottom: '1px solid #1a3a5c', textAlign: i > 0 ? 'center' : 'left' }}>
                            {h}
                          </div>
                        ))}
                        {[...compounds].sort((a, b) => b[1] - a[1]).map(([name, level, , overEPA], idx) => (
                          <Fragment key={`${name}-${idx}`}>
                            <div style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#e2e8f0', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none' }}>
                              {name}
                              {EPA_MCL[name] !== undefined && <span style={{ fontSize: 13, color: '#a8b4c4', marginLeft: 6 }}>regulated</span>}
                            </div>
                            <div key={`${name}-level`} style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: overEPA ? '#f59e0b' : '#cbd5e1', textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none' }}>
                              {level.toFixed(1)}
                            </div>
                            <div key={`${name}-epa`} style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none', color: EPA_MCL[name] !== undefined ? (overEPA ? '#ef4444' : '#22d3ee') : '#a8b4c4' }}>
                              {EPA_MCL[name] !== undefined ? (overEPA ? `❌ >${EPA_MCL[name]} ppt` : `✓ ≤${EPA_MCL[name]} ppt`) : '—'}
                            </div>
                            <div key={`${name}-health`} style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', borderBottom: idx < compounds.length - 1 ? '1px solid #0f2336' : 'none', color: '#a8b4c4' }}>
                              Historical peak; not a compliance finding
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  )}


                  <p style={{ fontSize: 13, color: '#a8b4c4', margin: 0, lineHeight: 1.6 }}>
                    Source: EPA UCMR5 national monitoring dataset · Testing period 2023–2025 · MCL = Maximum Contaminant Level (legally enforceable limit) · Historical peaks are not official compliance findings
                  </p>
                </div>
              );
            })()}

            {/* ── INLINE EMAIL CAPTURE — right after PFAS data while alarm is highest ── */}
            <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(8,145,178,0.07)', border: '1px solid rgba(8,145,178,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#cbd5e1', flexShrink: 0 }}>🔔 Get the general weekly water treatment newsletter:</span>
              <EmailCapture cityName={cd.name} slug={slug} inline />
            </div>

            <CityFilterTechMatrix rows={contaminantRows} cityName={cd.name} />

            <TestVsFilterCta
              contextLabel={cd.name}
              filterHref={quizHrefFromCityPage({
                zip: cd.zip,
                hasPfas: (pfas?.compounds?.length ?? 0) > 0,
                urgency: cd.urgency,
              })}
              emphasizeTest={shouldEmphasizeLabTest({
                pfasCount: pfas?.compounds?.length,
                pfasAboveMcl: pfas?.violations,
                score: waterScore?.score,
                hasLeadSignal: cd.issues.some(i => /lead/i.test(i)),
              })}
              filterCtaLabel="Take the 3-question filter quiz →"
            />

            {LOCAL_SEARCH_INTENT[slug] && (
              <section style={{ margin: '0 0 72px', padding: '22px 24px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
                  {LOCAL_SEARCH_INTENT[slug].eyebrow}
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.25, margin: '0 0 12px' }}>
                  {LOCAL_SEARCH_INTENT[slug].title}
                </h2>
                <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 18px' }}>
                  {LOCAL_SEARCH_INTENT[slug].intro}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
                  {LOCAL_SEARCH_INTENT[slug].sections.map((section) => (
                    <div key={section.heading} style={{ padding: '16px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.35 }}>
                        {section.heading}
                      </h3>
                      <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {LOCAL_SEARCH_INTENT[slug].links.map((link) => (
                    <Link
                      prefetch
                      key={link.href}
                      href={link.href}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#67e8f9',
                        textDecoration: 'none',
                        padding: '7px 10px',
                        background: 'rgba(8,145,178,0.12)',
                        borderRadius: 8,
                      }}
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── STEP 3: FILTER RECOMMENDATION ── */}
            <div className="wc-filter-rec-accent-wrap" style={{ marginBottom: 8, overflow: 'hidden' }}>
              <FilterRecommendationsAccent />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 6, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT TO DO ABOUT IT
              </div>
              <p style={{ fontSize: 14, color: '#cbd5e1', margin: '0 0 22px', lineHeight: 1.6 }}>
                Based on {cd.name}&apos;s water profile above, here&apos;s the exact system we recommend — and why it&apos;s right for this water supply specifically.
              </p>
            </div>

            <TopPickBox
              picks={cityPicks.picks}
              label={cityPicks.label}
              cityName={cd.name}
              citySlug={slug}
              whyText={cityWhyText}
            />

            {/* ── SYSTEM INFO ── */}
            <div style={{ marginBottom: 72, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>WATER SYSTEM -- EPA SDWIS</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { l: 'System Name', v: cd.system },
                  { l: 'EPA PWSID', v: pwsid },
                  { l: 'Population Served', v: cd.population },
                  { l: 'State', v: cd.state },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 13, color: '#cbd5e1', letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#cbd5e1' }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>City data coming soon</div>
            <p style={{ fontSize: 14 }}>Enter your ZIP code above to check your specific water system.</p>
          </div>
        )}

        {/* ── FAQ ── */}
        {CITY_FAQS[slug] ? (
          <CityFAQ slug={slug} faqs={CITY_FAQS[slug]} />
        ) : (
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            COMMON QUESTIONS
          </h2>
          {faqSchema.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })).map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>{q}</h3>
              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
        )}

        {/* ── LEAD SERVICE LINE ── */}
        <div style={{ marginBottom: 64, padding: '20px 22px', background: 'linear-gradient(135deg,#0a1e35,#071525)', border: '1px solid #1a3a5c', borderRadius: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>LEAD SERVICE LINE RISK</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Does your street have lead pipes?</div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 22px' }}>
            As of October 2024, all US public water systems must publish a public inventory of their lead service lines —
            the pipes connecting the water main to your home. Even if your public water system water tests clean at the treatment plant,
            lead can leach from these pipes into your tap. Homes built before 1986 are most at risk.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(() => {
              const custom = SERVICE_LINE_URLS[params.city];
              const pwsid = cd?.pwsid;
              return (
                <>
                  {custom && (
                    <a href={custom.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 9, textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{custom.label} →</div>
                        <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 2 }}>
                          {custom.hasAddress ? 'Enter your address to check your exact service line material' : 'Lead pipe replacement info and local resources'}
                        </div>
                      </div>
                    </a>
                  )}
                  {pwsid && (
                    <a href={'https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/service-line-inventory?pwsid=' + pwsid}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 9, textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>EPA Official Service Line Inventory →</div>
                        <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 2 }}>Federal LCRR inventory data for {cd?.system} · PWSID {pwsid}</div>
                      </div>
                    </a>
                  )}
                  <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4, lineHeight: 1.6 }}>
                    💡 Homes built before 1986 may have lead solder or service lines. A filter certified NSF/ANSI 53 removes lead at the tap regardless of pipe material.
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {slug === 'gaithersburg' && cd && (
          <NewsletterSignup
            source="water-gaithersburg"
            zip={cd.zip}
            title="Weekly water treatment newsletter"
            description="General water testing, filtration, and maintenance guidance — one email per week. This does not monitor WSSC changes or local emergencies."
            compact
          />
        )}

        {/* ── STEP 4: EMAIL CAPTURE ── */}
        <EmailCapture cityName={cd?.name ?? cityName} slug={params.city} />

        {/* ── STEP 5: ZIP CTA ── */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 96 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>
            Check your specific address
          </div>
          <p style={{ fontSize: 15, color: '#cbd5e1', marginBottom: 24, lineHeight: 1.6 }}>
            City-wide data is just the start. Enter your ZIP to see your exact water system&apos;s EPA report, PFAS levels, and violation history — then get the right filter for your home.
          </p>
          <Link prefetch href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Fix My Water — Free →
          </Link>
        </div>

        {/* ── RELATED BLOG POSTS ── */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', letterSpacing: 2, margin: '0 0 14px' }}>RELATED GUIDES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { slug: 'is-pfas-in-my-tap-water', title: 'Is PFAS in My Tap Water?', badge: 'PFAS' },
              { slug: 'best-water-filter-for-lead-removal', title: 'Best Filters for Lead Removal', badge: 'Lead' },
              { slug: 'what-water-filter-removes-pfas', title: 'What Filter Removes PFAS?', badge: 'Filters' },
              { slug: 'what-does-epa-water-violation-mean', title: 'What Does an EPA Violation Mean?', badge: 'EPA' },
              { slug: 'reverse-osmosis-pros-and-cons', title: 'Reverse Osmosis: Pros & Cons', badge: 'Filters' },
              { slug: 'tap-water-safety-during-pregnancy', title: 'Tap Water Safety During Pregnancy', badge: 'Health' },
            ].map(({ slug, title, badge }) => (
              <Link key={slug} prefetch href={`/blog/${slug}`} style={{ display: 'block', padding: '12px 14px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0891b2', letterSpacing: 1, marginBottom: 4 }}>{badge}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>{title}</div>
              </Link>
            ))}
            <Link prefetch href="/worst" style={{ display: 'block', padding: '12px 14px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 8, textDecoration: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: 1, marginBottom: 4 }}>RANKINGS</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>Worst Water Systems in the US</div>
            </Link>
          </div>
        </div>

        {/* ── NEARBY CITIES ── */}
        {slug === 'gaithersburg' ? (
          <div style={{ marginBottom: 20 }}>
            <NearbyCities
              currentSlug="gaithersburg"
              currentState="MD"
              allCities={ALL_CITIES_FOR_NEARBY}
              maxResults={8}
            />
            <Link prefetch href="/utilities" style={{ fontSize: 13, color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
              {VIEW_ALL_WATER_SYSTEMS_LINK}
            </Link>
          </div>
        ) : (
          cd && (
            <div style={{ marginBottom: 20 }}>
              <NearbyCities
                currentSlug={params.city}
                currentState={cd.state}
                allCities={ALL_CITIES_FOR_NEARBY}
                maxResults={8}
              />
              <Link prefetch href="/utilities" style={{ fontSize: 13, color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
                {VIEW_ALL_WATER_SYSTEMS_LINK}
              </Link>
            </div>
          )
        )}

        <UtilityOperatorCcrCta variant="city-footer" />

        <FounderCityAttribution />
      </div>
    </div>
  );
}
