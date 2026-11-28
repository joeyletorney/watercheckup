import {
  GAITHERSBURG_TESTING_SOURCES as S,
  MD_CERTIFIED_LAB_BODY,
  MD_TESTING_COST_BODY,
  MD_TESTING_ZIP_REPORTS,
  MD_WHAT_TO_TEST_BODY,
  type CityLocalSearchIntent,
} from '@/lib/city-water-testing';

export type PlaceFaq = { question: string; answer: string };

export type PlaceTestingGuide = CityLocalSearchIntent & {
  faqs: PlaceFaq[];
};

const zipLink = (href: string, label: string) => ({ href, label });

export const PLACE_TESTING_GUIDES: Record<string, PlaceTestingGuide> = {
  baltimore: {
    eyebrow: 'HOW TO TEST YOUR WATER IN BALTIMORE, MD',
    title: 'How to test your water in Baltimore, MD',
    intro:
      'City water testing in Baltimore, MD starts with two different questions: what Baltimore City DPW treats and delivers, and what your building plumbing adds at the kitchen tap. DPW’s Consumer Confidence Report is a system-wide summary. A certified first-draw sample is the address-level test. Use the free ZIP report on this site for the EPA snapshot, then decide between DPW’s Ashburton Laboratory and a Maryland-certified lab.',
    sections: [
      {
        heading: 'City water testing in Baltimore, MD',
        body:
          'Searches for “city water testing Baltimore MD” usually come from residents who want to know whether the risk is the public supply or older rowhouse plumbing. Both can matter. Baltimore DPW treats reservoir water at Montebello and Ashburton, but service lines, indoor solder, and main work can change what reaches your faucet. This page is a free public-records snapshot, not a lab. WaterCheckup does not sell tests.',
      },
      {
        heading: 'DPW’s Ashburton Laboratory can arrange testing',
        body:
          'DPW’s Water Quality Report tells residents concerned about lead to contact the City and Ashburton Laboratory at (410) 396-0150 to arrange water testing. The same report lists Montebello Laboratory at (410) 396-6040 for questions about the annual report. Ask DPW whether a household sample is available and what it costs — this site does not quote a DPW fee. The Baltimore Service Line Partnership inventory is the place to check pipe material. Certified mail-in labs are another option when you want a broader metals or PFAS panel.',
        sources: [S.baltimoreCcr, S.baltimoreLines],
      },
      {
        heading: 'Maryland certified drinking-water labs',
        body: MD_CERTIFIED_LAB_BODY,
        sources: [S.mdeLabs, S.mdeLabsPdf],
      },
      {
        heading: 'Well water vs Baltimore city water',
        body:
          'Most Baltimore City addresses are on DPW municipal water — the EPA/UCMR5 snapshot on this page. Private wells are uncommon inside the city and are not covered by DPW’s CCR. If you are on a well (more often in surrounding counties), skip the city-water snapshot as your only answer and use a Maryland-certified well panel.',
      },
      {
        heading: 'What to test for in Baltimore',
        body: MD_WHAT_TO_TEST_BODY,
        sources: [S.umdTesting, S.tapTest],
      },
      {
        heading: 'Rough cost ranges',
        body: MD_TESTING_COST_BODY,
        sources: [S.mdhFees],
      },
      {
        heading: 'Free ZIP report vs a lab tap test',
        body:
          'Enter a Baltimore ZIP on WaterCheckup for a free supplier snapshot (historical EPA records, not a faucet result). A CCR or ZIP report cannot see lead from your service line. Use a first-draw kitchen sample after water sits overnight when children, pregnancy, or unknown pipe material are in the house.',
      },
    ],
    links: [
      zipLink(MD_TESTING_ZIP_REPORTS.baltimore, 'Baltimore ZIP report (21201)'),
      { href: S.baltimoreCcr.href, label: 'Baltimore DPW water quality report' },
      { href: S.mdeLabs.href, label: 'Maryland certified lab list' },
      { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'Mail-in tap test guide' },
      { href: '/lead', label: 'Lead in water guide' },
      { href: '/blog/best-water-filter-for-lead-removal', label: 'Best lead filters' },
      { href: '/quiz', label: 'Find a Baltimore filter' },
    ],
    faqs: [
      {
        question: 'Where can I get city water testing in Baltimore, MD?',
        answer:
          'Start with this free ZIP/EPA snapshot. For a household lead sample, DPW’s Water Quality Report says to contact Ashburton Laboratory at (410) 396-0150 to arrange testing. For a broader panel, use a laboratory on the Maryland Department of the Environment certified drinking-water lab list. WaterCheckup is not a lab and does not sell tests.',
      },
      {
        question: 'Is Baltimore city water testing free?',
        answer:
          'The WaterCheckup ZIP report is free. DPW’s Ashburton Laboratory can arrange testing — ask DPW about current availability and any fee; this site does not publish a DPW price. Maryland Department of Health lists state-lab well-water fees (bacteria $41, nitrate $18, lead $20, hardness $23). Commercial certified labs set their own prices.',
      },
      {
        question: 'Is Baltimore’s water quality report the same as a lab test of my tap?',
        answer:
          'No. DPW’s Consumer Confidence Report summarizes treated water and utility sampling. It cannot see lead, copper, or sediment from your service line or indoor plumbing. A certified first-draw tap sample is the address-level test.',
      },
    ],
  },
  gaithersburg: {
    eyebrow: 'WELL WATER VS CITY WATER TESTING IN GAITHERSBURG, MD',
    title: 'Well water vs city water testing in Gaithersburg, MD',
    intro:
      'Gaithersburg well water testing and Gaithersburg city water testing are not the same job. Most in-town addresses are on WSSC Water (municipal / city water). Private wells — more common on the rural edge of Montgomery County — are not in WSSC’s Consumer Confidence Report or in EPA municipal monitoring. Use this page for the free WSSC/EPA snapshot, then a Maryland-certified laboratory for an address-level result. WaterCheckup is not a lab and does not sell tests.',
    sections: [
      {
        heading: 'Who needs to test in Gaithersburg and Montgomery County',
        body:
          'If you pay a WSSC (or other public-system) bill, start here: this snapshot plus WSSC’s current Water Quality Report. Test your own tap when the home is pre-1986, you are pregnant or have young children, pipe material is unknown, or you want lead or PFAS at the kitchen faucet — a CCR cannot see what your plumbing adds. Well water testing in Gaithersburg, MD applies only if the home is on a private well. Montgomery County Department of Permitting Services (DPS), acting for the Maryland Department of the Environment, permits wells; it does not replace annual homeowner testing. Homeowners are responsible for well maintenance and drinking-water safety.',
        sources: [S.wsscCcr, S.montgomeryDps, S.montgomeryDpsGuide, S.epaPrivateWells],
      },
      {
        heading: 'City water testing in Gaithersburg, MD (municipal / WSSC)',
        body:
          'Municipal water testing in Gaithersburg means WSSC Water, which treats Potomac and Patuxent River water for most of Montgomery and Prince George’s counties. “City water testing Gaithersburg MD” should start with WSSC’s CCR, then this page’s EPA/UCMR5 snapshot. WSSC monitoring does not see lead, copper, or other metals your building plumbing can add after water leaves the plant. Some Montgomery County cities (including Rockville) operate their own systems — confirm the supplier with a ZIP report rather than assuming one county-wide grade.',
        sources: [S.wsscCcr, S.wsscWqr, S.readCcr, S.ccrFinder],
      },
      {
        heading: 'Gaithersburg well water testing',
        body:
          'Private wells are not covered by EPA municipal monitoring or by WSSC’s CCR. Montgomery County DPS tells well owners to test annually with a certified lab for bacteria and nitrates, and whenever color, odor, or taste changes or the well system is serviced or repaired. New or replacement potable wells need Certificate of Potability sampling before occupancy; that is a construction/permit step, not a substitute for yearly tests on an existing well. DPS well-and-septic questions: 240-777-0311 (or 311 in-county). WaterCheckup does not collect samples.',
        sources: [S.montgomeryDpsGuide, S.montgomeryDps, S.umdTesting, S.epaPrivateWells],
      },
      {
        heading: 'What to test for (city vs well)',
        body:
          'On WSSC city water: lead and copper (first-draw after water sits overnight, especially in pre-1986 plumbing), PFAS if you want address-level confirmation beyond UCMR5, and disinfection byproducts if taste/odor or pregnancy is a concern. Hardness is a comfort/scale issue, not a toxicity test. On a private well, University of Maryland Extension recommends total coliform, E. coli, and nitrate at least yearly; a broader panel (chloride, copper, hardness, lead, manganese, pH, sulfate, TDS, and local-concern contaminants such as arsenic or radon) initially or every three years, and after flooding, a new well, or a change in taste or color.',
        sources: [S.umdTesting, S.tapTest],
      },
      {
        heading: 'How to get a test: MDE certified labs and the Maryland Department of the Environment',
        body:
          'For results you can use in real-estate, medical, or treatment decisions, use a laboratory certified by the Maryland Department of the Environment Laboratory Certification Program — not a brand from a search ad. Certification is test-specific: a lab approved for bacteria is not automatically approved for PFAS. Confirm the lab accepts private samples and is certified for the analytes you need. Maryland Department of Health publishes state-lab well-water fees as a public lower bound (bacteria $41, nitrate $18, lead $20, hardness $23); commercial labs on the MDE list set their own prices. Home kits are screening tools only.',
        sources: [S.mdeLabs, S.mdeLabsPdf, S.mdhFees, S.tapTest],
      },
      {
        heading: 'Rough cost ranges',
        body: MD_TESTING_COST_BODY,
        sources: [S.mdhFees],
      },
      {
        heading: 'If you choose a filter after you test',
        body:
          'WaterCheckup is not a treatment company. Match any filter to a documented result: NSF 53 carbon for lead at the tap; NSF 58 reverse osmosis or a PFAS-certified pitcher for PFAS and disinfection byproducts; a softener only for hardness. Whole-house gear is for wells with iron, sulfur, or bacteria — not a substitute for kitchen treatment on WSSC water.',
      },
    ],
    links: [
      zipLink(MD_TESTING_ZIP_REPORTS.gaithersburg, 'Gaithersburg ZIP report (20877)'),
      { href: S.wsscCcr.href, label: 'WSSC water quality report' },
      { href: S.mdeLabs.href, label: 'Maryland certified lab list (MDE)' },
      { href: S.montgomeryDps.href, label: 'Montgomery County well & septic (DPS)' },
      { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'Mail-in tap test guide' },
      { href: '/well', label: 'Private well testing guide' },
      { href: '/lead', label: 'Lead in tap water' },
      { href: '/pfas', label: 'PFAS in tap water' },
      { href: '/blog/best-water-filter-gaithersburg-md', label: 'Best filters for Gaithersburg' },
      { href: '/water/rockville', label: 'Rockville water report' },
      { href: '/water/silver-spring', label: 'Silver Spring (WSSC) water report' },
      { href: '/water/bethesda', label: 'Bethesda (WSSC) water report' },
      { href: '/water/state/maryland', label: 'Maryland tap water hub' },
      { href: '/quiz', label: 'Find a certified filter' },
    ],
    faqs: [],
  },
  annapolis: {
    eyebrow: 'HOW TO TEST YOUR WATER IN ANNAPOLIS, MD',
    title: 'How to test your water in Annapolis, MD',
    intro:
      'Annapolis well water testing usually means one of two supplies: the City of Annapolis public system, which the 2025 Water Quality Report says is drawn from eight wells in confined aquifers, or a private household well that the city does not monitor. A CCR is not a test of your kitchen faucet. Use the free ZIP report first, then a Maryland-certified laboratory for address-level results.',
    sections: [
      {
        heading: 'Annapolis well water testing: city wells vs a private well',
        body:
          'If you pay a city water bill, you are on the municipal supply — treated groundwater from city wells, not a backyard well. The City of Annapolis 2025 report is the system-wide CCR. If you own a private well (common in parts of Anne Arundel County outside city service), EPA municipal monitoring does not apply. Test bacteria and nitrate at least yearly, and use a Maryland-certified lab rather than a search-ad “testing company.” WaterCheckup is not a laboratory.',
        sources: [S.annapolisCcr, S.umdTesting],
      },
      {
        heading: 'What the City of Annapolis publishes — and what it does not',
        body:
          'The 2025 Annual Water Quality Report summarizes treated water and lead-and-copper tap sampling. It is not a sample from your faucet. If you have concerns about lead or other water quality issues, the report directs residents to the City of Annapolis Water Plant Superintendent at 410-260-3433. That is a contact for questions — this site does not claim the city offers a free household kit unless DPW confirms it when you call.',
        sources: [S.annapolisCcr, S.readCcr],
      },
      {
        heading: 'Maryland certified drinking-water labs',
        body: MD_CERTIFIED_LAB_BODY,
        sources: [S.mdeLabs, S.mdeLabsPdf],
      },
      {
        heading: 'What to test for in Annapolis',
        body: MD_WHAT_TO_TEST_BODY,
        sources: [S.tapTest, S.umdTesting],
      },
      {
        heading: 'Rough cost ranges',
        body: MD_TESTING_COST_BODY,
        sources: [S.mdhFees],
      },
    ],
    links: [
      zipLink(MD_TESTING_ZIP_REPORTS.annapolis, 'Annapolis ZIP report (21401)'),
      { href: S.annapolisCcr.href, label: 'Annapolis 2025 water quality report' },
      { href: S.mdeLabs.href, label: 'Maryland certified lab list' },
      { href: '/utilities/md/maryland-city-anne-arundel-co', label: 'Anne Arundel County (Maryland City) report' },
      { href: '/well', label: 'Private well testing guide' },
      { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'Mail-in tap test guide' },
    ],
    faqs: [
      {
        question: 'Where can I get Annapolis well water testing?',
        answer:
          'If you are on city water, start with the free ZIP report and the City of Annapolis CCR. For a private well, use a laboratory on the Maryland Department of the Environment certified list. The city’s 2025 report points lead questions to the Water Plant Superintendent at 410-260-3433. WaterCheckup is not a testing company and does not sell tests.',
      },
      {
        question: 'Is Annapolis city water from wells?',
        answer:
          'Yes. The City of Annapolis 2025 Water Quality Report says the public supply is drawn from eight wells drilled into confined aquifers. That is still municipal water: the city treats and monitors it. A private household well is a different supply and needs its own certified-lab tests.',
      },
      {
        question: 'Do I need well water testing if I have city water in Annapolis?',
        answer:
          'Not for the city’s wells — those are covered by the CCR. You may still want a first-draw lead sample from your own plumbing. Private-well testing (bacteria and nitrate yearly) applies only if your home is not on the municipal system.',
      },
    ],
  },
  'maryland-city-anne-arundel-co': {
    eyebrow: 'HOW TO TEST YOUR WATER IN ANNE ARUNDEL COUNTY, MD',
    title: 'How to test your water in Anne Arundel County, MD',
    intro:
      'City water testing in Anne Arundel County depends on which public water system serves the address. This page is the EPA snapshot for Maryland City–Anne Arundel Co. Other neighborhoods are on different county or city systems (including Annapolis). A county CCR is not a test of your kitchen faucet. Use the free ZIP report to confirm the supplier, then a Maryland-certified lab for address-level results.',
    sections: [
      {
        heading: 'City water testing in Anne Arundel County',
        body:
          'Anne Arundel County Department of Public Works publishes an annual Consumer Confidence Report for county-served customers and can mail a copy via DPW Customer Relations at (410) 222-7582. Maryland City is a named community system in the federal inventory — confirm your PWSID on the ZIP report rather than assuming one county-wide grade. Building plumbing can add lead after water leaves the plant.',
        sources: [S.aaCcr, S.readCcr, S.ccrFinder],
      },
      {
        heading: 'County city water vs a private well',
        body:
          'If you receive a county or community water bill, you are on a public system. Private wells are common in parts of Anne Arundel County. The county Health Department handles well permits and Certificates of Potability for new wells; routine homeowner testing goes through Maryland-certified laboratories. This site does not claim the county offers a free household kit for existing taps unless the Health Department confirms it when you call (410) 222-7193.',
        sources: [S.aaWells, S.umdTesting],
      },
      {
        heading: 'Maryland certified drinking-water labs',
        body: MD_CERTIFIED_LAB_BODY,
        sources: [S.mdeLabs, S.mdeLabsPdf],
      },
      {
        heading: 'What to test for in Maryland City and Anne Arundel County',
        body: MD_WHAT_TO_TEST_BODY,
        sources: [S.tapTest],
      },
      {
        heading: 'Rough cost ranges',
        body: MD_TESTING_COST_BODY,
        sources: [S.mdhFees],
      },
    ],
    links: [
      zipLink(MD_TESTING_ZIP_REPORTS.marylandCity, 'Maryland City ZIP report (20724)'),
      { href: S.aaCcr.href, label: 'Anne Arundel County water quality reports' },
      { href: S.mdeLabs.href, label: 'Maryland certified lab list' },
      { href: '/utilities/md/annapolis', label: 'Annapolis water testing' },
      { href: '/well', label: 'Private well testing guide' },
      { href: '/', label: 'Check another ZIP' },
    ],
    faqs: [
      {
        question: 'Where can I get city water testing in Anne Arundel County?',
        answer:
          'Confirm your supplier with the free ZIP report. Read the matching CCR (Anne Arundel County DPW publishes county reports; Maryland City is a specific community system). For a household tap sample, use a laboratory on the Maryland Department of the Environment certified list. WaterCheckup is not a testing company.',
      },
      {
        question: 'Is Maryland City on Anne Arundel County water?',
        answer:
          'Maryland City–Anne Arundel Co. is a named public water system in EPA records. Other Anne Arundel addresses may be on the county system, the City of Annapolis, or a private well. Search by ZIP rather than assuming one county-wide supply.',
      },
      {
        question: 'Do Anne Arundel County wells need different tests than city water?',
        answer:
          'Yes. Public systems publish a CCR; private wells do not. University of Maryland Extension recommends bacteria and nitrate at least yearly on wells, plus a broader panel every few years. New wells need a Certificate of Potability through the county Health Department.',
      },
    ],
  },
  'town-of-chestertown': {
    eyebrow: 'HOW TO TEST YOUR WATER IN CHESTERTOWN, MD',
    title: 'How to test your water in Chestertown, MD',
    intro:
      'Searches for a Chestertown MD water testing company usually want a certified laboratory — not a filter retailer. WaterCheckup is not a testing company and does not sell tests. The Town of Chestertown 2025 Consumer Confidence Report is the system-wide summary. For a kitchen-tap result, use a Maryland-certified drinking-water lab. The town’s CCR says residents concerned about lead can contact Chestertown at 410-778-0500.',
    sections: [
      {
        heading: 'Chestertown MD water testing company — start with certified labs',
        body:
          'Maryland does not publish a single “best” household tester. Use the Maryland Department of the Environment certified drinking-water lab list and confirm the lab is certified for the tests you need (metals, microbiology, PFAS). Home kits are screening tools. WaterCheckup publishes public-supplier reports; it does not collect samples or operate a lab.',
        sources: [S.mdeLabs, S.mdeLabsPdf],
      },
      {
        heading: 'What the Town of Chestertown offers',
        body:
          'The 2025 CCR states that if you are concerned about lead in your water and wish to have it tested, contact Chestertown at 410-778-0500. Ask the town whether a household sample is available and what it costs — this site does not quote a municipal fee. The same report says a service-line inventory was submitted to MDE and is available upon request at that number.',
        sources: [S.chestertownCcr, S.readCcr],
      },
      {
        heading: 'Town water vs a private well',
        body:
          'Addresses on Town of Chestertown water are a public groundwater system. Private wells outside town service are not in the CCR. Test wells for bacteria and nitrate yearly and use a Maryland-certified lab for metals or PFAS.',
        sources: [S.umdTesting, S.tapTest],
      },
      {
        heading: 'What to test for in Chestertown',
        body: MD_WHAT_TO_TEST_BODY,
      },
      {
        heading: 'Rough cost ranges',
        body: MD_TESTING_COST_BODY,
        sources: [S.mdhFees],
      },
    ],
    links: [
      zipLink(MD_TESTING_ZIP_REPORTS.chestertown, 'Chestertown ZIP report (21620)'),
      { href: S.chestertownCcr.href, label: 'Chestertown 2025 CCR' },
      { href: S.mdeLabs.href, label: 'Maryland certified lab list' },
      { href: '/well', label: 'Private well testing guide' },
      { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'Mail-in tap test guide' },
      { href: '/', label: 'Check another ZIP' },
    ],
    faqs: [
      {
        question: 'What Chestertown MD water testing company should I use?',
        answer:
          'WaterCheckup is not a testing company. Use a laboratory on the Maryland Department of the Environment certified drinking-water lab list, and confirm it is certified for the analytes you need. The Town of Chestertown 2025 CCR also says to call 410-778-0500 if you want the town’s help with lead testing.',
      },
      {
        question: 'Does Chestertown test my tap water for lead?',
        answer:
          'The town’s CCR describes system monitoring and lead-and-copper rule sampling. It is not a test of every kitchen. The report says residents who want their water tested should contact Chestertown at 410-778-0500. A Maryland-certified lab can run a first-draw sample from your faucet.',
      },
      {
        question: 'Is Chestertown water from a well?',
        answer:
          'The Town of Chestertown public system is listed as groundwater in federal records. That is still municipal water. A private household well outside town service needs its own certified-lab tests and is not covered by the town CCR.',
      },
    ],
  },
};

export function getPlaceTestingGuide(key: string): PlaceTestingGuide | undefined {
  return PLACE_TESTING_GUIDES[key];
}

/** Gaithersburg / Montgomery County treatment copy — not a vendor directory. */
export const GAITHERSBURG_TREATMENT_SECTIONS: { heading: string; body: string }[] = [
  {
    heading: 'Gaithersburg water quality (WSSC Water)',
    body:
      'Gaithersburg water quality is the WSSC Water story: Potomac and Patuxent River source water treated for Montgomery and Prince George’s counties. WSSC publishes the Consumer Confidence Report; this page adds the EPA/UCMR5 snapshot (disinfection byproducts, PFAS monitoring, and lead risk from older home plumbing). A CCR average is not your faucet. WaterCheckup is not a water treatment company.',
  },
  {
    heading: 'Water treatment in Gaithersburg and Montgomery County, MD',
    body:
      'Home water treatment in Gaithersburg, MD depends on a documented result, not a neighbor’s system. Whole-house carbon can reduce chlorine/chloramine taste at every tap; it is not a substitute for certified lead or PFAS reduction at the drinking tap. Reverse osmosis (NSF/ANSI 58) is the residential option with the broadest published claims for PFAS, lead, and disinfection byproducts at one faucet. A softener exchanges hardness minerals (calcium and magnesium); it does not remove lead, PFAS, or bacteria. Match the equipment to a written lab or CCR finding.',
  },
  {
    heading: 'Gaithersburg reverse osmosis and water filtration',
    body:
      'Gaithersburg reverse osmosis usually means a point-of-use NSF/ANSI 58 system under the kitchen sink (this site’s catalog pick is the Waterdrop G3P600 when PFAS or lead is the concern). Pitchers and under-sink carbon can help chlorine taste and, when the exact cartridge is NSF/ANSI 53 listed, lead at that faucet. Fridge filters rarely cover PFAS. Confirm the model’s current NSF, IAPMO, or WQA listing before buying.',
  },
  {
    heading: 'How to choose a water treatment company in Gaithersburg, MD',
    body:
      'WaterCheckup does not name or recommend a local installer. If you hire a water treatment company in Gaithersburg or Montgomery County, ask for a written water test from a Maryland-certified laboratory before a sales quote; WQA professional credentials (such as Certified Water Specialist) for the person on site; NSF/ANSI model numbers in writing for every unit; a schematic of what each stage does (softener vs RO vs carbon); and a service contract that lists filter or media replacement. Do not buy whole-house equipment from a door-to-door test that only measures hardness or TDS. This site is not a treatment company and does not sell installation.',
  },
  {
    heading: 'Water treatment services vs a DIY filter',
    body:
      'Water treatment services in Gaithersburg, MD typically mean a dealer who sizes, installs, and services equipment. A pitcher or under-sink cartridge is a different job: you replace filters on a schedule. Neither replaces a boil-water advisory. Start with the free ZIP/WSSC snapshot and a certified tap test, then decide whether you need a service company at all.',
  },
];
