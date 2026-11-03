import { createPublicClient } from "@/lib/supabase/public";
import { dbIdFromAppId } from "@/lib/catalogue/mappers";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ReviewSummary = { rating: number; count: number };

/** Server-safe published review average for a product. Returns null when none. */
export async function getPublishedReviewSummary(
  productAppId: string,
): Promise<ReviewSummary | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createPublicClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("reviews")
    .select("rating")
    .eq("product_id", dbIdFromAppId(productAppId))
    .eq("status", "published");

  if (error || !data || data.length === 0) return null;

  const count = data.length;
  const rating =
    data.reduce((sum, row) => sum + Number(row.rating ?? 0), 0) / count;
  return { rating, count };
}
