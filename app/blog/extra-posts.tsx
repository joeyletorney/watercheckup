import React from 'react';
import type { Post } from './post-types';

const WATERDROP = 'https://www.waterdropfilter.com/products/tankless-reverse-osmosis-system-wd-g3p800-w-fc-1?ref=anbyjkqb';
const AMAZON_TAG = 'watercheck20-20';

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '40px 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '28px 0 10px' };
const pStyle: React.CSSProperties = { margin: '0 0 20px', color: '#94a3b8', lineHeight: 1.85 };
const strongStyle: React.CSSProperties = { color: '#e2e8f0', fontWeight: 700 };
const calloutStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#0d2240', border: '1px solid #1a3a5c', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };
const warnStyle: React.CSSProperties = { margin: '28px 0', padding: '18px 22px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 };

export const EXTRA_POSTS: Record<string, Post> = {
  'how-to-read-your-consumer-confidence-report': {
    title: 'How to Read Your Consumer Confidence Report (CCR)',
    excerpt:
      'Every public water system sends an annual water quality report. Here is how to find yours, what the tables mean, and which lines actually matter for your health.',
    date: '2026-03-31',
    dateDisplay: 'March 31, 2026',
    readTime: '9 min read',
    badge: 'Guides',
    badgeColor: '#22c55e',
    topPick: {
      label: 'Your CCR lists contaminants vs. EPA limits — compare side by side',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'NSF-certified RO narrows the gap between “legal” and “what you want to drink” for many common contaminants.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=under+sink+reverse+osmosis+nsf+58&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          The <strong style={strongStyle}>Consumer Confidence Report (CCR)</strong> is the annual water quality report your utility must provide (by July 1 for the previous calendar year). If you get a water bill, you should get a CCR — often by mail, email, or a link on the utility website.
        </p>
        <p style={pStyle}>
          Think of it as the utility&apos;s report card: what was detected, at what levels, and how that compares to EPA limits. It is not a substitute for testing <em>your</em> plumbing, but it is the best free overview of your supplier&apos;s water.
        </p>

        <h2 style={h2Style}>Where to get your CCR</h2>
        <p style={pStyle}>
          Search <strong style={strongStyle}>“[your city] water consumer confidence report”</strong> or call the number on your bill. Large systems usually post PDFs online. If you rent, the landlord may not forward it — pull it directly from the water provider.
        </p>

        <h2 style={h2Style}>What to look for first</h2>
        <h3 style={h3Style}>1. Water source</h3>
        <p style={pStyle}>
          Surface water (rivers, lakes) and groundwater behave differently. Surface sources often have more organic matter and disinfection byproducts; groundwater may have different mineral and natural contaminant profiles.
        </p>
        <h3 style={h3Style}>2. Detected vs. not detected</h3>
        <p style={pStyle}>
          Utilities test for many contaminants; <strong style={strongStyle}>“not detected”</strong> does not always mean zero — it means below the lab&apos;s reporting limit for that test. A detection at any level deserves context next to the EPA limit.
        </p>
        <h3 style={h3Style}>3. The MCL column</h3>
        <p style={pStyle}>
          The <strong style={strongStyle}>Maximum Contaminant Level (MCL)</strong> is the legal limit. Numbers above the MCL are violations. Numbers below the MCL can still matter for health depending on the contaminant and who drinks the water.
        </p>

        <div style={calloutStyle}>
          <strong style={strongStyle}>Tip: </strong>
          Cross-check your CCR with WaterCheckup: enter your ZIP for a structured view of violations, PFAS monitoring where available, and contaminant context in plain language.
        </div>

        <h2 style={h2Style}>Lead and copper: read carefully</h2>
        <p style={pStyle}>
          Lead results in a CCR often reflect <strong style={strongStyle}>system-wide sampling programs</strong>, not necessarily the water at your kitchen tap. If you have lead service lines or older plumbing, consider a certified lead test and a filter certified for lead (NSF/ANSI 53).
        </p>

        <h2 style={h2Style}>Disinfection byproducts (TTHM, HAA5)</h2>
        <p style={pStyle}>
          Chlorine (or chloramine) reacting with organic matter forms <strong style={strongStyle}>trihalomethanes (TTHM)</strong> and <strong style={strongStyle}>haloacetic acids (HAA5)</strong>. CC Rs usually report running annual averages. If you are close to limits, a certified carbon filter or RO for drinking water can reduce exposure.
        </p>

        <h2 style={h2Style}>Bottom line</h2>
        <p style={pStyle}>
          Your CCR is the official yearly snapshot from the supplier. Read the tables once, note what was detected, then decide whether point-of-use filtration or further testing makes sense for your home.
        </p>
      </>
    ),
  },

  'chloramine-vs-chlorine-in-tap-water': {
    title: 'Chloramine vs. Chlorine in Tap Water: What It Means for Filters',
    excerpt:
      'Many cities switched to chloramine for longer-lasting disinfection. That changes taste, byproduct chemistry, and which filters work best — here is the practical breakdown.',
    date: '2026-04-01',
    dateDisplay: 'April 1, 2026',
    readTime: '8 min read',
    badge: 'Treatment',
    badgeColor: '#0ea5e9',
    topPick: {
      label: 'Chloramine is harder to remove than free chlorine — check NSF claims',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO effectively handles chloramine for drinking water when the system is maintained per manufacturer guidance.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=chloramine+water+filter+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          Most U.S. drinking water is disinfected with <strong style={strongStyle}>chlorine</strong> or <strong style={strongStyle}>chloramine</strong> (chlorine + ammonia). Both keep water safe from bacteria as it travels through pipes — but they behave differently in your home.
        </p>

        <h2 style={h2Style}>Chlorine (free chlorine)</h2>
        <p style={pStyle}>
          Free chlorine is reactive and dissipates faster. It often produces a stronger “pool” smell right at the tap. Many basic carbon filters are tested for reducing chlorine taste and odor (often NSF/ANSI 42).
        </p>

        <h2 style={h2Style}>Chloramine</h2>
        <p style={pStyle}>
          Chloramine persists longer in distribution systems, which is why large systems switched — it helps maintain disinfection all the way to distant customers. The tradeoff: it is <strong style={strongStyle}>less volatile</strong> than chlorine, so “letting water sit out” does less for smell, and some fish/aquarium and kidney dialysis applications need special handling (follow medical guidance).
        </p>

        <div style={warnStyle}>
          <strong style={{ color: '#f59e0b' }}>Filter shopping: </strong>
          A filter that only claims “chlorine reduction” may not perform the same for chloramine. Look for explicit chloramine reduction language and NSF listings that match what your utility uses.
        </div>

        <h2 style={h2Style}>Byproducts: TTHM and HAA5 still apply</h2>
        <p style={pStyle}>
          Chloramine still forms <strong style={strongStyle}>disinfection byproducts</strong> (e.g., TTHM, HAA5) when it reacts with organic matter. Your CCR should show running averages compared to EPA limits.
        </p>

        <h2 style={h2Style}>What actually works at the kitchen sink</h2>
        <h3 style={h3Style}>Carbon block (certified)</h3>
        <p style={pStyle}>
          High-quality catalytic or specialty carbons can reduce chloramine for drinking water when certified for that claim. Capacity depends on contact time and cartridge size — undersink systems usually outperform small pitchers.
        </p>
        <h3 style={h3Style}>Reverse osmosis</h3>
        <p style={pStyle}>
          <strong style={strongStyle}>RO</strong> is the most reliable way to reduce a wide range of contaminants for drinking and cooking, including chloramine and many related byproducts, assuming routine cartridge replacement.
        </p>

        <h2 style={h2Style}>How to know which you have</h2>
        <p style={pStyle}>
          Read your CCR or call your utility — they will state whether the residual disinfectant is chlorine, chloramine, or a combination. Match that to your filter&apos;s certifications.
        </p>
      </>
    ),
  },

  'private-well-water-testing-101': {
    title: 'Private Well Water Testing 101: What to Order and How Often',
    excerpt:
      'Wells are not covered by EPA drinking water rules the same way city water is. Here is a sensible testing schedule, which labs to use, and what results mean for treatment.',
    date: '2026-04-02',
    dateDisplay: 'April 2, 2026',
    readTime: '10 min read',
    badge: 'Wells',
    badgeColor: '#a855f7',
    topPick: {
      label: 'Wells need a certified lab panel — not just a TDS meter',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO is a common solution when multiple ions or nitrates/arsenic drive treatment decisions — confirm with testing first.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=well+water+test+kit+certified+laboratory&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          If you drink from a <strong style={strongStyle}>private well</strong>, you are your own water utility. There is no annual CCR in the mailbox — safety depends on regular testing and maintaining pumps, casings, and any treatment equipment.
        </p>

        <div style={warnStyle}>
          <strong style={{ color: '#ef4444' }}>Important: </strong>
          Total dissolved solids (TDS) pens and strip tests cannot prove your water is safe. They are hints, not substitutes for a certified lab panel appropriate to your region and risks.
        </div>

        <h2 style={h2Style}>Baseline tests (most wells)</h2>
        <p style={pStyle}>
          A common starting panel includes <strong style={strongStyle}>bacteria (coliform / E. coli)</strong>, <strong style={strongStyle}>nitrates</strong>, <strong style={strongStyle}>pH</strong>, conductivity/TDS, and common ions (hardness, iron, manganese, sulfate, chloride). Your state health department often publishes minimum recommendations.
        </p>

        <h2 style={h2Style}>Regional hazards to ask about</h2>
        <p style={pStyle}>
          Depending on geology and nearby land use, labs may add <strong style={strongStyle}>arsenic</strong>, <strong style={strongStyle}>uranium</strong>, <strong style={strongStyle}>radon in water</strong>, <strong style={strongStyle}>volatile organic compounds (VOCs)</strong>, or <strong style={strongStyle}>PFAS</strong>. A local environmental lab can recommend add-ons based on ZIP code and aquifer type.
        </p>

        <h2 style={h2Style}>How often</h2>
        <ul style={{ ...pStyle, paddingLeft: 22, margin: '0 0 20px' }}>
          <li style={{ marginBottom: 10 }}><strong style={strongStyle}>Bacteria:</strong> annually, and after flooding, well work, or any change in taste/odor.</li>
          <li style={{ marginBottom: 10 }}><strong style={strongStyle}>Nitrate:</strong> at least annually if infants or pregnancy are in the home; many states recommend yearly testing.</li>
          <li style={{ marginBottom: 10 }}><strong style={strongStyle}>Arsenic / metals:</strong> every few years unless you are near known hotspots or treatment changes — follow local guidance.</li>
        </ul>

        <h2 style={h2Style}>Sampling matters</h2>
        <p style={pStyle}>
          Use the lab&apos;s chain-of-custody instructions: first-draw vs. flushed samples tell different stories for metals. For bacteria, follow sterile bottle procedures and sample timing exactly.
        </p>

        <h2 style={h2Style}>Treatment: do not guess</h2>
        <p style={pStyle}>
          Pick treatment based on <strong style={strongStyle}>documented results</strong>. For example, nitrates often require RO or distillation; bacteria usually points to disinfection/UV and fixing the source of contamination; acidic pH may need neutralization — but the right fix depends on the full chemistry.
        </p>

        <div style={calloutStyle}>
          <strong style={strongStyle}>City water vs. well: </strong>
          WaterCheckup focuses on public water systems. For wells, start with your county extension or state environmental health office for vetted lab lists and local hazard maps.
        </div>
      </>
    ),
  },

  'disinfection-byproducts-tthm-haa5-explained': {
    title: 'Disinfection Byproducts (TTHM & HAA5): What They Are and How to Reduce Them',
    excerpt:
      'Disinfecting water creates byproducts like TTHM and HAA5. Here is what the acronyms mean, how EPA regulates them, and practical ways to lower exposure at home.',
    date: '2026-04-03',
    dateDisplay: 'April 3, 2026',
    readTime: '7 min read',
    badge: 'Health',
    badgeColor: '#f59e0b',
    topPick: {
      label: 'DBPs are regulated — but many people still prefer filtered drinking water',
      product: 'Waterdrop Under-Sink RO System',
      reason: 'RO reduces many drinking-water contaminants including DBPs for the water you consume most.',
      link: WATERDROP,
      amazon: `https://www.amazon.com/s?k=reverse+osmosis+under+sink+water+filter+nsf&tag=${AMAZON_TAG}`,
    },
    content: (
      <>
        <p style={pStyle}>
          Chlorine and chloramine keep distribution systems safe, but they also react with natural organic matter to form <strong style={strongStyle}>disinfection byproducts (DBPs)</strong>. Two common groups regulated in drinking water are <strong style={strongStyle}>trihalomethanes (TTHM)</strong> and <strong style={strongStyle}>haloacetic acids (HAA5)</strong>.
        </p>

        <h2 style={h2Style}>What TTHM and HAA5 are (in plain English)</h2>
        <p style={pStyle}>
          They are families of chemical byproducts formed when disinfectants react with organics in source water. Utilities manage them with source-water treatment, coagulation, and careful dosing — but levels can still approach limits during certain seasons or conditions.
        </p>

        <h2 style={h2Style}>How EPA regulates them</h2>
        <p style={pStyle}>
          EPA sets <strong style={strongStyle}>Maximum Contaminant Levels (MCLs)</strong> and uses <strong style={strongStyle}>running annual averages</strong> for TTHM/HAA5 compliance in many cases — your CCR should show whether the system was in compliance.
        </p>

        <div style={calloutStyle}>
          <strong style={strongStyle}>Why people filter anyway: </strong>
          Even when a system meets legal limits, some households (pregnancy, medical sensitivity) choose extra margin for water they drink and cook with — that is a personal risk tradeoff, not a regulatory failure by itself.
        </div>

        <h2 style={h2Style}>Health context (high level)</h2>
        <p style={pStyle}>
          Regulatory limits for DBPs balance long-term health risk against feasibility. If you want the deep dive, read your utility&apos;s CCR language on health effects — it is written for consumers and reviewed for accuracy.
        </p>

        <h2 style={h2Style}>Practical ways to reduce exposure</h2>
        <h3 style={h3Style}>1. Filter drinking and cooking water</h3>
        <p style={pStyle}>
          <strong style={strongStyle}>NSF-certified carbon systems</strong> and <strong style={strongStyle}>reverse osmosis</strong> are common approaches for point-of-use reduction. Whole-house filtration changes shower/bath exposure too, but sizing and maintenance are more complex — work with a qualified water treatment pro if you go that route.
        </p>
        <h3 style={h3Style}>2. Cold water for cooking</h3>
        <p style={pStyle}>
          Using cold tap water for cooking and preparing drinks reduces leaching of metals from plumbing and avoids concentrating some volatiles — it is a simple habit alongside filtration.
        </p>
        <h3 style={h3Style}>3. Stay informed</h3>
        <p style={pStyle}>
          If your system posts quarterly or annual DBP results, watch trends. Spikes can track seasonal algae or source-water changes.
        </p>

        <h2 style={h2Style}>Bottom line</h2>
        <p style={pStyle}>
          TTHM and HAA5 are normal, regulated consequences of making water microbiologically safe. Check your CCR for compliance, then decide if point-of-use filtration matches your comfort level for drinking water.
        </p>
      </>
    ),
  },
};
