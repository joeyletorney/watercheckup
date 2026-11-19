/**
 * EPA SDWIS uses CONTAMINANT_CODE for both chemicals and drinking-water *rules*.
 * Values below are from SDWA_REF_CODE_VALUES (VALUE_TYPE = CONTAMINANT_CODE / RULE_CODE).
 * 0800 is Long Term 2 ESWTR — a treatment-technique rule, not a measured analyte.
 */

export const SDWIS_RULE_CONTAMINANT_NAMES: Record<string, string> = {
  '0200': 'Surface Water Treatment Rule',
  '0300': 'Interim Enhanced Surface Water Treatment Rule',
  '0400': 'Stage 1 Disinfectants and Disinfection Byproducts Rule',
  '0500': 'Filter Backwash Rule',
  '0600': 'Stage 2 Disinfectants and Disinfection Byproducts Rule',
  '0700': 'Ground Water Rule',
  '0800': 'Long Term 2 Enhanced Surface Water Treatment Rule',
  '7000': 'Consumer Confidence Rule',
  '8000': 'Revised Total Coliform Rule',
};

export const SDWIS_RULE_CODE_NAMES: Record<string, string> = {
  '110': 'Total Coliform Rule',
  '111': 'Revised Total Coliform Rule',
  '121': 'Surface Water Treatment Rule',
  '122': 'Interim and Long Term 1 Enhanced Surface Water Treatment Rule',
  '123': 'Long Term 2 Enhanced Surface Water Treatment Rule',
  '130': 'Filter Backwash Rule',
  '140': 'Ground Water Rule',
  '210': 'Stage 1 Disinfectants and Disinfection Byproducts Rule',
  '220': 'Stage 2 Disinfectants and Disinfection Byproducts Rule',
  '230': 'Former Total Trihalomethane Rule',
  '310': 'Volatile Organic Chemicals',
  '320': 'Synthetic Organic Chemicals',
  '331': 'Nitrate Rule',
  '332': 'Arsenic Rule',
  '333': 'Inorganic Chemicals',
  '340': 'Radionuclides and Revised Rad Rule',
  '350': 'Lead and Copper Rule',
  '351': 'Lead and Copper Rule Revisions',
  '352': 'Lead and Copper Rule Improvements',
  '360': 'PFAS Rule',
  '410': 'Public Notice Rule',
  '420': 'Consumer Confidence Rule',
};

export type SdwisViolationSubject = {
  kind: 'rule' | 'contaminant';
  name: string;
};

function normalizeSdwisCode(code: string): string {
  const text = String(code || '').trim();
  if (/^\d+$/.test(text) && text.length < 4) return text.padStart(4, '0');
  return text;
}

export function isSdwisRuleContaminantCode(code: string): boolean {
  const normalized = normalizeSdwisCode(code);
  return Object.prototype.hasOwnProperty.call(SDWIS_RULE_CONTAMINANT_NAMES, normalized);
}

export function labelSdwisViolationSubject(
  input: {
    contaminantCode?: string;
    contaminantName?: string;
    ruleCode?: string;
    category?: string;
  },
  chemicalNames: Record<string, string> = {},
): SdwisViolationSubject | null {
  const code = normalizeSdwisCode(input.contaminantCode || '');
  const rawCode = String(input.contaminantCode || '').trim();
  const epaName = String(input.contaminantName || '').trim();
  const ruleCode = String(input.ruleCode || '').trim();
  const category = String(input.category || '').trim().toUpperCase();

  const ruleFromContaminant = SDWIS_RULE_CONTAMINANT_NAMES[code];
  if (ruleFromContaminant) return { kind: 'rule', name: ruleFromContaminant };

  const chemical = chemicalNames[rawCode] || chemicalNames[code];
  if (chemical) return { kind: 'contaminant', name: chemical };

  if (epaName && !/^contaminant\s+\w+$/i.test(epaName) && !/^\d+$/.test(epaName)) {
    return { kind: 'contaminant', name: epaName };
  }

  const ruleFromRuleCode = SDWIS_RULE_CODE_NAMES[ruleCode];
  if (ruleFromRuleCode) return { kind: 'rule', name: ruleFromRuleCode };

  if (code) {
    if (category === 'TT') {
      return { kind: 'rule', name: `Treatment technique (EPA code ${rawCode || code})` };
    }
    return { kind: 'contaminant', name: `EPA code ${rawCode || code}` };
  }

  return null;
}
