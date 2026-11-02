# Apply copr schema to your Supabase project

The app talks to project `koyosnsrparlhljvybok`. Catalogue/checkout still use local demo data; **auth + future tables** need these migrations.

## Option A — SQL Editor (no secret key)

1. Open [SQL Editor](https://supabase.com/dashboard/project/koyosnsrparlhljvybok/sql/new)
2. Paste and run, in order:
   - `migrations/20260322000001_schema.sql`
   - `migrations/20260322000002_rls.sql`
   - (optional) `migrations/20260322000003_seed.sql` — large seed for DB catalogue
3. Confirm Auth → Providers → **Email** is on (already is). Enable **Phone** only if you want +260 SMS.

## Option B — CLI (needs DB password or access token)

```bash
npx supabase link --project-ref koyosnsrparlhljvybok
npx supabase db push
```

## Env vars (local `.env.local`, never commit)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://koyosnsrparlhljvybok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable or legacy anon key>
# Optional, server-only — needed for admin scripts / service role:
# SUPABASE_SERVICE_ROLE_KEY=<secret or service_role key>
```

Publishable keys (`sb_publishable_…`) work as `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the current `@supabase/supabase-js`.
