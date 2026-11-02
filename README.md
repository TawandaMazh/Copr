# copr

Multi-vendor fashion marketplace for **Zambian brands** and shoppers — think ASOS, built for Lusaka. Brands hold their own stock and fulfil orders; copr takes a commission (default **15%**).

**Current: Phase 3** — Seller dashboard (apply, brand profile, products, orders, earnings).

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** + tokens in `tailwind.config.ts` + `src/app/globals.css`
- **Supabase** — Postgres, Auth, Storage-ready, RLS on every table (`supabase/migrations/`)
- **Zod** + **React Hook Form** for auth, checkout, seller forms
- **PaymentProvider** + **MockProvider** escrow
- Framer Motion, lucide-react, next-themes, zustand (local commerce state)
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

## Seller dashboard (Phase 3)

1. Visit [/sell](http://localhost:3000/sell) → **Apply to join**, or open [/seller/apply](http://localhost:3000/seller/apply)
2. **Claim a demo brand** (e.g. Chitenge House) or submit a new application (auto-approved in demo)
3. Dashboard routes under `/seller`:
   - Overview — stats
   - **Products** — create/edit with images, sizes, colours, stock
   - **Orders** — processing → shipped → delivered
   - **Earnings** — escrow pending, available, payout records
   - **Brand profile** — logo, banner, story

Shopper confirms delivery on `/orders/[id]` → funds RELEASED → payout row created for the brand.

---

## Connect Supabase (optional)

See Phase 2 notes: set `NEXT_PUBLIC_SUPABASE_*`, run `supabase/migrations/*` in order, enable Email/Phone OTP.

---

## Environment variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_APP_URL` | App origin |
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
3. ~~Phase 3 — Seller dashboard~~ ← *you are here*
4. **Phase 4** — Admin (commission, payouts, moderation, analytics, reviews)
5. **Phase 5** — Performance, SEO, a11y polish

---

## License

Private — Tawanda Mazhandu / copr.
