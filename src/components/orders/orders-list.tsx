"use client";

import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { orderStatusLabel } from "@/lib/commerce/status-labels";

export function OrdersList() {
  const orders = useCommerceStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="After checkout, you’ll track each brand’s shipment here and confirm delivery when parcels arrive."
        actionHref="/shop"
        actionLabel="Start shopping"
      />
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link href={`/orders/${order.id}`} className="block focus-ring rounded-3xl">
            <GlassCard hover className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-semibold tracking-tight">
                  {order.subOrders.map((s) => s.brandName).slice(0, 2).join(" · ")}
                  {order.subOrders.length > 2
                    ? ` +${order.subOrders.length - 2}`
                    : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("en-ZM", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  · {order.subOrders.length} brand
                  {order.subOrders.length === 1 ? "" : "s"} ·{" "}
                  {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {orderStatusLabel(order.status)}
                </Badge>
                <PriceTag amount={order.total} />
              </div>
            </GlassCard>
          </Link>
        </li>
      ))}
    </ul>
  );
}
