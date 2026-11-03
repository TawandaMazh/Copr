"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Brand } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";

export function FeaturedBrands({ brands }: { brands: Brand[] }) {
  return (
    <section className="mb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Featured brands
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Independent Zambian labels holding their own stock and story.
          </p>
        </div>
        <Link
          href="/brands"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.slice(0, 6).map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.28,
              delay: i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href={`/brands/${brand.slug}`} className="block focus-ring rounded-3xl">
              <GlassCard hover className="overflow-hidden p-0">
                <div className="relative h-36 w-full sm:h-40">
                  <Image
                    src={brand.banner}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/25" />
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-ice dark:bg-navy">
                    <Image
                      src={brand.logo}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold tracking-tight">
                      {brand.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {brand.tagline}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
