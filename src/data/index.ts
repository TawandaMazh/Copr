export * from "./brands";
export * from "./categories";
export * from "./products";

import { brands } from "./brands";
import { categories } from "./categories";
import { products, getMinPrice } from "./products";
import type { CategorySlug, Product, ProductColour, ProductSize } from "@/types";

export interface ProductFilters {
  q?: string;
  category?: CategorySlug | CategorySlug[];
  brand?: string | string[];
  size?: ProductSize | ProductSize[];
  colour?: ProductColour | ProductColour[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
}

function toArray<T>(value?: T | T[]): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
  const categoriesFilter = toArray(filters.category);
  const brandsFilter = toArray(filters.brand);
  const sizesFilter = toArray(filters.size);
  const coloursFilter = toArray(filters.colour);
  const query = filters.q?.trim().toLowerCase();

  let result = products.filter((product) => {
    if (categoriesFilter.length && !categoriesFilter.includes(product.categorySlug)) {
      return false;
    }
    if (brandsFilter.length) {
      const brand = brands.find((b) => b.id === product.brandId);
      const match =
        brandsFilter.includes(product.brandId) ||
        (brand && brandsFilter.includes(brand.slug));
      if (!match) return false;
    }
    if (sizesFilter.length && !product.variants.some((v) => sizesFilter.includes(v.size))) {
      return false;
    }
    if (
      coloursFilter.length &&
      !product.variants.some((v) => coloursFilter.includes(v.colour))
    ) {
      return false;
    }
    const price = getMinPrice(product);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (query) {
      const brand = brands.find((b) => b.id === product.brandId);
      const haystack = [
        product.name,
        product.description,
        product.tags.join(" "),
        brand?.name ?? "",
        product.categorySlug,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
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
    case "newest":
    default:
      result = [...result].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
      break;
  }

  return result;
}

export function getCategoriesWithCounts() {
  return categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categorySlug === category.slug).length,
  }));
}
