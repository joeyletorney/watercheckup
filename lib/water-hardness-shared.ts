/** Client-safe hardness math and labels (no UCMR / heavy JSON). */

export type HardnessTier = "soft" | "moderate" | "hard" | "very_hard";

export type HardnessAnalysis = {
  ppm: number;
  gpg: number;
  tier: HardnessTier;
  label: string;
  color: string;
  border: string;
  explanation: string;
};

export function mgLToGpg(ppm: number): number {
  return ppm / 17.118;
}

export function gpgToMgL(gpg: number): number {
  return gpg * 17.118;
}

export function toPpm(value: number, unit: "ppm" | "gpg" | "mgL"): number {
  if (!Number.isFinite(value) || value < 0) return NaN;
  switch (unit) {
    case "ppm":
    case "mgL":
      return value;
    case "gpg":
      return gpgToMgL(value);
    default:
      return value;
  }
}

export function analyzeHardnessMgL(ppm: number): HardnessAnalysis {
  const gpg = Math.round(mgLToGpg(ppm) * 10) / 10;
  let tier: HardnessTier;
  let label: string;
  let color: string;
  let border: string;
  let explanation: string;

  if (ppm <= 60) {
    tier = "soft";
    label = "Soft";
    color = "#38bdf8";
    border = "#0ea5e9";
    explanation =
      "Your water picks up relatively little calcium and magnesium. Scale buildup is usually minor, soap can lather easily, and appliances see less mineral fouling. Very soft water can feel slick after showering and may be slightly more corrosive to metal plumbing; many households still use a simple carbon filter for taste.";
  } else if (ppm <= 120) {
    tier = "moderate";
    label = "Moderately hard";
    color = "#4ade80";
    border = "#22c55e";
    explanation =
      "Typical of many municipal supplies. You may notice some spots on glassware and gradual scale in kettles or showerheads. A descaler, shower filter, or periodic vinegar cleaning is often enough before jumping to a full softener. Ideal range for many people who want mineral in water without heavy scale.";
  } else if (ppm < 180) {
    tier = "hard";
    label = "Hard";
    color = "#fbbf24";
    border = "#f59e0b";
    explanation =
      "Minerals are high enough that scale on fixtures, soap scum, and reduced detergent performance become common. Water heaters and dishwashers work harder and may lose efficiency. A salt-based softener or template-assisted crystallization system often pays for itself in appliance life and cleaning time.";
  } else {
    tier = "very_hard";
    label = "Very hard";
    color = "#f87171";
    border = "#ef4444";
    explanation =
      "Very mineral-rich water: fast scale on plumbing, shortened appliance life, and stubborn soap film. Whole-home ion-exchange softening is the standard treatment; pairing with reverse osmosis at the kitchen sink gives sodium-free drinking water if you want both softening and filtration.";
  }

  return { ppm: Math.round(ppm * 10) / 10, gpg, tier, label, color, border, explanation };
}
