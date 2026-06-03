import type { Metadata } from 'next';
import {
  computeCityWaterScore,
  formatPrioritySeoDescription,
  formatPrioritySeoTitle,
  type CityPfasSnapshot,
  type ScoreWaterProfile,
} from './city-water-score';

type CityRecord = {
  name: string;
  state: string;
  issues: string[];
  urgency: 'high' | 'medium' | 'low';
  waterProfile?: ScoreWaterProfile;
};

/** Default SERP copy for city pages without hand-written priority SEO */
export function buildDefaultCitySeoTitle(cityName: string): string {
  return `${cityName} Tap Water 2026 — PFAS, Lead & Safety Grade`;
}

export function buildDefaultCitySeoDescription(cityName: string): string {
  return `${cityName} tap water: EPA violations, UCMR5 PFAS, and contaminants vs health guidelines. Free 2026 report with letter grade and NSF filter picks.`;
}

export function buildCityPageMetadata(
  slug: string,
  city: CityRecord,
  pfas: CityPfasSnapshot,
  prioritySeo?: { title: string; description: string }
): Metadata {
  const ws = computeCityWaterScore(city, pfas);

  const title = prioritySeo?.title
    ? formatPrioritySeoTitle(prioritySeo.title, ws.grade, ws.score)
    : buildDefaultCitySeoTitle(city.name);
  const description = prioritySeo
    ? formatPrioritySeoDescription(prioritySeo.description, ws.grade, ws.score)
    : buildDefaultCitySeoDescription(city.name);

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
