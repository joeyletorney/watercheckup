'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

const WATERDROP_TAG = 'anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const TOP_3_RO = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$849', reason: 'Tankless 800 GPD. Removes 99%+ PFAS, lead, arsenic, nitrates. Smart TDS faucet. 10-stage filtration.', link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK', certs: ['NSF 42', 'NSF 53', 'NSF 58'] },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO on the market.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`, badge: 'MOST CERTIFIED', certs: ['WQA Gold Seal', 'NSF 42', 'NSF 53', 'NSF 58', 'NSF 401'] },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters, no tools needed. Compact tankless design.', link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier', amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON_TAG}`, badge: 'EASIEST FILTER CHANGE', certs: ['NSF 42', 'NSF 53', 'NSF 58'] },
];
const TOP_3_PITCHER = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473. 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK', certs: ['NSF 42', 'NSF 53', 'NSF 401', 'NSF P473'] },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon filter life. Removes chlorine, PFOA/PFOS, heavy metals. Zero installation.', link: `https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`, badge: 'BEST VALUE', certs: ['NSF 42', 'NSF 53'] },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53 certified for lead and chromium. Includes TDS meter.', link: 'https://www.zerowater.com/collections/pitchers', amazon: `https://www.amazon.com/dp/B0DWTTYTQN?tag=${AMAZON_TAG}`, badge: 'REMOVES TDS', certs: ['NSF 42', 'NSF 53'] },
];
const TOP_3_COUNTERTOP = [
  { product: 'AquaTru Classic Countertop RO', brand: 'AquaTru', price: '~$475', reason: 'NSF 42/53/58/401. No installation — just plug in. Removes PFAS, nitrates, fluoride, radium.', link: 'https://www.aquatruwater.com', amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK', certs: ['NSF 42', 'NSF 53', 'NSF 58', 'NSF 401'] },
  { product: 'Waterdrop K19-S Countertop RO', brand: 'Waterdrop', price: '~$199', reason: 'No installation needed — just plug in. NSF 58 certified, removes PFAS, lead, arsenic, and 1,000+ contaminants. Perfect for renters. 170 oz tank, 3:1 pure to drain ratio.', link: `https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0BHQRNGZ8?tag=${AMAZON_TAG}`, badge: 'BEST VALUE', certs: ['NSF 42', 'NSF 53', 'NSF 58'] },
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'If countertop RO is too much, this pitcher removes 365+ contaminants including PFAS — no plumbing at all.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'NO INSTALL ALT', certs: ['NSF 42', 'NSF 53', 'NSF 401'] },
];
const TOP_3_WELL = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$849', reason: 'Handles well water RO at the tap. 10-stage filtration removes bacteria byproducts, heavy metals, nitrates, arsenic.', link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK', certs: ['NSF 42', 'NSF 53', 'NSF 58'] },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal certified. Handles well water contaminants including arsenic, nitrates, and hardness minerals.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`, badge: 'MOST CERTIFIED', certs: ['WQA Gold Seal', 'NSF 42', 'NSF 53', 'NSF 58'] },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$420', reason: 'Entry-point whole-house sediment + carbon filter for well water. Removes iron, chlorine, sediment at every tap.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON_TAG}`, badge: 'WHOLE HOUSE ENTRY', certs: ['NSF 42'] },
];
const TOP_3_WHOLE_HOUSE_CITY = [
  { product: 'Waterdrop WHF3T-PG Whole House 3-Stage', brand: 'Waterdrop', price: '~$370', reason: 'Sediment + carbon at every tap. Transparent housings and gauge — strong DIY whole-home chlorine/VOC reduction.', link: `https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0FYCRPXLZ?tag=${AMAZON_TAG}`, badge: 'BRAND PICK', certs: ['NSF 42'] },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$420', reason: 'Popular entry whole-house: sediment + dual carbon for all taps and showers. Pairs great with under-sink RO.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON_TAG}`, badge: 'BEST VALUE', certs: ['NSF 42'] },
  { product: 'Express Water WH300SCKS 3-Stage', brand: 'Express Water', price: '~$548', reason: 'Whole-home sediment and carbon with pressure gauges. Good step-up capacity vs compact 10" systems.', link: 'https://www.expresswater.com', amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON_TAG}`, badge: 'HIGH FLOW', certs: ['NSF 42', 'NSF 61'] },
];
const TOP_3_WHOLE_HOUSE_WELL = [
  { product: 'iSpring WCFM500K Iron, Manganese & Sulfur', brand: 'iSpring', price: '~$2,299', reason: 'Whole-house media system for wells: targets iron, manganese, and hydrogen sulfide (rotten-egg smell) at entry.', link: 'https://www.ispringfilter.com/ac/ispring-wcfm500k', amazon: `https://www.amazon.com/gp/product/B08TMZYYQY?tag=${AMAZON_TAG}`, badge: 'WELL + IRON', certs: ['WQA tested'] },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$420', reason: 'Affordable sediment + carbon chain for every tap. Common first stage before softener, UV, or specialty well media.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON_TAG}`, badge: 'ENTRY STAGE', certs: ['NSF 42'] },
  { product: 'Express Water WH300SCKS 3-Stage', brand: 'Express Water', price: '~$548', reason: 'Multi-stage POE with gauges; useful when you need higher flow and visible pressure drop across stages.', link: 'https://www.expresswater.com', amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON_TAG}`, badge: 'MULTI-STAGE', certs: ['NSF 42', 'NSF 61'] },
];
const TOP_5_AMAZON_DRINKING = [
  { categoryLabel: 'WHOLE HOUSE', product: 'iSpring WGB32B 3-Stage Whole House', brand: 'iSpring', price: '~$420', reason: 'Top-selling 3-stage POE on Amazon: sediment + carbon for every tap. Great with a kitchen RO for drinking.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/gp/product/B008GNRMYK?tag=${AMAZON_TAG}`, badge: 'POE BEST SELLER', certs: ['NSF 42'] },
  { categoryLabel: 'UNDER-SINK RO', product: 'Waterdrop G3P800 Tankless RO', brand: 'Waterdrop', price: '~$849', reason: 'High-volume tankless under-sink RO. PFAS, lead, and TDS at the kitchen tap.', link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'UNDER-SINK RO', certs: ['NSF 42', 'NSF 53', 'NSF 58'] },
  { categoryLabel: 'COUNTERTOP RO', product: 'AquaTru Classic Countertop RO', brand: 'AquaTru', price: '~$475', reason: 'Plug-in RO — no under-sink install. NSF-class certifications; popular for renters and kitchens without plumbing changes.', link: 'https://www.aquatruwater.com', amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON_TAG}`, badge: 'COUNTERTOP RO', certs: ['NSF 42', 'NSF 53', 'NSF 58', 'NSF 401'] },
  { categoryLabel: 'PITCHER', product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Among the strongest certified pitchers on Amazon for PFAS and lead — zero installation.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'PITCHER', certs: ['NSF 42', 'NSF 53', 'NSF 401'] },
  { categoryLabel: 'UNDER-SINK (NON-RO)', product: 'Epic Smart Shield Under-Sink', brand: 'Epic Water Filters', price: '~$129', reason: 'Compact under-sink system — NSF 401 for emerging contaminants; alternative if you do not want full RO.', link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system', amazon: `https://www.amazon.com/gp/product/B076S1W5QY?tag=${AMAZON_TAG}`, badge: 'NO RO', certs: ['NSF 42', 'NSF 53', 'NSF 401'] },
];

const LINKS = {
  waterdrop: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`,
  waterdrop_pitcher: `https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=${WATERDROP_TAG}`,
  amazon_pitcher: `https://www.amazon.com/s?k=water+filter+pitcher+pfas+certified&tag=${AMAZON_TAG}`,
  amazon_undersink: `https://www.amazon.com/s?k=under+sink+reverse+osmosis+system&tag=${AMAZON_TAG}`,
  amazon_whole_house: `https://www.amazon.com/s?k=whole+house+water+filter+system&tag=${AMAZON_TAG}`,
  amazon_well: `https://www.amazon.com/s?k=well+water+filter+system&tag=${AMAZON_TAG}`,
};

function trackEvent(name: string, params: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params);
}
function showBuyDirectForBrand(brand: string) { return brand === 'Waterdrop'; }

const QUESTIONS = [
  {
    id: 'source', question: 'What is your water source?', subtitle: 'Determines which contaminants we prioritize.',
    options: [
      { value: 'city', label: 'City / Municipal Water', icon: '🏙️', desc: 'Tap water from a public utility — chlorine, PFAS, lead are common concerns.' },
      { value: 'well', label: 'Private Well Water', icon: '🌿', desc: 'Your own well — bacteria, nitrates, iron, and arsenic are typical priorities.' },
    ],
  },
  {
    id: 'concern', question: "What's your biggest concern?", subtitle: 'Choose what worries you most — we will match the right filter technology.',
    options: [
      { value: 'pfas', label: 'PFAS / Forever Chemicals', icon: '⚗️', desc: 'Linked to cancer and immune damage. Found in 45% of US tap water.' },
      { value: 'lead', label: 'Lead & Heavy Metals', icon: '🔩', desc: 'Leaches from old pipes. No safe level for children.' },
      { value: 'taste', label: 'Taste, Odor & Chlorine', icon: '💧', desc: 'Chlorine, sulfur, and minerals that make water unpleasant to drink.' },
      { value: 'general', label: 'Everything — All major concerns', icon: '🛡️', desc: 'Give me the most comprehensive coverage available.' },
    ],
  },
  {
    id: 'situation', question: 'What describes your home?', subtitle: 'Affects what can be installed without plumbing modifications.',
    options: [
      { value: 'renter', label: 'Renter — No Modifications', icon: '🏢', desc: 'No drilling or plumbing changes. Pitcher or countertop only.' },
      { value: 'owner_simple', label: 'Homeowner — Kitchen / Under-Sink', icon: '🏠', desc: 'Under-sink filter for drinking and cooking. Best value for most families.' },
      { value: 'owner_full', label: 'Homeowner — Whole Home + Kitchen', icon: '🏡', desc: 'Full protection: every tap, shower, appliance, and the kitchen sink.' },
    ],
  },
];

type AltPick = { product: string; brand: string; price: string; reason: string; link: string; amazon: string; badge: string; certs?: string[]; categoryLabel?: string; };
type Rec = { title: string; tagline: string; why: string; cta: string; cta2: string; link: string; link2: string; badge: string; badgeColor: string; alts?: AltPick[]; altsWholeHouse?: AltPick[]; };

const RECS: Record<string, Rec> = {
  'city-pfas-renter':         { title: 'Clearly Filtered Pitcher', tagline: 'NSF 42/53/401/P473 certified. Removes 99.9% PFAS. Zero installation.', why: 'PFAS accumulate silently. Clearly Filtered is the only pitcher with multiple NSF certifications specifically for PFAS — and requires zero tools or landlord permission.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'PFAS CERTIFIED', badgeColor: '#0891b2', alts: TOP_3_PITCHER },
  'city-pfas-owner_simple':   { title: 'Waterdrop G3P800 RO', tagline: 'NSF 58 certified. 99%+ PFAS removal. Installs under the sink in 30 min.', why: 'Under-sink RO is the gold standard for PFAS. The G3P800 is tankless, fast (800 GPD), and NSF 58 certified — the standard that covers reverse osmosis performance.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST FOR PFAS', badgeColor: '#0891b2', alts: TOP_3_RO },
  'city-pfas-owner_full':     { title: 'Whole-House Pre-Filter + RO', tagline: 'Entry-level carbon at every tap + NSF 58 RO for drinking.', why: 'Pair a whole-house sediment/carbon filter at entry with a dedicated RO at the kitchen tap. Covers drinking, cooking, ice, and reduces chlorine at every shower.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'MAXIMUM PROTECTION', badgeColor: '#0066cc', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-lead-renter':         { title: 'Clearly Filtered Pitcher', tagline: 'NSF 53 certified for 99.5% lead removal. No install needed.', why: 'Lead enters through old building pipes. Clearly Filtered is NSF 53 certified for lead — the specific standard that matters. No installation, no landlord permission required.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'LEAD CERTIFIED', badgeColor: '#d97706', alts: TOP_3_PITCHER },
  'city-lead-owner_simple':   { title: 'Waterdrop G3P800 RO', tagline: 'NSF 58 certified. Removes 99.9% of lead at the tap.', why: 'Homes built before 1986 likely have lead solder or pipes. An NSF 58 certified under-sink RO removes lead at the point of use — the safest approach for cooking and drinking.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'LEAD CERTIFIED', badgeColor: '#d97706', alts: TOP_3_RO },
  'city-lead-owner_full':     { title: 'Whole-House + Under-Sink RO', tagline: 'NSF 58 RO at the kitchen + whole-house carbon to reduce exposure at every tap.', why: 'If your home has aging pipes throughout, a whole-house pre-filter plus a dedicated kitchen RO is the complete solution — drinking water is covered by RO, showers and laundry by the whole-house stage.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#7c3aed', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-taste-renter':        { title: 'Waterdrop Pitcher Filter', tagline: 'Removes chlorine, chloramines, and VOCs. Better taste instantly.', why: 'Chlorine is what makes city water taste like a pool. Carbon filtration removes it completely — zero installation needed.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_pitcher, badge: 'CHLORINE REMOVAL', badgeColor: '#059669', alts: TOP_3_PITCHER },
  'city-taste-owner_simple':  { title: 'Waterdrop G3P800 RO', tagline: 'Crystal clear, great-tasting water from your tap. NSF 42 certified.', why: 'Under-sink RO removes chlorine taste, sediment, and dissolved minerals that make water taste flat or metallic. NSF 42 covers aesthetic improvement — you will notice the difference on day one.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST TASTE', badgeColor: '#059669', alts: TOP_3_RO },
  'city-taste-owner_full':    { title: 'Whole-House Carbon + Under-Sink RO', tagline: 'Every tap filtered. Better showers, laundry, and drinking water.', why: 'A whole-house carbon filter removes chlorine from all water entering your home — better for skin and hair. Pair with kitchen RO for the purest drinking water.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#059669', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-general-renter':      { title: 'Clearly Filtered Pitcher', tagline: 'NSF 42/53/401/P473. 365+ contaminants. No tools.', why: 'For renters who want comprehensive protection without installation, Clearly Filtered is the strongest certified pitcher on the market — covering PFAS, lead, arsenic, chromium-6, and more.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'ALL-IN-ONE', badgeColor: '#94a3b8', alts: TOP_3_PITCHER },
  'city-general-owner_simple':{ title: 'Waterdrop G3P800 RO', tagline: 'NSF 42/53/58 certified. Removes 1000+ contaminants.', why: 'Reverse osmosis handles everything — PFAS, lead, nitrates, arsenic, chlorine, and more. The gold standard for home filtration and the most cost-effective per-gallon option long-term.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'MOST COMPLETE', badgeColor: '#94a3b8', alts: TOP_3_RO },
  'city-general-owner_full':  { title: 'Whole-House + Under-Sink RO', tagline: 'Total home protection. Every drop filtered twice.', why: 'Whole-house sediment/carbon at entry plus a dedicated RO at the kitchen sink. The most comprehensive setup available — covers drinking, cooking, showers, and laundry.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'TOTAL PROTECTION', badgeColor: '#0f172a', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'well-pfas-renter':         { title: 'Clearly Filtered Pitcher', tagline: 'NSF P473 certified for PFAS. Works anywhere, no install.', why: 'Well PFAS contamination is common near agriculture and military sites. Clearly Filtered is certified specifically for PFAS reduction — the only pitcher that is.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'WELL PFAS', badgeColor: '#166534', alts: TOP_3_PITCHER },
  'well-pfas-owner_simple':   { title: 'Waterdrop G3P800 RO', tagline: 'NSF 58 certified. Removes 99%+ PFAS. Handles well water hardness.', why: 'Well water needs filters rated for higher sediment and mineral content in addition to PFAS. The G3P800 handles all of it at the kitchen tap.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + PFAS', badgeColor: '#166534', alts: TOP_3_RO },
  'well-pfas-owner_full':     { title: 'Whole-House Well System + RO', tagline: 'Iron/sediment at entry + NSF 58 RO at the tap.', why: 'Full protection for well homeowners means treating at entry (iron, sediment, bacteria) and again at the tap (PFAS, nitrates). This two-stage approach is the standard recommended by certified water treatment specialists.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'MAXIMUM WELL', badgeColor: '#14532d', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-lead-renter':         { title: 'Clearly Filtered Pitcher', tagline: 'NSF 53 certified for lead. Removes 99.5%. Portable.', why: 'Lead can leach into well water from aging pipes or natural deposits. Clearly Filtered is NSF 53 certified for lead removal with no plumbing work required.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'WELL + LEAD', badgeColor: '#92400e', alts: TOP_3_WELL },
  'well-lead-owner_simple':   { title: 'Waterdrop G3P800 RO', tagline: 'Removes lead, iron, manganese, and heavy metals. NSF 58.', why: 'Well water lead often comes from natural deposits or old pump hardware. An NSF 58 certified RO system handles it at the tap with no risk of re-contamination.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + LEAD', badgeColor: '#92400e', alts: TOP_3_RO },
  'well-lead-owner_full':     { title: 'Whole-House Well + RO System', tagline: 'Iron filtration at entry + NSF 58 lead removal at every drinking tap.', why: 'For full lead protection on well water, pair entry-level iron and sediment filtration with a dedicated kitchen RO certified for lead removal.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL HOME', badgeColor: '#78350f', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-taste-renter':        { title: 'Waterdrop Pitcher Filter', tagline: 'Removes sulfur, iron taste, and sediment. No installation.', why: 'Well water taste issues usually come from iron, sulfur, or sediment. A well-certified multi-stage pitcher fixes it without any plumbing.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46', alts: TOP_3_WELL },
  'well-taste-owner_simple':  { title: 'Waterdrop G3P800 RO', tagline: 'Eliminates iron, sulfur, hardness, and taste issues at the tap.', why: 'An RO system for well water removes the root causes of taste and odor — not just masking them. Hardness minerals, dissolved iron, and sulfur compounds are all addressed.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46', alts: TOP_3_RO },
  'well-taste-owner_full':    { title: 'Whole-House Well Filter + RO', tagline: 'Softener + carbon at entry. RO for drinking. Every tap improved.', why: 'A whole-house well filter system addresses hardness, iron, and taste at the source. Pair it with a kitchen RO for the purest drinking water.', cta: 'RO on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL', badgeColor: '#064e3b', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-general-renter':      { title: 'Clearly Filtered Pitcher', tagline: 'Multi-stage certified well filtration. No installation required.', why: 'Well water has unique contaminant profiles. Clearly Filtered covers the widest range with the most NSF certifications of any pitcher — bacteria byproducts, metals, and PFAS.', cta: 'Clearly Filtered', cta2: 'See on Amazon', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', link2: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f', alts: TOP_3_WELL },
  'well-general-owner_simple':{ title: 'Waterdrop G3P800 RO', tagline: 'NSF 42/53/58 certified. Built for well water. Removes everything.', why: 'Private wells need specialized filtration. RO handles the full range of well water contaminants — iron byproducts, nitrates, arsenic, PFAS, heavy metals, and more.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f', alts: TOP_3_RO },
  'well-general-owner_full':  { title: 'Whole-House Well System + RO', tagline: 'Complete protection from wellhead to tap.', why: 'The gold standard for well homeowners: entry-level whole-house filtration plus a dedicated kitchen RO. Covers drinking, cooking, showers, and laundry from a single comprehensive system.', cta: 'RO on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'TOTAL WELL', badgeColor: '#0f172a', alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
};

function getRec(answers: Record<string, string>): Rec {
  const key = `${answers.source}-${answers.concern}-${answers.situation}`;
  return RECS[key] || RECS['city-general-owner_simple'];
}

const CERT_COLOR: Record<string, string> = {
  'WQA Gold Seal': '#d97706',
  'NSF 58': '#0891b2',
  'NSF 401': '#7c3aed',
  'NSF 42': '#059669',
  'NSF 53': '#0891b2',
  'NSF 61': '#64748b',
  'NSF P473': '#ef4444',
  'NSF 244': '#f59e0b',
  'WQA tested': '#d97706',
};

function CertBadge({ cert }: { cert: string }) {
  const color = CERT_COLOR[cert] || '#64748b';
  return (
    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: '2px 7px', borderRadius: 4, background: `${color}18`, border: `1px solid ${color}44`, color, display: 'inline-block' }}>
      {cert}
    </span>
  );
}

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const currentQ = QUESTIONS[step];
  const rec = done ? getRec(answers) : null;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    trackEvent('quiz_answer', { question: currentQ.id, answer: value });
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 220);
    } else {
      setTimeout(() => {
        setDone(true);
        trackEvent('quiz_complete', { source: newAnswers.source, concern: newAnswers.concern, situation: newAnswers.situation });
      }, 220);
    }
  };

  const restart = () => { setAnswers({}); setStep(0); setDone(false); };

  const renderAltRows = (alts: AltPick[], keyPrefix: string) =>
    alts.map((alt, i) => {
      const showDirect = showBuyDirectForBrand(alt.brand);
      return (
        <div key={`${keyPrefix}-${i}`} style={{ padding: '14px 16px', background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336' }}>
          {alt.categoryLabel && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: '#22d3ee', marginBottom: 6 }}>{alt.categoryLabel}</div>}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#64748b' }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{alt.product}</span>
                {alt.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: i === 0 ? '#0891b2' : '#1e3a5f', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{alt.badge}</span>}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{alt.brand} · {alt.price}</div>
              {/* Certification badges */}
              {alt.certs && alt.certs.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                  {alt.certs.map(c => <CertBadge key={c} cert={c} />)}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>{alt.reason}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
              {showDirect && (
                <a href={alt.link} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackEvent('affiliate_click', { destination: 'direct', product: alt.product, page: 'quiz' })}
                  style={{ display: 'block', padding: '7px 14px', background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: i === 0 ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: i === 0 ? 'none' : '1px solid #1a3a5c' }}>
                  Buy Direct →
                </a>
              )}
              <a href={alt.amazon} target="_blank" rel="noopener noreferrer sponsored" onClick={() => trackEvent('affiliate_click', { destination: 'amazon', product: alt.product, page: 'quiz' })}
                style={{ display: 'block', padding: '7px 14px', background: !showDirect && i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240', color: !showDirect && i === 0 ? '#fff' : '#94a3b8', textDecoration: 'none', borderRadius: 7, fontSize: 12, fontWeight: !showDirect && i === 0 ? 700 : 600, textAlign: 'center', border: !showDirect && i === 0 ? 'none' : '1px solid #1a3a5c', whiteSpace: 'nowrap' }}>
                Amazon →
              </a>
            </div>
          </div>
        </div>
      );
    });

  const p: React.CSSProperties = { fontSize: 14, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 14px' };
  const h3: React.CSSProperties = { fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: '28px 0 8px' };

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER FINDER</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.2 }}>Find Your Perfect Water Filter</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.6 }}>3 quick questions. We match you to the right filter type and technology based on your water source, your biggest concern, and your living situation — then show you the top certified options.</p>
          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { label: 'NSF Certified Picks', color: '#0891b2', icon: '✓' },
              { label: 'WQA Gold Seal Options', color: '#d97706', icon: '✓' },
              { label: 'No paid placements', color: '#059669', icon: '✓' },
              { label: 'Based on EPA data', color: '#94a3b8', icon: '✓' },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: `${b.color}12`, border: `1px solid ${b.color}33`, color: b.color }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── WHY CERTIFICATIONS MATTER ── */}
        <div style={{ marginBottom: 32, padding: '20px 22px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>WHY CERTIFICATIONS MATTER</div>
          <p style={{ ...p, margin: '0 0 16px' }}>
            Any filter company can claim their product "removes 99% of contaminants." Certifications are what actually back that up. We only recommend filters with third-party certification — here is what each one means:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { cert: 'NSF/ANSI 42', color: '#059669', desc: 'Aesthetic effects — chlorine taste, odor, and particulates.' },
              { cert: 'NSF/ANSI 53', color: '#0891b2', desc: 'Health contaminants — lead, cysts, VOCs, and specific listed compounds.' },
              { cert: 'NSF/ANSI 58', color: '#0891b2', desc: 'Reverse osmosis systems — the standard that covers PFAS, arsenic, and heavy metals via RO.' },
              { cert: 'NSF/ANSI 401', color: '#7c3aed', desc: 'Emerging contaminants — PFOA, PFOS, pharmaceuticals, and other compounds not yet regulated.' },
              { cert: 'NSF/ANSI P473', color: '#ef4444', desc: 'PFOA & PFOS specifically — stricter than 401 for these two compounds.' },
              { cert: 'WQA Gold Seal', color: '#d97706', desc: 'Water Quality Association independent lab testing against NSF/ANSI standards. Widely respected industry certification.' },
            ].map(({ cert, color, desc }) => (
              <div key={cert} style={{ padding: '10px 12px', background: `${color}0a`, border: `1px solid ${color}25`, borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>{cert}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#64748b' }}>Tip:</strong> A box that says "NSF certified" without a standard number is not enough. Always match the certification to your specific concern — NSF 58 for RO/PFAS, NSF 53 for lead, NSF 401 or P473 for PFAS in pitcher filters.
          </p>
        </div>

        {/* ── QUIZ / RESULTS ── */}
        {!done ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px', marginBottom: 32 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                <span>QUESTION {step + 1} OF {QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div style={{ height: 3, background: '#0f2336', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${((step + 1) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{currentQ.question}</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>{currentQ.subtitle}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQ.options.map(opt => (
                <button key={opt.value} onClick={() => handleSelect(opt.value)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, cursor: 'pointer', textAlign: 'left', color: '#e2e8f0', fontSize: 15, fontWeight: 600, width: '100%' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2a40'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a3a5c'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2240'; }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{opt.label}</div>
                    {'desc' in opt && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, fontWeight: 400, lineHeight: 1.5 }}>{(opt as any).desc}</div>}
                  </div>
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', marginTop: 20, padding: 0 }}>← Back</button>}
          </div>
        ) : rec ? (
          <div style={{ marginBottom: 32 }}>
            {/* Affiliate disclosure — right at the top of results */}
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#a16207' }}>Affiliate disclosure:</strong> Some links below are affiliate links — if you purchase through them, WaterCheckup may earn a small commission at no extra cost to you. This does not influence our recommendations, which are based solely on NSF/WQA certifications and independent test data. We never take paid placements.
              </p>
            </div>

            <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '28px' }}>
              <div style={{ display: 'inline-block', background: rec.badgeColor, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '4px 12px', borderRadius: 4, marginBottom: 14 }}>{rec.badge}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 6 }}>OUR RECOMMENDATION</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>{rec.title}</h2>
              <p style={{ fontSize: 14, color: '#0891b2', fontStyle: 'italic', marginBottom: 18, lineHeight: 1.55 }}>{rec.tagline}</p>
              <div style={{ background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{rec.why}</p>
              </div>

              {/* Product results */}
              {rec.alts && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 2 }}>
                    {rec.altsWholeHouse?.length ? 'TOP PICKS — DRINKING & COOKING (UNDER-SINK / RO)' : 'TOP PICKS'}
                  </div>
                  {renderAltRows(rec.alts, 'pou')}
                  {rec.altsWholeHouse?.length ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 2 }}>TOP PICKS — WHOLE HOUSE (POINT OF ENTRY)</div>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', lineHeight: 1.5 }}>Treats water where it enters your home — showers, laundry, pipes. Pair with the under-sink picks above for the cleanest drinking water.</p>
                      {renderAltRows(rec.altsWholeHouse, 'poe')}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Top 5 by type */}
              <div style={{ paddingTop: 20, borderTop: '1px solid #0f2336', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 2 }}>TOP 5 ON AMAZON — ONE PICK PER FILTER TYPE</div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', lineHeight: 1.55 }}>Whole-house, under-sink RO, countertop RO, pitcher, and non-RO under-sink — the top NSF-certified pick in each category.</p>
                {renderAltRows(TOP_5_AMAZON_DRINKING, 'amz5')}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {Object.entries(answers).map(([k, v]) => (
                  <span key={k} style={{ background: '#0d2240', border: '1px solid #1a3a5c', color: '#94a3b8', fontSize: 10, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{v.replace('_', ' ')}</span>
                ))}
              </div>
              <button onClick={restart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', padding: 0, textDecoration: 'underline' }}>Start over</button>
            </div>
          </div>
        ) : null}

        {/* ── FILTER COMPARISON TABLE ── */}
        <div style={{ marginBottom: 40, padding: '24px 22px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>FILTER TYPE COMPARISON</div>
          <p style={{ ...p, marginBottom: 16 }}>Not sure which filter type fits your life? Here is how they compare across the things that matter most.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: '#94a3b8' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a3a5c' }}>
                  {['Filter Type', 'Removes PFAS', 'Removes Lead', 'Installation', 'Cost', 'Best For'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#64748b', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Under-sink RO', pfas: '✅ 99%+', lead: '✅ 99%+', install: '30–60 min DIY', cost: '$250–$800', best: 'Homeowners, families, PFAS areas' },
                  { type: 'Countertop RO', pfas: '✅ 99%+', lead: '✅ 99%+', install: 'Zero — plug in', cost: '$150–$500', best: 'Renters, apartments' },
                  { type: 'Pitcher (certified)', pfas: '✅ if NSF P473', lead: '✅ if NSF 53', install: 'Zero', cost: '$40–$90', best: 'Budget, dorms, portability' },
                  { type: 'Faucet mount', pfas: '❌ most do not', lead: '⚠️ some NSF 53', install: '5 min', cost: '$25–$60', best: 'Taste/odor only' },
                  { type: 'Whole-house', pfas: '⚠️ partial, use RO for drinking', lead: '⚠️ carbon only', install: 'Pro recommended', cost: '$400–$2,500+', best: 'Every tap + shower' },
                  { type: 'Pitcher (basic Brita)', pfas: '❌ not certified', lead: '❌ not NSF 53', install: 'Zero', cost: '$25–$45', best: 'Chlorine taste only' },
                ].map((row, i) => (
                  <tr key={row.type} style={{ borderBottom: '1px solid #0f2336', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{row.type}</td>
                    <td style={{ padding: '10px 10px', color: row.pfas.startsWith('✅') ? '#22d3ee' : row.pfas.startsWith('⚠️') ? '#f59e0b' : '#ef4444', whiteSpace: 'nowrap' }}>{row.pfas}</td>
                    <td style={{ padding: '10px 10px', color: row.lead.startsWith('✅') ? '#22d3ee' : row.lead.startsWith('⚠️') ? '#f59e0b' : '#ef4444', whiteSpace: 'nowrap' }}>{row.lead}</td>
                    <td style={{ padding: '10px 10px', whiteSpace: 'nowrap' }}>{row.install}</td>
                    <td style={{ padding: '10px 10px', whiteSpace: 'nowrap' }}>{row.cost}</td>
                    <td style={{ padding: '10px 10px', lineHeight: 1.4 }}>{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: '#334155', marginTop: 12, marginBottom: 0, lineHeight: 1.6 }}>
            * PFAS removal requires either RO (NSF 58) or a pitcher/filter specifically certified to NSF 401 or P473. Standard carbon block filters do not remove PFAS.
          </p>
        </div>

        {/* ── HOW WE PICK ── */}
        <div style={{ marginBottom: 40, padding: '24px 22px', background: '#071828', border: '1px solid #1a3a5c', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>HOW WE PICK</div>
          <h3 style={h3}>Only certified products, period</h3>
          <p style={p}>Every filter we recommend has third-party NSF or WQA certification for the claims on its label. We do not recommend filters based on marketing claims alone. If a company says their filter "removes 99% of PFAS" without NSF 58, NSF 401, or NSF P473 certification, we do not include it.</p>
          <h3 style={h3}>We check the specific standard, not just "NSF certified"</h3>
          <p style={p}>A filter can be NSF 42 certified (for chlorine taste) but not NSF 53 certified (for lead). These are meaningfully different. We match the certification to the concern — NSF 58 for RO/PFAS, NSF 53 for lead, NSF 401 or P473 for PFAS in pitchers.</p>
          <h3 style={h3}>No paid placements — ever</h3>
          <p style={p}>We earn affiliate commissions when you buy through our links, but no manufacturer has paid to be featured or ranked higher. Our rankings are based on certifications, independent test data, and verified review volume — not ad budgets.</p>
          <h3 style={h3}>Connect your water data to your filter choice</h3>
          <p style={{ ...p, marginBottom: 0 }}>The most precise recommendation comes from knowing what is actually in your water. Enter your ZIP below to get a free EPA-backed report for your specific utility — then come back here to pick the filter that matches your results.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: 14, padding: '10px 20px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>Check My Water Report →</Link>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#1e3a5f' }}>
          Picks are based on NSF/WQA certifications and independent data · <Link href="/" style={{ color: '#1e3a5f' }}>WaterCheckup.com</Link>
        </div>
      </div>
    </div>
  );
}
