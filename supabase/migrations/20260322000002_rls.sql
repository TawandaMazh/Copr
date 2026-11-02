-- copr Phase 2 — Row Level Security on every table

alter table public.profiles enable row level security;
alter table public.marketplace_settings enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.sub_orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payouts enable row level security;
alter table public.reviews enable row level security;

-- Helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.owns_brand(brand uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.brands b
    where b.id = brand and b.owner_id = auth.uid()
  );
$$;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid() or public.is_admin());

-- Marketplace settings: public read, admin write
create policy "settings_select_all"
  on public.marketplace_settings for select
  using (true);

create policy "settings_admin_all"
  on public.marketplace_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Categories: public read
create policy "categories_select_all"
  on public.categories for select using (true);

create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Brands: public can read approved; owners/admins manage
create policy "brands_select_approved_or_owner"
  on public.brands for select
  using (
    status = 'approved'
    or owner_id = auth.uid()
    or public.is_admin()
  );

create policy "brands_insert_authenticated"
  on public.brands for insert
  with check (auth.uid() = owner_id or public.is_admin());

create policy "brands_update_owner_or_admin"
  on public.brands for update
  using (owner_id = auth.uid() or public.is_admin());

-- Products / images / variants: public read published+approved brand
create policy "products_select_published"
  on public.products for select
  using (
    is_published = true
    or public.owns_brand(brand_id)
    or public.is_admin()
  );

create policy "products_write_owner_or_admin"
  on public.products for all
  using (public.owns_brand(brand_id) or public.is_admin())
  with check (public.owns_brand(brand_id) or public.is_admin());

create policy "product_images_select"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and (p.is_published or public.owns_brand(p.brand_id) or public.is_admin())
    )
  );

create policy "product_images_write"
  on public.product_images for all
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (public.owns_brand(p.brand_id) or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and (public.owns_brand(p.brand_id) or public.is_admin())
    )
  );

create policy "product_variants_select"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and (p.is_published or public.owns_brand(p.brand_id) or public.is_admin())
    )
  );

create policy "product_variants_write"
  on public.product_variants for all
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (public.owns_brand(p.brand_id) or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and (public.owns_brand(p.brand_id) or public.is_admin())
    )
  );

-- Addresses
create policy "addresses_own"
  on public.addresses for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Carts
create policy "carts_own"
  on public.carts for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "cart_items_own"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin())
    )
  );

-- Wishlists
create policy "wishlists_own"
  on public.wishlists for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Orders
create policy "orders_select_own_seller_admin"
  on public.orders for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.sub_orders so
      where so.order_id = orders.id and public.owns_brand(so.brand_id)
    )
  );

create policy "orders_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid());

create policy "orders_update_own_or_admin"
  on public.orders for update
  using (user_id = auth.uid() or public.is_admin());

create policy "sub_orders_select"
  on public.sub_orders for select
  using (
    public.is_admin()
    or public.owns_brand(brand_id)
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "sub_orders_update_seller_admin"
  on public.sub_orders for update
  using (public.owns_brand(brand_id) or public.is_admin());

create policy "sub_orders_insert_system"
  on public.sub_orders for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
    or public.is_admin()
  );

create policy "order_items_select"
  on public.order_items for select
  using (
    public.is_admin()
    or public.owns_brand(brand_id)
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
    or public.is_admin()
  );

-- Payments
create policy "payments_select"
  on public.payments for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
    or exists (
      select 1 from public.sub_orders so
      join public.orders o on o.id = so.order_id
      where so.order_id = payments.order_id and public.owns_brand(so.brand_id)
    )
  );

create policy "payments_insert_own_order"
  on public.payments for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
    or public.is_admin()
  );

create policy "payments_update_admin"
  on public.payments for update
  using (public.is_admin());

-- Payouts: brand owners + admin
create policy "payouts_select"
  on public.payouts for select
  using (public.owns_brand(brand_id) or public.is_admin());

create policy "payouts_admin_write"
  on public.payouts for all
  using (public.is_admin()) with check (public.is_admin());

-- Reviews
create policy "reviews_select_all"
  on public.reviews for select using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (user_id = auth.uid());

create policy "reviews_update_own"
  on public.reviews for update
  using (user_id = auth.uid() or public.is_admin());

create policy "reviews_delete_own"
  on public.reviews for delete
  using (user_id = auth.uid() or public.is_admin());
