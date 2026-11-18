/** Canonical public origin for SEO, sitemap, and Open Graph. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://copr-phi.vercel.app";
}

export const SITE_NAME = "copr";
export const SITE_TAGLINE = "Buy & sell anything";
export const SITE_DESCRIPTION =
  "List anything, discover unique finds, and buy or sell with people across Zambia. Priced in Kwacha, with Lusaka delivery.";
