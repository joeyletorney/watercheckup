/** January 1, 2027 00:00:00 UTC — revised CCR Rule effective date. */
export const CCR_2027_DEADLINE_MS = Date.UTC(2027, 0, 1, 0, 0, 0, 0);

export type Ccr2027CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getDaysUntilCcr2027(now = Date.now()): number {
  const diff = CCR_2027_DEADLINE_MS - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getCcr2027CountdownParts(now = Date.now()): Ccr2027CountdownParts {
  let diff = Math.max(0, CCR_2027_DEADLINE_MS - now);
  const days = Math.floor(diff / 86_400_000);
  diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  diff -= minutes * 60_000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}
