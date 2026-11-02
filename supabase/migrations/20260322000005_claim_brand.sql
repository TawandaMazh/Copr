-- Allow authenticated shoppers to claim an unowned brand (demo / onboarding).
-- Existing row must have owner_id IS NULL; updated row must set owner_id = auth.uid().

drop policy if exists "brands_claim_unowned" on public.brands;

create policy "brands_claim_unowned"
  on public.brands for update
  using (owner_id is null)
  with check (owner_id = auth.uid());
