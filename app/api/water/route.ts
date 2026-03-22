import { NextRequest, NextResponse } from 'next/server';

const EPA = 'https://data.epa.gov/efservice';

async function epaGet(path: string) {
  const res = await fetch(`${EPA}/${path}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`EPA ${res.status} for ${path}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

// Helper: get field value regardless of case (EPA returns lowercase)
function f(obj: any, key: string): any {
  return obj[key] ?? obj[key.toLowerCase()] ?? obj[key.toUpperCase()] ?? null;
}

function scoreToGrade(s: number) {
  if (s >= 93) return 'A';
  if (s >= 90) return 'A-';
  if (s >= 87) return 'B+';
  if (s >= 83) return 'B';
  if (s >= 80) return 'B-';
  if (s >= 77) return 'C+';
  if (s >= 73) return 'C';
  if (s >= 70) return 'C-';
  if (s >= 65) return 'D+';
  if (s >= 60) return 'D';
  return 'F';
}

const VIOL_LABELS: Record<string, string> = {
  MCL:  'Max Contaminant Level Exceeded',
  MRDL: 'Max Residual Disinfectant Level',
  TT:   'Treatment Technique',
  MR:   'Monitoring & Reporting',
  RPT:  'Reporting Requirement',
  PN:   'Public Notification',
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  O: { label: 'Open',      color: '#ef4444' },
  R: { label: 'Resolved',  color: '#22d3ee' },
  A: { label: 'Addressed', color: '#f59e0b' },
};

const CONTAM_NAMES: Record<string, string> = {
  '1040': 'Lead', '1020': 'Arsenic', '2456': 'Nitrate',
  '2050': 'Fluoride', '4010': 'Total Coliform', '5000': 'Chlorine',
  PB90: 'Lead', CU90: 'Copper',
};

export async function GET(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  const zip = req.nextUrl.searchParams.get('zip');
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400, headers });
  }

  try {
    // 1. Find water systems — try CWS first, then all active
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
        { status: 404, headers }
      );
    }

    // Pick largest system by population
    const system = [...systems]
      .sort((a, b) => (parseInt(f(b, 'population_served_count')) || 0) - (parseInt(f(a, 'population_served_count')) || 0))[0];

    const pwsid = f(system, 'pwsid') || f(system, 'PWSID');
    const pwsName = f(system, 'pws_name') || f(system, 'PWS_NAME') || 'Unknown Water System';
    const cityName = f(system, 'city_name') || f(system, 'CITY_NAME') || '';
    const stateCode = f(system, 'state_code') || f(system, 'STATE_CODE') || f(system, 'primacy_agency_code') || '';
    const popCount = f(system, 'population_served_count') || f(system, 'POPULATION_SERVED_COUNT');
    const srcCode = f(system, 'primary_source_code') || f(system, 'PRIMARY_SOURCE_CODE') || '';

    // 2. Parallel: violations + LCR
    const [violations, lcr] = await Promise.all([
      epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`).catch(() => []),
      epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:30/JSON`).catch(() => []),
    ]);

    const viols: any[] = Array.isArray(violations) ? violations : [];
    const samples: any[] = Array.isArray(lcr) ? lcr : [];

    // 3. Score
    let score = 100;
    const openViols = viols.filter(v => (f(v,'violation_status_code')||'') === 'O');
    const healthViols = viols.filter(v => ['MCL','MRDL','TT'].includes(f(v,'violation_category_code')||''));
    score -= Math.min(openViols.length * 8, 40);
    score -= Math.min(healthViols.length * 6, 30);

    const leadSamples = samples.filter(s => ['PB90','1040'].includes(f(s,'contaminant_code')||''));
    if (leadSamples.length) {
      const maxLead = Math.max(...leadSamples.map(s => parseFloat(f(s,'sample_measure')) || 0));
      if (maxLead > 15) score -= 20;
      else if (maxLead > 10) score -= 12;
      else if (maxLead > 5) score -= 5;
    }
    score = Math.max(Math.min(Math.round(score), 100), 10);

    // 4. Contaminants from LCR
    const contaminants: any[] = [];
    const addC = (name: string, codes: string[], limit: number, unit: string) => {
      const hits = samples.filter(s => codes.includes(f(s,'contaminant_code')||''));
      if (!hits.length) return;
      const val = Math.max(...hits.map(s => parseFloat(f(s,'sample_measure')) || 0));
      contaminants.push({
        name, level: +val.toFixed(2), limit, unit,
        severity: val > limit ? 'high' : val > limit * 0.5 ? 'moderate' : 'low',
        note: `${hits.length} sample(s) on file — EPA Action Level: ${limit} ${unit}`,
      });
    };
    addC('Lead',   ['PB90','1040'], 15,   'ppb');
    addC('Copper', ['CU90','1020'], 1300, 'ppb');

    for (const v of healthViols.slice(0, 4)) {
      const contamCode = f(v,'contaminant_code') || '';
      const name = CONTAM_NAMES[contamCode] || f(v,'contaminant_name') || `Contaminant ${contamCode}`;
      if (!contaminants.find(c => c.name === name)) {
        const statusCode = f(v,'violation_status_code') || '';
        contaminants.push({
          name, level: null, limit: null, unit: '',
          severity: statusCode === 'O' ? 'high' : 'moderate',
          note: `${statusCode === 'O' ? 'OPEN' : 'Resolved'} — ${VIOL_LABELS[f(v,'violation_category_code')||''] || ''}`,
          violationBased: true,
        });
      }
    }

    // 5. Format violations
    const fmtViols = [...viols]
      .sort((a, b) => {
        const da = new Date(f(b,'compliance_period_begin_date') || 0).getTime();
        const db = new Date(f(a,'compliance_period_begin_date') || 0).getTime();
        return da - db;
      })
      .slice(0, 10)
      .map(v => {
        const catCode = f(v,'violation_category_code') || '';
        const statusCode = f(v,'violation_status_code') || '';
        const contamCode = f(v,'contaminant_code') || '';
        return {
          rule: VIOL_LABELS[catCode] || catCode || 'Violation',
          contaminant: CONTAM_NAMES[contamCode] || f(v,'contaminant_name') || '',
          year: (f(v,'compliance_period_begin_date') || '').slice(0, 4) || '—',
          status: STATUS_META[statusCode]?.label || statusCode || '—',
          statusColor: STATUS_META[statusCode]?.color || '#94a3b8',
        };
      });

    const openCount = openViols.length;
    const summary = openCount > 0
      ? `${pwsName} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${pwsName} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${pwsName} has no recorded violations in the EPA SDWIS database.`;

    const sourceType = srcCode === 'SW' ? 'Surface Water'
                     : srcCode === 'GW' ? 'Groundwater'
                     : srcCode === 'GU' ? 'Groundwater (surface influenced)'
                     : 'Municipal';

    return NextResponse.json({
      city: [cityName, stateCode].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName: pwsName,
      pwsid,
      score,
      grade: scoreToGrade(score),
      population: popCount ? parseInt(popCount).toLocaleString() : null,
      sourceType,
      dataSource: 'EPA SDWIS — Envirofacts API',
      openViolations: openCount,
      totalViolations: viols.length,
      hasLCR: samples.length > 0,
      contaminants,
      violations: fmtViols,
      summary,
    }, { headers });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'EPA API error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
