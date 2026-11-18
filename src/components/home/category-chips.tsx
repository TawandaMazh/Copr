"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { fadeInView, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PRIORITY = [
  "electronics",
  "dresses",
  "home",
  "footwear",
  "beauty",
  "kids",
  "sports",
  "books",
  "accessories",
  "other",
] as const;

export function CategoryChips({
  categories,
}: {
  categories: (Category & { productCount: number })[];
}) {
  const reduced = usePrefersReducedMotion();
  const inView = fadeInView(reduced);

  const ordered = [...categories].sort((a, b) => {
    const ai = PRIORITY.indexOf(a.slug as (typeof PRIORITY)[number]);
    const bi = PRIORITY.indexOf(b.slug as (typeof PRIORITY)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <section className="mb-10" aria-label="Browse categories">
      <motion.div
        {...inView}
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href="/shop"
          className={cn(
            "shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors",
            "hover:bg-primary-600 focus-ring",
          )}
        >
          All
        </Link>
        {ordered.slice(0, 12).map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className={cn(
              "shrink-0 rounded-full border border-border-subtle bg-white/55 px-4 py-2 text-sm font-medium text-foreground",
              "transition-colors hover:bg-white/90 focus-ring dark:bg-navy/40 dark:hover:bg-navy/60",
            )}
          >
            {category.name}
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
