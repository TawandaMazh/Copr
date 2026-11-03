import type { OrderRecord } from "@/types/commerce";
import type { DisputeRecord } from "@/types/admin";

export async function notifyDisputeEmail(input: {
  dispute: DisputeRecord;
  order: OrderRecord;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}): Promise<{ ok: boolean; mailtoFallback?: string }> {
  const email = input.contactEmail.trim();
  if (!email) return { ok: false };

  try {
    const res = await fetch("/api/orders/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disputeId: input.dispute.id,
        orderId: input.dispute.orderId,
        subOrderId: input.dispute.subOrderId,
        brandName: input.dispute.brandName,
        reason: input.dispute.reason,
        notes: input.dispute.notes,
        contactName: input.contactName,
        contactEmail: email,
        contactPhone: input.contactPhone,
      }),
    });
    if (res.ok) return { ok: true };
  } catch (err) {
    console.error("notifyDisputeEmail", err);
  }

  const support =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "mazhandut@icloud.com";
  const ref = input.order.id.slice(-8).toUpperCase();
  const subject = encodeURIComponent(
    `Problem reported · ${ref} · ${input.dispute.brandName}`,
  );
  const body = encodeURIComponent(
    [
      `Order: ${ref}`,
      `Brand: ${input.dispute.brandName}`,
      `Reason: ${input.dispute.reason}`,
      input.dispute.notes ? `Details: ${input.dispute.notes}` : "",
      `Buyer: ${input.contactName}`,
      `Email: ${email}`,
      input.contactPhone ? `Phone: ${input.contactPhone}` : "",
      "",
      `Order link: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    ok: false,
    mailtoFallback: `mailto:${support}?subject=${subject}&body=${body}`,
  };
}
