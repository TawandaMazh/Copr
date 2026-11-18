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
import {
  PRODUCT_CONDITIONS,
  conditionLabel,
  productCondition,
} from "@/lib/commerce/conditions";
import { Plus, Trash2 } from "lucide-react";

const CATEGORY_LABELS: Record<(typeof categorySlugs)[number], string> = {
  dresses: "Dresses",
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  traditional: "Traditional",
  footwear: "Footwear",
  accessories: "Accessories",
  activewear: "Activewear",
  electronics: "Electronics",
  home: "Home",
  beauty: "Beauty",
  kids: "Kids",
  sports: "Sports",
  books: "Books",
  other: "Other",
};

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
          condition: productCondition(product),
          images: product.images.join("\n"),
          tags: product.tags
            .filter((t) => !t.startsWith("condition:"))
            .join(", "),
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
          categorySlug: "other",
          condition: "good",
          images: "",
          tags: "",
          isPublished: true,
          featured: false,
          variants: [
            { size: "One Size", colour: "Black", stock: 1, price: 100 },
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
          message: e instanceof Error ? e.message : "Check listing details",
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GlassCard className="grid gap-3 p-5 sm:grid-cols-2">
        <Field
          label="Title"
          error={form.formState.errors.name?.message}
          className="sm:col-span-2"
        >
          <input
            className="field"
            placeholder="What are you selling?"
            {...form.register("name")}
          />
        </Field>
        <Field
          label="Category"
          error={form.formState.errors.categorySlug?.message}
        >
          <select className="field" {...form.register("categorySlug")}>
            {categorySlugs.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Condition"
          error={form.formState.errors.condition?.message}
        >
          <select className="field" {...form.register("condition")}>
            {PRODUCT_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {conditionLabel(c)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags (comma-separated)" className="sm:col-span-2">
          <input
            className="field"
            placeholder="vintage, phone, weekend"
            {...form.register("tags")}
          />
        </Field>
        <Field
          label="Description"
          error={form.formState.errors.description?.message}
          className="sm:col-span-2"
        >
          <textarea
            className="field"
            rows={4}
            placeholder="Size, wear, what’s included…"
            {...form.register("description")}
          />
        </Field>
        <ImageUploadField
          className="sm:col-span-2"
          label="Photos (upload or paste URLs, one per line)"
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
          Listed on shop
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("featured")} />
          Featured
        </label>
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold tracking-tight">Price & options</h2>
            <p className="text-xs text-muted-foreground">
              Use One Size for non-fashion items. Stock 1 for unique pieces.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              append({ size: "One Size", colour: "Black", stock: 1, price: 100 })
            }
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add option
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
                aria-label="Remove option"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg" disabled={pending}>
          {product ? "Save listing" : "List item"}
        </Button>
        {product && (
          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this listing?")) {
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
