import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterPanel } from "@/components/shop/filter-panel";
import { ProductGrid } from "@/components/shop/product-grid";
import { filterProducts } from "@/data";
import type { CategorySlug, ProductColour, ProductSize } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse fashion from Zambian brands on copr.",
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const q = first(params.q);
  const category = first(params.category) as CategorySlug | undefined;
  const brand = first(params.brand);
  const size = first(params.size) as ProductSize | undefined;
  const colour = first(params.colour) as ProductColour | undefined;
  const minPrice = first(params.minPrice);
  const maxPrice = first(params.maxPrice);
  const sort = (first(params.sort) as
    | "newest"
    | "price-asc"
    | "price-desc"
    | "popular"
    | undefined) ?? "newest";

  const products = filterProducts({
    q,
    category,
    brand,
    size,
    colour,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  });

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Shop
        </h1>
        <p className="text-muted-foreground">
          {products.length} piece{products.length === 1 ? "" : "s"} from Zambian
          brands
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense
              fallback={<GlassCard className="h-96 animate-pulse p-5" />}
            >
              <FilterPanel />
            </Suspense>
          </div>
        </aside>

        <div className="space-y-4">
          <Suspense fallback={null}>
            <ShopToolbar resultCount={products.length} />
          </Suspense>

          {/* Mobile filters */}
          <div className="lg:hidden">
            <Suspense fallback={null}>
              <FilterPanel />
            </Suspense>
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </PageContainer>
  );
}
