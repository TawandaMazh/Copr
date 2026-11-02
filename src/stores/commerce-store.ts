"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartLine,
  OrderRecord,
  SavedAddress,
  ShopperProfile,
} from "@/types/commerce";
import { placeOrder } from "@/lib/commerce/checkout";
import type { CheckoutFormValues } from "@/lib/validations/checkout";
import { formatPhoneZM } from "@/lib/format";

interface CommerceState {
  user: ShopperProfile | null;
  cart: CartLine[];
  wishlist: string[];
  addresses: SavedAddress[];
  orders: OrderRecord[];
  cartOpen: boolean;

  setCartOpen: (open: boolean) => void;
  signInDemo: (input: {
    fullName: string;
    email?: string;
    phone?: string;
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
  getOrder: (id: string) => OrderRecord | undefined;
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      wishlist: [],
      addresses: [],
      orders: [],
      cartOpen: false,

      setCartOpen: (open) => set({ cartOpen: open }),

      signInDemo: ({ fullName, email, phone }) => {
        set({
          user: {
            id: `demo_${newId("user")}`,
            fullName,
            email,
            phone: phone ? formatPhoneZM(phone) : undefined,
            role: "shopper",
            isDemo: true,
          },
        });
      },

      signOut: () => set({ user: null }),

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

        const order = await placeOrder({
          userId: user.id,
          lines: state.cart,
          form: {
            ...form,
            phone: formatPhoneZM(form.phone),
          },
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
        // Fire-and-forget mock escrow release for this sub-order's seller amount
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

        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const subOrders = order.subOrders.map((sub) => {
              if (sub.id !== subOrderId) return sub;
              return {
                ...sub,
                status: "completed" as const,
                deliveredAt: sub.deliveredAt ?? now,
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
              ...order,
              subOrders,
              status: allDone ? ("completed" as const) : order.status,
              updatedAt: now,
              payment: order.payment
                ? {
                    ...order.payment,
                    status: allDone
                      ? ("released" as const)
                      : order.payment.status,
                    releasedAt: allDone ? now : order.payment.releasedAt,
                  }
                : order.payment,
            };
          }),
        }));
      },

      markShipped: (orderId, subOrderId, note) => {
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const subOrders = order.subOrders.map((sub) =>
              sub.id === subOrderId
                ? {
                    ...sub,
                    status: "shipped" as const,
                    shippedAt: now,
                    trackingNote: note,
                  }
                : sub,
            );
            return {
              ...order,
              subOrders,
              status: "shipped",
              updatedAt: now,
            };
          }),
        }));
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "copr-commerce-v1",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        addresses: state.addresses,
        orders: state.orders,
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
