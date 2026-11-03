"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";
import {
  DELIVERY_FEE_KWACHA,
  LUSAKA_AREAS,
  PICKUP_POINTS,
} from "@/lib/commerce/constants";
import { resolveCartTotals } from "@/lib/commerce/checkout";
import { resolveProduct } from "@/lib/catalogue";
import { getBrandById } from "@/data";
import { useCommerceStore } from "@/stores/commerce-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCommerceStore((s) => s.cart);
  const user = useCommerceStore((s) => s.user);
  const addresses = useCommerceStore((s) => s.addresses);
  const sellerProducts = useCommerceStore((s) => s.sellerProducts);
  const sellerBrand = useCommerceStore((s) => s.sellerBrand);
  const checkout = useCommerceStore((s) => s.checkout);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "delivery",
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? defaultAddress?.phone ?? "",
      area: defaultAddress?.area ?? LUSAKA_AREAS[0],
      neighbourhood: defaultAddress?.neighbourhood ?? "",
      landmark: defaultAddress?.landmark ?? "",
      pickupPointId: PICKUP_POINTS[0].id,
      notes: "",
    },
  });

  const method = form.watch("deliveryMethod");
  const totals = useMemo(
    () =>
      resolveCartTotals(
        cart,
        method,
        (id) => resolveProduct(id, sellerProducts),
        (id) => (sellerBrand?.id === id ? sellerBrand : getBrandById(id)),
      ),
    [cart, method, sellerProducts, sellerBrand],
  );

  if (cart.length === 0) {
    return (
      <GlassCard className="space-y-4 p-8 text-center">
        <p className="text-lg font-medium">Nothing to check out</p>
        <p className="text-sm text-muted-foreground">
          Add pieces from the shop first.
        </p>
        <Button asChild>
          <Link href="/shop">Browse shop</Link>
        </Button>
      </GlassCard>
    );
  }

  const onSubmit = (values: CheckoutFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const order = await checkout(values);
        router.push(`/orders/${order.id}?placed=1`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout failed");
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="space-y-6">
        <GlassCard className="space-y-4 p-6">
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full name
            </span>
            <input className="field" {...form.register("fullName")} />
            {form.formState.errors.fullName && (
              <span className="text-xs text-destructive">
                {form.formState.errors.fullName.message}
              </span>
            )}
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone (+260)
            </span>
            <input
              className="field"
              placeholder="+260 97 123 4567"
              {...form.register("phone")}
            />
            {form.formState.errors.phone && (
              <span className="text-xs text-destructive">
                {form.formState.errors.phone.message}
              </span>
            )}
          </label>
        </GlassCard>

        <GlassCard className="space-y-4 p-6">
          <h2 className="text-lg font-semibold tracking-tight">Delivery</h2>
          <p className="text-sm text-muted-foreground">
            Lusaka only for MVP · Flat fee{" "}
            <PriceTag amount={DELIVERY_FEE_KWACHA} size="sm" className="inline" />
          </p>
          <div className="flex gap-2 rounded-full glass p-1">
            {(["delivery", "pickup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => form.setValue("deliveryMethod", m)}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-sm font-medium capitalize transition-colors",
                  method === m
                    ? "bg-primary text-white"
                    : "text-muted-foreground",
                )}
              >
                {m === "delivery" ? "Home delivery" : "Pickup point"}
              </button>
            ))}
          </div>

          {method === "delivery" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Area / neighbourhood zone
                </span>
                <select className="field" {...form.register("area")}>
                  {LUSAKA_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Neighbourhood / street
                </span>
                <input
                  className="field"
                  placeholder="e.g. Twin Palm Road"
                  {...form.register("neighbourhood")}
                />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Landmark
                </span>
                <input
                  className="field"
                  placeholder="Blue gate near the bakery"
                  {...form.register("landmark")}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              {PICKUP_POINTS.map((point) => (
                <label
                  key={point.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border border-border-subtle p-3 transition-colors",
                    form.watch("pickupPointId") === point.id &&
                      "border-primary/40 bg-primary/5",
                  )}
                >
                  <input
                    type="radio"
                    value={point.id}
                    className="mt-1"
                    {...form.register("pickupPointId")}
                  />
                  <span>
                    <span className="block font-medium">{point.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {point.area} · {point.neighbourhood} · {point.landmark}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order notes
            </span>
            <textarea
              className="field"
              placeholder="Gate code, preferred time…"
              {...form.register("notes")}
            />
          </label>
        </GlassCard>
      </div>

      <GlassCard strong className="h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold tracking-tight">Secure checkout</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your payment is secured at checkout. Each brand ships separately —
          confirm delivery when a parcel arrives (or we auto-confirm after a few
          days) so that brand gets paid.
        </p>
        <div className="space-y-2 border-t border-border-subtle pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <PriceTag amount={totals.subtotal} size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <PriceTag amount={totals.deliveryFee} size="sm" />
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <PriceTag amount={totals.total} />
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Placing order…" : "Pay & place order"}
        </Button>
      </GlassCard>
    </form>
  );
}
