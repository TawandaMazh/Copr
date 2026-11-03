import type { Brand, Product, ProductColour } from "@/types";

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

/** True when the piece was created within the last 14 days. */
export function isProductNew(product: Product): boolean {
  const created = Date.parse(product.createdAt);
  if (Number.isFinite(created)) {
    return Date.now() - created < NEW_WINDOW_MS;
  }
  return Boolean(product.isNew);
}

export function productImageAlt(
  product: Product,
  brandName?: string | null,
  colour?: ProductColour | string | null,
): string {
  const parts = [product.name];
  if (colour) parts.push(`in ${colour}`);
  if (brandName) parts.push(`by ${brandName}`);
  return parts.join(" ");
}

export function brandIsVerified(brand: Brand | undefined | null): boolean {
  if (!brand) return false;
  return (brand as Brand & { isVerified?: boolean }).isVerified !== false;
}
