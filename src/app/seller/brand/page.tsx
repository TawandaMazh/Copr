"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandProfileSchema,
  type BrandProfileValues,
} from "@/lib/validations/seller";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/seller/image-upload-field";
import { BRAND_ASSETS_BUCKET } from "@/lib/supabase/storage";

export default function SellerBrandPage() {
  const brand = useCommerceStore((s) => s.sellerBrand);
  const updateSellerBrand = useCommerceStore((s) => s.updateSellerBrand);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const form = useForm<BrandProfileValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(brandProfileSchema) as any,
    defaultValues: brand
      ? {
          name: brand.name,
          tagline: brand.tagline,
          story: brand.story,
          location: brand.location,
          foundedYear: brand.foundedYear,
          logo: brand.logo,
          banner: brand.banner,
          contactEmail: brand.contactEmail ?? "",
          contactPhone: brand.contactPhone ?? "",
        }
      : undefined,
  });

  if (!brand) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Brand profile</h1>
        <p className="text-muted-foreground">
          Logo, banner, and story shown on your public brand page.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => {
          startTransition(() => {
            updateSellerBrand(values);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          });
        })}
      >
        <GlassCard className="grid gap-3 p-5 sm:grid-cols-2">
          <Field
            label="Brand name"
            error={form.formState.errors.name?.message}
            className="sm:col-span-2"
          >
            <input className="field" {...form.register("name")} />
          </Field>
          <Field
            label="Tagline"
            error={form.formState.errors.tagline?.message}
            className="sm:col-span-2"
          >
            <input className="field" {...form.register("tagline")} />
          </Field>
          <Field
            label="Story"
            error={form.formState.errors.story?.message}
            className="sm:col-span-2"
          >
            <textarea className="field" rows={5} {...form.register("story")} />
          </Field>
          <Field
            label="Location"
            error={form.formState.errors.location?.message}
          >
            <input className="field" {...form.register("location")} />
          </Field>
          <Field
            label="Founded year"
            error={form.formState.errors.foundedYear?.message}
          >
            <input
              className="field"
              type="number"
              {...form.register("foundedYear", { valueAsNumber: true })}
            />
          </Field>
          <ImageUploadField
            className="sm:col-span-2"
            label="Logo"
            bucket={BRAND_ASSETS_BUCKET}
            pathPrefix={`brands/${brand.id}/logo`}
            value={form.watch("logo")}
            onChange={(next) =>
              form.setValue("logo", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={form.formState.errors.logo?.message}
          />
          <ImageUploadField
            className="sm:col-span-2"
            label="Banner"
            bucket={BRAND_ASSETS_BUCKET}
            pathPrefix={`brands/${brand.id}/banner`}
            value={form.watch("banner")}
            onChange={(next) =>
              form.setValue("banner", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={form.formState.errors.banner?.message}
          />
        </GlassCard>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            Save profile
          </Button>
          {saved && (
            <span className="text-sm text-primary dark:text-sky">Saved</span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
