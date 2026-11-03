import type {
  Brand,
  Category,
  CategorySlug,
  Product,
  ProductColour,
  ProductSize,
  ProductVariant,
} from "@/types";
import { seedUuid } from "@/lib/supabase/seed-uuid";
import { brands as seedBrands } from "@/data/brands";
import { categories as seedCategories } from "@/data/categories";
import { products as seedProducts } from "@/data/products";

/** UUID → seed string id for known catalogue rows. */
const uuidToSeedId = new Map<string, string>();

function remember(seedId: string) {
  uuidToSeedId.set(seedUuid(seedId), seedId);
}

for (const b of seedBrands) remember(b.id);
for (const c of seedCategories) remember(c.id);
for (const p of seedProducts) {
  remember(p.id);
  p.variants.forEach((v) => remember(v.id));
  p.images.forEach((_, i) => remember(`${p.id}-img-${i}`));
}

export function appIdFromUuid(uuid: string): string {
  return uuidToSeedId.get(uuid) ?? uuid;
}

export function dbIdFromAppId(appId: string): string {
  // Already a UUID?
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      appId,
    )
  ) {
    return appId;
  }
  return seedUuid(appId);
}

export type DbBrand = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  story: string | null;
  location: string | null;
  logo_url: string | null;
  banner_url: string | null;
  featured: boolean;
  founded_year: number | null;
  status: string;
  is_verified?: boolean | null;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type DbProduct = {
  id: string;
  brand_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  tags: string[] | null;
  featured: boolean;
  trending: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  is_published: boolean;
  created_at: string;
  product_images?: Array<{ url: string; sort_order: number }>;
  product_variants?: Array<{
    id: string;
    size: string;
    colour: string;
    stock: number;
    price: number | string;
    sku: string;
  }>;
  categories?: { slug: string } | Array<{ slug: string }> | null;
};

export function mapBrand(row: DbBrand): Brand {
  return {
    id: appIdFromUuid(row.id),
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? "",
    story: row.story ?? "",
    location: row.location ?? "",
    logo: row.logo_url ?? "",
    banner: row.banner_url ?? "",
    featured: row.featured,
    foundedYear: row.founded_year ?? 2020,
    isVerified: row.is_verified !== false,
  };
}

export function mapCategory(
  row: DbCategory,
  productCount = 0,
): Category & { productCount: number } {
  return {
    id: appIdFromUuid(row.id),
    name: row.name,
    slug: row.slug as CategorySlug,
    description: row.description ?? "",
    image: row.image_url ?? "",
    productCount,
  };
}

export function mapProduct(row: DbProduct): Product {
  const cat = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;
  const categorySlug = (cat?.slug ?? "dresses") as CategorySlug;
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  const variants: ProductVariant[] = (row.product_variants ?? []).map((v) => ({
    id: appIdFromUuid(v.id),
    size: v.size as ProductSize,
    colour: v.colour as ProductColour,
    stock: v.stock,
    price: Number(v.price),
    sku: v.sku,
  }));

  return {
    id: appIdFromUuid(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    brandId: appIdFromUuid(row.brand_id),
    categorySlug,
    images,
    variants,
    tags: row.tags ?? [],
    featured: row.featured,
    trending: row.trending,
    isNew: row.is_new,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    createdAt: row.created_at,
  };
}
