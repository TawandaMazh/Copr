/** Generate supabase/migrations/20260322000003_seed.sql from Phase 1 TS seed data. */
import fs from "fs";

function readExportArray(path, exportName) {
  const src = fs.readFileSync(path, "utf8");
  const marker = `export const ${exportName}`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName} in ${path}`);
  const eq = src.indexOf("=", start);
  const from = src.indexOf("[", eq);
  // Find matching ] before satisfies / ;
  let i = from;
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const jsonish = src.slice(from, i);
  // Use Function to evaluate TS-like array of objects (quoted keys from JSON.stringify)
  return Function(`"use strict"; return (${jsonish});`)();
}

// products.ts uses JSON.stringify so it's valid JS
const brandsSrc = fs.readFileSync("src/data/brands.ts", "utf8");
const brandsMatch = brandsSrc.match(/export const brands: Brand\[\] = (\[[\s\S]*?\]);/);
if (!brandsMatch) throw new Error("brands parse failed");
const brands = Function(`"use strict"; return (${brandsMatch[1]});`)();

const catsSrc = fs.readFileSync("src/data/categories.ts", "utf8");
const catsMatch = catsSrc.match(/export const categories: Category\[\] = (\[[\s\S]*?\]);/);
if (!catsMatch) throw new Error("categories parse failed");
const categories = Function(`"use strict"; return (${catsMatch[1]});`)();

const products = readExportArray("src/data/products.ts", "products");

function sqlStr(value) {
  if (value == null) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArr(arr) {
  if (!arr?.length) return "'{}'";
  return `ARRAY[${arr.map(sqlStr).join(", ")}]`;
}

const lines = [];
lines.push("-- Seed catalogue from Phase 1 (10 brands, 60 products)");
lines.push("-- Safe to re-run: uses fixed UUIDs derived from slug hashes via uuid_generate... we use explicit ids from seed string ids mapped to UUIDs.");
lines.push("");
lines.push("-- Deterministic UUID helper from text");
lines.push(`create or replace function public.seed_uuid(seed text)
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
$$;`);
lines.push("");

lines.push("-- Categories");
for (const c of categories) {
  lines.push(`insert into public.categories (id, name, slug, description, image_url)
values (public.seed_uuid(${sqlStr(c.id)}), ${sqlStr(c.name)}, ${sqlStr(c.slug)}, ${sqlStr(c.description)}, ${sqlStr(c.image)})
on conflict (slug) do update set name = excluded.name, description = excluded.description, image_url = excluded.image_url;`);
}
lines.push("");

lines.push("-- Brands (approved for marketplace)");
for (const b of brands) {
  lines.push(`insert into public.brands (id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status)
values (
  public.seed_uuid(${sqlStr(b.id)}),
  ${sqlStr(b.name)},
  ${sqlStr(b.slug)},
  ${sqlStr(b.tagline)},
  ${sqlStr(b.story)},
  ${sqlStr(b.location)},
  ${sqlStr(b.logo)},
  ${sqlStr(b.banner)},
  ${b.featured},
  ${b.foundedYear},
  'approved'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  logo_url = excluded.logo_url,
  banner_url = excluded.banner_url,
  featured = excluded.featured,
  status = 'approved';`);
}
lines.push("");

lines.push("-- Products + images + variants");
for (const p of products) {
  const productUuid = `public.seed_uuid(${sqlStr(p.id)})`;
  const brandUuid = `public.seed_uuid(${sqlStr(p.brandId)})`;
  const categoryUuid = `public.seed_uuid(${sqlStr("cat-" + p.categorySlug)})`;
  lines.push(`insert into public.products (
  id, brand_id, category_id, name, slug, description, tags, featured, trending, is_new, rating, review_count, is_published, created_at
) values (
  ${productUuid},
  ${brandUuid},
  ${categoryUuid},
  ${sqlStr(p.name)},
  ${sqlStr(p.slug)},
  ${sqlStr(p.description)},
  ${sqlArr(p.tags)},
  ${p.featured},
  ${p.trending},
  ${p.isNew},
  ${p.rating},
  ${p.reviewCount},
  true,
  ${sqlStr(p.createdAt)}
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  featured = excluded.featured,
  trending = excluded.trending,
  is_new = excluded.is_new;`);

  p.images.forEach((url, idx) => {
    lines.push(`insert into public.product_images (id, product_id, url, sort_order)
values (public.seed_uuid(${sqlStr(p.id + "-img-" + idx)}), ${productUuid}, ${sqlStr(url)}, ${idx})
on conflict (id) do nothing;`);
  });

  for (const v of p.variants) {
    lines.push(`insert into public.product_variants (id, product_id, size, colour, stock, price, sku)
values (
  public.seed_uuid(${sqlStr(v.id)}),
  ${productUuid},
  ${sqlStr(v.size)},
  ${sqlStr(v.colour)},
  ${v.stock},
  ${v.price},
  ${sqlStr(v.sku)}
)
on conflict (sku) do update set stock = excluded.stock, price = excluded.price;`);
  }
  lines.push("");
}

lines.push("-- Storage bucket notes (create in dashboard): product-images, brand-assets");
fs.writeFileSync(
  "supabase/migrations/20260322000003_seed.sql",
  lines.join("\n") + "\n",
);
console.log(`Wrote seed SQL for ${brands.length} brands, ${categories.length} categories, ${products.length} products`);
