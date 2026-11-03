/** Canonical public origin for SEO, sitemap, and Open Graph. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://copr-phi.vercel.app";
}

export const SITE_NAME = "copr";
export const SITE_TAGLINE = "Cop local. Wear Zambian.";
export const SITE_DESCRIPTION =
  "Shop dresses, chitenge, and city staples from local Zambian brands. Multi-vendor marketplace with Lusaka delivery — hope you’re happy with what you cop’d.";
