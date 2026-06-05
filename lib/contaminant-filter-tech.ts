/** Which residential filter technologies reliably address each contaminant (EWG-style matrix). */

export type ContaminantFilterTech = {
  carbon: boolean;
  ro: boolean;
  ionExchange: boolean;
};

const EXACT: Record<string, ContaminantFilterTech> = {
  Lead: { carbon: true, ro: true, ionExchange: false },
  Copper: { carbon: true, ro: true, ionExchange: false },
  Arsenic: { carbon: true, ro: true, ionExchange: false },
  Nitrate: { carbon: false, ro: true, ionExchange: false },
  Nitrite: { carbon: false, ro: true, ionExchange: false },
  'Total Trihalomethanes (TTHMs)': { carbon: true, ro: true, ionExchange: false },
  'Haloacetic Acids (HAA5)': { carbon: true, ro: true, ionExchange: false },
  Chloroform: { carbon: true, ro: true, ionExchange: false },
  Bromodichloromethane: { carbon: true, ro: true, ionExchange: false },
  Dibromochloromethane: { carbon: true, ro: true, ionExchange: false },
  Bromoform: { carbon: true, ro: true, ionExchange: false },
  'Dichloroacetic Acid': { carbon: true, ro: true, ionExchange: false },
  'Trichloroacetic Acid': { carbon: true, ro: true, ionExchange: false },
  'Dibromoacetic Acid': { carbon: true, ro: true, ionExchange: false },
  Fluoride: { carbon: false, ro: true, ionExchange: true },
  Chromium: { carbon: true, ro: true, ionExchange: false },
  'Chromium-6': { carbon: false, ro: true, ionExchange: false },
  Selenium: { carbon: true, ro: true, ionExchange: false },
  Barium: { carbon: true, ro: true, ionExchange: true },
  'Radium (combined)': { carbon: false, ro: true, ionExchange: true },
  Uranium: { carbon: false, ro: true, ionExchange: true },
  Sodium: { carbon: false, ro: true, ionExchange: true },
  Chloride: { carbon: false, ro: true, ionExchange: true },
  Sulfate: { carbon: false, ro: true, ionExchange: false },
  Iron: { carbon: true, ro: true, ionExchange: false },
  Manganese: { carbon: true, ro: true, ionExchange: false },
  'Total Dissolved Solids (TDS)': { carbon: false, ro: true, ionExchange: true },
  'Water Hardness': { carbon: false, ro: true, ionExchange: true },
  Chlorine: { carbon: true, ro: true, ionExchange: false },
  Chloramine: { carbon: true, ro: true, ionExchange: false },
  Chlorite: { carbon: true, ro: true, ionExchange: false },
  Bromate: { carbon: true, ro: true, ionExchange: false },
  Cadmium: { carbon: true, ro: true, ionExchange: false },
  Mercury: { carbon: true, ro: true, ionExchange: false },
  Atrazine: { carbon: true, ro: true, ionExchange: false },
  Zinc: { carbon: true, ro: true, ionExchange: true },
};

const PFAS_DEFAULT: ContaminantFilterTech = { carbon: false, ro: true, ionExchange: false };
const DBP_DEFAULT: ContaminantFilterTech = { carbon: true, ro: true, ionExchange: false };

export function getContaminantFilterTech(name: string): ContaminantFilterTech {
  if (EXACT[name]) return EXACT[name];

  const lower = name.toLowerCase();
  if (
    lower.includes('pfas') ||
    lower.includes('pfoa') ||
    lower.includes('pfos') ||
    lower.includes('pfhxs') ||
    lower.includes('pfna') ||
    lower.includes('genx') ||
    lower.includes('hfpo') ||
    lower.includes('fts') ||
    lower.includes('perfluoro')
  ) {
    return PFAS_DEFAULT;
  }
  if (
    lower.includes('haloacetic') ||
    lower.includes('trihalomethane') ||
    lower.includes('thm') ||
    lower.includes('chloroform') ||
    lower.includes('bromo') ||
    lower.includes('chloroacetic')
  ) {
    return DBP_DEFAULT;
  }
  if (lower.includes('hardness') || lower.includes('calcium') || lower.includes('magnesium')) {
    return EXACT['Water Hardness'];
  }
  if (lower.includes('radium') || lower.includes('uranium')) {
    return { carbon: false, ro: true, ionExchange: true };
  }

  return { carbon: true, ro: true, ionExchange: false };
}

export function filterTechSummary(tech: ContaminantFilterTech): string {
  const parts: string[] = [];
  if (tech.ro) parts.push('RO');
  if (tech.carbon) parts.push('Carbon');
  if (tech.ionExchange) parts.push('Ion exchange');
  return parts.join(' · ') || '—';
}
