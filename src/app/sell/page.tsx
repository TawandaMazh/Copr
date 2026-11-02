import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Sell on copr",
  description: "Join Zambia’s multi-vendor fashion marketplace as a brand.",
};

const steps = [
  {
    title: "Apply",
    body: "Tell us about your brand, where you make, and what you sell.",
  },
  {
    title: "List",
    body: "Upload products with sizes, colours, stock, and images. You keep the inventory.",
  },
  {
    title: "Fulfil",
    body: "When an order lands, you pack and ship across Lusaka. copr takes a fair commission.",
  },
];

export default function SellPage() {
  return (
    <PageContainer className="mx-auto max-w-3xl space-y-12 py-6">
      <div className="space-y-5 text-center">
        <p className="text-4xl font-semibold tracking-tight sm:text-5xl">copr</p>
        <h1 className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">
          Sell fashion to Zambian shoppers — keep your stock, tell your story.
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
          You fulfil orders; we handle discovery, checkout, and escrow. Default
          commission 15%. Open the seller dashboard to manage products, orders,
          and earnings.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/seller/apply">Apply to join</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/seller">Seller dashboard</Link>
          </Button>
        </div>
      </div>

      <div id="how-it-works" className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <GlassCard key={step.title} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step {i + 1}
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </GlassCard>
        ))}
      </div>
    </PageContainer>
  );
}
