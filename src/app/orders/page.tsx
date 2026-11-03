import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { OrdersList } from "@/components/orders/orders-list";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Orders
        </h1>
        <p className="text-muted-foreground">
          Track multi-brand shipments and escrow status.
        </p>
      </div>
      <OrdersList />
    </PageContainer>
  );
}
