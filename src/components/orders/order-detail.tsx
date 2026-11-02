"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AUTO_CONFIRM_DAYS } from "@/lib/commerce/constants";

export function OrderDetail({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "1";
  const order = useCommerceStore((s) => s.orders.find((o) => o.id === orderId));
  const confirmDelivery = useCommerceStore((s) => s.confirmDelivery);
  const markShipped = useCommerceStore((s) => s.markShipped);

  if (!order) {
    return (
      <GlassCard className="space-y-4 p-8 text-center">
        <p className="text-lg font-medium">Order not found</p>
        <p className="text-sm text-muted-foreground">
          This order may be from another device or session.
        </p>
        <Button asChild>
          <Link href="/orders">Back to orders</Link>
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {justPlaced && (
        <GlassCard className="border-primary/20 bg-primary/5 p-5">
          <p className="font-semibold text-primary dark:text-sky">
            Order placed — payment HELD in mock escrow
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Brands will fulfil separately. Confirm delivery (or wait{" "}
            {AUTO_CONFIRM_DAYS} days) to RELEASE funds minus commission.
          </p>
        </GlassCard>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Order tracking</h1>
          <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {order.status.replaceAll("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="space-y-2 p-5 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Delivery
          </p>
          <p className="font-medium capitalize">{order.deliveryMethod}</p>
          <p className="text-sm text-muted-foreground">
            {order.deliveryArea} · {order.deliveryNeighbourhood}
            {order.deliveryLandmark ? ` · ${order.deliveryLandmark}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{order.deliveryPhone}</p>
        </GlassCard>

        <GlassCard className="space-y-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment
          </p>
          <p className="font-medium capitalize">
            {order.payment?.status ?? "pending"} · {order.payment?.provider}
          </p>
          <PriceTag amount={order.total} />
          <p className="truncate text-xs text-muted-foreground">
            Ref {order.payment?.providerRef}
          </p>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Brand shipments
        </h2>
        {order.subOrders.map((sub) => (
          <GlassCard key={sub.id} className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{sub.brandName}</p>
                <p className="text-sm text-muted-foreground">
                  Seller receives{" "}
                  <PriceTag amount={sub.sellerAmount} size="sm" className="inline" />{" "}
                  after release (commission {sub.commissionPercent}%)
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {sub.status.replaceAll("_", " ")}
              </Badge>
            </div>

            <ul className="space-y-3">
              {sub.items.map((item) => (
                <li key={`${item.variantId}-${item.productId}`} className="flex gap-3">
                  <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-ice dark:bg-navy/40">
                    {item.productImage && (
                      <Image
                        src={item.productImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.colour} · {item.size} · ×{item.quantity}
                    </p>
                    <PriceTag amount={item.lineTotal} size="sm" />
                  </div>
                </li>
              ))}
            </ul>

            {sub.trackingNote && (
              <p className="text-sm text-muted-foreground">
                Note: {sub.trackingNote}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {(sub.status === "paid" || sub.status === "processing") && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    markShipped(order.id, sub.id, "Handed to Lusaka rider")
                  }
                >
                  Mark shipped (demo)
                </Button>
              )}
              {(sub.status === "shipped" || sub.status === "delivered") && (
                <Button
                  size="sm"
                  onClick={() => confirmDelivery(order.id, sub.id)}
                >
                  Confirm delivery · release escrow
                </Button>
              )}
              {sub.status === "completed" && (
                <p className="text-sm text-primary dark:text-sky">
                  Escrow released to {sub.brandName}
                </p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
