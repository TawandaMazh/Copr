"use client";

import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OrdersList() {
  const orders = useCommerceStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <GlassCard className="space-y-4 p-8 text-center">
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm text-muted-foreground">
          When you check out, tracking and escrow status will show here.
        </p>
        <Button asChild>
          <Link href="/shop">Start shopping</Link>
        </Button>
      </GlassCard>
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
                  Order {order.id.slice(0, 14)}…
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
                <Badge variant="secondary" className="capitalize">
                  {order.status.replaceAll("_", " ")}
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
