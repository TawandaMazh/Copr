-- Review moderation status + public visibility + rating rollups

alter table public.reviews
  add column if not exists status text not null default 'published';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_status_check'
  ) then
    alter table public.reviews
      add constraint reviews_status_check
      check (status in ('published', 'hidden', 'flagged'));
  end if;
end $$;

alter table public.reviews
  add column if not exists user_name text;

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_status_idx on public.reviews (status);

drop policy if exists "reviews_select_all" on public.reviews;
drop policy if exists "reviews_select_published_or_owner_admin" on public.reviews;

create policy "reviews_select_published_or_owner_admin"
  on public.reviews for select
  using (
    status = 'published'
    or user_id = auth.uid()
    or public.is_admin()
  );

create or replace function public.refresh_product_review_stats(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products p
  set
    rating = coalesce((
      select round(avg(r.rating)::numeric, 1)
      from public.reviews r
      where r.product_id = p_product_id and r.status = 'published'
    ), 0),
    review_count = (
      select count(*)::int
      from public.reviews r
      where r.product_id = p_product_id and r.status = 'published'
    )
  where p.id = p_product_id;
end;
$$;

create or replace function public.reviews_refresh_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  target := coalesce(new.product_id, old.product_id);
  perform public.refresh_product_review_stats(target);
  if tg_op = 'UPDATE' and old.product_id is distinct from new.product_id then
    perform public.refresh_product_review_stats(old.product_id);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_refresh_stats on public.reviews;
create trigger reviews_refresh_stats
  after insert or update or delete on public.reviews
  for each row execute function public.reviews_refresh_stats();
