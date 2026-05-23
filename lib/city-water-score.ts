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

  if (urgency === 'high') score -= 40;
  if (urgency === 'medium') score -= 20;

  score -= Math.min(issues.length * 5, 20);

  if (pfasData) {
    if (pfasData.violations > 0) score -= 25;
    else if (pfasData.compounds.length > 3) score -= 12;
    else if (pfasData.compounds.length > 0) score -= 6;

    const overHealth = pfasData.compounds.some(([, , , oh]) => oh > 0);
    if (overHealth) score -= 10;

    if (pfasData.maxPpt > 50) score -= 8;
    else if (pfasData.maxPpt > 10) score -= 4;
  }

  score = Math.max(0, Math.min(88, score));

  let grade: string;
  let gradeColor: string;
  let label: string;
  let scoreColor: string;

  if (score >= 80) {
    grade = 'A-';
    gradeColor = '#22d3ee';
    label = 'Good';
    scoreColor = '#22d3ee';
  } else if (score >= 65) {
    grade = 'B';
    gradeColor = '#86efac';
    label = 'Fair';
    scoreColor = '#86efac';
  } else if (score >= 50) {
    grade = 'C';
    gradeColor = '#f59e0b';
    label = 'Concerning';
    scoreColor = '#f59e0b';
  } else if (score >= 35) {
    grade = 'D';
    gradeColor = '#f97316';
    label = 'Poor';
    scoreColor = '#f97316';
  } else {
    grade = 'F';
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
