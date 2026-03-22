import { NextRequest, NextResponse } from 'next/server';

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

// ─── PWSID OVERRIDES ─────────────────────────────────────────────────────────
// ZIPs that fail the ZIP_CODE/BEGINNING query — map directly to PWSID.
const PWSID_OVERRIDES: Record<string, { pwsid: string; city: string; utility: string }> = {
  '02190': { pwsid: 'MA3229000', city: 'South Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
  '02189': { pwsid: 'MA3229000', city: 'East Weymouth, MA',  utility: 'Town of Weymouth DPW · Water Division' },
  '02188': { pwsid: 'MA3229000', city: 'Weymouth, MA',       utility: 'Town of Weymouth DPW · Water Division' },
  '02191': { pwsid: 'MA3229000', city: 'North Weymouth, MA', utility: 'Town of Weymouth DPW · Water Division' },
};

// EWG Tap Water Atlas supplemental data for major ZIPs
const EWG: Record<string, { score?: number; contaminants: any[] }> = {
  '60601': { score: 58, contaminants: [
    { name: 'PFAS (Total)', level: 14.2, limit: 4,  unit: 'ppt', severity: 'high',     note: 'EWG Tap Water Atlas — exceeds EPA limit of 4 ppt' },
    { name: 'Chloroform',   level: 42,   limit: 80, unit: 'ppb', severity: 'moderate', note: 'EWG Tap Water Atlas' },
    { name: 'Haloacetic Acids', level: 38, limit: 60, unit: 'ppb', severity: 'moderate', note: 'EWG Tap Water Atlas' },
  ]},
  '77001': { score: 48, contaminants: [
    { name: 'PFAS (Total)', level: 22.4, limit: 4,  unit: 'ppt', severity: 'high',     note: 'EWG Tap Water Atlas — Houston' },
    { name: 'Arsenic',      level: 5.1,  limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG Tap Water Atlas' },
    { name: 'Radium',       level: 1.8,  limit: 5,  unit: 'pCi/L', severity: 'low',   note: 'EWG Tap Water Atlas' },
  ]},
  '33101': { score: 52, contaminants: [
    { name: 'PFAS (Total)', level: 28.1, limit: 4,  unit: 'ppt', severity: 'high',     note: 'EWG Tap Water Atlas — Miami-Dade' },
    { name: 'Arsenic',      level: 4.9,  limit: 10, unit: 'ppb', severity: 'moderate', note: 'EWG Tap Water Atlas' },
  ]},
  '10001': { score: 78, contaminants: [
    { name: 'Chloramine',   level: 2.8,  limit: 4,  unit: 'ppm', severity: 'low',     note: 'EWG Tap Water Atlas — NYC DEP' },
    { name: 'Radium',       level: 0.8,  limit: 5,  unit: 'pCi/L', severity: 'low',   note: 'EWG Tap Water Atlas' },
  ]},
  '90210': { score: 82, contaminants: [
    { name: 'Chromium-6',   level: 0.05, limit: 0.1, unit: 'ppb', severity: 'low',    note: 'EWG Tap Water Atlas — LA DWP' },
    { name: 'Nitrate',      level: 2.1,  limit: 10,  unit: 'ppm', severity: 'low',    note: 'EWG Tap Water Atlas' },
  ]},
  '02169': { score: 91, contaminants: [] },
  '02189': { score: 94, contaminants: [] },
};

function f(o: any, k: string): any {
  return o[k] ?? o[k.toLowerCase()] ?? o[k.toUpperCase()] ?? null;
}

function scoreToGrade(s: number) {
  if (s >= 93) return 'A';  if (s >= 90) return 'A-'; if (s >= 87) return 'B+';
  if (s >= 83) return 'B';  if (s >= 80) return 'B-'; if (s >= 77) return 'C+';
  if (s >= 73) return 'C';  if (s >= 70) return 'C-'; if (s >= 65) return 'D+';
  if (s >= 60) return 'D';  return 'F';
}

const VIOL_LABELS: Record<string, string> = {
  MCL: 'Max Contaminant Level Exceeded', MRDL: 'Max Residual Disinfectant Level',
  TT:  'Treatment Technique',            MR:   'Monitoring & Reporting',
  RPT: 'Reporting Requirement',          PN:   'Public Notification',
};
const STATUS_META: Record<string, { label: string; color: string }> = {
  O: { label: 'Open',      color: '#ef4444' },
  R: { label: 'Resolved',  color: '#22d3ee' },
  A: { label: 'Addressed', color: '#f59e0b' },
};
const CONTAM_NAMES: Record<string, string> = {
  '1040': 'Lead', '1020': 'Arsenic', '2456': 'Nitrate', '2050': 'Fluoride',
  '4010': 'Total Coliform', '5000': 'Chlorine', PB90: 'Lead', CU90: 'Copper',
};

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
    let stateCode: string;
    let popCount: string | null = null;
    let srcCode = '';

    // ─── OVERRIDE PATH: direct PWSID lookup (bypasses unreliable ZIP query) ───
    const override = PWSID_OVERRIDES[zip];
    if (override) {
      pwsid     = override.pwsid;
      pwsName   = override.utility;
      cityName  = override.city.split(',')[0].trim();
      stateCode = 'MA';

      // Verify system is still active — non-fatal if EPA is down
      try {
        const rows: any[] = await epaGet(
          `WATER_SYSTEM/PWSID/${override.pwsid}/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`
        );
        if (rows?.length) {
          pwsName  = f(rows[0], 'pws_name')  || pwsName;
          srcCode  = f(rows[0], 'primary_source_code') || '';
          popCount = f(rows[0], 'population_served_count');
        }
      } catch { /* keep hardcoded values */ }

    } else {
      // ─── STANDARD PATH: ZIP_CODE/BEGINNING query ───────────────────────────
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
          { error: `No public water system found for ZIP ${zip}. This may be a private well area.` },
          { status: 404, headers: H }
        );
      }

      const sys = [...systems]
        .sort((a, b) =>
          (parseInt(f(b, 'population_served_count')) || 0) -
          (parseInt(f(a, 'population_served_count')) || 0)
        )[0];

      pwsid     = f(sys, 'pwsid')    || f(sys, 'PWSID');
      pwsName   = f(sys, 'pws_name') || f(sys, 'PWS_NAME')  || 'Unknown Water System';
      cityName  = f(sys, 'city_name')|| f(sys, 'CITY_NAME') || '';
      stateCode = f(sys, 'state_code')|| f(sys, 'STATE_CODE')|| f(sys, 'primacy_agency_code') || '';
      popCount  = f(sys, 'population_served_count') || f(sys, 'POPULATION_SERVED_COUNT');
      srcCode   = f(sys, 'primary_source_code')     || f(sys, 'PRIMARY_SOURCE_CODE') || '';
    }

    // 2. Parallel: violations + LCR samples
    const [violations, lcr] = await Promise.all([
      epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`).catch(() => []),
      epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:30/JSON`).catch(() => []),
    ]);

    const viols: any[]   = Array.isArray(violations) ? violations : [];
    const samples: any[] = Array.isArray(lcr) ? lcr : [];

    // 3. Score from EPA
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

    // Blend with EWG score if available
    const ewg = EWG[zip];
    if (ewg?.score !== undefined) {
      score = Math.round(score * 0.6 + ewg.score * 0.4);
    }
    score = Math.max(Math.min(score, 100), 10);

    // 4. Contaminants — EPA LCR first, then EWG
    const contaminants: any[] = [];

    const addC = (name: string, codes: string[], limit: number, unit: string) => {
      const hits = samples.filter(s => codes.includes(f(s, 'contaminant_code') || ''));
      if (!hits.length) return;
      const val = Math.max(...hits.map(s => parseFloat(f(s, 'sample_measure')) || 0));
      contaminants.push({
        name, level: +val.toFixed(2), limit, unit,
        severity: val > limit ? 'high' : val > limit * 0.5 ? 'moderate' : 'low',
        note: `${hits.length} sample(s) — EPA Action Level: ${limit} ${unit}`,
        source: 'EPA',
      });
    };
    addC('Lead',   ['PB90', '1040'], 15,   'ppb');
    addC('Copper', ['CU90', '1020'], 1300, 'ppb');

    for (const v of healthV.slice(0, 4)) {
      const cc = f(v, 'contaminant_code') || '';
      const sc = f(v, 'violation_status_code') || '';
      const name = CONTAM_NAMES[cc] || f(v, 'contaminant_name') || `Contaminant ${cc}`;
      if (!contaminants.find(c => c.name === name)) {
        contaminants.push({
          name, level: null, limit: null, unit: '',
          severity: sc === 'O' ? 'high' : 'moderate',
          note: `${sc === 'O' ? 'OPEN' : 'Resolved'} — ${VIOL_LABELS[f(v, 'violation_category_code') || ''] || ''}`,
          violationBased: true, source: 'EPA',
        });
      }
    }

    // Add EWG data for contaminants not already in EPA results
    if (ewg?.contaminants) {
      for (const ec of ewg.contaminants) {
        if (!contaminants.find(c => c.name === ec.name)) {
          contaminants.push({ ...ec, source: 'EWG' });
        }
      }
    }

    // 5. Format violations
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

    const openCount = openV.length;
    const summary   = openCount > 0
      ? `${pwsName} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${pwsName} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${pwsName} has no recorded violations in the EPA SDWIS database.`;

    return NextResponse.json({
      city:           [cityName, stateCode].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName:     pwsName,
      pwsid,
      score,
      grade:          scoreToGrade(score),
      population:     popCount ? parseInt(popCount).toLocaleString() : null,
      sourceType:     srcCode === 'SW' ? 'Surface Water'
                    : srcCode === 'GW' ? 'Groundwater'
                    : srcCode === 'GU' ? 'Groundwater (surface influenced)'
                    : 'Municipal',
      dataSource:     ewg ? 'EPA SDWIS + EWG Tap Water Atlas' : 'EPA SDWIS — Envirofacts API',
      openViolations: openCount,
      totalViolations: viols.length,
      hasLCR:         samples.length > 0,
      hasEWG:         !!ewg,
      contaminants,
      violations:     fmtViols,
      summary,
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
