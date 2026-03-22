import { NextRequest, NextResponse } from 'next/server';
import ucmr5Raw from '@/lib/ucmr5.json';

// ucmr5 format: pwsid -> [maxPfasPpt, overMCLcount, [[analyte, ppt, hasMCL, overMCL], ...], lithium?]
const ucmr5 = ucmr5Raw as Record<string, any[]>;

const EPA = 'https://data.epa.gov/efservice';

async function epaGet(path: string) {
  const res = await fetch(`${EPA}/${path}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`EPA ${res.status}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

function f(o: any, k: string): any {
  return o[k] ?? o[k.toLowerCase()] ?? o[k.toUpperCase()] ?? null;
}

function scoreToGrade(s: number) {
  if (s >= 93) return 'A';
  if (s >= 90) return 'A-'; if (s >= 87) return 'B+';
  if (s >= 83) return 'B';  if (s >= 80) return 'B-'; if (s >= 77) return 'C+';
  if (s >= 73) return 'C';  if (s >= 70) return 'C-'; if (s >= 65) return 'D+';
  if (s >= 60) return 'D';  return 'F';
}

// ─── PFAS MCLs (EPA 2024 final rule) ─────────────────────────────────────────
const PFAS_MCL_PPT: Record<string, number> = {
  PFOA: 4, PFOS: 4, PFNA: 10, PFHxS: 10,
  'HFPO-DA': 10, '9Cl-PF3ONS': 10,
};

// ─── PFAS human-readable names ────────────────────────────────────────────────
const PFAS_NAMES: Record<string, string> = {
  PFOA: 'PFOA (Perfluorooctanoic acid)',
  PFOS: 'PFOS (Perfluorooctane sulfonic acid)',
  PFNA: 'PFNA (Perfluorononanoic acid)',
  PFHxS: 'PFHxS (Perfluorohexane sulfonic acid)',
  'HFPO-DA': 'GenX / HFPO-DA',
  '9Cl-PF3ONS': '9Cl-PF3ONS',
  PFBA: 'PFBA (Perfluorobutanoic acid)',
  PFBS: 'PFBS (Perfluorobutane sulfonic acid)',
  PFDA: 'PFDA (Perfluorodecanoic acid)',
  PFDoA: 'PFDoA (Perfluorododecanoic acid)',
  PFHpA: 'PFHpA (Perfluoroheptanoic acid)',
  PFHpS: 'PFHpS (Perfluoroheptane sulfonic acid)',
  PFHxA: 'PFHxA (Perfluorohexanoic acid)',
  PFMBA: 'PFMBA',
  PFMPA: 'PFMPA',
  PFPeA: 'PFPeA (Perfluoropentanoic acid)',
  PFPeS: 'PFPeS',
  PFUnA: 'PFUnA (Perfluoroundecanoic acid)',
  NEtFOSAA: 'N-Et-FOSAA',
  NMeFOSAA: 'N-Me-FOSAA',
  NFDHA: 'NFDHA',
  ADONA: 'ADONA',
  '4:2 FTS': '4:2 Fluorotelomer sulfonic acid',
  '6:2 FTS': '6:2 Fluorotelomer sulfonic acid',
  '8:2 FTS': '8:2 Fluorotelomer sulfonic acid',
  lithium: 'Lithium',
};

// ─── Health context per contaminant ──────────────────────────────────────────
const HEALTH_CONTEXT: Record<string, { effects: string; sources: string; epa_action: string }> = {
  Lead: {
    effects: 'No safe level. Causes irreversible brain damage and developmental delays in children. Affects kidneys and cardiovascular system in adults.',
    sources: 'Corroding lead service lines and indoor plumbing, especially in homes built before 1986.',
    epa_action: 'EPA Action Level: 15 ppb. EPA proposed lowering to 10 ppb in 2024.',
  },
  PFOA: {
    effects: 'Linked to kidney and testicular cancer, thyroid disease, immune suppression, high cholesterol, and preeclampsia. Does not break down in the body or environment.',
    sources: 'Firefighting foam (AFFF), Teflon/non-stick cookware manufacturing, food packaging, industrial discharges.',
    epa_action: 'EPA MCL: 4 ppt (2024). Zero is the health goal.',
  },
  PFOS: {
    effects: 'Classified as a possible human carcinogen. Associated with thyroid disruption, liver damage, reproductive harm, and immune system suppression.',
    sources: 'Military firefighting foam, stain-resistant coatings (Scotchgard), industrial manufacturing.',
    epa_action: 'EPA MCL: 4 ppt (2024). Zero is the health goal.',
  },
  PFNA: {
    effects: 'Associated with elevated cholesterol, thyroid hormone disruption, and developmental effects in fetuses and infants.',
    sources: 'Fluoropolymer manufacturing, stain-resistant products, food packaging.',
    epa_action: 'EPA MCL: 10 ppt as part of PFAS mixture rule (2024).',
  },
  PFHxS: {
    effects: 'Similar health profile to PFOS. Thyroid disruption, liver effects, immune impacts. Replaces PFOS in many applications.',
    sources: 'Firefighting foam, food packaging, waterproof textiles.',
    epa_action: 'EPA MCL: 10 ppt as part of PFAS mixture rule (2024).',
  },
  'HFPO-DA': {
    effects: 'GenX replacement for PFOA. Animal studies link it to liver toxicity, kidney damage, cancer, and immune effects. Human data still emerging.',
    sources: 'DuPont/Chemours Fayetteville Works plant. Used as a PFOA replacement in Teflon production.',
    epa_action: 'EPA MCL: 10 ppt (2024).',
  },
  Arsenic: {
    effects: 'Long-term exposure causes bladder, lung, and skin cancer. Affects heart, nerves, and skin at lower levels. No safe level for cancer risk.',
    sources: 'Naturally occurring in rock and soil, industrial waste, agricultural pesticides, mining.',
    epa_action: 'EPA MCL: 10 ppb. EWG health goal: 0.004 ppb.',
  },
  Nitrate: {
    effects: '"Blue baby syndrome" in infants under 6 months (methemoglobinemia). Emerging links to colorectal cancer and thyroid disruption in adults.',
    sources: 'Agricultural fertilizer runoff, animal waste, septic systems. Major issue in Corn Belt and farming states.',
    epa_action: 'EPA MCL: 10 ppm. Primarily a concern for infants.',
  },
  'Chromium-6': {
    effects: 'Known human carcinogen when ingested. Linked to stomach and intestinal cancer. California determined 0.02 ppb causes 1-in-1-million cancer risk.',
    sources: 'Industrial discharge (chrome plating, leather tanning), naturally occurring in some aquifers, coal ash disposal.',
    epa_action: 'No federal MCL. CA: 0.01 ppb goal. EWG: 0.02 ppb health guideline.',
  },
  Copper: {
    effects: 'Short-term high exposure causes nausea, vomiting, liver and kidney damage. Long-term exposure linked to Wilson\'s disease in genetically susceptible individuals.',
    sources: 'Corroding copper pipes and fittings. Rare in source water.',
    epa_action: 'EPA Action Level: 1,300 ppb.',
  },
  Chloroform: {
    effects: 'Probable human carcinogen (bladder cancer risk). Formed when chlorine disinfectants react with natural organic matter. Part of Total Trihalomethanes (TTHMs).',
    sources: 'Disinfection byproduct — formed during water treatment. Higher in systems using surface water with high organic content.',
    epa_action: 'Regulated as part of TTHMs (MCL: 80 ppb total).',
  },
  'Haloacetic Acids': {
    effects: 'Group of disinfection byproducts. Linked to bladder cancer and possible reproductive effects. HAA5 includes chloroacetic, dichloroacetic, and trichloroacetic acids.',
    sources: 'Disinfection byproduct from chlorine treatment reacting with organic matter in source water.',
    epa_action: 'EPA MCL: 60 ppb for HAA5.',
  },
  Radium: {
    effects: 'Radioactive. Long-term exposure increases bone cancer risk. Deposited in bones where it irradiates bone marrow.',
    sources: 'Naturally occurring in certain rock formations. Common in Florida, Texas, and Midwest groundwater.',
    epa_action: 'EPA MCL: 5 pCi/L (combined Ra-226 and Ra-228).',
  },
  Fluoride: {
    effects: 'At levels above 4 ppm: dental and skeletal fluorosis (bone weakening). At recommended levels (0.7 ppm), prevents tooth decay.',
    sources: 'Added intentionally by utilities for dental health. Also naturally occurring in some aquifers.',
    epa_action: 'EPA secondary standard: 2 ppm (aesthetic). MCLG: 4 ppm.',
  },
  Atrazine: {
    effects: 'Endocrine disruptor. Linked to hormone disruption, low sperm count, birth defects, and potential cancer risk in animals.',
    sources: 'Agricultural herbicide widely used on corn. Runoff into rivers and groundwater — highest in spring.',
    epa_action: 'EPA MCL: 3 ppb. EWG health goal: 0.1 ppb.',
  },
  Lithium: {
    effects: 'Emerging concern. Very high levels associated with thyroid and kidney effects. Some research links naturally occurring lithium in water to lower suicide rates. Health effects at drinking water concentrations still under study.',
    sources: 'Naturally occurring in some aquifers, especially in arid western US. Mining and battery manufacturing waste.',
    epa_action: 'No current EPA MCL. EPA UCMR5 median health goal: 10 μg/L.',
  },
  'PFAS (Total)': {
    effects: 'Forever chemicals that accumulate in the body and environment. Collectively linked to cancer, thyroid disease, immune suppression, reproductive harm, and elevated cholesterol.',
    sources: 'Firefighting foam, non-stick cookware, stain-resistant fabrics, food packaging, industrial sites.',
    epa_action: 'EPA set enforceable limits for PFOA and PFOS at 4 ppt in 2024 — the lowest measurable level.',
  },
  Chloramine: {
    effects: 'Alternative disinfectant to chlorine. Produces different byproducts (HANs, NDMA). Can affect people with kidney failure on dialysis. Taste and odor issues common.',
    sources: 'Added as disinfectant to reduce TTHMs. Used in many large urban systems.',
    epa_action: 'EPA MRDLG: 4 ppm.',
  },
};

// ─── PWSID overrides — major cities nationwide ────────────────────────────────
const PWSID_OVERRIDES: Record<string, { pwsid: string; city: string; utility: string }> = {
  // Massachusetts
  '02190': { pwsid: 'MA3229000', city: 'South Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02189': { pwsid: 'MA3229000', city: 'East Weymouth, MA',  utility: 'Town of Weymouth DPW · Water Division' },
  '02188': { pwsid: 'MA3229000', city: 'Weymouth, MA',       utility: 'Town of Weymouth DPW · Water Division' },
  '02191': { pwsid: 'MA3229000', city: 'North Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02169': { pwsid: 'MA3218010', city: 'Quincy, MA',         utility: 'MWRA · Quincy Distribution' },
  '02101': { pwsid: 'MA3021000', city: 'Boston, MA',         utility: 'Boston Water & Sewer Commission' },
  // New York
  '10001': { pwsid: 'NY7000552', city: 'New York, NY',       utility: 'NYC Department of Environmental Protection' },
  '10019': { pwsid: 'NY7000552', city: 'New York, NY',       utility: 'NYC Department of Environmental Protection' },
  '11201': { pwsid: 'NY7000552', city: 'Brooklyn, NY',       utility: 'NYC Department of Environmental Protection' },
  '10301': { pwsid: 'NY7000552', city: 'Staten Island, NY',  utility: 'NYC Department of Environmental Protection' },
  // New Jersey
  '07101': { pwsid: 'NJ0907001', city: 'Newark, NJ',         utility: 'Newark Watershed / Middlesex Water' },
  '07302': { pwsid: 'NJ0904001', city: 'Jersey City, NJ',    utility: 'Jersey City Municipal Utilities Authority' },
  // Pennsylvania
  '19101': { pwsid: 'PA2510001', city: 'Philadelphia, PA',   utility: 'Philadelphia Water Department' },
  '15201': { pwsid: 'PA0200013', city: 'Pittsburgh, PA',     utility: 'Pittsburgh Water & Sewer Authority' },
  // Illinois
  '60601': { pwsid: 'IL1638800', city: 'Chicago, IL',        utility: 'Chicago Dept. of Water Management' },
  '60614': { pwsid: 'IL1638800', city: 'Chicago, IL',        utility: 'Chicago Dept. of Water Management' },
  // Texas
  '77001': { pwsid: 'TX1010013', city: 'Houston, TX',        utility: 'Houston Water' },
  '78201': { pwsid: 'TX0150003', city: 'San Antonio, TX',    utility: 'San Antonio Water System (SAWS)' },
  '75201': { pwsid: 'TX0571550', city: 'Dallas, TX',         utility: 'Dallas Water Utilities' },
  '76101': { pwsid: 'TX0439001', city: 'Fort Worth, TX',     utility: 'Fort Worth Water Department' },
  '78701': { pwsid: 'TX0155591', city: 'Austin, TX',         utility: 'Austin Water' },
  // California
  '90001': { pwsid: 'CA1910067', city: 'Los Angeles, CA',    utility: 'Los Angeles Dept. of Water & Power' },
  '90210': { pwsid: 'CA1910067', city: 'Beverly Hills, CA',  utility: 'LA Dept. of Water & Power' },
  '94101': { pwsid: 'CA3810020', city: 'San Francisco, CA',  utility: 'SF Public Utilities Commission' },
  '92101': { pwsid: 'CA3710001', city: 'San Diego, CA',      utility: 'City of San Diego Public Utilities' },
  '95101': { pwsid: 'CA4310053', city: 'San Jose, CA',       utility: 'San Jose Water Company' },
  '93301': { pwsid: 'CA1510013', city: 'Bakersfield, CA',    utility: 'California Water Service — Bakersfield' },
  // Florida
  '33101': { pwsid: 'FL4130064', city: 'Miami, FL',          utility: 'Miami-Dade Water & Sewer Department' },
  '33602': { pwsid: 'FL2960421', city: 'Tampa, FL',          utility: 'Tampa Bay Water / City of Tampa' },
  '32801': { pwsid: 'FL5910901', city: 'Orlando, FL',        utility: 'Orange County Utilities' },
  // Washington
  '98101': { pwsid: 'WA0045501', city: 'Seattle, WA',        utility: 'Seattle Public Utilities' },
  // Arizona
  '85001': { pwsid: 'AZ0401000', city: 'Phoenix, AZ',        utility: 'City of Phoenix Water Services' },
  '85701': { pwsid: 'AZ1001000', city: 'Tucson, AZ',         utility: 'Tucson Water' },
  // Michigan
  '48201': { pwsid: 'MI6025900', city: 'Detroit, MI',        utility: 'Great Lakes Water Authority (GLWA)' },
  // Ohio
  '44101': { pwsid: 'OH0502001', city: 'Cleveland, OH',      utility: 'Cleveland Water' },
  '43201': { pwsid: 'OH2500001', city: 'Columbus, OH',       utility: 'Columbus Division of Water' },
  // North Carolina
  '28201': { pwsid: 'NC0120001', city: 'Charlotte, NC',      utility: 'Charlotte Water' },
  '27601': { pwsid: 'NC9192010', city: 'Raleigh, NC',        utility: 'Raleigh Public Utilities' },
  // Maryland / DC
  '21201': { pwsid: 'MD0300001', city: 'Baltimore, MD',      utility: 'Baltimore City DPW' },
  '20001': { pwsid: 'DC0000001', city: 'Washington, DC',     utility: 'DC Water' },
  // Minnesota
  '55101': { pwsid: 'MN0271600', city: 'Minneapolis, MN',    utility: 'Minneapolis Water Works' },
  // Colorado
  '80201': { pwsid: 'CO0165500', city: 'Denver, CO',         utility: 'Denver Water' },
  // Nevada
  '89101': { pwsid: 'NV0314100', city: 'Las Vegas, NV',      utility: 'Las Vegas Valley Water District' },
  // Oregon
  '97201': { pwsid: 'OR4100150', city: 'Portland, OR',       utility: 'Portland Water Bureau' },
  // Indiana
  '46201': { pwsid: 'IN4970476', city: 'Indianapolis, IN',   utility: 'Citizens Energy Group' },
  // Wisconsin
  '53201': { pwsid: 'WI1040019', city: 'Milwaukee, WI',      utility: 'Milwaukee Water Works' },
  // Missouri
  '64101': { pwsid: 'MO4028210', city: 'Kansas City, MO',    utility: 'Kansas City Water Services' },
  '63101': { pwsid: 'MO4098910', city: 'St. Louis, MO',      utility: 'Metropolitan St. Louis Sewer District' },
  // Louisiana
  '70112': { pwsid: 'LA1019901', city: 'New Orleans, LA',    utility: 'Sewerage & Water Board of New Orleans' },
  // Tennessee
  '37201': { pwsid: 'TN1900041', city: 'Nashville, TN',      utility: 'Metro Water Services' },
  // Hawaii
  '96801': { pwsid: 'HI0100001', city: 'Honolulu, HI',       utility: 'Board of Water Supply — Oahu' },
};

// ─── EWG tap water data: 80+ major metros ────────────────────────────────────
const EWG: Record<string, { score?: number; city?: string; contaminants: any[] }> = {
  '02101': { city: 'Boston, MA', score: 72, contaminants: [
    { name: 'Chloroform', level: 23, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG Tap Water Atlas — Boston Water & Sewer Commission' },
    { name: 'Haloacetic Acids', level: 18, limit: 60, unit: 'ppb', severity: 'low', note: 'EWG Tap Water Atlas' },
  ]},
  '10001': { city: 'New York, NY', score: 78, contaminants: [
    { name: 'Chloramine', level: 2.8, limit: 4, unit: 'ppm', severity: 'low', note: 'EWG — NYC DEP' },
    { name: 'Radium', level: 0.8, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG — NYC DEP' },
  ]},
  '10019': { city: 'New York, NY', score: 78, contaminants: [] },
  '11201': { city: 'Brooklyn, NY', score: 77, contaminants: [] },
  '07101': { city: 'Newark, NJ', score: 42, contaminants: [
    { name: 'Lead', level: 22, limit: 15, unit: 'ppb', severity: 'high', note: 'EWG — Newark consent decree — lead service lines' },
    { name: 'PFAS (Total)', level: 12, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG Tap Water Atlas — Newark watershed' },
  ]},
  '07302': { city: 'Jersey City, NJ', score: 55, contaminants: [
    { name: 'Haloacetic Acids', level: 41, limit: 60, unit: 'ppb', severity: 'moderate', note: 'EWG' },
    { name: 'PFAS (Total)', level: 6.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG Tap Water Atlas' },
  ]},
  '19101': { city: 'Philadelphia, PA', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 16.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Delaware River PFAS contamination' },
    { name: 'Chloroform', level: 36, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
    { name: 'Nitrate', level: 4.2, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG' },
  ]},
  '15201': { city: 'Pittsburgh, PA', score: 62, contaminants: [
    { name: 'PFAS (Total)', level: 8.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Pittsburgh Water & Sewer Authority' },
    { name: 'Lead', level: 11, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG — aging infrastructure' },
  ]},
  '21201': { city: 'Baltimore, MD', score: 65, contaminants: [
    { name: 'Chromium-6', level: 0.15, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — above CA health goal' },
    { name: 'Chloroform', level: 29, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Baltimore DPW' },
  ]},
  '20001': { city: 'Washington, DC', score: 70, contaminants: [
    { name: 'Chromium-6', level: 0.11, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — DC Water' },
    { name: 'PFAS (Total)', level: 5.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Potomac River source' },
  ]},
  '30301': { city: 'Atlanta, GA', score: 74, contaminants: [
    { name: 'Chloroform', level: 31, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Atlanta DWM' },
    { name: 'Haloacetic Acids', level: 22, limit: 60, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '33101': { city: 'Miami, FL', score: 52, contaminants: [
    { name: 'PFAS (Total)', level: 28.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Miami-Dade Water — significant PFAS contamination' },
    { name: 'Arsenic', level: 4.9, limit: 10, unit: 'ppb', severity: 'low', note: 'EWG' },
    { name: 'Nitrate', level: 5.8, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — Biscayne Aquifer agricultural runoff' },
  ]},
  '33602': { city: 'Tampa, FL', score: 61, contaminants: [
    { name: 'PFAS (Total)', level: 11.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Tampa Bay Water' },
    { name: 'Radium', level: 2.1, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG — Florida aquifer' },
  ]},
  '32801': { city: 'Orlando, FL', score: 63, contaminants: [
    { name: 'Radium', level: 2.8, limit: 5, unit: 'pCi/L', severity: 'moderate', note: 'EWG — OUC — elevated naturally occurring radium' },
    { name: 'PFAS (Total)', level: 7.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Orange County Utilities' },
  ]},
  '28201': { city: 'Charlotte, NC', score: 67, contaminants: [
    { name: 'PFAS (Total)', level: 9.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Charlotte Water — GenX/HFPO-DA detected' },
    { name: 'Chloroform', level: 27, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '27601': { city: 'Raleigh, NC', score: 71, contaminants: [
    { name: 'PFAS (Total)', level: 6.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Raleigh Public Utilities' },
    { name: 'Haloacetic Acids', level: 19, limit: 60, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '37201': { city: 'Nashville, TN', score: 72, contaminants: [
    { name: 'Chloroform', level: 28, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Metro Water Services' },
    { name: 'PFAS (Total)', level: 4.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '40201': { city: 'Louisville, KY', score: 64, contaminants: [
    { name: 'PFAS (Total)', level: 8.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Louisville Water Co. — Ohio River source' },
    { name: 'Nitrate', level: 6.1, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — agricultural runoff' },
  ]},
  '35201': { city: 'Birmingham, AL', score: 68, contaminants: [
    { name: 'PFAS (Total)', level: 6.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Birmingham Water Works' },
    { name: 'Chloroform', level: 31, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '60601': { city: 'Chicago, IL', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 14.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Chicago Dept. Water Management' },
    { name: 'Chloroform', level: 42, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG — high disinfection byproducts' },
    { name: 'Haloacetic Acids', level: 38, limit: 60, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '44101': { city: 'Cleveland, OH', score: 63, contaminants: [
    { name: 'PFAS (Total)', level: 7.6, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Cleveland Water — Lake Erie source' },
    { name: 'Lead', level: 8, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG — aging lead service lines' },
  ]},
  '43201': { city: 'Columbus, OH', score: 69, contaminants: [
    { name: 'PFAS (Total)', level: 5.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Columbus Division of Water' },
    { name: 'Nitrate', level: 4.8, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG — agricultural runoff Ohio' },
  ]},
  '48201': { city: 'Detroit, MI', score: 57, contaminants: [
    { name: 'PFAS (Total)', level: 9.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — GLWA — Great Lakes Water Authority' },
    { name: 'Lead', level: 12, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG — legacy service line replacement underway' },
  ]},
  '53201': { city: 'Milwaukee, WI', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 6.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Milwaukee Water Works — Lake Michigan' },
    { name: 'Lead', level: 7, limit: 15, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '55101': { city: 'Minneapolis, MN', score: 71, contaminants: [
    { name: 'PFAS (Total)', level: 5.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Minneapolis Water — PFAS from 3M discharge' },
    { name: 'Chloroform', level: 18, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Mississippi River source' },
  ]},
  '64101': { city: 'Kansas City, MO', score: 65, contaminants: [
    { name: 'PFAS (Total)', level: 7.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Kansas City Water Dept.' },
    { name: 'Nitrate', level: 5.9, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — Missouri River agricultural runoff' },
  ]},
  '63101': { city: 'St. Louis, MO', score: 61, contaminants: [
    { name: 'PFAS (Total)', level: 11.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — MSD St. Louis' },
    { name: 'Chloroform', level: 44, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG — Mississippi River source' },
    { name: 'Nitrate', level: 7.2, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG' },
  ]},
  '68101': { city: 'Omaha, NE', score: 67, contaminants: [
    { name: 'Nitrate', level: 8.3, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — Missouri River basin — heavy ag runoff' },
    { name: 'PFAS (Total)', level: 5.6, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '50301': { city: 'Des Moines, IA', score: 60, contaminants: [
    { name: 'Nitrate', level: 11.4, limit: 10, unit: 'ppm', severity: 'high', note: 'EWG — DMWW — Des Moines River — elevated nitrates from farmland' },
    { name: 'Atrazine', level: 1.1, limit: 3, unit: 'ppb', severity: 'low', note: 'EWG — herbicide runoff' },
    { name: 'PFAS (Total)', level: 4.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '46201': { city: 'Indianapolis, IN', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 8.2, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Citizens Energy Group' },
    { name: 'Nitrate', level: 5.4, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — White River agricultural' },
  ]},
  '77001': { city: 'Houston, TX', score: 48, contaminants: [
    { name: 'PFAS (Total)', level: 22.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Houston Water — significant industrial PFAS' },
    { name: 'Arsenic', level: 5.1, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG' },
    { name: 'Radium', level: 1.8, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG' },
  ]},
  '78201': { city: 'San Antonio, TX', score: 63, contaminants: [
    { name: 'Radium', level: 3.4, limit: 5, unit: 'pCi/L', severity: 'moderate', note: 'EWG — SAWS — Edwards Aquifer naturally radioactive' },
    { name: 'Arsenic', level: 3.8, limit: 10, unit: 'ppb', severity: 'low', note: 'EWG' },
    { name: 'PFAS (Total)', level: 4.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG' },
  ]},
  '75201': { city: 'Dallas, TX', score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 13.7, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Dallas Water Utilities' },
    { name: 'Chromium-6', level: 0.13, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — above CA health goal' },
    { name: 'Chloroform', level: 36, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '76101': { city: 'Fort Worth, TX', score: 60, contaminants: [
    { name: 'PFAS (Total)', level: 10.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Tarrant Regional Water District' },
    { name: 'Chloroform', level: 39, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '78701': { city: 'Austin, TX', score: 72, contaminants: [
    { name: 'PFAS (Total)', level: 5.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Austin Water — Colorado River source' },
    { name: 'Chloroform', level: 22, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG' },
  ]},
  '73101': { city: 'Oklahoma City, OK', score: 64, contaminants: [
    { name: 'PFAS (Total)', level: 7.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — OKC Water Utilities' },
    { name: 'Nitrate', level: 5.1, limit: 10, unit: 'ppm', severity: 'moderate', note: 'EWG — agricultural plains' },
  ]},
  '70112': { city: 'New Orleans, LA', score: 51, contaminants: [
    { name: 'PFAS (Total)', level: 19.6, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — SWWB — Mississippi River PFAS' },
    { name: 'Chloroform', level: 52, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG — high disinfection byproducts' },
    { name: 'Haloacetic Acids', level: 47, limit: 60, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '87101': { city: 'Albuquerque, NM', score: 69, contaminants: [
    { name: 'Arsenic', level: 4.2, limit: 10, unit: 'ppb', severity: 'low', note: 'EWG — Albuquerque Bernalillo County Water' },
    { name: 'Radium', level: 1.1, limit: 5, unit: 'pCi/L', severity: 'low', note: 'EWG' },
  ]},
  '85001': { city: 'Phoenix, AZ', score: 62, contaminants: [
    { name: 'Chromium-6', level: 0.21, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — Phoenix Water — Colorado River source' },
    { name: 'Arsenic', level: 6.8, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — naturally occurring in AZ groundwater' },
    { name: 'PFAS (Total)', level: 7.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Luke AFB area contamination' },
  ]},
  '85701': { city: 'Tucson, AZ', score: 60, contaminants: [
    { name: 'Chromium-6', level: 0.18, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — Tucson Water — Colorado River blend' },
    { name: 'PFAS (Total)', level: 9.1, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Davis-Monthan AFB contamination' },
  ]},
  '80201': { city: 'Denver, CO', score: 75, contaminants: [
    { name: 'Chromium-6', level: 0.07, limit: 0.1, unit: 'ppb', severity: 'low', note: 'EWG — Denver Water' },
    { name: 'PFAS (Total)', level: 3.8, limit: 4, unit: 'ppt', severity: 'low', note: 'EWG — Buckley SFB — below MCL' },
  ]},
  '89101': { city: 'Las Vegas, NV', score: 59, contaminants: [
    { name: 'Chromium-6', level: 0.19, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — LVVWD — Colorado River industrial contamination' },
    { name: 'PFAS (Total)', level: 8.7, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Lake Mead watershed' },
    { name: 'Arsenic', level: 5.3, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — naturally occurring' },
  ]},
  '98101': { city: 'Seattle, WA', score: 88, contaminants: [
    { name: 'Chloroform', level: 9, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — SPU — Cedar River watershed' },
    { name: 'PFAS (Total)', level: 1.2, limit: 4, unit: 'ppt', severity: 'low', note: 'EWG — among cleanest major US utilities' },
  ]},
  '97201': { city: 'Portland, OR', score: 85, contaminants: [
    { name: 'Chloroform', level: 11, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — Portland Water Bureau — Bull Run' },
    { name: 'PFAS (Total)', level: 1.8, limit: 4, unit: 'ppt', severity: 'low', note: 'EWG — relatively low' },
  ]},
  '90001': { city: 'Los Angeles, CA', score: 62, contaminants: [
    { name: 'Chromium-6', level: 0.31, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — LADWP — highest chromium-6 of any major US city' },
    { name: 'Arsenic', level: 7.2, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — groundwater blend' },
    { name: 'PFAS (Total)', level: 11.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — San Fernando Valley groundwater contamination' },
  ]},
  '90210': { city: 'Beverly Hills, CA', score: 82, contaminants: [
    { name: 'Chromium-6', level: 0.05, limit: 0.1, unit: 'ppb', severity: 'low', note: 'EWG — LA DWP' },
    { name: 'Nitrate', level: 2.1, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG' },
  ]},
  '94101': { city: 'San Francisco, CA', score: 84, contaminants: [
    { name: 'Chloroform', level: 13, limit: 80, unit: 'ppb', severity: 'low', note: 'EWG — SFPUC — Hetch Hetchy' },
    { name: 'PFAS (Total)', level: 2.1, limit: 4, unit: 'ppt', severity: 'low', note: 'EWG — below MCL' },
  ]},
  '92101': { city: 'San Diego, CA', score: 66, contaminants: [
    { name: 'Chromium-6', level: 0.22, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — San Diego — Colorado River blend' },
    { name: 'PFAS (Total)', level: 10.3, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Camp Pendleton PFAS plume' },
  ]},
  '93301': { city: 'Bakersfield, CA', score: 53, contaminants: [
    { name: 'Arsenic', level: 8.9, limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG — San Joaquin Valley groundwater' },
    { name: 'Nitrate', level: 12.1, limit: 10, unit: 'ppm', severity: 'high', note: 'EWG — agricultural runoff — San Joaquin Valley' },
    { name: 'Chromium-6', level: 0.28, limit: 0.1, unit: 'ppb', severity: 'high', note: 'EWG — Kern County' },
  ]},
  '96801': { city: 'Honolulu, HI', score: 79, contaminants: [
    { name: 'PFAS (Total)', level: 6.8, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Oahu — PFAS from Red Hill fuel facility' },
    { name: 'Nitrate', level: 2.9, limit: 10, unit: 'ppm', severity: 'low', note: 'EWG' },
  ]},
  '29201': { city: 'Columbia, SC', score: 66, contaminants: [
    { name: 'PFAS (Total)', level: 14.7, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Columbia Water — PFAS from Congaree River' },
    { name: 'Chloroform', level: 41, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '39201': { city: 'Jackson, MS', score: 38, contaminants: [
    { name: 'Lead', level: 28, limit: 15, unit: 'ppb', severity: 'high', note: 'EWG — Jackson water crisis — aging infrastructure' },
    { name: 'PFAS (Total)', level: 9.4, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — Pearl River watershed' },
    { name: 'Chloroform', level: 51, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG — treatment inconsistencies' },
  ]},
  '25301': { city: 'Charleston, WV', score: 57, contaminants: [
    { name: 'PFAS (Total)', level: 12.9, limit: 4, unit: 'ppt', severity: 'high', note: 'EWG — WV American Water — Elk River history' },
    { name: 'Chloroform', level: 43, limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG' },
  ]},
  '02169': { city: 'Quincy, MA', score: 91, contaminants: [] },
  '02188': { city: 'Weymouth, MA', score: 94, contaminants: [] },
  '02189': { city: 'East Weymouth, MA', score: 94, contaminants: [] },
  '02190': { city: 'South Weymouth, MA', score: 94, contaminants: [] },
};

// ─── VIOL / contaminant label maps ───────────────────────────────────────────
const VIOL_LABELS: Record<string, string> = {
  MCL: 'Max Contaminant Level Exceeded', MRDL: 'Max Residual Disinfectant Level',
  TT: 'Treatment Technique', MR: 'Monitoring & Reporting',
  RPT: 'Reporting Requirement', PN: 'Public Notification',
};
const STATUS_META: Record<string, { label: string; color: string }> = {
  O: { label: 'Open', color: '#ef4444' },
  R: { label: 'Resolved', color: '#22d3ee' },
  A: { label: 'Addressed', color: '#f59e0b' },
};
const CONTAM_NAMES: Record<string, string> = {
  '1040': 'Lead', '1020': 'Arsenic', '2456': 'Nitrate', '2050': 'Fluoride',
  '4010': 'Total Coliform', '5000': 'Chlorine', PB90: 'Lead', CU90: 'Copper',
  '1030': 'Chromium', '2030': 'Fluoride', '1000': 'Antimony', '2010': 'Barium',
};

// ─── Build UCMR5 contaminants from compact format ────────────────────────────
function getPfasForPwsid(pwsid: string): any[] {
  const row = ucmr5[pwsid];
  if (!row || !Array.isArray(row[2])) return [];
  const analytes: any[] = row[2]; // [[analyte, ppt, hasMCL, overMCL], ...]

  return analytes
    .filter(a => a[1] > 0)
    .map(a => {
      const [analyte, ppt, hasMCL, overMCL] = a;
      const mclPpt = PFAS_MCL_PPT[analyte] ?? null;
      const severity = overMCL ? 'high' : hasMCL && ppt > (mclPpt ?? Infinity) * 0.5 ? 'moderate' : 'low';
      const ctx = HEALTH_CONTEXT[analyte] || HEALTH_CONTEXT['PFAS (Total)'];
      return {
        name: PFAS_NAMES[analyte] || analyte,
        analyteName: analyte,
        level: ppt,
        limit: mclPpt,
        unit: 'ppt',
        severity,
        note: overMCL
          ? `EXCEEDS EPA MCL of ${mclPpt} ppt — EPA UCMR5 2023-2025`
          : hasMCL
            ? `Below EPA MCL of ${mclPpt} ppt — EPA UCMR5 2023-2025`
            : 'No individual MCL — EPA UCMR5 2023-2025',
        source: 'EPA UCMR5',
        isPFAS: true,
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
      };
    })
    .sort((a, b) => {
      if (a.severity === 'high' && b.severity !== 'high') return -1;
      if (b.severity === 'high' && a.severity !== 'high') return 1;
      return b.level - a.level;
    });
}

// ─── Try USGS NWIS for source water context ───────────────────────────────────
async function getUsgsSourceWater(state: string, lat?: number, lng?: number): Promise<any> {
  try {
    // USGS NWIS current conditions — surface water quality sites
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=${state.toLowerCase()}&parameterCd=00010,00095,00300&siteType=ST&period=P1D&siteStatus=active`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    const sites = data?.value?.timeSeries?.slice(0, 3) || [];
    if (!sites.length) return null;
    return {
      source: 'USGS NWIS',
      sites: sites.map((s: any) => ({
        name: s.sourceInfo?.siteName || 'Unnamed site',
        param: s.variable?.variableDescription || '',
        value: s.values?.[0]?.value?.[0]?.value || null,
        unit: s.variable?.unit?.unitCode || '',
      })).filter((s: any) => s.value !== null && s.value !== '-999999' && s.value !== -999999).slice(0, 3),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const H = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };
  const zip = req.nextUrl.searchParams.get('zip');
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400, headers: H });
  }

  try {
    let pwsid: string;
    let pwsName: string;
    let cityName: string;
    let stateCode: string = '';
    let popCount: string | null = null;
    let srcCode = '';

    const override = PWSID_OVERRIDES[zip];
    if (override) {
      pwsid     = override.pwsid;
      pwsName   = override.utility;
      cityName  = override.city.split(',')[0].trim();
      stateCode = override.city.includes(',') ? override.city.split(',')[1].trim().split(' ')[0] : '';
      try {
        const rows: any[] = await epaGet(`WATER_SYSTEM/PWSID/${override.pwsid}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`);
        if (rows?.length) {
          pwsName  = f(rows[0], 'pws_name') || pwsName;
          srcCode  = f(rows[0], 'primary_source_code') || '';
          popCount = f(rows[0], 'population_served_count');
          stateCode = f(rows[0], 'state_code') || stateCode;
        }
      } catch { /* keep hardcoded */ }
    } else {
      let systems: any[] = await epaGet(
        `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/PWS_TYPE_CODE/CWS/rows/1:10/JSON`
      ).catch(() => []);
      if (!Array.isArray(systems) || !systems.length) {
        systems = await epaGet(
          `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
        ).catch(() => []);
      }
      if (!Array.isArray(systems) || !systems.length) {
        return NextResponse.json(
          { error: `No public water system found for ZIP ${zip}. This may be a private well area or very small community.` },
          { status: 404, headers: H }
        );
      }
      const sys = [...systems].sort((a, b) =>
        (parseInt(f(b, 'population_served_count')) || 0) -
        (parseInt(f(a, 'population_served_count')) || 0)
      )[0];
      pwsid     = f(sys, 'pwsid') || f(sys, 'PWSID');
      pwsName   = f(sys, 'pws_name') || f(sys, 'PWS_NAME') || 'Unknown Water System';
      cityName  = f(sys, 'city_name') || f(sys, 'CITY_NAME') || '';
      stateCode = f(sys, 'state_code') || f(sys, 'STATE_CODE') || f(sys, 'primacy_agency_code') || '';
      popCount  = f(sys, 'population_served_count') || f(sys, 'POPULATION_SERVED_COUNT');
      srcCode   = f(sys, 'primary_source_code') || f(sys, 'PRIMARY_SOURCE_CODE') || '';
    }

    // ─── Parallel data fetch ────────────────────────────────────────────────
    const [violations, lcr, usgsData] = await Promise.all([
      epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`).catch(() => []),
      epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:30/JSON`).catch(() => []),
      stateCode ? getUsgsSourceWater(stateCode) : Promise.resolve(null),
    ]);
    const viols: any[]   = Array.isArray(violations) ? violations : [];
    const samples: any[] = Array.isArray(lcr) ? lcr : [];

    // ─── Scoring ────────────────────────────────────────────────────────────
    let score = 100;
    const openV   = viols.filter(v => (f(v, 'violation_status_code') || '') === 'O');
    const healthV = viols.filter(v => ['MCL', 'MRDL', 'TT'].includes(f(v, 'violation_category_code') || ''));
    score -= Math.min(openV.length * 8, 40);
    score -= Math.min(healthV.length * 6, 30);

    const leadS = samples.filter(s => ['PB90', '1040'].includes(f(s, 'contaminant_code') || ''));
    if (leadS.length) {
      const mx = Math.max(...leadS.map(s => parseFloat(f(s, 'sample_measure')) || 0));
      if (mx > 15) score -= 20;
      else if (mx > 10) score -= 12;
      else if (mx > 5)  score -= 5;
    }

    const pfasContaminants = getPfasForPwsid(pwsid);
    const pfasAboveMcl     = pfasContaminants.filter(p => p.severity === 'high');
    score -= Math.min(pfasAboveMcl.length * 10, 25);

    const ewg = EWG[zip];
    if (ewg?.score !== undefined) {
      score = Math.round(score * 0.6 + ewg.score * 0.4);
    }
    score = Math.max(Math.min(score, 100), 10);

    // ─── National percentile (based on score distribution) ──────────────────
    // Score distribution approximation from EPA SDWIS + UCMR5 population
    // ~45M Americans have PFAS > MCL → roughly bottom 35% of population
    const nationalPercentile =
      score >= 90 ? 95 :
      score >= 85 ? 88 :
      score >= 80 ? 78 :
      score >= 75 ? 68 :
      score >= 70 ? 58 :
      score >= 65 ? 45 :
      score >= 60 ? 33 :
      score >= 55 ? 22 :
      score >= 50 ? 15 : 8;

    // ─── Contaminants ────────────────────────────────────────────────────────
    const contaminants: any[] = [];
    const addC = (name: string, codes: string[], limit: number, unit: string) => {
      const hits = samples.filter(s => codes.includes(f(s, 'contaminant_code') || ''));
      if (!hits.length) return;
      const val = Math.max(...hits.map(s => parseFloat(f(s, 'sample_measure')) || 0));
      const ctx = HEALTH_CONTEXT[name];
      contaminants.push({
        name, level: +val.toFixed(2), limit, unit,
        severity: val > limit ? 'high' : val > limit * 0.5 ? 'moderate' : 'low',
        note: `${hits.length} sample(s) — EPA Action Level: ${limit} ${unit}`,
        source: 'EPA LCR',
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
      });
    };
    addC('Lead',   ['PB90', '1040'], 15,   'ppb');
    addC('Copper', ['CU90', '1020'], 1300, 'ppb');

    for (const v of healthV.slice(0, 4)) {
      const cc = f(v, 'contaminant_code') || '';
      const sc = f(v, 'violation_status_code') || '';
      const name = CONTAM_NAMES[cc] || f(v, 'contaminant_name') || `Contaminant ${cc}`;
      if (!contaminants.find(c => c.name === name)) {
        const ctx = HEALTH_CONTEXT[name];
        contaminants.push({
          name, level: null, limit: null, unit: '',
          severity: sc === 'O' ? 'high' : 'moderate',
          note: `${sc === 'O' ? 'OPEN' : 'Resolved'} — ${VIOL_LABELS[f(v, 'violation_category_code') || ''] || ''}`,
          violationBased: true, source: 'EPA SDWIS',
          healthEffects: ctx?.effects,
          healthSources: ctx?.sources,
          epaAction: ctx?.epa_action,
        });
      }
    }

    // Add PFAS from UCMR5 — always show specific compounds (they're different from EWG's "PFAS Total")
    for (const p of pfasContaminants) {
      // Deduplicate: skip if a contaminant with exact same name already exists
      if (!contaminants.find(c => c.name === p.name)) {
        contaminants.push(p);
      }
    }

    // Add EWG data
    if (ewg?.contaminants) {
      for (const ec of ewg.contaminants) {
        if (!contaminants.find(c => c.name === ec.name)) {
          const ctx = HEALTH_CONTEXT[ec.name];
          contaminants.push({
            ...ec, source: 'EWG Tap Water Atlas',
            healthEffects: ctx?.effects,
            healthSources: ctx?.sources,
            epaAction: ctx?.epa_action,
          });
        }
      }
    }

    // ─── UCMR5 lithium ───────────────────────────────────────────────────────
    const ucmr5Row = ucmr5[pwsid];
    const lithiumVal = ucmr5Row && ucmr5Row.length >= 4 ? ucmr5Row[3] : null;
    if (lithiumVal !== null && typeof lithiumVal === 'number') {
      const ctx = HEALTH_CONTEXT['Lithium'];
      contaminants.push({
        name: 'Lithium',
        level: lithiumVal,
        limit: 10,
        unit: 'μg/L',
        severity: lithiumVal > 10 ? 'moderate' : 'low',
        note: `EPA UCMR5 2023-2025 — MCLG under review`,
        source: 'EPA UCMR5',
        healthEffects: ctx?.effects,
        healthSources: ctx?.sources,
        epaAction: ctx?.epa_action,
      });
    }

    // ─── Format violations ───────────────────────────────────────────────────
    const fmtViols = [...viols]
      .sort((a, b) =>
        new Date(f(b, 'compliance_period_begin_date') || 0).getTime() -
        new Date(f(a, 'compliance_period_begin_date') || 0).getTime()
      )
      .slice(0, 10)
      .map(v => {
        const cat = f(v, 'violation_category_code') || '';
        const sc  = f(v, 'violation_status_code')   || '';
        const cc  = f(v, 'contaminant_code')         || '';
        return {
          rule:        VIOL_LABELS[cat] || cat || 'Violation',
          contaminant: CONTAM_NAMES[cc] || f(v, 'contaminant_name') || '',
          year:        (f(v, 'compliance_period_begin_date') || '').slice(0, 4) || '—',
          status:      STATUS_META[sc]?.label || sc || '—',
          statusColor: STATUS_META[sc]?.color || '#94a3b8',
        };
      });

    const pfasCount = pfasContaminants.length;
    const pfasAbove = pfasAboveMcl.length;
    const openCount = openV.length;

    const ucmr5Summary = ucmr5Row ? {
      maxPfasPpt: ucmr5Row[0],
      overMCL: ucmr5Row[1],
      totalAnalytes: ucmr5Row[2]?.length || 0,
    } : null;

    // ─── Data sources used ───────────────────────────────────────────────────
    const dataSources = ['EPA SDWIS'];
    if (pfasCount > 0) dataSources.push('EPA UCMR5 PFAS');
    if (ewg)           dataSources.push('EWG Tap Water Atlas');
    if (usgsData)      dataSources.push('USGS NWIS');
    if (lithiumVal)    dataSources.push('UCMR5 Lithium');

    const summary = openCount > 0
      ? `${pwsName} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${pwsName} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${pwsName} has no recorded violations in the EPA SDWIS database.`;

    const pfasSummary = pfasCount > 0
      ? pfasAbove > 0
        ? `⚠️ ${pfasAbove} PFAS compound(s) detected above EPA MCL limits (2024 rule).`
        : `${pfasCount} PFAS compound(s) detected — all below current EPA MCL limits.`
      : null;

    return NextResponse.json({
      city:             [cityName, stateCode].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName:       pwsName,
      pwsid,
      stateCode,
      score,
      grade:            scoreToGrade(score),
      nationalPercentile,
      population:       popCount ? parseInt(popCount).toLocaleString() : null,
      sourceType:       srcCode === 'SW' ? 'Surface Water'
                      : srcCode === 'GW' ? 'Groundwater'
                      : srcCode === 'GU' ? 'Groundwater (surface influenced)'
                      : 'Municipal',
      dataSource:       dataSources.join(' + '),
      dataSources,
      openViolations:   openCount,
      totalViolations:  viols.length,
      hasLCR:           samples.length > 0,
      hasEWG:           !!ewg,
      hasPFAS:          pfasCount > 0,
      pfasCount,
      pfasAboveMcl:     pfasAbove,
      ucmr5:            ucmr5Summary,
      usgs:             usgsData,
      contaminants,
      violations:       fmtViols,
      summary,
      pfasSummary,
    }, { headers: H });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'EPA API error' }, { status: 500, headers: H });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}
