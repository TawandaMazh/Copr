import { z } from "zod";
import type { CategorySlug, ProductColour, ProductSize } from "@/types";

const categorySlugs = [
  "dresses",
  "tops",
  "bottoms",
  "outerwear",
  "traditional",
  "footwear",
  "accessories",
  "activewear",
] as const satisfies readonly CategorySlug[];

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
] as const satisfies readonly ProductSize[];

const colours = [
  "Black",
  "White",
  "Navy",
  "Blue",
  "Sky",
  "Cream",
  "Brown",
  "Olive",
  "Red",
  "Gold",
  "Grey",
  "Pink",
  "Chitenge Print",
] as const satisfies readonly ProductColour[];

export const brandApplySchema = z.object({
  name: z.string().trim().min(2, "Brand name required").max(60),
  tagline: z.string().trim().min(4, "Add a short tagline").max(80),
  story: z.string().trim().min(20, "Tell a bit more of your story").max(800),
  location: z.string().trim().min(2, "Location required").max(60),
  foundedYear: z.number().int().min(1980).max(new Date().getFullYear()),
  logo: z.union([
    z.literal(""),
    z.string().url("Logo must be an image URL"),
  ]),
  banner: z.union([
    z.literal(""),
    z.string().url("Banner must be an image URL"),
  ]),
  contactEmail: z.string().trim().email("Valid email required"),
  contactPhone: z.string().trim().min(9, "Phone required"),
  fullName: z.string().trim().min(2, "Your name required"),
});

export const brandProfileSchema = z.object({
  name: z.string().trim().min(2).max(60),
  tagline: z.string().trim().min(4).max(80),
  story: z.string().trim().min(20).max(800),
  location: z.string().trim().min(2).max(60),
  foundedYear: z.number().int().min(1980).max(new Date().getFullYear()),
  logo: z.union([z.literal(""), z.string().url()]),
  banner: z.union([z.literal(""), z.string().url()]),
  contactEmail: z.union([z.literal(""), z.string().email()]).optional(),
  contactPhone: z.string().trim().optional(),
});

export const productVariantSchema = z.object({
  size: z.enum(sizes),
  colour: z.enum(colours),
  stock: z.number().int().min(0),
  price: z.number().min(1, "Price must be at least K 1"),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Product name required").max(80),
  description: z.string().trim().min(20, "Add a richer description").max(1000),
  categorySlug: z.enum(categorySlugs),
  images: z.string().trim().min(1, "Add at least one image URL"),
  tags: z.string().trim().optional(),
  variants: z.array(productVariantSchema).min(1, "Add at least one variant"),
  isPublished: z.boolean(),
  featured: z.boolean(),
});

export type BrandApplyValues = z.infer<typeof brandApplySchema>;
export type BrandProfileValues = z.infer<typeof brandProfileSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductFormParsed = Omit<ProductFormValues, "images" | "tags"> & {
  images: string[];
  tags: string[];
};

export function parseProductForm(values: ProductFormValues): ProductFormParsed {
  const images = values.images
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (images.length === 0) {
    throw new Error("Add at least one image URL");
  }
  for (const url of images) {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch {
      throw new Error(`Invalid image URL: ${url}`);
    }
  }
  const tags = (values.tags ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    ...values,
    images,
    tags,
  };
}

export { categorySlugs, sizes, colours };
