import type { MetadataRoute } from "next";
import { listBrandSlugs, listProducts } from "@/lib/catalogue/service";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/brands",
    "/sell",
    "/delivery",
    "/returns",
    "/wishlist",
    "/account",
    "/checkout",
    "/orders",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));

  const [brandSlugs, products] = await Promise.all([
    listBrandSlugs(),
    listProducts(),
  ]);

  const brandRoutes: MetadataRoute.Sitemap = brandSlugs.map((slug) => ({
    url: `${base}/brands/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/shop/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...brandRoutes, ...productRoutes];
}
