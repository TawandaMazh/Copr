"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  useCartCount,
  useCommerceStore,
  useWishlistCount,
} from "@/stores/commerce-store";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/sell", label: "Sell on copr" },
];

export function GlassNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const setCartOpen = useCommerceStore((s) => s.setCartOpen);
  const user = useCommerceStore((s) => s.user);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-250 sm:px-4",
          scrolled || open ? "glass-strong shadow-glass-lg" : "glass",
        )}
        aria-label="Primary"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </Button>
          <Link
            href="/"
            className="rounded-lg px-2 text-xl font-semibold tracking-tight text-foreground focus-ring"
          >
            copr
          </Link>
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-ring",
                    active
                      ? "bg-primary/10 text-primary dark:text-sky"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/shop" aria-label="Search products">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open bag"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="ml-1 hidden max-w-[9rem] truncate sm:inline-flex"
            asChild
          >
            <Link href="/account">
              {mounted && user ? user.fullName.split(" ")[0] : "Account"}
            </Link>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl p-4 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/wishlist"
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                >
                  Account
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
