import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";
import { SELLER_PROGRAM } from "@/lib/commerce/seller-program";

export const metadata: Metadata = {
  title: "Sell on copr",
  description:
    "List anything and sell to shoppers across Zambia. Open your shop in minutes.",
  alternates: { canonical: "/sell" },
  openGraph: {
    title: "Sell on copr",
    description:
      "Clothes, gadgets, home finds, books — list what you have and get paid after delivery.",
  },
};

export default function SellPage() {
  const { commissionPercent, payoutTiming, holdNote, steps } = SELLER_PROGRAM;

  return (
    <PageContainer className="mx-auto max-w-3xl space-y-12 py-6">
      <div className="space-y-5 text-center">
        <p className="text-4xl font-semibold tracking-tight sm:text-5xl">copr</p>
        <h1 className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">
          Sell anything to people who want it.
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
          Clear your closet, move flat essentials, or run a side shop. You keep
          the stock; we handle discovery and checkout. Commission{" "}
          {commissionPercent}%.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/seller/apply">Start selling</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/seller">Seller dashboard</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Programme terms">
        <GlassCard className="p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Commission
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
            {commissionPercent}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Taken on item subtotal when a sale completes.
          </p>
        </GlassCard>
        <GlassCard className="p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payout timing
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{payoutTiming}</p>
          <p className="mt-2 text-sm text-muted-foreground">{holdNote}</p>
        </GlassCard>
      </section>

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
