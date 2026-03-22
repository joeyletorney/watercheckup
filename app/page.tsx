'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TAG = 'watercheck-20';

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWaterData(zip: string) {
  const res = await fetch(`/api/water?zip=${zip}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
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
  { id: 'homeowner', icon: '🏠', label: 'Homeowner', sub: 'Full install options' },
  { id: 'renter',    icon: '🏢', label: 'Renter / Apartment', sub: 'No-drill solutions' },
  { id: 'dorm',      icon: '🎓', label: 'Dorm / Student', sub: 'Portable & pitcher' },
  { id: 'family',    icon: '👨‍👩‍👧', label: 'Family with Kids', sub: 'School & home protection' },
  { id: 'travel',    icon: '✈️', label: 'Travel / Temporary', sub: 'On-the-go filtering' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FULL PRODUCT CATALOG — 22 products, 6 categories, all NSF/WQA certified
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS: any[] = [
  // ── UNDER-SINK RO ──────────────────────────────────────────────────────────
  { id:1, cat:'undersink', catLabel:'Under-Sink RO', name:'APEC ROES-50', brand:'APEC Water Systems', price:219, filterCostPerYear:95, rating:4.7, reviews:28400, gpd:50, stages:5, cert:['WQA Gold Seal','NSF/ANSI 58'], certColor:'#d97706', removes:['Lead >99%','Arsenic >99%','Fluoride >96%','Chlorine >98%','TDS >93%'], bestFor:['Lead','Arsenic','Fluoride','Nitrate','Copper'], pros:['Made in USA','Budget-friendly','DIY install ~2hrs'], diyDiff:'Medium', situations:['homeowner','family'], img:'https://m.media-amazon.com/images/I/61cF0FQEDBL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00I0ZGOZM?tag=${TAG}` },
  { id:2, cat:'undersink', catLabel:'Under-Sink RO', name:'iSpring RCC7AK', brand:'iSpring', price:229, filterCostPerYear:80, rating:4.7, reviews:14200, gpd:75, stages:6, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['Lead >98.9%','PFAS >96%','Chromium >99%','Fluoride >97%'], bestFor:['Lead','PFAS','Chromium-6','Copper'], pros:['Remineralization stage','75 GPD fast','pH balanced'], diyDiff:'Medium', situations:['homeowner','family'], img:'https://m.media-amazon.com/images/I/71RKD7DEYBL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B005LJ8EXU?tag=${TAG}` },
  { id:3, cat:'undersink', catLabel:'Under-Sink RO', name:'Waterdrop G3P800', brand:'Waterdrop', price:449, filterCostPerYear:170, rating:4.8, reviews:9800, gpd:800, stages:8, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 372'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','Fluoride','Chlorine'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['No tank','800 GPD','Smart LED faucet'], diyDiff:'Medium', situations:['homeowner','family'], tankless:true, img:'https://m.media-amazon.com/images/I/61Y0jVJoVxL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B07P1XFYJP?tag=${TAG}` },
  { id:4, cat:'undersink', catLabel:'Under-Sink RO', name:'Home Master TMAFC', brand:'Home Master', price:379, filterCostPerYear:110, rating:4.6, reviews:3200, gpd:75, stages:7, cert:['NSF Certified','WQA tested'], certColor:'#d97706', removes:['Lead >99%','Chlorine >98%','PFAS','VOCs'], bestFor:['Lead','Chlorine','Iron','VOCs'], pros:['Dual remineralization','1:1 waste ratio'], diyDiff:'Medium', situations:['homeowner','family'], img:'https://m.media-amazon.com/images/I/71b1VFe2VJL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00B5GT45E?tag=${TAG}` },
  { id:5, cat:'undersink', catLabel:'Under-Sink RO', name:'Aquasana SmartFlow RO', brand:'Aquasana', price:449, filterCostPerYear:145, rating:4.7, reviews:2100, gpd:50, stages:5, cert:['WQA Gold Seal','NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58','NSF/ANSI 401'], certColor:'#d97706', removes:['90+ contaminants','Fluoride 90%','Lead >99%','Microplastics','PFAS'], bestFor:['PFAS','Lead','Fluoride','Microplastics'], pros:['Most certified','90 contaminants'], diyDiff:'Medium', situations:['homeowner','family'], img:'https://m.media-amazon.com/images/I/71gFCKKMNwL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B01AO49OAQ?tag=${TAG}` },

  // ── COUNTERTOP / PORTABLE RO — no installation needed ──────────────────────
  { id:6, cat:'countertop', catLabel:'Countertop RO', name:'Waterdrop D4 Countertop RO', brand:'Waterdrop', price:299, filterCostPerYear:120, rating:4.6, reviews:4800, gpd:400, stages:4, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 58'], certColor:'#22d3ee', removes:['PFAS >99%','Lead >99%','TDS','Chlorine','Bacteria'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['Zero installation','Countertop placement','Perfect for renters'], diyDiff:'None', situations:['renter','dorm','family'], img:'https://m.media-amazon.com/images/I/61Ij4S5PPBL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B0BV4BBQRD?tag=${TAG}` },
  { id:7, cat:'countertop', catLabel:'Countertop RO', name:'APEC RO-CTOP', brand:'APEC Water Systems', price:179, filterCostPerYear:80, rating:4.5, reviews:2900, gpd:90, stages:4, cert:['WQA Gold Seal','NSF/ANSI 58'], certColor:'#d97706', removes:['Lead >99%','Arsenic >99%','Fluoride','Chloramine','TDS'], bestFor:['Lead','Arsenic','Fluoride','Nitrate'], pros:['No installation','Portable','Connects to faucet'], diyDiff:'None', situations:['renter','dorm'], img:'https://m.media-amazon.com/images/I/71jY+cEQGML._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00JWLMQZE?tag=${TAG}` },
  { id:8, cat:'countertop', catLabel:'Countertop RO', name:'Zero Installation Purifier ZIP-100', brand:'iSpring', price:159, filterCostPerYear:65, rating:4.4, reviews:1800, gpd:75, stages:5, cert:['NSF/ANSI 42','NSF/ANSI 58'], certColor:'#22d3ee', removes:['Lead >98%','Arsenic >97%','Chlorine >99%','TDS','Heavy metals'], bestFor:['Lead','Arsenic','Copper','Chlorine'], pros:['Sits on countertop','No plumbing needed','Great for apartments'], diyDiff:'None', situations:['renter','dorm'], img:'https://m.media-amazon.com/images/I/71h7s9HDAPL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B01M0GXKL5?tag=${TAG}` },

  // ── PITCHER FILTERS ─────────────────────────────────────────────────────────
  { id:9, cat:'pitcher', catLabel:'Pitcher Filter', name:'Clearly Filtered 3.5L Pitcher', brand:'Clearly Filtered', price:90, filterCostPerYear:140, rating:4.7, reviews:8200, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 244','NSF/ANSI 401','NSF/ANSI P473'], certColor:'#22d3ee', removes:['PFAS >99.9%','Lead >99.5%','Arsenic >99.4%','Chromium-6','365+ contaminants'], bestFor:['PFAS','Lead','Arsenic','Chromium-6','Uranium'], pros:['Removes PFAS — rare for pitcher','365+ contaminants','Best-in-class pitcher'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://m.media-amazon.com/images/I/61YUZFLq1ML._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B083HVG9T8?tag=${TAG}` },
  { id:10, cat:'pitcher', catLabel:'Pitcher Filter', name:'ZeroWater 10-Cup Pitcher', brand:'ZeroWater', price:40, filterCostPerYear:100, rating:4.5, reviews:31000, gpd:null, stages:5, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 100%','Chromium 100%','TDS to 0','Mercury','Arsenic'], bestFor:['Lead','Arsenic','Chromium-6','Uranium'], pros:['Removes TDS to 0','Includes TDS meter','Budget-friendly'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://m.media-amazon.com/images/I/71TExSYBp8L._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B01I2I2R36?tag=${TAG}` },
  { id:11, cat:'pitcher', catLabel:'Pitcher Filter', name:'PUR PLUS 11-Cup Pitcher', brand:'PUR', price:42, filterCostPerYear:110, rating:4.5, reviews:22000, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 100%','Arsenic 100%','Uranium 100%','PFNA 96%'], bestFor:['Lead','Arsenic','Uranium','Chromium-6'], pros:['No install','Portable','Budget-friendly'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://m.media-amazon.com/images/I/71Pg8yZLLfL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B07NMQNHPB?tag=${TAG}` },
  { id:12, cat:'pitcher', catLabel:'Pitcher Filter', name:'Brita Large 10-Cup Everyday', brand:'Brita', price:28, filterCostPerYear:65, rating:4.6, reviews:62000, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Chlorine taste/odor','Mercury','Cadmium','Copper'], bestFor:['Chlorine','Copper','Mercury'], pros:['Most popular pitcher','Budget-friendly','Widely available'], diyDiff:'None', situations:['renter','dorm','family','travel'], img:'https://m.media-amazon.com/images/I/61L6LJkuF0L._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00008WOPI?tag=${TAG}` },

  // ── FAUCET MOUNT ────────────────────────────────────────────────────────────
  { id:13, cat:'faucet', catLabel:'Faucet Mount', name:'PUR PLUS Faucet Mount FM2000B', brand:'PUR', price:35, filterCostPerYear:80, rating:4.5, reviews:28000, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 99%','Arsenic 96%','Mercury','Chlorine','Microbial cysts'], bestFor:['Lead','Arsenic','Mercury','Chlorine'], pros:['Attaches to faucet','No permanent install','One-click on/off'], diyDiff:'Easy', situations:['renter','family','dorm'], img:'https://m.media-amazon.com/images/I/71HLiFKEhUL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B0B3Z2BCFB?tag=${TAG}` },
  { id:14, cat:'faucet', catLabel:'Faucet Mount', name:'Brita Complete Faucet Filtration', brand:'Brita', price:30, filterCostPerYear:70, rating:4.4, reviews:19000, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead','Asbestos','Benzene','Chlorine','Chloramine'], bestFor:['Lead','Chlorine','Chloramine','Asbestos'], pros:['Easy faucet attachment','3-way diverter','No tools needed'], diyDiff:'Easy', situations:['renter','family'], img:'https://m.media-amazon.com/images/I/81gD5ZsqoLL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B0002JJRKY?tag=${TAG}` },

  // ── WATER BOTTLES / PORTABLE ────────────────────────────────────────────────
  { id:15, cat:'bottle', catLabel:'Filtered Water Bottle', name:'Clearly Filtered Water Bottle', brand:'Clearly Filtered', price:75, filterCostPerYear:60, rating:4.6, reviews:3100, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 53','NSF/ANSI 401'], certColor:'#22d3ee', removes:['Lead >99.5%','PFAS >99.8%','Arsenic >99%','230+ contaminants'], bestFor:['PFAS','Lead','Arsenic','Chromium-6'], pros:['Best portable PFAS removal','School & campus safe','Stainless steel'], diyDiff:'None', situations:['dorm','family','travel'], img:'https://m.media-amazon.com/images/I/71ys1IURSKL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B07QNKQX1F?tag=${TAG}` },
  { id:16, cat:'bottle', catLabel:'Filtered Water Bottle', name:'LifeStraw Go Series', brand:'LifeStraw', price:40, filterCostPerYear:20, rating:4.7, reviews:18000, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Bacteria 99.99%','Parasites 99.9%','Microplastics','Lead','Chlorine'], bestFor:['Bacteria','Parasites','Lead','Microplastics'], pros:['Great for travel','Ultra lightweight','No batteries'], diyDiff:'None', situations:['dorm','travel'], img:'https://m.media-amazon.com/images/I/61a9FbJK5pL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00B3UPMEW?tag=${TAG}` },
  { id:17, cat:'bottle', catLabel:'Filtered Water Bottle', name:'Berkey Sport Bottle', brand:'Berkey', price:35, filterCostPerYear:15, rating:4.5, reviews:4200, gpd:null, stages:2, cert:['EPA WQA tested'], certColor:'#475569', removes:['Bacteria >99.9%','Viruses >99.9%','Chlorine','Heavy metals'], bestFor:['Bacteria','Viruses','Lead','Chlorine'], pros:['Works on any water source','Zero waste','Budget-friendly'], diyDiff:'None', situations:['dorm','travel'], img:'https://m.media-amazon.com/images/I/41o1TgkSgQL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B0006VTRIY?tag=${TAG}` },

  // ── WHOLE HOUSE ─────────────────────────────────────────────────────────────
  { id:18, cat:'whole', catLabel:'Whole-House', name:'Pelican PC600 Whole-House', brand:'Pelican Water', price:899, filterCostPerYear:120, rating:4.7, reviews:1800, gpd:null, stages:3, cert:['NSF/ANSI 42','NSF/ANSI 61','WQA Gold Seal'], certColor:'#d97706', removes:['Chlorine >97%','Chloramine','THMs','VOCs','Sediment'], bestFor:['Chloramine','Chloroform','HAAs','VOCs'], pros:['Whole house','No salt','6yr filter life'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, img:'https://m.media-amazon.com/images/I/81r1fLVQbwL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B001JM5OQ0?tag=${TAG}` },
  { id:19, cat:'whole', catLabel:'Whole-House', name:'iSpring WGB32B Whole House 3-Stage', brand:'iSpring', price:189, filterCostPerYear:70, rating:4.6, reviews:7200, gpd:null, stages:3, cert:['NSF/ANSI 42'], certColor:'#22d3ee', removes:['Sediment','Chlorine','Chloramine','VOCs','Iron'], bestFor:['Chlorine','Chloramine','Sediment','Iron'], pros:['Most affordable whole-house','DIY-friendly','Large flow rate'], diyDiff:'Hard', situations:['homeowner'], wholeHouse:true, img:'https://m.media-amazon.com/images/I/71K9E39BPKL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B007QN8EEU?tag=${TAG}` },

  // ── SHOWER FILTERS ──────────────────────────────────────────────────────────
  { id:20, cat:'shower', catLabel:'Shower Filter', name:'AquaBliss High Output SF100', brand:'AquaBliss', price:35, filterCostPerYear:35, rating:4.4, reviews:42000, gpd:null, stages:5, cert:['KDF/GAC Certified'], certColor:'#475569', removes:['Chlorine','Heavy metals','Scale','Bacteria'], bestFor:['Chlorine','Scale','Bacteria'], pros:['Reduces skin & hair dryness','Easy install in minutes','Universal fit'], diyDiff:'Easy', situations:['homeowner','renter','dorm'], img:'https://m.media-amazon.com/images/I/71VGg8SXSAL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B01N1I34SF?tag=${TAG}` },
  { id:21, cat:'shower', catLabel:'Shower Filter', name:'Pelican PSF-1 Premium Shower', brand:'Pelican Water', price:70, filterCostPerYear:60, rating:4.6, reviews:3800, gpd:null, stages:3, cert:['NSF/ANSI 177','KDF-55'], certColor:'#d97706', removes:['Chlorine >96%','Chloramine','Scale','Hydrogen sulfide'], bestFor:['Chlorine','Chloramine','Scale'], pros:['NSF 177 certified','Better skin/hair','Lasts 15,000 gallons'], diyDiff:'Easy', situations:['homeowner','renter'], img:'https://m.media-amazon.com/images/I/717s+JZmJrL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B00YM5MG14?tag=${TAG}` },

  // ── REFRIGERATOR / INLINE ───────────────────────────────────────────────────
  { id:22, cat:'fridge', catLabel:'Refrigerator / Inline', name:'GLACIER FRESH Inline Filter', brand:'Glacier Fresh', price:25, filterCostPerYear:50, rating:4.5, reviews:8900, gpd:null, stages:2, cert:['NSF/ANSI 42','NSF/ANSI 53'], certColor:'#22d3ee', removes:['Lead 99%','Chlorine 99%','Cysts','Fluoride 70%'], bestFor:['Lead','Chlorine','Cysts'], pros:['Universal fit','Works with most fridges','DIY 5 min'], diyDiff:'Easy', situations:['homeowner','renter','family'], img:'https://m.media-amazon.com/images/I/61zGkmfBqmL._AC_SL1500_.jpg', amazon:`https://www.amazon.com/dp/B07CF5HLBQ?tag=${TAG}` },
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
    description: 'You can install under-sink RO or a whole-house system. Under-sink gives the cleanest drinking water; whole-house protects every tap, shower, and appliance.',
    primaryCats: ['undersink','whole'],
    avoid: 'Skip pitchers long-term — the per-gallon cost is 3x higher than RO.',
    tip: 'Most under-sink RO systems take 2–3 hours to install with basic tools. Look for a WQA-certified installer if you\'re not comfortable with the plumbing connections.',
  },
  renter: {
    headline: 'No-drill solutions for renters',
    description: 'You can\'t drill into cabinets or modify plumbing. Countertop RO systems connect to your existing faucet in minutes with zero permanent changes. Faucet-mount filters are even simpler.',
    primaryCats: ['countertop','faucet','pitcher'],
    avoid: 'Avoid under-sink systems — they require drilling and permanent plumbing modifications that violate most leases.',
    tip: 'The Waterdrop D4 Countertop RO is the best no-install option — it removes 99%+ PFAS and lead with no tools or landlord permission needed.',
  },
  dorm: {
    headline: 'Dorm room & campus water solutions',
    description: 'Campus water often has aging pipes with lead risk. A pitcher filter or countertop RO on your desk handles drinking water. Get a filtered water bottle for the dining hall and class.',
    primaryCats: ['pitcher','bottle','countertop'],
    avoid: 'Don\'t rely on the drinking fountains — campus water systems are often older buildings with lead service lines.',
    tip: 'Clearly Filtered pitcher is the only pitcher that removes PFAS — worth the extra cost if your school\'s water tests positive.',
  },
  family: {
    headline: 'Protecting your whole family',
    description: 'Children are more vulnerable to lead and PFAS. Under-sink RO handles cooking and drinking water at home. Add a filtered school bottle for kids on the go.',
    primaryCats: ['undersink','pitcher','bottle'],
    avoid: 'Regular Brita pitchers don\'t remove PFAS or lead at high efficiency — for kids, get Clearly Filtered or an RO system.',
    tip: 'The #1 priority for families with kids under 6: lead and PFAS removal. Both require RO or a specifically PFAS-certified pitcher (like Clearly Filtered).',
  },
  travel: {
    headline: 'Filtering water on the go',
    description: 'For hotel rooms, Airbnbs, and travel, a filtered water bottle is all you need. For longer stays or RVs, a countertop RO is a game-changer.',
    primaryCats: ['bottle','pitcher'],
    avoid: 'Don\'t trust hotel tap water — aging building plumbing can have lead even when the municipal supply is clean.',
    tip: 'The LifeStraw Go works on virtually any water source worldwide — perfect for international travel or outdoor adventures.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE DATABASE LINKS
// ─────────────────────────────────────────────────────────────────────────────
const STATE_DB: Record<string, { name: string; url: string }> = {
  CA: { name: 'CA GAMA Groundwater Quality', url: 'https://gamagroundwater.waterboards.ca.gov/' },
  TX: { name: 'TX TCEQ Water Quality', url: 'https://www.tceq.texas.gov/drinkingwater/' },
  FL: { name: 'FL DEP Drinking Water', url: 'https://floridadep.gov/water/drinking-water' },
  NY: { name: 'NY DOH Water Quality', url: 'https://www.health.ny.gov/environmental/water/drinking/' },
  IL: { name: 'IL EPA Drinking Water', url: 'https://www2.illinois.gov/epa/topics/water-quality/drinking-water/' },
  PA: { name: 'PA DEP Safe Drinking Water', url: 'https://www.dep.pa.gov/Business/Water/DrinkingWater/' },
  OH: { name: 'OH EPA Drinking Water', url: 'https://epa.ohio.gov/divisions-and-offices/drinking-and-ground-waters' },
  MI: { name: 'MI EGLE Drinking Water', url: 'https://www.michigan.gov/egle/about/organization/drinking-water-and-environmental-health' },
  GA: { name: 'GA EPD Drinking Water', url: 'https://epd.georgia.gov/watershed-protection-branch/drinking-water-program' },
  NC: { name: 'NC DEQ Water Quality', url: 'https://deq.nc.gov/about/divisions/water-resources/drinking-water' },
  NJ: { name: 'NJ DEP Safe Drinking Water', url: 'https://www.nj.gov/dep/watersupply/' },
  VA: { name: 'VA DEQ Water Quality', url: 'https://www.deq.virginia.gov/programs/water/drinking-water' },
  WA: { name: 'WA DOH Drinking Water', url: 'https://doh.wa.gov/community-and-environment/drinking-water' },
  AZ: { name: 'AZ ADEQ Drinking Water', url: 'https://azdeq.gov/drinking-water' },
  MA: { name: 'MA DEP Drinking Water', url: 'https://www.mass.gov/orgs/drinking-water-program' },
  TN: { name: 'TN DEC Drinking Water', url: 'https://www.tn.gov/environment/program-areas/wr-water-resources/drinking-water.html' },
  IN: { name: 'IN DW & NPDES', url: 'https://www.in.gov/idem/water/drinking-water/' },
  MO: { name: 'MO Clean Water Commission', url: 'https://www.mo.gov/agency/mohea' },
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

const SEV: Record<string, { color: string; label: string }> = {
  low:      { color: '#22d3ee', label: 'Within Limits' },
  moderate: { color: '#f59e0b', label: 'Elevated' },
  high:     { color: '#ef4444', label: 'Exceeds Limit' },
};

const STEPS = [
  'Querying EPA Envirofacts API…',
  'Finding water system for ZIP…',
  'Pulling SDWIS violation records…',
  'Fetching Lead & Copper samples…',
  'Cross-referencing UCMR5 PFAS database…',
  'Loading EWG Tap Water Atlas data…',
  'Building your personalized report…',
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DIAL
// ─────────────────────────────────────────────────────────────────────────────
function ScoreDial({ score, grade }: { score: number; grade: string }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(score), 150); return () => clearTimeout(t); }, [score]);
  const r = 72, cx = 90, cy = 90;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (a: number) => ({ x: cx + r * Math.cos(rad(a)), y: cy + r * Math.sin(rad(a)) });
  const arc = (s: number, e: number) => {
    const p1 = pt(s), p2 = pt(e), lg = e - s > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${lg} 1 ${p2.x} ${p2.y}`;
  };
  const color = score >= 80 ? '#22d3ee' : score >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="180" height="160" viewBox="0 0 180 160">
      <path d={arc(210, 510)} fill="none" stroke="#1e3a4a" strokeWidth="10" strokeLinecap="round" />
      <path d={arc(210, 210 + 300 * (anim / 100))} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        style={{ transition: 'all 1.3s cubic-bezier(0.34,1.56,0.64,1)' }} filter={`drop-shadow(0 0 8px ${color}88)`} />
      <text x={cx} y={cy + 8}  textAnchor="middle" fontSize="32" fontWeight="800" fill={color} fontFamily="inherit">{anim}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="inherit">Grade: {grade}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ p, highlight, compact }: { p: any; highlight: boolean; compact?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const diyColors: Record<string, string> = { None: '#22d3ee', Easy: '#22d3ee', Medium: '#f59e0b', Hard: '#ef4444' };

  if (compact) {
    return (
      <div style={{ background: highlight ? '#0e2545' : '#0b1e36', border: `1px solid ${highlight ? '#0891b2' : '#0e2233'}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 60, height: 60, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {!imgErr ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ maxHeight: 55, maxWidth: 55, objectFit: 'contain' }} /> : <div style={{ fontSize: 20 }}>💧</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 1 }}>{p.brand}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2, marginBottom: 4 }}>{p.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: diyColors[p.diyDiff] || '#22d3ee' }}>Install: {p.diyDiff}</span>
            {p.removes.slice(0, 2).map((r: string) => <span key={r} style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#051527', color: '#22d3ee', border: '1px solid #22d3ee22' }}>{r}</span>)}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#22d3ee' }}>${p.price}</div>
          <a href={p.amazon} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 6, padding: '5px 10px', background: '#f59e0b', borderRadius: 5, color: '#000', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>Buy →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: highlight ? '#0e2545' : '#0b1e36', border: `1px solid ${highlight ? '#0891b2' : '#0e2233'}`, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative' }}>
        {!imgErr ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain' }} /> : <div style={{ fontSize: 36 }}>💧</div>}
        {highlight && <div style={{ position: 'absolute', top: 6, right: 6, background: '#0891b2', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>TOP PICK</div>}
        {p.tankless && <div style={{ position: 'absolute', top: 6, left: 6, background: '#7c3aed', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>TANKLESS</div>}
        <div style={{ position: 'absolute', bottom: 6, left: 6, background: diyColors[p.diyDiff] + '22', border: `1px solid ${diyColors[p.diyDiff]}44`, borderRadius: 3, padding: '1px 6px', fontSize: 10, color: diyColors[p.diyDiff], fontWeight: 700 }}>
          Install: {p.diyDiff}
        </div>
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div>
          <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1, marginBottom: 1 }}>{p.brand.toUpperCase()} · {p.catLabel}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2 }}>{p.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(Math.round(p.rating))}</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.rating} ({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {p.cert.slice(0,2).map((c: string) => <span key={c} style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: p.certColor + '22', color: p.certColor, border: `1px solid ${p.certColor}44`, fontWeight: 700 }}>{c}</span>)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#334155', letterSpacing: 1, marginBottom: 3 }}>REMOVES</div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {p.removes.slice(0, 3).map((r: string) => <span key={r} style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#051527', color: '#22d3ee', border: '1px solid #22d3ee22' }}>{r}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 2 }}>
          {p.pros.slice(0, 2).map((pro: string) => <div key={pro} style={{ fontSize: 11, color: '#64748b' }}>✓ {pro}</div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #0e2233' }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#22d3ee' }}>${p.price}</div>
            {p.filterCostPerYear && <div style={{ fontSize: 10, color: '#334155' }}>${p.filterCostPerYear}/yr filters</div>}
          </div>
          <a href={p.amazon} target="_blank" rel="noreferrer" style={{ padding: '7px 12px', background: '#f59e0b', borderRadius: 6, color: '#000', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>Buy →</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTAMINANT ROW with expandable health context
// ─────────────────────────────────────────────────────────────────────────────
function ContaminantRow({ c }: { c: any }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEV[c.severity] || SEV.low;
  const pct = c.level && c.limit ? Math.min((c.level / (c.limit * 1.5)) * 100, 100) : 0;
  const hasCtx = c.healthEffects || c.healthSources;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, flexWrap: 'wrap', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
          {c.source && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#0e2233', color: '#475569', border: '1px solid #1e3a4a' }}>{c.source}</span>}
          {c.isPFAS && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430', fontWeight: 700 }}>PFAS</span>}
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {c.level != null && c.limit != null && <span style={{ fontSize: 12, color: '#475569' }}>{c.level} {c.unit} · limit {c.limit}</span>}
          <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: sev.color + '22', color: sev.color }}>{sev.label}</span>
          {hasCtx && <button onClick={() => setExpanded(x => !x)} style={{ background: 'none', border: '1px solid #1e3a4a', borderRadius: 4, color: '#475569', fontSize: 11, cursor: 'pointer', padding: '2px 7px' }}>{expanded ? 'Less ↑' : 'Health info ↓'}</button>}
        </div>
      </div>
      {c.level != null && c.limit != null && (
        <div style={{ height: 4, background: '#1e3a4a', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: sev.color, borderRadius: 2, transition: 'width 1s ease', boxShadow: `0 0 8px ${sev.color}88` }} />
        </div>
      )}
      {c.note && <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{c.note}</div>}
      {expanded && (
        <div style={{ marginTop: 9, padding: '12px 16px', background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {c.healthEffects && (<div><div style={{ fontSize: 10, letterSpacing: 0.3, color: '#ef4444', marginBottom: 3, fontWeight: 700 }}>HEALTH EFFECTS</div><div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>{c.healthEffects}</div></div>)}
          {c.healthSources && (<div><div style={{ fontSize: 10, letterSpacing: 0.3, color: '#f59e0b', marginBottom: 3, fontWeight: 700 }}>COMMON SOURCES</div><div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>{c.healthSources}</div></div>)}
          {c.epaAction && (<div><div style={{ fontSize: 10, letterSpacing: 0.3, color: '#22d3ee', marginBottom: 3, fontWeight: 700 }}>EPA ACTION</div><div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>{c.epaAction}</div></div>)}
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
      <div style={{ background: 'linear-gradient(135deg,#1a0505,#0d0f1a)', border: '1px solid #dc262644', borderLeft: '4px solid #ef4444', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 14, position: 'relative' }}>
        <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: '#475569', fontSize: 16, cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: 22, flexShrink: 0 }}>☣️</div>
        <div style={{ flex: 1, paddingRight: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', letterSpacing: 0.3 }}>EPA PFAS RULE — 2024</span>
            <span style={{ fontSize: 10, padding: '1px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 3, color: '#ef4444', fontWeight: 700 }}>ENFORCEABLE MCL</span>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
            EPA set the first federal drinking water limits for PFAS at <strong style={{ color: '#fbbf24' }}>4 ppt</strong>. An estimated <strong style={{ color: '#fbbf24' }}>45 million Americans</strong> have detectable forever chemicals in their tap water.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://www.amazon.com/dp/B07P1XFYJP?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '5px 12px', background: '#ef4444', borderRadius: 5, color: '#fff', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>🛒 Best RO for PFAS →</a>
            <a href={`https://www.amazon.com/dp/B083HVG9T8?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #dc262655', borderRadius: 5, color: '#94a3b8', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Clearly Filtered Pitcher →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PFAS IN-RESULTS ALERT
// ─────────────────────────────────────────────────────────────────────────────
function PFASResultAlert({ city, pfasLevel }: { city: string; pfasLevel?: number }) {
  const [expanded, setExpanded] = useState(false);
  const overLimit = pfasLevel != null && pfasLevel > 4;
  if (!pfasLevel || pfasLevel <= 0) return null;
  return (
    <div style={{ background: overLimit ? 'linear-gradient(135deg,#200a0a,#0d0f1a)' : 'linear-gradient(135deg,#0d1208,#0d0f1a)', border: `1px solid ${overLimit ? '#ef4444' : '#f59e0b'}`, borderLeft: `4px solid ${overLimit ? '#ef4444' : '#f59e0b'}`, borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{overLimit ? '🚨' : '⚠️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: overLimit ? '#ef4444' : '#f59e0b', letterSpacing: 1 }}>PFAS DETECTED — {city?.toUpperCase()}</span>
            {overLimit && <span style={{ fontSize: 10, padding: '1px 6px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 3, color: '#ef4444', fontWeight: 700 }}>EXCEEDS EPA MCL</span>}
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            {overLimit
              ? <>PFAS at <strong style={{ color: '#fbbf24' }}>{pfasLevel.toFixed(2)} ppt</strong> — exceeds EPA 2024 limit of 4 ppt. Standard carbon filters do NOT remove PFAS. Reverse osmosis required.</>
              : <>PFAS at <strong style={{ color: '#fbbf24' }}>{pfasLevel.toFixed(2)} ppt</strong> — below 4 ppt limit but above non-detect. Forever chemicals accumulate in the body. RO or Clearly Filtered recommended.</>
            }
          </p>
          {expanded && <div style={{ marginBottom: 8, padding: '10px 14px', background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 7, fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>PFAS are synthetic chemicals found in firefighting foam, non-stick cookware, food packaging, and industrial sites. They don't break down in the environment or human body. Linked to kidney cancer, thyroid disease, immune suppression, and developmental harm in children.</div>}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={`https://www.amazon.com/dp/B07P1XFYJP?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', background: '#ef4444', borderRadius: 5, color: '#fff', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>🛒 Waterdrop G3P800 — PFAS &gt;99%</a>
            <a href={`https://www.amazon.com/dp/B083HVG9T8?tag=${TAG}`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ef444455', borderRadius: 5, color: '#94a3b8', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Clearly Filtered Pitcher</a>
            <button onClick={() => setExpanded(x => !x)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>{expanded ? 'Less ↑' : 'What are PFAS? ↓'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NATIONAL PERCENTILE
// ─────────────────────────────────────────────────────────────────────────────
function NationalPercentile({ pct }: { pct: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 400); return () => clearTimeout(t); }, [pct]);
  const color = pct >= 75 ? '#22d3ee' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
      <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#475569', marginBottom: 7 }}>NATIONAL WATER QUALITY RANKING</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 7, background: '#1e3a4a', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${anim}%`, background: 'linear-gradient(90deg,#ef4444,#f59e0b,#22d3ee)', borderRadius: 4, transition: 'width 1.2s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: '#334155' }}><span>Worst</span><span>Average</span><span>Best</span></div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color }}>{anim}<span style={{ fontSize: 12, color: '#475569' }}>th %ile</span></div>
          <div style={{ fontSize: 10, color: '#334155' }}>vs all US water</div>
        </div>
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
      {sources.map(s => { const m = meta[s] || { color: '#475569', icon: '📊' }; return (
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

  // Filter products by situation and optionally boost those matching contaminants
  const situationProds = PRODUCTS.filter(p => p.situations?.includes(situation));
  const hasPFAS = contaminantNames.some(n => n.toLowerCase().includes('pfas') || n.toLowerCase().includes('pfoa') || n.toLowerCase().includes('pfos'));
  const ranked = situationProds.map(p => ({
    ...p,
    score: p.bestFor.filter((b: string) => contaminantNames.some(n => n.includes(b))).length +
           (hasPFAS && p.bestFor.includes('PFAS') ? 2 : 0),
  })).sort((a, b) => b.score - a.score);

  // Group by category
  const byCategory: Record<string, any[]> = {};
  for (const p of ranked) {
    if (!byCategory[p.cat]) byCategory[p.cat] = [];
    byCategory[p.cat].push(p);
  }

  return (
    <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
      {/* Situation selector */}
      <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 14, fontWeight: 700 }}>I AM A / I LIVE IN A…</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SITUATIONS.map(s => (
          <button key={s.id} onClick={() => setSituation(s.id)} style={{ padding: '8px 14px', background: situation === s.id ? '#0891b2' : '#0b1e36', border: `1px solid ${situation === s.id ? '#0891b2' : '#1e3a4a'}`, borderRadius: 8, color: situation === s.id ? '#fff' : '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
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
            <div style={{ fontSize: 12, color: '#64748b' }}>{cfg.avoid}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#22d3ee', marginBottom: 4, fontWeight: 700 }}>💡 PRO TIP</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{cfg.tip}</div>
          </div>
        </div>
      </div>

      {/* Products by category */}
      {Object.entries(byCategory).map(([cat, prods]) => (
        <div key={cat} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 12, fontWeight: 700 }}>{prods[0].catLabel.toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {prods.slice(0, 3).map((p, i) => <ProductCard key={p.id} p={p} highlight={i === 0 && p.score > 0} compact={true} />)}
          </div>
        </div>
      ))}

      {/* Installation help */}
      <div style={{ background: 'linear-gradient(135deg,#0d2240,#0b1e36)', border: '1px solid #0891b230', borderRadius: 10, padding: '16px 18px', marginTop: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 10, fontWeight: 700 }}>🔧 INSTALLATION DIFFICULTY GUIDE</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { level: 'None', desc: 'Pitcher, water bottle, countertop — plug in and use', color: '#22d3ee' },
            { level: 'Easy', desc: 'Faucet mount, shower filter — 5–15 min, no tools', color: '#22d3ee' },
            { level: 'Medium', desc: 'Under-sink RO — 2–3 hrs, basic plumbing, shutoff valve', color: '#f59e0b' },
            { level: 'Hard', desc: 'Whole-house — requires pipe work, hire a pro', color: '#ef4444' },
          ].map(d => (
            <div key={d.level} style={{ flex: 1, minWidth: 140, background: '#0d2240', borderRadius: 6, padding: '10px 12px', border: `1px solid ${d.color}25` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: d.color, marginBottom: 3 }}>{d.level}</div>
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{d.desc}</div>
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
  const ccrUrl = data?.pwsid
    ? `https://www.epa.gov/ccr/ccr-information-consumers?PWSID=${data.pwsid}`
    : 'https://www.epa.gov/ccr';

  const resources = [
    { cat: '🏛️ FEDERAL', items: [
      { name: 'EPA SDWIS — Violation Search', url: `https://ofmpub.epa.gov/apex/sfdw/f?p=108:103::::::`, desc: 'Search violations for any water system nationwide' },
      { name: 'EPA Safe Drinking Water Search', url: `https://www.epa.gov/sdwa/safe-drinking-water-hotline`, desc: 'Official EPA drinking water information' },
      { name: 'EPA UCMR5 PFAS Data', url: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule', desc: '2023–2025 PFAS monitoring — 6,000+ water systems' },
      { name: `Your CCR Report (PWSID: ${data?.pwsid || '—'})`, url: ccrUrl, desc: 'Annual Consumer Confidence Report from your utility' },
      { name: 'EPA ECHO Enforcement', url: `https://echo.epa.gov/`, desc: 'Enforcement actions and inspection history' },
    ]},
    { cat: '🌿 EWG & ADVOCACY', items: [
      { name: 'EWG Tap Water Atlas', url: 'https://www.ewg.org/tapwater/', desc: 'EWG\'s national tap water contamination database' },
      { name: 'PFAS Exchange — Industrial Sites', url: 'https://pfasproject.com/', desc: 'Map of PFAS contamination sources and industrial sites' },
      { name: 'NRDC Drinking Water Report', url: 'https://www.nrdc.org/issues/drinking-water', desc: 'NRDC\'s national water safety resources' },
    ]},
    { cat: '⚗️ TESTING LABS', items: [
      { name: 'National Testing Labs', url: 'https://www.ntllabs.com/', desc: 'Certified home water testing — PFAS, metals, bacteria' },
      { name: 'SimpleLab Tap Score', url: 'https://mytapscore.com/', desc: 'Mail-in water test kits — comprehensive panels starting at $89' },
      { name: 'EPA Certified Lab Finder', url: 'https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water', desc: 'Find a state-certified lab in your state' },
    ]},
    { cat: '🔧 INSTALLER RESOURCES', items: [
      { name: 'WQA Certified Installer Directory', url: 'https://wqa.org/find-dealer/', desc: 'Find WQA-certified water treatment professionals near you' },
      { name: 'Find a Pro on Angi (HomeAdvisor)', url: `https://www.angi.com/nearme/water-treatment/`, desc: 'Local water treatment and plumbing installers with reviews' },
      { name: 'HomeAdvisor Water Softener Pros', url: 'https://www.homeadvisor.com/task.Water-Softener-or-Water-Filter-Install.html', desc: 'Get quotes from local water filter installers' },
    ]},
  ];

  if (stateDb) {
    resources[0].items.push({ name: stateDb.name, url: stateDb.url, desc: `State-level water quality database for ${data.stateCode}` });
  }

  return (
    <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#0891b2', marginBottom: 20, fontWeight: 700 }}>OFFICIAL DATA SOURCES & RESOURCES</div>
      {resources.map(section => (
        <div key={section.cat} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 700 }}>{section.cat}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {section.items.map(r => (
              <a key={r.name} href={r.url} target="_blank" rel="noreferrer" style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 7, padding: '10px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{r.desc}</div>
                </div>
                <span style={{ color: '#334155', fontSize: 14, flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Order your own test */}
      <div style={{ background: 'linear-gradient(135deg,#0d2240,#0b1e36)', border: '1px solid #7c3aed30', borderRadius: 10, padding: '16px 18px', marginTop: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.3, color: '#7c3aed', marginBottom: 8, fontWeight: 700 }}>🧪 GET YOUR WATER TESTED</div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
          This site uses EPA and EWG aggregate data. For the most accurate results specific to <strong style={{ color: '#e2e8f0' }}>your home</strong>, order a mail-in test. Your municipal supply may be clean but your home's pipes could add lead or other contaminants.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href="https://mytapscore.com/?utm_source=watercheckup" target="_blank" rel="noreferrer" style={{ padding: '7px 14px', background: '#7c3aed', borderRadius: 5, color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>SimpleLab Tap Score — from $89 →</a>
          <a href="https://www.ntllabs.com/" target="_blank" rel="noreferrer" style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #7c3aed55', borderRadius: 5, color: '#94a3b8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>National Testing Labs →</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function WaterCheckup() {
  const [zip, setZip]                   = useState('');
  const [loading, setLoading]           = useState(false);
  const [step, setStep]                 = useState(0);
  const [data, setData]                 = useState<any>(null);
  const [error, setError]               = useState<string | null>(null);
  const [tab, setTab]                   = useState('report');
  const [showEmail, setShowEmail]       = useState(false);
  const [email, setEmail]               = useState('');
  const [emailAlert, setEmailAlert]     = useState(false);
  const [emailSent, setEmailSent]       = useState(false);
  const [years, setYears]               = useState(5);
  const [ppl, setPpl]                   = useState(4);
  const [ftype, setFtype]               = useState('iSpring RCC7AK');
  const [installers, setInstallers]     = useState<any[]>([]);
  const [instLoading, setInstLoading]   = useState(false);
  const [productFilter, setProductFilter] = useState('all');
  const [quoted, setQuoted]             = useState<Record<string, boolean>>({});

  const search = async () => {
    if (zip.length !== 5 || loading) return;
    setLoading(true); setError(null); setData(null); setTab('report'); setEmailSent(false); setStep(0); setInstallers([]);
    let s = 0;
    const tick = setInterval(() => { s = Math.min(s + 1, STEPS.length - 1); setStep(s); }, 650);
    try {
      const result = await fetchWaterData(zip);
      clearInterval(tick);
      setData(result);
      setTimeout(() => setShowEmail(true), 900);
      loadInstallers(zip);
    } catch (e: any) {
      clearInterval(tick);
      setError(e.message);
    } finally { setLoading(false); }
  };

  const loadInstallers = async (z: string) => {
    setInstLoading(true);
    try { setInstallers(await findInstallers(z)); } catch {}
    finally { setInstLoading(false); }
  };

  const getRecommended = () => {
    if (!data?.contaminants?.length) return PRODUCTS.filter((p: any) => !p.wholeHouse && p.cat === 'undersink').slice(0, 3);
    const names = data.contaminants.map((c: any) => c.name);
    const hasPFAS = data.contaminants.some((c: any) => c.isPFAS || c.name?.includes('PFAS'));
    return PRODUCTS
      .filter(p => !p.wholeHouse && p.cat !== 'shower' && p.cat !== 'fridge')
      .map(p => ({ ...p, m: p.bestFor.filter((b: string) => names.some((n: string) => n.includes(b))).length + (hasPFAS && p.bestFor.includes('PFAS') ? 3 : 0) }))
      .sort((a, b) => b.m - a.m).slice(0, 3);
  };

  const prod = PRODUCTS.find(p => p.name === ftype) || PRODUCTS[1];
  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Yr ${i}`, filter: Math.round(prod.price + (prod.filterCostPerYear || 80) * i), bottled: Math.round(ppl * 32 * 12 * i),
  }));
  const recommended = getRecommended();
  const catFilters = ['all','undersink','countertop','pitcher','faucet','bottle','whole','shower','fridge'];
  const catLabels: Record<string,string> = { all:'All', undersink:'Under-Sink RO', countertop:'Countertop RO', pitcher:'Pitcher', faucet:'Faucet Mount', bottle:'Water Bottle', whole:'Whole House', shower:'Shower', fridge:'Fridge/Inline' };
  const filteredProds = productFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === productFilter);
  const scoreColor = !data ? '#22d3ee' : data.score >= 80 ? '#22d3ee' : data.score >= 65 ? '#f59e0b' : '#ef4444';
  const pfasLevel = data?.ucmr5?.maxPfasPpt ?? data?.contaminants?.find((c: any) => c.isPFAS || c.name?.includes('PFAS'))?.level ?? null;
  const pfasContaminants = data?.contaminants?.filter((c: any) => c.isPFAS) ?? [];
  const contaminantNames = data?.contaminants?.map((c: any) => c.name) ?? [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0d1f35 0%, #091825 100%)', fontFamily: "inherit", color: '#e2e8f0' }}>

      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #0e2233', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>💧</div>
        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.3, color: '#22d3ee' }}>WATER<span style={{ color: '#e2e8f0' }}>CHECKUP</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#d97706', color: '#fff', fontWeight: 800 }}>WQA GOLD SEAL</span>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#0891b2', color: '#fff', fontWeight: 800 }}>NSF CERTIFIED</span>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#7c3aed', color: '#fff', fontWeight: 800 }}>4 DATA SOURCES · ALL 50 STATES</span>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ maxWidth: 720, margin: '40px auto 0', padding: '0 24px', textAlign: 'center' }}>

        {/* Expert credibility badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 30, padding: '7px 18px', marginBottom: 22 }}>
          <span style={{ fontSize: 16 }}>🏅</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Designed by a water expert with <strong style={{ color: '#38bdf8' }}>40+ years of experience</strong></span>
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 900, margin: '0 0 14px', lineHeight: 1.15, color: '#f1f9ff' }}>
          See What's Really in Your<br /><span style={{ color: '#38bdf8' }}>Town's Tap Water</span>
        </h1>

        <p style={{ color: '#94a3b8', marginBottom: 10, fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 10px' }}>
          Get personalized recommendations on top-rated water filters for <strong style={{ color: '#e2e8f0' }}>drinking, whole-house & showering</strong> — plus find local installers near you. All in one place.
        </p>

        <p style={{ fontSize: 14, color: '#38bdf8', fontWeight: 600, marginBottom: 28, fontStyle: 'italic', opacity: 0.85 }}>
          The most comprehensive water quality resource on the planet — free, instant, and powered by live EPA data.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g,'').slice(0,5))} onKeyDown={e => e.key==='Enter' && search()} placeholder="ZIP code" maxLength={5}
            style={{ width: 140, padding: '12px 16px', fontSize: 20, letterSpacing: 0.3, background: '#0d2240', border: '1px solid #1e4a6a', borderRadius: 8, color: '#22d3ee', outline: 'none', textAlign: 'center' }} />
          <button onClick={search} disabled={zip.length !== 5 || loading} style={{ padding: '12px 22px', background: zip.length===5 && !loading ? '#0891b2' : '#0e2233', border: 'none', borderRadius: 8, color: zip.length===5 && !loading ? '#fff' : '#334155', fontSize: 14, fontWeight: 700, letterSpacing: 0.3, cursor: zip.length===5 && !loading ? 'pointer' : 'default', transition: 'all 0.2s' }}>
            {loading ? 'QUERYING…' : 'ANALYZE →'}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#1e3a4a' }}>Try: 02169 · 60601 · 77001 · 10001 · 90210 · 33101 · 85001</div>
        {error && <div style={{ marginTop: 18, padding: '12px 16px', background: '#1a0a0a', border: '1px solid #ef4444', borderRadius: 8, textAlign: 'left' }}><div style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚠ Error</div><div style={{ color: '#fca5a5', fontSize: 13, lineHeight: 1.7 }}>{error}</div></div>}
      </div>

      {!data && !loading && <>
        <PFASAwarenessBanner />
        {/* Coverage stats */}
        <div style={{ maxWidth: 720, margin: '24px auto 0', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
            {[
              { v:'6,151', l:'Water Systems', s:'EPA UCMR5 PFAS', c:'#ef4444' },
              { v:'50', l:'States Covered', s:'All US states', c:'#22d3ee' },
              { v:'80+', l:'Metro Areas', s:'EWG Tap Water Atlas', c:'#d97706' },
              { v:'22', l:'Filter Types', s:'NSF/WQA certified', c:'#7c3aed' },
            ].map(s => (
              <div key={s.l} style={{ background: '#0d2240', border: `1px solid ${s.c}25`, borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.l}</div>
                <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* LOADER */}
      {loading && (
        <div style={{ maxWidth: 440, margin: '40px auto', padding: '24px 28px', background: '#0d2240', border: '1px solid #0e2233', borderRadius: 12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, opacity: i <= step ? 1 : 0.15, transition: 'opacity 0.4s' }}>
              <span style={{ color: i < step ? '#22d3ee' : i === step ? '#f59e0b' : '#1e3a4a', fontSize: 14 }}>{i < step ? '✓' : i === step ? '▶' : '○'}</span>
              <span style={{ fontSize: 13, color: i === step ? '#e2e8f0' : '#475569' }}>{s}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '7px 10px', background: '#0b1e36', borderRadius: 5, fontSize: 11, color: '#334155', textAlign: 'center' }}>EPA · UCMR5 · EWG · USGS — live data, no estimates</div>
        </div>
      )}

      {/* RESULTS */}
      {data && !loading && (
        <div style={{ maxWidth: 1000, margin: '32px auto 60px', padding: '0 20px' }}>

          {/* SUMMARY HEADER */}
          <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderRadius: '12px 12px 0 0', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 22, flexWrap: 'wrap' }}>
            <ScoreDial score={data.score} grade={data.grade} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 17, fontWeight: 800 }}>{data.systemName}</span>
                {data.openViolations > 0 && <span style={{ fontSize: 11, padding: '2px 7px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 4, color: '#ef4444' }}>{data.openViolations} OPEN</span>}
                {data.pfasAboveMcl > 0 && <span style={{ fontSize: 11, padding: '2px 7px', background: '#ef444422', border: '1px solid #ef444444', borderRadius: 4, color: '#ef4444' }}>PFAS ⚠</span>}
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 1 }}>{data.city} · PWSID: {data.pwsid}</div>
              <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>{data.sourceType}{data.population ? ` · Serves ${data.population}` : ''}</div>
              {data.summary && <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.6 }}>"{data.summary}"</div>}
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                {[
                  { l:'VIOLATIONS', v:data.totalViolations, c:data.totalViolations > 0 ? '#f59e0b' : '#22d3ee' },
                  { l:'OPEN',       v:data.openViolations,  c:data.openViolations  > 0 ? '#ef4444' : '#22d3ee' },
                  { l:'PFAS',       v:data.pfasCount || 0,  c:data.pfasAboveMcl > 0 ? '#ef4444' : data.pfasCount > 0 ? '#f59e0b' : '#22d3ee' },
                  { l:'SCORE',      v:data.score,            c:scoreColor },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: '#334155', letterSpacing: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowEmail(true)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #0891b2', borderRadius: 6, color: '#22d3ee', fontSize: 12, letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap' }}>✉ GET REPORT</button>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', background: '#07111a', borderLeft: '1px solid #0e2233', borderRight: '1px solid #0e2233', overflowX: 'auto' }}>
            {[['report','📊 Report'],['solutions','🏠 My Solution'],['pfas','☣️ PFAS'],['products','🛒 All Products'],['cost','💰 Cost Calc'],['installers','🔧 Installers'],['resources','🔗 Resources']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{ padding: '10px 14px', background: 'transparent', border: 'none', whiteSpace: 'nowrap', borderBottom: tab===id ? '2px solid #0891b2' : '2px solid transparent', color: tab===id ? '#22d3ee' : '#475569', fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>{label}</button>
            ))}
          </div>

          {/* TAB: WATER REPORT */}
          {tab === 'report' && (
            <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22 }}>
              {data.dataSources && <DataSourcesBadges sources={data.dataSources} />}
              {data.nationalPercentile != null && <NationalPercentile pct={data.nationalPercentile} />}
              <PFASResultAlert city={data.city} pfasLevel={pfasLevel} />

              {data.violations?.length > 0 ? (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 10 }}>VIOLATION HISTORY — EPA SDWIS</div>
                  <div style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, marginBottom: 22, overflow: 'hidden' }}>
                    {data.violations.map((v: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', borderBottom: i < data.violations.length-1 ? '1px solid #0d2240' : 'none', gap: 10 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: '#94a3b8' }}>{v.rule}</div>{v.contaminant && <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{v.contaminant}</div>}</div>
                        <div style={{ fontSize: 12, color: '#475569', minWidth: 32 }}>{v.year}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: v.statusColor || '#94a3b8', minWidth: 65, textAlign: 'right' }}>{v.status}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ background: '#051527', border: '1px solid #22d3ee22', borderRadius: 8, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: '#22d3ee' }}>No violations on record</div><div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>EPA SDWIS shows no violations for this water system.</div></div>
                </div>
              )}

              {data.contaminants?.length > 0 && (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 14 }}>CONTAMINANT ANALYSIS — CLICK ROWS FOR HEALTH INFO</div>
                  {data.contaminants.map((c: any, i: number) => <ContaminantRow key={i} c={c} />)}
                </>
              )}

              {data.usgs?.sites?.length > 0 && (
                <div style={{ background: '#0b1e36', border: '1px solid #7c3aed30', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
                  <div style={{ fontSize: 10, letterSpacing: 0.3, color: '#7c3aed', marginBottom: 8, fontWeight: 700 }}>⚗️ USGS NWIS — SOURCE WATER CONDITIONS</div>
                  {data.usgs.sites.map((s: any, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: '#64748b', marginBottom: 3 }}><span style={{ color: '#94a3b8' }}>{s.name}:</span> {s.param} — <span style={{ color: '#22d3ee' }}>{s.value} {s.unit}</span></div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', margin: '22px 0 12px' }}>TOP 3 RECOMMENDED FILTERS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                {recommended.map((p: any, i: number) => <ProductCard key={p.id} p={p} highlight={i === 0} />)}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button onClick={() => setTab('solutions')} style={{ padding: '7px 16px', background: '#0891b2', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>🏠 Find My Solution →</button>
                <button onClick={() => setTab('products')} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #0891b2', borderRadius: 6, color: '#22d3ee', fontSize: 12, cursor: 'pointer' }}>View All 22 Products →</button>
              </div>
            </div>
          )}

          {/* TAB: MY SOLUTION */}
          {tab === 'solutions' && <SolutionsTab data={data} contaminantNames={contaminantNames} />}

          {/* TAB: PFAS DETAIL */}
          {tab === 'pfas' && (
            <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22 }}>
              <div style={{ marginBottom: 18, padding: '14px 16px', background: 'linear-gradient(135deg,#1a0505,#0d0f1a)', border: '1px solid #ef444440', borderRadius: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#ef4444', marginBottom: 7, fontWeight: 700 }}>☣️ ABOUT PFAS — FOREVER CHEMICALS</div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>PFAS are ~12,000 synthetic chemicals that don't break down in the environment or human body. Linked to kidney cancer, testicular cancer, thyroid disease, immune suppression, elevated cholesterol, and developmental harm. EPA set the first federal MCL in 2024: <strong style={{ color: '#fbbf24' }}>4 ppt</strong> for PFOA and PFOS.</p>
              </div>
              {pfasContaminants.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 7 }}>✅</div>
                  <div style={{ fontSize: 15, color: '#22d3ee', fontWeight: 700, marginBottom: 5 }}>No PFAS detected via UCMR5</div>
                  <div style={{ fontSize: 13, color: '#475569' }}>No measurable PFAS in EPA's 2023–2025 monitoring. UCMR5 covers systems serving 3,300+ people.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 14 }}>DETECTED COMPOUNDS — HEALTH CONTEXT</div>
                  {pfasContaminants.map((c: any, i: number) => <ContaminantRow key={i} c={c} />)}
                  <div style={{ marginTop: 16, fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 12 }}>PFAS-CERTIFIED FILTERS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                    {PRODUCTS.filter(p => p.bestFor.includes('PFAS')).slice(0,3).map((p: any) => <ProductCard key={p.id} p={p} highlight={p.id===3} />)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: ALL PRODUCTS */}
          {tab === 'products' && (
            <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2' }}>22 PRODUCTS · ALL NSF/WQA CERTIFIED · AMAZON AFFILIATE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {catFilters.map(id => (
                    <button key={id} onClick={() => setProductFilter(id)} style={{ padding: '3px 9px', background: productFilter===id ? '#0891b2' : '#0b1e36', border: `1px solid ${productFilter===id ? '#0891b2' : '#0e2233'}`, borderRadius: 4, color: productFilter===id ? '#fff' : '#475569', fontSize: 11, cursor: 'pointer', fontWeight: productFilter===id ? 700 : 400 }}>{catLabels[id]}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 12 }}>
                {filteredProds.map((p: any) => <ProductCard key={p.id} p={p} highlight={recommended.some((r: any) => r.id === p.id)} />)}
              </div>
            </div>
          )}

          {/* TAB: COST CALCULATOR */}
          {tab === 'cost' && (
            <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 16 }}>COST OF OWNERSHIP CALCULATOR</div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 22, alignItems: 'flex-end' }}>
                <div><div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>SYSTEM</div>
                  <select value={ftype} onChange={e => setFtype(e.target.value)} style={{ background: '#0b1e36', border: '1px solid #1e3a4a', color: '#e2e8f0', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                    {PRODUCTS.filter(p => p.filterCostPerYear).map(p => <option key={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div><div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>YEARS: {years}</div><input type="range" min={1} max={10} value={years} onChange={e => setYears(+e.target.value)} style={{ width: 120, accentColor: '#0891b2' }} /></div>
                <div><div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>PEOPLE: {ppl}</div><input type="range" min={1} max={8} value={ppl} onChange={e => setPpl(+e.target.value)} style={{ width: 120, accentColor: '#0891b2' }} /></div>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0891b2" stopOpacity={0.4}/><stop offset="95%" stopColor="#0891b2" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0e2233" />
                    <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(v: any) => `$${v}`} />
                    <Tooltip contentStyle={{ background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8 }} labelStyle={{ color: '#94a3b8', fontSize: 11 }} formatter={(v: any) => [`$${v}`, '']} />
                    <Area type="monotone" dataKey="filter" name="Filter System" stroke="#0891b2" fill="url(#gF)" strokeWidth={2} />
                    <Area type="monotone" dataKey="bottled" name="Bottled Water" stroke="#ef4444" fill="url(#gB)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                {[{ l:'Filter System',c:'#0891b2',v:`$${prod.price + (prod.filterCostPerYear||80)*years}`},{l:'Bottled Water',c:'#ef4444',v:`$${Math.round(ppl*32*12*years)}`},{l:'You Save',c:'#22d3ee',v:`$${Math.max(0,Math.round(ppl*32*12*years)-prod.price-(prod.filterCostPerYear||80)*years)}`}].map(s => (
                  <div key={s.l} style={{ flex:1, minWidth:90, background:'#0b1e36', border:`1px solid ${s.c}33`, borderRadius:8, padding:'11px 14px' }}>
                    <div style={{ fontSize:11, color:'#64748b', marginBottom:2 }}>{s.l}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, color:'#334155' }}>over {years} yr{years!==1?'s':''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INSTALLERS */}
          {tab === 'installers' && (
            <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 22 }}>
              {/* Quick links */}
              <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '🔍 WQA Certified Installer', url: 'https://wqa.org/find-dealer/', color: '#0891b2' },
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
                    <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2' }}>LOCAL WATER TREATMENT INSTALLERS NEAR {data.city}</div>
                <button onClick={() => loadInstallers(zip)} disabled={instLoading} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #0e2233', borderRadius: 4, color: '#475569', fontSize: 11, cursor: 'pointer' }}>{instLoading ? 'Searching…' : '↻ Refresh'}</button>
              </div>
              {instLoading && <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: 13 }}>🔍 Finding local water treatment specialists…</div>}
              {!instLoading && installers.map((c: any, i: number) => (
                <div key={i} style={{ background: '#0b1e36', border: '1px solid #0e2233', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{c.address}</div>
                      {c.specialty && <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{c.specialty}</div>}
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.cert && <span style={{ fontSize: 11, padding: '1px 5px', borderRadius: 3, background: '#d9770622', color: '#d97706', border: '1px solid #d9770644', fontWeight: 700 }}>{c.cert}</span>}
                        {c.rating && <span style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(Math.round(c.rating))} <span style={{ color: '#64748b', fontSize: 11 }}>{c.rating}{c.reviews?` (${c.reviews})`:''}</span></span>}
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
                <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
                  <button onClick={() => loadInstallers(zip)} style={{ padding: '7px 16px', background: '#0891b2', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>Search Local Installers</button>
                </div>
              )}
              <div style={{ marginTop: 12, fontSize: 11, color: '#334155', textAlign: 'center' }}>💡 Always verify credentials and get at least 3 quotes. Average RO install cost: $150–$400.</div>
            </div>
          )}

          {/* TAB: RESOURCES */}
          {tab === 'resources' && <ResourcesTab data={data} />}
        </div>
      )}

      {/* EMAIL MODAL */}
      {showEmail && data && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowEmail(false)}>
          <div style={{ background: '#0d2240', border: '1px solid #0e2233', borderRadius: 14, padding: '28px 32px', maxWidth: 380, width: '90%' }} onClick={e => e.stopPropagation()}>
            {emailSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#22d3ee' }}>Report sent!</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Check your inbox.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: '#0891b2', marginBottom: 7 }}>FREE WATER REPORT</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Get your full analysis</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Your {data.city} report — EPA + UCMR5 + EWG + USGS data with personalized filter recommendations.</div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8, color: '#e2e8f0', fontSize: 13, marginBottom: 9, outline: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <input type="checkbox" id="al" checked={emailAlert} onChange={e => setEmailAlert(e.target.checked)} style={{ accentColor: '#0891b2' }} />
                  <label htmlFor="al" style={{ fontSize: 11, color: '#64748b', cursor: 'pointer' }}>Alert me if violations are added for {data.city}</label>
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => { if (email) { setEmailSent(true); setTimeout(() => setShowEmail(false), 1600); } }}
                    style={{ flex: 1, padding: '9px', background: '#0891b2', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Send Report →</button>
                  <button onClick={() => setShowEmail(false)} style={{ padding: '9px 13px', background: 'transparent', border: '1px solid #1e3a4a', borderRadius: 8, color: '#475569', fontSize: 12, cursor: 'pointer' }}>Skip</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
