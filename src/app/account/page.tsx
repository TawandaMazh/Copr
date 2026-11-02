"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { AuthForm } from "@/components/auth/auth-form";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useCommerceStore } from "@/stores/commerce-store";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AccountPage() {
  const user = useCommerceStore((s) => s.user);
  const orders = useCommerceStore((s) => s.orders);
  const wishlist = useCommerceStore((s) => s.wishlist);
  const addresses = useCommerceStore((s) => s.addresses);
  const signOutLocal = useCommerceStore((s) => s.signOut);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase?.auth.signOut();
    }
    signOutLocal();
  };

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "seller"
        ? "Seller"
        : "Shopper";

  return (
    <PageContainer className="mx-auto max-w-lg space-y-6 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Orders, wishlist, and delivery details for shopping in Lusaka.
        </p>
      </div>

      {!user ? (
        <AuthForm />
      ) : (
        <>
          <GlassCard className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {roleLabel}
              {user.isDemo ? " · demo session" : " · signed in"}
            </p>
            <p className="text-xl font-semibold tracking-tight">
              {user.fullName}
            </p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
            {user.phone && (
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            )}
            {user.isDemo && (
              <p className="text-xs text-muted-foreground">
                Demo sessions stay on this device. Use email sign-in so bag,
                wishlist, and orders sync across phones.
              </p>
            )}
            <Button variant="secondary" onClick={signOut}>
              Sign out
            </Button>
          </GlassCard>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat href="/orders" label="Orders" value={orders.length} />
            <Stat href="/wishlist" label="Wishlist" value={wishlist.length} />
            <Stat
              href="/account#addresses"
              label="Addresses"
              value={addresses.length}
            />
            <Stat
              href={
                user.role === "seller" || user.role === "admin"
                  ? "/seller"
                  : "/seller/apply"
              }
              label={
                user.role === "seller" || user.role === "admin"
                  ? "Seller hub"
                  : "Sell on copr"
              }
              value={
                user.role === "seller" || user.role === "admin" ? "Open" : "Apply"
              }
            />
          </div>

          {user.role === "admin" && (
            <GlassCard className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-semibold tracking-tight">Admin console</p>
                <p className="text-sm text-muted-foreground">
                  Moderate brands, payouts, reviews, and marketplace settings.
                </p>
              </div>
              <Button asChild>
                <Link href="/admin">Open admin</Link>
              </Button>
            </GlassCard>
          )}

          {orders.length === 0 && (
            <GlassCard className="space-y-2 p-5">
              <p className="font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground">
                Browse local brands, add pieces to your bag, and check out with
                Lusaka delivery or pickup.
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href="/shop">Browse the shop</Link>
              </Button>
            </GlassCard>
          )}

          <GlassCard id="addresses" className="space-y-3 p-6">
            <h2 className="font-semibold tracking-tight">Saved addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Addresses save automatically when you check out with home
                delivery in Lusaka.
              </p>
            ) : (
              <ul className="space-y-3">
                {addresses.map((a) => (
                  <li key={a.id} className="text-sm">
                    <p className="font-medium">
                      {a.label || a.area}
                      {a.isDefault ? " · Default" : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {a.neighbourhood}
                      {a.landmark ? ` · ${a.landmark}` : ""} · {a.phone}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </>
      )}
    </PageContainer>
  );
}

function Stat({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: number | string;
}) {
  return (
    <Link href={href} className="focus-ring rounded-3xl">
      <GlassCard hover className="p-4 text-center">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </GlassCard>
    </Link>
  );
}
