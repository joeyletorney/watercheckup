# Report integrity and site repairs — November 10, 2026

This update implements the first repair pass from the website audit. It does not refresh the complete federal dataset or assert that every historical measurement describes current water at a household tap.

## Report integrity

- Decode compact UCMR5 records in one shared function. Compound fields mean benchmark availability and benchmark exceedance; the optional fourth system value is lithium in µg/L, never hardness.
- Recompute exceedance flags from the measured concentration and compound-specific April 2024 benchmark. Unregulated compounds are not compared to the PFOA/PFOS 4 ppt value.
- Resolve city identity independently of UCMR5 availability. Never substitute a different utility just because it has monitoring records.
- Remove the old API override table and unverified static metropolitan contaminant estimates. Prefer the packaged ZIP supplier map, then EPA discovery; retain only the explicitly identified Philadelphia postal fallback.
- Correct NYC, Philadelphia, and Parkersburg identifiers and known misattributed narrative claims. Update related article content and snippets rather than leaving contradicted numbers visible elsewhere.
- Keep historical peaks separate from official violation records and remove the unsupported national-percentile calculation.
- Remove hardness and editorial-keyword deductions from the index. Missing PFAS coverage produces an ungraded state, and ungraded cities are excluded from best/worst score lists.
- Show an uncached availability error when the EPA violation query fails. Normalize sample units before selecting maxima and stop replacing zero lead with an invented detectable concentration.
- Move shared lookup code to `lib/server-water-report.ts`. ZIP pages call it directly, avoiding a server request through the production domain and avoiding weeks-long caching of failed responses. The public API retains request validation and rate limiting.
- Version the report cache namespace to avoid serving prior cached interpretations.

## Visitor experience

- Add an introductory supplier/source/coverage/next-step summary to city reports.
- Put article content before shopping recommendations. Show at most three available choices, selecting lower upfront cost, a no-install option, and an under-sink option when the supplied list supports them.
- Add an explicit reminder to check exact-model/cartridge reduction claims, capacity, and replacement cost. These changes do not substitute for a complete independent SKU-certification audit.
- Make signup success depend on a confirmed successful API response. Add visible errors and email field labels.
- Describe general weekly newsletters honestly rather than promising an implemented local emergency/change-alert service.
- Pause the background animation in hidden tabs and use a still frame for small screens or reduced-motion preferences.

## Search and measurement

- Allow crawler access to framework assets.
- Preserve `/water/new-york` for NYC and `/water/state/new-york` for the state.
- Remove intentionally noindexed ZIP URLs from the sitemap, omit unsupported per-page modification dates, and log sitemap-generation errors.
- Return 404 for unsupported city paths and malformed ZIP paths.
- Derive city snippets from current decoded coverage instead of old hand-written grade/concentration claims.
- Queue analytics initialization before tracking effects run, avoid forwarding query strings to manual pageview events, and remove email addresses from claim thank-you URLs.
- Track confirmed shared-newsletter signups consistently.

## Dependencies

- Upgrade Next.js and its ESLint configuration to 16.4.6, Vercel functions to 3.11.1, and Sharp to 0.35.5.
- Remove the unused Resend SDK dependency; existing email integrations use HTTP and remain in place.
- Apply compatible dependency fixes. Production dependency audit reports zero vulnerabilities. The full dependency audit still reports eight moderate development-tooling entries; no forced breaking upgrades were applied.

## Validation

- Twelve regression tests cover compound thresholds, exact-boundary behavior, lithium/hardness separation, source immutability, missing monitoring, supplier identity, score invariance under prose/hardness changes, unsupported percentile removal, crawler access, EPA outages, mixed measurement units, and routing/sitemap policy.
- TypeScript and the full optimized production build pass.
- Local production HTTP checks cover robots.txt, sitemap.xml, distinct NYC/state routes, Philadelphia, Parkersburg, Sugar Land, the revised NYC article, invalid cities, and invalid ZIPs.
- No real newsletter emails or claim submissions were sent during validation.

## Remaining work and rollout considerations

- Scores and rankings can change because interpretation and identity were corrected. This is not evidence of a real-time change in water chemistry.
- The packaged snapshot is historical. Refreshing it from the final federal dataset, recording complete sample/import provenance, and verifying every remaining supplier service area are separate work.
- Full product certification, current prices, replacement costs, affiliate destination accuracy, and live delivery/analytics-account configuration still need independent verification.
- Mobile visual appearance and field Core Web Vitals have not been measured; HTTP checks and source changes are not a browser usability test.
- Vercel security-checkpoint policy and the unusual Search Console impression pattern are not resolved by these code changes.
- The pre-existing city-page additions were preserved and integrated where needed. The separate outreach log and priority-planning document are left outside this repair commit.
