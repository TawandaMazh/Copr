-- Seed catalogue from Phase 1 (10 brands, 60 products)
-- Safe to re-run: uses fixed UUIDs derived from slug hashes via uuid_generate... we use explicit ids from seed string ids mapped to UUIDs.

-- Deterministic UUID helper from text
create or replace function public.seed_uuid(seed text)
returns uuid
language sql
immutable
as $$
  select (
    substr(md5(seed), 1, 8) || '-' ||
    substr(md5(seed), 9, 4) || '-' ||
    '4' || substr(md5(seed), 13, 3) || '-' ||
    'a' || substr(md5(seed), 17, 3) || '-' ||
    substr(md5(seed), 21, 12)
  )::uuid;
$$;

-- Categories
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-dresses'), 'Dresses', 'dresses', 'Day dresses, occasion wear, and easy silhouettes.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-tops'), 'Tops', 'tops', 'Shirts, blouses, tees, and knit tops.', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-bottoms'), 'Bottoms', 'bottoms', 'Trousers, skirts, shorts, and denim.', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-outerwear'), 'Outerwear', 'outerwear', 'Jackets, coats, and light layers for Lusaka evenings.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-traditional'), 'Traditional', 'traditional', 'Chitenge, tailored African wear, and modern heritage pieces.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-footwear'), 'Footwear', 'footwear', 'Sneakers, sandals, and everyday shoes.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-accessories'), 'Accessories', 'accessories', 'Bags, jewellery, scarves, and finishing touches.', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;
insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid('cat-activewear'), 'Activewear', 'activewear', 'Performance sets built for movement and heat.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80')
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;

-- Brands (approved for marketplace)
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-chitenge-house'),
  'Chitenge House',
  'chitenge-house',
  'Heritage prints, modern cut.',
  'Born in Kamwala Market and refined in a Lusaka atelier, Chitenge House reworks classic wax prints into everyday silhouettes for the city.',
  'Lusaka',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1400&q=80',
  true,
  2018,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-mwape-studio'),
  'Mwape Studio',
  'mwape-studio',
  'Quiet luxury from the Copperbelt.',
  'Mwape Studio designs clean tailoring with copper and navy accents — pieces made for boardrooms, weekends, and everything between.',
  'Ndola',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
  true,
  2020,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-copper-cloth'),
  'Copper & Cloth',
  'copper-cloth',
  'Workwear with warmth.',
  'Inspired by mine-town grit and soft cottons, Copper & Cloth builds durable shirts, jackets, and trousers for Zambia’s everyday rhythm.',
  'Kitwe',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
  true,
  2016,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-zambezi-atelier'),
  'Zambezi Atelier',
  'zambezi-atelier',
  'Flowing fabrics, river calm.',
  'Zambezi Atelier draws from the river’s ease — fluid dresses, soft linens, and sky-toned pieces for warm afternoons.',
  'Livingstone',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
  true,
  2019,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-lusaka-label'),
  'Lusaka Label',
  'lusaka-label',
  'City staples, elevated.',
  'A hometown label for shoppers who want polished basics — sharp denim, crisp shirts, and capsule-friendly neutrals.',
  'Lusaka',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
  false,
  2021,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-mutale-made'),
  'Mutale Made',
  'mutale-made',
  'Hand-finished, heart-led.',
  'Mutale Made partners with local makers for limited-run accessories and soft knits, each piece finished by hand in Chongwe.',
  'Chongwe',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1400&q=80',
  true,
  2017,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-savannah-form'),
  'Savannah Form',
  'savannah-form',
  'Structure for the heat.',
  'Architectural cuts in breathable cloth. Savannah Form designs for movement through market days and late dinners alike.',
  'Lusaka',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80',
  false,
  2022,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-baobab-blue'),
  'Baobab & Blue',
  'baobab-blue',
  'Rooted colour, soft edges.',
  'Named for the baobab and Zambia’s wide sky, this label leans into indigo, cream, and earthy dyes across dresses and lounge sets.',
  'Mazabuka',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
  true,
  2015,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-nkwazi-wear'),
  'Nkwazi Wear',
  'nkwazi-wear',
  'Sport-ready. Street-easy.',
  'Nkwazi Wear builds active and casual pieces for training at the gym or weekends at Levy Junction — light, durable, and local.',
  'Lusaka',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
  false,
  2023,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid('brand-kapiri-knit'),
  'Kapiri Knit',
  'kapiri-knit',
  'Soft knits for cool nights.',
  'From Kapiri Mposhi, this knit house specialises in cardigans, polos, and textured layers with a calm, premium finish.',
  'Kapiri Mposhi',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1400&q=80',
  false,
  2014,
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';

-- Products + images + variants
insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-001'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-traditional'),
  'Lusaka Market Wrap Dress',
  'lusaka-market-wrap-dress',
  'Lusaka Market Wrap Dress is cut for Zambia’s heat and city pace. Celebrates Zambian print culture with a contemporary cut suited to modern life.',
  ARRAY['chitenge', 'wrap'],
  true,
  true,
  true,
  3.8,
  4,
  true,
  '2025-01-01T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-001-img-0'), public.seed_uuid('prod-001'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-001-img-1'), public.seed_uuid('prod-001'), 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-chitenge-print-xs'),
  public.seed_uuid('prod-001'),
  'XS',
  'Chitenge Print',
  2,
  680,
  'COPR-001-CHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-chitenge-print-s'),
  public.seed_uuid('prod-001'),
  'S',
  'Chitenge Print',
  9,
  680,
  'COPR-001-CHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-chitenge-print-m'),
  public.seed_uuid('prod-001'),
  'M',
  'Chitenge Print',
  9,
  680,
  'COPR-001-CHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-chitenge-print-l'),
  public.seed_uuid('prod-001'),
  'L',
  'Chitenge Print',
  9,
  680,
  'COPR-001-CHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-chitenge-print-xl'),
  public.seed_uuid('prod-001'),
  'XL',
  'Chitenge Print',
  2,
  680,
  'COPR-001-CHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-navy-xs'),
  public.seed_uuid('prod-001'),
  'XS',
  'Navy',
  8,
  700,
  'COPR-001-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-navy-s'),
  public.seed_uuid('prod-001'),
  'S',
  'Navy',
  7,
  700,
  'COPR-001-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-navy-m'),
  public.seed_uuid('prod-001'),
  'M',
  'Navy',
  7,
  700,
  'COPR-001-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-navy-l'),
  public.seed_uuid('prod-001'),
  'L',
  'Navy',
  7,
  700,
  'COPR-001-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-market-wrap-dress-navy-xl'),
  public.seed_uuid('prod-001'),
  'XL',
  'Navy',
  8,
  700,
  'COPR-001-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-002'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-traditional'),
  'Kamwala Two-Piece Set',
  'kamwala-two-piece-set',
  'Kamwala Two-Piece Set is cut for Zambia’s heat and city pace. Celebrates Zambian print culture with a contemporary cut suited to modern life.',
  ARRAY['set', 'occasion'],
  false,
  false,
  false,
  3.9,
  7,
  true,
  '2025-02-02T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-002-img-0'), public.seed_uuid('prod-002'), 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-002-img-1'), public.seed_uuid('prod-002'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-chitenge-print-xs'),
  public.seed_uuid('prod-002'),
  'XS',
  'Chitenge Print',
  3,
  890,
  'COPR-002-CHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-chitenge-print-s'),
  public.seed_uuid('prod-002'),
  'S',
  'Chitenge Print',
  2,
  890,
  'COPR-002-CHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-chitenge-print-m'),
  public.seed_uuid('prod-002'),
  'M',
  'Chitenge Print',
  2,
  890,
  'COPR-002-CHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-chitenge-print-l'),
  public.seed_uuid('prod-002'),
  'L',
  'Chitenge Print',
  2,
  890,
  'COPR-002-CHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-chitenge-print-xl'),
  public.seed_uuid('prod-002'),
  'XL',
  'Chitenge Print',
  3,
  890,
  'COPR-002-CHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-gold-xs'),
  public.seed_uuid('prod-002'),
  'XS',
  'Gold',
  9,
  910,
  'COPR-002-GOL-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-gold-s'),
  public.seed_uuid('prod-002'),
  'S',
  'Gold',
  8,
  910,
  'COPR-002-GOL-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-gold-m'),
  public.seed_uuid('prod-002'),
  'M',
  'Gold',
  8,
  910,
  'COPR-002-GOL-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-gold-l'),
  public.seed_uuid('prod-002'),
  'L',
  'Gold',
  8,
  910,
  'COPR-002-GOL-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kamwala-two-piece-set-gold-xl'),
  public.seed_uuid('prod-002'),
  'XL',
  'Gold',
  9,
  910,
  'COPR-002-GOL-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-003'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-dresses'),
  'Sunday Chitenge Midi',
  'sunday-chitenge-midi',
  'Designed locally and finished with care, Sunday Chitenge Midi belongs in a weekly rotation. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['midi', 'church'],
  false,
  false,
  false,
  4,
  10,
  true,
  '2025-03-03T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-003-img-0'), public.seed_uuid('prod-003'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-003-img-1'), public.seed_uuid('prod-003'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-chitenge-print-xs'),
  public.seed_uuid('prod-003'),
  'XS',
  'Chitenge Print',
  4,
  750,
  'COPR-003-CHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-chitenge-print-s'),
  public.seed_uuid('prod-003'),
  'S',
  'Chitenge Print',
  3,
  750,
  'COPR-003-CHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-chitenge-print-m'),
  public.seed_uuid('prod-003'),
  'M',
  'Chitenge Print',
  3,
  750,
  'COPR-003-CHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-chitenge-print-l'),
  public.seed_uuid('prod-003'),
  'L',
  'Chitenge Print',
  3,
  750,
  'COPR-003-CHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-chitenge-print-xl'),
  public.seed_uuid('prod-003'),
  'XL',
  'Chitenge Print',
  4,
  750,
  'COPR-003-CHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-red-xs'),
  public.seed_uuid('prod-003'),
  'XS',
  'Red',
  9,
  770,
  'COPR-003-RED-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-red-s'),
  public.seed_uuid('prod-003'),
  'S',
  'Red',
  8,
  770,
  'COPR-003-RED-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-red-m'),
  public.seed_uuid('prod-003'),
  'M',
  'Red',
  8,
  770,
  'COPR-003-RED-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-red-l'),
  public.seed_uuid('prod-003'),
  'L',
  'Red',
  8,
  770,
  'COPR-003-RED-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sunday-chitenge-midi-red-xl'),
  public.seed_uuid('prod-003'),
  'XL',
  'Red',
  9,
  770,
  'COPR-003-RED-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-004'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-tops'),
  'Ankara Collar Blouse',
  'ankara-collar-blouse',
  'Designed locally and finished with care, Ankara Collar Blouse belongs in a weekly rotation. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['blouse'],
  false,
  false,
  false,
  4.1,
  13,
  true,
  '2025-04-04T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-004-img-0'), public.seed_uuid('prod-004'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-004-img-1'), public.seed_uuid('prod-004'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-chitenge-print-xs'),
  public.seed_uuid('prod-004'),
  'XS',
  'Chitenge Print',
  5,
  420,
  'COPR-004-CHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-chitenge-print-s'),
  public.seed_uuid('prod-004'),
  'S',
  'Chitenge Print',
  4,
  420,
  'COPR-004-CHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-chitenge-print-m'),
  public.seed_uuid('prod-004'),
  'M',
  'Chitenge Print',
  4,
  420,
  'COPR-004-CHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-chitenge-print-l'),
  public.seed_uuid('prod-004'),
  'L',
  'Chitenge Print',
  4,
  420,
  'COPR-004-CHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-chitenge-print-xl'),
  public.seed_uuid('prod-004'),
  'XL',
  'Chitenge Print',
  5,
  420,
  'COPR-004-CHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-white-xs'),
  public.seed_uuid('prod-004'),
  'XS',
  'White',
  4,
  440,
  'COPR-004-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-white-s'),
  public.seed_uuid('prod-004'),
  'S',
  'White',
  3,
  440,
  'COPR-004-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-white-m'),
  public.seed_uuid('prod-004'),
  'M',
  'White',
  3,
  440,
  'COPR-004-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-white-l'),
  public.seed_uuid('prod-004'),
  'L',
  'White',
  3,
  440,
  'COPR-004-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ankara-collar-blouse-white-xl'),
  public.seed_uuid('prod-004'),
  'XL',
  'White',
  4,
  440,
  'COPR-004-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-005'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-accessories'),
  'Wax Print Headwrap',
  'wax-print-headwrap',
  'Wax Print Headwrap is cut for Zambia’s heat and city pace. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['headwrap'],
  false,
  false,
  false,
  4.2,
  16,
  true,
  '2025-05-05T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-005-img-0'), public.seed_uuid('prod-005'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-005-img-1'), public.seed_uuid('prod-005'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wax-print-headwrap-chitenge-print-one-size'),
  public.seed_uuid('prod-005'),
  'One Size',
  'Chitenge Print',
  4,
  180,
  'COPR-005-CHI-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wax-print-headwrap-gold-one-size'),
  public.seed_uuid('prod-005'),
  'One Size',
  'Gold',
  2,
  200,
  'COPR-005-GOL-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-006'),
  public.seed_uuid('brand-chitenge-house'),
  public.seed_uuid('cat-bottoms'),
  'Pleated Chitenge Skirt',
  'pleated-chitenge-skirt',
  'A copr favourite — Pleated Chitenge Skirt balances comfort with quiet polish. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['skirt'],
  false,
  true,
  false,
  4.3,
  19,
  true,
  '2025-06-06T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-006-img-0'), public.seed_uuid('prod-006'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-006-img-1'), public.seed_uuid('prod-006'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-chitenge-print-xs'),
  public.seed_uuid('prod-006'),
  'XS',
  'Chitenge Print',
  7,
  520,
  'COPR-006-CHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-chitenge-print-s'),
  public.seed_uuid('prod-006'),
  'S',
  'Chitenge Print',
  6,
  520,
  'COPR-006-CHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-chitenge-print-m'),
  public.seed_uuid('prod-006'),
  'M',
  'Chitenge Print',
  6,
  520,
  'COPR-006-CHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-chitenge-print-l'),
  public.seed_uuid('prod-006'),
  'L',
  'Chitenge Print',
  6,
  520,
  'COPR-006-CHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-chitenge-print-xl'),
  public.seed_uuid('prod-006'),
  'XL',
  'Chitenge Print',
  7,
  520,
  'COPR-006-CHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-navy-xs'),
  public.seed_uuid('prod-006'),
  'XS',
  'Navy',
  5,
  540,
  'COPR-006-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-navy-s'),
  public.seed_uuid('prod-006'),
  'S',
  'Navy',
  4,
  540,
  'COPR-006-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-navy-m'),
  public.seed_uuid('prod-006'),
  'M',
  'Navy',
  4,
  540,
  'COPR-006-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-navy-l'),
  public.seed_uuid('prod-006'),
  'L',
  'Navy',
  4,
  540,
  'COPR-006-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-pleated-chitenge-skirt-navy-xl'),
  public.seed_uuid('prod-006'),
  'XL',
  'Navy',
  5,
  540,
  'COPR-006-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-007'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-outerwear'),
  'Copper Peak Blazer',
  'copper-peak-blazer',
  'Copper Peak Blazer is cut for Zambia’s heat and city pace. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['blazer', 'tailoring'],
  false,
  false,
  false,
  4.4,
  22,
  true,
  '2025-07-07T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-007-img-0'), public.seed_uuid('prod-007'), 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-007-img-1'), public.seed_uuid('prod-007'), 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-navy-xs'),
  public.seed_uuid('prod-007'),
  'XS',
  'Navy',
  6,
  1450,
  'COPR-007-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-navy-s'),
  public.seed_uuid('prod-007'),
  'S',
  'Navy',
  5,
  1450,
  'COPR-007-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-navy-m'),
  public.seed_uuid('prod-007'),
  'M',
  'Navy',
  5,
  1450,
  'COPR-007-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-navy-l'),
  public.seed_uuid('prod-007'),
  'L',
  'Navy',
  5,
  1450,
  'COPR-007-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-navy-xl'),
  public.seed_uuid('prod-007'),
  'XL',
  'Navy',
  6,
  1450,
  'COPR-007-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-black-xs'),
  public.seed_uuid('prod-007'),
  'XS',
  'Black',
  7,
  1470,
  'COPR-007-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-black-s'),
  public.seed_uuid('prod-007'),
  'S',
  'Black',
  6,
  1470,
  'COPR-007-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-black-m'),
  public.seed_uuid('prod-007'),
  'M',
  'Black',
  6,
  1470,
  'COPR-007-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-black-l'),
  public.seed_uuid('prod-007'),
  'L',
  'Black',
  6,
  1470,
  'COPR-007-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-black-xl'),
  public.seed_uuid('prod-007'),
  'XL',
  'Black',
  7,
  1470,
  'COPR-007-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-brown-xs'),
  public.seed_uuid('prod-007'),
  'XS',
  'Brown',
  7,
  1470,
  'COPR-007-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-brown-s'),
  public.seed_uuid('prod-007'),
  'S',
  'Brown',
  6,
  1470,
  'COPR-007-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-brown-m'),
  public.seed_uuid('prod-007'),
  'M',
  'Brown',
  6,
  1470,
  'COPR-007-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-brown-l'),
  public.seed_uuid('prod-007'),
  'L',
  'Brown',
  6,
  1470,
  'COPR-007-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-peak-blazer-brown-xl'),
  public.seed_uuid('prod-007'),
  'XL',
  'Brown',
  7,
  1470,
  'COPR-007-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-008'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-bottoms'),
  'Ndola Tailored Trouser',
  'ndola-tailored-trouser',
  'A copr favourite — Ndola Tailored Trouser balances comfort with quiet polish. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['trouser'],
  true,
  false,
  false,
  4.5,
  25,
  true,
  '2025-08-08T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-008-img-0'), public.seed_uuid('prod-008'), 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-008-img-1'), public.seed_uuid('prod-008'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-black-xs'),
  public.seed_uuid('prod-008'),
  'XS',
  'Black',
  8,
  780,
  'COPR-008-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-black-s'),
  public.seed_uuid('prod-008'),
  'S',
  'Black',
  7,
  780,
  'COPR-008-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-black-m'),
  public.seed_uuid('prod-008'),
  'M',
  'Black',
  7,
  780,
  'COPR-008-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-black-l'),
  public.seed_uuid('prod-008'),
  'L',
  'Black',
  7,
  780,
  'COPR-008-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-black-xl'),
  public.seed_uuid('prod-008'),
  'XL',
  'Black',
  8,
  780,
  'COPR-008-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-navy-xs'),
  public.seed_uuid('prod-008'),
  'XS',
  'Navy',
  7,
  800,
  'COPR-008-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-navy-s'),
  public.seed_uuid('prod-008'),
  'S',
  'Navy',
  6,
  800,
  'COPR-008-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-navy-m'),
  public.seed_uuid('prod-008'),
  'M',
  'Navy',
  6,
  800,
  'COPR-008-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-navy-l'),
  public.seed_uuid('prod-008'),
  'L',
  'Navy',
  6,
  800,
  'COPR-008-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-navy-xl'),
  public.seed_uuid('prod-008'),
  'XL',
  'Navy',
  7,
  800,
  'COPR-008-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-grey-xs'),
  public.seed_uuid('prod-008'),
  'XS',
  'Grey',
  7,
  800,
  'COPR-008-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-grey-s'),
  public.seed_uuid('prod-008'),
  'S',
  'Grey',
  6,
  800,
  'COPR-008-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-grey-m'),
  public.seed_uuid('prod-008'),
  'M',
  'Grey',
  6,
  800,
  'COPR-008-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-grey-l'),
  public.seed_uuid('prod-008'),
  'L',
  'Grey',
  6,
  800,
  'COPR-008-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ndola-tailored-trouser-grey-xl'),
  public.seed_uuid('prod-008'),
  'XL',
  'Grey',
  7,
  800,
  'COPR-008-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-009'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-tops'),
  'Quiet Silk Shirt',
  'quiet-silk-shirt',
  'A copr favourite — Quiet Silk Shirt balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['shirt'],
  false,
  false,
  false,
  4.6,
  28,
  true,
  '2025-09-09T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-009-img-0'), public.seed_uuid('prod-009'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-009-img-1'), public.seed_uuid('prod-009'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-white-xs'),
  public.seed_uuid('prod-009'),
  'XS',
  'White',
  9,
  650,
  'COPR-009-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-white-s'),
  public.seed_uuid('prod-009'),
  'S',
  'White',
  8,
  650,
  'COPR-009-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-white-m'),
  public.seed_uuid('prod-009'),
  'M',
  'White',
  8,
  650,
  'COPR-009-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-white-l'),
  public.seed_uuid('prod-009'),
  'L',
  'White',
  8,
  650,
  'COPR-009-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-white-xl'),
  public.seed_uuid('prod-009'),
  'XL',
  'White',
  9,
  650,
  'COPR-009-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-cream-xs'),
  public.seed_uuid('prod-009'),
  'XS',
  'Cream',
  9,
  670,
  'COPR-009-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-cream-s'),
  public.seed_uuid('prod-009'),
  'S',
  'Cream',
  8,
  670,
  'COPR-009-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-cream-m'),
  public.seed_uuid('prod-009'),
  'M',
  'Cream',
  8,
  670,
  'COPR-009-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-cream-l'),
  public.seed_uuid('prod-009'),
  'L',
  'Cream',
  8,
  670,
  'COPR-009-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-cream-xl'),
  public.seed_uuid('prod-009'),
  'XL',
  'Cream',
  9,
  670,
  'COPR-009-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-sky-xs'),
  public.seed_uuid('prod-009'),
  'XS',
  'Sky',
  7,
  670,
  'COPR-009-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-sky-s'),
  public.seed_uuid('prod-009'),
  'S',
  'Sky',
  6,
  670,
  'COPR-009-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-sky-m'),
  public.seed_uuid('prod-009'),
  'M',
  'Sky',
  6,
  670,
  'COPR-009-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-sky-l'),
  public.seed_uuid('prod-009'),
  'L',
  'Sky',
  6,
  670,
  'COPR-009-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-quiet-silk-shirt-sky-xl'),
  public.seed_uuid('prod-009'),
  'XL',
  'Sky',
  7,
  670,
  'COPR-009-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-010'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-dresses'),
  'Boardroom Sheath Dress',
  'boardroom-sheath-dress',
  'A copr favourite — Boardroom Sheath Dress balances comfort with quiet polish. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['workwear'],
  false,
  false,
  true,
  4.7,
  31,
  true,
  '2025-10-10T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-010-img-0'), public.seed_uuid('prod-010'), 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-010-img-1'), public.seed_uuid('prod-010'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-navy-xs'),
  public.seed_uuid('prod-010'),
  'XS',
  'Navy',
  9,
  980,
  'COPR-010-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-navy-s'),
  public.seed_uuid('prod-010'),
  'S',
  'Navy',
  8,
  980,
  'COPR-010-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-navy-m'),
  public.seed_uuid('prod-010'),
  'M',
  'Navy',
  8,
  980,
  'COPR-010-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-navy-l'),
  public.seed_uuid('prod-010'),
  'L',
  'Navy',
  8,
  980,
  'COPR-010-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-navy-xl'),
  public.seed_uuid('prod-010'),
  'XL',
  'Navy',
  9,
  980,
  'COPR-010-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-black-xs'),
  public.seed_uuid('prod-010'),
  'XS',
  'Black',
  2,
  1000,
  'COPR-010-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-black-s'),
  public.seed_uuid('prod-010'),
  'S',
  'Black',
  9,
  1000,
  'COPR-010-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-black-m'),
  public.seed_uuid('prod-010'),
  'M',
  'Black',
  9,
  1000,
  'COPR-010-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-black-l'),
  public.seed_uuid('prod-010'),
  'L',
  'Black',
  9,
  1000,
  'COPR-010-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-boardroom-sheath-dress-black-xl'),
  public.seed_uuid('prod-010'),
  'XL',
  'Black',
  2,
  1000,
  'COPR-010-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-011'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-accessories'),
  'Brushed Copper Belt',
  'brushed-copper-belt',
  'A copr favourite — Brushed Copper Belt balances comfort with quiet polish. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['belt'],
  false,
  true,
  false,
  4.8,
  34,
  true,
  '2025-01-11T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-011-img-0'), public.seed_uuid('prod-011'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-011-img-1'), public.seed_uuid('prod-011'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-brown-s'),
  public.seed_uuid('prod-011'),
  'S',
  'Brown',
  2,
  320,
  'COPR-011-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-brown-m'),
  public.seed_uuid('prod-011'),
  'M',
  'Brown',
  2,
  320,
  'COPR-011-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-brown-l'),
  public.seed_uuid('prod-011'),
  'L',
  'Brown',
  2,
  320,
  'COPR-011-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-black-s'),
  public.seed_uuid('prod-011'),
  'S',
  'Black',
  2,
  340,
  'COPR-011-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-black-m'),
  public.seed_uuid('prod-011'),
  'M',
  'Black',
  2,
  340,
  'COPR-011-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-brushed-copper-belt-black-l'),
  public.seed_uuid('prod-011'),
  'L',
  'Black',
  2,
  340,
  'COPR-011-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-012'),
  public.seed_uuid('brand-mwape-studio'),
  public.seed_uuid('cat-tops'),
  'Kitwe Oxford Shirt',
  'kitwe-oxford-shirt',
  'Kitwe Oxford Shirt is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['oxford'],
  false,
  true,
  false,
  4.9,
  37,
  true,
  '2025-02-12T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-012-img-0'), public.seed_uuid('prod-012'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-012-img-1'), public.seed_uuid('prod-012'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-white-xs'),
  public.seed_uuid('prod-012'),
  'XS',
  'White',
  4,
  540,
  'COPR-012-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-white-s'),
  public.seed_uuid('prod-012'),
  'S',
  'White',
  3,
  540,
  'COPR-012-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-white-m'),
  public.seed_uuid('prod-012'),
  'M',
  'White',
  3,
  540,
  'COPR-012-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-white-l'),
  public.seed_uuid('prod-012'),
  'L',
  'White',
  3,
  540,
  'COPR-012-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-white-xl'),
  public.seed_uuid('prod-012'),
  'XL',
  'White',
  4,
  540,
  'COPR-012-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-sky-xs'),
  public.seed_uuid('prod-012'),
  'XS',
  'Sky',
  2,
  560,
  'COPR-012-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-sky-s'),
  public.seed_uuid('prod-012'),
  'S',
  'Sky',
  9,
  560,
  'COPR-012-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-sky-m'),
  public.seed_uuid('prod-012'),
  'M',
  'Sky',
  9,
  560,
  'COPR-012-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-sky-l'),
  public.seed_uuid('prod-012'),
  'L',
  'Sky',
  9,
  560,
  'COPR-012-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-sky-xl'),
  public.seed_uuid('prod-012'),
  'XL',
  'Sky',
  2,
  560,
  'COPR-012-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-blue-xs'),
  public.seed_uuid('prod-012'),
  'XS',
  'Blue',
  3,
  560,
  'COPR-012-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-blue-s'),
  public.seed_uuid('prod-012'),
  'S',
  'Blue',
  2,
  560,
  'COPR-012-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-blue-m'),
  public.seed_uuid('prod-012'),
  'M',
  'Blue',
  2,
  560,
  'COPR-012-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-blue-l'),
  public.seed_uuid('prod-012'),
  'L',
  'Blue',
  2,
  560,
  'COPR-012-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-oxford-shirt-blue-xl'),
  public.seed_uuid('prod-012'),
  'XL',
  'Blue',
  3,
  560,
  'COPR-012-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-013'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-tops'),
  'Mine Town Work Shirt',
  'mine-town-work-shirt',
  'Designed locally and finished with care, Mine Town Work Shirt belongs in a weekly rotation. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['workwear'],
  false,
  false,
  false,
  3.8,
  40,
  true,
  '2025-03-13T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-013-img-0'), public.seed_uuid('prod-013'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-013-img-1'), public.seed_uuid('prod-013'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-olive-xs'),
  public.seed_uuid('prod-013'),
  'XS',
  'Olive',
  5,
  480,
  'COPR-013-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-olive-s'),
  public.seed_uuid('prod-013'),
  'S',
  'Olive',
  4,
  480,
  'COPR-013-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-olive-m'),
  public.seed_uuid('prod-013'),
  'M',
  'Olive',
  4,
  480,
  'COPR-013-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-olive-l'),
  public.seed_uuid('prod-013'),
  'L',
  'Olive',
  4,
  480,
  'COPR-013-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-olive-xl'),
  public.seed_uuid('prod-013'),
  'XL',
  'Olive',
  5,
  480,
  'COPR-013-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-brown-xs'),
  public.seed_uuid('prod-013'),
  'XS',
  'Brown',
  5,
  500,
  'COPR-013-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-brown-s'),
  public.seed_uuid('prod-013'),
  'S',
  'Brown',
  4,
  500,
  'COPR-013-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-brown-m'),
  public.seed_uuid('prod-013'),
  'M',
  'Brown',
  4,
  500,
  'COPR-013-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-brown-l'),
  public.seed_uuid('prod-013'),
  'L',
  'Brown',
  4,
  500,
  'COPR-013-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-brown-xl'),
  public.seed_uuid('prod-013'),
  'XL',
  'Brown',
  5,
  500,
  'COPR-013-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-navy-xs'),
  public.seed_uuid('prod-013'),
  'XS',
  'Navy',
  4,
  500,
  'COPR-013-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-navy-s'),
  public.seed_uuid('prod-013'),
  'S',
  'Navy',
  3,
  500,
  'COPR-013-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-navy-m'),
  public.seed_uuid('prod-013'),
  'M',
  'Navy',
  3,
  500,
  'COPR-013-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-navy-l'),
  public.seed_uuid('prod-013'),
  'L',
  'Navy',
  3,
  500,
  'COPR-013-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mine-town-work-shirt-navy-xl'),
  public.seed_uuid('prod-013'),
  'XL',
  'Navy',
  4,
  500,
  'COPR-013-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-014'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-outerwear'),
  'Copperbelt Field Jacket',
  'copperbelt-field-jacket',
  'Designed locally and finished with care, Copperbelt Field Jacket belongs in a weekly rotation. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['jacket'],
  false,
  false,
  false,
  3.9,
  43,
  true,
  '2025-04-14T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-014-img-0'), public.seed_uuid('prod-014'), 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-014-img-1'), public.seed_uuid('prod-014'), 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-olive-xs'),
  public.seed_uuid('prod-014'),
  'XS',
  'Olive',
  6,
  1200,
  'COPR-014-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-olive-s'),
  public.seed_uuid('prod-014'),
  'S',
  'Olive',
  5,
  1200,
  'COPR-014-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-olive-m'),
  public.seed_uuid('prod-014'),
  'M',
  'Olive',
  5,
  1200,
  'COPR-014-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-olive-l'),
  public.seed_uuid('prod-014'),
  'L',
  'Olive',
  5,
  1200,
  'COPR-014-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-olive-xl'),
  public.seed_uuid('prod-014'),
  'XL',
  'Olive',
  6,
  1200,
  'COPR-014-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-brown-xs'),
  public.seed_uuid('prod-014'),
  'XS',
  'Brown',
  6,
  1220,
  'COPR-014-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-brown-s'),
  public.seed_uuid('prod-014'),
  'S',
  'Brown',
  5,
  1220,
  'COPR-014-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-brown-m'),
  public.seed_uuid('prod-014'),
  'M',
  'Brown',
  5,
  1220,
  'COPR-014-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-brown-l'),
  public.seed_uuid('prod-014'),
  'L',
  'Brown',
  5,
  1220,
  'COPR-014-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copperbelt-field-jacket-brown-xl'),
  public.seed_uuid('prod-014'),
  'XL',
  'Brown',
  6,
  1220,
  'COPR-014-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-015'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-bottoms'),
  'Utility Canvas Pant',
  'utility-canvas-pant',
  'A copr favourite — Utility Canvas Pant balances comfort with quiet polish. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['utility'],
  true,
  false,
  false,
  4,
  6,
  true,
  '2025-05-15T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-015-img-0'), public.seed_uuid('prod-015'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-015-img-1'), public.seed_uuid('prod-015'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-olive-xs'),
  public.seed_uuid('prod-015'),
  'XS',
  'Olive',
  7,
  620,
  'COPR-015-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-olive-s'),
  public.seed_uuid('prod-015'),
  'S',
  'Olive',
  6,
  620,
  'COPR-015-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-olive-m'),
  public.seed_uuid('prod-015'),
  'M',
  'Olive',
  6,
  620,
  'COPR-015-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-olive-l'),
  public.seed_uuid('prod-015'),
  'L',
  'Olive',
  6,
  620,
  'COPR-015-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-olive-xl'),
  public.seed_uuid('prod-015'),
  'XL',
  'Olive',
  7,
  620,
  'COPR-015-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-black-xs'),
  public.seed_uuid('prod-015'),
  'XS',
  'Black',
  7,
  640,
  'COPR-015-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-black-s'),
  public.seed_uuid('prod-015'),
  'S',
  'Black',
  6,
  640,
  'COPR-015-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-black-m'),
  public.seed_uuid('prod-015'),
  'M',
  'Black',
  6,
  640,
  'COPR-015-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-black-l'),
  public.seed_uuid('prod-015'),
  'L',
  'Black',
  6,
  640,
  'COPR-015-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-black-xl'),
  public.seed_uuid('prod-015'),
  'XL',
  'Black',
  7,
  640,
  'COPR-015-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-brown-xs'),
  public.seed_uuid('prod-015'),
  'XS',
  'Brown',
  7,
  640,
  'COPR-015-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-brown-s'),
  public.seed_uuid('prod-015'),
  'S',
  'Brown',
  6,
  640,
  'COPR-015-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-brown-m'),
  public.seed_uuid('prod-015'),
  'M',
  'Brown',
  6,
  640,
  'COPR-015-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-brown-l'),
  public.seed_uuid('prod-015'),
  'L',
  'Brown',
  6,
  640,
  'COPR-015-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-utility-canvas-pant-brown-xl'),
  public.seed_uuid('prod-015'),
  'XL',
  'Brown',
  7,
  640,
  'COPR-015-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-016'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-tops'),
  'Soft Flannel Overshirt',
  'soft-flannel-overshirt',
  'A copr favourite — Soft Flannel Overshirt balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['overshirt'],
  false,
  true,
  false,
  4.1,
  9,
  true,
  '2025-06-16T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-016-img-0'), public.seed_uuid('prod-016'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-016-img-1'), public.seed_uuid('prod-016'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-brown-xs'),
  public.seed_uuid('prod-016'),
  'XS',
  'Brown',
  8,
  560,
  'COPR-016-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-brown-s'),
  public.seed_uuid('prod-016'),
  'S',
  'Brown',
  7,
  560,
  'COPR-016-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-brown-m'),
  public.seed_uuid('prod-016'),
  'M',
  'Brown',
  7,
  560,
  'COPR-016-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-brown-l'),
  public.seed_uuid('prod-016'),
  'L',
  'Brown',
  7,
  560,
  'COPR-016-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-brown-xl'),
  public.seed_uuid('prod-016'),
  'XL',
  'Brown',
  8,
  560,
  'COPR-016-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-grey-xs'),
  public.seed_uuid('prod-016'),
  'XS',
  'Grey',
  7,
  580,
  'COPR-016-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-grey-s'),
  public.seed_uuid('prod-016'),
  'S',
  'Grey',
  6,
  580,
  'COPR-016-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-grey-m'),
  public.seed_uuid('prod-016'),
  'M',
  'Grey',
  6,
  580,
  'COPR-016-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-grey-l'),
  public.seed_uuid('prod-016'),
  'L',
  'Grey',
  6,
  580,
  'COPR-016-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-grey-xl'),
  public.seed_uuid('prod-016'),
  'XL',
  'Grey',
  7,
  580,
  'COPR-016-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-red-xs'),
  public.seed_uuid('prod-016'),
  'XS',
  'Red',
  6,
  580,
  'COPR-016-RED-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-red-s'),
  public.seed_uuid('prod-016'),
  'S',
  'Red',
  5,
  580,
  'COPR-016-RED-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-red-m'),
  public.seed_uuid('prod-016'),
  'M',
  'Red',
  5,
  580,
  'COPR-016-RED-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-red-l'),
  public.seed_uuid('prod-016'),
  'L',
  'Red',
  5,
  580,
  'COPR-016-RED-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-flannel-overshirt-red-xl'),
  public.seed_uuid('prod-016'),
  'XL',
  'Red',
  6,
  580,
  'COPR-016-RED-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-017'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-footwear'),
  'Kitwe Leather Boot',
  'kitwe-leather-boot',
  'Kitwe Leather Boot is cut for Zambia’s heat and city pace. Built for pavement and packed markets — supportive sole, lasting materials.',
  ARRAY['boots'],
  false,
  false,
  false,
  4.2,
  12,
  true,
  '2025-07-17T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-017-img-0'), public.seed_uuid('prod-017'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-017-img-1'), public.seed_uuid('prod-017'), 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-brown-s'),
  public.seed_uuid('prod-017'),
  'S',
  'Brown',
  8,
  1350,
  'COPR-017-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-brown-m'),
  public.seed_uuid('prod-017'),
  'M',
  'Brown',
  8,
  1350,
  'COPR-017-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-brown-l'),
  public.seed_uuid('prod-017'),
  'L',
  'Brown',
  8,
  1350,
  'COPR-017-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-brown-xl'),
  public.seed_uuid('prod-017'),
  'XL',
  'Brown',
  9,
  1350,
  'COPR-017-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-black-s'),
  public.seed_uuid('prod-017'),
  'S',
  'Black',
  8,
  1370,
  'COPR-017-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-black-m'),
  public.seed_uuid('prod-017'),
  'M',
  'Black',
  8,
  1370,
  'COPR-017-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-black-l'),
  public.seed_uuid('prod-017'),
  'L',
  'Black',
  8,
  1370,
  'COPR-017-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kitwe-leather-boot-black-xl'),
  public.seed_uuid('prod-017'),
  'XL',
  'Black',
  9,
  1370,
  'COPR-017-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-018'),
  public.seed_uuid('brand-copper-cloth'),
  public.seed_uuid('cat-accessories'),
  'Waxed Canvas Tote',
  'waxed-canvas-tote',
  'Designed locally and finished with care, Waxed Canvas Tote belongs in a weekly rotation. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['bag'],
  false,
  false,
  false,
  4.3,
  15,
  true,
  '2025-08-18T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-018-img-0'), public.seed_uuid('prod-018'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-018-img-1'), public.seed_uuid('prod-018'), 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-waxed-canvas-tote-brown-one-size'),
  public.seed_uuid('prod-018'),
  'One Size',
  'Brown',
  8,
  390,
  'COPR-018-BRO-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-waxed-canvas-tote-olive-one-size'),
  public.seed_uuid('prod-018'),
  'One Size',
  'Olive',
  8,
  410,
  'COPR-018-OLI-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-waxed-canvas-tote-navy-one-size'),
  public.seed_uuid('prod-018'),
  'One Size',
  'Navy',
  7,
  410,
  'COPR-018-NAV-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-019'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-dresses'),
  'River Drift Maxi',
  'river-drift-maxi',
  'A copr favourite — River Drift Maxi balances comfort with quiet polish. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['maxi'],
  false,
  false,
  true,
  4.4,
  18,
  true,
  '2025-09-19T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-019-img-0'), public.seed_uuid('prod-019'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-019-img-1'), public.seed_uuid('prod-019'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-sky-xs'),
  public.seed_uuid('prod-019'),
  'XS',
  'Sky',
  9,
  820,
  'COPR-019-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-sky-s'),
  public.seed_uuid('prod-019'),
  'S',
  'Sky',
  8,
  820,
  'COPR-019-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-sky-m'),
  public.seed_uuid('prod-019'),
  'M',
  'Sky',
  8,
  820,
  'COPR-019-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-sky-l'),
  public.seed_uuid('prod-019'),
  'L',
  'Sky',
  8,
  820,
  'COPR-019-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-sky-xl'),
  public.seed_uuid('prod-019'),
  'XL',
  'Sky',
  9,
  820,
  'COPR-019-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-cream-xs'),
  public.seed_uuid('prod-019'),
  'XS',
  'Cream',
  3,
  840,
  'COPR-019-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-cream-s'),
  public.seed_uuid('prod-019'),
  'S',
  'Cream',
  2,
  840,
  'COPR-019-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-cream-m'),
  public.seed_uuid('prod-019'),
  'M',
  'Cream',
  2,
  840,
  'COPR-019-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-cream-l'),
  public.seed_uuid('prod-019'),
  'L',
  'Cream',
  2,
  840,
  'COPR-019-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-cream-xl'),
  public.seed_uuid('prod-019'),
  'XL',
  'Cream',
  3,
  840,
  'COPR-019-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-blue-xs'),
  public.seed_uuid('prod-019'),
  'XS',
  'Blue',
  2,
  840,
  'COPR-019-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-blue-s'),
  public.seed_uuid('prod-019'),
  'S',
  'Blue',
  9,
  840,
  'COPR-019-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-blue-m'),
  public.seed_uuid('prod-019'),
  'M',
  'Blue',
  9,
  840,
  'COPR-019-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-blue-l'),
  public.seed_uuid('prod-019'),
  'L',
  'Blue',
  9,
  840,
  'COPR-019-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-drift-maxi-blue-xl'),
  public.seed_uuid('prod-019'),
  'XL',
  'Blue',
  2,
  840,
  'COPR-019-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-020'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-dresses'),
  'Falls Mist Slip Dress',
  'falls-mist-slip-dress',
  'Falls Mist Slip Dress is cut for Zambia’s heat and city pace. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['slip'],
  false,
  false,
  false,
  4.5,
  21,
  true,
  '2025-10-20T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-020-img-0'), public.seed_uuid('prod-020'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-020-img-1'), public.seed_uuid('prod-020'), 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-white-xs'),
  public.seed_uuid('prod-020'),
  'XS',
  'White',
  4,
  710,
  'COPR-020-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-white-s'),
  public.seed_uuid('prod-020'),
  'S',
  'White',
  3,
  710,
  'COPR-020-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-white-m'),
  public.seed_uuid('prod-020'),
  'M',
  'White',
  3,
  710,
  'COPR-020-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-white-l'),
  public.seed_uuid('prod-020'),
  'L',
  'White',
  3,
  710,
  'COPR-020-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-white-xl'),
  public.seed_uuid('prod-020'),
  'XL',
  'White',
  4,
  710,
  'COPR-020-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-sky-xs'),
  public.seed_uuid('prod-020'),
  'XS',
  'Sky',
  2,
  730,
  'COPR-020-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-sky-s'),
  public.seed_uuid('prod-020'),
  'S',
  'Sky',
  9,
  730,
  'COPR-020-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-sky-m'),
  public.seed_uuid('prod-020'),
  'M',
  'Sky',
  9,
  730,
  'COPR-020-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-sky-l'),
  public.seed_uuid('prod-020'),
  'L',
  'Sky',
  9,
  730,
  'COPR-020-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-sky-xl'),
  public.seed_uuid('prod-020'),
  'XL',
  'Sky',
  2,
  730,
  'COPR-020-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-pink-xs'),
  public.seed_uuid('prod-020'),
  'XS',
  'Pink',
  3,
  730,
  'COPR-020-PIN-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-pink-s'),
  public.seed_uuid('prod-020'),
  'S',
  'Pink',
  2,
  730,
  'COPR-020-PIN-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-pink-m'),
  public.seed_uuid('prod-020'),
  'M',
  'Pink',
  2,
  730,
  'COPR-020-PIN-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-pink-l'),
  public.seed_uuid('prod-020'),
  'L',
  'Pink',
  2,
  730,
  'COPR-020-PIN-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-falls-mist-slip-dress-pink-xl'),
  public.seed_uuid('prod-020'),
  'XL',
  'Pink',
  3,
  730,
  'COPR-020-PIN-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-021'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-tops'),
  'Livingstone Linen Tee',
  'livingstone-linen-tee',
  'Livingstone Linen Tee is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['linen'],
  false,
  true,
  false,
  4.6,
  24,
  true,
  '2025-01-21T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-021-img-0'), public.seed_uuid('prod-021'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-021-img-1'), public.seed_uuid('prod-021'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-white-xs'),
  public.seed_uuid('prod-021'),
  'XS',
  'White',
  5,
  340,
  'COPR-021-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-white-s'),
  public.seed_uuid('prod-021'),
  'S',
  'White',
  4,
  340,
  'COPR-021-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-white-m'),
  public.seed_uuid('prod-021'),
  'M',
  'White',
  4,
  340,
  'COPR-021-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-white-l'),
  public.seed_uuid('prod-021'),
  'L',
  'White',
  4,
  340,
  'COPR-021-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-white-xl'),
  public.seed_uuid('prod-021'),
  'XL',
  'White',
  5,
  340,
  'COPR-021-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-cream-xs'),
  public.seed_uuid('prod-021'),
  'XS',
  'Cream',
  5,
  360,
  'COPR-021-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-cream-s'),
  public.seed_uuid('prod-021'),
  'S',
  'Cream',
  4,
  360,
  'COPR-021-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-cream-m'),
  public.seed_uuid('prod-021'),
  'M',
  'Cream',
  4,
  360,
  'COPR-021-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-cream-l'),
  public.seed_uuid('prod-021'),
  'L',
  'Cream',
  4,
  360,
  'COPR-021-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-cream-xl'),
  public.seed_uuid('prod-021'),
  'XL',
  'Cream',
  5,
  360,
  'COPR-021-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-sky-xs'),
  public.seed_uuid('prod-021'),
  'XS',
  'Sky',
  3,
  360,
  'COPR-021-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-sky-s'),
  public.seed_uuid('prod-021'),
  'S',
  'Sky',
  2,
  360,
  'COPR-021-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-sky-m'),
  public.seed_uuid('prod-021'),
  'M',
  'Sky',
  2,
  360,
  'COPR-021-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-sky-l'),
  public.seed_uuid('prod-021'),
  'L',
  'Sky',
  2,
  360,
  'COPR-021-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-livingstone-linen-tee-sky-xl'),
  public.seed_uuid('prod-021'),
  'XL',
  'Sky',
  3,
  360,
  'COPR-021-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-022'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-bottoms'),
  'Wide Flow Trouser',
  'wide-flow-trouser',
  'Designed locally and finished with care, Wide Flow Trouser belongs in a weekly rotation. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['wide-leg'],
  true,
  false,
  false,
  4.7,
  27,
  true,
  '2025-02-22T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-022-img-0'), public.seed_uuid('prod-022'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-022-img-1'), public.seed_uuid('prod-022'), 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-cream-xs'),
  public.seed_uuid('prod-022'),
  'XS',
  'Cream',
  6,
  590,
  'COPR-022-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-cream-s'),
  public.seed_uuid('prod-022'),
  'S',
  'Cream',
  5,
  590,
  'COPR-022-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-cream-m'),
  public.seed_uuid('prod-022'),
  'M',
  'Cream',
  5,
  590,
  'COPR-022-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-cream-l'),
  public.seed_uuid('prod-022'),
  'L',
  'Cream',
  5,
  590,
  'COPR-022-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-cream-xl'),
  public.seed_uuid('prod-022'),
  'XL',
  'Cream',
  6,
  590,
  'COPR-022-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-navy-xs'),
  public.seed_uuid('prod-022'),
  'XS',
  'Navy',
  5,
  610,
  'COPR-022-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-navy-s'),
  public.seed_uuid('prod-022'),
  'S',
  'Navy',
  4,
  610,
  'COPR-022-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-navy-m'),
  public.seed_uuid('prod-022'),
  'M',
  'Navy',
  4,
  610,
  'COPR-022-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-navy-l'),
  public.seed_uuid('prod-022'),
  'L',
  'Navy',
  4,
  610,
  'COPR-022-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-navy-xl'),
  public.seed_uuid('prod-022'),
  'XL',
  'Navy',
  5,
  610,
  'COPR-022-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-white-xs'),
  public.seed_uuid('prod-022'),
  'XS',
  'White',
  6,
  610,
  'COPR-022-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-white-s'),
  public.seed_uuid('prod-022'),
  'S',
  'White',
  5,
  610,
  'COPR-022-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-white-m'),
  public.seed_uuid('prod-022'),
  'M',
  'White',
  5,
  610,
  'COPR-022-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-white-l'),
  public.seed_uuid('prod-022'),
  'L',
  'White',
  5,
  610,
  'COPR-022-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-wide-flow-trouser-white-xl'),
  public.seed_uuid('prod-022'),
  'XL',
  'White',
  6,
  610,
  'COPR-022-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-023'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-outerwear'),
  'Mist Light Kimono',
  'mist-light-kimono',
  'Designed locally and finished with care, Mist Light Kimono belongs in a weekly rotation. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['kimono'],
  false,
  true,
  false,
  4.8,
  30,
  true,
  '2025-03-23T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-023-img-0'), public.seed_uuid('prod-023'), 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-023-img-1'), public.seed_uuid('prod-023'), 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-sky-xs'),
  public.seed_uuid('prod-023'),
  'XS',
  'Sky',
  5,
  640,
  'COPR-023-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-sky-s'),
  public.seed_uuid('prod-023'),
  'S',
  'Sky',
  4,
  640,
  'COPR-023-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-sky-m'),
  public.seed_uuid('prod-023'),
  'M',
  'Sky',
  4,
  640,
  'COPR-023-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-sky-l'),
  public.seed_uuid('prod-023'),
  'L',
  'Sky',
  4,
  640,
  'COPR-023-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-sky-xl'),
  public.seed_uuid('prod-023'),
  'XL',
  'Sky',
  5,
  640,
  'COPR-023-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-cream-xs'),
  public.seed_uuid('prod-023'),
  'XS',
  'Cream',
  7,
  660,
  'COPR-023-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-cream-s'),
  public.seed_uuid('prod-023'),
  'S',
  'Cream',
  6,
  660,
  'COPR-023-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-cream-m'),
  public.seed_uuid('prod-023'),
  'M',
  'Cream',
  6,
  660,
  'COPR-023-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-cream-l'),
  public.seed_uuid('prod-023'),
  'L',
  'Cream',
  6,
  660,
  'COPR-023-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-mist-light-kimono-cream-xl'),
  public.seed_uuid('prod-023'),
  'XL',
  'Cream',
  7,
  660,
  'COPR-023-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-024'),
  public.seed_uuid('brand-zambezi-atelier'),
  public.seed_uuid('cat-accessories'),
  'River Stone Pendant',
  'river-stone-pendant',
  'A copr favourite — River Stone Pendant balances comfort with quiet polish. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['jewellery'],
  false,
  false,
  false,
  4.9,
  33,
  true,
  '2025-04-24T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-024-img-0'), public.seed_uuid('prod-024'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-024-img-1'), public.seed_uuid('prod-024'), 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-stone-pendant-gold-one-size'),
  public.seed_uuid('prod-024'),
  'One Size',
  'Gold',
  5,
  280,
  'COPR-024-GOL-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-river-stone-pendant-blue-one-size'),
  public.seed_uuid('prod-024'),
  'One Size',
  'Blue',
  5,
  300,
  'COPR-024-BLU-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-025'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-bottoms'),
  'Cairo Road Straight Jean',
  'cairo-road-straight-jean',
  'Cairo Road Straight Jean is cut for Zambia’s heat and city pace. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['denim'],
  false,
  false,
  false,
  3.8,
  36,
  true,
  '2025-05-25T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-025-img-0'), public.seed_uuid('prod-025'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-025-img-1'), public.seed_uuid('prod-025'), 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-blue-xs'),
  public.seed_uuid('prod-025'),
  'XS',
  'Blue',
  8,
  680,
  'COPR-025-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-blue-s'),
  public.seed_uuid('prod-025'),
  'S',
  'Blue',
  7,
  680,
  'COPR-025-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-blue-m'),
  public.seed_uuid('prod-025'),
  'M',
  'Blue',
  7,
  680,
  'COPR-025-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-blue-l'),
  public.seed_uuid('prod-025'),
  'L',
  'Blue',
  7,
  680,
  'COPR-025-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-blue-xl'),
  public.seed_uuid('prod-025'),
  'XL',
  'Blue',
  8,
  680,
  'COPR-025-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-black-xs'),
  public.seed_uuid('prod-025'),
  'XS',
  'Black',
  9,
  700,
  'COPR-025-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-black-s'),
  public.seed_uuid('prod-025'),
  'S',
  'Black',
  8,
  700,
  'COPR-025-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-black-m'),
  public.seed_uuid('prod-025'),
  'M',
  'Black',
  8,
  700,
  'COPR-025-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-black-l'),
  public.seed_uuid('prod-025'),
  'L',
  'Black',
  8,
  700,
  'COPR-025-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-black-xl'),
  public.seed_uuid('prod-025'),
  'XL',
  'Black',
  9,
  700,
  'COPR-025-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-grey-xs'),
  public.seed_uuid('prod-025'),
  'XS',
  'Grey',
  8,
  700,
  'COPR-025-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-grey-s'),
  public.seed_uuid('prod-025'),
  'S',
  'Grey',
  7,
  700,
  'COPR-025-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-grey-m'),
  public.seed_uuid('prod-025'),
  'M',
  'Grey',
  7,
  700,
  'COPR-025-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-grey-l'),
  public.seed_uuid('prod-025'),
  'L',
  'Grey',
  7,
  700,
  'COPR-025-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cairo-road-straight-jean-grey-xl'),
  public.seed_uuid('prod-025'),
  'XL',
  'Grey',
  8,
  700,
  'COPR-025-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-026'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-tops'),
  'Levy Junction Tee',
  'levy-junction-tee',
  'Designed locally and finished with care, Levy Junction Tee belongs in a weekly rotation. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['tee'],
  false,
  true,
  false,
  3.9,
  39,
  true,
  '2025-06-26T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-026-img-0'), public.seed_uuid('prod-026'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-026-img-1'), public.seed_uuid('prod-026'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-white-xs'),
  public.seed_uuid('prod-026'),
  'XS',
  'White',
  2,
  220,
  'COPR-026-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-white-s'),
  public.seed_uuid('prod-026'),
  'S',
  'White',
  9,
  220,
  'COPR-026-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-white-m'),
  public.seed_uuid('prod-026'),
  'M',
  'White',
  9,
  220,
  'COPR-026-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-white-l'),
  public.seed_uuid('prod-026'),
  'L',
  'White',
  9,
  220,
  'COPR-026-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-white-xl'),
  public.seed_uuid('prod-026'),
  'XL',
  'White',
  2,
  220,
  'COPR-026-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-black-xs'),
  public.seed_uuid('prod-026'),
  'XS',
  'Black',
  2,
  240,
  'COPR-026-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-black-s'),
  public.seed_uuid('prod-026'),
  'S',
  'Black',
  9,
  240,
  'COPR-026-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-black-m'),
  public.seed_uuid('prod-026'),
  'M',
  'Black',
  9,
  240,
  'COPR-026-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-black-l'),
  public.seed_uuid('prod-026'),
  'L',
  'Black',
  9,
  240,
  'COPR-026-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-black-xl'),
  public.seed_uuid('prod-026'),
  'XL',
  'Black',
  2,
  240,
  'COPR-026-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-navy-xs'),
  public.seed_uuid('prod-026'),
  'XS',
  'Navy',
  9,
  240,
  'COPR-026-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-navy-s'),
  public.seed_uuid('prod-026'),
  'S',
  'Navy',
  8,
  240,
  'COPR-026-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-navy-m'),
  public.seed_uuid('prod-026'),
  'M',
  'Navy',
  8,
  240,
  'COPR-026-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-navy-l'),
  public.seed_uuid('prod-026'),
  'L',
  'Navy',
  8,
  240,
  'COPR-026-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-navy-xl'),
  public.seed_uuid('prod-026'),
  'XL',
  'Navy',
  9,
  240,
  'COPR-026-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-sky-xs'),
  public.seed_uuid('prod-026'),
  'XS',
  'Sky',
  8,
  240,
  'COPR-026-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-sky-s'),
  public.seed_uuid('prod-026'),
  'S',
  'Sky',
  7,
  240,
  'COPR-026-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-sky-m'),
  public.seed_uuid('prod-026'),
  'M',
  'Sky',
  7,
  240,
  'COPR-026-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-sky-l'),
  public.seed_uuid('prod-026'),
  'L',
  'Sky',
  7,
  240,
  'COPR-026-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-levy-junction-tee-sky-xl'),
  public.seed_uuid('prod-026'),
  'XL',
  'Sky',
  8,
  240,
  'COPR-026-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-027'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-tops'),
  'Manda Hill Poplin Shirt',
  'manda-hill-poplin-shirt',
  'Designed locally and finished with care, Manda Hill Poplin Shirt belongs in a weekly rotation. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['poplin'],
  false,
  false,
  false,
  4,
  42,
  true,
  '2025-07-27T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-027-img-0'), public.seed_uuid('prod-027'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-027-img-1'), public.seed_uuid('prod-027'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-white-xs'),
  public.seed_uuid('prod-027'),
  'XS',
  'White',
  3,
  450,
  'COPR-027-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-white-s'),
  public.seed_uuid('prod-027'),
  'S',
  'White',
  2,
  450,
  'COPR-027-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-white-m'),
  public.seed_uuid('prod-027'),
  'M',
  'White',
  2,
  450,
  'COPR-027-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-white-l'),
  public.seed_uuid('prod-027'),
  'L',
  'White',
  2,
  450,
  'COPR-027-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-white-xl'),
  public.seed_uuid('prod-027'),
  'XL',
  'White',
  3,
  450,
  'COPR-027-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-sky-xs'),
  public.seed_uuid('prod-027'),
  'XS',
  'Sky',
  9,
  470,
  'COPR-027-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-sky-s'),
  public.seed_uuid('prod-027'),
  'S',
  'Sky',
  8,
  470,
  'COPR-027-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-sky-m'),
  public.seed_uuid('prod-027'),
  'M',
  'Sky',
  8,
  470,
  'COPR-027-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-sky-l'),
  public.seed_uuid('prod-027'),
  'L',
  'Sky',
  8,
  470,
  'COPR-027-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-sky-xl'),
  public.seed_uuid('prod-027'),
  'XL',
  'Sky',
  9,
  470,
  'COPR-027-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-pink-xs'),
  public.seed_uuid('prod-027'),
  'XS',
  'Pink',
  2,
  470,
  'COPR-027-PIN-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-pink-s'),
  public.seed_uuid('prod-027'),
  'S',
  'Pink',
  9,
  470,
  'COPR-027-PIN-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-pink-m'),
  public.seed_uuid('prod-027'),
  'M',
  'Pink',
  9,
  470,
  'COPR-027-PIN-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-pink-l'),
  public.seed_uuid('prod-027'),
  'L',
  'Pink',
  9,
  470,
  'COPR-027-PIN-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-manda-hill-poplin-shirt-pink-xl'),
  public.seed_uuid('prod-027'),
  'XL',
  'Pink',
  2,
  470,
  'COPR-027-PIN-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-028'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-dresses'),
  'Weekend Shirt Dress',
  'weekend-shirt-dress',
  'A copr favourite — Weekend Shirt Dress balances comfort with quiet polish. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['shirt-dress'],
  false,
  false,
  true,
  4.1,
  5,
  true,
  '2025-08-01T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-028-img-0'), public.seed_uuid('prod-028'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-028-img-1'), public.seed_uuid('prod-028'), 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-white-xs'),
  public.seed_uuid('prod-028'),
  'XS',
  'White',
  4,
  580,
  'COPR-028-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-white-s'),
  public.seed_uuid('prod-028'),
  'S',
  'White',
  3,
  580,
  'COPR-028-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-white-m'),
  public.seed_uuid('prod-028'),
  'M',
  'White',
  3,
  580,
  'COPR-028-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-white-l'),
  public.seed_uuid('prod-028'),
  'L',
  'White',
  3,
  580,
  'COPR-028-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-white-xl'),
  public.seed_uuid('prod-028'),
  'XL',
  'White',
  4,
  580,
  'COPR-028-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-navy-xs'),
  public.seed_uuid('prod-028'),
  'XS',
  'Navy',
  3,
  600,
  'COPR-028-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-navy-s'),
  public.seed_uuid('prod-028'),
  'S',
  'Navy',
  2,
  600,
  'COPR-028-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-navy-m'),
  public.seed_uuid('prod-028'),
  'M',
  'Navy',
  2,
  600,
  'COPR-028-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-navy-l'),
  public.seed_uuid('prod-028'),
  'L',
  'Navy',
  2,
  600,
  'COPR-028-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-navy-xl'),
  public.seed_uuid('prod-028'),
  'XL',
  'Navy',
  3,
  600,
  'COPR-028-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-olive-xs'),
  public.seed_uuid('prod-028'),
  'XS',
  'Olive',
  4,
  600,
  'COPR-028-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-olive-s'),
  public.seed_uuid('prod-028'),
  'S',
  'Olive',
  3,
  600,
  'COPR-028-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-olive-m'),
  public.seed_uuid('prod-028'),
  'M',
  'Olive',
  3,
  600,
  'COPR-028-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-olive-l'),
  public.seed_uuid('prod-028'),
  'L',
  'Olive',
  3,
  600,
  'COPR-028-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-shirt-dress-olive-xl'),
  public.seed_uuid('prod-028'),
  'XL',
  'Olive',
  4,
  600,
  'COPR-028-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-029'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-bottoms'),
  'Everyday Chino',
  'everyday-chino',
  'Designed locally and finished with care, Everyday Chino belongs in a weekly rotation. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['chino'],
  true,
  false,
  false,
  4.2,
  8,
  true,
  '2025-09-02T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-029-img-0'), public.seed_uuid('prod-029'), 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-029-img-1'), public.seed_uuid('prod-029'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-cream-xs'),
  public.seed_uuid('prod-029'),
  'XS',
  'Cream',
  5,
  520,
  'COPR-029-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-cream-s'),
  public.seed_uuid('prod-029'),
  'S',
  'Cream',
  4,
  520,
  'COPR-029-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-cream-m'),
  public.seed_uuid('prod-029'),
  'M',
  'Cream',
  4,
  520,
  'COPR-029-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-cream-l'),
  public.seed_uuid('prod-029'),
  'L',
  'Cream',
  4,
  520,
  'COPR-029-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-cream-xl'),
  public.seed_uuid('prod-029'),
  'XL',
  'Cream',
  5,
  520,
  'COPR-029-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-navy-xs'),
  public.seed_uuid('prod-029'),
  'XS',
  'Navy',
  4,
  540,
  'COPR-029-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-navy-s'),
  public.seed_uuid('prod-029'),
  'S',
  'Navy',
  3,
  540,
  'COPR-029-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-navy-m'),
  public.seed_uuid('prod-029'),
  'M',
  'Navy',
  3,
  540,
  'COPR-029-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-navy-l'),
  public.seed_uuid('prod-029'),
  'L',
  'Navy',
  3,
  540,
  'COPR-029-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-navy-xl'),
  public.seed_uuid('prod-029'),
  'XL',
  'Navy',
  4,
  540,
  'COPR-029-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-olive-xs'),
  public.seed_uuid('prod-029'),
  'XS',
  'Olive',
  5,
  540,
  'COPR-029-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-olive-s'),
  public.seed_uuid('prod-029'),
  'S',
  'Olive',
  4,
  540,
  'COPR-029-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-olive-m'),
  public.seed_uuid('prod-029'),
  'M',
  'Olive',
  4,
  540,
  'COPR-029-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-olive-l'),
  public.seed_uuid('prod-029'),
  'L',
  'Olive',
  4,
  540,
  'COPR-029-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-chino-olive-xl'),
  public.seed_uuid('prod-029'),
  'XL',
  'Olive',
  5,
  540,
  'COPR-029-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-030'),
  public.seed_uuid('brand-lusaka-label'),
  public.seed_uuid('cat-outerwear'),
  'City Denim Jacket',
  'city-denim-jacket',
  'Designed locally and finished with care, City Denim Jacket belongs in a weekly rotation. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['denim'],
  false,
  false,
  false,
  4.3,
  11,
  true,
  '2025-10-03T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-030-img-0'), public.seed_uuid('prod-030'), 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-030-img-1'), public.seed_uuid('prod-030'), 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-blue-xs'),
  public.seed_uuid('prod-030'),
  'XS',
  'Blue',
  5,
  890,
  'COPR-030-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-blue-s'),
  public.seed_uuid('prod-030'),
  'S',
  'Blue',
  4,
  890,
  'COPR-030-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-blue-m'),
  public.seed_uuid('prod-030'),
  'M',
  'Blue',
  4,
  890,
  'COPR-030-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-blue-l'),
  public.seed_uuid('prod-030'),
  'L',
  'Blue',
  4,
  890,
  'COPR-030-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-blue-xl'),
  public.seed_uuid('prod-030'),
  'XL',
  'Blue',
  5,
  890,
  'COPR-030-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-black-xs'),
  public.seed_uuid('prod-030'),
  'XS',
  'Black',
  6,
  910,
  'COPR-030-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-black-s'),
  public.seed_uuid('prod-030'),
  'S',
  'Black',
  5,
  910,
  'COPR-030-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-black-m'),
  public.seed_uuid('prod-030'),
  'M',
  'Black',
  5,
  910,
  'COPR-030-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-black-l'),
  public.seed_uuid('prod-030'),
  'L',
  'Black',
  5,
  910,
  'COPR-030-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-city-denim-jacket-black-xl'),
  public.seed_uuid('prod-030'),
  'XL',
  'Black',
  6,
  910,
  'COPR-030-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-031'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-accessories'),
  'Chongwe Beaded Clutch',
  'chongwe-beaded-clutch',
  'Chongwe Beaded Clutch is cut for Zambia’s heat and city pace. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['beaded', 'bag'],
  false,
  true,
  false,
  4.4,
  14,
  true,
  '2025-01-04T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-031-img-0'), public.seed_uuid('prod-031'), 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-031-img-1'), public.seed_uuid('prod-031'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-chongwe-beaded-clutch-gold-one-size'),
  public.seed_uuid('prod-031'),
  'One Size',
  'Gold',
  4,
  450,
  'COPR-031-GOL-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-chongwe-beaded-clutch-black-one-size'),
  public.seed_uuid('prod-031'),
  'One Size',
  'Black',
  5,
  470,
  'COPR-031-BLA-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-chongwe-beaded-clutch-red-one-size'),
  public.seed_uuid('prod-031'),
  'One Size',
  'Red',
  3,
  470,
  'COPR-031-RED-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-032'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-accessories'),
  'Handloom Cotton Scarf',
  'handloom-cotton-scarf',
  'Handloom Cotton Scarf is cut for Zambia’s heat and city pace. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['scarf'],
  false,
  false,
  false,
  4.5,
  17,
  true,
  '2025-02-05T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-032-img-0'), public.seed_uuid('prod-032'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-032-img-1'), public.seed_uuid('prod-032'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-handloom-cotton-scarf-cream-one-size'),
  public.seed_uuid('prod-032'),
  'One Size',
  'Cream',
  6,
  260,
  'COPR-032-CRE-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-handloom-cotton-scarf-sky-one-size'),
  public.seed_uuid('prod-032'),
  'One Size',
  'Sky',
  4,
  280,
  'COPR-032-SKY-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-handloom-cotton-scarf-olive-one-size'),
  public.seed_uuid('prod-032'),
  'One Size',
  'Olive',
  6,
  280,
  'COPR-032-OLI-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-033'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-tops'),
  'Soft Handknit Vest',
  'soft-handknit-vest',
  'Soft Handknit Vest is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['knit'],
  false,
  false,
  false,
  4.6,
  20,
  true,
  '2025-03-06T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-033-img-0'), public.seed_uuid('prod-033'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-033-img-1'), public.seed_uuid('prod-033'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-cream-xs'),
  public.seed_uuid('prod-033'),
  'XS',
  'Cream',
  9,
  580,
  'COPR-033-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-cream-s'),
  public.seed_uuid('prod-033'),
  'S',
  'Cream',
  8,
  580,
  'COPR-033-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-cream-m'),
  public.seed_uuid('prod-033'),
  'M',
  'Cream',
  8,
  580,
  'COPR-033-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-cream-l'),
  public.seed_uuid('prod-033'),
  'L',
  'Cream',
  8,
  580,
  'COPR-033-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-cream-xl'),
  public.seed_uuid('prod-033'),
  'XL',
  'Cream',
  9,
  580,
  'COPR-033-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-grey-xs'),
  public.seed_uuid('prod-033'),
  'XS',
  'Grey',
  8,
  600,
  'COPR-033-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-grey-s'),
  public.seed_uuid('prod-033'),
  'S',
  'Grey',
  7,
  600,
  'COPR-033-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-grey-m'),
  public.seed_uuid('prod-033'),
  'M',
  'Grey',
  7,
  600,
  'COPR-033-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-grey-l'),
  public.seed_uuid('prod-033'),
  'L',
  'Grey',
  7,
  600,
  'COPR-033-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-grey-xl'),
  public.seed_uuid('prod-033'),
  'XL',
  'Grey',
  8,
  600,
  'COPR-033-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-navy-xs'),
  public.seed_uuid('prod-033'),
  'XS',
  'Navy',
  8,
  600,
  'COPR-033-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-navy-s'),
  public.seed_uuid('prod-033'),
  'S',
  'Navy',
  7,
  600,
  'COPR-033-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-navy-m'),
  public.seed_uuid('prod-033'),
  'M',
  'Navy',
  7,
  600,
  'COPR-033-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-navy-l'),
  public.seed_uuid('prod-033'),
  'L',
  'Navy',
  7,
  600,
  'COPR-033-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-handknit-vest-navy-xl'),
  public.seed_uuid('prod-033'),
  'XL',
  'Navy',
  8,
  600,
  'COPR-033-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-034'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-accessories'),
  'Copper Coil Earrings',
  'copper-coil-earrings',
  'Designed locally and finished with care, Copper Coil Earrings belongs in a weekly rotation. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['jewellery'],
  false,
  true,
  false,
  4.7,
  23,
  true,
  '2025-04-07T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-034-img-0'), public.seed_uuid('prod-034'), 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-034-img-1'), public.seed_uuid('prod-034'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-coil-earrings-gold-one-size'),
  public.seed_uuid('prod-034'),
  'One Size',
  'Gold',
  7,
  190,
  'COPR-034-GOL-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-copper-coil-earrings-brown-one-size'),
  public.seed_uuid('prod-034'),
  'One Size',
  'Brown',
  8,
  210,
  'COPR-034-BRO-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-035'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-footwear'),
  'Woven Market Sandal',
  'woven-market-sandal',
  'A copr favourite — Woven Market Sandal balances comfort with quiet polish. Built for pavement and packed markets — supportive sole, lasting materials.',
  ARRAY['sandal'],
  false,
  false,
  false,
  4.8,
  26,
  true,
  '2025-05-08T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-035-img-0'), public.seed_uuid('prod-035'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-035-img-1'), public.seed_uuid('prod-035'), 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-brown-s'),
  public.seed_uuid('prod-035'),
  'S',
  'Brown',
  2,
  420,
  'COPR-035-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-brown-m'),
  public.seed_uuid('prod-035'),
  'M',
  'Brown',
  2,
  420,
  'COPR-035-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-brown-l'),
  public.seed_uuid('prod-035'),
  'L',
  'Brown',
  2,
  420,
  'COPR-035-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-brown-xl'),
  public.seed_uuid('prod-035'),
  'XL',
  'Brown',
  3,
  420,
  'COPR-035-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-cream-s'),
  public.seed_uuid('prod-035'),
  'S',
  'Cream',
  2,
  440,
  'COPR-035-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-cream-m'),
  public.seed_uuid('prod-035'),
  'M',
  'Cream',
  2,
  440,
  'COPR-035-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-cream-l'),
  public.seed_uuid('prod-035'),
  'L',
  'Cream',
  2,
  440,
  'COPR-035-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-woven-market-sandal-cream-xl'),
  public.seed_uuid('prod-035'),
  'XL',
  'Cream',
  3,
  440,
  'COPR-035-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-036'),
  public.seed_uuid('brand-mutale-made'),
  public.seed_uuid('cat-accessories'),
  'Raffia Market Basket',
  'raffia-market-basket',
  'Designed locally and finished with care, Raffia Market Basket belongs in a weekly rotation. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['basket'],
  true,
  true,
  false,
  4.9,
  29,
  true,
  '2025-06-09T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-036-img-0'), public.seed_uuid('prod-036'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-036-img-1'), public.seed_uuid('prod-036'), 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-raffia-market-basket-cream-one-size'),
  public.seed_uuid('prod-036'),
  'One Size',
  'Cream',
  2,
  310,
  'COPR-036-CRE-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-raffia-market-basket-brown-one-size'),
  public.seed_uuid('prod-036'),
  'One Size',
  'Brown',
  2,
  330,
  'COPR-036-BRO-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-037'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-dresses'),
  'Column Cut Midi',
  'column-cut-midi',
  'Column Cut Midi is cut for Zambia’s heat and city pace. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['structured'],
  false,
  false,
  true,
  3.8,
  32,
  true,
  '2025-07-10T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-037-img-0'), public.seed_uuid('prod-037'), 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-037-img-1'), public.seed_uuid('prod-037'), 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-black-xs'),
  public.seed_uuid('prod-037'),
  'XS',
  'Black',
  5,
  920,
  'COPR-037-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-black-s'),
  public.seed_uuid('prod-037'),
  'S',
  'Black',
  4,
  920,
  'COPR-037-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-black-m'),
  public.seed_uuid('prod-037'),
  'M',
  'Black',
  4,
  920,
  'COPR-037-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-black-l'),
  public.seed_uuid('prod-037'),
  'L',
  'Black',
  4,
  920,
  'COPR-037-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-black-xl'),
  public.seed_uuid('prod-037'),
  'XL',
  'Black',
  5,
  920,
  'COPR-037-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-navy-xs'),
  public.seed_uuid('prod-037'),
  'XS',
  'Navy',
  4,
  940,
  'COPR-037-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-navy-s'),
  public.seed_uuid('prod-037'),
  'S',
  'Navy',
  3,
  940,
  'COPR-037-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-navy-m'),
  public.seed_uuid('prod-037'),
  'M',
  'Navy',
  3,
  940,
  'COPR-037-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-navy-l'),
  public.seed_uuid('prod-037'),
  'L',
  'Navy',
  3,
  940,
  'COPR-037-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-navy-xl'),
  public.seed_uuid('prod-037'),
  'XL',
  'Navy',
  4,
  940,
  'COPR-037-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-white-xs'),
  public.seed_uuid('prod-037'),
  'XS',
  'White',
  5,
  940,
  'COPR-037-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-white-s'),
  public.seed_uuid('prod-037'),
  'S',
  'White',
  4,
  940,
  'COPR-037-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-white-m'),
  public.seed_uuid('prod-037'),
  'M',
  'White',
  4,
  940,
  'COPR-037-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-white-l'),
  public.seed_uuid('prod-037'),
  'L',
  'White',
  4,
  940,
  'COPR-037-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-column-cut-midi-white-xl'),
  public.seed_uuid('prod-037'),
  'XL',
  'White',
  5,
  940,
  'COPR-037-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-038'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-tops'),
  'Angular Crop Top',
  'angular-crop-top',
  'A copr favourite — Angular Crop Top balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['crop'],
  false,
  false,
  false,
  3.9,
  35,
  true,
  '2025-08-11T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-038-img-0'), public.seed_uuid('prod-038'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-038-img-1'), public.seed_uuid('prod-038'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-black-xs'),
  public.seed_uuid('prod-038'),
  'XS',
  'Black',
  6,
  380,
  'COPR-038-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-black-s'),
  public.seed_uuid('prod-038'),
  'S',
  'Black',
  5,
  380,
  'COPR-038-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-black-m'),
  public.seed_uuid('prod-038'),
  'M',
  'Black',
  5,
  380,
  'COPR-038-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-black-l'),
  public.seed_uuid('prod-038'),
  'L',
  'Black',
  5,
  380,
  'COPR-038-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-black-xl'),
  public.seed_uuid('prod-038'),
  'XL',
  'Black',
  6,
  380,
  'COPR-038-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-white-xs'),
  public.seed_uuid('prod-038'),
  'XS',
  'White',
  6,
  400,
  'COPR-038-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-white-s'),
  public.seed_uuid('prod-038'),
  'S',
  'White',
  5,
  400,
  'COPR-038-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-white-m'),
  public.seed_uuid('prod-038'),
  'M',
  'White',
  5,
  400,
  'COPR-038-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-white-l'),
  public.seed_uuid('prod-038'),
  'L',
  'White',
  5,
  400,
  'COPR-038-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-white-xl'),
  public.seed_uuid('prod-038'),
  'XL',
  'White',
  6,
  400,
  'COPR-038-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-sky-xs'),
  public.seed_uuid('prod-038'),
  'XS',
  'Sky',
  4,
  400,
  'COPR-038-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-sky-s'),
  public.seed_uuid('prod-038'),
  'S',
  'Sky',
  3,
  400,
  'COPR-038-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-sky-m'),
  public.seed_uuid('prod-038'),
  'M',
  'Sky',
  3,
  400,
  'COPR-038-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-sky-l'),
  public.seed_uuid('prod-038'),
  'L',
  'Sky',
  3,
  400,
  'COPR-038-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-angular-crop-top-sky-xl'),
  public.seed_uuid('prod-038'),
  'XL',
  'Sky',
  4,
  400,
  'COPR-038-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-039'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-bottoms'),
  'Panelled Culotte',
  'panelled-culotte',
  'A copr favourite — Panelled Culotte balances comfort with quiet polish. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['culotte'],
  false,
  false,
  false,
  4,
  38,
  true,
  '2025-09-12T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-039-img-0'), public.seed_uuid('prod-039'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-039-img-1'), public.seed_uuid('prod-039'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-black-xs'),
  public.seed_uuid('prod-039'),
  'XS',
  'Black',
  7,
  640,
  'COPR-039-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-black-s'),
  public.seed_uuid('prod-039'),
  'S',
  'Black',
  6,
  640,
  'COPR-039-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-black-m'),
  public.seed_uuid('prod-039'),
  'M',
  'Black',
  6,
  640,
  'COPR-039-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-black-l'),
  public.seed_uuid('prod-039'),
  'L',
  'Black',
  6,
  640,
  'COPR-039-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-black-xl'),
  public.seed_uuid('prod-039'),
  'XL',
  'Black',
  7,
  640,
  'COPR-039-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-cream-xs'),
  public.seed_uuid('prod-039'),
  'XS',
  'Cream',
  7,
  660,
  'COPR-039-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-cream-s'),
  public.seed_uuid('prod-039'),
  'S',
  'Cream',
  6,
  660,
  'COPR-039-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-cream-m'),
  public.seed_uuid('prod-039'),
  'M',
  'Cream',
  6,
  660,
  'COPR-039-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-cream-l'),
  public.seed_uuid('prod-039'),
  'L',
  'Cream',
  6,
  660,
  'COPR-039-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-cream-xl'),
  public.seed_uuid('prod-039'),
  'XL',
  'Cream',
  7,
  660,
  'COPR-039-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-olive-xs'),
  public.seed_uuid('prod-039'),
  'XS',
  'Olive',
  7,
  660,
  'COPR-039-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-olive-s'),
  public.seed_uuid('prod-039'),
  'S',
  'Olive',
  6,
  660,
  'COPR-039-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-olive-m'),
  public.seed_uuid('prod-039'),
  'M',
  'Olive',
  6,
  660,
  'COPR-039-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-olive-l'),
  public.seed_uuid('prod-039'),
  'L',
  'Olive',
  6,
  660,
  'COPR-039-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-panelled-culotte-olive-xl'),
  public.seed_uuid('prod-039'),
  'XL',
  'Olive',
  7,
  660,
  'COPR-039-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-040'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-outerwear'),
  'Structured Cape Coat',
  'structured-cape-coat',
  'Designed locally and finished with care, Structured Cape Coat belongs in a weekly rotation. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['cape'],
  false,
  false,
  false,
  4.1,
  41,
  true,
  '2025-10-13T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-040-img-0'), public.seed_uuid('prod-040'), 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-040-img-1'), public.seed_uuid('prod-040'), 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-navy-xs'),
  public.seed_uuid('prod-040'),
  'XS',
  'Navy',
  7,
  1580,
  'COPR-040-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-navy-s'),
  public.seed_uuid('prod-040'),
  'S',
  'Navy',
  6,
  1580,
  'COPR-040-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-navy-m'),
  public.seed_uuid('prod-040'),
  'M',
  'Navy',
  6,
  1580,
  'COPR-040-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-navy-l'),
  public.seed_uuid('prod-040'),
  'L',
  'Navy',
  6,
  1580,
  'COPR-040-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-navy-xl'),
  public.seed_uuid('prod-040'),
  'XL',
  'Navy',
  7,
  1580,
  'COPR-040-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-black-xs'),
  public.seed_uuid('prod-040'),
  'XS',
  'Black',
  8,
  1600,
  'COPR-040-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-black-s'),
  public.seed_uuid('prod-040'),
  'S',
  'Black',
  7,
  1600,
  'COPR-040-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-black-m'),
  public.seed_uuid('prod-040'),
  'M',
  'Black',
  7,
  1600,
  'COPR-040-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-black-l'),
  public.seed_uuid('prod-040'),
  'L',
  'Black',
  7,
  1600,
  'COPR-040-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-structured-cape-coat-black-xl'),
  public.seed_uuid('prod-040'),
  'XL',
  'Black',
  8,
  1600,
  'COPR-040-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-041'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-tops'),
  'Asymmetric Hem Blouse',
  'asymmetric-hem-blouse',
  'Asymmetric Hem Blouse is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['blouse'],
  false,
  true,
  false,
  4.2,
  4,
  true,
  '2025-01-14T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-041-img-0'), public.seed_uuid('prod-041'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-041-img-1'), public.seed_uuid('prod-041'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-white-xs'),
  public.seed_uuid('prod-041'),
  'XS',
  'White',
  9,
  490,
  'COPR-041-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-white-s'),
  public.seed_uuid('prod-041'),
  'S',
  'White',
  8,
  490,
  'COPR-041-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-white-m'),
  public.seed_uuid('prod-041'),
  'M',
  'White',
  8,
  490,
  'COPR-041-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-white-l'),
  public.seed_uuid('prod-041'),
  'L',
  'White',
  8,
  490,
  'COPR-041-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-white-xl'),
  public.seed_uuid('prod-041'),
  'XL',
  'White',
  9,
  490,
  'COPR-041-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-sky-xs'),
  public.seed_uuid('prod-041'),
  'XS',
  'Sky',
  7,
  510,
  'COPR-041-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-sky-s'),
  public.seed_uuid('prod-041'),
  'S',
  'Sky',
  6,
  510,
  'COPR-041-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-sky-m'),
  public.seed_uuid('prod-041'),
  'M',
  'Sky',
  6,
  510,
  'COPR-041-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-sky-l'),
  public.seed_uuid('prod-041'),
  'L',
  'Sky',
  6,
  510,
  'COPR-041-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-sky-xl'),
  public.seed_uuid('prod-041'),
  'XL',
  'Sky',
  7,
  510,
  'COPR-041-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-black-xs'),
  public.seed_uuid('prod-041'),
  'XS',
  'Black',
  9,
  510,
  'COPR-041-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-black-s'),
  public.seed_uuid('prod-041'),
  'S',
  'Black',
  8,
  510,
  'COPR-041-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-black-m'),
  public.seed_uuid('prod-041'),
  'M',
  'Black',
  8,
  510,
  'COPR-041-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-black-l'),
  public.seed_uuid('prod-041'),
  'L',
  'Black',
  8,
  510,
  'COPR-041-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-asymmetric-hem-blouse-black-xl'),
  public.seed_uuid('prod-041'),
  'XL',
  'Black',
  9,
  510,
  'COPR-041-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-042'),
  public.seed_uuid('brand-savannah-form'),
  public.seed_uuid('cat-dresses'),
  'Heatwave Shift Dress',
  'heatwave-shift-dress',
  'Designed locally and finished with care, Heatwave Shift Dress belongs in a weekly rotation. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['shift'],
  false,
  false,
  false,
  4.3,
  7,
  true,
  '2025-02-15T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-042-img-0'), public.seed_uuid('prod-042'), 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-042-img-1'), public.seed_uuid('prod-042'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-white-xs'),
  public.seed_uuid('prod-042'),
  'XS',
  'White',
  2,
  760,
  'COPR-042-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-white-s'),
  public.seed_uuid('prod-042'),
  'S',
  'White',
  9,
  760,
  'COPR-042-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-white-m'),
  public.seed_uuid('prod-042'),
  'M',
  'White',
  9,
  760,
  'COPR-042-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-white-l'),
  public.seed_uuid('prod-042'),
  'L',
  'White',
  9,
  760,
  'COPR-042-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-white-xl'),
  public.seed_uuid('prod-042'),
  'XL',
  'White',
  2,
  760,
  'COPR-042-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-olive-xs'),
  public.seed_uuid('prod-042'),
  'XS',
  'Olive',
  2,
  780,
  'COPR-042-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-olive-s'),
  public.seed_uuid('prod-042'),
  'S',
  'Olive',
  9,
  780,
  'COPR-042-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-olive-m'),
  public.seed_uuid('prod-042'),
  'M',
  'Olive',
  9,
  780,
  'COPR-042-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-olive-l'),
  public.seed_uuid('prod-042'),
  'L',
  'Olive',
  9,
  780,
  'COPR-042-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-olive-xl'),
  public.seed_uuid('prod-042'),
  'XL',
  'Olive',
  2,
  780,
  'COPR-042-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-blue-xs'),
  public.seed_uuid('prod-042'),
  'XS',
  'Blue',
  9,
  780,
  'COPR-042-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-blue-s'),
  public.seed_uuid('prod-042'),
  'S',
  'Blue',
  8,
  780,
  'COPR-042-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-blue-m'),
  public.seed_uuid('prod-042'),
  'M',
  'Blue',
  8,
  780,
  'COPR-042-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-blue-l'),
  public.seed_uuid('prod-042'),
  'L',
  'Blue',
  8,
  780,
  'COPR-042-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-heatwave-shift-dress-blue-xl'),
  public.seed_uuid('prod-042'),
  'XL',
  'Blue',
  9,
  780,
  'COPR-042-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-043'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-dresses'),
  'Indigo Baobab Dress',
  'indigo-baobab-dress',
  'A copr favourite — Indigo Baobab Dress balances comfort with quiet polish. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['indigo'],
  true,
  false,
  false,
  4.4,
  10,
  true,
  '2025-03-16T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-043-img-0'), public.seed_uuid('prod-043'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-043-img-1'), public.seed_uuid('prod-043'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-blue-xs'),
  public.seed_uuid('prod-043'),
  'XS',
  'Blue',
  2,
  840,
  'COPR-043-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-blue-s'),
  public.seed_uuid('prod-043'),
  'S',
  'Blue',
  9,
  840,
  'COPR-043-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-blue-m'),
  public.seed_uuid('prod-043'),
  'M',
  'Blue',
  9,
  840,
  'COPR-043-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-blue-l'),
  public.seed_uuid('prod-043'),
  'L',
  'Blue',
  9,
  840,
  'COPR-043-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-blue-xl'),
  public.seed_uuid('prod-043'),
  'XL',
  'Blue',
  2,
  840,
  'COPR-043-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-navy-xs'),
  public.seed_uuid('prod-043'),
  'XS',
  'Navy',
  2,
  860,
  'COPR-043-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-navy-s'),
  public.seed_uuid('prod-043'),
  'S',
  'Navy',
  9,
  860,
  'COPR-043-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-navy-m'),
  public.seed_uuid('prod-043'),
  'M',
  'Navy',
  9,
  860,
  'COPR-043-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-navy-l'),
  public.seed_uuid('prod-043'),
  'L',
  'Navy',
  9,
  860,
  'COPR-043-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-navy-xl'),
  public.seed_uuid('prod-043'),
  'XL',
  'Navy',
  2,
  860,
  'COPR-043-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-sky-xs'),
  public.seed_uuid('prod-043'),
  'XS',
  'Sky',
  9,
  860,
  'COPR-043-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-sky-s'),
  public.seed_uuid('prod-043'),
  'S',
  'Sky',
  8,
  860,
  'COPR-043-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-sky-m'),
  public.seed_uuid('prod-043'),
  'M',
  'Sky',
  8,
  860,
  'COPR-043-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-sky-l'),
  public.seed_uuid('prod-043'),
  'L',
  'Sky',
  8,
  860,
  'COPR-043-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-indigo-baobab-dress-sky-xl'),
  public.seed_uuid('prod-043'),
  'XL',
  'Sky',
  9,
  860,
  'COPR-043-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-044'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-tops'),
  'Earth Dye Peasant Top',
  'earth-dye-peasant-top',
  'Earth Dye Peasant Top is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['peasant'],
  false,
  false,
  false,
  4.5,
  13,
  true,
  '2025-04-17T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-044-img-0'), public.seed_uuid('prod-044'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-044-img-1'), public.seed_uuid('prod-044'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-cream-xs'),
  public.seed_uuid('prod-044'),
  'XS',
  'Cream',
  4,
  410,
  'COPR-044-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-cream-s'),
  public.seed_uuid('prod-044'),
  'S',
  'Cream',
  3,
  410,
  'COPR-044-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-cream-m'),
  public.seed_uuid('prod-044'),
  'M',
  'Cream',
  3,
  410,
  'COPR-044-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-cream-l'),
  public.seed_uuid('prod-044'),
  'L',
  'Cream',
  3,
  410,
  'COPR-044-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-cream-xl'),
  public.seed_uuid('prod-044'),
  'XL',
  'Cream',
  4,
  410,
  'COPR-044-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-brown-xs'),
  public.seed_uuid('prod-044'),
  'XS',
  'Brown',
  4,
  430,
  'COPR-044-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-brown-s'),
  public.seed_uuid('prod-044'),
  'S',
  'Brown',
  3,
  430,
  'COPR-044-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-brown-m'),
  public.seed_uuid('prod-044'),
  'M',
  'Brown',
  3,
  430,
  'COPR-044-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-brown-l'),
  public.seed_uuid('prod-044'),
  'L',
  'Brown',
  3,
  430,
  'COPR-044-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-brown-xl'),
  public.seed_uuid('prod-044'),
  'XL',
  'Brown',
  4,
  430,
  'COPR-044-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-olive-xs'),
  public.seed_uuid('prod-044'),
  'XS',
  'Olive',
  4,
  430,
  'COPR-044-OLI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-olive-s'),
  public.seed_uuid('prod-044'),
  'S',
  'Olive',
  3,
  430,
  'COPR-044-OLI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-olive-m'),
  public.seed_uuid('prod-044'),
  'M',
  'Olive',
  3,
  430,
  'COPR-044-OLI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-olive-l'),
  public.seed_uuid('prod-044'),
  'L',
  'Olive',
  3,
  430,
  'COPR-044-OLI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-earth-dye-peasant-top-olive-xl'),
  public.seed_uuid('prod-044'),
  'XL',
  'Olive',
  4,
  430,
  'COPR-044-OLI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-045'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-bottoms'),
  'Soft Indigo Skirt',
  'soft-indigo-skirt',
  'Designed locally and finished with care, Soft Indigo Skirt belongs in a weekly rotation. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['skirt'],
  false,
  true,
  false,
  4.6,
  16,
  true,
  '2025-05-18T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-045-img-0'), public.seed_uuid('prod-045'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-045-img-1'), public.seed_uuid('prod-045'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-blue-xs'),
  public.seed_uuid('prod-045'),
  'XS',
  'Blue',
  4,
  550,
  'COPR-045-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-blue-s'),
  public.seed_uuid('prod-045'),
  'S',
  'Blue',
  3,
  550,
  'COPR-045-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-blue-m'),
  public.seed_uuid('prod-045'),
  'M',
  'Blue',
  3,
  550,
  'COPR-045-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-blue-l'),
  public.seed_uuid('prod-045'),
  'L',
  'Blue',
  3,
  550,
  'COPR-045-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-blue-xl'),
  public.seed_uuid('prod-045'),
  'XL',
  'Blue',
  4,
  550,
  'COPR-045-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-navy-xs'),
  public.seed_uuid('prod-045'),
  'XS',
  'Navy',
  4,
  570,
  'COPR-045-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-navy-s'),
  public.seed_uuid('prod-045'),
  'S',
  'Navy',
  3,
  570,
  'COPR-045-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-navy-m'),
  public.seed_uuid('prod-045'),
  'M',
  'Navy',
  3,
  570,
  'COPR-045-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-navy-l'),
  public.seed_uuid('prod-045'),
  'L',
  'Navy',
  3,
  570,
  'COPR-045-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-indigo-skirt-navy-xl'),
  public.seed_uuid('prod-045'),
  'XL',
  'Navy',
  4,
  570,
  'COPR-045-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-046'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-dresses'),
  'Cream Courtyard Dress',
  'cream-courtyard-dress',
  'Cream Courtyard Dress is cut for Zambia’s heat and city pace. Easy silhouette, breathable cloth, and a clean finish for day-to-evening wear across Lusaka.',
  ARRAY['courtyard'],
  false,
  true,
  true,
  4.7,
  19,
  true,
  '2025-06-19T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-046-img-0'), public.seed_uuid('prod-046'), 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-046-img-1'), public.seed_uuid('prod-046'), 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-cream-xs'),
  public.seed_uuid('prod-046'),
  'XS',
  'Cream',
  6,
  780,
  'COPR-046-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-cream-s'),
  public.seed_uuid('prod-046'),
  'S',
  'Cream',
  5,
  780,
  'COPR-046-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-cream-m'),
  public.seed_uuid('prod-046'),
  'M',
  'Cream',
  5,
  780,
  'COPR-046-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-cream-l'),
  public.seed_uuid('prod-046'),
  'L',
  'Cream',
  5,
  780,
  'COPR-046-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-cream-xl'),
  public.seed_uuid('prod-046'),
  'XL',
  'Cream',
  6,
  780,
  'COPR-046-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-white-xs'),
  public.seed_uuid('prod-046'),
  'XS',
  'White',
  6,
  800,
  'COPR-046-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-white-s'),
  public.seed_uuid('prod-046'),
  'S',
  'White',
  5,
  800,
  'COPR-046-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-white-m'),
  public.seed_uuid('prod-046'),
  'M',
  'White',
  5,
  800,
  'COPR-046-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-white-l'),
  public.seed_uuid('prod-046'),
  'L',
  'White',
  5,
  800,
  'COPR-046-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-cream-courtyard-dress-white-xl'),
  public.seed_uuid('prod-046'),
  'XL',
  'White',
  6,
  800,
  'COPR-046-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-047'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-tops'),
  'Sky Lounge Set Top',
  'sky-lounge-set-top',
  'Sky Lounge Set Top is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['lounge'],
  false,
  false,
  false,
  4.8,
  22,
  true,
  '2025-07-20T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-047-img-0'), public.seed_uuid('prod-047'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-047-img-1'), public.seed_uuid('prod-047'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-sky-xs'),
  public.seed_uuid('prod-047'),
  'XS',
  'Sky',
  5,
  360,
  'COPR-047-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-sky-s'),
  public.seed_uuid('prod-047'),
  'S',
  'Sky',
  4,
  360,
  'COPR-047-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-sky-m'),
  public.seed_uuid('prod-047'),
  'M',
  'Sky',
  4,
  360,
  'COPR-047-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-sky-l'),
  public.seed_uuid('prod-047'),
  'L',
  'Sky',
  4,
  360,
  'COPR-047-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-sky-xl'),
  public.seed_uuid('prod-047'),
  'XL',
  'Sky',
  5,
  360,
  'COPR-047-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-cream-xs'),
  public.seed_uuid('prod-047'),
  'XS',
  'Cream',
  7,
  380,
  'COPR-047-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-cream-s'),
  public.seed_uuid('prod-047'),
  'S',
  'Cream',
  6,
  380,
  'COPR-047-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-cream-m'),
  public.seed_uuid('prod-047'),
  'M',
  'Cream',
  6,
  380,
  'COPR-047-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-cream-l'),
  public.seed_uuid('prod-047'),
  'L',
  'Cream',
  6,
  380,
  'COPR-047-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-cream-xl'),
  public.seed_uuid('prod-047'),
  'XL',
  'Cream',
  7,
  380,
  'COPR-047-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-white-xs'),
  public.seed_uuid('prod-047'),
  'XS',
  'White',
  7,
  380,
  'COPR-047-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-white-s'),
  public.seed_uuid('prod-047'),
  'S',
  'White',
  6,
  380,
  'COPR-047-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-white-m'),
  public.seed_uuid('prod-047'),
  'M',
  'White',
  6,
  380,
  'COPR-047-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-white-l'),
  public.seed_uuid('prod-047'),
  'L',
  'White',
  6,
  380,
  'COPR-047-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-top-white-xl'),
  public.seed_uuid('prod-047'),
  'XL',
  'White',
  7,
  380,
  'COPR-047-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-048'),
  public.seed_uuid('brand-baobab-blue'),
  public.seed_uuid('cat-bottoms'),
  'Sky Lounge Set Pant',
  'sky-lounge-set-pant',
  'A copr favourite — Sky Lounge Set Pant balances comfort with quiet polish. Considered rise and length for all-day movement, from Cairo Road errands to dinner plans.',
  ARRAY['lounge'],
  false,
  false,
  false,
  4.9,
  25,
  true,
  '2025-08-21T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-048-img-0'), public.seed_uuid('prod-048'), 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-048-img-1'), public.seed_uuid('prod-048'), 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-sky-xs'),
  public.seed_uuid('prod-048'),
  'XS',
  'Sky',
  6,
  390,
  'COPR-048-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-sky-s'),
  public.seed_uuid('prod-048'),
  'S',
  'Sky',
  5,
  390,
  'COPR-048-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-sky-m'),
  public.seed_uuid('prod-048'),
  'M',
  'Sky',
  5,
  390,
  'COPR-048-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-sky-l'),
  public.seed_uuid('prod-048'),
  'L',
  'Sky',
  5,
  390,
  'COPR-048-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-sky-xl'),
  public.seed_uuid('prod-048'),
  'XL',
  'Sky',
  6,
  390,
  'COPR-048-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-cream-xs'),
  public.seed_uuid('prod-048'),
  'XS',
  'Cream',
  8,
  410,
  'COPR-048-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-cream-s'),
  public.seed_uuid('prod-048'),
  'S',
  'Cream',
  7,
  410,
  'COPR-048-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-cream-m'),
  public.seed_uuid('prod-048'),
  'M',
  'Cream',
  7,
  410,
  'COPR-048-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-cream-l'),
  public.seed_uuid('prod-048'),
  'L',
  'Cream',
  7,
  410,
  'COPR-048-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-cream-xl'),
  public.seed_uuid('prod-048'),
  'XL',
  'Cream',
  8,
  410,
  'COPR-048-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-white-xs'),
  public.seed_uuid('prod-048'),
  'XS',
  'White',
  8,
  410,
  'COPR-048-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-white-s'),
  public.seed_uuid('prod-048'),
  'S',
  'White',
  7,
  410,
  'COPR-048-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-white-m'),
  public.seed_uuid('prod-048'),
  'M',
  'White',
  7,
  410,
  'COPR-048-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-white-l'),
  public.seed_uuid('prod-048'),
  'L',
  'White',
  7,
  410,
  'COPR-048-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-sky-lounge-set-pant-white-xl'),
  public.seed_uuid('prod-048'),
  'XL',
  'White',
  8,
  410,
  'COPR-048-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-049'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-activewear'),
  'Eagle Run Short',
  'eagle-run-short',
  'Eagle Run Short is cut for Zambia’s heat and city pace. Moisture-aware fabric and a secure fit for training, walking, and weekend sport.',
  ARRAY['run'],
  false,
  false,
  true,
  3.8,
  28,
  true,
  '2025-09-22T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-049-img-0'), public.seed_uuid('prod-049'), 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-049-img-1'), public.seed_uuid('prod-049'), 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-black-xs'),
  public.seed_uuid('prod-049'),
  'XS',
  'Black',
  9,
  320,
  'COPR-049-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-black-s'),
  public.seed_uuid('prod-049'),
  'S',
  'Black',
  8,
  320,
  'COPR-049-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-black-m'),
  public.seed_uuid('prod-049'),
  'M',
  'Black',
  8,
  320,
  'COPR-049-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-black-l'),
  public.seed_uuid('prod-049'),
  'L',
  'Black',
  8,
  320,
  'COPR-049-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-black-xl'),
  public.seed_uuid('prod-049'),
  'XL',
  'Black',
  9,
  320,
  'COPR-049-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-navy-xs'),
  public.seed_uuid('prod-049'),
  'XS',
  'Navy',
  8,
  340,
  'COPR-049-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-navy-s'),
  public.seed_uuid('prod-049'),
  'S',
  'Navy',
  7,
  340,
  'COPR-049-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-navy-m'),
  public.seed_uuid('prod-049'),
  'M',
  'Navy',
  7,
  340,
  'COPR-049-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-navy-l'),
  public.seed_uuid('prod-049'),
  'L',
  'Navy',
  7,
  340,
  'COPR-049-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-navy-xl'),
  public.seed_uuid('prod-049'),
  'XL',
  'Navy',
  8,
  340,
  'COPR-049-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-blue-xs'),
  public.seed_uuid('prod-049'),
  'XS',
  'Blue',
  8,
  340,
  'COPR-049-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-blue-s'),
  public.seed_uuid('prod-049'),
  'S',
  'Blue',
  7,
  340,
  'COPR-049-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-blue-m'),
  public.seed_uuid('prod-049'),
  'M',
  'Blue',
  7,
  340,
  'COPR-049-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-blue-l'),
  public.seed_uuid('prod-049'),
  'L',
  'Blue',
  7,
  340,
  'COPR-049-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-eagle-run-short-blue-xl'),
  public.seed_uuid('prod-049'),
  'XL',
  'Blue',
  8,
  340,
  'COPR-049-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-050'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-activewear'),
  'Training Mesh Tee',
  'training-mesh-tee',
  'Designed locally and finished with care, Training Mesh Tee belongs in a weekly rotation. Moisture-aware fabric and a secure fit for training, walking, and weekend sport.',
  ARRAY['training'],
  true,
  false,
  true,
  3.9,
  31,
  true,
  '2025-10-23T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-050-img-0'), public.seed_uuid('prod-050'), 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-050-img-1'), public.seed_uuid('prod-050'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-black-xs'),
  public.seed_uuid('prod-050'),
  'XS',
  'Black',
  2,
  280,
  'COPR-050-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-black-s'),
  public.seed_uuid('prod-050'),
  'S',
  'Black',
  9,
  280,
  'COPR-050-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-black-m'),
  public.seed_uuid('prod-050'),
  'M',
  'Black',
  9,
  280,
  'COPR-050-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-black-l'),
  public.seed_uuid('prod-050'),
  'L',
  'Black',
  9,
  280,
  'COPR-050-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-black-xl'),
  public.seed_uuid('prod-050'),
  'XL',
  'Black',
  2,
  280,
  'COPR-050-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-white-xs'),
  public.seed_uuid('prod-050'),
  'XS',
  'White',
  2,
  300,
  'COPR-050-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-white-s'),
  public.seed_uuid('prod-050'),
  'S',
  'White',
  9,
  300,
  'COPR-050-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-white-m'),
  public.seed_uuid('prod-050'),
  'M',
  'White',
  9,
  300,
  'COPR-050-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-white-l'),
  public.seed_uuid('prod-050'),
  'L',
  'White',
  9,
  300,
  'COPR-050-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-white-xl'),
  public.seed_uuid('prod-050'),
  'XL',
  'White',
  2,
  300,
  'COPR-050-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-sky-xs'),
  public.seed_uuid('prod-050'),
  'XS',
  'Sky',
  8,
  300,
  'COPR-050-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-sky-s'),
  public.seed_uuid('prod-050'),
  'S',
  'Sky',
  7,
  300,
  'COPR-050-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-sky-m'),
  public.seed_uuid('prod-050'),
  'M',
  'Sky',
  7,
  300,
  'COPR-050-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-sky-l'),
  public.seed_uuid('prod-050'),
  'L',
  'Sky',
  7,
  300,
  'COPR-050-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-training-mesh-tee-sky-xl'),
  public.seed_uuid('prod-050'),
  'XL',
  'Sky',
  8,
  300,
  'COPR-050-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-051'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-activewear'),
  'Lusaka Flex Legging',
  'lusaka-flex-legging',
  'A copr favourite — Lusaka Flex Legging balances comfort with quiet polish. Moisture-aware fabric and a secure fit for training, walking, and weekend sport.',
  ARRAY['legging'],
  false,
  true,
  true,
  4,
  34,
  true,
  '2025-01-24T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-051-img-0'), public.seed_uuid('prod-051'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-051-img-1'), public.seed_uuid('prod-051'), 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-black-xs'),
  public.seed_uuid('prod-051'),
  'XS',
  'Black',
  3,
  450,
  'COPR-051-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-black-s'),
  public.seed_uuid('prod-051'),
  'S',
  'Black',
  2,
  450,
  'COPR-051-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-black-m'),
  public.seed_uuid('prod-051'),
  'M',
  'Black',
  2,
  450,
  'COPR-051-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-black-l'),
  public.seed_uuid('prod-051'),
  'L',
  'Black',
  2,
  450,
  'COPR-051-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-black-xl'),
  public.seed_uuid('prod-051'),
  'XL',
  'Black',
  3,
  450,
  'COPR-051-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-navy-xs'),
  public.seed_uuid('prod-051'),
  'XS',
  'Navy',
  2,
  470,
  'COPR-051-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-navy-s'),
  public.seed_uuid('prod-051'),
  'S',
  'Navy',
  9,
  470,
  'COPR-051-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-navy-m'),
  public.seed_uuid('prod-051'),
  'M',
  'Navy',
  9,
  470,
  'COPR-051-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-navy-l'),
  public.seed_uuid('prod-051'),
  'L',
  'Navy',
  9,
  470,
  'COPR-051-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-navy-xl'),
  public.seed_uuid('prod-051'),
  'XL',
  'Navy',
  2,
  470,
  'COPR-051-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-grey-xs'),
  public.seed_uuid('prod-051'),
  'XS',
  'Grey',
  2,
  470,
  'COPR-051-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-grey-s'),
  public.seed_uuid('prod-051'),
  'S',
  'Grey',
  9,
  470,
  'COPR-051-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-grey-m'),
  public.seed_uuid('prod-051'),
  'M',
  'Grey',
  9,
  470,
  'COPR-051-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-grey-l'),
  public.seed_uuid('prod-051'),
  'L',
  'Grey',
  9,
  470,
  'COPR-051-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-lusaka-flex-legging-grey-xl'),
  public.seed_uuid('prod-051'),
  'XL',
  'Grey',
  2,
  470,
  'COPR-051-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-052'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-activewear'),
  'Weekend Track Jacket',
  'weekend-track-jacket',
  'Designed locally and finished with care, Weekend Track Jacket belongs in a weekly rotation. Moisture-aware fabric and a secure fit for training, walking, and weekend sport.',
  ARRAY['track'],
  false,
  false,
  true,
  4.1,
  37,
  true,
  '2025-02-25T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-052-img-0'), public.seed_uuid('prod-052'), 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-052-img-1'), public.seed_uuid('prod-052'), 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-navy-xs'),
  public.seed_uuid('prod-052'),
  'XS',
  'Navy',
  3,
  680,
  'COPR-052-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-navy-s'),
  public.seed_uuid('prod-052'),
  'S',
  'Navy',
  2,
  680,
  'COPR-052-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-navy-m'),
  public.seed_uuid('prod-052'),
  'M',
  'Navy',
  2,
  680,
  'COPR-052-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-navy-l'),
  public.seed_uuid('prod-052'),
  'L',
  'Navy',
  2,
  680,
  'COPR-052-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-navy-xl'),
  public.seed_uuid('prod-052'),
  'XL',
  'Navy',
  3,
  680,
  'COPR-052-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-black-xs'),
  public.seed_uuid('prod-052'),
  'XS',
  'Black',
  4,
  700,
  'COPR-052-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-black-s'),
  public.seed_uuid('prod-052'),
  'S',
  'Black',
  3,
  700,
  'COPR-052-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-black-m'),
  public.seed_uuid('prod-052'),
  'M',
  'Black',
  3,
  700,
  'COPR-052-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-black-l'),
  public.seed_uuid('prod-052'),
  'L',
  'Black',
  3,
  700,
  'COPR-052-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-black-xl'),
  public.seed_uuid('prod-052'),
  'XL',
  'Black',
  4,
  700,
  'COPR-052-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-blue-xs'),
  public.seed_uuid('prod-052'),
  'XS',
  'Blue',
  3,
  700,
  'COPR-052-BLU-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-blue-s'),
  public.seed_uuid('prod-052'),
  'S',
  'Blue',
  2,
  700,
  'COPR-052-BLU-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-blue-m'),
  public.seed_uuid('prod-052'),
  'M',
  'Blue',
  2,
  700,
  'COPR-052-BLU-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-blue-l'),
  public.seed_uuid('prod-052'),
  'L',
  'Blue',
  2,
  700,
  'COPR-052-BLU-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-track-jacket-blue-xl'),
  public.seed_uuid('prod-052'),
  'XL',
  'Blue',
  3,
  700,
  'COPR-052-BLU-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-053'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-footwear'),
  'Court Trainer',
  'court-trainer',
  'A copr favourite — Court Trainer balances comfort with quiet polish. Built for pavement and packed markets — supportive sole, lasting materials.',
  ARRAY['sneaker'],
  false,
  false,
  true,
  4.2,
  40,
  true,
  '2025-03-26T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-053-img-0'), public.seed_uuid('prod-053'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-053-img-1'), public.seed_uuid('prod-053'), 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-white-s'),
  public.seed_uuid('prod-053'),
  'S',
  'White',
  4,
  890,
  'COPR-053-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-white-m'),
  public.seed_uuid('prod-053'),
  'M',
  'White',
  4,
  890,
  'COPR-053-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-white-l'),
  public.seed_uuid('prod-053'),
  'L',
  'White',
  4,
  890,
  'COPR-053-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-white-xl'),
  public.seed_uuid('prod-053'),
  'XL',
  'White',
  5,
  890,
  'COPR-053-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-black-s'),
  public.seed_uuid('prod-053'),
  'S',
  'Black',
  4,
  910,
  'COPR-053-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-black-m'),
  public.seed_uuid('prod-053'),
  'M',
  'Black',
  4,
  910,
  'COPR-053-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-black-l'),
  public.seed_uuid('prod-053'),
  'L',
  'Black',
  4,
  910,
  'COPR-053-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-black-xl'),
  public.seed_uuid('prod-053'),
  'XL',
  'Black',
  5,
  910,
  'COPR-053-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-navy-s'),
  public.seed_uuid('prod-053'),
  'S',
  'Navy',
  3,
  910,
  'COPR-053-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-navy-m'),
  public.seed_uuid('prod-053'),
  'M',
  'Navy',
  3,
  910,
  'COPR-053-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-navy-l'),
  public.seed_uuid('prod-053'),
  'L',
  'Navy',
  3,
  910,
  'COPR-053-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-court-trainer-navy-xl'),
  public.seed_uuid('prod-053'),
  'XL',
  'Navy',
  4,
  910,
  'COPR-053-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-054'),
  public.seed_uuid('brand-nkwazi-wear'),
  public.seed_uuid('cat-tops'),
  'Everyday Sport Polo',
  'everyday-sport-polo',
  'A copr favourite — Everyday Sport Polo balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['polo'],
  false,
  false,
  true,
  4.3,
  43,
  true,
  '2025-04-27T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-054-img-0'), public.seed_uuid('prod-054'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-054-img-1'), public.seed_uuid('prod-054'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-navy-xs'),
  public.seed_uuid('prod-054'),
  'XS',
  'Navy',
  5,
  340,
  'COPR-054-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-navy-s'),
  public.seed_uuid('prod-054'),
  'S',
  'Navy',
  4,
  340,
  'COPR-054-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-navy-m'),
  public.seed_uuid('prod-054'),
  'M',
  'Navy',
  4,
  340,
  'COPR-054-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-navy-l'),
  public.seed_uuid('prod-054'),
  'L',
  'Navy',
  4,
  340,
  'COPR-054-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-navy-xl'),
  public.seed_uuid('prod-054'),
  'XL',
  'Navy',
  5,
  340,
  'COPR-054-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-white-xs'),
  public.seed_uuid('prod-054'),
  'XS',
  'White',
  6,
  360,
  'COPR-054-WHI-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-white-s'),
  public.seed_uuid('prod-054'),
  'S',
  'White',
  5,
  360,
  'COPR-054-WHI-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-white-m'),
  public.seed_uuid('prod-054'),
  'M',
  'White',
  5,
  360,
  'COPR-054-WHI-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-white-l'),
  public.seed_uuid('prod-054'),
  'L',
  'White',
  5,
  360,
  'COPR-054-WHI-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-white-xl'),
  public.seed_uuid('prod-054'),
  'XL',
  'White',
  6,
  360,
  'COPR-054-WHI-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-sky-xs'),
  public.seed_uuid('prod-054'),
  'XS',
  'Sky',
  4,
  360,
  'COPR-054-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-sky-s'),
  public.seed_uuid('prod-054'),
  'S',
  'Sky',
  3,
  360,
  'COPR-054-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-sky-m'),
  public.seed_uuid('prod-054'),
  'M',
  'Sky',
  3,
  360,
  'COPR-054-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-sky-l'),
  public.seed_uuid('prod-054'),
  'L',
  'Sky',
  3,
  360,
  'COPR-054-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-everyday-sport-polo-sky-xl'),
  public.seed_uuid('prod-054'),
  'XL',
  'Sky',
  4,
  360,
  'COPR-054-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-055'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-tops'),
  'Kapiri Cable Cardigan',
  'kapiri-cable-cardigan',
  'Kapiri Cable Cardigan is cut for Zambia’s heat and city pace. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['cardigan'],
  false,
  false,
  true,
  4.4,
  6,
  true,
  '2025-05-01T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-055-img-0'), public.seed_uuid('prod-055'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-055-img-1'), public.seed_uuid('prod-055'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-cream-xs'),
  public.seed_uuid('prod-055'),
  'XS',
  'Cream',
  7,
  720,
  'COPR-055-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-cream-s'),
  public.seed_uuid('prod-055'),
  'S',
  'Cream',
  6,
  720,
  'COPR-055-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-cream-m'),
  public.seed_uuid('prod-055'),
  'M',
  'Cream',
  6,
  720,
  'COPR-055-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-cream-l'),
  public.seed_uuid('prod-055'),
  'L',
  'Cream',
  6,
  720,
  'COPR-055-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-cream-xl'),
  public.seed_uuid('prod-055'),
  'XL',
  'Cream',
  7,
  720,
  'COPR-055-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-grey-xs'),
  public.seed_uuid('prod-055'),
  'XS',
  'Grey',
  6,
  740,
  'COPR-055-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-grey-s'),
  public.seed_uuid('prod-055'),
  'S',
  'Grey',
  5,
  740,
  'COPR-055-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-grey-m'),
  public.seed_uuid('prod-055'),
  'M',
  'Grey',
  5,
  740,
  'COPR-055-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-grey-l'),
  public.seed_uuid('prod-055'),
  'L',
  'Grey',
  5,
  740,
  'COPR-055-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-grey-xl'),
  public.seed_uuid('prod-055'),
  'XL',
  'Grey',
  6,
  740,
  'COPR-055-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-navy-xs'),
  public.seed_uuid('prod-055'),
  'XS',
  'Navy',
  6,
  740,
  'COPR-055-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-navy-s'),
  public.seed_uuid('prod-055'),
  'S',
  'Navy',
  5,
  740,
  'COPR-055-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-navy-m'),
  public.seed_uuid('prod-055'),
  'M',
  'Navy',
  5,
  740,
  'COPR-055-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-navy-l'),
  public.seed_uuid('prod-055'),
  'L',
  'Navy',
  5,
  740,
  'COPR-055-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-kapiri-cable-cardigan-navy-xl'),
  public.seed_uuid('prod-055'),
  'XL',
  'Navy',
  6,
  740,
  'COPR-055-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-056'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-tops'),
  'Merino Polo Knit',
  'merino-polo-knit',
  'A copr favourite — Merino Polo Knit balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['polo', 'knit'],
  false,
  true,
  true,
  4.5,
  9,
  true,
  '2025-06-02T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-056-img-0'), public.seed_uuid('prod-056'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-056-img-1'), public.seed_uuid('prod-056'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-navy-xs'),
  public.seed_uuid('prod-056'),
  'XS',
  'Navy',
  7,
  580,
  'COPR-056-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-navy-s'),
  public.seed_uuid('prod-056'),
  'S',
  'Navy',
  6,
  580,
  'COPR-056-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-navy-m'),
  public.seed_uuid('prod-056'),
  'M',
  'Navy',
  6,
  580,
  'COPR-056-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-navy-l'),
  public.seed_uuid('prod-056'),
  'L',
  'Navy',
  6,
  580,
  'COPR-056-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-navy-xl'),
  public.seed_uuid('prod-056'),
  'XL',
  'Navy',
  7,
  580,
  'COPR-056-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-black-xs'),
  public.seed_uuid('prod-056'),
  'XS',
  'Black',
  8,
  600,
  'COPR-056-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-black-s'),
  public.seed_uuid('prod-056'),
  'S',
  'Black',
  7,
  600,
  'COPR-056-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-black-m'),
  public.seed_uuid('prod-056'),
  'M',
  'Black',
  7,
  600,
  'COPR-056-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-black-l'),
  public.seed_uuid('prod-056'),
  'L',
  'Black',
  7,
  600,
  'COPR-056-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-black-xl'),
  public.seed_uuid('prod-056'),
  'XL',
  'Black',
  8,
  600,
  'COPR-056-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-sky-xs'),
  public.seed_uuid('prod-056'),
  'XS',
  'Sky',
  6,
  600,
  'COPR-056-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-sky-s'),
  public.seed_uuid('prod-056'),
  'S',
  'Sky',
  5,
  600,
  'COPR-056-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-sky-m'),
  public.seed_uuid('prod-056'),
  'M',
  'Sky',
  5,
  600,
  'COPR-056-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-sky-l'),
  public.seed_uuid('prod-056'),
  'L',
  'Sky',
  5,
  600,
  'COPR-056-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-merino-polo-knit-sky-xl'),
  public.seed_uuid('prod-056'),
  'XL',
  'Sky',
  6,
  600,
  'COPR-056-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-057'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-tops'),
  'Ribbed Mock Neck',
  'ribbed-mock-neck',
  'A copr favourite — Ribbed Mock Neck balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['knit'],
  true,
  false,
  true,
  4.6,
  12,
  true,
  '2025-07-03T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-057-img-0'), public.seed_uuid('prod-057'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-057-img-1'), public.seed_uuid('prod-057'), 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-black-xs'),
  public.seed_uuid('prod-057'),
  'XS',
  'Black',
  9,
  490,
  'COPR-057-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-black-s'),
  public.seed_uuid('prod-057'),
  'S',
  'Black',
  8,
  490,
  'COPR-057-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-black-m'),
  public.seed_uuid('prod-057'),
  'M',
  'Black',
  8,
  490,
  'COPR-057-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-black-l'),
  public.seed_uuid('prod-057'),
  'L',
  'Black',
  8,
  490,
  'COPR-057-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-black-xl'),
  public.seed_uuid('prod-057'),
  'XL',
  'Black',
  9,
  490,
  'COPR-057-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-cream-xs'),
  public.seed_uuid('prod-057'),
  'XS',
  'Cream',
  9,
  510,
  'COPR-057-CRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-cream-s'),
  public.seed_uuid('prod-057'),
  'S',
  'Cream',
  8,
  510,
  'COPR-057-CRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-cream-m'),
  public.seed_uuid('prod-057'),
  'M',
  'Cream',
  8,
  510,
  'COPR-057-CRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-cream-l'),
  public.seed_uuid('prod-057'),
  'L',
  'Cream',
  8,
  510,
  'COPR-057-CRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-cream-xl'),
  public.seed_uuid('prod-057'),
  'XL',
  'Cream',
  9,
  510,
  'COPR-057-CRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-grey-xs'),
  public.seed_uuid('prod-057'),
  'XS',
  'Grey',
  8,
  510,
  'COPR-057-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-grey-s'),
  public.seed_uuid('prod-057'),
  'S',
  'Grey',
  7,
  510,
  'COPR-057-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-grey-m'),
  public.seed_uuid('prod-057'),
  'M',
  'Grey',
  7,
  510,
  'COPR-057-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-grey-l'),
  public.seed_uuid('prod-057'),
  'L',
  'Grey',
  7,
  510,
  'COPR-057-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-ribbed-mock-neck-grey-xl'),
  public.seed_uuid('prod-057'),
  'XL',
  'Grey',
  8,
  510,
  'COPR-057-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-058'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-outerwear'),
  'Textured Knit Coatigan',
  'textured-knit-coatigan',
  'A copr favourite — Textured Knit Coatigan balances comfort with quiet polish. A light layer for cool evenings and air-conditioned spaces, with durable hardware.',
  ARRAY['coatigan'],
  false,
  false,
  true,
  4.7,
  15,
  true,
  '2025-08-04T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-058-img-0'), public.seed_uuid('prod-058'), 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-058-img-1'), public.seed_uuid('prod-058'), 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-grey-xs'),
  public.seed_uuid('prod-058'),
  'XS',
  'Grey',
  9,
  980,
  'COPR-058-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-grey-s'),
  public.seed_uuid('prod-058'),
  'S',
  'Grey',
  8,
  980,
  'COPR-058-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-grey-m'),
  public.seed_uuid('prod-058'),
  'M',
  'Grey',
  8,
  980,
  'COPR-058-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-grey-l'),
  public.seed_uuid('prod-058'),
  'L',
  'Grey',
  8,
  980,
  'COPR-058-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-grey-xl'),
  public.seed_uuid('prod-058'),
  'XL',
  'Grey',
  9,
  980,
  'COPR-058-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-navy-xs'),
  public.seed_uuid('prod-058'),
  'XS',
  'Navy',
  9,
  1000,
  'COPR-058-NAV-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-navy-s'),
  public.seed_uuid('prod-058'),
  'S',
  'Navy',
  8,
  1000,
  'COPR-058-NAV-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-navy-m'),
  public.seed_uuid('prod-058'),
  'M',
  'Navy',
  8,
  1000,
  'COPR-058-NAV-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-navy-l'),
  public.seed_uuid('prod-058'),
  'L',
  'Navy',
  8,
  1000,
  'COPR-058-NAV-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-navy-xl'),
  public.seed_uuid('prod-058'),
  'XL',
  'Navy',
  9,
  1000,
  'COPR-058-NAV-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-brown-xs'),
  public.seed_uuid('prod-058'),
  'XS',
  'Brown',
  2,
  1000,
  'COPR-058-BRO-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-brown-s'),
  public.seed_uuid('prod-058'),
  'S',
  'Brown',
  9,
  1000,
  'COPR-058-BRO-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-brown-m'),
  public.seed_uuid('prod-058'),
  'M',
  'Brown',
  9,
  1000,
  'COPR-058-BRO-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-brown-l'),
  public.seed_uuid('prod-058'),
  'L',
  'Brown',
  9,
  1000,
  'COPR-058-BRO-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-textured-knit-coatigan-brown-xl'),
  public.seed_uuid('prod-058'),
  'XL',
  'Brown',
  2,
  1000,
  'COPR-058-BRO-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-059'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-accessories'),
  'Soft Merino Beanie',
  'soft-merino-beanie',
  'Soft Merino Beanie is cut for Zambia’s heat and city pace. A finishing piece that elevates simple outfits without shouting.',
  ARRAY['beanie'],
  false,
  false,
  true,
  4.8,
  18,
  true,
  '2025-09-05T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-059-img-0'), public.seed_uuid('prod-059'), 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-059-img-1'), public.seed_uuid('prod-059'), 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-merino-beanie-grey-one-size'),
  public.seed_uuid('prod-059'),
  'One Size',
  'Grey',
  8,
  210,
  'COPR-059-GRE-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-merino-beanie-navy-one-size'),
  public.seed_uuid('prod-059'),
  'One Size',
  'Navy',
  8,
  230,
  'COPR-059-NAV-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-soft-merino-beanie-cream-one-size'),
  public.seed_uuid('prod-059'),
  'One Size',
  'Cream',
  9,
  230,
  'COPR-059-CRE-One Size'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  public.seed_uuid('prod-060'),
  public.seed_uuid('brand-kapiri-knit'),
  public.seed_uuid('cat-tops'),
  'Weekend Knit Hoodie',
  'weekend-knit-hoodie',
  'A copr favourite — Weekend Knit Hoodie balances comfort with quiet polish. Light hand-feel with a refined collar and hem — pair with denim or tailored trousers.',
  ARRAY['hoodie'],
  false,
  false,
  true,
  4.9,
  21,
  true,
  '2025-10-06T10:00:00.000Z'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-060-img-0'), public.seed_uuid('prod-060'), 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', 0)
on conflict (id) do nothing;
insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid('prod-060-img-1'), public.seed_uuid('prod-060'), 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=80', 1)
on conflict (id) do nothing;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-grey-xs'),
  public.seed_uuid('prod-060'),
  'XS',
  'Grey',
  3,
  640,
  'COPR-060-GRE-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-grey-s'),
  public.seed_uuid('prod-060'),
  'S',
  'Grey',
  2,
  640,
  'COPR-060-GRE-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-grey-m'),
  public.seed_uuid('prod-060'),
  'M',
  'Grey',
  2,
  640,
  'COPR-060-GRE-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-grey-l'),
  public.seed_uuid('prod-060'),
  'L',
  'Grey',
  2,
  640,
  'COPR-060-GRE-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-grey-xl'),
  public.seed_uuid('prod-060'),
  'XL',
  'Grey',
  3,
  640,
  'COPR-060-GRE-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-black-xs'),
  public.seed_uuid('prod-060'),
  'XS',
  'Black',
  4,
  660,
  'COPR-060-BLA-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-black-s'),
  public.seed_uuid('prod-060'),
  'S',
  'Black',
  3,
  660,
  'COPR-060-BLA-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-black-m'),
  public.seed_uuid('prod-060'),
  'M',
  'Black',
  3,
  660,
  'COPR-060-BLA-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-black-l'),
  public.seed_uuid('prod-060'),
  'L',
  'Black',
  3,
  660,
  'COPR-060-BLA-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-black-xl'),
  public.seed_uuid('prod-060'),
  'XL',
  'Black',
  4,
  660,
  'COPR-060-BLA-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-sky-xs'),
  public.seed_uuid('prod-060'),
  'XS',
  'Sky',
  2,
  660,
  'COPR-060-SKY-XS'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-sky-s'),
  public.seed_uuid('prod-060'),
  'S',
  'Sky',
  9,
  660,
  'COPR-060-SKY-S'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-sky-m'),
  public.seed_uuid('prod-060'),
  'M',
  'Sky',
  9,
  660,
  'COPR-060-SKY-M'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-sky-l'),
  public.seed_uuid('prod-060'),
  'L',
  'Sky',
  9,
  660,
  'COPR-060-SKY-L'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;
insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid('var-weekend-knit-hoodie-sky-xl'),
  public.seed_uuid('prod-060'),
  'XL',
  'Sky',
  2,
  660,
  'COPR-060-SKY-XL'
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;

-- Storage bucket notes (create in dashboard): product-images, brand-assets
