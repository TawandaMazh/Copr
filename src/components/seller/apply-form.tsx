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
      tagline: "Buying & selling on copr",
      story: "I list clothes, gadgets, and finds from around Lusaka.",
      location: "Lusaka",
      foundedYear: new Date().getFullYear(),
      logo: "",
      banner: "",
    },
  });

  const onSubmit = (values: BrandApplyValues) => {
    startTransition(() => {
      applyAsSeller(values);
      router.push("/seller/products/new");
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Start selling
        </h1>
        <p className="text-muted-foreground">
          Create your shop in a minute — list clothes, electronics, homeware,
          or anything else. You go live straight away.
        </p>
      </div>

      <GlassCard className="space-y-3 p-5">
        <p className="text-sm font-medium">
          Trying the dashboard? Claim a sample shop
        </p>
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
            label="Shop name"
            error={form.formState.errors.name?.message}
            className="sm:col-span-2"
          >
            <input
              className="field"
              placeholder="e.g. Thandiwe’s closet"
              {...form.register("name")}
            />
          </Field>
          <Field
            label="Short bio"
            error={form.formState.errors.tagline?.message}
            className="sm:col-span-2"
          >
            <input
              className="field"
              placeholder="What do you usually sell?"
              {...form.register("tagline")}
            />
          </Field>
          <Field
            label="About your shop"
            error={form.formState.errors.story?.message}
            className="sm:col-span-2"
          >
            <textarea className="field" rows={3} {...form.register("story")} />
          </Field>
          <input type="hidden" {...form.register("foundedYear", { valueAsNumber: true })} />
          <ImageUploadField
            label="Profile photo (optional)"
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
            label="Cover photo (optional)"
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
          Create shop & list an item
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
