'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

const WATERDROP_TAG = 'anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const TOP_3_RO = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$369', reason: 'Tankless 800 GPD. Removes 99%+ PFAS, lead, arsenic, nitrates. Smart TDS faucet. 10-stage filtration.', link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal + NSF 42/53/58/401. Most certifications of any under-sink RO on the market.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`, badge: 'MOST CERTIFIED' },
  { product: 'AquaTru Under-Sink RO', brand: 'AquaTru', price: '~$375', reason: 'NSF 42/53/58 certified. Quick-change filters, no tools needed. Compact tankless design.', link: 'https://www.aquatruwater.com/under-sink-reverse-osmosis-water-purifier', amazon: `https://www.amazon.com/dp/B0GGTSFZMY?tag=${AMAZON_TAG}`, badge: 'EASIEST FILTER CHANGE' },
];
const TOP_3_PITCHER = [
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'Only pitcher certified to remove PFAS at 99.9%. NSF 42/53/244/401/P473. 365+ contaminants.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Waterdrop Pitcher Filter', brand: 'Waterdrop', price: '~$40', reason: '7-stage filtration, 200-gallon filter life. Removes chlorine, PFOA/PFOS, heavy metals. Zero installation.', link: `https://www.waterdropfilter.com/collections/pitcher-water-filter?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B01JSJFBNE?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
  { product: 'ZeroWater 10-Cup Pitcher', brand: 'ZeroWater', price: '~$40', reason: 'Reduces TDS to zero. NSF 42/53 certified for lead and chromium. Includes TDS meter.', link: 'https://www.zerowater.com/collections/pitchers', amazon: `https://www.amazon.com/dp/B01I2I2R36?tag=${AMAZON_TAG}`, badge: 'REMOVES TDS' },
];
const TOP_3_COUNTERTOP = [
  { product: 'AquaTru Classic Countertop RO', brand: 'AquaTru', price: '~$475', reason: 'NSF 42/53/58/401. No installation — just plug in. Removes PFAS, nitrates, fluoride, radium. Best premium countertop RO.', link: 'https://www.aquatruwater.com', amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Waterdrop D4 Countertop RO', brand: 'Waterdrop', price: '~$299', reason: 'Tankless countertop RO. No plumbing, connects to faucet. 4-stage filtration for PFAS, lead, chlorine.', link: `https://www.waterdropfilter.com/products/countertop-reverse-osmosis-system?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0B8H34LZG?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
  { product: 'Clearly Filtered 3.5L Pitcher', brand: 'Clearly Filtered', price: '~$90', reason: 'If countertop RO is too much, this pitcher removes 365+ contaminants including PFAS — no plumbing at all.', link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`, badge: 'NO INSTALL ALT' },
];
const TOP_3_WELL = [
  { product: 'Waterdrop G3P800 RO', brand: 'Waterdrop', price: '~$369', reason: 'Handles well water RO at the tap. 10-stage filtration removes bacteria byproducts, heavy metals, nitrates, arsenic.', link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`, badge: 'EDITORS PICK' },
  { product: 'Aquasana SmartFlow RO', brand: 'Aquasana', price: '~$449', reason: 'WQA Gold Seal certified. Handles well water contaminants including arsenic, nitrates, and hardness minerals.', link: 'https://www.aquasana.com/under-sink-water-filters', amazon: `https://www.amazon.com/dp/B0CHZ8VQBB?tag=${AMAZON_TAG}`, badge: 'MOST CERTIFIED' },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$189', reason: 'Entry-point whole-house sediment + carbon filter for well water. Removes iron, chlorine, sediment at every tap.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/dp/B007QN8EEU?tag=${AMAZON_TAG}`, badge: 'WHOLE HOUSE ENTRY' },
];

/** Point-of-entry systems for city / municipal water — pairs with kitchen RO for “full protection”. */
const TOP_3_WHOLE_HOUSE_CITY = [
  { product: 'Waterdrop WHF3T-PG Whole House 3-Stage', brand: 'Waterdrop', price: '~$370', reason: 'Sediment + carbon at every tap. Transparent housings and gauge — strong DIY whole-home chlorine/VOC reduction before your RO.', link: `https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=${WATERDROP_TAG}`, amazon: `https://www.amazon.com/dp/B0FYCRPXLZ?tag=${AMAZON_TAG}`, badge: 'BRAND PICK' },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$189', reason: 'Popular entry whole-house: sediment + dual carbon for all taps and showers. Often paired with under-sink RO for drinking.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/dp/B007QN8EEU?tag=${AMAZON_TAG}`, badge: 'BEST VALUE' },
  { product: 'Express Water WH300SCKS 3-Stage', brand: 'Express Water', price: '~$548', reason: 'Whole-home sediment and carbon with pressure gauges. Good step-up capacity vs compact 10" systems.', link: 'https://www.expresswater.com', amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON_TAG}`, badge: 'HIGH FLOW' },
];

/** Point-of-entry for private wells — iron, sediment, sulfur; pair with kitchen RO for PFAS/nitrates/drinking. */
const TOP_3_WHOLE_HOUSE_WELL = [
  { product: 'SpringWell WS4 Well Water Filter', brand: 'SpringWell', price: '~$899', reason: 'Designed for wells: air-injection style treatment for iron, sulfur smell, and manganese at the home entry.', link: 'https://www.springwellwater.com', amazon: `https://www.amazon.com/dp/B09NGDLQT6?tag=${AMAZON_TAG}`, badge: 'WELL + IRON' },
  { product: 'iSpring WGB32B Whole House 3-Stage', brand: 'iSpring', price: '~$189', reason: 'Affordable sediment + carbon chain for every tap. Common first stage before softener, UV, or specialty well media.', link: 'https://www.ispringwatersystems.com/products/wgb32b', amazon: `https://www.amazon.com/dp/B007QN8EEU?tag=${AMAZON_TAG}`, badge: 'ENTRY STAGE' },
  { product: 'Express Water WH300SCKS 3-Stage', brand: 'Express Water', price: '~$548', reason: 'Multi-stage POE with gauges; useful when you need higher flow and visible pressure drop across stages.', link: 'https://www.expresswater.com', amazon: `https://www.amazon.com/dp/B01LFMTYBM?tag=${AMAZON_TAG}`, badge: 'MULTI-STAGE' },
];

/** One editor pick per format — all available on Amazon with associate tag (whole-home + drinking paths). */
const TOP_5_AMAZON_DRINKING: AltPick[] = [
  {
    categoryLabel: 'WHOLE HOUSE',
    product: 'iSpring WGB32B 3-Stage Whole House',
    brand: 'iSpring',
    price: '~$189',
    reason: 'Top-selling 3-stage POE on Amazon: sediment + carbon for every tap. Great with a kitchen RO for drinking.',
    link: 'https://www.ispringwatersystems.com/products/wgb32b',
    amazon: `https://www.amazon.com/dp/B007QN8EEU?tag=${AMAZON_TAG}`,
    badge: 'POE BEST SELLER',
  },
  {
    categoryLabel: 'UNDER-SINK RO',
    product: 'Waterdrop G3P800 Tankless RO',
    brand: 'Waterdrop',
    price: '~$369',
    reason: 'High-volume tankless under-sink RO; strong Amazon presence. PFAS, lead, and TDS at the kitchen tap.',
    link: `https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=${WATERDROP_TAG}`,
    amazon: `https://www.amazon.com/dp/B0987FCQQW?tag=${AMAZON_TAG}`,
    badge: 'UNDER-SINK RO',
  },
  {
    categoryLabel: 'COUNTERTOP RO',
    product: 'AquaTru Classic Countertop RO',
    brand: 'AquaTru',
    price: '~$475',
    reason: 'Plug-in RO — no under-sink install. NSF-class certifications; popular on Amazon for renters and kitchens without plumbing changes.',
    link: 'https://www.aquatruwater.com',
    amazon: `https://www.amazon.com/dp/B0CQS3HQ8F?tag=${AMAZON_TAG}`,
    badge: 'COUNTERTOP RO',
  },
  {
    categoryLabel: 'PITCHER',
    product: 'Clearly Filtered 3.5L Pitcher',
    brand: 'Clearly Filtered',
    price: '~$90',
    reason: 'Among the strongest certified pitchers on Amazon for PFAS and lead — zero installation.',
    link: 'https://www.clearlyfiltered.com/products/filtered-water-pitcher',
    amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${AMAZON_TAG}`,
    badge: 'PITCHER',
  },
  {
    categoryLabel: 'UNDER-SINK (NON-RO)',
    product: 'Epic Smart Shield Under-Sink',
    brand: 'Epic Water Filters',
    price: '~$129',
    reason: 'Compact under-sink system on Amazon — NSF 401 for emerging contaminants; alternative if you do not want RO yet.',
    link: 'https://www.epicwaterfilters.com/products/epic-smart-shield-under-sink-water-filter-system',
    amazon: `https://www.amazon.com/dp/B09NHF7N9H?tag=${AMAZON_TAG}`,
    badge: 'NO RO',
  },
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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

function showBuyDirectForBrand(brand: string) {
  return brand !== 'Aquasana' && brand !== 'AquaTru';
}

const QUESTIONS = [
  {
    id: 'source',
    question: 'What is your water source?',
    subtitle: 'Determines which contaminants we prioritize.',
    options: [
      { value: 'city', label: 'City / Municipal Water', icon: '🏙️' },
      { value: 'well', label: 'Private Well Water', icon: '🌿' },
    ],
  },
  {
    id: 'concern',
    question: "What's your biggest concern?",
    subtitle: 'Choose what worries you most.',
    options: [
      { value: 'pfas', label: 'PFAS / Forever Chemicals', icon: '⚗️' },
      { value: 'lead', label: 'Lead & Heavy Metals', icon: '🔩' },
      { value: 'taste', label: 'Taste, Odor & Chlorine', icon: '💧' },
      { value: 'general', label: 'Everything — All major concerns', icon: '🛡️' },
    ],
  },
  {
    id: 'situation',
    question: 'What describes your home?',
    subtitle: 'Pick the last option if you want whole-home filters (every tap), not only kitchen / under-sink.',
    options: [
      { value: 'renter', label: 'Renter — No Modifications', icon: '🏢' },
      { value: 'owner_simple', label: 'Homeowner — Simple Setup', icon: '🏠' },
      { value: 'owner_full', label: 'Homeowner — Whole home + drinking', icon: '🏡' },
    ],
  },
];

type AltPick = {
  product: string;
  brand: string;
  price: string;
  reason: string;
  link: string;
  amazon: string;
  badge: string;
  /** Quiz “top 5 by type” section only */
  categoryLabel?: string;
};

type Rec = {
  title: string;
  tagline: string;
  why: string;
  cta: string;
  cta2: string;
  link: string;
  link2: string;
  badge: string;
  badgeColor: string;
  alts?: AltPick[];
  /** Shown for “Homeowner — Full Protection”: top whole-house (POE) picks below drinking options. */
  altsWholeHouse?: AltPick[];
};

const RECS: Record<string, Rec> = {
  'city-pfas-renter':         { title: 'Waterdrop Pitcher Filter', tagline: 'NSF 53 & 58 certified. Removes 99% of PFAS. Zero installation.', why: 'PFAS accumulate silently. This certified pitcher is the fastest fix for renters — no tools, no landlord permission.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_pitcher, badge: 'PFAS CERTIFIED', badgeColor: '#0891b2' , alts: TOP_3_PITCHER},
  'city-pfas-owner_simple':   { title: 'Waterdrop Under-Sink Filter', tagline: 'Tankless RO. 0.0001 micron filtration. Installs in 30 min.', why: 'Under-sink RO is the gold standard for PFAS. Fits any kitchen sink, no tank needed, crystal clear water at the tap.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST FOR PFAS', badgeColor: '#0891b2' , alts: TOP_3_RO},
  'city-pfas-owner_full':     { title: 'Waterdrop RO + Whole-House Pre-Filter', tagline: 'Full-home pre-filter + point-of-use RO. Maximum coverage.', why: 'Pair a whole-house sediment filter at entry with a dedicated RO at the kitchen tap. Covers drinking, cooking, and ice.', cta: 'Get on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'MAXIMUM PROTECTION', badgeColor: '#0066cc' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-lead-renter':         { title: 'Waterdrop Pitcher — Lead Certified', tagline: 'NSF 53 certified for lead reduction. Works anywhere.', why: 'Lead enters through old building pipes. A certified pitcher gives you immediate protection — no installation required.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_pitcher, badge: 'LEAD CERTIFIED', badgeColor: '#d97706' , alts: TOP_3_PITCHER},
  'city-lead-owner_simple':   { title: 'Waterdrop Under-Sink Filter', tagline: 'Removes 99.9% of lead. Quick install. No tank.', why: 'Homes built before 1986 likely have lead solder or pipes. An under-sink filter gives you certified point-of-use protection.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'LEAD CERTIFIED', badgeColor: '#d97706' , alts: TOP_3_RO},
  'city-lead-owner_full':     { title: 'Whole-House + Under-Sink RO', tagline: 'Protect every tap. Full lead removal from entry to glass.', why: 'If your home has aging pipes throughout, a whole-house pre-filter plus a dedicated kitchen RO is the complete solution.', cta: 'Under-Sink on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#7c3aed' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-taste-renter':        { title: 'Waterdrop Pitcher Filter', tagline: 'Removes chlorine, chloramines, VOCs. Better taste instantly.', why: 'Chlorine is what makes city water taste like a pool. Carbon filtration removes it completely — zero installation needed.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_pitcher, badge: 'CHLORINE REMOVAL', badgeColor: '#059669' , alts: TOP_3_PITCHER},
  'city-taste-owner_simple':  { title: 'Waterdrop Under-Sink Filter', tagline: 'Crystal clear, great-tasting water from your tap.', why: 'Under-sink carbon block filtration eliminates chlorine taste and odor at the source. You will notice the difference on day one.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'BEST TASTE', badgeColor: '#059669' , alts: TOP_3_RO},
  'city-taste-owner_full':    { title: 'Whole-House Carbon Filter', tagline: 'Every tap filtered. Better showers, laundry, and drinking water.', why: 'A whole-house carbon filter removes chlorine from all water entering your home — better for your skin, hair, and every glass.', cta: 'See on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'WHOLE HOME', badgeColor: '#059669' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-general-renter':      { title: 'Waterdrop Pitcher — Multi-Stage', tagline: '7-stage filtration. Removes 200+ contaminants. No tools.', why: 'For renters who want comprehensive protection without installation, a multi-stage pitcher is your best starting point.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_pitcher, badge: 'ALL-IN-ONE', badgeColor: '#94a3b8' , alts: TOP_3_PITCHER},
  'city-general-owner_simple':{ title: 'Waterdrop Under-Sink RO', tagline: 'Removes 1000+ contaminants. Most complete filter available.', why: 'Reverse osmosis handles everything — PFAS, lead, nitrates, arsenic, chlorine, and more. Gold standard for home filtration.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_undersink, badge: 'MOST COMPLETE', badgeColor: '#94a3b8' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'city-general-owner_full':  { title: 'Whole-House + Under-Sink RO', tagline: 'Total home protection. Every drop filtered twice.', why: 'Whole-house sediment/carbon at entry plus a dedicated RO at the kitchen sink. The most comprehensive setup available.', cta: 'Under-Sink on Waterdrop', cta2: 'Whole House on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_whole_house, badge: 'TOTAL PROTECTION', badgeColor: '#0f172a' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_CITY },
  'well-pfas-renter':         { title: 'Waterdrop Well Water Filter', tagline: 'Certified for well PFAS and iron removal. No installation.', why: 'Well PFAS contamination is common near agriculture and industry. A certified filter removes it wherever you are.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL CERTIFIED', badgeColor: '#166534' , alts: TOP_3_RO},
  'well-pfas-owner_simple':   { title: 'Waterdrop Well Water RO', tagline: 'Handles iron, hardness, PFAS, and bacteria. Built for wells.', why: 'Well water needs filters rated for higher sediment and biological contamination in addition to PFAS. This handles all of it.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + PFAS', badgeColor: '#166534' , alts: TOP_3_RO},
  'well-pfas-owner_full':     { title: 'Whole-House Well System + RO', tagline: 'Iron filter + softener + RO. Complete well protection.', why: 'Full protection for well homeowners means treating at entry (iron, sediment, bacteria) and again at the tap (PFAS, nitrates).', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'MAXIMUM WELL', badgeColor: '#14532d' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-lead-renter':         { title: 'Waterdrop Well Water Pitcher', tagline: 'NSF 53 certified. Removes lead from well water. Portable.', why: 'Lead can leach into well water from aging pipes or natural deposits. A certified pitcher protects you with no plumbing work.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_well, badge: 'WELL + LEAD', badgeColor: '#92400e' , alts: TOP_3_WELL},
  'well-lead-owner_simple':   { title: 'Waterdrop Well Water RO', tagline: 'Removes lead, iron, manganese, and heavy metals.', why: 'Well water lead often comes from natural deposits or old pump hardware. An RO system handles it at the tap.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL + LEAD', badgeColor: '#92400e' , alts: TOP_3_RO},
  'well-lead-owner_full':     { title: 'Whole-House Well + RO System', tagline: 'Iron filtration + lead removal at every tap.', why: 'For full protection on well water, pair entry-level iron and sediment filtration with a dedicated kitchen RO.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL HOME', badgeColor: '#78350f' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-taste-renter':        { title: 'Waterdrop Well Water Pitcher', tagline: 'Removes sulfur, iron taste, and sediment. No installation.', why: 'Well water taste issues usually come from iron, sulfur, or sediment. A well-certified pitcher fixes it instantly.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46' , alts: TOP_3_WELL},
  'well-taste-owner_simple':  { title: 'Waterdrop Well Water RO', tagline: 'Eliminates iron, sulfur, hardness, and taste issues.', why: 'An RO system for well water removes the root causes of taste and odor problems — not just masking them.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL TASTE', badgeColor: '#065f46' , alts: TOP_3_RO},
  'well-taste-owner_full':    { title: 'Whole-House Well Filter', tagline: 'Softener + carbon + sediment. Every tap improved.', why: 'A whole-house well filter system addresses hardness, iron, and taste at the source before water reaches any fixture.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WHOLE WELL', badgeColor: '#064e3b' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-general-renter':      { title: 'Waterdrop Well Water Pitcher', tagline: 'Multi-stage well filtration. No installation required.', why: 'Well water has unique contaminant profiles. A well-certified multi-stage pitcher covers bacteria, metals, and sediment.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop_pitcher, link2: LINKS.amazon_well, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f' , alts: TOP_3_WELL},
  'well-general-owner_simple':{ title: 'Waterdrop Well Water RO', tagline: 'Built for well water. Removes iron, bacteria, PFAS, and more.', why: 'Private wells need specialized filtration. This system is rated for the full range of well water contaminants.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'WELL COMPLETE', badgeColor: '#1e3a5f' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
  'well-general-owner_full':  { title: 'Whole-House Well System + RO', tagline: 'Complete protection from wellhead to tap.', why: 'The gold standard for well homeowners. Entry-level whole-house filtration plus a dedicated kitchen RO handles everything.', cta: 'Get on Waterdrop', cta2: 'See on Amazon', link: LINKS.waterdrop, link2: LINKS.amazon_well, badge: 'TOTAL WELL', badgeColor: '#0f172a' , alts: TOP_3_RO, altsWholeHouse: TOP_3_WHOLE_HOUSE_WELL },
};

function getRec(answers: Record<string, string>): Rec {
  const key = `${answers.source}-${answers.concern}-${answers.situation}`;
  return RECS[key] || RECS['city-general-owner_simple'];
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
      setTimeout(() => setStep(step + 1), 250);
    } else {
      setTimeout(() => {
        setDone(true);
        trackEvent('quiz_complete', { source: newAnswers.source, concern: newAnswers.concern, situation: newAnswers.situation });
      }, 250);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const handleAffiliateClick = (destination: string, productTitle: string) => {
    trackEvent('affiliate_click', { destination, product: productTitle, page: 'quiz' });
  };

  const renderAltRows = (alts: AltPick[], keyPrefix: string) =>
    alts.map((alt, i) => {
      const showDirect = showBuyDirectForBrand(alt.brand);
      const amazonPrimary = !showDirect;
      return (
        <div
          key={`${keyPrefix}-${i}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            padding: '12px 14px',
            background: i === 0 ? 'rgba(8,145,178,0.08)' : 'rgba(255,255,255,0.02)',
            borderRadius: 10,
            border: i === 0 ? '1px solid rgba(8,145,178,0.3)' : '1px solid #0f2336',
          }}
        >
          <div style={{ flex: 1, minWidth: 160 }}>
            {alt.categoryLabel ? (
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: '#22d3ee', marginBottom: 4 }}>
                {alt.categoryLabel}
              </div>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8' }}>#{i + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{alt.product}</span>
              {alt.badge ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 1,
                    background: i === 0 ? '#0891b2' : '#1e3a5f',
                    color: '#fff',
                    padding: '2px 7px',
                    borderRadius: 4,
                  }}
                >
                  {alt.badge}
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {alt.brand} · {alt.price}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>{alt.reason}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
            {showDirect ? (
              <a
                href={alt.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAffiliateClick('direct', alt.product)}
                style={{
                  display: 'block',
                  padding: '7px 14px',
                  background: i === 0 ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                  color: i === 0 ? '#fff' : '#94a3b8',
                  textDecoration: 'none',
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  border: i === 0 ? 'none' : '1px solid #1a3a5c',
                }}
              >
                Buy Direct →
              </a>
            ) : null}
            <a
              href={alt.amazon}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAffiliateClick('amazon', alt.product)}
              style={{
                display: 'block',
                padding: '7px 14px',
                background: amazonPrimary ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : '#0d2240',
                color: amazonPrimary ? '#fff' : '#94a3b8',
                textDecoration: 'none',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: amazonPrimary ? 700 : 600,
                textAlign: 'center',
                border: amazonPrimary ? 'none' : '1px solid #1a3a5c',
                whiteSpace: 'nowrap',
              }}
            >
              Amazon →
            </a>
          </div>
        </div>
      );
    });

  return (
    <div style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 8 }}>FILTER FINDER</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: '0 0 8px' }}>Find Your Perfect Water Filter</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>3 quick questions. Personalized recommendation based on your water source and concerns.</p>
        </div>

        {!done ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px' }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12, cursor: 'pointer', textAlign: 'left', color: '#e2e8f0', transition: 'all 0.15s', fontSize: 15, fontWeight: 600 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0891b2'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2a40'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a3a5c'; (e.currentTarget as HTMLButtonElement).style.background = '#0d2240'; }}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', marginTop: 20, padding: 0 }}>← Back</button>
            )}
          </div>
        ) : rec ? (
          <div style={{ background: '#071828', border: '1px solid #1a3a5c', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'inline-block', background: rec.badgeColor, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '4px 12px', borderRadius: 4, marginBottom: 16 }}>{rec.badge}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 8 }}>OUR RECOMMENDATION</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>{rec.title}</h2>
            <p style={{ fontSize: 15, color: '#0891b2', fontStyle: 'italic', marginBottom: 20 }}>{rec.tagline}</p>
            <div style={{ background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, padding: '16px 18px', marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{rec.why}</p>
            </div>
            {rec.alts ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 4 }}>
                  {rec.altsWholeHouse?.length ? 'TOP 3 — DRINKING & COOKING (UNDER-SINK / RO)' : 'TOP 3 OPTIONS'}
                </div>
                {renderAltRows(rec.alts, 'pou')}
                {rec.altsWholeHouse?.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 4 }}>
                      TOP 3 — WHOLE HOUSE (POINT OF ENTRY)
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', lineHeight: 1.5 }}>
                      Treats water where it enters your home (showers, laundry, and pipes). Pair with the under-sink / RO picks above for the cleanest drinking water.
                    </p>
                    {renderAltRows(rec.altsWholeHouse, 'poe')}
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <a href={rec.link} target="_blank" rel="noopener noreferrer" onClick={() => handleAffiliateClick('waterdrop', rec.title)} style={{ display: 'block', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', textDecoration: 'none', textAlign: 'center', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700 }}>{rec.cta} →</a>
                <a href={rec.link2} target="_blank" rel="noopener noreferrer" onClick={() => handleAffiliateClick('amazon', rec.title)} style={{ display: 'block', background: '#0d2240', color: '#94a3b8', textDecoration: 'none', textAlign: 'center', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1px solid #1a3a5c' }}>{rec.cta2} →</a>
              </div>
            )}
            <div
              style={{
                marginTop: 4,
                marginBottom: 20,
                paddingTop: 22,
                borderTop: '1px solid #0f2336',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 2, marginBottom: 2 }}>
                TOP 5 ON AMAZON — BY TYPE
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.55 }}>
                Whole-house, under-sink RO, countertop RO, pitcher, and non-RO under-sink — one standout each, all with Amazon listing links (associate tag applied).
              </p>
              {renderAltRows(TOP_5_AMAZON_DRINKING, 'amz5')}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
              {Object.entries(answers).map(([k, v]) => (
                <span key={k} style={{ background: '#0d2240', border: '1px solid #1a3a5c', color: '#94a3b8', fontSize: 11, letterSpacing: 1, padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' as const }}>{v.replace('_', ' ')}</span>
              ))}
            </div>
            <button onClick={restart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#94a3b8', padding: 0, textDecoration: 'underline' }}>Start over</button>
          </div>
        ) : null}

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#1e3a5f' }}>
          Data sourced from EPA SDWIS, UCMR5 PFAS monitoring, and EWG · <Link href="/" style={{ color: '#1e3a5f' }}>WaterCheckup.com</Link>
        </div>
      </div>
    </div>
  );
}
