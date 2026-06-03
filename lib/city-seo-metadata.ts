import type { Metadata } from 'next';
import {
  computeWaterScore,
  formatPrioritySeoDescription,
  formatPrioritySeoTitle,
  type CityPfasSnapshot,
} from './city-water-score';

type CityRecord = {
  name: string;
  state: string;
  issues: string[];
  urgency: 'high' | 'medium' | 'low';
};

/** Default SERP copy for city pages without hand-written priority SEO */
export function buildDefaultCitySeoTitle(cityName: string): string {
  return `${cityName} Water Quality Report – What's in ${cityName} Tap Water?`;
}

export function buildDefaultCitySeoDescription(cityName: string): string {
  return `See detected contaminants in ${cityName}'s tap water, sourced from 5 EPA databases. Free, no signup required. Updated regularly.`;
}

export function buildCityPageMetadata(
  slug: string,
  city: CityRecord,
  pfas: CityPfasSnapshot,
  prioritySeo?: { title: string; description: string }
): Metadata {
  const ws = computeWaterScore(city.urgency, city.issues, pfas);

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
