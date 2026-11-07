export type ResendSendInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function resendFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() || "copr <onboarding@resend.dev>"
  );
}

/** Marketplace owner inbox for new-order alerts. */
export function orderNotifyEmail() {
  return process.env.ORDER_NOTIFY_EMAIL?.trim() || "";
}

export async function sendResendEmail(
  input: ResendSendInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const recipients = to.map((e) => e.trim()).filter(Boolean);
  if (recipients.length === 0) {
    return { ok: false, error: "No recipients" };
  }

  const body: Record<string, unknown> = {
    from: resendFromAddress(),
    to: recipients,
    subject: input.subject,
    html: input.html,
  };
  if (input.replyTo) body.reply_to = input.replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("resend send failed", res.status, detail);
    return { ok: false, error: detail || `Resend HTTP ${res.status}` };
  }

  return { ok: true };
}
