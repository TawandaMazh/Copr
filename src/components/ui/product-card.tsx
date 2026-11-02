"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { getBrandById, getMinPrice } from "@/data";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";
import { Badge } from "./badge";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const brand = getBrandById(product.brandId);
  const price = getMinPrice(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <Link href={`/shop/${product.slug}`} className="block focus-ring rounded-3xl">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ice dark:bg-navy/40">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.trending && !product.isNew && (
              <Badge variant="secondary">Trending</Badge>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1 px-0.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {brand?.name}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <PriceTag amount={price} size="sm" />
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Save ${product.name} to wishlist`}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full glass opacity-100 transition-all duration-250 hover:scale-105 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Heart className="h-4 w-4 text-foreground" strokeWidth={1.5} />
      </button>
    </motion.article>
  );
}
