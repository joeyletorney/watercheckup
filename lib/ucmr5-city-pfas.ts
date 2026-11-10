import ucmr5Raw from './ucmr5.json';
import { decodePfasMonitoring } from './pfas-monitoring';

const data = ucmr5Raw as Record<string, unknown>;
export function getCityPfasData(pwsid: string) {
  return decodePfasMonitoring(data[pwsid]);
}
