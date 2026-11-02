"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartLine,
  OrderRecord,
  PayoutRecord,
  SavedAddress,
  ShopperProfile,
} from "@/types/commerce";
import type { SellerBrand } from "@/types/seller";
import type { Product, ProductVariant } from "@/types";
import { placeOrder } from "@/lib/commerce/checkout";
import { resolveProduct } from "@/lib/catalogue";
import type { CheckoutFormValues } from "@/lib/validations/checkout";
import type {
  BrandApplyValues,
  BrandProfileValues,
  ProductFormParsed,
} from "@/lib/validations/seller";
import { formatPhoneZM } from "@/lib/format";
import { brands as seedBrands, getBrandById } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { DEFAULT_COMMISSION_PERCENT } from "@/lib/commerce/constants";

export type SellerProduct = Product & { isPublished: boolean };

interface CommerceState {
  user: ShopperProfile | null;
  cart: CartLine[];
  wishlist: string[];
  addresses: SavedAddress[];
  orders: OrderRecord[];
  payouts: PayoutRecord[];
  cartOpen: boolean;

  /** Seller brand owned by the signed-in user (demo / local). */
  sellerBrand: SellerBrand | null;
  sellerProducts: SellerProduct[];

  setCartOpen: (open: boolean) => void;
  signInDemo: (input: {
    fullName: string;
    email?: string;
    phone?: string;
    role?: ShopperProfile["role"];
  }) => void;
  signOut: () => void;
  setUserFromSupabase: (user: ShopperProfile | null) => void;

  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  saveAddress: (address: Omit<SavedAddress, "id"> & { id?: string }) => void;
  removeAddress: (id: string) => void;

  checkout: (form: CheckoutFormValues) => Promise<OrderRecord>;
  confirmDelivery: (orderId: string, subOrderId: string) => void;
  markShipped: (orderId: string, subOrderId: string, note?: string) => void;
  updateSubOrderStatus: (
    orderId: string,
    subOrderId: string,
    status: OrderRecord["subOrders"][number]["status"],
    note?: string,
  ) => void;
  getOrder: (id: string) => OrderRecord | undefined;

  applyAsSeller: (values: BrandApplyValues) => SellerBrand;
  claimDemoBrand: (brandId: string) => SellerBrand | null;
  updateSellerBrand: (values: BrandProfileValues) => void;
  upsertSellerProduct: (
    input: ProductFormParsed,
    productId?: string,
  ) => SellerProduct;
  deleteSellerProduct: (productId: string) => void;
  getSellerOrders: () => Array<{
    order: OrderRecord;
    subOrder: OrderRecord["subOrders"][number];
  }>;
  getSellerEarnings: () => {
    available: number;
    pending: number;
    paidOut: number;
    lifetimeGross: number;
    lifetimeCommission: number;
    orderCount: number;
  };
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop&q=80";
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80";

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      wishlist: [],
      addresses: [],
      orders: [],
      payouts: [],
      cartOpen: false,
      sellerBrand: null,
      sellerProducts: [],

      setCartOpen: (open) => set({ cartOpen: open }),

      signInDemo: ({ fullName, email, phone, role = "shopper" }) => {
        set({
          user: {
            id: `demo_${newId("user")}`,
            fullName,
            email,
            phone: phone ? formatPhoneZM(phone) : undefined,
            role,
            isDemo: true,
          },
        });
      },

      signOut: () =>
        set({
          user: null,
          // Keep brand/products so reclaiming is easy; clear on explicit reset only
        }),

      setUserFromSupabase: (user) => set({ user }),

      addToCart: (productId, variantId, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((l) => l.variantId === variantId);
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                l.variantId === variantId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
              cartOpen: true,
            };
          }
          return {
            cart: [...state.cart, { productId, variantId, quantity }],
            cartOpen: true,
          };
        });
      },

      updateCartQuantity: (variantId, quantity) => {
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((l) => l.variantId !== variantId)
              : state.cart.map((l) =>
                  l.variantId === variantId ? { ...l, quantity } : l,
                ),
        }));
      },

      removeFromCart: (variantId) =>
        set((state) => ({
          cart: state.cart.filter((l) => l.variantId !== variantId),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      isWishlisted: (productId) => get().wishlist.includes(productId),

      saveAddress: (address) =>
        set((state) => {
          const id = address.id ?? newId("addr");
          const next: SavedAddress = {
            id,
            label: address.label,
            area: address.area,
            neighbourhood: address.neighbourhood,
            landmark: address.landmark,
            phone: formatPhoneZM(address.phone),
            isDefault: address.isDefault ?? state.addresses.length === 0,
            isPickupPoint: address.isPickupPoint ?? false,
          };
          const without = state.addresses.filter((a) => a.id !== id);
          const normalized = next.isDefault
            ? without.map((a) => ({ ...a, isDefault: false }))
            : without;
          return { addresses: [...normalized, next] };
        }),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      checkout: async (form) => {
        const state = get();
        let user = state.user;
        if (!user) {
          user = {
            id: `demo_${newId("user")}`,
            fullName: form.fullName,
            phone: formatPhoneZM(form.phone),
            role: "shopper",
            isDemo: true,
          };
          set({ user });
        }

        // Ensure placeOrder can resolve seller-created products via seed fallback:
        // temporarily patch missing seed lookups by validating cart lines exist in merge.
        for (const line of state.cart) {
          const product = resolveProduct(line.productId, state.sellerProducts);
          if (!product) throw new Error("A bag item is no longer available");
        }

        const brand = get().sellerBrand;
        const order = await placeOrder({
          userId: user.id,
          lines: state.cart,
          form: {
            ...form,
            phone: formatPhoneZM(form.phone),
          },
          productResolver: (id) =>
            resolveProduct(id, get().sellerProducts),
          brandResolver: (id) =>
            (brand?.id === id ? brand : getBrandById(id)) ?? undefined,
        });

        set((s) => ({
          orders: [order, ...s.orders],
          cart: [],
          cartOpen: false,
          addresses:
            form.deliveryMethod === "delivery"
              ? s.addresses.some(
                  (a) =>
                    a.area === form.area &&
                    a.neighbourhood === form.neighbourhood,
                )
                ? s.addresses
                : [
                    ...s.addresses,
                    {
                      id: newId("addr"),
                      area: form.area!,
                      neighbourhood: form.neighbourhood!,
                      landmark: form.landmark,
                      phone: formatPhoneZM(form.phone),
                      isDefault: s.addresses.length === 0,
                      isPickupPoint: false,
                    },
                  ]
              : s.addresses,
        }));

        return order;
      },

      confirmDelivery: (orderId, subOrderId) => {
        const now = new Date().toISOString();
        void import("@/lib/payments").then(({ getPaymentProvider }) => {
          const order = get().orders.find((o) => o.id === orderId);
          const sub = order?.subOrders.find((s) => s.id === subOrderId);
          if (order?.payment && sub) {
            void getPaymentProvider().release({
              providerRef: order.payment.providerRef,
              orderId,
              amount: sub.sellerAmount,
            });
          }
        });

        set((state) => {
          const order = state.orders.find((o) => o.id === orderId);
          const sub = order?.subOrders.find((s) => s.id === subOrderId);
          const newPayout: PayoutRecord | null =
            sub && sub.status !== "completed"
              ? {
                  id: newId("payout"),
                  brandId: sub.brandId,
                  subOrderId: sub.id,
                  amount: sub.sellerAmount,
                  commissionAmount: sub.commissionAmount,
                  status: "pending",
                  createdAt: now,
                }
              : null;

          return {
            payouts: newPayout
              ? [newPayout, ...state.payouts]
              : state.payouts,
            orders: state.orders.map((ord) => {
              if (ord.id !== orderId) return ord;
              const subOrders = ord.subOrders.map((s) => {
                if (s.id !== subOrderId) return s;
                return {
                  ...s,
                  status: "completed" as const,
                  deliveredAt: s.deliveredAt ?? now,
                  completedAt: now,
                };
              });
              const allDone = subOrders.every(
                (s) =>
                  s.status === "completed" ||
                  s.status === "cancelled" ||
                  s.status === "refunded",
              );
              return {
                ...ord,
                subOrders,
                status: allDone ? ("completed" as const) : ord.status,
                updatedAt: now,
                payment: ord.payment
                  ? {
                      ...ord.payment,
                      status: allDone
                        ? ("released" as const)
                        : ord.payment.status,
                      releasedAt: allDone ? now : ord.payment.releasedAt,
                    }
                  : ord.payment,
              };
            }),
          };
        });
      },

      markShipped: (orderId, subOrderId, note) => {
        get().updateSubOrderStatus(orderId, subOrderId, "shipped", note);
      },

      updateSubOrderStatus: (orderId, subOrderId, status, note) => {
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const subOrders = order.subOrders.map((sub) => {
              if (sub.id !== subOrderId) return sub;
              return {
                ...sub,
                status,
                trackingNote: note ?? sub.trackingNote,
                shippedAt:
                  status === "shipped" ? now : sub.shippedAt,
                deliveredAt:
                  status === "delivered" || status === "completed"
                    ? sub.deliveredAt ?? now
                    : sub.deliveredAt,
                completedAt:
                  status === "completed" ? now : sub.completedAt,
              };
            });
            return {
              ...order,
              subOrders,
              status:
                status === "processing" || status === "shipped"
                  ? status
                  : order.status,
              updatedAt: now,
            };
          }),
        }));
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),

      applyAsSeller: (values) => {
        const state = get();
        let user = state.user;
        if (!user) {
          user = {
            id: `demo_${newId("user")}`,
            fullName: values.fullName,
            email: values.contactEmail,
            phone: formatPhoneZM(values.contactPhone),
            role: "seller",
            isDemo: true,
          };
        } else {
          user = { ...user, role: "seller", fullName: values.fullName };
        }

        const brand: SellerBrand = {
          id: `brand_${newId("seller")}`,
          ownerId: user.id,
          name: values.name,
          slug: slugify(values.name),
          tagline: values.tagline,
          story: values.story,
          location: values.location,
          logo: values.logo || DEFAULT_LOGO,
          banner: values.banner || DEFAULT_BANNER,
          featured: false,
          foundedYear: values.foundedYear,
          status: "approved", // demo auto-approve; Phase 4 admin gate
          contactEmail: values.contactEmail,
          contactPhone: formatPhoneZM(values.contactPhone),
          updatedAt: new Date().toISOString(),
        };

        set({ user, sellerBrand: brand });
        return brand;
      },

      claimDemoBrand: (brandId) => {
        const seed = seedBrands.find((b) => b.id === brandId);
        if (!seed) return null;
        const state = get();
        let user = state.user;
        if (!user) {
          user = {
            id: `demo_${newId("seller")}`,
            fullName: `${seed.name} Seller`,
            role: "seller",
            isDemo: true,
          };
        } else {
          user = { ...user, role: "seller" };
        }

        const brand: SellerBrand = {
          ...seed,
          ownerId: user.id,
          status: "approved",
          contactEmail: user.email,
          contactPhone: user.phone,
          updatedAt: new Date().toISOString(),
        };

        // Seed seller product overlays from catalogue for editing
        const existing = getProductsByBrand(brandId).map((p) => ({
          ...p,
          isPublished: true,
        }));

        set({
          user,
          sellerBrand: brand,
          sellerProducts: [
            ...existing,
            ...state.sellerProducts.filter((p) => p.brandId !== brandId),
          ],
        });
        return brand;
      },

      updateSellerBrand: (values) => {
        const brand = get().sellerBrand;
        if (!brand) return;
        set({
          sellerBrand: {
            ...brand,
            name: values.name,
            slug: slugify(values.name),
            tagline: values.tagline,
            story: values.story,
            location: values.location,
            foundedYear: values.foundedYear,
            logo: values.logo || brand.logo,
            banner: values.banner || brand.banner,
            contactEmail: values.contactEmail || brand.contactEmail,
            contactPhone: values.contactPhone
              ? formatPhoneZM(values.contactPhone)
              : brand.contactPhone,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      upsertSellerProduct: (input, productId) => {
        const brand = get().sellerBrand;
        if (!brand) throw new Error("No seller brand");

        const id = productId ?? `prod_seller_${newId("p")}`;
        const slugBase = slugify(input.name);
        const slug = productId
          ? get().sellerProducts.find((p) => p.id === productId)?.slug ??
            slugBase
          : `${slugBase}-${id.slice(-4)}`;

        const variants: ProductVariant[] = input.variants.map((v, i) => ({
          id: `${id}-var-${i}-${slugify(v.colour)}-${slugify(v.size)}`,
          size: v.size,
          colour: v.colour,
          stock: v.stock,
          price: v.price,
          sku: `COPR-S-${id.slice(-6).toUpperCase()}-${v.colour.slice(0, 3).toUpperCase()}-${v.size}`,
        }));

        const product: SellerProduct = {
          id,
          slug,
          name: input.name,
          description: input.description,
          brandId: brand.id,
          categorySlug: input.categorySlug,
          images: input.images,
          variants,
          tags: input.tags,
          featured: input.featured,
          trending: false,
          isNew: true,
          rating: 0,
          reviewCount: 0,
          createdAt:
            get().sellerProducts.find((p) => p.id === id)?.createdAt ??
            new Date().toISOString(),
          isPublished: input.isPublished,
        };

        set((state) => ({
          sellerProducts: [
            product,
            ...state.sellerProducts.filter((p) => p.id !== id),
          ],
        }));

        return product;
      },

      deleteSellerProduct: (productId) =>
        set((state) => ({
          sellerProducts: state.sellerProducts.filter((p) => p.id !== productId),
        })),

      getSellerOrders: () => {
        const brandId = get().sellerBrand?.id;
        if (!brandId) return [];
        const rows: Array<{
          order: OrderRecord;
          subOrder: OrderRecord["subOrders"][number];
        }> = [];
        for (const order of get().orders) {
          for (const sub of order.subOrders) {
            if (sub.brandId === brandId) {
              rows.push({ order, subOrder: sub });
            }
          }
        }
        return rows.sort(
          (a, b) =>
            +new Date(b.order.createdAt) - +new Date(a.order.createdAt),
        );
      },

      getSellerEarnings: () => {
        const brandId = get().sellerBrand?.id;
        if (!brandId) {
          return {
            available: 0,
            pending: 0,
            paidOut: 0,
            lifetimeGross: 0,
            lifetimeCommission: 0,
            orderCount: 0,
          };
        }
        const rows = get().getSellerOrders();
        let available = 0;
        let pending = 0;
        let lifetimeGross = 0;
        let lifetimeCommission = 0;

        for (const { subOrder } of rows) {
          lifetimeGross += subOrder.subtotal;
          lifetimeCommission += subOrder.commissionAmount;
          if (subOrder.status === "completed") {
            available += subOrder.sellerAmount;
          } else if (
            subOrder.status === "paid" ||
            subOrder.status === "processing" ||
            subOrder.status === "shipped" ||
            subOrder.status === "delivered"
          ) {
            pending += subOrder.sellerAmount;
          }
        }

        const paidOut = get()
          .payouts.filter(
            (p) => p.brandId === brandId && p.status === "paid",
          )
          .reduce((s, p) => s + p.amount, 0);

        // Available = completed seller amounts not yet marked paid
        const pendingPayoutIds = new Set(
          get()
            .payouts.filter(
              (p) =>
                p.brandId === brandId &&
                (p.status === "pending" || p.status === "processing"),
            )
            .map((p) => p.subOrderId),
        );
        const paidIds = new Set(
          get()
            .payouts.filter(
              (p) => p.brandId === brandId && p.status === "paid",
            )
            .map((p) => p.subOrderId),
        );

        available = rows
          .filter(
            ({ subOrder }) =>
              subOrder.status === "completed" && !paidIds.has(subOrder.id),
          )
          .reduce((s, { subOrder }) => s + subOrder.sellerAmount, 0);

        // pending escrow still held
        pending = rows
          .filter(
            ({ subOrder }) =>
              !["completed", "cancelled", "refunded"].includes(subOrder.status),
          )
          .reduce((s, { subOrder }) => s + subOrder.sellerAmount, 0);

        void pendingPayoutIds;
        void DEFAULT_COMMISSION_PERCENT;

        return {
          available,
          pending,
          paidOut,
          lifetimeGross,
          lifetimeCommission,
          orderCount: rows.length,
        };
      },
    }),
    {
      name: "copr-commerce-v2",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        addresses: state.addresses,
        orders: state.orders,
        payouts: state.payouts,
        sellerBrand: state.sellerBrand,
        sellerProducts: state.sellerProducts,
      }),
    },
  ),
);

export function useCartCount() {
  return useCommerceStore((s) =>
    s.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
}

export function useWishlistCount() {
  return useCommerceStore((s) => s.wishlist.length);
}
