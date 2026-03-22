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
  // CORS
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
    // 1. Find water systems
    let systems: any[] = await epaGet(
      `WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/PWS_ACTIVITY_CODE/A/rows/1:10/JSON`
    ).catch(() => []);

    if (!systems?.length) {
      systems = await epaGet(`WATER_SYSTEM/ZIP_CODE/BEGINNING/${zip}/rows/1:10/JSON`).catch(() => []);
    }
    if (!systems?.length) {
      return NextResponse.json(
        { error: `No public water system found for ZIP ${zip}. This may be a private well area.` },
        { status: 404, headers }
      );
    }

    // Pick largest active CWS
    const system = [...systems]
      .filter(s => s.PWS_ACTIVITY_CODE === 'A' || !s.PWS_ACTIVITY_CODE)
      .sort((a, b) => (parseInt(b.POPULATION_SERVED_COUNT) || 0) - (parseInt(a.POPULATION_SERVED_COUNT) || 0))[0]
      || systems[0];

    const pwsid = system.PWSID;

    // 2. Parallel fetch
    const [violations, lcr] = await Promise.all([
      epaGet(`SDWA_VIOLATIONS/PWSID/${pwsid}/rows/1:50/JSON`).catch(() => []),
      epaGet(`LCR_SAMPLE_RESULT/PWSID/${pwsid}/rows/1:30/JSON`).catch(() => []),
    ]);

    const viols: any[] = Array.isArray(violations) ? violations : [];
    const samples: any[] = Array.isArray(lcr) ? lcr : [];

    // 3. Score
    let score = 100;
    const openViols = viols.filter(v => v.VIOLATION_STATUS_CODE === 'O');
    const healthViols = viols.filter(v => ['MCL', 'MRDL', 'TT'].includes(v.VIOLATION_CATEGORY_CODE));
    score -= Math.min(openViols.length * 8, 40);
    score -= Math.min(healthViols.length * 6, 30);

    const leadSamples = samples.filter(s => ['PB90', '1040'].includes(s.CONTAMINANT_CODE));
    if (leadSamples.length) {
      const maxLead = Math.max(...leadSamples.map(s => parseFloat(s.SAMPLE_MEASURE) || 0));
      if (maxLead > 15) score -= 20;
      else if (maxLead > 10) score -= 12;
      else if (maxLead > 5) score -= 5;
    }
    score = Math.max(Math.min(Math.round(score), 100), 10);

    // 4. Contaminants
    const contaminants: any[] = [];
    const addC = (name: string, codes: string[], limit: number, unit: string) => {
      const hits = samples.filter(s => codes.includes(s.CONTAMINANT_CODE));
      if (!hits.length) return;
      const val = Math.max(...hits.map(s => parseFloat(s.SAMPLE_MEASURE) || 0));
      contaminants.push({
        name, level: +val.toFixed(2), limit, unit,
        severity: val > limit ? 'high' : val > limit * 0.5 ? 'moderate' : 'low',
        note: `${hits.length} sample(s) on file — EPA Action Level: ${limit} ${unit}`,
      });
    };
    addC('Lead',   ['PB90', '1040'], 15,   'ppb');
    addC('Copper', ['CU90', '1020'], 1300, 'ppb');

    for (const v of healthViols.slice(0, 4)) {
      const name = CONTAM_NAMES[v.CONTAMINANT_CODE] || v.CONTAMINANT_NAME || `Contaminant ${v.CONTAMINANT_CODE}`;
      if (!contaminants.find(c => c.name === name)) {
        contaminants.push({
          name, level: null, limit: null, unit: '',
          severity: v.VIOLATION_STATUS_CODE === 'O' ? 'high' : 'moderate',
          note: `${v.VIOLATION_STATUS_CODE === 'O' ? 'OPEN' : 'Resolved'} — ${VIOL_LABELS[v.VIOLATION_CATEGORY_CODE] || ''}`,
          violationBased: true,
        });
      }
    }

    // 5. Format violations
    const fmtViols = [...viols]
      .sort((a, b) => new Date(b.COMPLIANCE_PERIOD_BEGIN_DATE || 0).getTime() - new Date(a.COMPLIANCE_PERIOD_BEGIN_DATE || 0).getTime())
      .slice(0, 10)
      .map(v => ({
        rule: VIOL_LABELS[v.VIOLATION_CATEGORY_CODE] || v.VIOLATION_CATEGORY_CODE || 'Violation',
        contaminant: CONTAM_NAMES[v.CONTAMINANT_CODE] || v.CONTAMINANT_NAME || '',
        year: (v.COMPLIANCE_PERIOD_BEGIN_DATE || '').slice(0, 4) || '—',
        status: STATUS_META[v.VIOLATION_STATUS_CODE]?.label || v.VIOLATION_STATUS_CODE || '—',
        statusColor: STATUS_META[v.VIOLATION_STATUS_CODE]?.color || '#94a3b8',
      }));

    const openCount = openViols.length;
    const summary = openCount > 0
      ? `${system.PWS_NAME} has ${openCount} open violation(s) on record with EPA.`
      : viols.length > 0
      ? `${system.PWS_NAME} has ${viols.length} resolved violation(s) — no currently open issues.`
      : `${system.PWS_NAME} has no recorded violations in the EPA SDWIS database.`;

    return NextResponse.json({
      city: [system.CITY_NAME, system.STATE_CODE].filter(Boolean).join(', ') || `ZIP ${zip}`,
      systemName: system.PWS_NAME,
      pwsid,
      score,
      grade: scoreToGrade(score),
      population: system.POPULATION_SERVED_COUNT
        ? parseInt(system.POPULATION_SERVED_COUNT).toLocaleString()
        : null,
      sourceType: system.PRIMARY_SOURCE_CODE === 'SW' ? 'Surface Water'
                : system.PRIMARY_SOURCE_CODE === 'GW' ? 'Groundwater'
                : system.PRIMARY_SOURCE_CODE === 'GU' ? 'Groundwater (surface influenced)'
                : 'Municipal',
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
