"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
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
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <p className="text-lg font-medium">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any product to save it here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop">Browse shop</Link>
          </Button>
        </div>
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
