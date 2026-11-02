"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  emailAuthSchema,
  otpSchema,
  phoneAuthSchema,
  type EmailAuthValues,
  type OtpValues,
  type PhoneAuthValues,
} from "@/lib/validations/auth";
import { useCommerceStore } from "@/stores/commerce-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPhoneZM } from "@/lib/format";
import { cn } from "@/lib/utils";

type Mode = "email" | "phone";
type Step = "identify" | "otp";

function toE164ZM(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("260")) return `+${digits}`;
  if (digits.startsWith("0")) return `+260${digits.slice(1)}`;
  return `+260${digits}`;
}

export function AuthForm({
  onSuccess,
  compact,
}: {
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("email");
  const [step, setStep] = useState<Step>("identify");
  const [pendingContact, setPendingContact] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const signInDemo = useCommerceStore((s) => s.signInDemo);
  const setUserFromSupabase = useCommerceStore((s) => s.setUserFromSupabase);
  const supabaseReady = isSupabaseConfigured();

  const emailForm = useForm<EmailAuthValues>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues: { email: "", fullName: "" },
  });
  const phoneForm = useForm<PhoneAuthValues>({
    resolver: zodResolver(phoneAuthSchema),
    defaultValues: { phone: "", fullName: "" },
  });
  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
  });

  const finishDemo = (fullName: string, email?: string, phone?: string) => {
    signInDemo({ fullName, email, phone });
    setMessage("Signed in with local demo session (no Supabase keys).");
    onSuccess?.();
  };

  const requestEmail = (values: EmailAuthValues) => {
    setError(null);
    startTransition(async () => {
      if (!supabaseReady) {
        finishDemo(values.fullName || values.email.split("@")[0], values.email);
        return;
      }
      const supabase = createClient();
      if (!supabase) return;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          data: { full_name: values.fullName },
          shouldCreateUser: true,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setPendingContact(values.email);
      setPendingName(values.fullName || "");
      setStep("otp");
      setMessage("Check your email for a 6-digit code.");
    });
  };

  const requestPhone = (values: PhoneAuthValues) => {
    setError(null);
    startTransition(async () => {
      const e164 = toE164ZM(values.phone);
      if (!supabaseReady) {
        finishDemo(
          values.fullName || "Shopper",
          undefined,
          formatPhoneZM(values.phone),
        );
        return;
      }
      const supabase = createClient();
      if (!supabase) return;
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: {
          data: { full_name: values.fullName },
          shouldCreateUser: true,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setPendingContact(e164);
      setPendingName(values.fullName || "");
      setStep("otp");
      setMessage("We sent an SMS code to your phone.");
    });
  };

  const verifyOtp = (values: OtpValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      if (!supabase) return;
      const payload =
        mode === "email"
          ? { email: pendingContact, token: values.token, type: "email" as const }
          : { phone: pendingContact, token: values.token, type: "sms" as const };
      const { data, error: err } = await supabase.auth.verifyOtp(payload);
      if (err) {
        setError(err.message);
        return;
      }
      const u = data.user;
      if (u) {
        let role: "shopper" | "seller" | "admin" = "shopper";
        try {
          const { fetchProfileRole } = await import(
            "@/lib/commerce/supabase-sync"
          );
          const dbRole = await fetchProfileRole(u.id);
          if (dbRole) role = dbRole;
        } catch {
          /* profile may lag trigger; default shopper */
        }
        setUserFromSupabase({
          id: u.id,
          fullName:
            pendingName ||
            (u.user_metadata?.full_name as string) ||
            u.email ||
            u.phone ||
            "Shopper",
          email: u.email,
          phone: u.phone,
          role,
          isDemo: false,
        });
        // Hydrate cart/wishlist from Supabase in the background
        void import("@/stores/commerce-store").then(({ useCommerceStore }) => {
          useCommerceStore.getState().hydrateFromSupabase();
        });
      }
      setMessage("You're signed in.");
      onSuccess?.();
    });
  };

  return (
    <GlassCard className={cn("space-y-5", compact ? "p-5" : "p-6 sm:p-8")}>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Sign in to copr</h2>
        <p className="text-sm text-muted-foreground">
          {supabaseReady
            ? "Email OTP via Supabase (phone SMS not enabled on this project yet)"
            : "Email or phone OTP · demo mode (local) until Supabase is linked"}
        </p>
      </div>

      {step === "identify" && (
        <>
          <div className="flex gap-2 rounded-full glass p-1">
            {(["email", "phone"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  mode === m
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>
          {supabaseReady && mode === "phone" && (
            <p className="text-xs text-muted-foreground">
              Phone OTP needs SMS enabled in the Supabase dashboard (Auth →
              Providers → Phone). Prefer email for now.
            </p>
          )}

          {mode === "email" ? (
            <form
              className="space-y-3"
              onSubmit={emailForm.handleSubmit(requestEmail)}
            >
              <Field
                label="Full name"
                error={emailForm.formState.errors.fullName?.message}
              >
                <input
                  className="field"
                  placeholder="Thandi Phiri"
                  {...emailForm.register("fullName")}
                />
              </Field>
              <Field
                label="Email"
                error={emailForm.formState.errors.email?.message}
              >
                <input
                  className="field"
                  type="email"
                  placeholder="you@example.com"
                  {...emailForm.register("email")}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={pending}>
                {supabaseReady ? "Send code" : "Continue (demo)"}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-3"
              onSubmit={phoneForm.handleSubmit(requestPhone)}
            >
              <Field
                label="Full name"
                error={phoneForm.formState.errors.fullName?.message}
              >
                <input
                  className="field"
                  placeholder="Thandi Phiri"
                  {...phoneForm.register("fullName")}
                />
              </Field>
              <Field
                label="Phone (+260)"
                error={phoneForm.formState.errors.phone?.message}
              >
                <input
                  className="field"
                  placeholder="+260 97 123 4567"
                  inputMode="tel"
                  {...phoneForm.register("phone")}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={pending}>
                {supabaseReady ? "Send SMS code" : "Continue (demo)"}
              </Button>
            </form>
          )}
        </>
      )}

      {step === "otp" && (
        <form className="space-y-3" onSubmit={otpForm.handleSubmit(verifyOtp)}>
          <p className="text-sm text-muted-foreground">
            Code sent to <span className="text-foreground">{pendingContact}</span>
          </p>
          <Field label="One-time code" error={otpForm.formState.errors.token?.message}>
            <input
              className="field tracking-[0.3em]"
              inputMode="numeric"
              placeholder="••••••"
              {...otpForm.register("token")}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={pending}>
            Verify & sign in
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep("identify");
              setMessage(null);
            }}
          >
            Back
          </Button>
        </form>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {message && !error && (
        <p className="text-sm text-primary dark:text-sky">{message}</p>
      )}
    </GlassCard>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
