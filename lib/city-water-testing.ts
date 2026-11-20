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
} as const;
