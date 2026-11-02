# copr

Multi-vendor fashion marketplace for **Zambian brands** and shoppers — think ASOS, built for Lusaka. Brands hold their own stock and fulfil orders; copr takes a commission (default **15%**, configurable in admin).

**Current: Phase 5** — Performance, SEO, accessibility, empty/error states, dark-mode polish.

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** + tokens in `tailwind.config.ts` + `src/app/globals.css`
- **Supabase** — Postgres, Auth, Storage-ready, RLS on every table (`supabase/migrations/`)
- **Zod** + **React Hook Form** for auth, checkout, seller forms
- **PaymentProvider** + **MockProvider** escrow
- Framer Motion (respects `prefers-reduced-motion`), lucide-react, next-themes, zustand (`copr-commerce-v3`)
- Deploy target: **Vercel**

---

## Quick start (no Supabase required)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm run typecheck
```

---

## Phase 5 polish

- **SEO** — `sitemap.xml`, `robots.txt`, web manifest, richer Open Graph / Twitter metadata, Organization + WebSite + Product JSON-LD
- **Performance** — route `loading.tsx` skeletons, AVIF/WebP image sizes, font `display: swap`, reduced-motion for Framer Motion + CSS
- **Accessibility** — skip-to-content, `sr-only`, breadcrumb/`aria-*` fixes, cart Escape + body scroll lock, meaningful image alts
- **Empty / error** — shared `EmptyState`, polished `not-found`, `error.tsx` + `global-error.tsx`
- **Dark mode** — improved muted text contrast on navy glass

---

## Admin (Phase 4)

Open [/admin](http://localhost:3000/admin) → **Continue as demo admin**. Moderate brands, products, orders, payouts, disputes, reviews, and commission settings.

---

## Seller (Phase 3)

[/sell](http://localhost:3000/sell) → apply or claim a demo brand. New applications stay **pending** until admin approval.

---

## Connect Supabase

Live project: `koyosnsrparlhljvybok` · production: [copr-phi.vercel.app](https://copr-phi.vercel.app)

1. Copy `.env.example` → `.env.local` (URL + keys are documented in [`supabase/APPLY.md`](supabase/APPLY.md))
2. Schema, RLS, seed, and storage buckets are applied; finish Auth URLs + storage RLS via the checklist in `APPLY.md`
3. Auth → Email OTP (Phone optional for +260 SMS)

With keys set, the app loads **brands/products/categories from Supabase** (falls back to local seed if the API is unreachable). Signed-in shoppers sync **cart, wishlist, addresses, and orders** to Supabase; guests stay on local zustand.

---

## Environment variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical origin (sitemap / OG / JSON-LD) |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Optional until wired |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `PAYMENT_PROVIDER` | `mock` |
| `NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT` | Default `15` |
| `NEXT_PUBLIC_DELIVERY_FEE_KWACHA` | Default `50` |
| `NEXT_PUBLIC_DELIVERY_CITY` | `Lusaka` |

---

## Roadmap

1. ~~Phase 1 — Design system + catalogue~~
2. ~~Phase 2 — Schema/RLS, auth, cart, wishlist, MockProvider checkout~~
3. ~~Phase 3 — Seller dashboard~~
4. ~~Phase 4 — Admin (commission, payouts, moderation, analytics, reviews)~~
5. ~~Phase 5 — Performance, SEO, a11y, empty/error states, dark-mode QA~~ ← *you are here*

---

## License

Private — Tawanda Mazhandu / copr.
