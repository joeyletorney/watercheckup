import { NextRequest, NextResponse } from 'next/server';

const H = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

async function epaGet(path: string) {
  const res = await fetch(`https://data.epa.gov/efservice/${path}`, {
    headers: { Accept: 'application/json' }, next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

function f(o: any, k: string) { return o[k] ?? o[k.toLowerCase()] ?? o[k.toUpperCase()] ?? null; }

export async function GET(req: NextRequest) {
  const pwsid = req.nextUrl.searchParams.get('pwsid');
  if (!pwsid) return NextResponse.json({ error: 'Missing pwsid' }, { status: 400, headers: H });

  try {
    // Get county + state from the primary system
    const sysRows: any[] = await epaGet(`WATER_SYSTEM/PWSID/${pwsid}/rows/1:1/JSON`);
    if (!sysRows?.length) return NextResponse.json({ utilities: [] }, { headers: H });

    const county = f(sysRows[0], 'county_served') || f(sysRows[0], 'county_name') || '';
    const state  = f(sysRows[0], 'state_code') || f(sysRows[0], 'primacy_agency_code') || '';
    if (!county || !state) return NextResponse.json({ utilities: [], county: '' }, { headers: H });

    // Get all CWS in this county
    const countyRows: any[] = await epaGet(
      `WATER_SYSTEM/STATE_CODE/${state}/COUNTY_SERVED/${encodeURIComponent(county)}/PWS_ACTIVITY_CODE/A/PWS_TYPE_CODE/CWS/rows/1:25/JSON`
    );
    if (!Array.isArray(countyRows) || !countyRows.length) {
      return NextResponse.json({ utilities: [], county }, { headers: H });
    }

    // For each utility get violation count
    const utilities = await Promise.all(
      countyRows
        .sort((a, b) => (parseInt(f(b,'population_served_count'))||0) - (parseInt(f(a,'population_served_count'))||0))
        .slice(0, 12)
        .map(async (row) => {
          const id   = f(row, 'pwsid') || f(row, 'PWSID') || '';
          const name = f(row, 'pws_name') || f(row, 'PWS_NAME') || 'Unknown';
          const pop  = parseInt(f(row, 'population_served_count') || '0') || 0;
          const city = f(row, 'city_name') || f(row, 'CITY_NAME') || '';
          const src  = f(row, 'primary_source_code') || '';
          const sourceLabel = src === 'SW' ? 'Surface' : src === 'GW' ? 'Groundwater' : src === 'GU' ? 'GW/Surface' : 'Municipal';

          let openViolations = 0, totalViolations = 0;
          try {
            const viols: any[] = await epaGet(`SDWA_VIOLATIONS/PWSID/${id}/rows/1:20/JSON`);
            if (Array.isArray(viols)) {
              totalViolations = viols.length;
              openViolations = viols.filter(v => (f(v,'violation_status_code')||'') === 'O').length;
            }
          } catch {}

          return { pwsid: id, name, population: pop, city, sourceLabel, openViolations, totalViolations, isCurrent: id === pwsid };
        })
    );

    return NextResponse.json({ utilities, county: `${county} County, ${state}` }, { headers: H });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: H });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: H });
}
