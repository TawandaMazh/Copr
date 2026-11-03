-- Optional: verified brand badge for marketplace trust signals.
-- Review this migration before applying to production.

alter table public.brands
  add column if not exists is_verified boolean not null default true;

comment on column public.brands.is_verified is
  'When true, show the verified badge on brand cards and product pages.';
