"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { fadeInView, usePrefersReducedMotion } from "@/lib/motion";

export function JustListed({ products }: { products: Product[] }) {
  const reduced = usePrefersReducedMotion();
  const inView = fadeInView(reduced);

  return (
    <section className="mb-16">
      <motion.div
        {...inView}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Just listed
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fresh finds from people selling on copr — fashion, tech, home, and
            more.
          </p>
        </div>
        <Link
          href="/shop?sort=newest"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline"
        >
          See all
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {products.slice(0, 12).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={i < 4}
          />
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/shop?sort=newest"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all listings
        </Link>
      </div>
    </section>
  );
}
