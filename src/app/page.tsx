import { Hero } from "@/components/home/hero";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { NewIn } from "@/components/home/new-in";
import { TrendingCategories } from "@/components/home/trending-categories";
import { SloganRail } from "@/components/brand/slogan-rail";
import { PageContainer } from "@/components/layout/page-container";
import {
  listCategoriesWithCounts,
  listFeaturedBrands,
  listNewProducts,
} from "@/lib/catalogue/service";

export default async function HomePage() {
  const [featuredBrands, newProducts, categories] = await Promise.all([
    listFeaturedBrands(),
    listNewProducts(8),
    listCategoriesWithCounts(),
  ]);

  return (
    <>
      <Hero />
      <SloganRail tone="soft" className="-mt-0" />
      <PageContainer>
        <FeaturedBrands brands={featuredBrands} />
        <NewIn products={newProducts} />
        <TrendingCategories categories={categories} />
      </PageContainer>
    </>
  );
}
