import type { Brand, CategorySlug, Product, ProductVariant } from "@/types";
import type { PayoutRecord } from "@/types/commerce";

export type BrandApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export interface SellerBrand extends Brand {
  status: BrandApplicationStatus;
  ownerId: string;
  contactEmail?: string;
  contactPhone?: string;
  updatedAt: string;
}

export interface SellerProductInput {
  name: string;
  description: string;
  categorySlug: CategorySlug;
  images: string[];
  tags: string[];
  variants: Array<{
    size: ProductVariant["size"];
    colour: ProductVariant["colour"];
    stock: number;
    price: number;
  }>;
  isPublished?: boolean;
  featured?: boolean;
}

export type { Product, PayoutRecord };

export interface SellerEarningsSummary {
  available: number;
  pending: number;
  paidOut: number;
  lifetimeGross: number;
  lifetimeCommission: number;
  orderCount: number;
}
