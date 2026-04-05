import { NextRequest, NextResponse } from 'next/server';

const BREVO = 'https://api.brevo.com/v3';

type BrevoContact = { email: string; signupAt?: string };

async function fetchBrevoListContacts(apiKey: string, listId: number): Promise<BrevoContact[]> {
  const contacts: BrevoContact[] = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const res = await fetch(`${BREVO}/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`, {
      headers: { 'api-key': apiKey },
    });
    if (!res.ok) break;
    const data = await res.json() as { contacts: { email: string; emailBlacklisted?: boolean; attributes?: Record<string, string> }[]; count: number };
    const active = (data.contacts || []).filter(c => c.email && !c.emailBlacklisted);
    contacts.push(...active.map(c => ({ email: c.email, signupAt: c.attributes?.SIGNUP_AT })));
    if (contacts.length >= data.count || active.length < limit) break;
    offset += limit;
  }
  return contacts;
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

type Product = { name: string; tag: string; why: string; search: string };
type Issue = { subject: string; headline: string; intro: string; sections: { color: string; title: string; body: string }[]; action: string; products: Product[] };

const ISSUES: Issue[] = [
  {
    subject: "The invisible lead risk in your home's water",
    headline: "Lead: the contaminant hiding in plain sight",
    intro: "Lead contamination rarely comes from the water source — it comes from the pipes and fixtures inside your home. Even if your utility reports clean water, it can pick up lead on the way to your tap.",
    sections: [
      { color: "#dc2626", title: "Why it matters", body: "There is no safe level of lead exposure. It causes irreversible cognitive damage in children and is linked to hypertension and kidney disease in adults. The CDC says no blood lead level is safe for children." },
      { color: "#ea580c", title: "Who is most at risk", body: "Homes built before 1986 are most likely to have lead solder or pipes. Renters in older apartment buildings often have no idea what's in their plumbing. Low-income communities are disproportionately affected." },
      { color: "#ca8a04", title: "What actually removes it", body: "Only NSF/ANSI 53-certified filters are verified to remove lead. Pitcher filters like Brita Standard do not remove lead. Look for reverse osmosis or solid carbon block filters with NSF 53 certification." },
    ],
    action: "Check if your ZIP has lead violations on record",
    products: [
      { name: "Aquasana Under-Sink Filter System", tag: "NSF 42, 53 & 401 · solid carbon block", why: "Certified to remove lead, PFAS, chlorine, and pharmaceuticals. Solid carbon block design is highly effective for lead — more so than granular carbon.", search: "Aquasana under-sink water filter system" },
      { name: "Clearly Filtered Water Pitcher", tag: "NSF 53 · removes lead 99.5%+", why: "One of the few pitcher filters independently certified to remove lead. Also removes PFAS, chlorine, and hundreds of other contaminants.", search: "Clearly Filtered Water Pitcher" },
      { name: "ZeroWater 5-Stage Pitcher", tag: "NSF 53 · reduces lead & chromium", why: "5-stage ion exchange filtration brings TDS (total dissolved solids) to near zero. NSF 53 certified for lead and chromium reduction. Includes a free TDS meter.", search: "ZeroWater 5 stage pitcher filter" },
      { name: "PUR PLUS Faucet Mount Filter", tag: "NSF 53 · easy installation", why: "Mounts directly to your faucet and is NSF 53 certified for lead reduction. One of the most affordable certified options — no pitcher needed.", search: "PUR PLUS faucet mount water filter" },
    ],
  },
  {
    subject: "PFAS: why 'forever chemicals' are still in most tap water",
    headline: "Forever chemicals — and why they don't go away",
    intro: "PFAS (per- and polyfluoroalkyl substances) have been used in manufacturing since the 1940s. They're in non-stick pans, food packaging, firefighting foam — and now in the drinking water of millions of Americans.",
    sections: [
      { color: "#7c3aed", title: "What makes them dangerous", body: "PFAS accumulate in the body over time. Long-term exposure is linked to kidney and testicular cancer, thyroid disease, immune dysfunction, and adverse pregnancy outcomes. They don't break down in the environment or in your body." },
      { color: "#ea580c", title: "Where they come from", body: "Military bases and airports that used PFAS-containing firefighting foam are the most common sources. Industrial sites, wastewater treatment plants, and landfills also contribute. Many water systems near these sites are contaminated." },
      { color: "#059669", title: "How to protect yourself", body: "Activated carbon filters (NSF 58 certified) and reverse osmosis systems are the most effective at removing PFAS. Boiling does not remove PFAS — it concentrates them. Check your utility's annual report for PFAS testing results." },
    ],
    action: "See if PFAS have been detected in your water system",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Tankless design · fast flow rate", why: "Modern tankless design with no bulky storage tank. NSF 58 certified, removes PFAS and lead, and has a 3:1 pure-to-drain ratio — much less water waste than traditional RO systems.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "APEC Water ROES-50 Reverse Osmosis System", tag: "NSF 58 · removes PFAS, lead, arsenic", why: "A top-rated under-sink RO system that removes PFAS, lead, arsenic, nitrates, and hundreds of other contaminants. RO is the gold standard for PFAS — no pitcher filter comes close.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "iSpring RCC7 Under-Sink RO System", tag: "NSF 58 · 5-stage filtration", why: "A reliable and widely reviewed 5-stage RO system at a lower price point. Removes PFAS, lead, nitrates, arsenic, and fluoride. Good value for comprehensive protection.", search: "iSpring RCC7 reverse osmosis system" },
      { name: "Clearly Filtered Water Pitcher", tag: "NSF 244 · removes PFAS 99%+", why: "The most effective pitcher filter for PFAS removal, independently tested to remove PFOA, PFOS, and other PFAS compounds by 99%+. A no-installation option for renters.", search: "Clearly Filtered Water Pitcher PFAS" },
    ],
  },
  {
    subject: "The hidden byproducts of 'safe' treated water",
    headline: "Disinfection byproducts: the tradeoff in treated water",
    intro: "Utilities add chlorine or chloramine to kill bacteria — which is a good thing. But when these disinfectants react with naturally occurring organic matter in water, they form a class of chemicals called disinfection byproducts (DBPs).",
    sections: [
      { color: "#dc2626", title: "The most common DBPs", body: "Trihalomethanes (THMs) and haloacetic acids (HAAs) are the most studied DBPs. Long-term exposure is associated with bladder cancer, colorectal cancer, and adverse birth outcomes including low birth weight and neural tube defects." },
      { color: "#ca8a04", title: "Are they regulated?", body: "Yes — but the EPA's limits were set decades ago and many researchers believe they're not protective enough. Utilities test for DBPs but averages can mask spikes that occur seasonally when organic matter is highest." },
      { color: "#0891b2", title: "How to reduce exposure", body: "Activated carbon filters (NSF 42 or 53 certified) effectively reduce THMs and HAAs. Letting water sit uncovered in the fridge for a few hours also allows some volatile DBPs to off-gas. Reverse osmosis removes them almost entirely." },
    ],
    action: "Check your utility's THM and HAA5 levels",
    products: [
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · removes DBPs completely", why: "For those who want the most thorough protection, RO removes virtually all disinfection byproducts. This is the most complete solution if DBPs are a concern in your area.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Aquasana Countertop Water Filter", tag: "NSF 42 & 53 · no installation needed", why: "Sits on your counter and connects to your faucet. Certified to reduce chlorine, chloramine, DBPs, lead, and PFAS. A strong mid-range option with no under-sink installation required.", search: "Aquasana countertop water filter" },
      { name: "Clearly Filtered Water Pitcher", tag: "Removes 99%+ chlorine & DBPs", why: "Independently tested to remove THMs and HAAs along with lead, PFAS, and fluoride. One of the most comprehensive pitcher filters on the market.", search: "Clearly Filtered Water Pitcher" },
      { name: "Brita Longlast+ Filter Pitcher", tag: "NSF 42 & 53 · reduces chlorine & DBPs", why: "The Longlast+ cartridge is NSF 53 certified and reduces chlorine, chloramine, and DBPs. Lasts 6 months vs. 2 for standard filters — better value and more effective.", search: "Brita Longlast+ pitcher filter" },
    ],
  },
  {
    subject: "Nitrates in drinking water: the farm runoff no one talks about",
    headline: "Nitrates: an invisible agricultural byproduct in your water",
    intro: "Nitrates enter water supplies through fertilizer runoff, livestock waste, and septic systems. They're colorless, odorless, and tasteless — and they're one of the most common groundwater contaminants in rural and agricultural areas.",
    sections: [
      { color: "#dc2626", title: "The infant risk", body: "High nitrate levels cause 'blue baby syndrome' (methemoglobinemia) in infants under 6 months, where the blood loses its ability to carry oxygen. It can be fatal. The EPA limit is 10 mg/L — but some researchers argue that's still too high." },
      { color: "#ea580c", title: "Adult health concerns", body: "Emerging research links long-term nitrate exposure to colorectal cancer and thyroid dysfunction in adults. These associations exist even at levels below the current EPA limit." },
      { color: "#ca8a04", title: "Critical: don't boil it", body: "Boiling water does NOT remove nitrates — it makes the concentration worse as water evaporates. The only effective removal methods are reverse osmosis, ion exchange, and distillation." },
    ],
    action: "Run your local water report to check nitrate levels",
    products: [
      { name: "Home Master TMAFC-ERP RO System", tag: "Remineralizes after filtering", why: "Removes nitrates and then adds beneficial minerals back in through a remineralization stage. Addresses the common complaint that RO water tastes flat.", search: "Home Master TMAFC-ERP reverse osmosis" },
      { name: "APEC Water ROES-50 RO System", tag: "NSF 58 · 5-stage under-sink", why: "Another top-rated RO option with consistent reviews for nitrate removal. Easy DIY installation with detailed instructions included.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "iSpring RCC7 Under-Sink RO System", tag: "NSF 58 · removes nitrates, lead, PFAS", why: "RO is the only reliably effective method for removing nitrates. The RCC7 is a highly rated 5-stage system that handles nitrates, lead, arsenic, and PFAS. Do not use a carbon filter for nitrates — it won't work.", search: "iSpring RCC7 reverse osmosis system" },
      { name: "Express Water RO5DX RO System", tag: "Budget-friendly · 5-stage RO", why: "A lower-cost entry point into reverse osmosis filtration. Removes nitrates, lead, and PFAS. Good option for renters who want RO protection without a large upfront investment.", search: "Express Water RO5DX reverse osmosis system" },
    ],
  },
  {
    subject: "Microplastics in tap water: what we know so far",
    headline: "Microplastics: the contaminant science is still catching up to",
    intro: "A 2017 study found microplastics in 83% of tap water samples worldwide. Researchers are still working to understand the full health implications — but the plastics are definitely there.",
    sections: [
      { color: "#7c3aed", title: "How they get in", body: "Microplastics enter water from plastic pipes, bottle caps, clothing fibers, and industrial runoff. Conventional water treatment was not designed to remove particles this small, and most utilities don't test for them." },
      { color: "#dc2626", title: "What the research shows", body: "Studies have found microplastics in human blood, lung tissue, and placentas. While direct causation is hard to establish, microplastics can carry toxic chemicals including heavy metals and pesticides into the body." },
      { color: "#059669", title: "Reducing your exposure", body: "Reverse osmosis filters with membranes fine enough to block particles smaller than 1 micron are the most effective option. Avoiding single-use plastic bottles also reduces exposure since plastic leaches into the water inside them." },
    ],
    action: "See what contaminants are detected in your water system",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Sub-micron membrane · blocks microplastics", why: "RO membranes block particles down to 0.0001 microns — far smaller than microplastics. The G3's tankless design also means no stagnant water sitting in a storage tank.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "Berkey Travel Water Filter", tag: "Gravity filter · removes microplastics & bacteria", why: "Berkey's black filter elements remove microplastics, bacteria, viruses, and heavy metals without electricity or water pressure. Works anywhere — no installation required.", search: "Berkey Travel Water Filter" },
      { name: "Clearly Filtered Water Pitcher", tag: "Tested for microplastic reduction", why: "Independently tested to reduce microplastics along with PFAS, lead, and fluoride. One of the most thoroughly tested pitcher filters available.", search: "Clearly Filtered Water Pitcher microplastics" },
      { name: "LifeStraw Home Pitcher", tag: "Hollow fiber + carbon · removes microplastics", why: "Uses hollow fiber membrane filtration to physically block microplastics and bacteria, plus activated carbon for chlorine and taste. A solid pitcher option that goes beyond standard carbon-only filters.", search: "LifeStraw Home water filter pitcher" },
    ],
  },
  {
    subject: "Arsenic in drinking water: a natural risk that's still widespread",
    headline: "Arsenic: naturally occurring, quietly dangerous",
    intro: "Arsenic occurs naturally in rock and soil, and dissolves into groundwater — especially in the western US, New England, and the upper Midwest. It's also a byproduct of mining and industrial activity.",
    sections: [
      { color: "#dc2626", title: "The health risk", body: "Long-term arsenic exposure is linked to bladder, lung, and skin cancers. It's also associated with cardiovascular disease, diabetes, and neurological effects in children. The EPA limit is 10 ppb — but the WHO and many scientists say 1 ppb would be safer." },
      { color: "#ea580c", title: "Well water users beware", body: "If you use a private well, you are responsible for testing it yourself. The EPA's arsenic standard does not apply to private wells. Many rural homeowners have never tested their well water for arsenic." },
      { color: "#0891b2", title: "Effective removal", body: "Reverse osmosis removes arsenic effectively. So does activated alumina and iron-based filtration. Standard carbon filters do not remove arsenic. Make sure your filter is NSF 58 certified for arsenic reduction." },
    ],
    action: "Check if arsenic has been detected in your area",
    products: [
      { name: "Aquasana OptimH2O RO + Remineralization", tag: "NSF 58 & 177 · whole-system certified", why: "A premium RO system certified to remove arsenic, PFAS, lead, and chromium-6. The remineralization stage adds calcium, magnesium, and potassium back into the filtered water.", search: "Aquasana OptimH2O reverse osmosis remineralization" },
      { name: "APEC Water ROES-PH75 RO + Alkaline System", tag: "NSF 58 · removes arsenic + remineralizes", why: "Removes arsenic, PFAS, lead, and nitrates through RO, then adds beneficial minerals back through a remineralization stage. Addresses the flat taste common with standard RO water.", search: "APEC ROES-PH75 reverse osmosis alkaline system" },
      { name: "iSpring RCC7AK RO + Alkaline System", tag: "NSF 58 · 6-stage with remineralization", why: "6-stage RO system with an alkaline remineralization filter. Certified for arsenic, lead, and PFAS removal while restoring a balanced pH and mineral content.", search: "iSpring RCC7AK reverse osmosis alkaline system" },
      { name: "APEC ROES-50 RO System", tag: "Budget-friendly arsenic removal", why: "If remineralization isn't a priority, the ROES-50 is a proven, affordable under-sink RO system that effectively removes arsenic along with lead, PFAS, and nitrates.", search: "APEC ROES-50 reverse osmosis system" },
    ],
  },
  {
    subject: "How to actually read your water utility's annual report",
    headline: "Your utility's annual report: what the numbers mean",
    intro: "Every year, your water utility is required by law to send you a Consumer Confidence Report (CCR). Most people throw it away. Here's how to read it in under 5 minutes.",
    sections: [
      { color: "#0891b2", title: "Find the contaminant table", body: "The CCR includes a table listing contaminants detected, their levels, and the EPA's Maximum Contaminant Level (MCL). If a contaminant shows 'ND' (not detected), that's good. Look for anything approaching or exceeding the MCL." },
      { color: "#ca8a04", title: "Watch out for averages", body: "Utilities report annual averages. A low annual average can hide seasonal spikes — especially for disinfection byproducts, which peak in summer when organic matter is highest. Ask your utility for quarterly data if you're concerned." },
      { color: "#7c3aed", title: "Violations vs. detections", body: "A detection means a contaminant was found. A violation means the level exceeded the legal limit. Utilities are required to notify you of violations — but not all contaminants have legal limits yet (like PFAS until recently)." },
    ],
    action: "Run your free WaterCheckup report to see your utility's data",
    products: [
      { name: "Safe Home COMPLETE Water Quality Test Kit", tag: "Tests 200+ contaminants", why: "One of the most comprehensive DIY water test kits available. Tests for 200+ parameters including heavy metals, pesticides, bacteria, and PFAS. Results from a certified lab in about a week.", search: "Safe Home COMPLETE water quality test kit" },
      { name: "WaterCheck by National Testing Laboratories", tag: "City water test · 93 contaminants", why: "A well-established lab testing service covering 93 contaminants including lead, nitrates, bacteria, and disinfection byproducts. Comes with a detailed interpretation guide.", search: "WaterCheck National Testing Laboratories city water test" },
      { name: "Tap Score Advanced City Water Test", tag: "Lab-certified · 111 contaminants", why: "Send a water sample to a certified lab and get a detailed report with contaminant levels and personalized filter recommendations. The best way to know exactly what's in your specific tap water.", search: "Tap Score Advanced City Water Test" },
      { name: "Varify 17-in-1 Water Test Strips", tag: "Instant results · quick screening", why: "Not as thorough as lab testing, but useful for a quick screen of your water's pH, hardness, chlorine, lead, and nitrate levels. Good starting point before investing in a lab test or filter.", search: "Varify 17 in 1 water test strips" },
    ],
  },
  {
    subject: "Which water filter actually works for your situation?",
    headline: "Water filters: cutting through the marketing to what actually works",
    intro: "The water filter market is full of bold claims. Here's what the certifications actually mean and how to match a filter to the specific contaminants in your water.",
    sections: [
      { color: "#059669", title: "NSF certifications matter", body: "NSF/ANSI 42 covers aesthetic contaminants like chlorine taste and odor. NSF/ANSI 53 covers health-related contaminants like lead and VOCs. NSF/ANSI 58 covers reverse osmosis systems. Always verify the specific contaminants a filter is certified to reduce — not just the standard number." },
      { color: "#0891b2", title: "Pitcher filters: limited protection", body: "Standard Brita and PUR pitchers (without specific certified cartridges) reduce chlorine taste but do not remove lead, PFAS, nitrates, or arsenic. Brita's Longlast+ filter is NSF 53 certified for lead. Read the label carefully." },
      { color: "#ea580c", title: "Reverse osmosis: the most comprehensive", body: "Under-sink RO systems with NSF 58 certification remove the widest range of contaminants including lead, PFAS, nitrates, arsenic, and microplastics. They waste 3-4 gallons of water per gallon filtered. Remineralization filters can add back beneficial minerals." },
    ],
    action: "See what contaminants are in your water to choose the right filter",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Modern design · low water waste", why: "A premium tankless RO system with a 3:1 pure-to-drain ratio and fast flow rate. NSF certified and a good fit for households that want RO performance in a sleeker package.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · most comprehensive filtration", why: "The highest level of protection available for home use. Removes virtually everything — lead, PFAS, nitrates, arsenic, microplastics, and DBPs. Best choice if your water has multiple concerns.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Aquasana 3-Stage Under-Sink Filter", tag: "NSF 42, 53 & 401 · broad-spectrum", why: "Certified for lead, PFAS, chlorine, and pharmaceuticals. A strong middle ground — more effective than a pitcher, easier than a full RO system, and doesn't waste water.", search: "Aquasana 3-stage under-sink water filter" },
      { name: "Clearly Filtered Water Pitcher", tag: "Best pitcher for comprehensive protection", why: "Removes 270+ contaminants including lead, PFAS, fluoride, and DBPs. The most thorough pitcher filter if you want real protection without any installation.", search: "Clearly Filtered Water Pitcher" },
    ],
  },
  {
    subject: "Chromium-6 in drinking water: what California knows that the rest of the country doesn't",
    headline: "Chromium-6: the contaminant that sparked a landmark lawsuit",
    intro: "Chromium-6 (hexavalent chromium) was made famous by Erin Brockovich. Despite that, millions of Americans still drink water with chromium-6 levels above what scientists consider safe — and the EPA's current limit was set for total chromium, not the more toxic hexavalent form.",
    sections: [
      { color: "#dc2626", title: "Why it's more dangerous than the limit suggests", body: "The EPA's MCL for total chromium is 100 ppb. But the California Office of Environmental Health Hazard Assessment set a public health goal of 0.02 ppb for chromium-6 specifically — 5,000 times stricter. Most utilities reporting compliance are still far above California's science-based threshold." },
      { color: "#ea580c", title: "Where it comes from", body: "Chromium-6 occurs naturally in some rock formations and also enters water from industrial discharge, especially from steel and pulp mills, electroplating facilities, and sites where it was used as a corrosion inhibitor in cooling towers." },
      { color: "#059669", title: "How to remove it", body: "Reverse osmosis (NSF 58 certified) removes chromium-6 effectively. Strong base anion exchange filters also work. Standard carbon filters and most pitcher filters do not remove chromium-6." },
    ],
    action: "Check your utility's chromium levels in your local report",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Removes chromium-6 · tankless design", why: "NSF 58 certified RO system that removes chromium-6, PFAS, lead, and arsenic. Tankless design means no bulky storage tank and faster flow.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · trusted chromium-6 removal", why: "A top-rated under-sink RO system consistently reviewed for effective chromium-6 removal along with lead, PFAS, nitrates, and arsenic.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Aquasana OptimH2O RO + Remineralization", tag: "NSF 58 & 177 · certified for chromium-6", why: "Specifically NSF certified for chromium-6 reduction along with PFAS and lead. The remineralization stage adds minerals back in after filtering.", search: "Aquasana OptimH2O reverse osmosis remineralization" },
      { name: "iSpring RCC7 Under-Sink RO System", tag: "Budget-friendly · 5-stage RO", why: "An affordable entry into RO filtration. Effectively removes chromium-6, lead, PFAS, and nitrates at a lower price point than premium systems.", search: "iSpring RCC7 reverse osmosis system" },
    ],
  },
  {
    subject: "Hard water: when your water has too many minerals",
    headline: "Hard water and minerals: not always the enemy you think",
    intro: "Hard water is water with high concentrations of calcium and magnesium. It's not a health risk — but it damages appliances, leaves scale on fixtures, and can affect how water tastes. Understanding it helps you decide whether softening is worth it.",
    sections: [
      { color: "#0891b2", title: "What hard water actually is", body: "Water hardness is measured in grains per gallon (GPG) or milligrams per liter. Anything above 7 GPG is considered hard. The US average is about 10 GPG. If you see white scale on your faucets or shower doors, you have hard water." },
      { color: "#ca8a04", title: "The appliance and plumbing impact", body: "Scale buildup from hard water reduces water heater efficiency by up to 29%, clogs pipes over time, shortens the life of dishwashers and washing machines, and leaves spots on dishes and glassware. The cost of hard water damage adds up significantly over years." },
      { color: "#7c3aed", title: "Softening vs. filtering: the difference", body: "Water softeners replace calcium and magnesium with sodium through ion exchange — they soften water but don't filter contaminants. If you have hard water AND contaminants like lead or PFAS, you need both a softener and a filter. RO systems also remove hardness minerals." },
    ],
    action: "Check your water hardness and mineral levels",
    products: [
      { name: "Springwell Salt-Based Water Softener", tag: "Whole-home · eliminates scale buildup", why: "A highly rated whole-home salt-based water softener that removes hardness minerals throughout your entire plumbing system. Protects appliances, pipes, and fixtures from scale.", search: "Springwell salt based water softener system" },
      { name: "Pelican Water Softener + Filter Combo", tag: "Softens + filters in one system", why: "Combines salt-based softening with carbon filtration to handle both hardness and chlorine/chloramine. A good all-in-one option for households with both issues.", search: "Pelican water softener filter combo system" },
      { name: "iSpring RCC7 Under-Sink RO System", tag: "RO removes hardness minerals", why: "Reverse osmosis removes calcium and magnesium along with contaminants — effective for drinking water even without a whole-home softener.", search: "iSpring RCC7 reverse osmosis system" },
      { name: "Varify 17-in-1 Water Test Strips", tag: "Tests water hardness instantly", why: "Before buying a softener, confirm your hardness level. These strips give instant results for hardness, pH, chlorine, and other parameters.", search: "Varify 17 in 1 water test strips hardness" },
    ],
  },
  {
    subject: "Private well water: what 43 million Americans need to test for",
    headline: "Well water safety: you're your own utility",
    intro: "43 million Americans rely on private wells. Unlike public water, well water is not regulated or tested by the EPA. If you use a well — or are considering buying a home with one — you are entirely responsible for knowing what's in it.",
    sections: [
      { color: "#dc2626", title: "What the EPA doesn't cover", body: "The Safe Drinking Water Act does not apply to private wells. Your utility doesn't test your water. Your state may have guidelines, but enforcement is rare. Most well owners have never tested their water — and many have contaminants they don't know about." },
      { color: "#ea580c", title: "The most common well water contaminants", body: "Bacteria (coliform, E. coli), nitrates from agricultural runoff, arsenic from natural rock formations, radon, iron, manganese, hardness minerals, and — increasingly — PFAS from nearby industrial or military sites. The contaminant profile depends heavily on your geography and surroundings." },
      { color: "#059669", title: "How often to test", body: "The CDC recommends testing well water at least once a year for bacteria and nitrates. Test immediately after flooding, nearby land use changes, or if your water changes in taste, smell, or appearance. Test for a comprehensive panel before buying a home with a well." },
    ],
    action: "Find a certified lab to test your well water",
    products: [
      { name: "Tap Score Well Water Test — Advanced", tag: "Lab-certified · 100+ well contaminants", why: "A comprehensive lab test specifically designed for well water. Tests for bacteria, nitrates, arsenic, heavy metals, PFAS, and dozens of other common well contaminants. Results in about a week.", search: "Tap Score well water advanced test" },
      { name: "Safe Home WELL Water Quality Test Kit", tag: "200+ parameters · certified lab", why: "One of the most thorough well water test kits available. Covers bacteria, metals, pesticides, VOCs, and more. Good choice for a first-time comprehensive baseline test.", search: "Safe Home well water quality test kit" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "Broad-spectrum well water filtration", why: "RO handles the wide range of contaminants common in well water — arsenic, nitrates, bacteria byproducts, iron, and PFAS. A reliable under-sink solution for well households.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Berkey Travel Water Filter", tag: "Gravity filter · no electricity needed", why: "For well households without reliable power, Berkey filters work without electricity or water pressure. Removes bacteria, heavy metals, and many chemical contaminants.", search: "Berkey Travel Water Filter well water" },
    ],
  },
  {
    subject: "Water softeners: do you actually need one?",
    headline: "Water softeners: the full picture before you buy",
    intro: "Water softeners are a $3 billion industry. They solve real problems — but they're also oversold. Here's how to know if you actually need one, what type makes sense, and what they don't do.",
    sections: [
      { color: "#0891b2", title: "Salt-based vs. salt-free: a critical distinction", body: "Salt-based ion exchange softeners actually remove hardness minerals and are effective at preventing scale. Salt-free 'conditioners' change the structure of minerals so they don't stick as easily, but don't remove them. For severe hardness, only salt-based systems deliver reliable results." },
      { color: "#ca8a04", title: "The sodium tradeoff", body: "Salt-based softeners add sodium to your water — the harder your water, the more sodium ends up in the softened output. For most people this is a minor amount, but those on sodium-restricted diets should consider a separate RO filter for drinking water, which removes the added sodium." },
      { color: "#7c3aed", title: "What softeners don't do", body: "Softeners do not remove bacteria, nitrates, PFAS, lead, arsenic, or most other health-related contaminants. They treat hardness only. If your water has health concerns beyond hardness, you need a separate filter. A softener + under-sink RO is the most complete combination." },
    ],
    action: "Check your water hardness to see if a softener is worth it",
    products: [
      { name: "Springwell Salt-Based Water Softener System", tag: "Whole-home · high-capacity softening", why: "A top-rated whole-home salt-based softener with a smart control valve and high grain capacity. Effective for moderate to very hard water. Lifetime warranty on the tank.", search: "Springwell salt based water softener" },
      { name: "Fleck 5600SXT Water Softener", tag: "Industry standard · 48,000 grain", why: "The most widely reviewed residential water softener on the market. Reliable, well-supported, and available in multiple grain capacities. A workhorse system trusted by plumbers.", search: "Fleck 5600SXT water softener 48000 grain" },
      { name: "Pelican NaturSoft Salt-Free Conditioner", tag: "Salt-free · no sodium added", why: "If you want scale prevention without adding sodium to your water, the NaturSoft conditions minerals without removing them. Best for moderate hardness or sodium-sensitive households.", search: "Pelican NaturSoft salt free water conditioner" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "Removes softener sodium from drinking water", why: "If you have a salt-based softener, pair it with an under-sink RO for drinking water to remove the added sodium along with any remaining contaminants.", search: "APEC ROES-50 reverse osmosis system" },
    ],
  },
  {
    subject: "Fluoride in drinking water: what the science actually says",
    headline: "Fluoride: separating the science from the debate",
    intro: "Fluoride has been added to US drinking water since 1945. It reduces tooth decay — that's well established. But at what concentration, and is there a tradeoff? Recent research has reopened the debate in ways worth understanding.",
    sections: [
      { color: "#0891b2", title: "The case for fluoridation", body: "The CDC lists water fluoridation as one of the 10 great public health achievements of the 20th century. Studies consistently show it reduces cavities by 25% in children and adults. The current recommended level is 0.7 mg/L — reduced from 1.2 mg/L in 2015 based on newer research." },
      { color: "#ea580c", title: "The emerging concerns", body: "A 2020 meta-analysis and a 2023 NTP review found associations between fluoride exposure above 1.5 mg/L and lower IQ scores in children. The EPA's current legal limit is 4 mg/L. Many researchers argue the margin between the recommended level and potentially harmful levels is narrower than previously thought." },
      { color: "#7c3aed", title: "If you want to reduce your exposure", body: "Reverse osmosis systems remove fluoride — standard carbon filters and most pitcher filters do not. If you have young children and want to minimize their fluoride intake from drinking water, an RO system under the sink is the most reliable option." },
    ],
    action: "Check your utility's fluoride levels in your local report",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Removes fluoride · modern design", why: "RO effectively removes fluoride along with PFAS, lead, nitrates, and arsenic. The G3's tankless design is one of the most space-efficient RO systems available.", search: "Waterdrop G3 tankless reverse osmosis fluoride" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · removes fluoride", why: "A proven under-sink RO system that removes fluoride to near-undetectable levels. One of the most trusted RO systems for comprehensive contaminant removal.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Clearly Filtered Water Pitcher", tag: "NSF certified · reduces fluoride 99%+", why: "One of the very few pitcher filters independently certified to remove fluoride. Most pitchers do not remove fluoride — this one does, along with PFAS, lead, and DBPs.", search: "Clearly Filtered Water Pitcher fluoride" },
      { name: "Home Master TMAFC-ERP RO System", tag: "RO + remineralization · removes fluoride", why: "Removes fluoride through RO then adds beneficial minerals back in. A good choice for those who want fluoride reduction without losing all the minerals in their water.", search: "Home Master TMAFC-ERP reverse osmosis remineralization" },
    ],
  },
  {
    subject: "Bottled water vs. tap water: the real comparison",
    headline: "Bottled water: is it actually safer than your tap?",
    intro: "Americans spend $16 billion a year on bottled water. But bottled water is regulated less strictly than tap water, tested less frequently, and often comes from municipal sources anyway. Here's what the labels don't tell you.",
    sections: [
      { color: "#dc2626", title: "Bottled water is less regulated than tap", body: "The EPA regulates tap water under the Safe Drinking Water Act with strict testing requirements and public disclosure. The FDA regulates bottled water, but exempts water bottled and sold within the same state, requires testing far less frequently, and does not require public reporting of results." },
      { color: "#ea580c", title: "What's actually in the bottle", body: "Studies have found microplastics in 93% of bottled water brands tested. Phthalates and other plastic chemicals leach into water over time, especially when bottles are exposed to heat. Several major brands — including Dasani and Aquafina — are simply filtered municipal tap water." },
      { color: "#059669", title: "The environmental cost", body: "Producing a single plastic water bottle requires 3x the water it contains. Less than 30% of plastic bottles are recycled. The energy cost of bottled water is up to 2,000 times that of tap water. A quality home filter pays for itself within weeks compared to a bottled water habit." },
    ],
    action: "See what's in your tap water — it may be better than you think",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "Best tap water upgrade · replaces bottles", why: "The most complete replacement for bottled water. Produces clean, great-tasting water at a fraction of the cost — and without the plastic waste or microplastic contamination.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · cleaner than most bottled water", why: "Under-sink RO produces water cleaner than the vast majority of bottled water brands at about $0.01 per gallon vs. $1-2 per bottle.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Clearly Filtered Water Pitcher", tag: "No installation · removes 270+ contaminants", why: "A highly effective pitcher filter that removes more contaminants than most bottled water. Easy entry point for switching away from single-use plastic bottles.", search: "Clearly Filtered Water Pitcher" },
      { name: "Berkey Travel Water Filter", tag: "Gravity filter · great for on the go", why: "For those who rely on bottled water when traveling or during emergencies, a Berkey provides clean water anywhere without plastic waste.", search: "Berkey Travel Water Filter" },
    ],
  },
  {
    subject: "Radon in drinking water: the risk beneath your home",
    headline: "Radon in water: the invisible radioactive risk",
    intro: "Most people know radon as a gas that seeps into basements. But radon also dissolves into groundwater — particularly in well water in granite-heavy regions like New England, the Appalachians, and parts of the Mountain West. When you run a tap or take a shower, that radon is released into the air you breathe.",
    sections: [
      { color: "#dc2626", title: "How it gets into your water", body: "Radon is a naturally occurring radioactive gas produced by the decay of uranium in rock and soil. It dissolves into groundwater as water moves through radon-bearing rock. Municipal water systems that use surface water (rivers, lakes) are rarely affected — but well water users in affected regions face significant risk." },
      { color: "#7c3aed", title: "The health risk", body: "Radon in water contributes to lung cancer risk primarily through inhalation when the gas is released during showering, dishwashing, or laundry. The EPA estimates radon in water causes about 168 cancer deaths per year. The proposed EPA limit is 300 pCi/L, though many scientists argue for 100 pCi/L." },
      { color: "#059669", title: "Testing and treatment", body: "A standard home water test does not include radon. You need a specific radon-in-water test from a certified lab. Treatment options include aeration systems (most effective) and granular activated carbon filters. If you have well water in a high-radon region, testing is strongly recommended." },
    ],
    action: "Check if your region is high-risk for radon in water",
    products: [
      { name: "National Radon Hotline Water Test Kit", tag: "EPA-certified · radon in water test", why: "A certified lab test specifically for radon in water. If you're on well water in New England, Appalachia, or the Mountain West, this is a critical test to run.", search: "radon in water test kit certified lab" },
      { name: "Tap Score Well Water Advanced Test", tag: "Comprehensive well test including radon", why: "Tap Score's advanced well water panel includes radon along with arsenic, bacteria, metals, and PFAS. A thorough baseline test for well water households.", search: "Tap Score well water advanced test radon" },
      { name: "Safe Home WELL Water Quality Test Kit", tag: "200+ parameters · includes radioactivity", why: "One of the most comprehensive well water test kits available. Includes testing for radioactive contaminants alongside bacteria, metals, and chemical contaminants.", search: "Safe Home well water quality test kit" },
      { name: "Varify 17-in-1 Water Test Strips", tag: "Quick screening before lab testing", why: "A low-cost first step to check your water's basic parameters. Use before investing in a full lab radon test to understand your overall water quality picture.", search: "Varify 17 in 1 water test strips" },
    ],
  },
  {
    subject: "Water conservation: how to use less without sacrificing quality",
    headline: "Using less water: practical steps that actually make a difference",
    intro: "The average American uses 80-100 gallons of water per day. With droughts intensifying across the western US and water costs rising nationwide, conservation is both an environmental and financial priority. Here's where the real waste happens and how to cut it.",
    sections: [
      { color: "#059669", title: "Where household water really goes", body: "Toilets use about 27% of indoor water. Showers account for 17%. Faucets 15%. Washing machines 22%. Leaks — often invisible — waste an average of 10,000 gallons per household per year. Fixing a dripping faucet or running toilet is often the single highest-impact conservation action." },
      { color: "#0891b2", title: "The outdoor water reality", body: "In many western states, outdoor irrigation accounts for 50-70% of total household water use. Switching to drip irrigation, watering in the early morning, and choosing drought-tolerant plants can reduce outdoor use by 50% or more. Smart irrigation controllers adjust watering schedules based on weather data automatically." },
      { color: "#ca8a04", title: "Water efficiency and quality together", body: "Reverse osmosis systems waste 3-4 gallons per gallon filtered — a real concern in drought regions. Newer tankless RO systems with permeate pumps achieve 1.5:1 or better ratios. If conservation is a priority alongside filtration, look for high-efficiency RO systems or consider a solid carbon block filter instead." },
    ],
    action: "Run your local water report to understand your water supply's health",
    products: [
      { name: "Waterdrop G3 Tankless RO System", tag: "3:1 pure-to-drain ratio · water efficient", why: "One of the most water-efficient RO systems available at 3:1 pure-to-drain. Compared to traditional 1:4 RO systems, it wastes dramatically less water — important in drought-affected regions.", search: "Waterdrop G3 tankless reverse osmosis water efficient" },
      { name: "Rachio 3 Smart Sprinkler Controller", tag: "Cuts outdoor water use 30-50%", why: "Adjusts your irrigation schedule automatically based on local weather, soil type, and plant needs. EPA WaterSense certified. One of the most effective single investments for reducing household water use.", search: "Rachio 3 smart sprinkler controller" },
      { name: "Fluidmaster 400A Universal Toilet Fill Valve", tag: "Stops toilet leaks · easy DIY fix", why: "A running toilet can waste 200 gallons per day. The Fluidmaster 400A is the most widely used toilet fill valve replacement — a $15 fix that can save thousands of gallons per year.", search: "Fluidmaster 400A universal toilet fill valve" },
      { name: "Aquasana 3-Stage Under-Sink Filter", tag: "No water waste · high-efficiency filtration", why: "Unlike RO systems, carbon block filters waste no water during filtration. A good choice for households that want health protection without the water waste trade-off.", search: "Aquasana 3-stage under-sink water filter" },
    ],
  },
];

function weeksSinceEpoch(date: Date): number {
  const epoch = new Date('2024-01-01T00:00:00Z');
  return Math.floor((date.getTime() - epoch.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function getIssueForContact(signupAt: string | undefined): Issue {
  const now = weeksSinceEpoch(new Date());
  const signup = signupAt ? weeksSinceEpoch(new Date(signupAt)) : now;
  const idx = Math.max(0, now - signup) % ISSUES.length;
  return ISSUES[idx];
}

function buildWeeklyHtml(issue: Issue, email: string): string {
  const sectionsHtml = issue.sections.map(s => `
    <div style="background:#f8fafc;border-left:4px solid ${s.color};border-radius:6px;padding:14px 16px;margin-bottom:10px">
      <div style="font-size:14px;font-weight:700;color:${s.color};margin-bottom:4px">${s.title}</div>
      <div style="font-size:13px;color:#475569;line-height:1.6">${s.body}</div>
    </div>`).join('');

  const productsHtml = issue.products.map(p => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(p.search)}`;
    return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:10px">
      <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:3px">${p.name}</div>
      <div style="font-size:11px;color:#0891b2;font-weight:600;margin-bottom:8px">${p.tag}</div>
      <div style="font-size:13px;color:#475569;line-height:1.6;margin-bottom:12px">${p.why}</div>
      <a href="${url}" style="display:inline-block;padding:8px 14px;background:#f59e0b;border-radius:6px;color:#0f172a;text-decoration:none;font-size:12px;font-weight:700">View on Amazon →</a>
    </div>`;
  }).join('');

  return `<!doctype html><html><head><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#f8fafc;color:#1e293b;font-family:Arial,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:32px 24px;background:#ffffff">
    <div style="border-bottom:2px solid #0891b2;padding-bottom:16px;margin-bottom:24px">
      <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">WaterCheckup Weekly</div>
      <div style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:4px">${issue.headline}</div>
    </div>
    <div style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px">${issue.intro}</div>
    ${sectionsHtml}
    <div style="margin-top:24px;margin-bottom:20px;font-size:13px;color:#64748b;line-height:1.7">${issue.action} — your free local report pulls live data from the EPA and your utility.</div>
    <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700">Run my free water report →</a>

    <div style="margin-top:32px;border-top:1px solid #e2e8f0;padding-top:24px">
      <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px">This week's top picks</div>
      <div style="font-size:13px;color:#64748b;margin-bottom:16px">Recommended products for this week's topic</div>
      ${productsHtml}
    </div>

    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.6">You're receiving this because you subscribed at watercheckup.com. We send one email per week, no spam. <a href="https://watercheckup.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#94a3b8">Unsubscribe</a></div>
  </div>
  </body></html>`;
}

export const dynamic = 'force-dynamic';

/**
 * Vercel Cron: Mondays 14:00 UTC (vercel.json). Requires BREVO_API_KEY + BREVO_LIST_IDS.
 * If CRON_SECRET is set, Vercel sends Authorization: Bearer <CRON_SECRET> automatically.
 */
export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const auth = req.headers.get('authorization') || '';
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
      }
    }

    const apiKey = process.env.BREVO_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'BREVO_API_KEY is not configured.' }, { status: 503, headers: CORS });
    }

    const listId = parseInt((process.env.BREVO_LIST_IDS || '5').split(/[,;\s]+/)[0], 10);
    let contacts: BrevoContact[];
    try {
      contacts = await fetchBrevoListContacts(apiKey, listId);
    } catch (e) {
      console.error('[newsletter/weekly] Failed to fetch Brevo contacts:', e);
      return NextResponse.json({ success: false, error: 'Unable to fetch contacts' }, { status: 500, headers: CORS });
    }

    if (!contacts.length) {
      return NextResponse.json({ success: true, sent: 0, total: 0, message: 'No contacts in list yet.' }, { headers: CORS });
    }

    const senderEmail = process.env.BREVO_FROM_EMAIL?.trim() || 'hello@watercheckup.com';
    let sent = 0;
    const failed: string[] = [];
    for (const contact of contacts) {
      const issue = getIssueForContact(contact.signupAt);
      const html = buildWeeklyHtml(issue, contact.email);
      const r = await fetch(`${BREVO}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'WaterCheckup', email: senderEmail },
          to: [{ email: contact.email }],
          subject: issue.subject,
          htmlContent: html,
        }),
      });
      if (r.ok) sent += 1;
      else failed.push(contact.email);
    }

    if (failed.length) {
      console.warn(`[newsletter/weekly] Sent ${sent}/${contacts.length}; failed for: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? '…' : ''}`);
    } else {
      console.log(`[newsletter/weekly] Sent ${sent} weekly email(s).`);
    }

    return NextResponse.json({ success: true, sent, total: contacts.length, failed: failed.length }, { headers: CORS });
  } catch (err: any) {
    console.error('[newsletter/weekly]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}
