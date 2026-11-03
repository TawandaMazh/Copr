"use client";

import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { orderStatusLabel } from "@/lib/commerce/status-labels";

export default function AdminOrdersPage() {
  const user = useCommerceStore((s) => s.user);
  const orders = useCommerceStore((s) => s.orders);
  const updateSubOrderStatus = useCommerceStore((s) => s.updateSubOrderStatus);
  const openDispute = useCommerceStore((s) => s.openDispute);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Every checkout splits into per-brand shipments. Help sellers ship, or
          open a dispute if a shopper reports a problem.
        </p>
      </div>

      {orders.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No orders yet. Once shoppers check out, brand shipments appear here.
        </GlassCard>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <GlassCard key={order.id} className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">
                    {order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-ZM", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    · {order.deliveryMethod} · {order.deliveryArea}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {orderStatusLabel(order.status)}
                  </Badge>
                  <PriceTag amount={order.total} size="sm" />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>Open</Link>
                  </Button>
                </div>
              </div>

              <ul className="space-y-3 border-t border-border-subtle pt-3">
                {order.subOrders.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {sub.brandName} · {sub.items.length} item
                        {sub.items.length === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Commission{" "}
                        <PriceTag
                          amount={sub.commissionAmount}
                          size="sm"
                          className="inline"
                        />{" "}
                        · Seller{" "}
                        <PriceTag
                          amount={sub.sellerAmount}
                          size="sm"
                          className="inline"
                        />
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {orderStatusLabel(sub.status)}
                      </Badge>
                      {(sub.status === "paid" ||
                        sub.status === "processing") && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateSubOrderStatus(
                              order.id,
                              sub.id,
                              "shipped",
                              "Admin marked shipped",
                            )
                          }
                        >
                          Mark shipped
                        </Button>
                      )}
                      {sub.status !== "disputed" &&
                        sub.status !== "refunded" &&
                        sub.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              openDispute({
                                orderId: order.id,
                                subOrderId: sub.id,
                                reason: "Admin-opened dispute (demo)",
                                notes: "Opened from admin orders queue",
                              })
                            }
                          >
                            Open dispute
                          </Button>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </ul>
      )}
    </div>
  );
}
