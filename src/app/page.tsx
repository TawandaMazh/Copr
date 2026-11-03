import { Hero } from "@/components/home/hero";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { NewIn } from "@/components/home/new-in";
import { TrendingCategories } from "@/components/home/trending-categories";
import { PageContainer } from "@/components/layout/page-container";
import {
  getCategoriesWithCounts,
  getFeaturedBrands,
  getNewProducts,
} from "@/data";

export default function HomePage() {
  const featuredBrands = getFeaturedBrands();
  const newProducts = getNewProducts();
  const categories = getCategoriesWithCounts();

  return (
    <>
      <Hero />
      <PageContainer>
        <FeaturedBrands brands={featuredBrands} />
        <NewIn products={newProducts} />
        <TrendingCategories categories={categories} />
      </PageContainer>
    </>
  );
}
