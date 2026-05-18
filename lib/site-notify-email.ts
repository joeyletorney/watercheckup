/** Inbound address for admin notifications (utility claims, newsletter signup BCC, etc.). */
export function getSiteNotifyEmail(): string {
  return process.env.UTILITY_CLAIM_NOTIFY_EMAIL?.trim() || 'joe@letorney.com';
}
