"use client";

import { use } from "react";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { ProductForm } from "@/components/seller/product-form";
import { Button } from "@/components/ui/button";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = useCommerceStore((s) =>
    s.sellerProducts.find((p) => p.id === id),
  );

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Product not found</p>
        <Button asChild variant="secondary">
          <Link href="/seller/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
        <p className="text-muted-foreground">Edit details, variants, and stock.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
