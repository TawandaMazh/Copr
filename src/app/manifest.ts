import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "copr — Zambian fashion marketplace",
    short_name: "copr",
    description:
      "Shop local Zambian brands. Prices in Kwacha. Delivery in Lusaka.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F8FF",
    theme_color: "#1E5EFF",
    lang: "en-ZM",
    categories: ["shopping", "fashion"],
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
