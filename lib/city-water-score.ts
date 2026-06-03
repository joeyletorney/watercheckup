import { score88ToLetterGrade } from './water-grade';

/** EPA MCL (ppt) for regulated PFAS — used for score penalties, not unregulated peaks like 6:2 FTS */
const REGULATED_PFAS_MCL: Record<string, number> = {
  PFOA: 4,
  PFOS: 4,
  PFNA: 10,
  PFHxS: 10,
  'HFPO-DA': 10,
};

function maxRegulatedPpt(compounds: [string, number, number, number][]): number {
  let max = 0;
  for (const [name, level] of compounds) {
    if (REGULATED_PFAS_MCL[name] !== undefined) max = Math.max(max, level);
  }
  return max;
}

/** UCMR5-shaped PFAS snapshot used for city score + SEO */
export type CityPfasSnapshot = {
  maxPpt: number;
  violations: number;
  compounds: [string, number, number, number][];
  hardness?: number;
} | null;

// Water Safety Score: 0 (worst) → 88 (best possible — no municipal water is perfect)
export function computeWaterScore(
  urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: CityPfasSnapshot
): { score: number; grade: string; gradeColor: string; label: string; scoreColor: string } {
  let score = 88;

  if (urgency === 'high') score -= 32;
  if (urgency === 'medium') score -= 18;

  score -= Math.min(issues.length * 4, 16);

  if (pfasData) {
    const regMax = maxRegulatedPpt(pfasData.compounds);
    if (pfasData.violations > 1) score -= 22;
    else if (pfasData.violations === 1) score -= 14;
    else if (pfasData.compounds.length > 3) score -= 10;
    else if (pfasData.compounds.length > 0) score -= 5;

    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 8;

    if (regMax > 50) score -= 10;
    else if (regMax > 10) score -= 6;
    else if (pfasData.maxPpt > 100 && pfasData.violations === 0) score -= 5;
  }

  score = Math.max(0, Math.min(88, score));

  const grade = score88ToLetterGrade(score);
  let gradeColor: string;
  let label: string;
  let scoreColor: string;

  if (grade.startsWith('A')) {
    gradeColor = '#22d3ee';
    label = 'Good';
    scoreColor = '#22d3ee';
  } else if (grade.startsWith('B')) {
    gradeColor = '#86efac';
    label = 'Fair';
    scoreColor = '#86efac';
  } else if (grade.startsWith('C')) {
    gradeColor = '#f59e0b';
    label = 'Concerning';
    scoreColor = '#f59e0b';
  } else if (grade.startsWith('D')) {
    gradeColor = '#f97316';
    label = 'Poor';
    scoreColor = '#f97316';
  } else {
    gradeColor = '#ef4444';
    label = 'High Risk';
    scoreColor = '#ef4444';
  }

  return { score, grade, gradeColor, label, scoreColor };
}

/** Short SERP hook — teases the key finding without duplicating the full title */
export function getCityKeyFinding(
  urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: CityPfasSnapshot
): string {
  if (pfasData?.violations && pfasData.violations > 0) return 'PFAS Above EPA Limit';
  if (pfasData?.compounds?.length) {
    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) return 'PFAS Above Health Guidelines';
    return 'PFAS Detected';
  }

  const top = issues[0] ?? '';
  if (/lead/i.test(top)) return 'Lead Pipe Risk';
  if (/chromium/i.test(top)) return 'Chromium-6 Flagged';
  if (/PFAS|pfas/i.test(top)) return 'PFAS Concern';
  if (/nitrate/i.test(top)) return 'Nitrates Flagged';
  if (/THM|byproduct|DBP/i.test(top)) return 'Disinfection Byproducts';
  if (urgency === 'high') return 'Multiple Contaminants Flagged';
  if (urgency === 'medium') return 'Contaminants Above Guidelines';
  return 'EPA Report Available';
}
