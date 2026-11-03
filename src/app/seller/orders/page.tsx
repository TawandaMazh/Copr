"use client";

import Image from "next/image";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import type { OrderStatus } from "@/types";
import { orderStatusLabel } from "@/lib/commerce/status-labels";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: "processing",
  processing: "shipped",
  shipped: "delivered",
};

export default function SellerOrdersPage() {
  const brand = useCommerceStore((s) => s.sellerBrand);
  const getSellerOrders = useCommerceStore((s) => s.getSellerOrders);
  const updateSubOrderStatus = useCommerceStore((s) => s.updateSubOrderStatus);
  const markShipped = useCommerceStore((s) => s.markShipped);

  if (!brand) return null;
  const rows = getSellerOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Pack and ship your items. You’re paid after the shopper confirms
          delivery (or auto-confirm after a few days).
        </p>
      </div>

      {rows.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No orders for {brand.name} yet. New sales will show up here to pack.
        </GlassCard>
      ) : (
        <ul className="space-y-4">
          {rows.map(({ order, subOrder }) => {
            const next = NEXT[subOrder.status];
            return (
              <li key={subOrder.id}>
                <GlassCard className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold tracking-tight">
                        <Link
                          href={`/orders/${order.id}`}
                          className="hover:text-primary"
                        >
                          {order.deliveryNeighbourhood || order.deliveryArea}{" "}
                          order
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString("en-ZM", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}{" "}
                        ·{" "}
                        {order.deliveryMethod === "pickup"
                          ? "Pickup"
                          : "Delivery"}{" "}
                        · {order.deliveryArea}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {orderStatusLabel(subOrder.status)}
                    </Badge>
                  </div>

                  <ul className="space-y-2">
                    {subOrder.items.map((item) => (
                      <li
                        key={`${item.variantId}-${item.productId}`}
                        className="flex gap-3"
                      >
                        <div className="relative h-14 w-12 overflow-hidden rounded-xl bg-ice dark:bg-navy/40">
                          {item.productImage && (
                            <Image
                              src={item.productImage}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.colour} · {item.size} · ×{item.quantity}
                          </p>
                        </div>
                        <PriceTag amount={item.lineTotal} size="sm" />
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
                    <p className="text-sm text-muted-foreground">
                      You earn{" "}
                      <PriceTag
                        amount={subOrder.sellerAmount}
                        size="sm"
                        className="inline"
                      />{" "}
                      after delivery is confirmed (copr keeps{" "}
                      {subOrder.commissionPercent}%)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subOrder.status === "paid" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateSubOrderStatus(
                              order.id,
                              subOrder.id,
                              "processing",
                            )
                          }
                        >
                          Start processing
                        </Button>
                      )}
                      {(subOrder.status === "paid" ||
                        subOrder.status === "processing") && (
                        <Button
                          size="sm"
                          onClick={() =>
                            markShipped(
                              order.id,
                              subOrder.id,
                              "Handed to Lusaka rider",
                            )
                          }
                        >
                          Mark shipped
                        </Button>
                      )}
                      {subOrder.status === "shipped" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateSubOrderStatus(
                              order.id,
                              subOrder.id,
                              "delivered",
                              "Left with neighbour / pickup confirmed",
                            )
                          }
                        >
                          Mark delivered
                        </Button>
                      )}
                      {next &&
                        !["paid", "processing", "shipped"].includes(
                          subOrder.status,
                        ) && null}
                      {subOrder.status === "completed" && (
                        <span className="text-sm text-primary dark:text-sky">
                          Escrow released
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
