import type { OrderRecord } from "@/types/commerce";

/** Fire-and-forget order emails (buyer confirmation + owner alert). */
export async function notifyOrderPlacedEmail(
  order: OrderRecord,
  contactEmail: string,
): Promise<void> {
  const email = contactEmail.trim();
  if (!email) return;

  const items = order.subOrders.flatMap((sub) =>
    sub.items.map((item) => ({
      productName: item.productName,
      brandName: item.brandName,
      size: item.size,
      colour: item.colour,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
  );

  try {
    await fetch("/api/orders/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        contactName: order.contactName ?? "Shopper",
        contactEmail: email,
        contactPhone: order.deliveryPhone,
        deliveryMethod: order.deliveryMethod,
        deliveryArea: order.deliveryArea,
        deliveryNeighbourhood: order.deliveryNeighbourhood,
        deliveryLandmark: order.deliveryLandmark,
        expectedDeliveryLabel: order.expectedDeliveryLabel,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        notes: order.notes,
        brands: order.subOrders.map((s) => s.brandName),
        items,
      }),
    });
  } catch (err) {
    console.error("notifyOrderPlacedEmail", err);
  }
}
