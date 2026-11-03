"use client";

import { useState } from "react";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const user = useCommerceStore((s) => s.user);
  const settings = useCommerceStore((s) => s.settings);
  const updateSettings = useCommerceStore((s) => s.updateSettings);

  const [commissionPercent, setCommissionPercent] = useState(
    settings.commissionPercent,
  );
  const [deliveryFeeKwacha, setDeliveryFeeKwacha] = useState(
    settings.deliveryFeeKwacha,
  );
  const [deliveryCity, setDeliveryCity] = useState(settings.deliveryCity);
  const [autoConfirmDays, setAutoConfirmDays] = useState(
    settings.autoConfirmDays,
  );
  const [saved, setSaved] = useState(false);

  if (!user || user.role !== "admin") return null;

  const save = () => {
    updateSettings({
      commissionPercent: Number(commissionPercent),
      deliveryFeeKwacha: Number(deliveryFeeKwacha),
      deliveryCity: deliveryCity.trim() || "Lusaka",
      autoConfirmDays: Number(autoConfirmDays),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Marketplace commission, delivery fee, and auto-confirm window.
          {user.isDemo
            ? " Demo admin saves stay on this device."
            : " Saves update the live marketplace settings."}
        </p>
      </div>

      <GlassCard className="mx-auto max-w-lg space-y-4 p-6">
        <Field
          label="Commission %"
          hint="Taken from each brand’s order subtotal at checkout."
        >
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={commissionPercent}
            onChange={(e) => setCommissionPercent(Number(e.target.value))}
            className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
          />
        </Field>

        <Field
          label="Delivery fee (K)"
          hint="Flat Lusaka delivery fee when method is delivery."
        >
          <input
            type="number"
            min={0}
            step={1}
            value={deliveryFeeKwacha}
            onChange={(e) => setDeliveryFeeKwacha(Number(e.target.value))}
            className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
          />
        </Field>

        <Field label="Delivery city">
          <input
            type="text"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
          />
        </Field>

        <Field
          label="Auto-confirm days"
          hint="Days after a parcel is marked delivered before payment auto-releases to the brand."
        >
          <input
            type="number"
            min={1}
            max={30}
            value={autoConfirmDays}
            onChange={(e) => setAutoConfirmDays(Number(e.target.value))}
            className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
          />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save}>Save settings</Button>
          {saved && (
            <p className="text-sm text-primary dark:text-sky">Saved</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Last updated{" "}
          {new Date(settings.updatedAt).toLocaleString("en-ZM", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </GlassCard>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
