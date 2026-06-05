/** Deep-link from a ZIP report into the filter quiz with sensible defaults */

export function concernFromReport(data: {
  pfasAboveMcl?: number;
  pfasCount?: number;
  openViolations?: number;
}): 'pfas' | 'lead' | 'general' {
  if (Number(data.pfasAboveMcl) > 0 || Number(data.pfasCount) > 0) return 'pfas';
  if (Number(data.openViolations) > 0) return 'general';
  return 'general';
}

export function quizHrefFromReport(data: {
  zip?: string;
  pfasAboveMcl?: number;
  pfasCount?: number;
  openViolations?: number;
  situation?: 'renter' | 'owner_simple' | 'owner_full';
}): string {
  const params = new URLSearchParams({
    source: 'city',
    concern: concernFromReport(data),
    situation: data.situation ?? 'owner_simple',
    from: 'results',
  });
  if (data.zip) params.set('zip', data.zip);
  return `/quiz?${params.toString()}`;
}

export function quizHrefFromCityPage(opts: {
  zip: string;
  hasPfas?: boolean;
  urgency?: 'high' | 'medium' | 'low';
}): string {
  const concern = opts.hasPfas || opts.urgency === 'high' ? 'pfas' : 'general';
  const params = new URLSearchParams({
    source: 'city',
    concern,
    situation: 'owner_simple',
    from: 'water-city',
    zip: opts.zip,
  });
  return `/quiz?${params.toString()}`;
}

/** True when mail-in lab testing is especially worth recommending */
export function shouldEmphasizeLabTest(opts: {
  pfasCount?: number;
  pfasAboveMcl?: number;
  openViolations?: number;
  score?: number;
  hasLeadSignal?: boolean;
}): boolean {
  if (Number(opts.pfasAboveMcl) > 0 || Number(opts.pfasCount) > 0) return true;
  if (Number(opts.openViolations) > 0) return true;
  if (opts.hasLeadSignal) return true;
  if (opts.score != null && opts.score < 57) return true;
  return false;
}
