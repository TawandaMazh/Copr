import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/site-shell";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/seo/json-ld";
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "copr" }],
  creator: "copr",
  keywords: [
    "Zambia",
    "Lusaka",
    "fashion",
    "marketplace",
    "chitenge",
    "Kwacha",
    "Zambian brands",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Local brands. Local shoppers. Fashion priced in Kwacha, delivered in Lusaka.",
    locale: "en_ZM",
    type: "website",
    url: siteUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "copr — Zambian fashion marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Local brands. Local shoppers. Fashion priced in Kwacha, delivered in Lusaka.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F8FF" },
    { media: "(prefers-color-scheme: dark)", color: "#050A14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZM" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <JsonLd data={organizationJsonLd(siteUrl)} />
        <JsonLd data={websiteJsonLd(siteUrl)} />
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
