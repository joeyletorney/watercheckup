import ucmr5Raw from './ucmr5.json';
import type { CityPfasSnapshot } from './city-water-score';

const UCMR5 = ucmr5Raw as unknown as Record<
  string,
  [number, number, [string, number, number, number][], number?]
>;

export function getCityPfasData(pwsid: string): CityPfasSnapshot {
  const entry = UCMR5[pwsid];
  if (!entry) return null;
  const [maxPpt, violations, compounds, hardness] = entry;
  return { maxPpt, violations, compounds, hardness };
}
