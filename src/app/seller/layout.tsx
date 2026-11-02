import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SellerShell } from "@/components/seller/seller-shell";

export const metadata: Metadata = {
  title: {
    default: "Seller dashboard",
    template: "%s · Seller · copr",
  },
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer className="pb-20 pt-4">
      <SellerShell>{children}</SellerShell>
    </PageContainer>
  );
}
