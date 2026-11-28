/**
 * Official “how to test your water” sources for city pages.
 * City-specific copy stays in LOCAL_SEARCH_INTENT; these URLs are the shared pattern.
 */

export const WSSC_WATER_QUALITY_REPORT_URL = 'https://www.wsscwater.com/waterquality';
export const WSSC_WQR_DOWNLOAD_URL = 'https://www.wsscwater.com/wqr';

/** MDE Laboratory Certification Program landing page (HTML list + PDFs). */
export const MDE_CERTIFIED_LABS_PAGE_URL =
  'https://mde.maryland.gov/programs/Water/water_supply/Pages/wsp-labcert.aspx';

/** Current comprehensive PDF linked from the MDE lab-cert page. */
export const MDE_CERTIFIED_LABS_PDF_URL =
  'https://mde.maryland.gov/programs/water/water_supply/Documents/Maryland-Certified-DW-Labs.pdf';

/** Maryland Department of Health published well-water lab fees. */
export const MDH_WELL_WATER_FEES_URL =
  'https://health.maryland.gov/laboratories/Pages/Wellwater.aspx';

export const BALTIMORE_DPW_WATER_REPORT_URL = 'https://publicworks.baltimorecity.gov/waterreport';
export const BALTIMORE_SERVICE_LINE_URL = 'https://servicelinepartnership.baltimorecity.gov';
export const ANNAPOLIS_CCR_URL = 'https://www.annapolis.gov/2525/2025-Annual-Water-Quality-Report';
export const ANNE_ARUNDEL_CCR_URL =
  'https://www.aacounty.org/public-works/utilities/water-distribution-system/drinking-water-quality-reports';
export const ANNE_ARUNDEL_WELLS_URL =
  'https://www.aahealth.org/environmental-health/wells-and-septic-systems/wells-and-well-water';
export const UMD_EXTENSION_WATER_TESTING_URL = 'https://extension.umd.edu/resource/water-testing';
export const CHESTERTOWN_CCR_URL =
  'https://mde.maryland.gov/programs/water/water_supply/ConsumerConfidenceReports/Documents/CCR/Kent/0140002-Chestertown.pdf';

/** Montgomery County DPS (acting for MDE) well permitting and homeowner guidance. */
export const MONTGOMERY_DPS_WELL_SEPTIC_URL =
  'https://www.montgomerycountymd.gov/department-environmental-protection/water/water-supply-wastewater/private-well-septic-service/onsite-well-septic-system-testing-permitting';
export const MONTGOMERY_DPS_WELL_GUIDE_PDF_URL =
  'https://www.montgomerycountymd.gov/DPS/Resources/Files/Land_Development/DPS_Guide_Well_Water1.pdf';
export const EPA_PRIVATE_WELLS_URL = 'https://www.epa.gov/privatewells';
export const EPA_DW_LAB_CERT_URL = 'https://www.epa.gov/dwlabcert';

/** Utility detail pages that earn Search Console impressions and should stay indexable. */
export const SEO_INDEX_UTILITY_SLUGS = [
  'annapolis',
  'maryland-city-anne-arundel-co',
  'town-of-chestertown',
] as const;

export const SEO_INDEX_UTILITY_PATHS = SEO_INDEX_UTILITY_SLUGS.map(
  (slug) => `/utilities/md/${slug}` as const,
);

/** Representative ZIP reports for Maryland testing pages (ZIP routes stay noindex). */
export const MD_TESTING_ZIP_REPORTS = {
  baltimore: '/results/21201',
  gaithersburg: '/results/20877',
  annapolis: '/results/21401',
  marylandCity: '/results/20724',
  chestertown: '/results/21620',
} as const;

export type CityTestingSource = { href: string; label: string; external?: boolean };

export type CityTestingSection = {
  heading: string;
  body: string;
  sources?: CityTestingSource[];
};

export type CityLocalSearchIntent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: CityTestingSection[];
  links: { href: string; label: string }[];
};

export const GAITHERSBURG_TESTING_SOURCES = {
  wsscCcr: { href: WSSC_WATER_QUALITY_REPORT_URL, label: 'WSSC Water quality report (CCR)', external: true },
  wsscWqr: { href: WSSC_WQR_DOWNLOAD_URL, label: 'Download WSSC’s current Water Quality Report', external: true },
  mdeLabs: { href: MDE_CERTIFIED_LABS_PAGE_URL, label: 'Maryland certified drinking-water lab list (MDE)', external: true },
  mdeLabsPdf: { href: MDE_CERTIFIED_LABS_PDF_URL, label: 'MDE certified lab PDF', external: true },
  readCcr: { href: '/blog/how-to-read-your-consumer-confidence-report', label: 'How to read a Consumer Confidence Report' },
  tapTest: { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'How to test tap water (mail-in labs)' },
  ccrFinder: { href: '/epa/ccr-finder', label: 'EPA CCR finder' },
  mdhFees: { href: MDH_WELL_WATER_FEES_URL, label: 'Maryland Department of Health well-water lab fees', external: true },
  umdTesting: { href: UMD_EXTENSION_WATER_TESTING_URL, label: 'University of Maryland Extension: water testing', external: true },
  baltimoreCcr: { href: BALTIMORE_DPW_WATER_REPORT_URL, label: 'Baltimore DPW Water Quality Report', external: true },
  baltimoreLines: { href: BALTIMORE_SERVICE_LINE_URL, label: 'Baltimore Service Line Partnership inventory', external: true },
  annapolisCcr: { href: ANNAPOLIS_CCR_URL, label: 'City of Annapolis 2025 Water Quality Report', external: true },
  aaCcr: { href: ANNE_ARUNDEL_CCR_URL, label: 'Anne Arundel County drinking water quality reports', external: true },
  aaWells: { href: ANNE_ARUNDEL_WELLS_URL, label: 'Anne Arundel County Health Department: wells', external: true },
  chestertownCcr: { href: CHESTERTOWN_CCR_URL, label: 'Town of Chestertown 2025 Consumer Confidence Report', external: true },
  montgomeryDps: {
    href: MONTGOMERY_DPS_WELL_SEPTIC_URL,
    label: 'Montgomery County well & septic permitting (DPS)',
    external: true,
  },
  montgomeryDpsGuide: {
    href: MONTGOMERY_DPS_WELL_GUIDE_PDF_URL,
    label: 'Montgomery County DPS well water guide (PDF)',
    external: true,
  },
  epaPrivateWells: { href: EPA_PRIVATE_WELLS_URL, label: 'EPA private drinking water wells', external: true },
  epaLabCert: { href: EPA_DW_LAB_CERT_URL, label: 'EPA drinking-water lab certification', external: true },
} as const;

export const MD_CERTIFIED_LAB_BODY =
  'For results you can use in real-estate, medical, or treatment decisions, use a laboratory certified by the Maryland Department of the Environment — not a brand name from a search ad. MDE’s Laboratory Certification Program publishes the current list of certified drinking-water labs and which tests each lab is approved for (microbiology, metals, PFAS, and others). Certification is test-specific: a lab approved for bacteria is not automatically approved for PFAS. We do not name a “best” local lab here because that list changes; use MDE’s page and confirm the lab is certified for the analytes you need.';

export const MD_TESTING_COST_BODY =
  'The Maryland Department of Health publishes well-water testing fees for its state laboratory: bacteriology $41, nitrate $18, lead $20, and hardness $23. Those figures are a public lower bound, not a quote from every lab. Commercial laboratories on the MDE certified list set their own prices; bacteria-and-nitrate panels usually cost more, and PFAS is a separate certified-lab panel. Confirm current prices and bottle instructions with the lab before you sample. WaterCheckup does not sell tests.';

export const MD_WHAT_TO_TEST_BODY =
  'On city water: lead and copper (first-draw after water sits overnight, especially in pre-1986 plumbing), PFAS if you want address-level confirmation beyond utility monitoring, and hardness if scale or soap-scum is the complaint. Hardness is a comfort and appliance issue, not a toxicity test. On a private well: bacteria and nitrate at least yearly (University of Maryland Extension), plus a broader panel — lead, copper, pH, hardness, and any local-concern metals — every few years or after flooding, a new well, or a change in taste or color. Match any filter to those documented results.';
