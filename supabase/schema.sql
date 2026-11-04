-- Run this once in the Supabase SQL editor.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_slug text not null,
  tier text not null,
  name text not null check (char_length(name) between 1 and 80),
  attending boolean not null,
  guests integer not null check (guests between 0 and 20),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_wedding_idx on public.rsvps (wedding_slug, created_at desc);

-- With row level security on and no policies, the public keys can read and write
-- nothing. Only the website's server, using the service key, can reach this table.
alter table public.rsvps enable row level security;
