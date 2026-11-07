"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCommerceStore } from "@/stores/commerce-store";
import { resolveBrand, resolveProduct } from "@/lib/catalogue";
import { PriceTag } from "@/components/ui/price-tag";
import { Button } from "@/components/ui/button";
import { Slogan } from "@/components/brand/slogan";
import { SLOGANS } from "@/data/slogans";
import { DELIVERY_FEE_KWACHA } from "@/lib/commerce/constants";
import { resolveCartTotals } from "@/lib/commerce/checkout";
import { presenceExit, usePrefersReducedMotion } from "@/lib/motion";

export function CartDrawer() {
  const open = useCommerceStore((s) => s.cartOpen);
  const setCartOpen = useCommerceStore((s) => s.setCartOpen);
  const cart = useCommerceStore((s) => s.cart);
  const sellerProducts = useCommerceStore((s) => s.sellerProducts);
  const sellerBrand = useCommerceStore((s) => s.sellerBrand);
  const platformBrands = useCommerceStore((s) => s.platformBrands);
  const updateCartQuantity = useCommerceStore((s) => s.updateCartQuantity);
  const removeFromCart = useCommerceStore((s) => s.removeFromCart);
  const reduced = usePrefersReducedMotion();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const { lines, subtotal, deliveryFee, total } = resolveCartTotals(
    cart,
    "delivery",
    (id) => resolveProduct(id, sellerProducts),
    (id) => resolveBrand(id, sellerBrand, platformBrands),
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setCartOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            className="fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={presenceExit(reduced, { opacity: 0 })}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={reduced ? { x: 0 } : { x: "100%" }}
            animate={{ x: 0 }}
            exit={presenceExit(reduced, { x: "100%" })}
            transition={{
              duration: reduced ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-strong fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-glass-lg"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold tracking-tight">Bag</h2>
                <span className="text-sm text-muted-foreground">
                  ({cart.reduce((n, l) => n + l.quantity, 0)})
                </span>
              </div>
              <Button
                ref={closeRef}
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="font-medium">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground">
                    {SLOGANS.emptyBag}
                  </p>
                  <Button
                    onClick={() => setCartOpen(false)}
                    asChild
                    variant="secondary"
                  >
                    <Link href="/shop">Continue shopping</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => {
                    const product = line.product;
                    const brand = line.brand;
                    return (
                      <li key={line.variantId} className="flex gap-3">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-ice dark:bg-navy/40"
                          onClick={() => setCartOpen(false)}
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {brand?.name}
                          </p>
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {line.variant.colour} · {line.variant.size}
                          </p>
                          <PriceTag amount={line.unitPrice} size="sm" />
                          <div className="flex items-center gap-2 pt-1">
                            <div className="inline-flex items-center rounded-full glass">
                              <button
                                type="button"
                                className="px-2 py-1"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  updateCartQuantity(
                                    line.variantId,
                                    line.quantity - 1,
                                  )
                                }
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                              <span className="min-w-6 text-center text-sm">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-2 py-1"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  updateCartQuantity(
                                    line.variantId,
                                    line.quantity + 1,
                                  )
                                }
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove item"
                              onClick={() => removeFromCart(line.variantId)}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="space-y-3 border-t border-border-subtle px-5 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceTag amount={subtotal} size="sm" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery (Lusaka from)
                  </span>
                  <PriceTag amount={deliveryFee || DELIVERY_FEE_KWACHA} size="sm" />
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <PriceTag amount={total || subtotal + DELIVERY_FEE_KWACHA} />
                </div>
                <Slogan
                  id="cartCheckout"
                  className="text-center text-xs text-muted-foreground"
                />
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={() => setCartOpen(false)}>
                    Checkout
                  </Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
