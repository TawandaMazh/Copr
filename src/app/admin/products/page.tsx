"use client";

import Image from "next/image";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { getMinPrice } from "@/data";

export default function AdminProductsPage() {
  const user = useCommerceStore((s) => s.user);
  const products = useCommerceStore((s) => s.sellerProducts);
  const brands = useCommerceStore((s) => s.platformBrands);
  const moderateProduct = useCommerceStore((s) => s.moderateProduct);

  if (!user || user.role !== "admin") return null;

  const brandName = (id: string) =>
    brands.find((b) => b.id === id)?.name ?? "Brand";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Moderate seller catalogue — unpublish, feature, or restore.
        </p>
      </div>

      {products.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No seller-created products yet. Claim a demo brand and add products
          from the seller dashboard.
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <GlassCard
              key={product.id}
              className="flex flex-wrap items-center gap-4 p-4"
            >
              <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-ice dark:bg-navy/40">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold tracking-tight">{product.name}</p>
                  {product.isPublished ? (
                    <Badge>Live</Badge>
                  ) : (
                    <Badge variant="outline">Unpublished</Badge>
                  )}
                  {product.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {brandName(product.brandId)} · {product.categorySlug}
                </p>
                <PriceTag amount={getMinPrice(product)} size="sm" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/shop/${product.slug}`}>View</Link>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    moderateProduct(product.id, {
                      isPublished: !product.isPublished,
                    })
                  }
                >
                  {product.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant={product.featured ? "secondary" : "default"}
                  onClick={() =>
                    moderateProduct(product.id, {
                      featured: !product.featured,
                    })
                  }
                >
                  {product.featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </GlassCard>
          ))}
        </ul>
      )}
    </div>
  );
}
