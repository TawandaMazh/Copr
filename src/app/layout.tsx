import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "copr — Zambian fashion marketplace",
    template: "%s · copr",
  },
  description:
    "Shop dresses, chitenge, and city staples from local Zambian brands. Multi-vendor marketplace with Lusaka delivery.",
  metadataBase: new URL("https://copr.vercel.app"),
  openGraph: {
    title: "copr — Zambian fashion marketplace",
    description:
      "Local brands. Local shoppers. Fashion priced in Kwacha, delivered in Lusaka.",
    locale: "en_ZM",
    type: "website",
  },
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
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
