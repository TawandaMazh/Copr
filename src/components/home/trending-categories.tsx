"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";

export function TrendingCategories({
  categories,
}: {
  categories: (Category & { productCount: number })[];
}) {
  return (
    <section className="mb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Trending categories
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Browse by what you wear — from chitenge to city denim.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.slice(0, 8).map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.28,
              delay: i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl focus-ring"
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-semibold tracking-tight">{category.name}</p>
                <p className="text-xs text-white/70">
                  {category.productCount} pieces
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
