/** Site-wide FAQ entities — use on homepage only (not in root layout @graph). */
export const SITE_FAQ_MAIN_ENTITY = [
    {
      '@type': 'Question',
      name: 'How is WaterCheckup different from other water quality checkers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most water quality checkers tap one EPA database. WaterCheckup combines five federal datasets plus EWG health guidelines: SDWIS violations, UCMR5 PFAS monitoring (2023–2025), enforcement history, lead tap sampling, lead service line inventory, and EWG benchmarks — merged into one free ZIP report with an A–F Water Safety Grade and expert filter guidance.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the WaterCheckup Water Safety Grade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each city and ZIP report includes a Water Safety Score (0–100) and letter grade (A– through F) based on EPA violation history, PFAS UCMR5 detections, contaminant severity, and how levels compare to health guidelines — not just whether your public water system meets legal limits. Grades are explained in plain language with filter recommendations from a 30-year water treatment expert.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my tap water safe to drink?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your water system, home plumbing, and which contaminants matter for your household. Enter your ZIP at watercheckup.com for a free report that merges EPA SDWIS, PFAS testing, lead data, and EWG health guidelines — then see certified filter options if PFAS, lead, or other issues are flagged.',
      },
    },
    {
      '@type': 'Question',
      name: 'What water filter removes PFAS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only reverse osmosis (NSF/ANSI 58) and select carbon systems (NSF 401 or P473) are certified to remove PFAS forever chemicals. Standard Brita pitchers improve taste but are not certified for PFAS. WaterCheckup shows PFAS levels for your public water system and recommends NSF-certified systems matched to your water profile.',
      },
    },
] as const;

/** Full FAQPage JSON-LD for the homepage */
export const SITE_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://watercheckup.com/#faq',
  mainEntity: SITE_FAQ_MAIN_ENTITY,
} as const;
