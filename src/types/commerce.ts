import type { OrderStatus, PaymentStatus } from "@/types";

export type DeliveryMethod = "delivery" | "pickup";
export type UserRole = "shopper" | "seller" | "admin";

export interface ShopperProfile {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  /** true when signed in via local demo mode (no Supabase) */
  isDemo: boolean;
}

export interface SavedAddress {
  id: string;
  label?: string;
  area: string;
  neighbourhood: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
  isPickupPoint: boolean;
}

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderLineSnapshot {
  productId: string;
  variantId: string;
  brandId: string;
  productName: string;
  productImage: string;
  brandName: string;
  size: string;
  colour: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface SubOrderRecord {
  id: string;
  brandId: string;
  brandName: string;
  status: OrderStatus;
  subtotal: number;
  commissionPercent: number;
  commissionAmount: number;
  sellerAmount: number;
  trackingNote?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  items: OrderLineSnapshot[];
}

export interface PaymentRecord {
  id: string;
  provider: string;
  providerRef: string;
  amount: number;
  status: PaymentStatus;
  heldAt?: string;
  releasedAt?: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  deliveryArea: string;
  deliveryNeighbourhood: string;
  deliveryLandmark?: string;
  deliveryPhone: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  subOrders: SubOrderRecord[];
  payment?: PaymentRecord;
}

export interface PayoutRecord {
  id: string;
  brandId: string;
  subOrderId: string;
  amount: number;
  commissionAmount: number;
  status: "pending" | "processing" | "paid" | "failed";
  createdAt: string;
  paidAt?: string;
}
