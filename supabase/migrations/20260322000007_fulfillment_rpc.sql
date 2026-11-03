-- Buyer/seller fulfilment helpers that need to touch admin-only payment/payout rows.

create unique index if not exists payouts_sub_order_id_uidx
  on public.payouts (sub_order_id);

create or replace function public.confirm_sub_order_delivery(p_sub_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.sub_orders%rowtype;
  v_order public.orders%rowtype;
  v_payout_id uuid;
  v_all_done boolean;
  v_now timestamptz := now();
begin
  select * into v_sub from public.sub_orders where id = p_sub_order_id;
  if not found then
    raise exception 'sub_order not found';
  end if;

  select * into v_order from public.orders where id = v_sub.order_id;

  if not (
    v_order.user_id = auth.uid()
    or public.is_admin()
    or public.owns_brand(v_sub.brand_id)
  ) then
    raise exception 'not allowed to confirm delivery';
  end if;

  if v_sub.status = 'completed' then
    select id into v_payout_id from public.payouts where sub_order_id = v_sub.id;
    return jsonb_build_object(
      'sub_order_id', v_sub.id,
      'payout_id', v_payout_id,
      'already_completed', true
    );
  end if;

  update public.sub_orders
  set
    status = 'completed',
    delivered_at = coalesce(delivered_at, v_now),
    completed_at = v_now,
    updated_at = v_now
  where id = v_sub.id;

  insert into public.payouts (brand_id, sub_order_id, amount, commission_amount, status)
  values (v_sub.brand_id, v_sub.id, v_sub.seller_amount, v_sub.commission_amount, 'pending')
  on conflict (sub_order_id) do update
    set amount = excluded.amount,
        commission_amount = excluded.commission_amount
  returning id into v_payout_id;

  select bool_and(status in ('completed', 'cancelled', 'refunded'))
    into v_all_done
  from public.sub_orders
  where order_id = v_order.id;

  if coalesce(v_all_done, false) then
    update public.orders
    set status = 'completed', updated_at = v_now
    where id = v_order.id;

    update public.payments
    set status = 'released', released_at = coalesce(released_at, v_now), updated_at = v_now
    where order_id = v_order.id
      and status in ('pending', 'held');
  else
    update public.orders
    set status = 'delivered', updated_at = v_now
    where id = v_order.id
      and status not in ('completed', 'cancelled', 'refunded');
  end if;

  return jsonb_build_object(
    'sub_order_id', v_sub.id,
    'payout_id', v_payout_id,
    'order_completed', coalesce(v_all_done, false)
  );
end;
$$;

revoke all on function public.confirm_sub_order_delivery(uuid) from public;
grant execute on function public.confirm_sub_order_delivery(uuid) to authenticated;

-- Sellers already update sub_orders via RLS; keep order header in sync when shipping.
create or replace function public.mark_sub_order_shipped(
  p_sub_order_id uuid,
  p_tracking_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.sub_orders%rowtype;
  v_now timestamptz := now();
begin
  select * into v_sub from public.sub_orders where id = p_sub_order_id;
  if not found then
    raise exception 'sub_order not found';
  end if;

  if not (public.owns_brand(v_sub.brand_id) or public.is_admin()) then
    raise exception 'not allowed to mark shipped';
  end if;

  update public.sub_orders
  set
    status = 'shipped',
    tracking_note = coalesce(p_tracking_note, tracking_note),
    shipped_at = coalesce(shipped_at, v_now),
    updated_at = v_now
  where id = v_sub.id;

  update public.orders
  set status = 'shipped', updated_at = v_now
  where id = v_sub.order_id
    and status in ('paid', 'processing', 'shipped');
end;
$$;

revoke all on function public.mark_sub_order_shipped(uuid, text) from public;
grant execute on function public.mark_sub_order_shipped(uuid, text) to authenticated;
