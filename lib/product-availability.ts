/** Editorial snapshot checked November 18, 2026; not live inventory. */
export function unavailablePurchase(name: string, href = ''): boolean {
  return /SmartFlow|AquaTru Under[- ]Sink|Waterdrop D6|\bK19(?:-S)?\b/i.test(name)
    || /B0CHZ8VQBB|B0GGTSFZMY|B08746G2XX|countertop-ro-water-filter-system-wd-k19-s/i.test(href);
}
export function isAmazonSearch(href = ''): boolean {
  try { const u = new URL(href); return /(^|\.)amazon\.com$/.test(u.hostname) && u.pathname === '/s'; }
  catch { return false; }
}
