-- Expand catalogue beyond fashion for peer-to-peer / anything marketplace.

insert into public.categories (id, name, slug, description, image_url)
values
  (public.seed_uuid('cat-electronics'), 'Electronics', 'electronics', 'Phones, headphones, cameras, and gadgets.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'),
  (public.seed_uuid('cat-home'), 'Home', 'home', 'Furniture, decor, kitchenware, and living essentials.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'),
  (public.seed_uuid('cat-beauty'), 'Beauty', 'beauty', 'Skincare, haircare, fragrance, and grooming.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'),
  (public.seed_uuid('cat-kids'), 'Kids', 'kids', 'Clothes, toys, and gear for little ones.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'),
  (public.seed_uuid('cat-sports'), 'Sports', 'sports', 'Kits, balls, bikes, and outdoor gear.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=800&q=80'),
  (public.seed_uuid('cat-books'), 'Books', 'books', 'Novels, textbooks, comics, and study guides.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'),
  (public.seed_uuid('cat-other'), 'Other', 'other', 'Anything else you want to list and sell.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url;

-- Individual marketplace sellers
insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status, is_verified)
values
  (
    public.seed_uuid('seller-thandiwe'),
    'Thandiwe M.',
    'thandiwe-m',
    'Closet clears & handmade finds.',
    'Lusaka-based seller listing clothes, beauty, and handmade pieces from my cupboard and weekend markets.',
    'Lusaka',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    true,
    2024,
    'approved',
    false
  ),
  (
    public.seed_uuid('seller-chanda'),
    'Chanda K.',
    'chanda-k',
    'Tech, toys & textbooks.',
    'Student seller clearing gadgets, kids’ gear, and course books between semesters.',
    'Lusaka',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400&q=80',
    true,
    2025,
    'approved',
    false
  ),
  (
    public.seed_uuid('seller-mwansa'),
    'Mwansa Home',
    'mwansa-home',
    'Furniture & flat essentials.',
    'Downsizing a Woodlands flat — chairs, kitchenware, and vintage bits ready for a new home.',
    'Lusaka',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80',
    true,
    2023,
    'approved',
    false
  ),
  (
    public.seed_uuid('seller-kabwe'),
    'Kabwe Sports',
    'kabwe-sports',
    'Boots, kits & weekend gear.',
    'Sunday-league player selling spare boots, speakers, and outdoor kit after a clear-out.',
    'Kabwe',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=1400&q=80',
    false,
    2024,
    'approved',
    false
  )
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved',
  is_verified = excluded.is_verified;
