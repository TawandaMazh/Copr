import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-16 text-center">
        <p className="text-lg font-medium tracking-tight">No pieces found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try clearing filters or browsing all products.
        </p>
      </div>
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
