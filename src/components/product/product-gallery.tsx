"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  brandName,
  colour,
}: {
  images: string[];
  name: string;
  brandName?: string;
  colour?: string;
}) {
  const [active, setActive] = useState(0);
  const altParts = [name];
  if (colour) altParts.push(`in ${colour}`);
  if (brandName) altParts.push(`by ${brandName}`);
  const mainAlt = altParts.join(" ");

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ice dark:bg-navy/40">
        <Image
          src={images[active] ?? images[0]}
          alt={mainAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl focus-ring",
                active === i
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
