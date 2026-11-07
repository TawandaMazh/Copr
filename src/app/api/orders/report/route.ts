import { NextResponse } from "next/server";
import { z } from "zod";
import {
  orderNotifyEmail,
  resendConfigured,
  sendResendEmail,
} from "@/lib/email/resend";
import {
  buyerDisputeAckEmail,
  ownerDisputeEmail,
  type DisputeNotifyPayload,
} from "@/lib/email/dispute-notify";

const bodySchema = z.object({
  disputeId: z.string().min(3).max(80),
  orderId: z.string().min(3).max(80),
  subOrderId: z.string().min(3).max(80),
  brandName: z.string().min(1).max(120),
  reason: z.string().min(4).max(200),
  notes: z.string().max(500).optional(),
  contactName: z.string().min(2).max(120),
  contactEmail: z.string().trim().email().max(160),
  contactPhone: z.string().max(40).optional(),
});

/**
 * Emails the marketplace owner when a shopper taps “Report a problem”,
 * and sends the shopper a short acknowledgement.
 */
export async function POST(request: Request) {
  if (!resendConfigured()) {
    return NextResponse.json(
      { ok: false, error: "email_unavailable" },
      { status: 503 },
    );
  }

  const owner = orderNotifyEmail();
  if (!owner) {
    return NextResponse.json(
      { ok: false, error: "ORDER_NOTIFY_EMAIL is not set" },
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
    return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
  }

  const payload = parsed.data as DisputeNotifyPayload;
  const ownerMail = ownerDisputeEmail(payload);
  const buyerMail = buyerDisputeAckEmail(payload);

  const ownerSend = await sendResendEmail({
    to: owner,
    subject: ownerMail.subject,
    html: ownerMail.html,
    replyTo: payload.contactEmail,
  });

  let buyer = false;
  if (
    payload.contactEmail.trim().toLowerCase() !== owner.toLowerCase()
  ) {
    const buyerSend = await sendResendEmail({
      to: payload.contactEmail,
      subject: buyerMail.subject,
      html: buyerMail.html,
      replyTo: owner,
    });
    buyer = buyerSend.ok;
  }

  if (!ownerSend.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not email support",
        results: { owner: false, buyer },
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    results: { owner: true, buyer },
  });
}
