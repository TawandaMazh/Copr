import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./config";

type ProfileRole = "shopper" | "seller" | "admin";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const needsAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const needsSeller =
    (pathname === "/seller" || pathname.startsWith("/seller/")) &&
    pathname !== "/seller/apply" &&
    !pathname.startsWith("/seller/apply/");

  if (!isSupabaseConfigured()) {
    // Demo / offline: client shells still gate roles; allow through.
    return supabaseResponse;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!needsAdmin && !needsSeller) {
    return supabaseResponse;
  }

  if (!user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/account";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as ProfileRole | undefined) ?? "shopper";

  if (needsAdmin && role !== "admin") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/account";
    redirect.searchParams.set("error", "admin_required");
    return NextResponse.redirect(redirect);
  }

  if (needsSeller && role !== "seller" && role !== "admin") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/seller/apply";
    return NextResponse.redirect(redirect);
  }

  return supabaseResponse;
}
