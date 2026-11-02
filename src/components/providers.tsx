"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <CartDrawer />
    </ThemeProvider>
  );
}
