import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin · copr",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer className="pb-20 pt-4">
      <AdminShell>{children}</AdminShell>
    </PageContainer>
  );
}
