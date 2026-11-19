import type { Metadata } from 'next';
import {
  computeCityWaterScore,
  type CityPfasSnapshot,
  type ScoreWaterProfile,
} from './city-water-score';
import { getCtrSerpOverride } from './ctr-serp-seo';
import {
  buildCitySeoDescription,
  buildCitySeoTitle,
  citySeoDisplayName,
} from './serp-copy';

type CityRecord = {
  name: string;
  state: string;
  system?: string;
  issues: string[];
  urgency: 'high' | 'medium' | 'low';
  waterProfile?: ScoreWaterProfile;
};

export {
  buildCityPageH1,
  buildCitySeoDescription,
  buildCitySeoTitle,
  citySeoDisplayName,
} from './serp-copy';

/** Default SERP copy for city pages without a hand-tuned override */
export function buildDefaultCitySeoTitle(cityName: string): string {
  return buildCitySeoTitle(cityName);
}

export function buildDefaultCitySeoDescription(cityName: string): string {
  return buildCitySeoDescription({
    cityName,
    system: cityName,
    issues: [],
    pfas: null,
  });
}

export function buildCityPageMetadata(
  slug: string,
  city: CityRecord,
  pfas: CityPfasSnapshot,
  _prioritySeo?: { title: string; description: string }
): Metadata {
  const ws = computeCityWaterScore(city, pfas);
  const canonical = `https://watercheckup.com/water/${slug}`;
  const displayName = citySeoDisplayName(slug, city.name);

  const generatedTitle = buildCitySeoTitle(displayName);
  const generatedDescription = buildCitySeoDescription({
    cityName: displayName,
    system: city.system ?? city.name,
    issues: city.issues,
    pfas,
    grade: ws.grade,
  });

  const ctr = getCtrSerpOverride(`/water/${slug}`);
  const title = ctr?.title ?? generatedTitle;
  const description = ctr?.description ?? generatedDescription;
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
    twitter: {
      title,
      description,
    },
  };
}
