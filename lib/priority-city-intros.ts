/** Editorial intros (2–3 paragraphs) for high-traffic city water report pages */
export const PRIORITY_CITY_INTROS: Record<string, readonly string[]> = {
  'san-antonio': [
    'San Antonio draws its drinking water primarily from the Edwards Aquifer — one of the most productive artesian aquifers in the world. That limestone geology is why SAWS water is naturally hard, high in calcium and magnesium, and why radium shows up in routine monitoring. The San Antonio Water System serves over 2 million people, and like all large public water systems, it detects a range of contaminants during required testing. Some are within federal limits; others exceed independent health guidelines even when the utility is in compliance.',
    'At roughly 272 mg/L hardness, San Antonio has some of the hardest tap water of any major US city. In 30 years of field work, I have seen what that does in real homes: scale inside tankless heaters, shortened dishwasher life, soap that barely lathers, and a mineral taste people blame on the utility when it is really dissolved rock in the aquifer. A water softener addresses the whole home; reverse osmosis at the kitchen tap handles drinking water, PFAS, sodium, and radium together.',
    'Disinfection byproducts — trihalomethanes (TTHMs) and haloacetic acids (HAA5) — form when chlorine reacts with organic matter in surface and blended supplies. SAWS is currently below EPA limits on these, but DBP violations in other Texas systems are a reminder that legal compliance is not the same as zero risk. Long-term exposure to DBPs is linked to bladder cancer in epidemiology studies, which is why households with pregnant members, infants, or cancer history often choose NSF 58 reverse osmosis even when the city passes every test.',
  ],
  gaithersburg: [
    'Gaithersburg sits in Montgomery County and is served by WSSC Water — one of the largest suburban utilities on the East Coast, drawing from the Potomac River and Patuxent watersheds. Potomac source water is generally strong, but chloramine disinfection creates disinfection byproducts, and PFAS from upstream land use has shown up in UCMR5 monitoring for the region. Older homes built before 1986 may still have lead solder or brass fixtures that leach after water leaves the plant.',
    'WSSC customers often ask whether suburban Maryland water is "better" than city water. The answer is nuanced: treatment is competent, but your tap depends on building plumbing, service line material, and whether you are on a dead-end main where water age increases DBP formation. I routinely recommend a ZIP-level check before buying filtration — two neighbors on the same street can be on different pressure zones with different monitoring histories.',
    'For Gaithersburg households, the practical split is lead at the tap (building-side risk) versus PFAS and DBPs (utility-side monitoring signals). NSF 53 carbon blocks handle lead in pitchers and faucet filters; PFAS removal requires NSF 58 reverse osmosis or NSF P473-certified pitchers. Under-sink RO covers all three for families staying in the home long term.',
  ],
  'new-york': [
    'New York City\'s tap water has a reputation for quality — but EPA UCMR5 monitoring tells a more complicated story. PFOS was detected at 106 ppt in NYC\'s water system, more than 26 times the EPA\'s legal limit of 4 ppt. PFOA was found at 27.8 ppt and PFHxS at 51.6 ppt. On top of that, buildings constructed before 1986 likely have lead service lines or lead solder inside — a problem the public water system cannot fix from the plant.',
    'NYC\'s watershed protection is among the best in the country; that is why DEP water often tastes good straight from the tap. The gap is between source-water excellence and what happens in your building. Co-op and condo boards, pre-war brownstones, and rent-stabilized units are where I have seen the worst lead surprises — not because the city failed treatment, but because galvanic corrosion between old brass and copper fittings releases lead at the faucet.',
    'Renters in NYC should assume pitcher or faucet filtration unless the landlord has verified lead-free plumbing. Owners in older buildings should pair DEP\'s annual letter with a SimpleLab or certified lab test at the kitchen tap. For PFAS, only reverse osmosis or NSF P473 pitchers are credible; standard Brita does not meet the PFAS standard homeowners need after the 2024 EPA rule.',
  ],
  'los-angeles': [
    'Los Angeles gets its water from three main sources — the Los Angeles Aqueduct, the State Water Project, and the Colorado River — and blends them depending on availability and season. That complexity means the contaminant profile can shift, and what is in your water depends partly on where in the city you live. LA has a well-documented history with chromium-6 and PFAS.',
    'Chromium-6 in LA water is the legacy of natural geology plus industrial history in the San Fernando Valley. California\'s public health goal is far below what EPA requires nationally, which confuses residents who see "compliant" on a utility report while EWG flags the same number in red. I explain it this way: legal limits reflect politics and treatment cost; health goals reflect toxicology.',
    'Hardness in the 250+ mg/L range is common in Southern California imports. Scale is the everyday annoyance; PFAS and DBPs are the long-term drivers for filtration. Under-sink RO is the default recommendation for homeowners. Renters should look at countertop RO or Clearly Filtered-style pitchers if PFAS or lead is confirmed in their ZIP-level report.',
  ],
  houston: [
    'Houston\'s water comes primarily from surface sources — the Trinity and San Jacinto rivers — which are more vulnerable to agricultural runoff, industrial discharge, and storm events than groundwater systems. The city\'s public water system serves one of the largest metro populations in the country, treating millions of gallons daily with chloramine.',
    'Houston\'s industrial corridor is the elephant in the room for PFAS. Facilities that used aqueous firefighting foam and fluorochemical processes have left a fingerprint in Gulf Coast watersheds. UCMR5 data showing PFAS above EPA limits is not an abstract lab result — it is the reason I do not recommend standard pitcher filters for Houston families asking about "forever chemicals."',
    'Trihalomethanes and haloacetic acids are the other Houston headline. Warm surface water plus organic load equals more DBPs when chlorine or chloramine is applied. RO at the drinking tap removes both classes of contaminants; whole-home carbon can reduce DBPs for shower exposure if that is a priority. Always match the filter to what your ZIP report actually flags.',
  ],
  phoenix: [
    'Phoenix relies heavily on the Colorado River, delivered via the Central Arizona Project canal — an open-air system that picks up agricultural runoff, sediment, and other contaminants along its 336-mile route before reaching treatment plants. The city also draws from Salt River Project reservoirs and local groundwater, creating a blended supply that varies by season.',
    'Desert cities fight two battles at once: high TDS/hardness from mineral-rich groundwater and imported surface water, plus emerging contaminants like PFAS that carbon alone may not handle at low parts-per-trillion levels. Phoenix residents often notice white scale on fixtures before they notice any health concern — that scale is calcium carbonate, and it is harmless to drink but expensive for appliances.',
    'Chromium-6 has been debated in Arizona the same way as California. If your report shows elevated chromium-6 relative to health guidelines, reverse osmosis is the residential technology with the clearest removal data. Pair RO with a softener only if hardness is damaging fixtures; otherwise you may be over-buying equipment.',
  ],
  chicago: [
    'Chicago\'s water story is dominated by lead service lines — an estimated 400,000+ lines still connect the water main to Chicago homes. Lake Michigan source water is treated with orthophosphate to reduce lead corrosion, but the physics of old lead pipes means the only guaranteed protection at your tap is filtration or replacement.',
    'Chicago uses chloramine for residual disinfection. That is good for stability across a huge distribution system, but chloramine is harder to remove than free chlorine — standard fridge filters and basic carbon pitchers often fail to touch it. Residents who complain about "chemical taste" are usually reacting to chloramine or DBPs, not bacteria.',
    'PFAS monitoring under UCMR5 has detected compounds in the Lake Michigan supply chain. Lead and PFAS together push my recommendation toward NSF 58 under-sink RO for owner-occupants. Renters should use NSF 53 or P473-certified pitchers and request landlord lead service line status under the city\'s inventory program.',
  ],
  philadelphia: [
    'Philadelphia draws from the Delaware and Schuylkill rivers — excellent sources on paper, but urban runoff, combined sewer overflows, and upstream industry create a heavy DBP challenge. PWD meets federal standards most months, but the margin on trihalomethanes is thinner than customers expect.',
    'Lead service lines remain in roughly one quarter of Philadelphia homes. PWD\'s corrosion control helps, but pregnancy, infants, and children are why EPA moved the lead action level to 0 ppb as a health goal. If you live in pre-1950 housing, assume lead risk until a test proves otherwise.',
    'PFAS from the Delaware basin has appeared in regional UCMR5 data. For Philly\'s combined profile — lead at the tap, PFAS in source monitoring, DBPs from river organics — I rank under-sink RO first, NSF P473 pitcher second for renters. Whole-home systems are optional unless you are also treating hardness from suburban well blends.',
  ],
  dallas: [
    'Dallas Water Utilities pulls from surface reservoirs across North Texas. Warm summers and agricultural return flows mean organic precursors for DBPs are always present. Dallas has logged PFAS detections above new EPA limits in UCMR5 — a significant change from the pre-2024 era when PFAS was unregulated at the federal level.',
    'Chloramine is standard in Dallas distribution. Homeowners who install cheap carbon blocks without chloramine certification are often disappointed. Check NSF 42 certification specifically for chloramine reduction if that is your primary complaint.',
    'Hardness varies by neighborhood depending on whether your blend is reservoir-heavy or groundwater-heavy. Use your ZIP report before buying a softener — many Dallas condos do not need one but still need RO for PFAS. Do not let a salesperson size equipment off city averages alone.',
  ],
  miami: [
    'Miami-Dade Water and Sewer Authority serves nearly 3 million people from the Biscayne Aquifer — productive, but highly vulnerable to surface contamination from septic systems, agriculture, and saltwater intrusion at the coast. PFOS and related PFAS compounds have tested above federal MCLs in UCMR5 monitoring.',
    'Florida utilities rely on chloramine in many counties. DBPs form faster in warm water — Miami\'s climate literally accelerates the chemistry. Shower and kitchen exposure both matter for sensitive individuals, though drinking water volume is still the primary regulatory focus.',
    'Hurricane season introduces temporary boil-water notices and sediment spikes that are not reflected in annual averages. Keep a NSF-certified pitcher or bottled water stash for notices, then return to RO-filtered tap when the utility clears the system. Annual CCR reports never capture those acute events.',
  ],
  seattle: [
    'Seattle Public Utilities sources largely protected watersheds in the Cascades — some of the best raw water in the country. The municipal supply is low in hardness and typically low in PFAS detections compared to industrial regions. The catch is what happens after water enters older buildings.',
    'Seattle\'s lead risk is building-side: pre-1986 construction, galvanized service lines in outlying neighborhoods, and schools with aging fixtures. I have tested Seattle taps that were pristine at the plant and elevated at the kitchen faucet because of a brass fitting.',
    'Chloramine is used across much of the metro. Renters in Capitol Hill or Belltown high-rises should not assume "Seattle water is perfect" without a test. A Clearly Filtered or NSF 53 pitcher is a reasonable default; RO is for confirmed PFAS or high lead, not for every household.',
  ],
  denver: [
    'Denver Water pulls from mountain snowmelt — high quality, moderately hard, and generally low in industrial PFAS compared to coastal cities. Arsenic and radium can appear in blended groundwater supplements depending on the season.',
    'Hardness in Denver is real but not Texas-level. Many residents use pitcher filters for taste alone. If your ZIP report flags PFAS or lead, step up to RO — mountain purity at the source does not protect you from home plumbing.',
    'Wildfire ash runoff into reservoirs is an emerging western issue Denver monitors closely. After major fire seasons, turbidity and organic loads spike DBP formation. Pay attention to utility advisories in late summer, not just the annual water quality report.',
  ],
  boston: [
    'Greater Boston is served by the Massachusetts Water Resources Authority — Quabbin and Wachusett reservoir water that is among the best-treated municipal supplies in the US. MWRA\'s challenge is not source contamination; it is aging service lines and home plumbing in America\'s oldest housing stock.',
    'Lead solder was legal until 1986. Boston\'s triple-deckers and Victorian homes are full of it. MWRA adds corrosion control, but pregnant households should still filter or test. PFAS monitoring has detected low-level compounds — worth watching, but lead remains the primary urban Boston concern.',
    'If you are on MWRA water, start with a lab test or ZIP report, then choose filtration matched to results. RO is powerful but not mandatory for every Boston address the way it is in PFAS-hot cities like Miami or Houston.',
  ],
  milwaukee: [
    'Milwaukee\'s water crisis history makes lead the unavoidable topic. Thousands of lead service lines remain, and Wisconsin\'s freeze-thaw cycle stresses pipe joints that can release particulate lead after disturbances.',
    'Lake Michigan source water is solid, but DBPs and PFAS monitoring still matter under UCMR5. Milwaukee families should check the city\'s lead line replacement map for their block before spending on whole-home systems.',
    'NSF 53 pitchers work for lead in many Milwaukee apartments; homeowners planning line replacement should still filter until the pipe is gone. Replace filters on schedule — lead capture media exhausts faster in high-challenge water.',
  ],
  detroit: [
    'Detroit\'s Great Lakes Water Authority supplies treated lake water, but the city\'s lead service line inventory is among the largest still unfinished in the US. Post-flint awareness means residents are right to be skeptical of "pass" letters without address-level data.',
    'PFAS has appeared in Michigan regional monitoring. Detroit\'s combined story is lead first, PFAS second, DBPs third. Do not buy a filter that only addresses taste and odor if your report flags lead or PFAS.',
    'If you are in a rental, document filter maintenance and ask landlords about line material. Michigan law pushes disclosure, but enforcement varies. A $90 certified pitcher is cheap insurance while waiting for municipal line replacement.',
  ],
  parkersburg: [
    'Parkersburg, WV is the epicenter of America\'s PFAS crisis. For over 50 years, DuPont\'s Washington Works plant discharged PFOA into the Ohio River, contaminating drinking water for tens of thousands of residents. EPA UCMR5 monitoring shows PFOA at 179.5 ppt — 45 times the EPA legal limit of 4 ppt.',
    'HFPO-DA (GenX), DuPont\'s replacement chemistry, was also detected above health advisory levels. Standard pitcher filters are not rated for this load. I only recommend NSF 58 reverse osmosis or proven P473 systems here — and I urge annual retesting because short-chain PFAS breakthrough on old carbon is documented.',
    'If you lived in Parkersburg during the C8 years, medical monitoring and filtration are separate conversations. This page focuses on what is in the water today and what removes it at the tap. The Ohio River remains a transport pathway for upstream discharges.',
  ],
  'sugar-land': [
    'Sugar Land, Texas shows the highest peak PFAS reading of any large Texas water system in EPA UCMR5 monitoring — 672 ppt of 6:2 FTS, a compound not yet covered by the EPA\'s six regulated PFAS limits. PFOA was also detected at 4.1 ppt, at the federal limit for that compound.',
    'The Brazos River corridor and Fort Bend County industrial legacy are the likely sources. 6:2 FTS is a short-chain replacement chemical; carbon filters that worked on legacy PFOA may not perform the same on these molecules. RO is the conservative engineering choice.',
    'Sugar Land is an affluent suburb where I see a lot of whole-home softeners without RO at the kitchen. Softening does not touch PFAS. If your report shows FTS family compounds, prioritize drinking-water RO before upgrading shower filters.',
  ],
  fresno: [
    'Fresno sits in California\'s San Joaquin Valley, where agricultural runoff and legacy pesticides have long complicated drinking water. EPA UCMR5 monitoring detected PFAS with PFOS, PFOA, and PFHxS above federal limits in City of Fresno water.',
    'Nitrate from fertilizer is a parallel valley issue — separate from PFAS but equally important for private wells nearby. City water is monitored; rural fringe wells may not be. Know which PWSID serves your address.',
    'RO removes both nitrate and PFAS at the tap. Pitcher filters are inadequate for Fresno\'s PFAS profile. Many families also deal with hardness from groundwater blends — softener plus RO is a common dual setup in Central Valley homes.',
  ],
  austin: [
    'Austin\'s water comes from the Colorado River and the Highland Lakes — beautiful sources that still pick up PFAS and disinfection byproducts on the way to your tap. EPA UCMR5 data shows PFOS above the 4 ppt legal limit in Austin Water monitoring.',
    'Austin\'s growth means new neighborhoods may be on different treatment blends than central city zones. Do not assume your coworker\'s test results apply to your suburb — check your ZIP.',
    'Chloramine and Texas heat produce DBPs in summer peaks. Music City and tech transplants often ask for "what filter tech employees use" — the answer is usually NSF 58 RO under the sink, not trendy alkaline machines without certifications.',
  ],
  'fairfax-county': [
    'Fairfax County is one of the largest suburban counties in the US, served by multiple public water systems drawing from the Potomac watershed. EPA UCMR5 monitoring in the county\'s service area shows PFAS with PFOA and PFOS above federal MCLs.',
    'Defense corridor industry and airport firefighting foam history contribute to PFAS signals across Northern Virginia. WSSC and Fairfax Water both publish CCRs — read yours by provider, not by city name alone.',
    'For townhouse communities on chloramine, point-of-use RO addresses PFAS and lead at fixtures. HOA restrictions sometimes block exterior softeners — countertop RO avoids that fight.',
  ],
  nashville: [
    'Metro Nashville draws from the Cumberland River — a long, industrialized waterway through Tennessee. PFAS and DBPs show up in monitoring; hardness is moderate compared to Texas but still enough to spot glassware.',
    'Nashville\'s boom means constant construction — sediment disturbances can spike lead at the tap for weeks after main work on your street. Flush taps after outages and filter if you are on pre-1986 plumbing.',
    'Chloramine is standard. For PFAS above new EPA limits, RO is the answer I give touring musicians and healthcare workers alike — portable pitchers if you rent, under-sink if you own.',
  ],
  charlotte: [
    'Charlotte Water pulls from the Catawba River basin — a growing Sun Belt metro with PFAS detections in UCMR5 and rising DBP challenges as the watershed urbanizes.',
    'Carolina clay and variable hardness mean some ZIP codes need softeners while others do not. Charlotte residents often over-buy whole-home systems because a neighbor had one.',
    'Lead risk is lower than Rust Belt cities but not zero in older mill-village housing. Match filtration to your WaterCheckup ZIP report, not a Facebook thread.',
  ],
  'fort-worth': [
    'Fort Worth shares North Texas reservoirs with Dallas but has its own violation history and blend points. PFAS above EPA limits has been recorded in UCMR5 — PFHxS and PFOS are the usual suspects from regional industrial activity.',
    'Trinity River basin agriculture adds nitrate and organic DBP precursors. Summer algae blooms can change taste overnight even when legal limits are met.',
    'Tarrant County homeowners often install water softeners first because of scale. Remember softeners exchange ions; they do not remove PFAS. Stack RO at the kitchen for drinking.',
  ],
  columbus: [
    'Columbus Public Water System draws from the Scioto River and groundwater wells. PFAS monitoring has shown regulated compounds above EPA limits — unusual for a Midwest city without a obvious chemical plant headline, but UCMR5 does not lie.',
    'Ohio\'s agricultural heartland contributes nitrate and pesticides to river sources. Columbus meets standards, but young families sometimes want zero nitrate at the tap — RO delivers that.',
    'Lead service lines exist in older neighborhoods like most Great Lakes-adjacent cities. Check the EPA inventory link on your report before assuming you only need a fridge filter.',
  ],
  sacramento: [
    'Sacramento\'s American and Sacramento River sources face wildfire runoff, agricultural nitrate, and legacy mining metals in foothill tributaries. Lead and PFAS both appear in recent monitoring — a dual threat that pushes RO ahead of pitchers.',
    'California lead testing in schools raised awareness statewide. Your home may have the same vintage fixtures as a failing school fountain. Test the tap, not the utility average.',
    'Sacramento heat increases DBP formation in summer. If you drink a lot of iced tap water, filter what you consume — boiling for coffee concentrates some contaminants rather than removing them.',
  ],
  atlanta: [
    'Atlanta Watershed pulls from the Chattahoochee — a river stressed by growth, runoff, and periodic drought. PFAS and chloramine DBPs are the recurring concerns in metro monitoring.',
    'Georgia\'s relatively soft source water means many Atlantans skip filtration entirely. Post-2024 PFAS rules changed that calculus for anyone on surface water blends with detections.',
    'Boil-water advisories after main breaks are frequent in older intown grids. Keep a certified pitcher filled during advisories and replace cartridges after sediment spikes.',
  ],
  minneapolis: [
    'Minneapolis treats Mississippi River water — cold, turbid, and full of agricultural upstream load. Lead service lines and PFAS monitoring both deserve attention in older neighborhoods.',
    'Twin Cities winters mean pipes sit in cold basements where lead can dissolve differently than summer samples suggest. Test in warm and cold months if you have toddlers.',
    'Minnesota has strong public health messaging on lead. Pair state resources with your ZIP-level PFAS snapshot — filtration should address both if either is flagged.',
  ],
  baltimore: [
    'Baltimore City\'s aging infrastructure makes lead and main-break advisories part of daily life. Lake-based source water is treatable, but distribution system age is the customer-facing problem.',
    'PFAS monitoring is ongoing under UCMR5. Lead at the tap remains the urgent child-health issue — corrosion control helps but does not replace line replacement or filtration.',
    'Rowhouse renters should use NSF 53 certified filters and flush after overnight stagnation. Homeowners in line-replacement queues should filter until the job is done, not after.',
  ],
  pittsburgh: [
    'Pittsburgh Water draws from the Allegheny River — industrial history leaves a PFAS and DBP footprint that modern treatment manages but does not erase. Lead service lines persist in many neighborhoods.',
    'Hillside neighborhoods see pressure swings that can disturb sediment and particulate lead. After hydrant flushing on your block, run taps before drinking.',
    'For Steelers country homes with finished basements, under-sink RO fits easily in bar sinks too — same water, same contaminants.',
  ],
  'st-louis': [
    'St. Louis draws Mississippi and Missouri river water — two of America\'s most industrialized waterways. PFAS, DBPs, and lead service lines form the filtration triad I talk about most with STL clients.',
    'Missouri lead mining history is separate from pipe lead, but both contribute to public anxiety. Read your CCR and the service line inventory together.',
    'Bi-state metro quirks mean Illinois versus Missouri addresses may have different utilities entirely. Search by ZIP, not by "St. Louis" alone.',
  ],
  scottsdale: [
    'Scottsdale blends Colorado River CAP water with local groundwater — high TDS, desert minerals, and seasonal PFAS monitoring signals. Desert luxury homes often have fancy fridge filters that are not NSF-certified for PFAS.',
    'Arsenic and radium can appear in Arizona aquifer supplements. RO removes both; carbon alone may not.',
    'Golf-course communities use irrigation water separate from domestic supply — do not confuse the two when reading reports.',
  ],
  pensacola: [
    'Pensacola and ECUA water carry a PFAS legacy linked to Eglin Air Force Base AFFF use — 220 ppt total PFAS with multiple compounds above EPA MCLs in federal monitoring. This is among the highest profiles in Florida.',
    'Military communities know the vocabulary of PFOA and PFOS already. Civilian neighborhoods downstream share the same aquifer and river influences.',
    'Do not rely on fridge filters shipped with the refrigerator. NSF 58 RO or P473 pitchers are the minimum serious response at these concentrations.',
  ],
  portland: [
    'Portland\'s Bull Run source is famously low-chlorine — some residents love the taste, but low residual disinfectant can mean different microbial risk management than chloramine cities. PFAS monitoring still applies under federal rules.',
    'Oregon\'s seismic risk drives infrastructure investment; pipe breaks can release sediment. After major quakes or storms, follow boil notices even if you normally drink unfiltered.',
    'Portland\'s moderate hardness means fewer softeners than Phoenix. Filter for contaminants confirmed in your report, not for internet myths about fluoride.',
  ],
  'las-vegas': [
    'Las Vegas Valley Water District imports almost all drinking water from Lake Mead via the Colorado River — warm, mineral-rich, and hard. PFAS monitoring under UCMR5 is part of the modern compliance picture.',
    'Casino-scale buildings recirculate water — residential customers still face home plumbing lead risk in older strip-adjacent neighborhoods.',
    'Visitors who buy condos should not assume Strip resort filtration standards apply to their unit\'s tap. Test and filter.',
  ],
  tampa: [
    'Tampa Bay Water blends surface and groundwater — chloramine, hardness, and PFAS monitoring define the 2026 conversation. Florida warmth accelerates DBP chemistry in summer.',
    'Hurricane season can interrupt treatment for days. Have a certified pitcher or stored water plan separate from your everyday RO routine.',
    'HOA communities on reclaimed irrigation sometimes confuse purple-pipe water with potable — potable still needs contaminant-aware filtration if your report flags PFAS.',
  ],
  'san-diego': [
    'San Diego imports Colorado River and Northern California water — expensive, hard, and treated with chloramine across most of the county. PFAS appears in regional UCMR5 datasets.',
    'Naval and defense industry history contributes to PFAS awareness in coastal ZIP codes. Civilian suburbs share regional sources.',
    'Desalination supplements the blend in dry years — TDS and taste change seasonally. Re-check your report after major drought allocations shift.',
  ],
  orlando: [
    'Orlando Utilities Commission relies on Florida aquifer blends — chloramine, moderate hardness, and PFAS monitoring are the key data points. Theme-park city does not mean theme-park water quality.',
    'Tourism-heavy areas have more transient housing with unknown plumbing age. Renters should filter; owners should test.',
    'Lightning capital weather causes power outages at treatment plants occasionally. Follow boil notices literally — filters do not substitute for microbiological safety during advisories.',
  ],
  'new-orleans': [
    'New Orleans Sewerage & Water Board treats Mississippi River water below sea level — a engineering marvel with an aging distribution system. Lead and DBPs dominate local concerns.',
    'Post-Katrina infrastructure investment is ongoing; main breaks still common. Flush brown water until clear; use filtration for lead after plumbing stabilizes.',
    'French Quarter pre-war buildings are lead-solder museums. Short-term rentals should not skip filters because the water "tastes fine."',
  ],
  'san-jose': [
    'San Jose sits in Silicon Valley with a mix of imported and local groundwater. Chromium-6, PFAS, and California health goals tighter than federal limits make compliance letters confusing.',
    'Tech campuses often have bottle fillers with hidden filter cartridges — residential homes need their own NSF-certified solution.',
    'Earthquake country: strap heaters, but also plan water quality after pipe breaks. Sediment can foul cheap filters fast.',
  ],
};

export function getPriorityCityIntroParagraphs(slug: string): readonly string[] | undefined {
  return PRIORITY_CITY_INTROS[slug];
}
