import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <GlassCard
      className={cn("space-y-4 px-6 py-14 text-center", className)}
      role="status"
    >
      <p className="text-lg font-medium tracking-tight">{title}</p>
      <p className="mx-auto max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Button asChild className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </GlassCard>
  );
}
