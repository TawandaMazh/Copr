# copr

Peer-to-peer marketplace for Zambia — **buy and sell anything**. Think Depop: people list clothes, gadgets, home finds, books, and more; shoppers buy in Kwacha with Lusaka delivery. Sellers keep their stock and fulfil orders; copr takes a commission (default **15%**, configurable in admin).

**Current focus:** Open listing (anyone can sell), broader categories, and discovery that feels like a marketplace feed.

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

## Sell anything

[/sell](http://localhost:3000/sell) → **Start selling** opens a shop immediately (no approval wait). List fashion, electronics, home, beauty, kids, sports, books, or other. Each listing has a **condition** (new / like new / good / fair).

---

## Admin

Open [/admin](http://localhost:3000/admin) → **Continue as demo admin**. Moderate shops, products, orders, payouts, disputes, reviews, and commission settings. Admins can still suspend shops.

---

## Connect Supabase

Live project: `koyosnsrparlhljvybok` · production: [copr-phi.vercel.app](https://copr-phi.vercel.app)

1. Copy `.env.example` → `.env.local` (URL + keys are documented in [`supabase/APPLY.md`](supabase/APPLY.md))
2. Schema, RLS, seed, and storage buckets are applied; finish Auth URLs + storage RLS via the checklist in `APPLY.md`
3. Apply newer migrations (including marketplace categories) if your project is behind
4. Auth → Email OTP (Phone optional for +260 SMS)

With keys set, the app loads **sellers/products/categories from Supabase** (falls back to local seed if the API is unreachable). Signed-in shoppers sync **cart, wishlist, addresses, and orders** to Supabase; guests stay on local zustand.

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

## License

Private — Tawanda Mazhandu / copr.
