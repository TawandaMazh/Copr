export type CategorySlug =
  | "dresses"
  | "tops"
  | "bottoms"
  | "outerwear"
  | "traditional"
  | "footwear"
  | "accessories"
  | "activewear";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  story: string;
  location: string;
  logo: string;
  banner: string;
  featured: boolean;
  foundedYear: number;
  /** Verified seller badge — default true for seed brands. */
  isVerified?: boolean;
}

export type ProductColour =
  | "Black"
  | "White"
  | "Navy"
  | "Blue"
  | "Sky"
  | "Cream"
  | "Brown"
  | "Olive"
  | "Red"
  | "Gold"
  | "Grey"
  | "Pink"
  | "Chitenge Print";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "One Size";

export interface ProductVariant {
  id: string;
  size: ProductSize;
  colour: ProductColour;
  stock: number;
  price: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  brandId: string;
  categorySlug: CategorySlug;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export type PaymentStatus = "pending" | "held" | "released" | "refunded" | "failed";
