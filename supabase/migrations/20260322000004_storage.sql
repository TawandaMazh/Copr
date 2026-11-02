-- Storage buckets + RLS for marketplace media
-- Buckets can also be created via Storage API; policies usually need the Dashboard SQL Editor
-- (pooler postgres cannot own storage.objects).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'product-images',
    'product-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'brand-assets',
    'brand-assets',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_auth_insert" on storage.objects;
drop policy if exists "product_images_auth_update" on storage.objects;
drop policy if exists "product_images_auth_delete" on storage.objects;
drop policy if exists "brand_assets_public_read" on storage.objects;
drop policy if exists "brand_assets_auth_insert" on storage.objects;
drop policy if exists "brand_assets_auth_update" on storage.objects;
drop policy if exists "brand_assets_auth_delete" on storage.objects;

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "product_images_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

create policy "brand_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'brand-assets');

create policy "brand_assets_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets');

create policy "brand_assets_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'brand-assets')
  with check (bucket_id = 'brand-assets');

create policy "brand_assets_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brand-assets');
