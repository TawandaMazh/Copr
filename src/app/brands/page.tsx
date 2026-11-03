import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import {
  listBrands,
  listProductsByBrand,
} from "@/lib/catalogue/service";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";
import { brandIsVerified } from "@/lib/product-display";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Discover independent Zambian fashion brands stocking on copr — each holds their own inventory.",
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Zambian fashion brands · copr",
    description:
      "Local labels from Lusaka, Ndola, Kitwe and beyond — shop each brand’s story and stock.",
  },
};

export default async function BrandsPage() {
  const brands = await listBrands();

  return (
    <PageContainer className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Brands
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Local labels stocking on copr — each holds their own inventory and
          fulfils orders directly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {await Promise.all(
          brands.map(async (brand) => {
            const count = (await listProductsByBrand(brand.id)).length;
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
                      alt={`${brand.name} banner`}
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
                        alt={`${brand.name} logo`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">
                        <span className="truncate">{brand.name}</span>
                        {brandIsVerified(brand) && (
                          <BadgeCheck
                            className="h-4 w-4 shrink-0 text-primary"
                            strokeWidth={1.75}
                            aria-label="Verified brand"
                          />
                        )}
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
          }),
        )}
      </div>
    </PageContainer>
  );
}
