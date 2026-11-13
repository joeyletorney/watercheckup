/** Visible homepage answers and structured data share one source. */
export const HOME_FAQS = [
  {
    question: 'What does my water report show?',
    answer: 'Your ZIP is matched to a public water supplier and available records, including historical measurements and compliance information when available. Source coverage and dates vary. The report describes the listed supplier, not a test of water from your own tap.',
  },
  {
    question: 'Why are some records or grades unavailable?',
    answer: 'Federal sources can be temporarily unavailable, and some suppliers have gaps in the stored datasets. Historical information may still be shown. A missing record is not a zero reading or an all-clear. Check the report’s source notes and your supplier’s current water quality report.',
  },
  {
    question: 'Where should I start if I use a private well?',
    answer: 'The ZIP report is designed for public water suppliers. For a private well, start with the well-water testing guide and identify what needs to be measured before choosing treatment. The filter quiz also provides a testing-first route for well owners.',
  },
] as const;

export const SITE_FAQ_MAIN_ENTITY = HOME_FAQS.map(faq => ({
  '@type': 'Question',
  name: faq.question,
  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
}));

export const SITE_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://watercheckup.com/#faq',
  mainEntity: SITE_FAQ_MAIN_ENTITY,
} as const;
