"use client";

import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_COMMISSION_PERCENT } from "@/lib/commerce/constants";

export default function SellerEarningsPage() {
  const brand = useCommerceStore((s) => s.sellerBrand);
  const getSellerEarnings = useCommerceStore((s) => s.getSellerEarnings);
  const getSellerOrders = useCommerceStore((s) => s.getSellerOrders);
  const payouts = useCommerceStore((s) =>
    s.payouts.filter((p) => p.brandId === s.sellerBrand?.id),
  );

  if (!brand) return null;

  const earnings = getSellerEarnings();
  const completed = getSellerOrders().filter(
    (r) => r.subOrder.status === "completed",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">
          Commission default {DEFAULT_COMMISSION_PERCENT}% · payouts after
          delivery confirmation
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Available" amount={earnings.available} />
        <Metric label="In escrow" amount={earnings.pending} />
        <Metric label="Paid out" amount={earnings.paidOut} />
        <Metric label="Lifetime gross" amount={earnings.lifetimeGross} />
      </div>

      <GlassCard className="space-y-2 p-5">
        <p className="text-sm text-muted-foreground">
          Lifetime commission retained by copr:{" "}
          <PriceTag
            amount={earnings.lifetimeCommission}
            size="sm"
            className="inline"
          />{" "}
          across {earnings.orderCount} sub-order
          {earnings.orderCount === 1 ? "" : "s"}.
        </p>
      </GlassCard>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Payout records</h2>
        {payouts.length === 0 ? (
          <GlassCard className="p-6 text-sm text-muted-foreground">
            Payout rows appear when a shopper confirms delivery (or auto-confirm
            after 3 days in production). Admin payout runs land in Phase 4.
          </GlassCard>
        ) : (
          <ul className="space-y-2">
            {payouts.map((p) => (
              <li key={p.id}>
                <GlassCard className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="text-sm font-medium">{p.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Sub-order {p.subOrderId.slice(0, 12)}… ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("en-ZM")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {p.status}
                    </Badge>
                    <PriceTag amount={p.amount} size="sm" />
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Completed sales
        </h2>
        {completed.length === 0 ? (
          <GlassCard className="p-6 text-sm text-muted-foreground">
            Completed, released orders will list here.
          </GlassCard>
        ) : (
          <ul className="space-y-2">
            {completed.map(({ order, subOrder }) => (
              <li key={subOrder.id}>
                <GlassCard className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="text-sm font-medium">{order.id.slice(0, 14)}…</p>
                    <p className="text-xs text-muted-foreground">
                      Gross{" "}
                      <PriceTag
                        amount={subOrder.subtotal}
                        size="sm"
                        className="inline"
                      />{" "}
                      · commission{" "}
                      <PriceTag
                        amount={subOrder.commissionAmount}
                        size="sm"
                        className="inline"
                      />
                    </p>
                  </div>
                  <PriceTag amount={subOrder.sellerAmount} />
                </GlassCard>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, amount }: { label: string; amount: number }) {
  return (
    <GlassCard className="space-y-1 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <PriceTag amount={amount} size="lg" />
    </GlassCard>
  );
}
