"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { brands as seedBrands } from "@/data/brands";
import { filterMergedProducts } from "@/lib/catalogue";
import { getMinPrice } from "@/data";
import { presenceExit, usePrefersReducedMotion } from "@/lib/motion";
import { useCommerceStore } from "@/stores/commerce-store";
import { PriceTag } from "@/components/ui/price-tag";
import { Button } from "@/components/ui/button";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sellerProducts = useCommerceStore((s) => s.sellerProducts);
  const sellerBrand = useCommerceStore((s) => s.sellerBrand);
  const platformBrands = useCommerceStore((s) => s.platformBrands);
  const reduced = usePrefersReducedMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const brands = React.useMemo(() => {
    const byId = new Map(seedBrands.map((b) => [b.id, b]));
    for (const b of platformBrands) byId.set(b.id, b);
    if (sellerBrand) byId.set(sellerBrand.id, sellerBrand);
    return [...byId.values()];
  }, [platformBrands, sellerBrand]);

  const trimmed = query.trim();
  const products = React.useMemo(() => {
    if (!trimmed) return [];
    return filterMergedProducts(sellerProducts, {
      q: trimmed,
      sort: "popular",
    }).slice(0, 8);
  }, [sellerProducts, trimmed]);

  const brandHits = React.useMemo(() => {
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();
    return brands
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.tagline.toLowerCase().includes(q) ||
          b.slug.includes(q),
      )
      .slice(0, 4);
  }, [brands, trimmed]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            className="fixed inset-0 z-[80] bg-navy/45 backdrop-blur-sm"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={presenceExit(reduced, { opacity: 0 })}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search copr"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={presenceExit(reduced, { opacity: 0, y: -12 })}
            transition={{
              duration: reduced ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-strong fixed inset-x-3 top-16 z-[90] mx-auto max-w-xl overflow-hidden rounded-3xl shadow-glass-lg sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
          >
            <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
              <Search
                className="ml-1 h-4 w-4 shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands, styles, chitenge…"
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoComplete="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onOpenChange(false);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close search"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>

            <div className="max-h-[min(70vh,28rem)] overflow-y-auto p-3">
              {!trimmed && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Try “chitenge”, a brand name, or a colour.
                </p>
              )}

              {trimmed && brandHits.length === 0 && products.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No matches for “{trimmed}”.
                </p>
              )}

              {brandHits.length > 0 && (
                <section className="mb-3">
                  <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Brands
                  </p>
                  <ul className="space-y-1">
                    {brandHits.map((brand) => (
                      <li key={brand.id}>
                        <Link
                          href={`/brands/${brand.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-white/50 dark:hover:bg-navy/50"
                        >
                          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-ice dark:bg-navy">
                            <Image
                              src={brand.logo}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium tracking-tight">
                              {brand.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {brand.tagline}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {products.length > 0 && (
                <section>
                  <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pieces
                  </p>
                  <ul className="space-y-1">
                    {products.map((product) => {
                      const brand = brands.find((b) => b.id === product.brandId);
                      return (
                        <li key={product.id}>
                          <Link
                            href={`/shop/${product.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-white/50 dark:hover:bg-navy/50"
                          >
                            <div className="relative h-12 w-10 overflow-hidden rounded-xl bg-ice dark:bg-navy">
                              <Image
                                src={product.images[0]}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium tracking-tight">
                                {product.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {brand?.name}
                              </p>
                            </div>
                            <span className="shrink-0">
                              <PriceTag
                                amount={getMinPrice(product)}
                                size="sm"
                              />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {trimmed && (
                <div className="mt-3 border-t border-border-subtle pt-3">
                  <Link
                    href={`/shop?q=${encodeURIComponent(trimmed)}`}
                    onClick={() => onOpenChange(false)}
                    className="block rounded-2xl px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    See all results for “{trimmed}”
                  </Link>
                </div>
              )}
            </div>

            <p className="border-t border-border-subtle px-4 py-2 text-[11px] text-muted-foreground">
              Tip: press{" "}
              <kbd className="rounded bg-white/60 px-1 dark:bg-navy/60">⌘</kbd>/
              <kbd className="rounded bg-white/60 px-1 dark:bg-navy/60">Ctrl</kbd>
              +<kbd className="rounded bg-white/60 px-1 dark:bg-navy/60">K</kbd>{" "}
              anytime
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
