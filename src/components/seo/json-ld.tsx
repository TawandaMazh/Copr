export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "copr",
    url: siteUrl,
    description:
      "Multi-vendor fashion marketplace for Zambian brands and shoppers.",
    areaServed: {
      "@type": "City",
      name: "Lusaka",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lusaka",
      addressCountry: "ZM",
    },
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "copr",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(input: {
  siteUrl: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  brandName: string;
  price: number;
  currency?: string;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    offers: {
      "@type": "Offer",
      url: `${input.siteUrl}/shop/${input.slug}`,
      priceCurrency: input.currency ?? "ZMW",
      price: input.price.toFixed(2),
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
