"use client";

import { createClient } from "@/lib/supabase/client";
import { appIdFromUuid, dbIdFromAppId } from "@/lib/catalogue/mappers";
import type {
  OrderRecord,
  PaymentRecord,
  PayoutRecord,
  SubOrderRecord,
} from "@/types/commerce";
import type { OrderStatus } from "@/types";

async function authedClient() {
  const sb = createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return { sb, userId: data.user.id };
}

type DbOrderItem = {
  id: string;
  product_id: string;
  variant_id: string;
  brand_id: string;
  product_name: string;
  product_image: string | null;
  variant_size: string;
  variant_colour: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  sub_order_id: string;
};

type DbSubOrder = {
  id: string;
  brand_id: string;
  status: string;
  subtotal: number;
  commission_percent: number;
  commission_amount: number;
  seller_amount: number;
  tracking_note: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  brands?: { name: string } | { name: string }[] | null;
  order_items?: DbOrderItem[] | null;
};

type DbPayment = {
  id: string;
  provider: string;
  provider_ref: string | null;
  amount: number;
  status: string;
  held_at: string | null;
  released_at: string | null;
};

type DbOrder = {
  id: string;
  user_id: string;
  status: string;
  delivery_method: "delivery" | "pickup";
  delivery_area: string;
  delivery_neighbourhood: string;
  delivery_landmark: string | null;
  delivery_phone: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  sub_orders?: DbSubOrder[] | null;
  payments?: DbPayment[] | DbPayment | null;
};

function brandName(row: DbSubOrder) {
  const b = Array.isArray(row.brands) ? row.brands[0] : row.brands;
  return b?.name ?? "Brand";
}

function mapSubOrder(row: DbSubOrder): SubOrderRecord {
  const items = (row.order_items ?? []).map((item) => ({
    productId: appIdFromUuid(item.product_id),
    variantId: appIdFromUuid(item.variant_id),
    brandId: appIdFromUuid(item.brand_id),
    productName: item.product_name,
    productImage: item.product_image ?? "",
    brandName: brandName(row),
    size: item.variant_size as SubOrderRecord["items"][number]["size"],
    colour: item.variant_colour as SubOrderRecord["items"][number]["colour"],
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    lineTotal: Number(item.line_total),
  }));

  return {
    id: appIdFromUuid(row.id),
    brandId: appIdFromUuid(row.brand_id),
    brandName: brandName(row),
    status: row.status as OrderStatus,
    subtotal: Number(row.subtotal),
    commissionPercent: Number(row.commission_percent),
    commissionAmount: Number(row.commission_amount),
    sellerAmount: Number(row.seller_amount),
    trackingNote: row.tracking_note ?? undefined,
    shippedAt: row.shipped_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    items,
  };
}

function mapPayment(row: DbPayment): PaymentRecord {
  return {
    id: appIdFromUuid(row.id),
    provider: row.provider,
    providerRef: row.provider_ref ?? "",
    amount: Number(row.amount),
    status: row.status as PaymentRecord["status"],
    heldAt: row.held_at ?? undefined,
    releasedAt: row.released_at ?? undefined,
  };
}

function mapOrder(row: DbOrder): OrderRecord {
  const payments = row.payments;
  const paymentRow = Array.isArray(payments) ? payments[0] : payments;
  return {
    id: appIdFromUuid(row.id),
    userId: row.user_id,
    status: row.status as OrderRecord["status"],
    deliveryMethod: row.delivery_method,
    deliveryArea: row.delivery_area,
    deliveryNeighbourhood: row.delivery_neighbourhood,
    deliveryLandmark: row.delivery_landmark ?? undefined,
    deliveryPhone: row.delivery_phone,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    notes: row.notes ?? undefined,
    paidAt: row.paid_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subOrders: (row.sub_orders ?? []).map(mapSubOrder),
    payment: paymentRow ? mapPayment(paymentRow) : undefined,
  };
}

const ORDER_SELECT = `
  id, user_id, status, delivery_method, delivery_area, delivery_neighbourhood,
  delivery_landmark, delivery_phone, subtotal, delivery_fee, total, notes,
  paid_at, created_at, updated_at,
  payments ( id, provider, provider_ref, amount, status, held_at, released_at ),
  sub_orders (
    id, brand_id, status, subtotal, commission_percent, commission_amount,
    seller_amount, tracking_note, shipped_at, delivered_at, completed_at,
    brands ( name ),
    order_items (
      id, product_id, variant_id, brand_id, product_name, product_image,
      variant_size, variant_colour, unit_price, quantity, line_total, sub_order_id
    )
  )
`;

export async function hydrateOrdersFromSupabase(): Promise<OrderRecord[] | null> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb } = ctx;
  const { data, error } = await sb
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("hydrateOrders", error.message);
    return null;
  }
  return ((data ?? []) as unknown as DbOrder[]).map(mapOrder);
}

export async function hydratePayoutsFromSupabase(): Promise<PayoutRecord[] | null> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb } = ctx;
  const { data, error } = await sb
    .from("payouts")
    .select(
      "id, brand_id, sub_order_id, amount, commission_amount, status, created_at, paid_at",
    )
    .order("created_at", { ascending: false });
  if (error) {
    console.error("hydratePayouts", error.message);
    return null;
  }
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: appIdFromUuid(row.id as string),
    brandId: appIdFromUuid(row.brand_id as string),
    subOrderId: appIdFromUuid(row.sub_order_id as string),
    amount: Number(row.amount),
    commissionAmount: Number(row.commission_amount),
    status: row.status as PayoutRecord["status"],
    createdAt: row.created_at as string,
    paidAt: (row.paid_at as string | null) ?? undefined,
  }));
}

export async function markShippedInSupabase(
  subOrderAppId: string,
  note?: string,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb.rpc("mark_sub_order_shipped", {
    p_sub_order_id: dbIdFromAppId(subOrderAppId),
    p_tracking_note: note ?? null,
  });
  if (error) console.error("markShipped", error.message);
}

export async function updateSubOrderStatusInSupabase(
  subOrderAppId: string,
  status: OrderStatus,
  note?: string,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const now = new Date().toISOString();
  const patch: Record<string, string> = {
    status,
    updated_at: now,
  };
  if (note !== undefined) patch.tracking_note = note;
  if (status === "shipped") patch.shipped_at = now;
  if (status === "delivered" || status === "completed") {
    patch.delivered_at = now;
  }
  if (status === "completed") patch.completed_at = now;

  const { error } = await sb
    .from("sub_orders")
    .update(patch)
    .eq("id", dbIdFromAppId(subOrderAppId));
  if (error) console.error("updateSubOrderStatus", error.message);
}

export async function confirmDeliveryInSupabase(subOrderAppId: string) {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb } = ctx;
  const { data, error } = await sb.rpc("confirm_sub_order_delivery", {
    p_sub_order_id: dbIdFromAppId(subOrderAppId),
  });
  if (error) {
    console.error("confirmDelivery", error.message);
    return null;
  }
  return data as { payout_id?: string; order_completed?: boolean } | null;
}

export async function markPayoutStatusInSupabase(
  payoutAppId: string,
  status: PayoutRecord["status"],
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("payouts")
    .update({
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", dbIdFromAppId(payoutAppId));
  if (error) console.error("markPayoutStatus", error.message);
}
