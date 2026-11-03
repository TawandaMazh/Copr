"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchDialog } from "@/components/shop/search-dialog";
import { presenceExit, usePrefersReducedMotion } from "@/lib/motion";
import {
  useCartCount,
  useCommerceStore,
  useWishlistCount,
} from "@/stores/commerce-store";

const baseLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/sell", label: "Sell on copr" },
];

export function GlassNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [panelTop, setPanelTop] = React.useState(72);
  const navRef = React.useRef<HTMLElement>(null);
  const setCartOpen = useCommerceStore((s) => s.setCartOpen);
  const user = useCommerceStore((s) => s.user);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const reduced = usePrefersReducedMotion();
  const mobileSearchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (mobileSearch) mobileSearchRef.current?.focus();
  }, [mobileSearch]);

  const measurePanelTop = React.useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPanelTop(Math.round(rect.bottom + 8));
  }, []);

  React.useEffect(() => {
    measurePanelTop();
    window.addEventListener("resize", measurePanelTop);
    window.addEventListener("scroll", measurePanelTop, { passive: true });
    return () => {
      window.removeEventListener("resize", measurePanelTop);
      window.removeEventListener("scroll", measurePanelTop);
    };
  }, [measurePanelTop]);

  React.useEffect(() => {
    if (open || mobileSearch) measurePanelTop();
  }, [open, mobileSearch, measurePanelTop]);

  React.useEffect(() => {
    if (!(open || mobileSearch)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mobileSearch]);

  const links = React.useMemo(() => {
    const next = [...baseLinks];
    if (user?.role === "seller" || user?.role === "admin") {
      next.push({ href: "/seller", label: "Seller" });
    }
    if (user?.role === "admin") {
      next.push({ href: "/admin", label: "Admin" });
    }
    return next;
  }, [user?.role]);

  const submitSearch = (value: string) => {
    const q = value.trim();
    if (!q) {
      setSearchOpen(true);
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setMobileSearch(false);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        ref={navRef}
        className={cn(
          "relative z-[70] mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full px-3 py-2 transition-all duration-250 sm:gap-3 sm:px-4",
          scrolled || open || mobileSearch
            ? "glass-strong shadow-glass-lg"
            : "glass",
        )}
        aria-label="Primary"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => {
              setOpen((v) => !v);
              setMobileSearch(false);
            }}
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

        <form
          className="relative hidden min-w-0 flex-1 max-w-xs md:block lg:max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
        >
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search brands & styles"
            aria-label="Search products"
            className="h-10 w-full rounded-full border border-border-subtle bg-white/50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:bg-navy/40"
          />
        </form>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search products"
            aria-expanded={mobileSearch}
            onClick={() => {
              setMobileSearch((v) => !v);
              setOpen(false);
              setSearchOpen(true);
            }}
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <ThemeToggle />
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={cn(
              "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all focus-ring hover:bg-white/50 dark:hover:bg-navy/40",
            )}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {mounted && wishlistCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all focus-ring hover:bg-white/50 dark:hover:bg-navy/40"
            aria-label="Open bag"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {mounted && cartCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
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
        {(open || mobileSearch) && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={presenceExit(reduced, { opacity: 0 })}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="fixed inset-0 z-[60] bg-navy/35 backdrop-blur-[3px] lg:hidden"
            onClick={() => {
              setOpen(false);
              setMobileSearch(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSearch && (
          <motion.form
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={presenceExit(reduced, { opacity: 0, y: -6 })}
            transition={{ duration: reduced ? 0 : 0.2 }}
            style={{ top: panelTop }}
            className="glass-strong fixed inset-x-3 z-[70] mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-2 shadow-glass-lg md:hidden sm:inset-x-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(query);
            }}
          >
            <Search
              className="h-4 w-4 shrink-0 text-muted-foreground"
              strokeWidth={1.5}
            />
            <input
              ref={mobileSearchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands & styles"
              aria-label="Search products"
              className="h-10 flex-1 bg-transparent text-sm outline-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close search"
              onClick={() => setMobileSearch(false)}
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={presenceExit(reduced, { opacity: 0, y: -8 })}
            transition={{
              duration: reduced ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ top: panelTop }}
            className="glass-strong fixed inset-x-3 z-[70] mx-auto max-w-6xl overflow-hidden rounded-3xl p-4 shadow-glass-lg lg:hidden sm:inset-x-4"
            id="mobile-nav"
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
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                >
                  <Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  Wishlist
                  {mounted && wishlistCount > 0 ? ` (${wishlistCount})` : ""}
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
              <li>
                <Link
                  href="/delivery"
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white/40 dark:hover:bg-navy/40"
                >
                  Delivery
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
