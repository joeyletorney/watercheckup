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
  const primary = renter ? (answers.concern === 'taste' ? pitcher : countertop) : undersink;
  const alternative = renter ? (primary === pitcher ? countertop : pitcher) : countertop;
  const concern = answers.concern === 'lead' ? 'lead reduction' : answers.concern === 'pfas' ? 'PFAS reduction' : answers.concern === 'taste' ? 'taste and odor' : 'your specific concern';
  return {
    title: primary.product, badge: renter ? 'NO PLUMBING' : 'KITCHEN OPTION', badgeColor: '#0891b2',
    tagline: renter ? 'One primary option and one alternative that need no plumbing changes.' : 'A kitchen option, with a no-plumbing alternative.',
    why: `For ${concern}, verify the exact model and replacement cartridge’s listed claim; a standard number alone does not establish every contaminant reduction. ${wholeHome ? 'A kitchen unit treats drinking and cooking water only. Whole-home treatment is a separate decision: confirm hardness, flow and the issue at entry before buying. Entry carbon will not fix lead introduced by downstream plumbing or soften hard water.' : 'This is a fit comparison based on your answers, not evidence that your tap is contaminated.'}`,
    alts: [primary, alternative],
  };
}
