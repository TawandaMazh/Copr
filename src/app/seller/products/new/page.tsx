"use client";

import { ProductForm } from "@/components/seller/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">New product</h1>
        <p className="text-muted-foreground">
          Multiple images, sizes, colours, and stock per variant.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
