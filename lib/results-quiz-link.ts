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
