import { PageContainer } from "@/components/layout/page-container";
import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <PageContainer className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Skeleton className="hidden h-96 rounded-3xl lg:block" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
