/** Visible homepage answers and structured data share one source. */
export const HOME_FAQS = [
  {
    question: 'Is my tap water safe?',
    answer: 'Most U.S. public systems meet EPA legal limits, but legal compliance is not the same as a test of your kitchen faucet. Enter your ZIP code for a free supplier snapshot (PFAS monitoring, lead-pipe context, and available EPA records). Building plumbing can add lead after water leaves the plant. The report is not a household tap test.',
  },
  {
    question: 'How do I check water quality by ZIP code?',
    answer: 'Enter your ZIP on the homepage search. WaterCheckup matches that ZIP to a public water supplier and shows available EPA records, including historical PFAS monitoring when coverage exists. That is a water quality report by ZIP code for the listed supplier — not a lab result from your own tap. Check the source notes and your utility’s current Consumer Confidence Report.',
  },
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
