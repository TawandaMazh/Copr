# copr

Multi-vendor fashion marketplace for **Zambian brands** and shoppers — think ASOS, built for Lusaka. Brands hold their own stock and fulfil orders; copr takes a commission (default **15%**).

**Current: Phase 2** — Supabase schema + RLS, auth (email / phone OTP), cart, wishlist, Lusaka checkout with **MockProvider** escrow.

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** + tokens in `tailwind.config.ts` + `src/app/globals.css`
- **Supabase** — Postgres, Auth, Storage-ready, RLS on every table (`supabase/migrations/`)
- **Zod** + **React Hook Form** for auth & checkout
- **PaymentProvider** interface + **MockProvider** (MTN MoMo / Airtel / card later)
- Framer Motion, lucide-react, next-themes
- Deploy target: **Vercel**

---

## Quick start (no Supabase required)

Cart, wishlist, demo auth, and mock checkout work locally via persisted browser state.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
npm run typecheck
```

---

## Connect Supabase (optional for Phase 2 review)

1. Create a project at [supabase.com](https://supabase.com)
2. Set in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only
```

3. Apply migrations (SQL editor or CLI):

```bash
# CLI example
npx supabase db push
# or run in order:
# supabase/migrations/20260322000001_schema.sql
# supabase/migrations/20260322000002_rls.sql
# supabase/migrations/20260322000003_seed.sql
```

4. Auth → enable **Email** OTP and/or **Phone** OTP (+260)
5. Storage → create buckets `product-images` and `brand-assets` (Phase 3 uploads)

Without keys, Account → “Continue (demo)” creates a local shopper session.

---

## Environment variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_APP_URL` | App origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `PAYMENT_PROVIDER` | `mock` (default) |
| `NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT` | Default `15` |
| `NEXT_PUBLIC_DELIVERY_FEE_KWACHA` | Flat Lusaka fee (default `50`) |
| `NEXT_PUBLIC_DELIVERY_CITY` | `Lusaka` |

---

## Phase 2 flows

### Auth
- `/account` — email or phone OTP (Supabase) or **demo sign-in**
- Session middleware refreshes Supabase cookies when configured

### Cart & wishlist
- Glass **cart drawer** (nav bag icon)
- Heart on product cards / PDP → `/wishlist`
- State persisted in `localStorage` (`copr-commerce-v1`); ready to sync to `carts` / `wishlists` tables when logged into Supabase

### Checkout & escrow
1. Shopper pays → **MockProvider** marks payment **HELD**
2. Order splits into **sub_orders** per brand
3. Seller marks shipped (demo control on order page)
4. Shopper confirms delivery → funds **RELEASED** minus commission (payout record path for Phase 4)
5. Delivery: Lusaka areas + landmark, or **pickup points** (Levy / Manda Hill / Arcades)

Order statuses: `pending_payment` → `paid` → `processing` → `shipped` → `delivered` → `completed` (+ cancelled / refunded / disputed).

---

## Data model (Supabase)

`profiles`, `brands`, `products`, `product_images`, `product_variants`, `categories`, `carts`, `cart_items`, `orders`, `sub_orders`, `order_items`, `payments`, `payouts`, `reviews`, `wishlists`, `addresses`, `marketplace_settings`

Regenerate seed SQL from TS catalogue:

```bash
node scripts/generate-seed-sql.mjs
```

---

## Folder structure

```
supabase/migrations/     # schema, RLS, seed
src/
  app/                   # shop, checkout, orders, wishlist, account…
  components/            # cart, checkout, auth, orders…
  lib/supabase/          # browser + server clients, middleware
  lib/payments/          # PaymentProvider + MockProvider
  lib/commerce/          # totals, placeOrder, Lusaka constants
  stores/commerce-store.ts
  data/                  # Phase 1 catalogue (still used for browse)
```

---

## Roadmap

1. ~~Phase 1 — Design system + catalogue~~
2. ~~Phase 2 — Supabase schema/RLS, auth, cart, wishlist, MockProvider checkout~~ ← *you are here*
3. **Phase 3** — Seller dashboard (products, orders, earnings)
4. **Phase 4** — Admin (commission, payouts, moderation, analytics, reviews)
5. **Phase 5** — Performance, SEO, a11y, empty/error polish

---

## License

Private — Tawanda Mazhandu / copr.
