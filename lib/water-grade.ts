/** Same letter-grade bands as `/api/water` — always grade from the raw 0–100 pipeline score, not the capped display score. */
export function scoreToLetterGrade(s: number): string {
  if (s >= 93) return 'A';
  if (s >= 90) return 'A-';
  if (s >= 87) return 'B+';
  if (s >= 83) return 'B';
  if (s >= 80) return 'B-';
  if (s >= 77) return 'C+';
  if (s >= 73) return 'C';
  if (s >= 70) return 'C-';
  if (s >= 65) return 'D+';
  if (s >= 60) return 'D';
  return 'F';
}
