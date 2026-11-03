-- Verified brand badge for marketplace trust signals.
-- Applied on live Supabase (ybkhrkhiemnbaviyhtio) 2026-11-03.

alter table public.brands
  add column if not exists is_verified boolean not null default true;

comment on column public.brands.is_verified is
  'When true, show the verified badge on brand cards and product pages.';
