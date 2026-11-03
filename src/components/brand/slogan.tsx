import { cn } from "@/lib/utils";
import { SLOGANS, type SloganKey } from "@/data/slogans";

type SloganVariant = "eyebrow" | "quote" | "inline" | "hero-sub";

const variantClass: Record<SloganVariant, string> = {
  eyebrow:
    "text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-sky",
  quote:
    "text-base font-medium italic leading-relaxed tracking-tight text-foreground/90 sm:text-lg",
  inline: "text-sm leading-relaxed text-muted-foreground",
  "hero-sub": "text-sm font-medium tracking-wide text-white/70 sm:text-base",
};

export function Slogan({
  id,
  variant = "inline",
  className,
  as: Tag = "p",
}: {
  id: SloganKey;
  variant?: SloganVariant;
  className?: string;
  as?: "p" | "span" | "blockquote";
}) {
  return (
    <Tag className={cn(variantClass[variant], className)}>
      {variant === "quote" ? `“${SLOGANS[id]}”` : SLOGANS[id]}
    </Tag>
  );
}
