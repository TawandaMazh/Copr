import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "copr — buy & sell anything",
    short_name: "copr",
    description:
      "List anything and shop unique finds. Prices in Kwacha. Delivery in Lusaka.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F8FF",
    theme_color: "#1E5EFF",
    lang: "en-ZM",
    categories: ["shopping", "lifestyle"],
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
