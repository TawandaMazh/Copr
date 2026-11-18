import { Hero } from "@/components/home/hero";
import { CategoryChips } from "@/components/home/category-chips";
import { JustListed } from "@/components/home/just-listed";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { SellCta } from "@/components/home/sell-cta";
import { TrendingCategories } from "@/components/home/trending-categories";
import { PageContainer } from "@/components/layout/page-container";
import {
  listCategoriesWithCounts,
  listFeaturedBrands,
  listNewProducts,
} from "@/lib/catalogue/service";

export default async function HomePage() {
  const [featuredBrands, newProducts, categories] = await Promise.all([
    listFeaturedBrands(),
    listNewProducts(12),
    listCategoriesWithCounts(),
  ]);

  return (
    <>
      <Hero />
      <PageContainer>
        <CategoryChips categories={categories} />
        <JustListed products={newProducts} />
        <SellCta />
        <FeaturedBrands brands={featuredBrands} />
        <TrendingCategories categories={categories} />
      </PageContainer>
    </>
  );
}
