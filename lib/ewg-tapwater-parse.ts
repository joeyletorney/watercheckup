/**
 * Parse EWG Tap Water Atlas system pages (build-time / scripts only).
 */

export type EwgParsedContaminant = {
  name: string;
  level: number;
  unit: string;
  limit: number | null;
  limitUnit: string;
};

const NAME_ALIASES: Record<string, string> = {
  'chromium (hexavalent)': 'Chromium-6',
  'hexavalent chromium': 'Chromium-6',
  'haloacetic acids (haa5)': 'Haloacetic Acids (HAA5)',
  'haloacetic acids (haa9)': 'Haloacetic Acids (HAA9)',
  'total trihalomethanes (tthms)': 'Total Trihalomethanes (TTHMs)',
  'trihalomethanes': 'Total Trihalomethanes (TTHMs)',
  'dichloroacetic acid': 'Dichloroacetic Acid',
  'trichloroacetic acid': 'Trichloroacetic Acid',
  'dibromoacetic acid': 'Dibromoacetic Acid',
  'monochloroacetic acid': 'Monochloroacetic Acid',
  'radium': 'Radium (combined)',
  'combined radium': 'Radium (combined)',
  'total coliform': 'Total Coliform',
};

export function normalizeEwgContaminantName(raw: string): string {
  const key = raw.trim().toLowerCase();
  if (NAME_ALIASES[key]) return NAME_ALIASES[key];
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\bHaa5\b/i, 'HAA5')
    .replace(/\bHaa9\b/i, 'HAA9')
    .replace(/\bTthms?\b/i, 'TTHMs')
    .replace(/\bPfas\b/i, 'PFAS');
}

/** Extract utility-average contaminants from EWG system.php HTML */
export function parseEwgSystemPageHtml(html: string): EwgParsedContaminant[] {
  const parts = html.split(/<h3[^>]*>/i);
  const out: EwgParsedContaminant[] = [];

  for (const part of parts.slice(1)) {
    const close = part.indexOf('</h3>');
    if (close < 0) continue;
    const rawName = part
      .slice(0, close)
      .replace(/<[^>]+>/g, '')
      .trim();
    if (!rawName || rawName.length > 120) continue;

    const body = part.slice(close + 5);
    const levelMatch = body.match(/This Utility:\s*([\d.]+)\s*(ppb|ppm|ppt|pCi\/L|NTU|μg\/L|ug\/L)/i);
    if (!levelMatch) continue;

    const level = parseFloat(levelMatch[1]);
    if (!Number.isFinite(level)) continue;

    let unit = levelMatch[2];
    if (unit.toLowerCase() === 'ug/l') unit = 'μg/L';

    const legalMatch = body.match(/Legal Limit:\s*([\d.]+)\s*(ppb|ppm|ppt|pCi\/L|NTU|μg\/L|ug\/L)/i);
    const limit = legalMatch ? parseFloat(legalMatch[1]) : null;
    const limitUnit = legalMatch ? legalMatch[2] : unit;

    out.push({
      name: normalizeEwgContaminantName(rawName),
      level,
      unit,
      limit: Number.isFinite(limit) ? limit : null,
      limitUnit,
    });
  }

  return out;
}

export function severityFromLevel(
  level: number,
  limit: number | null,
  unit: string,
): 'high' | 'moderate' | 'low' {
  if (limit == null || limit <= 0) return 'low';
  if (level > limit) return 'high';
  if (unit === 'mg/L' && limit <= 20) return level > limit * 0.9 ? 'moderate' : 'low';
  return level > limit * 0.5 ? 'moderate' : 'low';
}
