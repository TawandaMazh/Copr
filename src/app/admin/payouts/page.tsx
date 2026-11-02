"use client";

import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";

export default function AdminPayoutsPage() {
  const user = useCommerceStore((s) => s.user);
  const payouts = useCommerceStore((s) => s.payouts);
  const brands = useCommerceStore((s) => s.platformBrands);
  const markPayoutStatus = useCommerceStore((s) => s.markPayoutStatus);

  if (!user || user.role !== "admin") return null;

  const brandName = (id: string) =>
    brands.find((b) => b.id === id)?.name ?? id;

  const pending = payouts.filter(
    (p) => p.status === "pending" || p.status === "processing",
  );
  const done = payouts.filter(
    (p) => p.status === "paid" || p.status === "failed",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Payouts</h1>
        <p className="text-muted-foreground">
          Escrow releases create payout rows. Mark them processing → paid.
        </p>
      </div>

      {payouts.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No payouts yet. Confirm delivery on an order to release escrow and
          create a payout.
        </GlassCard>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Queue ({pending.length})
              </h2>
              <ul className="space-y-3">
                {pending.map((p) => (
                  <GlassCard
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="font-semibold tracking-tight">
                        {brandName(p.brandId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.id} · sub {p.subOrderId.slice(0, 12)}…
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Seller{" "}
                        <PriceTag amount={p.amount} size="sm" className="inline" />{" "}
                        · Commission{" "}
                        <PriceTag
                          amount={p.commissionAmount}
                          size="sm"
                          className="inline"
                        />
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {p.status}
                      </Badge>
                      {p.status === "pending" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            markPayoutStatus(p.id, "processing")
                          }
                        >
                          Mark processing
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => markPayoutStatus(p.id, "paid")}
                      >
                        Mark paid
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markPayoutStatus(p.id, "failed")}
                      >
                        Fail
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </ul>
            </section>
          )}

          {done.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">History</h2>
              <ul className="space-y-3">
                {done.map((p) => (
                  <GlassCard
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="font-medium">{brandName(p.brandId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleString("en-ZM", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : new Date(p.createdAt).toLocaleString("en-ZM", {
                              dateStyle: "medium",
                            })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={p.status === "paid" ? "default" : "outline"}
                        className="capitalize"
                      >
                        {p.status}
                      </Badge>
                      <PriceTag amount={p.amount} size="sm" />
                    </div>
                  </GlassCard>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
