-- copr Phase 2 schema
-- Multi-vendor fashion marketplace (Zambia / Lusaka MVP)

create extension if not exists "pgcrypto";

-- ─── Enums ───
create type public.user_role as enum ('shopper', 'seller', 'admin');
create type public.brand_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.order_status as enum (
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'disputed'
);
create type public.payment_status as enum ('pending', 'held', 'released', 'refunded', 'failed');
create type public.delivery_method as enum ('delivery', 'pickup');
create type public.payout_status as enum ('pending', 'processing', 'paid', 'failed');

-- ─── Profiles ───
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  email text,
  role public.user_role not null default 'shopper',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Marketplace settings (singleton-ish) ───
create table public.marketplace_settings (
  id int primary key default 1 check (id = 1),
  commission_percent numeric(5,2) not null default 15.00,
  delivery_fee_kwacha numeric(12,2) not null default 50.00,
  delivery_city text not null default 'Lusaka',
  auto_confirm_days int not null default 3,
  updated_at timestamptz not null default now()
);

insert into public.marketplace_settings (id) values (1);

-- ─── Categories ───
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

-- ─── Brands ───
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  name text not null,
  slug text not null unique,
  tagline text,
  story text,
  location text,
  logo_url text,
  banner_url text,
  featured boolean not null default false,
  founded_year int,
  status public.brand_status not null default 'pending',
  commission_percent numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Products ───
create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  trending boolean not null default false,
  is_new boolean not null default false,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  colour text not null,
  stock int not null default 0 check (stock >= 0),
  price numeric(12,2) not null check (price >= 0),
  sku text not null unique,
  created_at timestamptz not null default now(),
  unique (product_id, size, colour)
);

-- ─── Addresses (Lusaka MVP) ───
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  area text not null,
  neighbourhood text not null,
  landmark text,
  phone text not null,
  is_default boolean not null default false,
  is_pickup_point boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Carts ───
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint carts_owner check (user_id is not null or session_id is not null)
);

create unique index carts_user_id_unique on public.carts (user_id) where user_id is not null;
create unique index carts_session_id_unique on public.carts (session_id) where session_id is not null;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

-- ─── Wishlists ───
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ─── Orders ───
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  status public.order_status not null default 'pending_payment',
  delivery_method public.delivery_method not null default 'delivery',
  address_id uuid references public.addresses (id) on delete set null,
  -- snapshot of address at checkout
  delivery_area text,
  delivery_neighbourhood text,
  delivery_landmark text,
  delivery_phone text,
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'ZMW',
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sub_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete restrict,
  status public.order_status not null default 'pending_payment',
  subtotal numeric(12,2) not null default 0,
  commission_percent numeric(5,2) not null default 15.00,
  commission_amount numeric(12,2) not null default 0,
  seller_amount numeric(12,2) not null default 0,
  shipped_at timestamptz,
  delivered_at timestamptz,
  completed_at timestamptz,
  tracking_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  sub_order_id uuid not null references public.sub_orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  brand_id uuid not null references public.brands (id) on delete restrict,
  product_name text not null,
  variant_size text not null,
  variant_colour text not null,
  unit_price numeric(12,2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- ─── Payments (escrow) ───
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null default 'mock',
  provider_ref text,
  amount numeric(12,2) not null,
  currency text not null default 'ZMW',
  status public.payment_status not null default 'pending',
  held_at timestamptz,
  released_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Payouts ───
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete restrict,
  sub_order_id uuid not null references public.sub_orders (id) on delete restrict,
  amount numeric(12,2) not null,
  commission_amount numeric(12,2) not null,
  status public.payout_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── Reviews ───
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  order_item_id uuid references public.order_items (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

-- ─── Indexes ───
create index products_brand_id_idx on public.products (brand_id);
create index products_category_id_idx on public.products (category_id);
create index product_variants_product_id_idx on public.product_variants (product_id);
create index orders_user_id_idx on public.orders (user_id);
create index sub_orders_brand_id_idx on public.sub_orders (brand_id);
create index order_items_order_id_idx on public.order_items (order_id);
create index wishlists_user_id_idx on public.wishlists (user_id);

-- ─── updated_at helper ───
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger carts_updated_at before update on public.carts
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger sub_orders_updated_at before update on public.sub_orders
  for each row execute function public.set_updated_at();
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'shopper')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage buckets (run via dashboard or storage API as well)
-- product-images, brand-assets
