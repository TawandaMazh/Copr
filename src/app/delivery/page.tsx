import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceTag } from "@/components/ui/price-tag";
import {
  LUSAKA_DELIVERY_ZONES,
  OUTSIDE_LUSAKA,
  PICKUP_POINTS_PUBLIC,
} from "@/lib/commerce/delivery-config";
import { Slogan } from "@/components/brand/slogan";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery in Lusaka",
  description:
    "Lusaka delivery fees by area, estimated days, and mall pickup points on copr.",
  alternates: { canonical: "/delivery" },
  openGraph: {
    title: `Delivery in Lusaka · ${SITE_NAME}`,
    description:
      "Zone fees, ETAs, and pickup points for fashion orders across Lusaka.",
  },
};

export default function DeliveryPage() {
  return (
    <PageContainer className="mx-auto max-w-3xl space-y-10 py-6">
      <div className="space-y-3">
        <Slogan id="deliveryPromise" variant="eyebrow" />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Delivery in Lusaka
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Brands fulfil from their own stock. We offer home delivery across
          Lusaka and convenient mall pickup points.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Fees by area</h2>
        <div className="overflow-hidden rounded-3xl">
          <GlassCard className="overflow-hidden p-0">
            <ul className="divide-y divide-border-subtle">
              {LUSAKA_DELIVERY_ZONES.map((zone) => (
                <li
                  key={zone.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4"
                >
                  <div>
                    <p className="font-medium tracking-tight">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Usually {zone.etaDays} days
                      {zone.note ? ` · ${zone.note}` : ""}
                    </p>
                  </div>
                  <PriceTag amount={zone.feeKwacha} size="sm" />
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Pickup points</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PICKUP_POINTS_PUBLIC.map((point) => (
            <GlassCard key={point.id} className="p-5">
              <p className="font-semibold tracking-tight">{point.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{point.area}</p>
              <p className="mt-2 text-xs text-muted-foreground">{point.detail}</p>
            </GlassCard>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Pickup is free at checkout — choose a point when you place your order.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {OUTSIDE_LUSAKA.label}
        </h2>
        <GlassCard className="space-y-2 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {OUTSIDE_LUSAKA.message}
          </p>
          {!OUTSIDE_LUSAKA.available && (
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {OUTSIDE_LUSAKA.regionsComingSoon.map((region) => (
                <li key={region}>{region} — coming soon</li>
              ))}
            </ul>
          )}
        </GlassCard>
      </section>

      <p className="text-sm text-muted-foreground">
        Questions?{" "}
        <Link href="/returns" className="text-primary hover:underline">
          Returns policy
        </Link>{" "}
        ·{" "}
        <Link href="/shop" className="text-primary hover:underline">
          Continue shopping
        </Link>
      </p>
    </PageContainer>
  );
}
