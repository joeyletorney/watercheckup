-- Run this in Supabase → SQL Editor → New query → Run
-- Stores newsletter signups; API routes use SUPABASE_SERVICE_ROLE_KEY (server only).

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  zip text not null default '',
  weekly_opt_in boolean not null default true,
  unsubscribed boolean not null default false,
  source text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_unique unique (email)
);

create index if not exists idx_newsletter_subscribers_weekly_active
  on public.newsletter_subscribers (weekly_opt_in)
  where weekly_opt_in = true and unsubscribed = false;

alter table public.newsletter_subscribers enable row level security;

-- No policies: only the service role (used in Next.js API routes) bypasses RLS.
