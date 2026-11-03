"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer className="flex min-h-[50vh] items-center justify-center py-12">
      <GlassCard className="mx-auto max-w-md space-y-4 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          We couldn’t load this page
        </h1>
        <p className="text-sm text-muted-foreground">
          Try again, or head back to the shop. If it keeps happening, refresh
          and clear demo session data.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Ref {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/shop">Back to shop</Link>
          </Button>
        </div>
      </GlassCard>
    </PageContainer>
  );
}
