import {
  brands as seedBrands,
  getBrandById as getSeedBrandById,
  getBrandBySlug as getSeedBrandBySlug,
  products as seedProducts,
  getProductById as getSeedProductById,
  getProductBySlug as getSeedProductBySlug,
  getProductsByBrand as getSeedProductsByBrand,
  getMinPrice,
  filterProducts,
  type ProductFilters,
} from "@/data";
import type { Brand, Product } from "@/types";
import type { SellerBrand } from "@/types/seller";

/** Merge seed catalogue with seller-owned brands/products (client overlays). */
export function mergeBrands(
  sellerBrand: SellerBrand | null,
  brandOverrides: SellerBrand[] = [],
): Brand[] {
  const byId = new Map<string, Brand>(seedBrands.map((b) => [b.id, b]));
  for (const override of brandOverrides) {
    byId.set(override.id, override);
  }
  if (sellerBrand) {
    byId.set(sellerBrand.id, sellerBrand);
  }
  return [...byId.values()];
}

export function mergeProducts(
  sellerProducts: Product[],
  opts?: { includeUnpublished?: boolean },
): Product[] {
  const byId = new Map<string, Product>(seedProducts.map((p) => [p.id, p]));
  for (const product of sellerProducts) {
    const published =
      opts?.includeUnpublished ||
      (product as Product & { isPublished?: boolean }).isPublished !== false;
    // Seller products may carry isPublished via cast from store
    const flag = (product as Product & { isPublished?: boolean }).isPublished;
    if (flag === false && !opts?.includeUnpublished) {
      byId.delete(product.id);
      continue;
    }
    if (published || opts?.includeUnpublished) {
      byId.set(product.id, product);
    }
  }
  return [...byId.values()];
}

export function resolveProduct(
  productId: string,
  sellerProducts: Product[],
): Product | undefined {
  return (
    sellerProducts.find((p) => p.id === productId) ??
    getSeedProductById(productId)
  );
}

export function resolveProductBySlug(
  slug: string,
  sellerProducts: Product[],
): Product | undefined {
  return (
    sellerProducts.find((p) => p.slug === slug) ?? getSeedProductBySlug(slug)
  );
}

export function resolveBrand(
  brandId: string,
  sellerBrand: SellerBrand | null,
): Brand | undefined {
  if (sellerBrand?.id === brandId) return sellerBrand;
  return getSeedBrandById(brandId);
}

export function resolveBrandBySlug(
  slug: string,
  sellerBrand: SellerBrand | null,
): Brand | undefined {
  if (sellerBrand?.slug === slug) return sellerBrand;
  return getSeedBrandBySlug(slug);
}

export function productsForBrand(
  brandId: string,
  sellerProducts: Product[],
  opts?: { includeUnpublished?: boolean },
): Product[] {
  const seed = getSeedProductsByBrand(brandId);
  const custom = sellerProducts.filter((p) => p.brandId === brandId);
  const byId = new Map<string, Product>(seed.map((p) => [p.id, p]));
  for (const p of custom) {
    const unpublished =
      (p as Product & { isPublished?: boolean }).isPublished === false;
    if (unpublished && !opts?.includeUnpublished) {
      byId.delete(p.id);
      continue;
    }
    byId.set(p.id, p);
  }
  return [...byId.values()];
}

export function filterMergedProducts(
  sellerProducts: Product[],
  filters: ProductFilters = {},
): Product[] {
  const merged = mergeProducts(sellerProducts);
  // Reuse seed filter by temporarily swapping — simplest: filter in memory
  const {
    q,
    category,
    brand,
    size,
    colour,
    minPrice,
    maxPrice,
    sort = "newest",
  } = filters;

  const categories = category
    ? Array.isArray(category)
      ? category
      : [category]
    : [];
  const brands = brand ? (Array.isArray(brand) ? brand : [brand]) : [];
  const sizes = size ? (Array.isArray(size) ? size : [size]) : [];
  const colours = colour ? (Array.isArray(colour) ? colour : [colour]) : [];
  const query = q?.trim().toLowerCase();

  let result = merged.filter((product) => {
    if (categories.length && !categories.includes(product.categorySlug))
      return false;
    if (brands.length) {
      const b = resolveBrand(product.brandId, null);
      const match =
        brands.includes(product.brandId) ||
        (b && brands.includes(b.slug));
      if (!match) return false;
    }
    if (sizes.length && !product.variants.some((v) => sizes.includes(v.size)))
      return false;
    if (
      colours.length &&
      !product.variants.some((v) => colours.includes(v.colour))
    )
      return false;
    const price = getMinPrice(product);
    if (minPrice !== undefined && price < minPrice) return false;
    if (maxPrice !== undefined && price > maxPrice) return false;
    if (query) {
      const b = resolveBrand(product.brandId, null);
      const hay = [
        product.name,
        product.description,
        product.tags.join(" "),
        b?.name ?? "",
        product.categorySlug,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  switch (sort) {
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

export { filterProducts, seedProducts, seedBrands, getMinPrice };
