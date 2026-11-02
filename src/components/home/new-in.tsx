import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";

export function NewIn({ products }: { products: Product[] }) {
  return (
    <section className="mb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            New in
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fresh drops from brands stocking on copr this season.
          </p>
        </div>
        <Link
          href="/shop?sort=newest"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline"
        >
          See all new
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.slice(0, 8).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={i < 2}
          />
        ))}
      </div>
    </section>
  );
}
