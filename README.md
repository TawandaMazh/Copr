# copr

Multi-vendor fashion marketplace for **Zambian brands** and shoppers — think ASOS, built for Lusaka. Brands hold their own stock and fulfil orders; copr takes a commission (default **15%**).

**Phase 1 (this PR):** project setup, design system, layout, home, shop listing, product & brand pages, seed catalogue (10 brands · 60 products).

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** + design tokens in `tailwind.config.ts` + `src/app/globals.css`
- **shadcn-style** primitives (CVA + Radix Slot) — `Button`, `GlassCard`, `GlassNav`, `ProductCard`, `PriceTag`
- **Framer Motion** for subtle fade/slide motion
- **next/image** + Unsplash placeholders (swap for Supabase Storage in Phase 2)
- Deploy target: **Vercel**

Phases 2–5 add Supabase (Auth, Postgres, RLS, Storage), cart/checkout with `MockProvider`, seller & admin dashboards, polish.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Environment variables

Copy `.env.example` → `.env.local`. Phase 1 runs without Supabase keys.

| Variable | Phase | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | 1+ | App origin (local or Vercel URL) |
| `NEXT_PUBLIC_SUPABASE_URL` | 2+ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 2+ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 2+ | Server-only; never expose to client |
| `PAYMENT_PROVIDER` | 2+ | `mock` for now |
| `NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT` | 4 | Default `15` |
| `NEXT_PUBLIC_DELIVERY_FEE_KWACHA` | 2+ | Flat Lusaka fee |
| `NEXT_PUBLIC_DELIVERY_CITY` | 2+ | `Lusaka` for MVP |

---

## Design system — “Apple meets glass, in blue”

| Token | Value |
|---|---|
| Navy | `#0A1A3F` |
| Primary | `#1E5EFF` |
| Sky | `#7FB2FF` |
| Ice | `#F5F8FF` |

- Glass panels: translucent fill, `backdrop-blur`, 1px light border, soft shadow
- Light + dark mode via `next-themes` (toggle in nav)
- Currency: Zambian Kwacha as **`K 450.00`** (`formatKwacha`)
- Phones: **`+260`** format (`formatPhoneZM`)

Reusable components live under `src/components/ui/` and `src/components/layout/`.

---

## Folder structure

```
src/
  app/                 # routes — home, shop, product, brands, sell, account
  components/
    ui/                # Button, GlassCard, GlassNav, ProductCard, PriceTag…
    home/ shop/ product/ layout/
  data/                # seed brands, categories, products (Phase 1)
  lib/                 # cn, format helpers
  types/               # shared domain types
tailwind.config.ts     # design tokens
.env.example
```

---

## Seed data (Phase 1)

- **10 brands** — e.g. Chitenge House, Mwape Studio, Copper & Cloth, Zambezi Atelier…
- **60 products** with variants (size × colour), stock, prices in Kwacha
- Regenerate products: `node scripts/generate-products.mjs`

---

## Roadmap

1. **Phase 1** — Design system + catalogue UI ← *you are here*
2. **Phase 2** — Supabase schema + RLS, auth, cart, wishlist, checkout + MockProvider
3. **Phase 3** — Seller dashboard (products, orders, earnings)
4. **Phase 4** — Admin (commission, payouts, moderation, analytics, reviews)
5. **Phase 5** — Performance, SEO, a11y, empty/error states, dark-mode QA

---

## License

Private — Tawanda Mazhandu / copr.
