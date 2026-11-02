"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { brands } from "@/data/brands";
import { getCategoriesWithCounts } from "@/data";
import type { ProductColour, ProductSize } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const COLOURS: ProductColour[] = [
  "Black",
  "White",
  "Navy",
  "Blue",
  "Sky",
  "Cream",
  "Brown",
  "Olive",
  "Red",
  "Gold",
  "Grey",
  "Pink",
  "Chitenge Print",
];

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-ring",
        active
          ? "bg-primary text-white shadow-glass"
          : "bg-white/50 text-foreground hover:bg-white/80 dark:bg-navy/40 dark:hover:bg-navy/60",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const categories = getCategoriesWithCounts();

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";
  const selectedSize = searchParams.get("size") ?? "";
  const selectedColour = searchParams.get("colour") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      startTransition(() => {
        router.push(`/shop?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const clearAll = () => {
    startTransition(() => router.push("/shop", { scroll: false }));
  };

  const hasFilters =
    selectedCategory ||
    selectedBrand ||
    selectedSize ||
    selectedColour ||
    minPrice ||
    maxPrice;

  return (
    <GlassCard
      strong
      className={cn("space-y-6 p-5", pending && "opacity-80", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 gap-1 px-2 text-xs text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            Clear
          </Button>
        )}
      </div>

      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Chip
              key={cat.slug}
              active={selectedCategory === cat.slug}
              onClick={() =>
                update(
                  "category",
                  selectedCategory === cat.slug ? "" : cat.slug,
                )
              }
            >
              {cat.name}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="flex max-h-40 flex-col gap-1 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() =>
                update(
                  "brand",
                  selectedBrand === brand.slug ? "" : brand.slug,
                )
              }
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm transition-colors focus-ring",
                selectedBrand === brand.slug
                  ? "bg-primary/10 font-medium text-primary dark:text-sky"
                  : "text-foreground hover:bg-white/50 dark:hover:bg-navy/40",
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <Chip
              key={size}
              active={selectedSize === size}
              onClick={() =>
                update("size", selectedSize === size ? "" : size)
              }
            >
              {size}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="flex flex-wrap gap-1.5">
          {COLOURS.map((colour) => (
            <Chip
              key={colour}
              active={selectedColour === colour}
              onClick={() =>
                update("colour", selectedColour === colour ? "" : colour)
              }
            >
              {colour}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price (K)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => update("minPrice", e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-white/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:bg-navy/40"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => update("maxPrice", e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-white/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:bg-navy/40"
          />
        </div>
      </FilterGroup>
    </GlassCard>
  );
}
