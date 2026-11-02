"use client";

import { createClient } from "@/lib/supabase/client";
import { dbIdFromAppId } from "@/lib/catalogue/mappers";
import type { CartLine, SavedAddress } from "@/types/commerce";
import type { OrderRecord } from "@/types/commerce";

async function authedClient() {
  const sb = createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return { sb, userId: data.user.id };
}

/** Ensure a cart row exists for the signed-in user; return cart id. */
async function ensureCartId(
  sb: NonNullable<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data: existing } = await sb
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing?.id) return existing.id as string;

  const { data: created, error } = await sb
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();
  if (error) {
    console.error("ensureCart", error.message);
    return null;
  }
  return created.id as string;
}

export async function syncCartToSupabase(cart: CartLine[]) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;
  const cartId = await ensureCartId(sb, userId);
  if (!cartId) return;

  await sb.from("cart_items").delete().eq("cart_id", cartId);

  if (cart.length === 0) return;

  const rows = cart.map((line) => ({
    cart_id: cartId,
    product_id: dbIdFromAppId(line.productId),
    variant_id: dbIdFromAppId(line.variantId),
    quantity: line.quantity,
  }));

  const { error } = await sb.from("cart_items").insert(rows);
  if (error) console.error("syncCart", error.message);
}

export async function hydrateCartFromSupabase(): Promise<CartLine[] | null> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb, userId } = ctx;
  const { data: cart } = await sb
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!cart?.id) return [];

  const { data: items, error } = await sb
    .from("cart_items")
    .select("product_id, variant_id, quantity")
    .eq("cart_id", cart.id);
  if (error || !items) {
    console.error("hydrateCart", error?.message);
    return null;
  }

  // Map UUIDs back to app ids via mappers
  const { appIdFromUuid } = await import("@/lib/catalogue/mappers");
  return items.map((i) => ({
    productId: appIdFromUuid(i.product_id as string),
    variantId: appIdFromUuid(i.variant_id as string),
    quantity: i.quantity as number,
  }));
}

export async function syncWishlistToSupabase(productIds: string[]) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;

  await sb.from("wishlists").delete().eq("user_id", userId);
  if (productIds.length === 0) return;

  const rows = productIds.map((id) => ({
    user_id: userId,
    product_id: dbIdFromAppId(id),
  }));
  const { error } = await sb.from("wishlists").insert(rows);
  if (error) console.error("syncWishlist", error.message);
}

export async function hydrateWishlistFromSupabase(): Promise<string[] | null> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb, userId } = ctx;
  const { data, error } = await sb
    .from("wishlists")
    .select("product_id")
    .eq("user_id", userId);
  if (error || !data) {
    console.error("hydrateWishlist", error?.message);
    return null;
  }
  const { appIdFromUuid } = await import("@/lib/catalogue/mappers");
  return data.map((r) => appIdFromUuid(r.product_id as string));
}

export async function syncAddressToSupabase(address: SavedAddress) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;
  const { error } = await sb.from("addresses").upsert(
    {
      id: dbIdFromAppId(address.id),
      user_id: userId,
      label: address.label ?? null,
      area: address.area,
      neighbourhood: address.neighbourhood,
      landmark: address.landmark ?? null,
      phone: address.phone,
      is_default: address.isDefault,
      is_pickup_point: address.isPickupPoint,
    },
    { onConflict: "id" },
  );
  if (error) console.error("syncAddress", error.message);
}

export async function fetchProfileRole(
  userId: string,
): Promise<"shopper" | "seller" | "admin" | null> {
  const sb = createClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("role, full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.role as "shopper" | "seller" | "admin";
}

export async function persistOrderToSupabase(order: OrderRecord) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;

  const orderUuid = dbIdFromAppId(order.id);
  const { error: orderErr } = await sb.from("orders").insert({
    id: orderUuid,
    user_id: userId,
    status: order.status,
    delivery_method: order.deliveryMethod,
    delivery_area: order.deliveryArea,
    delivery_neighbourhood: order.deliveryNeighbourhood,
    delivery_landmark: order.deliveryLandmark ?? null,
    delivery_phone: order.deliveryPhone,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    currency: "ZMW",
    notes: order.notes ?? null,
    paid_at: order.paidAt ?? null,
  });
  if (orderErr) {
    console.error("persistOrder", orderErr.message);
    return;
  }

  for (const sub of order.subOrders) {
    const subId = dbIdFromAppId(sub.id);
    const { error: subErr } = await sb.from("sub_orders").insert({
      id: subId,
      order_id: orderUuid,
      brand_id: dbIdFromAppId(sub.brandId),
      status: sub.status,
      subtotal: sub.subtotal,
      commission_percent: sub.commissionPercent,
      commission_amount: sub.commissionAmount,
      seller_amount: sub.sellerAmount,
      tracking_note: sub.trackingNote ?? null,
      shipped_at: sub.shippedAt ?? null,
      delivered_at: sub.deliveredAt ?? null,
      completed_at: sub.completedAt ?? null,
    });
    if (subErr) {
      console.error("persistSubOrder", subErr.message);
      continue;
    }

    const itemRows = sub.items.map((item) => ({
      order_id: orderUuid,
      sub_order_id: subId,
      product_id: dbIdFromAppId(item.productId),
      variant_id: dbIdFromAppId(item.variantId),
      brand_id: dbIdFromAppId(item.brandId),
      product_name: item.productName,
      variant_size: item.size,
      variant_colour: item.colour,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.lineTotal,
    }));
    const { error: itemErr } = await sb.from("order_items").insert(itemRows);
    if (itemErr) console.error("persistOrderItems", itemErr.message);
  }

  if (order.payment) {
    const { error: payErr } = await sb.from("payments").insert({
      id: dbIdFromAppId(order.payment.id),
      order_id: orderUuid,
      provider: order.payment.provider,
      provider_ref: order.payment.providerRef,
      amount: order.payment.amount,
      currency: "ZMW",
      status: order.payment.status,
      held_at: order.payment.heldAt ?? null,
      released_at: order.payment.releasedAt ?? null,
    });
    if (payErr) console.error("persistPayment", payErr.message);
  }

  // Clear remote cart after successful order
  await syncCartToSupabase([]);
}
