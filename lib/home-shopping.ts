import { PRODUCTS } from './home-products-catalog';
import { amazonDpUrl, extractAmazonAsin, normalizeAmazonUrl } from './amazon-affiliate';

/** Exact product destinations checked in the November 11 product-link audit.
 * Missing, search-only and known mismatched listings must not become primary Amazon buttons.
 */
const VERIFIED_ASINS = new Set(['B0DWTTYTQN', 'B09LKTLVNR', 'B0CQS3HQ8F', 'B0CHZ8VQBB', 'B07P1XFYJP', 'B0GGTSFZMY', 'B008GNRMYK', 'B00XAJJVHQ', 'B01LFMTYBM', 'B0BK8ZRY2K', 'B08746G2XX']);
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
    { id: 10, fit: 'A simple pitcher for a small kitchen', limits: 'Manual refills. Cartridge life varies with incoming dissolved solids.', upkeep: 'Check replacement cartridge cost and capacity; a TDS reading does not identify individual contaminants.' },
    { id: 31, fit: 'Countertop reverse osmosis (RO)', limits: 'Needs an outlet, tank refills and room on the counter.', upkeep: 'About $129.83/year annualized filter allowance at 1 gallon/day; unit, power and water extra.' },
    { id: 11, fit: 'Another pitcher option for everyday use', limits: 'Cold water and manual refilling. Match the exact PLUS cartridge to your concern.', upkeep: 'Compare replacement-filter prices and the rated replacement interval.' },
  ] },
  { id: 'under-sink', label: 'Under-sink filters', description: 'Dedicated drinking-water systems for a kitchen where plumbing changes are allowed.', guide: '/blog/best-under-sink-water-filter', picks: [
    { id: 5, fit: 'A dedicated kitchen drinking-water tap', limits: 'Check tank and cabinet space, faucet opening, feed-water pressure and drain connection.', upkeep: 'Budget for the exact SmartFlow replacement set and follow its capacity/time limits.' },
    { id: 47, fit: 'Tankless reverse osmosis for a kitchen', limits: 'Needs an outlet, drain connection and dedicated faucet; check cabinet clearance.', upkeep: 'Compare CF, CB and RO replacement costs and their separate schedules.' },
    { id: 28, fit: 'Another installed kitchen option', limits: 'Review the installation manual for cabinet space, tank, faucet and drain requirements.', upkeep: 'Compare the exact Under-Sink model’s cartridge set; Classic cartridges are not interchangeable assumptions.' },
  ] },
  { id: 'whole-home', label: 'Whole-home treatment', description: 'Compare carbon and sediment systems for incoming water. These are not hardness-removing softeners.', guide: '/blog/best-water-filter-hard-water', picks: [
    { id: 19, fit: 'Sediment and carbon at the home’s inlet', limits: 'Main-line installation and service clearance. Does not soften hard water or disinfect an unsafe well.', upkeep: 'Replace sediment/carbon cartridges on the model’s schedule; water quality and flow affect life.' },
    { id: 32, fit: 'Whole-home carbon filtration', limits: 'Check the exact bundle, flow rating and fittings. Do not assume a softener or UV system is included.', upkeep: 'Include pre/post-filter changes, eventual media replacement and installation in the budget.' },
    { id: 33, fit: 'A cartridge-based whole-home option', limits: 'Requires main-line plumbing and room to change housings. Not a substitute for a softener.', upkeep: 'Compare replacement sets and service costs at your household’s actual usage.' },
  ] },
] as const;
export function homeShoppingProduct(id: number) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p || p.outOfStock || !preferredAmazonPurchaseUrl(p.amazon)) return undefined;
  return { id: p.id as number, name: p.name as string, brand: p.brand as string, img: p.img as string, amazon: preferredAmazonPurchaseUrl(p.amazon)! };
}
