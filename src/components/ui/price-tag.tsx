import { formatKwacha } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  compareAt?: number;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl tracking-tight",
};

export function PriceTag({
  amount,
  className,
  size = "md",
  compareAt,
}: PriceTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 font-semibold text-foreground tabular-nums",
        sizeClasses[size],
        className,
      )}
    >
      <span>{formatKwacha(amount)}</span>
      {compareAt !== undefined && compareAt > amount && (
        <span className="text-sm font-normal text-muted-foreground line-through">
          {formatKwacha(compareAt)}
        </span>
      )}
    </span>
  );
}
