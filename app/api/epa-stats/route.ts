import { NextResponse } from 'next/server';
import ucmr5Raw from '@/lib/ucmr5.json';
import { getDataFreshness } from '@/lib/water-data-meta';

const EPA = 'https://data.epa.gov/efservice';

/**
 * Lightweight homepage stats: UCMR5 coverage from our snapshot + SDWIS reachability ping.
 * Cached — suitable for trust badges / “live EPA” widgets.
 */
export async function GET() {
  const ucmr = ucmr5Raw as Record<string, unknown>;
  const ucmrSystemsWithSamples = Object.keys(ucmr).length;
  const fresh = getDataFreshness();

  let sdwisEndpointReachable = false;
  let sdwisLatencyMs: number | null = null;

  try {
    const t0 = Date.now();
    const res = await fetch(`${EPA}/WATER_SYSTEM/PWS_ACTIVITY_CODE/A/rows/1:1/JSON`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    sdwisLatencyMs = Date.now() - t0;
    sdwisEndpointReachable = res.ok;
    if (res.ok) await res.json();
  } catch {
    sdwisEndpointReachable = false;
    sdwisLatencyMs = null;
  }

  return NextResponse.json({
    ucmrSystemsWithSamples,
    ucmrSnapshotLabel: fresh.ucmr5SnapshotLabel,
    sdwisLiveNote: fresh.sdwisLiveNote,
    links: fresh.links,
    sdwisEndpointReachable,
    sdwisLatencyMs,
    generatedAt: new Date().toISOString(),
  });
}
