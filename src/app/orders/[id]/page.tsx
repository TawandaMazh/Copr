import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { OrderDetail } from "@/components/orders/order-detail";

export const metadata: Metadata = {
  title: "Order tracking",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  return (
    <PageContainer>
      <Suspense fallback={<div className="glass h-64 animate-pulse rounded-3xl" />}>
        <OrderDetail orderId={id} />
      </Suspense>
    </PageContainer>
  );
}
