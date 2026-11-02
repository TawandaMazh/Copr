"use client";

import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";

export default function SellerOverviewPage() {
  const brand = useCommerceStore((s) => s.sellerBrand);
  const products = useCommerceStore((s) => s.sellerProducts);
  const getSellerOrders = useCommerceStore((s) => s.getSellerOrders);
  const getSellerEarnings = useCommerceStore((s) => s.getSellerEarnings);

  if (!brand) return null;

  const orders = getSellerOrders();
  const earnings = getSellerEarnings();
  const published = products.filter((p) => p.isPublished).length;
  const openOrders = orders.filter(
    (o) =>
      !["completed", "cancelled", "refunded"].includes(o.subOrder.status),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{brand.name}</h1>
          <p className="text-muted-foreground">{brand.tagline}</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">Add product</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Published products" value={String(published)} />
        <Stat label="Open orders" value={String(openOrders.length)} />
        <Stat
          label="Pending escrow"
          value={<PriceTag amount={earnings.pending} size="sm" />}
        />
        <Stat
          label="Available to payout"
          value={<PriceTag amount={earnings.available} size="sm" />}
        />
      </div>

      <GlassCard className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">Recent orders</h2>
          <Link href="/seller/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No orders for your brand yet. Share your public page to get sales.
          </p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {orders.slice(0, 5).map(({ order, subOrder }) => (
              <li
                key={subOrder.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.id.slice(0, 14)}… · {subOrder.items.length} item
                    {subOrder.items.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-ZM", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {subOrder.status.replaceAll("_", " ")}
                  </Badge>
                  <PriceTag amount={subOrder.sellerAmount} size="sm" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <GlassCard className="space-y-1 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="text-xl font-semibold tracking-tight">{value}</div>
    </GlassCard>
  );
}
