/** Map a city's measured contaminants to NSF certifications and existing catalog picks. */

import { PRODUCTS } from '@/lib/home-products-catalog';
import { resolveProductBuyLink } from '@/lib/product-buy-url';
import type { ContaminantRow } from '@/lib/water-contaminants';

export type NsfCertNeed = {
  code: 'NSF/ANSI 42' | 'NSF/ANSI 53' | 'NSF/ANSI 58' | 'NSF/ANSI 401' | 'NSF P473';
  why: string;
};

export type CityFilterPick = {
  productId: number;
  product: string;
  brand: string;
  badge: string;
  reason: string;
  certs: string[];
  href: string;
  destination: 'amazon' | 'direct';
  buyLabel: string;
  img?: string;
};

const PRODUCT_IDS = {
  g3p600: 47,
  aquatruClassic: 31,
  clearlyFiltered: 9,
  zeroWater: 10,
  sk99: 23,
} as const;

export type FilterConcerns = {
  pfasNames: string[];
  hasPfas: boolean;
  hasLead: boolean;
  hasChromium6: boolean;
  hasArsenic: boolean;
  hasNitrate: boolean;
  hasFluoride: boolean;
  hasDbp: boolean;
  hasChlorine: boolean;
  hasHardness: boolean;
  highTds: boolean;
  needsRo: boolean;
};

export function isMeasuredContaminant(row: ContaminantRow): boolean {
  return row.level != null && Number.isFinite(row.level) && row.level > 0;
}

export function formatMeasuredLevel(row: ContaminantRow): string {
  if (row.level == null || !Number.isFinite(row.level)) return '';
  const value = row.level;
  const digits = row.unit === 'ppt' || row.unit === 'ppb' ? (value < 10 ? 2 : 1) : value < 10 ? 2 : 1;
  return `${value.toFixed(digits)} ${row.unit}`;
}

function nameMatches(row: ContaminantRow, re: RegExp): boolean {
  return re.test(row.name) || (!!row.isPFAS && re.test('pfas'));
}

export function analyzeFilterConcerns(
  rows: ContaminantRow[],
  issues: string[],
): FilterConcerns {
  const measured = rows.filter(isMeasuredContaminant);
  const issueText = issues.join(' ');
  const pfasRows = measured.filter(
    (row) =>
      row.isPFAS ||
      /pfas|pfoa|pfos|pfhxs|pfna|genx|hfpo|perfluoro/i.test(row.name),
  );
  const hasLead =
    measured.some((row) => /^lead$/i.test(row.name)) || /lead/i.test(issueText);
  const hasChromium6 = measured.some((row) => /chromium-?6|hexavalent/i.test(row.name));
  const hasArsenic = measured.some((row) => /^arsenic$/i.test(row.name));
  const hasNitrate = measured.some((row) => /^nitrate$/i.test(row.name));
  const hasFluoride = measured.some((row) => /^fluoride$/i.test(row.name));
  const hasDbp = measured.some((row) =>
    nameMatches(row, /trihalomethane|thm|haloacetic|haa|chloroform|dbp/i),
  );
  const hasChlorine = measured.some((row) => /chlorine|chloramine/i.test(row.name))
    || /chloramine|chlorine/i.test(issueText);
  const hardness = measured.find((row) => /hardness/i.test(row.name));
  const tds = measured.find((row) => /dissolved solids|^tds$/i.test(row.name));
  const hasHardness = !!hardness && (hardness.level ?? 0) > 150;
  const highTds = !!tds && (tds.level ?? 0) > 500;
  const hasPfas = pfasRows.length > 0;
  const needsRo =
    hasPfas || hasChromium6 || hasArsenic || hasNitrate || highTds || (hasDbp && hasPfas);

  return {
    pfasNames: pfasRows.map((row) => row.name),
    hasPfas,
    hasLead,
    hasChromium6,
    hasArsenic,
    hasNitrate,
    hasFluoride,
    hasDbp,
    hasChlorine,
    hasHardness,
    highTds,
    needsRo,
  };
}

export function nsfCertsForConcerns(
  concerns: FilterConcerns,
  measuredLabels: string[],
): NsfCertNeed[] {
  const certs: NsfCertNeed[] = [];
  const listed = measuredLabels.slice(0, 4).join(', ');

  if (concerns.needsRo || concerns.hasFluoride) {
    certs.push({
      code: 'NSF/ANSI 58',
      why: `Reverse osmosis (NSF 58) is the residential listing that covers dissolved contaminants in this city's measured profile${listed ? ` (${listed})` : ''}. Confirm the exact model listing before you buy.`,
    });
  }
  if (concerns.hasPfas) {
    certs.push({
      code: 'NSF P473',
      why: `P473 is the NSF protocol for PFOA/PFOS reduction. This system's PFAS snapshot includes ${concerns.pfasNames.slice(0, 4).join(', ') || 'listed PFAS compounds'}. Few pitchers hold a current P473 listing — treat lab tests to P473 methods as published data, not an NSF listing, unless the exact model is listed.`,
    });
    certs.push({
      code: 'NSF/ANSI 401',
      why: "NSF 401 covers some emerging contaminants. Match the exact listing to the PFAS or related compounds on this city's report; a 401 mark alone is not a PFAS guarantee.",
    });
  }
  if (concerns.hasLead) {
    certs.push({
      code: 'NSF/ANSI 53',
      why: 'NSF 53 covers health effects including lead. Use it when this city report or plumbing profile flags lead at the tap, and verify the exact cartridge lists lead reduction.',
    });
  }
  if (concerns.hasDbp || concerns.hasChlorine) {
    certs.push({
      code: 'NSF/ANSI 42',
      why: 'NSF 42 covers chlorine and chloramine taste and odor. It is not a PFAS or lead health listing by itself.',
    });
  }
  if (!certs.some((c) => c.code === 'NSF/ANSI 58') && measuredLabels.length) {
    certs.push({
      code: 'NSF/ANSI 58',
      why: `NSF 58 reverse osmosis is the broadest kitchen option when a city report lists dissolved contaminants such as ${listed}.`,
    });
  }
  const seen = new Set<string>();
  return certs.filter((cert) => {
    if (seen.has(cert.code)) return false;
    seen.add(cert.code);
    return true;
  });
}

function catalogProduct(id: number) {
  return PRODUCTS.find((p) => p.id === id && !p.retired && !p.outOfStock);
}

function measuredSummary(rows: ContaminantRow[], limit = 3): string {
  return rows
    .filter(isMeasuredContaminant)
    .slice(0, limit)
    .map((row) => {
      const level = formatMeasuredLevel(row);
      return level ? `${row.name} at ${level}` : row.name;
    })
    .join('; ');
}

function reasonForProduct(
  id: number,
  cityName: string,
  concerns: FilterConcerns,
  summary: string,
): { badge: string; reason: string } {
  if (id === PRODUCT_IDS.g3p600) {
    const focus = concerns.hasPfas
      ? 'PFAS and other dissolved contaminants'
      : concerns.hasChromium6
        ? 'chromium-6'
        : concerns.hasArsenic
          ? 'arsenic'
          : concerns.hasLead
            ? 'lead plus dissolved contaminants'
            : 'this city\'s measured dissolved-contaminant profile';
    return {
      badge: 'KITCHEN RO',
      reason: `Waterdrop G3P600 is listed to NSF/ANSI 42, 53, 58, and 372. For ${cityName} it is the under-sink pick because this system's measured profile includes ${summary || focus}. Confirm the exact G3P600 reduction claims for ${focus}.`,
    };
  }
  if (id === PRODUCT_IDS.aquatruClassic) {
    return {
      badge: 'NO PLUMBING',
      reason: `AquaTru Classic is a countertop reverse osmosis unit listed to NSF/ANSI 42, 53, 58, and 401 — useful in ${cityName} when you cannot drill a faucet. It is aimed at ${summary || 'the dissolved contaminants on this report'}. Needs an outlet and tank refills.`,
    };
  }
  if (id === PRODUCT_IDS.clearlyFiltered) {
    return {
      badge: 'PITCHER · LAB-TESTED PFAS',
      reason: `Clearly Filtered's 10-cup pitcher is NSF/ANSI 42 and 372 certified. Broader PFAS and lead figures are published lab tests, not NSF 53, 401, or P473 listings. A no-install option for ${cityName} when the report includes ${summary || 'PFAS or metals'}.`,
    };
  }
  if (id === PRODUCT_IDS.zeroWater) {
    return {
      badge: 'PITCHER · NSF 53 LEAD',
      reason: `ZeroWater's 10-cup pitcher is NSF/ANSI 42 and 53 certified for lead, chromium, and arsenic. For ${cityName} it is the budget no-install pick when this report includes ${summary || 'lead or metals'}. Filter life shortens as incoming dissolved solids rise.`,
    };
  }
  return {
    badge: 'DIRECT-CONNECT CARBON',
    reason: `Frizzlife SK99-NEW is IAPMO certified to NSF/ANSI 42, 53, and 372 and uses the existing cold-water faucet. For ${cityName} it fits ${summary || 'chlorine, DBPs, or lead at the tap'} when you do not want an RO drain. It does not soften water or reduce dissolved salts.`,
  };
}

function productIdsForConcerns(concerns: FilterConcerns): number[] {
  if (concerns.needsRo || concerns.hasFluoride) {
    const ids: number[] = [PRODUCT_IDS.g3p600, PRODUCT_IDS.aquatruClassic];
    if (concerns.hasPfas) ids.push(PRODUCT_IDS.clearlyFiltered);
    else if (concerns.hasLead) ids.push(PRODUCT_IDS.zeroWater);
    else ids.push(PRODUCT_IDS.sk99);
    return ids;
  }
  if (concerns.hasLead) {
    return [PRODUCT_IDS.sk99, PRODUCT_IDS.zeroWater, PRODUCT_IDS.g3p600];
  }
  if (concerns.hasDbp || concerns.hasChlorine) {
    return [PRODUCT_IDS.sk99, PRODUCT_IDS.g3p600, PRODUCT_IDS.clearlyFiltered];
  }
  if (concerns.hasHardness) {
    return [PRODUCT_IDS.g3p600, PRODUCT_IDS.aquatruClassic, PRODUCT_IDS.sk99];
  }
  return [PRODUCT_IDS.g3p600, PRODUCT_IDS.sk99, PRODUCT_IDS.aquatruClassic];
}

export function picksForCityProfile(
  cityName: string,
  rows: ContaminantRow[],
  issues: string[],
): { concerns: FilterConcerns; certs: NsfCertNeed[]; picks: CityFilterPick[] } {
  const concerns = analyzeFilterConcerns(rows, issues);
  const labels = rows.filter(isMeasuredContaminant).map((row) => {
    const level = formatMeasuredLevel(row);
    return level ? `${row.name} (${level})` : row.name;
  });
  const certs = nsfCertsForConcerns(concerns, labels);
  const summary = measuredSummary(rows);
  const picks: CityFilterPick[] = [];
  const seen = new Set<number>();

  for (const id of productIdsForConcerns(concerns)) {
    if (seen.has(id)) continue;
    const product = catalogProduct(id);
    if (!product) continue;
    seen.add(id);
    const buy = resolveProductBuyLink({
      name: product.name,
      brand: product.brand,
      amazon: product.amazon,
      directLink: product.brandLink,
    });
    if (!buy.href || buy.href === '#' || buy.href.startsWith('/')) continue;
    const copy = reasonForProduct(id, cityName, concerns, summary);
    picks.push({
      productId: id,
      product: product.name,
      brand: product.brand,
      badge: copy.badge,
      reason: copy.reason,
      certs: Array.isArray(product.cert) ? product.cert : [],
      href: buy.href,
      destination: buy.destination,
      buyLabel: buy.label,
      img: typeof product.img === 'string' ? product.img : undefined,
    });
    if (picks.length >= 3) break;
  }

  return { concerns, certs, picks };
}
