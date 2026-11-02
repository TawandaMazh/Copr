"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandApplySchema,
  type BrandApplyValues,
} from "@/lib/validations/seller";
import { useCommerceStore } from "@/stores/commerce-store";
import { brands } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ImageUploadField } from "@/components/seller/image-upload-field";
import { BRAND_ASSETS_BUCKET } from "@/lib/supabase/storage";

export function ApplyForm() {
  const router = useRouter();
  const applyAsSeller = useCommerceStore((s) => s.applyAsSeller);
  const claimDemoBrand = useCommerceStore((s) => s.claimDemoBrand);
  const user = useCommerceStore((s) => s.user);
  const [pending, startTransition] = useTransition();

  const form = useForm<BrandApplyValues>({
    // Zod 4 + RHF resolver typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(brandApplySchema) as any,
    defaultValues: {
      fullName: user?.fullName ?? "",
      contactEmail: user?.email ?? "",
      contactPhone: user?.phone ?? "",
      name: "",
      tagline: "",
      story: "",
      location: "Lusaka",
      foundedYear: new Date().getFullYear(),
      logo: "",
      banner: "",
    },
  });

  const onSubmit = (values: BrandApplyValues) => {
    startTransition(() => {
      applyAsSeller(values);
      router.push("/seller");
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Apply to sell</h1>
        <p className="text-muted-foreground">
          New brands stay pending until an admin approves them. Claim a demo
          brand to edit live catalogue inventory right away.
        </p>
      </div>

      <GlassCard className="space-y-3 p-5">
        <p className="text-sm font-medium">Quick start — claim a demo brand</p>
        <div className="flex flex-wrap gap-2">
          {brands.slice(0, 4).map((b) => (
            <Button
              key={b.id}
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                startTransition(() => {
                  claimDemoBrand(b.id);
                  router.push("/seller");
                });
              }}
            >
              {b.name}
            </Button>
          ))}
        </div>
      </GlassCard>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GlassCard className="grid gap-3 p-5 sm:grid-cols-2">
          <Field label="Your name" error={form.formState.errors.fullName?.message}>
            <input className="field" {...form.register("fullName")} />
          </Field>
          <Field
            label="Contact email"
            error={form.formState.errors.contactEmail?.message}
          >
            <input className="field" type="email" {...form.register("contactEmail")} />
          </Field>
          <Field
            label="Phone (+260)"
            error={form.formState.errors.contactPhone?.message}
          >
            <input className="field" {...form.register("contactPhone")} />
          </Field>
          <Field
            label="Location"
            error={form.formState.errors.location?.message}
          >
            <input className="field" {...form.register("location")} />
          </Field>
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
            <textarea className="field" rows={4} {...form.register("story")} />
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
            label="Logo"
            bucket={BRAND_ASSETS_BUCKET}
            pathPrefix="brands/applications/logo"
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
            pathPrefix="brands/applications/banner"
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
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          Submit application
        </Button>
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
