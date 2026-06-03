/** SERP copy for `/results/[zip]` — grade and stats upfront for CTR */

export type ZipReportSeoInput = {
  zip: string;
  city?: string;
  score?: number;
  grade?: string;
  openViolations?: number;
  pfasCount?: number;
  pfasAboveMcl?: number;
};

export function buildZipResultsTitle(input: ZipReportSeoInput): string {
  const city = input.city?.split(',')[0]?.trim() || `ZIP ${input.zip}`;
  const score = Math.min(Math.max(0, Math.round(Number(input.score) || 0)), 88);
  const grade = input.grade?.trim();
  if (grade && score > 0) {
    const base = `${city} Tap Water 2026 — Grade ${grade} (${score}/88)`;
    return base.length <= 62 ? base : `${city} Water Report — ${grade} · ${score}/88`;
  }
  return `${city} Water Quality Report — Score ${score}/88 | WaterCheckup`;
}

export function buildZipResultsDescription(input: ZipReportSeoInput): string {
  const city = input.city?.split(',')[0]?.trim() || `ZIP ${input.zip}`;
  const score = Math.min(Math.max(0, Math.round(Number(input.score) || 0)), 88);
  const grade = input.grade?.trim() || '—';
  const open = Number(input.openViolations) || 0;
  const pfas = Number(input.pfasCount) || 0;
  const pfasOver = Number(input.pfasAboveMcl) || 0;

  const parts: string[] = [];
  if (score > 0) parts.push(`${grade} · ${score}/88`);
  if (open > 0) parts.push(`${open} open EPA violation${open === 1 ? '' : 's'}`);
  else parts.push('no open violations on record');
  if (pfasOver > 0) parts.push('PFAS above EPA limits');
  else if (pfas > 0) parts.push('PFAS detected');
  else parts.push('PFAS snapshot included');

  const hook = parts.join(' · ');
  const desc = `${city} tap water: ${hook}. Free EPA report + NSF filter picks matched to your ZIP.`;
  return desc.length <= 165 ? desc : `${desc.slice(0, 162)}…`;
}
