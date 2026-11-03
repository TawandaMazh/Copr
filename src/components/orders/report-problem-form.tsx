"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useCommerceStore } from "@/stores/commerce-store";
import { notifyDisputeEmail } from "@/lib/commerce/notify-dispute-email";
import type { OrderRecord, SubOrderRecord } from "@/types/commerce";
import { cn } from "@/lib/utils";

const REASONS = [
  "Item not as described",
  "Wrong size or colour",
  "Damaged on arrival",
  "Late or missing delivery",
  "Other issue with this shipment",
] as const;

export function ReportProblemForm({
  order,
  sub,
}: {
  order: OrderRecord;
  sub: SubOrderRecord;
}) {
  const user = useCommerceStore((s) => s.user);
  const openDispute = useCommerceStore((s) => s.openDispute);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState(
    () => order.contactEmail ?? user?.email ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"emailed" | "fallback" | null>(null);
  const [mailtoFallback, setMailtoFallback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="space-y-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
        <p className="font-medium">
          {done === "emailed"
            ? "Thanks — we emailed support"
            : "Report saved — finish by email"}
        </p>
        <p className="text-muted-foreground">
          {done === "emailed"
            ? `You’ll also get a confirmation${email ? ` at ${email}` : ""}. We’ll follow up on this ${sub.brandName} shipment.`
            : `Your report is on the order. Tap below to open a ready-to-send email to support about ${sub.brandName}.`}
        </p>
        {mailtoFallback && (
          <a
            href={mailtoFallback}
            className="inline-block font-medium text-primary underline-offset-2 hover:underline"
          >
            Email support now
          </a>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        Report a problem
      </Button>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !trimmedEmail.includes("@")) {
        setError("Add an email so we can reach you and notify support.");
        return;
      }

      const dispute = openDispute({
        orderId: order.id,
        subOrderId: sub.id,
        reason,
        notes: notes.trim() || undefined,
      });
      if (!dispute) {
        setError("Couldn’t open this report. Sign in and try again.");
        return;
      }

      const result = await notifyDisputeEmail({
        dispute,
        order,
        contactName: order.contactName || user?.fullName || "Shopper",
        contactEmail: trimmedEmail,
        contactPhone: order.deliveryPhone || user?.phone,
      });

      if (!result.ok) {
        setMailtoFallback(result.mailtoFallback ?? null);
        setDone("fallback");
        return;
      }

      setDone("emailed");
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-border-subtle bg-background/60 p-4"
    >
      <div>
        <p className="text-sm font-semibold tracking-tight">Report a problem</p>
        <p className="text-xs text-muted-foreground">
          We’ll email copr support about {sub.brandName}.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What’s wrong?
        </span>
        <select
          className="field"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </span>
        <textarea
          className="field"
          rows={3}
          maxLength={500}
          placeholder="What happened? Order timing, photos, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your email
        </span>
        <input
          className="field"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
      </label>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Sending…" : "Send to support"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
      <p
        className={cn(
          "text-[11px] text-muted-foreground",
          mailtoFallback && "hidden",
        )}
      >
        Sends straight to the copr inbox — you’ll get a short confirmation too.
      </p>
    </form>
  );
}
