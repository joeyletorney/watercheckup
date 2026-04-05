import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllAudienceContacts,
  getOrCreateWatercheckupAudienceId,
} from '../resend-audience';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

type Product = { name: string; tag: string; why: string; search: string };
type Issue = { subject: string; headline: string; intro: string; sections: { color: string; title: string; body: string }[]; action: string; products: Product[] };

const ISSUES: Issue[] = [
  {
    subject: "The invisible lead risk in your home's water",
    headline: "Lead: the contaminant hiding in plain sight",
    intro: "Lead contamination rarely comes from the water source — it comes from the pipes and fixtures inside your home. Even if your utility reports clean water, it can pick up lead on the way to your tap.",
    sections: [
      { color: "#f87171", title: "Why it matters", body: "There is no safe level of lead exposure. It causes irreversible cognitive damage in children and is linked to hypertension and kidney disease in adults. The CDC says no blood lead level is safe for children." },
      { color: "#fb923c", title: "Who is most at risk", body: "Homes built before 1986 are most likely to have lead solder or pipes. Renters in older apartment buildings often have no idea what's in their plumbing. Low-income communities are disproportionately affected." },
      { color: "#facc15", title: "What actually removes it", body: "Only NSF/ANSI 53-certified filters are verified to remove lead. Pitcher filters like Brita Standard do not remove lead. Look for reverse osmosis or solid carbon block filters with NSF 53 certification." },
    ],
    action: "Check if your ZIP has lead violations on record",
    products: [
      { name: "Clearly Filtered Water Pitcher", tag: "NSF 53 · removes lead 99.5%+", why: "One of the few pitcher filters independently certified to remove lead. Also removes PFAS, chlorine, and hundreds of other contaminants.", search: "Clearly Filtered Water Pitcher" },
      { name: "Aquasana Under-Sink Filter System", tag: "NSF 42, 53 & 401 · solid carbon block", why: "Certified to remove lead, PFAS, chlorine, and pharmaceuticals. Solid carbon block design is highly effective for lead — more so than granular carbon.", search: "Aquasana under-sink water filter system" },
      { name: "ZeroWater 5-Stage Pitcher", tag: "NSF 53 · reduces lead & chromium", why: "5-stage ion exchange filtration brings TDS (total dissolved solids) to near zero. NSF 53 certified for lead and chromium reduction. Includes a free TDS meter.", search: "ZeroWater 5 stage pitcher filter" },
      { name: "PUR PLUS Faucet Mount Filter", tag: "NSF 53 · easy installation", why: "Mounts directly to your faucet and is NSF 53 certified for lead reduction. One of the most affordable certified options — no pitcher needed.", search: "PUR PLUS faucet mount water filter" },
    ],
  },
  {
    subject: "PFAS: why 'forever chemicals' are still in most tap water",
    headline: "Forever chemicals — and why they don't go away",
    intro: "PFAS (per- and polyfluoroalkyl substances) have been used in manufacturing since the 1940s. They're in non-stick pans, food packaging, firefighting foam — and now in the drinking water of millions of Americans.",
    sections: [
      { color: "#a78bfa", title: "What makes them dangerous", body: "PFAS accumulate in the body over time. Long-term exposure is linked to kidney and testicular cancer, thyroid disease, immune dysfunction, and adverse pregnancy outcomes. They don't break down in the environment or in your body." },
      { color: "#fb923c", title: "Where they come from", body: "Military bases and airports that used PFAS-containing firefighting foam are the most common sources. Industrial sites, wastewater treatment plants, and landfills also contribute. Many water systems near these sites are contaminated." },
      { color: "#34d399", title: "How to protect yourself", body: "Activated carbon filters (NSF 58 certified) and reverse osmosis systems are the most effective at removing PFAS. Boiling does not remove PFAS — it concentrates them. Check your utility's annual report for PFAS testing results." },
    ],
    action: "See if PFAS have been detected in your water system",
    products: [
      { name: "APEC Water ROES-50 Reverse Osmosis System", tag: "NSF 58 · removes PFAS, lead, arsenic", why: "A top-rated under-sink RO system that removes PFAS, lead, arsenic, nitrates, and hundreds of other contaminants. RO is the gold standard for PFAS — no pitcher filter comes close.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Waterdrop G3 Tankless RO System", tag: "Tankless design · fast flow rate", why: "Modern tankless design with no bulky storage tank. NSF 58 certified, removes PFAS and lead, and has a 3:1 pure-to-drain ratio — much less water waste than traditional RO systems.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "Clearly Filtered Water Pitcher", tag: "NSF 244 · removes PFAS 99%+", why: "The most effective pitcher filter for PFAS removal, independently tested to remove PFOA, PFOS, and other PFAS compounds by 99%+. A no-installation option for renters.", search: "Clearly Filtered Water Pitcher PFAS" },
      { name: "iSpring RCC7 Under-Sink RO System", tag: "NSF 58 · 5-stage filtration", why: "A reliable and widely reviewed 5-stage RO system at a lower price point. Removes PFAS, lead, nitrates, arsenic, and fluoride. Good value for comprehensive protection.", search: "iSpring RCC7 reverse osmosis system" },
    ],
  },
  {
    subject: "The hidden byproducts of 'safe' treated water",
    headline: "Disinfection byproducts: the tradeoff in treated water",
    intro: "Utilities add chlorine or chloramine to kill bacteria — which is a good thing. But when these disinfectants react with naturally occurring organic matter in water, they form a class of chemicals called disinfection byproducts (DBPs).",
    sections: [
      { color: "#f87171", title: "The most common DBPs", body: "Trihalomethanes (THMs) and haloacetic acids (HAAs) are the most studied DBPs. Long-term exposure is associated with bladder cancer, colorectal cancer, and adverse birth outcomes including low birth weight and neural tube defects." },
      { color: "#facc15", title: "Are they regulated?", body: "Yes — but the EPA's limits were set decades ago and many researchers believe they're not protective enough. Utilities test for DBPs but averages can mask spikes that occur seasonally when organic matter is highest." },
      { color: "#22d3ee", title: "How to reduce exposure", body: "Activated carbon filters (NSF 42 or 53 certified) effectively reduce THMs and HAAs. Letting water sit uncovered in the fridge for a few hours also allows some volatile DBPs to off-gas. Reverse osmosis removes them almost entirely." },
    ],
    action: "Check your utility's THM and HAA5 levels",
    products: [
      { name: "Brita Longlast+ Filter Pitcher", tag: "NSF 42 & 53 · reduces chlorine & DBPs", why: "The Longlast+ cartridge is NSF 53 certified and reduces chlorine, chloramine, and DBPs. Lasts 6 months vs. 2 for standard filters — better value and more effective.", search: "Brita Longlast+ pitcher filter" },
      { name: "Aquasana Countertop Water Filter", tag: "NSF 42 & 53 · no installation needed", why: "Sits on your counter and connects to your faucet. Certified to reduce chlorine, chloramine, DBPs, lead, and PFAS. A strong mid-range option with no under-sink installation required.", search: "Aquasana countertop water filter" },
      { name: "Clearly Filtered Water Pitcher", tag: "Removes 99%+ chlorine & DBPs", why: "Independently tested to remove THMs and HAAs along with lead, PFAS, and fluoride. One of the most comprehensive pitcher filters on the market.", search: "Clearly Filtered Water Pitcher" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · removes DBPs completely", why: "For those who want the most thorough protection, RO removes virtually all disinfection byproducts. This is the most complete solution if DBPs are a concern in your area.", search: "APEC ROES-50 reverse osmosis system" },
    ],
  },
  {
    subject: "Nitrates in drinking water: the farm runoff no one talks about",
    headline: "Nitrates: an invisible agricultural byproduct in your water",
    intro: "Nitrates enter water supplies through fertilizer runoff, livestock waste, and septic systems. They're colorless, odorless, and tasteless — and they're one of the most common groundwater contaminants in rural and agricultural areas.",
    sections: [
      { color: "#f87171", title: "The infant risk", body: "High nitrate levels cause 'blue baby syndrome' (methemoglobinemia) in infants under 6 months, where the blood loses its ability to carry oxygen. It can be fatal. The EPA limit is 10 mg/L — but some researchers argue that's still too high." },
      { color: "#fb923c", title: "Adult health concerns", body: "Emerging research links long-term nitrate exposure to colorectal cancer and thyroid dysfunction in adults. These associations exist even at levels below the current EPA limit." },
      { color: "#facc15", title: "Critical: don't boil it", body: "Boiling water does NOT remove nitrates — it makes the concentration worse as water evaporates. The only effective removal methods are reverse osmosis, ion exchange, and distillation." },
    ],
    action: "Run your local water report to check nitrate levels",
    products: [
      { name: "iSpring RCC7 Under-Sink RO System", tag: "NSF 58 · removes nitrates, lead, PFAS", why: "RO is the only reliably effective method for removing nitrates. The RCC7 is a highly rated 5-stage system that handles nitrates, lead, arsenic, and PFAS. Do not use a carbon filter for nitrates — it won't work.", search: "iSpring RCC7 reverse osmosis system" },
      { name: "APEC Water ROES-50 RO System", tag: "NSF 58 · 5-stage under-sink", why: "Another top-rated RO option with consistent reviews for nitrate removal. Easy DIY installation with detailed instructions included.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Home Master TMAFC-ERP RO System", tag: "Remineralizes after filtering", why: "Removes nitrates and then adds beneficial minerals back in through a remineralization stage. Addresses the common complaint that RO water tastes flat.", search: "Home Master TMAFC-ERP reverse osmosis" },
      { name: "Express Water RO5DX RO System", tag: "Budget-friendly · 5-stage RO", why: "A lower-cost entry point into reverse osmosis filtration. Removes nitrates, lead, and PFAS. Good option for renters who want RO protection without a large upfront investment.", search: "Express Water RO5DX reverse osmosis system" },
    ],
  },
  {
    subject: "Microplastics in tap water: what we know so far",
    headline: "Microplastics: the contaminant science is still catching up to",
    intro: "A 2017 study found microplastics in 83% of tap water samples worldwide. Researchers are still working to understand the full health implications — but the plastics are definitely there.",
    sections: [
      { color: "#a78bfa", title: "How they get in", body: "Microplastics enter water from plastic pipes, bottle caps, clothing fibers, and industrial runoff. Conventional water treatment was not designed to remove particles this small, and most utilities don't test for them." },
      { color: "#f87171", title: "What the research shows", body: "Studies have found microplastics in human blood, lung tissue, and placentas. While direct causation is hard to establish, microplastics can carry toxic chemicals including heavy metals and pesticides into the body." },
      { color: "#34d399", title: "Reducing your exposure", body: "Reverse osmosis filters with membranes fine enough to block particles smaller than 1 micron are the most effective option. Avoiding single-use plastic bottles also reduces exposure since plastic leaches into the water inside them." },
    ],
    action: "See what contaminants are detected in your water system",
    products: [
      { name: "Berkey Travel Water Filter", tag: "Gravity filter · removes microplastics & bacteria", why: "Berkey's black filter elements remove microplastics, bacteria, viruses, and heavy metals without electricity or water pressure. Works anywhere — no installation required.", search: "Berkey Travel Water Filter" },
      { name: "Waterdrop G3 Tankless RO System", tag: "Sub-micron membrane · blocks microplastics", why: "RO membranes block particles down to 0.0001 microns — far smaller than microplastics. The G3's tankless design also means no stagnant water sitting in a storage tank.", search: "Waterdrop G3 tankless reverse osmosis system" },
      { name: "LifeStraw Home Pitcher", tag: "Hollow fiber + carbon · removes microplastics", why: "Uses hollow fiber membrane filtration to physically block microplastics and bacteria, plus activated carbon for chlorine and taste. A solid pitcher option that goes beyond standard carbon-only filters.", search: "LifeStraw Home water filter pitcher" },
      { name: "Clearly Filtered Water Pitcher", tag: "Tested for microplastic reduction", why: "Independently tested to reduce microplastics along with PFAS, lead, and fluoride. One of the most thoroughly tested pitcher filters available.", search: "Clearly Filtered Water Pitcher microplastics" },
    ],
  },
  {
    subject: "Arsenic in drinking water: a natural risk that's still widespread",
    headline: "Arsenic: naturally occurring, quietly dangerous",
    intro: "Arsenic occurs naturally in rock and soil, and dissolves into groundwater — especially in the western US, New England, and the upper Midwest. It's also a byproduct of mining and industrial activity.",
    sections: [
      { color: "#f87171", title: "The health risk", body: "Long-term arsenic exposure is linked to bladder, lung, and skin cancers. It's also associated with cardiovascular disease, diabetes, and neurological effects in children. The EPA limit is 10 ppb — but the WHO and many scientists say 1 ppb would be safer." },
      { color: "#fb923c", title: "Well water users beware", body: "If you use a private well, you are responsible for testing it yourself. The EPA's arsenic standard does not apply to private wells. Many rural homeowners have never tested their well water for arsenic." },
      { color: "#22d3ee", title: "Effective removal", body: "Reverse osmosis removes arsenic effectively. So does activated alumina and iron-based filtration. Standard carbon filters do not remove arsenic. Make sure your filter is NSF 58 certified for arsenic reduction." },
    ],
    action: "Check if arsenic has been detected in your area",
    products: [
      { name: "APEC Water ROES-PH75 RO + Alkaline System", tag: "NSF 58 · removes arsenic + remineralizes", why: "Removes arsenic, PFAS, lead, and nitrates through RO, then adds beneficial minerals back through a remineralization stage. Addresses the flat taste common with standard RO water.", search: "APEC ROES-PH75 reverse osmosis alkaline system" },
      { name: "iSpring RCC7AK RO + Alkaline System", tag: "NSF 58 · 6-stage with remineralization", why: "6-stage RO system with an alkaline remineralization filter. Certified for arsenic, lead, and PFAS removal while restoring a balanced pH and mineral content.", search: "iSpring RCC7AK reverse osmosis alkaline system" },
      { name: "Aquasana OptimH2O RO + Remineralization", tag: "NSF 58 & 177 · whole-system certified", why: "A premium RO system certified to remove arsenic, PFAS, lead, and chromium-6. The remineralization stage adds calcium, magnesium, and potassium back into the filtered water.", search: "Aquasana OptimH2O reverse osmosis remineralization" },
      { name: "APEC ROES-50 RO System", tag: "Budget-friendly arsenic removal", why: "If remineralization isn't a priority, the ROES-50 is a proven, affordable under-sink RO system that effectively removes arsenic along with lead, PFAS, and nitrates.", search: "APEC ROES-50 reverse osmosis system" },
    ],
  },
  {
    subject: "How to actually read your water utility's annual report",
    headline: "Your utility's annual report: what the numbers mean",
    intro: "Every year, your water utility is required by law to send you a Consumer Confidence Report (CCR). Most people throw it away. Here's how to read it in under 5 minutes.",
    sections: [
      { color: "#22d3ee", title: "Find the contaminant table", body: "The CCR includes a table listing contaminants detected, their levels, and the EPA's Maximum Contaminant Level (MCL). If a contaminant shows 'ND' (not detected), that's good. Look for anything approaching or exceeding the MCL." },
      { color: "#facc15", title: "Watch out for averages", body: "Utilities report annual averages. A low annual average can hide seasonal spikes — especially for disinfection byproducts, which peak in summer when organic matter is highest. Ask your utility for quarterly data if you're concerned." },
      { color: "#a78bfa", title: "Violations vs. detections", body: "A detection means a contaminant was found. A violation means the level exceeded the legal limit. Utilities are required to notify you of violations — but not all contaminants have legal limits yet (like PFAS until recently)." },
    ],
    action: "Run your free WaterCheckup report to see your utility's data",
    products: [
      { name: "Tap Score Advanced City Water Test", tag: "Lab-certified · 111 contaminants", why: "Send a water sample to a certified lab and get a detailed report with contaminant levels and personalized filter recommendations. The best way to know exactly what's in your specific tap water.", search: "Tap Score Advanced City Water Test" },
      { name: "Safe Home COMPLETE Water Quality Test Kit", tag: "Tests 200+ contaminants", why: "One of the most comprehensive DIY water test kits available. Tests for 200+ parameters including heavy metals, pesticides, bacteria, and PFAS. Results from a certified lab in about a week.", search: "Safe Home COMPLETE water quality test kit" },
      { name: "WaterCheck by National Testing Laboratories", tag: "City water test · 93 contaminants", why: "A well-established lab testing service covering 93 contaminants including lead, nitrates, bacteria, and disinfection byproducts. Comes with a detailed interpretation guide.", search: "WaterCheck National Testing Laboratories city water test" },
      { name: "Varify 17-in-1 Water Test Strips", tag: "Instant results · quick screening", why: "Not as thorough as lab testing, but useful for a quick screen of your water's pH, hardness, chlorine, lead, and nitrate levels. Good starting point before investing in a lab test or filter.", search: "Varify 17 in 1 water test strips" },
    ],
  },
  {
    subject: "Which water filter actually works for your situation?",
    headline: "Water filters: cutting through the marketing to what actually works",
    intro: "The water filter market is full of bold claims. Here's what the certifications actually mean and how to match a filter to the specific contaminants in your water.",
    sections: [
      { color: "#34d399", title: "NSF certifications matter", body: "NSF/ANSI 42 covers aesthetic contaminants like chlorine taste and odor. NSF/ANSI 53 covers health-related contaminants like lead and VOCs. NSF/ANSI 58 covers reverse osmosis systems. Always verify the specific contaminants a filter is certified to reduce — not just the standard number." },
      { color: "#22d3ee", title: "Pitcher filters: limited protection", body: "Standard Brita and PUR pitchers (without specific certified cartridges) reduce chlorine taste but do not remove lead, PFAS, nitrates, or arsenic. Brita's Longlast+ filter is NSF 53 certified for lead. Read the label carefully." },
      { color: "#fb923c", title: "Reverse osmosis: the most comprehensive", body: "Under-sink RO systems with NSF 58 certification remove the widest range of contaminants including lead, PFAS, nitrates, arsenic, and microplastics. They waste 3-4 gallons of water per gallon filtered. Remineralization filters can add back beneficial minerals." },
    ],
    action: "See what contaminants are in your water to choose the right filter",
    products: [
      { name: "Aquasana 3-Stage Under-Sink Filter", tag: "NSF 42, 53 & 401 · broad-spectrum", why: "Certified for lead, PFAS, chlorine, and pharmaceuticals. A strong middle ground — more effective than a pitcher, easier than a full RO system, and doesn't waste water.", search: "Aquasana 3-stage under-sink water filter" },
      { name: "Clearly Filtered Water Pitcher", tag: "Best pitcher for comprehensive protection", why: "Removes 270+ contaminants including lead, PFAS, fluoride, and DBPs. The most thorough pitcher filter if you want real protection without any installation.", search: "Clearly Filtered Water Pitcher" },
      { name: "APEC ROES-50 Reverse Osmosis System", tag: "NSF 58 · most comprehensive filtration", why: "The highest level of protection available for home use. Removes virtually everything — lead, PFAS, nitrates, arsenic, microplastics, and DBPs. Best choice if your water has multiple concerns.", search: "APEC ROES-50 reverse osmosis system" },
      { name: "Waterdrop G3 Tankless RO System", tag: "Modern design · low water waste", why: "A premium tankless RO system with a 3:1 pure-to-drain ratio and fast flow rate. NSF certified and a good fit for households that want RO performance in a sleeker package.", search: "Waterdrop G3 tankless reverse osmosis system" },
    ],
  },
];

function getWeekNumber(date: Date): number {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
}

function buildWeeklyHtml(issue: Issue): string {
  const sectionsHtml = issue.sections.map(s => `
    <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:10px">
      <div style="font-size:14px;font-weight:700;color:${s.color};margin-bottom:4px">${s.title}</div>
      <div style="font-size:13px;color:#cbd5e1;line-height:1.6">${s.body}</div>
    </div>`).join('');

  const productsHtml = issue.products.map(p => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(p.search)}`;
    return `
    <div style="background:#0b1e36;border:1px solid #1e3a4a;border-radius:10px;padding:16px;margin-bottom:10px">
      <div style="font-size:14px;font-weight:700;color:#f1f5f9;margin-bottom:3px">${p.name}</div>
      <div style="font-size:11px;color:#22d3ee;margin-bottom:8px">${p.tag}</div>
      <div style="font-size:13px;color:#cbd5e1;line-height:1.6;margin-bottom:12px">${p.why}</div>
      <a href="${url}" style="display:inline-block;padding:8px 14px;background:#f59e0b;border-radius:6px;color:#0f172a;text-decoration:none;font-size:12px;font-weight:700">View on Amazon →</a>
    </div>`;
  }).join('');

  return `<!doctype html><html><body style="margin:0;background:#050e17;color:#e2e8f0;font-family:Arial,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:32px 24px">
    <div style="font-size:11px;color:#475569;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">WaterCheckup Weekly</div>
    <div style="font-size:22px;font-weight:800;color:#f1f5f9;margin-bottom:8px">${issue.headline}</div>
    <div style="font-size:14px;color:#94a3b8;line-height:1.7;margin-bottom:24px">${issue.intro}</div>
    ${sectionsHtml}
    <div style="margin-top:24px;margin-bottom:20px;font-size:13px;color:#94a3b8;line-height:1.7">${issue.action} — your free local report pulls live data from the EPA and your utility.</div>
    <a href="https://watercheckup.com" style="display:inline-block;padding:12px 20px;background:#0891b2;border-radius:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:700">Run my free water report →</a>

    <div style="margin-top:32px;border-top:1px solid #1e3a4a;padding-top:24px">
      <div style="font-size:15px;font-weight:700;color:#f1f5f9;margin-bottom:4px">This week's top picks</div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:16px">Recommended products for this week's topic</div>
      ${productsHtml}
    </div>

    <div style="margin-top:24px;font-size:11px;color:#475569;line-height:1.6">You're receiving this because you subscribed at watercheckup.com. We send one email per week, no spam. Reply to unsubscribe at any time.</div>
  </div>
  </body></html>`;
}

/**
 * Vercel Cron: Mondays 14:00 UTC (vercel.json). Requires RESEND_API_KEY (+ verified RESEND_FROM_EMAIL).
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

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error(
        '[newsletter/weekly] RESEND_API_KEY is not set — weekly emails are not sent. Add it in Vercel → Project → Settings → Environment Variables.',
      );
      return NextResponse.json(
        {
          success: false,
          skipped: true,
          reason: 'RESEND_API_KEY is not configured',
          hint: 'Add RESEND_API_KEY (and verify RESEND_FROM_EMAIL on your domain) in Vercel environment variables.',
        },
        { status: 503, headers: CORS },
      );
    }

    const audienceId = await getOrCreateWatercheckupAudienceId(apiKey);
    if (!audienceId) {
      console.error('[newsletter/weekly] Could not resolve or create Resend audience "WaterCheckup".');
      return NextResponse.json(
        { success: false, error: 'Audience unavailable — check RESEND_API_KEY and Resend dashboard.' },
        { status: 500, headers: CORS },
      );
    }

    let contacts;
    try {
      contacts = await fetchAllAudienceContacts(apiKey, audienceId);
    } catch (e) {
      console.error('[newsletter/weekly] Failed to list contacts:', e);
      return NextResponse.json({ success: false, error: 'Unable to fetch contacts' }, { status: 500, headers: CORS });
    }

    const active = contacts.filter(c => c?.email && c?.unsubscribed !== true);
    const weekly = active.filter(c => String(c?.data?.weekly_opt_in ?? 'true') !== 'false');

    if (!weekly.length) {
      return NextResponse.json(
        { success: true, sent: 0, total: 0, message: 'No weekly opt-in contacts in audience yet.' },
        { headers: CORS },
      );
    }

    const weekNum = getWeekNumber(new Date());
    const issue = ISSUES[weekNum % ISSUES.length];
    const html = buildWeeklyHtml(issue);
    const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <onboarding@resend.dev>';
    let sent = 0;
    const failed: string[] = [];
    for (const c of weekly) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [c.email],
          subject: issue.subject,
          html,
        }),
      });
      if (r.ok) sent += 1;
      else failed.push(c.email || '(unknown)');
    }

    if (failed.length) {
      console.warn(`[newsletter/weekly] Sent ${sent}/${weekly.length}; failed for: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? '…' : ''}`);
    } else {
      console.log(`[newsletter/weekly] Sent ${sent} weekly email(s).`);
    }

    return NextResponse.json({ success: true, sent, total: weekly.length, failed: failed.length }, { headers: CORS });
  } catch (err: any) {
    console.error('[newsletter/weekly]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}
