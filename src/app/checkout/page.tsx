import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Lusaka delivery and pickup on copr.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>
        <p className="text-muted-foreground">
          Lusaka delivery or pickup · Escrow via MockProvider
        </p>
      </div>
      <CheckoutForm />
    </PageContainer>
  );
}
