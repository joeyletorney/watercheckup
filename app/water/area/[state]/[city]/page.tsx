import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CityWaterReport } from '@/components/CityWaterReport';
import { getCityByStateAndCitySlug } from '@/lib/cities';
import { sdwisPublicReportUrl } from '@/lib/epa-data';

/**
 * Nested state + city URLs live under `/water/area/...` because Next.js does not allow
 * `app/water/[city]` and `app/water/[state]` as sibling dynamic segments (param name must match at that level).
 */
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const row = getCityByStateAndCitySlug(state, city);
  if (!row) return { title: 'Water quality | WaterCheckup' };
  const { data: cd } = row;
  const top = cd.issues[0] ?? 'Tap water quality';
  return {
    title: `${cd.name}, ${cd.state} Water Summary | WaterCheckup`,
    description: `${cd.name} (${cd.state}): ${top}. Utility ${cd.system}. EPA PWSID ${cd.pwsid}. Open the full report for PFAS data and filter picks.`,
    alternates: {
      canonical: `https://watercheckup.com/water/area/${state}/${city}`,
    },
    openGraph: {
      title: `${cd.name}, ${cd.state} — water summary`,
      description: `EPA-linked snapshot for ${cd.name}. See issues, facts, and the full WaterCheckup city report.`,
    },
  };
}

export default async function StateCityWaterPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const row = getCityByStateAndCitySlug(state, city);
  if (!row) notFound();

  return (
    <CityWaterReport
      stateSlug={state.toLowerCase()}
      citySlug={row.slug}
      city={row.data}
      sdwisUrl={sdwisPublicReportUrl(row.data.pwsid)}
    />
  );
}
