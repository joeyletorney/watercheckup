import { CITIES } from '@/app/water/[city]/cities-data';
import EmailCapture from '@/app/water/[city]/EmailCapture';
import { CityContaminantTable } from '@/components/CityContaminantTable';
import { CityFilterTechMatrix } from '@/components/CityFilterTechMatrix';
import { CityLegalVsSafeBanner } from '@/components/CityLegalVsSafeBanner';
import { CityLocalWaterStats } from '@/components/CityLocalWaterStats';
import { TestVsFilterCta } from '@/components/TestVsFilterCta';
import { buildCityContaminantDisplay } from '@/lib/city-contaminant-display';
import { resolveCityPwsid } from '@/lib/city-pwsid';
import { computeCityWaterScore } from '@/lib/city-water-score';
import { getCityPfasData } from '@/lib/ucmr5-city-pfas';
import { quizHrefFromCityPage, shouldEmphasizeLabTest } from '@/lib/results-quiz-link';

type Props = {
  slug: string;
};

/** EWG-style live contaminant data, benchmarks, filter matrix, and test-vs-filter funnel for dedicated city routes */
export function PriorityCityLiveDataBlock({ slug }: Props) {
  const cd = CITIES[slug];
  if (!cd) return null;

  const pwsid = resolveCityPwsid(slug, cd.pwsid, cd.zip);
  const pfas = getCityPfasData(pwsid);
  const contaminantRows = buildCityContaminantDisplay(slug, cd.pwsid, cd.waterProfile, 18, cd.zip, cd.state);
  const waterScore = computeCityWaterScore(cd, pfas);

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#0891b2',
          letterSpacing: 2,
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid #0f2336',
        }}
      >
        LIVE EPA & UCMR5 DATA — {cd.name.toUpperCase()}
      </div>

      <CityLocalWaterStats
        cityName={cd.name}
        stateCode={cd.state}
        pwsid={pwsid}
        rows={contaminantRows}
        pfasCompoundCount={pfas?.compounds?.length ?? 0}
      />

      {contaminantRows.length > 0 ? (
        <>
          <CityLegalVsSafeBanner cityName={cd.name} />
          <CityContaminantTable
            cityName={cd.name}
            stateCode={cd.state}
            rows={contaminantRows}
            sourceNote="EPA UCMR5 PFAS plus utility/EWG averages with national and state benchmarks. Run a ZIP report for SDWIS samples at your address."
          />
        </>
      ) : null}

      <div
        style={{
          marginBottom: 24,
          padding: '14px 18px',
          background: 'rgba(8,145,178,0.07)',
          border: '1px solid rgba(8,145,178,0.25)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 13, color: '#cbd5e1', flexShrink: 0 }}>
          🔔 Get alerts if {cd.name}&apos;s water data changes:
        </span>
        <EmailCapture cityName={cd.name} slug={slug} inline />
      </div>

      <CityFilterTechMatrix rows={contaminantRows} cityName={cd.name} />

      <TestVsFilterCta
        contextLabel={cd.name}
        filterHref={quizHrefFromCityPage({
          zip: cd.zip,
          hasPfas: (pfas?.compounds?.length ?? 0) > 0,
          urgency: cd.urgency,
        })}
        emphasizeTest={shouldEmphasizeLabTest({
          pfasCount: pfas?.compounds?.length,
          pfasAboveMcl: pfas?.violations,
          score: waterScore.score,
          hasLeadSignal: cd.issues.some(i => /lead/i.test(i)),
        })}
        filterCtaLabel="Take the 3-question filter quiz →"
      />
    </div>
  );
}
