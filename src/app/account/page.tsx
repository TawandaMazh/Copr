import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <PageContainer className="mx-auto max-w-lg space-y-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <GlassCard className="space-y-4 p-6">
        <p className="text-muted-foreground">
          Sign in with email or phone OTP arrives in Phase 2 with Supabase Auth.
          Wishlist, orders, and addresses will live here.
        </p>
        <Button disabled className="w-full">
          Sign in (coming soon)
        </Button>
      </GlassCard>
    </PageContainer>
  );
}
