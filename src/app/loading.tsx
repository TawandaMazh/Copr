import { PageContainer } from "@/components/layout/page-container";
import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <PageContainer className="space-y-8 py-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <Skeleton className="h-[42vh] w-full rounded-[2rem]" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </PageContainer>
  );
}
