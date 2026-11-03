import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2).max(120),
});

/**
 * Issues a passwordless email OTP via admin.generateLink and emails the
 * 6–8 digit code with Resend when RESEND_API_KEY is set.
 *
 * Needed on Supabase free tier: the hosted Magic Link template cannot be
 * edited without custom SMTP, so the default email is link-only.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid name and email" }, { status: 400 });
  }

  const { email, fullName } = parsed.data;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "otp_email_unavailable", fallback: "magiclink" },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }

  const redirectTo = `${getSiteUrl()}/auth/callback?next=/account`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo,
      data: { full_name: fullName },
    },
  });

  if (error || !data?.properties?.email_otp) {
    return NextResponse.json(
      { error: error?.message || "Could not create a sign-in code" },
      { status: 502 },
    );
  }

  const otp = data.properties.email_otp;
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "copr <onboarding@resend.dev>";

  const sendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `${otp} is your copr sign-in code`,
      html: `<h2>Your copr sign-in code</h2>
<p>Enter this code on the sign-in screen:</p>
<p style="font-size:28px;letter-spacing:0.25em;font-weight:700">${otp}</p>
<p style="color:#666;font-size:14px">This code expires shortly. If you didn’t request it, ignore this email.</p>`,
    }),
  });

  if (!sendRes.ok) {
    const detail = await sendRes.text();
    console.error("resend email-otp failed", sendRes.status, detail);
    return NextResponse.json(
      { error: "Could not send the email code. Try again in a minute." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
