"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SIZE_GUIDE_NOTE, SIZE_GUIDE_ROWS } from "@/lib/commerce/size-guide";
import { Button } from "@/components/ui/button";

export function SizeGuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        aria-label="Close size guide"
        className="absolute inset-0 bg-navy/45 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-3xl shadow-glass-lg"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 id="size-guide-title" className="text-lg font-semibold tracking-tight">
            Size guide
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-semibold">Size</th>
                <th className="pb-2 pr-3 font-semibold">Chest</th>
                <th className="pb-2 pr-3 font-semibold">Waist</th>
                <th className="pb-2 font-semibold">Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-border-subtle/60">
                  <td className="py-2.5 pr-3 font-medium">{row.size}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{row.chest} cm</td>
                  <td className="py-2.5 pr-3 tabular-nums">{row.waist} cm</td>
                  <td className="py-2.5 tabular-nums">{row.hip} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {SIZE_GUIDE_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}
