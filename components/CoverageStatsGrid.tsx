import { SITE_COVERAGE_STATS } from '@/lib/site-stats';

type Props = {
  className?: string;
};

export function CoverageStatsGrid({ className }: Props) {
  return (
    <div className={className ? `wc-coverage-stats ${className}` : 'wc-coverage-stats'}>
      {SITE_COVERAGE_STATS.map(({ stat, label }) => (
        <div key={label} className="wc-coverage-stats__item">
          <div className="wc-coverage-stats__value">{stat}</div>
          <div className="wc-coverage-stats__label">{label}</div>
        </div>
      ))}
    </div>
  );
}
