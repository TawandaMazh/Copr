"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Slogan } from "@/components/brand/slogan";
import { ProductCard } from "@/components/ui/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useCommerceStore } from "@/stores/commerce-store";
import { resolveProduct } from "@/lib/catalogue";
import { SLOGANS } from "@/data/slogans";

export default function WishlistPage() {
  const wishlist = useCommerceStore((s) => s.wishlist);
  const sellerProducts = useCommerceStore((s) => s.sellerProducts);
  const products = wishlist
    .map((id) => resolveProduct(id, sellerProducts))
    .filter(Boolean);

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <Slogan id="savedLooks" variant="eyebrow" />
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
          description={SLOGANS.emptyWishlist}
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
