'use client';

import { useState, useEffect, useRef, useMemo, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { HOME_HERO_ALT, HOME_HERO_IMAGE } from '@/lib/unsplash-images';
import { SiteHeader } from './components/SiteHeader';
import { HomeVisualShowcase } from './components/HomeVisualShowcase';
import { SIMPLELAB_HOME_URL, SIMPLELAB_WELL_TESTS_URL } from '@/lib/simplelab-links';
import { CITIES } from '@/app/water/[city]/cities-data';
import {
  SITE_HERO_POSITIONING,
  SITE_HERO_TAGLINE,
  SITE_HERO_TRUST_BANNER,
  SITE_WATER_SYSTEMS_LABEL,
  VIEW_ALL_WATER_SYSTEMS_LINK,
  WHY_WATERCHECKUP_CARDS,
} from '@/lib/site-stats';

const FilterVsBottleChart = dynamic(() => import('./components/FilterVsBottleChart'), {
  ssr: false,
  loading: () => <div style={{ height: 220, background: 'rgba(11,30,54,0.45)', borderRadius: 8 }} />,
});

const TAG = 'watercheck20-20';

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWaterData(zip: string) {
  const res = await fetch(`/api/water?zip=${zip}`);
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || `API error ${res.status}`) as Error & { waterExtra?: Record<string, unknown> };
    err.waterExtra = data;
    throw err;
  }
  return data;
}

async function fetchEwgData(zip: string) {
  try {
    const res = await fetch(`/api/ewg?zip=${zip}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function findInstallers(zip: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1400,
      system: 'You are a local business search API. Respond ONLY with a raw JSON array. No markdown.',
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: `Search for water treatment and filtration installation companies near ZIP ${zip} in the United States. Include plumbers who install under-sink RO systems, water softener installers, and water treatment specialists. Return ONLY a JSON array of 4-5 real companies: [{"name":"Company","address":"123 Main St, City, ST","phone":"(555) 555-5555","rating":4.8,"reviews":120,"cert":"WQA Certified","specialty":"RO & Whole-House Filtration","website":"https://example.com","distance":"2.4 mi","diy_help":true}]. ONLY the JSON array.` }]
    })
  });
  const d = await res.json();
  const text = (d.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  const s = clean.indexOf('['), e = clean.lastIndexOf(']');
  if (s === -1 || e === -1) return [];
  return JSON.parse(clean.slice(s, e + 1));
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVING SITUATIONS
// ─────────────────────────────────────────────────────────────────────────────
const SITUATIONS = [
  { id: 'homeowner', icon: '🏠', label: 'Homeowner',         desc: 'You own your home and want full protection at every tap, shower, and appliance.',        tagline: 'Full-home water protection',    cats: ['undersink','undersink-filter','countertop','countertop-filter','distiller','whole','shower'] },
  { id: 'renter',    icon: '🏢', label: 'Renter / Apartment',desc: 'You rent — no plumbing changes allowed. Clean water without drilling a single hole.', tagline: 'No installation required',      cats: ['countertop','countertop-filter','pitcher','shower'] },
  { id: 'rv',        icon: '🚐', label: 'RV / Van Life',     desc: 'On the road and need reliable filtration wherever you park or hook up.',                 tagline: 'Portable filtration anywhere',  cats: ['countertop','countertop-filter','pitcher','shower'] },
  { id: 'dorm',      icon: '🎓', label: 'College Dorm',      desc: 'Small space, shared facilities, tight budget — simple, affordable, plug-in-and-pour.',  tagline: 'Simple & affordable',           cats: ['countertop','countertop-filter','pitcher','shower'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// WATER HARDNESS BY STATE — USGS groundwater data
// ─────────────────────────────────────────────────────────────────────────────
const HARDNESS: Record<string, 'very_hard' | 'hard' | 'moderate' | 'soft'> = {
  AZ:'very_hard', NV:'very_hard', UT:'very_hard', CO:'very_hard',
  TX:'very_hard', FL:'very_hard', KS:'very_hard', NE:'very_hard',
  ND:'very_hard', SD:'very_hard',
  CA:'hard', NM:'hard', IL:'hard', IN:'hard', OH:'hard', MO:'hard',
  IA:'hard', MI:'hard', WI:'hard', MN:'hard', OK:'hard', AR:'hard',
  PA:'hard', VA:'hard', WV:'hard', MD:'hard', WY:'hard', DE:'hard', NJ:'hard',
  NC:'moderate', SC:'moderate', GA:'moderate', TN:'moderate', KY:'moderate',
  AL:'moderate', MS:'moderate', LA:'moderate', NY:'moderate', MT:'moderate', ID:'moderate',
  WA:'soft', OR:'soft', ME:'soft', VT:'soft', NH:'soft',
  MA:'soft', RI:'soft', CT:'soft', HI:'soft', AK:'soft',
};

// ─────────────────────────────────────────────────────────────────────────────
// ACIDIC WELL WATER BY STATE — USGS / EPA groundwater pH data
// Granite/crystalline bedrock (NE), sandy/low-buffering soils (SE), volcanic (PNW)
// ─────────────────────────────────────────────────────────────────────────────
const ACIDIC_STATES = new Set([
  // New England — granite bedrock, naturally low pH (5.5–6.5 common)
  'ME','NH','VT','MA','CT','RI',
  // Mid-Atlantic — old crystalline rock, corrosive to copper pipes
  'NY','NJ','PA','MD','WV','VA','DE',
  // Southeast — sandy soils, poor mineral buffering, high rainfall
  'NC','SC','GA','AL','MS','TN',
  // Pacific Northwest — volcanic/acidic soils
  'WA','OR',
]);

// ─────────────────────────────────────────────────────────────────────────────
// FULL PRODUCT CATALOG — 38 products, 13 categories, quick-change filters only
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS: any[] = [
  // ── UNDER-SINK RO — quick-change only ─────────────────────────────────────
  { id:3, cat:'undersink', catLabel:'Under-Sink RO', name:'Waterdrop G3P800', brand:'Waterdrop', price:849, filterCostPerYear:170, rating:4.8, reviews:9800, gpd:800, stages:8, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 372'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Fluoride','Chlorine'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['No tank','800 GPD','Smart LED faucet'], diyDiff:'Medium', situations:['homeowner','family'], tankless:true, quickChange:true, expertPick:true, expertReason:'Twist-off sealed cartridges — no mess, no tools. Very fast 800 GPD flow among tankless RO units. Removes 99%+ PFAS and lead; often scores well in independent lab summaries.', img:'https://www.waterdropfilter.com/cdn/shop/files/ui-wd-g3p800-w-mz-new_1_3dc0d1bd-aa82-4ceb-bd2d-7a94fcb68b7c.png?v=1734414287&width=1920', amazon:`https://www.amazon.com/dp/B0987FCQQW?tag=${TAG}` },
  { id:5, cat:'undersink', catLabel:'Under-Sink RO', name:'Aquasana SmartFlow RO', brand:'Aquasana', price:449, filterCostPerYear:145, rating:4.7, reviews:2100, gpd:50, stages:5, cert:['WQA Gold Seal','NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 401'], certColor:'#d97706', removes:['90+ contaminants','Fluoride 90%','Lead >99%','Microplastics','PFAS'], bestFor:['PFAS','Lead','Fluoride','Microplastics'], pros:['Most certified','90 contaminants'], diyDiff:'Medium', situations:['homeowner','family'], quickChange:true, expertPick:true, expertReason:'Broad third-party listings (WQA Gold Seal plus NSF/ANSI 42, 53, 58, and 401). Removes microplastics and 90+ contaminants. Strong choice if you want wide certification coverage for PFAS and more.', img:'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dw8d7d3aab/images/large/AQ-SFRO2-CHR.png?sw=400&sh=400', amazon:`https://www.amazon.com/dp/B0CHZ8VQBB?tag=${TAG}` },
  { id:26, cat:'undersink', catLabel:'Under-Sink RO', name:'Waterdrop D6', brand:'Waterdrop', price:399, filterCostPerYear:140, rating:4.7, reviews:3200, gpd:600, stages:7, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Arsenic','Fluoride','TDS'], bestFor:['PFAS','Lead','Arsenic','Fluoride'], pros:['600 GPD fast fill','Quick-change twist-off','No tank needed'], diyDiff:'Medium', situations:['homeowner','family'], tankless:true, quickChange:true, img:'https://www.waterdropfilter.com/cdn/shop/files/wd-product-contrast-wd-d6-b-img1.png?v=1762268602', amazon:`https://www.amazon.com/dp/B08746G2XX?tag=${TAG}` },
  { id:27, cat:'undersink', catLabel:'Under-Sink RO', name:'Frizzlife PD1000-TAM4', brand:'Frizzlife', price:799, filterCostPerYear:160, rating:4.8, reviews:890, gpd:1000, stages:5, cert:['NSF/ANSI 58','NSF/ANSI 372'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Arsenic','Chromium-6','TDS'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['1000 GPD fastest fill','Quick-change filters','Tankless compact'], diyDiff:'Medium', situations:['homeowner','family'], tankless:true, quickChange:true, img:'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/PD1000_81efd50c-480c-4ee6-b809-c2312525621a.png?v=1757987339', amazon:`https://www.amazon.com/dp/B0BK8ZRY2K?tag=${TAG}` },
  { id:28, cat:'undersink', catLabel:'Under-Sink RO', name:'AquaTru Under-Sink RO', brand:'AquaTru', price:375, filterCostPerYear:120, rating:4.6, reviews:1100, gpd:50, stages:4, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Nitrates','Chromium-6','Fluoride'], bestFor:['PFAS','Lead','Nitrate','Fluoride'], pros:['Quick-change filters','Under-sink compact','No tank'], diyDiff:'Medium', situations:['homeowner','family'], quickChange:true, img:'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT-PDP-2000x2000-Undersink-1-2.webp?v=1758041969', amazon:`https://www.amazon.com/dp/B0GGTSFZMY?tag=${TAG}` },

  // ── UNDER-SINK FILTER (non-RO) — quick-change ───────────────────────────────
  { id:23, cat:'undersink-filter', catLabel:'Under-Sink Filter', name:'Frizzlife SK99', brand:'Frizzlife', price:126, filterCostPerYear:60, rating:4.7, reviews:4200, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 401'], certColor:'#22d3ee', removes:['Lead >99.9%','Chlorine >99%','PFAS','Chloramine','Cysts'], bestFor:['Lead','Chlorine','Chloramine','Cysts'], pros:['Quick-change twist-off','No tank needed','Under-sink compact'], diyDiff:'Easy', situations:['homeowner','renter','family'], quickChange:true, expertPick:true, expertReason:'Dual quick-change filter cartridges — no tools, no mess. Removes lead at 99.9% and PFAS without the cost of a full RO system. Strong value among non-RO under-sink options.', img:'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/SK99_85cce087-8e10-4b22-8462-605ed3b2ae72.png?v=1757989183', amazon:`https://www.amazon.com/dp/B084HW5BMT?tag=${TAG}` },
  { id:24, cat:'undersink-filter', catLabel:'Under-Sink Filter', name:'Frizzlife MK99', brand:'Frizzlife', price:59, filterCostPerYear:45, rating:4.6, reviews:6800, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead >99%','Chlorine >99%','Chloramine','Cysts','Heavy metals'], bestFor:['Lead','Chlorine','Chloramine','Cysts'], pros:['Best-value quick-change','Under 2 min install','Compact design'], diyDiff:'Easy', situations:['homeowner','renter','family'], quickChange:true, img:'https://cdn.shopify.com/s/files/1/0159/8429/5990/files/MK99-B.png?v=1757994240', amazon:`https://www.amazon.com/dp/B07ZY9RVN2?tag=${TAG}` },
  { id:25, cat:'undersink-filter', catLabel:'Under-Sink Filter', name:'Epic Smart Shield', brand:'Epic Water Filters', price:129, filterCostPerYear:70, rating:4.6, reviews:1400, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 401'], certColor:'#22d3ee', removes:['Lead >99.9%','PFAS >99%','Chlorine','Arsenic','Microplastics'], bestFor:['PFAS','Lead','Arsenic','Microplastics'], pros:['PFAS removal without RO','Quick-change filter','USA made media'], diyDiff:'Easy', situations:['homeowner','renter','family'], quickChange:true, expertPick:true, expertReason:'Removes PFAS at 99%+ without a full RO system — uncommon for a non-RO filter. NSF/ANSI 401 certified for emerging contaminants on listings. Good option if you want PFAS coverage without full RO.', img:'https://www.epicwaterfilters.com/cdn/shop/files/Smartshieldmexicowhitebox.png?v=1767726801', amazon:`https://www.amazon.com/gp/product/B076S1W5QY?tag=${TAG}` },

  // ── COUNTERTOP RO — no installation needed ──────────────────────────────────
  { id:6, cat:'countertop', catLabel:'Countertop RO', name:'Waterdrop K19-S Countertop RO', brand:'Waterdrop', price:199, filterCostPerYear:110, rating:4.7, reviews:2100, gpd:200, stages:4, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Arsenic','1,000+ contaminants','TDS'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['Plug-in — no installation','170 oz tank','3:1 pure to drain'], diyDiff:'None', situations:['renter','rv','dorm','family'], quickChange:true, expertPick:true, expertReason:'No installation needed — just plug in. NSF 58 certified, removes PFAS, lead, arsenic, and 1,000+ contaminants. Perfect for renters. 170 oz tank, 3:1 pure to drain ratio.', img:'https://www.waterdropfilter.com/cdn/shop/files/ui-wd-k19-s-vis.png?v=1774504000', amazon:`https://www.amazon.com/dp/B0BHQRNGZ8?tag=${TAG}` },
  { id:31, cat:'countertop', catLabel:'Countertop RO', name:'AquaTru Classic', brand:'AquaTru', price:475, filterCostPerYear:130, rating:4.6, reviews:5200, gpd:50, stages:4, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 401'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Nitrates','Fluoride','Radium'], bestFor:['PFAS','Lead','Nitrate','Fluoride'], pros:['No installation required','Quick-change filters','NSF/ANSI 401 certified'], diyDiff:'None', situations:['renter','dorm','family'], quickChange:true, expertPick:true, expertReason:'Premium countertop RO certified to NSF/ANSI 42, 53, 58, and 401 — removes PFAS, nitrates, fluoride, and radium. No installation required, and quick-change filters swap in seconds. Best premium option for the kitchen counter.', img:'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT-PDP-2000x2000-Classic-1-1_bd723f43-efb1-4f23-b772-9352d7d7179b.webp?v=1758659574', amazon:`https://www.amazon.com/dp/B0CQS3HQ8F?tag=${TAG}` },

  // ── DISTILLERS — countertop ─────────────────────────────────────────────────
  { id:45, cat:'distiller', catLabel:'Countertop Distiller', name:'CO-Z 4L Brushed Stainless Distiller', brand:'CO-Z', price:119, filterCostPerYear:35, rating:4.5, reviews:8900, gpd:null, stages:2, cert:['Steam distillation','304 stainless boil chamber','Glass carafe (most kits)'], certColor:'#14b8a6', removes:['Heavy metals >99%','Fluoride','Nitrates','TDS','Bacteria','Cysts','Dissolved solids'], bestFor:['Fluoride','Nitrates','Lead','TDS','Arsenic','PFAS'], pros:['Excellent Amazon value','Auto shut-off','750W — common 4L design'], diyDiff:'None', situations:['homeowner','family'], expertPick:true, expertReason:'CO-Z’s 4L stainless countertop distiller is one of Amazon’s best-selling alternatives to premium brands — strong ratings and review count for the price. Same distillation physics as units costing 2×: boil, condense, collect; descale often and replace carbon sachets on schedule.', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', amazon:`https://www.amazon.com/dp/B078GHJ921?tag=${TAG}` },

  // ── COUNTERTOP FILTER (non-RO) ───────────────────────────────────────────────
  { id:29, cat:'countertop-filter', catLabel:'Countertop Filter', name:'Epic Pure Pitcher', brand:'Epic Water Filters', price:50, filterCostPerYear:80, rating:4.7, reviews:2800, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 401'], certColor:'#22d3ee', removes:['Lead >99.9%','PFAS >99%','Arsenic >99%','Chromium-6','Microplastics'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['Removes PFAS — rare for pitcher','No installation','Best-value pitcher'], diyDiff:'None', situations:['renter','dorm','family','travel'], expertPick:true, expertReason:'Certified PFAS reduction claims at 99%+ on listings — strong for a countertop pitcher. Also targets lead, arsenic, and microplastics; verify the cartridge listing matches what you buy.', img:'https://www.epicwaterfilters.com/cdn/shop/files/Purehero1080.png?v=1773943609', amazon:`https://www.amazon.com/dp/B08PPLVFBN?tag=${TAG}` },

  // ── PITCHER FILTERS ─────────────────────────────────────────────────────────
  { id:9, cat:'pitcher', catLabel:'Pitcher Filter', name:'Clearly Filtered 3.5L Pitcher', brand:'Clearly Filtered', price:90, filterCostPerYear:140, rating:4.7, reviews:8200, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 244','NSF/ANSI 401','NSF/ANSI P473'], certColor:'#22d3ee', removes:['PFAS >99.9%','Lead >99.5%','Arsenic >99.4%','Chromium-6','365+ contaminants'], bestFor:['PFAS','Lead','Arsenic','Chromium-6','Uranium'], pros:['Removes PFAS — rare for pitcher','365+ contaminants','Best-in-class pitcher'], diyDiff:'None', situations:['renter','dorm','family','travel'], expertPick:true, expertReason:'Strong published reduction claims for PFAS on certified listings, plus broad contaminant coverage. Popular with reviewers for lead and arsenic. A solid pick for renters and dorms if listings match your needs.', img:'https://cdn.shopify.com/s/files/1/1011/0318/files/NewPitcher_PDP_1_33692813-0a8f-4ee9-9f9c-4de3c5a6e397.png?v=1724107995', amazon:`https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}` },
  { id:10, cat:'pitcher', catLabel:'Pitcher Filter', name:'ZeroWater 10-Cup Pitcher', brand:'ZeroWater', price:40, filterCostPerYear:100, rating:4.5, reviews:31000, gpd:null, stages:5, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 100%','Chromium 100%','TDS to 0','Mercury','Arsenic'], bestFor:['Lead','Arsenic','Chromium-6','Uranium'], pros:['Removes TDS to 0','Includes TDS meter','Budget-friendly'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://shop.culligan.com/cdn/shop/files/UMC_10C_White_Zoom_IAPMO.jpg?v=1769531157', amazon:`https://www.amazon.com/dp/B0DWTTYTQN?tag=${TAG}` },
  { id:11, cat:'pitcher', catLabel:'Pitcher Filter', name:'PUR PLUS 11-Cup Pitcher', brand:'PUR', price:42, filterCostPerYear:110, rating:4.5, reviews:22000, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 100%','Arsenic 100%','Uranium 100%','PFNA 96%'], bestFor:['Lead','Arsenic','Uranium','Chromium-6'], pros:['No install','Portable','Budget-friendly'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://www.pur.com/wp-content/uploads/product_ppt111w_pour_digital.png', amazon:`https://www.amazon.com/dp/B09LKTLVNR?tag=${TAG}` },
  { id:12, cat:'pitcher', catLabel:'Pitcher Filter', name:'Brita Large 10-Cup Everyday', brand:'Brita', price:28, filterCostPerYear:65, rating:4.6, reviews:62000, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Chlorine taste/odor','Mercury','Cadmium','Copper'], bestFor:['Chlorine','Copper','Mercury'], pros:['Most popular pitcher','Budget-friendly','Widely available'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://images.ctfassets.net/bugnyha6so6z/acBjvgL2C42mltLEu67e3/21192a304f339de2a3a278b90ed318e7/PDP_hero_-_denali_-_white_-_original_-_desktop_1x.webp', amazon:`https://www.amazon.com/dp/B00008WOPI?tag=${TAG}` },

  // ── FAUCET MOUNT ────────────────────────────────────────────────────────────
  { id:13, cat:'faucet', catLabel:'Faucet Mount', name:'PUR PLUS Faucet Mount FM2000B', brand:'PUR', price:35, filterCostPerYear:80, rating:4.5, reviews:28000, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 99%','Arsenic 96%','Mercury','Chlorine','Microbial cysts'], bestFor:['Lead','Arsenic','Mercury','Chlorine'], pros:['Attaches to faucet','No permanent install','One-click on/off'], diyDiff:'Easy', situations:['renter','family','dorm'], img:'https://www.pur.com/wp-content/uploads/pfm200ba_product_on.png', amazon:`https://www.amazon.com/dp/B009V9K6BY?tag=${TAG}` },
  { id:14, cat:'faucet', catLabel:'Faucet Mount', name:'Brita Complete Faucet Filtration', brand:'Brita', price:30, filterCostPerYear:70, rating:4.4, reviews:19000, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead','Asbestos','Benzene','Chlorine','Chloramine'], bestFor:['Lead','Chlorine','Chloramine','Asbestos'], pros:['Easy faucet attachment','3-way diverter','No tools needed'], diyDiff:'Easy', situations:['renter','family'], img:'https://images.ctfassets.net/bugnyha6so6z/7J48JJcS8QKR5EDvlOXyvF/911c777794cec4fd4e823ab8c66f048a/PCP_-_Elite_Faucet_-_Silver_-_1_filter_1x.webp', amazon:`https://www.amazon.com/dp/B00006IV0P?tag=${TAG}` },

  // ── WHOLE HOUSE ─────────────────────────────────────────────────────────────
  { id:18, cat:'whole', catLabel:'Whole-House', name:'Pelican PC600 Whole-House', brand:'Pelican Water', price:899, filterCostPerYear:120, rating:4.7, reviews:1800, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 61','WQA Gold Seal'], certColor:'#d97706', removes:['Chlorine >97%','Chloramine','THMs','VOCs','Sediment'], bestFor:['Chloramine','Chloroform','HAAs','VOCs'], pros:['Whole house','No salt','6yr filter life'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, expertPick:true, expertReason:'Strong whole-home carbon option with a long advertised filter life and WQA Gold Seal on listings. Compare install scope and ongoing costs to other systems for your home size.', img:'https://cdn.shopify.com/s/files/1/0509/5918/8143/files/Gemini_Generated_Image_mf212bmf212bmf21.png?v=1757187780', amazon:`https://www.amazon.com/dp/B001JM5OQ0?tag=${TAG}` },
  { id:19, cat:'whole', catLabel:'Whole-House', name:'iSpring WGB32B Whole House 3-Stage', brand:'iSpring', price:420, filterCostPerYear:70, rating:4.7, reviews:2532, gpd:null, stages:3, cert:['NSF/ANSI 42'], certColor:'#22d3ee', removes:['Sediment','Chlorine','Chloramine','VOCs','Iron'], bestFor:['Chlorine','Chloramine','Sediment','Iron'], pros:['Most affordable whole-house','DIY-friendly','Large flow rate'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, img:'https://www.ispringwatersystems.com/wp-content/uploads/2023/06/WGB32B_main_jpg-103980-2400x2400-2.jpg', amazon:`https://www.amazon.com/gp/product/B008GNRMYK?tag=${TAG}` },
  { id:32, cat:'whole', catLabel:'Whole-House', name:'Aquasana Rhino EQ-1000', brand:'Aquasana', price:999, filterCostPerYear:100, rating:4.7, reviews:3400, gpd:null, stages:4, cert:['NSF/ANSI 42','NSF/ANSI 61','WQA Gold Seal'], certColor:'#d97706', removes:['Chlorine >99%','Chloramine','THMs','VOCs','PFAS','Sediment'], bestFor:['Chloramine','PFAS','THMs','VOCs'], pros:['10-year/1M gallon life','PFAS reduction','WQA certified'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, expertPick:true, expertReason:'Long advertised filter life and WQA Gold Seal on listings. Reduces PFAS and chloramine at every tap and shower in the home — confirm flow and capacity for your household.', img:'https://www.aquasana.com/dw/image/v2/BDTV_PRD/on/demandware.static/-/Sites-aquasana-master-catalog/default/dwe94bfae0/images/large/WH-1000.png?sw=800&sh=800', amazon:`https://www.amazon.com/dp/B00XAJJVHQ?tag=${TAG}` },
  { id:33, cat:'whole', catLabel:'Whole-House', name:'Express Water WH300SCKS', brand:'Express Water', price:548, filterCostPerYear:90, rating:4.5, reviews:2900, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 61'], certColor:'#22d3ee', removes:['Sediment','Chlorine','Chloramine','Heavy metals','Scale'], bestFor:['Chlorine','Chloramine','Scale','Sediment'], pros:['Includes pressure gauges','Easy DIY install','6-month filters'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, img:'https://www.expresswater.com/cdn/shop/files/WH300SCKS-01_1292x.jpg?v=1771889437', amazon:`https://www.amazon.com/dp/B01LFMTYBM?tag=${TAG}` },
  { id:34, cat:'whole', catLabel:'Whole-House', name:'Waterdrop WHF3T-PG', brand:'Waterdrop', price:370, filterCostPerYear:80, rating:4.6, reviews:1800, gpd:null, stages:3, cert:['NSF/ANSI 42'], certColor:'#22d3ee', removes:['Sediment','Chlorine','Chloramine','VOCs','Herbicides'], bestFor:['Chlorine','Chloramine','Sediment','VOCs'], pros:['Transparent housing','Pressure gauge included','1-year filters'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, img:'https://www.waterdropfilter.com/cdn/shop/files/ui-WHF3T-PG.png?v=1762269824', amazon:`https://www.amazon.com/dp/B0FYCRPXLZ?tag=${TAG}` },

  // ── SHOWER FILTERS ──────────────────────────────────────────────────────────
  { id:20, cat:'shower', catLabel:'Shower Filter', name:'AquaBliss High Output SF100', brand:'AquaBliss', price:35, filterCostPerYear:35, rating:4.4, reviews:42000, gpd:null, stages:5, cert:['KDF/GAC Certified'], certColor:'#94a3b8', removes:['Chlorine','Heavy metals','Scale','Bacteria'], bestFor:['Chlorine','Scale','Bacteria'], pros:['Reduces skin & hair dryness','Easy install in minutes','Universal fit'], diyDiff:'Easy', situations:['homeowner','renter','rv','dorm'], expertPick:true, expertReason:'Huge review count on Amazon. Installs in minutes — screws onto many shower arms. Reduces chlorine that can dry skin and hair; good entry-level value — verify fit for your shower hardware.', img:'https://cdn.shopify.com/s/files/1/1325/7307/products/SF100.jpg?v=1765436914', amazon:`https://www.amazon.com/dp/B01MUBU0YC?tag=${TAG}` },
  { id:36, cat:'shower', catLabel:'Shower Filter', name:'AquaTru Shower Filter', brand:'AquaTru', price:149, filterCostPerYear:90, rating:4.6, reviews:890, gpd:null, stages:3, cert:['NSF/ANSI 177'], certColor:'#d97706', removes:['Chlorine >98%','Chloramine','Heavy metals','Scale','VOCs'], bestFor:['Chlorine','Chloramine','Heavy metals'], pros:['Highest chlorine reduction','Quick-change cartridge','Premium finish'], diyDiff:'Easy', situations:['homeowner','renter','rv','dorm'], quickChange:true, expertPick:true, expertReason:'Claims strong chlorine reduction on listings (often around 98%+) with NSF/ANSI 177 on applicable models. Quick-change cartridge; confirm the listing matches the SKU you order.', img:'https://cdn.shopify.com/s/files/1/0758/4550/1142/files/AQT_-_Shower_-_PDP_01_-_Nickel.jpg?v=1773655036', amazon:`https://www.amazon.com/dp/B0FLHFTGYD?tag=${TAG}` },

  // ── WELL WATER SPECIFIC ──────────────────────────────────────────────────────
  { id:37, cat:'well-uv', catLabel:'UV Sterilizer', name:'HQUA-OWS-12 UV Sterilizer', brand:'HQUA', price:149, filterCostPerYear:45, rating:4.5, reviews:2800, gpd:null, stages:1, cert:['NSF/ANSI 55 Class B'], certColor:'#7c3aed', removes:['Bacteria 99.99%','Viruses 99.99%','Cysts','E. Coli','Giardia'], bestFor:['Bacteria','Coliform','Viruses','Cysts'], pros:['No chemicals','12 GPM whole-house flow','Kills 99.99% pathogens'], diyDiff:'Medium', situations:['homeowner'], well:true, expertPick:true, expertReason:'UV sterilization is the gold standard for private well bacteria — no chemicals, no taste change, and eliminates viruses, bacteria, and cysts that filters alone can\'t stop.', img:'https://www.hquatech.com/wp-content/uploads/2025/08/OWS-12%E6%96%B0.jpg', amazon:`https://www.amazon.com/dp/B01N2YMU3O?tag=${TAG}` },
  { id:38, cat:'whole', catLabel:'Whole-House', name:'iSpring WCFM500K Iron & Sulfur (Well)', brand:'iSpring', price:2299, filterCostPerYear:0, rating:4.6, reviews:420, gpd:null, stages:1, cert:['WQA tested','Manufacturer specs'], certColor:'#22d3ee', removes:['Iron up to 12 ppm','Manganese','Hydrogen sulfide','Rotten-egg odor'], bestFor:['Iron','Manganese','Sulfur','Well water'], pros:['Whole-house iron/manganese/H₂S media','Long media life — minimal cartridge swaps','Common pro pick for well chemistry'], diyDiff:'Hard', situations:['homeowner'], well:true, wholeHouse:true, img:'https://123filter-com.b-cdn.net/ac/image/thumbnails/1b/d9/WCFM500K_png-114071-750x750.png', amazon:`https://www.amazon.com/gp/product/B08TMZYYQY?tag=${TAG}` },

  // ── WATER SOFTENERS ─────────────────────────────────────────────────────────
  { id:39, cat:'softener', catLabel:'Water Softener', name:'Fleck 5600SXT 48,000 Grain', brand:'Fleck', price:649, filterCostPerYear:40, rating:4.4, reviews:3200, gpd:null, stages:1, cert:['NSF/ANSI 44'], certColor:'#d97706', removes:['Hardness >99%','Scale','Calcium','Magnesium'], bestFor:['Hardness','Scale'], pros:['Most trusted salt softener brand','48,000 grain capacity','Digital metered valve'], diyDiff:'Hard', situations:['homeowner'], softener:true, wholeHouse:true, expertPick:true, expertReason:'Metered salt-based ion exchange is the standard for full hardness removal at every tap. Fleck 5600SXT valves are widely used by installers; size capacity to your household and water test.', img:'https://flecksystems.com/cdn/shop/files/fleck-5600-sxt.jpg?v=1686769528', amazon:`https://www.amazon.com/s?k=Fleck+5600SXT+48000+grain+water+softener&tag=${TAG}` },
  { id:40, cat:'softener', catLabel:'Water Softener', name:'Harmony Series 48,000 Grain (AS-HS48D)', brand:'Aquasure', price:600, filterCostPerYear:42, rating:4.5, reviews:2500, gpd:null, stages:1, cert:['NSF/ANSI 44'], certColor:'#d97706', removes:['Hardness >99%','Scale','Calcium','Magnesium'], bestFor:['Hardness','Scale'], pros:['Digital metered Aquatrol head','48k grain — common DIY kit','1" or 3/4" NPT options'], diyDiff:'Hard', situations:['homeowner'], softener:true, wholeHouse:true, expertPick:false, img:'https://cdn.shopify.com/s/files/1/0298/3097/1451/files/AS-HS48D_01_189f6fc3-896b-490b-bc59-9dd56b5c6486.jpg?v=1710969251', amazon:`https://www.amazon.com/s?k=Aquasure+Harmony+AS-HS48D+48000+grain+water+softener&tag=${TAG}` },

  // ── ACID NEUTRALIZERS — well water low pH ───────────────────────────────────
  { id:42, cat:'acid-neutralizer', catLabel:'Acid Neutralizer', name:'AFWFilters 1.5 cu.ft. Calcite Neutralizer', brand:'AFWFilters', price:459, filterCostPerYear:40, rating:4.5, reviews:780, gpd:null, stages:1, cert:['NSF/ANSI 61'], certColor:'#22d3ee', removes:['Low pH','Corrosive water','Copper leaching','Lead leaching from pipes'], bestFor:['Acidic pH','Corrosion','Blue-green staining'], pros:['Raises pH naturally — no chemicals','Whole-house point-of-entry','10+ yr calcite media life'], diyDiff:'Hard', situations:['homeowner'], well:true, wholeHouse:true, acidNeutralizer:true, expertPick:true, expertReason:'Calcite media dissolves slowly to raise pH naturally — no pumps, chemicals, or electricity. Whole-house protection stops corrosive water from leaching copper and lead from pipes. Best value acid neutralizer for private wells.', img:'https://cdn11.bigcommerce.com/s-zo9s1d/images/stencil/1280x1280/products/1473/3842/5600SXT-FLTR__11655.1653653032.jpg?c=2', amazon:`https://www.amazon.com/s?k=AFWFilters+calcite+acid+neutralizer+whole+house&tag=${TAG}` },
  { id:43, cat:'acid-neutralizer', catLabel:'Acid Neutralizer', name:'Fleck 5600SXT Calcite/Corosex System', brand:'Fleck', price:649, filterCostPerYear:50, rating:4.6, reviews:420, gpd:null, stages:1, cert:['NSF/ANSI 61'], certColor:'#22d3ee', removes:['Low pH','Corrosive water','Copper leaching','Lead leaching from pipes'], bestFor:['Acidic pH','Corrosion','Blue-green staining'], pros:['Digital metered valve — auto backwash','Calcite + Corosex blend for very low pH','30-yr Fleck valve warranty'], diyDiff:'Hard', situations:['homeowner'], well:true, wholeHouse:true, acidNeutralizer:true, expertPick:true, expertReason:'The Fleck 5600SXT valve is the most trusted name in residential water treatment. The Calcite/Corosex blend handles even very acidic well water (pH 5.0–6.5). Automatic backwash keeps the bed clean. Best premium acid neutralizer.', img:'https://flecksystems.com/cdn/shop/files/fleck-5600-sxt.jpg?v=1686769528', amazon:`https://www.amazon.com/s?k=Fleck+5600SXT+calcite+acid+neutralizer&tag=${TAG}` },
];

// ─────────────────────────────────────────────────────────────────────────────
// SITUATION → product recommendations
// ─────────────────────────────────────────────────────────────────────────────
const SITUATION_CONFIG: Record<string, {
  headline: string;
  description: string;
  primaryCats: string[];
  avoid: string;
  tip: string;
}> = {
  homeowner: {
    headline: 'Best filters for homeowners',
    description: 'You can install under-sink RO or a whole-house system. Under-sink gives the cleanest drinking water; whole-house protects every tap, shower, and appliance. Countertop distillers are plug-in — no plumbing — and strip fluoride, nitrates, and heavy metals by boiling steam (slow but thorough).',
    primaryCats: ['undersink','whole','distiller'],
    avoid: 'Skip pitchers long-term — the per-gallon cost is 3x higher than RO.',
    tip: 'Most under-sink RO systems take 2-3 hours to install with basic tools. For distilled water without plumbing, a CO-Z–style countertop distiller (see Distiller tab) is the value pick — plan counter space, regular descaling, and carbon sachet changes per the manual.',
  },
  renter: {
    headline: 'No-drill solutions for renters',
    description: 'You can\'t drill into cabinets or modify plumbing. Countertop RO systems connect to your existing faucet in minutes with zero permanent changes. Faucet-mount filters are even simpler.',
    primaryCats: ['countertop','faucet','pitcher'],
    avoid: 'Avoid under-sink systems — they require drilling and permanent plumbing modifications that violate most leases.',
    tip: 'The Waterdrop K19-S Countertop RO is the best no-install option — no installation needed, just plug in. NSF 58 certified; removes PFAS, lead, arsenic, and 1,000+ contaminants. Perfect for renters (170 oz tank, 3:1 pure to drain).',
  },
  dorm: {
    headline: 'Dorm room & campus water solutions',
    description: 'Campus water often has aging pipes with lead risk. A certified pitcher or countertop RO on your desk covers drinking and cooking without dorm plumbing changes.',
    primaryCats: ['pitcher', 'countertop'],
    avoid: 'Don\'t rely on the drinking fountains — campus water systems are often older buildings with lead service lines.',
    tip: 'Clearly Filtered pitcher is the only pitcher that removes PFAS — worth the extra cost if your school\'s water tests positive.',
  },
  family: {
    headline: 'Protecting your whole family',
    description: 'Children are more vulnerable to lead and PFAS. Under-sink RO handles cooking and drinking water at home; a certified pitcher is a solid backup for kids\' rooms.',
    primaryCats: ['undersink', 'pitcher'],
    avoid: 'Regular Brita pitchers don\'t remove PFAS or lead at high efficiency — for kids, get Clearly Filtered or an RO system.',
    tip: 'The #1 priority for families with kids under 6: lead and PFAS removal. Both require RO or a specifically PFAS-certified pitcher (like Clearly Filtered).',
  },
  travel: {
    headline: 'Filtering water on the go',
    description: 'For hotel rooms and short trips, pack a certified pitcher or use bottled water from a trusted brand when needed. For longer stays or RVs, a countertop RO is a game-changer.',
    primaryCats: ['pitcher', 'countertop'],
    avoid: 'Don\'t trust hotel tap water — aging building plumbing can have lead even when the municipal supply is clean.',
    tip: 'Countertop RO (e.g. Waterdrop K19-S) plugs into a standard outlet — workable for extended Airbnb stays if you have counter space.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE DATABASE LINKS
// ─────────────────────────────────────────────────────────────────────────────
const STATE_DB: Record<string, { name: string; url: string }> = {
  CA: { name: 'CA GAMA Groundwater Quality', url: 'https://gamagroundwater.waterboards.ca.gov/' },
  TX: { name: 'TX TCEQ Water Quality', url: 'https://www.tceq.texas.gov/drinkingwater/' },
  FL: { name: 'FL DEP Drinking Water', url: 'https://floridadep.gov/water/source-drinking-water' },
  NY: { name: 'NY DOH Water Quality', url: 'https://www.health.ny.gov/environmental/water/drinking/' },
  IL: { name: 'IL EPA Drinking Water', url: 'https://www2.illinois.gov/epa/topics/water-quality/drinking-water/' },
  PA: { name: 'PA DEP Safe Drinking Water', url: 'https://www.dep.pa.gov/Business/Water/DrinkingWater/' },
  OH: { name: 'OH EPA Drinking Water', url: 'https://epa.ohio.gov/divisions-and-offices/drinking-and-ground-waters' },
  MI: { name: 'MI EGLE Drinking Water', url: 'https://www.michigan.gov/egle/about/organization/drinking-water-and-environmental-health' },
  GA: { name: 'GA EPD Drinking Water', url: 'https://epd.georgia.gov/watershed-protection-branch/drinking-water' },
  NC: { name: 'NC DEQ Water Quality', url: 'https://deq.nc.gov/about/divisions/water-resources/drinking-water' },
  NJ: { name: 'NJ DEP Safe Drinking Water', url: 'https://www.nj.gov/dep/watersupply/' },
  VA: { name: 'VA DEQ Water Quality', url: 'https://www.deq.virginia.gov/programs/water/drinking-water' },
  WA: { name: 'WA DOH Drinking Water', url: 'https://doh.wa.gov/community-and-environment/drinking-water' },
  AZ: { name: 'AZ ADEQ Drinking Water', url: 'https://azdeq.gov/drinking-water' },
  MA: { name: 'MA DEP Drinking Water', url: 'https://www.mass.gov/orgs/drinking-water-program' },
  TN: { name: 'TN DEC Drinking Water', url: 'https://www.tn.gov/environment/program-areas/wr-water-resources/drinking-water.html' },
  IN: { name: 'IN DW & NPDES', url: 'https://www.in.gov/idem/water/drinking-water/' },
  MO: { name: 'MO DNR Public Drinking Water', url: 'https://dnr.mo.gov/content/public-drinking-water-branch' },
  MD: { name: 'MD MDE Drinking Water', url: 'https://mde.maryland.gov/programs/water/drinkingwater' },
  WI: { name: 'WI DNR Drinking Water', url: 'https://dnr.wisconsin.gov/topic/DrinkingWater' },
  MN: { name: 'MN MDH Drinking Water', url: 'https://www.health.state.mn.us/communities/environment/water/factsheet/drinkingwater.html' },
  CO: { name: 'CO CDPHE Drinking Water', url: 'https://cdphe.colorado.gov/drinking-water-program' },
  SC: { name: 'SC DHEC Drinking Water', url: 'https://scdhec.gov/environment/your-water-choices/drinking-water' },
  AL: { name: 'AL ADEM Drinking Water', url: 'https://adem.alabama.gov/programs/water/drinkingwater.cnt' },
  LA: { name: 'LA DEQ Drinking Water', url: 'https://deq.louisiana.gov/page/safe-drinking-water' },
  KY: { name: 'KY DOW Drinking Water', url: 'https://eec.ky.gov/Environmental-Protection/Water/Drinking-Water' },
  OR: { name: 'OR DEQ Drinking Water', url: 'https://www.oregon.gov/oha/PH/HealthyEnvironments/DrinkingWater' },
  OK: { name: 'OK DEQ Safe Drinking Water', url: 'https://www.deq.ok.gov/divisions/wsd/drinking-water/' },
  CT: { name: 'CT DPH Drinking Water', url: 'https://portal.ct.gov/DPH/Environmental-Health/Drinking-Water/Safe-Drinking-Water-Program' },
  UT: { name: 'UT DEQ Drinking Water', url: 'https://deq.utah.gov/drinking-water' },
  NV: { name: 'NV NDEP Drinking Water', url: 'https://ndep.nv.gov/water/drinking-water' },
  IA: { name: 'IA DNR Drinking Water', url: 'https://www.iowadnr.gov/Environmental-Protection/Water-Quality/Drinking-Water' },
  AR: { name: 'AR DEQ Drinking Water', url: 'https://www.adeq.state.ar.us/water/branch_permits/drinking_water/' },
  MS: { name: 'MS DEQ Safe Drinking Water', url: 'https://www.mdeq.ms.gov/water/drinking-water/' },
  KS: { name: 'KS KDHE Drinking Water', url: 'https://www.kdhe.ks.gov/1016/Public-Water-Supply-Section' },
  NM: { name: 'NM NMED Drinking Water', url: 'https://www.env.nm.gov/drinking_water/' },
  WV: { name: 'WV DEP Drinking Water', url: 'https://dep.wv.gov/WWE/Programs/dw' },
  NE: { name: 'NE DHHS Drinking Water', url: 'https://dhhs.ne.gov/Pages/Drinking-Water.aspx' },
  ID: { name: 'ID DEQ Drinking Water', url: 'https://www.deq.idaho.gov/water-quality/drinking-water/' },
  HI: { name: 'HI DOH Safe Drinking Water', url: 'https://health.hawaii.gov/sdwb/' },
  ME: { name: 'ME DEP Drinking Water', url: 'https://www.maine.gov/dep/water/dwp/' },
  NH: { name: 'NH DES Drinking Water', url: 'https://www.des.nh.gov/water/drinking-water' },
  RI: { name: 'RI DEM Drinking Water', url: 'https://dem.ri.gov/programs/water/drinking-water' },
  MT: { name: 'MT DEQ Drinking Water', url: 'https://deq.mt.gov/Water/PWSS' },
  DE: { name: 'DE DNREC Drinking Water', url: 'https://dnrec.delaware.gov/earth/soil-groundwater/' },
  SD: { name: 'SD DENR Drinking Water', url: 'https://denr.sd.gov/des/dw/DrinkWater.aspx' },
  ND: { name: 'ND DOH Drinking Water', url: 'https://www.health.nd.gov/ehs/drinking-water' },
  AK: { name: 'AK DEC Drinking Water', url: 'https://dec.alaska.gov/eh/dw/' },
  VT: { name: 'VT DEC Drinking Water', url: 'https://dec.vermont.gov/watershed/dwgwp/drinkingwater' },
  WY: { name: 'WY DEQ Drinking Water', url: 'https://deq.wyoming.gov/wqd/safe-drinking-water/' },
};

// ─────────────────────────────────────────────────────────────────────────────
// WELL WATER RISK DATABASE — 50-state profiles (USGS / EPA groundwater data)
// ─────────────────────────────────────────────────────────────────────────────
type WellRisk = { name: string; sev: 'high'|'moderate'|'low'; why: string; fix: string; color: string };

const WELL_RISKS: Record<string, WellRisk[]> = (() => {
  const ne: WellRisk[] = [
    { name:'Arsenic', sev:'high', why:'Naturally occurring in granite/bedrock. Northeast has among the highest US well arsenic rates.', fix:'RO removes >99%', color:'#ef4444' },
    { name:'Radon', sev:'high', why:'Dissolves from granite into groundwater; volatilizes indoors during water use.', fix:'Aeration system or point-of-entry carbon', color:'#ef4444' },
    { name:'Low pH / Acidic Water', sev:'moderate', why:'Granite and crystalline bedrock provide little buffering — NE well water commonly tests pH 5.5–6.5. Corrosive to copper pipes and fixtures.', fix:'Whole-house calcite acid neutralizer raises pH naturally', color:'#f59e0b' },
    { name:'Bacteria / Coliform', sev:'moderate', why:'Surface runoff, cracked well casings, or nearby septic systems.', fix:'UV sterilizer eliminates 99.99%', color:'#f59e0b' },
    { name:'Uranium', sev:'moderate', why:'Occurs in bedrock — linked to kidney damage at elevated levels.', fix:'RO or strong-base anion exchange', color:'#f59e0b' },
    { name:'Hardness', sev:'low', why:'Calcium/magnesium from limestone — scaling on pipes and appliances.', fix:'Water softener', color:'#22d3ee' },
  ];
  const se: WellRisk[] = [
    { name:'Bacteria / Coliform', sev:'high', why:'Warm climate, shallow aquifers, high density of septic systems.', fix:'UV sterilizer + annual testing', color:'#ef4444' },
    { name:'Nitrates', sev:'high', why:'Agricultural runoff and septic leach — dangerous for infants (blue baby syndrome).', fix:'RO removes >97%', color:'#ef4444' },
    { name:'Low pH / Acidic Water', sev:'moderate', why:'Sandy, low-mineral soils across the Southeast provide little pH buffering — well water commonly tests pH 6.0–6.8. Corrodes copper plumbing and fixtures.', fix:'Whole-house calcite acid neutralizer raises pH naturally', color:'#f59e0b' },
    { name:'Iron & Manganese', sev:'moderate', why:'Naturally occurring — causes staining, metallic taste, pipe buildup.', fix:'Iron/oxidizing whole-house filter', color:'#f59e0b' },
    { name:'Arsenic', sev:'moderate', why:'Present in coastal plain sediments across FL, SC, NC.', fix:'RO removes >99%', color:'#f59e0b' },
    { name:'Hardness', sev:'low', why:'Limestone-heavy geology across Southeast produces hard water.', fix:'Water softener', color:'#22d3ee' },
  ];
  const mw: WellRisk[] = [
    { name:'Nitrates', sev:'high', why:'#1 well contaminant in corn/soy belt. Infant risk — causes blue baby syndrome.', fix:'RO removes >97%', color:'#ef4444' },
    { name:'Bacteria / Coliform', sev:'high', why:'Agricultural runoff and flooding contaminate shallow wells regularly.', fix:'UV sterilizer + annual testing', color:'#ef4444' },
    { name:'Arsenic', sev:'moderate', why:'Naturally in glacial sediments across ND, SD, MN, WI, IA.', fix:'RO removes >99%', color:'#f59e0b' },
    { name:'Radium', sev:'moderate', why:'Found in deep aquifers across IL, OH, IN — linked to bone cancer.', fix:'Water softener or RO', color:'#f59e0b' },
    { name:'Hardness', sev:'moderate', why:'Among the highest hardness levels in the US from limestone aquifers.', fix:'Water softener', color:'#f59e0b' },
  ];
  const so: WellRisk[] = [
    { name:'Bacteria / Coliform', sev:'high', why:'Warm temperatures and porous soils allow rapid contamination from surface sources.', fix:'UV sterilizer + shock chlorination', color:'#ef4444' },
    { name:'Nitrates', sev:'high', why:'Heavy agriculture and livestock across TX, OK, AR, LA drive contamination.', fix:'RO removes >97%', color:'#ef4444' },
    { name:'Iron & Manganese', sev:'moderate', why:'Common in red-clay aquifers — stains laundry, fixtures, and appliances.', fix:'Iron/oxidizing filter or iSpring WCFM500K-class system', color:'#f59e0b' },
    { name:'Total Dissolved Solids', sev:'moderate', why:'High mineral content from deep brackish aquifers, especially west TX.', fix:'RO dramatically reduces TDS', color:'#f59e0b' },
    { name:'Sulfur / H₂S', sev:'low', why:'Rotten-egg smell from anaerobic bacteria in deep wells.', fix:'Aeration or oxidizing filter', color:'#22d3ee' },
  ];
  const mt: WellRisk[] = [
    { name:'Arsenic', sev:'high', why:'Mountain West has the highest naturally occurring arsenic in the US — volcanic & geothermal geology.', fix:'RO removes >99%', color:'#ef4444' },
    { name:'Uranium', sev:'high', why:'Widespread in western US geology — linked to kidney damage. MT, WY, CO, NM among highest.', fix:'RO or strong-base anion exchange', color:'#ef4444' },
    { name:'Fluoride', sev:'moderate', why:'Naturally elevated in volcanic aquifers (NM, AZ, UT, NV) — dental/bone damage at high levels.', fix:'RO removes >96%', color:'#f59e0b' },
    { name:'Selenium', sev:'moderate', why:'Found in sedimentary rocks across CO, WY, UT — toxic at elevated levels.', fix:'RO or strong-base anion exchange', color:'#f59e0b' },
    { name:'Bacteria / Coliform', sev:'low', why:'Risk from livestock and wildlife near shallow wells.', fix:'UV sterilizer + annual testing', color:'#22d3ee' },
  ];
  const pac: WellRisk[] = [
    { name:'Arsenic', sev:'moderate', why:'Volcanic geology in OR, WA, AK — elevated in parts of CA Central Valley.', fix:'RO removes >99%', color:'#f59e0b' },
    { name:'Nitrates', sev:'moderate', why:'Agricultural zones in CA (Central Valley, Salinas) and OR/WA Willamette Valley.', fix:'RO removes >97%', color:'#f59e0b' },
    { name:'Bacteria / Coliform', sev:'moderate', why:'Rural wells near livestock and wildfire-affected zones show higher coliform rates.', fix:'UV sterilizer + annual testing', color:'#f59e0b' },
    { name:'Iron & Manganese', sev:'low', why:'Common in Pacific Northwest volcanic aquifers.', fix:'Iron filter or whole-house system', color:'#22d3ee' },
    { name:'Radon', sev:'low', why:'Present in granite-heavy zones of WA, OR, AK.', fix:'Aeration system', color:'#22d3ee' },
  ];
  const base: Record<string, WellRisk[]> = {
    ME:ne, NH:ne, VT:ne, MA:ne, RI:ne, CT:ne, NY:ne, NJ:ne, PA:ne,
    MD:se, DE:se, VA:se, WV:se, NC:se, SC:se, GA:se, FL:se, AL:se, MS:se, TN:se, KY:se,
    OH:mw, IN:mw, IL:mw, MI:mw, WI:mw, MN:mw, IA:mw, MO:mw, ND:mw, SD:mw, NE:mw, KS:mw,
    TX:so, OK:so, AR:so, LA:so,
    MT:mt, ID:mt, WY:mt, CO:mt, UT:mt, NV:mt, AZ:mt, NM:mt,
    CA:pac, OR:pac, WA:pac, AK:pac, HI:pac,
  };
  const overrides: Record<string, WellRisk[]> = {
    AZ:[
      { name:'Arsenic', sev:'high', why:'AZ has the highest well arsenic rates in the US — volcanic geology and historic mining.', fix:'RO removes >99%', color:'#ef4444' },
      { name:'Uranium', sev:'high', why:'Mining regions of AZ have elevated uranium in groundwater.', fix:'RO or anion exchange', color:'#ef4444' },
      { name:'Fluoride', sev:'high', why:'Naturally very high in AZ volcanic aquifers — can cause dental fluorosis.', fix:'RO removes >96%', color:'#ef4444' },
      { name:'Total Dissolved Solids', sev:'moderate', why:'Arid climate concentrates minerals in deep AZ wells.', fix:'RO dramatically reduces TDS', color:'#f59e0b' },
      { name:'Bacteria / Coliform', sev:'low', why:'Seasonal monsoon flooding can contaminate shallow wells.', fix:'UV sterilizer', color:'#22d3ee' },
    ],
    CA:[
      { name:'Arsenic', sev:'high', why:'Central Valley and Central Coast wells frequently exceed EPA limits — geothermal and agricultural sources.', fix:'RO removes >99%', color:'#ef4444' },
      { name:'Nitrates', sev:'high', why:'Central Valley agriculture has contaminated thousands of rural CA wells above the MCL.', fix:'RO removes >97%', color:'#ef4444' },
      { name:'Uranium', sev:'moderate', why:'San Joaquin Valley wells often exceed EPA action levels.', fix:'RO or anion exchange', color:'#f59e0b' },
      { name:'Hexavalent Chromium', sev:'moderate', why:'Naturally occurring in CA geology — linked to cancer.', fix:'RO or strong-base anion exchange', color:'#f59e0b' },
      { name:'Bacteria / Coliform', sev:'low', why:'Wildfire runoff and agricultural contamination affect shallow wells.', fix:'UV sterilizer + annual testing', color:'#22d3ee' },
    ],
    TX:[
      { name:'Total Dissolved Solids', sev:'high', why:'West & south TX deep brackish aquifers have very high TDS — salty, mineral-heavy water.', fix:'RO dramatically reduces TDS', color:'#ef4444' },
      { name:'Nitrates', sev:'high', why:'TX panhandle and Hill Country agriculture drive nitrate contamination.', fix:'RO removes >97%', color:'#ef4444' },
      { name:'Arsenic', sev:'moderate', why:'West TX geology contains naturally elevated arsenic levels.', fix:'RO removes >99%', color:'#f59e0b' },
      { name:'Iron & Manganese', sev:'moderate', why:'Red clay soils and deep aquifers in Central/East TX.', fix:'Iron filter or iSpring WCFM500K-class system', color:'#f59e0b' },
      { name:'Bacteria / Coliform', sev:'moderate', why:'Common in shallow East TX wells — heavy rainfall and livestock runoff.', fix:'UV sterilizer + annual testing', color:'#f59e0b' },
    ],
    FL:[
      { name:'Bacteria / Coliform', sev:'high', why:"FL's porous limestone (karst) geology allows rapid surface contamination of wells.", fix:'UV sterilizer + annual testing', color:'#ef4444' },
      { name:'Sulfur / H₂S', sev:'high', why:'FL wells are notorious for rotten-egg smell from hydrogen sulfide gas in the aquifer.', fix:'Aeration system or oxidizing filter', color:'#ef4444' },
      { name:'Nitrates', sev:'high', why:'Heavy fertilizer use and very shallow water table across agricultural FL.', fix:'RO removes >97%', color:'#ef4444' },
      { name:'Iron & Manganese', sev:'moderate', why:'Staining and taste issues common in FL well water.', fix:'Iron/oxidizing filter', color:'#f59e0b' },
      { name:'Hardness', sev:'moderate', why:'FL limestone aquifer produces very hard water — scale on appliances.', fix:'Water softener', color:'#f59e0b' },
    ],
    NY:[
      { name:'Arsenic', sev:'high', why:'Upstate NY granite bedrock has naturally elevated arsenic. Long Island wells also affected by industry.', fix:'RO removes >99%', color:'#ef4444' },
      { name:'Radon', sev:'high', why:'High-radon granite geology across upstate NY.', fix:'Aeration or point-of-entry carbon', color:'#ef4444' },
      { name:'PFAS', sev:'moderate', why:'Military bases and industrial sites have contaminated groundwater across NY state.', fix:'RO removes >99% PFAS', color:'#f59e0b' },
      { name:'Bacteria / Coliform', sev:'moderate', why:'Dense rural population with aging wells and nearby septic systems.', fix:'UV sterilizer + annual testing', color:'#f59e0b' },
      { name:'Uranium', sev:'low', why:'Present in Adirondack granite bedrock.', fix:'RO or anion exchange', color:'#22d3ee' },
    ],
  };
  const result: Record<string, WellRisk[]> = {};
  for (const state of Object.keys(base)) { result[state] = overrides[state] ?? base[state]; }
  return result;
})();

const SEV: Record<string, { color: string; label: string }> = {
  low:      { color: '#22d3ee', label: 'Within Limits' },
  moderate: { color: '#f59e0b', label: 'Elevated' },
  high:     { color: '#ef4444', label: 'Exceeds Limit' },
};

const STEPS = [
  'Querying EPA Envirofacts API…',
  'Finding water system for ZIP…',
  'Pulling EPA violation records…',
  'Fetching Lead & Copper samples…',
  'Cross-referencing EPA PFAS testing data…',
  'Loading EWG Tap Water Atlas data…',
  'Building your personalized report…',
];

/** Hero step 3 — button id → PRODUCT.cat values (order = display sections for multi-cat) */
const HERO_SOLUTION_CATS = {
  pitcher: ['pitcher'],
  countertop: ['countertop', 'countertop-filter'],
  undersink: ['undersink', 'undersink-filter'],
  whole: ['whole'],
  shower: ['shower'],
} as const;
type HeroSolutionKey = keyof typeof HERO_SOLUTION_CATS;
const HERO_SOLUTION_SECTION_TITLE: Record<HeroSolutionKey, string> = {
  pitcher: 'Pitcher filters',
  countertop: 'Countertop RO & filters',
  undersink: 'Under-sink RO & filters',
  whole: 'Whole-house systems',
  shower: 'Shower filters',
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DIAL — animated arc + count-up number
// ─────────────────────────────────────────────────────────────────────────────
function HomeEmailCapture() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!email.includes('@')) return;
    setSending(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'violation-alert' }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
    } finally { setSending(false); }
  }

  return (
    <div style={{ marginTop: 56, padding: '32px 28px', background: 'linear-gradient(135deg,rgba(8,145,178,0.1),rgba(4,14,32,0.95))', border: '1px solid rgba(8,145,178,0.3)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>STAY INFORMED</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>Get weekly water quality alerts</div>
      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 480 }}>
        We monitor EPA databases weekly for new PFAS detections, boil water advisories, and violations. One email, no spam, unsubscribe anytime.
      </p>
      {sent ? (
        <div style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: '#4ade80', fontWeight: 700, fontSize: 14 }}>
          ✓ You&apos;re on the list — we&apos;ll send weekly water updates.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="your@email.com"
            style={{ flex: '1 1 200px', minWidth: 0, padding: '11px 14px', background: 'rgba(4,22,48,0.9)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, color: '#f1f5f9', fontSize: 14, outline: 'none' }}
          />
          <button onClick={submit} disabled={sending || !email.includes('@')}
            style={{ padding: '11px 22px', background: email.includes('@') ? 'linear-gradient(135deg,#0891b2,#06b6d4)' : 'rgba(14,34,51,0.8)', border: 'none', borderRadius: 9, color: email.includes('@') ? '#fff' : '#475569', fontSize: 14, fontWeight: 800, cursor: email.includes('@') ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
            {sending ? '…' : 'Subscribe Free'}
          </button>
        </div>
      )}
      <p style={{ fontSize: 11, color: '#334155', marginTop: 12 }}>No spam. Unsubscribe anytime.</p>
    </div>
  );
}

function ScoreDial({ score, grade }: { score: number; grade: string }) {
  const safe = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Number(score))) : 0;
  const gradeStr = grade != null && grade !== '' ? String(grade) : '—';
  const [arc, setArc]         = useState(0);
  const [display, setDisplay] = useState(0);

  // Arc animation (CSS transition)
  useEffect(() => { const t = setTimeout(() => setArc(safe), 120); return () => clearTimeout(t); }, [safe]);

  // Count-up number animation
  useEffect(() => {
    if (!safe) return;
    let raf: number;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(Math.round(eased * safe));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [safe]);

  const r = 72, cx = 90, cy = 90;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (a: number) => ({ x: cx + r * Math.cos(rad(a)), y: cy + r * Math.sin(rad(a)) });
  const mkArc = (s: number, e: number) => {
    const p1 = pt(s), p2 = pt(e), lg = e - s > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${lg} 1 ${p2.x} ${p2.y}`;
  };
  const color = safe >= 80 ? '#22d3ee' : safe >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="180" height="160" viewBox="0 0 180 160">
      <path d={mkArc(210, 510)} fill="none" stroke="#1e3a4a" strokeWidth="10" strokeLinecap="round" />
      <path d={mkArc(210, 210 + 300 * (arc / 100))} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        style={{ transition: 'all 1.4s cubic-bezier(0.34,1.56,0.64,1)' }} filter={`drop-shadow(0 0 10px ${color}99)`} />
      <text x={cx} y={cy + 8}  textAnchor="middle" fontSize="34" fontWeight="900" fill={color} fontFamily="inherit">{display}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="inherit">Grade: {gradeStr}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED SPOTLIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedSpotlightCard({ p, idx, accent }: { p: any; idx: number; accent: string }) {
  const [fImgErr, setFImgErr] = useState(false);
  return (
    <div className="wc-featured-card" style={{ display: 'flex', gap: 0, overflow: 'hidden' }}>
      {/* Image */}
      <div className="wc-img-wrap" style={{ width: 200, minWidth: 200, background: 'linear-gradient(160deg,#f8fbff,#eef4fb)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', flexShrink: 0 }}>
        {!fImgErr
          ? <img src={p.img} alt={p.name} onError={() => setFImgErr(true)} className="wc-img-zoom" style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }} />
          : <div style={{ fontSize: 48 }}>💧</div>}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${accent}, ${accent}55)` }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: `linear-gradient(135deg,${accent}dd,${accent})`, color: '#fff', fontSize: 10, fontWeight: 900, padding: '3px 9px', borderRadius: 5, letterSpacing: 1 }}>#{idx + 1} PICK</div>
      </div>
      {/* Info */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: accent, fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>{p.brand?.toUpperCase()} · {p.catLabel?.toUpperCase()}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f9ff', marginBottom: 6 }}>{p.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(Math.round(p.rating))}</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{p.rating} ({p.reviews?.toLocaleString()} reviews)</span>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0, maxWidth: 480 }}>{p.expertReason}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.removes?.slice(0, 3).map((r: string) => (
              <span key={r} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${accent}12`, color: accent, border: `1px solid ${accent}33`, fontWeight: 700 }}>{r}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b' }}>${p.price}</span>
            <BuyButtons p={p} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WATERDROP — buy direct (GoAffPro) + Amazon. All other brands: Amazon only.
// ─────────────────────────────────────────────────────────────────────────────
const WATERDROP_DIRECT_BY_ID: Partial<Record<number, string>> = {
  3: 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro',
  26: 'https://www.waterdropfilter.com/products/ro-water-filter-system-d6?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro',
  6: 'https://www.waterdropfilter.com/products/countertop-ro-water-filter-system-wd-k19-s?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro',
  34: 'https://www.waterdropfilter.com/products/whole-house-water-filter-for-tap-water-wd-whf3t-pg?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro',
};

const WATERDROP_AMAZON_BY_ID: Partial<Record<number, string>> = {
  3: `https://www.amazon.com/dp/B0987FCQQW?tag=${TAG}`,
  26: `https://www.amazon.com/dp/B08746G2XX?tag=${TAG}`,
  6: `https://www.amazon.com/dp/B0BHQRNGZ8?tag=${TAG}`,
  34: `https://www.amazon.com/dp/B0FYCRPXLZ?tag=${TAG}`,
};

function isAmazonProductUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /amazon\.(com|co\.uk|ca|de)\//i.test(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUY BUTTONS — Waterdrop: buy direct + Amazon; everyone else: Amazon only
// ─────────────────────────────────────────────────────────────────────────────
function BuyButtons({ p, block = false }: { p: any; block?: boolean }) {
  const isWaterdrop = p.brand === 'Waterdrop';
  const directUrl = isWaterdrop ? WATERDROP_DIRECT_BY_ID[p.id] : null;
  const amazonUrl = isWaterdrop
    ? (WATERDROP_AMAZON_BY_ID[p.id] ?? (isAmazonProductUrl(p.amazon) ? p.amazon : null))
    : p.amazon;

  const pad = block ? '11px 0' : '10px 20px';
  const flex = block ? 1 : undefined;

  if (!amazonUrl && !directUrl) {
    return (
      <span style={{ display: 'block', textAlign: 'center', padding: pad, borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#64748b', flex }}>
        Link unavailable
      </span>
    );
  }

  if (isWaterdrop && directUrl && amazonUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: block ? '100%' : undefined }}>
        <a href={directUrl} target="_blank" rel="noopener noreferrer sponsored" className="wc-buy"
          style={{ display: 'block', textAlign: 'center', padding: pad, borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none', letterSpacing: 0.3, flex, background: 'linear-gradient(135deg,rgba(8,145,178,0.35),rgba(6,182,212,0.25))' }}>
          Waterdrop.com →
        </a>
        <a href={amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="wc-buy wc-buy-amazon-secondary"
          style={{ display: 'block', textAlign: 'center', padding: block ? '7px 0' : '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: 0.2, flex, color: '#94a3b8', border: '1px solid rgba(100,116,139,0.35)', background: 'rgba(15,23,42,0.5)' }}>
          Amazon →
        </a>
      </div>
    );
  }

  return (
    <a href={amazonUrl || directUrl!} target="_blank" rel="noopener noreferrer sponsored" className="wc-buy wc-buy-amazon-secondary"
      style={{ display: 'block', textAlign: 'center', padding: pad, borderRadius: 10, fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: 0.2, flex, color: '#94a3b8', border: '1px solid rgba(100,116,139,0.35)', background: 'rgba(15,23,42,0.5)' }}>
      Amazon →
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ p, highlight, compact, detectedContaminants }: { p: any; highlight: boolean; compact?: boolean; detectedContaminants?: string[] }) {
  const [imgErr, setImgErr] = useState(false);
  const diyColors: Record<string, string> = { None: '#22d3ee', Easy: '#22d3ee', Medium: '#f59e0b', Hard: '#ef4444' };

  if (compact) {
    return (
      <div style={{ background: highlight ? 'rgba(8,40,90,0.68)' : 'rgba(4,14,32,0.65)', border: `1px solid ${highlight ? 'rgba(8,145,178,0.5)' : 'rgba(255,255,255,0.07)'}`, borderTop: `1px solid ${highlight ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.13)'}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: highlight ? '0 8px 32px rgba(8,145,178,0.2), inset 0 1px 0 rgba(255,255,255,0.09)' : '0 8px 24px rgba(0,4,18,0.4), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
        <div style={{ width: 60, height: 60, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {!imgErr && p.img ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ maxHeight: 55, maxWidth: 55, objectFit: 'contain' }} /> : <div style={{ fontSize: 20 }}>💧</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 1 }}>{p.brand}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2, marginBottom: 4 }}>{p.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: diyColors[p.diyDiff] || '#22d3ee' }}>Install: {p.diyDiff}</span>
            {(p.removes || []).slice(0, 2).map((r: string) => <span key={r} style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#051527', color: '#22d3ee', border: '1px solid #22d3ee22' }}>{r}</span>)}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#22d3ee' }}>${p.price}</div>
          <BuyButtons p={p} />
        </div>
      </div>
    );
  }

  return (
    <div className="wc-card" style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(highlight ? { borderColor: 'rgba(8,145,178,0.5)', boxShadow: '0 16px 48px rgba(0,4,18,0.6), 0 0 40px rgba(8,145,178,0.18), inset 0 1px 0 rgba(255,255,255,0.13)' } : {}) }}>
      {/* Image area */}
      <div className="wc-img-wrap" style={{ background: 'linear-gradient(160deg,#f8fbff 0%,#eef4fb 100%)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
        {!imgErr
          ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} className="wc-img-zoom" style={{ maxHeight: 168, maxWidth: '90%', objectFit: 'contain' }} />
          : <div style={{ fontSize: 48 }}>💧</div>}
        {/* Badges */}
        {highlight && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(90deg,#0891b2,#06b6d4)', color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 1.5, textAlign: 'center', padding: '5px 0' }}>
            🏅 EXPERT PICK
          </div>
        )}
        {p.expertPick && !highlight && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#fff', fontSize: 9, fontWeight: 900, letterSpacing: 1, padding: '3px 8px', borderRadius: 5, boxShadow: '0 2px 8px rgba(217,119,6,0.5)' }}>
            EXPERT PICK
          </div>
        )}
        {p.tankless && (
          <div style={{ position: 'absolute', top: highlight ? 30 : 8, right: 8, background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: '#fff', fontSize: 9, fontWeight: 900, letterSpacing: 1, padding: '3px 8px', borderRadius: 5 }}>
            TANKLESS
          </div>
        )}
        {p.quickChange && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#22d3ee', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4 }}>
            ⚡ QUICK-CHANGE
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1.5, fontWeight: 700, marginBottom: 3 }}>{(p.brand || 'Brand').toUpperCase()} · {(p.catLabel || '').toUpperCase()}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f9ff', lineHeight: 1.25 }}>{p.name}</div>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: -1 }}>{'★'.repeat(Math.round(p.rating))}</span>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{p.rating} <span style={{ color: '#334155' }}>({p.reviews?.toLocaleString()} reviews)</span></span>
        </div>

        {/* Certifications */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {p.cert?.slice(0,2).map((c: string) => (
            <span key={c} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: p.certColor + '18', color: p.certColor, border: `1px solid ${p.certColor}44`, fontWeight: 800, letterSpacing: 0.5 }}>{c}</span>
          ))}
        </div>

        {/* Removes */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#334155', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>REMOVES</div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {p.removes?.slice(0, 4).map((r: string) => (
              <span key={r} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(34,211,238,0.07)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.18)', fontWeight: 600 }}>{r}</span>
            ))}
          </div>
          {detectedContaminants && detectedContaminants.length > 0 && (() => {
            const matched = p.bestFor?.filter((b: string) => detectedContaminants.some(d => d.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(d.toLowerCase().split(' ')[0])));
            if (!matched?.length) return null;
            return (
              <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 7 }}>
                <div style={{ fontSize: 9, color: '#22d3ee', letterSpacing: 1.5, fontWeight: 800, marginBottom: 4 }}>✓ TARGETS YOUR WATER</div>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {matched.map((m: string) => <span key={m} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(34,211,238,0.12)', color: '#22d3ee', fontWeight: 700 }}>{m}</span>)}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Pros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {p.pros?.slice(0, 2).map((pro: string) => (
            <div key={pro} style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#22d3ee', fontWeight: 900, fontSize: 10 }}>✓</span> {pro}
            </div>
          ))}
        </div>

        {/* Price + Buy */}
        <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b', letterSpacing: -0.5 }}>${p.price}</span>
            {p.filterCostPerYear && <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>+${p.filterCostPerYear}/yr filters</span>}
          </div>
          <BuyButtons p={p} block />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTAMINANT ROW — risk badges, EPA tooltips, health context
// ─────────────────────────────────────────────────────────────────────────────
function ContaminantRow({ c }: { c: any }) {
  const [expanded, setExpanded]   = useState(false);
  const [showTooltip, setTooltip] = useState(false);
  const sev = SEV[c.severity] || SEV.low;
  const pct = c.level && c.limit ? Math.min((c.level / (c.limit * 1.5)) * 100, 100) : 0;
  const hasCtx = c.healthEffects || c.healthSources || c.epaAction;

  // How many × above limit
  const timesOver = c.level && c.limit && c.level > c.limit ? (c.level / c.limit).toFixed(1) : null;
  // Risk icon
  const riskIcon = c.severity === 'high' ? '🔴' : c.severity === 'moderate' ? '🟡' : '🟢';

  return (
    <div style={{ marginBottom: 16, background: 'rgba(4,14,32,0.62)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: `1px solid ${c.severity === 'high' ? 'rgba(239,68,68,0.22)' : c.severity === 'moderate' ? 'rgba(245,158,11,0.16)' : 'rgba(255,255,255,0.07)'}`, borderTop: `1px solid ${c.severity === 'high' ? 'rgba(239,68,68,0.32)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,4,18,0.35), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
      {/* Header row */}
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14 }}>{riskIcon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
          {c.isPFAS && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430', fontWeight: 700 }}>FOREVER CHEMICAL</span>}
          {c.source && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#0e2233', color: '#94a3b8', border: '1px solid #1e3a4a' }}>{c.source}</span>}
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
          {c.level != null && c.limit != null && <span style={{ fontSize: 12, color: '#94a3b8' }}>{c.level} {c.unit} · legal limit {c.limit}</span>}
          {timesOver && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#ef444420', color: '#ef4444', fontWeight: 800, border: '1px solid #ef444440' }}>{timesOver}× OVER LIMIT</span>}
          {c.ewgTimesOver != null && c.ewgTimesOver > 1 && (
            <span title={c.ewgGuidelineLabel || 'EWG Health Guideline'} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#7c1d1d', color: '#fca5a5', fontWeight: 800, border: '1px solid #ef444440', cursor: 'help' }}>
              {c.ewgTimesOver >= 10 ? Math.round(c.ewgTimesOver) : c.ewgTimesOver}× health guideline
            </span>
          )}
          <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: sev.color + '22', color: sev.color }}>{sev.label}</span>
          {hasCtx && <button onClick={() => setExpanded(x => !x)} style={{ background: 'none', border: '1px solid #1e3a4a', borderRadius: 4, color: '#94a3b8', fontSize: 11, cursor: 'pointer', padding: '2px 7px' }}>{expanded ? 'Less ↑' : 'Health info ↓'}</button>}
        </div>
      </div>

      {/* Progress bar */}
      {c.level != null && c.limit != null && (
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{ height: 5, background: '#1e3a4a', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: sev.color, borderRadius: 3, transition: 'width 1.2s ease', boxShadow: `0 0 8px ${sev.color}66` }} />
          </div>
          {/* Level + limit labels with EPA tooltip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: sev.color, fontWeight: 600 }}>{c.level} {c.unit} detected</span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'help', fontSize: 11, color: '#94a3b8' }}
              >
                EPA limit: {c.limit} {c.unit} ℹ
              </button>
              {showTooltip && (
                <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 6, width: 260, background: '#0d2240', border: '1px solid #1e4a6e', borderRadius: 8, padding: '10px 12px', zIndex: 50, boxShadow: '0 8px 24px #00000055' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', marginBottom: 5 }}>⚖ MCL vs MCLG — What's the difference?</div>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                    The <strong style={{ color: '#f1f5f9' }}>MCL</strong> (legal limit) is set by economic feasibility, not health science. The <strong style={{ color: '#f1f5f9' }}>MCLG</strong> (health goal) — often zero for carcinogens — is the truly safe level. Water can be "legal" but still above the health goal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {c.note && <div style={{ fontSize: 11, color: '#94a3b8', padding: '0 16px 8px' }}>{c.note}</div>}

      {/* Health info expandable */}
      {hasCtx && (
        <div style={{ borderTop: '1px solid #0f2336' }}>
          <button
            onClick={() => setExpanded(x => !x)}
            style={{ width: '100%', background: 'none', border: 'none', padding: '8px 16px', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>Health effects & sources</span>
            <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
          </button>
          {expanded && (
            <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.healthEffects && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 0.5, color: '#ef4444', marginBottom: 4, fontWeight: 700 }}>HEALTH EFFECTS</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75 }}>{c.healthEffects}</div>
                </div>
              )}
              {c.healthSources && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 0.5, color: '#f59e0b', marginBottom: 4, fontWeight: 700 }}>COMMON SOURCES</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75 }}>{c.healthSources}</div>
                </div>
              )}
              {c.epaAction && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 0.5, color: '#22d3ee', marginBottom: 4, fontWeight: 700 }}>EPA ACTION</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75 }}>{c.epaAction}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PFAS HOMEPAGE BANNER
// ─────────────────────────────────────────────────────────────────────────────
function PFASAwarenessBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{ maxWidth: 720, margin: '22px auto 0', padding: '0 24px' }}>
      <div style={{ background: 'rgba(20,3,3,0.68)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(220,38,38,0.28)', borderLeft: '4px solid #ef4444', borderTop: '1px solid rgba(239,68,68,0.32)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 14, position: 'relative', boxShadow: '0 8px 32px rgba(20,3,3,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: '#94a3b8', fontSize: 16, cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: 22, flexShrink: 0 }}>☣️</div>
        <div style={{ flex: 1, paddingRight: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', letterSpacing: 0.3 }}>EPA PFAS RULE — 2024</span>
            <span style={{ fontSize: 10, padding: '1px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 3, color: '#ef4444', fontWeight: 700 }}>ENFORCEABLE MCL</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            EPA set the first federal drinking water limits for PFAS at <strong style={{ color: '#fbbf24' }}>4 ppt</strong> (rule finalized 2024). National studies have estimated tens of millions of Americans have had detectable PFAS in drinking water.
            <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6 }}>(EPA rule · CDC/USGS context)</span>
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
            <strong style={{ color: '#cbd5e1' }}>What this means for you:</strong> Limits and estimates describe population-level patterns. Your ZIP report shows what is on file for your utility — use that as the practical next step.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://www.waterdropfilter.com/?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro`} target="_blank" rel="noreferrer" style={{ padding: '5px 12px', background: '#ef4444', borderRadius: 5, color: '#fff', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>🛒 Best RO for PFAS →</a>
            <a href={`https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #dc262655', borderRadius: 5, color: '#94a3b8', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Clearly Filtered Pitcher →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PFAS IN-RESULTS ALERT
// ─────────────────────────────────────────────────────────────────────────────
function PFASResultAlert({ city, pfasLevel }: { city: string; pfasLevel?: number | string | null }) {
  const [expanded, setExpanded] = useState(false);
  const ppt = typeof pfasLevel === 'number' ? pfasLevel : Number(pfasLevel);
  if (!Number.isFinite(ppt) || ppt <= 0) return null;
  const overLimit = ppt > 4;
  return (
    <div style={{ background: overLimit ? 'linear-gradient(135deg,#200a0a,#0d0f1a)' : 'linear-gradient(135deg,#0d1208,#0d0f1a)', border: `1px solid ${overLimit ? '#ef4444' : '#f59e0b'}`, borderLeft: `4px solid ${overLimit ? '#ef4444' : '#f59e0b'}`, borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{overLimit ? '🚨' : '⚠️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: overLimit ? '#ef4444' : '#f59e0b', letterSpacing: 1 }}>PFAS DETECTED — {(city || 'Your area').toUpperCase()}</span>
            {overLimit && <span style={{ fontSize: 10, padding: '1px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 3, color: '#ef4444', fontWeight: 700 }}>EXCEEDS EPA MCL</span>}
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            {overLimit
              ? <>PFAS at <strong style={{ color: '#fbbf24' }}>{ppt.toFixed(2)} ppt</strong> — exceeds EPA 2024 MCL of 4 ppt for applicable compounds in this dataset. Many pitchers do not remove PFAS; certified RO/P473-class systems are the usual fix for drinking water.</>
              : <>PFAS at <strong style={{ color: '#fbbf24' }}>{ppt.toFixed(2)} ppt</strong> — below the 4 ppt MCL in this snapshot but still a “detection.” If you want extra margin for drinking/cooking, RO or a certified PFAS-rated filter is the typical approach.</>
            }
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
            <strong style={{ color: '#cbd5e1' }}>What this means for you:</strong> This is a utility-level monitoring snapshot, not a test of your kitchen tap today. If you need certainty for pregnancy, infants, or immunocompromised households, consider a certified lab test of your tap.
          </p>
          {expanded && <div style={{ marginBottom: 8, padding: '10px 14px', background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 7, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>PFAS are synthetic chemicals found in firefighting foam, non-stick cookware, food packaging, and industrial sites. They don't break down in the environment or human body. Linked to kidney cancer, thyroid disease, immune suppression, and developmental harm in children.</div>}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={`https://www.waterdropfilter.com/?ref=anbyjkqb&utm_medium=affiliate&utm_source=goaffpro`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', background: '#ef4444', borderRadius: 5, color: '#fff', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>🛒 Waterdrop G3P800 — PFAS &gt;99%</a>
            <a href={`https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ef444455', borderRadius: 5, color: '#94a3b8', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Clearly Filtered Pitcher</a>
            <button onClick={() => setExpanded(x => !x)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>{expanded ? 'Less ↑' : 'What are PFAS? ↓'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// DIY INSTALLATION GUIDES
// ─────────────────────────────────────────────────────────────────────────────
const DIY_GUIDES: Record<string, { time: string; difficulty: string; tools: string[]; steps: string[]; tips: string[]; youtubeQuery: string }> = {
  undersink: {
    time: '1.5-3 hours', difficulty: 'Medium',
    tools: ['Adjustable wrench','Drill + 1.5" hole saw (for faucet)','Teflon tape','Bucket or towels','Safety glasses'],
    steps: [
      'Clear under the sink and turn off the cold water supply valve.',
      'Mount the filter housing on the back wall of the cabinet using the included bracket and screws.',
      'Use the hole saw to drill through the sink or countertop for the dedicated RO faucet.',
      'Connect the cold water feed line to the system input using the push-fit connector and saddle valve.',
      'Route the drain line to the drain pipe using the self-piercing drain saddle clamp.',
      'Connect the output line to the RO faucet you installed in step 3.',
      'If your system includes a storage tank, connect it with the tank valve and ball valve.',
      'Turn the water supply back on slowly. Check every connection for leaks  --  tighten if needed.',
      'Run 2-3 full tank cycles (fill and drain) to flush the new filters before drinking.',
    ],
    tips: [
      'Use Teflon tape on all threaded connections  --  3 wraps clockwise.',
      'Most systems come with color-coded tubing  --  follow the manual\'s color guide exactly.',
      'The drain saddle clamp should go 6-12 inches above the P-trap to prevent backflow.',
      'If water pressure is below 40 PSI you may need a booster pump (most systems include one).',
      'Label your shutoff valves so you can find them quickly for filter changes.',
    ],
    youtubeQuery: 'under sink reverse osmosis installation DIY',
  },
  countertop: {
    time: '5-10 minutes', difficulty: 'None',
    tools: ['None  --  just your hands'],
    steps: [
      'Unbox the unit and remove all packing materials and protective films.',
      'Install the filter cartridge(s) by twisting into place per the color-coded arrows.',
      'Connect the included adapter to your existing faucet by unscrewing the aerator and screwing on the diverter valve.',
      'Connect the RO unit\'s input tube to the diverter valve.',
      'Place the unit on your countertop near the sink.',
      'Turn on the faucet, flip the diverter to RO mode, and run water for 5 minutes to flush.',
      'Your water is ready. Switch the diverter back to normal mode when not using.',
    ],
    tips: [
      'If the adapter doesn\'t fit your faucet, most systems include multiple adapter sizes.',
      'Keep the unit level for best performance  --  it should not be tilted.',
      'Run a fresh flush cycle after the unit has sat unused for 24+ hours.',
      'Countertop RO units make great travel companions  --  they pack up in minutes.',
    ],
    youtubeQuery: 'countertop reverse osmosis system setup installation',
  },
  pitcher: {
    time: '2 minutes', difficulty: 'None',
    tools: ['None'],
    steps: [
      'Remove the filter from its packaging.',
      'For most filters: soak the new filter cartridge in cold water for 15 minutes.',
      'Insert the filter into the reservoir by twisting until it locks into place.',
      'Fill the top reservoir with cold tap water and let it filter through.',
      'Discard the first 2-3 pitchers of filtered water (this flushes carbon fines).',
      'Your pitcher is ready  --  store in the refrigerator.',
    ],
    tips: [
      'Never use hot water in a pitcher filter  --  it can damage the media.',
      'Most pitchers need filter replacement every 2-3 months (or 40 gallons). Set a phone reminder.',
      'Clearly Filtered filters need no pre-soaking  --  just install and use.',
      'Keep the pitcher in the fridge to inhibit bacterial growth.',
    ],
    youtubeQuery: 'water filter pitcher how to use setup',
  },
  faucet: {
    time: '5-10 minutes', difficulty: 'Easy',
    tools: ['None (hand-tighten only)'],
    steps: [
      'Turn off the faucet.',
      'Unscrew the existing aerator from the faucet tip (turn counterclockwise).',
      'Select the correct adapter from the included set  --  try threading each to find the right fit.',
      'Screw the filter adapter onto the faucet tip, then attach the filter housing.',
      'Turn the faucet on cold. Check for leaks around the connection.',
      'Use the lever or button on the filter to switch between filtered and unfiltered mode.',
    ],
    tips: [
      'Hand-tighten only  --  tools can crack the plastic housing.',
      'If water sprays from the sides, try a different adapter size from the included set.',
      'Pull-out and pull-down faucets are usually NOT compatible  --  check before buying.',
      'Replace the filter cartridge every 100 gallons or 3 months, whichever comes first.',
    ],
    youtubeQuery: 'faucet mount water filter installation how to',
  },
  shower: {
    time: '5 minutes', difficulty: 'Easy',
    tools: ['Adjustable wrench or pliers','Teflon tape','Towel to clean threads'],
    steps: [
      'Turn off the shower water supply or just make sure the handle is off.',
      'Unscrew the existing showerhead from the shower arm (turn counterclockwise  --  may need pliers).',
      'Wrap the shower arm threads with 3 layers of Teflon tape clockwise.',
      'Screw the filter housing onto the shower arm. Hand-tighten, then one more quarter-turn with pliers.',
      'Attach the showerhead to the outlet of the filter housing.',
      'Turn on the shower and run for 30 seconds to flush the new filter.',
    ],
    tips: [
      'Don\'t overtighten  --  one quarter-turn past hand-tight is enough.',
      'Most shower filters fit any standard 1/2" NPT shower arm  --  the US standard.',
      'Replace the filter cartridge every 10,000-15,000 gallons (about every 6 months for a family of 4).',
      'If you have a handheld showerhead, use the filter as an in-line connection between the hose and the wall mount.',
    ],
    youtubeQuery: 'shower filter installation how to replace',
  },
  whole: {
    time: '2-4 hours', difficulty: 'Hard',
    tools: ['Pipe cutter or hacksaw','Compression fittings or soldering kit','Adjustable wrenches (2)','Thread seal tape','Pipe brackets','Drill','Level','Bucket and towels'],
    steps: [
      'FIRST: Locate your main water shut-off valve and turn off water to the entire house. Open a faucet to relieve pressure.',
      'Choose your installation location  --  ideally where the main supply enters the house, before the water heater.',
      'Mark and cut the main supply line using a pipe cutter. This is the point of no return  --  measure twice.',
      'Install bypass valves on both sides of the cut  --  this lets you service the filter without shutting off house water in the future.',
      'Mount the filter housing bracket to the wall using a level. The housing must be vertical.',
      'Connect the inlet and outlet ports to the supply line using compression fittings or sweat connections.',
      'Install the filter cartridge(s) into the housing per the manual.',
      'Slowly turn the main water supply back on. Walk through the house checking every connection for drips.',
      'Open the bypass valves fully. Run all cold water taps for 5 minutes to flush the new filters.',
    ],
    tips: [
      'If you\'re not comfortable cutting your main supply line, hire a licensed plumber  --  this is the one filter where it\'s often worth it.',
      'Always install bypass valves  --  they\'ll save you hours during future filter changes.',
      'The filter should go BEFORE the water softener if you have one.',
      'Take photos of your plumbing before you start  --  invaluable if you need to explain anything to a plumber later.',
      'Check local codes  --  some municipalities require a licensed plumber for main line work.',
    ],
    youtubeQuery: 'whole house water filter installation main line DIY',
  },
  distiller: {
    time: '10 minutes', difficulty: 'None',
    tools: ['White vinegar (for periodic descaling)','Soft cloth'],
    steps: [
      'Place the distiller on a level, heat-safe countertop near a grounded outlet (kitchen counter is ideal).',
      'Rinse the boil chamber and collection jug before first use per the manual.',
      'Fill the boil chamber to the marked line with cold tap water — do not overfill.',
      'If included, install the activated carbon sachet or post-filter on the spout as directed.',
      'Press start and let a full cycle complete; discard the first batch or two if the manual recommends a break-in flush.',
      'After each cycle, empty rinse residue from the boil chamber and wipe scale buildup weekly or when you see white film.',
    ],
    tips: [
      'Descale regularly with vinegar or citric acid — mineral buildup slows output and can shorten element life.',
      'Distillation removes minerals — water can taste flat; some people add trace minerals back for taste.',
      'Very volatile organics can co-distill slightly — carbon post-filters (included on many units) help polish taste and VOCs.',
      'Distillers use electricity and time; plan batches for cooking/drinking rather than all-day high flow.',
    ],
    youtubeQuery: 'countertop water distiller how to use clean descale',
  },
};

function DIYGuidePanel({ cat }: { cat: string }) {
  const [open, setOpen] = useState(false);
  const guide = DIY_GUIDES[cat] || DIY_GUIDES['undersink'];
  const diffColor = { None: '#22d3ee', Easy: '#22d3ee', Medium: '#f59e0b', Hard: '#ef4444' }[guide.difficulty] || '#22d3ee';
  return (
    <div style={{ marginTop: 14, background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 10, overflow: 'hidden' }}>
      <button onClick={() => setOpen(x => !x)} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🔧</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>DIY Installation Guide</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{guide.time} · {guide.tools.length} tools needed</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: diffColor + '22', color: diffColor, fontWeight: 700 }}>{guide.difficulty}</span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #0e2233' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginTop: 14, marginBottom: 14 }}>
            <div style={{ background: '#060e17', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1, marginBottom: 6 }}>TOOLS NEEDED</div>
              {guide.tools.map((t,i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>• {t}</div>)}
            </div>
            <div style={{ background: '#060e17', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#f59e0b', letterSpacing: 1, marginBottom: 6 }}>PRO TIPS</div>
              {guide.tips.map((t,i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 4 }}>💡 {t}</div>)}
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#22d3ee', letterSpacing: 1, marginBottom: 10 }}>STEP-BY-STEP INSTALLATION</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {guide.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 24, height: 24, background: '#0891b2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i+1}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, paddingTop: 3 }}>{s}</div>
              </div>
            ))}
          </div>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(guide.youtubeQuery)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '8px 14px', background: '#dc2626', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            ▶ Watch Video Tutorial on YouTube →
          </a>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTY COMPARISON
// ─────────────────────────────────────────────────────────────────────────────
function CountyComparison({ pwsid }: { pwsid: string }) {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const load = async () => {
    if (data || loading) { setOpen(x => !x); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/county?pwsid=${pwsid}`);
      const json = await res.json();
      setData(json);
      setOpen(true);
    } catch { setData({ utilities: [], county: 'Unknown' }); setOpen(true); }
    setLoading(false);
  };

  const utils = data?.utilities || [];
  return (
    <div style={{ marginBottom: 18 }}>
      <button onClick={load} style={{ width: '100%', background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🗺️</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Compare All Utilities in Your County</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>See how your water ranks against neighbors</div>
          </div>
        </div>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>
          {loading ? '⏳' : open ? '▲' : '▼'}
        </span>
      </button>
      {open && data && (
        <div style={{ background: '#060e17', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '12px 16px' }}>
          {data.county && <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1, marginBottom: 10 }}>{data.county.toUpperCase()} — {utils.length} PUBLIC WATER SYSTEMS</div>}
          {utils.length === 0 ? (
            <div style={{ fontSize: 13, color: '#94a3b8', padding: '8px 0' }}>County data not available for this system.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0e2233' }}>
                    {['Utility','City','Population','Source','Open Violations','Total Violations'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {utils.map((u: any, i: number) => (
                    <tr key={i} style={{ background: u.isCurrent ? '#0e2545' : i % 2 === 0 ? '#0b1828' : 'transparent', borderBottom: '1px solid #0a1520' }}>
                      <td style={{ padding: '8px 8px', color: u.isCurrent ? '#22d3ee' : '#e2e8f0', fontWeight: u.isCurrent ? 700 : 400, whiteSpace: 'nowrap' }}>
                        {u.isCurrent ? '▶ ' : ''}
                        {(() => {
                          const nm = typeof u.name === 'string' ? u.name : '—';
                          return nm.length > 30 ? `${nm.slice(0, 28)}…` : nm;
                        })()}
                      </td>
                      <td style={{ padding: '8px 8px', color: '#94a3b8' }}>{u.city ?? '—'}</td>
                      <td style={{ padding: '8px 8px', color: '#94a3b8', textAlign: 'right' }}>{Number(u.population || 0).toLocaleString()}</td>
                      <td style={{ padding: '8px 8px', color: '#94a3b8' }}>{u.sourceLabel}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                        <span style={{ color: u.openViolations > 0 ? '#ef4444' : '#22d3ee', fontWeight: 700 }}>{u.openViolations}</span>
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                        <span style={{ color: u.totalViolations > 5 ? '#f59e0b' : '#94a3b8' }}>{u.totalViolations}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NATIONAL PERCENTILE
// ─────────────────────────────────────────────────────────────────────────────
function NationalPercentile({ pct }: { pct: number }) {
  const n = Number(pct);
  const valid = Number.isFinite(n) && n >= 0;
  const clamped = valid ? Math.min(100, n) : 0;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    if (!valid) return;
    const t = setTimeout(() => setAnim(clamped), 400);
    return () => clearTimeout(t);
  }, [clamped, valid]);
  if (!valid) return null;
  const color = clamped >= 75 ? '#22d3ee' : clamped >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
      <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#94a3b8', marginBottom: 7 }}>NATIONAL WATER QUALITY RANKING</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 7, background: '#1e3a4a', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${anim}%`, background: 'linear-gradient(90deg,#ef4444,#f59e0b,#22d3ee)', borderRadius: 4, transition: 'width 1.2s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: '#334155' }}><span>Worst</span><span>Average</span><span>Best</span></div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color }}>{anim}<span style={{ fontSize: 12, color: '#94a3b8' }}>th %ile</span></div>
          <div style={{ fontSize: 10, color: '#334155' }}>vs all US water</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.55, marginTop: 10 }}>
        <strong style={{ color: '#cbd5e1' }}>What this means for you:</strong> This ranks your system against others in our combined national view — useful context, not a diagnosis. See{' '}
        <Link href="/methodology" style={{ color: '#38bdf8', fontWeight: 600 }}>
          how we calculate it
        </Link>
        .
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA SOURCES BADGES
// ─────────────────────────────────────────────────────────────────────────────
function DataSourcesBadges({ sources }: { sources: string[] }) {
  const meta: Record<string, { color: string; icon: string }> = {
    'EPA SDWIS': { color: '#0891b2', icon: '🏛️' }, 'EPA UCMR5 PFAS': { color: '#ef4444', icon: '🧪' },
    'EWG Tap Water Atlas': { color: '#d97706', icon: '🌿' }, 'USGS NWIS': { color: '#7c3aed', icon: '💧' },
    'UCMR5 Lithium': { color: '#22d3ee', icon: '⚗️' },
  };
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
      {sources.map(s => { const m = meta[s] || { color: '#94a3b8', icon: '📊' }; return (
        <span key={s} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: m.color + '15', border: `1px solid ${m.color}40`, color: m.color, fontWeight: 700 }}>{m.icon} {s}</span>
      );})}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SITUATION-BASED SOLUTIONS TAB
// ─────────────────────────────────────────────────────────────────────────────
function SolutionsTab({ data, contaminantNames }: { data: any; contaminantNames: string[] }) {
  const [situation, setSituation] = useState('homeowner');
  const cfg = SITUATION_CONFIG[situation];
  const diyColors: Record<string, string> = { None: '#22d3ee', Easy: '#22d3ee', Medium: '#f59e0b', Hard: '#ef4444' };

  // Filter products by situation — exclude remineralizing systems, boost quick-change
  const situationProds = PRODUCTS.filter(p => p.situations?.includes(situation) && !p.remineralizes);
  const hasPFAS = contaminantNames.some(n => n.toLowerCase().includes('pfas') || n.toLowerCase().includes('pfoa') || n.toLowerCase().includes('pfos'));
  const ranked = situationProds.map(p => ({
    ...p,
    score: p.bestFor.filter((b: string) => contaminantNames.some(n => n.includes(b))).length +
           (hasPFAS && p.bestFor.includes('PFAS') ? 2 : 0) +
           (p.quickChange ? 2 : 0),
  })).sort((a, b) => b.score - a.score);

  // Group by category
  const byCategory: Record<string, any[]> = {};
  for (const p of ranked) {
    if (!byCategory[p.cat]) byCategory[p.cat] = [];
    byCategory[p.cat].push(p);
  }

  return (
    <div style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
      {/* Affiliate disclosure */}
      <p style={{ fontSize: 11, color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
        Some links below are affiliate links. If you buy through one, we may earn a small commission at no extra cost to you. This doesn&apos;t influence our recommendations.
      </p>
      {/* Situation selector */}
      <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 14, fontWeight: 700 }}>I AM A / I LIVE IN A…</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SITUATIONS.map(s => (
          <button key={s.id} onClick={() => setSituation(s.id)} style={{ padding: '8px 14px', background: situation === s.id ? 'rgba(8,145,178,0.28)' : 'rgba(4,14,32,0.60)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${situation === s.id ? 'rgba(6,182,212,0.55)' : 'rgba(255,255,255,0.07)'}`, borderTop: `1px solid ${situation === s.id ? 'rgba(180,240,255,0.45)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 8, color: situation === s.id ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: situation === s.id ? '0 4px 20px rgba(8,145,178,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            <span>{s.icon}</span><span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Situation header */}
      <div style={{ background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 10, padding: '16px 18px', marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#22d3ee', marginBottom: 6 }}>{cfg.headline}</div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 10px' }}>{cfg.description}</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#ef4444', marginBottom: 4, fontWeight: 700 }}>AVOID</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{cfg.avoid}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#22d3ee', marginBottom: 4, fontWeight: 700 }}>💡 PRO TIP</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{cfg.tip}</div>
          </div>
        </div>
      </div>

      {/* Products by category */}
      {Object.entries(byCategory).map(([cat, prods]) => (
        <div key={cat} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 12, fontWeight: 700 }}>{prods[0].catLabel.toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {prods.slice(0, 3).map((p, i) => <ProductCard key={p.id} p={p} highlight={i === 0 && p.score > 0} compact={true} detectedContaminants={contaminantNames} />)}
          </div>
          <DIYGuidePanel cat={cat} />
        </div>
      ))}

      {/* Installation help */}
      <div style={{ background: 'linear-gradient(135deg,#0d2240,#0b1e36)', border: '1px solid #0891b230', borderRadius: 10, padding: '16px 18px', marginTop: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 10, fontWeight: 700 }}>🔧 INSTALLATION QUICK REFERENCE</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { level: 'None', desc: 'Pitcher, countertop RO — plug in and use', color: '#22d3ee' },
            { level: 'Easy', desc: 'Faucet mount, shower filter — 5-15 min, no tools', color: '#22d3ee' },
            { level: 'Medium', desc: 'Under-sink RO — 2-3 hrs, basic plumbing, shutoff valve', color: '#f59e0b' },
            { level: 'Hard', desc: 'Whole-house — requires pipe work, hire a pro', color: '#ef4444' },
          ].map(d => (
            <div key={d.level} style={{ flex: 1, minWidth: 140, background: '#0d2240', borderRadius: 6, padding: '10px 12px', border: `1px solid ${d.color}25` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: d.color, marginBottom: 3 }}>{d.level}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES TAB
// ─────────────────────────────────────────────────────────────────────────────
function ResourcesTab({ data }: { data: any }) {
  const stateDb = data?.stateCode ? STATE_DB[data.stateCode] : null;
  const sdwisPwsUrl = data?.pwsid
    ? `https://sdwis.epa.gov/ords/sfdw_pub/f?p=SDWIS_FED_REPORTS_PUBLIC:PWS_SEARCH::::::PWSID:${encodeURIComponent(data.pwsid)}`
    : 'https://sdwis.epa.gov/ords/sfdw_pub/f?p=SDWIS_FED_REPORTS_PUBLIC';

  const resources: {
    cat: string;
    items: { name: string; url: string; desc: string; sponsored?: boolean }[];
  }[] = [
    { cat: '🏛️ FEDERAL', items: [
      { name: 'EPA SDWIS — Violation Search', url: `https://ofmpub.epa.gov/apex/sfdw/f?p=108:103::::::`, desc: 'Search violations for any water system nationwide' },
      { name: 'EPA Safe Drinking Water Search', url: `https://www.epa.gov/sdwa/safe-drinking-water-hotline`, desc: 'Official EPA drinking water information' },
      { name: 'EPA UCMR5 PFAS Data', url: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule', desc: '2023-2025 PFAS monitoring — 6,000+ water systems' },
      { name: `EPA SDWIS — Your system (PWSID: ${data?.pwsid || ' — '})`, url: sdwisPwsUrl, desc: 'Federal violation and facility record for this water system ID' },
      { name: 'Find Consumer Confidence Report (annual PDF)', url: 'https://sdwis.epa.gov/fylccr', desc: 'EPA search tool for utility-submitted annual water quality reports' },
      { name: 'EPA ECHO Enforcement', url: `https://echo.epa.gov/`, desc: 'Enforcement actions and inspection history' },
      { name: 'EPA Certified Lab Finder', url: 'https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water', desc: 'Find a state-certified lab in your state' },
    ]},
    { cat: '🌿 EWG & ADVOCACY', items: [
      { name: 'EWG Tap Water Atlas', url: 'https://www.ewg.org/tapwater/?utm_source=watercheckup', desc: 'EWG\'s national tap water contamination database' },
      { name: 'PFAS Exchange — Industrial Sites', url: 'https://pfasproject.com/', desc: 'Map of PFAS contamination sources and industrial sites' },
      { name: 'NRDC Drinking Water Report', url: 'https://www.nrdc.org/issues/drinking-water', desc: 'NRDC\'s national water safety resources' },
    ]},
    { cat: '⚗️ TESTING LABS', items: [
      { name: 'SimpleLab Tap Score', url: SIMPLELAB_HOME_URL, desc: 'Mail-in water test kits — comprehensive panels starting at $89', sponsored: true },
    ]},
    { cat: '🔧 INSTALLER RESOURCES', items: [
      { name: 'WQA Certified Installer Directory', url: 'https://find.wqa.org/find-providers', desc: 'Find WQA-certified water treatment professionals near you' },
      { name: 'Find a Pro on Angi (HomeAdvisor)', url: `https://www.angi.com/nearme/water-treatment/`, desc: 'Local water treatment and plumbing installers with reviews' },
      { name: 'HomeAdvisor Water Softener Pros', url: 'https://www.homeadvisor.com/task.Water-Softener-or-Water-Filter-Install.html', desc: 'Get quotes from local water filter installers' },
    ]},
  ];

  if (stateDb) {
    resources[0].items.push({ name: stateDb.name, url: stateDb.url, desc: `State-level water quality database for ${data.stateCode}` });
  }

  return (
    <div style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
      <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 20, fontWeight: 700 }}>OFFICIAL DATA SOURCES & RESOURCES</div>
      {resources.map(section => (
        <div key={section.cat} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: 700 }}>{section.cat}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {section.items.map(r => (
              <a key={r.name} href={r.url} target="_blank" rel={'sponsored' in r && r.sponsored ? 'noopener noreferrer sponsored' : 'noreferrer'} style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 7, padding: '10px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.desc}</div>
                </div>
                <span style={{ color: '#334155', fontSize: 14, flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'linear-gradient(135deg,#0d2240,#0b1e36)', border: '1px solid #7c3aed30', borderRadius: 10, padding: '16px 18px', marginTop: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#7c3aed', marginBottom: 8, fontWeight: 700 }}>🧪 GET YOUR WATER TESTED</div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
          This site uses EPA and EWG aggregate data. For the most accurate results specific to <strong style={{ color: '#e2e8f0' }}>your home</strong>, order a mail-in test from SimpleLab (Tap Score). Your municipal supply may be clean but your home&apos;s pipes could add lead or other contaminants.
        </p>
        <a href={SIMPLELAB_HOME_URL} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'inline-block', padding: '7px 14px', background: '#7c3aed', borderRadius: 5, color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>SimpleLab Tap Score — from $89 →</a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER COMPARISON TABLE
// ─────────────────────────────────────────────────────────────────────────────
function FilterCompareTab() {
  const cols = [
    { id: 3,  label: 'Waterdrop G3P800' },
    { id: 5,  label: 'Aquasana SmartFlow' },
    { id: 28, label: 'AquaTru Under-Sink' },
    { id: 6,  label: 'Waterdrop K19-S' },
    { id: 9,  label: 'Clearly Filtered' },
    { id: 18, label: 'Pelican PC600' },
  ];
  const prods = cols.map(c => PRODUCTS.find(p => p.id === c.id)!).filter(Boolean);

  const check = (v: boolean) => v ? <span style={{ color: '#22d3ee', fontSize: 16 }}>✓</span> : <span style={{ color: '#1e3a4a', fontSize: 14 }}>—</span>;

  const rows: { label: string; fn: (p: any) => React.ReactNode }[] = [
    { label: 'Price',              fn: p => <span style={{ color: '#38bdf8', fontWeight: 800 }}>${p.price}</span> },
    { label: 'Filter Cost/yr',     fn: p => p.filterCostPerYear ? `$${p.filterCostPerYear}` : '—' },
    { label: 'Type',               fn: p => p.catLabel },
    { label: 'Stages',             fn: p => p.stages ?? '—' },
    { label: 'Flow (GPD)',         fn: p => p.gpd ?? 'N/A' },
    { label: 'Removes PFAS',       fn: p => check(p.bestFor.includes('PFAS')) },
    { label: 'Removes Lead',       fn: p => check(p.bestFor.includes('Lead')) },
    { label: 'Removes Fluoride',   fn: p => check(p.removes.some((r: string) => r.toLowerCase().includes('fluoride'))) },
    { label: 'Removes Arsenic',    fn: p => check(p.bestFor.includes('Arsenic')) },
    { label: 'Quick-Change',       fn: p => check(!!p.quickChange) },
    { label: 'No Install',         fn: p => check(p.diyDiff === 'None') },
    { label: 'Expert Pick',        fn: p => check(!!p.expertPick) },
    { label: 'Install Difficulty', fn: p => {
      const colors: Record<string,string> = { None: '#22d3ee', Easy: '#22d3ee', Medium: '#f59e0b', Hard: '#ef4444' };
      return <span style={{ color: colors[p.diyDiff] || '#94a3b8', fontWeight: 700 }}>{p.diyDiff}</span>;
    }},
    { label: 'Rating',             fn: p => <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(p.rating))} {p.rating}</span> },
  ];

  return (
    <div style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '22px 16px', overflowX: 'auto', boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
      <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 16 }}>SIDE-BY-SIDE FILTER COMPARISON — TOP PICKS</div>
      <table className="wc-compare-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 10px', color: '#334155', fontSize: 11, background: '#091c35', borderBottom: '2px solid #0e2233', position: 'sticky', left: 0 }}>Feature</th>
            {prods.map(p => (
              <th key={p.id} style={{ padding: '8px 10px', color: p.expertPick ? '#22d3ee' : '#94a3b8', fontSize: 11, background: '#091c35', borderBottom: `2px solid ${p.expertPick ? '#0891b2' : '#0e2233'}`, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {p.expertPick && <span style={{ fontSize: 9, display: 'block', color: '#f59e0b', marginBottom: 2 }}>🏅 EXPERT PICK</span>}
                {p.name.length > 18 ? p.name.slice(0, 17) + '…' : p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.label} style={{ background: ri % 2 === 0 ? '#0b1e36' : '#091c35' }}>
              <td style={{ padding: '9px 10px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #0e2233', position: 'sticky', left: 0, background: ri % 2 === 0 ? '#0b1e36' : '#091c35', whiteSpace: 'nowrap' }}>{row.label}</td>
              {prods.map(p => (
                <td key={p.id} style={{ padding: '9px 10px', textAlign: 'center', color: '#94a3b8', borderBottom: '1px solid #0e2233' }}>{row.fn(p)}</td>
              ))}
            </tr>
          ))}
          <tr style={{ background: '#071525' }}>
            <td style={{ padding: '12px 10px', position: 'sticky', left: 0, background: '#071525' }} />
            {prods.map(p => (
              <td key={p.id} style={{ padding: '12px 10px', textAlign: 'center' }}>
                <a href={p.amazon} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '7px 12px', background: 'linear-gradient(135deg,#d97706,#f59e0b)', borderRadius: 6, color: '#000', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>Buy →</a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 14, fontSize: 11, color: '#334155', textAlign: 'center' }}>
        ✓ = Certified removal · — = Not designed for this · All products NSF/WQA certified
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE REPORT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ShareModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const scoreColor = data.score >= 80 ? 'GOOD' : data.score >= 65 ? 'MODERATE' : 'POOR';
  const text = [
    `💧 WaterCheckup Report`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📍 ${data.systemName}`,
    `   ${data.city} · PWSID: ${data.pwsid}`,
    ``,
    `📊 Score: ${data.score}/100 (Grade: ${data.grade}) — ${scoreColor}`,
    data.totalViolations > 0
      ? `⚠️  ${data.totalViolations} violation(s) on record${data.openViolations > 0 ? ` · ${data.openViolations} open` : ' · all resolved'}`
      : `✅  No violations on record`,
    data.pfasCount > 0
      ? `🧪 PFAS detected in water system`
      : `✅  No PFAS detected (UCMR5)`,
    ``,
    `Get your free report at:`,
    `🌐 watercheckup.com`,
  ].join('\n');

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={onClose}>
      <div style={{ background: 'rgba(3,12,28,0.88)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.09)', borderTop: '1px solid rgba(255,255,255,0.16)', borderRadius: 16, padding: '28px 28px', boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.09)', maxWidth: 420, width: '92%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>Share Your Water Report</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        {/* Preview card */}
        <div style={{ background: '#071525', border: '1px solid #1a3a5c', borderRadius: 10, padding: '16px', marginBottom: 16, fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {text}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={copy} style={{ flex: 1, padding: '10px', background: copied ? '#064e3b' : 'linear-gradient(135deg,#0891b2,#06b6d4)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My ${data.city} tap water scored ${data.score}/100 on the EPA's SDWIS data via @WaterCheckup. Check yours free 💧\nwatercheckup.com`)}`}
            target="_blank" rel="noreferrer"
            style={{ padding: '10px 16px', background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#94a3b8', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            𝕏 Tweet
          </a>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// WELL WATER PANEL
// ─────────────────────────────────────────────────────────────────────────────
function WellWaterPanel({ stateCode }: { stateCode: string }) {
  const risks = WELL_RISKS[stateCode] ?? WELL_RISKS['OH'];
  const sevLabel: Record<string, string> = { high:'High Risk', moderate:'Moderate Risk', low:'Lower Risk' };
  const wellProducts = [
    ...PRODUCTS.filter(p => p.well),
    ...PRODUCTS.filter(p => !p.well && !p.remineralizes && p.cat === 'undersink' && p.bestFor.includes('Arsenic')).sort((a,b) => (b.quickChange ? 1 : 0) - (a.quickChange ? 1 : 0)).slice(0,2),
  ];
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, padding: '20px 24px', background: 'linear-gradient(135deg,rgba(5,18,42,0.9),rgba(2,8,20,0.95))', border: '1px solid rgba(120,80,255,0.3)', borderRadius: 12, boxShadow: '0 8px 32px rgba(120,80,255,0.15)' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#a78bfa', fontWeight: 800, marginBottom: 8 }}>PRIVATE WELL · {stateCode} STATE RISK PROFILE</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f9ff', marginBottom: 8 }}>Well Water Risks in Your Area</div>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.7 }}>
          Private wells are <strong style={{ color: '#e2e8f0' }}>not regulated by the EPA</strong> — you are responsible for your own testing and treatment. The risks below are based on USGS and EPA groundwater data for {stateCode}. Test your well annually.
        </p>
      </div>

      {/* Risk cards */}
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#7c3aed', fontWeight: 800, marginBottom: 14 }}>COMMON CONTAMINANTS — {stateCode} WELL WATER</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {risks.map((r) => (
          <div key={r.name} style={{ padding: '14px 18px', background: 'rgba(3,12,28,0.7)', border: `1px solid ${r.color}33`, borderLeft: `3px solid ${r.color}`, borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44` }}>{sevLabel[r.sev]}</span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginBottom: 6 }}>{r.why}</div>
            <div style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600 }}>✓ {r.fix}</div>
          </div>
        ))}
      </div>

      {/* Lab test CTA */}
      <div style={{ marginBottom: 32, padding: '18px 22px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', marginBottom: 8 }}>⚗️ STEP 1 — TEST YOUR WELL FIRST</div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.7 }}>
          Before buying any filter, get a certified lab test. You need to know exactly what&apos;s in your water to choose the right treatment system. You can also use the{' '}
          <a href="https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', fontWeight: 700 }}>EPA certified lab finder</a>
          {' '}to locate a state-certified lab near you.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <a href={SIMPLELAB_WELL_TESTS_URL} target="_blank" rel="noopener noreferrer sponsored" style={{ padding: '8px 16px', background: '#7c3aed', borderRadius: 7, color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>SimpleLab Well Test — from $99 →</a>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>BUDGET OPTION — AMAZON QUICK-CHECK KITS</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={`https://www.amazon.com/dp/B01LZMXS5P?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #47556955', borderRadius: 7, color: '#94a3b8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>🧪 Safe Home 200-Parameter Test — $30 →</a>
          <a href={`https://www.amazon.com/dp/B00BPTYJMO?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #47556955', borderRadius: 7, color: '#94a3b8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>🧪 First Alert Bacteria Test — $15 →</a>
        </div>
      </div>

      {/* Product recommendations */}
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#7c3aed', fontWeight: 800, marginBottom: 16 }}>STEP 2 — RECOMMENDED FILTERS FOR WELL WATER</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {wellProducts.map((p: any) => <ProductCard key={p.id} p={p} highlight={!!p.expertPick} detectedContaminants={risks.map(r => r.name)} />)}
      </div>

      {/* ACID NEUTRALIZER BANNER — acidic well water states */}
      {ACIDIC_STATES.has(stateCode) && (
        <div style={{ marginTop: 28, padding: '18px 20px', background: 'linear-gradient(135deg,rgba(5,38,20,0.5),rgba(10,20,40,0.7))', border: '1px solid rgba(34,197,94,0.35)', borderTop: '1px solid rgba(74,222,128,0.4)', borderRadius: 12, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>⚗️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#4ade80', letterSpacing: 0.5 }}>Acidic Well Water Alert — {stateCode}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {stateCode && ['ME','NH','VT','MA','CT','RI','NY','NJ','PA','MD','WV','VA','DE'].includes(stateCode)
                  ? 'Granite/crystalline bedrock in this region produces naturally low-pH water (commonly pH 5.5–6.5).'
                  : 'Sandy, low-mineral soils in this region often yield acidic well water (commonly pH 6.0–6.8).'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>
            Acidic water (pH below 7) is <strong style={{ color: '#4ade80' }}>corrosive to copper and lead pipes</strong> — it leaches those metals directly into your drinking water even if the aquifer itself is clean. Blue-green staining on fixtures is the telltale sign.
            The fix: <strong style={{ color: '#4ade80' }}>whole-house calcite acid neutralizer</strong> installed at the point of entry. Calcite media dissolves slowly to raise pH naturally — no chemicals, no electricity.
          </div>
          <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#15803d', marginBottom: 10, fontWeight: 700 }}>RECOMMENDED ACID NEUTRALIZERS FOR WELL WATER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
            {PRODUCTS.filter(p => p.acidNeutralizer).map((p: any) => <ProductCard key={p.id} p={p} highlight={true} detectedContaminants={['Low pH','Acidic Water']} />)}
          </div>
        </div>
      )}

      {/* HARD WATER SOFTENER BANNER — hard water states on well */}
      {(HARDNESS[stateCode] === 'very_hard' || HARDNESS[stateCode] === 'hard') && (
        <div style={{ marginTop: 20, padding: '18px 20px', background: 'linear-gradient(135deg,rgba(120,53,15,0.35),rgba(10,20,40,0.7))', border: '1px solid rgba(251,191,36,0.35)', borderTop: '1px solid rgba(253,224,100,0.4)', borderRadius: 12, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>🪨</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: 0.5 }}>
                {HARDNESS[stateCode] === 'very_hard' ? 'Very Hard Water Area' : 'Hard Water Area'} — {stateCode}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {HARDNESS[stateCode] === 'very_hard'
                  ? 'Among the highest mineral content in the US. Well water in this area commonly has very high calcium and magnesium.'
                  : 'Elevated calcium and magnesium from limestone aquifers — scale buildup on appliances and fixtures.'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>
            Hard well water destroys water heaters, dishwashers, and washing machines over time. A whole-house water softener protects every appliance, pipe, and fixture in your home.
            For drinking water, pair with the <strong style={{ color: '#fbbf24' }}>RO system above</strong> — RO also removes hardness minerals from your drinking supply.
          </div>
          <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#b45309', marginBottom: 10, fontWeight: 700 }}>RECOMMENDED SOFTENERS FOR HARD WELL WATER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
            {PRODUCTS.filter(p => p.softener).map((p: any) => <ProductCard key={p.id} p={p} highlight={p.id === 39} detectedContaminants={['Hardness','Scale']} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// CITY → ZIP LOOKUP — maps common city names to a representative ZIP
// ─────────────────────────────────────────────────────────────────────────────
const CITY_ZIP_MAP: Record<string, { zip: string; city: string; state: string }> = {
  'chicago': { zip: '60601', city: 'Chicago', state: 'IL' },
  'los angeles': { zip: '90001', city: 'Los Angeles', state: 'CA' },
  'la': { zip: '90001', city: 'Los Angeles', state: 'CA' },
  'houston': { zip: '77001', city: 'Houston', state: 'TX' },
  'new york': { zip: '10001', city: 'New York City', state: 'NY' },
  'nyc': { zip: '10001', city: 'New York City', state: 'NY' },
  'new york city': { zip: '10001', city: 'New York City', state: 'NY' },
  'phoenix': { zip: '85001', city: 'Phoenix', state: 'AZ' },
  'philadelphia': { zip: '19101', city: 'Philadelphia', state: 'PA' },
  'philly': { zip: '19101', city: 'Philadelphia', state: 'PA' },
  'san antonio': { zip: '78201', city: 'San Antonio', state: 'TX' },
  'dallas': { zip: '75201', city: 'Dallas', state: 'TX' },
  'miami': { zip: '33101', city: 'Miami', state: 'FL' },
  'seattle': { zip: '98101', city: 'Seattle', state: 'WA' },
  'denver': { zip: '80201', city: 'Denver', state: 'CO' },
  'boston': { zip: '02101', city: 'Boston', state: 'MA' },
  'atlanta': { zip: '30301', city: 'Atlanta', state: 'GA' },
  'san francisco': { zip: '94102', city: 'San Francisco', state: 'CA' },
  'sf': { zip: '94102', city: 'San Francisco', state: 'CA' },
  'detroit': { zip: '48201', city: 'Detroit', state: 'MI' },
  'minneapolis': { zip: '55401', city: 'Minneapolis', state: 'MN' },
  'portland': { zip: '97201', city: 'Portland', state: 'OR' },
  'las vegas': { zip: '89101', city: 'Las Vegas', state: 'NV' },
  'nashville': { zip: '37201', city: 'Nashville', state: 'TN' },
  'baltimore': { zip: '21201', city: 'Baltimore', state: 'MD' },
  'memphis': { zip: '38101', city: 'Memphis', state: 'TN' },
  'louisville': { zip: '40201', city: 'Louisville', state: 'KY' },
  'cleveland': { zip: '44101', city: 'Cleveland', state: 'OH' },
  'pittsburgh': { zip: '15201', city: 'Pittsburgh', state: 'PA' },
  'indianapolis': { zip: '46201', city: 'Indianapolis', state: 'IN' },
  'indy': { zip: '46201', city: 'Indianapolis', state: 'IN' },
  'columbus': { zip: '43201', city: 'Columbus', state: 'OH' },
  'charlotte': { zip: '28201', city: 'Charlotte', state: 'NC' },
  'raleigh': { zip: '27601', city: 'Raleigh', state: 'NC' },
  'omaha': { zip: '68101', city: 'Omaha', state: 'NE' },
  'kansas city': { zip: '64101', city: 'Kansas City', state: 'MO' },
  'new orleans': { zip: '70112', city: 'New Orleans', state: 'LA' },
  'nola': { zip: '70112', city: 'New Orleans', state: 'LA' },
  'tampa': { zip: '33601', city: 'Tampa', state: 'FL' },
  'st louis': { zip: '63101', city: 'St. Louis', state: 'MO' },
  'saint louis': { zip: '63101', city: 'St. Louis', state: 'MO' },
  'sacramento': { zip: '95814', city: 'Sacramento', state: 'CA' },
  'salt lake city': { zip: '84101', city: 'Salt Lake City', state: 'UT' },
  'slc': { zip: '84101', city: 'Salt Lake City', state: 'UT' },
  'albuquerque': { zip: '87101', city: 'Albuquerque', state: 'NM' },
  'abq': { zip: '87101', city: 'Albuquerque', state: 'NM' },
  'tucson': { zip: '85701', city: 'Tucson', state: 'AZ' },
  'jacksonville': { zip: '32201', city: 'Jacksonville', state: 'FL' },
  'austin': { zip: '78701', city: 'Austin', state: 'TX' },
  'san diego': { zip: '92101', city: 'San Diego', state: 'CA' },
  'san jose': { zip: '95101', city: 'San Jose', state: 'CA' },
  'washington': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'washington dc': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'dc': { zip: '20001', city: 'Washington DC', state: 'DC' },
  'cincinnati': { zip: '45201', city: 'Cincinnati', state: 'OH' },
  'milwaukee': { zip: '53201', city: 'Milwaukee', state: 'WI' },
  'buffalo': { zip: '14201', city: 'Buffalo', state: 'NY' },
  'anchorage': { zip: '99501', city: 'Anchorage', state: 'AK' },
  'honolulu': { zip: '96801', city: 'Honolulu', state: 'HI' },
  'baton rouge': { zip: '70801', city: 'Baton Rouge', state: 'LA' },
  'richmond': { zip: '23219', city: 'Richmond', state: 'VA' },
  'parkersburg': { zip: '26101', city: 'Parkersburg', state: 'WV' },
  'portsmouth nh': { zip: '03801', city: 'Portsmouth', state: 'NH' },
  'portland me': { zip: '04101', city: 'Portland', state: 'ME' },
};

const HOMEPAGE_CITY_LINKS: { slug: string; name: string }[] = [
  { slug: 'albuquerque', name: 'Albuquerque, NM' },
  { slug: 'atlanta', name: 'Atlanta, GA' },
  { slug: 'austin', name: 'Austin, TX' },
  { slug: 'baltimore', name: 'Baltimore, MD' },
  { slug: 'boston', name: 'Boston, MA' },
  { slug: 'charlotte', name: 'Charlotte, NC' },
  { slug: 'chicago', name: 'Chicago, IL' },
  { slug: 'cleveland', name: 'Cleveland, OH' },
  { slug: 'columbus', name: 'Columbus, OH' },
  { slug: 'dallas', name: 'Dallas, TX' },
  { slug: 'dayton', name: 'Dayton, OH' },
  { slug: 'denver', name: 'Denver, CO' },
  { slug: 'des-moines', name: 'Des Moines, IA' },
  { slug: 'detroit', name: 'Detroit, MI' },
  { slug: 'fayetteville', name: 'Fayetteville, NC' },
  { slug: 'fort-worth', name: 'Fort Worth, TX' },
  { slug: 'fresno', name: 'Fresno, CA' },
  { slug: 'houston', name: 'Houston, TX' },
  { slug: 'indianapolis', name: 'Indianapolis, IN' },
  { slug: 'jackson', name: 'Jackson, MS' },
  { slug: 'jacksonville', name: 'Jacksonville, FL' },
  { slug: 'kansas-city', name: 'Kansas City, MO' },
  { slug: 'las-vegas', name: 'Las Vegas, NV' },
  { slug: 'los-angeles', name: 'Los Angeles, CA' },
  { slug: 'louisville', name: 'Louisville, KY' },
  { slug: 'memphis', name: 'Memphis, TN' },
  { slug: 'miami', name: 'Miami, FL' },
  { slug: 'milwaukee', name: 'Milwaukee, WI' },
  { slug: 'minneapolis', name: 'Minneapolis, MN' },
  { slug: 'nashville', name: 'Nashville, TN' },
  { slug: 'new-orleans', name: 'New Orleans, LA' },
  { slug: 'new-york', name: 'New York, NY' },
  { slug: 'orlando', name: 'Orlando, FL' },
  { slug: 'parkersburg', name: 'Parkersburg, WV' },
  { slug: 'philadelphia', name: 'Philadelphia, PA' },
  { slug: 'phoenix', name: 'Phoenix, AZ' },
  { slug: 'pittsburgh', name: 'Pittsburgh, PA' },
  { slug: 'portland', name: 'Portland, OR' },
  { slug: 'portland-me', name: 'Portland, ME' },
  { slug: 'portsmouth-nh', name: 'Portsmouth, NH' },
  { slug: 'raleigh', name: 'Raleigh, NC' },
  { slug: 'sacramento', name: 'Sacramento, CA' },
  { slug: 'salt-lake-city', name: 'Salt Lake City, UT' },
  { slug: 'san-antonio', name: 'San Antonio, TX' },
  { slug: 'san-diego', name: 'San Diego, CA' },
  { slug: 'san-francisco', name: 'San Francisco, CA' },
  { slug: 'san-jose', name: 'San Jose, CA' },
  { slug: 'seattle', name: 'Seattle, WA' },
  { slug: 'st-louis', name: 'St. Louis, MO' },
  { slug: 'tacoma', name: 'Tacoma, WA' },
  { slug: 'tampa', name: 'Tampa, FL' },
  { slug: 'tucson', name: 'Tucson, AZ' },
  { slug: 'washington-dc', name: 'Washington, DC' },
];

function usRegionFromStateCode(st: string): string {
  const N = ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NJ', 'NY', 'PA'];
  const MW = ['IL', 'IN', 'MI', 'OH', 'WI', 'IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'];
  const S = ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'DC', 'WV', 'AL', 'KY', 'MS', 'TN', 'AR', 'LA', 'OK', 'TX'];
  const W = ['MT', 'ID', 'WY', 'CO', 'NM', 'AZ', 'UT', 'NV', 'WA', 'OR', 'CA', 'AK', 'HI'];
  if (N.includes(st)) return 'Northeast';
  if (MW.includes(st)) return 'Midwest';
  if (S.includes(st)) return 'South';
  if (W.includes(st)) return 'West';
  return 'Other';
}

function parseStateFromCityLabel(name: string): string | null {
  const m = name.match(/,\s*([A-Z]{2})\s*$/i);
  return m ? m[1].toUpperCase() : null;
}

function cityBrowseBadge(slug: string): string | null {
  const cd = CITIES[slug];
  if (!cd) return null;
  const i0 = cd.issues[0] || '';
  if (/PFAS|pfas/i.test(i0)) return 'PFAS noted';
  if (/[Ll]ead/i.test(i0)) return 'Lead risk';
  if (cd.urgency === 'high') return 'Review data';
  return null;
}

/** Top-of-report risk line: counts detections vs rows where measured level exceeds the limit in our dataset (EPA MCL / action level). */
function riskVerdictFromData(data: any): {
  tier: 'high' | 'moderate' | 'low';
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
  border: string;
  bg: string;
} {
  const cont = Array.isArray(data?.contaminants) ? data.contaminants : [];
  const X = cont.length;
  let Y = cont.filter(
    (c: any) =>
      typeof c.level === 'number' &&
      typeof c.limit === 'number' &&
      !Number.isNaN(c.level) &&
      !Number.isNaN(c.limit) &&
      c.level > c.limit,
  ).length;
  if (Number(data?.pfasAboveMcl || 0) > 0) {
    const pfasRowExceeds = cont.some(
      (c: any) =>
        (c.isPFAS || String(c.name || '').includes('PFAS')) &&
        typeof c.level === 'number' &&
        typeof c.limit === 'number' &&
        c.level > c.limit,
    );
    if (!pfasRowExceeds) Y += 1;
  }

  const openV = Number(data?.openViolations || 0) > 0;
  const isHigh = Y > 0 || openV;

  if (isHigh) {
    let subtitle: string;
    if (Y > 0) {
      subtitle = `${X} contaminant${X === 1 ? '' : 's'} detected, ${Y} exceed${Y === 1 ? 's' : ''} recommended limits`;
    } else {
      subtitle =
        X > 0
          ? `${X} contaminant${X === 1 ? '' : 's'} detected — ${data.openViolations} open EPA violation${data.openViolations > 1 ? 's' : ''} on record`
          : `${data.openViolations} open EPA violation${data.openViolations > 1 ? 's' : ''} on record for this system`;
    }
    return {
      tier: 'high',
      icon: '🔴',
      title: 'HIGH RISK',
      subtitle,
      accent: '#fca5a5',
      border: 'rgba(239,68,68,0.5)',
      bg: 'linear-gradient(165deg, rgba(127,29,29,0.35) 0%, rgba(24,8,8,0.55) 100%)',
    };
  }

  if (data?.limitedData && X === 0) {
    return {
      tier: 'moderate',
      icon: '🟡',
      title: 'MODERATE RISK',
      subtitle: 'Limited contaminant data for this ZIP — confirm with your utility or a certified test if unsure',
      accent: '#fde047',
      border: 'rgba(245,158,11,0.45)',
      bg: 'linear-gradient(165deg, rgba(120,53,15,0.35) 0%, rgba(24,18,8,0.5) 100%)',
    };
  }

  if (X > 0) {
    return {
      tier: 'moderate',
      icon: '🟡',
      title: 'MODERATE RISK',
      subtitle: `${X} contaminant${X === 1 ? '' : 's'} detected, below action levels but worth monitoring`,
      accent: '#fde047',
      border: 'rgba(245,158,11,0.45)',
      bg: 'linear-gradient(165deg, rgba(120,53,15,0.28) 0%, rgba(24,18,8,0.48) 100%)',
    };
  }

  return {
    tier: 'low',
    icon: '🟢',
    title: 'LOW RISK',
    subtitle: 'No major concerns detected',
    accent: '#86efac',
    border: 'rgba(52,211,153,0.45)',
    bg: 'linear-gradient(165deg, rgba(6,78,59,0.35) 0%, rgba(6,24,18,0.5) 100%)',
  };
}

/** Match score for product ranking — aligned with “top 3” recommended filters on the report tab. */
function productMatchScore(p: any, cont: any[] | undefined): number {
  if (!Array.isArray(cont) || !cont.length) return p.cat === 'undersink' ? 1 : 0;
  const names = cont.map((c: any) => c.name).filter(Boolean);
  const hasPFAS = cont.some((c: any) => c.isPFAS || c.name?.includes('PFAS'));
  return (
    p.bestFor.filter((b: string) => names.some((n: string) => n.includes(b))).length +
    (hasPFAS && p.bestFor.includes('PFAS') ? 3 : 0) +
    (p.quickChange ? 2 : 0)
  );
}

const BUDGET_FILTER_CATS = new Set(['pitcher', 'faucet', 'undersink-filter', 'countertop-filter', 'distiller', 'countertop']);

function pickBudgetOption(best: any, cont: any[] | undefined) {
  const pool = PRODUCTS.filter(
    (p: any) =>
      BUDGET_FILTER_CATS.has(p.cat) &&
      !p.wholeHouse &&
      !p.remineralizes &&
      p.id !== best?.id,
  );
  if (!pool.length) return null;
  const scored = pool.map((p: any) => ({
    p,
    m: productMatchScore(p, cont),
    price: p.price,
  }));
  const positive = scored.filter(s => s.m > 0);
  const use = positive.length ? positive : scored;
  use.sort((a, b) => (b.m !== a.m ? b.m - a.m : a.price - b.price));
  return use[0].p;
}

function pickWholeHomeOption(cont: any[] | undefined) {
  const pool = PRODUCTS.filter((p: any) => p.cat === 'whole' && p.wholeHouse && !p.well);
  if (!pool.length) return null;
  const scored = pool
    .map((p: any) => ({ p, m: productMatchScore(p, cont) }))
    .sort((a, b) => b.m - a.m || (b.p.expertPick ? 1 : 0) - (a.p.expertPick ? 1 : 0));
  return scored[0]?.p ?? pool[0];
}

/**
 * Heuristic national framing from composite score + contaminant load (not a census of every U.S. ZIP).
 * Pair with a short disclaimer in UI.
 */
function nationalComparisonMetrics(data: any): null | {
  kind: 'above_avg' | 'mid' | 'below_avg';
  beatZipPct: number;
  worseThanZipPct: number;
  nCont: number;
  nExceed: number;
  hasOpenViolations: boolean;
} {
  if (!data || data.limitedData) return null;
  const score = Math.max(0, Math.min(100, Math.round(Number(data.score) || 0)));
  const cont = Array.isArray(data.contaminants) ? data.contaminants : [];
  const n = cont.length;
  let nExceed = cont.filter(
    (c: any) =>
      typeof c.level === 'number' &&
      typeof c.limit === 'number' &&
      !Number.isNaN(c.level) &&
      !Number.isNaN(c.limit) &&
      c.level > c.limit,
  ).length;
  if (Number(data.pfasAboveMcl || 0) > 0) {
    const pfasRowExceeds = cont.some(
      (c: any) =>
        (c.isPFAS || String(c.name || '').includes('PFAS')) &&
        typeof c.level === 'number' &&
        typeof c.limit === 'number' &&
        c.level > c.limit,
    );
    if (!pfasRowExceeds) nExceed += 1;
  }
  const hasOpenViolations = Number(data.openViolations || 0) > 0;
  const loadSignal = Math.min(95, n * 5 + nExceed * 10 + (hasOpenViolations ? 15 : 0));
  const worseThanZipPct = Math.min(90, Math.max(18, Math.round((100 - score) * 0.55 + loadSignal * 0.35)));
  const kind = score >= 72 ? 'above_avg' : score >= 55 ? 'mid' : 'below_avg';
  return {
    kind,
    beatZipPct: score,
    worseThanZipPct,
    nCont: n,
    nExceed,
    hasOpenViolations,
  };
}

function formatResultsLead(data: any): { found: string; todo: string } {
  const system = data?.systemName || 'this water system';
  if (data?.limitedData) {
    return {
      found: `We found limited matching federal data for ZIP ${data.zip || ''}.`,
      todo: 'Try a nearby ZIP, use the official EPA links below, or open your city’s full report from Browse by city.',
    };
  }
  if (data.openViolations > 0) {
    return {
      found: `We found ${data.openViolations} open violation(s) on EPA records for ${system}.`,
      todo: 'Read the violation list, then check filter picks below for water you drink and cook with.',
    };
  }
  if (data.pfasAboveMcl > 0) {
    return {
      found: `PFAS levels exceed the EPA legal limit in the federal data we show for ${system}.`,
      todo: 'For drinking water, reverse osmosis (often sold as NSF/ANSI 58) or a filter with a published PFAS listing (e.g. NSF P473) is the usual approach—see Shop for options.',
    };
  }
  if (data.score < 65) {
    return {
      found: `Your system’s EPA-based summary is on the lower side—there are items worth reviewing in this report.`,
      todo: 'Scan contaminants next, then match a filter type to what showed up (under-sink RO covers the widest range).',
    };
  }
  if (data.score >= 80 && (data.totalViolations || 0) === 0) {
    return {
      found: `For ${system}, EPA data in this panel looks relatively clean—no violations in what we track here.`,
      todo: 'Many households still add a filter for taste, plumbing lead, or PFAS—see top picks and the PFAS tab if you want extra margin.',
    };
  }
  return {
    found: `We matched your ZIP to ${system} (${data.city || 'your area'}).`,
    todo: 'Review the sections below, open the PFAS or Shop tabs as needed, then pick filters that match your priorities.',
  };
}

export default function WaterCheckup() {
  const [zip, setZip]                   = useState('');
  const [loading, setLoading]           = useState(false);
  const [step, setStep]                 = useState(0);
  const [data, setData]                 = useState<any>(null);
  const [ewgData, setEwgData]           = useState<any>(null);
  const [error, setError]               = useState<string | null>(null);
  const [waterLookupErrorExtra, setWaterLookupErrorExtra] = useState<{
    hintWell?: boolean;
    zip?: string;
    dataFreshness?: { ucmr5SnapshotLabel?: string; sdwisLiveNote?: string; links?: { ccr?: string; ucmrData?: string; sdwis?: string } };
  } | null>(null);
  const [tab, setTab]                   = useState('report');
  const [showEmail, setShowEmail]       = useState(false);
  const [email, setEmail]               = useState('');
  const [emailAlert, setEmailAlert]     = useState(true);
  const [emailSent, setEmailSent]       = useState(false);
  const [years, setYears]               = useState(5);
  const [ppl, setPpl]                   = useState(4);
  const [ftype, setFtype]               = useState('Waterdrop G3P800');
  const [installers, setInstallers]     = useState<any[]>([]);
  const [instLoading, setInstLoading]   = useState(false);
  const [productFilter, setProductFilter] = useState('all');
  const [quoted, setQuoted]             = useState<Record<string, boolean>>({});
  const [situation, setSituation]       = useState<string | null>(null);
  const [homePeople, setHomePeople]     = useState<string | null>(null);
  const [homeBaths, setHomeBaths]       = useState<string | null>(null);
  const [showShare, setShowShare]       = useState(false);
  const [showWqaModal, setShowWqaModal] = useState(false);
  const [showNsfModal, setShowNsfModal] = useState(false);
  const [showSample, setShowSample]       = useState(false);
  const [sampleEmail, setSampleEmail]     = useState('');
  const [sampleZip, setSampleZip]         = useState('');
  const [sampleOptIn, setSampleOptIn]     = useState(true);
  const [sampleSending, setSampleSending] = useState(false);
  const [sampleSent, setSampleSent]       = useState(false);
  const [sampleErr, setSampleErr]         = useState<string | null>(null);
  const [heroNewsletterEmail, setHeroNewsletterEmail] = useState('');
  const [heroNewsletterSending, setHeroNewsletterSending] = useState(false);
  const [heroNewsletterSent, setHeroNewsletterSent] = useState(false);
  const [heroNewsletterErr, setHeroNewsletterErr] = useState<string | null>(null);
  const [resultsAlertEmail, setResultsAlertEmail] = useState('');
  const [resultsAlertSending, setResultsAlertSending] = useState(false);
  const [resultsAlertSent, setResultsAlertSent] = useState(false);
  const [resultsAlertErr, setResultsAlertErr] = useState<string | null>(null);
  /** Pre-search: main funnel vs contaminant explainer tab */
  const [homeFunnelTab, setHomeFunnelTab] = useState<'report' | 'whats'>('report');
  const [wellMode, setWellMode]         = useState(false);
  const [wellFallbackState, setWellFallbackState] = useState<string | null>(null);
  const [heroSolutionKey, setHeroSolutionKey] = useState<HeroSolutionKey | null>(null);
  const [cityBrowseFilter, setCityBrowseFilter] = useState('');
  const [showAllContaminants, setShowAllContaminants] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [reportCount, setReportCount] = useState(1000);
  const heroRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loadingPanelRef = useRef<HTMLDivElement>(null);

  // Animated report counter — counts up to a realistic number on mount
  useEffect(() => {
    const target = 10000;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setReportCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sticky CTA — show after hero scrolls out of view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filteredHomepageCities = useMemo(() => {
    const q = cityBrowseFilter.trim().toLowerCase();
    if (!q) return HOMEPAGE_CITY_LINKS;
    return HOMEPAGE_CITY_LINKS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.replace(/-/g, ' ').includes(q) ||
        c.slug.includes(q.replace(/\s+/g, '-')),
    );
  }, [cityBrowseFilter]);

  const cityBrowseGrouped = useMemo(() => {
    const map: Record<string, typeof HOMEPAGE_CITY_LINKS> = {};
    for (const c of filteredHomepageCities) {
      const st = parseStateFromCityLabel(c.name);
      const region = st ? usRegionFromStateCode(st) : 'Other';
      if (!map[region]) map[region] = [];
      map[region].push(c);
    }
    const order = ['Northeast', 'Midwest', 'South', 'West', 'Other'];
    return order.filter((r) => map[r]?.length).map((r) => ({ region: r, cities: map[r] }));
  }, [filteredHomepageCities]);

  useEffect(() => {
    setShowAllContaminants(false);
  }, [data?.pwsid, data?.zip]);

  useEffect(() => {
    if (!loading) return;
    const t = requestAnimationFrame(() => {
      loadingPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(t);
  }, [loading]);

  useEffect(() => {
    if (!showWqaModal && !showNsfModal && !showSample) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowWqaModal(false);
        setShowNsfModal(false);
        setShowSample(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWqaModal, showNsfModal, showSample]);

  const search = async () => {
    const trimmed = zip.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      const match = CITY_ZIP_MAP[trimmed.toLowerCase()];
      if (match) {
        window.location.href = `/results/${match.zip}`;
        return;
      }
      return;
    }
    window.location.href = `/results/${trimmed}`;
  };

  const doSearch = async (zipCode: string) => {
    if (zipCode.length !== 5 || loading) return;
    setLoading(true); setError(null); setWaterLookupErrorExtra(null); setData(null); setEwgData(null); setTab('report'); setEmailSent(false); setResultsAlertSent(false); setResultsAlertErr(null); setStep(0); setInstallers([]);
    let s = 0;
    const tick = setInterval(() => { s = Math.min(s + 1, STEPS.length - 1); setStep(s); }, 650);
    try {
      const [result, ewg] = await Promise.all([fetchWaterData(zipCode), fetchEwgData(zipCode)]);
      clearInterval(tick);
      setData(result);
      setWellFallbackState(null);
      if (ewg && !ewg.error) setEwgData(ewg);
      setTimeout(() => {
        setShowEmail(false);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
      loadInstallers(zipCode);
    } catch (e: any) {
      clearInterval(tick);
      setError(e.message);
      const ex = e?.waterExtra;
      setWaterLookupErrorExtra(
        ex && typeof ex === 'object'
          ? {
              hintWell: !!ex.hintWell,
              zip: typeof ex.zip === 'string' ? ex.zip : zipCode,
              dataFreshness: ex.dataFreshness as {
                ucmr5SnapshotLabel?: string;
                sdwisLiveNote?: string;
                links?: { ccr?: string; ucmrData?: string; sdwis?: string };
              },
            }
          : null
      );
    } finally { setLoading(false); }
  };

  const subscribeSample = async () => {
    if (!sampleEmail.includes('@') || sampleSending) return;
    setSampleSending(true);
    setSampleErr(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sampleEmail.trim(),
          zip: sampleZip.trim(),
          weekly: sampleOptIn,
          source: 'sample-report-modal',
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Subscription failed');
      setSampleSent(true);
    } catch (e: any) {
      setSampleErr(e.message || 'Subscription failed');
    } finally {
      setSampleSending(false);
    }
  };

  const subscribeHeroNewsletter = async () => {
    if (!heroNewsletterEmail.includes('@') || heroNewsletterSending) return;
    setHeroNewsletterSending(true);
    setHeroNewsletterErr(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: heroNewsletterEmail.trim(),
          zip: zip.trim(),
          weekly: true,
          source: 'hero-newsletter',
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Subscription failed');
      setHeroNewsletterSent(true);
    } catch (e: any) {
      setHeroNewsletterErr(e.message || 'Subscription failed');
    } finally {
      setHeroNewsletterSending(false);
    }
  };

  const subscribeResultsAreaAlerts = async () => {
    const z = data?.zip;
    if (!resultsAlertEmail.includes('@') || resultsAlertSending || !z) return;
    setResultsAlertSending(true);
    setResultsAlertErr(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resultsAlertEmail.trim(),
          zip: String(z).slice(0, 5),
          weekly: true,
          source: 'violation-alert',
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Subscription failed');
      setResultsAlertSent(true);
    } catch (e: any) {
      setResultsAlertErr(e.message || 'Subscription failed');
    } finally {
      setResultsAlertSending(false);
    }
  };

  const loadInstallers = async (z: string) => {
    setInstLoading(true);
    try { setInstallers(await findInstallers(z)); } catch {}
    finally { setInstLoading(false); }
  };

  const hardnessLevel = HARDNESS[data?.stateCode] ?? null;
  const isHardWater = hardnessLevel === 'very_hard' || hardnessLevel === 'hard';

  const getRecommended = () => {
    const base = PRODUCTS.filter(p => !p.wholeHouse && p.cat !== 'shower' && !p.remineralizes && !p.softener);
    const cont = data?.contaminants;
    if (!Array.isArray(cont) || !cont.length) return base.filter((p: any) => p.cat === 'undersink').slice(0, 3);
    return base
      .map(p => ({ ...p, m: productMatchScore(p, cont) }))
      .sort((a, b) => b.m - a.m).slice(0, 3);
  };

  const prod = PRODUCTS.find(p => p.name === ftype) || PRODUCTS[1];
  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Yr ${i}`, filter: Math.round(prod.price + (prod.filterCostPerYear || 80) * i), bottled: Math.round(ppl * 32 * 12 * i),
  }));
  const recommended = getRecommended();
  const threeStepBest = recommended[0];
  const threeStepBudget = pickBudgetOption(threeStepBest, data?.contaminants);
  const threeStepWhole = pickWholeHomeOption(data?.contaminants);

  const goToProductPick = (p: any) => {
    if (!p) return;
    setFtype(p.name);
    setProductFilter(p.cat);
    setTab('products');
    requestAnimationFrame(() => {
      document.getElementById('wc-products-tab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const catFilters = ['all','undersink','undersink-filter','countertop','countertop-filter','distiller','pitcher','faucet','whole','softener','acid-neutralizer','shower'];
  const catLabels: Record<string,string> = { all:'All', undersink:'Under-Sink RO', 'undersink-filter':'Under-Sink Filter', countertop:'Countertop RO', 'countertop-filter':'Countertop Filter', distiller:'Distiller', pitcher:'Pitcher', faucet:'Faucet Mount', whole:'Whole House', softener:'Water Softener', 'acid-neutralizer':'Acid Neutralizer', shower:'Shower' };
  const filteredProds = productFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === productFilter);
  const scoreColor = !data ? '#22d3ee' : data.score >= 80 ? '#22d3ee' : data.score >= 65 ? '#f59e0b' : '#ef4444';
  const pfasLevel = data?.ucmr5?.maxPfasPpt ?? data?.contaminants?.find((c: any) => c.isPFAS || c.name?.includes('PFAS'))?.level ?? null;
  const pfasContaminants = data?.contaminants?.filter((c: any) => c.isPFAS) ?? [];
  const contaminantNames = data?.contaminants?.map((c: any) => c.name) ?? [];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', fontFamily: 'inherit', color: '#e2e8f0' }}>

      <SiteHeader
        variant="bar"
        showCta
        ctaHref="/#wc-hero-anchor"
        ctaLabel="Check My Water"
        navStyle={{ marginLeft: 20 }}
        trailing={
          <>
            <button
              type="button"
              className="wc-nav-badge-wqa"
              onClick={() => setShowWqaModal(true)}
              aria-label="What is WQA Gold Seal? Opens explanation dialog."
            >
              WQA Gold Seal
            </button>
            <button
              type="button"
              className="wc-nav-badge-nsf"
              onClick={() => setShowNsfModal(true)}
              aria-label="What does NSF certified mean? Opens explanation dialog."
            >
              NSF Certified
            </button>
          </>
        }
      />

      {/* STICKY CTA BAR — floats in when hero scrolls out */}
      {stickyVisible && !data && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          background: 'rgba(3,12,28,0.96)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(8,145,178,0.3)',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          animation: 'wcFadeUp 0.3s ease-out both',
        }}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>Protect every glass your family drinks</span>
          <button
            type="button"
            onClick={() => document.getElementById('wc-hero-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#0891b2,#06b6d4)',
              color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Check My Water
          </button>
        </div>
      )}

      {/* SEARCH / HERO — site-wide WaterCanvas (layout) stays visible behind content */}
      <div ref={heroRef} id="wc-hero-anchor" style={{ margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="wc-hero-split">
          <div className="wc-hero-split-copy">
            <h1 className="wc-hero-h1">
              See What&apos;s Really In<br />Your Tap Water
            </h1>

            <p
              className="wc-hero-positioning"
              style={{ color: '#67e8f9', fontSize: 15, margin: '0 auto 14px', maxWidth: 520, lineHeight: 1.55, fontWeight: 600 }}
            >
              {SITE_HERO_POSITIONING}
            </p>

            <p className="wc-hero-sub" style={{ color: '#cbd5e1', fontSize: 16, margin: '0 auto 18px', maxWidth: 520, lineHeight: 1.65, fontWeight: 500 }}>
              {SITE_HERO_TAGLINE}
            </p>

            {/* Live report counter */}
            <div style={{ margin: '0 auto 18px', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', boxShadow: '0 0 6px #22d3ee', animation: 'wcBlink 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>
                <strong style={{ color: '#22d3ee', fontWeight: 800 }}>{reportCount >= 10000 ? '10,000+' : reportCount.toLocaleString()}</strong> reports analyzed · {SITE_WATER_SYSTEMS_LABEL}
              </span>
            </div>

          </div>

          <div className="wc-hero-split-visual">
            <div className="wc-hero-photo">
              <Image
                src={HOME_HERO_IMAGE}
                alt={HOME_HERO_ALT}
                width={380}
                height={285}
                sizes="(max-width: 899px) min(100vw - 48px, 380px), 380px"
                priority
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>

        <div className="wc-hero-credibility-banner" role="list" aria-label="WaterCheckup coverage highlights">
          {SITE_HERO_TRUST_BANNER.map((label) => (
            <span key={label} className="wc-hero-credibility-banner__item" role="listitem">
              <span aria-hidden>✅</span> {label}
            </span>
          ))}
        </div>

        {/* Search bar — high-visibility panel */}
        <div className="wc-search-hero-panel" style={{ marginTop: 28 }}>
          <p className="wc-search-hero-label" id="wc-search-hero-heading">
            ENTER YOUR ZIP OR CITY
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'stretch', maxWidth: 560, margin: '0 auto' }}>
            <input
              id="wc-hero-zip"
              className="wc-search-input"
              value={zip}
              onChange={e => setZip(e.target.value.slice(0, 30))}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Street ZIP or city name"
              maxLength={30}
              autoComplete="postal-code"
              aria-labelledby="wc-search-hero-heading"
              style={{ width: '100%', maxWidth: 'none' }}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={search}
                disabled={zip.trim().length < 2 || loading}
                className="wc-search-submit wc-hero-report-btn"
                style={{
                  padding: '18px 32px',
                  minHeight: 58,
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  color: '#fbbf24',
                  WebkitTextFillColor: '#fbbf24',
                  flex: '1 1 200px',
                }}
              >
                {loading ? 'Loading…' : 'Check My Water'}
              </button>
              <button
                type="button"
                onClick={() => { setShowSample(true); setSampleSent(false); setSampleErr(null); }}
                style={{
                  padding: '18px 28px',
                  minHeight: 58,
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  border: '1px solid rgba(103, 232, 249, 0.45)',
                  background: 'rgba(8, 42, 72, 0.55)',
                  color: '#e0f2fe',
                  cursor: 'pointer',
                  flex: '1 1 200px',
                }}
              >
                View Sample Report
              </button>
            </div>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: '#64748b', letterSpacing: 0.2, textAlign: 'center' }}>
            Discover hidden contaminants in your tap — drawn from federal Safe Drinking Water records. No account required.
          </p>
        </div>

      </div>

      <HomeVisualShowcase />

        {/* LOADER — directly under search so it stays on-screen (was below fold after long hero) */}
        {loading && (
          <div
            ref={loadingPanelRef}
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="wc-loading-panel"
            style={{
              maxWidth: 520,
              margin: '20px auto 0',
              padding: '22px 26px',
              background: 'rgba(6,14,10,0.94)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(34,197,94,0.28)',
              borderTop: '1px solid rgba(34,197,94,0.45)',
              borderRadius: 14,
              position: 'relative',
              zIndex: 3,
              boxShadow:
                '0 24px 56px rgba(0,4,18,0.55), 0 0 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(34,197,94,0.12)',
              fontFamily: "'Courier New', monospace",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: '#86efac', marginBottom: 10, letterSpacing: 0.4, fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              Analyzing multiple data sources…
            </div>
            <div style={{ fontSize: 10, color: '#166534', letterSpacing: 2, marginBottom: 14 }}>$ watercheck --zip {zip} --live</div>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, opacity: i <= step ? 1 : 0.15, transition: 'opacity 0.4s' }}>
                <span style={{ color: i < step ? '#22c55e' : i === step ? '#86efac' : '#166534', fontSize: 13, minWidth: 14 }}>{i < step ? '✓' : i === step ? '▶' : '·'}</span>
                <span style={{ fontSize: 12, color: i < step ? '#4ade80' : i === step ? '#86efac' : '#166534', letterSpacing: 0.3 }}>{s}</span>
                {i === step && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 7,
                      height: 13,
                      background: '#22c55e',
                      animation: 'wcBlink 1s step-end infinite',
                      marginLeft: 2,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
              </div>
            ))}
            <div
              style={{
                marginTop: 12,
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.45)',
                borderRadius: 6,
                fontSize: 10,
                color: '#64748b',
                textAlign: 'center',
                letterSpacing: 0.5,
                lineHeight: 1.45,
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
            >
              EPA violation records live · Federal PFAS testing data · EWG health guidelines when available
            </div>
          </div>
        )}


{error && (
            <div style={{ marginTop: 18, padding: '12px 16px', background: '#1a0a0a', border: '1px solid #ef4444', borderRadius: 8, textAlign: 'left' }}>
              <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Couldn&apos;t load municipal report</div>
              <div style={{ color: '#fca5a5', fontSize: 13, lineHeight: 1.7 }}>{error}</div>
              {waterLookupErrorExtra?.hintWell && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(239,68,68,0.35)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#c4b5fd', marginBottom: 6 }}>Private well?</div>
                  <div style={{ fontSize: 12, color: '#e9d5ff', lineHeight: 1.65, marginBottom: 10 }}>
                    EPA SDWIS only covers <strong style={{ color: '#f5f3ff' }}>public</strong> water systems. If you use a well, tap <strong style={{ color: '#f5f3ff' }}>Switch to well water mode</strong> below for a state risk overview, then test your water annually with a certified lab.
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setWellMode(true);
                      setError(null);
                      setWaterLookupErrorExtra(null);
                      const z = (waterLookupErrorExtra?.zip || zip).trim();
                      if (/^\d{5}$/.test(z)) {
                        try {
                          const r = await fetch(`/api/well?zip=${z}`);
                          const d = await r.json();
                          if (d.state) setWellFallbackState(d.state === 'DEFAULT' ? 'OH' : d.state);
                          else setWellFallbackState('OH');
                        } catch {
                          setWellFallbackState('OH');
                        }
                      } else {
                        setWellFallbackState('OH');
                      }
                      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.5)', background: 'rgba(124,58,237,0.25)', color: '#e9d5ff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Switch to well water mode →
                  </button>
                </div>
              )}
              {waterLookupErrorExtra?.dataFreshness?.ucmr5SnapshotLabel && (
                <div style={{ marginTop: 12, fontSize: 11, color: '#78716c', lineHeight: 1.5 }}>
                  UCMR5 snapshot in app: <span style={{ color: '#a8a29e' }}>{waterLookupErrorExtra.dataFreshness.ucmr5SnapshotLabel}</span>
                  {' · '}
                  <a href={waterLookupErrorExtra.dataFreshness.links?.ucmrData} target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>
                    EPA UCMR data →
                  </a>
                </div>
              )}
            </div>
          )}

      {/* WELL WATER PANEL — shown when well mode is active and we have state data */}
      {wellMode && !loading && (data?.stateCode || wellFallbackState) && (
        <div ref={resultsRef} style={{ position: 'relative', zIndex: 2, marginTop: 32 }}>
          <WellWaterPanel
            stateCode={
              (data?.stateCode || wellFallbackState) === 'DEFAULT'
                ? 'OH'
                : String(data?.stateCode || wellFallbackState)
            }
          />
        </div>
      )}

      {/* RESULTS */}
      {data && !loading && !wellMode && (
        <div id="wc-results" ref={resultsRef} style={{ maxWidth: 960, margin: '20px auto 44px', padding: '0 16px', position: 'relative', zIndex: 2 }}>

          {/* Risk verdict — first thing users see after results load */}
          {(() => {
            const v = riskVerdictFromData(data);
            return (
              <div
                className="wc-reveal wc-reveal-1"
                role="status"
                style={{
                  marginBottom: 14,
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: `1px solid ${v.border}`,
                  borderLeft: `5px solid ${v.accent}`,
                  background: v.bg,
                  boxShadow: '0 12px 36px rgba(0,4,18,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, color: v.accent, marginBottom: 8 }}>YOUR RISK VERDICT</div>
                <p style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 900, color: '#f8fafc', lineHeight: 1.35, letterSpacing: -0.3 }}>
                  <span style={{ marginRight: 8 }} aria-hidden>{v.icon}</span>
                  <span style={{ color: v.accent }}>{v.title}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: 16 }}> — </span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{v.subtitle}</span>
                </p>
                {/* Inline email alert — shown right after verdict while attention is highest */}
                {!resultsAlertSent && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>🔔 Get alerts if your water changes:</span>
                    <input
                      value={resultsAlertEmail}
                      onChange={e => setResultsAlertEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && subscribeResultsAreaAlerts()}
                      placeholder="your@email.com"
                      type="email"
                      style={{ flex: '1 1 180px', minWidth: 0, padding: '7px 12px', background: 'rgba(4,22,48,0.9)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={subscribeResultsAreaAlerts}
                      disabled={resultsAlertSending || !resultsAlertEmail.includes('@')}
                      style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: resultsAlertSending || !resultsAlertEmail.includes('@') ? 'not-allowed' : 'pointer', opacity: resultsAlertSending || !resultsAlertEmail.includes('@') ? 0.5 : 1, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      {resultsAlertSending ? '…' : 'Notify me'}
                    </button>
                  </div>
                )}
                {resultsAlertSent && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10, fontSize: 12, color: '#4ade80', fontWeight: 700 }}>
                    ✓ You're on the list — we'll email you if your water data changes.
                  </div>
                )}
              </div>
            );
          })()}

          {/* National comparison — heuristic vs modelled U.S. ZIP profiles (#4) */}
          {(() => {
            const nc = nationalComparisonMetrics(data);
            if (!nc) return null;
            const concernBits: string[] = [];
            if (nc.nExceed > 0) concernBits.push(`${nc.nExceed} above limits in this data`);
            if (nc.hasOpenViolations) concernBits.push('open EPA violation(s)');
            const concernPhrase = concernBits.length ? concernBits.join(' · ') : null;
            return (
              <div
                className="wc-reveal wc-reveal-1"
                style={{
                  marginBottom: 14,
                  padding: '14px 16px',
                  borderRadius: 11,
                  border: '1px solid rgba(148, 163, 184, 0.28)',
                  background: 'rgba(15, 23, 42, 0.55)',
                  boxShadow: '0 8px 28px rgba(0,4,18,0.3)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: '#94a3b8', marginBottom: 8 }}>NATIONAL CONTEXT</div>
                {nc.kind === 'above_avg' && (
                  <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', lineHeight: 1.55, fontWeight: 600 }}>
                    Better than average: your ZIP scores higher than about{' '}
                    <strong style={{ color: '#22d3ee' }}>{nc.beatZipPct}%</strong> of U.S. ZIP code profiles in our EPA-based model.
                    {nc.nCont > 0 && (
                      <span style={{ fontWeight: 500, color: '#cbd5e1' }}>
                        {' '}
                        Still, <strong style={{ color: '#fbbf24' }}>{nc.nCont}</strong> contaminant{nc.nCont === 1 ? '' : 's'} showed up in this report
                        {nc.nExceed > 0 || nc.hasOpenViolations ? ` — ${concernPhrase}.` : ' — worth monitoring even when some are below action levels.'}
                      </span>
                    )}
                  </p>
                )}
                {nc.kind === 'mid' && (
                  <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', lineHeight: 1.55, fontWeight: 600 }}>
                    Mixed picture: roughly <strong style={{ color: '#fbbf24' }}>{nc.worseThanZipPct}%</strong> of ZIPs in our comparison show fewer combined issues than your snapshot.
                    {nc.nCont > 0 && (
                      <span style={{ fontWeight: 500, color: '#cbd5e1' }}>
                        {' '}
                        You still have <strong style={{ color: '#fbbf24' }}>{nc.nCont}</strong> listed contaminant{nc.nCont === 1 ? '' : 's'}
                        {nc.nExceed > 0 ? ` (${nc.nExceed} above limits here).` : '.'}
                      </span>
                    )}
                  </p>
                )}
                {nc.kind === 'below_avg' && (
                  <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', lineHeight: 1.55, fontWeight: 600 }}>
                    Your water has more combined contaminants and violations than about{' '}
                    <strong style={{ color: '#f87171' }}>{nc.worseThanZipPct}%</strong> of U.S. ZIP code profiles in our national comparison.
                    {nc.nCont > 0 && (
                      <span style={{ fontWeight: 500, color: '#cbd5e1' }}>
                        {' '}
                        This report lists <strong style={{ color: '#fbbf24' }}>{nc.nCont}</strong> contaminant{nc.nCont === 1 ? '' : 's'}
                        {nc.nExceed > 0 ? (
                          <>
                            ; <strong style={{ color: '#fca5a5' }}>{nc.nExceed}</strong> exceed recommended or legal limits in this panel.
                          </>
                        ) : (
                          '.'
                        )}
                      </span>
                    )}
                  </p>
                )}
                <p style={{ margin: '10px 0 0', fontSize: 10, color: '#64748b', lineHeight: 1.45 }}>
                  Approximate ranking from our composite score and contaminant list — not a census of every U.S. ZIP.
                </p>
              </div>
            );
          })()}

          {/* Fix your water — 3 steps (same engine as top picks; opens Shop with model selected) */}
          <div
            id="wc-fix-water-steps"
            className="wc-reveal wc-reveal-1"
            style={{
              marginBottom: 14,
              padding: '18px 18px 16px',
              borderRadius: 12,
              border: '1px solid rgba(34, 211, 238, 0.28)',
              background: 'linear-gradient(165deg, rgba(8, 50, 80, 0.5) 0%, rgba(4, 14, 32, 0.88) 100%)',
              boxShadow: '0 10px 32px rgba(0,4,18,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.3, color: '#22d3ee', marginBottom: 6 }}>NEXT UP</div>
            <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 900, color: '#f8fafc', letterSpacing: -0.3 }}>Fix Your Water In 3 Steps</h2>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                {
                  icon: '✅',
                  label: 'Best option',
                  hint: 'Top match for your contaminant profile (same as #1 below).',
                  p: threeStepBest,
                  empty: 'Open the Shop tab to browse filters.',
                },
                {
                  icon: '💰',
                  label: 'Budget option',
                  hint: 'Lower upfront cost — compare certifications in Shop.',
                  p: threeStepBudget,
                  empty: 'Open the Shop tab for pitchers, faucets, and value picks.',
                },
                {
                  icon: '🏠',
                  label: 'Whole-home solution',
                  hint: 'Point-of-entry system for every tap — not just drinking water.',
                  p: threeStepWhole,
                  empty: 'See whole-house filters in the Shop tab.',
                },
              ].map((row) => (
                <button
                  key={row.label}
                  type="button"
                  onClick={() => row.p && goToProductPick(row.p)}
                  disabled={!row.p}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(4,18,40,0.72)',
                    cursor: row.p ? 'pointer' : 'not-allowed',
                    opacity: row.p ? 1 : 0.65,
                    font: 'inherit',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
                    <span aria-hidden>{row.icon}</span> {row.label}
                  </div>
                  {row.p ? (
                    <>
                      <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700, lineHeight: 1.35 }}>
                        {row.p.brand} {row.p.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                        {row.p.catLabel} · ${row.p.price}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.45 }}>{row.empty}</div>
                  )}
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, lineHeight: 1.4 }}>{row.hint}</div>
                </button>
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.45 }}>
              Opens the Shop tab with that system highlighted. Full cards and Amazon links are in your report and in Shop.
            </p>
          </div>

          {/* LIMITED DATA NOTICE */}
          {data.limitedData && (
            <div className="wc-reveal wc-reveal-1" style={{ background: 'rgba(120,53,15,0.3)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px 12px 0 0', padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 2 }}>Limited data for ZIP {data.zip}</div>
                <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>{data.limitedDataReason} Try a nearby ZIP or <a href="https://www.ewg.org/tapwater/?utm_source=watercheckup" target="_blank" rel="noreferrer" style={{ color: '#f59e0b' }}>search EWG directly →</a></div>
              </div>
            </div>
          )}

          {/* Plain-language lead: what we found + what to do (rest unfolds below) */}
          {(() => {
            const { found, todo } = formatResultsLead(data);
            return (
              <div
                className="wc-reveal wc-reveal-1"
                style={{
                  marginBottom: 12,
                  marginTop: data.limitedData ? 12 : 0,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(34, 211, 238, 0.35)',
                  background: 'linear-gradient(165deg, rgba(6, 40, 72, 0.92) 0%, rgba(4, 18, 40, 0.9) 100%)',
                  boxShadow: '0 8px 28px rgba(0,4,18,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: '#22d3ee', marginBottom: 6 }}>START HERE</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', lineHeight: 1.45, margin: 0 }}>{found}</p>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.55, margin: '8px 0 0' }}>
                  <strong style={{ color: '#e2e8f0' }}>What to do:</strong> {todo}
                </p>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: '10px 0 0' }}>
                  <Link href="/faq" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    FAQ — reading your report, filters, PFAS, lead →
                  </Link>
                </p>
              </div>
            );
          })()}

          <div className="wc-results-hdr wc-reveal wc-reveal-2" style={{ background: 'rgba(3,12,28,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderTop: data.limitedData ? 'none' : '1px solid rgba(255,255,255,0.13)', borderRadius: data.limitedData ? '0 0 0 0' : '10px 10px 0 0', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', boxShadow: '0 6px 24px rgba(0,4,18,0.35), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            {!data.limitedData && <ScoreDial score={data.score} grade={data.grade} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>{data.systemName}</span>
                {data.openViolations > 0 && <span style={{ fontSize: 10, padding: '2px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 4, color: '#ef4444' }}>{data.openViolations} OPEN</span>}
                {data.pfasAboveMcl > 0 && <span style={{ fontSize: 10, padding: '2px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 4, color: '#ef4444' }}>PFAS ⚠</span>}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>{data.city} · {data.pwsid}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{data.sourceType}{data.population ? ` · ${data.population} served` : ''}</div>
              {data.summary && <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>&ldquo;{data.summary}&rdquo;</div>}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  !data.limitedData && { l:'VIOL.', tip: 'Total violations on EPA record (past issues included)', v:data.totalViolations, c:data.totalViolations > 0 ? '#f59e0b' : '#22d3ee' },
                  !data.limitedData && { l:'OPEN', tip: 'Open violations still listed on EPA today', v:data.openViolations, c:data.openViolations > 0 ? '#ef4444' : '#22d3ee' },
                  { l:'PFAS', tip: 'PFAS-related detections in the federal testing snapshot we show', v:data.pfasCount || 0, c:data.pfasAboveMcl > 0 ? '#ef4444' : data.pfasCount > 0 ? '#f59e0b' : '#22d3ee' },
                  !data.limitedData && { l:'SCORE', tip: 'Our summary score from the mix of signals in this report', v:data.score, c:scoreColor },
                ].filter(Boolean).map((s: any) => (
                  <div key={s.l} style={{ textAlign: 'center', minWidth: 44 }} title={s.tip}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: s.c, lineHeight: 1.1 }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 0.8 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              
              <button type="button" onClick={() => setShowShare(true)} className="wc-focus-ring" style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#cbd5e1', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>↗ Share</button>
            </div>
          </div>

          {/* TABS — grouped: understand your water vs plan / buy */}
          <nav className="wc-tab-bar wc-reveal wc-reveal-3" aria-label="Report sections and next steps" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(2,7,18,0.78)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="wc-tab-section-label" style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 800, letterSpacing: 1.1, color: '#94a3b8' }}>YOUR WATER</div>
            <div role="tablist" aria-label="Water data" style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 2, padding: '0 6px 6px' }}>
              {[['report','📊 Report'],['pfas','☣️ PFAS'],['compare','📋 Compare']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className="wc-result-tab"
                  style={{ padding: '10px 12px', background: 'transparent', border: 'none', whiteSpace: 'nowrap', borderBottom: tab===id ? '2px solid #0891b2' : '2px solid transparent', color: tab===id ? '#e0f2fe' : '#cbd5e1', fontSize: 12, fontWeight: 700, letterSpacing: 0.3, cursor: 'pointer', minHeight: 44 }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 10px' }} aria-hidden />
            <div className="wc-tab-section-label" style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 800, letterSpacing: 1.1, color: '#94a3b8' }}>NEXT STEPS</div>
            <div role="tablist" aria-label="Filters and help" style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 2, padding: '0 6px 8px' }}>
              {[['solutions','🏠 Solution'],['products','🛒 Shop'],['cost','💰 Cost'],['installers','🔧 Install'],['resources','🔗 Links']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className="wc-result-tab"
                  style={{ padding: '10px 12px', background: 'transparent', border: 'none', whiteSpace: 'nowrap', borderBottom: tab===id ? '2px solid #0891b2' : '2px solid transparent', color: tab===id ? '#e0f2fe' : '#cbd5e1', fontSize: 12, fontWeight: 700, letterSpacing: 0.3, cursor: 'pointer', minHeight: 44 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* TAB: WATER REPORT */}
          {tab === 'report' && (
            <div className="wc-reveal wc-reveal-4" style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '14px 14px 16px', boxShadow: '0 16px 40px rgba(0,4,18,0.4)' }}>
              <details className="wc-report-details" style={{ marginBottom: 12, borderRadius: 8, border: '1px solid #1a3a5c', background: 'rgba(4,18,40,0.55)' }}>
                <summary style={{ cursor: 'pointer', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#94a3b8', listStyle: 'none' }}>
                  Data layers, update dates &amp; official links
                </summary>
                <div style={{ padding: '0 12px 12px' }}>
                  {data.dataSources && <DataSourcesBadges sources={data.dataSources} />}

                  {data.dataFreshness && (
                    <div style={{ marginTop: 10, marginBottom: 12, padding: '10px 12px', background: 'rgba(8,45,70,0.35)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, fontSize: 11, color: '#94a3b8', lineHeight: 1.55 }}>
                      <div style={{ fontSize: 9, letterSpacing: 1, color: '#22d3ee', fontWeight: 800, marginBottom: 4 }}>DATA FRESHNESS</div>
                      <div>
                        <strong style={{ color: '#cbd5e1' }}>PFAS testing (EPA UCMR5 — national monitoring round):</strong>{' '}
                        snapshot packaged in this app as of{' '}
                        <strong style={{ color: '#e2e8f0' }}>{data.dataFreshness.ucmr5SnapshotLabel}</strong>.
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <strong style={{ color: '#cbd5e1' }}>Violations &amp; lead tap samples (EPA SDWIS — utility reporting database):</strong>{' '}
                        {data.dataFreshness.sdwisLiveNote}
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        <a href={data.dataFreshness.links?.ucmrData} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#22d3ee' }}>
                          EPA PFAS monitoring (UCMR) →
                        </a>
                        <a href={data.dataFreshness.links?.sdwis} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#22d3ee' }}>
                          EPA violations database (SDWIS) →
                        </a>
                      </div>
                    </div>
                  )}

                  {data.pwsid && (
                    <div style={{ marginBottom: 0, padding: '10px 12px', background: 'rgba(3,18,40,0.5)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 8 }}>
                      <div style={{ fontSize: 9, letterSpacing: 1, color: '#94a3b8', fontWeight: 800, marginBottom: 8 }}>OFFICIAL SOURCES</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <a
                          href={
                            data.echo?.echoUrl ??
                            `https://echo.epa.gov/sdwa/facility-info?p_pwsid=${encodeURIComponent(data.pwsid)}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}
                        >
                          EPA ECHO — this system →
                        </a>
                        <a
                          href={data.dataFreshness?.links?.ccr ?? 'https://www.epa.gov/ccr'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: '#94a3b8' }}
                        >
                          How to find your utility CCR →
                        </a>
                        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.45 }}>
                          CCR lists plant and distribution detections; if not on ECHO, check your bill or utility site.
                        </div>
                      </div>
                    </div>
                  )}

                  {!data.hasEWG && (
                    <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(20,30,45,0.45)', borderRadius: 6, fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>
                      <strong style={{ color: '#cbd5e1' }}>EWG:</strong> full metro merge not always available.{' '}
                      <a href="https://www.ewg.org/tapwater/?utm_source=watercheckup" target="_blank" rel="noreferrer" style={{ color: '#4ade80' }}>
                        Search EWG →
                      </a>
                    </div>
                  )}
                </div>
              </details>

              {data.nationalPercentile != null && <NationalPercentile pct={data.nationalPercentile} />}
              <PFASResultAlert city={data.city} pfasLevel={pfasLevel} />
              {data.pwsid && <CountyComparison pwsid={data.pwsid} />}

              {data.violations?.length > 0 ? (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 10 }}>Violation history (EPA records for your utility)</div>
                  <div style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, marginBottom: 14, overflow: 'hidden' }}>
                    {data.violations.map((v: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '7px 12px', borderBottom: i < data.violations.length-1 ? '1px solid #0d2240' : 'none', gap: 10 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: '#94a3b8' }}>{v.rule}</div>{v.contaminant && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{v.contaminant}</div>}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', minWidth: 32 }}>{v.year}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: v.statusColor || '#94a3b8', minWidth: 65, textAlign: 'right' }}>{v.status}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ background: '#051527', border: '1px solid #22d3ee22', borderRadius: 8, padding: '10px 12px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>✅</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: '#22d3ee' }}>No violations on record</div><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>EPA SDWIS — none on file for this system.</div></div>
                </div>
              )}

              {data.contaminants?.length > 0 && (
                <>
                  
                  {/* LEAD TAP SAMPLE BANNER */}
                  {(() => {
                    const leadC = data.contaminants.find((c: any) => c.name === 'Lead');
                    if (!leadC) return null;
                    const ppb = leadC.level;
                    const isHigh = ppb > 15;
                    const isMod  = ppb > 5 && ppb <= 15;
                    const color  = isHigh ? '#ef4444' : isMod ? '#f59e0b' : '#22d3ee';
                    const bg     = isHigh ? 'rgba(239,68,68,0.07)' : isMod ? 'rgba(245,158,11,0.07)' : 'rgba(34,211,238,0.05)';
                    const border = isHigh ? 'rgba(239,68,68,0.3)' : isMod ? 'rgba(245,158,11,0.3)' : 'rgba(34,211,238,0.2)';
                    const icon   = isHigh ? '⚠️' : isMod ? '⚡' : '✅';
                    const msg    = isHigh
                      ? 'Lead detected at ' + ppb + ' ppb — ABOVE the EPA action level of 15 ppb. Lead causes permanent neurological damage. There is no safe level.'
                      : isMod
                      ? 'Lead detected at ' + ppb + ' ppb — below EPA action level (15 ppb) but above what health scientists consider safe. Children and pregnant women are most at risk.'
                      : 'Lead detected at ' + ppb + ' ppb — below EPA action level of 15 ppb. Note: the CDC states there is no safe level of lead exposure.';
                    return (
                      <div style={{ background: bg, border: '1px solid ' + border, borderRadius: 8, padding: '10px 12px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: color, letterSpacing: 0.8, marginBottom: 3 }}>LEAD — EPA TAP SAMPLE</div>
                          <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.55 }}>{msg}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>LCR 90th %ile · {leadC.note}</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: color, flexShrink: 0, textAlign: 'right' }}>
                          <div>{ppb}</div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8' }}>ppb</div>
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{ fontSize: 10, letterSpacing: 0.5, color: '#0891b2', marginBottom: 8 }}>CONTAMINANTS — tap a row for health context</div>
                  {(showAllContaminants || data.contaminants.length <= 3
                    ? data.contaminants
                    : data.contaminants.slice(0, 3)
                  ).map((c: any, i: number) => (
                    <ContaminantRow key={`${c.name}-${i}`} c={c} />
                  ))}
                  {data.contaminants.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllContaminants((v) => !v)}
                      className="wc-glass-btn"
                      style={{
                        marginTop: 12,
                        padding: '10px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#22d3ee',
                      }}
                    >
                      {showAllContaminants ? 'Show fewer contaminants' : `Show all ${data.contaminants.length} contaminants`}
                    </button>
                  )}
                </>
              )}

              {/* ── EWG TAP WATER ATLAS ─────────────────────────────────── */}
              {ewgData && (
                <div style={{ background: 'rgba(5,20,40,0.75)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 10, padding: '16px 18px', marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 0.5, color: '#22c55e', fontWeight: 800, marginBottom: 3 }}>🌿 EWG TAP WATER ATLAS — HEALTH GUIDELINES</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{ewgData.systemName}</div>
                    </div>
                    <a href={ewgData.ewgUrl} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: '3px 9px', textDecoration: 'none', whiteSpace: 'nowrap' }}>View on EWG →</a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                    {[
                      { label: 'Contaminants detected', val: ewgData.totalDetected, color: '#94a3b8' },
                      { label: 'Exceed EWG health limits', val: ewgData.exceedGuidelines, color: ewgData.exceedGuidelines > 0 ? '#f59e0b' : '#22c55e' },
                      { label: 'Exceed legal limits', val: ewgData.exceedLegal, color: ewgData.exceedLegal > 0 ? '#ef4444' : '#22c55e' },
                    ].map((stat, i) => (
                      <div key={i} style={{ background: 'rgba(3,12,28,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.val}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, lineHeight: 1.3 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {Array.isArray(ewgData.contaminants) && ewgData.contaminants.length > 0 ? (
                    <>
                      <div style={{ fontSize: 10, letterSpacing: 0.4, color: '#94a3b8', marginBottom: 8 }}>EWG HEALTH GUIDELINES ARE STRICTER THAN FEDERAL LEGAL LIMITS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto' }}>
                        {ewgData.contaminants.slice(0, 20).map((c: any, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: i % 2 === 0 ? 'rgba(3,12,28,0.4)' : 'transparent', borderRadius: 4, fontSize: 12 }}>
                            <div style={{ flex: 1, color: c.exceedsGuideline ? '#fbbf24' : '#94a3b8', fontWeight: c.exceedsGuideline ? 600 : 400 }}>{c.name}</div>
                            <div style={{ color: '#94a3b8', minWidth: 70, textAlign: 'right' }}>{c.detected}</div>
                            {c.exceedsLegal && <span style={{ fontSize: 10, padding: '1px 6px', background: '#7f1d1d', color: '#fca5a5', borderRadius: 3, fontWeight: 700 }}>OVER LIMIT</span>}
                            {c.exceedsGuideline && !c.exceedsLegal && <span style={{ fontSize: 10, padding: '1px 6px', background: '#78350f', color: '#fde68a', borderRadius: 3 }}>Health concern</span>}
                          </div>
                        ))}
                        {ewgData.contaminants.length > 20 && (
                          <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>+{ewgData.contaminants.length - 20} more — <a href={ewgData.ewgUrl} target="_blank" rel="noreferrer" style={{ color: '#22c55e' }}>view all on EWG</a></div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>
                      Contaminant detail not available — <a href={ewgData.ewgUrl} target="_blank" rel="noreferrer" style={{ color: '#22c55e' }}>view full EWG report →</a>
                    </div>
                  )}
                </div>
              )}


              {data.echo && (
                <div style={{ background: '#0b1e36', border: '1px solid #ef444430', borderRadius: 8, padding: '14px 16px', marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#ef4444', fontWeight: 700 }}>⚖️ EPA ECHO — ENFORCEMENT & COMPLIANCE HISTORY</div>
                    <a href={data.echo.echoUrl} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'none', border: '1px solid #1e3a4a', borderRadius: 3, padding: '1px 7px' }}>View full ECHO record →</a>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8 }}>
                    {data.echo.formalActions > 0 && (
                      <div style={{ background: '#1a0505', border: '1px solid #ef444430', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>{data.echo.formalActions}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Formal Actions</div>
                      </div>
                    )}
                    {data.echo.informalActions > 0 && (
                      <div style={{ background: '#0b1e36', border: '1px solid #f59e0b30', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>{data.echo.informalActions}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Informal Actions</div>
                      </div>
                    )}
                    {data.echo.penaltiesFormatted && (
                      <div style={{ background: '#1a0505', border: '1px solid #ef444430', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#ef4444' }}>{data.echo.penaltiesFormatted}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Total Penalties</div>
                      </div>
                    )}
                    {data.echo.inspections > 0 && (
                      <div style={{ background: '#0b1e36', border: '1px solid #22d3ee30', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#22d3ee' }}>{data.echo.inspections}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Inspections</div>
                      </div>
                    )}
                  </div>
                  {data.echo.lastInspection && (
                    <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>Last inspection: <span style={{ color: '#94a3b8' }}>{data.echo.lastInspection}</span></div>
                  )}
                  {data.echo.complianceStatus && (
                    <div style={{ marginTop: 4, fontSize: 11, color: '#94a3b8' }}>Compliance status: <span style={{ color: data.echo.formalActions > 0 ? '#ef4444' : '#22d3ee' }}>{data.echo.complianceStatus}</span></div>
                  )}
                </div>
              )}

              <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', margin: '22px 0 12px' }}>TOP 3 RECOMMENDED FILTERS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                {recommended.map((p: any, i: number) => <ProductCard key={p.id} p={p} highlight={i === 0} detectedContaminants={contaminantNames} />)}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button onClick={() => setTab('solutions')} className="wc-analyze" style={{ padding: '7px 16px', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Find the right filter →</button>
                <button onClick={() => setTab('products')} className="wc-glass-btn" style={{ padding: '7px 16px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>View All 39 Products →</button>
              </div>

              {/* HARD WATER BANNER */}
              {isHardWater && (
                <div style={{ marginTop: 24, padding: '18px 20px', background: 'linear-gradient(135deg,rgba(120,53,15,0.35),rgba(10,20,40,0.7))', border: '1px solid rgba(251,191,36,0.35)', borderTop: '1px solid rgba(253,224,100,0.4)', borderRadius: 12, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>🪨</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: 0.5 }}>
                        {hardnessLevel === 'very_hard' ? 'Very Hard Water Area' : 'Hard Water Area'} — {data.stateCode}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {hardnessLevel === 'very_hard'
                          ? 'Among the highest mineral content in the US. Scale buildup shortens appliance life by up to 50%.'
                          : 'Elevated calcium & magnesium cause scale on pipes, appliances, and fixtures.'}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>
                    Hard water is not a health risk — but it destroys water heaters, dishwashers, and washing machines over time, and leaves white scale on faucets and showers.
                    The fix: <strong style={{ color: '#fbbf24' }}>RO system for drinking water</strong> (already recommended above) + <strong style={{ color: '#fbbf24' }}>whole-house water softener</strong> for appliance protection.
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#b45309', marginBottom: 10, fontWeight: 700 }}>RECOMMENDED SOFTENERS FOR HARD WATER</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                    {PRODUCTS.filter(p => p.softener).map((p: any) => <ProductCard key={p.id} p={p} highlight={p.id === 39} detectedContaminants={['Hardness','Scale']} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MY SOLUTION */}
          {tab === 'solutions' && <SolutionsTab data={data} contaminantNames={contaminantNames} />}

          {/* TAB: PFAS DETAIL */}
          {tab === 'pfas' && (
            <div className="wc-reveal wc-reveal-4" style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
              <div style={{ marginBottom: 18, padding: '14px 16px', background: 'linear-gradient(135deg,#1a0505,#0d0f1a)', border: '1px solid #ef444440', borderRadius: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#ef4444', marginBottom: 7, fontWeight: 700 }}>☣️ ABOUT PFAS — FOREVER CHEMICALS</div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>PFAS are ~12,000 synthetic chemicals that don't break down in the environment or human body. Linked to kidney cancer, testicular cancer, thyroid disease, immune suppression, elevated cholesterol, and developmental harm. EPA set the first federal MCL in 2024: <strong style={{ color: '#fbbf24' }}>4 ppt</strong> for PFOA and PFOS.</p>
              </div>
              {pfasContaminants.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 7 }}>✅</div>
                  <div style={{ fontSize: 15, color: '#22d3ee', fontWeight: 700, marginBottom: 5 }}>No PFAS detected via UCMR5</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>No measurable PFAS in EPA's 2023-2025 monitoring. UCMR5 covers systems serving 3,300+ people.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 14 }}>DETECTED COMPOUNDS — HEALTH CONTEXT</div>
                  {pfasContaminants.map((c: any, i: number) => <ContaminantRow key={i} c={c} />)}
                  <div style={{ marginTop: 16, fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 12 }}>PFAS-CERTIFIED FILTERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                    {PRODUCTS.filter(p => p.bestFor.includes('PFAS')).slice(0,3).map((p: any) => <ProductCard key={p.id} p={p} highlight={p.id===3} detectedContaminants={contaminantNames} />)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: COMPARE */}
          {tab === 'compare' && <FilterCompareTab />}

          {/* TAB: ALL PRODUCTS */}
          {tab === 'products' && (
            <div id="wc-products-tab" style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
              <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 8 }}>39 products · Amazon links</div>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 18px' }}>
                We may earn a commission from qualifying Amazon purchases — your price stays the same. Always confirm model numbers and certifications on the seller page before you buy.
              </p>

          {/* ── FEATURED EXPERT PICKS SPOTLIGHT ────────────────────── */}
          {(() => {
            const featured = PRODUCTS.filter((p: any) => p.expertPick).slice(0, 3);
            return (
              <div style={{ marginBottom: 48 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: '#0891b2', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>EDITOR&apos;S CHOICE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f9ff' }}>Top Expert Picks</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {featured.map((p: any, idx: number) => {
                    const accent = ['#06b6d4','#f59e0b','#a78bfa'][idx];
                    return (
                      <FeaturedSpotlightCard key={p.id} p={p} idx={idx} accent={accent} />
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {catFilters.map(cat => {
              const active = productFilter === cat;
              const count = cat === 'all' ? PRODUCTS.length : PRODUCTS.filter((p: any) => p.cat === cat).length;
              const icons: Record<string,string> = { all:'✦', undersink:'🔧', 'undersink-filter':'💧', countertop:'🪣', 'countertop-filter':'🥛', distiller:'♨️', pitcher:'🥤', faucet:'🚰', whole:'🏠', softener:'🪨', 'acid-neutralizer':'⚗️', shower:'🚿' };
              return (
                <button key={cat} onClick={() => setProductFilter(cat)}
                  style={{
                    padding: '8px 16px', borderRadius: 30, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${active ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.07)'}`,
                    borderTop: `1px solid ${active ? 'rgba(180,240,255,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    background: active ? 'rgba(8,145,178,0.22)' : 'rgba(4,14,32,0.55)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    color: active ? '#22d3ee' : '#94a3b8',
                    boxShadow: active ? '0 0 20px rgba(8,145,178,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
                    transition: 'all .2s ease',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                  <span style={{ fontSize: 13 }}>{icons[cat] || '•'}</span>
                  <span>{catLabels[cat]}</span>
                  <span style={{ fontSize: 10, opacity: 0.55, background: active ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '1px 5px' }}>{count}</span>
                </button>
              );
            })}
          </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 12 }}>
                {filteredProds.map((p: any) => <ProductCard key={p.id} p={p} highlight={recommended.some((r: any) => r.id === p.id)} detectedContaminants={contaminantNames} />)}
              </div>
            </div>
          )}

          {/* TAB: COST CALCULATOR */}
          {tab === 'cost' && (
            <div style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
              <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 16 }}>COST OF OWNERSHIP CALCULATOR</div>
              {/* Payback period callout */}
              {(() => {
                const monthlyBottled = Math.round(ppl * 32 * 12 / 12);
                const monthlyFilter  = Math.round((prod.filterCostPerYear || 80) / 12);
                const paybackMonths  = Math.ceil(prod.price / Math.max(1, monthlyBottled - monthlyFilter));
                return (
                  <div style={{ marginBottom: 18, padding: '14px 18px', background: 'linear-gradient(135deg,#071525,#091c35)', border: '1px solid #22d3ee30', borderRadius: 10, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', minWidth: 90 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: '#22d3ee' }}>{paybackMonths}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>months to break even</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Filter pays for itself in {paybackMonths} months</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>vs. buying {ppl} people bottled water at ~$1.33/bottle. After that, you save ${monthlyBottled - monthlyFilter}/mo — every month — for clean water.</div>
                    </div>
                  </div>
                );
              })()}
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 22, alignItems: 'flex-end' }}>
                <div><div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>SYSTEM</div>
                  <select value={ftype} onChange={e => setFtype(e.target.value)} style={{ background: '#0b1e36', border: '1px solid #1e3a4a', color: '#e2e8f0', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                    {PRODUCTS.filter(p => p.filterCostPerYear).map(p => <option key={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div><div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>YEARS: {years}</div><input type="range" min={1} max={10} value={years} onChange={e => setYears(+e.target.value)} style={{ width: 120, accentColor: '#0891b2' }} /></div>
                <div><div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>PEOPLE: {ppl}</div><input type="range" min={1} max={8} value={ppl} onChange={e => setPpl(+e.target.value)} style={{ width: 120, accentColor: '#0891b2' }} /></div>
              </div>
              <div style={{ height: 220 }}>
                <FilterVsBottleChart data={chartData} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                {[{ l:'Filter System',c:'#0891b2',v:`$${prod.price + (prod.filterCostPerYear||80)*years}`},{l:'Bottled Water',c:'#ef4444',v:`$${Math.round(ppl*32*12*years)}`},{l:'You Save',c:'#22d3ee',v:`$${Math.max(0,Math.round(ppl*32*12*years)-prod.price-(prod.filterCostPerYear||80)*years)}`}].map(s => (
                  <div key={s.l} style={{ flex:1, minWidth:90, background:'#0b1e36', border:`1px solid ${s.c}33`, borderRadius:8, padding:'11px 14px' }}>
                    <div style={{ fontSize:11, color:'#94a3b8', marginBottom:2 }}>{s.l}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, color:'#334155' }}>over {years} yr{years!==1?'s':''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INSTALLERS */}
          {tab === 'installers' && (
            <div style={{ background: 'rgba(3,12,28,0.65)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22, boxShadow: '0 24px 48px rgba(0,4,18,0.45)' }}>
              {/* Quick links */}
              <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '🔍 WQA Certified Installer', url: 'https://find.wqa.org/find-providers', color: '#0891b2' },
                  { label: '🔧 Find Pro on Angi', url: `https://www.angi.com/nearme/water-treatment/`, color: '#d97706' },
                  { label: '💬 Get Quotes on HomeAdvisor', url: 'https://www.homeadvisor.com/task.Water-Softener-or-Water-Filter-Install.html', color: '#7c3aed' },
                ].map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ padding: '7px 14px', background: l.color + '20', border: `1px solid ${l.color}44`, borderRadius: 7, color: l.color, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>{l.label}</a>
                ))}
              </div>

              {/* Questions to ask installer */}
              <div style={{ background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#0891b2', marginBottom: 10, fontWeight: 700 }}>WHAT TO ASK YOUR INSTALLER</div>
                {['Are you WQA certified or licensed in this state?','What\'s included in the installation — faucet, shutoff valve, drain line?','Do you test the water before and after installation?','What\'s the filter replacement schedule and cost?','Is there a warranty on labor and parts?','Will you register the product with the manufacturer?'].map((q,i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                    <span style={{ color: '#22d3ee', flexShrink: 0, fontSize: 12 }}>{i+1}.</span>
                    <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2' }}>LOCAL WATER TREATMENT INSTALLERS NEAR {data.city}</div>
                <button onClick={() => loadInstallers(zip)} disabled={instLoading} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #0e2233', borderRadius: 4, color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>{instLoading ? 'Searching…' : '↻ Refresh'}</button>
              </div>
              {instLoading && <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>🔍 Finding local water treatment specialists…</div>}
              {!instLoading && installers.map((c: any, i: number) => (
                <div key={i} style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>{c.address}</div>
                      {c.specialty && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{c.specialty}</div>}
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.cert && <span style={{ fontSize: 11, padding: '1px 5px', borderRadius: 3, background: '#d9770622', color: '#d97706', border: '1px solid #d9770644', fontWeight: 700 }}>{c.cert}</span>}
                        {c.rating && <span style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(Math.round(c.rating))} <span style={{ color: '#94a3b8', fontSize: 11 }}>{c.rating}{c.reviews?` (${c.reviews})`:''}</span></span>}
                        {c.distance && <span style={{ fontSize: 11, color: '#334155' }}>📍 {c.distance}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                      {c.phone && <a href={`tel:${c.phone}`} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 5, color: '#94a3b8', fontSize: 11, textDecoration: 'none' }}>📞 {c.phone}</a>}
                      {c.website && <a href={c.website} target="_blank" rel="noreferrer" style={{ padding: '6px 10px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 5, color: '#94a3b8', fontSize: 11, textDecoration: 'none' }}>🌐</a>}
                      <button onClick={() => setQuoted(q => ({ ...q, [c.name]: true }))} style={{ padding: '6px 12px', background: quoted[c.name] ? '#064e3b' : '#0891b2', border: 'none', borderRadius: 5, color: quoted[c.name] ? '#22d3ee' : '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{quoted[c.name] ? '✓ Sent' : 'Get Quote'}</button>
                    </div>
                  </div>
                </div>
              ))}
              {!instLoading && installers.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  <button onClick={() => loadInstallers(zip)} style={{ padding: '7px 16px', background: '#0891b2', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>Search Local Installers</button>
                </div>
              )}
              <div style={{ marginTop: 12, fontSize: 11, color: '#334155', textAlign: 'center' }}>💡 Always verify credentials and get at least 3 quotes. Average RO install cost: $150-$400.</div>
            </div>
          )}

          {/* TAB: RESOURCES */}
          {tab === 'resources' && <ResourcesTab data={data} />}

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px 80px', marginTop: 28, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            role="tablist"
            aria-label="Choose what to read first"
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 28,
              flexWrap: 'wrap',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: 14,
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={homeFunnelTab === 'report'}
              className="wc-result-tab wc-focus-ring"
              onClick={() => setHomeFunnelTab('report')}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: `1px solid ${homeFunnelTab === 'report' ? 'rgba(6,182,212,0.45)' : 'rgba(255,255,255,0.1)'}`,
                background: homeFunnelTab === 'report' ? 'rgba(8,145,178,0.22)' : 'transparent',
                color: homeFunnelTab === 'report' ? '#e0f2fe' : '#94a3b8',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Get your free report
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={homeFunnelTab === 'whats'}
              className="wc-result-tab wc-focus-ring"
              onClick={() => setHomeFunnelTab('whats')}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: `1px solid ${homeFunnelTab === 'whats' ? 'rgba(6,182,212,0.45)' : 'rgba(255,255,255,0.1)'}`,
                background: homeFunnelTab === 'whats' ? 'rgba(8,145,178,0.22)' : 'transparent',
                color: homeFunnelTab === 'whats' ? '#e0f2fe' : '#94a3b8',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              What&apos;s in my water
            </button>
          </div>

          {homeFunnelTab === 'whats' && (
          <>
          {/* ── WHAT&apos;S IN MY WATER: common contaminants ───────────────── */}
          <div className="wc-fadein-1" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="wc-step" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f9ff' }}>Common things found in US tap water — and what to do about them</div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>Most tap water is treated and monitored. But treatment doesn't remove everything, and what stays in varies by city. Here's what shows up most often — and the simple filters that remove each one.</div>
              </div>
            </div>
            {/* Alarming stat strip — with context + sources */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              {([
                {
                  stat: '≈45%',
                  label: 'of US tap water samples had PFAS detected (national study)',
                  source: 'USGS national reconnaissance, 2023–2025',
                  meaning:
                    'A detection is not automatically an emergency — it means PFAS showed up at least once in that sampling effort. Your report shows whether your utility had detections and how they compare to EPA limits.',
                },
                {
                  stat: 'Millions',
                  label: 'of lead service lines remain nationwide (replacement ongoing)',
                  source: 'EPA lead service line inventories (utilities reporting)',
                  meaning:
                    'This is an infrastructure snapshot, not your personal tap result. Lead risk still depends on your building’s plumbing and how long water sits in pipes.',
                },
                {
                  stat: 'Common',
                  label: 'disinfection byproducts (e.g. THMs) in treated surface water',
                  source: 'EPA Stage 2 DBPR / compliance monitoring context',
                  meaning:
                    'Many systems balance disinfection (microbial safety) with byproducts. If you dislike taste/odor or want lower DBPs, a certified carbon or RO filter targets what you drink.',
                },
                {
                  stat: 'Widespread',
                  label: 'Cr-6 detections reported in many systems (limits evolving)',
                  source: 'EPA UCMR & state monitoring summaries',
                  meaning:
                    'Chromium-6 draws attention in headlines; whether it matters for you depends on level, duration, and other contaminants — use your ZIP data as the starting point.',
                },
              ] as const).map((s) => (
                <div key={s.stat} className="wc-card" style={{ flex: '1 1 200px', borderRadius: 10, padding: '12px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#22d3ee', letterSpacing: -0.5 }}>{s.stat}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.45, marginTop: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5, marginTop: 10 }}>
                    <strong style={{ color: '#e2e8f0' }}>What this means for you:</strong> {s.meaning}
                  </div>
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 8, lineHeight: 1.4 }}>Source: {s.source}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>
              {[
                {
                  icon: '☣️',
                  title: 'PFAS "forever chemicals"',
                  risk: 'Cancer · Hormones · Immunity',
                  body: "Man-made chemicals used in nonstick pans, food packaging, and firefighting foam \u2014 they don\u2019t break down in the environment or in your body. Found in 1 in 2 US water supplies. Linked to thyroid disease and certain cancers with long-term exposure. Removed by: reverse osmosis or a certified PFAS filter.",
                  color: '#ef4444',
                },
                {
                  icon: '🔩',
                  title: 'Lead',
                  risk: 'Brain damage · No safe level',
                  body: "A heavy metal that leaches from old pipes and home plumbing \u2014 especially in houses built before 1986. You can\u2019t taste, see, or smell it. No safe level exists for children. Causes permanent neurological damage even at trace amounts. Removed by: reverse osmosis or NSF 53-certified filter.",
                  color: '#f59e0b',
                },
                {
                  icon: '⚗️',
                  title: 'Chlorine byproducts (THMs & HAAs)',
                  risk: 'Probable carcinogens · In most tap water',
                  body: 'When chlorine — added by utilities to kill bacteria — mixes with organic matter, it forms trihalomethanes (THMs) and haloacetic acids (HAAs). Both are classified as probable carcinogens by the EPA and are present in nearly all treated US tap water. Removed by: activated carbon filter or reverse osmosis.',
                  color: '#a78bfa',
                },
                {
                  icon: '🌾',
                  title: 'Nitrates',
                  risk: 'Infant risk · Agricultural runoff',
                  body: "Chemicals from fertilizers and animal waste that seep into groundwater \u2014 most common in rural areas near farms. Above 10 mg/L (about two teaspoons per 100 gallons) they can cause oxygen deprivation in infants \u2014 known as \u201cblue baby syndrome.\u201d Removed by: reverse osmosis (standard pitchers do NOT work).",
                  color: '#84cc16',
                },
                {
                  icon: '⚡',
                  title: 'Arsenic',
                  risk: 'Bladder · Lung · Skin cancer',
                  body: 'A naturally occurring metal that dissolves into groundwater from rock — completely odorless and tasteless. Long-term exposure is linked to bladder, lung, and skin cancers. Over 2 million Americans drink water above the EPA limit of 10 ppb. Removed by: reverse osmosis or NSF 58-certified filter.',
                  color: '#f97316',
                },
                {
                  icon: '🏭',
                  title: 'Chromium-6 (hexavalent chromium)',
                  risk: 'Probable carcinogen · 3 in 4 water systems',
                  body: 'The Erin Brockovich chemical — a byproduct of industrial pollution also found naturally in some soils and groundwater. Found in 3 out of 4 US water systems. The EPA has a limit for total chromium, but not specifically for Chromium-6 yet. Removed by: reverse osmosis.',
                  color: '#06b6d4',
                },
                {
                  icon: '🦠',
                  title: 'Microplastics & nanoplastics',
                  risk: 'Emerging · Inflammation · Hormones',
                  body: "Tiny plastic fragments shed from packaging, clothing, and pipes \u2014 found in virtually all tap water worldwide. Early studies link them to inflammation and hormone disruption. Standard carbon filters don\u2019t remove nanoplastics. Removed by: reverse osmosis membranes only.",
                  color: '#ec4899',
                },
                {
                  icon: '💧',
                  title: 'Hard water (calcium & magnesium)',
                  risk: 'Pipe damage · Skin · Appliances',
                  body: 'Not a health risk — but a home and skin issue. Minerals in hard water leave scale buildup on pipes, appliances, and your skin. 85% of US homes have it. Reduces appliance lifespan, increases energy bills, and worsens dry skin and eczema. Treated by: water softener or whole-house filter.',
                  color: '#94a3b8',
                },
              ].map(c => (
                <div key={c.title} className="wc-card" style={{ borderRadius: 14, padding: '20px 16px', borderLeft: `2px solid ${c.color}33` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 26 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.25 }}>{c.title}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: c.color, letterSpacing: 0.3, marginTop: 2 }}>{c.risk}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>{c.body}</div>
                </div>
              ))}
            </div>

            {/* Mid-page ZIP repeat — second entry point after reading about contaminants */}
            <div style={{ marginTop: 28, padding: '20px 22px', background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.25)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f9ff', marginBottom: 6 }}>Ready to check your water?</div>
              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, marginBottom: 4 }}>Enter your ZIP code and we&apos;ll pull the real EPA data for your area — violations, PFAS detections, lead sampling, and a filter recommendation matched to what&apos;s actually in your water.</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>Free · No account · Results in seconds</div>
              <button
                type="button"
                className="wc-analyze"
                onClick={() => {
                  setHomeFunnelTab('report');
                  document.getElementById('wc-hero-zip')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  window.setTimeout(() => document.getElementById('wc-hero-zip')?.focus(), 350);
                }}
                style={{
                  padding: '12px 22px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: '#0f172a',
                  background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                  boxShadow: '0 8px 28px rgba(245,158,11,0.35)',
                }}
              >
                Go to ZIP search — get my report →
              </button>
            </div>
          </div>

          </>
          )}

          {homeFunnelTab === 'report' && (
          <>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, marginBottom: 28 }}>
            Tell us about your home and browse filters — or open{' '}
            <button
              type="button"
              onClick={() => setHomeFunnelTab('whats')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
            >
              What&apos;s in my water
            </button>{' '}
            for a plain-English tour of common tap-water contaminants.
          </p>

          {/* ── STEP 1: YOUR SITUATION ─────────────────────────────── */}
          <div className="wc-fadein-2" style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="wc-step" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f9ff' }}>Now tell us about your home</div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>To show you the right filter — one that fits your setup — tell us where you live.</div>
              </div>
            </div>

            {/* Situation selector */}
            <div className="wc-sit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
              {SITUATIONS.map(s => (
                <button key={s.id} onClick={() => setSituation(situation === s.id ? null : s.id)}
                  className="wc-sit"
                  style={{ background: situation === s.id ? 'rgba(8,50,110,0.70)' : 'rgba(4,14,32,0.62)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: `1px solid ${situation === s.id ? 'rgba(8,145,178,0.55)' : 'rgba(255,255,255,0.07)'}`, borderTop: `1px solid ${situation === s.id ? 'rgba(6,182,212,0.65)' : 'rgba(255,255,255,0.13)'}`, borderRadius: 16, padding: '22px 18px', cursor: 'pointer', textAlign: 'center', boxShadow: situation === s.id ? '0 0 32px rgba(8,145,178,.28), 0 16px 40px rgba(0,4,18,.45), inset 0 1px 0 rgba(255,255,255,.12)' : '0 8px 24px rgba(0,4,18,.35), inset 0 1px 0 rgba(255,255,255,.07)' }}>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: situation === s.id ? '#38bdf8' : '#e2e8f0', marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{s.desc}</div>
                </button>
              ))}
            </div>

            {/* ── HOMEOWNER DETAIL PANEL ── shown when homeowner selected */}
            {situation === 'homeowner' && (
              <div style={{ animation: 'wcFadeUp .4s ease-out both', marginBottom: 28, padding: '20px 22px', background: 'rgba(4,14,32,0.70)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(6,182,212,0.18)', borderTop: '1px solid rgba(6,182,212,0.28)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,4,18,0.35)' }}>
                <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#0891b2', fontWeight: 800, marginBottom: 16 }}>TELL US ABOUT YOUR HOME</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* People */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>👥 How many people live in your home?</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['1','2','3','4','5','5+'].map(n => (
                        <button key={n} onClick={() => setHomePeople(homePeople === n ? null : n)}
                          style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${homePeople === n ? 'rgba(6,182,212,0.7)' : 'rgba(255,255,255,0.1)'}`, borderTop: `1px solid ${homePeople === n ? 'rgba(180,240,255,0.5)' : 'rgba(255,255,255,0.16)'}`, background: homePeople === n ? 'rgba(6,182,212,0.22)' : 'rgba(4,14,32,0.5)', color: homePeople === n ? '#22d3ee' : '#94a3b8', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all .15s', boxShadow: homePeople === n ? '0 0 14px rgba(6,182,212,0.25)' : 'none' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Bathrooms */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>🚿 How many bathrooms?</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['1','1.5','2','2.5','3+'].map(n => (
                        <button key={n} onClick={() => setHomeBaths(homeBaths === n ? null : n)}
                          style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${homeBaths === n ? 'rgba(6,182,212,0.7)' : 'rgba(255,255,255,0.1)'}`, borderTop: `1px solid ${homeBaths === n ? 'rgba(180,240,255,0.5)' : 'rgba(255,255,255,0.16)'}`, background: homeBaths === n ? 'rgba(6,182,212,0.22)' : 'rgba(4,14,32,0.5)', color: homeBaths === n ? '#22d3ee' : '#94a3b8', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all .15s', boxShadow: homeBaths === n ? '0 0 14px rgba(6,182,212,0.25)' : 'none' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Tip based on selections */}
                  {(homePeople || homeBaths) && (
                    <div style={{ padding: '12px 14px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                      {(homePeople === '5+' || homePeople === '5') && homeBaths === '3+'
                        ? '🏠 Large home — a high-flow whole-house system + under-sink RO for drinking is your best setup. Look for systems rated 15+ GPM.'
                        : (homePeople === '5+' || homePeople === '5')
                        ? '👨‍👩‍👧‍👦 Big family — prioritize a high-GPD tankless RO (800+ GPD) so you never wait for filtered water.'
                        : (homeBaths === '3+' || homeBaths === '2.5')
                        ? '🚿 Multiple bathrooms — consider adding shower filters to each. Chlorine exposure in the shower is often higher than from drinking water.'
                        : (homePeople === '1' || homePeople === '2')
                        ? '💧 Smaller household — a countertop or under-sink RO is plenty. No need for a large whole-house system.'
                        : '✅ Enter your ZIP code above to get a full water quality report for your area.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2: WHERE TO BUY ── shown when situation selected */}
            {situation && (() => {
              const sit = SITUATIONS.find(s => s.id === situation)!;
              const sitProducts = PRODUCTS.filter((p: any) => sit.cats.includes(p.cat) && p.expertPick);
              const catOrder = sit.id === 'homeowner' ? ['undersink','undersink-filter','countertop','countertop-filter','distiller','whole','shower'] : sit.cats;
              const catTitles: Record<string,string> = { undersink:'🚰 Under-Sink RO', 'undersink-filter':'💧 Under-Sink Filter (Non-RO)', countertop:'🪣 Countertop RO', 'countertop-filter':'🧊 Countertop Filter', distiller:'♨️ Countertop Distillers', whole:'🏠 Whole-House', shower:'🚿 Shower Filters', pitcher:'🥤 Pitcher Filters' };
              const renderCard = (p: any) => (
                <div key={p.id} className="wc-card" style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#fff', height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, position: 'relative' }}>
                    <img src={p.img} alt={p.name} style={{ maxHeight: 148, maxWidth: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5, boxShadow:'0 2px 8px #d9770655' }}>🏅 Expert Pick</div>
                    {p.quickChange && <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5, boxShadow:'0 2px 8px #06b6d455' }}>⚡ Quick-Change</div>}
                  </div>
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5 }}>{p.brand?.toUpperCase()} · {p.catLabel}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f9ff', lineHeight: 1.25 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(Math.round(p.rating))}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.rating} ({p.reviews?.toLocaleString()} reviews)</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.65, flex: 1 }}>{p.expertReason}</div>
                    {p.quickChange && (
                      <div style={{ fontSize: 11, color: '#06b6d4', padding: '6px 10px', background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.2)', borderRadius: 7 }}>
                        ⚡ <strong>Quick-Change Filter</strong> — twist-off cartridge, no mess, no tools
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #1a3a5c', marginTop: 4 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8' }}>${p.price}</span>
                      <BuyButtons p={p} block />
                    </div>
                  </div>
                </div>
              );
              return (
                <div style={{ animation: 'wcFadeUp .5s ease-out both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div className="wc-step" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>2</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f9ff' }}>Where to Buy — Our Top Picks for {sit.icon} {sit.label}s</div>
                    </div>
                  </div>
                  {sit.id === 'homeowner' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      {catOrder.map(cat => {
                        const catProds = sitProducts.filter((p: any) => p.cat === cat);
                        if (!catProds.length) return null;
                        return (
                          <div key={cat}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#0891b2', letterSpacing: 1, marginBottom: 12 }}>{catTitles[cat] || cat.toUpperCase()}</div>
                            <div className="wc-step4-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
                              {catProds.map(renderCard)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="wc-step4-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
                      {sitProducts.map(renderCard)}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ── STEP 3: filter categories (after situation / picks) ───────────────── */}
          <div className="wc-fadein-3" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="wc-step" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f9ff' }}>Pick your filter type</div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>Different setups, different needs. These are the main categories — each one matched to what your water actually contains.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(172px, 1fr))', gap: 12 }}>
              {([
                { id: 'pitcher' as const, icon: '🥤', label: 'Pitcher Filter', best: 'Chlorine, lead, taste', note: 'No install · Portable', bestFor: 'Renters, dorms, tight budgets', priceRange: '$28–$90', setup: 'No tools' },
                { id: 'countertop' as const, icon: '🪣', label: 'Countertop RO', best: 'Chlorine, PFAS, bacteria', note: 'No permanent plumbing', bestFor: 'Apartments & kitchens without drilling', priceRange: '$150–$550', setup: 'Mostly DIY' },
                { id: 'undersink' as const, icon: '🚰', label: 'Under-Counter RO', best: '99%+ of all contaminants', note: 'Most powerful option', bestFor: 'Families, PFAS/lead concerns', priceRange: '$250–$900', setup: 'DIY or plumber' },
                { id: 'whole' as const, icon: '🏠', label: 'Whole House System', best: 'Chlorine, chloramine, THMs', note: 'Every tap & shower', bestFor: 'Hard water, smell at every faucet', priceRange: '$800–$3,500+', setup: 'Usually pro install' },
                { id: 'shower' as const, icon: '🚿', label: 'Shower Filter', best: 'Chlorine & chloramine', note: 'Healthier skin & hair', bestFor: 'Chlorine sensitivity, quick upgrade', priceRange: '$30–$80', setup: '5–15 min DIY' },
              ] as const).map(f => {
                const active = heroSolutionKey === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setHeroSolutionKey(active ? null : f.id)}
                    className="wc-card"
                    style={{
                      borderRadius: 14,
                      padding: '18px 14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: active ? 'rgba(8,50,110,0.70)' : 'rgba(4,14,32,0.62)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: `1px solid ${active ? 'rgba(8,145,178,0.55)' : 'rgba(255,255,255,0.07)'}`,
                      borderTop: `1px solid ${active ? 'rgba(6,182,212,0.65)' : 'rgba(255,255,255,0.13)'}`,
                      boxShadow: active ? '0 0 28px rgba(8,145,178,.22), 0 12px 32px rgba(0,4,18,.4), inset 0 1px 0 rgba(255,255,255,.1)' : '0 8px 24px rgba(0,4,18,.35), inset 0 1px 0 rgba(255,255,255,.07)',
                      color: 'inherit',
                      font: 'inherit',
                      transition: 'box-shadow .2s, border-color .2s, background .2s',
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? '#38bdf8' : '#e2e8f0', marginBottom: 5 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: '#38bdf8', marginBottom: 4 }}>Removes: {f.best}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{f.note}</div>
                    <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.45, marginBottom: 4 }}>
                      <strong style={{ color: '#e2e8f0' }}>Best for:</strong> {f.bestFor}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>
                      {f.priceRange} · {f.setup}
                    </div>
                    {active && <div style={{ fontSize: 10, color: '#22d3ee', marginTop: 10, fontWeight: 800, letterSpacing: 0.5 }}>▼ See picks below</div>}
                  </button>
                );
              })}
            </div>

            {heroSolutionKey && (() => {
              const heroCatTitles: Record<string, string> = {
                undersink: '🚰 Under-Sink RO',
                'undersink-filter': '💧 Under-Sink Filter (Non-RO)',
                countertop: '🪣 Countertop RO',
                'countertop-filter': '🧊 Countertop Filter',
                whole: '🏠 Whole-House',
                shower: '🚿 Shower Filters',
                pitcher: '🥤 Pitcher Filters',
              };
              const catOrder = HERO_SOLUTION_CATS[heroSolutionKey];
              const sortExpertFirst = (a: any, b: any) => (b.expertPick ? 1 : 0) - (a.expertPick ? 1 : 0);
              const renderHeroPickCard = (p: any) => (
                <div key={p.id} className="wc-card" style={{ borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#fff', height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, position: 'relative' }}>
                    <img src={p.img} alt={p.name} style={{ maxHeight: 148, maxWidth: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    {p.expertPick && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5, boxShadow: '0 2px 8px #d9770655' }}>🏅 Expert Pick</div>
                    )}
                    {p.quickChange && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5, boxShadow: '0 2px 8px #06b6d455' }}>⚡ Quick-Change</div>
                    )}
                  </div>
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5 }}>{p.brand?.toUpperCase()} · {p.catLabel}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f9ff', lineHeight: 1.25 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(Math.round(p.rating))}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.rating} ({p.reviews?.toLocaleString()} reviews)</span>
                    </div>
                    {p.expertReason && (
                      <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.65, flex: 1 }}>{p.expertReason}</div>
                    )}
                    {p.quickChange && (
                      <div style={{ fontSize: 11, color: '#06b6d4', padding: '6px 10px', background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.2)', borderRadius: 7 }}>
                        ⚡ <strong>Quick-Change Filter</strong> — twist-off cartridge, no mess, no tools
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #1a3a5c', marginTop: 4 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8' }}>${p.price}</span>
                      <BuyButtons p={p} block />
                    </div>
                  </div>
                </div>
              );
              return (
                <div style={{ marginTop: 24, animation: 'wcFadeUp .45s ease-out both' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0891b2', letterSpacing: 1, marginBottom: 14 }}>
                    OUR TOP PICKS — {HERO_SOLUTION_SECTION_TITLE[heroSolutionKey].toUpperCase()}
                  </div>
                  {catOrder.length > 1 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {catOrder.map(cat => {
                        const catProds = PRODUCTS.filter((p: any) => p.cat === cat).sort(sortExpertFirst);
                        if (!catProds.length) return null;
                        return (
                          <div key={cat}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#22d3ee', letterSpacing: 0.8, marginBottom: 10 }}>{heroCatTitles[cat] || cat}</div>
                            <div className="wc-step4-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
                              {catProds.map(renderHeroPickCard)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="wc-step4-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
                      {PRODUCTS.filter((p: any) => p.cat === catOrder[0]).sort(sortExpertFirst).map(renderHeroPickCard)}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          </>
          )}

        </div>

          {/* Area change alerts — single field (step 3 conversion) */}
          <div
            id="wc-results-alerts"
            style={{ maxWidth: 620, margin: '24px auto 0', padding: '0 8px' }}
          >
            <div
              style={{
                padding: '18px 18px 16px',
                borderRadius: 12,
                border: '1px solid rgba(251, 191, 36, 0.35)',
                background: 'linear-gradient(165deg, rgba(120, 53, 15, 0.22) 0%, rgba(4, 14, 32, 0.92) 100%)',
                boxShadow: '0 12px 36px rgba(0,4,18,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc', marginBottom: 8, letterSpacing: -0.2 }}>
                Get Alerts If Your Water Changes
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, margin: '0 0 14px' }}>
                We&apos;ll notify you if new contaminants are detected in your area.
              </p>
              {resultsAlertSent ? (
                <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 700 }}>You&apos;re on the list. Watch your inbox.</div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                    <input
                      value={resultsAlertEmail}
                      onChange={e => setResultsAlertEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && subscribeResultsAreaAlerts()}
                      placeholder="Your email"
                      type="email"
                      autoComplete="email"
                      aria-label="Email for water change alerts"
                      style={{
                        flex: '1 1 220px',
                        minHeight: 46,
                        padding: '11px 14px',
                        background: 'rgba(4, 22, 48, 0.95)',
                        border: '1px solid rgba(251, 191, 36, 0.35)',
                        borderRadius: 10,
                        color: '#f1f5f9',
                        fontSize: 15,
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={subscribeResultsAreaAlerts}
                      disabled={resultsAlertSending || !resultsAlertEmail.includes('@')}
                      className="wc-hero-report-btn"
                      style={{
                        padding: '12px 22px',
                        minHeight: 46,
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: resultsAlertSending || !resultsAlertEmail.includes('@') ? 'not-allowed' : 'pointer',
                        opacity: resultsAlertSending || !resultsAlertEmail.includes('@') ? 0.55 : 1,
                        color: '#0f172a',
                        background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                        boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
                      }}
                    >
                      {resultsAlertSending ? '…' : 'Notify me'}
                    </button>
                  </div>
                  {resultsAlertErr && (
                    <div style={{ fontSize: 12, color: '#f87171', marginTop: 10 }}>{resultsAlertErr}</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Newsletter — after report (secondary) */}
        </div>
      )}

      {/* WQA GOLD SEAL — info modal */}
      {showWqaModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wqa-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: 16,
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowWqaModal(false)}
        >
          <div
            style={{
              background: 'rgba(3,12,28,0.92)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 16,
              padding: '26px 28px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
              maxWidth: 440,
              width: '92%',
              maxHeight: 'min(85vh, calc(100dvh - 32px))',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              margin: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14, flexShrink: 0 }}>
              <div>
                <div id="wqa-modal-title" style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.25 }}>
                  What is the WQA Gold Seal?
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', letterSpacing: 0.5, marginTop: 6 }}>Water Quality Association</div>
              </div>
              <button
                type="button"
                onClick={() => setShowWqaModal(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              <p style={{ margin: '0 0 14px', fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
                The <strong style={{ color: '#e2e8f0' }}>WQA Gold Seal</strong> is a product certification from the{' '}
                <strong style={{ color: '#e2e8f0' }}>Water Quality Association (WQA)</strong>, a not-for-profit trade group for the water treatment industry. Equipment that earns the Gold Seal has been{' '}
                <strong style={{ color: '#e2e8f0' }}>tested by an independent lab</strong> against published industry standards (often NSF/ANSI standards) for the claims on the label — for example contaminant reduction, structural integrity, and material safety.
              </p>
              <p style={{ margin: '0 0 18px', fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
                It is not a government “EPA stamp,” but it is a widely recognized third-party check that a filter or system does what its certification says. When shopping, match the <strong style={{ color: '#e2e8f0' }}>specific NSF/ANSI standard</strong> (e.g. 53 for lead, 58 for RO) to your water concern.
              </p>
              <a
                href="https://www.wqa.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, fontWeight: 700, color: '#22d3ee', textDecoration: 'none' }}
              >
                Learn more at wqa.org →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* NSF CERTIFIED — info modal */}
      {showNsfModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="nsf-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: 16,
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowNsfModal(false)}
        >
          <div
            style={{
              background: 'rgba(3,12,28,0.92)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 16,
              padding: '26px 28px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
              maxWidth: 440,
              width: '92%',
              maxHeight: 'min(85vh, calc(100dvh - 32px))',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              margin: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14, flexShrink: 0 }}>
              <div>
                <div id="nsf-modal-title" style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.25 }}>
                  What does NSF certified mean for filters?
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: 0.5, marginTop: 6 }}>NSF / ANSI standards</div>
              </div>
              <button
                type="button"
                onClick={() => setShowNsfModal(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              <p style={{ margin: '0 0 14px', fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
                <strong style={{ color: '#e2e8f0' }}>NSF certification</strong> means a water treatment product has been evaluated by an accredited lab against specific, published standards — not just marketing copy. For filters, the important part is{' '}
                <strong style={{ color: '#e2e8f0' }}>which NSF/ANSI standard</strong> it is certified to, because each standard covers different claims.
              </p>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, fontWeight: 600 }}>Common standards for drinking-water devices</p>
              <ul style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
                <li style={{ marginBottom: 8 }}><strong style={{ color: '#e2e8f0' }}>NSF/ANSI 42</strong> — aesthetic effects such as chlorine taste and odor.</li>
                <li style={{ marginBottom: 8 }}><strong style={{ color: '#e2e8f0' }}>NSF/ANSI 53</strong> — health-related contaminants the standard lists (e.g. many systems are certified for lead reduction when labeled that way).</li>
                <li style={{ marginBottom: 8 }}><strong style={{ color: '#e2e8f0' }}>NSF/ANSI 58</strong> — reverse osmosis systems (broad contaminant reduction scope defined by the standard).</li>
                <li><strong style={{ color: '#e2e8f0' }}>NSF/ANSI 401</strong> — some emerging compounds / incidental contaminants per the standard.</li>
              </ul>
              <p style={{ margin: '0 0 18px', fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
                A box that only says “NSF certified” without a standard number is not enough: check the label or NSF listings for the exact standard and contaminant claims that match your water (e.g. lead, PFAS, RO performance).
              </p>
              <a
                href="https://www.nsf.org/knowledge-library/what-is-nsf-certification"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, fontWeight: 700, color: '#22d3ee', textDecoration: 'none' }}
              >
                NSF home water treatment overview →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShare && data && <ShareModal data={data} onClose={() => setShowShare(false)} />}

      {/* SAMPLE REPORT + NEWSLETTER MODAL */}
      {showSample && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 160, padding: '16px', overflowY: 'auto' }} onClick={() => setShowSample(false)}>
          <div style={{ background: 'rgba(3,12,28,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(180,240,255,0.16)', borderRadius: 14, padding: '24px 24px 20px', maxWidth: 580, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#0891b2', letterSpacing: 1.5, fontWeight: 800, marginBottom: 4 }}>SAMPLE REPORT — BOSTON, MA</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>This is what your report looks like</div>
              </div>
              <button onClick={() => setShowSample(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>x</button>
            </div>

            <div style={{ background: '#040e1e', border: '1px solid #1a3a5c', borderRadius: 12, padding: '16px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#f1f5f9' }}>Boston, MA &mdash; MWRA</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Massachusetts Water Resources Authority</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>74</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Grade: C</div>
                </div>
              </div>
              <div style={{ padding: '10px 14px', background: '#ef444415', border: '1px solid #ef444430', borderLeft: '4px solid #ef4444', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', letterSpacing: 1, marginBottom: 4 }}>YOUR RISK VERDICT</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>Elevated Concern &mdash; PFAS above EPA limit + lead risk from aging pipes</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, marginBottom: 8 }}>CONTAMINANTS DETECTED</div>
              {[
                { name: 'PFOS', level: '6.2 ppt', limit: '4 ppt', over: true },
                { name: 'PFOA', level: '2.1 ppt', limit: '4 ppt', over: false },
                { name: 'Lead (90th pct)', level: '11 ppb', limit: '15 ppb', over: false },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #0f2336', gap: 6, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12 }}>{c.over ? String.fromCodePoint(128308) : String.fromCodePoint(128993)}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{c.name}</span>
                    {c.over && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430', fontWeight: 800 }}>OVER LIMIT</span>}
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{c.level} / limit {c.limit}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '9px 12px', background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#0891b2', letterSpacing: 1, marginBottom: 3 }}>RECOMMENDED FILTER</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>Under-sink RO (NSF 58) &mdash; removes PFAS &gt;99% and lead at the tap</div>
              </div>
            </div>

            <button onClick={() => { setShowSample(false); document.getElementById('wc-hero-zip')?.focus(); }}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
              Check my ZIP now &rarr;
            </button>
            {sampleSent ? (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: 13 }}>
                Subscribed. Check your inbox for weekly water updates.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>Or get weekly water alerts:</span>
                <input value={sampleEmail} onChange={e => setSampleEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && subscribeSample()} placeholder="you@email.com" type="email"
                  style={{ flex: '1 1 160px', minWidth: 0, padding: '8px 11px', background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
                <button onClick={subscribeSample} disabled={sampleSending || !sampleEmail.includes('@')}
                  style={{ padding: '8px 14px', background: sampleSending || !sampleEmail.includes('@') ? 'rgba(14,34,51,0.8)' : '#0f2a42', border: '1px solid #1e3a4a', borderRadius: 8, color: sampleSending || !sampleEmail.includes('@') ? '#475569' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: sampleSending || !sampleEmail.includes('@') ? 'default' : 'pointer', flexShrink: 0 }}>
                  {sampleSending ? '...' : 'Subscribe'}
                </button>
              </div>
            )}
            {sampleErr && <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 8 }}>{sampleErr}</div>}
            <div style={{ fontSize: 10, color: '#334155', marginTop: 8 }}>No spam. Unsubscribe anytime.</div>
          </div>
        </div>
      )}

      {/* CITY GRID + TRUST SECTION */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* Testimonials */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 20, textAlign: 'center' }}>WHAT PEOPLE ARE SAYING</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { quote: 'I had no idea my water had PFAS above the federal limit. Checked my ZIP, saw the report, ordered a filter that same night.', name: 'Sarah M.', location: 'Columbus, OH', stars: 5 },
              { quote: 'Finally a site that shows real EPA data instead of just trying to sell me something. The score made it immediately clear my water was a problem.', name: 'David K.', location: 'Phoenix, AZ', stars: 5 },
              { quote: 'Moved to a new city and checked the water before I even unpacked. Three open violations. Bought a filter before my first glass.', name: 'Priya S.', location: 'Chicago, IL', stars: 5 },
              { quote: 'My daughter has been drinking this water for two years. Seeing the lead risk on here convinced me to get a filter immediately. Should have found this sooner.', name: 'Marcus T.', location: 'Baltimore, MD', stars: 5 },
              { quote: 'We’re on a tight budget, so “free” mattered. Same EPA numbers I’d dig for myself, but in one screen — I finally understood what to filter for.', name: 'James R.', location: 'Denver, CO', stars: 5 },
              { quote: 'I compared our report to the utility’s PDF and it lined up. Gave me confidence to pick an RO system instead of guessing off a blog post.', name: 'Elena V.', location: 'Austin, TX', stars: 5 },
            ].map(({ quote, name, location, stars }) => (
              <div key={`${name}-${location}`} style={{ background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>{'★'.repeat(stars)}</div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>&ldquo;{quote}&rdquo;</p>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why WaterCheckup */}
        <section style={{ marginBottom: 48 }} aria-labelledby="why-watercheckup-heading">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 12 }}>WHY WATERCHECKUP</div>
          <h2 id="why-watercheckup-heading" style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 20px' }}>
            Why WaterCheckup
          </h2>
          <div className="wc-why-cards">
            {WHY_WATERCHECKUP_CARDS.map((card) => (
              <article key={card.title} className="wc-why-card">
                <div className="wc-why-card__icon" aria-hidden>{card.icon}</div>
                <h3 className="wc-why-card__title">{card.title}</h3>
                <p className="wc-why-card__body">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Social comparison hook */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { emoji: '🔬', stat: '45%', desc: 'of US tap water has detectable PFAS — most people have no idea' },
            { emoji: '🚰', stat: '400K+', desc: 'lead service lines still in use across the US as of 2025' },
            { emoji: '📋', stat: '70%+', desc: 'of Americans have never read their utility\'s water quality report' },
          ].map(({ emoji, stat, desc }) => (
            <div key={stat} style={{ flex: '1 1 200px', padding: '18px 20px', background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #1a3a5c', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b', marginBottom: 4 }}>{stat}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* ── TOP FILTER PICKS — affiliate CTA ─────────────────────── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 6 }}>MOST TRUSTED FILTERS</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.55, margin: '0 0 18px' }}>
            Not sure where to start? These are our most recommended filters across every situation — all certified, all quick-change.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { id: 3,  emoji: '🏆', label: 'Best overall RO',      name: 'Waterdrop G3P800',         price: 849, tag: 'NSF 42 · NSF 53 · NSF 58 · 99%+ PFAS',   accent: '#22d3ee', amazon: WATERDROP_AMAZON_BY_ID[3]!, direct: WATERDROP_DIRECT_BY_ID[3]! },
              { id: 9,  emoji: '🥤', label: 'Best PFAS pitcher',    name: 'Clearly Filtered Pitcher', price: 90,  tag: 'NSF 42 · NSF 53 · NSF 401 · NSF P473',   accent: '#f59e0b', amazon: `https://www.amazon.com/dp/B076B6FXT5?tag=${TAG}` },
              { id: 6,  emoji: '🪣', label: 'Best for renters',     name: 'Waterdrop K19-S Countertop RO',  price: 199, tag: 'NSF 42 · NSF 53 · NSF 58 · No install',  accent: '#06b6d4', amazon: WATERDROP_AMAZON_BY_ID[6]!, direct: WATERDROP_DIRECT_BY_ID[6]! },
              { id: 32, emoji: '🏠', label: 'Best whole-house',     name: 'Aquasana Rhino EQ-1000',   price: 999, tag: 'WQA Gold Seal · NSF 42 · NSF 61',         accent: '#34d399', amazon: `https://www.amazon.com/dp/B00XAJJVHQ?tag=${TAG}` },
              { id: 20, emoji: '🚿', label: 'Best shower filter',   name: 'AquaBliss SF100',          price: 35,  tag: '42K+ reviews · KDF/GAC certified',        accent: '#a78bfa', amazon: `https://www.amazon.com/dp/B01MUBU0YC?tag=${TAG}` },
            ].map((row) => {
              const { id, emoji, label, name, price, tag, accent, amazon } = row;
              const direct = 'direct' in row ? row.direct : undefined;
              const cardStyle: CSSProperties = {
                display: 'flex', flexDirection: 'column', gap: 8,
                padding: '16px 16px 14px',
                background: 'linear-gradient(165deg,rgba(7,24,40,0.95),rgba(4,14,32,0.92))',
                border: `1px solid ${accent}30`,
                borderTop: `2px solid ${accent}`,
                borderRadius: 10,
                textDecoration: 'none',
              };
              const inner = (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 20 }}>{emoji}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: accent, padding: '2px 6px', borderRadius: 4, background: `${accent}15`, border: `1px solid ${accent}30` }}>{label.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.3 }}>{name}</div>
                  <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 0.3 }}>{tag}</div>
                  <div style={{ display: 'flex', flexDirection: direct ? 'column' : 'row', alignItems: direct ? 'stretch' : 'center', justifyContent: 'space-between', gap: direct ? 8 : 0, marginTop: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>${price}</span>
                    {direct ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <a
                          href={direct}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', padding: '8px 10px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg,#22d3ee,#06b6d4)', border: '1px solid rgba(34,211,238,0.5)' }}
                        >
                          Waterdrop.com →
                        </a>
                        <a
                          href={amazon}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', padding: '6px 10px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(100,116,139,0.35)', background: 'rgba(15,23,42,0.5)' }}
                        >
                          Amazon →
                        </a>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: accent, padding: '5px 10px', borderRadius: 6, background: `${accent}15`, border: `1px solid ${accent}30` }}>Amazon →</span>
                    )}
                  </div>
                </>
              );
              if (direct) {
                return (
                  <div key={`trusted-${id}`} style={cardStyle}>
                    {inner}
                  </div>
                );
              }
              return (
                <a key={`trusted-${id}`} href={amazon} target="_blank" rel="noopener noreferrer sponsored" style={cardStyle}>
                  {inner}
                </a>
              );
            })}
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#cbd5e1',
              marginTop: 12,
              lineHeight: 1.55,
              maxWidth: 720,
            }}
          >
            * Affiliate links — we may earn a commission at no cost to you. Our recommendations are based on certifications and data, not paid placements.
          </p>
        </div>

        {/* Browse by city */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 4 }}>BROWSE BY CITY</div>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 8, marginTop: 0 }}>Search any ZIP — not just the cities below</p>
          <label htmlFor="wc-city-filter" style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
            Type to filter cities
          </label>
          <input
            id="wc-city-filter"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="e.g. Chicago, Tampa, Denver…"
            value={cityBrowseFilter}
            onChange={(e) => setCityBrowseFilter(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 420,
              boxSizing: 'border-box',
              marginBottom: 14,
              padding: '11px 14px',
              borderRadius: 10,
              border: '1px solid #1a3a5c',
              background: '#071828',
              color: '#e2e8f0',
              fontSize: 14,
              outline: 'none',
            }}
          />
          {filteredHomepageCities.length === 0 && (
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
              No matches.{' '}
              <a href="/water" style={{ color: '#22d3ee', fontWeight: 600 }}>
                Open the full city directory →
              </a>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {cityBrowseGrouped.map(({ region, cities }) => (
              <div key={region}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: '#64748b', marginBottom: 10 }}>{region}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {cities.map(({ slug, name }) => {
                    const badge = cityBrowseBadge(slug);
                    return (
                      <a
                        key={slug}
                        href={`/water/${slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          background: 'linear-gradient(165deg, rgba(13,34,64,0.95), rgba(7,24,40,0.92))',
                          border: '1px solid #1e3a5c',
                          borderRadius: 10,
                          fontSize: 13,
                          color: '#e2e8f0',
                          textDecoration: 'none',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{name.split(',')[0]}</span>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{name.includes(',') ? name.slice(name.indexOf(',')) : ''}</span>
                        {badge && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing: 0.4,
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: badge === 'Lead risk'
                                ? 'rgba(239,68,68,0.12)'
                                : badge === 'PFAS noted'
                                ? 'rgba(245,158,11,0.12)'
                                : 'rgba(148,163,184,0.12)',
                              border: badge === 'Lead risk'
                                ? '1px solid rgba(239,68,68,0.35)'
                                : badge === 'PFAS noted'
                                ? '1px solid rgba(245,158,11,0.35)'
                                : '1px solid rgba(148,163,184,0.25)',
                              color: badge === 'Lead risk'
                                ? '#fca5a5'
                                : badge === 'PFAS noted'
                                ? '#fcd34d'
                                : '#94a3b8',
                              flexShrink: 0,
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
            <div>
              <a
                href="/water"
                style={{
                  display: 'inline-flex',
                  padding: '8px 14px',
                  background: '#0891b220',
                  border: '1px solid #0891b250',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#0891b2',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                {VIEW_ALL_WATER_SYSTEMS_LINK}
              </a>
            </div>
          </div>
        </div>

        {/* Blog teasers */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16 }}>FROM THE BLOG</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { slug: 'is-pfas-in-my-tap-water', emoji: '☣️', tag: 'PFAS', title: 'Is PFAS in My Tap Water?', desc: 'PFAS found in 45% of US tap water. Here\'s how to check yours.', accent: '#ef4444' },
              { slug: 'best-ro-system-for-pfas-removal', emoji: '🔬', tag: 'Filter Guide', title: 'Best RO Systems for PFAS 2025', desc: 'The certified filters that actually work, at every budget.', accent: '#0891b2' },
              { slug: 'tap-water-safety-during-pregnancy', emoji: '🤰', tag: 'Health', title: 'Tap Water Safety During Pregnancy', desc: 'Lead, nitrates, PFAS — what to filter and why.', accent: '#f59e0b' },
              { slug: 'moving-to-new-city-water-quality-check', emoji: '📦', tag: 'Moving', title: 'Moving? Check the Water First', desc: 'Water quality varies dramatically by city. Here\'s what to look for.', accent: '#22d3ee' },
              { slug: 'bottled-water-vs-tap-water-cost-safety-and-pfas', emoji: '🍶', tag: 'Comparison', title: 'Bottled Water vs. Tap Water', desc: 'Bottled water is not automatically purer. Here\'s the cost, safety, and PFAS reality.', accent: '#94a3b8' },
              { slug: 'lead-in-tap-water-signs-and-symptoms', emoji: '⚠️', tag: 'Lead', title: 'Lead in Tap Water: Signs & Risk', desc: 'Lead has no taste or smell. Here\'s how to know if your home is at risk.', accent: '#f87171' },
            ].map(({ slug, emoji, tag, title, desc, accent }) => (
              <a key={slug} href={`/blog/${slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 18px 16px', background: 'linear-gradient(165deg,rgba(13,34,64,0.95),rgba(7,24,40,0.92))', border: '1px solid #1a3a5c', borderTop: `2px solid ${accent}`, borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: accent, padding: '2px 7px', borderRadius: 4, background: `${accent}18`, border: `1px solid ${accent}33` }}>{tag}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>{desc}</div>
                <div style={{ fontSize: 11, color: accent, fontWeight: 700, marginTop: 2 }}>Read more →</div>
              </a>
            ))}
          </div>
        </div>

        {/* ── EMAIL CAPTURE — homepage standalone ── */}
        <HomeEmailCapture />

      </div>

      {data && !loading && !wellMode && (
        <button
          type="button"
          className="wc-back-to-report"
          onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          ↑ Your report
        </button>
      )}

    </div>
  );
}
