"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { getAvailableColours, getAvailableSizes } from "@/data";
import { resolveBrand } from "@/lib/catalogue";
import { isProductNew, brandIsVerified } from "@/lib/product-display";
import { PriceTag } from "@/components/ui/price-tag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SizeGuideDialog } from "@/components/product/size-guide-dialog";
import { cn } from "@/lib/utils";
import { useCommerceStore } from "@/stores/commerce-store";

export function ProductPurchase({
  product,
  reviewSummary,
}: {
  product: Product;
  /** Real published reviews only — hide rating when null/empty. */
  reviewSummary?: { rating: number; count: number } | null;
}) {
  const sellerBrand = useCommerceStore((s) => s.sellerBrand);
  const platformBrands = useCommerceStore((s) => s.platformBrands);
  const brand = resolveBrand(product.brandId, sellerBrand, platformBrands);
  const colours = getAvailableColours(product);
  const sizes = getAvailableSizes(product);
  const addToCart = useCommerceStore((s) => s.addToCart);
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlist);
  const wishlisted = useCommerceStore((s) =>
    s.wishlist.includes(product.id),
  );

  const [colour, setColour] = useState(colours[0]);
  const [size, setSize] = useState(sizes[0]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const showNew = isProductNew(product);
  const verified = brandIsVerified(brand);

  const variant = useMemo(
    () =>
      product.variants.find((v) => v.colour === colour && v.size === size) ??
      product.variants.find((v) => v.colour === colour) ??
      product.variants[0],
    [product.variants, colour, size],
  );

  const sizeOptions = useMemo(
    () =>
      sizes.map((s) => {
        const match = product.variants.find(
          (v) => v.colour === colour && v.size === s,
        );
        return {
          size: s,
          inStock: (match?.stock ?? 0) > 0,
          stock: match?.stock ?? 0,
        };
      }),
    [sizes, product.variants, colour],
  );

  const reviewCount = reviewSummary?.count ?? 0;
  const reviewRating = reviewSummary?.rating;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {brand && (
          <Link
            href={`/brands/${brand.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            {brand.name}
            {verified && (
              <span className="inline-flex items-center gap-0.5 normal-case tracking-normal text-primary">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="sr-only">Verified brand</span>
              </span>
            )}
          </Link>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <PriceTag amount={variant.price} size="lg" />
          {showNew && <Badge variant="new">New</Badge>}
          {reviewCount > 0 && reviewRating != null && (
            <span className="text-sm text-muted-foreground">
              {reviewRating.toFixed(1)} · {reviewCount} review
              {reviewCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">
          Colour <span className="text-muted-foreground">· {colour}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {colours.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColour(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-all focus-ring",
                colour === c
                  ? "bg-primary text-white"
                  : "glass hover:bg-white/80 dark:hover:bg-navy/70",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Size</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <button
              type="button"
              className="font-medium text-primary hover:underline focus-ring rounded"
              onClick={() => setSizeGuideOpen(true)}
            >
              Size guide
            </button>
            <Link
              href="/returns"
              className="font-medium text-muted-foreground hover:text-primary hover:underline focus-ring rounded"
            >
              Returns
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map(({ size: s, inStock }) => (
            <button
              key={s}
              type="button"
              disabled={!inStock}
              onClick={() => setSize(s)}
              className={cn(
                "min-w-12 rounded-full px-4 py-2 text-sm transition-all focus-ring disabled:cursor-not-allowed disabled:opacity-40",
                size === s
                  ? "bg-navy text-white dark:bg-sky dark:text-navy"
                  : "glass hover:bg-white/80 dark:hover:bg-navy/70",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {variant.stock > 0 ? (
            <>
              {variant.stock <= 3 && (
                <span className="font-medium text-primary">
                  Only {variant.stock} left ·{" "}
                </span>
              )}
              {variant.stock} in stock · Fulfilled by {brand?.name}
            </>
          ) : (
            "Out of stock for this variant"
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={variant.stock < 1}
          onClick={() => addToCart(product.id, variant.id)}
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          Add to bag
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="sm:w-auto"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wishlisted}
        >
          <Heart
            className={cn("h-4 w-4", wishlisted && "fill-primary text-primary")}
            strokeWidth={1.5}
          />
          {wishlisted ? "Saved" : "Wishlist"}
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Delivery across Lusaka · Pickup points at checkout · Secure payment —
        the brand is paid only after your order is delivered.
      </p>

      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
}
