-- Auto-confirm shipped sub-orders past marketplace auto_confirm_days.

create or replace function public.auto_confirm_due_sub_orders()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_days int;
  v_sub record;
  v_count int := 0;
  v_ids uuid[] := '{}';
  v_result jsonb;
begin
  select coalesce(auto_confirm_days, 3)
    into v_days
  from public.marketplace_settings
  order by updated_at desc nulls last
  limit 1;

  if v_days is null then
    v_days := 3;
  end if;

  for v_sub in
    select id
    from public.sub_orders
    where status in ('shipped', 'delivered')
      and shipped_at is not null
      and shipped_at <= now() - make_interval(days => v_days)
  loop
    begin
      -- Bypass buyer-only auth check: this function is service-role only.
      update public.sub_orders
      set
        status = 'completed',
        delivered_at = coalesce(delivered_at, now()),
        completed_at = now(),
        updated_at = now()
      where id = v_sub.id
        and status in ('shipped', 'delivered');

      insert into public.payouts (brand_id, sub_order_id, amount, commission_amount, status)
      select brand_id, id, seller_amount, commission_amount, 'pending'
      from public.sub_orders
      where id = v_sub.id
      on conflict (sub_order_id) do update
        set amount = excluded.amount,
            commission_amount = excluded.commission_amount;

      update public.orders o
      set
        status = case
          when (
            select bool_and(s.status in ('completed', 'cancelled', 'refunded'))
            from public.sub_orders s
            where s.order_id = o.id
          ) then 'completed'
          else 'delivered'
        end,
        updated_at = now()
      where o.id = (select order_id from public.sub_orders where id = v_sub.id);

      update public.payments p
      set status = 'released', released_at = coalesce(released_at, now()), updated_at = now()
      where p.order_id = (select order_id from public.sub_orders where id = v_sub.id)
        and p.status in ('pending', 'held')
        and (
          select bool_and(s.status in ('completed', 'cancelled', 'refunded'))
          from public.sub_orders s
          where s.order_id = p.order_id
        );

      v_count := v_count + 1;
      v_ids := array_append(v_ids, v_sub.id);
    exception when others then
      -- Continue with remaining rows
      null;
    end;
  end loop;

  return jsonb_build_object(
    'confirmed', v_count,
    'sub_order_ids', to_jsonb(v_ids),
    'days', v_days
  );
end;
$$;

revoke all on function public.auto_confirm_due_sub_orders() from public;
-- Callable only with service role (or postgres). Do not grant to authenticated.
