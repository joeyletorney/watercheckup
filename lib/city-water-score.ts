import { score88ToLetterGrade } from './water-grade';

/** EPA MCL (ppt) for regulated PFAS — penalties use regulated peaks, not unregulated peaks like PFBA */
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
export type CityPfasSnapshot = import('./pfas-monitoring').MonitoringSnapshot | null;

/** Optional CCR fields — when set, apply health-guideline penalties even under EPA MCLs */
export type ScoreWaterProfile = {
  hardness?: number;
  arsenicPpb?: number;
  radiumPciL?: number;
};

export type WaterScoreResult = {
  score: number;
  grade: string;
  gradeColor: string;
  label: string;
  scoreColor: string;
};

/** EWG-style health guideline layer for metals in CCR data (independent of EPA MCL compliance) */
function ccrHealthPenalty(profile?: ScoreWaterProfile): number {
  if (!profile) return 0;
  let penalty = 0;
  const as = profile.arsenicPpb;
  if (as != null && as > 0.004) {
    if (as >= 5) penalty += 7;
    else if (as >= 1) penalty += 5;
    else penalty += 4;
  }
  const ra = profile.radiumPciL;
  if (ra != null && ra > 1) {
    if (ra >= 4) penalty += 5;
    else penalty += 3;
  }
  return Math.min(penalty, 10);
}

function presentationFromGrade(grade: string): Pick<WaterScoreResult, 'gradeColor' | 'label' | 'scoreColor'> {
  if (grade === 'A+') {
    return { gradeColor: '#22d3ee', label: 'Excellent', scoreColor: '#22d3ee' };
  }
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
  /** Official open SDWIS records; historical PFAS peaks are a separate signal. */
  sdwaViolationCount?: number;
  waterProfile?: ScoreWaterProfile;
};

export type CityScoreInput = {
  urgency: 'high' | 'medium' | 'low';
  issues: string[];
  waterProfile?: ScoreWaterProfile;
};

/** Convenience wrapper when full city record is available */
export function computeCityWaterScore(
  city: CityScoreInput,
  pfasData: CityPfasSnapshot,
  opts?: Omit<ComputeWaterScoreOptions, 'waterProfile'>
): WaterScoreResult {
  return computeWaterScore(city.urgency, city.issues, pfasData, {
    ...opts,
    waterProfile: city.waterProfile,
  });
}

/**
 * Water Safety Score: 0 (worst) → 88 (best — no municipal supply is perfect).
 *
 * Philosophy (closer to EWG + real-world use than EPA-compliance-only):
 * - A range (~80–88): few detections and no supplied official violation records
 * - B range: PFAS detections or measured health-related concerns
 * - C range: multiple measured concerns
 * - D/F: higher historical PFAS results or supplied official violation records
 *
 * EWG does not publish letter grades — it lists contaminants above its health guidelines.
 */
export function computeWaterScore(
  _urgency: 'high' | 'medium' | 'low',
  _issues: string[],
  pfasData: CityPfasSnapshot,
  opts?: ComputeWaterScoreOptions
): WaterScoreResult {
  if (!pfasData) return { score: 0, grade: '—', gradeColor: '#94a3b8', label: 'Monitoring coverage incomplete', scoreColor: '#94a3b8' };
  let score = 88;
  const profile = opts?.waterProfile;

  {
    const violations = pfasData.violations ?? 0;
    if (violations > 0) {
      score -= Math.min(8 * violations, 24);
    }

    const regMax = maxRegulatedPpt(pfasData.compounds);

    if (violations === 0 && pfasData.compounds.length > 0) {
      if (regMax > 50) score -= 10;
      else if (regMax > 10) score -= 7;
      else if (regMax > 0) score -= 5;
      else if (pfasData.maxPpt > 100) score -= 10;
      else if (pfasData.maxPpt > 40) score -= 8;
      else if (pfasData.maxPpt > 20) score -= 6;
      else if (pfasData.maxPpt >= 10) score -= 5;
      else if (pfasData.maxPpt >= 4) score -= 4;
      else score -= 3;

      if (pfasData.compounds.length > 3) score -= 4;

    } else if (violations > 0) {

      if (pfasData.maxPpt > 200) score -= 12;
      else if (pfasData.maxPpt > 100) score -= 8;
      else if (pfasData.maxPpt > 40) score -= 5;
    }
  }

  const sdwa = opts?.sdwaViolationCount ?? 0;
  if (sdwa > 0) score -= Math.min(6 * sdwa, 18);
  score -= ccrHealthPenalty(profile);

  return waterScoreResult(score);
}

/** Public water system pages: city score + live SDWIS violation count */
export function computeUtilityWaterScore(
  sdwaViolationCount: number,
  issues: string[],
  pfasData: CityPfasSnapshot,
  waterProfile?: ScoreWaterProfile
): WaterScoreResult {
  return computeWaterScore('low', issues, pfasData, { sdwaViolationCount, waterProfile });
}

/** Short SERP hook — teases the key finding without duplicating the full title */
export function getCityKeyFinding(
  urgency: 'high' | 'medium' | 'low',
  issues: string[],
  pfasData: CityPfasSnapshot
): string {
  if (pfasData?.violations && pfasData.violations > 0) return 'Historical PFAS Peak Above Benchmark';
  if (pfasData?.compounds?.length) {

    return 'PFAS Detected';
  }

  const top = issues[0] ?? '';
  if (/lead/i.test(top)) return 'Lead Pipe Risk';
  if (/chromium/i.test(top)) return 'Chromium-6 Flagged';
  if (/PFAS|pfas/i.test(top)) return 'PFAS Concern';
  if (/nitrate/i.test(top)) return 'Nitrates Flagged';
  if (/THM|byproduct|DBP/i.test(top)) return 'Disinfection Byproducts';
  if (/hard/i.test(top)) return 'Very Hard Water';
  if (urgency === 'high') return 'Multiple Contaminants Flagged';
  if (urgency === 'medium') return 'Contaminants Above Guidelines';
  return 'EPA Report Available';
}

/** Appends (grade · score) to priority titles when room allows — visible in SERPs on page 2–3. */
export function formatPrioritySeoTitle(title: string, grade: string, score?: number): string {
  if (grade === '—') return title;
  if (/grade\s*[A-F]/i.test(title) || /\d+\/88/.test(title)) return title;
  const suffix = score != null ? ` (${grade} · ${score}/88)` : ` (${grade})`;
  if (title.length + suffix.length <= 62) return title + suffix;
  const trimmed = title.slice(0, Math.max(20, 62 - suffix.length)).trim();
  return trimmed + suffix;
}

/** SERP description: grade + score upfront, free/no-signup CTA when missing */
export function formatPrioritySeoDescription(
  description: string,
  grade: string,
  score?: number
): string {
  if (grade === '—') return 'Historical monitoring coverage is incomplete. Confirm the supplier and current utility report; missing records do not establish nondetection.';
  const cleaned = description.replace(/^[A-F][+-]?\s+grade:\s*/i, '').trim();
  const scoreBit = score != null ? ` (${grade} · ${score}/88)` : ` (${grade})`;
  const freeBit = /no signup|free report|free ·/i.test(cleaned) ? '' : ' Free EPA report · no signup.';
  return `${cleaned}${scoreBit}${freeBit}`;
}
