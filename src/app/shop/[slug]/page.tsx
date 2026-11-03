import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMinPrice } from "@/data/products";
import {
  getProductBySlugService,
  listBrands,
  listProductSlugs,
  listProductsByBrand,
} from "@/lib/catalogue/service";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/ui/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { JsonLd, productJsonLd } from "@/components/seo/json-ld";
import { getPublishedReviewSummary } from "@/lib/commerce/review-summary";
import { getSiteUrl } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await listProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugService(slug);
  if (!product) return { title: "Product not found" };
  const brands = await listBrands();
  const brand = brands.find((b) => b.id === product.brandId);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · ${brand?.name ?? "copr"}`,
      images: product.images.slice(0, 1),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1),
    },
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugService(slug);
  if (!product) notFound();

  const brands = await listBrands();
  const brand = brands.find((b) => b.id === product.brandId);
  const related = (await listProductsByBrand(product.brandId))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const inStock = product.variants.some((v) => v.stock > 0);
  const reviewSummary = await getPublishedReviewSummary(product.id);

  return (
    <PageContainer className="space-y-16">
      <JsonLd
        data={productJsonLd({
          siteUrl: getSiteUrl(),
          name: product.name,
          description: product.description,
          slug: product.slug,
          image: product.images[0] ?? "",
          brandName: brand?.name ?? "copr",
          price: getMinPrice(product),
          inStock,
        })}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
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
        <ProductGallery
          images={product.images}
          name={product.name}
          brandName={brand?.name}
          colour={product.variants[0]?.colour}
        />
        <ProductPurchase product={product} reviewSummary={reviewSummary} />
      </div>

      <ProductReviews productId={product.id} productName={product.name} />

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
