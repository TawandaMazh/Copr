"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import {
  getAvailableColours,
  getAvailableSizes,
  getBrandById,
} from "@/data";
import { PriceTag } from "@/components/ui/price-tag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCommerceStore } from "@/stores/commerce-store";

export function ProductPurchase({ product }: { product: Product }) {
  const brand = getBrandById(product.brandId);
  const colours = getAvailableColours(product);
  const sizes = getAvailableSizes(product);
  const addToCart = useCommerceStore((s) => s.addToCart);
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlist);
  const wishlisted = useCommerceStore((s) =>
    s.wishlist.includes(product.id),
  );

  const [colour, setColour] = useState(colours[0]);
  const [size, setSize] = useState(sizes[0]);

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
        return { size: s, inStock: (match?.stock ?? 0) > 0 };
      }),
    [sizes, product.variants, colour],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {brand && (
          <Link
            href={`/brands/${brand.slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            {brand.name}
          </Link>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <PriceTag amount={variant.price} size="lg" />
          {product.isNew && <Badge variant="new">New</Badge>}
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
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
        <p className="text-sm font-medium">Size</p>
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
          {variant.stock > 0
            ? `${variant.stock} in stock · Fulfilled by ${brand?.name}`
            : "Out of stock for this variant"}
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
        Delivery across Lusaka · Pickup points at checkout · Paid via mock escrow
        (HELD until delivery).
      </p>
    </div>
  );
}
