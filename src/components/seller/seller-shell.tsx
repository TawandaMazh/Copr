"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommerceStore } from "@/stores/commerce-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const nav = [
  { href: "/seller", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/earnings", label: "Earnings", icon: BadgeDollarSign },
  { href: "/seller/brand", label: "Brand profile", icon: Store },
];

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const brand = useCommerceStore((s) => s.sellerBrand);
  const user = useCommerceStore((s) => s.user);
  const isApply = pathname === "/seller/apply";

  if (isApply) {
    return <>{children}</>;
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-10 text-center">
        <GlassCard className="space-y-4 p-8">
          <p className="text-xl font-semibold tracking-tight">Seller dashboard</p>
          <p className="text-sm text-muted-foreground">
            Apply to sell on copr or claim a demo brand to explore the dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/seller/apply">Apply to join</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/sell">Back to Sell on copr</Link>
            </Button>
          </div>
          {user && (
            <p className="text-xs text-muted-foreground">
              Signed in as {user.fullName}
            </p>
          )}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <GlassCard strong className="space-y-1 p-3">
          <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {brand.name}
          </p>
          <p className="px-3 pb-2 text-xs text-muted-foreground capitalize">
            {brand.status} · {brand.location}
          </p>
          <nav className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary dark:text-sky"
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-navy/40",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-2 pt-3">
            <Button asChild size="sm" className="w-full">
              <Link href="/seller/products/new">
                <Plus className="h-4 w-4" strokeWidth={1.5} />
                New product
              </Link>
            </Button>
          </div>
        </GlassCard>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/brands/${brand.slug}`}>View public page</Link>
        </Button>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
