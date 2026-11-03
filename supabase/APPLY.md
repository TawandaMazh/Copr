# Apply copr schema to your Supabase project

The app talks to project `koyosnsrparlhljvybok` (eu-west-1).

**Status (Nov 2026):**

| Piece | Status |
|---|---|
| `schema` + `rls` + `seed` | Applied (8 categories, 10 brands, 60 products, 120 images, 719 variants) |
| Profile trigger `on_auth_user_created` | Applied |
| Storage buckets `product-images`, `brand-assets` | Created (public, 5 MB, jpeg/png/webp/avif) |
| Storage object RLS policies | Applied |
| Brand claim policy (`brands_claim_unowned`) | Applied |
| Reviews status + rating rollup trigger | Applied |
| Fulfilment RPCs (ship / confirm delivery + payout) | Applied |
| Order item `product_image` column | Applied |
| Auto-confirm due shipments RPC | Applied (`20260322000008_auto_confirm.sql`; cron `/api/cron/auto-confirm`) |
| Brand `is_verified` column | Pending — review `20260322000009_brand_verified.sql` before apply |
| Auth → Email provider | On |
| Auth → Phone / SMS | Off until Twilio (or another SMS provider) is configured |
| Auth URL Configuration | Set Site URL + redirects (see below) |
| Email Magic Link template | Include `{{ .Token }}` so the in-app 6-digit OTP works |
| Vercel env vars | Set on project `copr` (`NEXT_PUBLIC_APP_URL`, Supabase URL/keys, payment defaults) |

The Next app reads the catalogue from Supabase when env keys are set, and syncs
cart/wishlist/orders for authenticated users. Local seed remains the offline fallback.

---

## Auth URL Configuration (dashboard)

[Authentication → URL Configuration](https://supabase.com/dashboard/project/koyosnsrparlhljvybok/auth/url-configuration)

1. **Site URL:** `https://copr-phi.vercel.app`
2. **Redirect URLs:**
   - `https://copr-phi.vercel.app/**`
   - `https://copr-phi.vercel.app/auth/callback`
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
3. **Email Templates → Magic Link:** include `{{ .Token }}` in the body (the app verifies a 6-digit code via `verifyOtp`). Email links redirect to `/auth/callback`.

Phone OTP is optional: Auth → Providers → Phone + SMS provider credentials for +260.

---

## Re-apply / fresh project

### Option A — SQL Editor (no secret key)

1. Open [SQL Editor](https://supabase.com/dashboard/project/koyosnsrparlhljvybok/sql/new)
2. Paste and run, in order:
   - `migrations/20260322000001_schema.sql`
   - `migrations/20260322000002_rls.sql`
   - (optional) `migrations/20260322000003_seed.sql` — large seed for DB catalogue
   - `migrations/20260322000004_storage.sql` — buckets + storage RLS
   - `migrations/20260322000005_claim_brand.sql` — claim unowned brands
   - `migrations/20260322000006_reviews_status.sql` — review moderation + rating rollups
   - `migrations/20260322000007_fulfillment_rpc.sql` — ship / confirm delivery RPCs
   - `migrations/20260322000008_order_item_image.sql` — order line thumbnails
3. Confirm Auth → Providers → **Email** is on. Enable **Phone** only if you want +260 SMS.

### Option B — CLI (needs DB password or access token)

```bash
npx supabase link --project-ref koyosnsrparlhljvybok
npx supabase db push
```

Still run Auth URL Configuration in the dashboard (CLI `config.toml` does not push hosted Auth URLs by itself).

## Env vars (local `.env.local`, never commit)

```bash
NEXT_PUBLIC_APP_URL=https://copr-phi.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://koyosnsrparlhljvybok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable or legacy anon key>
# Optional, server-only — needed for admin scripts / service role:
# SUPABASE_SERVICE_ROLE_KEY=<secret or service_role key>
```

Publishable keys (`sb_publishable_…`) work as `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the current `@supabase/supabase-js`.
