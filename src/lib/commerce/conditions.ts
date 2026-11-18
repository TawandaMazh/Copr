import type { Product, ProductCondition } from "@/types";

export const PRODUCT_CONDITIONS = [
  "new",
  "like_new",
  "good",
  "fair",
] as const satisfies readonly ProductCondition[];

const LABELS: Record<ProductCondition, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

export function conditionLabel(condition: ProductCondition): string {
  return LABELS[condition];
}

export function productCondition(product: Product): ProductCondition {
  if (product.condition) return product.condition;
  const tagged = product.tags.find((t) => t.startsWith("condition:"));
  if (tagged) {
    const value = tagged.slice("condition:".length) as ProductCondition;
    if (PRODUCT_CONDITIONS.includes(value)) return value;
  }
  return "new";
}

/** Keep a single condition:* tag in sync with the product field. */
export function withConditionTag(
  tags: string[],
  condition: ProductCondition,
): string[] {
  const cleaned = tags.filter((t) => !t.startsWith("condition:"));
  return [...cleaned, `condition:${condition}`];
}
