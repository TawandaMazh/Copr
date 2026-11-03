import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SLOGANS } from "@/data/slogans";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No pieces found"
        description={`${SLOGANS.goOnAndCop} Try clearing filters or browsing the full catalogue.`}
        actionHref="/shop"
        actionLabel="Clear filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
