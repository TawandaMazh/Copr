import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getProductsByBrand,
  products,
} from "@/data/products";
import { getBrandById } from "@/data/brands";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductCard } from "@/components/ui/product-card";
import { PageContainer } from "@/components/layout/page-container";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const brand = getBrandById(product.brandId);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · ${brand?.name ?? "copr"}`,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const brand = getBrandById(product.brandId);
  const related = getProductsByBrand(product.brandId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <PageContainer className="space-y-16">
      <nav className="text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2">/</span>
        {brand && (
          <>
            <Link href={`/brands/${brand.slug}`} className="hover:text-primary">
              {brand.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchase product={product} />
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            More from {brand?.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
