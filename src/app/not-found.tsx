import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";
import { Slogan } from "@/components/brand/slogan";

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[55vh] items-center justify-center py-12">
      <GlassCard className="mx-auto max-w-md space-y-4 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <p className="text-4xl font-semibold tracking-tight">copr</p>
        <h1 className="text-xl font-medium">Page not found</h1>
        <Slogan id="notFound" variant="quote" className="text-base" />
        <p className="text-sm text-muted-foreground">
          That piece or brand may have moved — try the shop or brands directory.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button asChild>
            <Link href="/shop">Back to shop</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/brands">Browse brands</Link>
          </Button>
        </div>
      </GlassCard>
    </PageContainer>
  );
}
