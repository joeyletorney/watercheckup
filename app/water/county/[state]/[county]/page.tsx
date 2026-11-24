import { permanentRedirect } from 'next/navigation';
import { resolveLegacyCountyPath } from '@/lib/legacy-water-redirects';

export default async function LegacyCountyWaterRedirect({
  params,
}: {
  params: Promise<{ state: string; county: string }>;
}) {
  const { state, county } = await params;
  permanentRedirect(resolveLegacyCountyPath(state, county));
}
