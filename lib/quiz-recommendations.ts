/** Recommendations describe fit, never diagnose a household's water. */
export type QuizPick = { product: string; brand: string; price: string; reason: string; link: string; amazon: string; badge: string; evidence?: string; certs?: string[]; categoryLabel?: string; outOfStock?: boolean };
export type QuizRecommendation = { title: string; tagline: string; why: string; badge: string; badgeColor: string; alts: QuizPick[]; altsWholeHouse?: QuizPick[] };
const countertop: QuizPick = {
  product: 'AquaTru Classic Countertop RO', brand: 'AquaTru', price: 'Check current price',
  reason: 'No plumbing changes. Needs an outlet, counter space, manual refilling and tank cleaning. Match the exact Classic model and cartridge to its performance data sheet.',
  link: 'https://aquatru.com/products/countertop-reverse-osmosis-water-purifier',
  evidence: 'https://shop.aquatruwater.com/wp-content/uploads/2024/10/Classic-Connect-Updated-PDS.pdf',
  amazon: 'https://www.amazon.com/dp/B0CQS3HQ8F?tag=watercheckup-20', badge: 'NO PLUMBING',
};
const pitcher: QuizPick = {
  product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: 'Check current price',
  reason: 'No outlet or installation. Smaller batches and manual refilling; filter life varies with incoming dissolved solids. Confirm the exact replacement cartridge and its listed reduction claims.',
  link: 'https://shop.culligan.com/products/10-cup-zerowater-pitcher',
  evidence: 'https://shop.culligan.com/pages/culligan-with-zerowater-technology-support',
  amazon: 'https://www.amazon.com/dp/B0DWTTYTQN?tag=watercheckup-20', badge: 'SMALL SPACE',
};
const undersink: QuizPick = {
  product: 'Waterdrop G3P600 RO', brand: 'Waterdrop', price: 'Check current price',
  reason: 'Under-sink drinking-water option. Requires an outlet, drain connection, compatible feed-water conditions and space for a dedicated faucet. Confirm the exact model’s listed contaminant claims before ordering.',
  link: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system?ref=anbyjkqb',
  evidence: 'https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system',
  amazon: 'https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20', badge: 'KITCHEN INSTALL',
};
export function getQuizRecommendation(answers: Record<string, string>): QuizRecommendation {
  const well = answers.source === 'well';
  const renter = answers.situation === 'renter';
  const wholeHome = answers.situation === 'owner_full';
  if (well) return {
    title: 'Test your well before choosing treatment', badge: 'TEST FIRST', badgeColor: '#166534',
    tagline: 'A pitcher or kitchen RO is not a complete well-water treatment plan.',
    why: `Use a certified laboratory to identify the actual issue, including bacteria and nitrate testing. ${renter ? 'Ask the property owner for recent results and keep any eventual equipment free of plumbing changes.' : 'Size any sediment, iron, hardness or disinfection treatment from the results and household flow.'} Do not use these drinking-water devices on microbiologically unsafe or unknown-quality water without appropriate disinfection.`,
    alts: [],
  };
  if (wholeHome) return {
    title: 'Plan treatment where water enters your home', badge: 'WHOLE HOME + KITCHEN', badgeColor: '#166534',
    tagline: 'Choose the whole-home treatment first, then decide whether your kitchen needs its own filter.',
    why: ({
      taste: 'If the taste is noticeable only in a drinking glass, start with a kitchen pitcher. For chlorine odor at several taps, compare entry carbon systems sized for household peak flow.',
      lead: 'Lead can enter water from downstream plumbing. Check your service line and kitchen tap before choosing a filter with a documented lead-reduction claim for drinking and cooking.',
      pfas: 'Identify the compounds reported by your supplier. For whole-home treatment, ask for evidence covering those compounds at your household flow and a replacement schedule.',
      general: 'Identify the issue at several taps before requesting an installation quote. Measure hardness for scale and compare systems at your household peak flow.',
    } as Record<string, string>)[answers.concern] ?? 'Identify your treatment goal and household peak flow before comparing systems.',
    alts: [],
  };
  const primary = answers.concern === 'taste' ? pitcher : renter ? countertop : undersink;
  const alternative = primary === countertop ? pitcher : countertop;
  const concern = answers.concern === 'lead' ? 'lead reduction' : answers.concern === 'pfas' ? 'PFAS reduction' : answers.concern === 'taste' ? 'taste and odor' : 'your specific concern';
  return {
    title: primary.product, badge: renter ? 'NO PLUMBING' : 'KITCHEN OPTION', badgeColor: '#0891b2',
    tagline: primary === pitcher ? 'Start with a pitcher for taste and odor. Compare countertop RO if you also need its documented reduction claims.' : renter ? 'One primary option and one alternative that need no plumbing changes.' : 'A kitchen option, with a no-plumbing alternative.',
    why: `For ${concern}, verify the exact model and replacement cartridge’s listed claim; a standard number alone does not establish every contaminant reduction. Verify your concern before buying.`,
    alts: [primary, alternative],
  };
}
