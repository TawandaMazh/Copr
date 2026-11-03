-- Persist product thumbnails on order line items for tracking UIs after hydrate.

alter table public.order_items
  add column if not exists product_image text;
