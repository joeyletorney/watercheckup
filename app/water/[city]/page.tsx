import type { Metadata } from 'next';
import Link from 'next/link';

const CITIES: Record<string, {
  name: string; state: string; zip: string; population: string;
  system: string; pwsid: string;
  issues: string[]; facts: string[];
  urgency: 'high' | 'medium' | 'low';
}> = {
  'chicago': {
    name: 'Chicago', state: 'IL', zip: '60601', population: '2.7M',
    system: 'Chicago Department of Water Management', pwsid: 'IL0100008',
    issues: ['Lead service lines', 'Chloramine disinfection byproducts', 'Legacy pipe infrastructure'],
    facts: [
      'Chicago has over 400,000 lead service lines -- among the most in any US city.',
      'The city uses chloramine instead of chlorine, which forms NDMA and other DBPs.',
      'Lead leaches from pipes directly into tap water, especially in older homes.',
      'Only reverse osmosis removes lead to safe levels -- Brita and standard pitchers do not.',
    ],
    urgency: 'high',
  },
  'los-angeles': {
    name: 'Los Angeles', state: 'CA', zip: '90001', population: '4M',
    system: 'Los Angeles Department of Water and Power', pwsid: 'CA1910067',
    issues: ['Chromium-6 (hexavalent chromium)', 'PFAS in some districts', 'Drought-driven water blending'],
    facts: [
      "LA's water has one of the highest chromium-6 levels of any major US city -- a known carcinogen.",
      'Multiple LADWP water districts have detected PFAS above EPA health advisory levels.',
      'Water is blended from the Colorado River and local groundwater -- quality varies by district.',
      'Only RO systems remove chromium-6 -- activated carbon does not.',
    ],
    urgency: 'high',
  },
  'houston': {
    name: 'Houston', state: 'TX', zip: '77001', population: '2.3M',
    system: 'Houston Public Works Water', pwsid: 'TX1010013',
    issues: ['Disinfection byproducts (THMs)', 'Chloramine', 'Post-hurricane aging infrastructure'],
    facts: [
      "Houston's water consistently tests above average for trihalomethanes (THMs) -- cancer-linked DBPs.",
      'Post-Harvey flooding stressed water infrastructure and contamination risks spiked.',
      'Chloramine used for disinfection produces NDMA and other byproducts that standard filters miss.',
      'Carbon block or RO filtration is recommended for Houston residents.',
    ],
    urgency: 'medium',
  },
  'new-york': {
    name: 'New York City', state: 'NY', zip: '10001', population: '8.3M',
    system: 'NYC Department of Environmental Protection', pwsid: 'NY7000627',
    issues: ['Legacy lead service lines in older boroughs', 'Chlorination byproducts', 'Building pipe contamination'],
    facts: [
      "NYC source water from the Catskills is excellent -- but old building pipes add lead.",
      'Buildings built before 1986 likely have lead solder or lead pipes inside.',
      'NYCDEP water ranks among the best for municipal supply -- but in-building pipes are the risk.',
      'A home lead test is essential for NYC residents in pre-1986 buildings.',
    ],
    urgency: 'medium',
  },
  'phoenix': {
    name: 'Phoenix', state: 'AZ', zip: '85001', population: '1.6M',
    system: 'Phoenix Water Services', pwsid: 'AZ0413005',
    issues: ['High TDS / hard water', 'PFAS from military sites', 'Arsenic in groundwater'],
    facts: [
      'Phoenix water has some of the highest TDS of any major US city -- over 600 mg/L.',
      'Military installations nearby have contaminated some groundwater sources with PFAS.',
      'Arizona groundwater has naturally elevated arsenic levels -- above EPA health goals in some areas.',
      'RO is essential in Phoenix -- it removes TDS, arsenic, PFAS, and hard minerals.',
    ],
    urgency: 'high',
  },
  'philadelphia': {
    name: 'Philadelphia', state: 'PA', zip: '19101', population: '1.6M',
    system: 'Philadelphia Water Department', pwsid: 'PA2510007',
    issues: ['Lead service lines', 'PFAS from upstream industrial sources', 'Chlorination byproducts'],
    facts: [
      'Philadelphia has thousands of lead service lines still in use throughout the city.',
      "Delaware River -- Philadelphia's source water -- carries PFAS from upstream industrial discharge.",
      'In 2021, EWG detected multiple PFAS compounds in Philadelphia tap water above health guidelines.',
      'Both RO and Clearly Filtered-certified pitchers remove PFAS for Philly residents.',
    ],
    urgency: 'high',
  },
  'san-antonio': {
    name: 'San Antonio', state: 'TX', zip: '78201', population: '1.5M',
    system: 'San Antonio Water System', pwsid: 'TX2150001',
    issues: ['Hard water / high mineral content', 'Disinfection byproducts', 'Edwards Aquifer dependency'],
    facts: [
      'San Antonio draws from the Edwards Aquifer -- naturally hard water with high calcium and magnesium.',
      'Hard water causes scale buildup, shortens appliance life, and affects taste.',
      'SAWS has logged disinfection byproduct violations -- chlorine reaction with organic matter.',
      'A whole-house softener combined with an under-sink RO is the gold standard for SA residents.',
    ],
    urgency: 'medium',
  },
  'dallas': {
    name: 'Dallas', state: 'TX', zip: '75201', population: '1.3M',
    system: 'Dallas Water Utilities', pwsid: 'TX0570001',
    issues: ['Trihalomethanes (THMs)', 'Haloacetic acids (HAA5)', 'Industrial runoff into Trinity River'],
    facts: [
      'Dallas water has historically elevated THMs and HAA5 -- disinfection byproducts linked to cancer risk.',
      'The Trinity River, a source for Dallas water, receives industrial and agricultural runoff.',
      'EWG has flagged Dallas water for exceeding health guidelines on multiple contaminants.',
      'RO or certified carbon block filtration addresses THMs and HAAs for Dallas residents.',
    ],
    urgency: 'medium',
  },
  'miami': {
    name: 'Miami', state: 'FL', zip: '33101', population: '470K',
    system: 'Miami-Dade Water and Sewer Department', pwsid: 'FL4130895',
    issues: ['PFAS contamination', 'Saltwater intrusion', 'Aging infrastructure'],
    facts: [
      "Miami-Dade's Biscayne Aquifer is threatened by saltwater intrusion from sea level rise.",
      'PFAS has been detected in multiple South Florida water systems above EPA health advisory levels.',
      "Aging distribution pipes in Miami's older neighborhoods introduce lead and copper.",
      "NSF-certified RO systems address the full range of Miami's water concerns.",
    ],
    urgency: 'high',
  },
  'seattle': {
    name: 'Seattle', state: 'WA', zip: '98101', population: '750K',
    system: 'Seattle Public Utilities', pwsid: 'WA0033650',
    issues: ['Naturally soft / corrosive water', 'Lead leaching from older pipes', 'Chloramine use'],
    facts: [
      "Seattle's source water from the Cedar and Tolt rivers is among the purest in the US.",
      'The water is naturally soft and slightly acidic -- which makes it more corrosive to pipes.',
      'Corrosive water leaches lead and copper from older plumbing, especially pre-1986 homes.',
      'SPU adds corrosion inhibitors, but homes with older pipes should still test for lead.',
    ],
    urgency: 'low',
  },
  'denver': {
    name: 'Denver', state: 'CO', zip: '80201', population: '750K',
    system: 'Denver Water', pwsid: 'CO0107498',
    issues: ['Lead service lines', 'Chloramine DBPs', 'Wildfire-impacted watershed'],
    facts: [
      'Denver Water is replacing lead service lines but thousands remain active in older neighborhoods.',
      "Wildfires in Colorado's watersheds release contaminants that reach source water.",
      'Denver uses chloramine, which reacts with organic matter to produce hard-to-filter byproducts.',
      'For older Denver homes, an RO system addresses both lead and DBP concerns.',
    ],
    urgency: 'medium',
  },
  'boston': {
    name: 'Boston', state: 'MA', zip: '02101', population: '675K',
    system: 'MWRA -- Boston Distribution', pwsid: 'MA3387412',
    issues: ['Lead service lines in pre-1986 buildings', 'Disinfection byproducts', 'Corrosive soft water'],
    facts: [
      'MWRA source water from Quabbin Reservoir is one of the cleanest large water supplies in the US.',
      "Boston's water is naturally soft and slightly acidic, causing it to leach lead from older pipes.",
      'The city has thousands of lead service lines still connecting homes -- owner responsibility to replace.',
      'Buildings built before 1986 should test for lead and use certified filtration as a precaution.',
    ],
    urgency: 'medium',
  },
  'atlanta': {
    name: 'Atlanta', state: 'GA', zip: '30301', population: '500K',
    system: 'Atlanta Department of Watershed Management', pwsid: 'GA1210001',
    issues: ['Disinfection byproducts', 'Industrial pollution in Chattahoochee River', 'Aging infrastructure'],
    facts: [
      'Atlanta pulls from the Chattahoochee River, which carries industrial and agricultural runoff.',
      'The system has logged multiple violations for disinfection byproducts over the years.',
      "Significant aging infrastructure in Atlanta's distribution system creates contamination risk.",
      'EWG flagged Atlanta water for exceeding health guidelines on several detected contaminants.',
    ],
    urgency: 'medium',
  },
  'san-francisco': {
    name: 'San Francisco', state: 'CA', zip: '94102', population: '870K',
    system: 'SF Public Utilities Commission', pwsid: 'CA3810067',
    issues: ['Chloramine disinfection byproducts', 'PFAS in some sources', 'Lead in building plumbing'],
    facts: [
      'SF water comes from Hetch Hetchy Reservoir in Yosemite -- one of the cleanest sources in the country.',
      'SF uses chloramine which creates NDMA and other DBPs that are harder to filter.',
      'PFAS has been detected in some SFPUC water sources above California health goals.',
      'Older SF buildings (pre-1986) have lead solder and some lead service lines still active.',
    ],
    urgency: 'low',
  },
  'detroit': {
    name: 'Detroit', state: 'MI', zip: '48201', population: '630K',
    system: 'Great Lakes Water Authority', pwsid: 'MI2530058',
    issues: ['Lead service lines', 'PFAS contamination', 'Industrial legacy pollution'],
    facts: [
      'Detroit has thousands of lead service lines -- the Flint crisis put the entire region on alert.',
      'Michigan has some of the highest PFAS contamination levels in the US due to industrial history.',
      'GLWA has improved significantly since the Flint crisis, but older home plumbing remains a risk.',
      'RO filtration is strongly recommended for Detroit and surrounding area residents.',
    ],
    urgency: 'high',
  },
  'minneapolis': {
    name: 'Minneapolis', state: 'MN', zip: '55401', population: '430K',
    system: 'Minneapolis Water Works', pwsid: 'MN1900057',
    issues: ['Lead service lines', 'Chloramine byproducts', 'Nitrates from agricultural runoff'],
    facts: [
      'Minneapolis has been proactively replacing lead service lines but many older homes still have them.',
      'The Mississippi River carries nitrates and agricultural runoff from upstream sources.',
      'Chloramine is used for disinfection -- standard activated carbon filters do not remove its byproducts.',
      'Minneapolis water meets all EPA standards but EWG found contaminants above health guidelines.',
    ],
    urgency: 'medium',
  },
  'portland': {
    name: 'Portland', state: 'OR', zip: '97201', population: '650K',
    system: 'Portland Water Bureau', pwsid: 'OR4100089',
    issues: ['Naturally corrosive water', 'Lead in older plumbing', 'Cryptosporidium risk in Bull Run'],
    facts: [
      "Portland's Bull Run watershed water is exceptionally clean -- among the best source water in any major US city.",
      'Portland water is soft and slightly acidic, making it corrosive to pipes.',
      'Portland uses chlorine (not chloramine) and does not fluoridate by default.',
      'Lead risk in Portland comes from in-building plumbing -- older homes should test.',
    ],
    urgency: 'low',
  },
  'las-vegas': {
    name: 'Las Vegas', state: 'NV', zip: '89101', population: '650K',
    system: 'Las Vegas Valley Water District', pwsid: 'NV0300140',
    issues: ['Extremely hard water', 'High TDS', 'Disinfection byproducts', 'Colorado River dependency'],
    facts: [
      'Las Vegas water is among the hardest in the US -- TDS commonly exceeds 600-800 mg/L.',
      'The Colorado River is the primary source -- shared with 7 states and under drought stress.',
      'High TDS causes scale buildup, shortened appliance lifespan, and metallic taste.',
      'RO is essentially mandatory in Las Vegas -- it removes TDS, hardness minerals, and DBPs.',
    ],
    urgency: 'high',
  },
  'nashville': {
    name: 'Nashville', state: 'TN', zip: '37201', population: '700K',
    system: 'Metro Nashville Water Services', pwsid: 'TN0310003',
    issues: ['Disinfection byproducts', 'Combined sewer overflow risk', 'Aging infrastructure'],
    facts: [
      'Nashville has logged violations for disinfection byproducts -- THMs and HAAs above legal limits.',
      'Combined sewer overflow events can introduce pathogens into source water after heavy rain.',
      "Nashville's rapid growth has strained water infrastructure in some districts.",
      'Certified filtration addressing DBPs is recommended for Nashville residents.',
    ],
    urgency: 'medium',
  },
  'baltimore': {
    name: 'Baltimore', state: 'MD', zip: '21201', population: '580K',
    system: 'Baltimore City Department of Public Works', pwsid: 'MD0050001',
    issues: ['Lead service lines', 'Aging water mains', 'Disinfection byproducts'],
    facts: [
      'Baltimore has one of the highest concentrations of lead service lines on the East Coast.',
      'The city has experienced main breaks and water quality events tied to aging infrastructure.',
      'EWG found multiple contaminants in Baltimore water exceeding health guidelines.',
      'Homes built before 1986 in Baltimore should test for lead and use RO filtration.',
    ],
    urgency: 'high',
  },
  'memphis': {
    name: 'Memphis', state: 'TN', zip: '38101', population: '630K',
    system: 'Memphis Light Gas and Water', pwsid: 'TN0790001',
    issues: ['PFAS contamination', 'Aquifer vulnerability', '1,4-dioxane from upstream'],
    facts: [
      'Memphis sits atop the Memphis Sand Aquifer -- once considered pristine, now showing PFAS contamination.',
      '1,4-dioxane from upstream industrial sources has been detected in Memphis area water.',
      'The aquifer is increasingly vulnerable as surface contamination percolates down over time.',
      'NSF-certified RO addresses PFAS and 1,4-dioxane -- the most pressing Memphis concerns.',
    ],
    urgency: 'high',
  },
  'louisville': {
    name: 'Louisville', state: 'KY', zip: '40201', population: '630K',
    system: 'Louisville Water Company', pwsid: 'KY0570001',
    issues: ['Ohio River contamination', 'Disinfection byproducts', 'Industrial runoff'],
    facts: [
      'Louisville draws from the Ohio River -- one of the most industrially impacted rivers in the US.',
      'The Ohio River carries agricultural runoff, industrial discharge, and pharmaceutical residues.',
      'Louisville Water has logged DBP violations and is frequently flagged by EWG for contamination.',
      'RO filtration is strongly recommended -- it handles the wide range of Ohio River contaminants.',
    ],
    urgency: 'high',
  },
  'cleveland': {
    name: 'Cleveland', state: 'OH', zip: '44101', population: '370K',
    system: 'Cleveland Water', pwsid: 'OH1640040',
    issues: ['Lead service lines', 'Lake Erie algal blooms', 'PFAS from industrial legacy'],
    facts: [
      'Cleveland draws from Lake Erie -- which experiences harmful algal blooms that produce cyanotoxins.',
      "Cyanotoxins can pass through standard treatment -- 2014's Toledo water crisis raised regional awareness.",
      'Ohio has significant industrial PFAS contamination; Cleveland water has been tested above health goals.',
      'Cleveland has thousands of lead service lines in older neighborhoods still in service.',
    ],
    urgency: 'high',
  },
  'pittsburgh': {
    name: 'Pittsburgh', state: 'PA', zip: '15201', population: '300K',
    system: 'Pittsburgh Water and Sewer Authority', pwsid: 'PA2660001',
    issues: ['Lead contamination crisis', 'Industrial legacy pollution', 'Aging infrastructure'],
    facts: [
      'Pittsburgh faced a major lead crisis when improper corrosion inhibitor use raised lead levels citywide.',
      'The Mon and Allegheny Rivers carry industrial legacy contamination from decades of steel production.',
      'PWSA is undertaking a massive lead service line replacement -- but thousands remain active.',
      'Pittsburgh residents, especially parents of young children, should use RO filtration without exception.',
    ],
    urgency: 'high',
  },
  'indianapolis': {
    name: 'Indianapolis', state: 'IN', zip: '46201', population: '880K',
    system: 'Citizens Energy Group', pwsid: 'IN5253039',
    issues: ['Disinfection byproducts', 'Agricultural nitrates', 'Aging infrastructure'],
    facts: [
      'Indy water comes from the White River and Fall Creek -- both receive significant agricultural runoff.',
      "Nitrates from farming are a persistent concern in Indiana's water supply.",
      'Citizens Energy has logged THM and HAA5 violations in past years.',
      'Certified RO removes both nitrates and DBPs -- the main concerns for Indianapolis residents.',
    ],
    urgency: 'medium',
  },
  'columbus': {
    name: 'Columbus', state: 'OH', zip: '43201', population: '900K',
    system: 'Columbus Division of Water', pwsid: 'OH2570090',
    issues: ['PFAS', 'Disinfection byproducts', 'Agricultural runoff in source water'],
    facts: [
      "Columbus draws from Hoover, O'Shaughnessy, and Griggs reservoirs -- all receiving agricultural runoff.",
      'PFAS has been detected in Columbus area water systems above EPA health advisory levels.',
      'Columbus has logged THM and HAA violations in prior years.',
      'Ohio has significant statewide PFAS issues due to industrial and military contamination.',
    ],
    urgency: 'medium',
  },
  'charlotte': {
    name: 'Charlotte', state: 'NC', zip: '28201', population: '900K',
    system: 'Charlotte Water', pwsid: 'NC0112010',
    issues: ['GenX / PFAS contamination', 'Disinfection byproducts', 'Catawba River contamination'],
    facts: [
      'North Carolina is ground zero for GenX (HFPO-DA) PFAS contamination from Chemours/DuPont.',
      "The Cape Fear River basin -- Charlotte's watershed -- has been heavily contaminated with PFAS.",
      'Charlotte Water has tested above EPA health advisory levels for multiple PFAS compounds.',
      'A certified RO system is the most important purchase for Charlotte-area residents.',
    ],
    urgency: 'high',
  },
  'raleigh': {
    name: 'Raleigh', state: 'NC', zip: '27601', population: '470K',
    system: 'City of Raleigh Public Utilities', pwsid: 'NC0920010',
    issues: ['GenX and PFAS', 'Trihalomethanes', 'Agricultural runoff'],
    facts: [
      "Like Charlotte, Raleigh sits in North Carolina's PFAS contamination zone from industrial sources.",
      'Multiple PFAS compounds have been detected in Wake County water systems.',
      'Raleigh water has logged THM violations -- disinfection byproducts linked to cancer.',
      'Certified RO filtration is the recommended solution for the full PFAS profile.',
    ],
    urgency: 'high',
  },
  'omaha': {
    name: 'Omaha', state: 'NE', zip: '68101', population: '490K',
    system: 'Metropolitan Utilities District', pwsid: 'NE2801100',
    issues: ['Nitrates from agriculture', 'Atrazine pesticide', 'Disinfection byproducts'],
    facts: [
      'Nebraska is the heart of corn country -- nitrate runoff from fertilizer is a constant concern.',
      'Atrazine, a widely used corn herbicide, has been detected in Nebraska water supplies.',
      '"Blue baby syndrome" from nitrates above 10 ppm is a real infant health risk.',
      'RO systems remove nitrates, atrazine, and DBPs -- all relevant to Omaha water profile.',
    ],
    urgency: 'medium',
  },
  'kansas-city': {
    name: 'Kansas City', state: 'MO', zip: '64101', population: '500K',
    system: 'Kansas City Water Services', pwsid: 'MO0690001',
    issues: ['Missouri River contamination', 'Disinfection byproducts', 'Agricultural runoff'],
    facts: [
      'Kansas City draws from the Missouri River -- heavily impacted by upstream agriculture.',
      'The Missouri River has been called one of the most heavily modified rivers in the US.',
      'Kansas City water has exceeded EPA health guidelines for multiple contaminants per EWG data.',
      "Carbon block or RO filtration addresses KC's main water concerns.",
    ],
    urgency: 'medium',
  },
  'new-orleans': {
    name: 'New Orleans', state: 'LA', zip: '70112', population: '380K',
    system: 'Sewerage & Water Board of New Orleans', pwsid: 'LA0735001',
    issues: ['Lead contamination', 'Disinfection byproducts', 'Aging infrastructure', 'Post-flooding risk'],
    facts: [
      'New Orleans has severe aging infrastructure -- water main breaks are a near-daily occurrence.',
      'The city has significant lead contamination risk from old service lines and building plumbing.',
      'Katrina and subsequent flooding events have compounded infrastructure challenges.',
      'EWG has flagged New Orleans water for numerous contaminants above health guidelines.',
    ],
    urgency: 'high',
  },
  'tampa': {
    name: 'Tampa', state: 'FL', zip: '33601', population: '400K',
    system: 'Tampa Water Department', pwsid: 'FL2910100',
    issues: ['PFAS contamination', 'Disinfection byproducts', 'Hard water / high TDS'],
    facts: [
      'Tampa draws from Hillsborough River and the Tampa Bay desalination plant.',
      'PFAS contamination from military and industrial sources has impacted Florida groundwater statewide.',
      'Tampa water is naturally hard with elevated TDS -- scaling and taste issues are common.',
      'RO handles PFAS, TDS, and DBPs -- recommended for Tampa residents.',
    ],
    urgency: 'medium',
  },
  'st-louis': {
    name: 'St. Louis', state: 'MO', zip: '63101', population: '300K',
    system: 'Missouri American Water -- St. Louis', pwsid: 'MO0690002',
    issues: ['Mississippi River contamination', 'Lead pipes', 'Industrial legacy'],
    facts: [
      'St. Louis draws from the Missouri and Mississippi Rivers -- both receive heavy industrial discharge.',
      'St. Louis has significant lead service line infrastructure from the 19th and early 20th century.',
      'Missouri has a legacy of industrial pollution including Superfund sites near the water supply.',
      'Lead and DBP filtration are both priorities for St. Louis residents.',
    ],
    urgency: 'high',
  },
  'sacramento': {
    name: 'Sacramento', state: 'CA', zip: '95814', population: '520K',
    system: 'Sacramento Regional Water Authority', pwsid: 'CA3410045',
    issues: ['Arsenic', 'Agricultural runoff', 'Disinfection byproducts'],
    facts: [
      "Sacramento draws from the Sacramento River, which carries agricultural runoff from California's Central Valley.",
      'Arsenic from natural geological sources has been detected in Sacramento area groundwater.',
      "California has stricter water quality standards than federal EPA -- Sacramento generally performs well.",
      'RO handles arsenic and DBPs -- the main concerns for Sacramento area residents.',
    ],
    urgency: 'medium',
  },
  'salt-lake-city': {
    name: 'Salt Lake City', state: 'UT', zip: '84101', population: '200K',
    system: 'Salt Lake City Public Utilities', pwsid: 'UT400010',
    issues: ['PFAS from Hill AFB', 'Hard water', 'Arsenic'],
    facts: [
      'Hill Air Force Base has been a major PFAS contamination source in the Salt Lake Valley.',
      'Utah groundwater has naturally elevated arsenic levels in many areas.',
      'Salt Lake City water is very hard -- scaling, taste, and appliance damage are common.',
      'RO removes PFAS, arsenic, and TDS -- all relevant concerns for SLC residents.',
    ],
    urgency: 'high',
  },
  'albuquerque': {
    name: 'Albuquerque', state: 'NM', zip: '87101', population: '560K',
    system: 'Albuquerque Bernalillo County Water Utility Authority', pwsid: 'NM3501501',
    issues: ['Arsenic in groundwater', 'Hard water', 'Chromium-6'],
    facts: [
      'New Mexico has some of the highest naturally occurring arsenic levels in the US.',
      "Albuquerque water has tested above California's strict chromium-6 health goal.",
      'The Rio Grande and local aquifer supply water that is naturally high in dissolved solids.',
      'RO is particularly important in Albuquerque for arsenic, chromium-6, and TDS removal.',
    ],
    urgency: 'high',
  },
  'tucson': {
    name: 'Tucson', state: 'AZ', zip: '85701', population: '540K',
    system: 'Tucson Water', pwsid: 'AZ0413006',
    issues: ['PFAS from military sites', 'Arsenic', 'Hard water'],
    facts: [
      'Davis-Monthan Air Force Base has contributed PFAS contamination to Tucson groundwater.',
      'Arizona has naturally elevated arsenic in groundwater -- Tucson is no exception.',
      'Tucson water is extremely hard -- TDS often exceeds 500 mg/L.',
      'RO systems are the standard recommendation for Tucson -- removes PFAS, arsenic, and TDS.',
    ],
    urgency: 'high',
  },
  'jacksonville': {
    name: 'Jacksonville', state: 'FL', zip: '32201', population: '950K',
    system: 'JEA Water', pwsid: 'FL2700106',
    issues: ['PFAS contamination', 'Sulfur taste / odor', 'Disinfection byproducts'],
    facts: [
      "Jacksonville's Floridan Aquifer water has a naturally sulfurous taste and odor.",
      'PFAS from military and industrial sites has been detected in Northeast Florida groundwater.',
      'JEA has logged violations for disinfection byproducts in past reporting years.',
      'RO removes PFAS, DBPs, and the sulfur compounds that cause taste issues.',
    ],
    urgency: 'medium',
  },
  'austin': {
    name: 'Austin', state: 'TX', zip: '78701', population: '960K',
    system: 'Austin Water Utility', pwsid: 'TX2270001',
    issues: ['Disinfection byproducts', 'Algal blooms in Lake Austin', 'Aging infrastructure'],
    facts: [
      'Lake Austin and Lake Travis have experienced algal blooms during drought conditions.',
      'Cyanotoxins from algae can temporarily appear in source water and require extra treatment.',
      'Austin has logged DBP violations and has aging pipes in older neighborhoods.',
      'Rapidly growing Austin is expanding infrastructure, but older parts of the city lag behind.',
    ],
    urgency: 'medium',
  },
  'san-diego': {
    name: 'San Diego', state: 'CA', zip: '92101', population: '1.4M',
    system: 'San Diego Public Utilities', pwsid: 'CA3710001',
    issues: ['Imported water vulnerability', 'Chromium-6', 'Hard water', 'PFAS'],
    facts: [
      'San Diego imports over 85% of its water from Northern California and the Colorado River.',
      "Chromium-6 has been detected in San Diego water above California's strict health goals.",
      'San Diego water is very hard -- scale buildup and taste complaints are common.',
      'PFAS has been found in some San Diego County water systems, particularly near military bases.',
    ],
    urgency: 'high',
  },
  'san-jose': {
    name: 'San Jose', state: 'CA', zip: '95101', population: '1M',
    system: 'San Jose Water Company', pwsid: 'CA4310004',
    issues: ['Chromium-6', 'PFAS from tech industry', 'Nitrates from agriculture'],
    facts: [
      'Silicon Valley has a troubling history of industrial chemical contamination in groundwater.',
      'San Jose Water serves areas with legacy tech-industry Superfund sites that have impacted aquifers.',
      'Chromium-6 has been detected in Bay Area water above California health goals.',
      'Nitrates from agricultural Santa Clara Valley land use add to the contamination profile.',
    ],
    urgency: 'high',
  },
  'washington-dc': {
    name: 'Washington DC', state: 'DC', zip: '20001', population: '700K',
    system: 'DC Water (WASA)', pwsid: 'DC0000001',
    issues: ['Lead service lines', 'Disinfection byproducts', 'Potomac River contamination'],
    facts: [
      'DC faced a major lead crisis in the early 2000s and still has thousands of lead service lines.',
      'The Potomac River receives agricultural runoff, stormwater, and treated sewage from upstream.',
      'DC Water has made significant improvements but EWG still flags contaminants above health goals.',
      'Homes built before 1986 in DC should test for lead and use certified RO filtration.',
    ],
    urgency: 'high',
  },
  'cincinnati': {
    name: 'Cincinnati', state: 'OH', zip: '45201', population: '310K',
    system: 'Greater Cincinnati Water Works', pwsid: 'OH1530045',
    issues: ['Ohio River contamination', 'PFAS', 'Disinfection byproducts'],
    facts: [
      'Cincinnati draws from the Ohio River -- receiving industrial, pharmaceutical, and agricultural runoff.',
      "PFAS from upstream industrial sources has been detected in Cincinnati's water supply.",
      'GCWW is known for treating water well but source water quality remains a concern.',
      "Ohio's industrial legacy means PFAS is a statewide issue -- certified RO is recommended.",
    ],
    urgency: 'medium',
  },
  'charlotte-nc': {
    name: 'Charlotte', state: 'NC', zip: '28201', population: '900K',
    system: 'Charlotte Water', pwsid: 'NC0112010',
    issues: ['GenX / PFAS contamination', 'Disinfection byproducts', 'Catawba River contamination'],
    facts: [
      'North Carolina is ground zero for GenX PFAS contamination from Chemours/DuPont.',
      "The Cape Fear River basin -- Charlotte's watershed -- has been heavily contaminated with PFAS.",
      'Charlotte Water has tested above EPA health advisory levels for multiple PFAS compounds.',
      'A certified RO system is the most important purchase for Charlotte-area residents.',
    ],
    urgency: 'high',
  },
  'milwaukee': {
    name: 'Milwaukee', state: 'WI', zip: '53201', population: '590K',
    system: 'Milwaukee Water Works', pwsid: 'WI3200120',
    issues: ['Lead service lines', 'Cryptosporidium (1993 outbreak)', 'Industrial PFAS'],
    facts: [
      'Milwaukee had the largest Cryptosporidium outbreak in US history in 1993 -- 400,000+ affected.',
      'The city still has thousands of lead service lines in older neighborhoods.',
      'Wisconsin has significant PFAS contamination from industrial and military sources statewide.',
      'Milwaukee Water Works has greatly improved treatment but RO remains the recommended protection.',
    ],
    urgency: 'high',
  },
  'buffalo': {
    name: 'Buffalo', state: 'NY', zip: '14201', population: '260K',
    system: 'Erie County Water Authority', pwsid: 'NY1500099',
    issues: ['Lead service lines', 'Lake Erie algal blooms', 'Industrial legacy'],
    facts: [
      "Lake Erie is Buffalo's water source -- the same lake that caught fire due to pollution in 1969.",
      'Harmful algal blooms in Lake Erie produce cyanotoxins that challenge water treatment.',
      'Buffalo has significant lead service line infrastructure in older neighborhoods.',
      'Great Lakes water quality has improved dramatically but industrial legacy contaminants remain.',
    ],
    urgency: 'medium',
  },
  'anchorage': {
    name: 'Anchorage', state: 'AK', zip: '99501', population: '290K',
    system: 'Anchorage Water and Wastewater Utility', pwsid: 'AK0000501',
    issues: ['PFAS from Elmendorf AFB', 'Naturally soft / corrosive water', 'Legacy fuel spills'],
    facts: [
      'Elmendorf Air Force Base has been a major source of PFAS contamination in the Anchorage area.',
      'Anchorage water is naturally very soft and slightly acidic -- corrosive to pipes and plumbing.',
      'Historical fuel spills from military and commercial activity have impacted some Anchorage groundwater.',
      'Despite its remote location, Anchorage has real contamination concerns residents should address.',
    ],
    urgency: 'medium',
  },
  'honolulu': {
    name: 'Honolulu', state: 'HI', zip: '96801', population: '350K',
    system: 'Honolulu Board of Water Supply', pwsid: 'HI0000102',
    issues: ['Agricultural pesticide runoff', 'Red Hill fuel contamination', 'PFAS from military'],
    facts: [
      "The 2021 Red Hill fuel spill contaminated the Navy's groundwater system -- affecting thousands.",
      "Hawaii's agricultural history left pesticide residues (including TCP) in some groundwater sources.",
      'Military PFAS contamination is a documented issue on Oahu, particularly near Pearl Harbor.',
      'Certified RO handles pesticide residues, PFAS, and fuel contamination byproducts.',
    ],
    urgency: 'high',
  },
  'baton-rouge': {
    name: 'Baton Rouge', state: 'LA', zip: '70801', population: '230K',
    system: 'Baton Rouge Water Company', pwsid: 'LA0170001',
    issues: ['Mississippi River contamination', 'Industrial corridor runoff', 'PFAS'],
    facts: [
      'Baton Rouge sits in "Cancer Alley" -- the stretch of Louisiana with the highest concentration of industrial plants.',
      'The Mississippi River at Baton Rouge receives discharge from hundreds of industrial facilities upstream.',
      'PFAS and industrial chemicals have been detected in Baton Rouge area water.',
      'EWG consistently flags Louisiana water systems for some of the worst contamination nationally.',
    ],
    urgency: 'high',
  },
  'richmond': {
    name: 'Richmond', state: 'VA', zip: '23219', population: '230K',
    system: 'Richmond Department of Public Utilities', pwsid: 'VA5081730',
    issues: ['James River contamination', 'Disinfection byproducts', 'Industrial legacy'],
    facts: [
      'Richmond draws from the James River, which carries industrial discharge from upstream facilities.',
      'The James River was once declared biologically dead from industrial pollution -- recovery is ongoing.',
      'Richmond water has been flagged for DBP violations and elevated contaminant levels per EWG.',
      'Certified filtration addressing both DBPs and industrial contaminants is recommended.',
    ],
    urgency: 'medium',
  },
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cd = CITIES[params.city];
  if (!cd) return { title: 'Water Quality Report | WaterCheckup' };
  return {
    title: `Is ${cd.name} Tap Water Safe? EPA Report 2025 | WaterCheckup`,
    description: `${cd.name} water quality report powered by live EPA data. PFAS testing, lead violations, and expert filter recommendations for ${cd.name}, ${cd.state}.`,
    openGraph: {
      title: `${cd.name} Tap Water Quality -- EPA Report | WaterCheckup`,
      description: `See what's really in ${cd.name}'s tap water. Live EPA SDWIS + UCMR5 PFAS data.`,
      images: [{ url: `https://watercheckup.com/api/og?city=${encodeURIComponent(cd.name + ', ' + cd.state)}&score=&grade=&violations=`, width: 1200, height: 630 }],
    },
  };
}

const urgencyConfig = {
  high:   { color: '#ef4444', bg: '#ef444415', border: '#ef444440', label: 'HIGH CONCERN', icon: '🚨' },
  medium: { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40', label: 'MONITOR',      icon: '⚠️' },
  low:    { color: '#22d3ee', bg: '#22d3ee15', border: '#22d3ee40', label: 'GENERALLY OK', icon: '✅' },
};

export default function CityPage({ params }: { params: { city: string } }) {
  const cd = CITIES[params.city];
  const cityName = params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const urg = cd ? urgencyConfig[cd.urgency] : urgencyConfig.medium;

  return (
    <div style={{ minHeight: '100vh', background: '#040d14', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #0f2336', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💧</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>WaterCheckup</span>
        </Link>
        <Link href="/" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Check My ZIP →
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 10 }}>
            WATER QUALITY REPORT
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', lineHeight: 1.2, margin: '0 0 12px' }}>
            {cd ? `${cd.name}, ${cd.state}` : cityName} Tap Water Quality
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
            What EPA data, PFAS monitoring, and independent health research reveals about {cd?.name ?? cityName}'s drinking water -- and what you can do about it.
          </p>

          {cd && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 10 }}>
              <span style={{ fontSize: 18 }}>{urg.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: urg.color, letterSpacing: 1 }}>{urg.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Based on EPA violations and contaminant profile</div>
              </div>
            </div>
          )}
        </div>

        {cd ? (
          <>
            {/* Known issues */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                KNOWN WATER ISSUES -- {cd.name.toUpperCase()}, {cd.state}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cd.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10 }}>
                    <span style={{ color: urg.color, fontSize: 16, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 600 }}>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facts */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
                WHAT YOU SHOULD KNOW
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cd.facts.map((fact, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0891b2', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System info */}
            <div style={{ marginBottom: 40, padding: '20px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 14 }}>WATER SYSTEM -- EPA SDWIS</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { l: 'System Name', v: cd.system },
                  { l: 'EPA PWSID', v: cd.pwsid },
                  { l: 'Population Served', v: cd.population },
                  { l: 'State', v: cd.state },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>City data coming soon</div>
            <p style={{ fontSize: 14 }}>Enter your ZIP code above to check your specific water system.</p>
          </div>
        )}

        {/* FAQ section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: 2, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #0f2336' }}>
            COMMON QUESTIONS
          </div>
          {[
            { q: `Is ${cd?.name ?? cityName} tap water safe to drink?`, a: `${cd?.name ?? cityName} water meets EPA legal standards but meeting standards is not the same as being free of contaminants. EPA limits are set based on feasibility, not always on what is safest for health. Enter your ZIP above to see the full violation history and PFAS data for your specific water system.` },
            { q: 'Do I need a water filter?', a: 'Even compliant water can contain contaminants at levels above what independent health scientists consider safe -- particularly for PFAS, lead, and chromium-6. An EPA-certified RO system removes 95-99% of all detected contaminants and costs $0.10-$0.25 per gallon, compared to $1-$3 for bottled water.' },
            { q: "What's the best filter for this area?", a: 'For most US cities, a reverse osmosis system under the sink is the gold standard -- it removes lead, PFAS, arsenic, nitrates, fluoride, and virtually everything else. For renters, a Waterdrop D4 countertop RO requires zero installation. Enter your ZIP above to get personalized recommendations based on your actual water report.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16, padding: '18px 20px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{q}</div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071828, #040d14)', border: '1px solid #0f2d40', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Check your specific address</div>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            City-wide data is just the start. Enter your ZIP to see your exact water system's EPA report, PFAS levels, and violation history.
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0891b2,#06b6d4)', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px #0891b244' }}>
            Check My Water Free →
          </Link>
        </div>

        {/* Other cities */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 14 }}>OTHER CITIES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(CITIES).filter(([k]) => k !== params.city).map(([slug, c]) => (
              <Link key={slug} href={`/water/${slug}`} style={{ padding: '5px 12px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 6, fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
                {c.name}, {c.state}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
