import { GUIDE_SOURCES } from './commercial-guide-sources';

export function PitcherGuideArticle() {
  return <>
    <h2>How to choose a pitcher that reduces lead</h2>
    <p>Start with the cartridge, not the brand name. The same pitcher can accept filters with different reduction claims. EPA’s consumer tool recommends checking for a specific lead-reduction claim under NSF/ANSI 53 and Class I particulate reduction under NSF/ANSI 42. Match the exact pitcher and replacement cartridge to the performance sheet.</p>
    <p><a href={GUIDE_SOURCES.epaLead}>Use EPA’s guide to lead-reduction certification →</a></p>
    <p>Brita Elite OB06 is a lead-reduction option in the compatible systems listed on its sheet. The Original cartridge is a different product; do not transfer Elite’s claims to it.</p>

    <h2>Which pitcher removes the most contaminants?</h2>
    <p>A long list of substances does not tell you which filter best fits your water. Compare the evidence for the substance you want reduced, the tested capacity, and the conditions of use. Keep a certification claim separate from additional laboratory testing.</p>
    <p>Clearly Filtered publishes a broad laboratory-results table, including lead and PFAS. Its linked NSF performance sheet lists chlorine reduction under NSF/ANSI 42 and materials lead content under NSF/ANSI/CAN 372. Those are different kinds of evidence. Standard 372 does not establish removal of lead from water, and the wider test table should not be described as certification of every claim.</p>
    <p>For PFAS, check the named compounds and the exact cartridge’s current reduction claim. A lead claim alone does not establish PFAS reduction. We do not make a PFAS recommendation for Brita Elite from the sheet reviewed here.</p>

    <h2>What a low TDS reading tells you</h2>
    <p>A TDS meter measures dissolved solids; it does not identify individual contaminants or prove that water is safe. ZeroWater’s published results discuss specific lead, chromium and PFOA/PFOS tests. Use the relevant performance evidence alongside the meter, rather than treating a zero reading as a test for every contaminant.</p>

    <h2>Compare replacement costs before buying</h2>
    <p>Write down the exact replacement cartridge, pack price, rated gallons and time limit. At an illustrative one gallon per day, divide 365 by the rated gallons to estimate annual cartridge use. If the time limit requires more frequent changes, use that schedule. Round up when budgeting whole packs, and subtract any included starter cartridge from first-year purchases.</p>
    <p>A low pitcher price can be offset by frequent replacements. The cards above show verified schedules where available and identify costs that still need a retailer quote. Taxes, shipping and early replacement can increase spending.</p>

    <h2>When to test before choosing a filter</h2>
    <p>A supplier report gives useful background, but it does not measure lead from your own building’s plumbing. A household tap test can answer that question. For private wells or unknown-quality water, choose appropriate laboratory testing before selecting treatment.</p>
    <p>Follow the manufacturer’s cleaning and replacement instructions. These household pitcher comparisons do not establish protection during a boil-water advisory; follow the current local advisory.</p>
    <p><a href={GUIDE_SOURCES.cdc}>CDC: choose a filter for the substances in your water →</a></p>
    <p>Waterdrop also sells several pitcher and electric-filter families. Verify the exact model, cartridge and listed claim before comparing them; a brand-wide or category-page claim is not enough to rank a particular pitcher.</p>
  </>;
}
