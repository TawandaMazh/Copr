import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brands } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Brands",
  description: "Discover independent Zambian fashion brands on copr.",
};

export default function BrandsPage() {
  return (
    <PageContainer className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Brands
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Ten local labels stocking on copr — each holds their own inventory and
          fulfils orders directly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {brands.map((brand) => {
          const count = getProductsByBrand(brand.id).length;
          return (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="focus-ring rounded-3xl"
            >
              <GlassCard hover className="overflow-hidden p-0">
                <div className="relative h-40 w-full">
                  <Image
                    src={brand.banner}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/30" />
                </div>
                <div className="flex items-start gap-4 p-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={brand.logo}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-lg font-semibold tracking-tight">
                      {brand.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {brand.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {brand.location} · Est. {brand.foundedYear} · {count}{" "}
                      products
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
