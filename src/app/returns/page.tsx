import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { GlassCard } from "@/components/ui/glass-card";
import { Slogan } from "@/components/brand/slogan";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "How returns work on copr — unworn items, brand fulfilment, and Lusaka timelines.",
  alternates: { canonical: "/returns" },
  openGraph: {
    title: `Returns · ${SITE_NAME}`,
    description: "Return windows, conditions, and how to start a return.",
  },
};

const points = [
  {
    title: "7-day window",
    body: "Request a return within 7 days of delivery for unused pieces with tags attached.",
  },
  {
    title: "Brand fulfilment",
    body: "Each brand holds its own stock — returns go back to the brand that shipped your order.",
  },
  {
    title: "Condition",
    body: "Items must be unworn, unwashed, and in original packaging where provided.",
  },
  {
    title: "Refunds",
    body: "Once the brand confirms the return, we release a refund to your original payment method.",
  },
];

export default function ReturnsPage() {
  return (
    <PageContainer className="mx-auto max-w-3xl space-y-10 py-6">
      <div className="space-y-3">
        <Slogan id="returnsSoft" variant="eyebrow" />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Returns
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Clear, calm returns for Lusaka orders. Start from your order page or
          message support after delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {points.map((point) => (
          <GlassCard key={point.title} className="p-5">
            <h2 className="font-semibold tracking-tight">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {point.body}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="space-y-3 p-6">
        <h2 className="text-lg font-semibold tracking-tight">How to start</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Open{" "}
            <Link href="/orders" className="text-primary hover:underline">
              Your orders
            </Link>{" "}
            and select the delivered parcel.
          </li>
          <li>Open a return request with a short reason and photos if needed.</li>
          <li>Drop off or arrange collection as the brand advises.</li>
        </ol>
      </GlassCard>

      <p className="text-sm text-muted-foreground">
        See also{" "}
        <Link href="/delivery" className="text-primary hover:underline">
          Delivery in Lusaka
        </Link>
        .
      </p>
    </PageContainer>
  );
}
