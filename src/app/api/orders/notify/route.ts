import { NextResponse } from "next/server";
import { z } from "zod";
import {
  orderNotifyEmail,
  resendConfigured,
  sendResendEmail,
} from "@/lib/email/resend";
import {
  buyerOrderEmail,
  ownerOrderEmail,
  type OrderNotifyPayload,
} from "@/lib/email/order-notify";

const itemSchema = z.object({
  productName: z.string().min(1).max(160),
  brandName: z.string().min(1).max(120),
  size: z.string().min(1).max(40),
  colour: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(99),
  lineTotal: z.number().min(0).max(1_000_000),
});

const bodySchema = z.object({
  orderId: z.string().min(3).max(80),
  contactName: z.string().min(2).max(120),
  contactEmail: z.string().trim().email().max(160),
  contactPhone: z.string().min(7).max(40),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  deliveryArea: z.string().min(1).max(80),
  deliveryNeighbourhood: z.string().min(1).max(120),
  deliveryLandmark: z.string().max(160).optional(),
  expectedDeliveryLabel: z.string().max(120).optional(),
  subtotal: z.number().min(0).max(1_000_000),
  deliveryFee: z.number().min(0).max(100_000),
  total: z.number().min(0).max(1_000_000),
  notes: z.string().max(240).optional(),
  brands: z.array(z.string().max(120)).max(20),
  items: z.array(itemSchema).min(1).max(40),
});

/**
 * Emails the shopper an order confirmation and the marketplace owner a
 * new-order alert via Resend. Failures are returned but must not block
 * checkout — the client calls this fire-and-forget after placeOrder.
 */
export async function POST(request: Request) {
  if (!resendConfigured()) {
    return NextResponse.json(
      { ok: false, error: "email_unavailable" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const order = parsed.data as OrderNotifyPayload;
  const owner = orderNotifyEmail();
  const buyerMail = buyerOrderEmail(order);
  const ownerMail = ownerOrderEmail(order);

  const results = {
    buyer: false,
    owner: false,
  };

  const buyerSend = await sendResendEmail({
    to: order.contactEmail,
    subject: buyerMail.subject,
    html: buyerMail.html,
    replyTo: owner || undefined,
  });
  results.buyer = buyerSend.ok;

  if (owner) {
    const sameInbox =
      owner.toLowerCase() === order.contactEmail.trim().toLowerCase();
    if (!sameInbox || !results.buyer) {
      const ownerSend = await sendResendEmail({
        to: owner,
        subject: ownerMail.subject,
        html: ownerMail.html,
        replyTo: order.contactEmail,
      });
      results.owner = ownerSend.ok;
    } else {
      // Same address already got the confirmation; still send owner alert
      // so the inbox has the ops-oriented subject/body.
      const ownerSend = await sendResendEmail({
        to: owner,
        subject: ownerMail.subject,
        html: ownerMail.html,
      });
      results.owner = ownerSend.ok;
    }
  }

  if (!results.buyer && !results.owner) {
    return NextResponse.json(
      { ok: false, error: "Could not send order emails", results },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, results });
}
