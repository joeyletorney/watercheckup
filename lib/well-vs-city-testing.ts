/**
 * Generic “well vs city water testing” copy for city report pages that do not
 * have a place-specific testing guide. Facts are EPA / CDC private-well
 * guidance — no invented local numbers or county contacts.
 */
export const EPA_PRIVATE_WELLS_HREF = 'https://www.epa.gov/privatewells';
export const EPA_LAB_CERT_HREF = 'https://www.epa.gov/dwlabcert';

export type WellVsCityLink = { href: string; label: string; external?: boolean };

export type WellVsCityGuide = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  links: WellVsCityLink[];
};

export function buildWellVsCityTestingGuide(cityName: string, stateAbbr: string): WellVsCityGuide {
  return {
    eyebrow: `WELL WATER VS CITY WATER TESTING IN ${cityName.toUpperCase()}`,
    title: `Well water vs city water testing in ${cityName}`,
    intro: `City water testing in ${cityName} and well water testing answer different questions. Public water systems publish a Consumer Confidence Report (CCR) and appear in EPA monitoring. Private wells are not regulated under the Safe Drinking Water Act — the well owner is responsible for testing. This page is a free public-supplier snapshot, not a lab result from your kitchen tap. WaterCheckup does not sell tests.`,
    sections: [
      {
        heading: `Who needs to test in ${cityName}`,
        body: `If you pay a municipal or community water bill, start with this ${cityName} report and the utility’s current CCR. Test your own tap when the home is older (especially pre-1986 plumbing), you are pregnant or have young children, pipe material is unknown, or you want metals or PFAS at the address — a CCR cannot see what your service line adds. If you use a private well, skip the city snapshot as your only answer: EPA does not monitor household wells.`,
      },
      {
        heading: 'What to test for',
        body: `On city water: a first-draw lead and copper sample after water sits overnight is the usual address-level test; add PFAS if you want confirmation beyond utility UCMR monitoring. Hardness is a scale and comfort issue, not a toxicity test. On a private well, EPA and state extension programs typically recommend total coliform bacteria and nitrate at least yearly, plus a broader panel (metals, pH, hardness, and local-concern contaminants such as arsenic or radon) every few years or after flooding, a new well, or a change in taste, odor, or color.`,
      },
      {
        heading: `How to get a test near ${cityName}, ${stateAbbr}`,
        body: `Use a laboratory certified by your state for drinking-water analysis — certification is test-specific (a bacteria lab is not automatically certified for PFAS). EPA publishes laboratory-certification contacts for each state. Home kits can screen hardness or chlorine; they are not a substitute for a certified-lab chain of custody when you need lead, bacteria, or PFAS results. Call the lab for bottles and first-draw instructions before you sample.`,
      },
    ],
    links: [
      { href: '/well', label: 'Private well testing guide' },
      { href: '/blog/how-to-test-your-tap-water-mail-in-labs-explained', label: 'Mail-in tap test guide' },
      { href: '/lead', label: 'Lead in tap water' },
      { href: '/pfas', label: 'PFAS in tap water' },
      { href: '/epa/ccr-finder', label: 'Find your CCR' },
      { href: EPA_PRIVATE_WELLS_HREF, label: 'EPA private wells', external: true },
      { href: EPA_LAB_CERT_HREF, label: 'Find a state-certified lab', external: true },
    ],
  };
}
