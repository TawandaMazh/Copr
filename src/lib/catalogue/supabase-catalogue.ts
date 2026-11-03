import { createPublicClient } from "@/lib/supabase/public";
import type { Brand, Category, Product } from "@/types";
import type { ProductFilters } from "@/data";
import {
  mapBrand,
  mapCategory,
  mapProduct,
  type DbBrand,
  type DbCategory,
  type DbProduct,
} from "./mappers";
import { getMinPrice } from "@/data/products";

const PRODUCT_SELECT = `
  id, brand_id, category_id, name, slug, description, tags,
  featured, trending, is_new, rating, review_count, is_published, created_at,
  product_images ( url, sort_order ),
  product_variants ( id, size, colour, stock, price, sku ),
  categories ( slug )
`;

export async function fetchAllBrands(): Promise<Brand[] | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("brands")
    .select(
      "id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status, is_verified",
    )
    .eq("status", "approved")
    .order("name");
  if (error || !data) {
    console.error("supabase brands", error?.message);
    return null;
  }
  return (data as DbBrand[]).map(mapBrand);
}

export async function fetchBrandBySlug(
  slug: string,
): Promise<Brand | null | undefined> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("brands")
    .select(
      "id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status, is_verified",
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (error) {
    console.error("supabase brand", error.message);
    return null;
  }
  return data ? mapBrand(data as DbBrand) : undefined;
}

export async function fetchAllProducts(): Promise<Product[] | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.error("supabase products", error?.message);
    return null;
  }
  return (data as unknown as DbProduct[]).map(mapProduct);
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null | undefined> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.error("supabase product", error.message);
    return null;
  }
  return data ? mapProduct(data as unknown as DbProduct) : undefined;
}

export async function fetchProductsByBrandId(
  brandAppId: string,
): Promise<Product[] | null> {
  const all = await fetchAllProducts();
  if (!all) return null;
  return all.filter((p) => p.brandId === brandAppId);
}

export async function fetchCategoriesWithCounts(): Promise<
  Array<Category & { productCount: number }> | null
> {
  const sb = createPublicClient();
  if (!sb) return null;
  const [{ data: cats, error: cErr }, products] = await Promise.all([
    sb
      .from("categories")
      .select("id, name, slug, description, image_url")
      .order("name"),
    fetchAllProducts(),
  ]);
  if (cErr || !cats || !products) {
    console.error("supabase categories", cErr?.message);
    return null;
  }
  return (cats as DbCategory[]).map((c) =>
    mapCategory(
      c,
      products.filter((p) => p.categorySlug === c.slug).length,
    ),
  );
}

export function filterProductList(
  products: Product[],
  brands: Brand[],
  filters: ProductFilters = {},
): Product[] {
  const toArray = <T,>(v?: T | T[]): T[] =>
    !v ? [] : Array.isArray(v) ? v : [v];
  const categoriesFilter = toArray(filters.category);
  const brandsFilter = toArray(filters.brand);
  const sizesFilter = toArray(filters.size);
  const coloursFilter = toArray(filters.colour);
  const query = filters.q?.trim().toLowerCase();

  let result = products.filter((product) => {
    if (
      categoriesFilter.length &&
      !categoriesFilter.includes(product.categorySlug)
    )
      return false;
    if (brandsFilter.length) {
      const brand = brands.find((b) => b.id === product.brandId);
      const match =
        brandsFilter.includes(product.brandId) ||
        (brand && brandsFilter.includes(brand.slug));
      if (!match) return false;
    }
    if (
      sizesFilter.length &&
      !product.variants.some((v) => sizesFilter.includes(v.size))
    )
      return false;
    if (
      coloursFilter.length &&
      !product.variants.some((v) => coloursFilter.includes(v.colour))
    )
      return false;
    const price = getMinPrice(product);
    if (filters.minPrice !== undefined && price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice)
      return false;
    if (query) {
      const brand = brands.find((b) => b.id === product.brandId);
      const hay = [
        product.name,
        product.description,
        product.tags.join(" "),
        brand?.name ?? "",
        product.categorySlug,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => getMinPrice(a) - getMinPrice(b));
      break;
    case "price-desc":
      result = [...result].sort((a, b) => getMinPrice(b) - getMinPrice(a));
      break;
    case "popular":
      result = [...result].sort(
        (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount,
      );
      break;
    default:
      result = [...result].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
  }
  return result;
}
