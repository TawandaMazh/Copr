import {
  brands as seedBrands,
  getBrandBySlug as getSeedBrandBySlug,
  getCategoriesWithCounts as getSeedCategoriesWithCounts,
  getNewProducts as getSeedNewProducts,
  getProductBySlug as getSeedProductBySlug,
  getProductsByBrand as getSeedProductsByBrand,
  filterProducts as filterSeedProducts,
  type ProductFilters,
} from "@/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Brand, Category, Product } from "@/types";
import {
  fetchAllBrands,
  fetchAllProducts,
  fetchBrandBySlug,
  fetchCategoriesWithCounts,
  fetchProductBySlug,
  fetchProductsByBrandId,
  filterProductList,
} from "./supabase-catalogue";

async function withFallback<T>(
  load: () => Promise<T | null>,
  fallback: () => T,
): Promise<T> {
  if (!isSupabaseConfigured()) return fallback();
  try {
    const data = await load();
    if (data == null) return fallback();
    return data;
  } catch (err) {
    console.error("catalogue supabase fallback", err);
    return fallback();
  }
}

export async function listBrands(): Promise<Brand[]> {
  return withFallback(fetchAllBrands, () => seedBrands);
}

export async function listFeaturedBrands(): Promise<Brand[]> {
  const brands = await listBrands();
  const featured = brands.filter((b) => b.featured);
  return featured.length ? featured : brands.slice(0, 6);
}

export async function getBrandBySlugService(
  slug: string,
): Promise<Brand | undefined> {
  if (!isSupabaseConfigured()) return getSeedBrandBySlug(slug);
  const row = await fetchBrandBySlug(slug);
  if (row === null) return getSeedBrandBySlug(slug);
  return row;
}

export async function listProducts(): Promise<Product[]> {
  return withFallback(fetchAllProducts, () => filterSeedProducts({}));
}

export async function listNewProducts(limit = 8): Promise<Product[]> {
  const { isProductNew } = await import("@/lib/product-display");
  if (!isSupabaseConfigured()) {
    return getSeedNewProducts()
      .filter((p) => isProductNew(p))
      .slice(0, limit);
  }
  const products = await fetchAllProducts();
  if (!products) {
    return getSeedNewProducts()
      .filter((p) => isProductNew(p))
      .slice(0, limit);
  }
  return products
    .filter((p) => isProductNew(p))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export async function getProductBySlugService(
  slug: string,
): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return getSeedProductBySlug(slug);
  const row = await fetchProductBySlug(slug);
  if (row === null) return getSeedProductBySlug(slug);
  return row;
}

export async function listProductsByBrand(
  brandId: string,
): Promise<Product[]> {
  if (!isSupabaseConfigured()) return getSeedProductsByBrand(brandId);
  const rows = await fetchProductsByBrandId(brandId);
  if (!rows) return getSeedProductsByBrand(brandId);
  return rows;
}

export async function listCategoriesWithCounts(): Promise<
  Array<Category & { productCount: number }>
> {
  return withFallback(fetchCategoriesWithCounts, getSeedCategoriesWithCounts);
}

export async function filterCatalogue(
  filters: ProductFilters = {},
): Promise<Product[]> {
  if (!isSupabaseConfigured()) return filterSeedProducts(filters);
  const [products, brands] = await Promise.all([
    fetchAllProducts(),
    fetchAllBrands(),
  ]);
  if (!products || !brands) return filterSeedProducts(filters);
  return filterProductList(products, brands, filters);
}

export async function listProductSlugs(): Promise<string[]> {
  const products = await listProducts();
  return products.map((p) => p.slug);
}

export async function listBrandSlugs(): Promise<string[]> {
  const brands = await listBrands();
  return brands.map((b) => b.slug);
}
