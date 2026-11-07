"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export function ShopToolbar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const sort = searchParams.get("sort") ?? "newest";
  const q = searchParams.get("q") ?? "";

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      className={`glass flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center sm:justify-between ${pending ? "opacity-80" : ""}`}
    >
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const value = String(form.get("q") ?? "");
          pushParams((p) => {
            if (value) p.set("q", value);
            else p.delete("q");
          });
        }}
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search brands, styles…"
          className="h-11 w-full rounded-full border border-transparent bg-white/50 pl-10 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/40 dark:bg-navy/40"
        />
      </form>

      <div className="flex items-center gap-2 px-1">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {resultCount} results
        </span>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) =>
            pushParams((p) => {
              p.set("sort", e.target.value);
            })
          }
          className="h-11 rounded-full border border-border-subtle bg-white/50 px-4 text-base outline-none focus:ring-2 focus:ring-primary/40 dark:bg-navy/40"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
    </div>
  );
}
