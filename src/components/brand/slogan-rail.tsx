import { SLOGAN_RAIL } from "@/data/slogans";
import { cn } from "@/lib/utils";

/** Continuous brand-voice strip — lots of slogans, one calm motion. */
export function SloganRail({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "soft" | "inverse";
}) {
  const loop = [...SLOGAN_RAIL, ...SLOGAN_RAIL];

  return (
    <div
      className={cn(
        "slogan-rail relative overflow-hidden border-y border-border-subtle",
        tone === "soft" && "bg-primary/[0.04]",
        tone === "inverse" &&
          "border-white/10 bg-navy/40 text-white backdrop-blur-sm",
        className,
      )}
      aria-hidden="true"
    >
      <div className="slogan-rail-track flex w-max gap-10 py-3.5 pr-10 sm:gap-14 sm:py-4">
        {loop.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className={cn(
              "shrink-0 text-sm font-medium tracking-tight sm:text-[0.95rem]",
              tone === "inverse"
                ? "text-white/80"
                : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "mr-10 sm:mr-14",
                tone === "inverse" ? "text-sky/80" : "text-primary/50",
              )}
            >
              ·
            </span>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
