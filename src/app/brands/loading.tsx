import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
  return (
    <PageContainer className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading brands</span>
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-3xl" />
        ))}
      </div>
    </PageContainer>
  );
}
