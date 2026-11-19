import { PRODUCTS } from './home-products-catalog';
import { amazonDpUrl, extractAmazonAsin, normalizeAmazonUrl } from './amazon-affiliate';

/** Exact product destinations checked in the November 18 product-link audit.
 * Missing, search-only and known mismatched listings must not become primary Amazon buttons.
 */
const VERIFIED_ASINS = new Set(['B08NDYVZV5', 'B076S1W5QY', 'B0DFC22BHT', 'B0DWTTYTQN', 'B09LKTLVNR', 'B0CQS3HQ8F', 'B07P1XFYJP', 'B008GNRMYK', 'B00XAJJVHQ', 'B01LFMTYBM', 'B0BK8ZRY2K']);
export function preferredAmazonPurchaseUrl(href?: string): string | undefined {
  if (!href) return undefined;
  let url: URL;
  try { url = new URL(href); } catch { return undefined; }
  if (!['amazon.com', 'www.amazon.com'].includes(url.hostname)) return undefined;
  const normalized = normalizeAmazonUrl(href);
  const asin = normalized ? extractAmazonAsin(normalized) : null;
  if (!asin || !VERIFIED_ASINS.has(asin)) return undefined;
  return amazonDpUrl(asin);
}
export const HOME_SHOPPING_CATEGORIES = [
  { id: 'no-install', label: 'No-install filters', description: 'Pitchers and countertop options. No drilling or plumbing changes.', guide: '/blog/best-countertop-water-filter', picks: [
    { id: 10, guide: '/blog/best-water-filter-pitcher-2025', fit: "Small kitchens without plumbing changes", advantage: "Gravity-fed pitcher with an included meter for tracking dissolved solids.", tradeoff: "Manual refills; high dissolved-solids levels can shorten cartridge life.", evidenceUrl: "https://shop.culligan.com/products/10-cup-zerowater-pitcher", limits: 'Manual refills. Cartridge life varies with incoming dissolved solids.', upkeep: 'Check replacement cartridge cost and capacity; a TDS reading does not identify individual contaminants.' },
    { id: 31, fit: "Renters who want countertop reverse osmosis", advantage: "Reverse osmosis without a permanent plumbing connection.", tradeoff: "Needs an outlet, counter space, tank refills and water to discard.", evidenceUrl: "https://aquatru.com/products/countertop-reverse-osmosis-water-purifier", limits: 'Needs an outlet, tank refills and room on the counter.', upkeep: 'About $129.83/year annualized filter allowance at 1 gallon/day; unit, power and water extra.' },
    { id: 11, guide: '/blog/best-water-filter-pitcher-2025', fit: "Pitcher users who want a filter-change reminder", advantage: "11-cup capacity and a light that reminds you to change the filter.", tradeoff: "The PLUS cartridge is rated for 40 gallons; heavier use means earlier changes.", evidenceUrl: "https://www.pur.com/shop/pitchers/11-cup-pitcher-ppt111/", limits: 'Cold water and manual refilling. Match the exact PLUS cartridge to your concern.', upkeep: 'Compare replacement-filter prices and the rated replacement interval.' },
  ] },
  { id: 'under-sink', label: 'Under-sink filters', description: 'Dedicated drinking-water systems for a kitchen where plumbing changes are allowed.', guide: '/blog/best-under-sink-water-filter', picks: [
    { id: 23, fit: "Municipal-water kitchens using the existing faucet", advantage: "Direct-connect carbon filtration without a separate faucet or RO drain.", tradeoff: "Not reverse osmosis: it does not reduce dissolved salts or soften water.", evidenceUrl: "https://www.frizzlife.com/products/sk99-new", limits: 'Cold municipal water only. Check supply fittings, cartridge claims and the exact SK99-NEW connection kit.', upkeep: 'Compare SK99-NEW replacement cartridge costs and follow the model’s replacement schedule.' },
    { id: 47, fit: "Kitchens where storage-tank space is limited", advantage: "Tankless design avoids a separate water-storage tank.", tradeoff: "Still needs an outlet, drain connection and dedicated faucet.", evidenceUrl: "https://www.waterdropfilter.com/products/waterdrop-reverse-osmosis-water-filtration-system", limits: 'Needs an outlet, drain connection and dedicated faucet; check cabinet clearance.', upkeep: 'Compare CF, CB and RO replacement costs and their separate schedules.' },
    { id: 25, fit: "Kitchens where drilling a separate faucet is impractical", advantage: "Carbon-block filtration through your existing cold-water faucet.", tradeoff: "Not reverse osmosis or a softener; verify the exact reduction claims you need.", evidenceUrl: "https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system", limits: 'Confirm cold-water line fittings, installation clearance and the Smart Shield performance data.', upkeep: 'Compare Smart Shield replacement-filter cost and rated capacity at your household’s use.' },
  ] },
  { id: 'whole-home', label: 'Whole-home treatment', description: 'Compare carbon and sediment systems for incoming water. These are not hardness-removing softeners.', guide: '/blog/best-water-filter-hard-water', picks: [
    { id: 19, fit: "Homeowners comparing standard-size cartridge systems", advantage: "Uses 20-inch sediment and carbon cartridges in separate housings.", tradeoff: "Needs main-line plumbing and cartridge-changing clearance; it is not a softener.", evidenceUrl: "https://www.ispringfilter.com/ispring-whole-house-water-filtration-system-sediment-carbon-big-blue", limits: 'Main-line installation and service clearance. Does not soften hard water or disinfect an unsafe well.', upkeep: 'Replace sediment/carbon cartridges on the model’s schedule; water quality and flow affect life.' },
    { id: 32, fit: "Homeowners who prefer a main media-tank system", advantage: "A replaceable main tank treats incoming water before it reaches the taps.", tradeoff: "A larger installation footprint; pre/post filters still need scheduled changes.", evidenceUrl: "https://www.aquasana.com/on/demandware.static/-/Sites-aquasana-Library/default/dw9cec6f2e/PDF/WH-1000_Install.pdf", limits: 'Check the exact bundle, flow rating and fittings. Do not assume a softener or UV system is included.', upkeep: 'Include pre/post-filter changes, eventual media replacement and installation in the budget.' },
    { id: 33, fit: "Homeowners who want pressure gauges", advantage: "Three pressure gauges help you compare pressure across the filter stages.", tradeoff: "Needs main-line installation and replacement sets; this model does not soften water.", evidenceUrl: "https://www.expresswater.com/products/heavy-metal-whole-house", limits: 'Requires main-line plumbing and room to change housings. Not a substitute for a softener.', upkeep: 'Compare replacement sets and service costs at your household’s actual usage.' },
  ] },
] as const;
export function homeShoppingProduct(id: number) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p || p.outOfStock || !preferredAmazonPurchaseUrl(p.amazon)) return undefined;
  return { id: p.id as number, name: p.name as string, brand: p.brand as string, img: p.img as string, amazon: preferredAmazonPurchaseUrl(p.amazon)! };
}


export type HomeShoppingProduct = NonNullable<ReturnType<typeof homeShoppingProduct>>;
export type HomeShoppingCategory = {
  id: string; label: string; description: string; guide: string;
  picks: Array<{ guide?: string; id: number; fit: string; advantage: string; tradeoff: string; evidenceUrl: string; limits: string; upkeep: string; product: HomeShoppingProduct }>;
};
export function buildHomeShoppingCategories(): HomeShoppingCategory[] {
  return HOME_SHOPPING_CATEGORIES.map(category => ({
    ...category,
    picks: category.picks.flatMap(pick => {
      const product = homeShoppingProduct(pick.id);
      return product ? [{ ...pick, product }] : [];
    }),
  }));
}
