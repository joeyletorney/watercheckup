import { score88ToLetterGrade } from './water-grade';

/** EPA MCL (ppt) for regulated PFAS — penalties use regulated peaks, not unregulated peaks like 6:2 FTS */
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

export type WaterScoreResult = {
  score: number;
  grade: string;
  gradeColor: string;
  label: string;
  scoreColor: string;
};

/** Editorial issue list → capped profile penalty (max 12). Urgency is not scored separately. */
function profilePenalty(issues: string[]): number {
  if (!issues.length) return 0;
  const blob = issues.join(' ').toLowerCase();
  let penalty = 0;
  if (/lead|service line|lsl/i.test(blob)) penalty += 6;
  if (/chromium|cr-?6/i.test(blob)) penalty += 5;
  if (/pfas|pfoa|pfos/i.test(blob)) penalty += 4;
  if (/thm|tthm|halo|byproduct|dbp|disinfection/i.test(blob)) penalty += 4;
  if (/arsenic|radium|nitrate|dioxane|uranium|radon/i.test(blob)) penalty += 3;
  if (/hardness|sodium|chloramine|fluoride/i.test(blob)) penalty += 2;
  return Math.min(penalty, 12);
}

function presentationFromGrade(grade: string): Pick<WaterScoreResult, 'gradeColor' | 'label' | 'scoreColor'> {
  if (grade.startsWith('A')) {
    return { gradeColor: '#22d3ee', label: 'Good', scoreColor: '#22d3ee' };
  }
  if (grade.startsWith('B')) {
    return { gradeColor: '#86efac', label: 'Fair', scoreColor: '#86efac' };
  }
  if (grade.startsWith('C')) {
    return { gradeColor: '#f59e0b', label: 'Concerning', scoreColor: '#f59e0b' };
  }
  if (grade.startsWith('D')) {
    return { gradeColor: '#f97316', label: 'Poor', scoreColor: '#f97316' };
  }
  return { gradeColor: '#ef4444', label: 'High Risk', scoreColor: '#ef4444' };
}

export function waterScoreResult(score: number): WaterScoreResult {
  const clamped = Math.max(0, Math.min(88, Math.round(score)));
  const grade = score88ToLetterGrade(clamped);
  return { score: clamped, grade, ...presentationFromGrade(grade) };
}

/** Concern badge aligned to numeric score (not editorial urgency field). */
export function concernLevelFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score < 45) return 'high';
  if (score < 62) return 'medium';
  return 'low';
}

export type ComputeWaterScoreOptions = {
  /** Open SDWIS violation count — penalizes only violations not already counted in UCMR PFAS violations */
  sdwaViolationCount?: number;
};

/**
 * Water Safety Score: 0 (worst) → 88 (best — no municipal supply is perfect).
 * Layers: regulatory (violations/MCL) → monitoring (PFAS detections) → profile (top issues).
 */
export function computeWaterScore(
  _urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: CityPfasSnapshot,
  opts?: ComputeWaterScoreOptions
): WaterScoreResult {
  let score = 88;

  if (pfasData) {
    const violations = pfasData.violations ?? 0;
    if (violations > 0) {
      score -= Math.min(8 * violations, 20);
    }

    const mclFlags = pfasData.compounds.filter(([, , overEpa]) => overEpa > 0).length;
    if (mclFlags > 0 && violations === 0) {
      score -= Math.min(8 + mclFlags * 3, 18);
    }

    const regMax = maxRegulatedPpt(pfasData.compounds);
    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);

    if (violations === 0 && pfasData.compounds.length > 0) {
      if (regMax > 50) score -= 8;
      else if (regMax > 10) score -= 5;
      else if (regMax > 0) score -= 3;
      else if (pfasData.maxPpt > 100) score -= 12;
      else if (pfasData.maxPpt > 40) score -= 8;
      else if (pfasData.maxPpt > 20) score -= 5;
      else score -= 2;

      if (pfasData.compounds.length > 3) score -= 5;
      if (overHealth) score -= 6;
    } else if (violations > 0) {
      if (overHealth) score -= 6;
      if (pfasData.maxPpt > 200) score -= 12;
      else if (pfasData.maxPpt > 100) score -= 8;
      else if (pfasData.maxPpt > 40) score -= 5;
    }
  }

  const sdwa = opts?.sdwaViolationCount ?? 0;
  const pfasViol = pfasData?.violations ?? 0;
  const extraSdwa = Math.max(0, sdwa - pfasViol);
  if (extraSdwa > 0) {
    score -= Math.min(6 * extraSdwa, 18);
  }

  score -= profilePenalty(issues);

  return waterScoreResult(score);
}

/** Public water system pages: city score + live SDWIS violation count */
export function computeUtilityWaterScore(
  sdwaViolationCount: number,
  issues: string[],
  pfasData: CityPfasSnapshot
): WaterScoreResult {
  return computeWaterScore('low', issues, pfasData, { sdwaViolationCount });
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

/** SERP description: grade + score upfront, free/no-signup CTA when missing */
export function formatPrioritySeoDescription(
  description: string,
  grade: string,
  score?: number
): string {
  const cleaned = description.replace(/^[A-F][+-]?\s+grade:\s*/i, '').trim();
  const scoreBit = score != null ? ` · ${score}/88` : '';
  const freeBit = /no signup|free report|free ·/i.test(cleaned) ? '' : ' Free EPA report · no signup.';
  return `${grade} grade${scoreBit}: ${cleaned}${freeBit}`;
}
