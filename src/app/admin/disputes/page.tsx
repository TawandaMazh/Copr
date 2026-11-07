"use client";

import { useState } from "react";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DisputeStatus } from "@/types/admin";

export default function AdminDisputesPage() {
  const user = useCommerceStore((s) => s.user);
  const disputes = useCommerceStore((s) => s.disputes);
  const resolveDispute = useCommerceStore((s) => s.resolveDispute);

  if (!user || user.role !== "admin") return null;

  const open = disputes.filter(
    (d) => d.status === "open" || d.status === "under_review",
  );
  const closed = disputes.filter(
    (d) => d.status !== "open" && d.status !== "under_review",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Disputes</h1>
        <p className="text-muted-foreground">
          Review buyer/admin disputes and resolve for buyer or seller.
        </p>
      </div>

      {disputes.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No disputes. Open one from Admin → Orders or from an order detail
          page.
        </GlassCard>
      ) : (
        <>
          {open.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Open ({open.length})
              </h2>
              {open.map((d) => (
                <DisputeCard
                  key={d.id}
                  dispute={d}
                  onResolve={resolveDispute}
                />
              ))}
            </section>
          )}
          {closed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Resolved</h2>
              {closed.map((d) => (
                <DisputeCard
                  key={d.id}
                  dispute={d}
                  onResolve={resolveDispute}
                  readonly
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function DisputeCard({
  dispute,
  onResolve,
  readonly,
}: {
  dispute: {
    id: string;
    orderId: string;
    brandName: string;
    reason: string;
    notes?: string;
    status: DisputeStatus;
    resolution?: string;
    createdAt: string;
  };
  onResolve: (
    id: string,
    status: Extract<
      DisputeStatus,
      "resolved_buyer" | "resolved_seller" | "closed" | "under_review"
    >,
    resolution: string,
  ) => void;
  readonly?: boolean;
}) {
  const [note, setNote] = useState("");

  return (
    <GlassCard className="space-y-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold tracking-tight">{dispute.brandName}</p>
          <p className="text-sm text-muted-foreground">{dispute.reason}</p>
          {dispute.notes && (
            <p className="text-xs text-muted-foreground">{dispute.notes}</p>
          )}
        </div>
        <Badge variant="outline" className="capitalize">
          {dispute.status.replaceAll("_", " ")}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {new Date(dispute.createdAt).toLocaleString("en-ZM", {
          dateStyle: "medium",
          timeStyle: "short",
        })}{" "}
        ·{" "}
        <Link
          href={`/orders/${dispute.orderId}`}
          className="text-primary hover:underline"
        >
          {dispute.orderId.slice(0, 16)}…
        </Link>
      </p>
      {dispute.resolution && (
        <p className="text-sm">Resolution: {dispute.resolution}</p>
      )}
      {!readonly && (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Resolution note"
            rows={2}
            className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
          />
          <div className="flex flex-wrap gap-2">
            {dispute.status === "open" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  onResolve(
                    dispute.id,
                    "under_review",
                    note || "Moved to review",
                  )
                }
              >
                Under review
              </Button>
            )}
            <Button
              size="sm"
              onClick={() =>
                onResolve(
                  dispute.id,
                  "resolved_buyer",
                  note || "Refunded in favour of buyer",
                )
              }
            >
              Resolve · buyer
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onResolve(
                  dispute.id,
                  "resolved_seller",
                  note || "Closed in favour of seller",
                )
              }
            >
              Resolve · seller
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                onResolve(dispute.id, "closed", note || "Closed without award")
              }
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
