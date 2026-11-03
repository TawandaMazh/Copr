import { getSiteUrl } from "@/lib/site";

export type DisputeNotifyPayload = {
  disputeId: string;
  orderId: string;
  subOrderId: string;
  brandName: string;
  reason: string;
  notes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
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

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f8ff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0a1a3f">
  <div style="max-width:560px;margin:24px auto;padding:28px 24px;background:#ffffff;border-radius:20px;border:1px solid #e4ebf8">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#1e5eff;font-weight:700">copr</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${title}</h1>
    ${body}
  </div>
</body></html>`;
}

export function ownerDisputeEmail(payload: DisputeNotifyPayload) {
  const ref = payload.orderId.slice(-8).toUpperCase();
  const html = shell(
    `Problem reported · ${escapeHtml(ref)}`,
    `
    <p style="margin:0 0 16px;color:#5a6b8a;line-height:1.5">A shopper reported a problem with an order shipment.</p>
    <p style="margin:0 0 6px"><strong>Order</strong> ${escapeHtml(ref)}</p>
    <p style="margin:0 0 6px"><strong>Brand</strong> ${escapeHtml(payload.brandName)}</p>
    <p style="margin:0 0 6px"><strong>Reason</strong> ${escapeHtml(payload.reason)}</p>
    ${payload.notes ? `<p style="margin:0 0 6px"><strong>Details</strong> ${escapeHtml(payload.notes)}</p>` : ""}
    <p style="margin:0 0 6px"><strong>Buyer</strong> ${escapeHtml(payload.contactName)}</p>
    <p style="margin:0 0 6px"><strong>Email</strong> ${escapeHtml(payload.contactEmail)}</p>
    ${payload.contactPhone ? `<p style="margin:0 0 16px"><strong>Phone</strong> ${escapeHtml(payload.contactPhone)}</p>` : `<p style="margin:0 0 16px"></p>`}
    <p style="margin:0"><a href="${orderUrl(payload.orderId)}" style="display:inline-block;background:#1e5eff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">Open order</a></p>
    `,
  );
  return {
    subject: `Problem reported · ${ref} · ${payload.brandName}`,
    html,
  };
}

export function buyerDisputeAckEmail(payload: DisputeNotifyPayload) {
  const ref = payload.orderId.slice(-8).toUpperCase();
  const html = shell(
    `We’ve received your report`,
    `
    <p style="margin:0 0 16px;color:#5a6b8a;line-height:1.5">Thanks${payload.contactName ? `, ${escapeHtml(payload.contactName.split(" ")[0])}` : ""}. Our team has your note about <strong>${escapeHtml(payload.brandName)}</strong> and will follow up by email.</p>
    <p style="margin:0 0 6px"><strong>Order</strong> ${escapeHtml(ref)}</p>
    <p style="margin:0 0 6px"><strong>Reason</strong> ${escapeHtml(payload.reason)}</p>
    ${payload.notes ? `<p style="margin:0 0 16px"><strong>Your note</strong> ${escapeHtml(payload.notes)}</p>` : `<p style="margin:0 0 16px"></p>`}
    <p style="margin:0"><a href="${orderUrl(payload.orderId)}" style="display:inline-block;background:#1e5eff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">View order</a></p>
    `,
  );
  return {
    subject: `We received your report · ${ref} · copr`,
    html,
  };
}
