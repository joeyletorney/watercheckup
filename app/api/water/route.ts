/** Pin near EPA Envirofacts / ECHO (US-East) so ZIP lookups are not racing a transcontinental hop. */
export const preferredRegion = ['iad1'];
export const maxDuration = 60;

export { GET, OPTIONS } from '@/lib/server-water-report';
