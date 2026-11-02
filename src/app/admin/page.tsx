"use client";

import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const user = useCommerceStore((s) => s.user);
  const getAdminAnalytics = useCommerceStore((s) => s.getAdminAnalytics);
  const settings = useCommerceStore((s) => s.settings);

  if (!user || user.role !== "admin") return null;

  const a = getAdminAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Marketplace pulse · commission {settings.commissionPercent}% ·{" "}
            {settings.deliveryCity}
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/admin/settings">Edit settings</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="GMV (ex delivery)" value={<PriceTag amount={a.gmv} size="sm" />} />
        <Metric label="Orders" value={String(a.orderCount)} />
        <Metric
          label="Commission earned"
          value={<PriceTag amount={a.commissionEarned} size="sm" />}
        />
        <Metric
          label="Avg order value"
          value={<PriceTag amount={a.averageOrderValue} size="sm" />}
        />
        <Metric
          label="Pending payouts"
          value={<PriceTag amount={a.pendingPayouts} size="sm" />}
        />
        <Metric
          label="Paid out"
          value={<PriceTag amount={a.paidPayouts} size="sm" />}
        />
        <Metric label="Pending brands" value={String(a.pendingBrands)} />
        <Metric label="Open disputes" value={String(a.openDisputes)} />
      </div>

      <GlassCard className="space-y-3 p-5">
        <h2 className="font-semibold tracking-tight">Order status mix</h2>
        {Object.keys(a.statusBreakdown).length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {Object.entries(a.statusBreakdown).map(([status, count]) => (
              <li
                key={status}
                className="flex justify-between rounded-2xl bg-white/40 px-3 py-2 text-sm dark:bg-navy/30"
              >
                <span className="capitalize text-muted-foreground">
                  {status.replaceAll("_", " ")}
                </span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href="/admin/brands">Review brands</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin/payouts">Process payouts</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin/disputes">Disputes</Link>
        </Button>
      </div>
    </div>
  );
}

function Metric({
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
