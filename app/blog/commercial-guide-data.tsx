import type { Post } from './post-types';

export const GUIDE_SOURCES = {
  epaLead: 'https://www.epa.gov/water-research/consumer-tool-identifying-point-use-and-pitcher-filters-certified-reduce-lead',
  cdc: 'https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html',
  brita: 'https://www.brita.com/products/brita-elite-replacement-filters/',
  aquaPds: 'https://shop.aquatruwater.com/wp-content/uploads/2025/01/Classic-Connect-Updated-PDS.pdf',
  aquaPrices: 'https://aquatru.com/collections/classic-filters',
  aquaLife: 'https://support.aquatruwater.com/hc/en-us/articles/360041787193-How-often-do-I-need-to-change-my-filters',
  softener: 'https://www.epa.gov/watersense/cation-exchange-water-softeners',
  selection: 'https://www.epa.gov/system/files/documents/2025-01/ws-products-home-water-treatment-guide_v2_508.pdf',
  k19: 'https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s',
};

type Choice = { costSummary?: string; merchant?: { href: string; label: string; brand: string; sponsored: boolean }; costSource?: string; option: string; fit: string; constraint: string; evidence: string; source: string; cost: string };
export type CommercialGuide = {
  title: string; excerpt: string; verdict: string; choices: Choice[];
};

const pitcher: Choice = {
  costSummary: '$65.98 buys four cartridges (480 rated gallons): conservative annual supply at 1 gallon/day; pitcher extra.',
  merchant: { href: GUIDE_SOURCES.brita, label: 'Shop Brita Elite OB06 cartridges →', brand: 'Brita', sponsored: false },
  option: 'Brita Elite OB06 in a compatible pitcher',
  fit: 'Compare for drinking-water lead reduction without plumbing.',
  constraint: 'Manual filling; cold water only. Buy the Elite cartridge, not an Original cartridge.',
  evidence: 'Brita identifies OB06, reports 99% lead reduction and lists Class I particulate reduction. Its product page links the performance data sheet; confirm your pitcher/cartridge pairing there.',
  source: GUIDE_SOURCES.brita,
  cost: 'Official replacement price: $19.99 single or $32.99 two-pack, checked Nov. 11, 2026. At an assumed 1 gallon/day, 365 ÷ 120 = 3.04 cartridge lives/year: four cartridges cover that volume (two two-packs, $65.98). This is a conservative full-cartridge supply allowance; subtract the included cartridge when budgeting first-year purchases. Pitcher, tax and shipping extra. Replace at 120 gallons or about six months; hard water may shorten life.',
};
const aqua: Choice = {
  merchant: { href: 'https://www.amazon.com/dp/B0CQS3HQ8F?tag=watercheckup-20', label: 'Check AquaTru Classic price on Amazon →', brand: 'AquaTru', sponsored: true },
  costSource: GUIDE_SOURCES.aquaPrices,
  costSummary: '$129.83/year annualized replacement-filter allowance at 1 gallon/day; unit, water, power and maintenance extra.',
  option: 'AquaTru Classic countertop RO',
  fit: 'Compare when several listed contaminants or dissolved solids matter.',
  constraint: 'Needs outlet, counter space, tank refilling and reject-water disposal. PDS: 120 V/60 Hz, cold feed, maximum hardness 10 gpg (171 mg/L); soften above that limit.',
  evidence: 'Official PDS revision 10.24.R4, pp. 1–2: models AT2000/2010/2020/2030/2040/2050, IAPMO R&T certification to NSF/ANSI 42/53/58/372/401 for specified claims. Lead row: 97.5% minimum, 99.1% average laboratory reduction; household results vary.',
  source: GUIDE_SOURCES.aquaPds,
  cost: 'Official Classic filter prices checked Nov. 11, 2026: pre/carbon $29.95, VOC $39.95, RO $59.95. At an assumed 1 gallon/day (365/year), the full-year recurring filter allowance is 2 × $29.95 + $39.95 + 0.5 × $59.95 = $129.83/year (rounded). This spreads membrane cost across two years; it is not first-year cash spending. Unit price is not verified here. Add the purchase price, tax/shipping, water/sewer, electricity, cleaning and any pretreatment. Check that the merchant listing matches the model and included filters.',
};

export const COMMERCIAL_GUIDES: Record<string, CommercialGuide> = {
  'best-water-filter-for-lead-removal': {
    title: 'Best Water Filters for Lead Removal 2026: Options & Evidence',
    excerpt: 'Compare a lead-reduction pitcher, countertop RO and installed filtration by exact evidence, installation needs and ownership costs.',
    verdict: 'For lead alone, start with a filter whose exact model and cartridge have a certified lead-reduction claim. RO is an option when additional contaminants justify it; it is not required for every lead concern.',
    choices: [pitcher, aqua, {
      option: 'Installed point-of-use filter: select an exact certified model',
      fit: 'For a dedicated drinking/cooking tap and fewer manual refills.',
      constraint: 'Check cold-water fittings, pressure and cabinet clearance. Dedicated faucets may require a hole; RO also needs a drain connection, and powered models need an outlet. Get landlord approval for plumbing changes.',
      evidence: 'EPA consumer tool (June 6, 2024): look for NSF/ANSI 53 with an explicit lead-reduction claim and NSF/ANSI 42 Class I particulate reduction. A standard number alone does not establish every contaminant claim. No installed model is endorsed here without model-specific evidence.',
      source: GUIDE_SOURCES.epaLead,
      cost: 'Obtain a unit/cartridge quote and installation quote. Annual media allowance = cartridge price × max(365 ÷ rated gallons, 12 ÷ rated months) at the assumed 1 gallon/day. Round up for whole-cartridge purchases; include RO water and power where applicable.',
    }],
  },
  'best-countertop-water-filter': {
    title: 'Best Countertop Water Filters 2026: RO & Pitcher Comparison',
    excerpt: 'Compare countertop RO and a lead-reduction pitcher with official model evidence, setup limits and replacement-cost assumptions.',
    verdict: 'Choose a pitcher for a supported lead claim and simple setup. Compare countertop RO when its specific reduction claims match your water and you can accommodate power, tanks and maintenance.',
    choices: [pitcher, aqua, {
      option: 'Waterdrop K19-S: existing-owner reference',
      fit: 'For checking support before keeping an existing unit; not a current new-unit recommendation.',
      constraint: 'Official page marks K19-S discontinued. Other K19 variants are different models; do not transfer certification claims between them.',
      evidence: 'Waterdrop K19 official product page, checked Nov. 11, 2026: discontinued notice; K19RF replacement listed at $68.99, up to 12 months or 1,100 gallons. This is replacement/availability evidence, not verification of lead or PFAS certification.',
      source: GUIDE_SOURCES.k19,
      cost: 'For an existing compatible K19-S at 1 gallon/day, one K19RF per year gives a $68.99 recurring filter allowance at the observed price. Add water, electricity and maintenance; shorter life increases cost. Confirm cartridge compatibility before purchase.',
    }],
  },
  'best-water-filter-hard-water': {
    title: 'Best Water Filter for Hard Water 2026: Softener vs RO',
    excerpt: 'Compare whole-house softening, drinking-water RO and scale conditioning by purpose, installation and ongoing costs.',
    verdict: 'For hardness throughout the home, compare a properly sized ion-exchange softener. For drinking water only, compare RO within its feed-water limits. Carbon and shower filters should not be sold as whole-home softeners.',
    choices: [{
      option: 'Whole-house ion-exchange softener',
      fit: 'Removes calcium and magnesium for household hardness treatment.',
      constraint: 'Requires main-line access, room for equipment/salt and a compliant regeneration drain; verify local discharge rules and installer requirements.',
      evidence: 'EPA WaterSense explains calcium/magnesium exchange for sodium or potassium, with salt and water consumed in regeneration. WaterSense does not label softeners. EPA’s selection guide points to NSF/ANSI 44 and efficiency ratings.',
      source: GUIDE_SOURCES.softener,
      cost: 'Get a site-specific installed quote. Annual cost = salt bags/year × local bag price + regeneration gallons/year × combined water/sewer rate per gallon + electricity + service. Size using measured hardness and household usage; no universal salt-use or payback estimate is assumed.',
    }, aqua, {
      option: 'Scale conditioner',
      fit: 'Compare for scale management when mineral removal is not required.',
      constraint: 'Confirm feed-water limits, plumbing space and media replacement. Scale conditioning is a different outcome from removing hardness ions.',
      evidence: 'EPA water-treatment selection guide, hardness section: distinguishes softening from conditioning and identifies IAPMO/ANSI Z601 for scale-reduction devices. This is category guidance, not certification of a named product.',
      source: GUIDE_SOURCES.selection,
      cost: 'Get an installed quote and written media/service interval. Annual media allowance = replacement-media cost ÷ rated years, plus service and any specified water/power use. No maintenance-free or guaranteed savings claim is assumed.',
    }],
  },
};

export function CommercialGuideArticle({ slug }: { slug: string }) {
  const lead = slug === 'best-water-filter-for-lead-removal';
  const hard = slug === 'best-water-filter-hard-water';
  return <>
    <h2>Match the treatment to your water</h2>
    <p>{hard
      ? 'Measure hardness with a hardness-specific test or laboratory result reported as calcium carbonate. A TDS meter measures total dissolved solids and does not isolate calcium and magnesium. RO at one tap does not soften showers, laundry or the water heater.'
      : 'Review your utility report and use a household tap test when plumbing-related lead is the concern. A city-wide report cannot establish the lead level at your faucet. Compare the exact system, cartridge and reduction claim before ordering.'}</p>
    <p><a href={GUIDE_SOURCES.cdc}>CDC: choosing home water filters</a> explains why the filter must match the substance of concern. A certification standard is not a promise to remove everything; review the listed claims and operating conditions.</p>
    <h2>Installation and daily use</h2>
    <p>{hard
      ? 'A softener serves a different purpose from a drinking-water filter. Ask the installer about sizing, bypass plumbing, regeneration discharge and service access. A conditioner should be evaluated for scale reduction rather than advertised as a mineral-removing softener.'
      : 'A pitcher needs no outlet or plumbing, but you must refill and clean it. A batch-fill countertop RO system still needs an accessible outlet, space to lift out tanks, and somewhere to discard concentrate. Under-sink systems require fitting and pressure checks; RO typically adds a drain connection. Check the manual and rental agreement before modifying plumbing.'}</p>
    <h2>Budget for replacement filters</h2>
    <p>The comparison uses an illustrative one gallon of finished drinking water per day, not a measured household average. More use or difficult feed water can mean earlier replacement. Budget recurring costs separately from first-year purchases and check what the starter bundle includes. Prices checked November 11, 2026 can change.</p>
    <p><a href={GUIDE_SOURCES.aquaLife}>AquaTru’s Classic replacement schedule</a>: pre/carbon at six months or 600 gallons; VOC at one year or 600 gallons; RO at two years or 1,200 gallons, whichever comes first. Use the schedule for the exact model, not the Carafe or another product family.</p>
    <h2>{lead ? 'Lead reduction is not pipe replacement' : 'What this comparison establishes'}</h2>
    <p>{lead
      ? 'A point-of-use filter treats the water passing through it; it does not remove a lead service line or replace corroding plumbing. Follow local utility instructions and the cartridge replacement schedule. A lower TDS reading does not prove lead removal.'
      : 'These are comparisons of documented features and treatment categories. They are not hands-on tests, universal rankings or guarantees of water quality. Countertop RO is not a substitute for whole-house hardness treatment.'}</p>
    <p>For PFAS or another contaminant, check its explicit reduction claim on the model’s current performance sheet. Do not infer PFAS reduction solely from NSF/ANSI 58, or lead reduction from NSF/ANSI 372 (a materials lead-content standard).</p>
    <p>Some site links may earn a commission. The official evidence links in this comparison are provided for checking claims; a purchase is not required to use them.</p>
  </>;
}

export function commercialPost(slug: string, date: string, badge: string, badgeColor: string): Post {
  const guide = COMMERCIAL_GUIDES[slug];
  return {
    title: guide.title, excerpt: guide.excerpt,
    seo: { title: guide.title, description: guide.excerpt, canonical: `https://watercheckup.com/blog/${slug}` },
    date, dateModified: '2026-11-12', dateDisplay: 'November 12, 2026', readTime: '6 min read', badge, badgeColor,
    topPicks: [],
    faq: [
      { q: 'Did WaterCheckup test these systems?', a: 'No hands-on or laboratory testing is claimed here. This comparison uses the linked official documents and explicitly stated cost assumptions.' },
      { q: 'Does an NSF standard number prove every reduction claim?', a: 'No. Match the exact model and cartridge to the listed contaminant claim, operating limits and replacement schedule.' },
    ],
    content: <CommercialGuideArticle slug={slug} />,
  };
}
