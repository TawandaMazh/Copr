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
import {
  expectedDeliveryWindow,
  resolveDeliveryEta,
} from "@/lib/commerce/delivery-eta";
import {
  orderStatusHint,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/commerce/status-labels";
import { Slogan } from "@/components/brand/slogan";

export function OrderDetail({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "1";
  const order = useCommerceStore((s) => s.orders.find((o) => o.id === orderId));
  const confirmDelivery = useCommerceStore((s) => s.confirmDelivery);
  const markShipped = useCommerceStore((s) => s.markShipped);
  const openDispute = useCommerceStore((s) => s.openDispute);
  const user = useCommerceStore((s) => s.user);

  const canManageFulfilment =
    user?.role === "seller" || user?.role === "admin";

  if (!order) {
    return (
      <GlassCard className="space-y-4 p-8 text-center">
        <p className="text-lg font-medium">Order not found</p>
        <p className="text-sm text-muted-foreground">
          Sign in with the same account you used at checkout, or check your
          email for the order link.
        </p>
        <Button asChild>
          <Link href="/orders">Back to orders</Link>
        </Button>
      </GlassCard>
    );
  }

  const hint = orderStatusHint(order.status);
  const eta =
    order.expectedDeliveryLabel && order.expectedDeliveryEtaDays
      ? {
          label: order.expectedDeliveryLabel,
          etaDays: order.expectedDeliveryEtaDays,
        }
      : resolveDeliveryEta(order.deliveryMethod, order.deliveryArea);
  const deliveryWindow = expectedDeliveryWindow(
    eta.etaDays,
    order.createdAt,
  );

  return (
    <div className="space-y-6">
      {justPlaced && (
        <GlassCard className="space-y-4 border-primary/20 bg-primary/5 p-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-sky">
              Order confirmation
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Thanks{order.contactName ? `, ${order.contactName.split(" ")[0]}` : ""}
              — we’ve got your order
            </h2>
            <Slogan id="happyWithCopd" variant="quote" className="mt-2" />
            <p className="text-sm text-muted-foreground">
              Payment secured
              {order.contactEmail
                ? ` · confirmation emailed to ${order.contactEmail}`
                : ""}
              . We’ll update you as each brand packs and ships.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-background/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Expected{" "}
                {order.deliveryMethod === "pickup" ? "pickup" : "delivery"}
              </p>
              <p className="mt-1 font-medium">{deliveryWindow}</p>
              <p className="text-xs text-muted-foreground">{eta.label}</p>
            </div>
            <div className="rounded-2xl bg-background/70 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order total
              </p>
              <p className="mt-1">
                <PriceTag amount={order.total} />
              </p>
              <p className="text-xs text-muted-foreground">
                Ref {order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            When a parcel arrives, confirm delivery (or we’ll auto-confirm after{" "}
            {AUTO_CONFIRM_DAYS} days) so that brand gets paid.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/shop">Continue shopping</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/orders">View all orders</Link>
            </Button>
          </div>
        </GlassCard>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {justPlaced ? "Order details" : "Your order"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-ZM", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          {hint && (
            <p className="max-w-xl text-sm text-muted-foreground">{hint}</p>
          )}
        </div>
        <Badge variant="secondary">{orderStatusLabel(order.status)}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="space-y-2 p-5 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Delivery
          </p>
          <p className="font-medium capitalize">
            {order.deliveryMethod === "pickup" ? "Pickup" : "Home delivery"}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.deliveryArea} · {order.deliveryNeighbourhood}
            {order.deliveryLandmark ? ` · ${order.deliveryLandmark}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{order.deliveryPhone}</p>
          <p className="pt-1 text-sm font-medium text-primary dark:text-sky">
            {deliveryWindow}
          </p>
          <p className="text-xs text-muted-foreground">{eta.label}</p>
        </GlassCard>

        <GlassCard className="space-y-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment
          </p>
          <p className="font-medium">
            {paymentStatusLabel(order.payment?.status ?? "pending")}
          </p>
          <PriceTag amount={order.total} />
          <p className="text-xs text-muted-foreground">
            Payment is held safely until you confirm each brand delivery.
          </p>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Brand shipments
        </h2>
        <p className="text-sm text-muted-foreground">
          Multi-brand baskets split into separate parcels — track each one
          below.
        </p>
        {order.subOrders.map((sub) => (
          <GlassCard key={sub.id} className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{sub.brandName}</p>
                <p className="text-sm text-muted-foreground">
                  Subtotal{" "}
                  <PriceTag
                    amount={sub.subtotal}
                    size="sm"
                    className="inline"
                  />
                </p>
              </div>
              <Badge variant="outline">{orderStatusLabel(sub.status)}</Badge>
            </div>

            <ul className="space-y-3">
              {sub.items.map((item) => (
                <li
                  key={`${item.variantId}-${item.productId}`}
                  className="flex gap-3"
                >
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
                    <p className="truncate text-sm font-medium">
                      {item.productName}
                    </p>
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
                Courier note: {sub.trackingNote}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {canManageFulfilment &&
                (sub.status === "paid" || sub.status === "processing") && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      markShipped(order.id, sub.id, "Handed to Lusaka rider")
                    }
                  >
                    Mark as shipped
                  </Button>
                )}
              {(sub.status === "shipped" || sub.status === "delivered") && (
                <Button
                  size="sm"
                  onClick={() => confirmDelivery(order.id, sub.id)}
                >
                  Confirm delivery
                </Button>
              )}
              {sub.status === "completed" && (
                <p className="text-sm text-primary dark:text-sky">
                  Delivery confirmed — {sub.brandName} will be paid.
                </p>
              )}
              {user &&
                user.role === "shopper" &&
                sub.status !== "disputed" &&
                sub.status !== "refunded" &&
                sub.status !== "cancelled" &&
                sub.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      openDispute({
                        orderId: order.id,
                        subOrderId: sub.id,
                        reason: "Issue with this brand shipment",
                        notes: "Opened from order tracking",
                      })
                    }
                  >
                    Report a problem
                  </Button>
                )}
              {sub.status === "disputed" && (
                <p className="text-sm text-muted-foreground">
                  We’ve flagged this shipment for review. Our team will follow
                  up.
                </p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
