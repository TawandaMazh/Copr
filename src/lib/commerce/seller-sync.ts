"use client";

import { createClient } from "@/lib/supabase/client";
import { dbIdFromAppId } from "@/lib/catalogue/mappers";
import { seedUuid } from "@/lib/supabase/seed-uuid";
import type { SellerBrand } from "@/types/seller";
import type { SellerProduct } from "@/stores/commerce-store";
import type { BrandApplicationStatus } from "@/types/seller";
import type { CategorySlug } from "@/types";

async function authedClient() {
  const sb = createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return { sb, userId: data.user.id };
}

function categoryDbId(slug: CategorySlug) {
  return seedUuid(`cat-${slug}`);
}

export async function ensureSellerProfileRole(fullName?: string) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;
  const { error } = await sb
    .from("profiles")
    .update({
      role: "seller",
      ...(fullName ? { full_name: fullName } : {}),
    })
    .eq("id", userId);
  if (error) console.error("ensureSellerProfileRole", error.message);
}

export async function persistBrandApplication(brand: SellerBrand) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;

  await ensureSellerProfileRole();

  const { error } = await sb.from("brands").upsert(
    {
      id: dbIdFromAppId(brand.id),
      owner_id: userId,
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline,
      story: brand.story,
      location: brand.location,
      logo_url: brand.logo,
      banner_url: brand.banner,
      featured: brand.featured,
      founded_year: brand.foundedYear,
      status: brand.status,
    },
    { onConflict: "id" },
  );
  if (error) console.error("persistBrandApplication", error.message);
}

export async function claimBrandInSupabase(brandAppId: string) {
  const ctx = await authedClient();
  if (!ctx) return false;
  const { sb, userId } = ctx;

  await ensureSellerProfileRole();

  const { data, error } = await sb
    .from("brands")
    .update({ owner_id: userId })
    .eq("id", dbIdFromAppId(brandAppId))
    .is("owner_id", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("claimBrand", error.message);
    return false;
  }
  return Boolean(data?.id);
}

export async function updateBrandInSupabase(brand: SellerBrand) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("brands")
    .update({
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline,
      story: brand.story,
      location: brand.location,
      logo_url: brand.logo,
      banner_url: brand.banner,
      founded_year: brand.foundedYear,
    })
    .eq("id", dbIdFromAppId(brand.id));
  if (error) console.error("updateBrand", error.message);
}

export async function upsertProductInSupabase(product: SellerProduct) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;

  const productId = dbIdFromAppId(product.id);
  const brandId = dbIdFromAppId(product.brandId);

  const { error: productErr } = await sb.from("products").upsert(
    {
      id: productId,
      brand_id: brandId,
      category_id: categoryDbId(product.categorySlug),
      name: product.name,
      slug: product.slug,
      description: product.description,
      tags: product.tags,
      featured: product.featured,
      trending: product.trending,
      is_new: product.isNew,
      rating: product.rating,
      review_count: product.reviewCount,
      is_published: product.isPublished,
    },
    { onConflict: "id" },
  );
  if (productErr) {
    console.error("upsertProduct", productErr.message);
    return;
  }

  await sb.from("product_images").delete().eq("product_id", productId);
  if (product.images.length > 0) {
    const imageRows = product.images.map((url, i) => ({
      id: dbIdFromAppId(`${product.id}-img-${i}`),
      product_id: productId,
      url,
      alt: product.name,
      sort_order: i,
    }));
    const { error: imgErr } = await sb.from("product_images").insert(imageRows);
    if (imgErr) console.error("upsertProductImages", imgErr.message);
  }

  await sb.from("product_variants").delete().eq("product_id", productId);
  if (product.variants.length > 0) {
    const variantRows = product.variants.map((v) => ({
      id: dbIdFromAppId(v.id),
      product_id: productId,
      size: v.size,
      colour: v.colour,
      stock: v.stock,
      price: v.price,
      sku: v.sku,
    }));
    const { error: varErr } = await sb
      .from("product_variants")
      .insert(variantRows);
    if (varErr) console.error("upsertProductVariants", varErr.message);
  }
}

export async function deleteProductInSupabase(productAppId: string) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("products")
    .delete()
    .eq("id", dbIdFromAppId(productAppId));
  if (error) console.error("deleteProduct", error.message);
}

export async function setBrandStatusInSupabase(
  brandAppId: string,
  status: BrandApplicationStatus,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("brands")
    .update({ status })
    .eq("id", dbIdFromAppId(brandAppId));
  if (error) console.error("setBrandStatus", error.message);
}

export async function moderateProductInSupabase(
  productAppId: string,
  patch: Partial<Pick<SellerProduct, "isPublished" | "featured">>,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("products")
    .update({
      ...(patch.isPublished !== undefined
        ? { is_published: patch.isPublished }
        : {}),
      ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
    })
    .eq("id", dbIdFromAppId(productAppId));
  if (error) console.error("moderateProduct", error.message);
}

export async function hydrateSellerFromSupabase(): Promise<{
  brand: SellerBrand | null;
  products: SellerProduct[];
} | null> {
  const ctx = await authedClient();
  if (!ctx) return null;
  const { sb, userId } = ctx;
  const { appIdFromUuid } = await import("@/lib/catalogue/mappers");

  const { data: brandRow, error: brandErr } = await sb
    .from("brands")
    .select(
      "id, name, slug, tagline, story, location, logo_url, banner_url, featured, founded_year, status, owner_id, updated_at",
    )
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (brandErr) {
    console.error("hydrateSellerBrand", brandErr.message);
    return null;
  }
  if (!brandRow) return { brand: null, products: [] };

  const brand: SellerBrand = {
    id: appIdFromUuid(brandRow.id as string),
    name: brandRow.name as string,
    slug: brandRow.slug as string,
    tagline: (brandRow.tagline as string) ?? "",
    story: (brandRow.story as string) ?? "",
    location: (brandRow.location as string) ?? "",
    logo: (brandRow.logo_url as string) ?? "",
    banner: (brandRow.banner_url as string) ?? "",
    featured: Boolean(brandRow.featured),
    foundedYear: (brandRow.founded_year as number) ?? new Date().getFullYear(),
    status: brandRow.status as BrandApplicationStatus,
    ownerId: userId,
    updatedAt: (brandRow.updated_at as string) ?? new Date().toISOString(),
  };

  const { data: productRows, error: productErr } = await sb
    .from("products")
    .select(
      `
      id, brand_id, name, slug, description, tags, featured, trending, is_new,
      rating, review_count, is_published, created_at,
      categories ( slug ),
      product_images ( url, sort_order ),
      product_variants ( id, size, colour, stock, price, sku )
    `,
    )
    .eq("brand_id", brandRow.id)
    .order("created_at", { ascending: false });

  if (productErr) {
    console.error("hydrateSellerProducts", productErr.message);
    return { brand, products: [] };
  }

  const products: SellerProduct[] = (productRows ?? []).map((row) => {
    const cat = row.categories as
      | { slug: string }
      | { slug: string }[]
      | null;
    const categorySlug = (
      Array.isArray(cat) ? cat[0]?.slug : cat?.slug
    ) as CategorySlug;
    const images = [...((row.product_images as { url: string; sort_order: number }[]) ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url);
    const variants = ((row.product_variants as Array<{
      id: string;
      size: string;
      colour: string;
      stock: number;
      price: number;
      sku: string;
    }>) ?? []).map((v) => ({
      id: appIdFromUuid(v.id),
      size: v.size as SellerProduct["variants"][number]["size"],
      colour: v.colour as SellerProduct["variants"][number]["colour"],
      stock: v.stock,
      price: Number(v.price),
      sku: v.sku,
    }));

    return {
      id: appIdFromUuid(row.id as string),
      brandId: brand.id,
      slug: row.slug as string,
      name: row.name as string,
      description: (row.description as string) ?? "",
      categorySlug: categorySlug ?? "dresses",
      images,
      variants,
      tags: (row.tags as string[]) ?? [],
      featured: Boolean(row.featured),
      trending: Boolean(row.trending),
      isNew: Boolean(row.is_new),
      rating: Number(row.rating ?? 0),
      reviewCount: Number(row.review_count ?? 0),
      createdAt: (row.created_at as string) ?? new Date().toISOString(),
      isPublished: Boolean(row.is_published),
    };
  });

  return { brand, products };
}
