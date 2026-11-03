import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Completes email magic-link / OTP redirect flows from Supabase Auth.
 * Without this, new accounts that click the email link never get a session cookie.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/account";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/account?error=${encodeURIComponent("auth_callback")}`,
  );
}
