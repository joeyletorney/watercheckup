# Batch 2: FAQ Content for Top 10 Priority Cities

Ten new files, same pattern as `faq-gaithersburg.ts`. Each is genuinely
city-specific — real utility names, real source water, real reported
contaminant data pulled from public sources — not templated text with the
city name swapped in.

| File | City | Utility | Source water |
|---|---|---|---|
| `faq-san-antonio.ts` | San Antonio, TX | SAWS | Edwards/Trinity/Carrizo/Wilcox aquifers |
| `faq-raleigh.ts` | Raleigh, NC | Raleigh Water | Falls Lake & Lake Benson |
| `faq-houston.ts` | Houston, TX | Houston Public Works | Lake Houston, Lake Conroe, Lake Livingston + aquifers |
| `faq-baltimore.ts` | Baltimore, MD | Baltimore City DPW | Loch Raven, Prettyboy, Liberty reservoirs |
| `faq-phoenix.ts` | Phoenix, AZ | Phoenix Water Services | Salt/Verde/Colorado Rivers |
| `faq-chicago.ts` | Chicago, IL | Chicago DWM | Lake Michigan |
| `faq-los-angeles.ts` | Los Angeles, CA | LADWP | MWD imports, LA Aqueduct, groundwater |
| `faq-rockville.ts` | Rockville, MD | WSSC Water | Potomac & Patuxent Rivers |
| `faq-silver-spring.ts` | Silver Spring, MD | WSSC Water | Potomac & Patuxent Rivers |
| `faq-bethesda.ts` | Bethesda, MD | WSSC Water | Potomac & Patuxent Rivers |

## Note on the 3 WSSC cities (Rockville, Silver Spring, Bethesda)

These share a utility and source water with Gaithersburg, so some facts
overlap by necessity — that's accurate, not a content error. To keep them
from reading as duplicate content, each one leads with a different angle:

- Rockville — general overview + hardness
- Silver Spring — leans into housing stock age / lead risk (older, mixed
  housing stock)
- Bethesda — leans into established/older neighborhoods and lead risk

If you have real per-city specifics (recent local news, a specific EPA
violation tied to one city instead of the whole WSSC system, etc.), swap
those in — they'll strengthen differentiation further.

## Wiring these in

Same pattern as Gaithersburg. For each city page:

```tsx
import CityFAQ from "@/components/CityFAQ";
import { sanAntonioFAQs } from "@/lib/faq-san-antonio";

// inside the page component, in the san-antonio conditional block:
<CityFAQ slug="san-antonio" faqs={sanAntonioFAQs} />
```

Cursor prompt to batch-wire all 10 at once (run only after spot-checking
one manually first):

```
I have FAQ content files in lib/ named faq-san-antonio.ts, faq-raleigh.ts,
faq-houston.ts, faq-baltimore.ts, faq-phoenix.ts, faq-chicago.ts,
faq-los-angeles.ts, faq-rockville.ts, faq-silver-spring.ts, and
faq-bethesda.ts, each exporting a FAQ array (e.g. sanAntonioFAQs).

For each of these 10 cities, add a <CityFAQ slug="[city-slug]" faqs={...} />
component to that city's page block in app/water/[city]/page.tsx, following
the exact same pattern already used for Gaithersburg. Show me a diff before
applying.
```

## Fact-check before publishing

I pulled these from public utility sites and independent water-quality
sources as of July 2026. Given your 30 years in the industry, please
spot-check the technical claims (PFAS ppt figures, lead ppb figures, EPA
limit citations) before these go live — I'd rather you catch anything I
got slightly wrong than have it published as-is.
