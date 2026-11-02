"use client";

import { createClient } from "@/lib/supabase/client";
import { appIdFromUuid, dbIdFromAppId } from "@/lib/catalogue/mappers";
import type { ReviewRecord, ReviewStatus } from "@/types/admin";

async function authedClient() {
  const sb = createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return { sb, userId: data.user.id };
}

type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  status: ReviewStatus;
  created_at: string;
  products?: { name: string } | { name: string }[] | null;
};

function mapReview(row: ReviewRow): ReviewRecord {
  const product = Array.isArray(row.products) ? row.products[0] : row.products;
  return {
    id: appIdFromUuid(row.id),
    productId: appIdFromUuid(row.product_id),
    productName: product?.name ?? "Product",
    userId: row.user_id,
    userName: row.user_name?.trim() || "Shopper",
    rating: row.rating,
    title: row.title ?? "",
    body: row.body ?? "",
    status: row.status ?? "published",
    createdAt: row.created_at,
  };
}

const REVIEW_SELECT = `
  id, product_id, user_id, user_name, rating, title, body, status, created_at,
  products ( name )
`;

export async function fetchPublishedReviewsForProduct(
  productAppId: string,
): Promise<ReviewRecord[] | null> {
  const sb = createClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("product_id", dbIdFromAppId(productAppId))
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchPublishedReviews", error.message);
    return null;
  }
  return ((data ?? []) as unknown as ReviewRow[]).map(mapReview);
}

export async function hydrateReviewsFromSupabase(): Promise<ReviewRecord[] | null> {
  const ctx = await authedClient();
  if (!ctx) return [];
  const { sb } = ctx;
  const { data, error } = await sb
    .from("reviews")
    .select(REVIEW_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("hydrateReviews", error.message);
    return null;
  }
  return ((data ?? []) as unknown as ReviewRow[]).map(mapReview);
}

export async function persistReviewToSupabase(review: ReviewRecord) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb, userId } = ctx;
  const { error } = await sb.from("reviews").upsert(
    {
      id: dbIdFromAppId(review.id),
      product_id: dbIdFromAppId(review.productId),
      user_id: userId,
      user_name: review.userName,
      rating: review.rating,
      title: review.title,
      body: review.body,
      status: review.status,
    },
    { onConflict: "product_id,user_id" },
  );
  if (error) console.error("persistReview", error.message);
}

export async function moderateReviewInSupabase(
  reviewAppId: string,
  status: ReviewStatus,
) {
  const ctx = await authedClient();
  if (!ctx) return;
  const { sb } = ctx;
  const { error } = await sb
    .from("reviews")
    .update({ status })
    .eq("id", dbIdFromAppId(reviewAppId));
  if (error) console.error("moderateReview", error.message);
}
