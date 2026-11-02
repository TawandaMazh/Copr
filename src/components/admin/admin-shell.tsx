"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  Flag,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommerceStore } from "@/stores/commerce-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/brands", label: "Brands", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/payouts", label: "Payouts", icon: BadgeDollarSign },
  { href: "/admin/disputes", label: "Disputes", icon: Flag },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = React.useState(false);
  const user = useCommerceStore((s) => s.user);
  const signInAdminDemo = useCommerceStore((s) => s.signInAdminDemo);
  const pendingBrands = useCommerceStore(
    (s) => s.platformBrands.filter((b) => b.status === "pending").length,
  );
  const openDisputes = useCommerceStore(
    (s) =>
      s.disputes.filter(
        (d) => d.status === "open" || d.status === "under_review",
      ).length,
  );

  React.useEffect(() => {
    const finish = () => setHydrated(true);
    if (useCommerceStore.persist.hasHydrated()) {
      finish();
      return;
    }
    return useCommerceStore.persist.onFinishHydration(finish);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-12 text-center">
        <GlassCard className="p-8 text-sm text-muted-foreground">
          Loading admin…
        </GlassCard>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md space-y-4 py-12 text-center">
        <GlassCard className="space-y-4 p-8">
          <Shield className="mx-auto h-8 w-8 text-primary" strokeWidth={1.5} />
          <p className="text-xl font-semibold tracking-tight">Admin access</p>
          <p className="text-sm text-muted-foreground">
            Sign in with an admin account to moderate brands, payouts, and
            disputes.
          </p>
          <Button
            type="button"
            className="w-full"
            onClick={() => signInAdminDemo()}
          >
            Continue as demo admin
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/account">Shopper / seller sign in</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <GlassCard strong className="space-y-1 p-3">
          <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin
          </p>
          <p className="truncate px-3 pb-2 text-xs text-muted-foreground">
            {user.fullName}
          </p>
          <nav className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const badge =
                item.href === "/admin/brands"
                  ? pendingBrands
                  : item.href === "/admin/disputes"
                    ? openDisputes
                    : 0;
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
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </GlassCard>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
