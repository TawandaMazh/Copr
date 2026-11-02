"use client";

import { useRef, useState, useTransition } from "react";
import { Upload } from "lucide-react";
import {
  BRAND_ASSETS_BUCKET,
  PRODUCT_IMAGES_BUCKET,
  uploadMarketplaceImage,
} from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";

type Bucket = typeof PRODUCT_IMAGES_BUCKET | typeof BRAND_ASSETS_BUCKET;

export function ImageUploadField({
  label,
  value,
  onChange,
  error,
  bucket,
  pathPrefix,
  multiline,
  className,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
  bucket: Bucket;
  pathPrefix: string;
  multiline?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError(null);
    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files are supported");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Images must be under 5 MB");
          continue;
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${pathPrefix}/${Date.now()}-${safeName}`;
        const result = await uploadMarketplaceImage({
          bucket,
          path,
          file,
          contentType: file.type,
        });
        if (result.error || !result.publicUrl) {
          setUploadError(result.error?.message ?? "Upload failed");
          continue;
        }
        uploaded.push(result.publicUrl);
      }
      if (uploaded.length === 0) return;
      if (multiline) {
        const existing = value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        onChange([...existing, ...uploaded].join("\n"));
      } else {
        onChange(uploaded[0]);
      }
    });
  };

  return (
    <label className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="field"
          rows={3}
          placeholder="https://… or upload below"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="field"
          placeholder="https://… or upload below"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={Boolean(multiline)}
          className="sr-only"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!supabaseReady || pending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" strokeWidth={1.5} />
          {pending ? "Uploading…" : "Upload image"}
        </Button>
        {!supabaseReady && (
          <span className="text-xs text-muted-foreground">
            Paste a URL (Supabase upload unavailable offline)
          </span>
        )}
      </div>
      {(error || uploadError) && (
        <span className="block text-xs text-destructive">
          {error || uploadError}
        </span>
      )}
    </label>
  );
}
