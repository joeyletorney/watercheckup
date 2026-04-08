/**
 * Update the label (and optionally env) when you replace `lib/ucmr5.json`.
 * Override in production: WATERCHECKUP_UCMR_SNAPSHOT_LABEL="June 2025"
 */
export const UCMR5_SNAPSHOT_LABEL_DEFAULT = 'April 2025';

export const SDWIS_LIVE_NOTE =
  'Violations and lead/copper samples are loaded live from EPA Envirofacts (refreshed on EPA’s publishing schedule).';

export const OFFICIAL_LINKS = {
  ccr: 'https://www.epa.gov/ccr',
  ucmrData: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule',
  sdwis: 'https://www.epa.gov/dwsdwa',
} as const;

export function getUcmrSnapshotLabel(): string {
  return process.env.WATERCHECKUP_UCMR_SNAPSHOT_LABEL?.trim() || UCMR5_SNAPSHOT_LABEL_DEFAULT;
}

export function getDataFreshness() {
  return {
    ucmr5SnapshotLabel: getUcmrSnapshotLabel(),
    sdwisLiveNote: SDWIS_LIVE_NOTE,
    links: OFFICIAL_LINKS,
  };
}
