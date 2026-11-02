"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  categorySlugs,
  colours,
  parseProductForm,
  productFormSchema,
  sizes,
  type ProductFormValues,
} from "@/lib/validations/seller";
import { useCommerceStore, type SellerProduct } from "@/stores/commerce-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ImageUploadField } from "@/components/seller/image-upload-field";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/storage";
import { Plus, Trash2 } from "lucide-react";

export function ProductForm({ product }: { product?: SellerProduct }) {
  const router = useRouter();
  const upsert = useCommerceStore((s) => s.upsertSellerProduct);
  const remove = useCommerceStore((s) => s.deleteSellerProduct);
  const [pending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          categorySlug: product.categorySlug,
          images: product.images.join("\n"),
          tags: product.tags.join(", "),
          isPublished: product.isPublished,
          featured: product.featured,
          variants: product.variants.map((v) => ({
            size: v.size,
            colour: v.colour,
            stock: v.stock,
            price: v.price,
          })),
        }
      : {
          name: "",
          description: "",
          categorySlug: "dresses",
          images: "",
          tags: "",
          isPublished: true,
          featured: false,
          variants: [
            { size: "M", colour: "Black", stock: 5, price: 450 },
          ],
        },
  });

  const { fields, append, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      try {
        const parsed = parseProductForm(values);
        const saved = upsert(parsed, product?.id);
        router.push(`/seller/products/${saved.id}`);
      } catch (e) {
        form.setError("images", {
          message: e instanceof Error ? e.message : "Check product details",
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GlassCard className="grid gap-3 p-5 sm:grid-cols-2">
        <Field
          label="Name"
          error={form.formState.errors.name?.message}
          className="sm:col-span-2"
        >
          <input className="field" {...form.register("name")} />
        </Field>
        <Field
          label="Category"
          error={form.formState.errors.categorySlug?.message}
        >
          <select className="field" {...form.register("categorySlug")}>
            {categorySlugs.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags (comma-separated)">
          <input
            className="field"
            placeholder="linen, weekend"
            {...form.register("tags")}
          />
        </Field>
        <Field
          label="Description"
          error={form.formState.errors.description?.message}
          className="sm:col-span-2"
        >
          <textarea className="field" rows={4} {...form.register("description")} />
        </Field>
        <ImageUploadField
          className="sm:col-span-2"
          label="Images (upload or paste URLs, one per line)"
          bucket={PRODUCT_IMAGES_BUCKET}
          pathPrefix={`products/${product?.id ?? "new"}`}
          multiline
          value={form.watch("images")}
          onChange={(next) =>
            form.setValue("images", next, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          error={
            typeof form.formState.errors.images?.message === "string"
              ? form.formState.errors.images.message
              : undefined
          }
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isPublished")} />
          Published on shop
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("featured")} />
          Featured
        </label>
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">Variants</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              append({ size: "M", colour: "Navy", stock: 3, price: 450 })
            }
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add variant
          </Button>
        </div>
        {form.formState.errors.variants?.message && (
          <p className="text-xs text-destructive">
            {form.formState.errors.variants.message}
          </p>
        )}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-2 rounded-2xl border border-border-subtle p-3 sm:grid-cols-[1fr_1fr_0.7fr_0.9fr_auto]"
            >
              <select className="field" {...form.register(`variants.${index}.size`)}>
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                className="field"
                {...form.register(`variants.${index}.colour`)}
              >
                {colours.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                className="field"
                type="number"
                placeholder="Stock"
                {...form.register(`variants.${index}.stock`, {
                  valueAsNumber: true,
                })}
              />
              <input
                className="field"
                type="number"
                step="0.01"
                placeholder="Price K"
                {...form.register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={fields.length === 1}
                onClick={() => removeVariant(index)}
                aria-label="Remove variant"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg" disabled={pending}>
          {product ? "Save product" : "Create product"}
        </Button>
        {product && (
          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this product?")) {
                remove(product.id);
                router.push("/seller/products");
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
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
