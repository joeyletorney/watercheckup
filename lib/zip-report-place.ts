import { resolveReportCityLink } from './report-city-link.server';

const STREET_SUFFIX =
  /\b(streets?|st\.?|avenues?|ave\.?|roads?|rd\.?|drives?|dr\.?|boulevards?|blvd\.?|lanes?|ln\.?|courts?|ct\.?|ways?|places?|pl\.?|parkways?|pkwy\.?|highways?|hwy\.?|routes?|rte\.?|circles?|cir\.?|terraces?|ter\.?|trails?|trl\.?|pikes?|squares?|sq\.?|loops?|alleys?|plazas?|expressways?|expy\.?|freeways?|fwy\.?|turnpikes?|tpke\.?|crossings?)\b/i;

const LEADING_STREET_NUMBER = /^\s*\d+[A-Za-z]?\s+\S/;
const PO_BOX = /^\s*(p\.?\s*o\.?\s*box|post office box)\b/i;
const DATE_VALUE = /^\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*$/;
const MAIL_STOP = /\b(ste\.?|suite|apt\.?|apartment|bldg\.?|building|fl(?:oor)?|unit|ms)\s*#?\s*\d/i;
const FACILITY_MAILING =
  /\b(city hall|attn:?|attention:|department of public works|mail stop|p\.?\s*o\.?\s*box)\b/i;

const SMALL_WORDS = new Set(['of', 'the', 'and', 'a', 'an', 'de', 'da', 'del', 'la', 'le']);

const SYSTEM_SUFFIXES = [
  /\s*[-,]\s*city,?\s*(water\s+)?(dept\.?|department)(\s+of\s+water.*)?$/i,
  /\s+dept\.?\s+of\s+water(\s*&\s*power)?$/i,
  /\s+department of water( management)?$/i,
  /\s+division of water$/i,
  /\s+water and sewer commission.*$/i,
  /\s+public works water$/i,
  /\s+water (department|dept\.?|works|district|utility|authority|system)$/i,
  /\s+system$/i,
];

export function looksLikeStreetAddress(value: string): boolean {
  const text = String(value || '').trim();
  if (!text) return false;
  if (PO_BOX.test(text) || MAIL_STOP.test(text)) return true;
  if (LEADING_STREET_NUMBER.test(text) && STREET_SUFFIX.test(text)) return true;
  // "20 WEST LAKE DRIVE", "3900 Donaldson Pl." — numbered street lines without a city token
  if (LEADING_STREET_NUMBER.test(text) && text.split(/\s+/).length >= 3) return true;
  return false;
}

export function looksLikeFacilityOrMailingLabel(value: string): boolean {
  const text = String(value || '').trim();
  if (!text) return false;
  if (looksLikeStreetAddress(text) || DATE_VALUE.test(text)) return true;
  if (FACILITY_MAILING.test(text)) return true;
  if (/^city hall$/i.test(text)) return true;
  return false;
}

export function usableStateCode(value?: string): string {
  const text = String(value || '').trim().toUpperCase();
  if (!text || DATE_VALUE.test(text)) return '';
  if (/^[A-Z]{2}$/.test(text)) return text;
  return '';
}

function usablePlaceLabel(value: string): boolean {
  const text = String(value || '').trim();
  if (!text) return false;
  if (looksLikeFacilityOrMailingLabel(text)) return false;
  if (/^\d+$/.test(text)) return false;
  if (text.length < 2) return false;
  return true;
}

export function titleCasePlace(value: string): string {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/[a-z]/.test(trimmed) && /[A-Z]/.test(trimmed)) return trimmed;
  return trimmed
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part, index) => {
      if (/^\s+$/.test(part) || part === '-') return part;
      const word = part.replace(/\.$/, '');
      const hadDot = part.endsWith('.');
      if (word === 'st') return hadDot ? 'St.' : 'St.';
      if (index > 0 && SMALL_WORDS.has(word)) return word;
      if (!word) return part;
      const cased = word.charAt(0).toUpperCase() + word.slice(1);
      return hadDot ? `${cased}.` : cased;
    })
    .join('');
}

export function placeFromSystemName(systemName: string): string {
  let text = String(systemName || '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  for (const suffix of SYSTEM_SUFFIXES) {
    text = text.replace(suffix, '').trim();
  }
  return text.replace(/[,\s-]+$/g, '').trim();
}

function formatPlace(place: string, state?: string): string {
  const zipLabel = place.match(/^ZIP\s+(\d{5})$/i);
  const name = zipLabel ? `ZIP ${zipLabel[1]}` : titleCasePlace(place);
  const st = usableStateCode(state);
  if (!name) return st ? `ZIP, ${st}` : '';
  return st ? `${name}, ${st}` : name;
}

export type ZipReportPlaceInput = {
  zip: string;
  pwsid?: string;
  city?: string;
  state?: string;
  systemName?: string;
};

/**
 * Place label for ZIP report H1s, titles, and OG images.
 * Never returns a facility / sample-site street address from the EPA system record.
 */
export function resolveZipReportPlace(input: ZipReportPlaceInput): string {
  const zip = String(input.zip || '').trim();
  const rawCity = String(input.city || '').split(',')[0]?.trim() || '';
  const stateFromCity = usableStateCode(String(input.city || '').split(',')[1]);
  const state = usableStateCode(input.state) || stateFromCity || (
    input.pwsid && /^[A-Za-z]{2}/.test(input.pwsid) ? input.pwsid.slice(0, 2).toUpperCase() : ''
  );

  const cityForMatch = usablePlaceLabel(rawCity) ? rawCity : undefined;
  const cityLink = input.pwsid
    ? resolveReportCityLink({ pwsid: input.pwsid, zip, city: cityForMatch })
    : undefined;
  if (cityLink?.label) return formatPlace(cityLink.label, state || undefined);

  if (usablePlaceLabel(rawCity)) return formatPlace(rawCity, state || undefined);

  const fromSystem = placeFromSystemName(input.systemName || '');
  if (fromSystem && usablePlaceLabel(fromSystem) && !looksLikeStreetAddress(fromSystem)) {
    return formatPlace(fromSystem, state || undefined);
  }

  const systemName = String(input.systemName || '').trim();
  if (systemName && usablePlaceLabel(systemName) && !looksLikeStreetAddress(systemName)) {
    return formatPlace(systemName, state || undefined);
  }

  return zip ? formatPlace(`ZIP ${zip}`, state || undefined) : 'this water system';
}
