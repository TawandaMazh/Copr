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
import { resolveDeliveryEta } from "@/lib/commerce/delivery-eta";
import { resolveBrand, resolveProduct } from "@/lib/catalogue";
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
  const platformBrands = useCommerceStore((s) => s.platformBrands);
  const checkout = useCommerceStore((s) => s.checkout);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const savedHomes = addresses.filter((a) => !a.isPickupPoint);
  const defaultAddress = savedHomes.find((a) => a.isDefault) ?? savedHomes[0];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "delivery",
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? defaultAddress?.phone ?? "",
      savedAddressId: defaultAddress?.id,
      area: defaultAddress?.area ?? LUSAKA_AREAS[0],
      neighbourhood: defaultAddress?.neighbourhood ?? "",
      landmark: defaultAddress?.landmark ?? "",
      pickupPointId: PICKUP_POINTS[0].id,
      notes: "",
      saveAddress: !defaultAddress,
      paymentMethod: "mtn_momo",
      mobileMoneyPhone: user?.phone ?? "",
      whatsappUpdates: true,
    },
  });

  const method = form.watch("deliveryMethod");
  const paymentMethod = form.watch("paymentMethod");
  const area = form.watch("area");
  const savedAddressId = form.watch("savedAddressId");
  const eta = useMemo(
    () => resolveDeliveryEta(method, method === "delivery" ? area : undefined),
    [method, area],
  );

  const totals = useMemo(
    () =>
      resolveCartTotals(
        cart,
        method,
        (id) => resolveProduct(id, sellerProducts),
        (id) => resolveBrand(id, sellerBrand, platformBrands),
      ),
    [cart, method, sellerProducts, sellerBrand, platformBrands],
  );

  const applySavedAddress = (id: string) => {
    const addr = savedHomes.find((a) => a.id === id);
    if (!addr) return;
    form.setValue("savedAddressId", addr.id);
    form.setValue("area", addr.area);
    form.setValue("neighbourhood", addr.neighbourhood);
    form.setValue("landmark", addr.landmark ?? "");
    form.setValue("phone", addr.phone);
    form.setValue("saveAddress", false);
  };

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
              Email
            </span>
            <input
              className="field"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <span className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                We’ll send your order confirmation here.
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
            Lusaka only · Flat fee{" "}
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
            <div className="space-y-3">
              {savedHomes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Saved addresses
                  </p>
                  <div className="grid gap-2">
                    {savedHomes.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => applySavedAddress(addr.id)}
                        className={cn(
                          "rounded-2xl border border-border-subtle px-4 py-3 text-left transition-colors",
                          savedAddressId === addr.id &&
                            "border-primary/40 bg-primary/5",
                        )}
                      >
                        <span className="block text-sm font-medium">
                          {addr.label || addr.neighbourhood}
                          {addr.isDefault ? " · Default" : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {addr.area} · {addr.neighbourhood}
                          {addr.landmark ? ` · ${addr.landmark}` : ""}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("savedAddressId", undefined);
                        form.setValue("neighbourhood", "");
                        form.setValue("landmark", "");
                        form.setValue("saveAddress", true);
                      }}
                      className={cn(
                        "rounded-2xl border border-dashed border-border-subtle px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
                        !savedAddressId && "border-primary/40 text-foreground",
                      )}
                    >
                      Use a new address
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Area / neighbourhood zone
                  </span>
                  <select className="field" {...form.register("area")}>
                    {LUSAKA_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
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

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  {...form.register("saveAddress")}
                />
                <span className="text-sm leading-relaxed">
                  Save this address for next time
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Keep it on your account for faster checkout.
                  </span>
                </span>
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

          <div className="rounded-2xl bg-primary/5 px-4 py-3 text-sm">
            <p className="font-medium text-primary dark:text-sky">{eta.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Brands pack after payment is secured. You’ll get updates when each
              parcel ships.
            </p>
          </div>

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

        <GlassCard className="space-y-4 p-6">
          <h2 className="text-lg font-semibold tracking-tight">Payment</h2>
          <p className="text-sm text-muted-foreground">
            Secure payment — the brand is paid only after your order is
            delivered. Mobile money is mocked for now and ready for a live
            provider later.
          </p>
          <div className="grid gap-2">
            {(
              [
                { id: "mtn_momo", label: "MTN MoMo" },
                { id: "airtel_money", label: "Airtel Money" },
                { id: "card", label: "Card" },
              ] as const
            ).map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border border-border-subtle px-4 py-3 transition-colors",
                  paymentMethod === option.id &&
                    "border-primary/40 bg-primary/5",
                )}
              >
                <input
                  type="radio"
                  value={option.id}
                  className="accent-primary"
                  {...form.register("paymentMethod")}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          {(paymentMethod === "mtn_momo" ||
            paymentMethod === "airtel_money") && (
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mobile money number (+260)
              </span>
              <input
                className="field"
                inputMode="tel"
                placeholder="+260 97 123 4567"
                {...form.register("mobileMoneyPhone")}
              />
              {form.formState.errors.mobileMoneyPhone && (
                <span className="text-xs text-destructive">
                  {form.formState.errors.mobileMoneyPhone.message}
                </span>
              )}
            </label>
          )}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 accent-primary"
              {...form.register("whatsappUpdates")}
            />
            <span className="text-sm leading-relaxed">
              Get order updates on WhatsApp
              <span className="mt-0.5 block text-xs text-muted-foreground">
                We’ll message the contact phone above when your parcel ships.
              </span>
            </span>
          </label>
        </GlassCard>
      </div>

      <GlassCard strong className="h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold tracking-tight">Order summary</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You’ll get an order confirmation next, with your expected delivery
          window. Each brand ships its own parcel.
        </p>
        <div className="rounded-2xl border border-border-subtle px-4 py-3 text-sm">
          <p className="font-medium">{eta.label}</p>
        </div>
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
