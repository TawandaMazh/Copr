"use client";

import { createClient } from "@/lib/supabase/client";
import { appIdFromUuid } from "@/lib/catalogue/mappers";
import type { MarketplaceSettings } from "@/types/admin";
import type { SellerBrand, BrandApplicationStatus } from "@/types/seller";

async function authedClient() {
  const sb = createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return { sb, userId: data.user.id };
}

export async function hydrateSettingsFromSupabase(): Promise<MarketplaceSettings | null> {
  const sb = createClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("marketplace_settings")
    .select(
      "commission_percent, delivery_fee_kwacha, delivery_city, auto_confirm_days, updated_at",
    )
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("hydrateSettings", error.message);
    return null;
  }
  return {
    commissionPercent: Number(data.commission_percent),
    deliveryFeeKwacha: Number(data.delivery_fee_kwacha),
    deliveryCity: data.delivery_city as string,
    autoConfirmDays: Number(data.auto_confirm_days),
    updatedAt: (data.updated_at as string) ?? new Date().toISOString(),
  };
}

export async function persistSettingsToSupabase(
  settings: MarketplaceSettings,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("marketplace_settings")
    .update({
      commission_percent: settings.commissionPercent,
      delivery_fee_kwacha: settings.deliveryFeeKwacha,
      delivery_city: settings.deliveryCity,
      auto_confirm_days: settings.autoConfirmDays,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) console.error("persistSettings", error.message);
}

export async function hydratePlatformBrandsFromSupabase(): Promise<
  SellerBrand[] | null
> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb, userId } = ctx;

  // Admins see all statuses; others only see approved (RLS) plus their own.
  const { data, error } = await sb
    .from("brands")
    .select(
      "id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status, owner_id, updated_at",
    )
    .order("name");
  if (error) {
    console.error("hydratePlatformBrands", error.message);
    return null;
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: appIdFromUuid(row.id as string),
    name: row.name as string,
    slug: row.slug as string,
    tagline: (row.tagline as string) ?? "",
    story: (row.story as string) ?? "",
    location: (row.location as string) ?? "",
    logo: (row.logo_url as string) ?? "",
    banner: (row.banner_url as string) ?? "",
    featured: Boolean(row.featured),
    foundedYear: (row.founded_year as number) ?? new Date().getFullYear(),
    status: row.status as BrandApplicationStatus,
    ownerId: (row.owner_id as string) ?? userId,
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
  }));
}
