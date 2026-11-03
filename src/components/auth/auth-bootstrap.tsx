"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCommerceStore } from "@/stores/commerce-store";
import type { ShopperProfile } from "@/types/commerce";

async function profileFromUser(user: User): Promise<ShopperProfile> {
  let role: ShopperProfile["role"] = "shopper";
  let fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    user.phone ||
    "Shopper";

  const sb = createClient();
  if (sb) {
    const { data } = await sb
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (data?.role) role = data.role as ShopperProfile["role"];
    if (data?.full_name) fullName = data.full_name as string;
  }

  return {
    id: user.id,
    fullName,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    role,
    isDemo: false,
  };
}

/**
 * Keeps Zustand shopper state aligned with the Supabase auth session so
 * refresh / new tabs restore a real account instead of dropping to signed-out.
 */
export function AuthBootstrap() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;

    const sync = async (sessionUser: User | null) => {
      const store = useCommerceStore.getState();
      if (!sessionUser) {
        if (store.user && !store.user.isDemo) {
          store.setUserFromSupabase(null);
        }
        return;
      }
      const profile = await profileFromUser(sessionUser);
      if (cancelled) return;
      const current = useCommerceStore.getState().user;
      const needsHydrate =
        !current || current.isDemo || current.id !== profile.id;
      const changed =
        needsHydrate ||
        current.fullName !== profile.fullName ||
        current.role !== profile.role;
      if (changed) {
        useCommerceStore.getState().setUserFromSupabase(profile);
      }
      if (needsHydrate) {
        void useCommerceStore.getState().hydrateFromSupabase();
      }
    };

    void supabase.auth.getSession().then(({ data }) => {
      void sync(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void sync(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
