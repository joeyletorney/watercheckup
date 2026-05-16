/**
 * EPA SDWIS / drinking-water reference helpers (URLs and regulated limits used across reports).
 * Live violation chemistry still comes from your APIs and bundled UCMR data — this module is link + constant glue.
 */

/** Regulated PFAS MCLs under EPA rules (ppt), for display next to UCMR-style numbers. */
export const EPA_REGULATED_PFAS_MCL_PPT: Record<string, number> = {
  PFOA: 4,
  PFOS: 4,
  PFNA: 10,
  PFHxS: 10,
  'HFPO-DA': 10,
};

export const EPA_REFERENCE_LINKS = {
  sdwisAbout: 'https://www.epa.gov/sdwa',
  ucmr: 'https://www.epa.gov/dwucmr',
  consumerConfidence: 'https://www.epa.gov/ccr',
} as const;

/** Federal SDWIS public PWS search → report for a given PWSID (same pattern as `app/epa/sdwis/[pwsid]`). */
export function sdwisPublicReportUrl(pwsid: string): string {
  const id = encodeURIComponent(pwsid.trim());
  return `https://sdwis.epa.gov/ords/sfdw_pub/f?p=SDWIS_FED_REPORTS_PUBLIC:PWS_SEARCH::::::PWSID:${id}`;
}

/** Internal shortcut page (optional embed / deep link). */
export function internalSdwisPath(pwsid: string): string {
  return `/epa/sdwis/${encodeURIComponent(pwsid.trim())}`;
}
