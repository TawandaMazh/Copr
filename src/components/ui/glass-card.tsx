import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  hover?: boolean;
}

export function GlassCard({
  className,
  strong = false,
  hover = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl",
        hover &&
          "transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
