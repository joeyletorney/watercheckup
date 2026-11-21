import React from 'react';
import Link from 'next/link';
import type { Post } from './post-types';
import { blogPostDateFields } from '@/lib/blog-post-dates';
import { TOP_LEAD } from '@/lib/blog-top-picks';
import { WATERDROP_G3P600_URL } from '@/lib/waterdrop-buy';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '56px 0 18px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '40px 0 14px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#cbd5e1', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '40px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#cbd5e1', lineHeight: 1.75 };
const linkStyle: React.CSSProperties = { color: '#22d3ee', fontWeight: 600, textDecoration: 'none' };
const metaStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', fontSize: 14, lineHeight: 1.6 };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: '#334155', fontWeight: 800, borderBottom: '1px solid #e2e8f0' };
const tdStyle: React.CSSProperties = { padding: '12px', color: '#334155', lineHeight: 1.55, verticalAlign: 'top' };

const SRC = {
  spartanburg:
    'https://www.spartanburgwater.org/news/5-pm-update-water-services-returning-boil-water-advisory-still-in-effect',
  watertown: 'https://fox47.com/news/local/watertown-warns-of-elevated-levels-of-lead-found-in-tap-water',
  marshfield:
    'https://www.marshfieldnewsherald.com/story/news/local/2026/11/18/marshfield-utilities-receives-11-million-to-address-pfas-contamination/92817859007/',
  cordell:
    'https://oklahoma.gov/deq/divisions/executive-offices/office-of-communication-and-education/news-releases/2026/november/new-cordell-boil-order.html',
  cordellLift:
    'https://oklahoma.gov/deq/divisions/executive-offices/office-of-communication-and-education/news-releases/2026/november/boil-order-lifted-for-new-cordell-public-water-supply.html',
  sanMartin:
    'https://www.valleywater.org/news-events/news-releases/BoilWaterNoticeIssuedforCaliforniaAmCustomersinWestSanMartinZone1',
  sanMartinLift: 'https://amwater.com/caaw/alerts',
  centerTownship:
    'https://beavercountyradio.com/news/boil-water-advisory-issued-for-center-township-after-positive-e-coli-test/',
  centerTownshipLift:
    'https://www.wpxi.com/news/local/boil-water-advisory-lifted-beaver-countys-center-township/TC2JOXHQOFCN5LNI3M74AARHMU/',
  ucmr5: 'https://www.epa.gov/system/files/documents/2026-10/pfas_ucmr5_national_statistics_20261018.pdf',
  cdcAdvisory: 'https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html',
  epaFlush:
    'https://www.epa.gov/waterutilityresponse/water-decontamination-frequently-asked-questions-customers',
  epaBoil: 'https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water',
} as const;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={linkStyle} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Guide({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={linkStyle}>
      {children}
    </Link>
  );
}

export const EXTRA_POSTS_ALERTS: Record<string, Post> = {
  'drinking-water-alerts-november-2026': {
    title: 'Drinking Water Alerts This Week (Nov 2026): Spartanburg, Watertown, Marshfield & What to Do',
    excerpt:
      'A calm weekly roundup of current drinking-water notices: Spartanburg’s boil advisory, Watertown lead, Marshfield PFAS, and what actually helps at the tap.',
    seo: {
      title: 'Drinking Water Alerts This Week (Nov 2026)',
      description:
        'Spartanburg boil advisory still in effect as of Nov 20. Watertown lead, Marshfield PFAS, plus OK, CA, and PA alerts — what to do.',
      canonical: 'https://watercheckup.com/blog/drinking-water-alerts-november-2026',
      openGraph: {
        title: 'Drinking Water Alerts This Week (Nov 2026)',
        description:
          'Spartanburg boil advisory still in effect as of Nov 20. Watertown lead, Marshfield PFAS, plus OK, CA, and PA alerts — what to do.',
      },
    },
    ...blogPostDateFields('drinking-water-alerts-november-2026', '2026-11-21'),
    readTime: '11 min read',
    badge: 'Safety',
    badgeColor: '#ef4444',
    topPicks: TOP_LEAD,
    faq: [
      {
        q: 'Does boiling remove lead?',
        a: 'No. Boiling kills germs; it does not remove lead. Because some water evaporates, boiling can raise the concentration of lead and other metals. Use cold water for drinking and cooking, and a filter whose exact model has a lead-reduction claim (typically NSF/ANSI 53). An NSF/ANSI 58 reverse-osmosis listing is the RO system standard; it is not by itself a lead claim unless lead reduction is listed for that model.',
      },
      {
        q: 'Can I shower during a boil advisory?',
        a: 'CDC guidance for a typical boil-water advisory is that you can bathe or shower, but be careful not to swallow the water. Use extra caution with babies and young children; CDC suggests considering a sponge bath so they are less likely to swallow water. Follow your local notice if it says otherwise. Brush teeth with boiled or bottled water.',
      },
      {
        q: 'Does a Brita remove PFAS?',
        a: 'We do not treat a generic “Brita” pitcher as a PFAS filter. The Brita Elite OB06 performance sheet reviewed in our pitcher guide lists lead reduction in specified compatible pitcher and dispenser systems; that sheet does not establish a PFAS-reduction claim. The Original cartridge is a different product — do not transfer Elite’s claims to it. For PFAS, use reverse osmosis (NSF/ANSI 58) or a filter whose exact model has a named PFOA/PFOS claim (NSF 53, 58, or P473).',
      },
      {
        q: 'How do I find out if my town has an alert?',
        a: 'Start with your water bill or supplier website, local health department, and any notice mailed or posted at your door. Enter your ZIP on WaterCheckup for available public-supplier records. Those records are not a live alert feed and are not a test of your own tap. If you rent, ask the landlord which utility serves the building.',
      },
    ],
    content: (
      <>
        <p style={metaStyle}>Published November 21, 2026 · Last updated November 21, 2026</p>
        <AffiliateDisclosure />

        <p style={pStyle}>
          Several U.S. communities posted drinking-water notices this month. They are not the same problem, and they do
          not share the same fix. This roundup sticks to the official notices we re-checked on November 21, 2026, and to
          standard CDC and EPA household guidance. If your town issued an update after we published, follow that notice
          first.
        </p>

        <div style={calloutStyle}>
          <strong style={strongStyle}>Quick answer — match the tool to the problem</strong>
          <ul style={{ margin: '12px 0 0', paddingLeft: 20, lineHeight: 1.75 }}>
            <li>
              <strong style={strongStyle}>Boil advisory (bacteria):</strong> Bring water to a rolling boil for 1 minute
              (3 minutes above 6,500 feet) or use bottled water.{' '}
              <Ext href={SRC.cdcAdvisory}>CDC</Ext> says a home filter or pitcher is not a substitute — still boil.
            </li>
            <li>
              <strong style={strongStyle}>Lead:</strong> An NSF/ANSI 53 filter with a lead-reduction claim can help at
              the tap. Boiling does <em>not</em> remove lead.
            </li>
            <li>
              <strong style={strongStyle}>PFAS:</strong> Reverse osmosis, or a filter certified for PFOA/PFOS (NSF 53,
              58, or P473) on the exact model. Boiling does not remove PFAS and can concentrate them as water evaporates.
            </li>
          </ul>
        </div>

        <h2 style={h2Style}>Spartanburg, SC: systemwide boil water advisory</h2>
        <p style={pStyle}>
          <strong style={strongStyle}>Status as of November 20, 2026:</strong> still in effect. Spartanburg Water’s{' '}
          <Ext href={SRC.spartanburg}>5 p.m. and 9 p.m. November 20 updates</Ext> say service and pressure are returning,
          storage is being refilled, and sampling has begun. The advisory lasts until samples are analyzed by an
          SCDES-certified lab and the results meet state and federal drinking-water standards — a period the utility had
          already described as at least 48–72 hours. As of November 21, 2026, Spartanburg Water’s news page had no later
          post lifting the notice.
        </p>
        <p style={pStyle}>
          <strong style={strongStyle}>Who is covered:</strong> all Spartanburg Water System customers, including wholesale
          customers Metro B, the Town of Jonesville, and LCF (Liberty Chesnee Fingerville), until further notice.
        </p>
        <h3 style={h3Style}>What to do while the advisory is in effect</h3>
        <p style={pStyle}>
          Follow Spartanburg Water first. CDC’s usual boil-advisory steps are:{' '}
          <Ext href={SRC.cdcAdvisory}>use bottled water, or bring tap water to a rolling boil for 1 minute</Ext> (
          <Ext href={SRC.epaBoil}>EPA emergency disinfection</Ext> uses the same 1-minute rolling boil; 3 minutes at high
          elevation). Use that water for drinking, cooking, ice, and brushing teeth. CDC also says not to drink water or
          ice from appliances on your water line, including a refrigerator dispenser, and to boil tap water even if it
          has gone through a pitcher or home filter.
        </p>
        <h3 style={h3Style}>What to do after it lifts</h3>
        <p style={pStyle}>
          Wait for Spartanburg Water to say the advisory is repealed. EPA’s{' '}
          <Ext href={SRC.epaFlush}>customer guidance after a contamination incident</Ext> is that leftover water in
          household plumbing may still need to be cleared, and that your water system should tell you whether and how to
          flush. Typical household steps, once the utility says you may return to normal use, are:
        </p>
        <ul style={{ margin: '0 0 20px', paddingLeft: 22, color: '#cbd5e1', lineHeight: 1.75 }}>
          <li>Run cold taps to flush indoor pipes.</li>
          <li>Dump ice and discard ice made during the advisory.</li>
          <li>Replace refrigerator, pitcher, and faucet filter cartridges that were used while the advisory was on.</li>
          <li>Run the water heater if the utility directs it, so the tank volume is replaced.</li>
        </ul>

        <h2 style={h2Style}>Watertown, WI: elevated lead in tap samples</h2>
        <p style={pStyle}>
          On November 20, 2026, Watertown Waterworks said more than 10% of 33 tap samples collected from June through
          September 2026 were above the federal and state lead action level, according to{' '}
          <Ext href={SRC.watertown}>FOX 47</Ext>. The city said it is continuing lead and copper monitoring and plans to
          remove all lead service lines by November 2027.
        </p>
        <p style={pStyle}>
          Infants, young children, and pregnant people are at greatest risk from lead in drinking water. FOX 47, citing
          city information, notes that lead exposure can damage the brain and kidneys and disrupt red blood cell
          production.
        </p>
        <h3 style={h3Style}>The city’s advice</h3>
        <p style={pStyle}>
          Run the tap 15–30 seconds before use. Use cold water for cooking and baby formula. Consider bottled water or a
          water filter. Clean faucet aerators regularly. For a child’s blood-lead test, the City of Watertown Department
          of Public Health is 920-262-8090. For a water test, Watertown Waterworks is 920-262-4075.
        </p>
        <h3 style={h3Style}>Certified filters and testing</h3>
        <p style={pStyle}>
          A filter only helps with lead if the exact model has a lead-reduction claim — typically NSF/ANSI 53. NSF/ANSI
          58 is the reverse-osmosis system standard; it does not by itself verify lead reduction unless that claim is
          listed for the model. Our{' '}
          <Guide href="/blog/best-water-filter-for-lead-removal">lead filter guide</Guide> and{' '}
          <Guide href="/blog/best-water-filter-pitcher-2025">pitcher guide</Guide> walk through verified picks —
          including Brita Elite OB06 in a compatible pitcher for documented lead reduction, and the{' '}
          <Ext href={WATERDROP_G3P600_URL}>Waterdrop G3P600</Ext> under-sink RO. A supplier report is not a test of the
          water at your kitchen tap; if you need a household measurement, see{' '}
          <Guide href="/blog/how-to-test-your-tap-water-mail-in-labs-explained">how to test tap water</Guide>.
        </p>

        <h2 style={h2Style}>Marshfield, WI: PFAS and a permanent treatment plant</h2>
        <p style={pStyle}>
          PFAS (per- and polyfluoroalkyl substances) are a large family of industrial chemicals that persist in water and
          in the body. They are not killed by boiling.
        </p>
        <p style={pStyle}>
          The <Ext href={SRC.marshfield}>Marshfield News-Herald (November 18, 2026)</Ext> reports that PFAS was found in
          May 2022 at the city’s south-side wells. Four wells were offline for more than 20 months. A temporary
          trailer-mounted anion-exchange resin system has been in use since early 2024. Recent tests showed PFOS at 29.7
          parts per trillion, compared with the Wisconsin DNR limit of 4 ppt. Marshfield Utilities was awarded
          $11,199,760 from the Safe Drinking Water Loan Program — $7 million in principal forgiveness and $4,199,760 in
          subsidized loans — toward a permanent plant at the southside wellfield. Bids are expected in spring 2027. The
          award does not by itself commit the city to construction.
        </p>
        <p style={pStyle}>
          Residents cannot wait for a 2027 plant to finish if they want lower PFAS at the kitchen tap now. Reverse
          osmosis, or a filter whose exact model is certified for PFOA/PFOS, is the practical household option. See{' '}
          <Guide href="/blog/what-water-filter-removes-pfas">what water filters remove PFAS</Guide> and the{' '}
          <Guide href="/blog/best-ro-system-for-pfas-removal">RO systems for PFAS</Guide> guide. Boiling does not help —
          it leaves PFAS in a smaller volume of water.
        </p>

        <h2 style={h2Style}>Other alerts this month</h2>

        <h3 style={h3Style}>New Cordell, OK — boil order lifted; infant nitrate warning</h3>
        <div style={warnStyle}>
          <strong style={{ color: '#ef4444' }}>Infants under 6 months: </strong>
          Oklahoma DEQ’s <Ext href={SRC.cordell}>November 6, 2026 boil-order notice</Ext> said not to give this water to
          infants under 6 months <strong style={strongStyle}>even if it has been boiled</strong>, because of a history of
          elevated nitrate. Boiling does not remove nitrate. Symptoms listed in that notice include shortness of breath
          and blue baby syndrome. Use bottled water or other water low in nitrates for infant formula unless the utility
          or DEQ tells you otherwise.
        </div>
        <p style={pStyle}>
          The November 6 DEQ order was issued for <em>E. coli</em> and required a rolling boil of at least one minute (or
          bottled water) for drinking, food preparation, dishwashing, and brushing teeth.{' '}
          <strong style={strongStyle}>Status as of November 13, 2026:</strong> DEQ{' '}
          <Ext href={SRC.cordellLift}>announced the boil order has been lifted</Ext> and that the water is now safe for
          human consumption. The lift release does not separately restate the nitrate sentence. If you prepare formula
          for an infant under 6 months, confirm current nitrate guidance with New Cordell Utility Authority or DEQ before
          switching back to tap water.
        </p>

        <h3 style={h3Style}>San Martin, CA — Cal Am West San Martin (Zone 1)</h3>
        <p style={pStyle}>
          Valley Water relayed a <Ext href={SRC.sanMartin}>Cal Am boil-water notice</Ext> for West San Martin (Zone 1)
          after <em>E. coli</em> was found on November 7, 2026. Customers in the mapped area were told to boil water or
          use bottled water for drinking, ice, brushing teeth, washing dishes, and food preparation.{' '}
          <strong style={strongStyle}>Status as of November 12, 2026:</strong> California American Water’s{' '}
          <Ext href={SRC.sanMartinLift}>alerts page</Ext> states that, with the State Water Resources Control Board, the
          West San Martin system has determined the water is safe to drink.
        </p>

        <h3 style={h3Style}>Center Township, PA (Beaver County)</h3>
        <p style={pStyle}>
          <Ext href={SRC.centerTownship}>Beaver County Radio (November 3, 2026)</Ext> reported a boil-water advisory after
          a sample near the Township Road Garage and Wilhelm Drive tested positive for coliforms including <em>E. coli</em>
          . Four other sample locations did not have coliforms. Residents were told to boil water for a minute and let it
          cool, or use bottled water for brushing teeth, dishes, cooking, drinking, and ice. The water authority number
          in that report is 724-774-7766. <strong style={strongStyle}>Status as of November 4, 2026:</strong>{' '}
          <Ext href={SRC.centerTownshipLift}>WPXI</Ext> reported that Center Township officials said the advisory had
          been lifted after further tests came back clean.
        </p>

        <h2 style={h2Style}>The national PFAS picture</h2>
        <p style={pStyle}>
          These local notices sit against a wider monitoring result. EPA’s{' '}
          <Ext href={SRC.ucmr5}>UCMR 5 national PFAS summary (October 18, 2026)</Ext> covers public water systems that
          tested for 29 PFAS between January 2023 and June 2026. Of 10,313 monitored systems,{' '}
          <strong style={strongStyle}>3,595</strong> (34.9%) had at least one PFAS detected, and{' '}
          <strong style={strongStyle}>1,763</strong> (17.1%) had at least one result at or above a 2024 federal PFAS
          limit.           Those figures are occurrence comparisons, not 2029 compliance determinations. Enter your ZIP on{' '}
          <Guide href="/">WaterCheckup</Guide> to see whether your supplier appears in available UCMR 5 records.
        </p>

        <h2 style={h2Style}>What any consumer can do</h2>
        <p style={pStyle}>
          Use the table as a starting point, then check the exact model’s current performance sheet. Product links below
          go to guides already on this site, or to a verified pick we already list.
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 40 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                <th style={thStyle}>Problem</th>
                <th style={thStyle}>What works</th>
                <th style={thStyle}>What does not</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Bacteria (boil advisory)</td>
                <td style={tdStyle}>
                  Rolling boil 1 minute or bottled water (
                  <Ext href={SRC.cdcAdvisory}>CDC</Ext>)
                </td>
                <td style={tdStyle}>A regular pitcher, fridge, or faucet filter used instead of boiling</td>
              </tr>
              <tr>
                <td style={tdStyle}>Lead</td>
                <td style={tdStyle}>
                  NSF/ANSI 53 lead-reduction claim on the exact model (NSF 58 RO only if lead is listed) — see the{' '}
                  <Guide href="/blog/best-water-filter-for-lead-removal">lead guide</Guide>
                  {', '}
                  <Guide href="/blog/best-water-filter-pitcher-2025">pitcher guide</Guide>
                  {', and '}
                  <Ext href={WATERDROP_G3P600_URL}>Waterdrop G3P600</Ext>
                </td>
                <td style={tdStyle}>Boiling; a pitcher without a lead claim on that cartridge</td>
              </tr>
              <tr>
                <td style={tdStyle}>PFAS (PFOA/PFOS)</td>
                <td style={tdStyle}>
                  Reverse osmosis or a filter certified for PFOA/PFOS (NSF 53/58/P473) — see{' '}
                  <Guide href="/blog/what-water-filter-removes-pfas">PFAS filters</Guide> and{' '}
                  <Guide href="/blog/best-ro-system-for-pfas-removal">RO for PFAS</Guide>
                </td>
                <td style={tdStyle}>Boiling (can concentrate PFAS); a standard carbon pitcher with no PFAS claim</td>
              </tr>
              <tr>
                <td style={tdStyle}>Nitrate (infant formula)</td>
                <td style={tdStyle}>
                  Bottled or other low-nitrate water; boiling is not the fix. See the{' '}
                  <Guide href="/blog/nitrate-in-well-water-infants-and-pregnancy">nitrate guide</Guide>
                </td>
                <td style={tdStyle}>Boiling; a taste-and-odor pitcher</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>
          To see available public-supplier records for your system, use the{' '}
          <Guide href="/">ZIP-code lookup</Guide>. That report is not a live boil-water feed and does not measure lead
          from your own plumbing.
        </p>
      </>
    ),
  },
};
