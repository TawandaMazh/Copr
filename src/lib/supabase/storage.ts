import { createClient } from "@/lib/supabase/client";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const BRAND_ASSETS_BUCKET = "brand-assets";

/** Public object URL for a storage path in this Supabase project. */
export function publicStorageUrl(
  bucket: string,
  path: string,
): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base || !path) return null;
  const clean = path.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${bucket}/${clean}`;
}

/**
 * Upload an image as the signed-in user.
 * Requires storage RLS from `supabase/migrations/20260322000004_storage.sql`.
 */
export async function uploadMarketplaceImage(opts: {
  bucket: typeof PRODUCT_IMAGES_BUCKET | typeof BRAND_ASSETS_BUCKET;
  path: string;
  file: File | Blob;
  contentType?: string;
}) {
  const supabase = createClient();
  if (!supabase) {
    return { error: new Error("Supabase is not configured"), path: null as string | null, publicUrl: null as string | null };
  }

  const { data, error } = await supabase.storage
    .from(opts.bucket)
    .upload(opts.path, opts.file, {
      upsert: true,
      contentType: opts.contentType ?? opts.file.type,
    });

  if (error) {
    return { error, path: null, publicUrl: null };
  }

  const publicUrl = publicStorageUrl(opts.bucket, data.path);
  return { error: null, path: data.path, publicUrl };
}
