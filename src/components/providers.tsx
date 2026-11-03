"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthBootstrap />
      {children}
      <CartDrawer />
    </ThemeProvider>
  );
}
