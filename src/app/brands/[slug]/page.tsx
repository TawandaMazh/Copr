import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { brands, getBrandBySlug } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { ProductCard } from "@/components/ui/product-card";
import { GlassCard } from "@/components/ui/glass-card";
import { PageContainer } from "@/components/layout/page-container";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand not found" };
  return {
    title: brand.name,
    description: brand.story,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(brand.id);

  return (
    <>
      <div className="relative mb-10 w-full overflow-hidden">
        <div className="relative h-56 w-full sm:h-80">
          <Image
            src={brand.banner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-6xl items-end gap-4 px-4 pb-6 sm:pb-8">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-white/40 sm:h-20 sm:w-20">
              <Image
                src={brand.logo}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {brand.name}
              </h1>
              <p className="text-sm text-white/75 sm:text-base">
                {brand.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer className="space-y-10 !pt-0">
        <GlassCard className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Our story · {brand.location} · Est. {brand.foundedYear}
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground sm:text-lg">
            {brand.story}
          </p>
        </GlassCard>

        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Products ({products.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
