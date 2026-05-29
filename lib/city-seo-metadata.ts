import type { Metadata } from 'next';
import { computeWaterScore, getCityKeyFinding, type CityPfasSnapshot } from './city-water-score';

type CityRecord = {
  name: string;
  state: string;
  issues: string[];
  urgency: 'high' | 'medium' | 'low';
};

/** Prefix grade + key finding for higher CTR in search results */
export function buildCityTitleTag(
  baseTitle: string,
  grade: string,
  keyFinding: string
): string {
  return `Grade ${grade} · ${keyFinding} — ${baseTitle}`;
}

export function buildDefaultCityTitle(cityName: string, grade: string, keyFinding: string): string {
  return `${cityName} Tap Water 2026 — Grade ${grade} · ${keyFinding}`;
}

export function buildCityMetaDescription(
  city: CityRecord,
  grade: string,
  score: number,
  keyFinding: string,
  customDescription?: string
): string {
  const gradeLead = `${city.name} earns Water Safety Grade ${grade} (${score}/100). ${keyFinding}.`;
  if (customDescription) {
    return `${gradeLead} ${customDescription}`;
  }
  const topIssue = city.issues[0]?.toLowerCase() ?? 'contaminants';
  return `${gradeLead} Free EPA report for ${city.name}, ${city.state}: ${topIssue}, PFAS UCMR5 data, lead risk & certified filter picks.`;
}

export function buildCityPageMetadata(
  slug: string,
  city: CityRecord,
  pfas: CityPfasSnapshot,
  prioritySeo?: { title: string; description: string }
): Metadata {
  const ws = computeWaterScore(city.urgency, city.issues, pfas);
  const keyFinding = getCityKeyFinding(city.urgency, city.issues, pfas);

  const baseTitle = prioritySeo?.title ?? buildDefaultCityTitle(city.name, ws.grade, keyFinding);
  const title = prioritySeo ? prioritySeo.title : baseTitle;

  const description = prioritySeo?.description
    ?? buildCityMetaDescription(city, ws.grade, ws.score, keyFinding);

  const canonical = `https://watercheckup.com/water/${slug}`;
  const ogQuery = `city=${encodeURIComponent(city.name + ', ' + city.state)}&score=${ws.score}&grade=${encodeURIComponent(ws.grade)}&violations=${pfas?.violations ?? 0}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: [
        {
          url: `https://watercheckup.com/api/og?${ogQuery}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
