"use client";

import Image from "next/image";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { getMinPrice } from "@/data";

export default function SellerProductsPage() {
  const brand = useCommerceStore((s) => s.sellerBrand);
  const products = useCommerceStore((s) =>
    s.sellerProducts.filter((p) => p.brandId === s.sellerBrand?.id),
  );

  if (!brand) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            {products.length} piece{products.length === 1 ? "" : "s"} · manage
            stock & variants
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">New product</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <GlassCard className="space-y-3 p-8 text-center">
          <p className="font-medium">No products yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first piece with sizes, colours, and stock.
          </p>
          <Button asChild>
            <Link href="/seller/products/new">Create product</Link>
          </Button>
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/seller/products/${product.id}`}
                className="block focus-ring rounded-3xl"
              >
                <GlassCard hover className="flex gap-4 p-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-ice dark:bg-navy/40">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">{product.name}</p>
                      <Badge variant={product.isPublished ? "default" : "outline"}>
                        {product.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-xs capitalize text-muted-foreground">
                      {product.categorySlug} · {product.variants.length} variants ·{" "}
                      {product.variants.reduce((s, v) => s + v.stock, 0)} in stock
                    </p>
                    <PriceTag amount={getMinPrice(product)} size="sm" />
                  </div>
                </GlassCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
