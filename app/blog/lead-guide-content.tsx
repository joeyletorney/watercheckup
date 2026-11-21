import { GUIDE_SOURCES } from './commercial-guide-sources';
import { WATERDROP_G3P600_URL } from '@/lib/waterdrop-buy';

const AMAZON = 'https://www.amazon.com/dp/B07P1XFYJP?tag=watercheckup-20';

type Row = {
  product: string;
  nsf53: string;
  pfas: string;
  price: string;
  yearly: string;
};

const ROWS: Row[] = [
  {
    product: 'Waterdrop G3P600 (under-sink RO)',
    nsf53: 'Yes — NSF/ANSI 53 (NSF), with 42/58/372',
    pfas: 'NSF/ANSI 58 reverse osmosis',
    price: '~$399',
    yearly: 'Catalog ~$150/year',
  },
  {
    product: 'AquaTru Classic (countertop RO)',
    nsf53: 'Yes — IAPMO R&T to NSF/ANSI 53 (plus 42/58/372/401)',
    pfas: 'NSF/ANSI 58; NSF/ANSI 401 on the Classic PDS',
    price: '~$380',
    yearly: '$129.83/year (official filter math)',
  },
  {
    product: 'Brita Elite OB06 (pitcher cartridge)',
    nsf53: 'Lead reduction listed on Brita’s Elite performance sheet — confirm the pitcher/cartridge pair in a certification directory',
    pfas: 'Not established on the sheet reviewed here',
    price: 'Pitcher extra; cartridge packs listed on Brita',
    yearly: '$65.98/year at 1 gal/day (four Elite cartridges)',
  },
  {
    product: 'ZeroWater 10-cup pitcher',
    nsf53: 'Yes — NSF/ANSI 42 and 53 (lead, chromium, arsenic on listings)',
    pfas: 'Manufacturer lab results discuss PFOA/PFOS; not treated here as NSF 58/P473',
    price: '~$23',
    yearly: 'Check cartridge packs (catalog ~$100/year)',
  },
  {
    product: 'PUR PLUS 11-cup pitcher',
    nsf53: 'IAPMO R&T certification for lead on the PPT111 product page',
    pfas: 'Not used here as a PFAS-certified pick',
    price: 'Check current price',
    yearly: 'Check the 40-gallon / two-month cartridge',
  },
  {
    product: 'Frizzlife SK99-NEW (under-sink carbon)',
    nsf53: 'Yes — IAPMO to NSF/ANSI 42, 53, and 372',
    pfas: 'Not NSF 58; not claimed as PFAS-certified here',
    price: '~$126',
    yearly: 'Catalog ~$60/year',
  },
  {
    product: 'Frizzlife MK99 (under-sink carbon)',
    nsf53: 'Yes — NSF/ANSI 53 for lead (plus 42)',
    pfas: 'Not NSF 58',
    price: 'Check current price (catalog ~$70)',
    yearly: 'Catalog ~$45/year',
  },
  {
    product: 'Aquasana Claryum 3-Stage Max Flow (AQ-6300M)',
    nsf53: 'NSF/ANSI 42, 53, and 401 on manufacturer listings — confirm the exact SKU',
    pfas: 'NSF/ANSI 401 on listings; not NSF 58 RO',
    price: '~$170',
    yearly: 'Check current carbon replacements',
  },
  {
    product: 'Waterdrop PT-07B pitcher',
    nsf53: 'No — NSF/ANSI 42 and 372 only',
    pfas: 'PFOA/PFOS figures are third-party lab tests, not NSF 53/58/P473',
    price: 'Check current price',
    yearly: 'Check cartridges',
  },
];

export function LeadGuideArticle() {
  return (
    <>
      <div
        style={{
          margin: '0 0 28px',
          padding: '18px 20px',
          border: '2px solid #0369a1',
          borderRadius: 12,
          background: '#f0f9ff',
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: '#0369a1' }}>
          QUICK ANSWER · BEST LEAD REMOVAL WATER FILTER FOR HOME
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
          Top pick: Waterdrop G3P600 under-sink RO when you want certified lead reduction plus PFAS (NSF/ANSI 53 and 58).
        </p>
        <p style={{ margin: 0, fontSize: 15, color: '#334155', lineHeight: 1.7 }}>
          About $399; catalog filter allowance about $150/year.{' '}
          <a href={WATERDROP_G3P600_URL}>Waterdrop G3P600 (ref anbyjkqb)</a>
          {' · '}
          <a href={AMAZON}>Amazon (tag watercheckup-20)</a>
          . Budget lead-only: Brita Elite OB06 in a compatible pitcher, or ZeroWater 10-cup (NSF 42/53, about $23). A
          standard 372 “lead-free materials” mark is not lead removal. We did not laboratory-test these products; claims
          below are from NSF/IAPMO/WQA-style listings or the manufacturer’s current sheet as cited in this guide.
        </p>
      </div>

      <h2>Best water filter for lead removal — comparison</h2>
      <p>
        Certified water filters for lead need an explicit NSF/ANSI 53 (or equivalent IAPMO) lead-reduction claim for the
        exact model and cartridge. NSF/ANSI 58 covers reverse osmosis (including PFAS claims on RO systems). NSF/ANSI 401
        or P473 appears only where a listing says so. Prices and yearly filter costs are catalog or official-sheet figures
        already used on WaterCheckup — check live listings.
      </p>
      <div style={{ overflowX: 'auto', margin: '0 0 28px' }}>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">NSF/ANSI 53 lead</th>
              <th scope="col">NSF 58 / 401 / P473 PFAS</th>
              <th scope="col">Price</th>
              <th scope="col">Filter cost / year</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.product}>
                <td>{row.product}</td>
                <td>{row.nsf53}</td>
                <td>{row.pfas}</td>
                <td>{row.price}</td>
                <td>{row.yearly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Best affordable lead water filter</h2>
      <p>
        The lowest documented pitcher price in this comparison is ZeroWater’s 10-cup (about $23) with NSF/ANSI 42 and 53
        listings for lead. Brita Elite OB06 is the other budget route: you pay for the Elite cartridge, not a generic
        Original cartridge, and the yearly filter allowance on Brita’s published pack prices is $65.98 at one gallon per
        day. Under-sink, Frizzlife MK99 is the catalog’s lower-priced NSF 53 carbon option; confirm the live price. Cheap
        fridge filters are not assumed to be NSF 53 for lead.
      </p>

      <h2>Best water filter certified to remove lead and PFAS</h2>
      <p>
        For lead plus PFAS, use a system with both a lead claim (NSF/ANSI 53 or IAPMO equivalent) and a PFAS-capable
        listing — typically NSF/ANSI 58 reverse osmosis. Waterdrop G3P600 (NSF 42/53/58/372) and AquaTru Classic (IAPMO
        R&T to 42/53/58/372/401 on the Classic PDS) are the two current picks on this site that meet that split. Do not
        infer PFAS reduction from NSF/ANSI 372 or from a chlorine (42) claim. Public systems have until 2029 to meet the
        2024 PFAS MCLs; that deadline does not replace a tap filter in 2026.
      </p>

      <h2>Best water filter for lead and chlorine</h2>
      <p>
        Chlorine taste is NSF/ANSI 42; lead is NSF/ANSI 53. Products in the table that carry both include G3P600, AquaTru
        Classic, Frizzlife SK99-NEW (IAPMO 42/53/372), Frizzlife MK99, ZeroWater, and Aquasana Claryum listings that name
        42 and 53. A fridge filter that only cites 42 is not a lead filter. Chloramine (common on some city systems) is a
        separate 42 claim — check the sheet.
      </p>

      <h2>Match the treatment to your water</h2>
      <p>
        Review your utility report and use a household tap test when plumbing-related lead is the concern. A city-wide
        report cannot establish the lead level at your faucet. Compare the exact system, cartridge and reduction claim
        before ordering.{' '}
        <a href={GUIDE_SOURCES.cdc}>CDC: choosing home water filters</a> explains why the filter must match the substance
        of concern.
      </p>
      <p>
        <a href={GUIDE_SOURCES.epaLead}>EPA consumer tool for lead-reduction filters</a> (June 6, 2024): look for NSF/ANSI
        53 with an explicit lead-reduction claim and NSF/ANSI 42 Class I particulate reduction when listed. A standard
        number alone does not establish every contaminant claim.
      </p>

      <h2>Lead reduction is not pipe replacement</h2>
      <p>
        A point-of-use filter treats the water passing through it; it does not remove a lead service line or replace
        corroding plumbing. Follow local utility instructions and the cartridge replacement schedule. A lower TDS reading
        does not prove lead removal.
      </p>
      <p>
        Some site links may earn a commission (Amazon tag watercheckup-20; Waterdrop links use ref anbyjkqb). Official
        evidence links are for checking claims; a purchase is not required to use them.
      </p>
    </>
  );
}
