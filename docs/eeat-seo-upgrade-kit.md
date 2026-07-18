# WaterCheckup.com — E-E-A-T & SEO Upgrade Kit

This folder contains everything discussed to build trust/authority signals
and internal linking across your city pages. Drop these into your existing
Next.js (App Router) project and wire them in as below.

## Files

- `app/about/page.tsx` — full About/Author page with Person schema. Deploy
  this first, then submit `/about` in Search Console (URL Inspection →
  Request Indexing) so Google picks it up fast.
- `components/AuthorByline.tsx` — small byline block. Import and place
  right under the H1 on every city page.
- `components/ArticleSchema.tsx` — Article schema tied to your author.
  Add once per city page with that city's headline + dates.
- `components/CityFAQ.tsx` + `lib/faq-gaithersburg.ts` — visible FAQ
  section + FAQPage schema. `faq-gaithersburg.ts` is a filled-out example;
  duplicate that file per city (e.g. `faq-san-antonio.ts`) with real
  answers for each.
- `components/NearbyCities.tsx` — internal linking module. Needs your full
  135-city list passed in as `allCities` (name/slug/state) — pull this from
  whatever data source already powers your city pages.

## Example: wiring a city page together

```tsx
import AuthorByline from "@/components/AuthorByline";
import ArticleSchema from "@/components/ArticleSchema";
import CityFAQ from "@/components/CityFAQ";
import NearbyCities from "@/components/NearbyCities";
import { gaithersburgFAQs } from "@/lib/faq-gaithersburg";
import { allCities } from "@/lib/cities"; // your existing city data source

export default function GaithersburgPage() {
  return (
    <main>
      <ArticleSchema
        headline="Gaithersburg Water Quality 2026 — WSSC Tap Water Report"
        slug="gaithersburg"
        datePublished="2026-01-01"
        dateModified="2026-07-17"
      />

      <h1>Gaithersburg Water Quality 2026</h1>
      <AuthorByline />

      {/* ...existing page content... */}

      <CityFAQ slug="gaithersburg" faqs={gaithersburgFAQs} />

      <NearbyCities
        currentSlug="gaithersburg"
        currentState="MD"
        allCities={allCities}
      />
    </main>
  );
}
```

## Rollout order (don't do all 135 pages at once)

1. Ship `/about` page + Person schema. Request indexing.
2. Add `AuthorByline` + `ArticleSchema` to your top 15 highest-impression
   pages (see `priority-cities.md`).
3. Write real FAQ content (using `faq-gaithersburg.ts` as the template) for
   those same 15 pages, add `CityFAQ`.
4. Add `NearbyCities` across all pages at once — this is low-risk/low-effort
   and safe to roll out broadly right away.
5. Wait 4-6 weeks, recheck Search Console (Queries/Pages/Average position)
   before judging impact or making further changes.
6. Expand FAQ + byline work to your next tier of cities.

## What NOT to spend more time on right now

- Don't keep re-tweaking meta titles/descriptions on major metros (San
  Antonio, Houston, Baltimore) that are stuck on page 3+ — those markets
  are dominated by the city's own utility site plus EWG, and copy tweaks
  won't close that gap. Put the effort into the winnable tier instead.
