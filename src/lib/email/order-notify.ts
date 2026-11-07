import { formatKwacha } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";

export type OrderNotifyItem = {
  productName: string;
  brandName: string;
  size: string;
  colour: string;
  quantity: number;
  lineTotal: number;
};

export type OrderNotifyPayload = {
  orderId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryArea: string;
  deliveryNeighbourhood: string;
  deliveryLandmark?: string;
  expectedDeliveryLabel?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  brands: string[];
  items: OrderNotifyItem[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function orderUrl(orderId: string) {
  return `${getSiteUrl()}/orders/${orderId}`;
}

function itemsTable(items: OrderNotifyItem[]) {
  const rows = items
    .map(
      (item) => `<tr>
  <td style="padding:8px 0;border-bottom:1px solid #e8eefc">${escapeHtml(item.productName)}<br/><span style="color:#6b7c9c;font-size:12px">${escapeHtml(item.brandName)} · ${escapeHtml(item.size)} · ${escapeHtml(item.colour)} × ${item.quantity}</span></td>
  <td style="padding:8px 0;border-bottom:1px solid #e8eefc;text-align:right;white-space:nowrap">${escapeHtml(formatKwacha(item.lineTotal))}</td>
</tr>`,
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>`;
}

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f8ff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0a1a3f">
  <div style="max-width:560px;margin:24px auto;padding:28px 24px;background:#ffffff;border-radius:20px;border:1px solid #e4ebf8">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#1e5eff;font-weight:700">copr</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${title}</h1>
    ${body}
    <p style="margin:28px 0 0;font-size:12px;color:#6b7c9c">I hope you’re happy with what you cop’d.</p>
  </div>
</body></html>`;
}

export function buyerOrderEmail(order: OrderNotifyPayload) {
  const deliveryLine =
    order.deliveryMethod === "pickup"
      ? `Pickup · ${escapeHtml(order.deliveryNeighbourhood)}, ${escapeHtml(order.deliveryArea)}`
      : `Delivery · ${escapeHtml(order.deliveryNeighbourhood)}, ${escapeHtml(order.deliveryArea)}${order.deliveryLandmark ? ` · ${escapeHtml(order.deliveryLandmark)}` : ""}`;

  const html = shell(
    `Thanks${order.contactName ? `, ${escapeHtml(order.contactName.split(" ")[0])}` : ""} — we’ve got your order`,
    `
    <p style="margin:0 0 16px;color:#5a6b8a;line-height:1.5">Payment secured. We’ll update you as each brand packs and ships.</p>
    <p style="margin:0 0 8px"><strong>Order</strong> ${escapeHtml(order.orderId.slice(-8).toUpperCase())}</p>
    ${order.expectedDeliveryLabel ? `<p style="margin:0 0 8px"><strong>Expected</strong> ${escapeHtml(order.expectedDeliveryLabel)}</p>` : ""}
    <p style="margin:0 0 16px"><strong>Where</strong> ${deliveryLine}</p>
    ${itemsTable(order.items)}
    <p style="margin:16px 0 4px;display:flex;justify-content:space-between"><span>Subtotal</span><span>${escapeHtml(formatKwacha(order.subtotal))}</span></p>
    <p style="margin:0 0 4px;display:flex;justify-content:space-between"><span>Delivery</span><span>${escapeHtml(formatKwacha(order.deliveryFee))}</span></p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;display:flex;justify-content:space-between"><span>Total</span><span>${escapeHtml(formatKwacha(order.total))}</span></p>
    <p style="margin:0"><a href="${orderUrl(order.orderId)}" style="display:inline-block;background:#1e5eff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">View order</a></p>
    `,
  );

  return {
    subject: `Order confirmed · ${order.orderId.slice(-8).toUpperCase()} · copr`,
    html,
  };
}

export function ownerOrderEmail(order: OrderNotifyPayload) {
  const brands = order.brands.length
    ? order.brands.map(escapeHtml).join(" · ")
    : "—";
  const html = shell(
    `New order · ${escapeHtml(order.orderId.slice(-8).toUpperCase())}`,
    `
    <p style="margin:0 0 16px;color:#5a6b8a;line-height:1.5">A shopper just placed an order on copr.</p>
    <p style="margin:0 0 6px"><strong>Buyer</strong> ${escapeHtml(order.contactName)}</p>
    <p style="margin:0 0 6px"><strong>Email</strong> ${escapeHtml(order.contactEmail)}</p>
    <p style="margin:0 0 6px"><strong>Phone</strong> ${escapeHtml(order.contactPhone)}</p>
    <p style="margin:0 0 6px"><strong>Brands</strong> ${brands}</p>
    <p style="margin:0 0 16px"><strong>${order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</strong> ${escapeHtml(order.deliveryNeighbourhood)}, ${escapeHtml(order.deliveryArea)}</p>
    ${order.notes ? `<p style="margin:0 0 16px"><strong>Notes</strong> ${escapeHtml(order.notes)}</p>` : ""}
    ${itemsTable(order.items)}
    <p style="margin:16px 0 20px;font-size:18px;font-weight:700">Total ${escapeHtml(formatKwacha(order.total))}</p>
    <p style="margin:0"><a href="${orderUrl(order.orderId)}" style="display:inline-block;background:#1e5eff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">Open order</a></p>
    `,
  );

  return {
    subject: `New copr order · ${formatKwacha(order.total)} · ${order.orderId.slice(-8).toUpperCase()}`,
    html,
  };
}
