import { NextRequest, NextResponse } from 'next/server';

const H = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

// ─── Well water contaminants by category ─────────────────────────────────────
const WELL_CONTAMINANTS: Record<string, {
  name: string; risk: 'high'|'moderate'|'low';
  why: string; healthEffects: string; testFor: string; mcl?: string;
  ewgGuideline?: string;
}> = {
  bacteria: {
    name: 'Coliform Bacteria & E. coli',
    risk: 'high',
    why: 'Private wells are unregulated and can be contaminated by surface runoff, septic systems, or animal waste. Testing is the only way to know.',
    healthEffects: 'Gastrointestinal illness, vomiting, diarrhea. E. coli can cause severe illness or death in vulnerable populations.',
    testFor: 'Total coliform, E. coli',
    mcl: 'Zero tolerance (EPA MCL: 0 CFU/100mL)',
  },
  nitrates: {
    name: 'Nitrates & Nitrites',
    risk: 'high',
    why: 'Agricultural fertilizer and septic leachate are the primary sources. Shallow wells in farming areas are especially at risk.',
    healthEffects: '"Blue baby syndrome" (methemoglobinemia) in infants. Emerging links to colorectal cancer and thyroid disruption in adults.',
    testFor: 'Nitrate-N, Nitrite-N',
    mcl: 'EPA MCL: 10 mg/L (nitrate), 1 mg/L (nitrite)',
    ewgGuideline: 'EWG health goal: 5 mg/L',
  },
  lead: {
    name: 'Lead',
    risk: 'high',
    why: 'Old well casings, pumps, and household plumbing can leach lead. Homes built before 1986 are at higher risk.',
    healthEffects: 'No safe level. Irreversible brain damage in children. Kidney and cardiovascular damage in adults.',
    testFor: 'Lead (dissolved)',
    mcl: 'EPA Action Level: 15 ppb. EWG: No safe level.',
    ewgGuideline: 'EWG: No safe level — zero is the only health goal',
  },
  arsenic: {
    name: 'Arsenic',
    risk: 'high',
    why: 'Naturally occurring in rock and soil in many regions (New England, Southwest, Upper Midwest). Dissolves into groundwater over time.',
    healthEffects: 'Long-term exposure linked to bladder, lung, and skin cancer. Affects heart and nervous system.',
    testFor: 'Total arsenic',
    mcl: 'EPA MCL: 10 ppb',
    ewgGuideline: 'EWG health goal: 0.004 ppb',
  },
  pfas: {
    name: 'PFAS "Forever Chemicals"',
    risk: 'high',
    why: 'PFAS from military bases, manufacturing plants, airports, and firefighting training sites contaminate groundwater for miles. Private wells near these sites are unmonitored.',
    healthEffects: 'Cancer, thyroid disease, immune suppression, reproductive harm, elevated cholesterol. Does not break down in the body or environment.',
    testFor: 'PFOA, PFOS, PFAS panel (20–40 compounds)',
    mcl: 'EPA MCL: 4 ppt for PFOA/PFOS (2024)',
    ewgGuideline: 'EWG health goal: 0.001 ppt — essentially zero',
  },
  radon: {
    name: 'Radon',
    risk: 'moderate',
    why: 'Radon gas dissolves in groundwater from uranium-bearing rock. New England, Appalachia, and Rocky Mountain states are highest risk.',
    healthEffects: 'Lung cancer risk when radon outgases from tap water into indoor air. Stomach cancer risk from ingestion.',
    testFor: 'Radon in water',
    mcl: 'No federal MCL. EPA proposed: 300 pCi/L',
  },
  hardness: {
    name: 'Hardness (Calcium & Magnesium)',
    risk: 'low',
    why: 'Common in groundwater from limestone and dolomite aquifers. Not a health risk but damages appliances and pipes.',
    healthEffects: 'Scale buildup in pipes and appliances. Skin and hair dryness. No known health harm — may be mildly beneficial.',
    testFor: 'Total hardness (GPG or mg/L)',
    mcl: 'No MCL — aesthetic issue only',
  },
  iron: {
    name: 'Iron & Manganese',
    risk: 'low',
    why: 'Very common in groundwater. Stains fixtures and laundry orange/brown. High manganese may affect cognition in children.',
    healthEffects: 'Staining, metallic taste. High manganese linked to neurological effects in children.',
    testFor: 'Iron (total/dissolved), Manganese',
    mcl: 'EPA secondary standard: 0.3 mg/L iron, 0.05 mg/L manganese',
  },
  ph: {
    name: 'pH (Corrosive Water)',
    risk: 'moderate',
    why: 'Acidic water (pH < 7) corrodes pipes and plumbing, leaching copper and lead into your water. Very common in older New England homes.',
    healthEffects: 'Elevated copper and lead from corroding pipes. Blue-green staining of fixtures. Metallic taste.',
    testFor: 'pH, corrosivity (Langelier Saturation Index)',
    mcl: 'EPA secondary: 6.5–8.5',
  },
  uranium: {
    name: 'Uranium',
    risk: 'moderate',
    why: 'Naturally occurring in granite-rich areas (New England, Rocky Mountains). Private wells in these areas should always be tested.',
    healthEffects: 'Kidney toxicity. Increased cancer risk with long-term exposure.',
    testFor: 'Uranium',
    mcl: 'EPA MCL: 30 μg/L',
    ewgGuideline: 'EWG health goal: 0.43 μg/L',
  },
  vocs: {
    name: 'VOCs (Gasoline, Solvents)',
    risk: 'moderate',
    why: 'Underground storage tank leaks, gas stations, dry cleaners, and industrial sites contaminate groundwater with benzene, TCE, and other carcinogenic solvents.',
    healthEffects: 'Benzene causes leukemia. TCE and PCE linked to liver cancer, kidney cancer, and neurological damage.',
    testFor: 'VOC panel (benzene, toluene, TCE, PCE, MTBE)',
    mcl: 'Varies by compound — benzene MCL: 5 ppb',
  },
};

// ─── Risk factors by region/state ────────────────────────────────────────────
const STATE_RISK_PROFILE: Record<string, {
  elevated: string[]; notes: string; primaryConcerns: string[];
}> = {
  ME: { elevated: ['arsenic','radon','uranium','hardness'], notes: 'Maine has the highest natural arsenic in wells in the US. Granite bedrock releases arsenic and uranium. Radon is also widespread.', primaryConcerns: ['Arsenic (granite bedrock)','Radon','Uranium','Hardness'] },
  NH: { elevated: ['arsenic','radon','uranium','ph'], notes: 'New Hampshire granite bedrock: high arsenic and radon. Acidic water corrodes pipes and leaches lead.', primaryConcerns: ['Arsenic','Radon','Uranium','Corrosive pH'] },
  VT: { elevated: ['arsenic','radon','hardness'], notes: 'Vermont wells frequently show arsenic and radon from bedrock geology.', primaryConcerns: ['Arsenic','Radon','Hardness'] },
  MA: { elevated: ['arsenic','radon','pfas','ph'], notes: 'MA has significant PFAS contamination from military bases (Otis, Hanscom) and industrial sites. Arsenic common in South Shore wells.', primaryConcerns: ['PFAS (military bases)','Arsenic','Radon','Corrosive pH'] },
  CT: { elevated: ['arsenic','radon','pfas'], notes: 'Connecticut has elevated arsenic from bedrock and notable PFAS sites (Ansonia, Shelton industrial corridor).', primaryConcerns: ['Arsenic','Radon','PFAS'] },
  NJ: { elevated: ['pfas','nitrates','lead','vocs'], notes: 'NJ is one of the most industrialized states. PFAS contamination is widespread, especially near Joint Base MDL and industrial Superfund sites.', primaryConcerns: ['PFAS','Nitrates','Lead','VOCs (industrial)'] },
  PA: { elevated: ['radon','pfas','iron','vocs'], notes: 'Pennsylvania wells are affected by radon (granite/shale), PFAS from military sites, and legacy mining and industrial contamination.', primaryConcerns: ['Radon','PFAS','Iron/Manganese','VOCs'] },
  NY: { elevated: ['pfas','arsenic','radon'], notes: 'NY has significant PFAS contamination from numerous Air National Guard and Army bases. Upstate has natural arsenic and radon from bedrock.', primaryConcerns: ['PFAS','Arsenic (upstate)','Radon'] },
  OH: { elevated: ['nitrates','pfas','iron'], notes: 'Ohio is heavily agricultural — nitrates from fertilizer runoff are a major issue in rural wells. PFAS from Wright-Patterson AFB and industrial sites.', primaryConcerns: ['Nitrates','PFAS','Iron'] },
  IN: { elevated: ['nitrates','arsenic','iron'], notes: 'Indiana rural wells frequently show nitrate contamination from ag runoff. Arsenic found in some glacial aquifers.', primaryConcerns: ['Nitrates','Arsenic','Iron'] },
  IL: { elevated: ['nitrates','pfas','hardness'], notes: 'Illinois Corn Belt agriculture drives nitrate contamination. PFAS detected near Chanute AFB and industrial sites.', primaryConcerns: ['Nitrates','PFAS','Hardness'] },
  IA: { elevated: ['nitrates','pfas'], notes: 'Iowa has among the highest nitrate levels in the US from intensive row-crop agriculture.', primaryConcerns: ['Nitrates (very high)','PFAS'] },
  MN: { elevated: ['nitrates','arsenic','pfas','iron'], notes: 'Minnesota has a significant PFAS legacy from 3M manufacturing in the Twin Cities. Arsenic and iron common in glacial aquifer wells.', primaryConcerns: ['PFAS (3M legacy)','Nitrates','Arsenic','Iron'] },
  WI: { elevated: ['nitrates','pfas','iron'], notes: 'Wisconsin dairy farming creates widespread nitrate contamination in wells. PFAS detected near military and industrial sites.', primaryConcerns: ['Nitrates','PFAS','Iron/Manganese'] },
  MI: { elevated: ['pfas','lead','iron'], notes: 'Michigan has serious PFAS contamination from Wurtsmith AFB and manufacturing. Lead from aging infrastructure is a concern statewide.', primaryConcerns: ['PFAS','Lead (aging infrastructure)','Iron'] },
  TX: { elevated: ['arsenic','nitrates','radium','pfas'], notes: 'Texas groundwater varies widely. West Texas has naturally high arsenic. Radium elevated in Edwards Aquifer. PFAS near military bases.', primaryConcerns: ['Arsenic (west TX)','Radium','Nitrates','PFAS'] },
  AZ: { elevated: ['arsenic','nitrates','pfas'], notes: 'Arizona groundwater naturally contains elevated arsenic in many aquifers. PFAS from Luke and Davis-Monthan AFBs.', primaryConcerns: ['Arsenic','Nitrates','PFAS (military)'] },
  NM: { elevated: ['arsenic','nitrates','uranium'], notes: 'New Mexico has among the highest natural uranium and arsenic in groundwater. Mining legacy adds contamination.', primaryConcerns: ['Arsenic','Uranium','Nitrates'] },
  CO: { elevated: ['uranium','arsenic','radon','pfas'], notes: 'Colorado uranium mining areas have elevated uranium in wells. PFAS from Buckley SFB affects Adams County wells.', primaryConcerns: ['Uranium','Arsenic','Radon','PFAS'] },
  CA: { elevated: ['arsenic','nitrates','pfas','vocs'], notes: 'San Joaquin Valley wells have some of the highest arsenic and nitrate levels in the US. PFAS widespread near military installations.', primaryConcerns: ['Arsenic (San Joaquin)','Nitrates','PFAS','VOCs'] },
  FL: { elevated: ['nitrates','radon','pfas','hardness'], notes: 'Florida\'s karst limestone aquifer is vulnerable to nitrate from septic systems and ag. PFAS near Eglin, Patrick, and Tyndall AFBs.', primaryConcerns: ['Nitrates','Radon','PFAS (military)','Hardness'] },
  NC: { elevated: ['pfas','arsenic','iron'], notes: 'NC has major PFAS contamination from Chemours (GenX) Fayetteville Works plant, affecting wells across a wide area. Arsenic in Piedmont region.', primaryConcerns: ['PFAS/GenX (Chemours)','Arsenic','Iron'] },
  WV: { elevated: ['pfas','vocs','iron'], notes: 'West Virginia chemical industry has contaminated groundwater with PFAS and industrial solvents. Elk River chemical spill legacy.', primaryConcerns: ['PFAS','VOCs (industrial)','Iron'] },
  DEFAULT: { elevated: ['bacteria','nitrates','lead'], notes: 'Private wells should be tested annually for bacteria and nitrates, and periodically for heavy metals, PFAS, and local contaminants.', primaryConcerns: ['Bacteria','Nitrates','Lead'] },
};

// ─── Well filter product recommendations ─────────────────────────────────────
const WELL_PRODUCTS = [
  {
    name: 'iSpring WGB32B Well Water Whole-House',
    brand: 'iSpring',
    price: 189,
    rating: 4.6,
    reviews: 7200,
    cert: 'NSF/ANSI 42',
    removes: ['Sediment','Iron','Manganese','Chlorine','Chloramine'],
    bestFor: 'Iron & sediment in well water',
    pros: ['3-stage whole-house','Made for well water','DIY-friendly'],
    asin: 'B007QN8EEU',
    tag: 'watercheck20-20',
  },
  {
    name: 'Aquasana Rhino Well Water EQ-WELL-UV-PRO',
    brand: 'Aquasana',
    price: 1499,
    rating: 4.7,
    reviews: 890,
    cert: 'NSF/ANSI 42+61+177',
    removes: ['Bacteria','Viruses','Iron','Manganese','Chloramine','Sediment','VOCs'],
    bestFor: 'Comprehensive whole-house well water — UV + carbon + sediment',
    pros: ['UV kills bacteria/viruses','10-year filter','Best-in-class well system'],
    asin: 'B01NCDKLWC',
    tag: 'watercheck20-20',
    expertPick: true,
    expertReason: 'The only whole-house well system that combines UV sterilization (kills bacteria and viruses without chemicals) with a 10-year carbon block and sediment pre-filter. Covers every major well water concern in one unit.',
  },
  {
    name: 'APEC ROES-PH75 RO with Alkaline — Well Water Rated',
    brand: 'APEC Water Systems',
    price: 249,
    rating: 4.7,
    reviews: 3800,
    cert: 'WQA Gold Seal + NSF/ANSI 58',
    removes: ['Arsenic >99%','Lead >99%','Nitrates','PFAS','Bacteria','TDS'],
    bestFor: 'Arsenic, nitrates, PFAS — point-of-use drinking water',
    pros: ['Made in USA','Removes arsenic & nitrates','Alkaline remineralization'],
    asin: 'B00JO7R694',
    tag: 'watercheck20-20',
  },
  {
    name: 'Springwell WS1 Well Water Filter System',
    brand: 'Springwell',
    price: 699,
    rating: 4.8,
    reviews: 1200,
    cert: 'NSF/ANSI 61',
    removes: ['Iron up to 7 ppm','Manganese','Hydrogen sulfide','Bacteria'],
    bestFor: 'High iron and sulfur — common rural well issues',
    pros: ['Air injection technology','No chemicals','Handles very high iron'],
    asin: 'B08NF8P9K3',
    tag: 'watercheck20-20',
  },
  {
    name: 'Clearly Filtered Pitcher — Well Water Edition',
    brand: 'Clearly Filtered',
    price: 90,
    rating: 4.7,
    reviews: 8200,
    cert: 'NSF/ANSI 42+53+244+401+P473',
    removes: ['PFAS >99.9%','Lead >99.5%','Arsenic >99.4%','Nitrates','Bacteria','365+ contaminants'],
    bestFor: 'Budget well water solution — removes arsenic, PFAS, nitrates at point of use',
    pros: ['No installation','Removes arsenic & PFAS','Best well-water pitcher on market'],
    asin: 'B076B6FXT5',
    tag: 'watercheck20-20',
  },
];

// ─── Lab test kit recommendations ────────────────────────────────────────────
const LAB_TESTS = [
  {
    name: 'Health Metric Well Water Test Kit',
    price: 199,
    tests: '200+ contaminants including bacteria, nitrates, arsenic, lead, PFAS, metals',
    turnaround: '5–7 business days',
    asin: 'B07FJLNLSD',
    tag: 'watercheck20-20',
    recommended: true,
  },
  {
    name: 'Safe Home ULTIMATE Well Water Test Kit',
    price: 169,
    tests: '200 parameters including bacteria, heavy metals, PFAS, VOCs, pesticides',
    turnaround: '7–10 business days',
    asin: 'B07Q9C9BMX',
    tag: 'watercheck20-20',
  },
  {
    name: 'Simple Lab — PFAS Well Water Test',
    price: 299,
    tests: 'PFAS panel: 30 compounds including PFOA, PFOS, GenX',
    turnaround: '3–5 business days',
    asin: 'B09TY8MDF9',
    tag: 'watercheck20-20',
  },
];

// ─── ZIP → State lookup (2-letter code from first 3 digits) ──────────────────
function stateFromZip(zip: string): string {
  const z = parseInt(zip.slice(0, 3));
  if (z >= 995 && z <= 999) return 'AK';
  if (z >= 967 && z <= 969) return 'HI';
  if (z >= 900 && z <= 961) return 'CA';
  if (z >= 970 && z <= 979) return 'OR';
  if (z >= 980 && z <= 994) return 'WA';
  if (z >= 820 && z <= 831) return 'WY';
  if (z >= 800 && z <= 816) return 'CO';
  if (z >= 850 && z <= 865) return 'AZ';
  if (z >= 870 && z <= 884) return 'NM';
  if (z >= 840 && z <= 847) return 'UT';
  if (z >= 830 && z <= 838) return 'ID';
  if (z >= 590 && z <= 599) return 'MT';
  if (z >= 580 && z <= 588) return 'ND';
  if (z >= 570 && z <= 577) return 'SD';
  if (z >= 490 && z <= 499) return 'MI';
  if (z >= 540 && z <= 549) return 'WI';
  if (z >= 560 && z <= 567) return 'MN';
  if (z >= 500 && z <= 528) return 'IA';
  if (z >= 680 && z <= 693) return 'NE';
  if (z >= 660 && z <= 679) return 'KS';
  if (z >= 630 && z <= 658) return 'MO';
  if (z >= 700 && z <= 714) return 'LA';
  if (z >= 716 && z <= 729) return 'AR';
  if (z >= 730 && z <= 749) return 'OK';
  if (z >= 750 && z <= 799) return 'TX';
  if (z >= 520 && z <= 528) return 'IA';
  if (z >= 400 && z <= 427) return 'KY';
  if (z >= 430 && z <= 459) return 'OH';
  if (z >= 460 && z <= 479) return 'IN';
  if (z >= 480 && z <= 489) return 'MI';
  if (z >= 600 && z <= 629) return 'IL';
  if (z >= 370 && z <= 385) return 'TN';
  if (z >= 350 && z <= 369) return 'AL';
  if (z >= 386 && z <= 397) return 'MS';
  if (z >= 300 && z <= 319) return 'GA';
  if (z >= 320 && z <= 349) return 'FL';
  if (z >= 270 && z <= 289) return 'NC';
  if (z >= 290 && z <= 299) return 'SC';
  if (z >= 240 && z <= 246) return 'VA';
  if (z >= 247 && z <= 268) return 'WV';
  if (z >= 200 && z <= 212) return 'MD';
  if (z >= 214 && z <= 219) return 'MD';
  if (z >= 220 && z <= 231) return 'VA';
  if (z >= 232 && z <= 238) return 'VA';
  if (z >= 239) return 'VA';
  if (z >= 100 && z <= 149) return 'NY';
  if (z >= 150 && z <= 196) return 'PA';
  if (z >= 197 && z <= 199) return 'DE';
  if (z >= 70 && z <= 89) return 'NJ';
  if (z >= 60 && z <= 69) return 'CT';
  if (z >= 1 && z <= 27) return 'MA';
  if (z >= 28 && z <= 29) return 'RI';
  if (z >= 30 && z <= 38) return 'NH';
  if (z >= 39 && z <= 49) return 'ME';
  if (z >= 50 && z <= 59) return 'VT';
  return 'DEFAULT';
}

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get('zip');
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400, headers: H });
  }

  const state = stateFromZip(zip);
  const profile = STATE_RISK_PROFILE[state] || STATE_RISK_PROFILE['DEFAULT'];

  // Build ordered contaminant risk list — elevated risks first
  const allKeys = Object.keys(WELL_CONTAMINANTS);
  const elevated = profile.elevated;
  const ordered = [
    ...elevated.filter(k => allKeys.includes(k)),
    ...allKeys.filter(k => !elevated.includes(k)),
  ];

  const contaminants = ordered.map(key => ({
    key,
    ...WELL_CONTAMINANTS[key],
    isElevated: elevated.includes(key),
  }));

  // Score: start at 75 (well water always has unknowns), adjust for state risk profile
  const highRisks = elevated.filter(k => WELL_CONTAMINANTS[k]?.risk === 'high').length;
  const score = Math.max(40, 75 - (highRisks * 8));

  return NextResponse.json({
    type: 'well',
    zip,
    state,
    score,
    stateProfile: profile,
    contaminants,
    wellProducts: WELL_PRODUCTS,
    labTests: LAB_TESTS,
    disclaimer: 'Private wells are not regulated by EPA or state authorities. No public violation or testing data exists for private wells. This risk profile is based on regional geology, land use, and known contamination sites in your state.',
    callToAction: 'The only way to know what\'s actually in your well water is to test it. We recommend a certified lab test covering bacteria, nitrates, arsenic, lead, PFAS, and metals specific to your region.',
  }, { headers: H });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: H });
}
