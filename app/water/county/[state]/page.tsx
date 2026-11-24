import { permanentRedirect } from 'next/navigation';
import { legacyWaterRedirectPath } from '@/lib/legacy-water-redirects';

export default async function LegacyCountyStateRedirect({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  permanentRedirect(legacyWaterRedirectPath(`/water/county/${state}`) ?? '/water');
}
