// Resolve this on the server so the city catalog and ZIP registry stay out of browser bundles.
import { CITIES } from '@/app/water/[city]/cities-data';
import { resolveCityPwsid } from './city-pwsid';

export type ReportCityLink = { href: string; label: string; supplierId: string };
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function resolveReportCityLink({ pwsid, zip, city }: { pwsid?: string; zip: string; city?: string }): ReportCityLink | undefined {
  if (!pwsid) return undefined;
  const supplierId = pwsid.trim().toUpperCase();
  const candidates = Object.entries(CITIES).filter(([slug, data]) => resolveCityPwsid(slug, data.pwsid, data.zip) === supplierId);
  const name = normalize((city || '').split(',')[0]);
  const match = candidates.find(([, data]) => data.zip === zip || (name && normalize(data.name) === name))
    ?? (candidates.length === 1 ? candidates[0] : undefined);
  if (!match) return undefined;
  return { href: `/water/${match[0]}`, label: match[1].name, supplierId };
}
