import { getBrandById, getProductById, getMinPrice } from "@/data";
import {
  DEFAULT_COMMISSION_PERCENT,
  DELIVERY_FEE_KWACHA,
  PICKUP_POINTS,
} from "@/lib/commerce/constants";
import { getPaymentProvider } from "@/lib/payments";
import type { CartLine } from "@/types/commerce";
import type {
  DeliveryMethod,
  OrderRecord,
  PaymentRecord,
  SubOrderRecord,
} from "@/types/commerce";
import type { CheckoutFormValues } from "@/lib/validations/checkout";
import type { Brand, Product } from "@/types";

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

type ProductResolver = (id: string) => Product | undefined;
type BrandResolver = (id: string) => Brand | undefined;

export function resolveCartTotals(
  lines: CartLine[],
  deliveryMethod: DeliveryMethod,
  productResolver: ProductResolver = getProductById,
  brandResolver: BrandResolver = getBrandById,
) {
  type EnrichedLine = CartLine & {
    product: Product;
    variant: Product["variants"][number];
    brand: Brand | undefined;
    unitPrice: number;
    lineTotal: number;
  };

  const enriched: EnrichedLine[] = [];
  for (const line of lines) {
    const product = productResolver(line.productId);
    if (!product) continue;
    const variant =
      product.variants.find((v) => v.id === line.variantId) ??
      product.variants[0];
    if (!variant) continue;
    enriched.push({
      ...line,
      product,
      variant,
      brand: brandResolver(product.brandId),
      unitPrice: variant.price,
      lineTotal: variant.price * line.quantity,
    });
  }

  const subtotal = enriched.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee =
    deliveryMethod === "delivery" && enriched.length > 0
      ? DELIVERY_FEE_KWACHA
      : 0;

  return {
    lines: enriched,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export async function placeOrder(input: {
  userId: string;
  lines: CartLine[];
  form: CheckoutFormValues;
  productResolver?: ProductResolver;
  brandResolver?: BrandResolver;
  commissionPercent?: number;
  deliveryFeeOverride?: number;
}): Promise<OrderRecord> {
  const productResolver = input.productResolver ?? getProductById;
  const brandResolver = input.brandResolver ?? getBrandById;
  const commissionPercent =
    input.commissionPercent ?? DEFAULT_COMMISSION_PERCENT;

  const totals = resolveCartTotals(
    input.lines,
    input.form.deliveryMethod,
    productResolver,
    brandResolver,
  );
  const lines = totals.lines;
  const subtotal = totals.subtotal;
  const deliveryFee =
    input.deliveryFeeOverride !== undefined
      ? input.form.deliveryMethod === "delivery" && lines.length > 0
        ? input.deliveryFeeOverride
        : 0
      : totals.deliveryFee;
  const total = subtotal + deliveryFee;

  if (lines.length === 0) {
    throw new Error("Your bag is empty");
  }

  let deliveryArea = input.form.area ?? "";
  let deliveryNeighbourhood = input.form.neighbourhood ?? "";
  let deliveryLandmark = input.form.landmark;
  const deliveryPhone = input.form.phone;

  if (input.form.deliveryMethod === "pickup") {
    const point = PICKUP_POINTS.find((p) => p.id === input.form.pickupPointId);
    if (!point) throw new Error("Invalid pickup point");
    deliveryArea = point.area;
    deliveryNeighbourhood = point.neighbourhood;
    deliveryLandmark = point.landmark;
  }

  const orderId = id("ord");
  const now = new Date().toISOString();

  const byBrand = new Map<string, typeof lines>();
  for (const line of lines) {
    const brandId = line.product.brandId;
    const bucket = byBrand.get(brandId) ?? [];
    bucket.push(line);
    byBrand.set(brandId, bucket);
  }

  const subOrders: SubOrderRecord[] = [];
  for (const [brandId, brandLines] of byBrand) {
    const brandSubtotal = brandLines.reduce((s, l) => s + l.lineTotal, 0);
    const commissionAmount = Number(
      ((brandSubtotal * commissionPercent) / 100).toFixed(2),
    );
    const sellerAmount = Number((brandSubtotal - commissionAmount).toFixed(2));
    const brand = brandResolver(brandId);

    subOrders.push({
      id: id("sub"),
      brandId,
      brandName: brand?.name ?? "Brand",
      status: "paid",
      subtotal: brandSubtotal,
      commissionPercent,
      commissionAmount,
      sellerAmount,
      items: brandLines.map((l) => ({
        productId: l.product.id,
        variantId: l.variant.id,
        brandId,
        productName: l.product.name,
        productImage: l.product.images[0] ?? "",
        brandName: brand?.name ?? "Brand",
        size: l.variant.size,
        colour: l.variant.colour,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
    });
  }

  const provider = getPaymentProvider();
  const paymentResult = await provider.createPayment({
    orderId,
    amount: total,
    currency: "ZMW",
    customerPhone: deliveryPhone,
    metadata: { deliveryMethod: input.form.deliveryMethod },
  });

  if (!paymentResult.success) {
    throw new Error(paymentResult.message ?? "Payment failed");
  }

  const payment: PaymentRecord = {
    id: id("pay"),
    provider: paymentResult.provider,
    providerRef: paymentResult.providerRef,
    amount: total,
    status: "held",
    heldAt: now,
  };

  return {
    id: orderId,
    userId: input.userId,
    status: "paid",
    deliveryMethod: input.form.deliveryMethod,
    deliveryArea,
    deliveryNeighbourhood,
    deliveryLandmark,
    deliveryPhone,
    subtotal,
    deliveryFee,
    total,
    notes: input.form.notes,
    paidAt: now,
    createdAt: now,
    updatedAt: now,
    subOrders,
    payment,
  };
}

export function cartLineUnitPrice(
  productId: string,
  variantId: string,
  productResolver: ProductResolver = getProductById,
) {
  const product = productResolver(productId);
  if (!product) return 0;
  const variant = product.variants.find((v) => v.id === variantId);
  return variant?.price ?? getMinPrice(product);
}
