"use client";

import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/ui/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useCommerceStore } from "@/stores/commerce-store";
import { resolveProduct } from "@/lib/catalogue";

export default function WishlistPage() {
  const wishlist = useCommerceStore((s) => s.wishlist);
  const sellerProducts = useCommerceStore((s) => s.sellerProducts);
  const products = wishlist
    .map((id) => resolveProduct(id, sellerProducts))
    .filter(Boolean);

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Wishlist
        </h1>
        <p className="text-muted-foreground">
          {products.length} saved piece{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the heart on any product to save it here."
          actionHref="/shop"
          actionLabel="Browse shop"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product!.id} product={product!} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
