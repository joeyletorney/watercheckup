import { getCtrSerpOverride } from './ctr-serp-seo';
import type { Metadata } from 'next';
import {
  computeCityWaterScore,
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
  const canonical = `https://watercheckup.com/water/${slug}`;

  const existingTitle = getCtrSerpOverride(`/water/${slug}`)?.title ?? prioritySeo?.title;
  // Preserve useful local search wording, but do not keep hand-written grades or concentrations.
  const title = existingTitle && !/\d[\d.,]*\s*ppt|\bgrade\b|\/88|\b[A-F][+-]?\s*[·—]/i.test(existingTitle)
    ? existingTitle
    : `${city.name} Tap Water — PFAS, Lead & EPA Report`;
  const description = !pfas
    ? `${city.name} supplier information and household plumbing context. Historical PFAS coverage is incomplete; check official sources before choosing a test or filter.`
    : `${city.name}: ${pfas.compounds.length} PFAS compounds listed in our historical snapshot; ${pfas.violations} peaks above April 2024 benchmarks. Sources, limitations, and next steps.`;
  const ogQuery = `city=${encodeURIComponent(city.name + ', ' + city.state)}&score=${ws.score}&grade=${encodeURIComponent(ws.grade)}&violations=${pfas?.violations ?? 0}`;

  return {
    title: { absolute: `${title.replace(/\s*\|\s*WaterCheckup/g, '')} | WaterCheckup` },
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
