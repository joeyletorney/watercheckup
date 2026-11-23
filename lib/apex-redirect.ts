/** Canonicalize www → apex while keeping path, query (UTM), and hash. */
export function apexRedirectUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  url.hostname = 'watercheckup.com';
  url.protocol = 'https:';
  url.port = '';
  return url.toString();
}
