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
import { getSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Mode = "email" | "phone";
type Step = "identify" | "otp";

function toE164ZM(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("260")) return `+${digits}`;
  if (digits.startsWith("0")) return `+260${digits.slice(1)}`;
  return `+260${digits}`;
}

function normalizeOtp(token: string) {
  return token.replace(/\D/g, "").slice(0, 8);
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
    resolver: zodResolver(emailAuthSchema) as never,
    defaultValues: { email: "", fullName: "" },
  });
  const phoneForm = useForm<PhoneAuthValues>({
    resolver: zodResolver(phoneAuthSchema) as never,
    defaultValues: { phone: "", fullName: "" },
  });
  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema) as never,
    defaultValues: { token: "" },
  });

  const finishDemo = (fullName: string, email?: string, phone?: string) => {
    signInDemo({ fullName, email, phone });
    setMessage(
      "Signed in on this device only. Use email sign-in when available to sync across phones.",
    );
    onSuccess?.();
  };

  const ensureProfile = async (
    userId: string,
    fullName: string,
    email?: string | null,
    phone?: string | null,
  ) => {
    const supabase = createClient();
    if (!supabase) return;
    const { error: profileErr } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: fullName,
        email: email ?? null,
        phone: phone ?? null,
      },
      { onConflict: "id" },
    );
    if (profileErr) {
      // Trigger may have created the row; try update only.
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          email: email ?? null,
          phone: phone ?? null,
        })
        .eq("id", userId);
    }
  };

  const requestEmail = (values: EmailAuthValues) => {
    setError(null);
    startTransition(async () => {
      if (!supabaseReady) {
        finishDemo(values.fullName || values.email.split("@")[0], values.email);
        return;
      }

      const email = values.email.trim();
      const fullName = values.fullName.trim();

      // Prefer app-sent 6–8 digit codes when Resend is configured (free-tier
      // Supabase cannot edit the Magic Link template without custom SMTP).
      let sentCodeEmail = false;
      try {
        const res = await fetch("/api/auth/email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName }),
        });
        if (res.ok) {
          sentCodeEmail = true;
        } else if (res.status !== 503) {
          const payload = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          if (payload?.error && payload.error !== "otp_email_unavailable") {
            setError(payload.error);
            return;
          }
        }
      } catch {
        /* fall through to Supabase magic link */
      }

      if (!sentCodeEmail) {
        const supabase = createClient();
        if (!supabase) return;
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            data: { full_name: fullName },
            shouldCreateUser: true,
            emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
          },
        });
        if (err) {
          setError(
            err.message.includes("rate")
              ? "Too many codes sent. Wait a minute and try again."
              : err.message,
          );
          return;
        }
      }

      setPendingContact(email);
      setPendingName(fullName);
      setStep("otp");
      setMessage(
        sentCodeEmail
          ? "Check your email for a sign-in code (and spam). Codes expire quickly."
          : "Check your email (and spam). Open the Sign in link on this phone — it opens copr, not localhost.",
      );
      otpForm.reset({ token: "" });
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
          data: { full_name: values.fullName.trim() },
          shouldCreateUser: true,
        },
      });
      if (err) {
        setError(
          err.message.includes("sms") || err.message.includes("Phone")
            ? "Phone sign-in isn’t available yet. Use email instead."
            : err.message,
        );
        return;
      }
      setPendingContact(e164);
      setPendingName(values.fullName.trim());
      setStep("otp");
      setMessage("We sent an SMS code to your phone.");
      otpForm.reset({ token: "" });
    });
  };

  const resendCode = () => {
    setError(null);
    if (mode === "email") {
      const values = emailForm.getValues();
      if (!values.email) {
        setError("Enter your email again to resend.");
        setStep("identify");
        return;
      }
      requestEmail({
        email: pendingContact || values.email,
        fullName: pendingName || values.fullName || "Shopper",
      });
      return;
    }
    const values = phoneForm.getValues();
    requestPhone({
      phone: pendingContact || values.phone,
      fullName: pendingName || values.fullName || "Shopper",
    });
  };

  const verifyOtp = (values: OtpValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      if (!supabase) return;
      const token = normalizeOtp(values.token);
      if (token.length < 6) {
        setError("Enter the 6-digit code from your email.");
        return;
      }

      const attempts =
        mode === "email"
          ? ([
              { email: pendingContact, token, type: "email" as const },
              { email: pendingContact, token, type: "signup" as const },
              { email: pendingContact, token, type: "magiclink" as const },
            ] as const)
          : ([{ phone: pendingContact, token, type: "sms" as const }] as const);

      let user = null as Awaited<
        ReturnType<typeof supabase.auth.verifyOtp>
      >["data"]["user"];
      let lastError: string | null = null;

      for (const payload of attempts) {
        const { data, error: err } = await supabase.auth.verifyOtp(payload);
        if (!err && data.user) {
          user = data.user;
          break;
        }
        lastError = err?.message ?? lastError;
      }

      if (!user) {
        setError(
          lastError?.toLowerCase().includes("expired")
            ? "That code expired. Request a new one."
            : lastError?.toLowerCase().includes("token") ||
                lastError?.toLowerCase().includes("otp")
              ? "That code didn’t work. Check the digits and try again."
              : lastError || "Couldn’t verify the code.",
        );
        return;
      }

      const fullName =
        pendingName ||
        (user.user_metadata?.full_name as string | undefined) ||
        user.email?.split("@")[0] ||
        user.phone ||
        "Shopper";

      await ensureProfile(user.id, fullName, user.email, user.phone);

      let role: "shopper" | "seller" | "admin" = "shopper";
      try {
        const { fetchProfileRole } = await import(
          "@/lib/commerce/supabase-sync"
        );
        const dbRole = await fetchProfileRole(user.id);
        if (dbRole) role = dbRole;
      } catch {
        /* default shopper */
      }

      setUserFromSupabase({
        id: user.id,
        fullName,
        email: user.email,
        phone: user.phone,
        role,
        isDemo: false,
      });
      void useCommerceStore.getState().hydrateFromSupabase();
      setMessage("You're signed in.");
      onSuccess?.();
    });
  };

  return (
    <GlassCard className={cn("space-y-5", compact ? "p-5" : "p-6 sm:p-8")}>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          {supabaseReady ? "Create account or sign in" : "Sign in to copr"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {supabaseReady
            ? "Enter your name and email — we’ll send a one-time code. New shoppers are created automatically."
            : "Try the shop with a quick demo sign-in on this device."}
        </p>
      </div>

      {step === "identify" && (
        <>
          {!supabaseReady && (
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
          )}

          {supabaseReady || mode === "email" ? (
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
                  autoComplete="name"
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
                  autoComplete="email"
                  {...emailForm.register("email")}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={pending}>
                {supabaseReady
                  ? pending
                    ? "Sending…"
                    : "Email me a code"
                  : "Continue on this device"}
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
                  autoComplete="name"
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
                  autoComplete="tel"
                  {...phoneForm.register("phone")}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={pending}>
                Continue on this device
              </Button>
            </form>
          )}
        </>
      )}

      {step === "otp" && (
        <form className="space-y-3" onSubmit={otpForm.handleSubmit(verifyOtp)}>
          <p className="text-sm text-muted-foreground">
            Sent to <span className="text-foreground">{pendingContact}</span>
          </p>
          <Field
            label="One-time code"
            error={otpForm.formState.errors.token?.message}
          >
            <input
              className="field tracking-[0.3em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              {...otpForm.register("token")}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Verifying…" : "Verify & continue"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Got a “Sign in” link instead of digits? Open it on this phone — that
            finishes sign-in too.
          </p>
          <div className="flex flex-col gap-1 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={pending}
              onClick={resendCode}
            >
              Resend code
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("identify");
                setMessage(null);
                setError(null);
              }}
            >
              Use a different email
            </Button>
          </div>
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
