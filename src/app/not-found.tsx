import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-4xl font-semibold tracking-tight">copr</p>
      <h1 className="text-xl font-medium">Page not found</h1>
      <p className="text-muted-foreground">
        That piece may have moved — try the shop instead.
      </p>
      <Button asChild>
        <Link href="/shop">Back to shop</Link>
      </Button>
    </PageContainer>
  );
}
