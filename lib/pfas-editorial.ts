import type { CityPfasSnapshot } from './city-water-score';

/** One sentence that matches the packaged UCMR5 snapshot — never invents a detection or an all-clear. */
export function pfasSnapshotSentence(pfas: CityPfasSnapshot): string {
  if (!pfas) {
    return 'This packaged UCMR5 snapshot has no matching PFAS record for this supplier. Missing coverage does not establish detection or nondetection.';
  }
  if (!pfas.compounds.length) {
    return 'This UCMR5 snapshot lists no reportable PFAS detections for this supplier. That does not prove every compound is absent or that a household tap was tested.';
  }
  const above = pfas.compounds.filter(([, , , over]) => over > 0).map(([name]) => name);
  if (above.length) {
    return `UCMR5 monitoring lists ${pfas.compounds.length} PFAS compound(s) for this supplier, including ${above.slice(0, 3).join(', ')} above April 2024 comparison benchmarks. Historical peaks are not official compliance findings.`;
  }
  return `UCMR5 monitoring lists ${pfas.compounds.length} PFAS compound(s) detected for this supplier. Regulated peaks in this snapshot are at or below April 2024 comparison benchmarks.`;
}

const DETECTION_CLAIM =
  /\bPFAS[\s\S]{0,200}?(?:detected|detections|detection|has shown up|have shown up|shows? up|has appeared|have appeared|logged PFAS detections)[\s\S]{0,140}?[.!?]/gi;
const ABSENCE_CLAIM =
  /\b(?:no PFAS|none (?:was |were )?detected|lists no reportable PFAS|detected none|no reportable PFAS detections)[\s\S]{0,160}?[.!?]/gi;

function matches(re: RegExp, text: string): boolean {
  re.lastIndex = 0;
  const hit = re.test(text);
  re.lastIndex = 0;
  return hit;
}

/** Rewrite PFAS detection/absence claims so editorial copy cannot contradict the snapshot. */
export function alignEditorialPfasCopy(text: string, pfas: CityPfasSnapshot): string {
  const sentence = pfasSnapshotSentence(pfas);
  const hasDetections = !!pfas?.compounds.length;
  let out = text;
  if (!hasDetections && matches(DETECTION_CLAIM, out)) {
    out = out.replace(DETECTION_CLAIM, `${sentence} `);
  }
  if (hasDetections && matches(ABSENCE_CLAIM, out)) {
    out = out.replace(ABSENCE_CLAIM, `${sentence} `);
  }
  return out.replace(/[ \t]{2,}/g, ' ').trim();
}

export function alignEditorialPfasParagraphs(
  paragraphs: readonly string[],
  pfas: CityPfasSnapshot,
): string[] {
  return paragraphs.map((paragraph) => alignEditorialPfasCopy(paragraph, pfas));
}
