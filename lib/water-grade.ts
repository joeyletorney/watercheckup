function bandGrade(score: number, base: number): string {
  if (score >= base + 7) return '+';
  if (score >= base + 4) return '';
  return '-';
}

/**
 * 0–100 grading with +/- bands:
 * 80–83 A-, 84–86 A, 87–100 A+
 * 70–73 B-, 74–76 B, 77–79 B+
 * 60–63 C-, 64–66 C, 67–69 C+
 * 50–53 D-, 54–56 D, 57–59 D+
 * <50 F
 */
export function scoreToLetterGrade(s: number): string {
  const score = Math.max(0, Math.min(100, Math.floor(s)));
  if (score >= 87) return 'A+';
  if (score >= 80) return `A${bandGrade(score, 80)}`;
  if (score >= 70) return `B${bandGrade(score, 70)}`;
  if (score >= 60) return `C${bandGrade(score, 60)}`;
  if (score >= 50) return `D${bandGrade(score, 50)}`;
  return 'F';
}

/**
 * 0–88 grading with +/- bands:
 * 80–83 A-, 84–86 A, 87–88 A+
 * 70–73 B-, 74–76 B, 77–79 B+
 * 60–63 C-, 64–66 C, 67–69 C+
 * 50–53 D-, 54–56 D, 57–59 D+
 * <50 F
 */
export function score88ToLetterGrade(s: number): string {
  const score = Math.max(0, Math.min(88, Math.floor(s)));
  if (score >= 87) return 'A+';
  if (score >= 80) return `A${bandGrade(score, 80)}`;
  if (score >= 70) return `B${bandGrade(score, 70)}`;
  if (score >= 60) return `C${bandGrade(score, 60)}`;
  if (score >= 50) return `D${bandGrade(score, 50)}`;
  return 'F';
}
