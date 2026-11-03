import type { OrderStatus } from "@/types";

export interface MarketplaceSettings {
  commissionPercent: number;
  deliveryFeeKwacha: number;
  deliveryCity: string;
  autoConfirmDays: number;
  updatedAt: string;
}

export type ReviewStatus = "published" | "hidden" | "flagged";

export interface ReviewRecord {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
}

export type DisputeStatus = "open" | "under_review" | "resolved_buyer" | "resolved_seller" | "closed";

export interface DisputeRecord {
  id: string;
  orderId: string;
  subOrderId: string;
  brandId: string;
  brandName: string;
  reason: string;
  notes?: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  openedBy: string;
}

export interface AdminAnalytics {
  gmv: number;
  orderCount: number;
  subOrderCount: number;
  commissionEarned: number;
  pendingPayouts: number;
  paidPayouts: number;
  openDisputes: number;
  pendingBrands: number;
  liveProducts: number;
  averageOrderValue: number;
  statusBreakdown: Partial<Record<OrderStatus, number>>;
}
