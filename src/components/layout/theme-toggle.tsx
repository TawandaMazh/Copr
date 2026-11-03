"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    value: "system",
    label: "Match system",
    hint: "Follow your device light/dark preset",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    hint: "Ice white glass",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    hint: "Navy night glass",
    icon: Moon,
  },
] as const;

type ThemeChoice = (typeof OPTIONS)[number]["value"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Theme" disabled>
        <Monitor className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    );
  }

  const current = (theme as ThemeChoice) || "system";
  const CurrentIcon =
    OPTIONS.find((o) => o.value === current)?.icon ?? Monitor;

  return (
    <div className="relative" ref={rootRef}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Theme: ${OPTIONS.find((o) => o.value === current)?.label}. Open theme options.`}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Theme"
        onClick={() => setOpen((v) => !v)}
      >
        <CurrentIcon className="h-4 w-4" strokeWidth={1.5} />
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="glass-strong absolute right-0 top-[calc(100%+0.4rem)] z-[80] w-56 overflow-hidden rounded-2xl p-1.5 shadow-glass-lg"
        >
          {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
            const active = current === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-foreground hover:bg-white/50 dark:hover:bg-navy/50",
                )}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium tracking-tight">
                    {label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {hint}
                  </span>
                </span>
                {active && (
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
